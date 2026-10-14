import { EV3A } from './evidence';
import { EV3B } from './evidence2';
import type { Ev3 } from '../types';

export const EVIDENCE3: Ev3[] = [...EV3A, ...EV3B];
export const EV3: Record<string, Ev3> = Object.fromEntries(EVIDENCE3.map((e) => [e.id, e]));
export const START3 = ['complaint', 'death-cert', 'chart', 'night-journal', 'floor-plan', 'inspection-214', 'tablet-photo', 'st-laptev', 'st-rakhimov', 'st-orekhova', 'st-shatrov', 'st-gromova', 'st-kravtsov'];
