import { FOCUS_LIMIT, MASTERY_GOAL, PEAK_WINDOWS, focusWeight, profileDefaults, scenes } from './config.js';

export const now = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
export const wait = ms => new Promise(r => setTimeout(r, ms));

export const initials = (name = '') => (name.trim()[0] || 'U').toUpperCase();

const pad = n => String(n).padStart(2, '0');

/* ---------- Beijing-time helpers (billing daylight windows are Asia/Shanghai) ---------- */

// work in a shifted timeline so Date getters answer with Beijing wall-clock values
export function beijingDate(input = new Date()) {
  const base = input instanceof Date ? input : new Date(input);
  return new Date(base.getTime() + base.getTimezoneOffset() * 60000 + 8 * 3600 * 1000);
}

export function beijingHour(input = new Date()) {
  return beijingDate(input).getHours();
}

export function isPeak(input = new Date()) {
  const hour = beijingHour(input);
  return PEAK_WINDOWS.some(([start, end]) => hour >= start && hour < end);
}

export function peakMultiplier(input = new Date()) {
  return isPeak(input) ? 2 : 1;
}

export function dayKey(input = new Date()) {
  const d = beijingDate(input);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

// oldest -> newest keys, used for the 7 day usage chart
export function lastDays(count = 7) {
  const days = [];
  const today = new Date();
  for (let i = count - 1; i >= 0; i -= 1) {
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i);
    days.push({
      key: dayKey(d),
      label: `${pad(d.getMonth() + 1)}/${pad(d.getDate())}`
    });
  }
  return days;
}

export const pruneHistory = (history = {}, count = 7) => {
  const keys = new Set(lastDays(count).map(d => d.key));
  return Object.fromEntries(Object.entries(history).filter(([key]) => keys.has(key)));
};

/* ---------- word bank ---------- */

// Weighted draw without replacement: a word used once is ~9x likelier than one used nine times,
// and words already at the mastery goal drop out of the pool entirely.
export function pickFocusWords(words = [], limit = FOCUS_LIMIT, goal = MASTERY_GOAL) {
  const pool = (words || []).filter(w => (w.count || 0) < goal);
  const picks = [];
  const remaining = [...pool];
  while (picks.length < limit && remaining.length) {
    const total = remaining.reduce((sum, w) => sum + focusWeight(w), 0);
    let roll = Math.random() * total;
    let index = remaining.length - 1;
    for (let i = 0; i < remaining.length; i += 1) {
      roll -= focusWeight(remaining[i]);
      if (roll <= 0) {
        index = i;
        break;
      }
    }
    picks.push(remaining[index]);
    remaining.splice(index, 1);
  }
  return picks;
}

export const escapeRegExp = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const usesWord = (text = '', word = '') => !!word && new RegExp(`\\b${escapeRegExp(word)}\\b`, 'i').test(text);

/* ---------- conversations ---------- */

export const conversationTitle = profile => {
  const topic = (profile?.topic || '').trim();
  if (topic) return topic.length > 28 ? topic.slice(0, 28) + '…' : topic;
  return scenes[profile?.scene]?.label || 'New conversation';
};

export const makeConversation = (profile, personaName = 'Alex', index = 0) => ({
  id: Date.now() + index,
  title: conversationTitle(profile),
  messages: [
    {
      role: 'assistant',
      text: `Hey! I’m ${personaName} 👋 Your English buddy. What’s on your mind today?`,
      time: now()
    }
  ],
  profile,
  createdAt: new Date().toISOString()
});

export const newProfile = settings => ({
  role: settings.defaultRole,
  scene: settings.defaultScene,
  topic: '',
  tone: settings.defaultTone,
  length: settings.defaultLength
});

// Older builds stored the review on the assistant turn. Move it onto the learner's
// sentence so historical conversations render the block in the right place too.
export function normaliseConversations(list) {
  return (Array.isArray(list) ? list : []).map(conversation => {
    const messages = (conversation?.messages || []).map(m => ({ ...m }));
    messages.forEach((message, index) => {
      if (message.role !== 'assistant' || !message.correction) return;
      for (let back = index - 1; back >= 0; back -= 1) {
        if (messages[back].role === 'user') {
          messages[back] = { ...messages[back], correction: message.correction };
          break;
        }
      }
      delete messages[index].correction;
    });
    return { ...conversation, messages, profile: { ...profileDefaults, ...(conversation?.profile || {}) } };
  });
}

export const shortDate = iso => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  const today = new Date();
  const sameDay = date.toDateString() === today.toDateString();
  return sameDay ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : date.toLocaleDateString();
};

/* ---------- avatar ---------- */

// Image -> downscaled square data URL, so avatars stay small inside localStorage.
export function fileToAvatar(file, size = 128) {
  return new Promise((resolve, reject) => {
    if (!file) return reject(new Error('no file'));
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('read failed'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('decode failed'));
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        const side = Math.min(img.width, img.height);
        ctx.drawImage(img, (img.width - side) / 2, (img.height - side) / 2, side, side, 0, 0, size, size);
        resolve(canvas.toDataURL('image/jpeg', 0.82));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}
