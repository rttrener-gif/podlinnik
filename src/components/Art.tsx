// Оригинальные иллюстрации: «фотографии», схема усадьбы, обложка дела.
// Всё нарисовано средствами SVG; ключевая информация дублируется в подписях.

function PhotoDefs({ id, tint = '#d7c9ae' }: { id: string; tint?: string }) {
  return (
    <defs>
      <filter id={`grain-${id}`} x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" result="n" />
        <feColorMatrix type="saturate" values="0" />
        <feComponentTransfer>
          <feFuncA type="linear" slope="0.22" />
        </feComponentTransfer>
      </filter>
      <radialGradient id={`vig-${id}`} cx="50%" cy="50%" r="75%">
        <stop offset="55%" stopColor="#000" stopOpacity="0" />
        <stop offset="100%" stopColor="#000" stopOpacity="0.72" />
      </radialGradient>
      <linearGradient id={`tone-${id}`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor={tint} stopOpacity="0.16" />
        <stop offset="1" stopColor="#6e1f28" stopOpacity="0.12" />
      </linearGradient>
    </defs>
  );
}

function PhotoOverlay({ id }: { id: string }) {
  return (
    <g pointerEvents="none">
      <rect width="640" height="420" fill={`url(#tone-${id})`} />
      <rect width="640" height="420" filter={`url(#grain-${id})`} />
      <rect width="640" height="420" fill={`url(#vig-${id})`} />
    </g>
  );
}

function Tag({ x, y, n }: { x: number; y: number; n: number }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <path d="M0 0 L0 -22 L14 -22 L14 0 Z" fill="#e0b43a" stroke="#1a1408" strokeWidth="1" />
      <text x="7" y="-7" textAnchor="middle" fontSize="11" fontFamily="PT Mono, monospace" fill="#1a1408" fontWeight="bold">
        {n}
      </text>
    </g>
  );
}

