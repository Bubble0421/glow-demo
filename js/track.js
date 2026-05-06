import { addLogEntry, getState } from './state.js';

let _onMaybeUpdate = null;

export function setPersonaUpdateFn(fn) { _onMaybeUpdate = fn; }

export function trackInteraction(text) {
  addLogEntry(text);
  const log = getState().log;
  if (log.length >= 3 && log.length % 3 === 0 && _onMaybeUpdate) {
    _onMaybeUpdate();
  }
}
