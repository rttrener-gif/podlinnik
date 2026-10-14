import { useEffect, useState } from 'react';
import { EVIDENCE3 } from '../data/all';
import { useC3 } from '../state';
import { Modal } from './Common';
import { EV3 } from '../data/all';
import { P3 } from '../data/people';

type Lazy = typeof import('../data/finale');
type V = import('../data/finale').Verdict3;

export function Finale3({ open }: { open: (id: string) => void }) {
  const { s, attempt, reveal, notes } = useC3();
  const [fin, setFin] = useState<Lazy | null>(null);
  const [ans, setAns] = useState<Record<string, string>>({});
  const [ev, setEv] = useState<string[]>([]);
  const [rej, setRej] = useState<string[]>([]);
  const [sum, setSum] = useState('');
  const [pick, setPick] = useState(false);
  const [res, setRes] = useState<V | null>(null);
  const [conf, setConf] = useState(false);
  useEffect(() => { void import('../data/finale').then(setFin); }, []);
  if (!fin) return <div className="c3-page"><p className="c3-muted">Загрузка…</p></div>;
  const done = s.solved || s.revealed;
  const full = fin.QUESTIONS3.every((q) => ans[q.id]) && ev.length > 0 && sum.trim().length > 30;

  if (done) {
    return (
      <div className="c3-page narrow">
        <div className="c3-stamp">{s.solved ? 'ДЕЛО РАСКРЫТО' : 'ДЕЛО ЗАВЕРШЕНО'}</div>
        <h2 className="c3-h">Реконструкция событий</h2>
        {res && <Verdict v={res} />}
        {fin.EPILOGUE3.map((b) => (
          <section key={b.h} className="c3-epi"><h3 className="c3-h3">{b.h}</h3>{b.p.map((t, i) => <p key={i} className="c3-p">{t}</p>)}
            {b.via && <p className="c3-muted small">Где это было доступно: {b.via.filter((v) => EV3[v]).map((v) => <button key={v} className="c3-link" onClick={() => open(v)}>{EV3[v].title}</button>)}</p>}
          </section>
        ))}
        <section className="c3-epi"><h3 className="c3-h3">Откуда игрок мог это знать</h3>
          <table className="c3-table"><thead><tr><th>Факт</th><th>Материалы</th></tr></thead><tbody>
            {fin.FACTS.map((f) => <tr key={f.id}><td>{f.text}</td><td>{f.via.filter((v) => EV3[v]).map((v) => <button key={v} className="c3-link" onClick={() => open(v)}>{EV3[v].title}</button>)}</td></tr>)}
          </tbody></table>
        </section>
      </div>
    );
  }

  return (
    <div className="c3-page narrow">
      <h2 className="c3-h">Итоговая версия</h2>
      <p className="c3-muted">Сформулируйте, что произошло, кто и в какой степени причастен, что скрывали остальные и чем это подтверждается. Ошибка в детали не обнуляет прогресс.</p>
      {s.attempts.length > 0 && <div className="c3-note">Попыток: {s.attempts.length}. Последняя оценка: {s.attempts[s.attempts.length - 1].score}/100.</div>}
      {fin.QUESTIONS3.map((q, n) => (
        <section key={q.id} className="c3-q">
          <h3 className="c3-h3"><span className="c3-num">{n + 1}</span>{q.title}</h3>
          {q.opts.map((o) => (
            <label key={o.id} className={'c3-opt' + (ans[q.id] === o.id ? ' on' : '')}>
              <input type="radio" name={q.id} checked={ans[q.id] === o.id} onChange={() => setAns({ ...ans, [q.id]: o.id })} /><span>{o.text}</span>
            </label>
          ))}
        </section>
      ))}
      <section className="c3-q">
        <h3 className="c3-h3"><span className="c3-num">9</span>Какие первоначальные предположения опровергнуты?</h3>
        {fin.ASSUMPTIONS3.map((a) => (
          <label key={a.id} className={'c3-opt' + (rej.includes(a.id) ? ' on' : '')}>
            <input type="checkbox" checked={rej.includes(a.id)} onChange={() => setRej(rej.includes(a.id) ? rej.filter((x) => x !== a.id) : [...rej, a.id])} /><span>{a.text}</span>
          </label>
        ))}
      </section>
      <section className="c3-q">
        <h3 className="c3-h3"><span className="c3-num">10</span>Доказательства (до 10)</h3>
        <div className="c3-chips">{ev.map((e) => <span key={e} className="c3-chip">{EV3[e]?.title}</span>)}{ev.length === 0 && <span className="c3-muted">Не выбрано</span>}</div>
        <button className="c3-btn" onClick={() => setPick(true)}>Выбрать материалы</button>
      </section>
      <section className="c3-q">
        <h3 className="c3-h3"><span className="c3-num">11</span>Изложите версию своими словами</h3>
        <textarea className="c3-inp" rows={7} value={sum} onChange={(e) => setSum(e.target.value)} placeholder="Что произошло в ту ночь, кто чем занимался, почему лгали и кого вы больше не подозреваете…" />
      </section>
      <div className="c3-row end wrap">
        <button className="c3-btn ghost" onClick={() => setConf(true)}>Показать решение</button>
        <button className="c3-btn primary" disabled={!full} onClick={() => { const v = fin.judge3({ ans, evidence: ev, rejected: rej, summary: sum }); setRes(v); attempt(v.score, v.verdict, v.verdict === 'solved'); notes(s.notes); }}>Подать версию</button>
      </div>
      {res && <Verdict v={res} />}
      {pick && (
        <Modal title="Доказательства" onClose={() => setPick(false)} wide>
          <ul className="c3-items">{EVIDENCE3.filter((e) => s.ev.includes(e.id)).map((e) => {
            const on = ev.includes(e.id);
            return <li key={e.id}><button className={'c3-item' + (on ? ' act' : '')} onClick={() => setEv(on ? ev.filter((x) => x !== e.id) : ev.length < 10 ? [...ev, e.id] : ev)}><span className="c3-item-t">{e.title}</span><span className="c3-item-m">{on ? 'выбрано' : e.cat}</span></button></li>;
          })}</ul>
          <div className="c3-row end"><button className="c3-btn primary" onClick={() => setPick(false)}>Готово</button></div>
        </Modal>
      )}
      {conf && (
        <Modal title="Показать решение?" onClose={() => setConf(false)}>
          <p>Вы увидите полную реконструкцию. Расследование будет считаться завершённым без вашей версии.</p>
          <div className="c3-row end"><button className="c3-btn ghost" onClick={() => setConf(false)}>Отмена</button><button className="c3-btn primary" onClick={() => { reveal(); setConf(false); }}>Показать</button></div>
        </Modal>
      )}
    </div>
  );
}

function Verdict({ v }: { v: V }) {
  return (
    <div className={'c3-verdict ' + v.verdict}>
      <h3>{v.headline} · {v.score}/100</h3>
      <p>{v.message}</p>
      <ul>{v.parts.map((p) => <li key={p.key} className={p.ok ? 'ok' : 'bad'}><span>{p.ok ? '✓' : '✕'}</span><span><b>{p.label}</b> — {p.note}</span></li>)}</ul>
    </div>
  );
}
export const _x = P3;
