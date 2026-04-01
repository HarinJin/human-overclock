// ═══════════════════════════════════════════════════════════
// Neon Popup System — 랜덤 스폰 + 자동 소멸
// ═══════════════════════════════════════════════════════════
import { state } from './state.js';

// ── 팝업 템플릿 풀 ──
const POPUP_TEMPLATES = {
  amber: [
    { title: 'ORGAN ALERT — 腎臓', main: 'RENAL FUNCTION DECLINING', detail: 'GFR dropped below 60 mL/min\nAcute kidney injury risk: HIGH', cjk: '糸球体濾過率低下' },
    { title: 'ORGAN ALERT — 心臓', main: 'CARDIAC ARRHYTHMIA RISK', detail: 'Heart rate: 142 bpm\nPotassium: critically low', cjk: '心拍異常警告' },
    { title: '⚠ THERMAL — 熱暴走', main: 'CALORIC BURN EXCEEDING LIMIT', detail: 'Burn rate: 770 kcal/h\nFat reserve depleting', cjk: '熱暴走警告' },
    { title: '⚠ METABOLIC', main: 'ELECTROLYTE IMBALANCE', detail: 'Na+/K+ ratio critical\nCreatinine rising', cjk: '電解質異常' },
    { title: 'ORGAN ALERT — 膵臓', main: 'PANCREATIC STRESS', detail: 'Insulin spike detected\nGlucose: 38 mg/dL', cjk: '膵機能低下' },
  ],
  red: [
    { title: 'CRITICAL — 大脳皮質', main: 'COGNITIVE COHERENCE FAILURE', detail: 'Memory sectors corrupting\nShort-term recall: OFFLINE', cjk: '記憶崩壊 — 「お前は誰だ」' },
    { title: 'CRITICAL — 肝臓', main: 'HEPATIC ENZYME SURGE', detail: 'AST/ALT levels critical\nIrreversible hepatocyte damage', cjk: '肝細胞壊死進行中' },
    { title: 'CRITICAL — 肺', main: 'PULMONARY EDEMA ONSET', detail: 'SpO2: 84%\nFluid in alveoli detected', cjk: '肺水腫発生' },
    { title: 'CRITICAL — 脊髄', main: 'SPINAL CORD SIGNAL LOSS', detail: 'Reflex arc: DEGRADED\nMotor control: FAILING', cjk: '脊髄信号喪失' },
    { title: '⚠ EMPATHY — 共感', main: 'EMPATHY MODULE OFFLINE', detail: 'Emotional recognition: 0%\nSocial cognition: ABSENT', cjk: '共感機能喪失' },
  ],
  critical: [
    { title: '☠ FATAL — 全身', main: 'ORGAN FAILURE CASCADE', detail: 'Multiple organ systems failing\nProtein denaturation in progress', cjk: '臓器不全連鎖 — 不可逆' },
    { title: '☠ FATAL — 脳幹', main: 'BRAINSTEM SHUTDOWN', detail: 'Autonomic functions: OFFLINE\nRespiration: MANUAL OVERRIDE', cjk: '脳幹機能停止' },
    { title: '☠ FATAL — 心停止', main: 'CARDIAC ARREST IMMINENT', detail: 'Ventricular fibrillation\nDefibrillation required', cjk: '心停止警告' },
  ],
};

// ── 단계별 설정 ──
// spawnInterval: 생성 간격(ms), maxActive: 동시 활성 최대, cls: 색상
const PHASE_CONFIG = [
  { minTemp: 38.5, maxTemp: 39.5, cls: 'amber',    spawnInterval: 4000, maxActive: 2 },
  { minTemp: 39.5, maxTemp: 40.5, cls: 'red',       spawnInterval: 2500, maxActive: 4 },
  { minTemp: 40.5, maxTemp: 42.0, cls: 'critical',  spawnInterval: 1500, maxActive: 6 },
];

const POPUP_LIFETIME = 3000; // 3초 표시 후 자동 소멸

let popupContainer = null;
let spawnTimer = null;
let popupIdCounter = 0;
let activeCount = 0;

