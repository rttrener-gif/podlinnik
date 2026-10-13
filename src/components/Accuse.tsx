import { useEffect, useState } from 'react';
import { CLAIMS, DOC_BY_ID, ENTRY_OPTIONS, METHOD_OPTIONS, MOMENT_OPTIONS, MOTIVE_OPTIONS, PEOPLE } from '../content';
import { useGame } from '../game/store';
import type { FinalCheck } from '../game/store';
import type { Accusation, Block, Doc } from '../types';
import { Confirm, DocPicker, fmtTime } from './common';
import { DocView } from './DocView';

const MAX_EVIDENCE = 8;

export function Accuse() {
  const { state, accuse, reveal, cond } = useGame();
  const [form, setForm] = useState<Accusation>({
    suspect: '',
    method: '',
    entry: '',
    moment: '',
    motive: '',
    evidence: [],
    lies: [],
  });
  const [picker, setPicker] = useState(false);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<FinalCheck | null>(null);
  const [confirmReveal, setConfirmReveal] = useState(false);
  const [confirmSubmit, setConfirmSubmit] = useState(false);

  const done = state.solved || state.revealed;
  const claims = CLAIMS.filter((c) => cond(c.req));
  const complete = form.suspect && form.method && form.entry && form.moment && form.motive && form.evidence.length > 0;

  const set = <K extends keyof Accusation>(k: K, v: Accusation[K]) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async () => {
    setBusy(true);
    try {
      const r = await accuse(form);
      setResult(r);
    } finally {
      setBusy(false);
      setConfirmSubmit(false);
    }
  };

  return (
    <div className="page">
      <div className="pane-head">
        <h2>Обвинение</h2>
        <div className="sub">
          Финальный шаг. Выберите, кто, как и почему, и представьте доказательства. Если версия не подтвердится, расследование можно продолжить.
        </div>
      </div>

      {state.attempts.length > 0 && !done && (
        <div className="card attempts">
          Попыток обвинения: <b>{state.attempts.length}</b>. Последняя: {fmtTime(state.attempts[state.attempts.length - 1].at)}.
        </div>
      )}

      {state.solved && result && <ResultPanel r={result} />}
      {done && <Solution solved={state.solved} />}

      {!done && (
        <>
          <Section n={1} title="Кто совершил преступление">
            <div className="radio-grid">
              {PEOPLE.filter((p) => p.group !== 'victim' && p.id !== 'elena').map((p) => (
                <label key={p.id} className={'radio-card' + (form.suspect === p.id ? ' on' : '')}>
                  <input type="radio" name="suspect" checked={form.suspect === p.id} onChange={() => set('suspect', p.id)} />
                  <span className="rc-title">{p.name}</span>
                  <span className="rc-sub">{p.role}</span>
                </label>
              ))}
            </div>
          </Section>

          <Section n={2} title="Как оно было совершено">
            <Options name="method" list={METHOD_OPTIONS} value={form.method} onChange={(v) => set('method', v)} />
          </Section>

          <Section n={3} title="Когда произошло нападение">
            <Options name="moment" list={MOMENT_OPTIONS} value={form.moment} onChange={(v) => set('moment', v)} />
          </Section>

          <Section n={4} title="Как преступник попал на место происшествия">
            <Options name="entry" list={ENTRY_OPTIONS} value={form.entry} onChange={(v) => set('entry', v)} />
          </Section>

          <Section n={5} title="Мотив">
            <Options name="motive" list={MOTIVE_OPTIONS} value={form.motive} onChange={(v) => set('motive', v)} />
          </Section>

          <Section n={6} title={`Доказательства (до ${MAX_EVIDENCE} материалов)`}>
            <div className="chips">
              {form.evidence.map((e) => (
                <span key={e} className="chip static">
                  {DOC_BY_ID[e]?.title}
                </span>
              ))}
              {form.evidence.length === 0 && <span className="muted">Пока ничего не выбрано.</span>}
            </div>
            <button className="btn" onClick={() => setPicker(true)}>
              Выбрать материалы…
            </button>
            <p className="muted small">Выбирайте только то, что действительно доказывает выдвинутую версию. Лишнее мешает убедительности.</p>
          </Section>

          <Section n={7} title="Какие из показаний и алиби оказались ложными">
            <div className="claims">
              {claims.map((c) => (
                <label key={c.id} className={'claim' + (form.lies.includes(c.id) ? ' on' : '')}>
                  <input
                    type="checkbox"
                    checked={form.lies.includes(c.id)}
                    onChange={() =>
                      set('lies', form.lies.includes(c.id) ? form.lies.filter((x) => x !== c.id) : [...form.lies, c.id])
                    }
                  />
                  <span>{c.text}</span>
                </label>
              ))}
            </div>
            <p className="muted small">
              Список пополняется по мере допросов. Отметьте только те утверждения, ложность которых вы можете доказать материалами дела.
            </p>
          </Section>

          <div className="row wrap end sticky-actions">
            <button className="btn ghost danger" onClick={() => setConfirmReveal(true)}>
              Я сдаюсь: показать решение
            </button>
            <button className="btn primary big" disabled={!complete || busy} onClick={() => setConfirmSubmit(true)}>
              Подать обвинение
            </button>
          </div>
        </>
      )}

      {result && !done && <ResultPanel r={result} />}

      {picker && (
        <DocPicker
          title="Доказательства обвинения"
          multi
          selected={form.evidence}
          onToggle={(id) =>
            set(
              'evidence',
              form.evidence.includes(id)
                ? form.evidence.filter((x) => x !== id)
                : form.evidence.length < MAX_EVIDENCE
                  ? [...form.evidence, id]
                  : form.evidence,
            )
          }
          onClose={() => setPicker(false)}
        />
      )}

      {confirmReveal && (
        <Confirm
          title="Показать решение дела?"
          text="Вы увидите полную хронологию и разгадку. Расследование будет считаться завершённым без вашего обвинения. Это действие нельзя отменить (кроме начала дела заново)."
          ok="Показать решение"
          danger
          onCancel={() => setConfirmReveal(false)}
          onOk={() => {
            reveal();
            setConfirmReveal(false);
          }}
        />
      )}
      {confirmSubmit && (
        <Confirm
          title="Подать обвинение?"
          text="Проверьте выбор. Если версия верна, дело будет считаться раскрытым. Если нет, вы получите указания, что именно не подтверждается, и сможете продолжить."
          ok="Подать"
          onCancel={() => setConfirmSubmit(false)}
          onOk={submit}
        />
      )}
    </div>
  );
}

