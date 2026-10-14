import { useEffect, useRef, useState } from 'react';
import { ACTIONS3, ACT3 } from '../data/actions';
import { INSIGHTS3, TIMELINE3 } from '../data/rules';
import { EV3, EVIDENCE3 } from '../data/all';
import { P3, PEOPLE3 } from '../data/people';
import { useC3, globalHint } from '../state';
import { Modal } from './Common';

export function Actions({ open }: { open: (id: string) => void }) {
  const { s, cond, act, clearNotices } = useC3();
  const [flash, setFlash] = useState<string | null>(null);
  useEffect(() => { clearNotices(); }, []); // eslint-disable-line
  const avail = ACTIONS3.filter((a) => !s.acts.includes(a.id) && cond(a.when));
  const done = ACTIONS3.filter((a) => s.acts.includes(a.id));
  const locked = ACTIONS3.length - avail.length - done.length;
  return (
    <div className="c3-page">
      <h2 className="c3-h">Следственные действия</h2>
      <p className="c3-muted">Каждое действие становится доступным, когда для него появляется основание. Название и содержание закрытых действий не показываются.</p>
      {flash && <div className="c3-note">{flash}</div>}
      <h3 className="c3-h3">Доступно сейчас · {avail.length}</h3>
      {avail.length === 0 && <p className="c3-muted">Сейчас новых оснований нет. Изучайте материалы, допрашивайте и сопоставляйте показания с данными.</p>}
      {avail.map((a) => (
        <div key={a.id} className="c3-act">
          <div className="c3-act-k">{a.kind}</div>
          <h4>{a.title}</h4>
          <p><b>Цель.</b> {a.aim}</p>
          <p className="c3-muted"><b>Основание.</b> {a.grounds}</p>
          <button className="c3-btn primary" onClick={() => { act(a.id); setFlash('Результат поступил: «' + a.title + '». Он добавлен в материалы дела.'); window.setTimeout(() => setFlash(null), 5000); }}>Направить</button>
        </div>
      ))}
      {done.length > 0 && <h3 className="c3-h3">Выполнено · {done.length}</h3>}
      {done.map((a) => (
        <div key={a.id} className="c3-act done">
          <div className="c3-act-k">{a.kind}</div>
          <h4>{a.title}</h4>
          <div>{a.gives.map((g) => <button key={g} className="c3-link" onClick={() => open(g)}>{EV3[g]?.title}</button>)}</div>
        </div>
      ))}
      {locked > 0 && <p className="c3-muted">Ещё {locked} действий пока не имеют оснований.</p>}
    </div>
  );
}

export function Timeline({ open }: { open: (id: string) => void }) {
  const { s, cond } = useC3();
  const [only, setOnly] = useState<'all' | 'claim'>('all');
  const rows = TIMELINE3.filter((r) => r.src.every((x) => s.ev.includes(x) || cond([`ev:${x}`])) && (only === 'all' || r.kind === 'claim'));
  const days = Array.from(new Set(rows.map((r) => r.day)));
  return (
    <div className="c3-page">
      <h2 className="c3-h">Хронология</h2>
      <p className="c3-muted">Строится из материалов, которые у вас есть. Различайте объективные данные (системы, записи, документы) и утверждения (показания, записи со слов).</p>
      <div className="c3-row"><button className={'c3-btn' + (only === 'all' ? ' on' : '')} onClick={() => setOnly('all')}>Всё</button><button className={'c3-btn' + (only === 'claim' ? ' on' : '')} onClick={() => setOnly('claim')}>Только показания и записи со слов</button></div>
      {days.map((d) => (
        <div key={d}>
          <h3 className="c3-h3">{d.split('-').reverse().join('.')}</h3>
          <table className="c3-table"><thead><tr><th>Время</th><th>Событие</th><th>Характер</th><th>Источник</th></tr></thead>
            <tbody>{rows.filter((r) => r.day === d).sort((a, b) => (a.hm < '12:00' ? '1' : '0') + a.hm > (b.hm < '12:00' ? '1' : '0') + b.hm ? 1 : -1).map((r) => (
              <tr key={r.id} className={r.kind}><td className="mono">{r.hm}</td><td>{r.text}</td><td>{r.kind === 'objective' ? 'объективные данные' : 'утверждение'}</td>
                <td>{r.src.map((x) => <button key={x} className="c3-link" onClick={() => open(x)}>{EV3[x]?.title}</button>)}</td></tr>
            ))}</tbody></table>
        </div>
      ))}
      {rows.length === 0 && <p className="c3-muted">Событий пока нет.</p>}
    </div>
  );
}

