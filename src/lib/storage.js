// Tiny localStorage helpers. Everything deeptalk stores stays in the browser.

export const KEYS = {
  settings: 'deeptalk-settings',
  account: 'deeptalk-account',
  conversations: 'deeptalk-conversations',
  current: 'deeptalk-current',
  usage: 'deeptalk-usage',
  words: 'deeptalk-words',
  lastProfile: 'deeptalk-last-profile'
};

export function loadRaw(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

// Object storage: unknown keys fall back to defaults so new versions keep working.
export function loadObject(key, defaults) {
  const stored = loadRaw(key, null);
  return stored && typeof stored === 'object' ? { ...defaults, ...stored } : { ...defaults };
}

export function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota exceeded — keep the session usable */
  }
}
