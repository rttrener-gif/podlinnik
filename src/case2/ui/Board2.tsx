import { useRef, useState } from 'react';
import { EVIDENCE, EV } from '../data/evidence';
import { PEOPLE2, P2 } from '../data/people';
import { INSIGHTS } from '../data/rules';
import { useC2 } from '../state';
import { useNav2 } from './nav';
import { Modal } from './Common';
import { ItemArt } from '../art/Items';
import { Portrait } from '../art/Portrait';

const NW = 170;
const NH = 160;

export function BoardScreen() {
  const { s, boardAdd, boardRemove, boardMove, linkAdd, linkDel, cond } = useC2();
  const { openEv, go } = useNav2();
  const [zoom, setZoom] = useState(0.9);
  const [local, setLocal] = useState<Record<string, { x: number; y: number }>>({});
  const [linkMode, setLinkMode] = useState(false);
  const [from, setFrom] = useState<string | null>(null);
  const [pend, setPend] = useState<{ a: string; b: string } | null>(null);
  const [label, setLabel] = useState('');
  const [picker, setPicker] = useState(false);
  const [filter, setFilter] = useState('');
  const [flash, setFlash] = useState<string | null>(null);
  const drag = useRef<{ id: string; sx: number; sy: number; ox: number; oy: number; moved: boolean } | null>(null);

  const ids = Object.keys(s.board);
  const pos = (id: string) => local[id] ?? s.board[id];
  const visible = (id: string) => {
    if (!filter) return true;
    if (id.startsWith('person:')) return id.slice(7) === filter;
    if (id.startsWith('ev:')) return EV[id.slice(3)]?.people?.includes(filter) ?? false;
    return true;
  };
  const info = (id: string) => {
    const [k, ref] = [id.slice(0, id.indexOf(':')), id.slice(id.indexOf(':') + 1)];
    if (k === 'ev') return { type: 'ev', title: EV[ref]?.title ?? ref, ref };
    if (k === 'person') return { type: 'person', title: P2[ref]?.name ?? ref, ref };
    return { type: 'ins', title: INSIGHTS.find((i) => i.id === ref)?.title ?? ref, ref };
  };

  const down = (e: React.PointerEvent, id: string) => {
    if ((e.target as HTMLElement).closest('button')) return;
    const p = pos(id);
    drag.current = { id, sx: e.clientX, sy: e.clientY, ox: p.x, oy: p.y, moved: false };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const move = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const dx = (e.clientX - d.sx) / zoom, dy = (e.clientY - d.sy) / zoom;
    if (Math.abs(dx) + Math.abs(dy) > 3) d.moved = true;
    if (d.moved && !linkMode) setLocal((l) => ({ ...l, [d.id]: { x: Math.max(0, d.ox + dx), y: Math.max(0, d.oy + dy) } }));
  };
  const up = (id: string) => {
    const d = drag.current; drag.current = null;
    if (!d) return;
    if (linkMode && !d.moved) {
      if (!from) setFrom(id);
      else if (from !== id) { setPend({ a: from, b: id }); setLabel(''); setFrom(null); }
      return;
    }
    const l = local[id];
    if (l) { boardMove(id, l.x, l.y); setLocal((x) => { const n = { ...x }; delete n[id]; return n; }); }
  };
  const ctr = (id: string) => { const p = pos(id); return { x: p.x + NW / 2, y: p.y + NH / 2 }; };
  const people = ['alina', 'denis', 'ruslan', 'marina', 'sedykh', 'yarik', 'kovalev', 'polina'];

  return (
    <div className="c2-board-page">
      <div className="c2-board-bar">
        <div><h2 className="c2-h small">Доска расследования</h2><div className="c2-muted small">Перетаскивайте карточки, соединяйте их нитями. Связь двух улик — это тоже сопоставление.</div></div>
        <div className="c2-row wrap">
          <button className="c2-btn" onClick={() => setPicker(true)}>+ На доску</button>
          <button className={'c2-btn' + (linkMode ? ' primary' : '')} onClick={() => { setLinkMode((v) => !v); setFrom(null); }}>{linkMode ? (from ? 'Выберите вторую…' : 'Выберите первую…') : 'Связать'}</button>
          <button className="c2-btn" onClick={() => setZoom((z) => Math.min(1.5, z + 0.15))}>＋</button>
          <button className="c2-btn" onClick={() => setZoom((z) => Math.max(0.4, z - 0.15))}>－</button>
          <select className="c2-sel" value={filter} onChange={(e) => setFilter(e.target.value)}><option value="">все карточки</option>{people.map((p) => <option key={p} value={p}>{P2[p].short}</option>)}</select>
          <button className="c2-btn ghost" onClick={() => go('notes')}>Выводы</button>
        </div>
      </div>
      {flash && <div className="c2-flash">{flash}</div>}
      <div className="c2-board-scroll">
        <div className="c2-board" style={{ width: 2400 * zoom, height: 1500 * zoom }}>
          <div style={{ transform: `scale(${zoom})`, transformOrigin: '0 0', width: 2400, height: 1500, position: 'relative' }}>
            <svg width={2400} height={1500} className="c2-lines">
              {s.links.map((l) => {
                if (!s.board[l.a] || !s.board[l.b] || !visible(l.a) || !visible(l.b)) return null;
                const a = ctr(l.a), b = ctr(l.b);
                const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
                const w = Math.max(48, (l.label || 'связь').length * 8 + 30);
                return (
                  <g key={l.id}>
                    <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#b0222c" strokeWidth="2.5" />
                    <g transform={`translate(${mx},${my})`} className="c2-thread-lbl" onClick={() => linkDel(l.id)}>
                      <rect x={-w / 2} y={-13} width={w} height={26} rx={4} /><text textAnchor="middle" y={5}>{(l.label || 'связь') + ' ×'}</text>
                    </g>
                  </g>
                );
              })}
            </svg>
            {ids.filter(visible).map((id) => {
              const i = info(id);
              const p = pos(id);
              return (
                <div key={id} className={'c2-node n-' + i.type + (from === id ? ' picked' : '') + (linkMode ? ' linkable' : '')} style={{ left: p.x, top: p.y, width: NW }}
                  onPointerDown={(e) => down(e, id)} onPointerMove={move} onPointerUp={() => up(id)}>
                  <span className="c2-node-pin" />
                  <div className="c2-node-art">
                    {i.type === 'ev' && <ItemArt art={EV[i.ref].art} lines={EV[i.ref].lines} id={'b' + i.ref} />}
                    {i.type === 'person' && <Portrait id={i.ref} />}
                    {i.type === 'ins' && <div className="c2-node-ins">💡</div>}
                  </div>
                  <div className="c2-node-title">{i.title}</div>
                  <div className="c2-node-act">
                    {i.type === 'ev' && <button onClick={() => openEv(i.ref)}>открыть</button>}
                    {i.type === 'person' && <button onClick={() => go('interview', i.ref)}>допрос</button>}
                    <button onClick={() => boardRemove(id)}>убрать</button>
                  </div>
                </div>
              );
            })}
            {ids.length === 0 && <div className="c2-board-empty">Доска пуста. Добавьте материалы кнопкой «+ На доску» или из карточки улики.</div>}
          </div>
        </div>
      </div>

      {pend && (
        <Modal title="Подпишите связь" onClose={() => setPend(null)}>
          <p className="c2-muted">{info(pend.a).title} → {info(pend.b).title}</p>
          <input className="c2-inp" autoFocus placeholder="Например: противоречит, одно время, одна комната…" value={label} onChange={(e) => setLabel(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { linkAdd(pend.a, pend.b, label.trim()); setPend(null); setFlash('Связь добавлена. Если она значима, результат появится в журнале инсайтов.'); window.setTimeout(() => setFlash(null), 4000); } }} />
          <div className="c2-row end"><button className="c2-btn ghost" onClick={() => setPend(null)}>Отмена</button>
            <button className="c2-btn primary" onClick={() => { linkAdd(pend.a, pend.b, label.trim()); setPend(null); setFlash('Связь добавлена. Если она значима, результат появится в журнале инсайтов.'); window.setTimeout(() => setFlash(null), 4000); }}>Связать</button></div>
        </Modal>
      )}
      {picker && (
        <Modal title="Что положить на доску" onClose={() => setPicker(false)} wide>
          <div className="c2-sec">Улики</div>
          <div className="c2-chips">{EVIDENCE.filter((e) => s.ev.includes(e.id)).map((e) => <button key={e.id} className={'c2-chip' + (s.board['ev:' + e.id] ? ' on' : '')} onClick={() => (s.board['ev:' + e.id] ? boardRemove('ev:' + e.id) : boardAdd('ev:' + e.id))}>{e.title}</button>)}</div>
          <div className="c2-sec">Люди</div>
          <div className="c2-chips">{PEOPLE2.filter((p) => cond(p.id === 'alina' ? [] : ['ev:brief'])).map((p) => <button key={p.id} className={'c2-chip' + (s.board['person:' + p.id] ? ' on' : '')} onClick={() => (s.board['person:' + p.id] ? boardRemove('person:' + p.id) : boardAdd('person:' + p.id))}>{p.short}</button>)}</div>
          <div className="c2-sec">Инсайты</div>
          <div className="c2-chips">{INSIGHTS.filter((i) => s.ins.some((x) => x.id === i.id)).map((i) => <button key={i.id} className={'c2-chip' + (s.board['ins:' + i.id] ? ' on' : '')} onClick={() => (s.board['ins:' + i.id] ? boardRemove('ins:' + i.id) : boardAdd('ins:' + i.id))}>{i.title}</button>)}</div>
          <div className="c2-row end"><button className="c2-btn primary" onClick={() => setPicker(false)}>Готово</button></div>
        </Modal>
      )}
    </div>
  );
}
