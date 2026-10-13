import { useState } from 'react';
import { useGame } from '../game/store';
import { CASE } from '../content';
import { CoverArt } from './Art';
import { Confirm } from './common';

export function Cover({ onEnter, onExit }: { onEnter: () => void; onExit?: () => void }) {
  const { state, start, reset, progress } = useGame();
  const [confirm, setConfirm] = useState(false);

  const status = state.solved
    ? 'Дело раскрыто'
    : state.revealed
      ? 'Решение показано'
      : state.started
        ? `Расследование идёт · материалов получено: ${progress} %`
        : 'Расследование не начато';

  return (
    <div className="cover">
      <div className="cover-left">
        <div className="cover-eyebrow">СЛЕДСТВЕННЫЙ ОТДЕЛ ПО Г. ЛАДВИН · ДЕЛО № {CASE.number}</div>
        <h1 className="cover-title">{CASE.title}</h1>
        <div className="cover-sub">{CASE.subtitle}</div>
        <div className="cover-rule" />
        <p className="cover-text">
          Утро 9 ноября. В кабинете собственного дома на берегу озера обнаружен мёртвым Станислав Данилевский — коллекционер, владелец
          галереи, хозяин вчерашнего юбилейного ужина. Врач в один голос с домашними говорит: несчастный случай. Лестница на галерею давно
          шаталась, а гость за столом выпил лишнего.
        </p>
        <p className="cover-text">
          Вам передали материалы проверки. Допросите тех, кто был в доме, сверьте показания с документами и данными, найдите то, что
          противоречит удобной версии. Всё, что нужно для вывода, есть в материалах дела. Ничего не придётся искать за его пределами.
        </p>

        <div className="cover-status">
          <span className={'dot ' + (state.solved ? 'ok' : state.started ? 'run' : '')} />
          {status}
        </div>

        <div className="cover-actions">
          <button
            className="btn primary big"
            onClick={() => {
              start();
              onEnter();
            }}
          >
            {state.started ? 'Продолжить расследование' : 'Начать расследование'}
          </button>
          {onExit && (
            <button className="btn ghost" onClick={onExit}>
              ← К выбору дела
            </button>
          )}
          {state.started && (
            <button className="btn ghost" onClick={() => setConfirm(true)}>
              Начать дело заново
            </button>
          )}
        </div>

        <div className="cover-warn">
          <strong>Предупреждение о содержании.</strong> В материалах описаны насильственная смерть, алкогольная зависимость, семейное
          насилие слов и поступков, оставление человека в беде. Все персонажи, организации и события вымышлены; совпадения с реальными
          людьми случайны. Прогресс сохраняется в вашем браузере.
        </div>
      </div>
      <div className="cover-right">
        <div className="folder">
          <CoverArt />
          <div className="folder-stamp">ДЕЛО № {CASE.number}</div>
          <div className="folder-tab">СМЕРТЬ НА РЫБАЧЬЕМ МЫСУ · 8–9.11.2024</div>
        </div>
      </div>

      {confirm && (
        <Confirm
          title="Начать дело заново?"
          text="Весь прогресс будет стёрт: изученные материалы, допросы, заметки, доска, версии и обвинения. Это действие нельзя отменить."
          ok="Стереть и начать заново"
          danger
          onCancel={() => setConfirm(false)}
          onOk={() => {
            reset();
            setConfirm(false);
          }}
        />
      )}
    </div>
  );
}