function SceneStudy() {
  const id = 'study';
  return (
    <svg viewBox="0 0 640 420" role="img" aria-label="Кабинет: тело под галереей">
      <PhotoDefs id={id} />
      <rect width="640" height="420" fill="#26231f" />
      {/* книжные стеллажи */}
      {Array.from({ length: 9 }).map((_, i) => (
        <g key={i}>
          <rect x={30 + i * 48} y={24} width={42} height={96} fill="#1c1916" stroke="#3a342c" />
          {Array.from({ length: 5 }).map((__, j) => (
            <rect key={j} x={34 + i * 48 + j * 7} y={30 + (j % 2) * 3} width={5} height={84 - (j % 2) * 3} fill={['#5a3b2b', '#3d4a3a', '#6a5a3c', '#40303a', '#4a4036'][(i + j) % 5]} />
          ))}
        </g>
      ))}
      {/* галерея */}
      <rect x={20} y={118} width={420} height={14} fill="#3a3028" />
      <rect x={20} y={132} width={420} height={4} fill="#17130f" />
      {/* перила */}
      {Array.from({ length: 22 }).map((_, i) => (
        <rect key={i} x={22 + i * 19} y={72} width={3} height={46} fill="#0f0d0b" />
      ))}
      <rect x={20} y={70} width={420} height={4} fill="#0f0d0b" />
      {/* повреждённая секция */}
      <path d="M215 70 L262 70 L270 80 L222 86 Z" fill="#0f0d0b" />
      <path d="M222 86 L228 118 M236 84 L242 118 M250 82 L256 118" stroke="#0f0d0b" strokeWidth="3" />
      <g fill="#7b7466" opacity="0.8">
        <circle cx="240" cy="140" r="2.5" />
        <circle cx="252" cy="148" r="2" />
        <circle cx="228" cy="150" r="1.6" />
      </g>
      {/* винтовая лестница */}
      <g>
        <rect x={452} y={50} width={6} height={250} fill="#131110" />
        {Array.from({ length: 10 }).map((_, i) => (
          <path key={i} d={`M455 ${70 + i * 22} L${520 - (i % 2) * 18} ${64 + i * 22} L${520 - (i % 2) * 18} ${76 + i * 22} L455 ${82 + i * 22}Z`} fill="#463a2e" stroke="#12100d" />
        ))}
        <ellipse cx="500" cy="236" rx="12" ry="5" fill="#2b241d" />
      </g>
      {/* пол */}
      <polygon points="0,300 640,300 640,420 0,420" fill="#3a3027" />
      {Array.from({ length: 16 }).map((_, i) => (
        <line key={i} x1={i * 44} y1={300} x2={i * 70 - 160} y2={420} stroke="#241d17" strokeWidth="1.2" />
      ))}
      {[318, 340, 366, 396].map((y) => (
        <line key={y} x1="0" y1={y} x2="640" y2={y} stroke="#241d17" strokeWidth="1" />
      ))}
      {/* окно справа */}
      <rect x={560} y={60} width={70} height={190} fill="#6d7a86" opacity="0.55" stroke="#14110e" strokeWidth="4" />
      <line x1={595} y1={60} x2={595} y2={250} stroke="#14110e" strokeWidth="3" />
      {/* пятно и тело */}
      <ellipse cx="300" cy="360" rx="78" ry="26" fill="#4a1018" opacity="0.88" />
      <g transform="translate(220,350) rotate(-10)">
        <ellipse cx="68" cy="16" rx="52" ry="14" fill="#1f2e4a" />
        <circle cx="132" cy="12" r="13" fill="#bda58c" />
        <path d="M30 22 Q10 34 -14 36" stroke="#1f2e4a" strokeWidth="10" strokeLinecap="round" fill="none" />
        <path d="M74 26 Q96 38 118 40" stroke="#1f2e4a" strokeWidth="10" strokeLinecap="round" fill="none" />
        <path d="M90 6 Q120 -10 144 -2" stroke="#1f2e4a" strokeWidth="9" strokeLinecap="round" fill="none" />
      </g>
      {/* метки */}
      <Tag x={182} y={372} n={1} />
      <Tag x={398} y={378} n={2} />
      <Tag x={326} y={402} n={3} />
      <path d="M170 380 Q130 390 120 360" fill="none" stroke="#e8e0d0" strokeWidth="1.2" strokeDasharray="4 4" opacity="0.6" />
      <PhotoOverlay id={id} />
    </svg>
  );
}

function SceneRailing() {
  const id = 'rail';
  return (
    <svg viewBox="0 0 640 420" role="img" aria-label="Повреждённая секция ограждения галереи">
      <PhotoDefs id={id} />
      <rect width="640" height="420" fill="#2b2824" />
      <rect x="0" y="260" width="640" height="160" fill="#201b17" />
      {/* стена, обвалившаяся штукатурка */}
      <rect x="60" y="30" width="520" height="230" fill="#3f3b35" />
      <path d="M270 30 L420 30 L440 130 L360 170 L290 140 Z" fill="#5a544a" />
      <path d="M300 60 L400 60 L410 120 L350 140 Z" fill="#2f2b26" />
      {/* перила */}
      <rect x="40" y="170" width="560" height="10" fill="#0e0c0a" />
      <path d="M180 172 L470 150 L480 180 L190 186 Z" fill="#0e0c0a" />
      {Array.from({ length: 11 }).map((_, i) => (
        <path key={i} d={`M${70 + i * 48} 180 L${70 + i * 48 + (i > 3 && i < 8 ? 10 : 0)} 260`} stroke="#0e0c0a" strokeWidth="5" />
      ))}
      {/* выдернутый анкер */}
      <circle cx="355" cy="150" r="9" fill="#14110e" />
      <path d="M355 150 l30 22" stroke="#8c6a4f" strokeWidth="5" />
      {/* смазанный след ладони */}
      <ellipse cx="330" cy="174" rx="34" ry="9" fill="#cfc4ad" opacity="0.28" transform="rotate(-6 330 174)" />
      <Tag x={330} y={146} n={4} />
      <Tag x={430} y={236} n={5} />
      <g fill="#6e675a" opacity="0.85">
        <circle cx="420" cy="290" r="3" />
        <circle cx="440" cy="306" r="2.4" />
        <circle cx="380" cy="320" r="2" />
        <circle cx="410" cy="340" r="3.4" />
      </g>
      <PhotoOverlay id={id} />
    </svg>
  );
}

