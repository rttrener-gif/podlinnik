import { useEffect, useRef, useState } from 'react';
import { CctvFrame } from '../art/Items';
import { CAM_EVENTS, CAM_END, hmOf, dayOf } from '../data/media';
import { useC2 } from '../state';
import { useNav2 } from './nav';
import { P2 } from '../data/people';
import { sfx } from '../audio';

export function CctvView({ startCam }: { startCam: 1 | 2 }) {
  const { has, s, bookmark, view } = useC2();
  const { go } = useNav2();
  const [cam, setCam] = useState<1 | 2>(startCam === 2 && has('cam2') ? 2 : 1);
  const [t, setT] = useState(0);
  const [play, setPlay] = useState(false);
  const [speed, setSpeed] = useState(30);
  const ref = useRef<number | null>(null);
  const has2 = has('cam2');

  useEffect(() => { view(cam === 1 ? 'cam1' : 'cam2'); }, [cam]); // eslint-disable-line
  useEffect(() => {
    if (!play) return;
    ref.current = window.setInterval(() => setT((x) => { const n = x + speed / 10; if (n >= CAM_END) { setPlay(false); return CAM_END; } return n; }), 100);
    return () => { if (ref.current) window.clearInterval(ref.current); };
  }, [play, speed]);

  const events = CAM_EVENTS.filter((e) => e.cam === cam);
  const jump = (at: number) => { setPlay(false); setT(Math.max(0, at + 0.3)); sfx('click'); };
  const next = () => { const n = events.filter((e) => e.at > t + 0.3).sort((a, b) => a.at - b.at)[0]; if (n) jump(n.at); };
  const prev = () => { const n = events.filter((e) => e.at < t - 0.5).sort((a, b) => b.at - a.at)[0]; if (n) jump(n.at); };
  const cur = events.find((e) => t >= e.at && t <= (e.until ?? e.at + 1));

  return (
    <div className="c2-page wide">
      <div className="c2-row"><button className="c2-btn ghost" onClick={() => go('hub')}>← К столу</button>
        <div className="c2-tabs inline">
          <button className={cam === 1 ? 'on' : ''} onClick={() => { setCam(1); }}>Камера 1 · вход</button>
          <button className={cam === 2 ? 'on' : ''} disabled={!has2} onClick={() => setCam(2)}>{has2 ? 'Камера 2 · коридор' : 'Камера 2 · нет записи'}</button>
        </div>
      </div>
      <div className="c2-cctv">
        <CctvFrame cam={cam} t={t} />
        {cur && <div className="c2-cctv-tag">{cur.label}</div>}
      </div>
      <div className="c2-ctl">
        <button className="c2-btn" onClick={prev}>⏮</button>
        <button className="c2-btn primary" onClick={() => { setPlay((p) => !p); sfx('play'); }}>{play ? '❚❚ Пауза' : '▶ Играть'}</button>
        <button className="c2-btn" onClick={next}>⏭</button>
        <button className="c2-btn" onClick={() => setT((x) => Math.min(CAM_END, x + 0.5))}>+30 с</button>
        <label className="c2-muted small">Скорость
          <select value={speed} onChange={(e) => setSpeed(Number(e.target.value))}>
            <option value={3}>×1</option><option value={30}>×10</option><option value={120}>×40</option><option value={600}>×200</option>
          </select>
        </label>
      </div>
      <div className="c2-scrub">
        <input type="range" min={0} max={CAM_END} step={0.1} value={t} onChange={(e) => { setPlay(false); setT(Number(e.target.value)); }} aria-label="Положение записи" />
        <div className="c2-marks">
          {events.map((e, i) => <i key={i} className={e.kind} style={{ left: (e.at / CAM_END) * 100 + '%' }} title={e.label} onClick={() => jump(e.at)} />)}
        </div>
        <div className="c2-timeline-time">{dayOf(t)} · {hmOf(t)}</div>
      </div>
      <h3 className="c2-h small">События по датчику движения</h3>
      <div className="c2-evlist">
        {events.map((e, i) => {
          const bm = s.bookmarks.includes(`${cam}:${e.at}`);
          return (
            <div key={i} className="c2-evrow">
              <button className="c2-time" onClick={() => jump(e.at)}>{dayOf(e.at).slice(0, 5)} {hmOf(e.at)}</button>
              <span>{e.label}{e.who && P2[e.who] ? '' : ''}</span>
              <button className={'c2-btn small' + (bm ? ' on' : '')} onClick={() => bookmark(`${cam}:${e.at}`)}>{bm ? 'в закладках' : 'закладка'}</button>
            </div>
          );
        })}
      </div>
      <p className="c2-muted small">Кадры — реконструкция записи регистратора по событиям детектора. Подлинные кадры камер в игре не используются.</p>
    </div>
  );
}
