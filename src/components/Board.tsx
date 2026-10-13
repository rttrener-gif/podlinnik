import { useRef, useState } from 'react';
import { ALL_DOCS, DOC_BY_ID, PEOPLE, PEOPLE_BY_ID } from '../content';
import { useGame } from '../game/store';
import { KIND_LABEL, Modal, useNav } from './common';

const NODE_W = 190;
const NODE_H = 78;
const CANVAS_W = 2200;
const CANVAS_H = 1500;

function nodeInfo(id: string, pins: { id: string; text: string; docId: string }[]) {
  const [kind, ref] = [id.slice(0, id.indexOf(':')), id.slice(id.indexOf(':') + 1)];
  if (kind === 'doc') {
    const d = DOC_BY_ID[ref];
    return { type: 'doc', title: d?.title ?? ref, sub: d ? KIND_LABEL[d.kind] : '', ref };
  }
  if (kind === 'person') {
    const p = PEOPLE_BY_ID[ref];
    return { type: 'person', title: p?.name ?? ref, sub: p?.role ?? '', ref };
  }
  const pin = pins.find((p) => p.id === ref);
  return { type: 'fact', title: pin ? (pin.text.length > 110 ? pin.text.slice(0, 108) + '…' : pin.text) : 'Факт', sub: 'отмеченный факт', ref };
}

export function Board() {
  const { state, boardAdd, boardRemove, boardMove, linkAdd, linkDel, has } = useGame();
  const { openDoc, openPerson } = useNav();
  const [picker, setPicker] = useState(false);
  const [linkMode, setLinkMode] = useState(false);
  const [from, setFrom] = useState<string | null>(null);
  const [pending, setPending] = useState<{ a: string; b: string } | null>(null);
  const [label, setLabel] = useState('');
  const [local, setLocal] = useState<Record<string, { x: number; y: number }>>({});
  const dragRef = useRef<{ id: string; sx: number; sy: number; ox: number; oy: number; moved: boolean } | null>(null);

  const ids = Object.keys(state.board);
  const pos = (id: string) => local[id] ?? state.board[id];

  const onDown = (e: React.PointerEvent, id: string) => {
    if ((e.target as HTMLElement).closest('button')) return;
    const p = pos(id);
    dragRef.current = { id, sx: e.clientX, sy: e.clientY, ox: p.x, oy: p.y, moved: false };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onMove = (e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d) return;
    const dx = e.clientX - d.sx;
    const dy = e.clientY - d.sy;
    if (Math.abs(dx) + Math.abs(dy) > 3) d.moved = true;
    if (d.moved && !linkMode) {
      setLocal((l) => ({
        ...l,
        [d.id]: {
          x: Math.max(0, Math.min(CANVAS_W - NODE_W, d.ox + dx)),
          y: Math.max(0, Math.min(CANVAS_H - NODE_H, d.oy + dy)),
        },
      }));
    }
  };
  const onUp = (id: string) => {
    const d = dragRef.current;
    dragRef.current = null;
    if (!d) return;
    if (linkMode && !d.moved) {
      if (!from) setFrom(id);
      else if (from !== id) {
        setPending({ a: from, b: id });
        setLabel('');
        setFrom(null);
      }
      return;
    }
    const l = local[id];
    if (l) {
      boardMove(id, l.x, l.y);
      setLocal((s) => {
        const n = { ...s };
        delete n[id];
        return n;
      });
    }
  };

  const center = (id: string) => {
    const p = pos(id);
    return { x: p.x + NODE_W / 2, y: p.y + NODE_H / 2 };
  };

  return (
    <div className="board-page">
      <div className="board-bar">
        <div>
          <h2>Доска расследования</h2>
          <div className="sub">Раскладывайте материалы, людей и факты. Включите «Связать», чтобы соединять карточки подписанными нитями.</div>
        </div>
        <div className="row wrap">
          <button className="btn" onClick={() => setPicker(true)}>
            + Добавить на доску
          </button>
          <button
            className={'btn ' + (linkMode ? 'primary' : '')}
            onClick={() => {
              setLinkMode((v) => !v);
              setFrom(null);
            }}
          >
            {linkMode ? (from ? 'Выберите вторую карточку…' : 'Связать: выберите первую') : 'Связать карточки'}
          </button>
        </div>
      </div>

      <div className="board-scroll">
        <div className="board-canvas" style={{ width: CANVAS_W, height: CANVAS_H }}>
          <svg className="board-lines" width={CANVAS_W} height={CANVAS_H}>
            {state.links.map((l) => {
              if (!state.board[l.a] || !state.board[l.b]) return null;
              const a = center(l.a);
              const b = center(l.b);
              const mx = (a.x + b.x) / 2;
              const my = (a.y + b.y) / 2;
              const w = Math.max(40, l.label.length * 7 + 28);
              return (
                <g key={l.id}>
                  <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} className="thread" />
                  <g transform={`translate(${mx},${my})`} className="thread-label" onClick={() => linkDel(l.id)}>
                    <rect x={-w / 2} y={-12} width={w} height={24} rx={4} />
                    <text textAnchor="middle" y={4}>
                      {l.label || 'связь'} ×
                    </text>
                  </g>
                </g>
              );
            })}
          </svg>
          {ids.map((id) => {
            const info = nodeInfo(id, state.pins);
            const p = pos(id);
            return (
              <div
                key={id}
                className={'node n-' + info.type + (from === id ? ' picked' : '') + (linkMode ? ' linkable' : '')}
                style={{ left: p.x, top: p.y, width: NODE_W, minHeight: NODE_H }}
                onPointerDown={(e) => onDown(e, id)}
                onPointerMove={onMove}
                onPointerUp={() => onUp(id)}
              >
                <span className="node-pin" />
                <div className="node-sub">{info.sub}</div>
                <div className="node-title">{info.title}</div>
                <div className="node-actions">
                  {info.type === 'doc' && (
                    <button onClick={() => openDoc(info.ref)}>открыть</button>
                  )}
                  {info.type === 'person' && <button onClick={() => openPerson(info.ref)}>досье</button>}
                  <button onClick={() => boardRemove(id)}>убрать</button>
                </div>
              </div>
            );
          })}
          {ids.length === 0 && (
            <div className="board-empty">
              Доска пуста. Нажмите «Добавить на доску» или используйте кнопку «Положить на доску» в материалах и досье.
            </div>
          )}
        </div>
      </div>

      {pending && (
        <Modal title="Подпишите связь" onClose={() => setPending(null)}>
          <p className="muted">
            {nodeInfo(pending.a, state.pins).title} → {nodeInfo(pending.b, state.pins).title}
          </p>
          <input
            className="inp"
            autoFocus
            placeholder="Например: противоречит, подтверждает, то же время…"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                linkAdd(pending.a, pending.b, label.trim());
                setPending(null);
              }
            }}
          />
          <div className="row end">
            <button className="btn ghost" onClick={() => setPending(null)}>
              Отмена
            </button>
            <button
              className="btn primary"
              onClick={() => {
                linkAdd(pending.a, pending.b, label.trim());
                setPending(null);
              }}
            >
              Связать
            </button>
          </div>
        </Modal>
      )}

      {picker && <BoardPicker onClose={() => setPicker(false)} onToggle={(id) => (state.board[id] ? boardRemove(id) : boardAdd(id))} has={has} />}
    </div>
  );
}

