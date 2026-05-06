import { getState } from './state.js';
import { initNav, showScreen } from './router.js';
import { setPersonaUpdateFn } from './track.js';
import { renderPersona, maybeUpdatePersona } from './screens/persona.js';
import { renderWorkshop } from './screens/log.js';
import { renderArchive } from './screens/archive.js';
import { initTalent } from './screens/talent.js';
import { initCreate } from './screens/create.js';
import { initReview } from './screens/review.js';
import { initRefineChat } from './screens/refineChat.js';

// ── 授权弹窗 ──────────────────────────────────────────────────────────────────
const modal      = document.querySelector('#authModal');
const modalTitle = document.querySelector('#modalTitle');
const modalText  = document.querySelector('#modalText');
const sourceChip = document.querySelector('#sourceChip');
let pendingSource = 'QQ 空间';

document.querySelectorAll('.feed-card').forEach(card => {
  card.addEventListener('click', () => {
    pendingSource = card.dataset.source;
    modalTitle.textContent = pendingSource === 'QQ 空间' ? '申请访问 QQ 空间' : '申请访问微信朋友圈';
    modalText.textContent  = pendingSource === 'QQ 空间'
      ? '将模拟读取最近 10 条说说、日志摘要和互动反馈，用于分析你已经留下的表达痕迹。'
      : '将模拟读取近 3 个月朋友圈图文、九宫格和互动反馈，用于补充生活风格判断。';
    modal.classList.add('show');
  });
});
document.querySelector('#cancelAuth').addEventListener('click',  () => modal.classList.remove('show'));
document.querySelector('#confirmAuth').addEventListener('click', () => {
  sourceChip.textContent = pendingSource + '已连接 · 可继续上传截图';
  document.querySelectorAll('.feed-card').forEach(c => c.classList.toggle('selected', c.dataset.source === pendingSource));
  modal.classList.remove('show');
});

// ── 任务勾选 ──────────────────────────────────────────────────────────────────
const taskDone = [false, false, false];
function updateTaskProgress() {
  const count = taskDone.filter(Boolean).length;
  const el = document.getElementById('taskProgress');
  if (el) el.textContent = count + ' / 3 完成';
}
[1, 2, 3].forEach(i => {
  const check = document.getElementById('taskCheck' + i);
  if (!check) return;
  check.addEventListener('click', () => {
    taskDone[i - 1] = !taskDone[i - 1];
    check.classList.toggle('done', taskDone[i - 1]);
    updateTaskProgress();
  });
});

// ── 初始化 ────────────────────────────────────────────────────────────────────
window.showScreen = showScreen;
initNav();
setPersonaUpdateFn(maybeUpdatePersona);
initTalent();
initCreate();
initReview();
initRefineChat();

const { persona, savedItems } = getState();
if (persona)               requestAnimationFrame(() => { renderPersona(persona); });
if (savedItems.length > 0) requestAnimationFrame(() => { renderWorkshop(); renderArchive(); });