function SceneDesk() {
  const id = 'desk';
  return (
    <svg viewBox="0 0 640 420" role="img" aria-label="Рабочий стол потерпевшего">
      <PhotoDefs id={id} />
      <rect width="640" height="420" fill="#1f1b17" />
      <polygon points="0,170 640,150 640,420 0,420" fill="#3a2a1d" />
      {/* ноутбук */}
      <polygon points="90,150 300,130 316,210 80,230" fill="#242628" stroke="#0a0a0a" strokeWidth="2" />
      <polygon points="80,230 316,210 340,252 60,276" fill="#1a1b1c" stroke="#0a0a0a" strokeWidth="2" />
      <rect x="130" y="238" width="140" height="14" fill="#2d2f31" transform="skewX(-8)" />
      {/* графин */}
      <g transform="translate(400,150)">
        <path d="M0 40 Q-20 70 -16 110 Q-14 140 40 140 Q90 140 86 110 Q90 70 70 40 L62 10 L8 10 Z" fill="#c8c0b0" opacity="0.55" stroke="#e8e0d0" />
        <path d="M-12 100 Q-8 132 40 132 Q82 132 82 100 Z" fill="#7a4a1c" opacity="0.8" />
        <rect x="20" y="-18" width="22" height="30" fill="#d9d2c2" opacity="0.7" />
      </g>
      {/* пепельница */}
      <ellipse cx="540" cy="260" rx="52" ry="18" fill="#2c2a28" stroke="#0f0f0f" />
      <rect x="520" y="248" width="26" height="4" fill="#d8d0c0" transform="rotate(-18 520 248)" />
      <rect x="540" y="254" width="24" height="4" fill="#d8d0c0" transform="rotate(12 540 254)" />
      <rect x="554" y="250" width="18" height="6" fill="#4c3a2a" />
      {/* очки */}
      <g transform="translate(180,320)" stroke="#161310" strokeWidth="3" fill="none">
        <circle cx="0" cy="0" r="22" />
        <circle cx="56" cy="2" r="22" />
        <path d="M22 0 L34 2" />
      </g>
      <Tag x={260} y={134} n={1} />
      <Tag x={410} y={150} n={2} />
      <Tag x={500} y={262} n={3} />
      <PhotoOverlay id={id} />
    </svg>
  );
}