function BoardPicker({ onClose, onToggle, has }: { onClose: () => void; onToggle: (id: string) => void; has: (d: string) => boolean }) {
  const { state } = useGame();
  const [tab, setTab] = useState<'docs' | 'people' | 'facts'>('docs');
  const docs = ALL_DOCS.filter((d) => has(d.id));
  const people = PEOPLE.filter((p) => p.id !== 'elena' || has('elena-1'));
  return (
    <Modal title="Что положить на доску" onClose={onClose} wide>
      <nav className="tabs">
        <button className={tab === 'docs' ? 'on' : ''} onClick={() => setTab('docs')}>
          Материалы
        </button>
        <button className={tab === 'people' ? 'on' : ''} onClick={() => setTab('people')}>
          Люди
        </button>
        <button className={tab === 'facts' ? 'on' : ''} onClick={() => setTab('facts')}>
          Факты ({state.pins.length})
        </button>
      </nav>
      <div className="picker-list">
        {tab === 'docs' &&
          docs.map((d) => (
            <button key={d.id} className={'picker-item' + (state.board['doc:' + d.id] ? ' sel' : '')} onClick={() => onToggle('doc:' + d.id)}>
              <span className="pi-title">{d.title}</span>
              <span className="pi-meta">{state.board['doc:' + d.id] ? 'на доске · нажмите, чтобы убрать' : d.group}</span>
            </button>
          ))}
        {tab === 'people' &&
          people.map((p) => (
            <button key={p.id} className={'picker-item' + (state.board['person:' + p.id] ? ' sel' : '')} onClick={() => onToggle('person:' + p.id)}>
              <span className="pi-title">{p.name}</span>
              <span className="pi-meta">{state.board['person:' + p.id] ? 'на доске · нажмите, чтобы убрать' : p.role}</span>
            </button>
          ))}
        {tab === 'facts' &&
          (state.pins.length ? (
            state.pins.map((p) => (
              <button key={p.id} className={'picker-item' + (state.board['pin:' + p.id] ? ' sel' : '')} onClick={() => onToggle('pin:' + p.id)}>
                <span className="pi-title">{p.text.length > 160 ? p.text.slice(0, 158) + '…' : p.text}</span>
                <span className="pi-meta">{state.board['pin:' + p.id] ? 'на доске' : DOC_BY_ID[p.docId]?.title ?? 'допрос'}</span>
              </button>
            ))
          ) : (
            <p className="muted">Пока нет отмеченных фактов. Отметьте звёздочкой ★ строки в документах.</p>
          ))}
      </div>
      <div className="row end">
        <button className="btn primary" onClick={onClose}>
          Готово
        </button>
      </div>
    </Modal>
  );
}
