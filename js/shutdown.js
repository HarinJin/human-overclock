// ═══════════════════════════════════════════════════════════
// Shutdown & Reboot Sequence
// ═══════════════════════════════════════════════════════════
import { state, dom } from './state.js';
import { addLog } from './log.js';
import { updateAll } from './ui.js';

function animateClockDown(target, duration, callback) {
  const startClock = state.currentClock;
  const startTime = performance.now();

  function step(now) {
    const elapsed = now - startTime;
    const progress = Math.min(1, elapsed / duration);
    const eased = 1 - Math.pow(1 - progress, 3);
    const newClock = startClock + (target - startClock) * eased;

    state.currentClock = Math.round(newClock * 10) / 10;
    dom.clockSlider.value = Math.round(state.currentClock * 10);
    updateAll(state.currentClock);

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      state.currentClock = target;
      dom.clockSlider.value = Math.round(target * 10);
      updateAll(target);
      if (callback) callback();
    }
  }

  requestAnimationFrame(step);
}

function playRebootSequence(callback) {
  const mainContainer = document.querySelector('.main-container');
  dom.rebootOverlay.classList.add('active');
  dom.rebootText.textContent = '';
  dom.rebootText.classList.remove('visible');
  dom.rebootProgressBar.classList.remove('visible');
  dom.rebootProgressFill.style.width = '0%';

  let flickerCount = 0;
  const flickerTotal = 6;
  const flickerInterval = setInterval(() => {
    if (flickerCount % 2 === 0) {
      dom.rebootOverlay.style.background = '#000';
    } else {
      dom.rebootOverlay.style.background = 'rgba(0, 240, 255, 0.03)';
    }
    flickerCount++;
    if (flickerCount >= flickerTotal) {
      clearInterval(flickerInterval);
      dom.rebootOverlay.style.background = '#000';
      startRebootText();
    }
  }, 100);

  function startRebootText() {
    const bootLines = [
      'NEURAL CORTEX INTERFACE v2.7',
      'BIOS CHECK... OK',
      '뉴럴 경로 재초기화 중...',
      'SYNAPTIC ARRAY: RESET',
      '감정 모듈 복원 중...',
      'SYSTEM REBOOTING...',
    ];

    let lineIdx = 0;
    dom.rebootText.classList.add('visible');

    const lineTimer = setInterval(() => {
      if (lineIdx < bootLines.length) {
        dom.rebootText.textContent = bootLines[lineIdx];
        dom.rebootText.classList.add('reboot-flicker');
        setTimeout(() => dom.rebootText.classList.remove('reboot-flicker'), 200);
        lineIdx++;
      } else {
        clearInterval(lineTimer);
        startRebootProgress();
      }
    }, 400);
  }

  function startRebootProgress() {
    dom.rebootProgressBar.classList.add('visible');
    let progress = 0;

    const progTimer = setInterval(() => {
      progress += 2 + Math.random() * 5;
      if (progress > 100) progress = 100;
      dom.rebootProgressFill.style.width = progress + '%';

      if (progress >= 100) {
        clearInterval(progTimer);

        setTimeout(() => {
          dom.rebootText.textContent = '시스템 온라인 — SYSTEM ONLINE';
          dom.rebootText.classList.add('reboot-flicker');

          setTimeout(() => {
            dom.rebootText.classList.remove('reboot-flicker');

            let revealFlicker = 0;
            const revealTimer = setInterval(() => {
              dom.rebootOverlay.style.opacity = revealFlicker % 2 === 0 ? '0.3' : '1';
              revealFlicker++;
              if (revealFlicker >= 6) {
                clearInterval(revealTimer);
                dom.rebootOverlay.classList.remove('active');
                dom.rebootOverlay.style.opacity = '';
                dom.rebootOverlay.style.background = '';

                mainContainer.classList.add('reboot-screen-flash');
                setTimeout(() => mainContainer.classList.remove('reboot-screen-flash'), 300);

                addLog({ tag: 'SYS', cls: 'sys', msg: '시스템 재부팅 완료 — System reboot complete', msgCls: '' });
                addLog({ tag: 'SYS', cls: 'sys', msg: '시스템 대기 중 — Standby', msgCls: '' });

                if (callback) callback();
              }
            }, 80);
          }, 500);
        }, 400);
      }
    }, 50);
  }
}

export function triggerShutdown() {
  state.isShuttingDown = true;
  dom.shutdownContainer.classList.remove('visible');
  dom.overclockBanner.classList.remove('visible');

  dom.blackoutOverlay.classList.add('active');

  const shutdownMsgs = [
    { tag: 'SYS', cls: 'crit', msg: '긴급 셧다운 요청 수신 — Emergency shutdown initiated', msgCls: 'crit-msg' },
    { tag: 'SYS', cls: 'warn', msg: `뉴럴 클럭 감속 중... ${state.currentClock.toFixed(1)} → 1.0 — Decelerating...`, msgCls: 'warn-msg' },
    { tag: 'SYS', cls: 'warn', msg: '모든 증강 모듈 비활성화 — All enhancement modules: OFF', msgCls: 'warn-msg' },
    { tag: 'SYS', cls: 'sys', msg: '휴면 모드 진입 — Entering hibernation...', msgCls: '' },
  ];

  shutdownMsgs.forEach((msg, i) => {
    setTimeout(() => addLog(msg), i * 350);
  });

  setTimeout(() => {
    animateClockDown(1.0, 1500, () => {
      dom.clockSlider.disabled = true;

      setTimeout(() => {
        dom.blackoutOverlay.classList.remove('active');
        playRebootSequence(() => {
          dom.clockSlider.disabled = false;
          state.isShuttingDown = false;
          updateAll(1.0);
        });
      }, 2000);
    });
  }, 400);
}

export function triggerAutoShutdown() {
  state.isShuttingDown = true;
  addLog({ tag: 'SYS', cls: 'crit', msg: '에너지 고갈 — 강제 셧다운 / Energy depleted — Forced shutdown', msgCls: 'crit-msg' });

  dom.blackoutOverlay.classList.add('active');

  animateClockDown(1.0, 1200, () => {
    dom.clockSlider.disabled = true;
    setTimeout(() => {
      dom.blackoutOverlay.classList.remove('active');
      playRebootSequence(() => {
        dom.clockSlider.disabled = false;
        state.isShuttingDown = false;
        updateAll(1.0);
      });
    }, 1500);
  });
}
