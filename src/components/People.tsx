import { useEffect, useMemo, useRef, useState } from 'react';
import { ALL_DOCS, INTERVIEW_BY_PERSON, PEOPLE, PEOPLE_BY_ID } from '../content';
import { useGame } from '../game/store';
import { Avatar, DocPicker, KIND_LABEL, useNav } from './common';
import { Rich } from './DocView';

type Tab = 'dossier' | 'interrogation' | 'testimony' | 'materials';

export function People() {
  const { personId, openPerson } = useNav();
  const { has, state, cond } = useGame();
  const fresh = (pid: string) => {
    const iv = INTERVIEW_BY_PERSON[pid];
    return iv ? iv.questions.filter((q) => !state.asked.includes(`${pid}.${q.id}`) && cond(q.requires)).length : 0;
  };
  const visible = PEOPLE.filter((p) => p.id !== 'elena' || has('elena-1'));
  const person = personId ? PEOPLE_BY_ID[personId] : null;

  const groups: [string, typeof PEOPLE][] = [
    ['Потерпевший', visible.filter((p) => p.group === 'victim')],
    ['Подозреваемые', visible.filter((p) => p.group === 'suspect')],
    ['Свидетели', visible.filter((p) => p.group === 'witness')],
  ];

  return (
    <div className={'split' + (person ? ' has-detail' : '')}>
      <aside className="list-pane">
        <div className="pane-head">
          <h2>Люди по делу</h2>
          <div className="sub">Досье, показания, допросы</div>
        </div>
        {groups.map(([title, list]) =>
          list.length ? (
            <div className="group" key={title}>
              <div className="group-title">{title}</div>
              {list.map((p) => (
                <button key={p.id} className={'person-item' + (personId === p.id ? ' active' : '')} onClick={() => openPerson(p.id)}>
                  <Avatar id={p.id} size={46} />
                  <span className="pi-body">
                    <span className="pi-name">{p.name}</span>
                    <span className="pi-role">{p.role}</span>
                  </span>
                  {fresh(p.id) > 0 && p.group !== 'victim' && <span className="ri-badge inline" title="Неспрошенных вопросов">{fresh(p.id)}</span>}
                </button>
              ))}
            </div>
          ) : null,
        )}
      </aside>
      <section className="detail-pane">
        {person ? (
          <Dossier key={person.id} id={person.id} />
        ) : (
          <div className="empty">
            <div className="empty-title">Выберите человека</div>
            <p>
              Изучите досье, сверьте показания с материалами и проводите допросы: выбирайте вопросы и предъявляйте улики. Ответы
              зависят от того, что вам уже известно.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

function Dossier({ id }: { id: string }) {
  const p = PEOPLE_BY_ID[id];
  const { state, has, boardAdd, log } = useGame();
  const { go, openPerson } = useNav();
  const canInterrogate = p.group !== 'victim' && !!INTERVIEW_BY_PERSON[id];
  const [tab, setTab] = useState<Tab>('dossier');
  const mats = ALL_DOCS.filter((d) => d.people?.includes(id) && has(d.id));
  const records = state.testimony.filter((t) => t.person === id);

  return (
    <div className="dossier">
      <div className="detail-bar">
        <button className="btn ghost small back-btn" onClick={() => openPerson(null)}>
          ← К списку
        </button>
        <div className="spacer" />
        <button
          className="btn small"
          onClick={() => {
            boardAdd('person:' + id);
            log('board', `На доску добавлена карточка: ${p.name}.`);
            go('board');
          }}
        >
          Положить на доску
        </button>
      </div>
      <header className="dos-head">
        <Avatar id={id} size={84} />
        <div>
          <h2>{p.name}</h2>
          <div className="dos-role">
            {p.role} · {p.age} лет
          </div>
          <div className="dos-tag">{p.tagline}</div>
        </div>
      </header>
      <nav className="tabs">
        <button className={tab === 'dossier' ? 'on' : ''} onClick={() => setTab('dossier')}>
          Досье
        </button>
        {canInterrogate && (
          <button className={tab === 'interrogation' ? 'on' : ''} onClick={() => setTab('interrogation')}>
            Допрос
          </button>
        )}
        <button className={tab === 'testimony' ? 'on' : ''} onClick={() => setTab('testimony')}>
          Показания{records.length ? ` (${records.length})` : ''}
        </button>
        <button className={tab === 'materials' ? 'on' : ''} onClick={() => setTab('materials')}>
          Материалы{mats.length ? ` (${mats.length})` : ''}
        </button>
      </nav>

      {tab === 'dossier' && (
        <div className="dos-body">
          {p.bio.map((t, i) => (
            <p key={i}>{t}</p>
          ))}
          <dl className="facts">
            {p.facts.map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
          <p className="hint">Досье содержит только то, что известно следствию на сегодня. Остальное — в материалах и на допросах.</p>
        </div>
      )}
      {tab === 'interrogation' && canInterrogate && <Interrogation id={id} />}
      {tab === 'testimony' && <Testimony id={id} />}
      {tab === 'materials' && (
        <div className="dos-body">
          {mats.length === 0 && <p className="muted">Материалов, где упомянут этот человек, пока нет.</p>}
          <ul className="plain-list">
            {mats.map((d) => (
              <MatLink key={d.id} id={d.id} />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function MatLink({ id }: { id: string }) {
  const { openDoc } = useNav();
  const d = ALL_DOCS.find((x) => x.id === id)!;
  return (
    <li>
      <button className="linklike" onClick={() => openDoc(id)}>
        <span className={'kind-badge k-' + d.kind}>{KIND_LABEL[d.kind]}</span> {d.title}
      </button>
    </li>
  );
}

function Testimony({ id }: { id: string }) {
  const { state, pin, unpin } = useGame();
  const records = state.testimony.filter((t) => t.person === id);
  const docKey = 'iv:' + id;
  if (!records.length)
    return (
      <div className="dos-body">
        <p className="muted">Показаний пока нет. Проведите допрос или изучите объяснения в материалах дела.</p>
      </div>
    );
  return (
    <div className="dos-body">
      {records.map((r) => {
        const text = `${r.q} — ${r.a}`;
        const pinned = state.pins.find((p) => p.docId === docKey && p.text === text);
        return (
          <div className={'rec' + (pinned ? ' pinned' : '')} key={r.id}>
            <div className="rec-q">{r.q}</div>
            <div className="rec-a">
              <Rich text={r.a} />
            </div>
            <button className={'pin-btn text' + (pinned ? ' on' : '')} onClick={() => (pinned ? unpin(pinned.id) : pin(docKey, text))}>
              {pinned ? '★ в фактах' : '☆ в факты'}
            </button>
          </div>
        );
      })}
    </div>
  );
}

function Interrogation({ id }: { id: string }) {
  const iv = INTERVIEW_BY_PERSON[id];
  const { state, cond, ask, show, has } = useGame();
  const [picker, setPicker] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const log = state.testimony.filter((t) => t.person === id);

  const available = useMemo(
    () => iv.questions.filter((q) => !state.asked.includes(`${id}.${q.id}`) && cond(q.requires)),
    [iv, state, cond, id],
  );
  const hiddenLeft = iv.questions.filter((q) => !state.asked.includes(`${id}.${q.id}`) && !cond(q.requires)).length;
  const shownKeys = state.shown.filter((s) => s.startsWith(id + '.')).map((s) => s.slice(id.length + 1));
  const person = PEOPLE_BY_ID[id];

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [log.length]);

  return (
    <div className="interrogation">
      <div className="iv-log">
        <div className="iv-intro">
          <Rich text={iv.intro} />
        </div>
        {log.map((r) => (
          <div key={r.id} className="iv-turn">
            <div className={'iv-q' + (r.via === 'show' ? ' show' : '')}>
              <span className="who">Следователь</span>
              {r.q}
            </div>
            <div className="iv-a">
              <Avatar id={id} size={34} />
              <div className="iv-bubble">
                <span className="who">{person.short}</span>
                <Rich text={r.a} />
              </div>
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <div className="iv-controls">
        <div className="iv-title">Вопросы</div>
        {available.length === 0 && <p className="muted small">Доступных вопросов нет. Изучайте материалы и предъявляйте улики.</p>}
        <div className="q-list">
          {available.map((q) => (
            <button key={q.id} className="q-btn" onClick={() => ask(id, q)}>
              {q.text}
            </button>
          ))}
        </div>
        {hiddenLeft > 0 && (
          <p className="muted small">Часть вопросов откроется, когда у вас появятся основания — новые материалы или ответы.</p>
        )}
        <div className="iv-title">Улики</div>
        <button className="btn" onClick={() => setPicker(true)}>
          Предъявить материал дела…
        </button>
        {note && <div className="flash">{note}</div>}
        <p className="muted small">
          Предъявляйте только материалы, которые у вас есть. Реакция зависит от того, что именно вы показываете и что известно допрашиваемому.
        </p>
      </div>

      {picker && (
        <DocPicker
          title={`Предъявить: ${person.short}`}
          mark={shownKeys.filter((k) => has(k))}
          onClose={() => setPicker(false)}
          onPick={(docId) => {
            const r = show(id, docId);
            if (r === 'dup') {
              setNote('Этот материал уже предъявлялся, новых сведений у допрашиваемого нет. Вернитесь к нему, когда появятся новые данные.');
              window.setTimeout(() => setNote(null), 5000);
            }
          }}
        />
      )}
    </div>
  );
}
