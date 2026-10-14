// Дело 3 · «ТИХАЯ ГАВАНЬ»

export type Cond = string[]; // ev: seen: flag: ins: ask: show: act: ; «|» — ИЛИ ; «!» в начале токена — отрицание; present — предъявляется улика

export type Cat = 'Документы' | 'Медицинские' | 'Экспертизы' | 'Показания' | 'Цифровые' | 'Осмотр и фото' | 'Записи';

export interface Ev3 {
  id: string;
  title: string;
  cat: Cat;
  source: string; // откуда
  date: string;
  body: string[]; // абзацы полного текста
  table?: { head: string[]; rows: string[][]; caption?: string };
  art?: string; // иллюстрация-снимок
  device?: string; // открывает устройство
  kw: string[]; // слова, по которым вопрос игрока распознаёт этот материал
  people?: string[];
}

export interface PersonLook {
  skin: number; hair: string; style: 'short' | 'long' | 'bun' | 'bob' | 'bald' | 'buzz' | 'curly' | 'grey-bun';
  glasses?: boolean; beard?: boolean; age: number; shirt: string; bg: number; face?: number;
}

export interface Person3 {
  id: string;
  name: string;
  short: string;
  role: string;
  look: PersonLook;
  bio: string; // публичная справка
  interview: boolean;
}

export type Tone = 'calm' | 'guarded' | 'evasive' | 'tense' | 'irritated' | 'sad' | 'open' | 'counter';

export interface Ans {
  when?: Cond;
  text: string;
  tone?: Tone;
  sets?: string[];
  gives?: string[];
}

export interface Topic3 {
  id: string;
  kw: string[];
  ans: Ans[]; // выбирается последний подходящий; первый без when — по умолчанию
}

export interface Interview3 {
  person: string;
  intro: string;
  topics: Topic3[];
  know: Record<string, Ans[]>; // реакция на конкретную улику (упоминание или предъявление)
  fallback: string[]; // общие «не по теме»
  unknown: string; // не компетентен
  hints: { id: string; when: Cond; done: Cond; l1: string; l2: string; l3: string }[];
}

export interface Action3 {
  id: string;
  title: string;
  kind: 'Экспертиза' | 'Запрос данных' | 'Обыск' | 'Проверка';
  aim: string; // цель
  grounds: string; // основание (показывается уже после появления)
  when: Cond;
  notice: string; // уведомление о новой возможности (без результата)
  gives: string[];
  sets?: string[];
}

export interface Insight3 {
  id: string;
  kind: 'contradiction' | 'link' | 'version' | 'question';
  title: string;
  text: string;
  when: Cond;
  from: string[];
}

export interface TLRow {
  id: string;
  day: string; // 'YYYY-MM-DD'
  hm: string;
  text: string;
  kind: 'objective' | 'claim';
  src: string[]; // ev-id'ы
  who?: string;
}

export interface S3 {
  v: number;
  started: boolean;
  ev: string[];
  seen: string[];
  flags: string[];
  asked: string[]; // person.topic
  lastAns: Record<string, number>; // person.topic -> индекс последнего ответа
  shown: string[]; // person.ev
  acts: string[];
  noticed: string[]; // действия, о которых уведомили
  pendingNotice: string[];
  pairs: string[];
  ins: { id: string; at: number }[];
  freshIns: string[];
  log: { id: string; person: string; q: string; a: string; tone: Tone; at: number; kind: 'ask' | 'show'; qid?: string; key?: string }[];
  hints: Record<string, number>;
  board: Record<string, { x: number; y: number }>;
  links: { id: string; a: string; b: string; label: string; status: 'hyp' | 'ok' }[];
  versions: { id: string; title: string; who: string; text: string; sup: string[]; con: string[]; status: 'open' | 'held' | 'rejected' }[];
  notes: string;
  attempts: { at: number; score: number; verdict: string }[];
  solved: boolean;
  revealed: boolean;
}
