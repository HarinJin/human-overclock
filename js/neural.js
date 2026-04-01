// ═══════════════════════════════════════════════════════════
// Neural Wave Canvas — 뇌 SVG 뒤편 배경 파형
// ═══════════════════════════════════════════════════════════
import { state, dom } from './state.js';
import { lerpColor, rgbToHex } from './color.js';

export function startNeuralWave() {
  const canvas = dom.neuralCanvas;
  const ctx = dom.ctx;
  const container = canvas.parentElement;

  const resize = () => {
    const rect = container.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.setTransform(2, 0, 0, 2, 0, 0);
  };
  resize();
  window.addEventListener('resize', resize);

  let time = 0;
  const draw = () => {
    const rect = container.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    const t = (state.currentClock - 1.0) / 4.0;
    const c = lerpColor(state.currentClock);
    const color = rgbToHex(c.r, c.g, c.b);

    ctx.clearRect(0, 0, w, h);

    // 파형 레이어 — 뇌 뒤편에 은은하게
    const layers = [
      { amp: 15 + t * 40, freq: 0.015, speed: 0.025, alpha: 0.4 },
      { amp: 8 + t * 25,  freq: 0.035, speed: 0.04,  alpha: 0.2 },
      { amp: 4 + t * 18,  freq: 0.06,  speed: 0.06,  alpha: 0.1 },
    ];

    layers.forEach(layer => {
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.globalAlpha = layer.alpha;
      ctx.lineWidth = 1.5;

      for (let x = 0; x < w; x++) {
        const noise = state.currentPhase === 'critical' ? (Math.random() - 0.5) * 12 * t : 0;
        const y = h / 2 + Math.sin(x * layer.freq + time * layer.speed) * layer.amp + noise;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      ctx.stroke();
    });

    // 스파이크 아티팩트
    if (t > 0.5 && Math.random() < t * 0.12) {
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.globalAlpha = 0.6;
      ctx.lineWidth = 2;
      const sx = Math.random() * w;
      ctx.moveTo(sx, h / 2);
      ctx.lineTo(sx + 2, h / 2 - 25 - Math.random() * 35);
      ctx.lineTo(sx + 4, h / 2);
      ctx.stroke();
    }

    ctx.globalAlpha = 1;
    time++;
    state.neuralAnimFrame = requestAnimationFrame(draw);
  };

  draw();
}
