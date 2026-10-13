import { useState } from 'react';
import type { LookSpec, Tone } from '../types';
import { P2 } from '../data/people';

const SKIN = ['#f3d9c6', '#e8c0a0', '#d4a07c', '#aa7a54', '#7c5438'];
const SKIN_SH = ['#d9b39a', '#c99b7a', '#b07f5b', '#85593a', '#5a3a26'];

const MOOD: Record<Tone, { brow: number; mouth: number; look: number; lid: number }> = {
  calm: { brow: 0, mouth: 1, look: 0, lid: 0 },
  evasive: { brow: 1, mouth: 0, look: -5, lid: 1 },
  shift: { brow: 2, mouth: -1, look: 4, lid: 1 },
  partial: { brow: 1, mouth: -0.5, look: -3, lid: 0 },
  irritated: { brow: -3, mouth: -2, look: 0, lid: 2 },
  counter: { brow: 2, mouth: 1.2, look: 0, lid: 0 },
  end: { brow: -1, mouth: -1.5, look: 3, lid: 2 },
  reveal: { brow: 3, mouth: -1.2, look: 0, lid: 0 },
  sad: { brow: 3, mouth: -2, look: 4, lid: 2 },
};

function Hair({ l, front }: { l: LookSpec; front: boolean }) {
  const c = l.hair;
  const s = l.hairStyle;
  const w = 62 * l.face;
  if (front) {
    if (s === 'bald') return null;
    if (s === 'short' || s === 'buzz') return <path d={`M${100 - w} 78 Q${100 - w + 6} ${s === 'buzz' ? 50 : 40} 100 ${s === 'buzz' ? 44 : 36} Q${100 + w - 6} ${s === 'buzz' ? 50 : 40} ${100 + w} 78 Q${100 + w - 8} ${s === 'buzz' ? 62 : 58} 100 ${s === 'buzz' ? 58 : 54} Q${100 - w + 8} ${s === 'buzz' ? 62 : 58} ${100 - w} 78Z`} fill={c} opacity={s === 'buzz' ? 0.8 : 1} />;
    if (s === 'swept') return <path d={`M${100 - w} 82 Q${100 - w} 36 108 32 Q${100 + w + 4} 34 ${100 + w} 80 Q${100 + w - 14} 56 94 58 Q${100 - w + 16} 62 ${100 - w} 82Z`} fill={c} />;
    if (s === 'messy') return <path d={`M${100 - w} 78 Q${100 - w - 6} 36 96 30 Q${100 + w + 8} 30 ${100 + w} 78 Q${100 + w - 4} 52 120 56 L108 48 L96 58 L82 50 Q${100 - w + 8} 58 ${100 - w} 78Z`} fill={c} />;
    if (s === 'bob') return <path d={`M${100 - w - 4} 112 Q${100 - w - 10} 34 100 32 Q${100 + w + 10} 34 ${100 + w + 4} 112 Q${100 + w - 2} 88 ${100 + w - 10} 70 Q100 52 ${100 - w + 10} 70 Q${100 - w + 2} 88 ${100 - w - 4} 112Z`} fill={c} />;
    if (s === 'curly') return <g fill={c}>{Array.from({ length: 12 }).map((_, i) => <circle key={i} cx={100 + Math.cos((i / 12) * Math.PI + Math.PI) * (w + 4)} cy={70 + Math.sin((i / 12) * Math.PI + Math.PI) * 38} r={13} />)}</g>;
    if (s === 'bun') return <g><path d={`M${100 - w} 80 Q${100 - w} 38 100 36 Q${100 + w} 38 ${100 + w} 80 Q${100 + w - 10} 58 100 56 Q${100 - w + 10} 58 ${100 - w} 80Z`} fill={c} /><circle cx="100" cy="26" r="15" fill={c} /></g>;
    // long / long2
    return <path d={`M${100 - w - 2} 120 Q${100 - w - 8} 34 100 32 Q${100 + w + 8} 34 ${100 + w + 2} 120 Q${100 + w - 6} 76 100 56 Q${100 - w + 6} 76 ${100 - w - 2} 120Z`} fill={c} />;
  }
  if (s === 'long' || s === 'long2') return <path d={`M${100 - w - 6} 200 Q${100 - w - 14} 40 100 30 Q${100 + w + 14} 40 ${100 + w + 6} 200 Z`} fill={c} />;
  if (s === 'bob') return <path d={`M${100 - w - 6} 120 Q${100 - w - 10} 36 100 32 Q${100 + w + 10} 36 ${100 + w + 6} 120 Z`} fill={c} />;
  return null;
}