function DinnerPhoto() {
  const id = 'dinner';
  const figs = [
    { x: 70, c: '#2a2f3e', n: 'Орлов' },
    { x: 140, c: '#6d2a3c', n: 'Ирина' },
    { x: 220, c: '#2c3a2c', n: 'Станислав' },
    { x: 305, c: '#6b6759', n: 'Шац' },
    { x: 390, c: '#1f2742', n: 'Ледов' },
    { x: 470, c: '#3d5a52', n: 'Вера' },
    { x: 550, c: '#4a4d57', n: 'Артём' },
  ];
  return (
    <svg viewBox="0 0 640 420" role="img" aria-label="Семейное фото за столом">
      <PhotoDefs id={id} tint="#e6c58a" />
      <rect width="640" height="420" fill="#201814" />
      <rect x="0" y="0" width="640" height="150" fill="#2a1f19" />
      <g opacity="0.8">
        <rect x="30" y="20" width="110" height="78" fill="#3b2a1f" stroke="#7a5a3a" strokeWidth="3" />
        <rect x="500" y="26" width="100" height="70" fill="#3b2a1f" stroke="#7a5a3a" strokeWidth="3" />
      </g>
      {figs.map((f, i) => (
        <g key={i}>
          <path d={`M${f.x - 34} 330 Q${f.x - 34} 226 ${f.x} 226 Q${f.x + 34} 226 ${f.x + 34} 330 Z`} fill={f.c} />
          <circle cx={f.x} cy="190" r="24" fill="#c9ab8c" />
          <path d={`M${f.x - 24} 184 Q${f.x} 150 ${f.x + 24} 184`} fill={i === 1 || i === 5 ? '#3a2a1c' : '#cfcfc9'} opacity="0.9" />
        </g>
      ))}
      {/* трость Шаца — слева от него, резиновый наконечник */}
      <path d="M268 350 L278 240" stroke="#2c2118" strokeWidth="6" strokeLinecap="round" />
      <circle cx="267" cy="352" r="5" fill="#111" />
      {/* трость Ледова — серебряный набалдашник */}
      <path d="M432 340 L418 250" stroke="#14100c" strokeWidth="5" strokeLinecap="round" />
      <circle cx="417" cy="244" r="8" fill="#c0c4c8" />
      {/* стол */}
      <rect x="0" y="320" width="640" height="100" fill="#4a3420" />
      <rect x="0" y="320" width="640" height="10" fill="#6a4a2c" />
      <g>
        <rect x="160" y="336" width="8" height="40" fill="#e8e0c8" />
        <ellipse cx="164" cy="332" rx="4" ry="7" fill="#f2c15a" />
        <rect x="470" y="336" width="8" height="40" fill="#e8e0c8" />
        <ellipse cx="474" cy="332" rx="4" ry="7" fill="#f2c15a" />
      </g>
      <PhotoOverlay id={id} />
    </svg>
  );
}

function Tracks() {
  const id = 'tracks';
  const steps: [number, number][] = [];
  for (let i = 0; i < 12; i++) steps.push([70 + i * 38, 360 - i * 14 - (i % 2) * 8]);
  return (
    <svg viewBox="0 0 640 420" role="img" aria-label="Следы на береговой тропе">
      <PhotoDefs id={id} tint="#9fb5d6" />
      <rect width="640" height="420" fill="#1d242d" />
      <rect y="0" width="640" height="150" fill="#1a1f27" />
      <polygon points="0,170 640,120 640,420 0,420" fill="#8c95a0" />
      <polygon points="0,170 640,120 640,150 0,200" fill="#aab3be" opacity="0.6" />
      {/* дом и терраса */}
      <rect x="420" y="40" width="210" height="110" fill="#2b2824" />
      <rect x="470" y="80" width="90" height="70" fill="#8c7a56" opacity="0.7" stroke="#0b0907" strokeWidth="4" />
      <line x1="515" y1="80" x2="515" y2="150" stroke="#0b0907" strokeWidth="3" />
      <g stroke="#cbb27a" strokeWidth="2" fill="none">
        <path d="M580 90 L580 120" />
        <path d="M572 120 L572 146 M580 120 L580 152 M588 120 L588 142" />
      </g>
      {/* ограда и калитка */}
      <g stroke="#0c0f13" strokeWidth="5">
        <line x1="0" y1="330" x2="60" y2="340" />
        <line x1="60" y1="340" x2="75" y2="290" />
        <line x1="76" y1="290" x2="140" y2="300" />
      </g>
      {/* дорожка и следы */}
      {steps.map(([x, y], i) => (
        <g key={i}>
          <ellipse cx={x} cy={y} rx="11" ry="5" fill="#59616c" opacity="0.9" transform={`rotate(${-14} ${x} ${y})`} />
          {i % 2 === 1 && <circle cx={x + 16} cy={y + 8} r="3" fill="#3f4650" />}
        </g>
      ))}
      <ellipse cx="500" cy="190" rx="26" ry="7" fill="#59616c" opacity="0.8" />
      <circle cx="526" cy="196" r="3" fill="#3f4650" />
      <circle cx="536" cy="200" r="3" fill="#3f4650" />
      <Tag x={80} y={310} n={1} />
      <Tag x={260} y={280} n={2} />
      <Tag x={500} y={170} n={3} />
      {/* линейка */}
      <g transform="translate(150,392)">
        <rect width="120" height="10" fill="#d8d0b8" stroke="#201a14" />
        {Array.from({ length: 11 }).map((_, i) => (
          <line key={i} x1={i * 12} y1="0" x2={i * 12} y2={i % 5 === 0 ? 10 : 5} stroke="#201a14" />
        ))}
      </g>
      <PhotoOverlay id={id} />
    </svg>
  );
}

