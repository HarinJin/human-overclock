// ═══════════════════════════════════════════════════════════
// Warning Ticker
// ═══════════════════════════════════════════════════════════
import { TICKER_MESSAGES, TICKER_MAX_LINES } from './config.js';
import { state, dom } from './state.js';

function scheduleNextTickerMessage() {
  if (!state.tickerActive) return;

  const speed = state.currentPhase === 'critical' ? 1500 : 3000;
  state.tickerInterval = setTimeout(() => {
    if (!state.tickerActive) return;
    addTickerMessage(TICKER_MESSAGES[state.tickerMsgIndex % TICKER_MESSAGES.length]);
    state.tickerMsgIndex++;
    scheduleNextTickerMessage();
  }, speed);
}

function addTickerMessage(fullText) {
  const line = document.createElement('div');
  line.className = 'ticker-line';
  dom.tickerMessages.appendChild(line);
  state.tickerLineElements.push(line);

  state.tickerLineElements.forEach((el, i) => {
    if (i < state.tickerLineElements.length - 1) {
      el.classList.add('fading');
      el.classList.remove('active');
    }
  });

  while (state.tickerLineElements.length > TICKER_MAX_LINES) {
    const removed = state.tickerLineElements.shift();
    removed.style.transition = 'opacity 0.3s, height 0.3s, margin 0.3s, padding 0.3s';
    removed.style.opacity = '0';
    removed.style.height = '0';
    removed.style.minHeight = '0';
    removed.style.margin = '0';
    removed.style.padding = '0';
    setTimeout(() => removed.remove(), 300);
  }

  let charIndex = 0;
  const typeSpeed = state.currentPhase === 'critical' ? 15 : 30;

  function typeChar() {
    if (!state.tickerActive) return;
    if (charIndex <= fullText.length) {
      line.innerHTML = fullText.substring(0, charIndex) + '<span class="ticker-cursor"></span>';
      line.classList.add('active');
      charIndex++;
      state.tickerTypingTimeout = setTimeout(typeChar, typeSpeed);
    } else {
      line.innerHTML = fullText;
    }
  }

  typeChar();
}

export function startTicker() {
  if (state.tickerActive) return;
  state.tickerActive = true;
  dom.warningTicker.classList.add('visible');
  dom.tickerMessages.innerHTML = '';
  state.tickerLineElements = [];
  state.tickerMsgIndex = 0;
  scheduleNextTickerMessage();
}

export function stopTicker() {
  state.tickerActive = false;
  dom.warningTicker.classList.remove('visible');
  if (state.tickerInterval) clearTimeout(state.tickerInterval);
  if (state.tickerTypingTimeout) clearTimeout(state.tickerTypingTimeout);
  state.tickerInterval = null;
  state.tickerTypingTimeout = null;
}
