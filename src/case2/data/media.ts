// Аудиоматериалы, телефон, камеры наблюдения

export interface AudioLine { t: number; who: string; text: string; note?: boolean }
export interface AudioDef {
  id: string; title: string; sub: string; dur: number; voice: 'f' | 'm'; room: 'home' | 's2' | 'line' | 'air';
  lines: AudioLine[]; synthetic?: boolean;
}

export const AUDIO: Record<string, AudioDef> = {
  'vm-0312': {
    id: 'vm-0312', title: 'Голосовое «мама» · 03:12', sub: '0:41 · номер Алины', dur: 41, voice: 'f', room: 'home',
    lines: [
      { t: 0, who: 'Алина', text: 'Мам... это я. Я уехала. Не волнуйся, пожалуйста.' },
      { t: 12, who: 'Алина', text: 'Мне нужно время, чтобы разобраться. Не ищи меня и не звони. Я позвоню сама.' },
      { t: 30, who: 'Алина', text: 'Я в порядке. Люблю тебя.' },
      { t: 40, who: '', text: '[щелчок в конце записи]', note: true },
    ],
  },
  'memo-alina': {
    id: 'memo-alina', title: 'Диктофон · 14.02 21:19', sub: '0:52 · дома', dur: 52, voice: 'f', room: 'home',
    lines: [
      { t: 0, who: 'Алина', text: 'Двадцать один девятнадцать. Если вы это слушаете — значит, я оказалась права. Я не пропала. Я ушла сама, и об этом знают двое.' },
      { t: 18, who: 'Алина', text: 'Три сообщения в 03:12 — мои. Я написала их заранее. Но всё, что придёт после — не от меня.' },
      { t: 33, who: 'Алина', text: 'Он умеет записывать голос так, что человек не знает, что его записали. Я тоже записывалась. Я сама пришла.' },
      { t: 46, who: 'Алина', text: 'Если услышите «я в порядке» после трёх тридцати — это не я. «Тихо-тихо» — это не мои слова.' },
    ],
  },
  'tape-2009': {
    id: 'tape-2009', title: 'Автоответчик · 2009', sub: '0:29 · Лиза Дёмина', dur: 29, voice: 'f', room: 's2',
    lines: [
      { t: 0, who: 'Лиза', text: 'Мам, не волнуйся. Я уезжаю. Я давно хотела. Я позвоню, когда устроюсь.' },
      { t: 14, who: 'Лиза', text: 'Не ищи меня. Вы всё равно не поймёте. Всё хорошо.' },
      { t: 23, who: 'Лиза', text: 'Хорошо?..' },
      { t: 26, who: 'Мужской голос', text: '[едва слышно] «…тихо-тихо. Хорошо.»', note: true },
    ],
  },
  'vm-2014': {
    id: 'vm-2014', title: 'Голосовое · март 2014', sub: '0:34 · Ирина Бойко', dur: 34, voice: 'f', room: 's2',
    lines: [
      { t: 0, who: 'Ирина', text: 'Катя, это я. Я ухожу. Не ищи. Я много думала.' },
      { t: 15, who: 'Ирина', text: 'Мне давно пора. Береги маму. Всё хорошо. Целую.' },
      { t: 30, who: 'Мужской голос', text: '[едва слышно] «…тихо-тихо. Хорошо.»', note: true },
    ],
  },
  'vm-2019': {
    id: 'vm-2019', title: 'Голосовое · ноябрь 2019', sub: '0:31 · Ксения Лаврова', dur: 31, voice: 'f', room: 's2',
    lines: [
      { t: 0, who: 'Ксения', text: 'Лен, привет. Я в порядке, правда. Я начинаю заново. Далеко.' },
      { t: 15, who: 'Ксения', text: 'Не пиши мне, пожалуйста. Так будет легче.' },
      { t: 27, who: 'Мужской голос', text: '[едва слышно] «…тихо-тихо. Хорошо.»', note: true },
    ],
  },
  'call-anna': {
    id: 'call-anna', title: 'Эфир «Ночной собеседник» · 23:48', sub: '4:12 · звонок «Анны»', dur: 252, voice: 'f', room: 'air',
    lines: [
      { t: 0, who: 'Ведущий', text: 'Ночной собеседник, слушаю вас.' },
      { t: 8, who: 'Анна', text: 'Здравствуйте. Меня зовут Анна. Мне хочется исчезнуть. Чтобы меня никто не искал.' },
      { t: 40, who: 'Ведущий', text: 'Анна, спасибо, что позвонили. Вы не одна. Скажите: есть ли место, где вы чувствуете себя тихо?' },
      { t: 80, who: 'Анна', text: 'Там, где тепло. Где гудит.' },
      { t: 130, who: 'Ведущий', text: 'Тихо-тихо. Хорошо. Оставьте номер, я позвоню вам после эфира.' },
      { t: 170, who: 'Анна', text: 'Не надо. Я позвоню сама.' },
      { t: 230, who: 'Ведущий', text: 'Спокойной ночи, Анна. Тихо-тихо.' },
    ],
  },
  'vm-fake': {
    id: 'vm-fake', title: 'Новое голосовое «мама» · 15.02', sub: '0:28 · номер Алины', dur: 28, voice: 'f', room: 's2',
    lines: [
      { t: 0, who: 'Алина', text: 'Мам, это я. У меня всё хорошо, я в Финляндии, у друзей.' },
      { t: 10, who: 'Алина', text: 'Помнишь, как папа брал меня ловить щуку у Горелого мыса? Вот так я себя и чувствую — тихо-тихо.' },
      { t: 22, who: 'Алина', text: 'Не ищи меня. Я скоро позвоню. Целую.' },
    ],
  },
};

