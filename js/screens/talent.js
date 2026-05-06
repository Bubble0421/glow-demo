import { API } from '../api.js';
import { clearLog } from '../state.js';
import { showLoading, hideLoading } from '../ui.js';
import { showScreen } from '../router.js';
import { renderPersona } from './persona.js';

function collectAnswers() {
  const answers = {};
  ['q1','q2','q3','q4','r1','r2','r3','r4','r5'].forEach(name => {
    const el = document.querySelector(`input[name="${name}"]:checked`);
    if (el) answers[name] = el.closest('label').textContent.trim();
  });
  const goalEl = document.querySelector('.quiz-block:last-child textarea');
  if (goalEl) answers['创作目标'] = goalEl.value;
  return answers;
}

export function initTalent() {
  document.querySelector('#analyzeBtn').addEventListener('click', async () => {
    const userText    = document.querySelector('#userText').value.trim();
    const quizAnswers = collectAnswers();
    showLoading('Insight Agent 正在读懂你的表达...');
    try {
      const data = await API.persona({ user_text: userText, quiz_answers: quizAnswers });
      renderPersona(data.persona);
      showScreen('persona');
      clearLog();
    } catch(e) {
      alert('生成失败：' + e.message);
    } finally {
      hideLoading();
    }
  });
}
