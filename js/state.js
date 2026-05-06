import { readJSON, writeJSON, KEYS } from './utils/storage.js';
import { genId } from './utils/ids.js';

const state = {
  persona:    readJSON(KEYS.PERSONA, null),
  savedItems: readJSON(KEYS.SAVED,   []).map(item => item.id ? item : { ...item, id: genId() }),
  log:        readJSON(KEYS.LOG,     []),
};

const listeners = new Set();
function notify() { listeners.forEach(fn => fn(structuredClone(state))); }

export function setPersona(persona) {
  state.persona = persona;
  writeJSON(KEYS.PERSONA, persona);
  notify();
}

export function addSavedItem(item) {
  state.savedItems.push({ ...item, id: genId() });
  writeJSON(KEYS.SAVED, state.savedItems);
  notify();
}

export function removeSavedItem(id) {
  state.savedItems = state.savedItems.filter(i => i.id !== id);
  writeJSON(KEYS.SAVED, state.savedItems);
  notify();
}

export function addLogEntry(text) {
  state.log.push(text);
  writeJSON(KEYS.LOG, state.log);
  notify();
}

export function clearLog() {
  state.log = [];
  writeJSON(KEYS.LOG, []);
  notify();
}

export function getState() { return structuredClone(state); }

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
