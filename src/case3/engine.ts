import type { Ans, Interview3, S3, Tone, Topic3 } from './types';
import { EV3 } from './data/all';
import { MENU } from './data/menu';

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

export interface Reply { text: string; tone: Tone; sets: string[]; gives: string[]; key: string; idx: number; repeat: boolean; kind: 'topic' | 'know' }

function pickAns(list: Ans[], s: S3, present: boolean): { a: Ans; idx: number } | null {
  let found = -1;
  list.forEach((a, i) => { if (check(a.when, s, { present })) found = i; });
  // «по умолчанию» — первый без when
  if (found < 0) { const d = list.findIndex((a) => !a.when); if (d >= 0) found = d; }
  return found >= 0 ? { a: list[found], idx: found } : null;
}

export const GROUP_EV = 'Материалы дела';

export interface MenuItem { id: string; label: string; group: string; asked: boolean; stale: boolean }

function topicOf(iv: Interview3, id: string): Topic3 | undefined { return iv.topics.find((t) => t.id === id); }

/** Меню вопросов: что можно спросить сейчас. */
export function buildMenu(iv: Interview3, s: S3): MenuItem[] {
  const out: MenuItem[] = [];
  for (const m of MENU[iv.person] ?? []) {
    if (!check(m.when, s)) continue;
    const key = `${iv.person}.${m.topic ?? m.id}`;
    const asked = s.asked.includes(key);
    const t = topicOf(iv, m.topic ?? m.id);
    let stale = false;
    if (asked && t) { const p = pickAns(t.ans, s, false); stale = !!p && p.idx !== s.lastAns[key]; }
    out.push({ id: m.id, label: m.q, group: m.group, asked, stale });
  }
  for (const evId of Object.keys(iv.know)) {
    if (!s.ev.includes(evId) || !EV3[evId]) continue;
    const key = `${iv.person}.ev:${evId}`;
    const asked = s.asked.includes(key);
    let stale = false;
    if (asked) { const p = pickAns(iv.know[evId], s, false); stale = !!p && p.idx !== s.lastAns[key]; }
    out.push({ id: 'ev:' + evId, label: `Что вы можете сказать о материале «${EV3[evId].title}»?`, group: GROUP_EV, asked, stale });
  }
  return out;
}

/** Ответ на выбранный вопрос меню. */
export function answerMenu(iv: Interview3, qid: string, s: S3): Reply | null {
  if (qid.startsWith('ev:')) {
    const evId = qid.slice(3);
    const list = iv.know[evId];
    if (!list || !s.ev.includes(evId)) return null;
    const key = `${iv.person}.ev:${evId}`;
    const p = pickAns(list, s, false);
    if (!p) return { text: iv.unknown, tone: 'calm', sets: [], gives: [], key, idx: 0, repeat: s.lastAns[key] === 0, kind: 'know' };
    return mk(p.a, p.idx, key, s, 'know');
  }
  const m = (MENU[iv.person] ?? []).find((x) => x.id === qid);
  if (!m || !check(m.when, s)) return null;
  const t = topicOf(iv, m.topic ?? m.id);
  if (!t) return null;
  const p = pickAns(t.ans, s, false);
  if (!p) return null;
  return mk(p.a, p.idx, `${iv.person}.${t.id}`, s, 'topic');
}

/** Предъявление конкретной улики. */
export function presentEvidence(iv: Interview3, evId: string, s: S3): Reply {
  const list = iv.know[evId];
  if (!list) {
    return { text: iv.unknown, tone: 'calm', sets: [], gives: [], key: `${iv.person}.ev:${evId}`, idx: 0, repeat: s.shown.includes(`${iv.person}.${evId}`), kind: 'know' };
  }
  const p = pickAns(list, s, true);
  if (!p) return { text: iv.unknown, tone: 'calm', sets: [], gives: [], key: `${iv.person}.ev:${evId}`, idx: 0, repeat: false, kind: 'know' };
  return mk(p.a, p.idx, `${iv.person}.ev:${evId}`, s, 'know', true);
}

function mk(a: Ans, idx: number, key: string, s: S3, kind: 'topic' | 'know', present = false): Reply {
  const repeat = s.lastAns[key] === idx && !present;
  return { text: a.text, tone: a.tone ?? 'calm', sets: a.sets ?? [], gives: a.gives ?? [], key, idx, repeat, kind };
}

// Вопросы со своими ответами регистрируются как темы допроса.
import { IV3 } from './data/interviews';
for (const iv of IV3) {
  for (const m of MENU[iv.person] ?? []) {
    if (m.ans && !iv.topics.some((t) => t.id === m.id)) iv.topics.push({ id: m.id, kw: [], ans: m.ans });
  }
}
