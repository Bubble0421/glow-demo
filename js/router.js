import { initConstellation } from './screens/constellationUI.js';
import { renderArchive } from './screens/archive.js';

const screens = [...document.querySelectorAll('.screen')];
const navBtns = [...document.querySelectorAll('.nav-btn')];

export function showScreen(id) {
  screens.forEach(s => s.classList.toggle('active', s.id === id));
  navBtns.forEach(b => b.classList.toggle('active', b.dataset.target === id));
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (id === 'create')  requestAnimationFrame(() => initConstellation());
  if (id === 'archive') requestAnimationFrame(() => renderArchive());
}

export function initNav() {
  navBtns.forEach(btn => btn.addEventListener('click', () => showScreen(btn.dataset.target)));
}