function Section({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section className="acc-sec">
      <h3>
        <span className="num">{n}</span>
        {title}
      </h3>
      {children}
    </section>
  );
}

function Options({
  name,
  list,
  value,
  onChange,
}: {
  name: string;
  list: { id: string; text: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="options">
      {list.map((o) => (
        <label key={o.id} className={'option' + (value === o.id ? ' on' : '')}>
          <input type="radio" name={name} checked={value === o.id} onChange={() => onChange(o.id)} />
          <span>{o.text}</span>
        </label>
      ))}
    </div>
  );
}

function ResultPanel({ r }: { r: FinalCheck }) {
  return (
    <div className={'result ' + r.verdict}>
      <h3>{r.headline}</h3>
      <p>{r.message}</p>
      <ul className="res-list">
        {r.sections.map((s) => (
          <li key={s.key} className={s.ok ? 'ok' : 'bad'}>
            <span className="res-mark">{s.ok ? '✓' : '✕'}</span>
            <span>
              <b>{s.label}.</b> {s.note}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Solution({ solved }: { solved: boolean }) {
  const [data, setData] = useState<{ intro: string; blocks: Block[] } | null>(null);
  useEffect(() => {
    let alive = true;
    import('../content/solution').then((m) => {
      if (alive) setData({ intro: m.SOLUTION_INTRO, blocks: m.SOLUTION_BLOCKS });
    });
    return () => {
      alive = false;
    };
  }, []);
  if (!data) return <div className="card">Загрузка материалов дела…</div>;
  const doc: Doc = {
    id: 'solution',
    title: 'Решение дела № 24-0417',
    subtitle: solved ? 'Обвинение подтверждено материалами' : 'Показано по запросу следователя',
    kind: 'report',
    group: 'Экспертизы',
    date: 'итоговый документ',
    source: 'Следственный отдел по г. Ладвин',
    blocks: [{ t: 'stamp', text: solved ? 'ДЕЛО РАСКРЫТО' : 'ДЕЛО ЗАВЕРШЕНО' }, { t: 'p', text: data.intro }, ...data.blocks],
  };
  return (
    <div className="solution">
      <DocView doc={doc} />
    </div>
  );
}
