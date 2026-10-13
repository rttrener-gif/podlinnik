import { useEffect, useRef, useState } from 'react';
import { AUDIO } from '../data/media';
import { speak, stopSpeech, sfx, getPrefs } from '../audio';
import { useC2 } from '../state';
import { EV } from '../data/evidence';
import { useNav2 } from './nav';

export function AudioPlayer({ id }: { id: string }) {
  const a = AUDIO[id];
  const { view } = useC2();
  const [playing, setPlaying] = useState(false);
  const [t, setT] = useState(0);
  const timer = useRef<number | null>(null);
  const [note, setNote] = useState<string | null>(null);

  useEffect(() => () => { stopSpeech(); if (timer.current) window.clearInterval(timer.current); }, []);
  if (!a) return null;

  const stop = () => {
    stopSpeech();
    if (timer.current) window.clearInterval(timer.current);
    setPlaying(false);
  };
  const play = () => {
    sfx('play');
    setT(0);
    setPlaying(true);
    view(id);
    const prefs = getPrefs();
    const text = a.lines.filter((l) => !l.note).map((l) => l.text).join(' ');
    const ok = prefs.sound && prefs.voice ? speak(text, a.voice, () => { setPlaying(false); if (timer.current) window.clearInterval(timer.current); }) : false;
    setNote(ok ? 'Озвучка: синтез речи браузера (не запись героя). Расшифровка — ниже.' : 'Озвучка выключена или недоступна. Смотрите расшифровку.');
    const start = Date.now();
    timer.current = window.setInterval(() => {
      const el = (Date.now() - start) / 1000;
      setT(el * (a.dur > 60 ? 12 : 1));
      if (el * (a.dur > 60 ? 12 : 1) >= a.dur + 1) { if (!ok) stop(); }
    }, 200);
  };
  const bars = 56;
  const prog = Math.min(1, t / a.dur);
  return (
    <div className="c2-audio">
      <div className="c2-audio-top">
        <button className="c2-play" onClick={playing ? stop : play} aria-label={playing ? 'Остановить' : 'Воспроизвести'}>{playing ? '■' : '▶'}</button>
        <div className="c2-wave" aria-hidden="true">
          {Array.from({ length: bars }).map((_, i) => {
            const h = 8 + Math.abs(Math.sin(i * 0.5 + a.dur) * Math.cos(i * 0.17)) * 28;
            return <i key={i} style={{ height: h, opacity: i / bars <= prog && playing ? 1 : 0.4, background: i / bars <= prog && playing ? '#c9a227' : '#8a8f98' }} />;
          })}
        </div>
        <div className="c2-audio-time">{String(Math.floor(a.dur / 60)).padStart(1, '0')}:{String(a.dur % 60).padStart(2, '0')}</div>
      </div>
      <div className="c2-audio-sub">{a.title} · {a.sub}</div>
      {note && <div className="c2-muted small">{note}</div>}
      <div className="c2-transcript">
        <div className="c2-muted small">Расшифровка</div>
        {a.lines.map((l, i) => (
          <p key={i} className={l.note ? 'note' : ''}><b>{l.who && l.who + ': '}</b>{l.text}</p>
        ))}
      </div>
    </div>
  );
}

// ───────── Сравнение шумовых портретов ─────────
const SAMPLES = ['tape-2009', 'vm-2014', 'vm-2019', 'vm-fake', 'vm-0312', 'memo-alina'];
const ROOM: Record<string, 's2' | 'home'> = { 'tape-2009': 's2', 'vm-2014': 's2', 'vm-2019': 's2', 'vm-fake': 's2', 'vm-0312': 'home', 'memo-alina': 'home' };

function Spec({ room, label }: { room: 's2' | 'home'; label: string }) {
  const W = 300, H = 150;
  const bars = Array.from({ length: 60 }).map((_, i) => {
    const f = i / 60;
    let a = 0.15 + 0.1 * Math.sin(i * 1.3);
    if (room === 's2') { if (Math.abs(f - 0.08) < 0.02) a = 0.95; if (Math.abs(f - 0.52) < 0.012) a = 0.8; }
    else { if (Math.abs(f - 0.16) < 0.02) a = 0.9; if (Math.abs(f - 0.34) < 0.015) a = 0.55; }
    return a;
  });
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="c2-spec" role="img" aria-label={label}>
      <rect width={W} height={H} fill="#05080a" />
      {bars.map((a, i) => <rect key={i} x={6 + i * 4.9} y={H - 14 - a * (H - 30)} width="3.6" height={a * (H - 30)} fill={a > 0.7 ? '#e0b43a' : '#2f8a6a'} />)}
      <line x1="6" y1={H - 14} x2={W - 6} y2={H - 14} stroke="#3a4650" />
      <text x="8" y="14" fontSize="10" fill="#8aa0a8" fontFamily="PT Mono, monospace">50 Гц ····· 1,3 кГц</text>
    </svg>
  );
}

export function SpectroView() {
  const { s, pair } = useC2();
  const [a, setA] = useState<string | null>(null);
  const [b, setB] = useState<string | null>(null);
  const [out, setOut] = useState<string | null>(null);
  const have = SAMPLES.filter((x) => s.ev.includes(x));
  const { openEv } = useNav2();
  const run = () => {
    if (!a || !b) return;
    pair(a, b);
    const same = ROOM[a] === ROOM[b];
    setOut(same
      ? ROOM[a] === 's2'
        ? 'Совпадение: сетевой фон 50 Гц и тонкий свист около 1,3 кГц. Записи сделаны в одном помещении.'
        : 'Совпадение: бытовой фон (холодильник, 100 Гц). Записи сделаны в одном помещении — в квартире.'
      : 'Различие: у записей разные шумовые портреты. Записаны в разных помещениях.');
  };
  return (
    <div className="c2-page">
      <h2 className="c2-h">Анализатор шумовых портретов</h2>
      <p className="c2-muted">Выберите два образца и нажмите «Сравнить». Результат сохранится в журнале, если он значим.</p>
      <div className="c2-spec-grid">
        {have.map((id) => (
          <div key={id} className={'c2-spec-card' + (a === id || b === id ? ' sel' : '')}>
            <Spec room={ROOM[id]} label={EV[id].title} />
            <div className="c2-spec-cap">{EV[id].title}</div>
            <div className="c2-row">
              <button className="c2-btn small" onClick={() => { if (a === id) setA(null); else if (!a) setA(id); else setB(id); setOut(null); }}>{a === id || b === id ? 'выбрано' : 'выбрать'}</button>
              <button className="c2-btn small ghost" onClick={() => openEv(id)}>открыть</button>
            </div>
          </div>
        ))}
      </div>
      <div className="c2-row"><button className="c2-btn primary" disabled={!a || !b} onClick={run}>Сравнить выбранные</button>{(a || b) && <button className="c2-btn ghost" onClick={() => { setA(null); setB(null); setOut(null); }}>Сбросить</button>}</div>
      {out && <div className="c2-result">{out}</div>}
    </div>
  );
}
