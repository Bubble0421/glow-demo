const overlay     = document.querySelector('#loadingOverlay');
const loadingText = document.querySelector('#loadingText');
let _toastTimer = null;

export function showLoading(msg) {
  loadingText.textContent = msg || 'AI 正在分析中...';
  overlay.classList.add('show');
}

export function hideLoading() { overlay.classList.remove('show'); }

export function showToast(msg, duration) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => el.classList.remove('show'), duration || 2800);
}
