import { useState } from 'react';
import { REQUESTS2, INSIGHTS, TIMELINE, EVENTS } from '../data/rules';
import { EV } from '../data/evidence';
import { P2 } from '../data/people';
import { useC2, currentHint } from '../state';
import { useNav2 } from './nav';
import { Modal } from './Common';
import { AudioPlayer } from './Audio';
import { Portrait } from '../art/Portrait';
import { sfx } from '../audio';
import type { InsightKind } from '../types';

const KIND_RU = { expertise: 'Экспертиза', search: 'Осмотр / обыск', records: 'Запрос сведений', check: 'Проверка' } as const;

export function RequestsScreen() {
  const { s, cond, request } = useC2();
  const { openEv } = useNav2();
  const [flash, setFlash] = useState<string | null>(null);
  const done = REQUESTS2.filter((r) => s.reqs.includes(r.id));
  const open = REQUESTS2.filter((r) => !s.reqs.includes(r.id) && cond(r.when));
  const locked = REQUESTS2.filter((r) => !s.reqs.includes(r.id) && !cond(r.when)).length;
  return (
    <div className="c2-page wide">
      <h2 className="c2-h">Запросы, экспертизы, обыски</h2>
      <p className="c2-muted">Каждое действие отвечает на конкретный вопрос. Результат не мгновенный «ответ на всё»: он подтверждает, опровергает или открывает новое направление.</p>
      {flash && <div className="c2-flash">{flash}</div>}
      <div className="c2-sec">Можно направить сейчас · {open.length}</div>
      <div className="c2-cards">
        {open.map((r) => (
          <div key={r.id} className="c2-card">
            <span className="c2-kind">{KIND_RU[r.kind]}</span>
            <h4>{r.title}</h4>
            <p><b>На какой вопрос отвечает:</b> {r.question}</p>
            <p className="c2-muted"><b>Почему это нужно:</b> {r.why}</p>
            <button className="c2-btn primary" onClick={() => { sfx('open'); request(r.id); setFlash(r.result); window.setTimeout(() => setFlash(null), 5000); }}>Направить</button>
          </div>
        ))}
        {open.length === 0 && <p className="c2-muted">Сейчас доступных запросов нет. Изучайте места, допрашивайте людей и сопоставляйте материалы.</p>}
      </div>
      {done.length > 0 && <div className="c2-sec">Выполнено · {done.length}</div>}
      <div className="c2-cards">
        {done.map((r) => (
          <div key={r.id} className="c2-card done">
            <span className="c2-kind">{KIND_RU[r.kind]}</span>
            <h4>{r.title}</h4>
            <p className="c2-muted">{r.result}</p>
            <div className="c2-chips">{r.gives.map((g) => <button key={g} className="c2-chip" onClick={() => openEv(g)}>{EV[g]?.title}</button>)}</div>
          </div>
        ))}
      </div>
      {locked > 0 && <p className="c2-muted small">Ещё {locked} действий станут доступны, когда у вас появятся основания.</p>}
    </div>
  );
}

const KINDS: [InsightKind, string][] = [['fact', 'Подтверждённые факты'], ['contradiction', 'Обнаруженные противоречия'], ['hypothesis', 'Рабочие гипотезы'], ['question', 'Вопросы, требующие проверки']];

