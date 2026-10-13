import { useState } from 'react';
import { PLACES, PLACE } from '../data/places';
import { SceneArt } from '../art/Scenes';
import { useC2 } from '../state';
import { useNav2 } from './nav';
import { sfx } from '../audio';
import { EV } from '../data/evidence';

export function PlacesMap() {
  const { cond } = useC2();
  const { go } = useNav2();
  return (
    <div className="c2-page">
      <h2 className="c2-h">Карта города</h2>
      <p className="c2-muted">Тихоярск. Выберите место, чтобы осмотреть его.</p>
      <div className="c2-map">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="c2-map-bg">
          <rect width="100" height="100" fill="#10161a" />
          <path d="M0 62 Q30 55 60 64 T100 58 V100 H0Z" fill="#162029" />
          <path d="M10 20 L90 24 M30 0 L36 100 M70 0 L64 100 M0 50 L100 46" stroke="#25303a" strokeWidth="1.2" />
          <text x="3" y="96" fontSize="3" fill="#3a4a58">озеро Тихое</text>
        </svg>
        {PLACES.map((p) => {
          const open = cond(p.when);
          return (
            <button key={p.id} className={'c2-pin' + (open ? '' : ' locked')} style={{ left: p.x + '%', top: p.y + '%' }} disabled={!open}
              onClick={() => { sfx('open'); go('place', p.id); }}>
              <span className="c2-pin-dot" />
              <span className="c2-pin-label">{open ? p.name : 'Неизвестно'}<small>{open ? p.sub : 'Место появится по ходу расследования'}</small></span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function PlaceView({ id }: { id: string }) {
  const p = PLACE[id];
  const { s, cond, acquire, view } = useC2();
  const { openEv, go } = useNav2();
  const [msg, setMsg] = useState<string | null>(null);
  const [hint, setHint] = useState(true);
  if (!p) return null;
  return (
    <div className="c2-page wide">
      <div className="c2-row">
        <button className="c2-btn ghost" onClick={() => go('places')}>← К карте</button>
        <div><h2 className="c2-h">{p.name}</h2><div className="c2-muted">{p.sub}</div></div>
        <div className="c2-spacer" />
        <button className="c2-btn" onClick={() => setHint((v) => !v)}>{hint ? 'Скрыть метки' : 'Показать объекты'}</button>
      </div>
      <div className="c2-scene">
        <SceneArt id={p.scene} />
        {p.spots.map((sp) => {
          const got = sp.ev ? s.ev.includes(sp.ev) : false;
          return (
            <button key={sp.id} className={'c2-spot' + (hint || got ? ' show' : '') + (got ? ' got' : '')} aria-label={sp.label}
              style={{ left: sp.x / 10 + '%', top: sp.y / 5.6 + '%', width: sp.w / 10 + '%', height: sp.h / 5.6 + '%' }}
              onClick={() => {
                sfx('click');
                if (sp.ev && cond(sp.when)) {
                  if (!s.ev.includes(sp.ev)) acquire(sp.ev);
                  view(sp.ev);
                  openEv(sp.ev);
                  setMsg(null);
                } else setMsg(sp.plain || 'Здесь нет ничего, что стоило бы осмотра отдельно.');
              }}>
              <span className="c2-spot-label">{sp.label}</span>
            </button>
          );
        })}
      </div>
      <div className="c2-strip">
        {p.spots.filter((x) => x.ev && s.ev.includes(x.ev)).map((x) => (
          <button key={x.id} className="c2-chip" onClick={() => openEv(x.ev!)}>{EV[x.ev!].title}</button>
        ))}
        {msg && <div className="c2-note-line">{msg}</div>}
      </div>
    </div>
  );
}
