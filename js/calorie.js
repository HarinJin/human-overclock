// ═══════════════════════════════════════════════════════════
// Calorie Drain System
// ═══════════════════════════════════════════════════════════
import { CALORIE_MAX } from './config.js';
import { state, dom } from './state.js';
import { updateCalorieUI } from './ui.js';
import { triggerAutoShutdown } from './shutdown.js';

export function startCalorieDrain() {
  state.calorieLastTime = performance.now();

  function tick(now) {
    const dt = (now - state.calorieLastTime) / 1000;
    state.calorieLastTime = now;

    if (!state.isShuttingDown) {
      if (state.currentClock <= 2.0 && state.calorieRemaining < CALORIE_MAX) {
        state.calorieRemaining = Math.min(CALORIE_MAX, state.calorieRemaining + 5 * dt);
      } else if (state.currentClock > 1.0) {
        const drainRate = 2.4 * (state.currentClock * state.currentClock);
        state.calorieRemaining = Math.max(0, state.calorieRemaining - drainRate * dt);
      }
    } else {
      if (state.calorieRemaining < CALORIE_MAX) {
        state.calorieRemaining = Math.min(CALORIE_MAX, state.calorieRemaining + 5 * dt);
      }
    }

    updateCalorieUI();

    if (state.calorieRemaining <= 0 && !state.isShuttingDown) {
      triggerAutoShutdown();
    }

    state.calorieAnimFrame = requestAnimationFrame(tick);
  }

  state.calorieAnimFrame = requestAnimationFrame(tick);
}
