import { useEffect } from 'react';
import type { ReactNode } from 'react';

export function Modal({ title, onClose, children, wide }: { title: string; onClose: () => void; children: ReactNode; wide?: boolean }) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);
  return (
    <div className="c3-back" onMouseDown={onClose}>
      <div className={'c3-modal' + (wide ? ' wide' : '')} role="dialog" aria-modal="true" aria-label={title} onMouseDown={(e) => e.stopPropagation()}>
        <div className="c3-modal-h"><h3>{title}</h3><button className="c3-x" onClick={onClose} aria-label="Закрыть">×</button></div>
        <div className="c3-modal-b">{children}</div>
      </div>
    </div>
  );
}

export const TONE_RU: Record<string, string> = {
  calm: 'спокойно', guarded: 'осторожно', evasive: 'уходит от ответа', tense: 'напряжённо', irritated: 'раздражённо', sad: 'подавленно', open: 'открыто', counter: 'встречный вопрос',
};
