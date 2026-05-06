export function renderPlan(plan, container) {
  const shots    = (plan.shots || []).map((s, i) => `<li data-n="${i+1}">${s}</li>`).join('');
  const tags     = (plan.tags  || []).map(t => `<span class="ai-tag">${t}</span>`).join('');
  const variants = (plan.title_options || []).map(v => `<div class="title-variant">${v}</div>`).join('');
  container.innerHTML = `
    <div class="ai-result">
      <div class="ai-result-header">
        <h3>${plan.title || ''}</h3>
        <span class="score-pill">${plan.viral_score || '--'}</span>
      </div>
      ${variants ? `<div class="title-variants">${variants}</div>` : ''}
      ${plan.opening_line ? `<div class="plan-section-label">第一句话</div><div class="opening-line-block">${plan.opening_line}</div>` : ''}
      <div class="plan-section-label">完整文案</div>
      <div class="ai-copy">${plan.copy || ''}</div>
      ${plan.cover_tip ? `<div class="plan-section-label">封面建议</div><div style="font-size:12px;color:var(--secondary);background:var(--surface-low);border-radius:10px;padding:9px 12px;margin-bottom:4px">${plan.cover_tip}</div>` : ''}
      <div class="plan-section-label">分镜（${(plan.shots||[]).length} 个）</div>
      <ul class="shots-list">${shots}</ul>
      <div class="ai-meta">
        <div class="ai-meta-item"><small>发布时段</small><b>${plan.best_time || '--'}</b></div>
        <div class="ai-meta-item"><small>预计互动率</small><b>${plan.est_engagement_rate ? plan.est_engagement_rate.split('，')[0] : '--'}</b></div>
        <div class="ai-meta-item"><small>收藏率</small><b>${plan.est_save_rate ? plan.est_save_rate.split(' ')[0] : '--'}</b></div>
        <div class="ai-meta-item"><small>人设匹配</small><b>${plan.persona_fit ? plan.persona_fit.slice(0,12)+'…' : '--'}</b></div>
      </div>
      <div class="ai-tags">${tags}</div>
    </div>`;
  container.style.display = '';
}
