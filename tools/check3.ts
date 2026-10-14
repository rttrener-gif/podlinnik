import { fresh, settle } from '../src/case3/state';
import { answerMenu, buildMenu, presentEvidence, check, pairKey } from '../src/case3/engine';
import { EVIDENCE3, EV3 } from '../src/case3/data/all';
import { ACTIONS3 } from '../src/case3/data/actions';
import { INSIGHTS3, HINTS3, TIMELINE3 } from '../src/case3/data/rules';
import { IV3 } from '../src/case3/data/interviews';
import { FACTS, judge3 } from '../src/case3/data/finale';
import { P3 } from '../src/case3/data/people';
import type { S3 } from '../src/case3/types';

let errs = 0; const err = (m: string) => { errs++; console.log('ERR', m); };
for (const a of ACTIONS3) for (const g of a.gives) if (!EV3[g]) err(`action ${a.id} gives ${g}`);
for (const iv of IV3) { if (!P3[iv.person]) err('person ' + iv.person); for (const t of iv.topics) for (const an of t.ans) for (const g of an.gives ?? []) if (!EV3[g]) err('gives ' + g); for (const k of Object.keys(iv.know)) if (!EV3[k]) err(`know ${iv.person}.${k}`); }
for (const e of EVIDENCE3) for (const p of e.people ?? []) if (!P3[p]) err(`ev ${e.id} person ${p}`);

let s: S3 = settle(fresh());
let prev = '';
for (let r = 0; r < 30; r++) {
  s = { ...s, seen: Array.from(new Set([...s.seen, ...s.ev])) };
  for (const a of ACTIONS3) if (!s.acts.includes(a.id) && check(a.when, s)) s = { ...s, acts: [...s.acts, a.id], ev: Array.from(new Set([...s.ev, ...a.gives])) };
  // допросы: каждый ключевой термин каждой темы + все улики
  for (const iv of IV3) {
    for (const m of buildMenu(iv, s)) {
      const rep = answerMenu(iv, m.id, s);
      if (!rep) { err(`menu item without answer ${iv.person}.${m.id}`); continue; }
      s = { ...s, flags: Array.from(new Set([...s.flags, ...rep.sets])), ev: Array.from(new Set([...s.ev, ...rep.gives])), asked: Array.from(new Set([...s.asked, rep.key])), lastAns: { ...s.lastAns, [rep.key]: rep.idx } };
    }
    for (const e of s.ev) {
      const rep = presentEvidence(iv, e, s);
      s = { ...s, flags: Array.from(new Set([...s.flags, ...rep.sets])), ev: Array.from(new Set([...s.ev, ...rep.gives])), shown: Array.from(new Set([...s.shown, `${iv.person}.${e}`])) };
    }
  }
  for (let i = 0; i < s.ev.length; i++) for (let j = i + 1; j < s.ev.length; j++) { const k = pairKey(s.ev[i], s.ev[j]); if (!s.pairs.includes(k)) s = { ...s, pairs: [...s.pairs, k] }; }
  s = settle(s);
  const sig = JSON.stringify([s.ev.length, s.acts.length, s.flags.length, s.ins.length]);
  if (sig === prev) { console.log('rounds', r); break; } prev = sig;
}
console.log('evidence', s.ev.length, '/', EVIDENCE3.length, 'actions', s.acts.length, '/', ACTIONS3.length, 'insights', s.ins.length, '/', INSIGHTS3.length);
EVIDENCE3.filter((e) => !s.ev.includes(e.id)).forEach((e) => err('unreachable ev ' + e.id));
ACTIONS3.filter((a) => !s.acts.includes(a.id)).forEach((a) => err('unreachable action ' + a.id));
INSIGHTS3.filter((i) => !s.ins.some((x) => x.id === i.id)).forEach((i) => err('unreachable insight ' + i.id));
for (const f of FACTS) { const ok = f.via.some((v) => s.ev.includes(v)); if (!ok) err('fact undiscoverable ' + f.id); for (const v of f.via) if (!EV3[v]) err(`fact ${f.id} via ${v} missing`); }
for (const h of HINTS3) if (h.when.length && !check(h.when, s)) err('hint unreachable ' + h.id);
for (const t of TIMELINE3) for (const src of t.src) if (!EV3[src]) err('tl src ' + src);

// ранний доступ: на старте не должно быть слишком много действий
const st0 = settle(fresh());
const open0 = ACTIONS3.filter((a) => check(a.when, st0));
// на старте у каждого персонажа есть вопросы, но нет вопросов со ссылкой на непросмотренные улики
const st1 = settle(fresh());
for (const iv of IV3) { const m = buildMenu(iv, st1); console.log('вопросов на старте', iv.person, m.length); }
console.log('действий на старте:', open0.length, open0.map((a) => a.id).join(', '));

const good = judge3({ ans: { cause: 'oral', who: 'orekhova', others: 'two', nurse: 'neglect', doctor: 'two', rakh: 'theft', money: 'none', motive: 'mercy' }, evidence: ['tox-deep', 'cctv', 'rx-trace', 'search-orekhova'], rejected: ['a-nurse', 'a-inject', 'a-annuity', 'a-timur', 'a-hallu'], summary: '' });
const wrong = judge3({ ans: { cause: 'inject', who: 'laptev', others: 'nurse', nurse: 'killer', doctor: 'lead', rakh: 'killer', money: 'motive', motive: 'money' }, evidence: [], rejected: [], summary: '' });
console.log('good', good.verdict, good.score, '| wrong', wrong.verdict, wrong.score);
console.log(errs ? 'FAILED ' + errs : 'ALL OK');
