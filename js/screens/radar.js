import { API } from '../api.js';
import { trackInteraction } from '../track.js';
import { saveToLog } from './log.js';

export async function fetchTopics(persona) {
  const loading = document.getElementById('radarLoading');
  if (loading) loading.style.display = 'flex';
  try {
    const data = await API.topics({ persona });
    if (loading) loading.style.display = 'none';
    renderTopics(data.topics);
  } catch (_) {
    if (loading) loading.querySelector('p').textContent = '话题加载失败，请重试。';
  }
}

function renderTopics(data) {
  const container = document.getElementById('radarTopicsContainer');
  if (!container) return;
  container.innerHTML = '';
  const trending = Array.isArray(data) ? data.slice(0, 3) : (data.trending || []);
  const original = Array.isArray(data) ? data.slice(3)   : (data.original  || []);

  function buildCard(t, i, isFirst) {
    const angles = (t.angles || []).map(a => `<li>${a}</li>`).join('');
    const g = t.guide || {};
    const el = document.createElement('details');
    el.className = 'card';
    if (isFirst) el.open = true;
    el.innerHTML = `
      <summary class="topic-summary">
        <div class="topic-head">
          <div><span class="chip">${t.chip || ''}</span><h2 style="margin-top:10px">${t.name || ''}</h2></div>
          <div class="arrow">›</div>
        </div>
      </summary>
      ${t.hook_sentence ? `<div class="hook-sentence">${t.hook_sentence}</div>` : ''}
      <div class="score-row"><div class="score-top"><span>热度</span><b>${t.trend}/100</b></div><div class="track"><div class="fill" style="--w:${t.trend}%"></div></div></div>
      <div class="score-row"><div class="score-top"><span>人设匹配</span><b>${t.match}%</b></div><div class="track"><div class="fill" style="--w:${t.match}%"></div></div></div>
      ${t.why_now ? `<div class="evidence-item"><b>切入时机</b><p>${t.why_now}</p></div>` : ''}
      <div class="evidence-item"><b>内容空隙</b><p>${t.gap || ''}</p></div>
      <div class="guide-list">
        <div class="guide-step"><span>1</span><div><b>准备</b><p>${g.prepare || ''}</p></div></div>
        <div class="guide-step"><span>2</span><div><b>拍法</b><p>${g.shoot || ''}</p></div></div>
        <div class="guide-step"><span>3</span><div><b>参考风格</b><p>${g.reference || ''}</p></div></div>
        <div class="guide-step"><span>4</span><div><b>变体方向</b><p>${g.variation || ''}</p></div></div>
      </div>
      <p style="font-size:11px;color:var(--muted);font-weight:900;margin:10px 0 6px">切入角度</p>
      <ul style="margin:0 0 12px;padding-left:16px;font-size:12px;color:var(--muted);line-height:1.8">${angles}</ul>
      <button class="btn dark" style="width:100%">保存到创作日志</button>`;
    el.querySelector('.btn.dark').addEventListener('click', () => {
      saveToLog(t.name, t.gap || '', '雷达');
      trackInteraction(`保存雷达话题：${t.name}`);
    });
    return el;
  }

  if (trending.length > 0) {
    const head1 = document.createElement('div');
    head1.className = 'radar-section-head';
    head1.innerHTML = `<div><h3>本周热点跟拍</h3><p>借势当前互联网流量，找到属于你的切入角度</p></div>`;
    container.appendChild(head1);
    trending.forEach((t, i) => container.appendChild(buildCard(t, i, i === 0)));
  }
  if (original.length > 0) {
    const head2 = document.createElement('div');
    head2.className = 'radar-section-head';
    head2.innerHTML = `<div><h3>你的独创赛道</h3><p>不追热点，基于你的人设开创差异化内容</p></div>`;
    container.appendChild(head2);
    original.forEach((t, i) => container.appendChild(buildCard(t, i, false)));
  }
}
