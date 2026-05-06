export const KEYS = {
  PERSONA: 'glow_persona',
  SAVED:   'glow_saved',
  LOG:     'glow_log',
};

export function readJSON(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function writeJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}
