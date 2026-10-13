import { useEffect, useRef, useState } from 'react';
import { P2 } from '../data/people';
import { IV2 } from '../data/interviews';
import { useC2 } from '../state';
import { useNav2 } from './nav';
import { Portrait } from '../art/Portrait';
import { Modal, EvThumb } from './Common';
import type { Tone } from '../types';
import { sfx } from '../audio';

const TONE: Record<Tone, string> = {
  calm: 'спокойно', evasive: 'уходит от ответа', shift: 'меняет формулировку', partial: 'признаёт только часть',
  irritated: 'раздражён', counter: 'отвечает встречным вопросом', end: 'просит закончить разговор', reveal: 'сообщает новое', sad: 'подавлен',
};
const LEVEL = ['', 'Первичный разговор', 'Углублённый допрос', 'После противоречий', 'Повторный допрос'];

const SEEN: Record<string, string[]> = {
  alina: [], denis: [], ruslan: [], marina: [], sedykh: [], polina: [], nurova: ['ev:phone-extract|ev:fake-analysis'],
  yarik: ['seen:cam1'], kovalev: ['flag:kovalev_open|ev:kovalev-file'],
  liza: ['ev:clippings|ev:notebook'], irina: ['ev:clippings|ev:notebook'], kseniya: ['ev:clippings|ev:notebook'],
};

export function PeopleScreen() {
  const { cond } = useC2();
  const { go } = useNav2();
  const groups: [string, string[]][] = [
    ['Пропавшая', ['alina']],
    ['Окружение', ['denis', 'polina', 'ruslan', 'marina', 'sedykh', 'yarik', 'kovalev']],
    ['Архивные дела', ['liza', 'irina', 'kseniya']],
    ['Эксперты', ['nurova']],
  ];
  return (
    <div className="c2-page wide">
      <h2 className="c2-h">Люди по делу</h2>
      {groups.map(([g, ids]) => {
        const vis = ids.filter((id) => cond(SEEN[id]));
        if (!vis.length) return null;
        return (
          <div key={g}>
            <div className="c2-sec">{g}</div>
            <div className="c2-people">
              {vis.map((id) => {
                const p = P2[id];
                return (
                  <button key={id} className="c2-person" onClick={() => { sfx('open'); go('interview', id); }}>
                    <Portrait id={id} />
                    <b>{p.name}</b>
                    <span>{p.line}</span>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function InterviewScreen({ id }: { id: string }) {
  const p = P2[id];
  const iv = IV2[id];
  const { s, cond, ask, show } = useC2();
  const { go } = useNav2();
  const [pick, setPick] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const log = s.testimony.filter((t) => t.person === id);
  const mood: Tone = log.length ? log[log.length - 1].tone : 'calm';
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, [log.length]);
  if (!p) return null;

  if (!iv) {
    return (
      <div className="c2-page">
        <button className="c2-btn ghost" onClick={() => go('people')}>← К людям</button>
        <div className="c2-profile"><Portrait id={id} /><div><h2 className="c2-h">{p.name}</h2><div className="c2-muted">{p.role}</div><ul>{p.facts.map((f) => <li key={f}>{f}</li>)}</ul></div></div>
      </div>
    );
  }

  const open = iv.topics.filter((t) => !s.asked.includes(`${id}.${t.id}`) && cond(t.when));
  const locked = iv.topics.filter((t) => !s.asked.includes(`${id}.${t.id}`) && !cond(t.when)).length;
  const levels = [1, 2, 3, 4] as const;

  return (
    <div className="c2-page wide">
      <button className="c2-btn ghost" onClick={() => go('people')}>← К людям</button>
      <div className="c2-iv">
        <aside className="c2-iv-side">
          <Portrait id={id} mood={mood} className="big" />
          <h2 className="c2-h small">{p.name}</h2>
          <div className="c2-muted">{p.role}</div>
          <div className={'c2-mood m-' + mood}>{log.length ? TONE[mood] : 'ожидает вопросов'}</div>
          <ul className="c2-facts">{p.facts.map((f) => <li key={f}>{f}</li>)}</ul>
        </aside>
        <section className="c2-iv-main">
          <div className="c2-log">
            <p className="c2-intro">{iv.intro}</p>
            {log.map((t) => (
              <div key={t.id} className="c2-turn">
                <div className={'c2-q' + (t.via === 'show' ? ' show' : '')}>{t.q}</div>
                <div className="c2-a"><span className={'c2-tone t-' + t.tone}>{TONE[t.tone]}</span>{t.a}</div>
              </div>
            ))}
            <div ref={endRef} />
          </div>
          <div className="c2-controls">
            {levels.map((lv) => {
              const list = open.filter((t) => t.level === lv);
              if (!list.length) return null;
              return (
                <div key={lv}>
                  <div className="c2-sec">{LEVEL[lv]}</div>
                  {list.map((t) => (
                    <button key={t.id} className="c2-topic" onClick={() => { sfx('click'); ask(id, t); }}>
                      <span>{t.label}</span>
                      <small>Основание: {t.basis}</small>
                    </button>
                  ))}
                </div>
              );
            })}
            {open.length === 0 && <p className="c2-muted">Все доступные вопросы заданы. Новые появятся, когда у вас будут новые материалы или противоречия.</p>}
            {locked > 0 && <p className="c2-muted small">Есть ещё вопросы, для которых у вас пока нет оснований.</p>}
            <button className="c2-btn primary" onClick={() => setPick(true)}>Предъявить улику</button>
            {note && <div className="c2-note-line">{note}</div>}
          </div>
        </section>
      </div>
      {pick && (
        <Modal title={`Предъявить: ${p.short}`} onClose={() => setPick(false)} wide>
          <p className="c2-muted">Реакция зависит от того, что именно вы показываете и что вам уже известно.</p>
          <div className="c2-grid small">
            {s.ev.map((e) => (
              <EvThumb key={e} id={e} mark={s.shown.includes(`${id}.${e}`) ? 'показано' : undefined} onClick={() => {
                const r = show(id, e);
                setPick(false);
                if (r === 'dup') { setNote('Этот материал уже предъявлялся; новых сведений у допрашиваемого нет. Вернитесь, когда узнаете больше.'); window.setTimeout(() => setNote(null), 5000); }
              }} />
            ))}
          </div>
        </Modal>
      )}
    </div>
  );
}

