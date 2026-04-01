// ═══════════════════════════════════════════════════════════
// Color Interpolation Utilities
// ═══════════════════════════════════════════════════════════
import { COLOR_STOPS } from './config.js';

export function lerpColor(clock) {
  if (clock <= COLOR_STOPS[0].ghz) return { ...COLOR_STOPS[0] };
  if (clock >= COLOR_STOPS[COLOR_STOPS.length - 1].ghz) return { ...COLOR_STOPS[COLOR_STOPS.length - 1] };

  let lo, hi;
  for (let i = 0; i < COLOR_STOPS.length - 1; i++) {
    if (clock >= COLOR_STOPS[i].ghz && clock <= COLOR_STOPS[i + 1].ghz) {
      lo = COLOR_STOPS[i];
      hi = COLOR_STOPS[i + 1];
      break;
    }
  }

  const t = (clock - lo.ghz) / (hi.ghz - lo.ghz);
  return {
    r: Math.round(lo.r + (hi.r - lo.r) * t),
    g: Math.round(lo.g + (hi.g - lo.g) * t),
    b: Math.round(lo.b + (hi.b - lo.b) * t),
  };
}

export function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(c => c.toString(16).padStart(2, '0')).join('');
}

export function applyInterpolatedColor(clock) {
  const c = lerpColor(clock);
  const hex = rgbToHex(c.r, c.g, c.b);
  const rgb = `${c.r}, ${c.g}, ${c.b}`;

  document.documentElement.style.setProperty('--accent', hex);
  document.documentElement.style.setProperty('--accent-rgb', rgb);
  document.documentElement.style.setProperty('--glow', `0 0 20px rgba(${rgb}, 0.3)`);
}
