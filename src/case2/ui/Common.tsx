import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { getPrefs, setPrefs, subscribe, sfx } from '../audio';
import { EV } from '../data/evidence';
import { ItemArt } from '../art/Items';
import { useC2 } from '../state';

export function usePrefs() {
  const [, force] = useState(0);
  useEffect(() => subscribe(() => force((x) => x + 1)), []);
  return getPrefs();
}

export function Modal({ title, onClose, children, wide }: { title: string; onClose: () => void; children: ReactNode; wide?: boolean }) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);
  return (
    <div className="c2-modal-back" onMouseDown={onClose}>
      <div className={'c2-modal' + (wide ? ' wide' : '')} role="dialog" aria-modal="true" aria-label={title} onMouseDown={(e) => e.stopPropagation()}>
        <div className="c2-modal-head"><h3>{title}</h3><button className="c2-x" onClick={onClose} aria-label="Закрыть">×</button></div>
        <div className="c2-modal-body">{children}</div>
      </div>
    </div>
  );
}

export function SoundPanel() {
  const p = usePrefs();
  return (
    <div className="c2-sound">
      <label><input type="checkbox" checked={p.sound} onChange={(e) => { setPrefs({ sound: e.target.checked }); }} /> Звуки и озвучка</label>
      <label><input type="checkbox" checked={p.music} onChange={(e) => setPrefs({ music: e.target.checked })} /> Фоновая атмосфера</label>
      <label><input type="checkbox" checked={p.voice} onChange={(e) => setPrefs({ voice: e.target.checked })} /> Озвучивать записи (синтез речи)</label>
      <label><input type="checkbox" checked={p.calm} onChange={(e) => setPrefs({ calm: e.target.checked })} /> Спокойный режим (без акцентов)</label>
      <label>Громкость <input type="range" min={0} max={1} step={0.05} value={p.vol} onChange={(e) => setPrefs({ vol: Number(e.target.value) })} /></label>
      <p className="c2-muted">Озвучка записей — синтез речи вашего браузера, а не записи героев. Расшифровка есть у каждого материала.</p>
    </div>
  );
}

export function EvThumb({ id, onClick, mark }: { id: string; onClick?: () => void; mark?: string }) {
  const e = EV[id];
  const { s } = useC2();
  if (!e) return null;
  const isNew = !s.seen.includes(id);
  return (
    <button className={'c2-thumb' + (isNew ? ' new' : '')} onClick={() => { sfx('click'); onClick?.(); }} title={e.title}>
      <div className="c2-thumb-art"><ItemArt art={e.art} lines={e.lines} id={'t' + id} /></div>
      <div className="c2-thumb-cap">{e.title}</div>
      {mark && <div className="c2-thumb-mark">{mark}</div>}
      {isNew && <i className="c2-new" aria-label="новое" />}
    </button>
  );
}
