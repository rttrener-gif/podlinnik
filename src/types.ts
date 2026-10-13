// Общие типы данных игры

export type DocKind =
  | 'protocol'
  | 'statement'
  | 'report'
  | 'chat'
  | 'email'
  | 'transcript'
  | 'table'
  | 'photo'
  | 'plan'
  | 'receipt'
  | 'handwritten'
  | 'screen'
  | 'letter';

export type DocGroup =
  | 'Осмотр и фото'
  | 'Экспертизы'
  | 'Показания'
  | 'Переписка и записи'
  | 'Документы'
  | 'Данные и журналы';

export type Block =
  | { t: 'h'; text: string }
  | { t: 'p'; text: string }
  | { t: 'meta'; rows: [string, string][] }
  | { t: 'list'; items: string[] }
  | { t: 'table'; head: string[]; rows: string[][]; caption?: string }
  | { t: 'msg'; who: string; time: string; text: string; side?: 'l' | 'r' }
  | { t: 'day'; text: string }
  | { t: 'qa'; q: string; a: string }
  | { t: 'line'; who: string; text: string }
  | { t: 'quote'; text: string; by?: string }
  | { t: 'stamp'; text: string }
  | { t: 'sign'; rows: string[] }
  | { t: 'art'; id: string; caption: string }
  | { t: 'note'; text: string }
  | { t: 'receipt'; shop: string; lines: [string, string][]; total: string; foot?: string[] }
  | { t: 'sep' };

export interface Doc {
  id: string;
  title: string;
  subtitle?: string;
  kind: DocKind;
  group: DocGroup;
  date: string; // как на документе
  source: string; // откуда материал
  people?: string[]; // id персон, которых касается материал
  blocks: Block[];
}

export type Cond = string[]; // "doc:ID" | "seen:ID" | "flag:ID" | "ask:person.qid" | "req:ID"

export interface Person {
  id: string;
  name: string;
  short: string;
  role: string;
  age: number;
  group: 'victim' | 'suspect' | 'witness';
  tagline: string;
  bio: string[];
  facts: [string, string][];
  hue: number; // для заглушки-портрета
  initials: string;
}

export interface Question {
  id: string;
  text: string;
  answer: string;
  requires?: Cond;
  sets?: string[];
  gives?: string[];
}

export interface ConfrontVariant {
  requires: Cond; // реакция меняется, когда у следователя появились новые сведения
  answer: string;
  sets?: string[];
  gives?: string[];
}

export interface Confront {
  answer: string;
  sets?: string[];
  gives?: string[];
  variants?: ConfrontVariant[];
}

export interface Interview {
  person: string;
  intro: string;
  questions: Question[];
  confront: Record<string, Confront>;
  fallback: string;
}

export interface Request {
  id: string;
  title: string;
  text: string;
  requires: Cond;
  hint: string; // что нужно, чтобы запрос стал доступен (без спойлеров)
  result: string;
  gives: string[];
  sets?: string[];
}

export interface StatementClaim {
  id: string;
  who: string;
  text: string;
}

// ---------- Состояние игры ----------

export interface Pin {
  id: string;
  docId: string;
  text: string;
  at: number;
}

export interface TimelineItem {
  id: string;
  day: 'fri' | 'sat';
  time: string; // HH:MM
  text: string;
  person?: string;
  docId?: string;
}

export interface Link {
  id: string;
  a: string;
  b: string;
  label: string;
}

export interface Contradiction {
  id: string;
  person: string;
  claim: string;
  evidence: string[];
  note: string;
}

export interface Version {
  id: string;
  title: string;
  suspect: string;
  motive: string;
  method: string;
  evidence: string[];
  note: string;
}

export interface JournalEntry {
  at: number;
  kind: 'doc' | 'ask' | 'show' | 'req' | 'board' | 'note' | 'sys' | 'final';
  text: string;
}

export interface Testimony {
  id: string;
  person: string;
  q: string;
  a: string;
  via: 'ask' | 'show';
  docId?: string;
  at: number;
}

export interface Accusation {
  suspect: string;
  method: string;
  entry: string;
  moment: string;
  motive: string;
  evidence: string[];
  lies: string[];
}

export interface Attempt {
  at: number;
  accusation: Accusation;
  verdict: 'wrong' | 'partial' | 'solved';
}

export interface GameState {
  v: number;
  started: boolean;
  startedAt: number;
  unlocked: string[];
  seen: string[];
  flags: string[];
  asked: string[];
  shown: string[];
  reqDone: string[];
  testimony: Testimony[];
  pins: Pin[];
  timeline: TimelineItem[];
  board: Record<string, { x: number; y: number }>;
  links: Link[];
  contradictions: Contradiction[];
  versions: Version[];
  notes: string;
  journal: JournalEntry[];
  attempts: Attempt[];
  solved: boolean;
  revealed: boolean;
}
