import { useState } from 'react';
import { App } from './App';
import { GameProvider } from './game/store';
import { Case2App } from './case2/Case2App';
import { CoverArt } from './components/Art';
import { SceneArt } from './case2/art/Scenes';

type Sel = 'select' | 'case1' | 'case2';

function status(key: string, kind: 1 | 2): string {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return 'Не начато';
    const d = JSON.parse(raw);
    if (!d.started) return 'Не начато';
    if (d.solved) return 'Дело раскрыто';
    if (d.revealed) return 'Решение показано';
    return kind === 1 ? `В процессе · материалов: ${d.unlocked?.length ?? 0}+15` : `В процессе · улик: ${d.ev?.length ?? 0}`;
  } catch { return 'Не начато'; }
}

export function Root() {
  const [sel, setSel] = useState<Sel>(() => {
    try { return (sessionStorage.getItem('podlinnik.sel') as Sel) || 'select'; } catch { return 'select'; }
  });
  const go = (s: Sel) => { setSel(s); try { sessionStorage.setItem('podlinnik.sel', s); } catch { /* */ } };

  if (sel === 'case1') return <GameProvider><App onExit={() => go('select')} /></GameProvider>;
  if (sel === 'case2') return <Case2App onExit={() => go('select')} />;

  return (
    <div className="hub-select">
      <header>
        <div className="hs-eyebrow">СЛЕДСТВЕННЫЕ ДЕЛА</div>
        <h1>Выберите расследование</h1>
        <p>Каждое дело — отдельная история со своим сохранением. Прогресс не пересекается.</p>
      </header>
      <div className="hs-cards">
        <button className="hs-card" onClick={() => go('case1')}>
          <div className="hs-art"><CoverArt /></div>
          <div className="hs-body">
            <span className="hs-no">Дело № 24-0417</span>
            <h2>ПОДЛИННИК</h2>
            <p>Смерть коллекционера на Рыбачьем мысу. Документы, допросы, экспертизы, обвинение. Классическое расследование за столом.</p>
            <span className="hs-status">{status('podlinnik.save.v1', 1)}</span>
          </div>
        </button>
        <button className="hs-card hs-card2" onClick={() => go('case2')}>
          <div className="hs-art"><SceneArt id="studio" /></div>
          <div className="hs-body">
            <span className="hs-no">Дело № 25-0214 · новое</span>
            <h2>ТИХО-ТИХО</h2>
            <p>Исчезновение из запертой студии. Фотографии, камеры, телефон, голоса, инсайты, подсказки и реконструкция.</p>
            <span className="hs-status">{status('tikho.case2.save.v1', 2)}</span>
          </div>
        </button>
      </div>
    </div>
  );
}
