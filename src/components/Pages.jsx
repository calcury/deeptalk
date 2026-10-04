import React, { useState } from 'react';
import { BookOpen, CircleHelp, Coins, Gauge, MessageCircle, Plus, Trash2 } from 'lucide-react';
import { MASTERY_GOAL, PEAK_MULTIPLIER, PEAK_WINDOWS, RATE_CACHE_HIT, RATE_INPUT, RATE_OUTPUT, currencies, focusWeight, isLearned, money, rateLabel } from '../lib/config.js';
import { beijingHour, isPeak, lastDays } from '../lib/utils.js';

export function Words({ words, addWord, removeWord, setWords }) {
  const [draft, setDraft] = useState('');
  const [context, setContext] = useState('');

  const submit = event => {
    event.preventDefault();
    if (!draft.trim()) return;
    addWord(draft, context);
    setDraft('');
    setContext('');
  };

  return (
    <section className="page-section">
      <div className="section-intro">
        <div>
          <p className="eyebrow">YOUR VOCABULARY</p>
          <h2>Words worth keeping.</h2>
          <p>A few words are offered to your partner each turn — the less you have used one, the more likely it comes up.</p>
        </div>
        <button className="outline-btn" onClick={() => setWords([])}>
          <Trash2 size={15} /> Clear all
        </button>
      </div>

      <form className="word-add" onSubmit={submit}>
        <input value={draft} onChange={e => setDraft(e.target.value)} placeholder="New word or phrase…" aria-label="New word" />
        <input value={context} onChange={e => setContext(e.target.value)} placeholder="Example sentence (optional)" aria-label="Example sentence" />
        <button type="submit" className="add-btn">
          <Plus size={15} /> Add
        </button>
      </form>

      {!words.length && <Empty icon={<BookOpen size={26} />} title="No words yet" text="Double-click any word in a chat, or add one above to start building your bank." />}

      <div className="word-list">
        {words.map(w => (
          <div className={'word-row' + (isLearned(w) ? ' learned' : '')} key={w.word}>
            <div className="word-row-head">
              <b>{w.word}</b>
              <span className="word-count">
                {w.count || 0}/{MASTERY_GOAL}
              </span>
              {isLearned(w) ? <span className="learned-tag">Learned</span> : <span className="weight-tag">weight {focusWeight(w)}</span>}
              <button className="icon-btn ghost tiny" onClick={() => removeWord(w.word)} aria-label={`Remove ${w.word}`}>
                <Trash2 size={14} />
              </button>
            </div>
            {w.context && <p className="word-context">“{w.context}”</p>}
            <div className="progress">
              <i style={{ width: `${Math.min(100, ((w.count || 0) / MASTERY_GOAL) * 100)}%` }} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Usage({ usage, setUsage, currency, setCurrency }) {
  const peak = isPeak();
  const hour = beijingHour();
  const multiplier = peak ? PEAK_MULTIPLIER : 1;
  const days = lastDays(7).map(day => ({ ...day, ...(usage.history?.[day.key] || {}) }));

  return (
    <section className="page-section">
      <div className="section-intro">
        <div>
          <p className="eyebrow">TRANSPARENCY FIRST</p>
          <h2>Usage &amp; pricing</h2>
          <p>Counted straight from DeepSeek usage: input, cached input and output tokens.</p>
        </div>
        <div className="intro-actions">
          <div className="segmented">
            {Object.entries(currencies).map(([code, value]) => (
              <button key={code} className={currency === code ? 'selected' : ''} onClick={() => setCurrency(code)}>
                {value.symbol} {code}
              </button>
            ))}
          </div>
          <button className="outline-btn" onClick={() => setUsage({ input: 0, output: 0, cacheHit: 0, requests: 0, cost: 0, history: {} })}>
            Reset usage
          </button>
        </div>
      </div>

      <div className="usage-hero">
        <div>
          <span>Estimated total</span>
          <strong>{money(usage.cost || 0, currency)}</strong>
          <small>
            This month · {currencies[currency]?.label || currency} ·{' '}
            <span className={'peak-tag' + (peak ? ' peak' : '')}>{peak ? 'peak hours ×2' : 'off-peak'} · Beijing {String(hour).padStart(2, '0')}:00</span>
          </small>
        </div>
        <div className="usage-stat">
          <Gauge size={19} />
          <b>{((usage.input || 0) + (usage.output || 0) + (usage.cacheHit || 0)).toLocaleString()}</b>
          <span>tokens</span>
        </div>
        <div className="usage-stat">
          <MessageCircle size={19} />
          <b>{usage.requests || 0}</b>
          <span>requests</span>
        </div>
      </div>

      <div className="table-card chart-card">
        <div className="table-title">
          <b>Last 7 days</b>
          <span>Daily spend · {currencies[currency]?.symbol}</span>
        </div>
        <UsageChart days={days} currency={currency} />
      </div>

      <div className="table-card">
        <div className="table-title">
          <b>Today</b>
          <span>
            Off-peak rates · peak window {PEAK_WINDOWS.map(([s, e]) => `${pad(s)}:00–${pad(e)}:00`).join(' & ')} Beijing charges ×{PEAK_MULTIPLIER}
          </span>
        </div>
        <div className="table-row head">
          <span>Metric</span>
          <span>Tokens</span>
          <span>Rate</span>
          <span>Cost</span>
        </div>
        <div className="table-row">
          <span>Input tokens</span>
          <span>{(usage.input || 0).toLocaleString()}</span>
          <span>{rateLabel(RATE_INPUT * multiplier, currency)}</span>
          <b>{money(((usage.input || 0) * RATE_INPUT * multiplier) / 1_000_000, currency)}</b>
        </div>
        <div className="table-row">
          <span>Cached input (hit)</span>
          <span>{(usage.cacheHit || 0).toLocaleString()}</span>
          <span>{rateLabel(RATE_CACHE_HIT * multiplier, currency)}</span>
          <b>{money(((usage.cacheHit || 0) * RATE_CACHE_HIT * multiplier) / 1_000_000, currency)}</b>
        </div>
        <div className="table-row">
          <span>Output tokens</span>
          <span>{(usage.output || 0).toLocaleString()}</span>
          <span>{rateLabel(RATE_OUTPUT * multiplier, currency)}</span>
          <b>{money(((usage.output || 0) * RATE_OUTPUT * multiplier) / 1_000_000, currency)}</b>
        </div>
      </div>

      <div className="note">
        <CircleHelp size={16} />
        <span>
          Rates are the DeepSeek published ones in CNY per 1M tokens (input 1, output 2, cache hit 0.02), doubled between{' '}
          <b>{PEAK_WINDOWS.map(([s, e]) => `${pad(s)}:00–${pad(e)}:00`).join(' and ')}</b> Beijing time. Set your provider and model in{' '}
          <b>Settings</b> — keys stay in your browser.
        </span>
      </div>
    </section>
  );
}

const pad = n => String(n).padStart(2, '0');

function UsageChart({ days, currency }) {
  const values = days.map(d => d.cost || 0);
  const max = Math.max(...values, 0);
  const hasData = max > 0;
  const width = 640;
  const height = 190;
  const padX = 34;
  const padTop = 16;
  const padBottom = 26;
  const plotW = width - padX * 2;
  const plotH = height - padTop - padBottom;
  const step = days.length > 1 ? plotW / (days.length - 1) : 0;

  const points = days.map((d, i) => {
    const x = padX + i * step;
    const y = padTop + plotH - (hasData ? ((d.cost || 0) / max) * plotH : plotH);
    return { x, y, ...d };
  });

  const line = points.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
  const area = `${line} L${points[points.length - 1].x.toFixed(1)} ${(padTop + plotH).toFixed(1)} L${points[0].x.toFixed(1)} ${(padTop + plotH).toFixed(1)} Z`;
  const ticks = 4;

  return (
    <div className="chart-wrap">
      <svg viewBox={`0 0 ${width} ${height}`} className="usage-chart" role="img" aria-label="Daily spend for the last 7 days">
        <defs>
          <linearGradient id="usageFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#93ad89" stopOpacity="0.38" />
            <stop offset="100%" stopColor="#93ad89" stopOpacity="0" />
          </linearGradient>
        </defs>
        {Array.from({ length: ticks + 1 }, (_, i) => {
          const y = padTop + (plotH / ticks) * i;
          return (
            <g key={i}>
              <line x1={padX} y1={y} x2={width - padX} y2={y} className="grid-line" />
              <text x={padX - 8} y={y + 3} className="grid-label" textAnchor="end">
                {money(((max / ticks) * (ticks - i)) || 0, currency).replace(/^./, '')}
              </text>
            </g>
          );
        })}
        {hasData && <path d={area} fill="url(#usageFill)" />}
        <path d={line} className={hasData ? 'chart-line' : 'chart-line flat'} />
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={hasData ? 3.5 : 0} className="chart-dot">
            <title>{`${p.label} · ${money(p.cost || 0, currency)}`}</title>
          </circle>
        ))}
        {points.map((p, i) => (
          <text key={i} x={p.x} y={height - 8} className="chart-x-label" textAnchor="middle">
            {p.label}
          </text>
        ))}
      </svg>
      {!hasData && <p className="chart-empty">No API usage recorded yet — send a message with your key configured and this curve fills in.</p>}
    </div>
  );
}

export function Empty({ icon, title, text }) {
  return (
    <div className="empty">
      {icon || <Coins size={26} />}
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}
