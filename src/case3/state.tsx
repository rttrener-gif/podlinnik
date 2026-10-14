import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import type { S3, Tone } from './types';
import { START3, EV3 } from './data/all';
import { ACTIONS3 } from './data/actions';
import { INSIGHTS3, HINTS3 } from './data/rules';
import { IV3M } from './data/interviews';
import { answerMenu, check, pairKey, presentEvidence } from './engine';
import { MENU } from './data/menu';

const KEY = 'tikho.case3.save.v1';
const VER = 1;
export const uid = () => Math.random().toString(36).slice(2, 9);

export function fresh(): S3 {
  return { v: VER, started: false, ev: [...START3], seen: [], flags: [], asked: [], lastAns: {}, shown: [], acts: [], noticed: [], pendingNotice: [], pairs: [], ins: [], freshIns: [], log: [], hints: {}, board: {}, links: [], versions: [], notes: '', attempts: [], solved: false, revealed: false };
}
function load(): S3 {
  try {
    const r = localStorage.getItem(KEY);
    if (!r) return fresh();
    const p = JSON.parse(r) as S3;
    return p && p.v === VER ? { ...fresh(), ...p } : fresh();
  } catch { return fresh(); }
}

export function settle(s0: S3): S3 {
  let s = s0;
  for (let g = 0; g < 6; g++) {
    let ch = false;
    for (const i of INSIGHTS3) {
      if (s.ins.some((x) => x.id === i.id)) continue;
      if (check(i.when, s)) { s = { ...s, ins: [...s.ins, { id: i.id, at: Date.now() }], freshIns: [...s.freshIns, i.id] }; ch = true; }
    }
    for (const a of ACTIONS3) {
      if (s.noticed.includes(a.id)) continue;
      if (check(a.when, s)) { s = { ...s, noticed: [...s.noticed, a.id], pendingNotice: [...s.pendingNotice, a.id] }; ch = true; }
    }
    if (!ch) break;
  }
  return s;
}

export interface Api3 {
  s: S3;
  cond: (c?: string[]) => boolean;
  start: () => void;
  reset: () => void;
  view: (id: string) => void;
  ask: (person: string, qid: string) => 'new' | 'repeat' | 'dup';
  show: (person: string, ev: string) => 'new' | 'dup';
  act: (id: string) => void;
  pair: (a: string, b: string) => void;
  boardAdd: (id: string) => void;
  boardRemove: (id: string) => void;
  boardMove: (id: string, x: number, y: number) => void;
  linkAdd: (a: string, b: string, label: string) => void;
  linkSet: (id: string, st: 'hyp' | 'ok') => void;
  linkDel: (id: string) => void;
  versionSave: (v: { id?: string; title: string; who: string; text: string; sup: string[]; con: string[]; status: 'open' | 'held' | 'rejected' }) => void;
  versionDel: (id: string) => void;
  notes: (t: string) => void;
  hint: (key: string) => number;
  clearNotices: () => void;
  clearFresh: () => void;
  attempt: (score: number, verdict: string, solved: boolean) => void;
  reveal: () => void;
}
const Ctx = createContext<Api3 | null>(null);
export const useC3 = () => { const c = useContext(Ctx); if (!c) throw new Error('c3'); return c; };

