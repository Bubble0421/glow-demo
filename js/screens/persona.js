import { API } from '../api.js';
import { setPersona as _setPersona, getState } from '../state.js';
import { showToast } from '../ui.js';
import { fetchTopics } from './radar.js';
import { applyPersonaToConstellation } from './constellationUI.js';

export function renderPersona(p) {
  _setPersona(p);
  const set = (id, val) => { const el = document.getElementById(id); if (el && val !== undefined) el.textContent = val; };
  set('personaName',        p.persona_name);
  set('personaScore',       p.match_score);
  set('personaDesc',        p.persona_description);
  set('personaDirection',   p.content_direction);
  set('personaFormat',      p.content_format);
  set('personaRhythm',      p.publish_rhythm);
  set('platformMain',       p.platform_main);
  set('advantageTrack',     p.advantage_track);
  if (p.evidence) {
    set('evidenceLife',        p.evidence.life_traces);
    set('evidenceSocial',      p.evidence.social_dynamics);
    set('evidenceQuiz',        p.evidence.quiz_insight);
    set('evidenceConstraints', p.evidence.constraints);
  }
  fetchTopics(p);
  applyPersonaToConstellation(p);
}

export async function maybeUpdatePersona() {
  const { persona, log } = getState();
  if (!persona) return;
  try {
    const data = await API.personaUpdate({ persona, interactions: log.slice(-9) });
    const u = data.update;
    _setPersona({ ...persona, ...u });
    const set = (id, val) => { const el = document.getElementById(id); if (el && val) el.textContent = val; };
    set('personaName',      u.persona_name);
    set('personaDesc',      u.persona_description);
    set('personaScore',     u.match_score);
    set('personaDirection', u.content_direction);
    if (u.memory_note) showToast('💡 ' + u.memory_note, 4000);
  } catch (_) {}
}
