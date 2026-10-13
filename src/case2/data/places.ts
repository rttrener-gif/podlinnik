import type { Place } from '../types';

// Координаты зон — в системе 1000 × 560 внутри иллюстрации сцены.
export const PLACES: Place[] = [
  {
    id: 'studio', name: 'Студия 2.07', sub: 'Радиоузел № 7, 2 этаж', scene: 'studio', x: 52, y: 30,
    spots: [
      { id: 's-door', label: 'Дверь студии', x: 30, y: 90, w: 170, h: 380, ev: 'door-bolt', plain: '' },
      { id: 's-lamp', label: 'Лампа над дверью', x: 40, y: 20, w: 150, h: 70, ev: 'lamp', plain: '' },
      { id: 's-window', label: 'Окно', x: 770, y: 80, w: 200, h: 260, ev: 'window-seal', plain: '' },
      { id: 's-calendar', label: 'Календарь', x: 560, y: 60, w: 120, h: 150, ev: 'calendar', plain: '' },
      { id: 's-panel', label: 'Акустический щит', x: 230, y: 110, w: 250, h: 230, ev: 'panel', when: ['ins:closed'], plain: 'Обычная акустическая панель. Пока нет причин осматривать её отдельно.' },
      { id: 's-console', label: 'Микшерный пульт', x: 270, y: 350, w: 300, h: 110, ev: 'console', when: ['req:r-studio'], plain: 'Пульт выглядит обычно: индикаторы погашены. Нужен осмотр специалиста.' },
      { id: 's-phone', label: 'Телефон', x: 610, y: 390, w: 80, h: 70, ev: 'phone-alina', plain: '' },
      { id: 's-notebook', label: 'Тетрадь', x: 700, y: 400, w: 110, h: 70, ev: 'notebook', plain: '' },
      { id: 's-laptop', label: 'Ноутбук', x: 480, y: 390, w: 110, h: 70, ev: 'laptop-alina', plain: '' },
    ],
  },
  {
    id: 'building', name: 'Здание радиоузла', sub: 'Коридор, подвал, технический тоннель', scene: 'building', x: 40, y: 56,
    spots: [
      { id: 'b-rec', label: 'Регистратор камер', x: 60, y: 280, w: 170, h: 130, ev: 'cam2', when: ['req:r-cam2'], plain: 'Регистратор частной камеры. Запись выдаётся только по запросу владельцу — радиостанции.' },
      { id: 'b-door', label: 'Дверь в подвал', x: 410, y: 180, w: 170, h: 320, ev: 'basement-lock', when: ['ev:panel'], plain: 'Дверь в подвал, закрыта. Пока нет причин осматривать подвал.' },
      { id: 'b-tunnel', label: 'Технический тоннель', x: 690, y: 240, w: 260, h: 240, ev: 'tunnel', when: ['ev:basement-lock'], plain: 'Подвал. Дальше — темнота. Нужно сначала разобраться с запором.' },
    ],
  },
  {
    id: 'home', name: 'Квартира Алины', sub: 'ул. Заводская, 12', scene: 'home', x: 22, y: 34,
    spots: [
      { id: 'h-wall', label: 'Стена с вырезками', x: 60, y: 60, w: 430, h: 290, ev: 'clippings', plain: '' },
      { id: 'h-wardrobe', label: 'Шкаф в прихожей', x: 600, y: 60, w: 220, h: 380, ev: 'wardrobe', plain: '' },
      { id: 'h-drawer', label: 'Ящик комода', x: 520, y: 380, w: 200, h: 130, ev: 'passport', plain: '' },
    ],
  },
  {
    id: 'school', name: 'Школа № 4', sub: 'Котельная и подвал', scene: 'school', x: 72, y: 62, when: ['ev:tunnel'],
    spots: [
      { id: 'sc-boiler', label: 'Журнал котельной', x: 90, y: 200, w: 270, h: 280, ev: 'boiler-log', when: ['req:r-school'], plain: 'Котельная школы. Чтобы увидеть журнал, нужно запросить его у администрации.' },
      { id: 'sc-keys', label: 'Доска ключей', x: 470, y: 120, w: 210, h: 220, ev: 'key-log', when: ['req:r-school'], plain: 'Доска ключей на вахте. Журнал выдачи — у завхоза; нужен запрос.' },
      { id: 'sc-11', label: 'Дверь № 11', x: 760, y: 150, w: 170, h: 330, plain: 'Дверь школьного радиоузла. Заперта. Без оснований вскрывать нельзя.' },
    ],
  },
  {
    id: 'station', name: 'Радиостанция «Волна-FM»', sub: 'Студии, архив', scene: 'station', x: 62, y: 74, when: ['req:r-station'],
    spots: [
      { id: 'st-studio2', label: 'Студия № 2', x: 70, y: 100, w: 300, h: 340, ev: 'studio2', plain: '' },
      { id: 'st-board', label: 'График на стене', x: 430, y: 70, w: 230, h: 180, ev: 'schedule', plain: '' },
      { id: 'st-shelf', label: 'Стеллаж с плёнками', x: 720, y: 90, w: 240, h: 380, ev: 'archive-tapes', plain: '' },
    ],
  },
  {
    id: 'dacha', name: 'Дача в Пригорье', sub: 'Обыск', scene: 'dacha', x: 84, y: 20, when: ['req:r-dacha'],
    spots: [
      { id: 'd-tapes', label: 'Стеллаж и монтажный стол', x: 80, y: 90, w: 450, h: 360, ev: 'dacha-tapes', plain: '' },
      { id: 'd-room', label: 'Дверь на втором этаже', x: 640, y: 90, w: 280, h: 380, ev: 'dacha-room', plain: '' },
    ],
  },
];
export const PLACE: Record<string, Place> = Object.fromEntries(PLACES.map((p) => [p.id, p]));
