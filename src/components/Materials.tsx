import { useEffect, useMemo, useState } from 'react';
import { ALL_DOCS, DOC_BY_ID, PEOPLE_BY_ID } from '../content';
import { useGame } from '../game/store';
import { DocView } from './DocView';
import { KIND_LABEL, useNav } from './common';
import type { DocGroup } from '../types';

const GROUP_ORDER: DocGroup[] = [
  'Осмотр и фото',
  'Экспертизы',
  'Показания',
  'Переписка и записи',
  'Документы',
  'Данные и журналы',
];

export function Materials() {
  const { state, has, openDoc: markSeen, boardAdd, log } = useGame();
  const { docId, openDoc, openPerson, go } = useNav();
  const [q, setQ] = useState('');
  const [onlyNew, setOnlyNew] = useState(false);

  const docs = useMemo(() => ALL_DOCS.filter((d) => has(d.id)), [has, state.unlocked]);
  const filtered = docs.filter(
    (d) =>
      (!onlyNew || !state.seen.includes(d.id)) &&
      (d.title + ' ' + (d.subtitle ?? '') + ' ' + d.source).toLowerCase().includes(q.toLowerCase()),
  );

  const doc = docId ? DOC_BY_ID[docId] : null;

  useEffect(() => {
    if (docId && has(docId)) markSeen(docId);
  }, [docId]); // eslint-disable-line react-hooks/exhaustive-deps

  const newCount = docs.filter((d) => !state.seen.includes(d.id)).length;

  return (
    <div className={'split' + (doc ? ' has-detail' : '')}>
      <aside className="list-pane">
        <div className="pane-head">
          <h2>Материалы дела</h2>
          <div className="sub">
            {docs.length} из {ALL_DOCS.length} · не изучено: {newCount}
          </div>
        </div>
        <input className="inp" placeholder="Поиск по материалам…" value={q} onChange={(e) => setQ(e.target.value)} />
        <label className="check">
          <input type="checkbox" checked={onlyNew} onChange={(e) => setOnlyNew(e.target.checked)} /> только непрочитанные
        </label>
        {GROUP_ORDER.map((g) => {
          const items = filtered.filter((d) => d.group === g);
          if (!items.length) return null;
          return (
            <div key={g} className="group">
              <div className="group-title">{g}</div>
              {items.map((d) => {
                const isNew = !state.seen.includes(d.id);
                return (
                  <button key={d.id} className={'doc-item' + (docId === d.id ? ' active' : '')} onClick={() => openDoc(d.id)}>
                    <span className={'kind-badge k-' + d.kind}>{KIND_LABEL[d.kind]}</span>
                    <span className="di-body">
                      <span className="di-title">
                        {isNew && <i className="new-dot" aria-label="не изучено" />}
                        {d.title}
                      </span>
                      <span className="di-sub">{d.subtitle ?? d.source}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          );
        })}
        {filtered.length === 0 && <p className="muted pad">Нет материалов по фильтру.</p>}
      </aside>

      <section className="detail-pane">
        {doc ? (
          <>
            <div className="detail-bar">
              <button className="btn ghost small back-btn" onClick={() => openDoc(null)}>
                ← К списку
              </button>
              <div className="spacer" />
              <button
                className="btn small"
                onClick={() => {
                  boardAdd('doc:' + doc.id);
                  log('board', `На доску добавлен материал: «${doc.title}».`);
                  go('board');
                }}
              >
                Положить на доску
              </button>
            </div>
            {doc.people && doc.people.length > 0 && (
              <div className="chips">
                <span className="muted">Касается:</span>
                {doc.people.map((p) => (
                  <button key={p} className="chip" onClick={() => openPerson(p)}>
                    {PEOPLE_BY_ID[p]?.short ?? p}
                  </button>
                ))}
              </div>
            )}
            <DocView doc={doc} />
            <p className="hint">
              Отмечайте важные фразы значком ★ — они попадут в раздел «Заметки» и на доску расследования.
            </p>
          </>
        ) : (
          <div className="empty">
            <div className="empty-title">Выберите материал слева</div>
            <p>
              Все документы открываются отдельно. Новые материалы появляются по мере допросов и запросов следователя — в разделах «Люди»
              и «Запросы».
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
