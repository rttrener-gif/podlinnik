// Типы второго дела «ТИХО-ТИХО»

export type Cond = string[]; // токены: ev: seen: flag: ins: ask: show: req: pair: ; «|» — ИЛИ внутри токена

export type Tone = 'calm' | 'evasive' | 'shift' | 'partial' | 'irritated' | 'counter' | 'end' | 'reveal' | 'sad';

export interface LookSpec {
  skin: number; // 0..4
  hair: string;
  hairStyle: 'short' | 'long' | 'bob' | 'bun' | 'bald' | 'curly' | 'swept' | 'buzz' | 'messy' | 'long2';
  glasses?: 'round' | 'rect';
  beard?: 'stubble' | 'trim' | 'moustache';
  cap?: string;
  beanie?: string;
  shirt: string;
  collar?: 'hoodie' | 'blazer' | 'cardigan' | 'jacket' | 'tee';
  age: number; // 15..75
  face: number; // 0.9..1.15 ширина лица
  eyes?: string;
  bg: number; // оттенок фона
  vintage?: boolean;
  lipstick?: boolean;
  headphones?: boolean;
}

export interface Person {
  id: string;
  name: string;
  short: string;
  role: string;
  kind: 'missing' | 'suspect' | 'witness' | 'archive' | 'expert';
  line: string; // краткая карточка
  facts: string[]; // 2–3 коротких факта
  look: LookSpec;
}

export type EvKind = 'photo' | 'item' | 'doc' | 'phone' | 'audio' | 'video' | 'forensic';

export interface Evidence {
  id: string;
  title: string;
  caption: string;
  kind: EvKind;
  art: string; // ключ иллюстрации
  lines?: string[]; // текст на предмете (записная книжка, журнал и т.д.)
  detail: string[]; // подробности по запросу
  at?: { day: number; hm: string; label?: string }; // для временной шкалы: day 14 = 14 февраля 2025
  people?: string[];
  tag?: string; // группа на доске
  audio?: string; // id голосового материала
  opens?: 'phone' | 'cctv' | 'spectro'; // специальный просмотрщик
}

export interface Hotspot {
  id: string;
  label: string;
  x: number;
  y: number;
  w: number;
  h: number;
  ev?: string; // что получает игрок
  when?: Cond; // доступность (иначе — «обычный предмет»)
  plain: string; // что видит игрок, пока не пришло время
}

export interface Place {
  id: string;
  name: string;
  sub: string;
  scene: string;
  when?: Cond;
  spots: Hotspot[];
  x: number; // положение на карте
  y: number;
}

export interface Topic {
  id: string;
  level: 1 | 2 | 3 | 4; // 1 первичный, 2 углублённый, 3 после противоречий, 4 повторный
  label: string; // формулировка вопроса следователя
  basis: string; // основание — понятное игроку, на чём вопрос держится
  when?: Cond;
  answer: string;
  tone: Tone;
  sets?: string[];
  gives?: string[];
}

export interface Reaction {
  answer: string;
  tone: Tone;
  sets?: string[];
  gives?: string[];
  variants?: { when: Cond; answer: string; tone: Tone; sets?: string[]; gives?: string[] }[];
}

export interface Interview {
  person: string;
  intro: string;
  topics: Topic[];
  react: Record<string, Reaction>;
  fallback: string;
}

export interface RequestDef {
  id: string;
  title: string;
  question: string; // на какой вопрос отвечает
  why: string; // почему следователь это запрашивает
  when: Cond;
  need: string; // что должно произойти, чтобы запрос стал доступен (без спойлеров)
  result: string;
  gives: string[];
  sets?: string[];
  kind: 'expertise' | 'search' | 'records' | 'check';
}

export type InsightKind = 'fact' | 'contradiction' | 'hypothesis' | 'question';

export interface Insight {
  id: string;
  kind: InsightKind;
  title: string;
  text: string;
  when: Cond;
  from: string[]; // доказательства-основания
  sets?: string[];
}

export interface GameEvent {
  id: string;
  when: Cond;
  from: string; // person id
  type: 'msg' | 'call' | 'voice';
  text: string;
  audio?: string;
  sets?: string[];
  gives?: string[];
}

export interface HintDef {
  id: string;
  when: Cond;
  done: Cond; // подсказка больше не актуальна
  goal: string; // текущая задача (без спойлеров)
  l1: string;
  l2: string;
  l3: string;
}

export interface Testimony {
  id: string;
  person: string;
  q: string;
  a: string;
  tone: Tone;
  via: 'ask' | 'show';
  ev?: string;
  at: number;
}

export interface S2 {
  v: number;
  started: boolean;
  ev: string[];
  seen: string[];
  flags: string[];
  asked: string[];
  shown: string[];
  reqs: string[];
  pairs: string[];
  ins: { id: string; at: number }[];
  events: string[];
  testimony: Testimony[];
  board: Record<string, { x: number; y: number }>;
  links: { id: string; a: string; b: string; label: string }[];
  conclusions: { id: string; text: string; status: 'hyp' | 'ok' | 'no' }[];
  notes: string;
  hints: Record<string, number>;
  bookmarks: string[];
  journal: { at: number; text: string }[];
  attempts: { at: number; verdict: string; score: number }[];
  freshIns: string[];
  freshEv: string[];
  solved: boolean;
  revealed: boolean;
}