function UvPainting() {
  const id = 'uv';
  return (
    <svg viewBox="0 0 640 420" role="img" aria-label="Ультрафиолетовый снимок картины">
      <PhotoDefs id={id} tint="#8a5cff" />
      <rect width="640" height="420" fill="#0b0618" />
      <rect x="60" y="30" width="520" height="360" fill="#14102a" stroke="#3a2c6a" strokeWidth="8" />
      {/* небо и вода */}
      <rect x="72" y="42" width="496" height="150" fill="#1b1540" />
      <rect x="72" y="192" width="496" height="186" fill="#10122c" />
      {/* светящиеся тонировки */}
      <path d="M90 70 Q200 40 320 80 T550 70 L550 110 Q430 140 320 120 T90 120 Z" fill="#8fd2ff" opacity="0.5" />
      <path d="M100 240 Q220 220 330 250 T540 240 L540 290 Q420 310 330 290 T100 300 Z" fill="#b9a2ff" opacity="0.4" />
      <ellipse cx="160" cy="320" rx="60" ry="22" fill="#c8fff0" opacity="0.35" />
      {/* лодки */}
      <path d="M200 230 L260 230 L250 252 L210 252 Z" fill="#05040c" />
      <path d="M380 245 L450 245 L438 268 L392 268 Z" fill="#05040c" />
      <line x1="230" y1="230" x2="230" y2="170" stroke="#05040c" strokeWidth="3" />
      <line x1="414" y1="245" x2="414" y2="180" stroke="#05040c" strokeWidth="3" />
      {/* подпись */}
      <rect x="440" y="340" width="110" height="28" fill="none" stroke="#ff7bd2" strokeWidth="2" strokeDasharray="6 4" />
      <text x="495" y="360" textAnchor="middle" fontFamily="Caveat, cursive" fontSize="22" fill="#ff7bd2">
        М. Лавров 1912
      </text>
      <Tag x={95} y={110} n={1} />
      <Tag x={95} y={290} n={2} />
      <Tag x={430} y={365} n={3} />
      <PhotoOverlay id={id} />
    </svg>
  );
}

