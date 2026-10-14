import type { PersonLook } from '../types';
import { P3 } from '../data/people';

const SKIN = ['#e9cdb8', '#d7a98a', '#b9815d', '#8a5a3c'];
const SHADE = ['#a98670', '#8f6246', '#6c4630', '#4a2e1e'];

export function Portrait3({ id, size, className = '' }: { id: string; size?: number; className?: string }) {
  const p = P3[id];
  if (!p) return null;
  const l: PersonLook = p.look;
  const sk = SKIN[l.skin] ?? SKIN[1];
  const sh = SHADE[l.skin] ?? SHADE[1];
  const w = 46 * (l.face ?? 1);
  const age = Math.max(0, (l.age - 30) / 50);
  const g = 'q' + id;
  const grey = l.style === 'grey-bun' || /^#(?:b|c|d|8)[0-9a-f]{5}$/i.test(l.hair);
  return (
    <div className={'p3 ' + className} style={size ? { width: size, height: size * 1.25 } : undefined}>
      <svg viewBox="0 0 160 200" role="img" aria-label={p.name}>
        <defs>
          <radialGradient id={g + 'bg'} cx="30%" cy="30%" r="90%"><stop offset="0" stopColor={`hsl(${l.bg} 12% 36%)`} /><stop offset="1" stopColor={`hsl(${l.bg} 14% 8%)`} /></radialGradient>
          <radialGradient id={g + 'f'} cx="35%" cy="32%" r="80%"><stop offset="0" stopColor={sk} /><stop offset="0.7" stopColor={sk} /><stop offset="1" stopColor={sh} /></radialGradient>
          <linearGradient id={g + 'l'} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#fff2d8" stopOpacity="0.22" /><stop offset="0.55" stopColor="#000" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity="0.5" /></linearGradient>
          <linearGradient id={g + 'c'} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={l.shirt} /><stop offset="1" stopColor="#000" stopOpacity="0.6" /></linearGradient>
          <filter id={g + 'b'}><feGaussianBlur stdDeviation="0.9" /></filter>
          <filter id={g + 'b2'}><feGaussianBlur stdDeviation="2.4" /></filter>
          <filter id={g + 'n'}><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="11" /><feColorMatrix type="saturate" values="0" /><feComponentTransfer><feFuncA type="linear" slope="0.32" /></feComponentTransfer></filter>
          <radialGradient id={g + 'v'} cx="50%" cy="45%" r="75%"><stop offset="50%" stopColor="#000" stopOpacity="0" /><stop offset="100%" stopColor="#000" stopOpacity="0.72" /></radialGradient>
        </defs>
        <rect width="160" height="200" fill={`url(#${g}bg)`} />
        <circle cx="30" cy="40" r="18" fill="#fff" opacity="0.06" filter={`url(#${g}b2)`} />
        <circle cx="132" cy="70" r="26" fill="#fff" opacity="0.05" filter={`url(#${g}b2)`} />
        {/* плечи */}
        <path d="M6 200 Q12 150 52 142 L108 142 Q148 150 154 200Z" fill={`url(#${g}c)`} filter={`url(#${g}b)`} />
        {/* шея */}
        <path d="M66 118 L66 150 Q80 162 94 150 L94 118Z" fill={sh} filter={`url(#${g}b)`} />
        {/* волосы за головой */}
        {l.style === 'long' && <path d={`M${80 - w - 8} 150 Q${80 - w - 12} 30 80 26 Q${80 + w + 12} 30 ${80 + w + 8} 150Z`} fill={l.hair} filter={`url(#${g}b)`} />}
        {l.style === 'bob' && <path d={`M${80 - w - 6} 108 Q${80 - w - 8} 28 80 26 Q${80 + w + 8} 28 ${80 + w + 6} 108Z`} fill={l.hair} filter={`url(#${g}b)`} />}
        {/* голова */}
        <ellipse cx="80" cy="84" rx={w} ry="56" fill={`url(#${g}f)`} filter={`url(#${g}b)`} />
        <ellipse cx={80 - w + 4} cy="90" rx="6" ry="12" fill={sh} opacity="0.6" />
        <ellipse cx={80 + w - 4} cy="90" rx="6" ry="12" fill={sh} opacity="0.8" />
        {/* морщины */}
        {age > 0.2 && <g stroke={sh} strokeWidth="1" fill="none" opacity={0.35 + age * 0.35} filter={`url(#${g}b)`}>
          <path d="M60 58 Q80 53 100 58" /><path d="M62 64 Q80 60 98 64" /><path d={`M${80 - w + 6} 88 l7 3 M${80 + w - 6} 88 l-7 3`} /><path d="M66 110 Q62 118 68 124 M94 110 Q98 118 92 124" />
        </g>}
        {/* глаза */}
        {[-1, 1].map((d) => (
          <g key={d} filter={`url(#${g}b)`}>
            <ellipse cx={80 + d * 17 * (l.face ?? 1)} cy="82" rx="8" ry="3.6" fill="#e9e6df" opacity="0.9" />
            <circle cx={80 + d * 17 * (l.face ?? 1)} cy="82" r="3" fill="#2a2420" />
            <path d={`M${80 + d * 17 * (l.face ?? 1) - 10} 74 Q${80 + d * 17 * (l.face ?? 1)} 70 ${80 + d * 17 * (l.face ?? 1) + 10} 74`} stroke={grey ? '#8a8a88' : l.hair} strokeWidth="2.6" fill="none" opacity="0.85" />
            <ellipse cx={80 + d * 17 * (l.face ?? 1)} cy="86" rx="9" ry="3" fill={sh} opacity="0.35" />
          </g>
        ))}
        {/* нос и рот */}
        <path d="M80 86 Q77 102 74 106 Q80 110 86 106" stroke={sh} strokeWidth="2" fill="none" opacity="0.55" filter={`url(#${g}b)`} />
        <path d="M68 124 Q80 128 92 124" stroke="#6a3a34" strokeWidth="2.2" strokeLinecap="round" fill="none" opacity="0.8" filter={`url(#${g}b)`} />
        {l.beard && <path d={`M${80 - w + 4} 98 Q${80 - w + 12} 134 80 138 Q${80 + w - 12} 134 ${80 + w - 4} 98 Q${80 + w - 14} 120 80 120 Q${80 - w + 14} 120 ${80 - w + 4} 98Z`} fill={l.hair} opacity="0.5" />}
        {/* волосы спереди */}
        {l.style !== 'bald' && (
          <path d={`M${80 - w - 2} 78 Q${80 - w - 4} 28 80 26 Q${80 + w + 4} 28 ${80 + w + 2} 78 Q${80 + w - 8} ${l.style === 'buzz' ? 54 : 46} 80 ${l.style === 'buzz' ? 52 : 44} Q${80 - w + 8} ${l.style === 'buzz' ? 54 : 46} ${80 - w - 2} 78Z`} fill={l.hair} opacity={l.style === 'buzz' ? 0.7 : 1} filter={`url(#${g}b)`} />
        )}
        {(l.style === 'bun' || l.style === 'grey-bun') && <circle cx="80" cy="22" r="13" fill={l.hair} filter={`url(#${g}b)`} />}
        {l.glasses && <g stroke="#1a1a1a" strokeWidth="1.4" fill="rgba(200,215,230,0.1)"><circle cx={80 - 17 * (l.face ?? 1)} cy="82" r="11" /><circle cx={80 + 17 * (l.face ?? 1)} cy="82" r="11" /><path d={`M${80 - 6 * (l.face ?? 1)} 82 L${80 + 6 * (l.face ?? 1)} 82`} /></g>}
        <rect width="160" height="200" fill={`url(#${g}l)`} />
        <rect width="160" height="200" filter={`url(#${g}n)`} opacity="0.5" />
        <rect width="160" height="200" fill={`url(#${g}v)`} />
        <rect width="160" height="200" fill="#6b5a44" opacity="0.1" style={{ mixBlendMode: 'color' }} />
      </svg>
    </div>
  );
}
