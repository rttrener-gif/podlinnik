import { useEffect, useState } from 'react';
import { THREADS, CALLS, PHOTOS, NOTES, NOTIFICATIONS, PHONE_PIN } from '../data/media';
import { useC2 } from '../state';
import { useNav2 } from './nav';
import { Portrait } from '../art/Portrait';
import { ItemArt } from '../art/Items';
import { AudioPlayer } from './Audio';
import { sfx } from '../audio';

type App = null | 'msg' | 'calls' | 'photos' | 'memo' | 'notes' | 'notif';

export function PhoneView() {
  const { s, setFlag, request } = useC2();
  const [pin, setPin] = useState('');
  const [bad, setBad] = useState(0);
  const unlocked = s.flags.includes('pin_ok');
  const { go } = useNav2();
  const [app, setApp] = useState<App>(null);
  const extracted = s.flags.includes('extracted');

  const press = (d: string) => {
    sfx('key');
    const next = (pin + d).slice(0, 4);
    setPin(next);
    if (next.length === 4) {
      if (next === PHONE_PIN) { setFlag('pin_ok'); sfx('open'); setPin(''); }
      else { sfx('error'); setBad((b) => b + 1); window.setTimeout(() => setPin(''), 350); }
    }
  };

  return (
    <div className="c2-page">
      <button className="c2-btn ghost" onClick={() => (app ? setApp(null) : go('hub'))}>← {app ? 'На главный экран' : 'К столу'}</button>
      <div className="c2-phone" aria-label="Телефон Алины">
        <div className="c2-phone-notch" />
        {!unlocked ? (
          <div className="c2-lock">
            <div className="c2-lock-time">15:42</div>
            <div className="c2-lock-date">суббота, 15 февраля</div>
            <div className="c2-lock-notifs">
              <div>3 сообщения · 03:12</div>
              <div>Пропущенные · Денис ×14</div>
            </div>
            <div className="c2-dots">{[0, 1, 2, 3].map((i) => <i key={i} className={i < pin.length ? 'on' : ''} />)}</div>
            <div className="c2-pad">{['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'].map((d, i) => (
              <button key={i} disabled={!d} onClick={() => (d === '⌫' ? setPin(pin.slice(0, -1)) : press(d))}>{d}</button>
            ))}</div>
            {bad >= 2 && <div className="c2-lock-hint">Подсказка: подумайте, какая дата обведена на календаре в студии.</div>}
            {bad >= 3 && !s.reqs.includes('r-phone') && <button className="c2-btn small" onClick={() => request('r-phone')}>Передать телефон на экспертизу</button>}
          </div>
        ) : !app ? (
          <div className="c2-home">
            <div className="c2-statusbar"><span>15:42</span><span>71 %</span></div>
            <div className="c2-apps">
              {([['msg', 'Сообщения', '#2f8a6a'], ['calls', 'Звонки', '#3a6a9a'], ['photos', 'Фото', '#9a5a3a'], ['memo', 'Диктофон', '#8a2a3a'], ['notes', 'Заметки', '#a08a2a'], ['notif', 'Уведомления', '#5a4a8a']] as [App, string, string][]).map(([id, name, c]) => (
                <button key={String(id)} className="c2-appbtn" onClick={() => { sfx('open'); setApp(id); }}>
                  <span className="c2-app-ico" style={{ background: c }} />{name}
                </button>
              ))}
            </div>
            {!extracted && <div className="c2-muted small pad">Часть данных скрыта. Для восстановления потребуется экспертиза.</div>}
          </div>
        ) : app === 'msg' ? <Messages extracted={extracted} /> : app === 'calls' ? (
          <div className="c2-appbody"><h3>Звонки</h3>{CALLS.filter((c) => !c.needs || extracted).map((c, i) => (
            <div className="c2-callrow" key={i}><b>{c.who}</b><span>{c.dir} · {c.dur}</span><small>{c.t}</small></div>
          ))}</div>
        ) : app === 'photos' ? <Photos /> : app === 'memo' ? <Memos extracted={extracted} /> : app === 'notes' ? (
          <div className="c2-appbody"><h3>Заметки</h3>{NOTES.filter((n) => !n.needs || extracted).map((n) => <div className="c2-note" key={n.id}><b>{n.title}</b><p>{n.text}</p></div>)}</div>
        ) : (
          <div className="c2-appbody"><h3>Уведомления</h3>{NOTIFICATIONS.filter((n) => !n.needs || extracted).map((n, i) => (
            <div className="c2-callrow" key={i}><b>{n.app}</b><span>{n.text}</span><small>{n.t}</small></div>
          ))}</div>
        )}
      </div>
    </div>
  );
}

function Messages({ extracted }: { extracted: boolean }) {
  const [open, setOpen] = useState<string | null>(null);
  const th = THREADS.find((t) => t.id === open);
  if (th) {
    return (
      <div className="c2-appbody chat">
        <div className="c2-chat-head"><button onClick={() => setOpen(null)}>‹</button><Portrait id={th.avatar} className="c2-av" /><b>{th.name}</b></div>
        <div className="c2-chat">
          {th.msgs.filter((m) => !m.deleted || extracted).map((m, i) => (
            <div key={i} className={'c2-bub ' + m.who + (m.deleted ? ' del' : '')}>
              <div>{m.voice ? '🔊 ' : ''}{m.text}</div>
              <small>{m.t}{m.sched && extracted ? ' · отложенная отправка' : ''}{m.deleted ? ' · восстановлено' : ''}</small>
              {m.voice && <AudioPlayer id={m.voice} />}
            </div>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="c2-appbody">
      <h3>Сообщения</h3>
      {THREADS.filter((t) => !t.needs || extracted).map((t) => {
        const last = t.msgs.filter((m) => !m.deleted || extracted).slice(-1)[0];
        return (
          <button key={t.id} className="c2-thread" onClick={() => setOpen(t.id)}>
            <Portrait id={t.avatar} className="c2-av" />
            <span><b>{t.name}</b><small>{last?.text}</small></span>
          </button>
        );
      })}
    </div>
  );
}

function Photos() {
  const { acquire, has } = useC2();
  const { openEv } = useNav2();
  return (
    <div className="c2-appbody">
      <h3>Фото</h3>
      <div className="c2-photos">
        {PHOTOS.map((p) => (
          <button key={p.id} className="c2-ph" onClick={() => { if (p.art === 'school11') { if (!has('school-photo')) acquire('school-photo'); openEv('school-photo'); } }}>
            <ItemArt art={p.art} id={'ph' + p.id} />
            <small>{p.cap}</small>
          </button>
        ))}
      </div>
    </div>
  );
}

function Memos({ extracted }: { extracted: boolean }) {
  const { acquire, has } = useC2();
  useEffect(() => { if (extracted && !has('memo-alina')) acquire('memo-alina'); }, [extracted]); // eslint-disable-line
  if (!extracted) return <div className="c2-appbody"><h3>Диктофон</h3><p className="c2-muted">Записей не найдено. Возможно, они скрыты или удалены.</p></div>;
  return <div className="c2-appbody"><h3>Диктофон</h3><AudioPlayer id="memo-alina" /></div>;
}
