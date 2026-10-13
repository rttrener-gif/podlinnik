import { useEffect, useState } from 'react';
import { useC2 } from '../state';
import { EVIDENCE } from '../data/evidence';
import { EvThumb, Modal } from './Common';
import type { Verdict } from '../data/finale';

type Lazy = typeof import('../data/finale');

export function FinaleScreen() {
  const { s, attempt, reveal } = useC2();
  const [fin, setFin] = useState<Lazy | null>(null);
  const [ans, setAns] = useState<Record<string, string>>({});
  const [ev, setEv] = useState<string[]>([]);
  const [rej, setRej] = useState<string[]>([]);
  const [sum, setSum] = useState('');
  const [pick, setPick] = useState(false);
  const [res, setRes] = useState<Verdict | null>(null);
  const [conf, setConf] = useState(false);
  useEffect(() => { void import('../data/finale').then(setFin); }, []);
  if (!fin) return <div className="c2-page"><p className="c2-muted">Загрузка…</p></div>;
  const done = s.solved || s.revealed;
  const full = fin.QUESTIONS.every((q) => ans[q.id]) && ev.length > 0;

  const submit = () => {
    const v = fin.judge({ ans, evidence: ev, rejected: rej, summary: sum });
    setRes(v);
    attempt(v.verdict, v.score, v.verdict === 'solved');
  };

  if (done) return <Epilogue fin={fin} solved={s.solved} res={res} />;

  return (
    <div className="c2-page narrow">
      <h2 className="c2-h">Итоговая версия</h2>
      <p className="c2-muted">Реконструкция: что произошло, как, кто причастен и чем это доказано. Если вы ошибётесь в детали, прогресс не пропадёт — можно уточнить и подать снова.</p>
      {s.attempts.length > 0 && <div className="c2-card">Попыток: {s.attempts.length}. Последняя оценка: {s.attempts[s.attempts.length - 1].score} из 100.</div>}
      {fin.QUESTIONS.map((q, n) => (
        <section key={q.id} className="c2-q-sec">
          <h3><span className="c2-num">{n + 1}</span>{q.title}</h3>
          {q.opts.map((o) => (
            <label key={o.id} className={'c2-opt' + (ans[q.id] === o.id ? ' on' : '')}>
              <input type="radio" name={q.id} checked={ans[q.id] === o.id} onChange={() => setAns({ ...ans, [q.id]: o.id })} />
              <span>{o.text}</span>
            </label>
          ))}
        </section>
      ))}
      <section className="c2-q-sec">
        <h3><span className="c2-num">8</span>Какие первоначальные предположения оказались ошибочными?</h3>
        {fin.WRONG_ASSUMPTIONS.map((w) => (
          <label key={w.id} className={'c2-opt' + (rej.includes(w.id) ? ' on' : '')}>
            <input type="checkbox" checked={rej.includes(w.id)} onChange={() => setRej(rej.includes(w.id) ? rej.filter((x) => x !== w.id) : [...rej, w.id])} />
            <span>{w.text}</span>
          </label>
        ))}
        <p className="c2-muted small">Отметьте только те утверждения, которые вы считаете опровергнутыми материалами.</p>
      </section>
      <section className="c2-q-sec">
        <h3><span className="c2-num">9</span>Доказательства (до 10)</h3>
        <div className="c2-chips">{ev.map((e) => <span key={e} className="c2-chip static">{EVIDENCE.find((x) => x.id === e)?.title}</span>)}{ev.length === 0 && <span className="c2-muted">Не выбрано</span>}</div>
        <button className="c2-btn" onClick={() => setPick(true)}>Выбрать материалы</button>
      </section>
      <section className="c2-q-sec">
        <h3><span className="c2-num">10</span>Изложите версию своими словами</h3>
        <textarea className="c2-notes" value={sum} onChange={(e) => setSum(e.target.value)} placeholder="Что произошло в ту ночь? Почему она ушла? Кто и как этим воспользовался?" />
      </section>
      <div className="c2-row end wrap">
        <button className="c2-btn ghost danger" onClick={() => setConf(true)}>Показать решение</button>
        <button className="c2-btn primary" disabled={!full} onClick={submit}>Подать реконструкцию</button>
      </div>
      {res && <VerdictBox v={res} />}
      {pick && (
        <Modal title="Доказательства" onClose={() => setPick(false)} wide>
          <div className="c2-grid small">{s.ev.map((e) => <EvThumb key={e} id={e} mark={ev.includes(e) ? 'выбрано' : undefined} onClick={() => setEv(ev.includes(e) ? ev.filter((x) => x !== e) : ev.length < 10 ? [...ev, e] : ev)} />)}</div>
          <div className="c2-row end"><button className="c2-btn primary" onClick={() => setPick(false)}>Готово</button></div>
        </Modal>
      )}
      {conf && (
        <Modal title="Показать решение?" onClose={() => setConf(false)}>
          <p>Вы увидите полную реконструкцию. Расследование будет считаться завершённым без вашей версии.</p>
          <div className="c2-row end"><button className="c2-btn ghost" onClick={() => setConf(false)}>Отмена</button><button className="c2-btn danger" onClick={() => { reveal(); setConf(false); }}>Показать</button></div>
        </Modal>
      )}
    </div>
  );
}

function VerdictBox({ v }: { v: Verdict }) {
  return (
    <div className={'c2-verdict ' + v.verdict}>
      <h3>{v.headline} · {v.score}/100</h3>
      <p>{v.message}</p>
      <ul>{v.parts.map((p) => <li key={p.key} className={p.ok ? 'ok' : 'bad'}><span>{p.ok ? '✓' : '✕'}</span><span><b>{p.label}</b> — {p.note}</span></li>)}</ul>
    </div>
  );
}

function Epilogue({ fin, solved, res }: { fin: Lazy; solved: boolean; res: Verdict | null }) {
  return (
    <div className="c2-page narrow">
      <div className="c2-stamp">{solved ? 'ДЕЛО РАСКРЫТО' : 'ДЕЛО ЗАВЕРШЕНО'}</div>
      <h2 className="c2-h">Реконструкция дела «Тихо-тихо»</h2>
      {res && <VerdictBox v={res} />}
      {fin.EPILOGUE.map((b) => (
        <section key={b.h} className="c2-epi"><h3>{b.h}</h3>{b.p.map((t, i) => <p key={i}>{t}</p>)}</section>
      ))}
    </div>
  );
}