export function Insights({ open }: { open: (id: string) => void }) {
  const { s, clearFresh } = useC3();
  useEffect(() => { clearFresh(); }, []); // eslint-disable-line
  const got = INSIGHTS3.filter((i) => s.ins.some((x) => x.id === i.id));
  const KIND = { contradiction: 'Противоречие', link: 'Связь', version: 'Версия', question: 'Вопрос' } as const;
  return (
    <div className="c3-page narrow">
      <h2 className="c3-h">Журнал выводов</h2>
      <p className="c3-muted">Здесь фиксируются только значимые аналитические результаты. Выводы — это промежуточные формулировки, а не приговор.</p>
      {got.length === 0 && <p className="c3-muted">Выводов пока нет. Они появляются, когда вы сопоставили материалы или проверили показания и это что-то изменило.</p>}
      {got.map((i) => (
        <article key={i.id} className="c3-ins">
          <div className="c3-act-k">{KIND[i.kind]}</div>
          <h4>{i.title}</h4>
          <p>{i.text}</p>
          <div>{i.from.filter((f) => s.ev.includes(f)).map((f) => <button key={f} className="c3-link" onClick={() => open(f)}>{EV3[f]?.title}</button>)}</div>
        </article>
      ))}
    </div>
  );
}

export function Overview({ go }: { go: (s: string) => void }) {
  const { s } = useC3();
  const h = globalHint(s);
  return (
    <div className="c3-page narrow">
      <h2 className="c3-h">Дело № 25-0629</h2>
      <p className="c3-p">В ночь на 19 октября в частном пансионате «Тихая гавань» умерла Нина Аркадьевна Вольская, 81 год. Свидетельство о смерти — «острая сердечная недостаточность», вскрытие не проводилось. Через две недели её дочь подала заявление, в котором просит проверить обстоятельства смерти и приложила фотографию с планшета матери, сделанную ночью.</p>
      <p className="c3-p">Вам поручено проверить заявление. Материалы получены, персонал и дочь готовы к беседе. Следственные действия будут становиться доступными по мере появления оснований.</p>
      <div className="c3-card"><b>Текущая задача.</b> {h.goal}</div>
      <div className="c3-grid">
        <button className="c3-tile" onClick={() => go('archive')}><b>Материалы</b><span>{s.ev.length} в деле, не изучено: {s.ev.filter((e) => !s.seen.includes(e)).length}</span></button>
        <button className="c3-tile" onClick={() => go('people')}><b>Люди</b><span>допросы, справки</span></button>
        <button className="c3-tile" onClick={() => go('actions')}><b>Следственные действия</b><span>{s.pendingNotice.length ? `новые возможности: ${s.pendingNotice.length}` : 'по основаниям'}</span></button>
        <button className="c3-tile" onClick={() => go('timeline')}><b>Хронология</b><span>объективное и со слов</span></button>
        <button className="c3-tile" onClick={() => go('board')}><b>Рабочая доска</b><span>гипотезы и связи</span></button>
        <button className="c3-tile" onClick={() => go('versions')}><b>Версии</b><span>{s.versions.length ? `${s.versions.length} в работе` : 'сформулировать'}</span></button>
        <button className="c3-tile" onClick={() => go('insights')}><b>Выводы</b><span>{s.ins.length} зафиксировано</span></button>
        <button className="c3-tile" onClick={() => go('finale')}><b>Итоговая версия</b><span>обвинение</span></button>
      </div>
    </div>
  );
}

