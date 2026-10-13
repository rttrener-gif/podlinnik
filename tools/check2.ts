import { fresh, settle, check, pairKey } from '../src/case2/state';
import { EVIDENCE, EV } from '../src/case2/data/evidence';
import { PLACES } from '../src/case2/data/places';
import { REQUESTS2, INSIGHTS, EVENTS, HINTS, TIMELINE } from '../src/case2/data/rules';
import { INTERVIEWS2 } from '../src/case2/data/interviews';
import { AUDIO, THREADS } from '../src/case2/data/media';
import { P2 } from '../src/case2/data/people';
import { judge, QUESTIONS } from '../src/case2/data/finale';

let errs = 0;
const err = (m: string) => { errs++; console.log('ERR', m); };

for (const e of EVIDENCE) { for (const p of e.people ?? []) if (!P2[p]) err(`ev ${e.id} person ${p}`); if (e.audio && !AUDIO[e.audio]) err(`ev ${e.id} audio`); }
for (const r of REQUESTS2) for (const g of r.gives) if (!EV[g]) err(`req ${r.id} gives ${g}`);
for (const iv of INTERVIEWS2) {
  if (!P2[iv.person]) err('person ' + iv.person);
  for (const t of iv.topics) for (const g of t.gives ?? []) if (!EV[g]) err(`topic ${t.id} gives ${g}`);
  for (const k of Object.keys(iv.react)) if (!EV[k]) err(`react ${iv.person}.${k} unknown ev`);
}
for (const e of EVENTS) { for (const g of e.gives ?? []) if (!EV[g]) err('event gives ' + g); if (!P2[e.from]) err('event from'); }
for (const pl of PLACES) for (const sp of pl.spots) if (sp.ev && !EV[sp.ev]) err(`spot ${sp.id} ev ${sp.ev}`);
for (const t of THREADS) if (!P2[t.avatar]) err('thread avatar');

// симуляция прохождения
let s = fresh();
const ACT = Date.now();
let rounds = 0, changed = true;
while (changed && rounds++ < 40) {
  changed = false;
  const before = JSON.stringify([s.ev, s.reqs, s.asked, s.shown, s.pairs, s.seen, s.flags]);
  // осмотр мест
  for (const pl of PLACES) {
    if (!check(pl.when, s)) continue;
    for (const sp of pl.spots) if (sp.ev && check(sp.when, s) && !s.ev.includes(sp.ev)) { s = { ...s, ev: [...s.ev, sp.ev] }; }
  }
  if (s.flags.includes('extracted') && !s.ev.includes('memo-alina')) s = { ...s, ev: [...s.ev, 'memo-alina'] };
  if (s.ev.includes('phone-alina') && s.flags.includes('pin_ok') && !s.ev.includes('school-photo')) s = { ...s, ev: [...s.ev, 'school-photo'] };
  // «просмотр» всех материалов
  s = { ...s, seen: Array.from(new Set([...s.seen, ...s.ev])) };
  s = settle(s);
  for (const r of REQUESTS2) if (!s.reqs.includes(r.id) && check(r.when, s)) {
    s = { ...s, reqs: [...s.reqs, r.id], flags: [...s.flags, ...(r.sets ?? [])], ev: Array.from(new Set([...s.ev, ...r.gives])) };
  }
  // допросы
  for (const iv of INTERVIEWS2) {
    for (const t of iv.topics) if (!s.asked.includes(`${iv.person}.${t.id}`) && check(t.when, s)) {
      s = { ...s, asked: [...s.asked, `${iv.person}.${t.id}`], flags: [...s.flags, ...(t.sets ?? [])], ev: Array.from(new Set([...s.ev, ...(t.gives ?? [])])) };
    }
    for (const [evId, r] of Object.entries(iv.react)) if (s.ev.includes(evId) && !s.shown.includes(`${iv.person}.${evId}`)) {
      s = { ...s, shown: [...s.shown, `${iv.person}.${evId}`], flags: [...s.flags, ...(r.sets ?? [])], ev: Array.from(new Set([...s.ev, ...(r.gives ?? [])])) };
    }
  }
  // сопоставления: все пары
  for (let i = 0; i < s.ev.length; i++) for (let j = i + 1; j < s.ev.length; j++) {
    const k = pairKey(s.ev[i], s.ev[j]);
    if (!s.pairs.includes(k)) s = { ...s, pairs: [...s.pairs, k] };
  }
  s = settle(s);
  if (JSON.stringify([s.ev, s.reqs, s.asked, s.shown, s.pairs, s.seen, s.flags]) !== before) changed = true;
}
console.log('rounds', rounds, 'evidence', s.ev.length, '/', EVIDENCE.length, 'insights', s.ins.length, '/', INSIGHTS.length, 'events', s.events.length, '/', EVENTS.length, 'reqs', s.reqs.length, '/', REQUESTS2.length);
EVIDENCE.filter((e) => !s.ev.includes(e.id)).forEach((e) => err('unreachable evidence ' + e.id));
INSIGHTS.filter((i) => !s.ins.some((x) => x.id === i.id)).forEach((i) => err('unreachable insight ' + i.id));
EVENTS.filter((e) => !s.events.includes(e.id)).forEach((e) => err('unreachable event ' + e.id));
REQUESTS2.filter((r) => !s.reqs.includes(r.id)).forEach((r) => err('unreachable request ' + r.id));
INTERVIEWS2.forEach((iv) => iv.topics.filter((t) => !s.asked.includes(`${iv.person}.${t.id}`)).forEach((t) => err(`unreachable topic ${iv.person}.${t.id}`)));
TIMELINE.filter((t) => !check(t.src, s)).forEach((t) => err('timeline unreachable ' + t.id));
HINTS.forEach((h) => { if (h.when.length && !check(h.when, s)) err('hint when unreachable ' + h.id); });

const good = judge({ ans: { exit: 'shaft', helper: 'yarik', msg1: 'sched', msg2: 'montage', culprit: 'sedykh', link: 'method', where: 'school' }, evidence: ['panel', 'phone-extract', 'fake-analysis', 'key-log'], rejected: ['a-denis', 'a-inside', 'a-live', 'a-ruslan', 'a-fin', 'a-fake'], summary: 'Алина ушла сама через шахту, а её голос подменили записью из студии. '.repeat(2) });
console.log('good ->', good.verdict, good.score);
const bad = judge({ ans: { exit: 'door', helper: 'denis', msg1: 'live', msg2: 'real', culprit: 'denis', link: 'coincidence', where: 'abroad' }, evidence: [], rejected: [], summary: '' });
console.log('bad ->', bad.verdict, bad.score);
console.log(QUESTIONS.length, errs ? `FAILED ${errs}` : 'ALL OK');
