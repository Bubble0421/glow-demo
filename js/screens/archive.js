import { getState } from '../state.js';

export function renderArchive() {
  const card = document.getElementById('archiveSavedCard');
  const list = document.getElementById('archiveSavedList');
  if (!list) return;
  const { savedItems } = getState();
  if (savedItems.length === 0) { card.style.display = 'none'; return; }
  card.style.display = '';
  list.innerHTML = [...savedItems].reverse().map(item => {
    const d    = new Date(item.savedAt || Date.now());
    const meta = `${d.getMonth()+1}月${d.getDate()}日 ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')} · ${item.source || '日志'}`;
    return `<div class="archive-item">
      <div class="archive-item-meta">${meta}</div>
      <div class="archive-item-title">${item.title}</div>
      ${item.desc ? `<div class="archive-item-desc">${item.desc}</div>` : ''}
    </div>`;
  }).join('');
}
