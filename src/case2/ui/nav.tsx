import { createContext, useContext } from 'react';

export type Screen = 'hub' | 'places' | 'place' | 'evidence' | 'phone' | 'cctv' | 'spectro' | 'people' | 'interview' | 'requests' | 'board' | 'timeline' | 'insights' | 'finale' | 'messages' | 'notes';

export interface Nav2 {
  screen: Screen;
  param: string | null;
  go: (s: Screen, param?: string | null) => void;
  openEv: (id: string) => void;
  hint: () => void;
  exit: () => void;
}
export const NavCtx2 = createContext<Nav2 | null>(null);
export const useNav2 = () => {
  const n = useContext(NavCtx2);
  if (!n) throw new Error('nav2');
  return n;
};
