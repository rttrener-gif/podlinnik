import type { ReactNode } from 'react';

// Сцены мест — иллюстрации 1000×560. Координаты согласованы с зонами в data/places.ts.

function Frame({ id, children, tint = '#0b0d12' }: { id: string; children: ReactNode; tint?: string }) {
  return (
    <svg viewBox="0 0 1000 560" className="scene-svg" role="img" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      <defs>
        <filter id={`g${id}`}><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="9" /><feColorMatrix type="saturate" values="0" /><feComponentTransfer><feFuncA type="linear" slope="0.2" /></feComponentTransfer></filter>
        <radialGradient id={`v${id}`} cx="50%" cy="50%" r="75%"><stop offset="50%" stopColor="#000" stopOpacity="0" /><stop offset="100%" stopColor="#000" stopOpacity="0.75" /></radialGradient>
        <linearGradient id={`fl${id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2a2622" /><stop offset="1" stopColor="#0e0d0c" /></linearGradient>
        <radialGradient id={`lg${id}`} cx="50%" cy="50%" r="50%"><stop offset="0" stopColor="#ffd9a0" stopOpacity="0.55" /><stop offset="1" stopColor="#ffd9a0" stopOpacity="0" /></radialGradient>
        <pattern id={`wd${id}`} width="40" height="40" patternUnits="userSpaceOnUse"><path d="M0 40 L20 0 L40 40Z" fill="#1d2127" stroke="#0e1014" strokeWidth="1" /></pattern>
      </defs>
      <rect width="1000" height="560" fill={tint} />
      {children}
      <rect width="1000" height="560" filter={`url(#g${id})`} />
      <rect width="1000" height="560" fill={`url(#v${id})`} />
    </svg>
  );
}

function Studio() {
  const id = 'st';
  return (
    <Frame id={id} tint="#0e1116">
      {/* стены с акустическими клиньями */}
      <rect x="0" y="0" width="1000" height="420" fill={`url(#wd${id})`} />
      <rect x="0" y="0" width="1000" height="420" fill="#000" opacity="0.35" />
      {/* акустический щит: чуть сдвинут, видна тёмная щель */}
      <g>
        <rect x="236" y="116" width="244" height="220" fill="#232830" stroke="#0c0e12" strokeWidth="3" />
        <rect x="236" y="116" width="244" height="220" fill={`url(#wd${id})`} opacity="0.9" />
        <rect x="478" y="116" width="6" height="220" fill="#030405" />
        <rect x="236" y="112" width="244" height="5" fill="#030405" />
      </g>
      {/* дверь слева */}
      <g>
        <rect x="30" y="92" width="176" height="378" fill="#2d2a26" stroke="#0a0908" strokeWidth="4" />
        <rect x="48" y="112" width="140" height="150" fill="#3a352f" opacity="0.7" />
        <rect x="150" y="296" width="34" height="9" fill="#9aa0a6" />
        <rect x="150" y="294" width="9" height="13" fill="#6a7077" />
        <circle cx="102" cy="320" r="7" fill="#7a7f85" />
      </g>
      {/* лампа ON AIR над дверью */}
      <g>
        <rect x="58" y="24" width="120" height="44" rx="6" fill="#2a0c0e" stroke="#0a0505" strokeWidth="3" />
        <text x="118" y="54" textAnchor="middle" fill="#8a1a22" fontFamily="PT Mono, monospace" fontSize="23" letterSpacing="3">ON AIR</text>
      </g>
      {/* календарь */}
      <g transform="translate(560,70)">
        <rect width="120" height="150" fill="#d8d2c2" stroke="#2a2822" strokeWidth="2" />
        <rect width="120" height="24" fill="#7a2a2e" />
        <text x="60" y="17" textAnchor="middle" fill="#f0e8d8" fontSize="12" fontFamily="PT Mono, monospace">ФЕВРАЛЬ</text>
        {Array.from({ length: 28 }).map((_, i) => <text key={i} x={10 + (i % 7) * 16} y={46 + Math.floor(i / 7) * 22} fontSize="9" fill="#222" fontFamily="PT Mono, monospace">{i + 1}</text>)}
        <ellipse cx="111" cy="64" rx="12" ry="10" fill="none" stroke="#c03a3a" strokeWidth="2.4" />
        <text x="60" y="140" textAnchor="middle" fill="#c03a3a" fontFamily="Caveat, cursive" fontSize="22">03:12</text>
      </g>
      {/* окно справа */}
      <g>
        <rect x="770" y="80" width="200" height="260" fill="#1e2a3c" stroke="#06080b" strokeWidth="6" />
        <rect x="770" y="80" width="200" height="260" fill="#9fb4d0" opacity="0.12" />
        <line x1="870" y1="80" x2="870" y2="340" stroke="#06080b" strokeWidth="5" />
        <path d="M770 340 l200 0" stroke="#89929c" strokeWidth="3" />
        <path d="M790 120 l50 40 M900 200 l50 30" stroke="#cfe0f5" strokeWidth="1" opacity="0.4" />
      </g>
      {/* пол */}
      <rect x="0" y="420" width="1000" height="140" fill={`url(#fl${id})`} />
      {/* пульт */}
      <g>
        <polygon points="250,360 590,360 620,440 220,440" fill="#262a2e" stroke="#0a0b0c" strokeWidth="3" />
        <rect x="262" y="340" width="316" height="26" fill="#1a1d20" />
        {Array.from({ length: 16 }).map((_, i) => <g key={i}><rect x={278 + i * 19} y={372} width="6" height="40" fill="#0c0d0f" /><rect x={277 + i * 19} y={380 + (i * 7) % 20} width="8" height="9" fill="#c9ced4" /></g>)}
        <circle cx="610" cy="352" r="3" fill="#d03a3a" />
      </g>
      {/* ноутбук, телефон, тетрадь */}
      <g>
        <polygon points="480,392 590,388 600,440 470,444" fill="#16181b" stroke="#000" strokeWidth="2" />
        <polygon points="620,400 700,396 706,450 624,454" fill="#c8c2b0" stroke="#2a2822" strokeWidth="2" />
        <rect x="610" y="394" width="80" height="62" fill="#1c1f26" stroke="#000" strokeWidth="2" rx="6" transform="translate(0,0)" opacity="0" />
        <rect x="612" y="396" width="62" height="56" rx="8" fill="#0d1014" stroke="#3a3f47" strokeWidth="2" transform="rotate(-6 640 420)" />
        <rect x="706" y="402" width="104" height="66" fill="#d6cfb8" stroke="#2a2822" strokeWidth="2" transform="rotate(4 760 436)" />
        {Array.from({ length: 5 }).map((_, i) => <line key={i} x1="714" y1={416 + i * 10} x2="800" y2={418 + i * 10} stroke="#6a6a8a" strokeWidth="1" />)}
      </g>
      {/* кресло */}
      <path d="M390 470 Q400 410 450 410 Q500 410 510 470Z" fill="#1c1e22" />
      {/* свет настольной лампы */}
      <circle cx="450" cy="380" r="260" fill={`url(#lg${id})`} />
    </Frame>
  );
}

function Building() {
  const id = 'bd';
  return (
    <Frame id={id} tint="#0c0f10">
      <rect y="0" width="1000" height="440" fill="#1b1f1c" />
      <rect y="440" width="1000" height="120" fill={`url(#fl${id})`} />
      {/* окна-двери коридора */}
      {[0, 1, 2].map((i) => (<g key={i}><rect x={260 + i * 40} y="120" width="2" height="300" fill="#0a0c0b" opacity="0" /></g>))}
      {/* регистратор */}
      <g>
        <rect x="60" y="270" width="180" height="150" fill="#202428" stroke="#050607" strokeWidth="3" />
        <rect x="76" y="288" width="148" height="70" fill="#0c1814" />
        <path d="M82 340 l30 -30 l30 20 l40 -30" stroke="#3fb88a" strokeWidth="2" fill="none" />
        {[0, 1, 2, 3].map((i) => <circle key={i} cx={90 + i * 16} cy="390" r="4" fill={i === 1 ? '#c03a3a' : '#2f7a56'} />)}
      </g>
      {/* дверь в подвал */}
      <g>
        <rect x="410" y="170" width="170" height="320" fill="#3a3b3a" stroke="#050606" strokeWidth="5" />
        <rect x="428" y="190" width="134" height="280" fill="#2a2b2a" />
        <rect x="520" y="320" width="36" height="12" fill="#8a8d8f" />
        <path d="M520 332 q-16 18 0 34 q16 -16 0 -34" fill="none" stroke="#8a8d8f" strokeWidth="5" />
        <rect x="420" y="130" width="150" height="28" fill="#c9a227" opacity="0.85" />
        <text x="495" y="150" textAnchor="middle" fontFamily="PT Mono, monospace" fontSize="16" fill="#171207" fontWeight="bold">ПОДВАЛ · НЕ ВХОДИТЬ</text>
      </g>
      {/* вход в тоннель */}
      <g>
        <rect x="690" y="240" width="260" height="240" fill="#050607" />
        <path d="M690 480 L950 480 L910 330 L730 330Z" fill="#101214" />
        {[0, 1, 2].map((i) => <rect key={i} x={720 + i * 6} y={270 + i * 20} width={200 - i * 12} height="10" rx="5" fill="#33383c" />)}
        <circle cx="820" cy="360" r="60" fill="#0a0c0d" />
      </g>
      <circle cx="500" cy="200" r="320" fill={`url(#lg${id})`} opacity="0.6" />
    </Frame>
  );
}

function Home() {
  const id = 'hm';
  return (
    <Frame id={id} tint="#11100f">
      <rect width="1000" height="450" fill="#2a2724" />
      <rect y="450" width="1000" height="110" fill={`url(#fl${id})`} />
      {/* стена вырезок */}
      <g>
        <rect x="60" y="60" width="430" height="290" fill="#3a352e" opacity="0.5" />
        {[
          [80, 80, 90, 110, '#e0dccc'], [200, 74, 100, 80, '#d8d4c4'], [330, 84, 120, 96, '#e4e0d0'],
          [90, 210, 110, 100, '#d6d2c2'], [230, 200, 90, 130, '#e0dccc'], [340, 210, 130, 110, '#dcd8c8'],
        ].map(([x, y, w, h, c], i) => (
          <g key={i}>
            <rect x={x as number} y={y as number} width={w as number} height={h as number} fill={c as string} stroke="#1a1814" transform={`rotate(${(i % 3) - 1} ${(x as number) + 40} ${(y as number) + 40})`} />
            {Array.from({ length: 4 }).map((__, j) => <line key={j} x1={(x as number) + 8} y1={(y as number) + 18 + j * 14} x2={(x as number) + (w as number) - 8} y2={(y as number) + 18 + j * 14} stroke="#3a3a3a" strokeWidth="1.5" />)}
            <circle cx={(x as number) + (w as number) / 2} cy={(y as number) + 5} r="4" fill="#c03a3a" />
          </g>
        ))}
        <path d="M130 85 L250 78 L395 90 M130 85 L135 215 L275 205 L405 215 M250 78 L275 205" stroke="#c03a3a" strokeWidth="2" fill="none" />
        <text x="76" y="372" fontFamily="Caveat, cursive" fontSize="26" fill="#e8dcc4">«во всех — «я в порядке»»</text>
      </g>
      {/* шкаф */}
      <g>
        <rect x="600" y="60" width="220" height="380" fill="#3a2f26" stroke="#0a0806" strokeWidth="4" />
        <line x1="710" y1="60" x2="710" y2="440" stroke="#0a0806" strokeWidth="3" />
        <circle cx="700" cy="250" r="5" fill="#a8a090" /><circle cx="720" cy="250" r="5" fill="#a8a090" />
      </g>
      {/* комод */}
      <g>
        <rect x="520" y="390" width="200" height="120" fill="#4a3b2e" stroke="#0a0806" strokeWidth="3" />
        <line x1="520" y1="450" x2="720" y2="450" stroke="#0a0806" strokeWidth="3" />
        <rect x="600" y="410" width="40" height="8" fill="#a8a090" /><rect x="600" y="470" width="40" height="8" fill="#a8a090" />
      </g>
      <circle cx="300" cy="200" r="340" fill={`url(#lg${id})`} opacity="0.45" />
    </Frame>
  );
}

function School() {
  const id = 'sc';
  return (
    <Frame id={id} tint="#0b0d0c">
      <rect width="1000" height="450" fill="#20241f" />
      <rect y="450" width="1000" height="110" fill={`url(#fl${id})`} />
      {/* котёл */}
      <g>
        <rect x="90" y="190" width="270" height="290" fill="#2f353a" stroke="#050606" strokeWidth="4" />
        <circle cx="180" cy="270" r="40" fill="#e0dccc" stroke="#050606" strokeWidth="5" />
        <path d="M180 270 L205 250" stroke="#c03a3a" strokeWidth="4" />
        {Array.from({ length: 12 }).map((_, i) => <line key={i} x1={180 + Math.cos((i / 12) * 6.28) * 32} y1={270 + Math.sin((i / 12) * 6.28) * 32} x2={180 + Math.cos((i / 12) * 6.28) * 38} y2={270 + Math.sin((i / 12) * 6.28) * 38} stroke="#222" strokeWidth="2" />)}
        <rect x="250" y="240" width="90" height="140" fill="#1a1d20" />
        <rect x="262" y="256" width="66" height="60" fill="#c9722a" opacity="0.55" />
      </g>
      {/* трубы */}
      {[0, 1, 2].map((i) => <rect key={i} x="0" y={60 + i * 28} width="1000" height="14" fill="#4a4f52" opacity="0.8" />)}
      {/* доска ключей */}
      <g>
        <rect x="470" y="120" width="210" height="220" fill="#4a3b2a" stroke="#050606" strokeWidth="4" />
        {Array.from({ length: 12 }).map((_, i) => (
          <g key={i}>
            <circle cx={500 + (i % 4) * 52} cy={160 + Math.floor(i / 4) * 60} r="4" fill="#cfcabf" />
            {i !== 10 && <path d={`M${500 + (i % 4) * 52} ${164 + Math.floor(i / 4) * 60} v22`} stroke="#cfcabf" strokeWidth="3" />}
            <text x={496 + (i % 4) * 52} y={206 + Math.floor(i / 4) * 60} fontSize="12" fill="#e8dcc4" fontFamily="PT Mono, monospace">{i + 1}</text>
          </g>
        ))}
      </g>
      {/* дверь № 11 */}
      <g>
        <rect x="760" y="150" width="170" height="330" fill="#3a3a38" stroke="#050606" strokeWidth="5" />
        <rect x="800" y="180" width="90" height="46" fill="#d8d4c4" stroke="#050606" strokeWidth="2" />
        <text x="845" y="212" textAnchor="middle" fontFamily="PT Mono, monospace" fontSize="30" fill="#1a1a1a">11</text>
        <circle cx="904" cy="330" r="6" fill="#a8a090" />
        <rect x="700" y="470" width="260" height="8" fill="#000" opacity="0.4" />
        <rect x="770" y="470" width="150" height="6" fill="#f2c36b" opacity="0.5" />
      </g>
      <circle cx="320" cy="320" r="320" fill={`url(#lg${id})`} opacity="0.5" />
    </Frame>
  );
}

function Station() {
  const id = 'sn';
  return (
    <Frame id={id} tint="#100d0b">
      <rect width="1000" height="460" fill="#2b221c" />
      <rect y="460" width="1000" height="100" fill={`url(#fl${id})`} />
      {/* студия № 2 за стеклом */}
      <g>
        <rect x="70" y="100" width="300" height="340" fill="#0e0f12" stroke="#050505" strokeWidth="6" />
        <rect x="90" y="120" width="260" height="130" fill="#3a2a1e" opacity="0.6" />
        <rect x="130" y="300" width="180" height="60" fill="#2a2c30" />
        <circle cx="220" cy="250" r="14" fill="#1a1a1a" /><rect x="216" y="260" width="8" height="40" fill="#1a1a1a" />
        <text x="220" y="92" textAnchor="middle" fontFamily="PT Mono, monospace" fontSize="22" fill="#c9a227">СТУДИЯ № 2</text>
      </g>
      {/* график на стене */}
      <g>
        <rect x="430" y="70" width="230" height="180" fill="#d8d2c2" stroke="#2a2822" strokeWidth="3" />
        {Array.from({ length: 7 }).map((_, i) => <line key={i} x1="446" y1={96 + i * 20} x2="640" y2={96 + i * 20} stroke="#4a4a4a" strokeWidth="1.5" />)}
        <rect x="446" y="156" width="194" height="18" fill="#c03a3a" opacity="0.4" />
        <text x="446" y="88" fontSize="13" fontFamily="PT Mono, monospace" fill="#222">СТУДИЯ № 2 — ГРАФИК</text>
      </g>
      {/* стеллаж с плёнками */}
      <g>
        <rect x="720" y="90" width="240" height="380" fill="#3a2e24" stroke="#050403" strokeWidth="4" />
        {[0, 1, 2, 3, 4].map((r) => (<g key={r}><rect x="726" y={150 + r * 62} width="228" height="5" fill="#1a130d" />
          {Array.from({ length: 8 }).map((_, c) => <rect key={c} x={730 + c * 28} y={110 + r * 62} width="20" height="40" fill={['#2a3a2a', '#3a2a2a', '#2a2a3a', '#4a3a1a'][(r + c) % 4]} stroke="#000" strokeWidth="1" />)}</g>))}
      </g>
      <circle cx="540" cy="260" r="300" fill={`url(#lg${id})`} opacity="0.4" />
    </Frame>
  );
}

function Dacha() {
  const id = 'dc';
  return (
    <Frame id={id} tint="#0b0a09">
      <rect width="1000" height="450" fill="#2a251f" />
      <rect y="450" width="1000" height="110" fill={`url(#fl${id})`} />
      {/* стеллаж */}
      <g>
        <rect x="80" y="90" width="450" height="360" fill="#3a2f24" stroke="#050403" strokeWidth="4" />
        {[0, 1, 2, 3].map((r) => (<g key={r}><rect x="86" y={170 + r * 70} width="438" height="5" fill="#1a130d" />
          {Array.from({ length: 16 }).map((_, c) => <rect key={c} x={92 + c * 27} y={110 + r * 70} width="20" height="56" fill={['#2a3a2a', '#3a2a2a', '#2a2a3a', '#4a3a1a'][(r + c) % 4]} stroke="#000" strokeWidth="1" />)}</g>))}
      </g>
      {/* дверь с замком снаружи */}
      <g>
        <rect x="640" y="90" width="280" height="380" fill="#3a3733" stroke="#050403" strokeWidth="5" />
        <rect x="690" y="270" width="12" height="90" fill="#8a8d8f" />
        <rect x="680" y="300" width="36" height="28" fill="#6a6d6f" />
        <path d="M698 300 q-12 -26 0 -26 q12 0 0 26" fill="none" stroke="#8a8d8f" strokeWidth="5" />
      </g>
      <circle cx="400" cy="300" r="320" fill={`url(#lg${id})`} opacity="0.45" />
    </Frame>
  );
}

const SCENES: Record<string, () => JSX.Element> = { studio: Studio, building: Building, home: Home, school: School, station: Station, dacha: Dacha };
export function SceneArt({ id }: { id: string }) {
  const C = SCENES[id];
  return C ? <C /> : null;
}
