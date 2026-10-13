import { useState } from 'react';
import { DOC_BY_ID, METHOD_OPTIONS, MOTIVE_OPTIONS, PEOPLE_BY_ID } from '../content';
import { useGame } from '../game/store';
import { DocPicker, useNav, useVisiblePeople } from './common';
import type { Version } from '../types';

// ───────────── Хронология ─────────────

export function Timeline() {
  const { state, addTimeline, delTimeline } = useGame();
  const PEOPLE = useVisiblePeople();
  const { openDoc } = useNav();
  const [day, setDay] = useState<'fri' | 'sat'>('fri');
  const [time, setTime] = useState('23:00');
  const [text, setText] = useState('');
  const [person, setPerson] = useState('');
  const [docId, setDocId] = useState('');
  const [picker, setPicker] = useState(false);
  const [filter, setFilter] = useState('');

  const items = state.timeline
    .filter((t) => !filter || t.person === filter)
    .slice()
    .sort((a, b) => {
      const ka = (a.day === 'fri' ? '0' : '1') + (a.time < '12:00' && a.day === 'fri' ? '1' : '0') + a.time;
      const kb = (b.day === 'fri' ? '0' : '1') + (b.time < '12:00' && b.day === 'fri' ? '1' : '0') + b.time;
      return ka.localeCompare(kb);
    });

  const submit = () => {
    if (!text.trim() || !/^\d{2}:\d{2}$/.test(time)) return;
    addTimeline({ day, time, text: text.trim(), person: person || undefined, docId: docId || undefined });
    setText('');
    setDocId('');
  };

  return (
    <div className="page">
      <div className="pane-head">
        <h2>Хронология событий</h2>
        <div className="sub">Постройте собственную шкалу: записывайте только то, что подтверждено источником.</div>
      </div>

      <div className="card form-card">
        <div className="form-grid">
          <label>
            День
            <select className="inp" value={day} onChange={(e) => setDay(e.target.value as 'fri' | 'sat')}>
              <option value="fri">Пятница, 8 ноября</option>
              <option value="sat">Суббота, 9 ноября</option>
            </select>
          </label>
          <label>
            Время
            <input className="inp" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
          </label>
          <label>
            Лицо
            <select className="inp" value={person} onChange={(e) => setPerson(e.target.value)}>
              <option value="">— не указано —</option>
              {PEOPLE.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.short}
                </option>
              ))}
            </select>
          </label>
        </div>
        <label>
          Событие
          <input
            className="inp"
            placeholder="Что произошло? Например: «Хлопает дверь на террасу»"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
          />
        </label>
        <div className="row wrap">
          <button className="btn small" onClick={() => setPicker(true)}>
            {docId ? 'Источник: ' + (DOC_BY_ID[docId]?.title ?? docId) : 'Указать источник…'}
          </button>
          {docId && (
            <button className="btn ghost small" onClick={() => setDocId('')}>
              убрать источник
            </button>
          )}
          <div className="spacer" />
          <button className="btn primary" onClick={submit}>
            Добавить на шкалу
          </button>
        </div>
      </div>

      <div className="row wrap">
        <label className="inline">
          Показать только:
          <select className="inp" value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="">все</option>
            {PEOPLE.map((p) => (
              <option key={p.id} value={p.id}>
                {p.short}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="timeline">
        {(['fri', 'sat'] as const).map((d) => {
          const list = items.filter((t) => t.day === d);
          return (
            <div key={d} className="tl-day">
              <div className="tl-day-title">{d === 'fri' ? 'Пятница, 8 ноября' : 'Суббота, 9 ноября'}</div>
              {list.length === 0 && <div className="muted small pad">Записей нет.</div>}
              {list.map((t) => (
                <div className="tl-item" key={t.id}>
                  <div className="tl-time">{t.time}</div>
                  <div className="tl-dot" />
                  <div className="tl-body">
                    <div>{t.text}</div>
                    <div className="tl-meta">
                      {t.person && <span className="chip static">{PEOPLE_BY_ID[t.person]?.short}</span>}
                      {t.docId && DOC_BY_ID[t.docId] && (
                        <button className="chip doc" onClick={() => openDoc(t.docId!)}>
                          {DOC_BY_ID[t.docId].title}
                        </button>
                      )}
                      <button className="linklike danger" onClick={() => delTimeline(t.id)}>
                        удалить
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {picker && <DocPicker title="Источник события" onClose={() => setPicker(false)} onPick={(id) => setDocId(id)} />}
    </div>
  );
}

// ───────────── Версии и противоречия ─────────────

const emptyVersion = (): Omit<Version, 'id'> & { id?: string } => ({
  title: '',
  suspect: '',
  motive: '',
  method: '',
  evidence: [],
  note: '',
});

export function Versions() {
  const { state, versionSave, versionDel, contraAdd, contraDel } = useGame();
  const PEOPLE = useVisiblePeople();
  const { openDoc } = useNav();
  const [tab, setTab] = useState<'versions' | 'contra'>('versions');
  const [edit, setEdit] = useState<(Omit<Version, 'id'> & { id?: string }) | null>(null);
  const [picker, setPicker] = useState<'version' | 'contra' | null>(null);

  const [cPerson, setCPerson] = useState('');
  const [cClaim, setCClaim] = useState('');
  const [cNote, setCNote] = useState('');
  const [cEv, setCEv] = useState<string[]>([]);

  return (
    <div className="page">
      <div className="pane-head">
        <h2>Версии и противоречия</h2>
        <div className="sub">Формулируйте версии, фиксируйте расхождения в показаниях и алиби. Подсказок здесь нет: это ваша рабочая карта.</div>
      </div>
      <nav className="tabs">
        <button className={tab === 'versions' ? 'on' : ''} onClick={() => setTab('versions')}>
          Версии ({state.versions.length})
        </button>
        <button className={tab === 'contra' ? 'on' : ''} onClick={() => setTab('contra')}>
          Противоречия ({state.contradictions.length})
        </button>
      </nav>

      {tab === 'versions' && (
        <>
          {!edit && (
            <button className="btn primary" onClick={() => setEdit(emptyVersion())}>
              + Новая версия
            </button>
          )}
          {edit && (
            <div className="card form-card">
              <label>
                Название версии
                <input className="inp" value={edit.title} onChange={(e) => setEdit({ ...edit, title: e.target.value })} placeholder="Например: «Падение после ссоры»" />
              </label>
              <div className="form-grid">
                <label>
                  Кто, по этой версии
                  <select className="inp" value={edit.suspect} onChange={(e) => setEdit({ ...edit, suspect: e.target.value })}>
                    <option value="">— не определён / несчастный случай —</option>
                    {PEOPLE.filter((p) => p.group !== 'victim').map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Предполагаемый мотив
                  <select className="inp" value={edit.motive} onChange={(e) => setEdit({ ...edit, motive: e.target.value })}>
                    <option value="">— не выбран —</option>
                    {MOTIVE_OPTIONS.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.text}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <label>
                Как это произошло
                <select className="inp" value={edit.method} onChange={(e) => setEdit({ ...edit, method: e.target.value })}>
                  <option value="">— не выбран —</option>
                  {METHOD_OPTIONS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.text}
                    </option>
                  ))}
                </select>
              </label>
              <div>
                <div className="lbl">Подтверждающие материалы</div>
                <div className="chips">
                  {edit.evidence.map((e) => (
                    <span key={e} className="chip static">
                      {DOC_BY_ID[e]?.title}
                    </span>
                  ))}
                  <button className="btn small" onClick={() => setPicker('version')}>
                    Выбрать материалы…
                  </button>
                </div>
              </div>
              <label>
                Рассуждение, слабые места
                <textarea className="inp" rows={4} value={edit.note} onChange={(e) => setEdit({ ...edit, note: e.target.value })} />
              </label>
              <div className="row end">
                <button className="btn ghost" onClick={() => setEdit(null)}>
                  Отмена
                </button>
                <button
                  className="btn primary"
                  onClick={() => {
                    if (!edit.title.trim()) return;
                    versionSave(edit as Omit<Version, 'id'> & { id?: string });
                    setEdit(null);
                  }}
                >
                  Сохранить версию
                </button>
              </div>
            </div>
          )}
          <div className="cards">
            {state.versions.map((v) => (
              <div className="card" key={v.id}>
                <h4>{v.title}</h4>
                <dl className="facts compact">
                  <div>
                    <dt>Кто</dt>
                    <dd>{v.suspect ? PEOPLE_BY_ID[v.suspect]?.name : '—'}</dd>
                  </div>
                  <div>
                    <dt>Мотив</dt>
                    <dd>{MOTIVE_OPTIONS.find((m) => m.id === v.motive)?.text ?? '—'}</dd>
                  </div>
                  <div>
                    <dt>Способ</dt>
                    <dd>{METHOD_OPTIONS.find((m) => m.id === v.method)?.text ?? '—'}</dd>
                  </div>
                </dl>
                {v.evidence.length > 0 && (
                  <div className="chips">
                    {v.evidence.map((e) => (
                      <button key={e} className="chip doc" onClick={() => openDoc(e)}>
                        {DOC_BY_ID[e]?.title}
                      </button>
                    ))}
                  </div>
                )}
                {v.note && <p className="muted">{v.note}</p>}
                <div className="row">
                  <button className="btn small" onClick={() => setEdit(v)}>
                    Изменить
                  </button>
                  <button className="btn ghost small danger" onClick={() => versionDel(v.id)}>
                    Удалить
                  </button>
                </div>
              </div>
            ))}
            {state.versions.length === 0 && !edit && <p className="muted">Версий пока нет.</p>}
          </div>
        </>
      )}

      {tab === 'contra' && (
        <>
          <div className="card form-card">
            <div className="form-grid">
              <label>
                Чьи показания
                <select className="inp" value={cPerson} onChange={(e) => setCPerson(e.target.value)}>
                  <option value="">— выберите —</option>
                  {PEOPLE.filter((p) => p.group !== 'victim').map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <label>
              Утверждение (что сказал / написал)
              <textarea className="inp" rows={2} value={cClaim} onChange={(e) => setCClaim(e.target.value)} />
            </label>
            <div>
              <div className="lbl">Чем опровергается</div>
              <div className="chips">
                {cEv.map((e) => (
                  <span key={e} className="chip static">
                    {DOC_BY_ID[e]?.title}
                  </span>
                ))}
                <button className="btn small" onClick={() => setPicker('contra')}>
                  Выбрать материалы…
                </button>
              </div>
            </div>
            <label>
              Пояснение
              <input className="inp" value={cNote} onChange={(e) => setCNote(e.target.value)} />
            </label>
            <div className="row end">
              <button
                className="btn primary"
                onClick={() => {
                  if (!cPerson || !cClaim.trim()) return;
                  contraAdd({ person: cPerson, claim: cClaim.trim(), evidence: cEv, note: cNote.trim() });
                  setCClaim('');
                  setCNote('');
                  setCEv([]);
                }}
              >
                Зафиксировать противоречие
              </button>
            </div>
          </div>
          <div className="cards">
            {state.contradictions.map((c) => (
              <div className="card contra" key={c.id}>
                <div className="contra-who">{PEOPLE_BY_ID[c.person]?.name}</div>
                <blockquote>{c.claim}</blockquote>
                {c.evidence.length > 0 && (
                  <div className="chips">
                    <span className="muted">Опровергают:</span>
                    {c.evidence.map((e) => (
                      <button key={e} className="chip doc" onClick={() => openDoc(e)}>
                        {DOC_BY_ID[e]?.title}
                      </button>
                    ))}
                  </div>
                )}
                {c.note && <p className="muted">{c.note}</p>}
                <button className="btn ghost small danger" onClick={() => contraDel(c.id)}>
                  Удалить
                </button>
              </div>
            ))}
            {state.contradictions.length === 0 && <p className="muted">Противоречий пока не зафиксировано.</p>}
          </div>
        </>
      )}

      {picker === 'version' && edit && (
        <DocPicker
          title="Материалы к версии"
          multi
          selected={edit.evidence}
          onToggle={(id) =>
            setEdit({ ...edit, evidence: edit.evidence.includes(id) ? edit.evidence.filter((x) => x !== id) : [...edit.evidence, id] })
          }
          onClose={() => setPicker(null)}
        />
      )}
      {picker === 'contra' && (
        <DocPicker
          title="Чем опровергается"
          multi
          selected={cEv}
          onToggle={(id) => setCEv((l) => (l.includes(id) ? l.filter((x) => x !== id) : [...l, id]))}
          onClose={() => setPicker(null)}
        />
      )}
    </div>
  );
}
