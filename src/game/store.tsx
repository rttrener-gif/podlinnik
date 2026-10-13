import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import type { Accusation, GameState, Question } from '../types';
import { DOC_BY_ID, INTERVIEW_BY_PERSON, REQUEST_BY_ID, START_DOC_IDS } from '../content';

const SAVE_KEY = 'podlinnik.save.v1';
const VERSION = 1;

export function freshState(): GameState {
  return {
    v: VERSION,
    started: false,
    startedAt: 0,
    unlocked: [],
    seen: [],
    flags: [],
    asked: [],
    shown: [],
    reqDone: [],
    testimony: [],
    pins: [],
    timeline: [],
    board: {},
    links: [],
    contradictions: [],
    versions: [],
    notes: '',
    journal: [],
    attempts: [],
    solved: false,
    revealed: false,
  };
}

function load(): GameState {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return freshState();
    const parsed = JSON.parse(raw) as GameState;
    if (!parsed || parsed.v !== VERSION) return freshState();
    return { ...freshState(), ...parsed };
  } catch {
    return freshState();
  }
}

export const uid = () => Math.random().toString(36).slice(2, 10);

/** Проверка условий. Токены в массиве — «И», внутри токена через «|» — «ИЛИ». */
export function checkCond(cond: string[] | undefined, s: GameState): boolean {
  if (!cond || cond.length === 0) return true;
  return cond.every((tok) =>
    tok.split('|').some((t) => {
      const i = t.indexOf(':');
      const kind = t.slice(0, i);
      const id = t.slice(i + 1);
      switch (kind) {
        case 'doc':
          return START_DOC_IDS.includes(id) || s.unlocked.includes(id);
        case 'seen':
          return s.seen.includes(id);
        case 'flag':
          return s.flags.includes(id);
        case 'ask':
          return s.asked.includes(id);
        case 'show':
          return s.shown.includes(id);
        case 'req':
          return s.reqDone.includes(id);
        default:
          return false;
      }
    }),
  );
}

export interface FinalCheck {
  verdict: 'wrong' | 'partial' | 'solved';
  headline: string;
  message: string;
  sections: { key: string; label: string; ok: boolean; note: string }[];
}

export interface GameApi {
  state: GameState;
  has: (docId: string) => boolean;
  cond: (c: string[] | undefined) => boolean;
  start: () => void;
  reset: () => void;
  openDoc: (id: string) => void;
  ask: (personId: string, q: Question) => void;
  show: (personId: string, docId: string) => 'new' | 'dup' | 'none';
  doRequest: (id: string) => void;
  pin: (docId: string, text: string) => void;
  unpin: (id: string) => void;
  addTimeline: (item: Omit<GameState['timeline'][number], 'id'>) => void;
  delTimeline: (id: string) => void;
  boardAdd: (nodeId: string) => void;
  boardRemove: (nodeId: string) => void;
  boardMove: (nodeId: string, x: number, y: number) => void;
  linkAdd: (a: string, b: string, label: string) => void;
  linkDel: (id: string) => void;
  contraAdd: (c: Omit<GameState['contradictions'][number], 'id'>) => void;
  contraDel: (id: string) => void;
  versionSave: (v: Omit<GameState['versions'][number], 'id'> & { id?: string }) => void;
  versionDel: (id: string) => void;
  setNotes: (t: string) => void;
  log: (kind: GameState['journal'][number]['kind'], text: string) => void;
  accuse: (a: Accusation) => Promise<FinalCheck>;
  reveal: () => void;
  progress: number;
}

const Ctx = createContext<GameApi | null>(null);