function getCoreTempFromClock(clock) {
  return 36.8 + ((clock - 1.0) / 4.0) * 4.2;
}

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getActiveConfig(coreTemp) {
  // 가장 높은 매칭 단계 반환 (복수 단계 동시 활성 가능)
  const configs = PHASE_CONFIG.filter(c => coreTemp >= c.minTemp);
  return configs.length > 0 ? configs[configs.length - 1] : null;
}

function spawnPopup(cls) {
  const templates = POPUP_TEMPLATES[cls] || POPUP_TEMPLATES.amber;
  const tmpl = pickRandom(templates);
  const id = `spawn-${popupIdCounter++}`;

  const div = document.createElement('div');
  div.className = `neon-popup ${cls}`;
  div.setAttribute('role', 'alert');
  div.setAttribute('aria-live', 'assertive');
  div.id = `popup-${id}`;

  // 랜덤 위치 (컨테이너 내)
  const top = randomBetween(5, 70);
  const left = randomBetween(3, 55);
  div.style.top = `${top}%`;
  div.style.left = `${left}%`;

  div.innerHTML = `
    <div class="neon-popup-header">
      <div class="neon-popup-title">${tmpl.title}</div>
      <div class="neon-popup-close">×</div>
    </div>
    <div class="neon-popup-body">
      <div class="neon-popup-main">${tmpl.main}</div>
      <div class="neon-popup-detail">${tmpl.detail.replace(/\n/g, '<br>')}</div>
      <div class="neon-popup-cjk">${tmpl.cjk}</div>
    </div>
  `;

  // X 버튼 — 닫히지 않음 (흔들림)
  const closeBtn = div.querySelector('.neon-popup-close');
  closeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    div.style.animation = 'none';
    div.offsetHeight;
    div.style.animation = 'popupDeny 0.3s ease';
    setTimeout(() => { div.style.animation = ''; }, 300);
  });

  popupContainer.appendChild(div);
  activeCount++;

  // 등장 애니메이션 (fade in)
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      div.classList.add('visible');
    });
  });

  // 3초 후 자동 소멸
  setTimeout(() => {
    div.classList.add('dying');
    div.classList.remove('visible');
    setTimeout(() => {
      div.remove();
      activeCount--;
    }, 600);
  }, POPUP_LIFETIME);
}

function startSpawnLoop() {
  stopSpawnLoop();

  function tick() {
    if (state.isShuttingDown || !popupContainer) return;

    const coreTemp = getCoreTempFromClock(state.currentClock);
    const config = getActiveConfig(coreTemp);

    if (config && activeCount < config.maxActive) {
      spawnPopup(config.cls);
    }

    // 다음 스폰 스케줄 (약간의 랜덤성)
    if (config) {
      const jitter = randomBetween(0.6, 1.4);
      spawnTimer = setTimeout(tick, config.spawnInterval * jitter);
    } else {
      spawnTimer = setTimeout(tick, 2000);
    }
  }

  tick();
}

function stopSpawnLoop() {
  if (spawnTimer) {
    clearTimeout(spawnTimer);
    spawnTimer = null;
  }
}

export function initPopups() {
  popupContainer = document.createElement('div');
  popupContainer.className = 'popup-container';
  const mainContainer = document.querySelector('.main-container');
  mainContainer.appendChild(popupContainer);

  // Deny + dying 애니메이션
  const style = document.createElement('style');
  style.textContent = `
    @keyframes popupDeny {
      0%, 100% { transform: scale(1) translateX(0); }
      20% { transform: scale(1) translateX(-6px); }
      40% { transform: scale(1) translateX(6px); }
      60% { transform: scale(1) translateX(-4px); }
      80% { transform: scale(1) translateX(4px); }
    }
  `;
  document.head.appendChild(style);
}

export function updatePopups(clock) {
  if (!popupContainer) return;

  const coreTemp = getCoreTempFromClock(clock);
  const config = getActiveConfig(coreTemp);

  if (config && !state.isShuttingDown) {
    if (!spawnTimer) startSpawnLoop();
  } else {
    stopSpawnLoop();
  }
}

export function clearAllPopups() {
  stopSpawnLoop();
  if (!popupContainer) return;
  popupContainer.innerHTML = '';
  activeCount = 0;
}
