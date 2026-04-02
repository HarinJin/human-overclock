// ═══════════════════════════════════════════════════════════
// NEURAL OVERCLOCK SYSTEM v2.7 — Entry Point
// ═══════════════════════════════════════════════════════════
import { BIOMETRICS, WARNING_FLOOD_LINES, CALORIE_MAX } from './config.js';
import { state, dom, initDOM } from './state.js';
import { buildStats, buildBiometrics, updateAll, updateCalorieUI } from './ui.js';
import { startLogStream, addBootSequence, addLog } from './log.js';
import { startNeuralWave } from './neural.js';
import { startCalorieDrain } from './calorie.js';
import { triggerShutdown } from './shutdown.js';
import { initPopups, updatePopups, clearAllPopups } from './popups.js';

function buildWarningFlood() {
  const scrollEl = document.getElementById('warningBgScroll');
  let html = '';
  const totalLines = 80;
  for (let i = 0; i < totalLines; i++) {
    const line = WARNING_FLOOD_LINES[i % WARNING_FLOOD_LINES.length];
    const repeated = line.repeat(8);
    html += `<div>${repeated}</div>`;
  }
  scrollEl.innerHTML = html;
}

function init() {
  initDOM();
  buildStats();
  buildBiometrics();
  buildWarningFlood();
  updateAll(1.0);
  startLogStream();
  startNeuralWave();
  startCalorieDrain();
  addBootSequence();
  initPopups();

  dom.clockSlider.addEventListener('input', (e) => {
    if (state.isShuttingDown) return;
    const val = parseInt(e.target.value) / 10;
    state.currentClock = val;
    updateAll(val);
    const sliderHint = document.getElementById('sliderHint');
    if (val > 1.0) sliderHint.classList.add('hidden');
    else sliderHint.classList.remove('hidden');
  });

  dom.shutdownBtn.addEventListener('click', () => {
    if (!state.isShuttingDown) triggerShutdown();
  });

  const feedBtn = document.getElementById('feedBtn');
  feedBtn.addEventListener('click', () => {
    if (feedBtn.classList.contains('cooldown')) return;
    state.calorieRemaining = Math.min(CALORIE_MAX, state.calorieRemaining + 400);
    updateCalorieUI();
    addLog({ tag: 'SYS', cls: 'sys', msg: '음식 섭취 — 400 kcal 보충 / Nutrient intake: +400 kcal', msgCls: '' });
    feedBtn.classList.add('cooldown');
    feedBtn.textContent = '소화중...';
    setTimeout(() => {
      feedBtn.classList.remove('cooldown');
      feedBtn.textContent = '음식섭취';
    }, 3000);
  });

  // Emergency cooldown button
  const emergencyCooldownBtn = document.getElementById('emergencyCooldownBtn');
  if (emergencyCooldownBtn) {
    emergencyCooldownBtn.addEventListener('click', () => {
      if (state.isShuttingDown) return;
      // Animate clock down to 2.0 GHz (partial cooldown)
      const targetClock = 2.0;
      const startClock = state.currentClock;
      const startTime = performance.now();
      const duration = 800;

      addLog({ tag: 'SYS', cls: 'warn', msg: '긴급 냉각 실행 — Emergency cooldown engaged // 緊急冷却', msgCls: 'warn-msg' });

      function coolStep(now) {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / duration);
        const eased = 1 - Math.pow(1 - progress, 3);
        const newClock = startClock + (targetClock - startClock) * eased;

        state.currentClock = Math.round(newClock * 10) / 10;
        dom.clockSlider.value = Math.round(state.currentClock * 10);
        updateAll(state.currentClock);

        if (progress < 1) {
          requestAnimationFrame(coolStep);
        } else {
          state.currentClock = targetClock;
          dom.clockSlider.value = Math.round(targetClock * 10);
          updateAll(targetClock);
          addLog({ tag: 'SYS', cls: 'sys', msg: '냉각 완료 — 클럭 2.0 GHz 안정화 / Cooldown complete', msgCls: '' });
        }
      }

      requestAnimationFrame(coolStep);
    });
  }
}

// Biometric live update
state.biometricsInterval = setInterval(() => {
  if (state.isShuttingDown) return;
  const t = (state.currentClock - 1.0) / 4.0;
  BIOMETRICS.forEach(b => {
    const el = document.getElementById(`bioval-${b.id}`);
    if (el) el.textContent = b.calc(t);
  });
}, 1000);

// CRT Curve control
const crtSlider = document.getElementById('crtCurveSlider');
const crtValue = document.getElementById('crtCurveValue');
const crtDispMap = document.getElementById('crt-disp-map');
const crtVignette = document.getElementById('crtVignette');

if (crtSlider && crtDispMap) {
  crtSlider.addEventListener('input', (e) => {
    const val = parseInt(e.target.value);
    crtDispMap.setAttribute('scale', val);
    if (crtValue) crtValue.textContent = val;

    if (val > 0) {
      document.body.classList.add('crt-active');
      if (crtVignette) crtVignette.classList.add('active');
    } else {
      document.body.classList.remove('crt-active');
      if (crtVignette) crtVignette.classList.remove('active');
    }
  });
}

init();
