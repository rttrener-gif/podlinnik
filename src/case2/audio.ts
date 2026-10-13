// Звук: фоновая атмосфера и эффекты на Web Audio API; озвучка — речевой синтез браузера (резервный вариант).
// Ничего не запускается до первого действия пользователя.

interface Prefs { sound: boolean; music: boolean; vol: number; calm: boolean; voice: boolean }
const KEY = 'tikho.audio.v1';

let prefs: Prefs = { sound: true, music: true, vol: 0.6, calm: false, voice: true };
try {
  const r = localStorage.getItem(KEY);
  if (r) prefs = { ...prefs, ...JSON.parse(r) };
} catch { /* */ }

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let ambient: { stop: () => void } | null = null;
const listeners = new Set<() => void>();

export const getPrefs = () => prefs;
export const subscribe = (f: () => void) => { listeners.add(f); return () => { listeners.delete(f); }; };

export function setPrefs(p: Partial<Prefs>) {
  prefs = { ...prefs, ...p };
  try { localStorage.setItem(KEY, JSON.stringify(prefs)); } catch { /* */ }
  if (master) master.gain.value = prefs.sound ? prefs.vol : 0;
  if (!prefs.music) stopAmbient(); else if (ctx) startAmbient();
  if (!prefs.sound) { try { window.speechSynthesis?.cancel(); } catch { /* */ } }
  listeners.forEach((f) => f());
}

function ensure(): AudioContext | null {
  try {
    if (!ctx) {
      const AC = (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext);
      if (!AC) return null;
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = prefs.sound ? prefs.vol : 0;
      master.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') void ctx.resume();
    return ctx;
  } catch { return null; }
}

function noise(c: AudioContext, secs = 2): AudioBufferSourceNode {
  const b = c.createBuffer(1, c.sampleRate * secs, c.sampleRate);
  const d = b.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  const n = c.createBufferSource();
  n.buffer = b; n.loop = true;
  return n;
}

export function startAmbient() {
  const c = ensure();
  if (!c || !master || !prefs.music || ambient) return;
  const g = c.createGain(); g.gain.value = 0.0; g.connect(master);
  g.gain.linearRampToValueAtTime(0.5, c.currentTime + 3);
  // тихий сетевой фон 50 Гц + низкий дрон + ночной шум
  const o1 = c.createOscillator(); o1.frequency.value = 50; const g1 = c.createGain(); g1.gain.value = 0.05; o1.connect(g1).connect(g);
  const o2 = c.createOscillator(); o2.type = 'sine'; o2.frequency.value = 55; const g2 = c.createGain(); g2.gain.value = 0.06; o2.connect(g2).connect(g);
  const o3 = c.createOscillator(); o3.frequency.value = 110.4; const g3 = c.createGain(); g3.gain.value = 0.02; o3.connect(g3).connect(g);
  const lfo = c.createOscillator(); lfo.frequency.value = 0.07; const lg = c.createGain(); lg.gain.value = 3; lfo.connect(lg).connect(o2.frequency);
  const n = noise(c, 3); const f = c.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 400; const gn = c.createGain(); gn.gain.value = 0.025; n.connect(f).connect(gn).connect(g);
  [o1, o2, o3, lfo, n].forEach((x) => x.start());
  ambient = { stop: () => { try { g.gain.linearRampToValueAtTime(0, c.currentTime + 0.6); window.setTimeout(() => [o1, o2, o3, lfo, n].forEach((x) => { try { x.stop(); } catch { /* */ } }), 700); } catch { /* */ } } };
}
export function stopAmbient() { ambient?.stop(); ambient = null; }

function tone(freq: number, dur: number, type: OscillatorType = 'sine', gain = 0.2, when = 0, slide = 0) {
  const c = ensure(); if (!c || !master || !prefs.sound) return;
  const o = c.createOscillator(); const g = c.createGain();
  o.type = type; o.frequency.setValueAtTime(freq, c.currentTime + when);
  if (slide) o.frequency.linearRampToValueAtTime(freq + slide, c.currentTime + when + dur);
  g.gain.setValueAtTime(0, c.currentTime + when);
  g.gain.linearRampToValueAtTime(gain, c.currentTime + when + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + when + dur);
  o.connect(g).connect(master); o.start(c.currentTime + when); o.stop(c.currentTime + when + dur + 0.05);
}

export type Sfx = 'click' | 'open' | 'evidence' | 'insight' | 'notify' | 'ring' | 'error' | 'key' | 'play';
export function sfx(name: Sfx) {
  if (!prefs.sound) return;
  if (prefs.calm && (name === 'insight' || name === 'ring')) name = 'notify';
  ensure();
  switch (name) {
    case 'click': tone(520, 0.05, 'triangle', 0.08); break;
    case 'open': tone(300, 0.1, 'triangle', 0.1); tone(420, 0.12, 'triangle', 0.08, 0.06); break;
    case 'key': tone(700, 0.04, 'square', 0.04); break;
    case 'evidence': tone(392, 0.2, 'sine', 0.15); tone(587, 0.3, 'sine', 0.12, 0.12); break;
    case 'insight': tone(440, 0.25, 'sine', 0.14); tone(660, 0.25, 'sine', 0.12, 0.12); tone(990, 0.5, 'sine', 0.1, 0.26); break;
    case 'notify': tone(880, 0.12, 'sine', 0.12); tone(1175, 0.18, 'sine', 0.1, 0.1); break;
    case 'ring': for (let i = 0; i < 4; i++) { tone(420, 0.2, 'sine', 0.12, i * 0.5); tone(470, 0.2, 'sine', 0.12, i * 0.5 + 0.22); } break;
    case 'error': tone(180, 0.25, 'sawtooth', 0.1); break;
    case 'play': tone(600, 0.08, 'triangle', 0.08); break;
  }
}

// ── Озвучка: синтез речи браузера. Это НЕ записи героев; расшифровка всегда доступна ──
let speaking = false;
export function speak(text: string, voice: 'f' | 'm', onEnd?: () => void): boolean {
  try {
    const synth = window.speechSynthesis;
    if (!synth || !prefs.sound || !prefs.voice) return false;
    synth.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'ru-RU';
    u.rate = 0.95;
    u.pitch = voice === 'f' ? 1.15 : 0.8;
    u.volume = Math.min(1, prefs.vol + 0.2);
    const vs = synth.getVoices().filter((v) => v.lang.toLowerCase().startsWith('ru'));
    if (vs.length) u.voice = vs.find((v) => (voice === 'f' ? /(female|milena|alena|катя|ирина)/i : /(male|yuri|maxim|юрий)/i).test(v.name)) ?? vs[0];
    u.onend = () => { speaking = false; onEnd?.(); };
    u.onerror = () => { speaking = false; onEnd?.(); };
    speaking = true;
    synth.speak(u);
    return true;
  } catch { return false; }
}
export const stopSpeech = () => { try { window.speechSynthesis?.cancel(); } catch { /* */ } speaking = false; };
export const isSpeaking = () => speaking;

export function unlock() { ensure(); if (prefs.music) startAmbient(); }
