import { addSavedItem, removeSavedItem, getState } from '../state.js';
import { showToast } from '../ui.js';
import { showScreen } from '../router.js';
import { renderArchive } from './archive.js';

export function renderWorkshop() {
  const workshop  = document.getElementById('workshop');
  const container = document.getElementById('workshopItems');
  const countEl   = document.getElementById('workshopCount');
  if (!container) return;
  const { savedItems } = getState();
  if (savedItems.length === 0) { workshop.style.display = 'none'; return; }
  workshop.style.display = '';
  if (countEl) countEl.textContent = savedItems.length + ' 个话题';
  container.innerHTML = savedItems.map(item => `
    <div class="workshop-item">
      <div class="workshop-item-header">
        <div>
          <span class="chip">${item.source || '日志'}</span>
          <div class="workshop-item-title">${item.title}</div>
        </div>
        <button class="workshop-remove" onclick="window.removeWorkshopItem('${item.id}')">×</button>
      </div>
      ${item.desc ? `<div class="workshop-item-desc">${item.desc}</div>` : ''}
      <textarea class="short-text" id="refine-input-${item.id}"
        placeholder="补充方向（如：更克制 / 加地点 / 另一个角度）…"></textarea>
      <button class="btn dark" style="margin-top:8px;width:100%"
        onclick="window.refineItem('${item.id}', this)">AI 细化方案 →</button>
      <div id="refine-result-${item.id}" style="display:none;margin-top:12px"></div>
    </div>`).join('');
  _updateTodayTasks(savedItems);
}

function _updateTodayTasks(savedItems) {
  if (savedItems.length === 0) return;
  const latest = savedItems[savedItems.length - 1];
  const tb   = document.querySelector('#task1 .task-body b');
  const tp   = document.querySelector('#task1 .task-body p');
  const hint = document.getElementById('taskProjectHint');
  if (tb)   tb.textContent   = '完成选题：' + latest.title;
  if (tp)   tp.textContent   = (latest.desc || '').slice(0, 40) + '…';
  if (hint) hint.textContent = '当前话题：' + latest.title + '（共 ' + savedItems.length + ' 个待创作）';
}

export function saveToLog(title, desc, source) {
  addSavedItem({ title, desc: desc || '', source: source || '创作探索', savedAt: Date.now() });
  renderWorkshop();
  renderArchive();
  showScreen('log');
  showToast('已保存到创作日志 ✓');
}

window.removeWorkshopItem = function(id) {
  removeSavedItem(id);
  renderWorkshop();
  showToast('已从日志移除');
};
