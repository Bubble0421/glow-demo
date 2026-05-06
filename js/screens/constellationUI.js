import { C_NODES, C_LINKS } from './constellation.js';

export const cSelected = new Set();
const cNodeEls         = {};
let cDynamicLines      = [];

const NODE_DIMENSION_MAP = {
  '表达细腻度': ['empty','hollow','alone','shadow'],
  '情绪共鸣力': ['tired','hollow','happy','hallway'],
  '观察独特性': ['invisible','shadow','city','cafe'],
  '节奏把控感': ['dawn','midnight','hallway','deadline'],
  '表达直接度': ['diner','deadline','city','cafe'],
};

export function applyPersonaToConstellation(p) {
  if (!p || !p.dimensions) return;
  const resonant = new Set();
  Object.entries(p.dimensions).forEach(([dim, score]) => {
    if (score >= 75 && NODE_DIMENSION_MAP[dim]) {
      NODE_DIMENSION_MAP[dim].forEach(id => resonant.add(id));
    }
  });
  window._constellationResonant = resonant;
}

export function initConstellation() {
  const wrap = document.getElementById('constellationWrap');
  const svg  = document.getElementById('constellationSvg');
  if (!wrap) return;
  const W = wrap.clientWidth;
  const H = wrap.clientHeight;
  if (W === 0) return;

  Object.values(cNodeEls).forEach(el => el.remove());
  cDynamicLines.forEach(l => l.remove());
  svg.querySelectorAll('line').forEach(el => el.remove());
  for (const k in cNodeEls) delete cNodeEls[k];
  cDynamicLines = [];

  C_LINKS.forEach(([a, b]) => {
    const na = C_NODES.find(n => n.id === a);
    const nb = C_NODES.find(n => n.id === b);
    if (!na || !nb) return;
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', na.x * W); line.setAttribute('y1', na.y * H);
    line.setAttribute('x2', nb.x * W); line.setAttribute('y2', nb.y * H);
    line.setAttribute('stroke', 'rgba(202,198,187,0.18)');
    line.setAttribute('stroke-width', '0.7');
    svg.appendChild(line);
  });

  const delays    = [0, 0.55, 1.1, 1.65];
  const durations = [2.6, 2.9, 3.2, 2.4];
  C_NODES.forEach(node => {
    const el = document.createElement('div');
    el.className = 'c-node';
    el.style.left = (node.x * W) + 'px';
    el.style.top  = (node.y * H) + 'px';
    const inner = document.createElement('div');
    inner.className = 'c-float';
    inner.style.animation = `dotFloat${node.f} ${durations[node.f]}s ${delays[node.f]}s ease-in-out infinite`;
    inner.innerHTML = `<div class="c-ring"><div class="c-dot"></div></div><div class="c-label">${node.label}</div>`;
    el.appendChild(inner);
    el.addEventListener('click', () => {
      cSelected.has(node.id) ? cSelected.delete(node.id) : cSelected.add(node.id);
      updateCState();
    });
    wrap.appendChild(el);
    cNodeEls[node.id] = el;
    if (cSelected.has(node.id)) el.classList.add('active');
    if (window._constellationResonant?.has(node.id)) el.classList.add('resonant');
  });
}

export function updateCState() {
  C_NODES.forEach(n => cNodeEls[n.id]?.classList.toggle('active', cSelected.has(n.id)));
  cDynamicLines.forEach(l => l.remove());
  cDynamicLines = [];

  if (cSelected.size >= 2) {
    const svg  = document.getElementById('constellationSvg');
    const wrap = document.getElementById('constellationWrap');
    const W = wrap.clientWidth, H = wrap.clientHeight;
    const selArr = [...cSelected];
    for (let i = 0; i < selArr.length; i++) {
      for (let j = i + 1; j < selArr.length; j++) {
        const na = C_NODES.find(n => n.id === selArr[i]);
        const nb = C_NODES.find(n => n.id === selArr[j]);
        if (!na || !nb) continue;
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', na.x * W); line.setAttribute('y1', na.y * H);
        line.setAttribute('x2', nb.x * W); line.setAttribute('y2', nb.y * H);
        line.setAttribute('stroke', 'rgba(98,95,78,0.80)');
        line.setAttribute('stroke-width', '1.5');
        line.setAttribute('filter', 'url(#lineGlow)');
        svg.appendChild(line);
        cDynamicLines.push(line);
      }
    }
  }

  const chipsEl  = document.getElementById('selectedChips');
  const genBtn   = document.getElementById('constellationGenBtn');
  const resetBtn = document.getElementById('constellationResetBtn');

  if (cSelected.size > 0) {
    chipsEl.innerHTML = [...cSelected].map(id => {
      const n = C_NODES.find(n => n.id === id);
      return `<span class="tree-crumb">${n ? n.label : id}</span>`;
    }).join('');
    genBtn.style.display   = '';
    resetBtn.style.display = '';
  } else {
    chipsEl.innerHTML = '<span style="font-size:11px;color:var(--muted);font-weight:700">点亮感觉词开始探索</span>';
    genBtn.style.display   = 'none';
    resetBtn.style.display = 'none';
  }
  document.getElementById('constellationResult').style.display = 'none';
}
