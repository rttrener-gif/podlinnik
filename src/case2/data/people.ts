import type { Person } from '../types';

export const PEOPLE2: Person[] = [
  {
    id: 'alina', name: 'Алина Верхотурова', short: 'А. Верхотурова', role: 'Звукорежиссёр, ведущая подкаста «Тихий эфир»', kind: 'missing',
    line: 'Исчезла из запертой студии в ночь на 15 февраля.',
    facts: ['34 года', 'Записывала подкаст о нераскрытых делах Тихоярска', 'Последний раз видна на камере в 21:44'],
    look: { skin: 1, hair: '#3a2a22', hairStyle: 'long', shirt: '#2f4a3c', collar: 'jacket', age: 34, face: 1, eyes: '#4a3a2a', bg: 160 },
  },
  {
    id: 'denis', name: 'Денис Громов', short: 'Д. Громов', role: 'Партнёр Алины, инженер-программист', kind: 'suspect',
    line: 'Сообщил об исчезновении. Следил за её геолокацией.',
    facts: ['36 лет', 'Живёт с Алиной три года', 'Получил сообщение в 03:12'],
    look: { skin: 1, hair: '#3b2e25', hairStyle: 'short', beard: 'stubble', glasses: 'rect', shirt: '#4a4d52', collar: 'hoodie', age: 36, face: 1.04, eyes: '#3a4a5a', bg: 210 },
  },
  {
    id: 'ruslan', name: 'Руслан Хабибуллин', short: 'Р. Хабибуллин', role: 'Сторож радиоузла № 7', kind: 'suspect',
    line: 'Говорит, что всю ночь не отходил от поста.',
    facts: ['52 года', 'Двадцать лет при здании', 'Слышал голос в студии в 03:12'],
    look: { skin: 2, hair: '#8a8a88', hairStyle: 'bald', beard: 'moustache', cap: '#2b2f26', shirt: '#4b5236', collar: 'jacket', age: 52, face: 1.1, eyes: '#4a3a2a', bg: 90 },
  },
  {
    id: 'marina', name: 'Марина Кольцова', short: 'М. Кольцова', role: 'Выпускающий редактор радио «Волна-FM»', kind: 'suspect',
    line: 'Продюсер подкаста. Первой оказалась у запертой двери.',
    facts: ['41 год', 'Руководит эфиром «Ночного собеседника»', 'Передала Алине архивные плёнки'],
    look: { skin: 0, hair: '#c9a96a', hairStyle: 'bob', shirt: '#1d1d22', collar: 'blazer', age: 41, face: 0.96, eyes: '#5a7a8a', bg: 350, lipstick: true },
  },
  {
    id: 'sedykh', name: 'Леонид Седых', short: 'Л. Седых', role: 'Радиопсихолог, ведущий «Ночного собеседника»', kind: 'suspect',
    line: 'Голос города. Первым пришёл помогать с поисками.',
    facts: ['63 года', 'Двадцать лет в эфире с 23:00 до 02:00', 'Консультирует семью Верхотуровых', 'Летом живёт на даче в Пригорье'],
    look: { skin: 0, hair: '#b9b6b0', hairStyle: 'swept', beard: 'trim', glasses: 'round', shirt: '#8a7a5a', collar: 'cardigan', age: 63, face: 1, eyes: '#5a6a5a', bg: 40 },
  },
  {
    id: 'kovalev', name: 'Борис Ковалёв', short: 'Б. Ковалёв', role: 'Бывший следователь, вёл дело 2009 года', kind: 'witness',
    line: 'Закрыл дело Лизы Дёминой как «добровольный уход».',
    facts: ['67 лет', 'В отставке с 2016', 'Хранит копии материалов дома'],
    look: { skin: 1, hair: '#d8d6d0', hairStyle: 'buzz', shirt: '#5a4a3a', collar: 'jacket', age: 67, face: 1.08, eyes: '#4a5a6a', bg: 30 },
  },
  {
    id: 'yarik', name: 'Ярослав Самойлов', short: 'Я. Самойлов', role: 'Радиотехник «Волны-FM», радиолюбитель', kind: 'suspect',
    line: 'Говорит, что в тот вечер не был в здании.',
    facts: ['27 лет', 'Собирает передатчики и приёмники', 'Окончил школу № 4'],
    look: { skin: 1, hair: '#2a2420', hairStyle: 'messy', beanie: '#2a2f3a', shirt: '#1c1c20', collar: 'hoodie', age: 27, face: 0.94, eyes: '#3a3a3a', bg: 270, headphones: true },
  },
  {
    id: 'polina', name: 'Полина Верхотурова', short: 'П. Верхотурова', role: 'Мать Алины', kind: 'witness',
    line: 'Получила голосовое сообщение дочери в 03:12.',
    facts: ['68 лет', 'Живёт в Заречье', 'Не слышит на левое ухо'],
    look: { skin: 0, hair: '#d9d6d2', hairStyle: 'curly', shirt: '#6b4a73', collar: 'cardigan', age: 68, face: 1.02, eyes: '#6a7a8a', bg: 300 },
  },
  {
    id: 'nurova', name: 'Анастасия Нурова', short: 'А. Нурова', role: 'Цифровой криминалист', kind: 'expert',
    line: 'Извлекает данные из устройств и аудио.',
    facts: ['38 лет', 'Лаборатория компьютерной экспертизы'],
    look: { skin: 2, hair: '#1b1816', hairStyle: 'bun', glasses: 'round', shirt: '#e8e6e0', collar: 'blazer', age: 38, face: 0.98, eyes: '#2a2a2a', bg: 200 },
  },
  {
    id: 'liza', name: 'Лиза Дёмина', short: 'Л. Дёмина', role: 'Пропала 14 февраля 2009 года', kind: 'archive',
    line: 'Звонила в «Ночной собеседник». Дело закрыто как «добровольный уход».',
    facts: ['17 лет', 'Сестра — Марина Кольцова (урожд. Дёмина)'],
    look: { skin: 0, hair: '#7a5a3a', hairStyle: 'long2', shirt: '#7a4a4a', collar: 'tee', age: 17, face: 0.95, eyes: '#6a5a4a', bg: 20, vintage: true },
  },
  {
    id: 'irina', name: 'Ирина Бойко', short: 'И. Бойко', role: 'Пропала в марте 2014 года, найдена в 2015', kind: 'archive',
    line: 'Тело найдено в озере. Версия — самоубийство.',
    facts: ['29 лет', 'Работала фельдшером'],
    look: { skin: 1, hair: '#2a1f1a', hairStyle: 'bob', shirt: '#3a5a6a', collar: 'tee', age: 29, face: 1, eyes: '#3a2a20', bg: 200, vintage: true },
  },
  {
    id: 'kseniya', name: 'Ксения Лаврова', short: 'К. Лаврова', role: 'Пропала в ноябре 2019 года', kind: 'archive',
    line: 'Уехала «начинать новую жизнь» и больше не выходила на связь.',
    facts: ['24 года', 'Студентка заочного отделения'],
    look: { skin: 1, hair: '#a05a2a', hairStyle: 'long', shirt: '#5a6a4a', collar: 'tee', age: 24, face: 0.97, eyes: '#4a6a4a', bg: 120, vintage: true },
  },
];

export const P2: Record<string, Person> = Object.fromEntries(PEOPLE2.map((p) => [p.id, p]));