function Plan() {
  return (
    <svg viewBox="0 0 760 540" role="img" aria-label="Схема усадьбы" className="plan-svg">
      <rect width="760" height="540" fill="#e8dec7" />
      <g fontFamily="PT Sans, IBM Plex Sans, sans-serif" fontSize="12" fill="#2b2418">
        {/* озеро */}
        <path d="M0 490 Q190 470 380 490 T760 480 L760 540 L0 540 Z" fill="#9fb0b8" />
        <text x="30" y="520" fontStyle="italic">оз. Сенное</text>
        {/* участок */}
        <rect x="20" y="20" width="720" height="440" fill="none" stroke="#5a4a32" strokeDasharray="8 5" strokeWidth="1.6" />
        <path d="M30 458 L720 456" stroke="#8a7a5a" strokeWidth="3" strokeDasharray="2 6" />
        <text x="520" y="476">береговая тропа</text>
        {/* дорожка от ворот */}
        <path d="M390 20 L390 150" stroke="#8a7a5a" strokeWidth="6" />
        {/* ворота */}
        <rect x="360" y="14" width="60" height="12" fill="#6d1f28" />
        <text x="430" y="30">главные ворота • камера № 1</text>
        {/* главный дом */}
        <rect x="190" y="150" width="380" height="190" fill="#f4ecd8" stroke="#2b2418" strokeWidth="2.4" />
        <line x1="330" y1="150" x2="330" y2="340" stroke="#2b2418" strokeWidth="1.6" />
        <line x1="420" y1="150" x2="420" y2="340" stroke="#2b2418" strokeWidth="1.6" />
        <line x1="520" y1="150" x2="520" y2="340" stroke="#2b2418" strokeWidth="1.6" />
        <text x="226" y="170" fontWeight="bold">КАБИНЕТ</text>
        <text x="226" y="186" fontSize="10.5">двойной свет, галерея</text>
        <rect x="190" y="150" width="26" height="190" fill="url(#hatch)" opacity="0.7" />
        <text x="344" y="170" fontWeight="bold">ХОЛЛ</text>
        <text x="430" y="170" fontWeight="bold">СТОЛОВАЯ</text>
        <text x="528" y="170" fontWeight="bold">КУХНЯ</text>
        <text x="200" y="330" fontSize="10.5">лестница на галерею</text>
        <circle cx="262" cy="270" r="12" fill="#f4ecd8" stroke="#2b2418" />
        <text x="252" y="274" fontSize="10">спир.</text>
        <text x="204" y="236" fill="#6d1f28" fontWeight="bold">× место обнаружения</text>
        <circle cx="252" cy="300" r="5" fill="#6d1f28" />
        {/* двери */}
        <rect x="372" y="146" width="36" height="8" fill="#2b2418" />
        <text x="374" y="140" fontSize="10.5">вход</text>
        <rect x="552" y="146" width="22" height="8" fill="#2b2418" />
        <text x="540" y="140" fontSize="10.5">кухня</text>
        {/* терраса */}
        <rect x="190" y="340" width="160" height="42" fill="#d8cdb0" stroke="#2b2418" strokeWidth="1.6" />
        <text x="204" y="365" fontWeight="bold">ТЕРРАСА</text>
        <rect x="232" y="336" width="60" height="8" fill="#9fb0b8" stroke="#2b2418" />
        <text x="232" y="332" fontSize="10.5">окно + дверь на террасу</text>
        <text x="290" y="395" fontSize="10.5">колокольчик ветра</text>
        {/* гараж + квартира Нины */}
        <rect x="600" y="60" width="130" height="88" fill="#f4ecd8" stroke="#2b2418" strokeWidth="1.8" />
        <text x="610" y="90" fontWeight="bold">ГАРАЖ</text>
        <text x="610" y="108">кв. Н. Ф. Кравец</text>
        <text x="610" y="124" fontSize="10.5">(над гаражом)</text>
        {/* мастерская */}
        <rect x="40" y="380" width="110" height="60" fill="#f4ecd8" stroke="#2b2418" strokeWidth="1.8" />
        <text x="52" y="408" fontWeight="bold">МАСТЕРСКАЯ</text>
        <text x="52" y="424" fontSize="10.5">К. А. Лаптев</text>
        <rect x="150" y="394" width="6" height="22" fill="#9fb0b8" stroke="#2b2418" />
        <text x="160" y="410" fontSize="10.5">окно на тропу и террасу</text>
        {/* лодочный сарай */}
        <rect x="570" y="418" width="100" height="32" fill="#d8cdb0" stroke="#2b2418" strokeWidth="1.6" />
        <text x="578" y="438">лодочный сарай</text>
        {/* калитка у озера */}
        <rect x="236" y="452" width="36" height="9" fill="#6d1f28" />
        <text x="276" y="450" fontSize="11.5" fontWeight="bold">калитка к озеру — без камеры, щеколда</text>
        {/* камера 3 */}
        <circle cx="470" cy="260" r="0" />
        <text x="170" y="120" fontSize="11">двор: камера № 3 не работает с 05.11</text>
        {/* компас */}
        <g transform="translate(700,420)">
          <circle r="16" fill="none" stroke="#2b2418" />
          <path d="M0 -14 L5 4 L0 0 L-5 4 Z" fill="#6d1f28" />
          <text x="-4" y="-20" fontSize="11">С</text>
        </g>
        {/* ночной путь не показан намеренно: схема нейтральна */}
      </g>
      <defs>
        <pattern id="hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="6" stroke="#2b2418" strokeWidth="1.2" />
        </pattern>
      </defs>
    </svg>
  );
}

