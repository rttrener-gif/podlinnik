import { useC2, currentHint } from '../state';
import { useNav2 } from './nav';
import type { Screen } from './nav';
import { sfx } from '../audio';
import { REQUESTS2 } from '../data/rules';
import { INSIGHTS } from '../data/rules';

interface Obj { id: Screen; label: string; sub: string; x: number; y: number; w: number; h: number; badge?: number; draw: () => JSX.Element }

export function Hub() {
  const { s, cond } = useC2();
  const { go } = useNav2();
  const newEv = s.ev.filter((e) => !s.seen.includes(e)).length;
  const openReq = REQUESTS2.filter((r) => !s.reqs.includes(r.id) && cond(r.when)).length;
  const msgs = s.events.length;
  const goal = currentHint(s).goal;

  const objs: Obj[] = [
    { id: 'board', label: 'Доска', sub: 'связи и выводы', x: 30, y: 30, w: 360, h: 250, draw: () => (
      <g><rect width="360" height="250" fill="#6a4a2e" stroke="#2a1a0e" strokeWidth="8" rx="4" /><rect x="12" y="12" width="336" height="226" fill="#a07a50" />
        {[[30, 30, 70, 56, '#e8e0d0'], [120, 24, 60, 72, '#d8d0c0'], [200, 40, 76, 54, '#e4dccc'], [60, 120, 64, 76, '#d6cebe'], [160, 130, 82, 60, '#e8e0d0']].map(([x, y, w, h, c], i) => <rect key={i} x={x as number} y={y as number} width={w as number} height={h as number} fill={c as string} transform={`rotate(${(i % 3) - 1} ${x} ${y})`} />)}
        <path d="M65 58 L150 60 L238 66 M65 58 L92 158 L200 160" stroke="#c03a3a" strokeWidth="2" fill="none" />
        {[65, 150, 238, 92, 200].map((x, i) => <circle key={i} cx={x} cy={[58, 60, 66, 158, 160][i]} r="5" fill="#c03a3a" />)}</g>
    ) },
    { id: 'places', label: 'Места', sub: 'карта и осмотр', x: 420, y: 30, w: 250, h: 170, draw: () => (
      <g><rect width="250" height="170" fill="#c8bfa3" stroke="#3a3322" strokeWidth="3" /><path d="M0 70 L250 90 M110 0 L130 170 M0 130 L250 120" stroke="#6a6249" strokeWidth="3" /><rect x="40" y="30" width="26" height="20" fill="#7a6a4a" /><rect x="150" y="100" width="30" height="24" fill="#7a6a4a" /><circle cx="170" cy="50" r="10" fill="#c03a3a" /><path d="M170 60 l0 14" stroke="#c03a3a" strokeWidth="3" /></g>
    ) },
    { id: 'evidence', label: 'Улики', sub: 'папка с вещдоками', x: 400, y: 240, w: 230, h: 150, draw: () => (
      <g><path d="M0 24 H80 L96 8 H230 V150 H0Z" fill="#c9a96a" stroke="#4a3a1a" strokeWidth="3" /><rect x="14" y="40" width="196" height="96" fill="#d9bd82" /><text x="112" y="96" textAnchor="middle" fontFamily="PT Mono, monospace" fontSize="18" fill="#4a3a1a">№ 25-0214</text></g>
    ) },
    { id: 'phone', label: 'Телефон Алины', sub: 'переписки, звонки', x: 710, y: 30, w: 120, h: 230, draw: () => (
      <g><rect width="120" height="230" rx="18" fill="#0b0c0e" stroke="#5a5e66" strokeWidth="4" /><rect x="8" y="22" width="104" height="186" rx="6" fill="#0e1520" /><rect x="18" y="60" width="84" height="22" rx="6" fill="#1b2a3a" /><rect x="18" y="90" width="84" height="22" rx="6" fill="#1b2a3a" /><circle cx="60" cy="196" r="6" fill="#222" /></g>
    ) },
    { id: 'people', label: 'Люди', sub: 'допросы', x: 30, y: 320, w: 330, h: 210, draw: () => (
      <g><rect width="330" height="210" fill="#1a1c1f" stroke="#2a2d31" strokeWidth="3" rx="6" />{[0, 1, 2, 3].map((i) => <g key={i} transform={`translate(${16 + i * 78},20)`}><rect width="66" height="84" fill="#d8d0c0" stroke="#222" /><circle cx="33" cy="34" r="16" fill={['#c9a98a', '#a07a5a', '#d8b898', '#8a6a4a'][i]} /><path d="M8 80 q25 -34 50 0" fill={['#2f5a3c', '#4a4d52', '#3a3028', '#6a2a2e'][i]} /></g>)}<text x="165" y="170" textAnchor="middle" fontFamily="PT Mono, monospace" fontSize="14" fill="#9aa0a8">картотека · допросы</text></g>
    ) },
    { id: 'requests', label: 'Запросы', sub: 'экспертизы и обыски', x: 400, y: 440, w: 210, h: 130, draw: () => (
      <g><rect width="210" height="130" fill="#e4dcc6" stroke="#2a2418" strokeWidth="2" /><rect x="14" y="16" width="120" height="8" fill="#555" /><rect x="14" y="36" width="170" height="6" fill="#888" /><rect x="14" y="52" width="150" height="6" fill="#888" /><g transform="translate(130,78) rotate(-8)"><rect width="66" height="30" fill="none" stroke="#a8262f" strokeWidth="3" /><text x="33" y="21" textAnchor="middle" fontFamily="PT Mono, monospace" fontSize="14" fill="#a8262f" fontWeight="bold">ЗАПРОС</text></g></g>
    ) },
    { id: 'timeline', label: 'Хронология', sub: 'ночь по минутам', x: 650, y: 330, w: 200, h: 100, draw: () => (
      <g><rect width="200" height="100" fill="#14181c" stroke="#2a3238" strokeWidth="3" rx="4" /><line x1="16" y1="54" x2="184" y2="54" stroke="#6a7a88" strokeWidth="3" />{[30, 70, 100, 150].map((x, i) => <circle key={x} cx={x} cy="54" r={i === 2 ? 8 : 5} fill={i === 2 ? '#c03a3a' : '#c9a227'} />)}</g>
    ) },
    { id: 'insights', label: 'Журнал инсайтов', sub: 'выводы', x: 650, y: 465, w: 200, h: 110, draw: () => (
      <g><rect width="200" height="110" fill="#2a2418" stroke="#0a0806" strokeWidth="4" rx="4" /><rect x="14" y="16" width="172" height="78" fill="#e8dcc4" />{[0, 1, 2].map((i) => <line key={i} x1="26" y1={40 + i * 18} x2="170" y2={40 + i * 18} stroke="#6a7aa4" />)}<circle cx="168" cy="30" r="8" fill="#ffd45c" /></g>
    ) },
  ];

  const badge: Partial<Record<Screen, number>> = { evidence: newEv, requests: openReq, insights: s.freshIns.length };
  const total = INSIGHTS.length;

  return (
    <div className="c2-hub">
      <div className="c2-goal"><b>Текущая задача.</b> {goal}</div>
      <svg viewBox="0 0 880 640" className="c2-desk" role="group" aria-label="Рабочий стол следователя">
        <defs>
          <linearGradient id="deskg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#201a15" /><stop offset="1" stopColor="#0d0b09" /></linearGradient>
          <radialGradient id="deskl" cx="35%" cy="25%" r="70%"><stop offset="0" stopColor="#ffd9a0" stopOpacity="0.3" /><stop offset="1" stopColor="#ffd9a0" stopOpacity="0" /></radialGradient>
        </defs>
        <rect width="880" height="640" fill="url(#deskg)" />
        <rect width="880" height="640" fill="url(#deskl)" />
        {objs.map((o) => (
          <g key={o.id} transform={`translate(${o.x},${o.y})`} className="c2-obj" tabIndex={0} role="button" aria-label={o.label}
            onClick={() => { sfx('open'); go(o.id); }} onKeyDown={(e) => { if (e.key === 'Enter') go(o.id); }}>
            {o.draw()}
            <rect width={o.w} height={o.h} fill="transparent" />
            <g transform={`translate(0,${o.h + 18})`}>
              <text fontFamily="IBM Plex Sans, sans-serif" fontSize="16" fontWeight="600" fill="#e9e4d8" stroke="#000" strokeWidth="3" paintOrder="stroke">{o.label}</text>
            </g>
            {!!badge[o.id] && <g transform={`translate(${o.w - 14},-6)`}><circle r="14" fill="#a8262f" /><text textAnchor="middle" y="5" fontSize="14" fill="#fff" fontWeight="700">{badge[o.id]}</text></g>}
          </g>
        ))}
      </svg>
      <div className="c2-quick">
        {objs.map((o) => (
          <button key={o.id} className="c2-qbtn" onClick={() => { sfx('open'); go(o.id); }}>
            <b>{o.label}</b><small>{o.sub}</small>
            {!!badge[o.id] && <span className="c2-qbadge">{badge[o.id]}</span>}
          </button>
        ))}
      </div>
      <div className="c2-hub-foot">
        <div><b>{s.ev.length}</b> материалов · <b>{s.ins.length}/{total}</b> инсайтов · <b>{msgs}</b> входящих</div>
        <button className="c2-btn" onClick={() => go('messages')}>Мой телефон{msgs ? ` (${msgs})` : ''}</button>
        <button className="c2-btn" onClick={() => go('notes')}>Заметки</button>
        <button className="c2-btn primary" onClick={() => go('finale')}>Итоговая версия</button>
      </div>
    </div>
  );
}
