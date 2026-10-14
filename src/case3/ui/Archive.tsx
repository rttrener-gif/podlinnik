import { useEffect, useMemo, useState } from 'react';
import { EVIDENCE3, EV3 } from '../data/all';
import { P3 } from '../data/people';
import { useC3 } from '../state';
import { Art3 } from '../art/Photos3';
import { DeviceView } from './Device';
import { Modal } from './Common';
import type { Cat } from '../types';

const CATS: Cat[] = ['Документы', 'Медицинские', 'Экспертизы', 'Показания', 'Цифровые', 'Осмотр и фото', 'Записи'];

export function Archive({ openId, setOpenId, go }: { openId: string | null; setOpenId: (id: string | null) => void; go: (s: string, p?: string) => void }) {
  const { s, view, boardAdd, boardRemove, linkAdd } = useC3();
  const [cat, setCat] = useState<'Все' | Cat>('Все');
  const [q, setQ] = useState('');
  const [sort, setSort] = useState<'new' | 'title' | 'date'>('new');
  const [onlyNew, setOnlyNew] = useState(false);
  const [cmp, setCmp] = useState(false);
  const [res, setRes] = useState<string | null>(null);
  const [target, setTarget] = useState<string | null>(null);
  const [label, setLabel] = useState('');

  const have = useMemo(() => EVIDENCE3.filter((e) => s.ev.includes(e.id)), [s.ev]);
  const list = useMemo(() => {
    const t = q.trim().toLowerCase().replace(/ё/g, 'е');
    let l = have.filter((e) => (cat === 'Все' || e.cat === cat) && (!onlyNew || !s.seen.includes(e.id)));
    if (t) l = l.filter((e) => (e.title + ' ' + e.body.join(' ') + ' ' + (e.table?.rows.flat().join(' ') ?? '')).toLowerCase().replace(/ё/g, 'е').includes(t));
    if (sort === 'title') l = [...l].sort((a, b) => a.title.localeCompare(b.title, 'ru'));
    if (sort === 'date') l = [...l].sort((a, b) => a.date.localeCompare(b.date));
    if (sort === 'new') l = [...l].sort((a, b) => s.ev.indexOf(b.id) - s.ev.indexOf(a.id));
    return l;
  }, [have, cat, q, sort, onlyNew, s.seen, s.ev]);

  const cur = openId ? EV3[openId] : null;
  useEffect(() => { if (openId) view(openId); }, [openId]); // eslint-disable-line

  const count = (c: Cat) => have.filter((e) => e.cat === c).length;
  const newCount = have.filter((e) => !s.seen.includes(e.id)).length;

  return (
    <div className={'c3-split' + (cur ? ' has' : '')}>
      <aside className="c3-list">
        <div className="c3-head">
          <h2>Материалы дела</h2>
          <div className="c3-sub">{have.length} материалов · не изучено: {newCount}</div>
        </div>
        <input className="c3-inp" placeholder="Поиск по названию и тексту…" value={q} onChange={(e) => setQ(e.target.value)} />
        <div className="c3-filters">
          <button className={cat === 'Все' ? 'on' : ''} onClick={() => setCat('Все')}>Все</button>
          {CATS.filter((c) => count(c) > 0).map((c) => <button key={c} className={cat === c ? 'on' : ''} onClick={() => setCat(c)}>{c} · {count(c)}</button>)}
        </div>
        <div className="c3-row">
          <select className="c3-sel" value={sort} onChange={(e) => setSort(e.target.value as 'new')}>
            <option value="new">сначала новые</option><option value="title">по названию</option><option value="date">по дате</option>
          </select>
          <label className="c3-check"><input type="checkbox" checked={onlyNew} onChange={(e) => setOnlyNew(e.target.checked)} /> только непрочитанные</label>
        </div>
        <ul className="c3-items">
          {list.map((e) => (
            <li key={e.id}>
              <button className={'c3-item' + (openId === e.id ? ' act' : '')} onClick={() => setOpenId(e.id)}>
                <span className="c3-item-t">{!s.seen.includes(e.id) && <i className="c3-dot" aria-label="не изучено" />}{e.title}</span>
                <span className="c3-item-m">{e.cat} · {e.date}</span>
              </button>
            </li>
          ))}
          {list.length === 0 && <li className="c3-muted pad">Ничего не найдено.</li>}
        </ul>
      </aside>
      <section className="c3-doc">
        {cur ? (
          <article>
            <div className="c3-bar">
              <button className="c3-btn ghost back" onClick={() => setOpenId(null)}>← К списку</button>
              <span className="c3-spacer" />
              {cur.device && <button className="c3-btn" onClick={() => go('device', cur.device)}>Открыть устройство</button>}
              <button className="c3-btn" onClick={() => { boardAdd('ev:' + cur.id); }}>На доску</button>
              <button className="c3-btn" onClick={() => { setCmp(true); setRes(null); }}>Сопоставить…</button>
            </div>
            <div className="c3-doc-meta">{cur.cat} · {cur.source} · {cur.date}</div>
            <h1 className="c3-doc-title">{cur.title}</h1>
            {cur.art && <figure className="c3-fig"><Art3 id={cur.art} /><figcaption>Иллюстрация к материалу. Это реконструкция по описанию, не оригинальный снимок.</figcaption></figure>}
            {cur.body.map((p, i) => <p key={i} className="c3-p">{p}</p>)}
            {cur.table && (
              <div className="c3-tablewrap">
                {cur.table.caption && <div className="c3-cap">{cur.table.caption}</div>}
                <table className="c3-table"><thead><tr>{cur.table.head.map((h) => <th key={h}>{h}</th>)}</tr></thead>
                  <tbody>{cur.table.rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>)}</tbody></table>
              </div>
            )}
            {cur.people && cur.people.length > 0 && (
              <div className="c3-rel">Связано: {cur.people.map((p) => <button key={p} className="c3-link" onClick={() => go('person', p)}>{P3[p]?.short}</button>)}</div>
            )}
          </article>
        ) : (
          <div className="c3-empty"><p>Выберите материал слева. Новые материалы появляются по мере допросов и следственных действий.</p></div>
        )}
      </section>
      {cmp && cur && (
        <Modal title={`Сопоставить: ${cur.title}`} onClose={() => { setCmp(false); setTarget(null); }}>
          {!target ? (
            <>
              <p className="c3-muted">Выберите материал, который, по вашему мнению, связан с этим.</p>
              <ul className="c3-items">
                {have.filter((e) => e.id !== cur.id).map((e) => (
                  <li key={e.id}><button className="c3-item" onClick={() => { setTarget(e.id); setLabel(''); setRes(null); }}>
                    <span className="c3-item-t">{e.title}</span><span className="c3-item-m">{e.cat}</span></button></li>
                ))}
              </ul>
            </>
          ) : (
            <>
              <p className="c3-muted">«{cur.title}» — «{EV3[target].title}»</p>
              <label className="c3-muted small">В чём, по-вашему, связь? Сформулируйте гипотезу — она будет записана на рабочей доске.</label>
              <textarea className="c3-inp" rows={3} value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Например: время в записи не совпадает с данными системы" />
              <div className="c3-row end">
                <button className="c3-btn ghost" onClick={() => setTarget(null)}>Назад</button>
                <button className="c3-btn primary" disabled={label.trim().length < 10} onClick={() => {
                  linkAdd('ev:' + cur.id, 'ev:' + target, label.trim());
                  boardAdd('ev:' + cur.id); boardAdd('ev:' + target);
                  setRes('Гипотеза записана на рабочей доске как предположение. В журнале выводов появятся только подтверждённые материалами связи.');
                  setTarget(null);
                }}>Записать гипотезу</button>
              </div>
            </>
          )}
          {res && <div className="c3-note">{res}</div>}
        </Modal>
      )}
    </div>
  );
}

export function DeviceScreen({ id, back }: { id: string; back: () => void }) {
  return <DeviceView id={id} back={back} />;
}