export function Case3Provider({ children }: { children: ReactNode }) {
  const [s, setS] = useState<S3>(() => settle(load()));
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* */ }
  }, [s]);
  const upd = useCallback((fn: (x: S3) => S3) => setS((x) => settle(fn(x))), []);

  const api = useMemo<Api3>(() => {
    const addEv = (x: S3, ids: string[]) => { const f = ids.filter((i) => EV3[i] && !x.ev.includes(i)); return f.length ? { ...x, ev: [...x.ev, ...f] } : x; };
    const addFlags = (x: S3, fl: string[]) => { const f = fl.filter((i) => !x.flags.includes(i)); return f.length ? { ...x, flags: [...x.flags, ...f] } : x; };
    return {
      s,
      cond: (c) => check(c, s),
      start: () => upd((x) => (x.started ? x : { ...x, started: true })),
      reset: () => { try { localStorage.removeItem(KEY); } catch { /* */ } setS(settle(fresh())); },
      view: (id) => upd((x) => (x.seen.includes(id) ? x : { ...x, seen: [...x.seen, id] })),
      ask: (person, qid) => {
        const iv = IV3M[person];
        if (!iv) return 'dup';
        const r = answerMenu(iv, qid, s);
        if (!r) return 'dup';
        if (r.repeat) return 'repeat';
        upd((x) => {
          const rr = answerMenu(iv, qid, x);
          if (!rr || rr.repeat) return x;
          let n: S3 = { ...x, asked: x.asked.includes(rr.key) ? x.asked : [...x.asked, rr.key], lastAns: { ...x.lastAns, [rr.key]: rr.idx } };
          n = addFlags(n, rr.sets); n = addEv(n, rr.gives);
          const label = qid.startsWith('ev:') ? `Что вы можете сказать о материале «${EV3[qid.slice(3)]?.title ?? ''}»?` : (MENU[person] ?? []).find((m) => m.id === qid)?.q ?? qid;
          return { ...n, log: [...n.log, { id: uid(), person, q: label, a: rr.text, tone: rr.tone, at: Date.now(), kind: 'ask', qid, key: rr.key }] };
        });
        return 'new';
      },
      show: (person, evId) => {
        const iv = IV3M[person];
        if (!iv) return 'dup';
        const base = `${person}.${evId}`;
        const r = presentEvidence(iv, evId, s);
        const key = `${base}#${r.idx}`;
        if (s.shown.includes(key)) return 'dup';
        upd((x) => {
          if (x.shown.includes(key)) return x;
          let n: S3 = { ...x, shown: Array.from(new Set([...x.shown, key, base])), lastAns: { ...x.lastAns, [r.key]: r.idx } };
          n = addFlags(n, r.sets); n = addEv(n, r.gives);
          return { ...n, log: [...n.log, { id: uid(), person, q: `Предъявлено: «${EV3[evId]?.title ?? evId}»`, a: r.text, tone: r.tone, at: Date.now(), kind: 'show' }] };
        });
        return 'new';
      },
      act: (id) => upd((x) => {
        const a = ACTIONS3.find((q) => q.id === id);
        if (!a || x.acts.includes(id) || !check(a.when, x)) return x;
        let n: S3 = { ...x, acts: [...x.acts, id] };
        n = addEv(n, a.gives); n = addFlags(n, a.sets ?? []);
        return n;
      }),
      pair: (a, b) => upd((x) => { const k = pairKey(a, b); return x.pairs.includes(k) ? x : { ...x, pairs: [...x.pairs, k] }; }),
      boardAdd: (id) => upd((x) => { if (x.board[id]) return x; const n = Object.keys(x.board).length; return { ...x, board: { ...x.board, [id]: { x: 40 + (n % 5) * 230, y: 40 + Math.floor(n / 5) * 120 } } }; }),
      boardRemove: (id) => upd((x) => { const b = { ...x.board }; delete b[id]; return { ...x, board: b, links: x.links.filter((l) => l.a !== id && l.b !== id) }; }),
      boardMove: (id, px, py) => upd((x) => ({ ...x, board: { ...x.board, [id]: { x: px, y: py } } })),
      linkAdd: (a, b, label) => upd((x) => {
        if (a === b || x.links.some((l) => (l.a === a && l.b === b) || (l.a === b && l.b === a))) return x;
        const strip = (v: string) => v.replace(/^(ev|person):/, '');
        const k = pairKey(strip(a), strip(b));
        return { ...x, links: [...x.links, { id: uid(), a, b, label, status: 'hyp' }], pairs: x.pairs.includes(k) ? x.pairs : [...x.pairs, k] };
      }),
      linkSet: (id, st) => upd((x) => ({ ...x, links: x.links.map((l) => (l.id === id ? { ...l, status: st } : l)) })),
      linkDel: (id) => upd((x) => ({ ...x, links: x.links.filter((l) => l.id !== id) })),
      versionSave: (v) => upd((x) => (v.id && x.versions.some((q) => q.id === v.id) ? { ...x, versions: x.versions.map((q) => (q.id === v.id ? { ...q, ...v, id: v.id! } : q)) } : { ...x, versions: [...x.versions, { ...v, id: uid() }] })),
      versionDel: (id) => upd((x) => ({ ...x, versions: x.versions.filter((v) => v.id !== id) })),
      notes: (t) => upd((x) => ({ ...x, notes: t })),
      hint: (key) => { const lv = Math.min(3, (s.hints[key] ?? 0) + 1); upd((x) => ({ ...x, hints: { ...x.hints, [key]: Math.min(3, (x.hints[key] ?? 0) + 1) } })); return lv; },
      clearNotices: () => setS((x) => (x.pendingNotice.length ? { ...x, pendingNotice: [] } : x)),
      clearFresh: () => setS((x) => (x.freshIns.length ? { ...x, freshIns: [] } : x)),
      attempt: (score, verdict, solved) => upd((x) => ({ ...x, attempts: [...x.attempts, { at: Date.now(), score, verdict }], solved: x.solved || solved })),
      reveal: () => upd((x) => ({ ...x, revealed: true })),
    };
  }, [s, upd]);

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function globalHint(s: S3) {
  const open = HINTS3.filter((h) => check(h.when, s) && !check(h.done, s));
  return open.length ? open[open.length - 1] : HINTS3[0];
}
