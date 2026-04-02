// ═══════════════════════════════════════════════════════════
// UI Update Cycle
// ═══════════════════════════════════════════════════════════
import { STATS, BIOMETRICS, PHASES, CALORIE_MAX } from './config.js';
import { state, dom } from './state.js';
import { applyInterpolatedColor, lerpColor, rgbToHex } from './color.js';
import { addLog, restartLogStream } from './log.js';
import { updateBrainRegions } from './brain.js';
import { startTicker, stopTicker } from './ticker.js';
import { updatePopups } from './popups.js';
import { STAT_COMMENTS, CALORIE_MILESTONES, CALORIE_WARNINGS, SLIDER_HINTS, BRAIN_TITLES } from './config.js';

export function buildStats() {
  dom.statsGrid.innerHTML = STATS.map(s => `
    <div class="stat-card" id="card-${s.id}" data-type="${s.type}">
      <div class="stat-header">
        <span class="stat-name">${s.icon} ${s.name}</span>
        <span class="stat-value" id="val-${s.id}">${s.base}</span>
      </div>
      <div class="stat-bar-bg">
        <div class="stat-bar-fill" id="bar-${s.id}" style="width: ${s.base}%; background: var(--accent);"></div>
      </div>
      <div class="stat-delta" id="delta-${s.id}">+0</div>
    </div>
  `).join('');
}

export function buildBiometrics() {
  dom.biometrics.innerHTML = BIOMETRICS.map(b => `
    <div class="bio-item" id="bio-${b.id}">
      <div class="bio-label">${b.name}</div>
      <div class="bio-value">
        <span id="bioval-${b.id}">${b.base}</span>
        <span class="bio-unit">${b.unit}</span>
      </div>
    </div>
  `).join('');
}

export function getPhase(clock) {
  for (let i = PHASES.length - 1; i >= 0; i--) {
    if (clock >= PHASES[i].threshold) return PHASES[i];
  }
  return PHASES[0];
}

function getStatComment(statId, value) {
  const comments = STAT_COMMENTS[statId];
  if (!comments) return '';
  // For negative stats (empathy, stability): lower value = worse
  const stat = STATS.find(s => s.id === statId);
  if (stat && stat.type === 'negative') {
    for (const c of comments) {
      if (value <= c.threshold) return c.text;
    }
  } else {
    for (const c of comments) {
      if (value >= c.threshold) return c.text;
    }
  }
  return '';
}

function getCalorieMilestone(remaining) {
  for (const m of CALORIE_MILESTONES) {
    if (remaining <= m.remaining) return m.text;
  }
  return '';
}

function getSliderHint(clock) {
  for (const h of SLIDER_HINTS) {
    if (clock >= h.threshold) return h.text;
  }
  return SLIDER_HINTS[SLIDER_HINTS.length - 1].text;
}

function getBrainTitle(clock) {
  for (const t of BRAIN_TITLES) {
    if (clock >= t.threshold) return t.text;
  }
  return BRAIN_TITLES[BRAIN_TITLES.length - 1].text;
}

export function updateWeightTickerStyle(el) {
  el.textContent = `LOSING WEIGHT... ${state.weightLossValue}g`;
  const scale = Math.min(40, 18 + state.weightLossValue * 0.11);
  const weight = state.weightLossValue > 80 ? 900 : state.weightLossValue > 40 ? 700 : 500;
  el.style.fontSize = scale + 'px';
  el.style.fontWeight = weight;
  const glowSize = Math.min(40, 15 + state.weightLossValue * 0.12);
  const glowAlpha = Math.min(0.8, 0.4 + state.weightLossValue * 0.002);
  el.style.textShadow = `0 0 ${glowSize}px rgba(255, 42, 94, ${glowAlpha})`;
}

export function updateCalorieUI() {
  const percent = (state.calorieRemaining / CALORIE_MAX) * 100;
  dom.calorieBarFill.style.height = `${percent}%`;
  dom.calorieValueEl.textContent = Math.round(state.calorieRemaining);
  dom.caloriePercentEl.textContent = `${Math.round(percent)}%`;

  dom.calorieBarFill.classList.remove('yellow', 'orange', 'red');
  if (percent <= 25) dom.calorieBarFill.classList.add('red');
  else if (percent <= 40) dom.calorieBarFill.classList.add('orange');
  else if (percent <= 70) dom.calorieBarFill.classList.add('yellow');

  const feedBtn = document.getElementById('feedBtn');
  feedBtn.classList.toggle('visible', percent < 95);

  // Calorie milestone text
  let milestoneEl = document.getElementById('calorieMilestone');
  if (!milestoneEl) {
    milestoneEl = document.createElement('div');
    milestoneEl.id = 'calorieMilestone';
    milestoneEl.className = 'calorie-milestone';
    dom.calorieValueEl.parentElement.insertBefore(milestoneEl, dom.calorieValueEl.nextSibling);
  }
  const milestone = getCalorieMilestone(state.calorieRemaining);
  milestoneEl.textContent = milestone;

  // Dynamic feed button text
  if (percent <= 20) {
    feedBtn.textContent = '⚠ 긴급 섭취';
  } else if (percent <= 50) {
    feedBtn.textContent = '긴급 보충';
  } else {
    feedBtn.textContent = '영양 보충';
  }

  // Calorie depletion warning
  const calorieWarnBanner = document.getElementById('banner-caloric');
  if (calorieWarnBanner && percent <= 20) {
    calorieWarnBanner.textContent = '⚠ ENERGY RESERVES CRITICAL — 強制停止迫る ⚠';
    calorieWarnBanner.className = 'tier2-banner red visible';
  }
}

