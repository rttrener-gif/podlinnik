import { useState } from 'react';
import { DEVICES } from '../data/devices';
import { Art3 } from '../art/Photos3';

type Tab = 'msg' | 'calls' | 'contacts' | 'notes' | 'photos';

export function DeviceView({ id, back }: { id: string; back: () => void }) {
  const d = DEVICES[id];
  const [tab, setTab] = useState<Tab>('msg');
  const [th, setTh] = useState(d?.threads[0]?.id ?? '');
  if (!d) return null;
  const thread = d.threads.find((t) => t.id === th) ?? d.threads[0];
  return (
    <div className="c3-page">
      <button className="c3-btn ghost" onClick={back}>← К материалам</button>
      <h2 className="c3-h">{d.title}</h2>
      <p className="c3-muted">Содержимое устройства, извлечённое в рамках исследования. Отметки времени — по серверу или по часам устройства, как указано в заключении.</p>
      <div className="c3-device">
        <nav className="c3-dtabs">
          {([['msg', 'Сообщения'], ['calls', 'Звонки'], ['contacts', 'Контакты'], ['notes', 'Заметки'], ['photos', 'Фото']] as [Tab, string][]).map(([k, n]) => (
            <button key={k} className={tab === k ? 'on' : ''} onClick={() => setTab(k)}>{n}</button>
          ))}
        </nav>
        {tab === 'msg' && (
          <div className="c3-dmsg">
            <div className="c3-dthreads">{d.threads.map((t) => <button key={t.id} className={t.id === th ? 'on' : ''} onClick={() => setTh(t.id)}>{t.name}</button>)}</div>
            <div className="c3-chat">
              {thread.msgs.map((m) => (
                <div key={m.id} className={'c3-bub ' + m.from}>
                  <div className="txt">{m.text}</div>
                  <div className="meta">{m.t}{m.status ? ' · ' + m.status : ''}</div>
                  {m.note && <div className="c3-note-i">{m.note}</div>}
                </div>
              ))}
            </div>
          </div>
        )}
        {tab === 'calls' && <table className="c3-table"><thead><tr><th>Время</th><th>Контакт</th><th>Направление</th><th>Длительность</th></tr></thead><tbody>{d.calls.map((c, i) => <tr key={i}><td>{c.t}</td><td>{c.who}</td><td>{c.dir}</td><td>{c.dur}</td></tr>)}</tbody></table>}
        {tab === 'contacts' && <ul className="c3-plain">{d.contacts.map((c) => <li key={c}>{c}</li>)}</ul>}
        {tab === 'notes' && <div>{d.notes.map((n) => <div key={n.title} className="c3-nt"><b>{n.title}</b><p>{n.text}</p></div>)}</div>}
        {tab === 'photos' && (
          <div className="c3-photos">
            {d.photos.length === 0 && <p className="c3-muted">Фотографий нет.</p>}
            {d.photos.map((p, i) => <figure key={i}>{p.art ? <Art3 id={p.art} /> : <div className="c3-ph-blank">без превью</div>}<figcaption>{p.t} · {p.cap}</figcaption></figure>)}
          </div>
        )}
      </div>
    </div>
  );
}
