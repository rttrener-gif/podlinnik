import { useEffect, useState } from 'react';
import { Case3Provider, useC3, globalHint } from './state';
import { Archive, DeviceScreen } from './ui/Archive';
import { PeopleScreen } from './ui/People3';
import { Actions, Timeline, Insights, Overview, Versions, Board } from './ui/Work';
import { Finale3 } from './ui/Finale3';
import { Modal } from './ui/Common';
import './case3.css';

type Screen = 'overview' | 'archive' | 'people' | 'actions' | 'timeline' | 'board' | 'versions' | 'insights' | 'finale' | 'device';
const NAV: [Screen, string][] = [['overview', 'Дело'], ['archive', 'Материалы'], ['people', 'Люди'], ['actions', 'Следственные действия'], ['timeline', 'Хронология'], ['board', 'Рабочая доска'], ['versions', 'Версии'], ['insights', 'Выводы'], ['finale', 'Итоговая версия']];

function Inner({ onExit }: { onExit: () => void }) {
  const { s, start, reset, hint, clearNotices } = useC3();
  const [screen, setScreen] = useState<Screen>('overview');
  const [openId, setOpenId] = useState<string | null>(null);
  const [personId, setPersonId] = useState<string | null>(null);
  const [device, setDevice] = useState<string>('tablet');
  const [hintOpen, setHintOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const [intro, setIntro] = useState(!s.started);
  const [conf, setConf] = useState(false);

  useEffect(() => { if (screen === 'actions') clearNotices(); }, [screen]); // eslint-disable-line

  if (intro || !s.started) {
    return (
      <div className="c3-cover">
        <div className="c3-cover-in">
          <div className="c3-eyebrow">СЛЕДСТВЕННЫЙ ОТДЕЛ · ДЕЛО № 25-0629</div>
          <h1>ТИХАЯ ГАВАНЬ</h1>
          <p className="c3-lead">Частный пансионат для пожилых людей. За два года — двенадцать смертей, и ни одного вскрытия. Дочь одной из умерших приносит фотографию, сделанную в ночь её смерти, и просит проверить, что на самом деле происходило в её комнате.</p>
          <p className="c3-lead2">Вы будете изучать материалы, допрашивать свободным текстом, заказывать исследования по мере появления оснований и выстраивать собственные версии. Подсказки — по запросу и необязательны. Озвучки в этом деле нет: записи даны расшифровками.</p>
          <div className="c3-row wrap">
            <button className="c3-btn primary big" onClick={() => { start(); setIntro(false); }}>{s.started ? 'Продолжить' : 'Начать расследование'}</button>
            <button className="c3-btn ghost" onClick={onExit}>К выбору дела</button>
            {s.started && <button className="c3-btn ghost" onClick={() => setConf(true)}>Начать заново</button>}
          </div>
          <p className="c3-warn">Содержание: смерть пожилых людей, эвтаназия, злоупотребление доверием, наркотические препараты. Все персонажи и события вымышлены. Прогресс сохраняется в браузере и не влияет на другие дела.</p>
        </div>
        {conf && <Modal title="Начать заново?" onClose={() => setConf(false)}><p>Прогресс этого дела будет стёрт. Остальные дела не затрагиваются.</p><div className="c3-row end"><button className="c3-btn ghost" onClick={() => setConf(false)}>Отмена</button><button className="c3-btn primary" onClick={() => { reset(); setConf(false); setIntro(true); }}>Стереть</button></div></Modal>}
      </div>
    );
  }

  const go = (sc: string, p?: string) => {
    if (sc === 'person' && p) { setPersonId(p); setScreen('people'); return; }
    if (sc === 'device' && p) { setDevice(p); setScreen('device'); return; }
    setScreen(sc as Screen);
  };
  const open = (id: string) => { setOpenId(id); setScreen('archive'); };
  const g = globalHint(s);
  const lv = s.hints[g.id] ?? 0;

  return (
    <div className="c3-app">
      <aside className={'c3-nav' + (menu ? ' open' : '')}>
        <div className="c3-brand">Тихая гавань<small>дело № 25-0629</small></div>
        <nav>
          {NAV.map(([k, n]) => (
            <button key={k} className={screen === k || (k === 'archive' && screen === 'device') ? 'on' : ''} onClick={() => { setScreen(k); setMenu(false); }}>
              {n}{k === 'actions' && s.pendingNotice.length > 0 && <span className="c3-badge">{s.pendingNotice.length}</span>}{k === 'insights' && s.freshIns.length > 0 && <span className="c3-badge">{s.freshIns.length}</span>}
            </button>
          ))}
        </nav>
        <div className="c3-navfoot">
          <button onClick={() => setHintOpen(true)}>Мне нужна подсказка</button>
          <button onClick={() => setIntro(true)}>Обложка и меню</button>
          <button onClick={onExit}>К выбору дела</button>
        </div>
      </aside>
      <button className="c3-burger" onClick={() => setMenu((v) => !v)} aria-label="Меню">☰</button>
      <main className="c3-main">
        {s.pendingNotice.length > 0 && screen !== 'actions' && (
          <div className="c3-banner" role="status">Появились основания для новых следственных действий. <button className="c3-link" onClick={() => setScreen('actions')}>Открыть</button></div>
        )}
        {screen === 'overview' && <Overview go={go} />}
        {screen === 'archive' && <Archive openId={openId} setOpenId={setOpenId} go={go} />}
        {screen === 'device' && <DeviceScreen id={device} back={() => setScreen('archive')} />}
        {screen === 'people' && <PeopleScreen id={personId} setId={setPersonId} />}
        {screen === 'actions' && <Actions open={open} />}
        {screen === 'timeline' && <Timeline open={open} />}
        {screen === 'board' && <Board open={open} />}
        {screen === 'versions' && <Versions />}
        {screen === 'insights' && <Insights open={open} />}
        {screen === 'finale' && <Finale3 open={open} />}
      </main>
      {hintOpen && (
        <Modal title="Подсказка" onClose={() => setHintOpen(false)}>
          <p className="c3-muted">Подсказки учитывают прогресс и не называют виновного. Каждый уровень конкретнее предыдущего.</p>
          {lv === 0 && <p>Нажмите, чтобы получить мягкое направление.</p>}
          {lv >= 1 && <p><b>1.</b> {g.l1}</p>}{lv >= 2 && <p><b>2.</b> {g.l2}</p>}{lv >= 3 && <p><b>3.</b> {g.l3}</p>}
          <div className="c3-row end">{lv < 3 && <button className="c3-btn primary" onClick={() => hint(g.id)}>{lv === 0 ? 'Показать' : 'Конкретнее'}</button>}</div>
        </Modal>
      )}
    </div>
  );
}

export function Case3App({ onExit }: { onExit: () => void }) {
  return <Case3Provider><Inner onExit={onExit} /></Case3Provider>;
}
