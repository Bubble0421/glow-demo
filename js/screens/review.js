import { API } from '../api.js';
import { getState } from '../state.js';
import { showLoading, hideLoading } from '../ui.js';

export function initReview() {
  document.querySelectorAll('.review-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.review-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const isAccount = tab.dataset.tab === 'account';
      document.getElementById('reviewTabSingle').style.display  = isAccount ? 'none' : '';
      document.getElementById('reviewTabAccount').style.display = isAccount ? ''     : 'none';
    });
  });

  document.querySelectorAll('.post-select-item').forEach(item => {
    item.addEventListener('click', () => {
      document.querySelectorAll('.post-select-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      const r = document.getElementById('reviewResult');
      r.style.display = 'none'; r.innerHTML = '';
    });
  });

  document.querySelector('#reviewBtn').addEventListener('click', async () => {
    const { persona } = getState();
    const p        = persona || { persona_name: '细腻观察者' };
    const selected = document.querySelector('.post-select-item.active');
    const post = selected ? {
      title:     selected.dataset.title,
      likes:     parseInt(selected.dataset.likes)     || 0,
      comments:  parseInt(selected.dataset.comments)  || 0,
      followers: parseInt(selected.dataset.followers) || 0,
    } : { title: '期末周的空座位', likes: 286, comments: 31, followers: 38 };
    const container = document.querySelector('#reviewResult');
    showLoading('Coach Agent 正在复盘这条内容...');
    try {
      const data = await API.review({ persona: p, post });
      const r = data.review;
      container.innerHTML = `
        <div style="margin-top:14px">
          ${r.stage ? `<div style="font-size:12px;font-weight:800;color:var(--primary);margin-bottom:12px;padding:8px 12px;background:var(--primary-soft);border-radius:10px">${r.stage}</div>` : ''}
          <div class="review-grid">
            <div class="review-item"><b style="color:var(--primary)">互动率</b> ${r.engagement_rate || ''}</div>
            <div class="review-item"><b style="color:var(--primary)">收藏率</b> ${r.save_rate       || ''}</div>
            <div class="review-item"><b style="color:var(--primary)">涨粉效率</b> ${r.follow_efficiency || ''}</div>
            <div class="review-item"><b style="color:var(--primary)">标题诊断</b> ${r.title_diagnosis   || ''}</div>
          </div>
          <div class="review-next"><small>下一条建议</small>${r.next}</div>
        </div>`;
      container.style.display = '';
    } catch(e) {
      alert('复盘失败：' + e.message);
    } finally {
      hideLoading();
    }
  });

  document.querySelector('#reviewAccountBtn').addEventListener('click', async () => {
    const { persona } = getState();
    const p     = persona || { persona_name: '细腻观察者' };
    const posts = [
      { title: '期末周的空座位', likes: 286, comments: 31, followers: 38 },
      { title: '凌晨图书馆的人', likes: 124, comments: 18, followers: 22 },
      { title: '宿舍楼道深夜',   likes: 89,  comments: 12, followers: 15 },
    ];
    const container = document.querySelector('#accountReviewResult');
    showLoading('Coach Agent 正在分析账号整体表现...');
    try {
      const data = await API.accountReview({ persona: p, posts });
      const r = data.review;
      container.innerHTML = `
        <div style="margin-top:14px">
          <div class="review-grid">
            <div class="review-item"><b style="color:var(--primary)">发布节奏</b> ${r.rhythm}</div>
            <div class="review-item"><b style="color:var(--primary)">风格一致性</b> ${r.consistency}</div>
            <div class="review-item"><b style="color:var(--primary)">当前瓶颈</b> ${r.bottleneck}</div>
            <div class="review-item"><b style="color:var(--primary)">下一步聚焦</b> ${r.next_focus}</div>
          </div>
          <div class="review-next"><small>整体增长建议</small>${r.suggestion}</div>
        </div>`;
      container.style.display = '';
    } catch(e) {
      alert('复盘失败：' + e.message);
    } finally {
      hideLoading();
    }
  });
}