// ───── Версии ─────
export function Versions() {
  const { s, versionSave, versionDel } = useC3();
  const [edit, setEdit] = useState<null | { id?: string; title: string; who: string; text: string; sup: string[]; con: string[]; status: 'open' | 'held' | 'rejected' }>(null);
  const [pickFor, setPickFor] = useState<'sup' | 'con' | null>(null);
  const blank = { title: '', who: '', text: '', sup: [], con: [], status: 'open' as const };
  const label = { open: 'проверяется', held: 'остаётся рабочей', rejected: 'опровергнута' } as const;
  return (
    <div className="c3-page narrow">
      <h2 className="c3-h">Версии</h2>
      <p className="c3-muted">Фиксируйте несколько версий одновременно: что их подтверждает и что противоречит. Статус меняете вы сами.</p>
      {!edit && <button className="c3-btn primary" onClick={() => setEdit(blank)}>+ Новая версия</button>}
      {edit && (
        <div className="c3-card form">
          <label>Название<input className="c3-inp" value={edit.title} onChange={(e) => setEdit({ ...edit, title: e.target.value })} /></label>
          <label>Кого касается<select className="c3-sel" value={edit.who} onChange={(e) => setEdit({ ...edit, who: e.target.value })}><option value="">— никого / несчастный случай —</option>{PEOPLE3.filter((p) => p.interview).map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select></label>
          <label>Суть версии<textarea className="c3-inp" rows={4} value={edit.text} onChange={(e) => setEdit({ ...edit, text: e.target.value })} /></label>
          <div className="c3-row wrap"><button className="c3-btn" onClick={() => setPickFor('sup')}>Подтверждают ({edit.sup.length})</button><button className="c3-btn" onClick={() => setPickFor('con')}>Противоречат ({edit.con.length})</button>
            <select className="c3-sel" value={edit.status} onChange={(e) => setEdit({ ...edit, status: e.target.value as 'open' })}><option value="open">проверяется</option><option value="held">остаётся рабочей</option><option value="rejected">опровергнута</option></select></div>
          <div className="c3-row end"><button className="c3-btn ghost" onClick={() => setEdit(null)}>Отмена</button><button className="c3-btn primary" onClick={() => { if (edit.title.trim()) { versionSave(edit); setEdit(null); } }}>Сохранить</button></div>
        </div>
      )}
      {s.versions.map((v) => (
        <article key={v.id} className={'c3-ins ver ' + v.status}>
          <div className="c3-act-k">{label[v.status]}{v.who ? ' · ' + P3[v.who]?.short : ''}</div>
          <h4>{v.title}</h4><p>{v.text}</p>
          {v.sup.length > 0 && <p className="c3-muted"><b>Подтверждают:</b> {v.sup.map((x) => EV3[x]?.title).join('; ')}</p>}
          {v.con.length > 0 && <p className="c3-muted"><b>Противоречат:</b> {v.con.map((x) => EV3[x]?.title).join('; ')}</p>}
          <div className="c3-row"><button className="c3-btn" onClick={() => setEdit(v)}>Изменить</button><button className="c3-btn ghost" onClick={() => versionDel(v.id)}>Удалить</button></div>
        </article>
      ))}
      {pickFor && edit && (
        <Modal title={pickFor === 'sup' ? 'Что подтверждает версию' : 'Что ей противоречит'} onClose={() => setPickFor(null)}>
          <ul className="c3-items">{EVIDENCE3.filter((e) => s.ev.includes(e.id)).map((e) => {
            const list = edit[pickFor]; const on = list.includes(e.id);
            return <li key={e.id}><button className={'c3-item' + (on ? ' act' : '')} onClick={() => setEdit({ ...edit, [pickFor]: on ? list.filter((x) => x !== e.id) : [...list, e.id] })}><span className="c3-item-t">{e.title}</span><span className="c3-item-m">{on ? 'выбрано' : e.cat}</span></button></li>;
          })}</ul>
          <div className="c3-row end"><button className="c3-btn primary" onClick={() => setPickFor(null)}>Готово</button></div>
        </Modal>
      )}
    </div>
  );
}

// ───── Рабочая доска ─────
const NW = 200, NH = 64;
export function Board({ open }: { open: (id: string) => void }) {
  const { s, boardAdd, boardRemove, boardMove, linkAdd, linkSet, linkDel } = useC3();
  const [local, setLocal] = useState<Record<string, { x: number; y: number }>>({});
  const [mode, setMode] = useState(false);
  const [from, setFrom] = useState<string | null>(null);
  const [pend, setPend] = useState<{ a: string; b: string } | null>(null);
  const [label, setLabel] = useState('');
  const [picker, setPicker] = useState(false);
  const [filter, setFilter] = useState('');
  const drag = useRef<{ id: string; sx: number; sy: number; ox: number; oy: number; mv: boolean } | null>(null);
  const ids = Object.keys(s.board);
  const pos = (id: string) => local[id] ?? s.board[id];
  const info = (id: string) => (id.startsWith('ev:') ? { t: EV3[id.slice(3)]?.title ?? id, c: EV3[id.slice(3)]?.cat ?? '' } : { t: P3[id.slice(7)]?.name ?? id, c: 'Человек' });
  const vis = (id: string) => !filter || (id.startsWith('ev:') ? EV3[id.slice(3)]?.cat === filter : filter === 'Человек');
  const cats = ['Документы', 'Медицинские', 'Экспертизы', 'Показания', 'Цифровые', 'Осмотр и фото', 'Записи', 'Человек'];

  const down = (e: React.PointerEvent, id: string) => {
    if ((e.target as HTMLElement).closest('button')) return;
    const p = pos(id); drag.current = { id, sx: e.clientX, sy: e.clientY, ox: p.x, oy: p.y, mv: false };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const move = (e: React.PointerEvent) => {
    const d = drag.current; if (!d) return;
    const dx = e.clientX - d.sx, dy = e.clientY - d.sy;
    if (Math.abs(dx) + Math.abs(dy) > 3) d.mv = true;
    if (d.mv && !mode) setLocal((l) => ({ ...l, [d.id]: { x: Math.max(0, d.ox + dx), y: Math.max(0, d.oy + dy) } }));
  };
  const up = (id: string) => {
    const d = drag.current; drag.current = null; if (!d) return;
    if (mode && !d.mv) { if (!from) setFrom(id); else if (from !== id) { setPend({ a: from, b: id }); setLabel(''); setFrom(null); } return; }
    const l = local[id]; if (l) { boardMove(id, l.x, l.y); setLocal((x) => { const n = { ...x }; delete n[id]; return n; }); }
  };
  const c = (id: string) => { const p = pos(id); return { x: p.x + NW / 2, y: p.y + NH / 2 }; };

  return (
    <div className="c3-boardpage">
      <div className="c3-boardbar">
        <div><h2 className="c3-h">Рабочая доска</h2><div className="c3-muted small">Связь — это ваша гипотеза (пунктир). Когда вы убедились в ней, пометьте как подтверждённую (сплошная).</div></div>
        <div className="c3-row wrap">
          <button className="c3-btn" onClick={() => setPicker(true)}>+ Добавить</button>
          <button className={'c3-btn' + (mode ? ' primary' : '')} onClick={() => { setMode((v) => !v); setFrom(null); }}>{mode ? (from ? 'Выберите вторую' : 'Выберите первую') : 'Связать'}</button>
          <select className="c3-sel" value={filter} onChange={(e) => setFilter(e.target.value)}><option value="">все группы</option>{cats.map((x) => <option key={x}>{x}</option>)}</select>
        </div>
      </div>
      <div className="c3-boardscroll">
        <div className="c3-boardcanvas">
          <svg className="c3-blines" width={2200} height={1400}>
            {s.links.map((l) => {
              if (!s.board[l.a] || !s.board[l.b] || !vis(l.a) || !vis(l.b)) return null;
              const a = c(l.a), b = c(l.b); const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
              const w = Math.max(70, (l.label || 'связь').length * 7 + 60);
              return (
                <g key={l.id}>
                  <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={l.status === 'ok' ? '#9bb08a' : '#b08d4a'} strokeWidth="2" strokeDasharray={l.status === 'ok' ? '0' : '6 5'} />
                  <g transform={`translate(${mx},${my})`} className="c3-lbl">
                    <rect x={-w / 2} y={-12} width={w} height={24} rx={3} />
                    <text textAnchor="middle" y={4} onClick={() => linkSet(l.id, l.status === 'ok' ? 'hyp' : 'ok')}>{(l.label || 'связь') + (l.status === 'ok' ? ' ✓' : ' ?')}</text>
                    <text x={w / 2 - 8} y={4} onClick={() => linkDel(l.id)}>×</text>
                  </g>
                </g>
              );
            })}
          </svg>
          {ids.filter(vis).map((id) => {
            const i = info(id); const p = pos(id);
            return (
              <div key={id} className={'c3-tile2' + (from === id ? ' picked' : '')} style={{ left: p.x, top: p.y, width: NW, minHeight: NH }}
                onPointerDown={(e) => down(e, id)} onPointerMove={move} onPointerUp={() => up(id)}>
                <div className="c3-tile2-c">{i.c}</div><div className="c3-tile2-t">{i.t}</div>
                <div className="c3-tile2-a">{id.startsWith('ev:') && <button onClick={() => open(id.slice(3))}>открыть</button>}<button onClick={() => boardRemove(id)}>убрать</button></div>
              </div>
            );
          })}
          {ids.length === 0 && <div className="c3-boardempty">Доска пуста. Добавьте только то, что нужно для анализа: доска не обязана содержать все материалы.</div>}
        </div>
      </div>
      {pend && (
        <Modal title="Подпишите гипотезу" onClose={() => setPend(null)}>
          <p className="c3-muted">{info(pend.a).t} — {info(pend.b).t}</p>
          <input className="c3-inp" autoFocus placeholder="Например: противоречит по времени" value={label} onChange={(e) => setLabel(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { linkAdd(pend.a, pend.b, label.trim()); setPend(null); } }} />
          <div className="c3-row end"><button className="c3-btn ghost" onClick={() => setPend(null)}>Отмена</button><button className="c3-btn primary" onClick={() => { linkAdd(pend.a, pend.b, label.trim()); setPend(null); }}>Связать</button></div>
        </Modal>
      )}
      {picker && (
        <Modal title="Добавить на доску" onClose={() => setPicker(false)} wide>
          <div className="c3-sec">Материалы</div>
          <div className="c3-chips">{EVIDENCE3.filter((e) => s.ev.includes(e.id)).map((e) => <button key={e.id} className={'c3-chip' + (s.board['ev:' + e.id] ? ' on' : '')} onClick={() => (s.board['ev:' + e.id] ? boardRemove('ev:' + e.id) : boardAdd('ev:' + e.id))}>{e.title}</button>)}</div>
          <div className="c3-sec">Люди</div>
          <div className="c3-chips">{PEOPLE3.map((p) => <button key={p.id} className={'c3-chip' + (s.board['person:' + p.id] ? ' on' : '')} onClick={() => (s.board['person:' + p.id] ? boardRemove('person:' + p.id) : boardAdd('person:' + p.id))}>{p.short}</button>)}</div>
          <div className="c3-row end"><button className="c3-btn primary" onClick={() => setPicker(false)}>Готово</button></div>
        </Modal>
      )}
    </div>
  );
}
export { INSIGHTS3 as _i, ACT3 as _a };
