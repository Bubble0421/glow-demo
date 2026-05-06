import { API } from '../api.js';
import { getState } from '../state.js';
import { showLoading, hideLoading } from '../ui.js';
import { trackInteraction } from '../track.js';
import { renderPlan } from '../components/renderPlan.js';
import { C_NODES, getInspiration } from './constellation.js';
import { cSelected, updateCState } from './constellationUI.js';
import { saveToLog } from './log.js';

export function initCreate() {
  document.getElementById('constellationGenBtn').addEventListener('click', async () => {
    const ids    = [...cSelected];
    const labels = ids.map(id => C_NODES.find(n => n.id === id)?.label || id);
    const ins    = getInspiration(ids);
    const resEl  = document.getElementById('constellationResult');

    const showIns = (title, desc, shot, tags) => {
      document.getElementById('consResultTitle').textContent = title;
      document.getElementById('consResultDesc').textContent  = desc;
      document.getElementById('consResultShot').innerHTML    = '📷 ' + shot;
      document.getElementById('consResultTags').innerHTML    = tags.map(t => `<span>${t}</span>`).join('');
      document.getElementById('consPlanResult').style.display = 'none';
      document.getElementById('consPlanResult').innerHTML = '';
      resEl.style.display = '';
      setTimeout(() => resEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 80);
    };

    if (ins) {
      showIns(ins.title, ins.desc, ins.shot, ins.tags);
    } else {
      const { persona } = getState();
      const p = persona || { persona_name: '细腻观察者', persona_description: '' };
      showLoading('Creator Agent 正在读懂你的感觉...');
      try {
        const data = await API.create({ topic: labels.join(' + '), persona: p });
        const pl = data.plan;
        showIns(pl.title || labels.join('+'), pl.copy || '', (pl.shots || [])[0] || '', pl.tags || []);
      } catch(e) {
        alert('生成失败：' + e.message);
      } finally {
        hideLoading();
      }
    }
  });

  document.getElementById('constellationResetBtn').addEventListener('click', () => {
    cSelected.clear();
    updateCState();
  });

  document.getElementById('consSaveBtn').addEventListener('click', () => {
    const title = document.getElementById('consResultTitle').textContent;
    const desc  = document.getElementById('consResultDesc').textContent;
    saveToLog(title, desc, '创作探索');
    trackInteraction('从星图保存灵感：' + title);
  });

  document.getElementById('consGenPlanBtn').addEventListener('click', async () => {
    const title     = document.getElementById('consResultTitle').textContent;
    const { persona } = getState();
    const p         = persona || { persona_name: '细腻观察者', persona_description: '' };
    const container = document.getElementById('consPlanResult');
    showLoading('Creator Agent 正在生成完整创作方案...');
    try {
      const data = await API.create({ topic: title, persona: p });
      renderPlan(data.plan, container);
    } catch(e) {
      alert('生成失败：' + e.message);
    } finally {
      hideLoading();
    }
  });
}