const ART: Record<string, () => JSX.Element> = {
  plan: Plan,
  'scene-study': SceneStudy,
  'scene-railing': SceneRailing,
  'scene-desk': SceneDesk,
  'dinner-photo': DinnerPhoto,
  tracks: Tracks,
  'uv-painting': UvPainting,
};

export function Art({ id }: { id: string }) {
  const C = ART[id];
  return C ? <C /> : null;
}

export function CoverArt() {
  return (
    <svg viewBox="0 0 520 640" className="cover-art" role="img" aria-label="Обложка дела: дом у озера ночью">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0d0d10" />
          <stop offset="1" stopColor="#2a1015" />
        </linearGradient>
        <filter id="cg">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="3" />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.18" />
          </feComponentTransfer>
        </filter>
        <radialGradient id="glow" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#e7b866" stopOpacity="0.55" />
          <stop offset="1" stopColor="#e7b866" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="520" height="640" fill="url(#sky)" />
      {/* луна */}
      <circle cx="410" cy="110" r="38" fill="#e8e0cc" opacity="0.9" />
      <circle cx="396" cy="100" r="38" fill="#14090c" opacity="0.2" />
      {/* озеро */}
      <rect y="420" width="520" height="220" fill="#101419" />
      {Array.from({ length: 9 }).map((_, i) => (
        <rect key={i} x={150 + (i % 3) * 10} y={436 + i * 18} width={220 - i * 12} height="2" fill="#e7b866" opacity={0.28 - i * 0.025} />
      ))}
      {/* берег */}
      <path d="M0 420 L120 400 L300 410 L520 396 L520 430 L0 430 Z" fill="#06070a" />
      {/* дом */}
      <g transform="translate(150,290)">
        <path d="M0 130 L0 50 L110 8 L220 50 L220 130 Z" fill="#050507" />
        <path d="M-8 52 L110 2 L228 52" stroke="#050507" strokeWidth="8" fill="none" />
        <rect x="150" y="70" width="34" height="46" fill="#f2c36b" />
        <circle cx="167" cy="93" r="46" fill="url(#glow)" />
        <line x1="167" y1="70" x2="167" y2="116" stroke="#050507" strokeWidth="2" />
        <rect x="42" y="78" width="22" height="34" fill="#16171c" />
        <rect x="88" y="78" width="22" height="34" fill="#16171c" />
      </g>
      {/* лента ограждения */}
      <g transform="rotate(-8 260 520)">
        <rect x="-20" y="505" width="560" height="30" fill="#c9a227" />
        <text x="250" y="527" textAnchor="middle" fontFamily="PT Mono, monospace" fontSize="16" fill="#14100a" fontWeight="bold" letterSpacing="3">
          СЛЕДСТВЕННЫЕ ДЕЙСТВИЯ · НЕ ВХОДИТЬ · СЛЕДСТВЕННЫЕ ДЕЙСТВИЯ
        </text>
      </g>
      <rect width="520" height="640" filter="url(#cg)" />
    </svg>
  );
}
