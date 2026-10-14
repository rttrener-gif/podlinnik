// Иллюстрации материалов: план этажа, снимок с планшета, кадр камеры. Это реконструкции, не фотографии.

export function FloorPlan() {
  const rooms = Array.from({ length: 10 }).map((_, i) => 201 + i);
  const rooms2 = Array.from({ length: 10 }).map((_, i) => 211 + i);
  return (
    <svg viewBox="0 0 900 360" className="art-svg" role="img" aria-label="План второго этажа">
      <rect width="900" height="360" fill="#14171c" />
      <g fontFamily="IBM Plex Sans, sans-serif" fontSize="12" fill="#cfcfc8">
        <rect x="30" y="150" width="840" height="60" fill="#1b2027" stroke="#3a4350" />
        {rooms.map((n, i) => (
          <g key={n}><rect x={30 + i * 84} y="40" width="84" height="110" fill="#181c22" stroke="#3a4350" /><text x={72 + i * 84} y="100" textAnchor="middle">{n}</text></g>
        ))}
        {rooms2.map((n, i) => (
          <g key={n}><rect x={30 + i * 84} y="210" width="84" height="110" fill={n === 214 ? '#2a2a20' : '#181c22'} stroke={n === 214 || n === 216 ? '#b08d4a' : '#3a4350'} /><text x={72 + i * 84} y="270" textAnchor="middle">{n}</text></g>
        ))}
        {/* пост и процедурная */}
        <rect x="360" y="165" width="120" height="30" fill="#2a3340" stroke="#4a5568" /><text x="420" y="185" textAnchor="middle">пост</text>
        <rect x="500" y="165" width="90" height="30" fill="#2a3340" stroke="#4a5568" /><text x="545" y="185" textAnchor="middle">процедурная</text>
        {/* лестницы */}
        <rect x="30" y="165" width="50" height="30" fill="#2e2a20" stroke="#8a7a4a" /><text x="55" y="185" textAnchor="middle">лест. А</text>
        <rect x="820" y="165" width="50" height="30" fill="#2e2a20" stroke="#8a7a4a" /><text x="845" y="185" textAnchor="middle">лест. Б</text>
        {/* камера */}
        <polygon points="85,180 460,160 460,200" fill="#b08d4a" opacity="0.12" />
        <circle cx="85" cy="180" r="6" fill="#b08d4a" /><text x="88" y="146" fill="#b08d4a">камера</text>
        {/* колонна */}
        <rect x="760" y="150" width="14" height="60" fill="#0e1014" /><text x="740" y="232" fill="#8a8f98" fontSize="11">колонна закрывает обзор</text>
        {/* считыватель */}
        <text x="640" y="30" fill="#8a8f98">чёрный ход (1 этаж): считыватель карт — внизу, лестница Б</text>
        <text x="30" y="345" fill="#8a8f98" fontSize="11">Схема не в масштабе. Двери комнат считывателями не оборудованы; вызывные кнопки — у постели и в санузле каждой комнаты.</text>
      </g>
    </svg>
  );
}