export function PortraitSvg({ look, mood = 'calm', id }: { look: LookSpec; mood?: Tone; id: string }) {
  const m = MOOD[mood];
  const skin = SKIN[look.skin] ?? SKIN[1];
  const sh = SKIN_SH[look.skin] ?? SKIN_SH[1];
  const w = 54 * look.face;
  const age = (look.age - 20) / 50;
  const gid = `p${id}`;
  const eyeY = 104;
  return (
    <svg viewBox="0 0 200 240" role="img" aria-hidden="true" className="portrait-svg">
      <defs>
        <radialGradient id={`${gid}bg`} cx="50%" cy="38%" r="75%">
          <stop offset="0" stopColor={`hsl(${look.bg} 18% 34%)`} />
          <stop offset="1" stopColor={`hsl(${look.bg} 20% 9%)`} />
        </radialGradient>
        <linearGradient id={`${gid}f`} x1="0" y1="0" x2="1" y2="0.3">
          <stop offset="0" stopColor={skin} />
          <stop offset="0.65" stopColor={skin} />
          <stop offset="1" stopColor={sh} />
        </linearGradient>
        <radialGradient id={`${gid}v`} cx="50%" cy="45%" r="70%">
          <stop offset="55%" stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.65" />
        </radialGradient>
        <filter id={`${gid}n`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.95" numOctaves="2" seed="4" />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer><feFuncA type="linear" slope="0.2" /></feComponentTransfer>
        </filter>
      </defs>
      <rect width="200" height="240" fill={`url(#${gid}bg)`} />
      {/* плечи и одежда */}
      <Hair l={look} front={false} />
      <path d="M10 240 Q18 176 62 168 L138 168 Q182 176 190 240Z" fill={look.shirt} />
      <path d="M10 240 Q18 176 62 168 L82 168 Q60 200 50 240Z" fill="#000" opacity="0.16" />
      {look.collar === 'blazer' && <path d="M70 168 L100 214 L130 168 L120 168 L100 196 L80 168Z" fill="#f2efe8" opacity="0.92" />}
      {look.collar === 'hoodie' && <path d="M64 170 Q100 192 136 170 L132 184 Q100 206 68 184Z" fill="#000" opacity="0.28" />}
      {look.collar === 'cardigan' && <path d="M82 168 L100 232 L118 168 L112 168 L100 206 L88 168Z" fill="#f0e8d8" opacity="0.85" />}
      {look.collar === 'jacket' && <path d="M66 170 L100 204 L134 170 L124 168 L100 188 L76 168Z" fill="#000" opacity="0.28" />}
      {/* шея */}
      <path d="M82 150 L82 176 Q100 194 118 176 L118 150Z" fill={sh} />
      {/* уши */}
      <ellipse cx={100 - w - 1} cy="108" rx="7" ry="12" fill={sh} />
      <ellipse cx={100 + w + 1} cy="108" rx="7" ry="12" fill={sh} />
      {/* голова */}
      <path d={`M${100 - w} 90 Q${100 - w} 40 100 40 Q${100 + w} 40 ${100 + w} 90 Q${100 + w - 2} 146 100 156 Q${100 - w + 2} 146 ${100 - w} 90Z`} fill={`url(#${gid}f)`} />
      <ellipse cx={100 - w * 0.55} cy="128" rx="14" ry="9" fill={sh} opacity="0.28" />
      <ellipse cx={100 + w * 0.55} cy="128" rx="14" ry="9" fill={sh} opacity="0.35" />
      {/* морщины */}
      {age > 0.35 && (<g stroke={sh} strokeWidth="1.2" fill="none" opacity={0.35 + age * 0.4}>
        <path d={`M${100 - 24} 70 Q100 ${64 + m.brow * -0.4} ${100 + 24} 70`} />
        <path d={`M${100 - 22} 76 Q100 ${72} ${100 + 22} 76`} />
        <path d={`M${100 - w + 6} 108 l7 3 M${100 + w - 6} 108 l-7 3`} />
        <path d={`M${100 - 20} 132 Q${100 - 24} 140 ${100 - 18} 146 M${100 + 20} 132 Q${100 + 24} 140 ${100 + 18} 146`} />
      </g>)}
      {/* глаза */}
      {[-1, 1].map((sd) => {
        const cx = 100 + sd * 20 * look.face;
        return (
          <g key={sd}>
            <ellipse cx={cx} cy={eyeY} rx="9.5" ry={5 - m.lid * 0.5} fill="#f4f1ea" />
            <circle cx={cx + m.look * 0.5} cy={eyeY} r="4" fill={look.eyes ?? '#3a3a3a'} />
            <circle cx={cx + m.look * 0.5} cy={eyeY} r="1.8" fill="#0a0a0a" />
            <circle cx={cx + m.look * 0.5 + 1.2} cy={eyeY - 1.2} r="0.9" fill="#fff" opacity="0.9" />
            <path d={`M${cx - 10} ${eyeY - 1} Q${cx} ${eyeY - 8 + m.lid * 0.7} ${cx + 10} ${eyeY - 1}`} stroke="#2a1d16" strokeWidth="1.6" fill="none" opacity="0.8" />
            <path d={`M${cx - 11} ${eyeY - 12 + (sd === 1 ? m.brow * 0.5 : -m.brow * 0.2)} Q${cx} ${eyeY - 17 - m.brow} ${cx + 11} ${eyeY - 12 - (sd === 1 ? 0 : -m.brow * 0.5) + (sd === -1 ? m.brow * 0.5 : 0)}`} stroke={look.hair === '#d8d6d0' || look.hair === '#b9b6b0' ? '#8a8a88' : look.hair} strokeWidth="3.2" strokeLinecap="round" fill="none" />
          </g>
        );
      })}
      {/* нос */}
      <path d="M100 108 Q96 126 94 132 Q100 136 106 132" stroke={sh} strokeWidth="2" fill="none" opacity="0.7" />
      <path d="M92 134 Q100 140 108 134" stroke="#000" strokeWidth="1" fill="none" opacity="0.2" />
      {/* рот */}
      <path d={`M${100 - 15} 146 Q100 ${146 + m.mouth * 4} ${100 + 15} 146`} stroke={look.lipstick ? '#a8323c' : '#7a3b34'} strokeWidth={look.lipstick ? 3.6 : 2.6} strokeLinecap="round" fill="none" />
      {/* борода */}
      {look.beard === 'stubble' && <path d={`M${100 - w + 6} 120 Q${100 - w + 14} 158 100 160 Q${100 + w - 14} 158 ${100 + w - 6} 120 Q${100 + w - 14} 146 100 148 Q${100 - w + 14} 146 ${100 - w + 6} 120Z`} fill="#000" opacity="0.22" />}
      {look.beard === 'trim' && <path d={`M${100 - w + 4} 116 Q${100 - w + 10} 164 100 166 Q${100 + w - 10} 164 ${100 + w - 4} 116 Q${100 + w - 16} 150 100 150 Q${100 - w + 16} 150 ${100 - w + 4} 116Z`} fill={look.hair} />}
      {look.beard === 'moustache' && <path d="M82 140 Q100 132 118 140 Q112 148 100 144 Q88 148 82 140Z" fill={look.hair === '#8a8a88' ? '#7a7a78' : look.hair} />}
      {/* волосы */}
      <Hair l={look} front />
      {look.cap && <g><path d={`M${100 - w - 4} 78 Q${100 - w} 40 100 38 Q${100 + w} 40 ${100 + w + 4} 78Z`} fill={look.cap} /><path d={`M${100 - w - 6} 78 L${100 + w + 14} 78 Q${100 + w + 14} 86 ${100 + w - 4} 84 L${100 - w - 4} 84Z`} fill="#000" opacity="0.35" /></g>}
      {look.beanie && <path d={`M${100 - w - 3} 82 Q${100 - w - 4} 36 100 34 Q${100 + w + 4} 36 ${100 + w + 3} 82 Q100 70 ${100 - w - 3} 82Z`} fill={look.beanie} />}
      {look.headphones && <g><path d={`M${100 - w - 4} 104 Q${100 - w - 4} 44 100 42 Q${100 + w + 4} 44 ${100 + w + 4} 104`} stroke="#222" strokeWidth="5" fill="none" /><rect x={100 - w - 12} y="96" width="12" height="24" rx="5" fill="#222" /><rect x={100 + w} y="96" width="12" height="24" rx="5" fill="#222" /></g>}
      {/* очки */}
      {look.glasses === 'rect' && <g stroke="#1b1b1b" strokeWidth="2.2" fill="rgba(180,200,220,0.12)"><rect x="66" y="94" width="30" height="20" rx="4" /><rect x="104" y="94" width="30" height="20" rx="4" /><path d="M96 102 L104 102" /></g>}
      {look.glasses === 'round' && <g stroke="#2a2a2a" strokeWidth="2" fill="rgba(200,215,230,0.12)"><circle cx="80" cy="104" r="13" /><circle cx="120" cy="104" r="13" /><path d="M93 102 L107 102" /></g>}
      <rect width="200" height="240" fill={`url(#${gid}v)`} />
      <rect width="200" height="240" filter={`url(#${gid}n)`} />
      {look.vintage && <rect width="200" height="240" fill="#8a6a3a" opacity="0.28" style={{ mixBlendMode: 'multiply' }} />}
    </svg>
  );
}

const BASE = (import.meta as unknown as { env: { BASE_URL: string } }).env.BASE_URL;

export function Portrait({ id, mood = 'calm', className = '', label }: { id: string; mood?: Tone; className?: string; label?: boolean }) {
  const p = P2[id];
  const [img, setImg] = useState<boolean>(false);
  if (!p) return null;
  return (
    <div className={'portrait ' + className} data-person={id}>
      <img
        className="portrait-img"
        src={`${BASE}photos/${id}.jpg`}
        alt=""
        style={{ display: img ? 'block' : 'none' }}
        onLoad={() => setImg(true)}
        onError={() => setImg(false)}
      />
      {!img && <PortraitSvg look={p.look} mood={mood} id={id} />}
      {label && <div className="portrait-name">{p.short}</div>}
    </div>
  );
}
