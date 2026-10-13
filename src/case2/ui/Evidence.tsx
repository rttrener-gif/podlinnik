import { useEffect, useState } from 'react';
import { EVIDENCE, EV } from '../data/evidence';
import { ItemArt } from '../art/Items';
import { useC2 } from '../state';
import { useNav2 } from './nav';
import { Modal, EvThumb } from './Common';
import { AudioPlayer } from './Audio';
import { P2 } from '../data/people';
import { sfx } from '../audio';

export function EvidenceScreen() {
  const { s } = useC2();
  const { openEv } = useNav2();
  const [tag, setTag] = useState('Все');
  const have = EVIDENCE.filter((e) => s.ev.includes(e.id));
  const tags = ['Все', ...Array.from(new Set(have.map((e) => e.tag ?? 'Прочее')))];
  const list = have.filter((e) => tag === 'Все' || (e.tag ?? 'Прочее') === tag);
  return (
    <div className="c2-page wide">
      <h2 className="c2-h">Улики</h2>
      <div className="c2-tabs">{tags.map((t) => <button key={t} className={t === tag ? 'on' : ''} onClick={() => setTag(t)}>{t}</button>)}</div>
      <div className="c2-grid">{list.map((e) => <EvThumb key={e.id} id={e.id} onClick={() => openEv(e.id)} />)}</div>
      {list.length === 0 && <p className="c2-muted">Здесь пока пусто.</p>}
    </div>
  );
}

export function EvidenceModal({ id, onClose }: { id: string; onClose: () => void }) {
  const e = EV[id];
  const { s, view, boardAdd, pair } = useC2();
  const { go } = useNav2();
  const [more, setMore] = useState(false);
  const [zoom, setZoom] = useState(false);
  const [cmp, setCmp] = useState(false);
  const [res, setRes] = useState<string | null>(null);
  useEffect(() => { view(id); }, [id]); // eslint-disable-line
  if (!e) return null;
  const onBoard = !!s.board['ev:' + id];
  return (
    <Modal title={e.title} onClose={onClose} wide>
      <div className="c2-ev">
        <div className={'c2-ev-art' + (zoom ? ' zoom' : '')} onClick={() => setZoom((z) => !z)} title="Нажмите, чтобы увеличить">
          <ItemArt art={e.art} lines={e.lines} id={'m' + id} />
          <span className="c2-zoom-hint">{zoom ? 'уменьшить' : 'увеличить'}</span>
        </div>
        <p className="c2-caption">{e.caption}</p>
        {e.people && <div className="c2-chips">{e.people.map((p) => <span className="c2-chip static" key={p}>{P2[p]?.short}</span>)}</div>}
        {e.audio && <AudioPlayer id={e.audio} />}
        <div className="c2-row wrap">
          {e.opens === 'phone' && <button className="c2-btn primary" onClick={() => { onClose(); go('phone'); }}>Открыть телефон</button>}
          {e.opens === 'cctv' && <button className="c2-btn primary" onClick={() => { onClose(); go('cctv', id === 'cam2' ? '2' : '1'); }}>Смотреть запись</button>}
          {e.opens === 'spectro' && <button className="c2-btn primary" onClick={() => { onClose(); go('spectro'); }}>Открыть анализатор</button>}
          <button className="c2-btn" onClick={() => setMore((v) => !v)}>{more ? 'Скрыть подробности' : 'Подробнее'}</button>
          <button className={'c2-btn' + (onBoard ? ' on' : '')} onClick={() => { boardAdd('ev:' + id); sfx('click'); }}>{onBoard ? 'Уже на доске' : 'На доску'}</button>
          <button className="c2-btn" onClick={() => setCmp((v) => !v)}>Сопоставить с…</button>
        </div>
        {more && <div className="c2-detail">{e.detail.map((d, i) => <p key={i}>{d}</p>)}</div>}
        {cmp && (
          <div className="c2-cmp">
            <div className="c2-muted">Выберите материал, с которым хотите сопоставить этот.</div>
            <div className="c2-grid small">
              {s.ev.filter((x) => x !== id).map((x) => (
                <EvThumb key={x} id={x} onClick={() => {
                  const r = pair(id, x);
                  setRes(r === 'dup' ? 'Вы уже сопоставляли эти материалы.' : 'Сопоставление выполнено. Если между материалами есть значимая связь, она будет отражена в журнале инсайтов.');
                }} />
              ))}
            </div>
            {res && <div className="c2-note-line">{res}</div>}
          </div>
        )}
      </div>
    </Modal>
  );
}