export function useGame(): GameApi {
  const c = useContext(Ctx);
  if (!c) throw new Error('GameProvider missing');
  return c;
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GameState>(load);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(state));
    } catch {
      /* хранилище недоступно — играем без сохранения */
    }
  }, [state]);

  const upd = useCallback((fn: (s: GameState) => GameState) => setState((s) => fn(s)), []);

  const withLog = (s: GameState, kind: GameState['journal'][number]['kind'], text: string): GameState => ({
    ...s,
    journal: [...s.journal, { at: Date.now(), kind, text }],
  });

  const unlockDocs = (s: GameState, ids: string[] | undefined, why: string): GameState => {
    if (!ids) return s;
    const fresh = ids.filter((id) => !START_DOC_IDS.includes(id) && !s.unlocked.includes(id));
    if (!fresh.length) return s;
    let n: GameState = { ...s, unlocked: [...s.unlocked, ...fresh] };
    for (const id of fresh) n = withLog(n, 'sys', `Новый материал: «${DOC_BY_ID[id]?.title ?? id}» (${why}).`);
    return n;
  };

  const setFlags = (s: GameState, flags: string[] | undefined): GameState => {
    if (!flags) return s;
    const fresh = flags.filter((f) => !s.flags.includes(f));
    return fresh.length ? { ...s, flags: [...s.flags, ...fresh] } : s;
  };

  const api = useMemo<GameApi>(() => {
    const has = (id: string) => START_DOC_IDS.includes(id) || state.unlocked.includes(id);
    const totalDocs = Object.keys(DOC_BY_ID).length;
    const haveDocs = Object.keys(DOC_BY_ID).filter(has).length;
    return {
      state,
      has,
      cond: (c) => checkCond(c, state),
      progress: Math.round((haveDocs / totalDocs) * 100),
      start: () =>
        upd((s) =>
          s.started
            ? s
            : withLog({ ...s, started: true, startedAt: Date.now() }, 'sys', 'Расследование начато. Материалы дела переданы вам.'),
        ),
      reset: () => {
        try {
          localStorage.removeItem(SAVE_KEY);
        } catch {
          /* ignore */
        }
        setState(freshState());
      },
      openDoc: (id) =>
        upd((s) => {
          if (s.seen.includes(id)) return s;
          return withLog({ ...s, seen: [...s.seen, id] }, 'doc', `Изучено: «${DOC_BY_ID[id]?.title ?? id}».`);
        }),
      ask: (personId, q) =>
        upd((s) => {
          const key = `${personId}.${q.id}`;
          if (s.asked.includes(key)) return s;
          let n: GameState = {
            ...s,
            asked: [...s.asked, key],
            testimony: [
              ...s.testimony,
              { id: uid(), person: personId, q: q.text, a: q.answer, via: 'ask', at: Date.now() },
            ],
          };
          n = setFlags(n, q.sets);
          n = unlockDocs(n, q.gives, 'допрос');
          return withLog(n, 'ask', `Допрос: ${personId} — «${q.text}»`);
        }),
      show: (personId, docId) => {
        const iv = INTERVIEW_BY_PERSON[personId];
        if (!iv) return 'none';
        const base = iv.confront[docId] ?? { answer: iv.fallback };
        const vs = base.variants ?? [];
        let vi = -1;
        for (let i = vs.length - 1; i >= 0; i--) {
          if (checkCond(vs[i].requires, state)) {
            vi = i;
            break;
          }
        }
        const baseKey = `${personId}.${docId}`;
        const key = vi >= 0 ? `${baseKey}#${vi}` : baseKey;
        if (state.shown.includes(key)) return 'dup';
        const c = vi >= 0 ? vs[vi] : base;
        upd((s) => {
          if (s.shown.includes(key)) return s;
          const shown = s.shown.includes(baseKey) ? [...s.shown, key] : [...s.shown, key, baseKey].filter((v, i, a) => a.indexOf(v) === i);
          let n: GameState = {
            ...s,
            shown,
            testimony: [
              ...s.testimony,
              {
                id: uid(),
                person: personId,
                q: `Предъявлено: «${DOC_BY_ID[docId]?.title ?? docId}»`,
                a: c.answer,
                via: 'show',
                docId,
                at: Date.now(),
              },
            ],
          };
          n = setFlags(n, c.sets);
          n = unlockDocs(n, c.gives, 'допрос');
          return withLog(n, 'show', `Предъявлена улика: «${DOC_BY_ID[docId]?.title ?? docId}» → ${personId}.`);
        });
        return 'new';
      },
      doRequest: (id) =>
        upd((s) => {
          const r = REQUEST_BY_ID[id];
          if (!r || s.reqDone.includes(id) || !checkCond(r.requires, s)) return s;
          let n: GameState = { ...s, reqDone: [...s.reqDone, id] };
          n = setFlags(n, r.sets);
          n = unlockDocs(n, r.gives, 'запрос');
          return withLog(n, 'req', `Запрос выполнен: ${r.title}.`);
        }),
      pin: (docId, text) =>
        upd((s) =>
          s.pins.some((p) => p.docId === docId && p.text === text)
            ? s
            : { ...s, pins: [...s.pins, { id: uid(), docId, text, at: Date.now() }] },
        ),
      unpin: (id) => upd((s) => ({ ...s, pins: s.pins.filter((p) => p.id !== id) })),
      addTimeline: (item) => upd((s) => ({ ...s, timeline: [...s.timeline, { ...item, id: uid() }] })),
      delTimeline: (id) => upd((s) => ({ ...s, timeline: s.timeline.filter((t) => t.id !== id) })),
      boardAdd: (nodeId) =>
        upd((s) => {
          if (s.board[nodeId]) return s;
          const n = Object.keys(s.board).length;
          return {
            ...s,
            board: { ...s.board, [nodeId]: { x: 40 + (n % 5) * 210, y: 40 + Math.floor(n / 5) * 150 } },
          };
        }),
      boardRemove: (nodeId) =>
        upd((s) => {
          const b = { ...s.board };
          delete b[nodeId];
          return { ...s, board: b, links: s.links.filter((l) => l.a !== nodeId && l.b !== nodeId) };
        }),
      boardMove: (nodeId, x, y) => upd((s) => ({ ...s, board: { ...s.board, [nodeId]: { x, y } } })),
      linkAdd: (a, b, label) =>
        upd((s) => (a === b ? s : { ...s, links: [...s.links, { id: uid(), a, b, label }] })),
      linkDel: (id) => upd((s) => ({ ...s, links: s.links.filter((l) => l.id !== id) })),
      contraAdd: (c) => upd((s) => ({ ...s, contradictions: [...s.contradictions, { ...c, id: uid() }] })),
      contraDel: (id) => upd((s) => ({ ...s, contradictions: s.contradictions.filter((c) => c.id !== id) })),
      versionSave: (v) =>
        upd((s) => {
          if (v.id && s.versions.some((x) => x.id === v.id)) {
            return { ...s, versions: s.versions.map((x) => (x.id === v.id ? { ...x, ...v, id: v.id! } : x)) };
          }
          return { ...s, versions: [...s.versions, { ...v, id: uid() }] };
        }),
      versionDel: (id) => upd((s) => ({ ...s, versions: s.versions.filter((v) => v.id !== id) })),
      setNotes: (t) => upd((s) => ({ ...s, notes: t })),
      log: (kind, text) => upd((s) => withLog(s, kind, text)),
      accuse: async (a) => {
        const mod = await import('../content/solution');
        const res = mod.evaluate(a);
        upd((s) => {
          let n: GameState = {
            ...s,
            attempts: [...s.attempts, { at: Date.now(), accusation: a, verdict: res.verdict }],
            solved: s.solved || res.verdict === 'solved',
          };
          n = withLog(n, 'final', `Обвинение подано: ${res.headline}.`);
          return n;
        });
        return res;
      },
      reveal: () =>
        upd((s) => withLog({ ...s, revealed: true }, 'final', 'Решение дела показано по запросу следователя.')),
    };
  }, [state, upd]);

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}
