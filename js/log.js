// ═══════════════════════════════════════════════════════════
// Log System
// ═══════════════════════════════════════════════════════════
import { LOG_MESSAGES } from './config.js';
import { state, dom } from './state.js';

function getLogSpeed() {
  switch (state.currentPhase) {
    case 'critical': return 600;
    case 'overdrive': return 1200;
    case 'enhanced': return 2000;
    default: return 3000;
  }
}

export function addLog(entry) {
  const time = new Date().toLocaleTimeString('en-US', { hour12: false });
  const el = document.createElement('div');
  el.className = 'log-entry';
  el.innerHTML = `<span class="log-time">${time}</span> <span class="log-tag ${entry.cls}">[${entry.tag}]</span> <span class="log-msg ${entry.msgCls}">${entry.msg}</span>`;
  dom.logBody.appendChild(el);
  dom.logBody.scrollTop = dom.logBody.scrollHeight;

  while (dom.logBody.children.length > 50) {
    dom.logBody.removeChild(dom.logBody.firstChild);
  }
}

export function startLogStream() {
  if (state.logInterval) clearInterval(state.logInterval);
  const speed = getLogSpeed();
  state.logInterval = setInterval(() => {
    const pool = LOG_MESSAGES[state.currentPhase] || LOG_MESSAGES.standard;
    const msg = pool[Math.floor(Math.random() * pool.length)];
    addLog(msg);
  }, speed);
}

export function restartLogStream() {
  clearInterval(state.logInterval);
  const speed = getLogSpeed();
  state.logInterval = setInterval(() => {
    const pool = LOG_MESSAGES[state.currentPhase] || LOG_MESSAGES.standard;
    const msg = pool[Math.floor(Math.random() * pool.length)];
    addLog(msg);
  }, speed);
}

export function addBootSequence() {
  const bootMsgs = [
    { tag: 'SYS', cls: 'sys', msg: '뉴럴 오버클럭 시스템 v2.7 초기화 중... — Initializing...', msgCls: '' },
    { tag: 'SYS', cls: 'sys', msg: '피질 인터페이스: 연결됨 — Cortex interface: CONNECTED', msgCls: '' },
    { tag: 'SYS', cls: 'sys', msg: '기준 뉴럴 맵: 로드 완료 — Baseline neural map: LOADED', msgCls: '' },
    { tag: 'SYS', cls: 'sys', msg: '모든 하위 시스템 정상 — All subsystems nominal', msgCls: '' },
  ];
  bootMsgs.forEach((msg, i) => {
    setTimeout(() => addLog(msg), i * 400);
  });
}
