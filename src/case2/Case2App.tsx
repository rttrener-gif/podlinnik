import { useEffect, useMemo, useState } from 'react';
import { Case2Provider, useC2 } from './state';
import { NavCtx2 } from './ui/nav';
import type { Screen } from './ui/nav';
import { Hub } from './ui/Hub';
import { PlacesMap, PlaceView } from './ui/Places';
import { EvidenceScreen, EvidenceModal } from './ui/Evidence';
import { PhoneView } from './ui/Phone';
import { CctvView } from './ui/Cctv';
import { SpectroView } from './ui/Audio';
import { PeopleScreen, InterviewScreen } from './ui/People2';
import { RequestsScreen, InsightsScreen, TimelineScreen, MessagesScreen, NotesScreen, HintModal, Toasts } from './ui/Misc';
import { BoardScreen } from './ui/Board2';
import { FinaleScreen } from './ui/Finale2';
import { Modal, SoundPanel } from './ui/Common';
import { CoverCase2 } from './ui/Cover2';
import { unlock, stopAmbient, sfx } from './audio';
import './case2.css';

const TITLES: Record<Screen, string> = {
  hub: 'Рабочий стол', places: 'Карта', place: 'Осмотр', evidence: 'Улики', phone: 'Телефон Алины', cctv: 'Камеры', spectro: 'Анализатор',
  people: 'Люди', interview: 'Допрос', requests: 'Запросы', board: 'Доска', timeline: 'Хронология', insights: 'Инсайты', finale: 'Итоговая версия',
  messages: 'Мой телефон', notes: 'Заметки',
};

function Inner({ onExit }: { onExit: () => void }) {
  const { s, start, reset, clearFresh } = useC2();
  const [screen, setScreen] = useState<Screen>('hub');
  const [param, setParam] = useState<string | null>(null);
  const [evOpen, setEvOpen] = useState<string | null>(null);
  const [hint, setHint] = useState(false);
  const [snd, setSnd] = useState(false);
  const [intro, setIntro] = useState(!s.started);

  useEffect(() => () => stopAmbient(), []);
  useEffect(() => { if (screen === 'insights') clearFresh(); }, [screen]); // eslint-disable-line

  const nav = useMemo(() => ({
    screen, param,
    go: (sc: Screen, p: string | null = null) => { setScreen(sc); setParam(p); window.scrollTo?.(0, 0); },
    openEv: (id: string) => { sfx('open'); setEvOpen(id); },
    hint: () => setHint(true),
    exit: onExit,
  }), [screen, param, onExit]);

  if (intro || !s.started) {
    return <CoverCase2 started={s.started} onStart={() => { unlock(); start(); setIntro(false); }} onExit={onExit} onReset={() => { reset(); setIntro(true); }} />;
  }

  return (
    <NavCtx2.Provider value={nav}>
      <div className="c2-app">
        <header className="c2-top">
          <button className="c2-brand" onClick={() => nav.go('hub')}>ТИХО-ТИХО<small>дело № 25-0214</small></button>
          <div className="c2-crumb">{TITLES[screen]}</div>
          <div className="c2-spacer" />
          <button className="c2-btn small" onClick={() => nav.go('hub')}>Стол</button>
          <button className="c2-btn small" onClick={() => setHint(true)}>Мне нужна подсказка</button>
          <button className="c2-btn small" onClick={() => setSnd(true)}>Звук</button>
          <button className="c2-btn small ghost" onClick={onExit}>К делам</button>
        </header>
        <main className="c2-main">
          {screen === 'hub' && <Hub />}
          {screen === 'places' && <PlacesMap />}
          {screen === 'place' && param && <PlaceView id={param} />}
          {screen === 'evidence' && <EvidenceScreen />}
          {screen === 'phone' && <PhoneView />}
          {screen === 'cctv' && <CctvView startCam={param === '2' ? 2 : 1} />}
          {screen === 'spectro' && <SpectroView />}
          {screen === 'people' && <PeopleScreen />}
          {screen === 'interview' && param && <InterviewScreen id={param} />}
          {screen === 'requests' && <RequestsScreen />}
          {screen === 'board' && <BoardScreen />}
          {screen === 'timeline' && <TimelineScreen />}
          {screen === 'insights' && <InsightsScreen />}
          {screen === 'finale' && <FinaleScreen />}
          {screen === 'messages' && <MessagesScreen />}
          {screen === 'notes' && <NotesScreen />}
        </main>
        <Toasts />
        {evOpen && <EvidenceModal id={evOpen} onClose={() => setEvOpen(null)} />}
        {hint && <HintModal onClose={() => setHint(false)} />}
        {snd && <Modal title="Звук и эффекты" onClose={() => setSnd(false)}><SoundPanel /></Modal>}
      </div>
    </NavCtx2.Provider>
  );
}

export function Case2App({ onExit }: { onExit: () => void }) {
  return (
    <Case2Provider>
      <Inner onExit={onExit} />
    </Case2Provider>
  );
}