export function InsightsScreen() {
  const { s, concl } = useC2();
  const { openEv } = useNav2();
  const got = INSIGHTS.filter((i) => s.ins.some((x) => x.id === i.id));
  const [added, setAdded] = useState<string[]>([]);
  return (
    <div className="c2-page wide">
      <h2 className="c2-h">Журнал инсайтов</h2>
      <p className="c2-muted">Промежуточные выводы. Гипотезы — это не установленные факты: их нужно проверить.</p>
      {got.length === 0 && <p className="c2-muted">Инсайтов пока нет. Они появятся, когда вы найдёте значимую связь или противоречие.</p>}
      <div className="c2-ins-grid">
        {KINDS.map(([k, label]) => {
          const list = got.filter((i) => i.kind === k);
          return (
            <div key={k} className={'c2-ins-col k-' + k}>
              <div className="c2-sec">{label} · {list.length}</div>
              {list.map((i) => (
                <article key={i.id} className={'c2-ins' + (s.freshIns.includes(i.id) ? ' fresh' : '')}>
                  <h4>{i.title}</h4>
                  <p>{i.text}</p>
                  <div className="c2-chips">{i.from.filter((f) => s.ev.includes(f)).map((f) => <button key={f} className="c2-chip" onClick={() => openEv(f)}>{EV[f]?.title}</button>)}</div>
                  <button className="c2-btn small ghost" disabled={added.includes(i.id)} onClick={() => { concl(`${i.title}. ${i.text}`, k === 'hypothesis' || k === 'question' ? 'hyp' : 'ok'); setAdded((a) => [...a, i.id]); }}>{added.includes(i.id) ? 'В выводах' : 'В мои выводы'}</button>
                </article>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function TimelineScreen() {
  const { s, cond } = useC2();
  const { openEv, go } = useNav2();
  const [who, setWho] = useState('');
  const [sel, setSel] = useState<string | null>(null);
  const items = TIMELINE.filter((t) => cond(t.src) && (!who || t.who === who));
  const conflict = (flag?: string) => !!flag && s.ins.some((i) => i.id === flag);
  const cur = items.find((i) => i.id === sel);
  const insight = cur?.flag ? INSIGHTS.find((x) => x.id === cur.flag) : null;
  return (
    <div className="c2-page wide">
      <h2 className="c2-h">Хронология ночи</h2>
      <p className="c2-muted">Строится из материалов, которые у вас есть. Красным отмечены события, вокруг которых найдено противоречие.</p>
      <div className="c2-row wrap">
        <label className="c2-muted small">Показать только:&nbsp;
          <select value={who} onChange={(e) => setWho(e.target.value)}><option value="">все</option>{['alina', 'yarik', 'ruslan', 'denis', 'polina'].map((p) => <option key={p} value={p}>{P2[p].short}</option>)}</select>
        </label>
      </div>
      <div className="c2-tl">
        {[14, 15].map((d) => (
          <div key={d} className="c2-tl-day">
            <div className="c2-sec">{d === 14 ? 'Пятница, 14 февраля' : 'Суббота, 15 февраля'}</div>
            {items.filter((i) => i.day === d).sort((a, b) => a.hm.localeCompare(b.hm)).map((i) => (
              <button key={i.id} className={'c2-tl-item' + (conflict(i.flag) ? ' conflict' : '') + (sel === i.id ? ' sel' : '')} onClick={() => setSel(i.id)}>
                <span className="c2-tl-time">{i.hm}</span>
                <span className="c2-tl-dot" />
                <span className="c2-tl-text">{i.text}{conflict(i.flag) && <em> · противоречие</em>}</span>
                {i.who && <span className="c2-tl-who"><Portrait id={i.who} /></span>}
              </button>
            ))}
            {items.filter((i) => i.day === d).length === 0 && <div className="c2-muted small">Событий пока нет.</div>}
          </div>
        ))}
      </div>
      {cur && (
        <div className="c2-tl-detail">
          <b>{cur.hm}</b> — {cur.text}
          <div className="c2-chips">{cur.src.map((x) => { const id = x.replace(/^seen:/, ''); return EV[id] ? <button key={x} className="c2-chip" onClick={() => openEv(id)}>{EV[id].title}</button> : null; })}</div>
          {insight && conflict(cur.flag) && <div className="c2-note-line"><b>{insight.title}.</b> {insight.text} <button className="c2-btn small" onClick={() => go('insights')}>В журнал</button></div>}
        </div>
      )}
    </div>
  );
}

export function MessagesScreen() {
  const { s } = useC2();
  const list = EVENTS.filter((e) => s.events.includes(e.id));
  return (
    <div className="c2-page narrow">
      <h2 className="c2-h">Мой телефон</h2>
      <p className="c2-muted">Входящие сообщения и звонки по делу. Каждое привязано к ходу расследования.</p>
      {list.length === 0 && <p className="c2-muted">Входящих пока нет.</p>}
      {list.map((e) => (
        <div key={e.id} className="c2-incoming">
          <Portrait id={e.from} className="c2-av" />
          <div>
            <b>{P2[e.from]?.name}</b> <small>{e.type === 'call' ? '📞 звонок' : e.type === 'voice' ? '🔊 голосовое' : 'сообщение'}</small>
            <p>{e.text}</p>
            {e.audio && <AudioPlayer id={e.audio} />}
          </div>
        </div>
      ))}
    </div>
  );
}

export function NotesScreen() {
  const { s, notes, concl, conclSet, conclDel } = useC2();
  const [t, setT] = useState('');
  const lab = { hyp: 'гипотеза', ok: 'подтверждено', no: 'отвергнуто' } as const;
  return (
    <div className="c2-page narrow">
      <h2 className="c2-h">Заметки и выводы</h2>
      <div className="c2-sec">Мои выводы</div>
      <div className="c2-row"><input className="c2-inp" value={t} placeholder="Сформулируйте вывод или гипотезу…" onChange={(e) => setT(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && t.trim()) { concl(t.trim(), 'hyp'); setT(''); } }} /><button className="c2-btn primary" onClick={() => { if (t.trim()) { concl(t.trim(), 'hyp'); setT(''); } }}>Добавить</button></div>
      <div className="c2-concls">
        {s.conclusions.map((c) => (
          <div key={c.id} className={'c2-concl st-' + c.status}>
            <p>{c.text}</p>
            <div className="c2-row wrap">
              {(['hyp', 'ok', 'no'] as const).map((k) => <button key={k} className={'c2-btn small' + (c.status === k ? ' on' : '')} onClick={() => conclSet(c.id, k)}>{lab[k]}</button>)}
              <button className="c2-btn small ghost" onClick={() => conclDel(c.id)}>удалить</button>
            </div>
          </div>
        ))}
      </div>
      <div className="c2-sec">Рабочие заметки</div>
      <textarea className="c2-notes" value={s.notes} placeholder="Вопросы, расчёты времени, наблюдения…" onChange={(e) => notes(e.target.value)} />
    </div>
  );
}

export function HintModal({ onClose }: { onClose: () => void }) {
  const { s, hint } = useC2();
  const h = currentHint(s);
  const lv = s.hints[h.id] ?? 0;
  return (
    <Modal title="Мне нужна подсказка" onClose={onClose}>
      <p className="c2-muted">Подсказки учитывают ваш прогресс и не называют виновного. Каждый следующий уровень конкретнее.</p>
      {lv === 0 && <p>Нажмите кнопку ниже, чтобы получить мягкое направление.</p>}
      {lv >= 1 && <div className="c2-hint l1"><b>1.</b> {h.l1}</div>}
      {lv >= 2 && <div className="c2-hint l2"><b>2.</b> {h.l2}</div>}
      {lv >= 3 && <div className="c2-hint l3"><b>3.</b> {h.l3}</div>}
      <div className="c2-row end">
        <button className="c2-btn ghost" onClick={onClose}>Закрыть</button>
        {lv < 3 && <button className="c2-btn primary" onClick={() => { hint(h.id); }}>{lv === 0 ? 'Показать подсказку' : 'Конкретнее'}</button>}
      </div>
    </Modal>
  );
}

export function Toasts() {
  const { toast, dismissToast } = useC2();
  const { go } = useNav2();
  if (!toast) return null;
  if (toast.kind === 'ins') {
    const i = INSIGHTS.find((x) => x.id === toast.id);
    if (!i) return null;
    return (
      <div className="c2-toast ins" role="status">
        <div className="c2-bulb" aria-hidden="true" />
        <div><small>ИНСАЙТ · {i.kind === 'fact' ? 'факт' : i.kind === 'contradiction' ? 'противоречие' : i.kind === 'hypothesis' ? 'гипотеза' : 'вопрос'}</small><b>{i.title}</b></div>
        <button className="c2-btn small" onClick={() => { dismissToast(); go('insights'); }}>Открыть</button>
        <button className="c2-x" onClick={dismissToast} aria-label="Закрыть">×</button>
      </div>
    );
  }
  const e = EVENTS.find((x) => x.id === toast.id);
  if (!e) return null;
  return (
    <div className="c2-toast msg" role="status">
      <Portrait id={e.from} className="c2-av" />
      <div><small>{e.type === 'call' ? 'ЗВОНОК' : e.type === 'voice' ? 'ГОЛОСОВОЕ' : 'СООБЩЕНИЕ'} · {P2[e.from]?.short}</small><b>{e.text.length > 90 ? e.text.slice(0, 88) + '…' : e.text}</b></div>
      <button className="c2-btn small" onClick={() => { dismissToast(); go('messages'); }}>Открыть</button>
      <button className="c2-x" onClick={dismissToast} aria-label="Закрыть">×</button>
    </div>
  );
}