// ───────── Телефон Алины ─────────
export interface Msg { who: 'me' | 'them'; t: string; text: string; sched?: boolean; deleted?: boolean; voice?: string }
export interface Thread { id: string; name: string; avatar: string; msgs: Msg[]; needs?: string }

export const PHONE_PIN = '1402';

export const THREADS: Thread[] = [
  { id: 'denis', name: 'Денис', avatar: 'denis', msgs: [
    { who: 'them', t: '14.02 18:02', text: 'Ты когда?' },
    { who: 'me', t: '14.02 18:05', text: 'Поздно. Ночью записываю.' },
    { who: 'them', t: '14.02 18:06', text: 'Опять ночью.' },
    { who: 'me', t: '14.02 20:44', text: 'Люблю. Не жди.' },
    { who: 'them', t: '15.02 02:48', text: 'Ты где? Не отвечаешь.' },
    { who: 'me', t: '15.02 03:12', text: 'Я в порядке. Не ищи меня. Это важно. Прости. А.', sched: true },
  ] },
  { id: 'polina', name: 'Мама', avatar: 'polina', msgs: [
    { who: 'them', t: '14.02 17:30', text: 'Купи хлеб, если будешь у нас.' },
    { who: 'me', t: '14.02 20:50', text: 'Мам, завтра заеду, привезу лекарство.' },
    { who: 'me', t: '15.02 03:12', text: 'Голосовое сообщение (0:41)', voice: 'vm-0312', sched: true },
  ] },
  { id: 'marina', name: 'Марина (работа)', avatar: 'marina', msgs: [
    { who: 'them', t: '14.02 19:40', text: 'Файл 7 всё ещё не отдала? Мне надо к утру.' },
    { who: 'me', t: '14.02 19:42', text: 'Потом. Я сегодня записываю № 12. Не заходи.' },
    { who: 'them', t: '14.02 19:43', text: 'Ты опять про это? Алина, пожалуйста.' },
    { who: 'me', t: '15.02 03:12', text: 'Файл 7 не открывай. Я всё объясню сама.', sched: true },
  ] },
  { id: 'yarik', name: 'Ярик', avatar: 'yarik', msgs: [
    { who: 'them', t: '12.02 20:30', text: 'Принесёшь усилитель? Сделаю.' },
    { who: 'me', t: '12.02 20:31', text: 'Да. И пульт посмотри — глючит.' },
    { who: 'me', t: '12.02 22:10', text: 'Сделаешь, как договорились. Таймер на 03:12.', deleted: true },
    { who: 'them', t: '12.02 22:12', text: 'Ты уверена? Это плохая идея, Алин.', deleted: true },
    { who: 'me', t: '12.02 22:14', text: 'Он должен поверить, что я такая же, как они.', deleted: true },
    { who: 'them', t: '12.02 22:15', text: 'А если он не поверит?', deleted: true },
    { who: 'me', t: '12.02 22:16', text: 'Тогда мы всё равно будем знать, кто звонит ночью после трёх.', deleted: true },
  ], needs: 'extracted' },
];

export const CALLS = [
  { who: 'Денис', t: '14.02 17:12', dir: 'вх.', dur: '0:48' },
  { who: 'Волна-FM, прямая линия', t: '14.02 23:48', dir: 'исх.', dur: '4:12' },
  { who: 'Леонид А. (Ночной)', t: '12.02 20:41', dir: 'вх.', dur: '0:36', needs: 'extracted' },
  { who: 'Леонид А. (Ночной)', t: '09.02 21:05', dir: 'вх.', dur: '2:10', needs: 'extracted' },
  { who: 'Марина (работа)', t: '13.02 11:20', dir: 'исх.', dur: '1:04' },
];

