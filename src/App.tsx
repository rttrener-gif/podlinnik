import { useMemo, useState } from 'react';
import { useGame } from './game/store';
import { NavCtx } from './components/common';
import type { ViewId } from './components/common';
import { Cover } from './components/Cover';
import { Materials } from './components/Materials';
import { People } from './components/People';
import { Requests, Journal, Notes } from './components/Simple';
import { Board } from './components/Board';
import { Timeline, Versions } from './components/Analysis';
import { Accuse } from './components/Accuse';
import { ALL_DOCS, CASE, REQUESTS } from './content';

const NAV: { id: ViewId; label: string; hint: string }[] = [
  { id: 'materials', label: 'Материалы', hint: 'документы и фото' },
  { id: 'people', label: 'Люди', hint: 'досье и допросы' },
  { id: 'requests', label: 'Запросы', hint: 'экспертизы' },
  { id: 'board', label: 'Доска', hint: 'связи улик' },
  { id: 'timeline', label: 'Хронология', hint: 'шкала событий' },
  { id: 'versions', label: 'Версии', hint: 'противоречия' },
  { id: 'notes', label: 'Заметки', hint: 'факты' },
  { id: 'journal', label: 'Журнал', hint: 'действия' },
  { id: 'accuse', label: 'Обвинение', hint: 'финал' },
];

export function App({ onExit }: { onExit?: () => void } = {}) {
  const g = useGame();
  const { state, progress, has, cond } = g;
  const [screen, setScreen] = useState<'cover' | 'game'>('cover');
  const [view, setView] = useState<ViewId>('materials');
  const [docId, setDocId] = useState<string | null>(null);
  const [personId, setPersonId] = useState<string | null>(null);

  const nav = useMemo(
    () => ({
      view,
      go: (v: ViewId) => setView(v),
      docId,
      openDoc: (id: string | null) => {
        setDocId(id);
        if (id) setView('materials');
      },
      personId,
      openPerson: (id: string | null) => {
        setPersonId(id);
        if (id) setView('people');
      },
    }),
    [view, docId, personId],
  );

  if (screen === 'cover' || !state.started) {
    return <Cover onEnter={() => setScreen('game')} onExit={onExit} />;
  }

  const unread = ALL_DOCS.filter((d) => has(d.id) && !state.seen.includes(d.id)).length;
  const openReq = REQUESTS.filter((r) => !state.reqDone.includes(r.id) && cond(r.requires)).length;
  const badge: Partial<Record<ViewId, number>> = { materials: unread, requests: openReq };

  return (
    <NavCtx.Provider value={nav}>
      <div className="app">
        <aside className="rail">
          <button className="brand" onClick={() => setScreen('cover')} title="На обложку дела">
            <span className="brand-name">{CASE.title}</span>
            <span className="brand-sub">дело № {CASE.number}</span>
          </button>
          <nav className="rail-nav" aria-label="Разделы расследования">
            {NAV.map((n) => (
              <button key={n.id} className={'rail-item' + (view === n.id ? ' active' : '')} onClick={() => setView(n.id)}>
                <span className="ri-label">{n.label}</span>
                <span className="ri-hint">{n.hint}</span>
                {!!badge[n.id] && <span className="ri-badge">{badge[n.id]}</span>}
              </button>
            ))}
          </nav>
          <div className="rail-foot">
            <div className="progress" title="Получено материалов дела">
              <div className="bar" style={{ width: progress + '%' }} />
            </div>
            <div className="muted small">
              {state.solved ? 'Дело раскрыто' : state.revealed ? 'Решение показано' : `Материалов получено: ${progress} %`}
            </div>
          </div>
        </aside>
        <main className="main">
          {view === 'materials' && <Materials />}
          {view === 'people' && <People />}
          {view === 'requests' && <Requests />}
          {view === 'board' && <Board />}
          {view === 'timeline' && <Timeline />}
          {view === 'versions' && <Versions />}
          {view === 'notes' && <Notes />}
          {view === 'journal' && <Journal />}
          {view === 'accuse' && <Accuse />}
        </main>
      </div>
    </NavCtx.Provider>
  );
}