export function updateAll(clock) {
  const t = (clock - 1.0) / 4.0;
  const phase = getPhase(clock);

  applyInterpolatedColor(clock);
  const c = lerpColor(clock);
  const hex = rgbToHex(c.r, c.g, c.b);

  dom.clockDisplay.textContent = clock.toFixed(1);
  dom.sliderFill.style.width = `${t * 100}%`;

  const clockSide = document.getElementById('clockSideDisplay');
  if (clockSide) clockSide.textContent = clock.toFixed(1);

  const phaseChanged = phase.cls !== state.currentPhase;
  if (phaseChanged) {
    document.body.setAttribute('data-phase', phase.cls);
    state.currentPhase = phase.cls;
    addLog(phase.cls === 'standard'
      ? { tag: 'SYS', cls: 'sys', msg: `페이즈 전환: ${phase.name} — Phase transition: ${phase.name}`, msgCls: '' }
      : { tag: phase.cls === 'critical' ? '!!!' : 'WRN', cls: phase.cls === 'critical' ? 'crit' : 'warn', msg: `페이즈 변경: ${phase.name} — PHASE SHIFT: ${phase.name}`, msgCls: phase.cls === 'critical' ? 'crit-msg' : 'warn-msg' }
    );
    restartLogStream();
  }

  dom.phaseBadge.textContent = phase.label;
  dom.phaseBadge.style.borderColor = hex;
  dom.phaseBadge.style.color = hex;
  dom.phaseBadge.style.boxShadow = `0 0 20px ${hex}33`;

  const phaseIndex = PHASES.indexOf(phase);
  for (let i = 0; i < 4; i++) {
    document.getElementById(`zone${i}`).classList.toggle('active', i <= phaseIndex);
  }

  // Stats
  STATS.forEach(s => {
    let value, delta;
    if (s.type === 'positive') {
      delta = Math.round(s.maxGain * t);
      value = s.base + delta;
    } else {
      delta = -Math.round(s.maxLoss * t);
      value = Math.max(0, s.base + delta);
    }
    const valEl = document.getElementById(`val-${s.id}`);
    const barEl = document.getElementById(`bar-${s.id}`);
    const deltaEl = document.getElementById(`delta-${s.id}`);
    const cardEl = document.getElementById(`card-${s.id}`);

    valEl.textContent = value;
    // Stat comment
    let commentEl = document.getElementById(`comment-${s.id}`);
    if (!commentEl) {
      commentEl = document.createElement('div');
      commentEl.id = `comment-${s.id}`;
      commentEl.className = 'stat-comment';
      cardEl.appendChild(commentEl);
    }
    const comment = getStatComment(s.id, value);
    commentEl.textContent = comment;
    commentEl.style.display = comment ? 'block' : 'none';
    barEl.style.width = `${Math.min(100, value)}%`;

    if (s.type === 'positive') {
      barEl.style.background = hex;
      deltaEl.textContent = `+${delta}`;
      deltaEl.className = 'stat-delta positive';
    } else {
      barEl.style.background = value < 30 ? '#ff0040' : value < 50 ? '#ff6b35' : hex;
      deltaEl.textContent = `${delta}`;
      deltaEl.className = 'stat-delta negative';
      cardEl.classList.toggle('warning', value < 40);
      cardEl.classList.toggle('negative-warn', s.type === 'negative' && value < 50);
    }
  });

  // Biometrics
  BIOMETRICS.forEach(b => {
    const el = document.getElementById(`bioval-${b.id}`);
    if (el) el.textContent = b.calc(t);
  });

  // Status
  dom.statusLabel.textContent = phase.name;
  dom.statusDot.style.background = hex;
  dom.statusDot.style.boxShadow = `0 0 8px ${hex}`;
  dom.logDot.style.background = hex;

  // SHUTDOWN button visibility
  dom.shutdownContainer.classList.toggle('visible', clock >= 3.0 && !state.isShuttingDown);

  // Calorie Overclock Banner
  dom.overclockBanner.classList.toggle('visible', clock >= 3.0 && !state.isShuttingDown);

  // Warning background flood
  const warningFlood = document.getElementById('warningBgFlood');
  warningFlood.classList.toggle('active', clock >= 3.0 && !state.isShuttingDown);

  // Weight loss ticker
  const weightTicker = document.getElementById('weightLossTicker');
  if (clock > 1.0 && !state.isShuttingDown) {
    weightTicker.classList.add('visible');
    let tickSpeed;
    if (clock >= 4.0) tickSpeed = 250;
    else if (clock >= 3.0) tickSpeed = 500;
    else if (clock >= 2.0) tickSpeed = 1000;
    else tickSpeed = 2000;

    if (!state.weightLossInterval || state.currentWeightTickSpeed !== tickSpeed) {
      if (state.weightLossInterval) clearInterval(state.weightLossInterval);
      state.currentWeightTickSpeed = tickSpeed;
      updateWeightTickerStyle(weightTicker);
      state.weightLossInterval = setInterval(() => {
        state.weightLossValue += 1;
        updateWeightTickerStyle(weightTicker);
      }, tickSpeed);
    }
  } else {
    weightTicker.classList.remove('visible');
    if (state.weightLossInterval) {
      clearInterval(state.weightLossInterval);
      state.weightLossInterval = null;
      state.currentWeightTickSpeed = 0;
      state.weightLossValue = 0;
    }
  }

  // Warning ticker
  if (clock >= 3.0 && !state.tickerActive && !state.isShuttingDown) {
    startTicker();
  } else if (clock < 3.0 && state.tickerActive) {
    stopTicker();
  }

  // Dynamic UX text
  const sliderHint = document.getElementById('sliderHint');
  if (sliderHint) sliderHint.textContent = getSliderHint(clock);

  const brainTitle = document.getElementById('brainTitle');
  if (brainTitle) brainTitle.textContent = getBrainTitle(clock);

  // Brain regions
  updateBrainRegions(clock);

  // Progressive disclosure — reveal elements as clock increases
  const statsGrid = document.querySelector('.stats-grid');
  const logSection = document.querySelector('.log-section');
  const calorieGauge = document.querySelector('.calorie-gauge');

  if (statsGrid) statsGrid.classList.toggle('awakened', clock > 1.2);
  if (logSection) logSection.classList.toggle('awakened', clock > 1.0);
  if (calorieGauge) calorieGauge.classList.toggle('active', clock > 1.0);

  // Neon popups
  updatePopups(clock);

  // Tier 2 banners
  const bannerCaloric = document.getElementById('banner-caloric');
  const bannerEmpathy = document.getElementById('banner-empathy');
  const bannerThermal = document.getElementById('banner-thermal');
  if (bannerCaloric) bannerCaloric.classList.toggle('visible', clock >= 2.0 && !state.isShuttingDown);
  if (bannerEmpathy) bannerEmpathy.classList.toggle('visible', clock >= 2.5 && !state.isShuttingDown);
  if (bannerThermal) bannerThermal.classList.toggle('visible', clock >= 3.5 && !state.isShuttingDown);

  // Tier 3 fullscreen alert (flash at 3.5+ GHz, brief appearance)
  const tier3 = document.getElementById('tier3Alert');
  if (tier3) {
    const showTier3 = clock >= 3.5 && !state.isShuttingDown;
    tier3.classList.toggle('visible', showTier3);
    if (showTier3 && clock >= 4.0) {
      const tier3En = document.getElementById('tier3En');
      const tier3Cjk = document.getElementById('tier3Cjk');
      const tier3Sub = document.getElementById('tier3Sub');
      if (tier3En) tier3En.textContent = 'THERMAL LIMIT EXCEEDED';
      if (tier3Cjk) tier3Cjk.textContent = '熱限界超過';
      if (tier3Sub) tier3Sub.textContent = 'CORE TEMP 41.0°C+ — ORGAN FAILURE CASCADE INITIATING';
    }
  }

  // Emergency cooldown button — visible at 3.5+ GHz alongside Tier 3
  const emergencyContainer = document.getElementById('emergencyCooldownContainer');
  if (emergencyContainer) {
    emergencyContainer.classList.toggle('visible', clock >= 3.5 && !state.isShuttingDown);
  }

  // Background color transition
  if (clock < 2.0) document.body.style.background = '#080a10';
  else if (clock < 3.0) document.body.style.background = '#0c0a06';
  else if (clock < 4.0) document.body.style.background = '#0a0406';
  else document.body.style.background = '#060000';
}
