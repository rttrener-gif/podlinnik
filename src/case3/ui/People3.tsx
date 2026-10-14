import { useEffect, useRef, useState } from 'react';
import { PEOPLE3, P3 } from '../data/people';
import { IV3M } from '../data/interviews';
import { EV3 } from '../data/all';
import { useC3 } from '../state';
import { Portrait3 } from '../art/Portrait3';
import { Modal, TONE_RU } from './Common';
import { check, buildMenu } from '../engine';

export function PeopleScreen({ id, setId }: { id: string | null; setId: (id: string | null) => void }) {
  const { s } = useC3();
  const visible = PEOPLE3.filter((p) => p.id !== 'kravtsov' || s.ev.includes('st-kravtsov'));
  const cur = id ? P3[id] : null;
  return (
    <div className={'c3-split' + (cur ? ' has' : '')}>
      <aside className="c3-list">
        <div className="c3-head"><h2>Люди</h2><div className="c3-sub">Справки и допросы</div></div>
        <ul className="c3-items">
          {visible.map((p) => (
            <li key={p.id}><button className={'c3-person' + (id === p.id ? ' act' : '')} onClick={() => setId(p.id)}>
              <Portrait3 id={p.id} size={48} /><span><b>{p.name}</b><small>{p.role}</small></span>
              {IV3M[p.id] && (() => { const n = buildMenu(IV3M[p.id], s).filter((m) => !m.asked).length; return n > 0 ? <span className="c3-badge" title="Вопросов, которые вы ещё не задавали">{n}</span> : null; })()}</button></li>
          ))}
        </ul>
      </aside>
      <section className="c3-doc">
        {cur ? <PersonPage key={cur.id} id={cur.id} back={() => setId(null)} /> : <div className="c3-empty"><p>Выберите человека. Допрос ведётся свободным текстом: формулируйте вопросы сами и предъявляйте материалы.</p></div>}
      </section>
    </div>
  );
}

function PersonPage({ id, back }: { id: string; back: () => void }) {
  const p = P3[id];
  const iv = IV3M[id];
  const { s, ask, show, hint } = useC3();
  const [pick, setPick] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const [hl, setHl] = useState<string | null>(null);
  const [showHints, setShowHints] = useState(false);
  const end = useRef<HTMLDivElement>(null);
  const log = s.log.filter((l) => l.person === id);
  useEffect(() => { end.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }, [log.length]);

  const menu = iv ? buildMenu(iv, s) : [];
  const groups = Array.from(new Set(menu.map((m) => m.group)));
  const choose = (qid: string) => {
    const r = ask(id, qid);
    if (r === 'repeat') {
      const prev = [...log].reverse().find((l) => l.qid === qid);
      setHl(prev?.id ?? null);
      setNote('Ответ на этот вопрос уже получен — он выделен в записи допроса выше.');
      window.setTimeout(() => { setNote(null); setHl(null); }, 6000);
    }
  };
  const open = iv ? iv.hints.filter((h) => check(h.when, s) && !check(h.done, s)) : [];
  const h = open[0];
  const lv = h ? s.hints[`${id}.${h.id}`] ?? 0 : 0;

  return (
    <article>
      <div className="c3-bar"><button className="c3-btn ghost back" onClick={back}>← К списку</button></div>
      <div className="c3-pers-head">
        <Portrait3 id={id} size={110} />
        <div><h1 className="c3-doc-title">{p.name}</h1><div className="c3-doc-meta">{p.role}</div><p className="c3-p">{p.bio}</p></div>
      </div>
      {iv ? (
        <section className="c3-iv">
          <h3 className="c3-h3">Допрос</h3>
          <div className="c3-ivlog">
            <p className="c3-intro">{iv.intro}</p>
            {log.map((l) => (
              <div key={l.id} className={'c3-turn' + (hl === l.id ? ' hl' : '')}>
                <div className={'c3-q' + (l.kind === 'show' ? ' show' : '')}><span className="c3-who">Следователь</span>{l.q}</div>
                <div className="c3-a"><span className="c3-who">{p.short}{l.tone ? ' · ' + (TONE_RU[l.tone] ?? '') : ''}</span>{l.a}</div>
              </div>
            ))}
            <div ref={end} />
          </div>
          <div className="c3-ask">
            {groups.map((g) => (
              <div key={g} className="c3-qgroup">
                <div className="c3-sec">{g}</div>
                {menu.filter((m) => m.group === g).map((m) => (
                  <button key={m.id} className={'c3-qbtn' + (m.asked ? ' asked' : '')} onClick={() => choose(m.id)}>
                    <span>{m.label}</span>
                    {m.asked && <small>{m.stale ? 'задан ранее · ответ может измениться' : 'задан'}</small>}
                  </button>
                ))}
              </div>
            ))}
            {menu.length === 0 && <p className="c3-muted">Сейчас вопросов нет. Изучайте материалы, чтобы появились новые направления допроса.</p>}
            <div className="c3-row">
              <button className="c3-btn" onClick={() => setPick(true)}>Предъявить материал…</button>
              <span className="c3-spacer" />
              <button className="c3-btn ghost" onClick={() => setShowHints((v) => !v)}>Мне нужна подсказка</button>
            </div>
            {note && <div className="c3-note">{note}</div>}
            {showHints && (
              <div className="c3-hintbox">
                {!h ? <p className="c3-muted">Подсказок по этому допросу сейчас нет. Изучайте материалы и проверяйте показания по данным.</p> : (
                  <>
                    {lv === 0 && <p className="c3-muted">Нажмите, чтобы получить мягкое направление.</p>}
                    {lv >= 1 && <p><b>1.</b> {h.l1}</p>}{lv >= 2 && <p><b>2.</b> {h.l2}</p>}{lv >= 3 && <p><b>3.</b> {h.l3}</p>}
                    {lv < 3 && <button className="c3-btn" onClick={() => hint(`${id}.${h.id}`)}>{lv === 0 ? 'Показать подсказку' : 'Конкретнее'}</button>}
                  </>
                )}
              </div>
            )}
          </div>
        </section>
      ) : <p className="c3-muted">Допрос не предусмотрен: человек недоступен.</p>}
      {pick && (
        <Modal title={`Предъявить: ${p.short}`} onClose={() => setPick(false)}>
          <p className="c3-muted">Реакция зависит от того, насколько материал противоречит сказанному и что вы уже предъявляли.</p>
          <ul className="c3-items">
            {s.ev.map((e) => (
              <li key={e}><button className="c3-item" onClick={() => {
                const r = show(id, e); setPick(false);
                if (r === 'dup') { setNote('Этот материал уже предъявлялся при тех же обстоятельствах. Новых сведений нет.'); window.setTimeout(() => setNote(null), 5000); }
              }}><span className="c3-item-t">{EV3[e].title}</span><span className="c3-item-m">{EV3[e].cat}{s.shown.includes(`${id}.${e}`) ? ' · предъявлялось' : ''}</span></button></li>
            ))}
          </ul>
        </Modal>
      )}
    </article>
  );
}
