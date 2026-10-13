import { useState } from 'react';
import { DOC_BY_ID, INTERVIEW_BY_PERSON, PEOPLE, PEOPLE_BY_ID, REQUESTS } from '../content';
import { useGame } from '../game/store';
import { fmtTime, useNav } from './common';

function lockedHint(req: string[]): string {
  const t = req.join(' ');
  if (/ask:|show:|flag:/.test(t)) return 'Основание появится по итогам допроса или предъявления материалов.';
  if (/seen:/.test(t)) return 'Основание появится после внимательного изучения материалов.';
  return 'Основание появится, когда в деле будут нужные материалы.';
}

export function Requests() {
  const { state, cond, doRequest } = useGame();
  const { openDoc } = useNav();
  const [flash, setFlash] = useState<string | null>(null);

  const done = REQUESTS.filter((r) => state.reqDone.includes(r.id));
  const open = REQUESTS.filter((r) => !state.reqDone.includes(r.id) && cond(r.requires));
  const locked = REQUESTS.filter((r) => !state.reqDone.includes(r.id) && !cond(r.requires));

  return (
    <div className="page">
      <div className="pane-head">
        <h2>Запросы и экспертизы</h2>
        <div className="sub">Процессуальные действия следователя. Для каждого нужны основания — они появляются по мере работы с материалами и допросов.</div>
      </div>

      {flash && <div className="flash">{flash}</div>}

      <h3 className="sec">Можно направить сейчас · {open.length}</h3>
      {open.length === 0 && <p className="muted">Пока доступных запросов нет. Изучайте материалы и допрашивайте участников.</p>}
      <div className="req-grid">
        {open.map((r) => (
          <div className="req-card" key={r.id}>
            <h4>{r.title}</h4>
            <p>{r.text}</p>
            <p className="muted small">{r.hint}</p>
            <button
              className="btn primary"
              onClick={() => {
                doRequest(r.id);
                setFlash(r.result);
                window.setTimeout(() => setFlash(null), 4500);
              }}
            >
              Направить запрос
            </button>
          </div>
        ))}
      </div>

      <h3 className="sec">Выполнено · {done.length}</h3>
      <div className="req-grid">
        {done.map((r) => (
          <div className="req-card done" key={r.id}>
            <h4>{r.title}</h4>
            <p className="muted small">{r.result}</p>
            <div className="chips">
              {r.gives.map((g) => (
                <button key={g} className="chip doc" onClick={() => openDoc(g)}>
                  {DOC_BY_ID[g]?.title}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {locked.length > 0 && (
        <>
          <h3 className="sec">Пока недоступно · {locked.length}</h3>
          <p className="muted small">Названия скрыты, чтобы не подсказывать, где искать. Основание появится само, когда вы получите нужные сведения.</p>
          <div className="req-grid">
            {locked.map((r, i) => (
              <div className="req-card locked" key={r.id}>
                <h4>Запрос № {String(i + 1).padStart(2, '0')}</h4>
                <p className="muted small">{lockedHint(r.requires)}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export function Journal() {
  const { state, has, cond } = useGame();
  const unread = Object.keys(DOC_BY_ID).filter((id) => has(id) && !state.seen.includes(id)).length;
  const reqs = REQUESTS.filter((r) => !state.reqDone.includes(r.id) && cond(r.requires)).length;
  const people = PEOPLE.filter((p) => p.group !== 'victim').map((p) => ({
    p,
    n: (INTERVIEW_BY_PERSON[p.id]?.questions ?? []).filter((q) => !state.asked.includes(`${p.id}.${q.id}`) && cond(q.requires)).length,
  })).filter((x) => x.n > 0 && (x.p.id !== 'elena' || has('elena-1')));
  const items = [...state.journal].reverse();
  const kindLabel: Record<string, string> = {
    doc: 'материал',
    ask: 'допрос',
    show: 'улика',
    req: 'запрос',
    board: 'доска',
    note: 'заметка',
    sys: 'система',
    final: 'обвинение',
  };
  return (
    <div className="page narrow">
      <div className="pane-head">
        <h2>Журнал расследования</h2>
        <div className="sub">Автоматический учёт ваших действий и поступивших материалов.</div>
      </div>
      <div className="card">
        <b>Что ещё не сделано</b>
        <ul className="plain-list">
          <li>Неизученных материалов: {unread}</li>
          <li>Доступных запросов: {reqs}</li>
          <li>
            Неспрошенные вопросы:{' '}
            {people.length ? people.map((x) => `${x.p.short} — ${x.n}`).join('; ') : 'нет'}
          </li>
          <li className="muted small">Когда у вас появляются новые материалы, возвращайтесь к допрошенным и предъявляйте их снова: реакция может измениться.</li>
        </ul>
      </div>
      <ol className="journal">
        {items.map((e, i) => (
          <li key={i} className={'j-' + e.kind}>
            <span className="j-time">{fmtTime(e.at)}</span>
            <span className="j-kind">{kindLabel[e.kind]}</span>
            <span className="j-text">{e.text}</span>
          </li>
        ))}
        {items.length === 0 && <li className="muted">Записей пока нет.</li>}
      </ol>
    </div>
  );
}

export function Notes() {
  const { state, setNotes, unpin } = useGame();
  const { openDoc } = useNav();
  const [tab, setTab] = useState<'notes' | 'facts'>('facts');

  return (
    <div className="page narrow">
      <div className="pane-head">
        <h2>Заметки и факты</h2>
        <div className="sub">Личные записи следователя. Сохраняются автоматически.</div>
      </div>
      <nav className="tabs">
        <button className={tab === 'facts' ? 'on' : ''} onClick={() => setTab('facts')}>
          Отмеченные факты ({state.pins.length})
        </button>
        <button className={tab === 'notes' ? 'on' : ''} onClick={() => setTab('notes')}>
          Мои заметки
        </button>
      </nav>

      {tab === 'notes' && (
        <textarea
          className="notes-area"
          placeholder="Рабочие версии, вопросы к допрашиваемым, расчёты времени…"
          value={state.notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      )}

      {tab === 'facts' && (
        <div className="facts-list">
          {state.pins.length === 0 && (
            <p className="muted">
              Отмечайте звёздочкой ★ строки в документах и записи допросов — они соберутся здесь и их можно положить на доску.
            </p>
          )}
          {state.pins.map((p) => {
            const doc = DOC_BY_ID[p.docId];
            const person = p.docId.startsWith('iv:') ? PEOPLE_BY_ID[p.docId.slice(3)] : null;
            return (
              <div className="fact" key={p.id}>
                <div className="fact-text">{p.text}</div>
                <div className="fact-src">
                  {doc ? (
                    <button className="linklike" onClick={() => openDoc(p.docId)}>
                      {doc.title}
                    </button>
                  ) : person ? (
                    <span>Допрос: {person.short}</span>
                  ) : null}
                  <button className="linklike danger" onClick={() => unpin(p.id)}>
                    убрать
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
