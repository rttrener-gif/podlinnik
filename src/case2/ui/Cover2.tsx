import { useState } from 'react';
import { Portrait } from '../art/Portrait';
import { SceneArt } from '../art/Scenes';
import { Modal } from './Common';
import { useC2 } from '../state';

export function CoverCase2({ started, onStart, onExit, onReset }: { started: boolean; onStart: () => void; onExit: () => void; onReset: () => void }) {
  const [conf, setConf] = useState(false);
  const { s, progress } = useC2();
  return (
    <div className="c2-cover">
      <div className="c2-cover-art"><SceneArt id="studio" /><div className="c2-cover-shade" /></div>
      <div className="c2-cover-body">
        <div className="c2-eyebrow">СЛЕДСТВЕННЫЙ ОТДЕЛ ПО Г. ТИХОЯРСК · ДЕЛО № 25-0214</div>
        <h1 className="c2-title">ТИХО-ТИХО</h1>
        <div className="c2-sub">Исчезновение из запертой студии</div>
        <p className="c2-lead">В ночь на 15 февраля звукорежиссёр Алина Верхотурова вошла в здание радиоузла и не вышла. Дверь заперта изнутри, окно запечатано, камера у входа видит только вход. В 03:12 трое близких получили от неё сообщения. Её голос услышал сторож — из пустой комнаты.</p>
        <div className="c2-portraits">{['alina', 'denis', 'marina', 'sedykh'].map((id) => <Portrait key={id} id={id} />)}</div>
        <p className="c2-status">{s.solved ? 'Дело раскрыто' : s.revealed ? 'Решение показано' : started ? `Расследование идёт · материалов получено: ${progress}%` : 'Расследование не начато'}</p>
        <div className="c2-row wrap">
          <button className="c2-btn primary big" onClick={onStart}>{started ? 'Продолжить' : 'Начать расследование'}</button>
          <button className="c2-btn ghost" onClick={onExit}>К выбору дела</button>
          {started && <button className="c2-btn ghost" onClick={() => setConf(true)}>Начать дело заново</button>}
        </div>
        <p className="c2-warn"><b>Предупреждение.</b> В деле есть психологическое насилие, манипуляция, исчезновения и смерть. Все персонажи вымышлены. Звук включается только после вашего первого действия; в игре есть спокойный режим без акцентов.</p>
      </div>
      {conf && (
        <Modal title="Начать дело заново?" onClose={() => setConf(false)}>
          <p>Прогресс только этого дела будет стёрт. Первое дело не затрагивается.</p>
          <div className="c2-row end"><button className="c2-btn ghost" onClick={() => setConf(false)}>Отмена</button><button className="c2-btn danger" onClick={() => { onReset(); setConf(false); }}>Стереть</button></div>
        </Modal>
      )}
    </div>
  );
}
