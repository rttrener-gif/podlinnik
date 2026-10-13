import type { Block, Doc } from '../types';
import { useGame } from '../game/store';
import { Art } from './Art';

export function Rich({ text }: { text: string }) {
  const parts = text.split(/(\*[^*]+\*)/g);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith('*') && p.endsWith('*') && p.length > 2 ? (
          <em className="stage" key={i}>
            {p.slice(1, -1)}
          </em>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  );
}

function PinBtn({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      className={'pin-btn' + (on ? ' on' : '')}
      title={on ? 'Снять отметку' : 'Отметить как важный факт'}
      aria-label={on ? 'Снять отметку' : 'Отметить как важный факт'}
      onClick={onClick}
    >
      <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
        <path d="M7 1l1.8 3.7 4 .6-2.9 2.8.7 4L7 10.2 3.4 12l.7-4L1.2 5.3l4-.6z" fill={on ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

export function DocView({ doc }: { doc: Doc }) {
  const { state, pin, unpin } = useGame();
  const pinned = (text: string) => state.pins.find((p) => p.docId === doc.id && p.text === text);
  const toggle = (text: string) => {
    const p = pinned(text);
    if (p) unpin(p.id);
    else pin(doc.id, text);
  };

  const renderBlock = (b: Block, i: number) => {
    switch (b.t) {
      case 'h':
        return (
          <h3 className="d-h" key={i}>
            {b.text}
          </h3>
        );
      case 'p': {
        const on = !!pinned(b.text);
        return (
          <div className={'pinrow' + (on ? ' pinned' : '')} key={i}>
            <p className="d-p">{b.text}</p>
            <PinBtn on={on} onClick={() => toggle(b.text)} />
          </div>
        );
      }
      case 'meta':
        return (
          <dl className="d-meta" key={i}>
            {b.rows.map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        );
      case 'list':
        return (
          <ul className="d-list" key={i}>
            {b.items.map((it, j) => {
              const on = !!pinned(it);
              return (
                <li className={'pinrow' + (on ? ' pinned' : '')} key={j}>
                  <span>{it}</span>
                  <PinBtn on={on} onClick={() => toggle(it)} />
                </li>
              );
            })}
          </ul>
        );
      case 'table':
        return (
          <div className="d-table-wrap" key={i}>
            {b.caption && <div className="d-caption">{b.caption}</div>}
            <table className="d-table">
              <thead>
                <tr>
                  {b.head.map((h, j) => (
                    <th key={j}>{h}</th>
                  ))}
                  <th className="pincol" aria-label="Факт" />
                </tr>
              </thead>
              <tbody>
                {b.rows.map((r, j) => {
                  const txt = r.map((c, k) => `${b.head[k]}: ${c}`).join(' · ');
                  const on = !!pinned(txt);
                  return (
                    <tr key={j} className={on ? 'pinned' : ''}>
                      {r.map((c, k) => (
                        <td key={k}>{c}</td>
                      ))}
                      <td className="pincol">
                        <PinBtn on={on} onClick={() => toggle(txt)} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      case 'msg': {
        const txt = `${b.who}, ${b.time}: ${b.text}`;
        const on = !!pinned(txt);
        return (
          <div className={'msg ' + (b.side === 'r' ? 'r' : 'l') + (on ? ' pinned' : '')} key={i}>
            <div className="bubble">
              <div className="who">{b.who}</div>
              <div className="txt">{b.text}</div>
              <div className="tm">{b.time}</div>
            </div>
            <PinBtn on={on} onClick={() => toggle(txt)} />
          </div>
        );
      }
      case 'day':
        return (
          <div className="d-day" key={i}>
            <span>{b.text}</span>
          </div>
        );
      case 'qa': {
        const txt = `Вопрос: ${b.q} Ответ: ${b.a}`;
        const on = !!pinned(txt);
        return (
          <div className={'qa pinrow' + (on ? ' pinned' : '')} key={i}>
            <div>
              <p className="q">
                <b>Вопрос.</b> {b.q}
              </p>
              <p className="a">
                <b>Ответ.</b> {b.a}
              </p>
            </div>
            <PinBtn on={on} onClick={() => toggle(txt)} />
          </div>
        );
      }
      case 'line': {
        const txt = `${b.who}: ${b.text}`;
        const on = !!pinned(txt);
        return (
          <div className={'tline pinrow' + (on ? ' pinned' : '')} key={i}>
            <div>
              <span className="tw">{b.who.toUpperCase()}:</span> {b.text}
            </div>
            <PinBtn on={on} onClick={() => toggle(txt)} />
          </div>
        );
      }
      case 'quote': {
        const on = !!pinned(b.text);
        return (
          <blockquote className={'d-quote pinrow' + (on ? ' pinned' : '')} key={i}>
            <div>
              {b.text}
              {b.by && <cite>{b.by}</cite>}
            </div>
            <PinBtn on={on} onClick={() => toggle(b.text)} />
          </blockquote>
        );
      }
      case 'stamp':
        return (
          <div className="d-stamp" key={i}>
            {b.text}
          </div>
        );
      case 'sign':
        return (
          <div className="d-sign" key={i}>
            {b.rows.map((r, j) => (
              <div key={j}>
                <span className="sigline" /> {r}
              </div>
            ))}
          </div>
        );
      case 'art':
        return (
          <figure className={'d-art art-' + b.id} key={i}>
            <div className="art-frame">
              <Art id={b.id} />
            </div>
            <figcaption>{b.caption}</figcaption>
          </figure>
        );
      case 'note':
        return (
          <div className="d-note" key={i}>
            {b.text}
          </div>
        );
      case 'receipt':
        return (
          <div className="receipt" key={i}>
            <div className="r-shop">{b.shop}</div>
            <div className="r-sep" />
            {b.lines.map(([n, p], j) => (
              <div className="r-line" key={j}>
                <span>{n}</span>
                <span>{p}</span>
              </div>
            ))}
            <div className="r-sep" />
            <div className="r-line total">
              <span>ИТОГО</span>
              <span>{b.total}</span>
            </div>
            {b.foot?.map((f, j) => (
              <div className="r-foot" key={j}>
                {f}
              </div>
            ))}
          </div>
        );
      case 'sep':
        return <hr className="d-sep" key={i} />;
    }
  };

  return (
    <article className={`paper kind-${doc.kind}`}>
      <header className="paper-head">
        <div className="ph-meta">
          <span>{doc.source}</span>
          <span>{doc.date}</span>
        </div>
        <h2 className="paper-title">{doc.title}</h2>
        {doc.subtitle && <div className="paper-sub">{doc.subtitle}</div>}
      </header>
      <div className="paper-body">{doc.blocks.map(renderBlock)}</div>
      <div className="paper-foot">Материал дела № 24-0417 · {doc.group}</div>
    </article>
  );
}