export function TabletPhoto() {
  return (
    <svg viewBox="0 0 640 420" className="art-svg" role="img" aria-label="Снимок с планшета, 19.10 03:07">
      <defs>
        <radialGradient id="tpg" cx="30%" cy="35%" r="70%"><stop offset="0" stopColor="#f2c880" stopOpacity="0.85" /><stop offset="0.5" stopColor="#6a4a28" stopOpacity="0.55" /><stop offset="1" stopColor="#0c0a08" stopOpacity="1" /></radialGradient>
        <filter id="tpb"><feGaussianBlur stdDeviation="2" /></filter>
        <filter id="tpm"><feGaussianBlur stdDeviation="5 1" /></filter>
        <filter id="tpn"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="4" /><feColorMatrix type="saturate" values="0" /><feComponentTransfer><feFuncA type="linear" slope="0.35" /></feComponentTransfer></filter>
        <pattern id="knit" width="14" height="22" patternUnits="userSpaceOnUse"><path d="M0 22 Q7 0 14 22" stroke="#3f5a46" strokeWidth="3" fill="none" /><path d="M0 11 Q7 -6 14 11" stroke="#6c8a70" strokeWidth="2" fill="none" /></pattern>
      </defs>
      <rect width="640" height="420" fill="#0b0a09" />
      <rect width="640" height="420" fill="url(#tpg)" />
      {/* тумбочка */}
      <polygon points="0,270 640,250 640,420 0,420" fill="#2a1f16" filter="url(#tpb)" />
      <polygon points="0,270 640,250 640,262 0,282" fill="#4a3624" opacity="0.8" filter="url(#tpb)" />
      {/* ночник */}
      <circle cx="120" cy="150" r="60" fill="#ffd9a0" opacity="0.35" filter="url(#tpb)" />
      <rect x="100" y="170" width="40" height="80" rx="10" fill="#cfa66a" opacity="0.7" />
      {/* чашка на блюдце */}
      <ellipse cx="330" cy="290" rx="96" ry="22" fill="#d9d4c8" filter="url(#tpb)" />
      <ellipse cx="330" cy="283" rx="70" ry="15" fill="#f2efe6" />
      <path d="M270 222 Q268 280 330 284 Q392 280 390 222Z" fill="#ece8de" />
      <ellipse cx="330" cy="222" rx="60" ry="14" fill="#c98b3a" opacity="0.85" />
      <ellipse cx="330" cy="222" rx="60" ry="14" fill="none" stroke="#b79545" strokeWidth="3" />
      {/* рука с кольцом, размытие движения */}
      <g filter="url(#tpm)" opacity="0.95">
        <path d="M640 260 Q540 250 470 282 Q430 300 460 318 Q520 330 640 340Z" fill="#c79d82" />
        <rect x="520" y="300" width="120" height="120" fill="url(#knit)" />
        <path d="M640 330 Q560 322 500 330 L500 420 L640 420Z" fill="#3d5944" opacity="0.8" />
      </g>
      <path d="M460 288 Q420 292 405 300" stroke="#c79d82" strokeWidth="14" strokeLinecap="round" fill="none" filter="url(#tpb)" />
      <ellipse cx="438" cy="296" rx="9" ry="4" fill="none" stroke="#e0c070" strokeWidth="3" />
      <rect width="640" height="420" filter="url(#tpn)" opacity="0.5" />
      <text x="16" y="404" fill="#d9c9a0" fontFamily="PT Mono, monospace" fontSize="14" opacity="0.85">19.10.2025 03:07:41</text>
    </svg>
  );
}

export function CctvStill() {
  return (
    <svg viewBox="0 0 640 360" className="art-svg" role="img" aria-label="Кадр коридора">
      <defs><filter id="cn"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed="7" /><feColorMatrix type="saturate" values="0" /><feComponentTransfer><feFuncA type="linear" slope="0.4" /></feComponentTransfer></filter></defs>
      <rect width="640" height="360" fill="#0d1210" />
      <polygon points="0,0 640,0 440,120 200,120" fill="#161c19" />
      <polygon points="0,360 640,360 440,240 200,240" fill="#101512" />
      <polygon points="200,120 440,120 440,240 200,240" fill="#1b221e" />
      <polygon points="0,0 200,120 200,240 0,360" fill="#131916" />
      <polygon points="640,0 440,120 440,240 640,360" fill="#131916" />
      {[0, 1, 2].map((i) => <rect key={i} x={30 + i * 55} y={80 + i * 22} width="30" height={190 - i * 30} fill="#0a0e0c" stroke="#222a26" />)}
      <rect x="500" y="110" width="26" height="150" fill="#080b09" />
      {/* силуэт в вязаной кофте */}
      <g transform="translate(300,140)"><ellipse cx="0" cy="104" rx="20" ry="5" fill="#000" opacity="0.5" /><path d="M-16 100 L-12 40 Q0 30 12 40 L16 100Z" fill="#6b7a6c" /><circle cx="0" cy="26" r="11" fill="#9a8f84" /><path d="M-12 22 Q0 8 12 22" fill="#b8b4ac" /><rect x="-26" y="52" width="16" height="10" fill="#cfcfc8" /></g>
      <rect width="640" height="360" filter="url(#cn)" opacity="0.55" />
      <text x="14" y="26" fill="#cfd8d0" fontFamily="PT Mono, monospace" fontSize="15">КАМ 2 ЭТ.  ·  03:01:20 (часы рег.)</text>
      <text x="14" y="346" fill="#cfd8d0" fontFamily="PT Mono, monospace" fontSize="13">реальное время: 02:49:40 · кадр-реконструкция по описанию записи</text>
    </svg>
  );
}

export function Art3({ id }: { id: string }) {
  if (id === 'floorplan') return <FloorPlan />;
  if (id === 'tabletphoto') return <TabletPhoto />;
  if (id === 'cctv') return <CctvStill />;
  return null;
}
