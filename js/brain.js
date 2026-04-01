// ═══════════════════════════════════════════════════════════
// Brain SVG Region Control
// ═══════════════════════════════════════════════════════════

function setBrainRegionStyle(regionId, options) {
  const el = document.getElementById(regionId);
  if (!el) return;

  el.classList.remove('brain-pulse', 'brain-flicker', 'brain-overload', 'brain-fade');

  if (options.animation) el.classList.add(options.animation);
  if (options.fill) el.style.fill = options.fill;
  if (options.opacity !== undefined) el.style.opacity = options.opacity;
  if (options.filter) el.style.filter = options.filter;
  else el.style.filter = '';
  if (options.stroke) el.style.stroke = options.stroke;
  if (options.strokeOpacity !== undefined) el.style.strokeOpacity = options.strokeOpacity;
}

export function updateBrainRegions(clockGHz) {
  const regions = ['brain-frontal', 'brain-parietal', 'brain-temporal',
                   'brain-occipital', 'brain-cerebellum', 'brain-hippocampus', 'brain-brainstem'];

  if (!document.getElementById('brain-frontal')) return;

  regions.forEach(id => {
    setBrainRegionStyle(id, { opacity: 0.2, filter: '', animation: null });
  });

  setBrainRegionStyle('brain-brainstem', {
    fill: '#00ff88', opacity: 0.6, animation: 'brain-pulse',
    filter: 'drop-shadow(0 0 4px rgba(0, 255, 136, 0.4))',
  });

  if (clockGHz >= 1.0 && clockGHz < 2.0) {
    const intensity = (clockGHz - 1.0) / 1.0;
    setBrainRegionStyle('brain-frontal', {
      fill: '#e8ecf0', opacity: 0.3 + intensity * 0.3, animation: 'brain-pulse',
      filter: `drop-shadow(0 0 ${4 + intensity * 6}px rgba(232, 236, 240, ${0.3 + intensity * 0.3}))`,
    });
  } else if (clockGHz >= 2.0 && clockGHz < 3.0) {
    const intensity = (clockGHz - 2.0) / 1.0;
    const amberGlow = `drop-shadow(0 0 ${6 + intensity * 8}px rgba(255, 174, 0, ${0.4 + intensity * 0.3}))`;
    setBrainRegionStyle('brain-frontal', { fill: '#ffae00', opacity: 0.6 + intensity * 0.2, animation: 'brain-pulse', filter: amberGlow });
    setBrainRegionStyle('brain-parietal', { fill: '#ffae00', opacity: 0.3 + intensity * 0.4, animation: 'brain-pulse', filter: amberGlow });
    setBrainRegionStyle('brain-hippocampus', { fill: '#ffcc44', opacity: 0.15 + intensity * 0.2, animation: null, filter: `drop-shadow(0 0 3px rgba(255, 204, 68, 0.2))` });
    setBrainRegionStyle('brain-temporal', { opacity: 0.2 + intensity * 0.15 });
  } else if (clockGHz >= 3.0 && clockGHz < 4.0) {
    const intensity = (clockGHz - 3.0) / 1.0;
    const orangeGlow = `drop-shadow(0 0 ${8 + intensity * 10}px rgba(255, 107, 53, ${0.5 + intensity * 0.3}))`;
    setBrainRegionStyle('brain-frontal', { fill: '#ff6b35', opacity: 0.8, animation: intensity > 0.5 ? 'brain-flicker' : 'brain-pulse', filter: orangeGlow });
    setBrainRegionStyle('brain-parietal', { fill: '#ff6b35', opacity: 0.7, animation: 'brain-pulse', filter: orangeGlow });
    setBrainRegionStyle('brain-temporal', { fill: '#ff8855', opacity: 0.5 + intensity * 0.3, animation: 'brain-pulse', filter: orangeGlow });
    setBrainRegionStyle('brain-occipital', { fill: '#ff8855', opacity: 0.4 + intensity * 0.3, animation: 'brain-pulse', filter: orangeGlow });
    setBrainRegionStyle('brain-cerebellum', { fill: '#ff8855', opacity: 0.4 + intensity * 0.2, animation: 'brain-pulse', filter: orangeGlow });
    setBrainRegionStyle('brain-hippocampus', { fill: '#ffaa33', opacity: 0.6 + intensity * 0.3, animation: intensity > 0.5 ? 'brain-flicker' : 'brain-pulse', filter: `drop-shadow(0 0 ${10 + intensity * 8}px rgba(255, 170, 51, 0.6))` });
  } else if (clockGHz >= 4.0) {
    const intensity = (clockGHz - 4.0) / 1.0;
    const redGlow = `drop-shadow(0 0 ${12 + intensity * 10}px rgba(255, 0, 64, ${0.6 + intensity * 0.3}))`;
    setBrainRegionStyle('brain-frontal', { fill: '#ff0040', opacity: 1.0, animation: 'brain-overload', filter: redGlow });
    setBrainRegionStyle('brain-parietal', { fill: '#ff3366', opacity: 0.7, animation: 'brain-flicker', filter: redGlow });
    setBrainRegionStyle('brain-temporal', { fill: '#ff3366', opacity: 0.6, animation: 'brain-flicker', filter: redGlow });
    setBrainRegionStyle('brain-occipital', { fill: '#ff3366', opacity: 0.5 + intensity * 0.2, animation: 'brain-flicker', filter: redGlow });
    setBrainRegionStyle('brain-cerebellum', { fill: '#ff6644', opacity: 0.5, animation: 'brain-flicker', filter: redGlow });
    setBrainRegionStyle('brain-hippocampus', { fill: '#993333', opacity: Math.max(0.05, 0.4 - intensity * 0.35), animation: 'brain-fade', filter: `drop-shadow(0 0 4px rgba(153, 51, 51, 0.3))` });
  }
}
