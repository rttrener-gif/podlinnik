import type { ReactNode } from 'react';
import { CAM_EVENTS, hmOf, dayOf, MIN } from '../data/media';

function Bench({ id, children }: { id: string; children: ReactNode }) {
  return (
    <svg viewBox="0 0 600 400" className="item-svg" role="img" aria-hidden="true">
      <defs>
        <linearGradient id={`b${id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2b2824" /><stop offset="1" stopColor="#14120f" /></linearGradient>
        <filter id={`n${id}`}><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="5" /><feColorMatrix type="saturate" values="0" /><feComponentTransfer><feFuncA type="linear" slope="0.18" /></feComponentTransfer></filter>
        <radialGradient id={`v${id}`} cx="50%" cy="50%" r="75%"><stop offset="55%" stopColor="#000" stopOpacity="0" /><stop offset="100%" stopColor="#000" stopOpacity="0.6" /></radialGradient>
        <radialGradient id={`l${id}`} cx="50%" cy="40%" r="60%"><stop offset="0" stopColor="#fff2d8" stopOpacity="0.28" /><stop offset="1" stopColor="#fff2d8" stopOpacity="0" /></radialGradient>
      </defs>
      <rect width="600" height="400" fill={`url(#b${id})`} />
      {children}
      <rect width="600" height="400" fill={`url(#l${id})`} />
      {/* масштабная линейка вещдока */}
      <g transform="translate(24,372)">
        <rect width="140" height="12" fill="#d8d0b8" stroke="#1d1a14" />
        {Array.from({ length: 15 }).map((_, i) => <line key={i} x1={i * 10} y1="0" x2={i * 10} y2={i % 5 === 0 ? 12 : 6} stroke="#1d1a14" />)}
      </g>
      <rect width="600" height="400" filter={`url(#n${id})`} />
      <rect width="600" height="400" fill={`url(#v${id})`} />
    </svg>
  );
}

function Paper({ lines = [], hand = false, stamp, w = 330, h = 300, rot = -2 }: { lines?: string[]; hand?: boolean; stamp?: string; w?: number; h?: number; rot?: number }) {
  return (
    <g transform={`translate(${300 - w / 2},${50}) rotate(${rot} ${w / 2} ${h / 2})`}>
      <rect width={w} height={h} fill="#e4dcc6" stroke="#2a2418" strokeWidth="2" />
      <rect width={w} height={h} fill="#000" opacity="0.05" />
      {hand && Array.from({ length: Math.floor(h / 26) }).map((_, i) => <line key={i} x1="14" y1={30 + i * 26} x2={w - 14} y2={30 + i * 26} stroke="#8aa3c4" strokeWidth="1" />)}
      {lines.map((t, i) => (
        <text key={i} x="22" y={36 + i * (hand ? 26 : 24)} fontFamily={hand ? 'Caveat, cursive' : 'PT Mono, monospace'} fontSize={hand ? 21 : 14} fill={hand ? '#1b2a5a' : '#222'} fontWeight={i === 0 && !hand ? 'bold' : 'normal'}>{t}</text>
      ))}
      {stamp && <g transform={`translate(${w - 120},${h - 60}) rotate(-8)`}><rect width="108" height="34" fill="none" stroke="#a8262f" strokeWidth="3" /><text x="54" y="23" textAnchor="middle" fontFamily="PT Mono, monospace" fontSize="14" fill="#a8262f" fontWeight="bold">{stamp}</text></g>}
    </g>
  );
}

function Wave({ x, y, w, color = '#c9a227', seed = 1 }: { x: number; y: number; w: number; color?: string; seed?: number }) {
  const bars = Math.floor(w / 5);
  return <g>{Array.from({ length: bars }).map((_, i) => { const h = 6 + Math.abs(Math.sin(i * 0.37 + seed) * Math.cos(i * 0.11 + seed * 2)) * 44; return <rect key={i} x={x + i * 5} y={y - h / 2} width="3" height={h} fill={color} opacity={0.9} />; })}</g>;
}

export function ItemArt({ art, lines, id }: { art: string; lines?: string[]; id: string }) {
  const k = id;
  switch (art) {
    case 'doc':
      return <Bench id={k}><Paper lines={lines ?? []} stamp="ПРИОБЩЕНО" /></Bench>;
    case 'receipt':
      return <Bench id={k}><g transform="translate(200,26)"><rect width="200" height="330" fill="#f2f0e6" stroke="#222" /><path d="M0 330 l12 -10 l12 10 l12 -10 l12 10 l12 -10 l12 10 l12 -10 l12 10 l12 -10 l12 10 l12 -10 l12 10 l12 -10 l12 10 l12 -10 l12 10 l12 -10 l12 10 l8 -10 v10z" fill="#14120f" />{(lines ?? []).map((t, i) => <text key={i} x="12" y={32 + i * 26} fontFamily="PT Mono, monospace" fontSize="12.5" fill="#222">{t}</text>)}</g></Bench>;
    case 'notebook':
      return <Bench id={k}><Paper lines={lines ?? []} hand w={360} h={310} /><g><rect x="130" y="40" width="10" height="320" fill="#2a2a2e" opacity="0" /></g>{Array.from({ length: 12 }).map((_, i) => <circle key={i} cx="226" cy={64 + i * 24} r="4" fill="#2a2a2e" />)}</Bench>;
    case 'calendar':
      return <Bench id={k}><g transform="translate(190,30)"><rect width="220" height="320" fill="#d8d2c2" stroke="#2a2822" strokeWidth="3" /><rect width="220" height="40" fill="#7a2a2e" /><text x="110" y="28" textAnchor="middle" fill="#f0e8d8" fontFamily="PT Mono, monospace" fontSize="18">ФЕВРАЛЬ 2025</text>{Array.from({ length: 28 }).map((_, i) => <text key={i} x={16 + (i % 7) * 28} y={80 + Math.floor(i / 7) * 46} fontSize="16" fill="#222" fontFamily="PT Mono, monospace">{i + 1}</text>)}<ellipse cx="192" cy="75" rx="20" ry="17" fill="none" stroke="#c03a3a" strokeWidth="3" /><text x="110" y="300" textAnchor="middle" fontFamily="Caveat, cursive" fontSize="36" fill="#c03a3a">03:12</text></g></Bench>;
    case 'bolt':
      return <Bench id={k}><rect x="120" y="40" width="360" height="300" fill="#2d2a26" stroke="#0a0908" strokeWidth="5" /><rect x="190" y="170" width="220" height="26" rx="4" fill="#9aa0a6" stroke="#0a0b0c" strokeWidth="3" /><rect x="190" y="160" width="20" height="46" fill="#6a7077" /><rect x="400" y="164" width="14" height="38" fill="#6a7077" /><circle cx="300" cy="200" r="6" fill="#222" opacity="0" /><path d="M120 40 l-8 60 l10 80 l-6 100" stroke="#000" strokeWidth="6" fill="none" opacity="0.5" /><text x="300" y="370" textAnchor="middle" fill="#cfc7b2" fontFamily="PT Mono, monospace" fontSize="13">засов — внутри студии, высота 140 см</text></Bench>;
    case 'window':
      return <Bench id={k}><rect x="140" y="30" width="320" height="320" fill="#0f1826" stroke="#06080b" strokeWidth="9" /><line x1="300" y1="30" x2="300" y2="350" stroke="#06080b" strokeWidth="7" /><path d="M140 340 H460" stroke="#cfcab8" strokeWidth="9" /><g stroke="#c9c2a8" strokeWidth="1.2" opacity="0.6">{Array.from({ length: 9 }).map((_, i) => <line key={i} x1={150 + i * 36} y1="325" x2={156 + i * 36} y2="343" />)}</g><path d="M146 34 L454 34 M146 346 L454 346" stroke="#8a8f94" strokeWidth="3" strokeDasharray="6 6" /><text x="300" y="380" textAnchor="middle" fill="#cfc7b2" fontFamily="PT Mono, monospace" fontSize="13">герметик по периметру, пыль нетронута</text></Bench>;
    case 'lamp':
      return <Bench id={k}><rect x="120" y="140" width="360" height="130" rx="14" fill="#2a0c0e" stroke="#0a0505" strokeWidth="5" /><text x="300" y="228" textAnchor="middle" fontFamily="PT Mono, monospace" fontSize="64" letterSpacing="8" fill="#a8262f">ON AIR</text><rect x="120" y="140" width="360" height="130" rx="14" fill="#a8262f" opacity="0.1" /><circle cx="300" cy="205" r="220" fill="#a8262f" opacity="0.08" /></Bench>;
    case 'phone':
      return <Bench id={k}><g transform="translate(230,30) rotate(-5 70 160)"><rect width="140" height="300" rx="22" fill="#0b0c0e" stroke="#4a4e55" strokeWidth="4" /><rect x="10" y="26" width="120" height="250" rx="8" fill="#0d1218" /><text x="70" y="90" textAnchor="middle" fontFamily="PT Sans, sans-serif" fontSize="28" fill="#e8ecf0">15:42</text><text x="70" y="114" textAnchor="middle" fontSize="11" fill="#9aa4b0">суббота, 15 февраля</text><rect x="20" y="150" width="100" height="26" rx="6" fill="#1b2430" /><text x="70" y="168" textAnchor="middle" fontSize="10" fill="#cfd8e2">3 сообщения · 03:12</text><rect x="20" y="184" width="100" height="26" rx="6" fill="#1b2430" /><text x="70" y="202" textAnchor="middle" fontSize="10" fill="#cfd8e2">Пропущенные · Денис ×14</text><path d="M60 250 h20" stroke="#aab4c0" strokeWidth="3" /></g></Bench>;
    case 'panel':
      return <Bench id={k}><rect x="90" y="40" width="300" height="300" fill="#232830" stroke="#0c0e12" strokeWidth="4" /><g>{Array.from({ length: 36 }).map((_, i) => <path key={i} d={`M${100 + (i % 6) * 48} ${50 + Math.floor(i / 6) * 48} l24 44 l24 -44z`} fill="#1d2127" stroke="#0e1014" />)}</g><rect x="388" y="40" width="22" height="300" fill="#030405" /><path d="M410 40 L410 340" stroke="#4a4f55" strokeWidth="2" /><g transform="translate(410,40)">{Array.from({ length: 8 }).map((_, i) => <rect key={i} x="0" y={20 + i * 36} width="60" height="5" fill="#8a8f94" />)}<rect x="60" y="0" width="12" height="300" fill="#2a2d31" /></g><text x="300" y="372" textAnchor="middle" fill="#cfc7b2" fontFamily="PT Mono, monospace" fontSize="13">щит отведён: за ним — вертикальная шахта со скобами</text></Bench>;
    case 'console':
      return <Bench id={k}><polygon points="60,120 540,120 580,300 20,300" fill="#262a2e" stroke="#0a0b0c" strokeWidth="4" />{Array.from({ length: 18 }).map((_, i) => <g key={i}><rect x={50 + i * 28} y={150} width="8" height="110" fill="#0c0d0f" /><rect x={47 + i * 28} y={170 + ((i * 17) % 60)} width="14" height="12" fill="#c9ced4" /></g>)}<rect x="400" y="60" width="150" height="46" fill="#091a14" stroke="#000" strokeWidth="3" /><text x="475" y="90" textAnchor="middle" fontFamily="PT Mono, monospace" fontSize="17" fill="#53e0a6">PLAY 03:12:00 ✓</text></Bench>;
    case 'fibers':
      return <Bench id={k}><rect x="240" y="20" width="26" height="330" fill="#3a3d40" /><rect x="334" y="20" width="26" height="330" fill="#3a3d40" />{[60, 130, 200, 270].map((y) => <rect key={y} x="240" y={y} width="120" height="14" fill="#8a8f94" />)}<g stroke="#2f5a3c" strokeWidth="3" fill="none">{[0, 1, 2].map((i) => <path key={i} d={`M${300 + i * 12} ${126 + i * 70} q16 -10 26 6 q-4 14 -18 14`} />)}</g><g fill="#0c0e10">{[110, 190, 260].map((y, i) => <ellipse key={i} cx={304 + i * 8} cy={y} rx="26" ry="9" opacity="0.5" />)}</g></Bench>;
    case 'laptop':
      return <Bench id={k}><polygon points="130,80 470,80 490,260 110,260" fill="#16181b" stroke="#000" strokeWidth="4" /><rect x="150" y="100" width="300" height="140" fill="#0a1218" /><text x="300" y="164" textAnchor="middle" fontFamily="PT Mono, monospace" fontSize="15" fill="#6fc3a0">диск зашифрован</text><text x="300" y="190" textAnchor="middle" fontFamily="PT Mono, monospace" fontSize="12" fill="#6a7a74">введите пароль · облако: синхронизировано</text><polygon points="110,260 490,260 520,310 80,310" fill="#202327" stroke="#000" strokeWidth="3" /></Bench>;
    case 'lock':
      return <Bench id={k}><rect x="180" y="40" width="240" height="320" fill="#33342f" stroke="#050606" strokeWidth="5" /><rect x="260" y="170" width="80" height="14" fill="#8a8d8f" /><rect x="268" y="180" width="64" height="70" rx="6" fill="#6a6d6f" stroke="#111" strokeWidth="3" /><path d="M280 182 q0 -50 20 -50 q20 0 20 50" fill="none" stroke="#8a8d8f" strokeWidth="9" /><ellipse cx="300" cy="216" rx="5" ry="6" fill="#0b0b0b" /><path d="M276 252 q10 14 6 36" stroke="#c9a227" strokeWidth="3" fill="none" opacity="0.7" /><text x="300" y="380" textAnchor="middle" fill="#cfc7b2" fontFamily="PT Mono, monospace" fontSize="13">смазка свежая, не старше недели</text></Bench>;
    case 'tunnel':
      return <Bench id={k}><path d="M0 400 L600 400 L400 170 L200 170Z" fill="#14161a" /><path d="M200 170 L400 170 L400 100 L200 100Z" fill="#06070a" /><rect x="0" y="0" width="600" height="400" fill="none" /><path d="M0 0 L200 100 M600 0 L400 100 M0 400 L200 170 M600 400 L400 170" stroke="#2a2d31" strokeWidth="4" />{[0, 1, 2].map((i) => <path key={i} d={`M${60 + i * 20} ${40 + i * 30} L${240 + i * 10} ${110 + i * 8}`} stroke="#4a4f52" strokeWidth="9" strokeLinecap="round" />)}<g fill="#0c0e11" opacity="0.8"><ellipse cx="262" cy="330" rx="26" ry="10" /><ellipse cx="320" cy="288" rx="22" ry="8" /><ellipse cx="300" cy="360" rx="30" ry="11" /></g><rect x="390" y="320" width="26" height="46" rx="10" fill="#9fc0d0" opacity="0.5" /><circle cx="300" cy="140" r="70" fill="#f2d9a0" opacity="0.1" /></Bench>;
    case 'clippings':
      return <Bench id={k}><rect x="50" y="30" width="500" height="320" fill="#3a352e" opacity="0.7" />{[[70, 50, 120, 140], [210, 44, 140, 100], [370, 56, 150, 130], [90, 210, 130, 120], [250, 190, 120, 150], [400, 214, 130, 110]].map(([x, y, w, h], i) => (<g key={i}><rect x={x} y={y} width={w} height={h} fill="#e0dccc" stroke="#1a1814" transform={`rotate(${(i % 3) - 1} ${x + 40} ${y + 40})`} />{i < 3 && <rect x={x + 10} y={y + 10} width={w - 20} height={h * 0.55} fill="#5a5448" />}{Array.from({ length: 3 }).map((_, j) => <line key={j} x1={x + 10} y1={y + h - 40 + j * 12} x2={x + w - 10} y2={y + h - 40 + j * 12} stroke="#333" strokeWidth="2" />)}<circle cx={x + w / 2} cy={y + 4} r="5" fill="#c03a3a" /></g>))}<path d="M130 55 L280 50 L445 62 M130 55 L150 215 L310 195 L465 220" stroke="#c03a3a" strokeWidth="2.4" fill="none" /><text x="60" y="372" fontFamily="Caveat, cursive" fontSize="26" fill="#e8dcc4">Л.Д. 2009 · И.Б. 2014 · К.Л. 2019</text></Bench>;
    case 'wardrobe':
      return <Bench id={k}><rect x="150" y="20" width="300" height="340" fill="#3a2f26" stroke="#0a0806" strokeWidth="5" /><line x1="300" y1="20" x2="300" y2="360" stroke="#0a0806" strokeWidth="3" /><path d="M170 80 H430" stroke="#9aa0a6" strokeWidth="5" /><g>{[0, 1, 2].map((i) => <path key={i} d={`M${200 + i * 60} 82 l-18 90 h36z`} fill={['#4a5a6a', '#6a4a4a', '#555'][i]} />)}</g><path d="M330 82 l-4 6" stroke="#9aa0a6" strokeWidth="4" /><rect x="370" y="270" width="60" height="70" fill="#14120f" opacity="0.6" /><text x="300" y="384" textAnchor="middle" fill="#cfc7b2" fontFamily="PT Mono, monospace" fontSize="13">не хватает: зелёное пальто, шапка, рюкзак</text></Bench>;
    case 'passport':
      return <Bench id={k}><g transform="translate(150,70) rotate(-6 100 120)"><rect width="170" height="230" rx="6" fill="#5a1f2a" stroke="#1a0a0d" strokeWidth="3" /><text x="85" y="120" textAnchor="middle" fill="#e0c88a" fontFamily="PT Serif, serif" fontSize="14">ПАСПОРТ</text><circle cx="85" cy="70" r="20" fill="none" stroke="#e0c88a" /></g><g transform="translate(340,150) rotate(8 80 50)"><rect width="170" height="104" rx="10" fill="#243a5a" stroke="#0a1220" strokeWidth="2" /><rect y="26" width="170" height="20" fill="#0a1220" /><text x="14" y="86" fill="#e8ecf0" fontFamily="PT Mono, monospace" fontSize="14">•••• •••• •••• 4821</text></g></Bench>;
    case 'cassette':
      return <Bench id={k}>{[0, 1, 2].map((i) => <g key={i} transform={`translate(${70 + i * 170},${90 + (i % 2) * 20}) rotate(${(i - 1) * 6} 70 90)`}><rect width="140" height="180" fill="#e0dccc" stroke="#222" strokeWidth="2" /><rect x="10" y="12" width="120" height="70" fill="#1a1a1a" /><circle cx="42" cy="48" r="16" fill="#8a8a8a" /><circle cx="98" cy="48" r="16" fill="#8a8a8a" /><text x="70" y="130" textAnchor="middle" fontFamily="Caveat, cursive" fontSize="30" fill="#1b2a5a">{['Л.Д.', 'И.Б.', 'К.Л.'][i]}</text><text x="70" y="160" textAnchor="middle" fontFamily="PT Mono, monospace" fontSize="11" fill="#444">{['2009', '2014', '2019'][i]}</text></g>)}</Bench>;
    case 'studio2':
      return <Bench id={k}><rect x="40" y="40" width="520" height="300" fill="#2a1f1a" stroke="#050403" strokeWidth="4" /><rect x="110" y="200" width="380" height="80" fill="#2a2c30" stroke="#000" strokeWidth="3" />{Array.from({ length: 14 }).map((_, i) => <circle key={i} cx={134 + i * 25} cy={228} r="7" fill="#c9ced4" />)}<circle cx="300" cy="140" r="26" fill="#1a1a1a" stroke="#555" strokeWidth="3" /><rect x="295" y="166" width="10" height="38" fill="#1a1a1a" /><rect x="70" y="60" width="90" height="70" fill="#e4dcc6" opacity="0.8" /><rect x="450" y="70" width="80" height="120" fill="#463a2c" /></Bench>;
    case 'audio':
      return <Bench id={k}><rect x="60" y="140" width="480" height="120" rx="10" fill="#14161a" stroke="#34383e" strokeWidth="3" /><Wave x={80} y={200} w={440} seed={(lines?.length ?? 2) + 3} /><circle cx="94" cy="120" r="18" fill="#a8262f" opacity="0.9" /><path d="M88 111 l16 9 l-16 9z" fill="#fff" /><text x="120" y="126" fill="#cfc7b2" fontFamily="PT Mono, monospace" fontSize="14">аудиозапись · расшифровка в плеере</text></Bench>;
    case 'spectro':
      return <Bench id={k}><rect x="50" y="40" width="500" height="300" fill="#05080a" stroke="#2a3238" strokeWidth="3" />{Array.from({ length: 40 }).map((_, i) => <rect key={i} x={60 + i * 12} y={60 + (i % 7) * 18} width="9" height={20 + ((i * 13) % 80)} fill={`hsl(${170 + ((i * 7) % 60)} 70% ${28 + (i % 5) * 6}%)`} opacity="0.7" />)}<line x1="50" y1="230" x2="550" y2="230" stroke="#c9a227" strokeWidth="2" /><line x1="50" y1="120" x2="550" y2="120" stroke="#c9a227" strokeWidth="2" strokeDasharray="5 5" /></Bench>;
    case 'screens':
      return <Bench id={k}>{[0, 1, 2].map((i) => <g key={i} transform={`translate(${34 + i * 186},40)`}><rect width="170" height="300" rx="14" fill="#0f1317" stroke="#3a4048" strokeWidth="3" /><rect x="10" y="40" width="150" height="40" rx="10" fill={i === 2 ? '#1f4d3d' : '#202830'} /><text x="85" y="26" textAnchor="middle" fontSize="12" fill="#9fb0c0" fontFamily="PT Sans, sans-serif">{['Денис', 'Марина', 'Мама'][i]} · 03:12</text>{(lines ?? []).slice(0, 0)}<text x="20" y="64" fontSize="11" fill="#e6edf3" fontFamily="PT Sans, sans-serif">{['Я в порядке. Не ищи…', 'Файл 7 не открывай…', '🔊 голосовое 0:41'][i]}</text></g>)}</Bench>;
    case 'room':
      return <Bench id={k}><rect x="40" y="40" width="520" height="310" fill="#2a251f" stroke="#050403" strokeWidth="4" /><rect x="80" y="230" width="220" height="90" fill="#463a2c" /><rect x="340" y="60" width="180" height="150" fill="#1a1f2a" stroke="#050403" strokeWidth="4" /><path d="M340 60 L520 210 M520 60 L340 210" stroke="#050403" strokeWidth="6" /><rect x="380" y="250" width="110" height="60" fill="#111" /><circle cx="440" cy="280" r="18" fill="#3a3a3a" /></Bench>;
    case 'cctv':
      return <Bench id={k}><rect x="100" y="60" width="400" height="270" fill="#0a0e0c" stroke="#222" strokeWidth="4" /><path d="M110 300 l60 -60 l60 40 l80 -80 l70 50 l80 -60" stroke="#46a876" strokeWidth="2" fill="none" /><text x="120" y="90" fontFamily="PT Mono, monospace" fontSize="14" fill="#8ad6b0">CAM 01  REC ●</text></Bench>;
    case 'school11':
      return <Bench id={k}><rect x="60" y="30" width="480" height="320" fill="#2a251f" /><rect x="90" y="60" width="200" height="280" fill="#3a3a38" stroke="#050606" strokeWidth="4" /><rect x="130" y="100" width="120" height="52" fill="#d8d4c4" /><text x="190" y="138" textAnchor="middle" fontFamily="PT Mono, monospace" fontSize="30" fill="#1a1a1a">11</text><text x="190" y="170" textAnchor="middle" fontSize="12" fill="#222" fontFamily="PT Mono, monospace">радиоузел</text><circle cx="400" cy="140" r="30" fill="#c9a27a" /><path d="M360 200 q40 -30 80 0 v120 h-80z" fill="#2a2420" /></Bench>;
    case 'doc-schedule':
      return <Bench id={k}><Paper lines={['СТУДИЯ № 2 — ГРАФИК', 'Пн–пт 23:00 «Ночной собеседник»', 'Чт 00:00 «Практика письма»', '(закрытая, по записи)']} /></Bench>;
    default:
      return <Bench id={k}><Paper lines={lines ?? []} /></Bench>;
  }
}

// ───────── Кадры камер ─────────
function Figure({ who, x, y, s = 1 }: { who: string; x: number; y: number; s?: number }) {
  const look: Record<string, { coat: string; hat?: string; extra?: ReactNode }> = {
    yarik: { coat: '#1c1c20', hat: '#2a2f3a', extra: <rect x="-30" y="34" width="24" height="16" fill="#3a3a3a" /> },
    alina: { coat: '#2f5a3c', extra: <rect x="-24" y="2" width="16" height="30" rx="4" fill="#3a3028" /> },
    ruslan: { coat: '#4b5236', hat: '#1b1f17', extra: <path d="M-8 -6 q30 -10 40 14" stroke="#b36a3a" strokeWidth="6" fill="none" /> },
    marina: { coat: '#d8d4cc' },
  };
  const l = look[who] ?? { coat: '#333' };
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <ellipse cx="0" cy="102" rx="22" ry="6" fill="#000" opacity="0.5" />
      <path d="M-18 100 L-14 40 Q0 28 14 40 L18 100Z" fill={l.coat} />
      <rect x="-12" y="96" width="9" height="16" fill="#111" /><rect x="3" y="96" width="9" height="16" fill="#111" />
      <circle cx="0" cy="22" r="13" fill="#c9a98a" />
      {l.hat && <path d="M-14 20 Q0 4 14 20Z" fill={l.hat} />}
      {who === 'alina' && <path d="M-14 22 Q-18 56 -10 62 M14 22 Q18 56 10 62" stroke="#3a2a22" strokeWidth="7" fill="none" />}
      {who === 'marina' && <path d="M-14 22 Q-16 38 -8 40 L8 40 Q16 38 14 22 Q0 6 -14 22Z" fill="#c9a96a" opacity="0.85" />}
      {l.extra}
    </g>
  );
}

export function CctvFrame({ cam, t }: { cam: 1 | 2; t: number }) {
  const active = CAM_EVENTS.filter((e) => e.cam === cam && e.who && t >= e.at && t <= (e.until ?? e.at + 1));
  const ts = `${hmOf(t)}:${String(Math.floor((t % 1) * 60)).padStart(2, '0')}`;
  const lit = cam === 2 && ((t >= MIN(20, 21) && t < MIN(21, 4)) || (t >= MIN(21, 44) && t < MIN(0, 31)) || (t >= MIN(6, 8)));
  const onAir = cam === 2 && t >= MIN(3, 12) && t < MIN(3, 13);
  const dayStr = dayOf(t);
  return (
    <svg viewBox="0 0 640 360" className="cctv-svg" role="img" aria-label={`Камера ${cam}, ${dayStr} ${ts}`}>
      <defs>
        <filter id={`cn${cam}`}><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed={String(Math.floor(t / 2))} /><feColorMatrix type="saturate" values="0" /><feComponentTransfer><feFuncA type="linear" slope="0.3" /></feComponentTransfer></filter>
        <radialGradient id={`cv${cam}`} cx="50%" cy="50%" r="75%"><stop offset="55%" stopColor="#000" stopOpacity="0" /><stop offset="100%" stopColor="#000" stopOpacity="0.7" /></radialGradient>
        <radialGradient id={`cl${cam}`} cx="50%" cy="30%" r="45%"><stop offset="0" stopColor="#ffe9b0" stopOpacity="0.5" /><stop offset="1" stopColor="#ffe9b0" stopOpacity="0" /></radialGradient>
      </defs>
      {cam === 1 ? (
        <>
          <rect width="640" height="360" fill="#0c1013" />
          <rect y="250" width="640" height="110" fill="#1a1e22" />
          <rect x="60" y="30" width="520" height="230" fill="#1f2328" />
          <rect x="260" y="70" width="120" height="190" fill="#15181c" stroke="#05070a" strokeWidth="4" />
          <rect x="268" y="78" width="104" height="120" fill="#0a0c0f" />
          <rect x="300" y="42" width="40" height="14" fill="#f2e2a8" opacity="0.9" />
          <circle cx="320" cy="60" r="110" fill={`url(#cl1)`} />
          {[100, 180, 460, 520].map((x) => <rect key={x} x={x} y="90" width="46" height="60" fill="#0a0d12" stroke="#05070a" strokeWidth="3" />)}
          {active.map((e, i) => {
            const p = Math.min(1, (t - e.at) / Math.max(1, (e.until ?? e.at + 1) - e.at));
            const dir = e.label.includes('выходит') ? -1 : 1;
            const x = dir === 1 ? 560 - p * 240 : 320 + p * 240;
            return <Figure key={i} who={e.who!} x={x} y={188} />;
          })}
          {Array.from({ length: 40 }).map((_, i) => <circle key={i} cx={(i * 97 + t * 7) % 640} cy={(i * 53 + t * 13) % 300} r="1.3" fill="#dfe9f2" opacity="0.55" />)}
        </>
      ) : (
        <>
          <rect width="640" height="360" fill="#101311" />
          <rect y="260" width="640" height="100" fill="#171a18" />
          <rect x="0" y="0" width="640" height="260" fill="#1d211e" />
          {/* дверь студии */}
          <rect x="250" y="50" width="150" height="210" fill="#2b2824" stroke="#060606" strokeWidth="5" />
          <rect x="278" y="86" width="94" height="110" fill={lit ? '#d8c27a' : '#0d0f0e'} opacity={lit ? 0.85 : 1} stroke="#050505" strokeWidth="3" />
          {lit && <rect x="278" y="86" width="94" height="110" fill="#fff" opacity="0.1" />}
          <rect x="262" y="14" width="126" height="28" rx="4" fill={onAir ? '#d02a35' : '#2a0c0e'} stroke="#050505" strokeWidth="2" />
          <text x="325" y="34" textAnchor="middle" fontFamily="PT Mono, monospace" fontSize="15" letterSpacing="3" fill={onAir ? '#fff0f0' : '#6a1a22'}>ON AIR</text>
          {onAir && <circle cx="325" cy="28" r="140" fill="#d02a35" opacity="0.16" />}
          {active.map((e, i) => {
            const p = Math.min(1, (t - e.at) / Math.max(1, (e.until ?? e.at + 1) - e.at));
            return <Figure key={i} who={e.who!} x={e.who === 'ruslan' ? 180 + p * 40 : e.who === 'marina' ? 460 - p * 40 : 120 + p * 120} y={156} s={1.1} />;
          })}
        </>
      )}
      <rect width="640" height="360" filter={`url(#cn${cam})`} />
      <rect width="640" height="360" fill={`url(#cv${cam})`} />
      <rect width="640" height="360" fill="#6ec0a0" opacity="0.05" />
      <text x="14" y="26" fontFamily="PT Mono, monospace" fontSize="15" fill="#d7f2e4">CAM {cam} {cam === 1 ? '· ВХОД' : '· КОРИДОР 2 ЭТ.'}</text>
      <text x="14" y="346" fontFamily="PT Mono, monospace" fontSize="15" fill="#d7f2e4">{dayStr}  {ts}</text>
      <circle cx="616" cy="20" r="6" fill="#d03a3a" />
    </svg>
  );
}
