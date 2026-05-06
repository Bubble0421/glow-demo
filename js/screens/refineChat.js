import { API } from '../api.js';
import { getState } from '../state.js';
import { showLoading, hideLoading } from '../ui.js';
import { trackInteraction } from '../track.js';
import { renderPlan } from '../components/renderPlan.js';

const _refineConvos = {};

function appendChatUI(itemId, container) {
  const existing = container.querySelector('.refine-chat');
  if (existing) existing.remove();
  const div = document.createElement('div');
  div.className = 'refine-chat';
  div.innerHTML = `
    <div class="refine-chat-label">继续和小光对话</div>
    <div class="refine-chat-msgs" id="refine-chat-msgs-${itemId}"></div>
    <div class="refine-chat-row">
      <textarea class="short-text" id="refine-followup-${itemId}" rows="2"
        placeholder="如：标题改得更具体 / 加入某个地点 / 文案更克制 / 再给一个版本…"></textarea>
      <button class="btn dark" style="width:100%"
        onclick="window.sendFollowup('${itemId}', this)">继续问小光 →</button>
    </div>`;
  container.appendChild(div);
}

export function initRefineChat() {
  window.refineItem = async function(itemId, btn) {
    const item = getState().savedItems.find(i => i.id === itemId);
    if (!item) return;
    const input    = document.getElementById('refine-input-' + itemId);
    const resultEl = document.getElementById('refine-result-' + itemId);
    const persona  = getState().persona || { persona_name: '细腻观察者', persona_description: '' };
    const extra    = input ? input.value.trim() : '';
    const topic    = item.title + (extra ? '（要求：' + extra + '）' : '');
    btn.disabled = true; btn.textContent = '细化中…';
    showLoading('Creator Agent 正在细化「' + item.title + '」…');
    try {
      const data = await API.create({ topic, persona });
      renderPlan(data.plan, resultEl);
      const p = data.plan;
      const planSummary = `生成了方案《${p.title || item.title}》\n文案：${p.copy || ''}\n分镜（前3）：${(p.shots || []).slice(0,3).join(' / ')}`;
      _refineConvos[itemId] = [{ role: 'assistant', content: planSummary }];
      appendChatUI(itemId, resultEl);
      trackInteraction('细化工作台话题：' + item.title);
    } catch(e) {
      alert('细化失败：' + e.message);
    } finally {
      hideLoading();
      btn.disabled = false; btn.textContent = '重新细化';
    }
  };

  window.sendFollowup = async function(itemId, btn) {
    const item = getState().savedItems.find(i => i.id === itemId);
    if (!item) return;
    const input  = document.getElementById('refine-followup-' + itemId);
    const msgsEl = document.getElementById('refine-chat-msgs-' + itemId);
    if (!input || !msgsEl) return;
    const message = input.value.trim();
    if (!message) return;
    const userBubble = document.createElement('div');
    userBubble.className = 'refine-chat-msg user';
    userBubble.textContent = message;
    msgsEl.appendChild(userBubble);
    msgsEl.scrollTop = msgsEl.scrollHeight;
    input.value = '';
    btn.disabled = true; btn.textContent = '小光思考中…';
    const persona = getState().persona || { persona_name: '细腻观察者', persona_description: '' };
    const history = _refineConvos[itemId] || [];
    try {
      const data = await API.refineChat({ persona, topic: item.title, history, message });
      _refineConvos[itemId] = _refineConvos[itemId] || [];
      _refineConvos[itemId].push({ role: 'user',      content: message    });
      _refineConvos[itemId].push({ role: 'assistant', content: data.reply });
      const aiBubble = document.createElement('div');
      aiBubble.className = 'refine-chat-msg ai';
      aiBubble.textContent = data.reply;
      msgsEl.appendChild(aiBubble);
      msgsEl.scrollTop = msgsEl.scrollHeight;
      trackInteraction('细化追问：' + message.slice(0, 20));
    } catch(e) {
      alert('出错了：' + e.message);
    } finally {
      btn.disabled = false; btn.textContent = '继续问小光 →';
    }
  };
}
