// Static configuration: roleplay options, provider presets, defaults and pricing.

export const roles = {
  classmate: { label: 'Classmate', hint: 'Friendly peer from your class' },
  teacher: { label: 'Teacher', hint: 'Patient, explains and corrects' },
  friend: { label: 'Friend', hint: 'Very casual, everyday slang' },
  interviewer: { label: 'Interviewer', hint: 'Professional Q&A practice' }
};

export const scenes = {
  daily: { label: 'Daily chat', hint: 'Small talk about your day' },
  topic: { label: 'Find a topic', hint: 'Let me suggest something to discuss' },
  group: { label: 'Group project', hint: 'Practise teamwork language' },
  discuss: { label: 'Discuss a question', hint: 'Exchange opinions on a question' }
};

export const tones = {
  casual: { label: 'Casual' },
  balanced: { label: 'Balanced' },
  formal: { label: 'Formal' }
};

export const lengths = {
  short: { label: 'Short' },
  medium: { label: 'Medium' },
  long: { label: 'Detailed' }
};

export const reasoning = {
  no: { label: 'Off' },
  low: { label: 'Low' },
  high: { label: 'High' },
  max: { label: 'Max' }
};

export const profileDefaults = { role: 'classmate', scene: 'daily', topic: '', tone: 'casual', length: 'short' };

// How strict the correction pass is. Only real grammar issues count in `relaxed`.
// `off` skips the review entirely: no JSON mode, no correction block, fewest tokens.
export const strictness = {
  off: { label: 'Off', hint: 'No correction pass at all — replies only, so you spend the fewest tokens.' },
  relaxed: { label: 'Relaxed', hint: 'Clear grammar mistakes only (missing plural, agreement, tense).' },
  standard: { label: 'Standard', hint: 'Also tense, articles and plural forms.' },
  strict: { label: 'Strict', hint: 'Also word choice and natural phrasing.' }
};

export const correctionsEnabled = settings =>
  settings?.corrections !== false && (settings?.correctionStrictness || 'relaxed') !== 'off';

export const settingsDefaults = {
  // Model & API
  endpoint: 'https://api.deepseek.com',
  model: 'deepseek-chat',
  key: '',
  temperature: 0.7,
  // Reasoning
  reasoning: 'low',
  // Persona (defaults used when creating a conversation)
  personaName: 'Alex',
  defaultRole: 'classmate',
  defaultScene: 'daily',
  defaultTone: 'casual',
  defaultLength: 'short',
  // General
  currency: 'CNY',
  enterToSend: true,
  sidebarCollapsed: false,
  corrections: true,
  correctionStrictness: 'relaxed'
};

export const accountDefaults = { name: 'user', avatar: '' };

/* ---------- word bank ---------- */

export const MASTERY_GOAL = 10; // ten natural uses retire a word from the focus pool
export const FOCUS_LIMIT = 5; // words offered to the model each turn
export const focusWeight = word => Math.max(1, MASTERY_GOAL - (word.count || 0));
export const isLearned = word => (word.count || 0) >= MASTERY_GOAL;

export const usageDefaults = { input: 0, output: 0, cacheHit: 0, requests: 0, cost: 0, history: {} };

/* ---------- pricing ---------- */

// Off-peak prices in CNY per 1M tokens; peak hours double every line item.
export const RATE_INPUT = 1;
export const RATE_OUTPUT = 2;
export const RATE_CACHE_HIT = 0.02;

export const PEAK_WINDOWS = [[9, 12], [14, 18]]; // Asia/Shanghai
export const PEAK_MULTIPLIER = 2;
export const PER_MILLION = 1_000_000;

export const costOf = (usage = {}, multiplier = 1) =>
  (((usage.input || 0) * RATE_INPUT + (usage.output || 0) * RATE_OUTPUT + (usage.cacheHit || 0) * RATE_CACHE_HIT) / PER_MILLION) * multiplier;

export const currencies = {
  CNY: { symbol: '¥', factor: 1, label: 'CNY ¥' },
  USD: { symbol: '$', factor: 1 / 7.24, label: 'USD $' }
};

const currencyOf = code => currencies[code] || currencies.CNY;

export const symbolOf = code => currencyOf(code).symbol;

// All stored costs are CNY; `factor` converts to the display currency.
export const money = (cny, code = 'CNY') => {
  const c = currencyOf(code);
  return `${c.symbol}${(cny * c.factor).toFixed(4)}`;
};

export const rateLabel = (perMillionCny, code = 'CNY') => {
  const c = currencyOf(code);
  return `${c.symbol}${(perMillionCny * c.factor).toFixed(2)} / M`;
};
