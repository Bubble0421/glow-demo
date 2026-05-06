async function post(path, body = {}) {
  let res, data;
  try {
    res = await fetch(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error('网络连接失败，请确认服务已启动');
  }
  try {
    data = await res.json();
  } catch {
    throw new Error('服务返回格式异常');
  }
  if (!res.ok || !data.ok) {
    throw new Error(data?.error || `请求失败：${res.status}`);
  }
  return data;
}

export const API = {
  persona:       (body) => post('/api/persona',        body),
  topics:        (body) => post('/api/topics',         body),
  create:        (body) => post('/api/create',         body),
  review:        (body) => post('/api/review',         body),
  refineChat:    (body) => post('/api/refine_chat',    body),
  personaUpdate: (body) => post('/api/persona_update', body),
  accountReview: (body) => post('/api/account_review', body),
};
