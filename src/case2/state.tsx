import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import type { Cond, S2, Tone, Topic, Reaction } from './types';
import { START_EV, EV } from './data/evidence';
import { INSIGHTS, REQUESTS2, EVENTS, HINTS } from './data/rules';
import { IV2 } from './data/interviews';
import { sfx } from './audio';

const KEY = 'tikho.case2.save.v1';
const VER = 1;

export const uid = () => Math.random().toString(36).slice(2, 9);

export function fresh(): S2 {
  return {
    v: VER, started: false, ev: [...START_EV], seen: [], flags: [], asked: [], shown: [], reqs: [], pairs: [], ins: [],
    events: [], testimony: [], board: {}, links: [], conclusions: [], notes: '', hints: {}, bookmarks: [], journal: [],
    attempts: [], freshIns: [], freshEv: [], solved: false, revealed: false,
  };
}

function load(): S2 {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return fresh();
    const p = JSON.parse(raw) as S2;
    if (!p || p.v !== VER) return fresh();
    return { ...fresh(), ...p };
  } catch {
    return fresh();
  }
}

export function check(c: Cond | undefined, s: S2): boolean {
  if (!c || !c.length) return true;
  return c.every((tok) => {
    if (tok.startsWith('pair:')) return tok.slice(5).split('|').some((p) => s.pairs.includes(p));
    return tok.split('|').some((t) => {
      const i = t.indexOf(':');
      const k = t.slice(0, i);
      const v = t.slice(i + 1);
      switch (k) {
        case 'ev': return s.ev.includes(v);
        case 'seen': return s.seen.includes(v);
        case 'flag': return s.flags.includes(v);
        case 'ins': return s.ins.some((x) => x.id === v);
        case 'ask': return s.asked.includes(v);
        case 'show': return s.shown.includes(v);
        case 'req': return s.reqs.includes(v);
        default: return false;
      }
    });
  });
}
// pair-токен: «pair:a+b|c+d» — внутри пара через "+", альтернативы через "|" (обрабатывается выше как ИЛИ)

export const pairKey = (a: string, b: string) => [a, b].sort().join('+');

/** Применяет «последствия»: открывает инсайты и события, пока есть что открывать. */
export function settle(s0: S2): S2 {
  let s = s0;
  for (let guard = 0; guard < 10; guard++) {
    let changed = false;
    for (const ins of INSIGHTS) {
      if (s.ins.some((x) => x.id === ins.id)) continue;
      if (check(ins.when, s)) {
        s = {
          ...s,
          ins: [...s.ins, { id: ins.id, at: Date.now() }],
          freshIns: [...s.freshIns, ins.id],
          flags: [...s.flags, ...(ins.sets ?? []).filter((f) => !s.flags.includes(f))],
          journal: [...s.journal, { at: Date.now(), text: `Инсайт: ${ins.title}` }],
        };
        changed = true;
      }
    }
    for (const ev of EVENTS) {
      if (s.events.includes(ev.id)) continue;
      if (check(ev.when, s)) {
        const gives = (ev.gives ?? []).filter((g) => !s.ev.includes(g));
        s = {
          ...s,
          events: [...s.events, ev.id],
          ev: [...s.ev, ...gives],
          freshEv: [...s.freshEv, ...gives],
          flags: [...s.flags, ...(ev.sets ?? []).filter((f) => !s.flags.includes(f))],
          journal: [...s.journal, { at: Date.now(), text: `Сообщение от ${ev.from}: ${ev.text.slice(0, 60)}…` }],
        };
        changed = true;
      }
    }
    if (!changed) break;
  }
  return s;
}

export interface Case2Api {
  s: S2;
  has: (id: string) => boolean;
  cond: (c?: Cond) => boolean;
  start: () => void;
  reset: () => void;
  view: (evId: string) => void;
  acquire: (evId: string) => void;
  ask: (person: string, t: Topic) => void;
  show: (person: string, evId: string) => 'new' | 'dup';
  request: (id: string) => void;
  pair: (a: string, b: string) => string | null;
  setFlag: (f: string) => void;
  boardAdd: (id: string) => void;
  boardRemove: (id: string) => void;
  boardMove: (id: string, x: number, y: number) => void;
  linkAdd: (a: string, b: string, label: string) => void;
  linkDel: (id: string) => void;
  concl: (text: string, status: 'hyp' | 'ok' | 'no') => void;
  conclSet: (id: string, status: 'hyp' | 'ok' | 'no') => void;
  conclDel: (id: string) => void;
  notes: (t: string) => void;
  hint: (id: string) => number;
  bookmark: (id: string) => void;
  clearFresh: () => void;
  attempt: (verdict: string, score: number, solved: boolean) => void;
  reveal: () => void;
  progress: number;
  toast: { kind: 'ins' | 'ev' | 'event'; id: string } | null;
  dismissToast: () => void;
}

