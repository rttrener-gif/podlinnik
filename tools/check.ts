import { ALL_DOCS, DOC_BY_ID, START_DOC_IDS, INTERVIEWS, REQUESTS, PEOPLE_BY_ID, CLAIMS } from '../src/content';
import { checkCond, freshState } from '../src/game/store';
import { evaluate } from '../src/content/solution';

let errors = 0;
const err = (m: string) => { errors++; console.log('ERR', m); };

// 1. ссылки на документы
for (const r of REQUESTS) for (const g of r.gives) if (!DOC_BY_ID[g]) err(`request ${r.id} gives unknown doc ${g}`);
for (const iv of INTERVIEWS) {
  if (!PEOPLE_BY_ID[iv.person]) err('unknown person ' + iv.person);
  for (const q of iv.questions) for (const g of q.gives ?? []) if (!DOC_BY_ID[g]) err(`q ${iv.person}.${q.id} gives unknown ${g}`);
  for (const [d, c] of Object.entries(iv.confront)) {
    if (!DOC_BY_ID[d]) err(`confront ${iv.person} unknown doc ${d}`);
    for (const g of c.gives ?? []) if (!DOC_BY_ID[g]) err(`confront gives unknown ${g}`);
  }
}
for (const d of ALL_DOCS) for (const p of d.people ?? []) if (!PEOPLE_BY_ID[p]) err(`doc ${d.id} unknown person ${p}`);

// 2. симуляция: жадно выполняем всё, что доступно
const s = freshState();
const unlock = (id: string) => { if (!START_DOC_IDS.includes(id) && !s.unlocked.includes(id)) { s.unlocked.push(id); return true; } return false; };
let changed = true; let rounds = 0;
const tokens = new Set<string>();
while (changed && rounds < 50) {
  changed = false; rounds++;
  for (const d of ALL_DOCS) if ((START_DOC_IDS.includes(d.id) || s.unlocked.includes(d.id)) && !s.seen.includes(d.id)) { s.seen.push(d.id); changed = true; }
  for (const r of REQUESTS) if (!s.reqDone.includes(r.id) && checkCond(r.requires, s)) {
    s.reqDone.push(r.id); r.gives.forEach(unlock); (r.sets ?? []).forEach((f) => !s.flags.includes(f) && s.flags.push(f)); changed = true;
  }
  for (const iv of INTERVIEWS) {
    for (const q of iv.questions) {
      const k = `${iv.person}.${q.id}`;
      if (!s.asked.includes(k) && checkCond(q.requires, s)) {
        s.asked.push(k); (q.sets ?? []).forEach((f) => !s.flags.includes(f) && s.flags.push(f)); (q.gives ?? []).forEach(unlock); changed = true;
      }
    }
    for (const doc of ALL_DOCS) {
      if (!(START_DOC_IDS.includes(doc.id) || s.unlocked.includes(doc.id))) continue;
      const k = `${iv.person}.${doc.id}`;
      const c = iv.confront[doc.id];
      if (c && !s.shown.includes(k)) {
        s.shown.push(k); (c.sets ?? []).forEach((f) => !s.flags.includes(f) && s.flags.push(f)); (c.gives ?? []).forEach(unlock); changed = true;
      }
    }
  }
}
const missing = ALL_DOCS.filter((d) => !START_DOC_IDS.includes(d.id) && !s.unlocked.includes(d.id));
console.log('rounds', rounds, 'unlocked', s.unlocked.length, '/', ALL_DOCS.length - START_DOC_IDS.length);
missing.forEach((d) => err('unreachable doc ' + d.id));
const unreachedQ = INTERVIEWS.flatMap((iv) => iv.questions.filter((q) => !s.asked.includes(`${iv.person}.${q.id}`)).map((q) => `${iv.person}.${q.id}`));
unreachedQ.forEach((q) => err('unreachable question ' + q));
REQUESTS.filter((r) => !s.reqDone.includes(r.id)).forEach((r) => err('unreachable request ' + r.id));
for (const c of CLAIMS) if (!checkCond(c.req, s)) err('claim unreachable ' + c.id);

// 3. проверка оценки
const good = { suspect: 'shatz', method: 'push', entry: 'e3', moment: 't0115', motive: 'invest',
  evidence: ['outdoor', 'shatz-cdr', 'landline', 'irina-chat', 'smarthome', 'bank-shatz', 'me-full'],
  lies: ['shatz_phone', 'shatz_left', 'shatz_time', 'nina_window'] };
console.log('good ->', evaluate(good).verdict);
console.log('wrong suspect ->', evaluate({ ...good, suspect: 'ledov' }).verdict);
console.log('partial ->', evaluate({ ...good, method: 'accident' }).verdict);
console.log('no lies ->', evaluate({ ...good, lies: [] }).verdict);
console.log(errors ? `FAILED: ${errors} errors` : 'ALL OK');
