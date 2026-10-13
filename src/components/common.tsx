import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { ALL_DOCS, DOC_BY_ID, PEOPLE, PEOPLE_BY_ID } from '../content';
import { useGame } from '../game/store';
import type { Doc } from '../types';

// ---- навигация ----
export type ViewId =
  | 'materials'
  | 'people'
  | 'requests'
  | 'board'
  | 'timeline'
  | 'versions'
  | 'notes'
  | 'journal'
  | 'accuse';

interface NavApi {
  view: ViewId;
  go: (v: ViewId) => void;
  docId: string | null;
  openDoc: (id: string | null) => void;
  personId: string | null;
  openPerson: (id: string | null) => void;
}
export const NavCtx = createContext<NavApi | null>(null);
export const useNav = () => {
  const n = useContext(NavCtx);
  if (!n) throw new Error('Nav missing');
  return n;
};

// ---- мелкие компоненты ----
export function Avatar({ id, size = 44 }: { id: string; size?: number }) {
  const p = PEOPLE_BY_ID[id];
  const hue = p?.hue ?? 0;
  return (
    <div
      className="avatar"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.38,
        background: `linear-gradient(145deg, hsl(${hue} 22% 30%), hsl(${hue} 18% 14%))`,
        borderColor: `hsl(${hue} 30% 45%)`,
      }}
      aria-hidden="true"
    >
      {p?.initials ?? '?'}
    </div>
  );
}

export function Modal({ title, onClose, children, wide }: { title: string; onClose: () => void; children: ReactNode; wide?: boolean }) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);
  return (
    <div className="modal-back" onMouseDown={onClose}>
      <div className={'modal' + (wide ? ' wide' : '')} role="dialog" aria-modal="true" aria-label={title} onMouseDown={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h3>{title}</h3>
          <button className="icon-btn" onClick={onClose} aria-label="Закрыть">
            ×
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}

export function Confirm({
  title,
  text,
  ok,
  danger,
  onOk,
  onCancel,
}: {
  title: string;
  text: string;
  ok: string;
  danger?: boolean;
  onOk: () => void;
  onCancel: () => void;
}) {
  return (
    <Modal title={title} onClose={onCancel}>
      <p className="confirm-text">{text}</p>
      <div className="row end">
        <button className="btn ghost" onClick={onCancel}>
          Отмена
        </button>
        <button className={'btn ' + (danger ? 'danger' : 'primary')} onClick={onOk}>
          {ok}
        </button>
      </div>
    </Modal>
  );
}

export function DocPicker({
  title,
  onPick,
  onClose,
  mark,
  multi,
  selected,
  onToggle,
}: {
  title: string;
  onPick?: (id: string) => void;
  onClose: () => void;
  mark?: string[];
  multi?: boolean;
  selected?: string[];
  onToggle?: (id: string) => void;
}) {
  const { has } = useGame();
  const [q, setQ] = useState('');
  const docs = useMemo(() => ALL_DOCS.filter((d) => has(d.id)), [has]);
  const filtered = docs.filter((d) => (d.title + ' ' + (d.subtitle ?? '')).toLowerCase().includes(q.toLowerCase()));
  const groups = Array.from(new Set(filtered.map((d) => d.group)));
  return (
    <Modal title={title} onClose={onClose} wide>
      <input className="inp" placeholder="Поиск по названию…" value={q} onChange={(e) => setQ(e.target.value)} />
      <div className="picker-list">
        {groups.map((g) => (
          <div key={g}>
            <div className="picker-group">{g}</div>
            {filtered
              .filter((d) => d.group === g)
              .map((d) => {
                const sel = selected?.includes(d.id);
                return (
                  <button
                    key={d.id}
                    className={'picker-item' + (sel ? ' sel' : '')}
                    onClick={() => {
                      if (multi) onToggle?.(d.id);
                      else {
                        onPick?.(d.id);
                        onClose();
                      }
                    }}
                  >
                    <span className="pi-title">{d.title}</span>
                    {d.subtitle && <span className="pi-sub">{d.subtitle}</span>}
                    <span className="pi-meta">
                      {d.date}
                      {mark?.includes(d.id) ? ' · уже предъявлялось' : ''}
                      {sel ? ' · выбрано' : ''}
                    </span>
                  </button>
                );
              })}
          </div>
        ))}
        {filtered.length === 0 && <p className="muted">Ничего не найдено.</p>}
      </div>
      {multi && (
        <div className="row end">
          <button className="btn primary" onClick={onClose}>
            Готово
          </button>
        </div>
      )}
    </Modal>
  );
}

export function useVisiblePeople() {
  const { has } = useGame();
  return useMemo(() => PEOPLE.filter((p) => p.id !== 'elena' || has('elena-1')), [has]);
}

export function docTitle(id: string): string {
  return DOC_BY_ID[id]?.title ?? id;
}

export function DocChip({ id, onClick }: { id: string; onClick?: () => void }) {
  const { openDoc } = useNav();
  const d: Doc | undefined = DOC_BY_ID[id];
  if (!d) return null;
  return (
    <button className="chip doc" onClick={onClick ?? (() => openDoc(id))} title={d.title}>
      {d.title}
    </button>
  );
}

export function fmtTime(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
}

export const KIND_LABEL: Record<string, string> = {
  protocol: 'Протокол',
  statement: 'Показания',
  report: 'Заключение',
  chat: 'Переписка',
  email: 'Письмо',
  transcript: 'Аудио',
  table: 'Данные',
  photo: 'Фото',
  plan: 'Схема',
  receipt: 'Чек',
  handwritten: 'Рукопись',
  screen: 'Файл',
  letter: 'Письмо',
};