const Ctx = createContext<Case2Api | null>(null);
export const useC2 = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error('Case2 provider missing');
  return c;
};

export function Case2Provider({ children }: { children: ReactNode }) {
  const [s, setS] = useState<S2>(load);
  const [toast, setToast] = useState<Case2Api['toast']>(null);
  const first = useRef(true);
  const lastIns = useRef(0);
  const lastEvents = useRef(0);
  const queue = useRef<NonNullable<Case2Api['toast']>[]>([]);

  useEffect(() => {
    if (first.current) { first.current = false; lastIns.current = s.ins.length; lastEvents.current = s.events.length; return; }
    try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* без сохранения */ }
    // очередь тостов о новых инсайтах и событиях
    if (s.ins.length > lastIns.current) {
      s.ins.slice(lastIns.current).forEach((i) => queue.current.push({ kind: 'ins', id: i.id }));
      lastIns.current = s.ins.length;
    }
    if (s.events.length > lastEvents.current) {
      s.events.slice(lastEvents.current).forEach((id) => queue.current.push({ kind: 'event', id }));
      lastEvents.current = s.events.length;
    }
    setToast((t) => {
      if (t || !queue.current.length) return t;
      const n = queue.current.shift()!;
      n.kind === 'ins' ? sfx('insight') : sfx('notify');
      return n;
    });
  }, [s]);

  const dismissToast = useCallback(() => {
    setToast(null);
    window.setTimeout(() => {
      setToast((t) => {
        if (t || !queue.current.length) return t;
        const n = queue.current.shift()!;
        n.kind === 'ins' ? sfx('insight') : sfx('notify');
        return n;
      });
    }, 350);
  }, []);

  const upd = useCallback((fn: (x: S2) => S2) => setS((x) => settle(fn(x))), []);

  const api = useMemo<Case2Api>(() => {
    const addEv = (x: S2, ids: string[]): S2 => {
      const fr = ids.filter((i) => !x.ev.includes(i));
      return fr.length ? { ...x, ev: [...x.ev, ...fr], freshEv: [...x.freshEv, ...fr], journal: [...x.journal, ...fr.map((i) => ({ at: Date.now(), text: `Получено: ${EV[i]?.title ?? i}` }))] } : x;
    };
    const flagUp = (x: S2, fl?: string[]): S2 => (fl && fl.some((f) => !x.flags.includes(f)) ? { ...x, flags: [...x.flags, ...fl.filter((f) => !x.flags.includes(f))] } : x);
    const total = Object.keys(EV).length;
    return {
      s,
      has: (id) => s.ev.includes(id),
      cond: (c) => check(c, s),
      progress: Math.round((s.ev.length / total) * 100),
      start: () => upd((x) => (x.started ? x : { ...x, started: true, journal: [...x.journal, { at: Date.now(), text: 'Дело принято. Исчезновение А. Верхотуровой.' }] })),
      reset: () => { try { localStorage.removeItem(KEY); } catch { /* */ } lastIns.current = 0; lastEvents.current = 0; queue.current = []; setToast(null); setS(fresh()); },
      view: (id) => upd((x) => (x.seen.includes(id) ? x : { ...x, seen: [...x.seen, id] })),
      acquire: (id) => { sfx('evidence'); upd((x) => addEv(x, [id])); },
      ask: (person, t) => upd((x) => {
        const k = `${person}.${t.id}`;
        if (x.asked.includes(k)) return x;
        let n: S2 = { ...x, asked: [...x.asked, k], testimony: [...x.testimony, { id: uid(), person, q: t.label, a: t.answer, tone: t.tone, via: 'ask', at: Date.now() }] };
        n = flagUp(n, t.sets);
        n = addEv(n, t.gives ?? []);
        return n;
      }),
      show: (person, evId) => {
        const iv = IV2[person];
        if (!iv) return 'dup';
        const base: Reaction = iv.react[evId] ?? { answer: iv.fallback, tone: 'calm' };
        const vs = base.variants ?? [];
        let vi = -1;
        for (let i = vs.length - 1; i >= 0; i--) if (check(vs[i].when, s)) { vi = i; break; }
        const baseKey = `${person}.${evId}`;
        const key = vi >= 0 ? `${baseKey}#${vi}` : baseKey;
        if (s.shown.includes(key)) return 'dup';
        const r = vi >= 0 ? vs[vi] : base;
        upd((x) => {
          if (x.shown.includes(key)) return x;
          const shown = Array.from(new Set([...x.shown, key, baseKey]));
          let n: S2 = { ...x, shown, testimony: [...x.testimony, { id: uid(), person, q: `Предъявлено: «${EV[evId]?.title ?? evId}»`, a: r.answer, tone: r.tone, via: 'show', ev: evId, at: Date.now() }] };
          n = flagUp(n, r.sets);
          n = addEv(n, r.gives ?? []);
          return n;
        });
        return 'new';
      },
      request: (id) => upd((x) => {
        const r = REQUESTS2.find((q) => q.id === id);
        if (!r || x.reqs.includes(id) || !check(r.when, x)) return x;
        let n: S2 = { ...x, reqs: [...x.reqs, id], journal: [...x.journal, { at: Date.now(), text: `Выполнен запрос: ${r.title}` }] };
        n = flagUp(n, r.sets);
        n = addEv(n, r.gives);
        return n;
      }),
      pair: (a, b) => {
        const k = pairKey(a, b);
        if (s.pairs.includes(k)) return 'dup';
        upd((x) => (x.pairs.includes(k) ? x : { ...x, pairs: [...x.pairs, k] }));
        return k;
      },
      setFlag: (f) => upd((x) => flagUp(x, [f])),
      boardAdd: (id) => upd((x) => {
        if (x.board[id]) return x;
        const n = Object.keys(x.board).length;
        return { ...x, board: { ...x.board, [id]: { x: 80 + (n % 6) * 190, y: 80 + Math.floor(n / 6) * 200 } } };
      }),
      boardRemove: (id) => upd((x) => { const b = { ...x.board }; delete b[id]; return { ...x, board: b, links: x.links.filter((l) => l.a !== id && l.b !== id) }; }),
      boardMove: (id, px, py) => upd((x) => ({ ...x, board: { ...x.board, [id]: { x: px, y: py } } })),
      linkAdd: (a, b, label) => upd((x) => {
        if (a === b || x.links.some((l) => (l.a === a && l.b === b) || (l.a === b && l.b === a))) return x;
        const stripped = (v: string) => v.replace(/^(ev|person):/, '');
        const k = pairKey(stripped(a), stripped(b));
        return { ...x, links: [...x.links, { id: uid(), a, b, label }], pairs: x.pairs.includes(k) ? x.pairs : [...x.pairs, k] };
      }),
      linkDel: (id) => upd((x) => ({ ...x, links: x.links.filter((l) => l.id !== id) })),
      concl: (text, status) => upd((x) => ({ ...x, conclusions: [...x.conclusions, { id: uid(), text, status }] })),
      conclSet: (id, status) => upd((x) => ({ ...x, conclusions: x.conclusions.map((c) => (c.id === id ? { ...c, status } : c)) })),
      conclDel: (id) => upd((x) => ({ ...x, conclusions: x.conclusions.filter((c) => c.id !== id) })),
      notes: (t) => upd((x) => ({ ...x, notes: t })),
      hint: (id) => {
        const lv = Math.min(3, (s.hints[id] ?? 0) + 1);
        upd((x) => ({ ...x, hints: { ...x.hints, [id]: Math.min(3, (x.hints[id] ?? 0) + 1) } }));
        return lv;
      },
      bookmark: (id) => upd((x) => ({ ...x, bookmarks: x.bookmarks.includes(id) ? x.bookmarks.filter((b) => b !== id) : [...x.bookmarks, id] })),
      clearFresh: () => setS((x) => (x.freshEv.length || x.freshIns.length ? { ...x, freshEv: [], freshIns: [] } : x)),
      attempt: (verdict, score, solved) => upd((x) => ({ ...x, attempts: [...x.attempts, { at: Date.now(), verdict, score }], solved: x.solved || solved })),
      reveal: () => upd((x) => ({ ...x, revealed: true })),
      toast,
      dismissToast,
    };
  }, [s, upd, toast, dismissToast]);

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function currentHint(s: S2) {
  const open = HINTS.filter((h) => check(h.when, s) && !check(h.done, s));
  return open.length ? open[open.length - 1] : HINTS[0];
}

export { type Tone };
