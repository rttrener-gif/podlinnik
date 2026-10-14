import type { Ans, Interview3, S3, Tone } from './types';
import { EV3 } from './data/all';

export function norm(s: string): string {
  return ' ' + s.toLowerCase().replace(/ё/g, 'е').replace(/[^a-zа-я0-9:.\- ]+/g, ' ').replace(/\s+/g, ' ') + ' ';
}

// Условия: ev: seen: flag: ins: ask: show: act: pair: ; «!» — отрицание; «present» — улика предъявляется сейчас
export function check(c: string[] | undefined, s: S3, ctx: { present?: boolean } = {}): boolean {
  if (!c || !c.length) return true;
  return c.every((tok) => {
    if (tok.startsWith('pair:')) return tok.slice(5).split('|').some((p) => s.pairs.includes(p));
    return tok.split('|').some((raw) => {
      let t = raw;
      let neg = false;
      if (t.startsWith('!')) { neg = true; t = t.slice(1); }
      let r = false;
      if (t === 'present') r = !!ctx.present;
      else {
        const i = t.indexOf(':');
        const k = t.slice(0, i), v = t.slice(i + 1);
        r = k === 'ev' ? s.ev.includes(v) : k === 'seen' ? s.seen.includes(v) : k === 'flag' ? s.flags.includes(v) : k === 'ins' ? s.ins.some((x) => x.id === v)
          : k === 'ask' ? s.asked.includes(v) : k === 'show' ? s.shown.includes(v) : k === 'act' ? s.acts.includes(v) : false;
      }
      return neg ? !r : r;
    });
  });
}

export const pairKey = (a: string, b: string) => [a, b].sort().join('+');

export interface Reply { text: string; tone: Tone; sets: string[]; gives: string[]; key: string; idx: number; repeat: boolean; kind: 'topic' | 'know' | 'fallback' }

function pickAns(list: Ans[], s: S3, present: boolean): { a: Ans; idx: number } | null {
  let found = -1;
  list.forEach((a, i) => { if (check(a.when, s, { present })) found = i; });
  // «по умолчанию» — первый без when
  if (found < 0) { const d = list.findIndex((a) => !a.when); if (d >= 0) found = d; }
  return found >= 0 ? { a: list[found], idx: found } : null;
}

/** Свободный вопрос: сопоставление с упоминаемой уликой, затем с темой. */
export function answerQuestion(iv: Interview3, q: string, s: S3, fallbackCount: number): Reply {
  const nq = norm(q);
  // 1. упоминание имеющейся улики, о которой персонаж что-то знает
  let best: { id: string; len: number } | null = null;
  for (const id of s.ev) {
    const e = EV3[id];
    if (!e || !iv.know[id]) continue;
    for (const k of e.kw) {
      const kk = k.toLowerCase().replace(/ё/g, 'е');
      if (kk.length >= 4 && nq.includes(kk) && (!best || kk.length > best.len)) best = { id, len: kk.length };
    }
  }
  if (best) {
    const key = `${iv.person}.ev:${best.id}`;
    const p = pickAns(iv.know[best.id], s, false);
    if (p) return mk(p.a, p.idx, key, s, 'know');
  }
  // 2. тема
  let top: { id: string; score: number } | null = null;
  const hasTime = /\b\d{1,2}[:.]\d{2}\b/.test(nq);
  for (const t of iv.topics) {
    let sc = 0;
    for (const k of t.kw) if (nq.includes(k.toLowerCase().replace(/ё/g, 'е'))) sc += k.length >= 6 ? 3 : k.length >= 4 ? 2 : 1;
    if (hasTime && t.id === 'night') sc += 3;
    if (sc > 0 && (!top || sc > top.score)) top = { id: t.id, score: sc };
  }
  if (top && top.score >= 2) {
    const t = iv.topics.find((x) => x.id === top!.id)!;
    const p = pickAns(t.ans, s, false);
    if (p) return mk(p.a, p.idx, `${iv.person}.${t.id}`, s, 'topic');
  }
  const f = iv.fallback[fallbackCount % iv.fallback.length];
  return { text: f, tone: 'guarded', sets: [], gives: [], key: '', idx: -1, repeat: false, kind: 'fallback' };
}

/** Предъявление конкретной улики. */
export function presentEvidence(iv: Interview3, evId: string, s: S3): Reply {
  const list = iv.know[evId];
  if (!list) {
    return { text: iv.unknown, tone: 'calm', sets: [], gives: [], key: `${iv.person}.ev:${evId}`, idx: 0, repeat: s.shown.includes(`${iv.person}.${evId}`), kind: 'know' };
  }
  const p = pickAns(list, s, true)!;
  return mk(p.a, p.idx, `${iv.person}.ev:${evId}`, s, 'know', true);
}

function mk(a: Ans, idx: number, key: string, s: S3, kind: 'topic' | 'know', present = false): Reply {
  const repeat = s.lastAns[key] === idx && !present;
  return { text: a.text, tone: a.tone ?? 'calm', sets: a.sets ?? [], gives: a.gives ?? [], key, idx, repeat, kind };
}
