// ═══════════════════════════════════════════════════════════
// Mutable State & DOM References
// ═══════════════════════════════════════════════════════════
import { CALORIE_MAX } from './config.js';

export const state = {
  currentClock: 1.0,
  currentPhase: 'standard',
  logInterval: null,
  neuralAnimFrame: null,
  isShuttingDown: false,
  sliderDisabledTimeout: null,
  weightLossValue: 0,
  weightLossInterval: null,
  currentWeightTickSpeed: 0,
  calorieRemaining: CALORIE_MAX,
  calorieLastTime: performance.now(),
  calorieAnimFrame: null,
  biometricsInterval: null,
  tickerActive: false,
  tickerInterval: null,
  tickerMsgIndex: 0,
  tickerTypingTimeout: null,
  tickerLineElements: [],
};

export const dom = {};

export function initDOM() {
  dom.clockSlider = document.getElementById('clockSlider');
  dom.clockDisplay = document.getElementById('clockDisplay');
  dom.phaseBadge = document.getElementById('phaseBadge');
  dom.sliderFill = document.getElementById('sliderFill');
  dom.statsGrid = document.getElementById('statsGrid');
  dom.biometrics = document.getElementById('biometrics');
  dom.logBody = document.getElementById('logBody');
  dom.logDot = document.getElementById('logDot');
  dom.statusDot = document.getElementById('statusDot');
  dom.statusLabel = document.getElementById('statusLabel');
  dom.neuralCanvas = document.getElementById('neuralCanvas');
  dom.ctx = dom.neuralCanvas.getContext('2d');
  dom.shutdownContainer = document.getElementById('shutdownContainer');
  dom.shutdownBtn = document.getElementById('shutdownBtn');
  dom.blackoutOverlay = document.getElementById('blackoutOverlay');
  dom.rebootOverlay = document.getElementById('rebootOverlay');
  dom.rebootText = document.getElementById('rebootText');
  dom.rebootProgressBar = document.getElementById('rebootProgressBar');
  dom.rebootProgressFill = document.getElementById('rebootProgressFill');
  dom.overclockBanner = document.getElementById('overclockBanner');
  dom.warningTicker = document.getElementById('warningTicker');
  dom.tickerMessages = document.getElementById('tickerMessages');
  dom.calorieBarFill = document.getElementById('calorieBarFill');
  dom.calorieValueEl = document.getElementById('calorieValue');
  dom.caloriePercentEl = document.getElementById('caloriePercent');
}