export const PHOTOS = [
  { id: 'ph1', cap: 'Стена с вырезками дома', art: 'clippings' },
  { id: 'ph2', cap: 'Коробка с кассетой «К.Л.»', art: 'cassette' },
  { id: 'ph3', cap: 'Скриншот: график студии № 2', art: 'doc-schedule' },
  { id: 'ph4', cap: 'Ярик у стойки. Табличка на двери: «11 — радиоузел»', art: 'school11', date: '2023' },
  { id: 'ph5', cap: 'Стеллаж с плёнками', art: 'cassette' },
];

export const NOTES = [
  { id: 'n1', title: 'Купить', text: 'Батарейки для налобного фонаря. Тёплые носки. Термос.' },
  { id: 'n2', title: 'Проверить', text: 'Кто из них слышал «тихо-тихо» вживую? Не на записи — в комнате.' },
  { id: 'n3', title: 'Мама', text: 'День рождения 20.02. Не забыть лекарство. Спросить про Горелый мыс — зачем она про него молчала всю жизнь?', needs: 'extracted' },
];

export const NOTIFICATIONS = [
  { app: 'Отложенная отправка', t: '14.02 21:15', text: 'Запланировано: 3 сообщения на 15.02 03:12', needs: 'extracted' },
  { app: 'Диктофон', t: '14.02 21:19', text: 'Сохранена запись «Заметка 14.02 21:19»', needs: 'extracted' },
  { app: 'Отложенная отправка', t: '15.02 03:12', text: 'Отправлено: 3 из 3', needs: 'extracted' },
  { app: 'Денис', t: '15.02 02:48', text: 'Ты где? Не отвечаешь.' },
];

// ───────── Камеры ─────────
export interface CamEvent { cam: 1 | 2; at: number; /* минуты от 19:30 */ until?: number; label: string; kind: 'motion' | 'key'; who?: string }
const m = (hh: number, mm: number) => (hh < 12 ? (hh + 24) * 60 : hh * 60) + mm - (19 * 60 + 30);
export const CAM_START = 0; // 19:30
export const CAM_END = m(7, 0);
export const hmOf = (min: number) => {
  const tot = (19 * 60 + 30 + Math.floor(min)) % (24 * 60);
  const h = Math.floor(tot / 60), mi = tot % 60;
  return `${String(h).padStart(2, '0')}:${String(mi).padStart(2, '0')}`;
};
export const dayOf = (min: number) => ((19 * 60 + 30 + Math.floor(min)) >= 24 * 60 ? '15.02.2025' : '14.02.2025');
export const MIN = m;

export const CAM_EVENTS: CamEvent[] = [
  { cam: 1, at: m(20, 10), until: m(20, 12), label: 'Человек с кейсом входит', kind: 'motion', who: 'yarik' },
  { cam: 1, at: m(21, 3), until: m(21, 5), label: 'Тот же человек выходит с кейсом', kind: 'motion', who: 'yarik' },
  { cam: 1, at: m(21, 40), until: m(21, 41), label: 'Женщина в зелёном пальто входит', kind: 'key', who: 'alina' },
  { cam: 1, at: m(21, 52), until: m(21, 53), label: 'Мужчина выходит, на плече — моток', kind: 'key', who: 'ruslan' },
  { cam: 1, at: m(23, 20), until: m(23, 21), label: 'Тот же мужчина возвращается, мешок', kind: 'key', who: 'ruslan' },
  { cam: 1, at: m(6, 8), until: m(6, 10), label: 'Приезжает автомобиль, выходит женщина', kind: 'motion', who: 'marina' },
  { cam: 2, at: m(20, 21), until: m(20, 24), label: 'Радиотехник открывает студию ключом', kind: 'motion', who: 'yarik' },
  { cam: 2, at: m(21, 3), until: m(21, 4), label: 'Радиотехник выходит из студии', kind: 'motion', who: 'yarik' },
  { cam: 2, at: m(21, 44), until: m(21, 45), label: 'Алина входит в студию, дверь закрыта', kind: 'key', who: 'alina' },
  { cam: 2, at: m(0, 31), until: m(0, 32), label: 'Свет за матовым стеклом гаснет', kind: 'key' },
  { cam: 2, at: m(3, 12), until: m(3, 13), label: 'Загорается лампа «ON AIR» (41 с)', kind: 'key' },
  { cam: 2, at: m(6, 8), until: m(6, 10), label: 'Сторож и редактор у двери', kind: 'motion', who: 'ruslan' },
];
