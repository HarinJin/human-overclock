// ═══════════════════════════════════════════════════════════
// NEURAL OVERCLOCK SYSTEM v2.7 — Configuration
// ═══════════════════════════════════════════════════════════

export const COLOR_STOPS = [
  { ghz: 1.0, r: 232, g: 236, b: 240 },
  { ghz: 2.0, r: 255, g: 174, b: 0   },
  { ghz: 3.0, r: 255, g: 107, b: 53  },
  { ghz: 4.0, r: 255, g: 42,  b: 94  },
  { ghz: 5.0, r: 255, g: 0,   b: 0   },
];

export const STATS = [
  { id: 'perception', name: '지각력', base: 42, maxGain: 55, type: 'positive', icon: '◉' },
  { id: 'reflex',     name: '반사신경', base: 38, maxGain: 58, type: 'positive', icon: '⚡' },
  { id: 'logic',      name: '논리',   base: 55, maxGain: 44, type: 'positive', icon: '◈' },
  { id: 'memory',     name: '기억력', base: 60, maxGain: 35, type: 'positive', icon: '⬫' },
  { id: 'empathy',    name: '공감능력', base: 75, maxLoss: 68, type: 'negative', icon: '♡' },
  { id: 'stability',  name: '안정성', base: 90, maxLoss: 85, type: 'negative', icon: '◎' },
];

export const BIOMETRICS = [
  { id: 'heartRate',  name: '심박수 HEART RATE',   base: 72,   unit: 'BPM',   calc: (t) => Math.round(72 + t * 48 + Math.sin(Date.now() / 500) * 3) },
  { id: 'cortisol',   name: '코르티솔 CORTISOL',     base: 12,   unit: 'μg/dL', calc: (t) => (12 + t * 28).toFixed(1) },
  { id: 'brainTemp',  name: '뇌 온도 BRAIN TEMP',  base: 36.8, unit: '°C',    calc: (t) => (36.8 + t * 2.4).toFixed(1) },
  { id: 'neuralSync', name: '동기화율 SYNC RATE', base: 99.2, unit: '%',     calc: (t) => Math.max(0, (99.2 - t * 42)).toFixed(1) },
];

export const PHASES = [
  { name: 'NOMINAL',   threshold: 1.0, cls: 'standard',  label: 'PHASE 01 — NOMINAL // 36.8°C' },
  { name: 'ELEVATED',  threshold: 2.0, cls: 'enhanced',  label: 'PHASE 02 — ELEVATED // 38.5°C' },
  { name: 'CRITICAL',  threshold: 3.0, cls: 'overdrive', label: 'PHASE 03 — CRITICAL // 40.2°C' },
  { name: 'COLLAPSE',  threshold: 4.0, cls: 'critical',  label: 'PHASE 04 — NEURAL COLLAPSE // 41.0°C+' },
];

export const LOG_MESSAGES = {
  standard: [
    { tag: 'SYS', cls: 'sys', msg: '뉴럴 경로 정상 — Neural pathways nominal', msgCls: '' },
    { tag: 'SYS', cls: 'sys', msg: '알파파 안정 — Alpha wave pattern stable', msgCls: '' },
    { tag: 'SYS', cls: 'sys', msg: '피질 온도 정상 범위 — Cortex temperature within range', msgCls: '' },
    { tag: 'SYS', cls: 'sys', msg: '시냅스 처리량 기준치 — Synaptic throughput at baseline', msgCls: '' },
    { tag: 'SYS', cls: 'sys', msg: '감정 조절 모듈: 활성 — Emotional regulation module: ACTIVE', msgCls: '' },
  ],
  enhanced: [
    { tag: '⚠ 熱暴走', cls: 'warn', msg: '클럭 안전 범위 초과 — Clock exceeding safe parameters', msgCls: 'warn-msg' },
    { tag: 'SYS', cls: 'sys', msg: '감마파 증폭 활성화 — Activating gamma wave amplification', msgCls: '' },
    { tag: 'WRN', cls: 'warn', msg: '코르티솔 상승 중 — Cortisol levels rising', msgCls: 'warn-msg' },
    { tag: 'SYS', cls: 'sys', msg: '지각 강화: 가동 — Perception enhancement: ENGAGED', msgCls: '' },
    { tag: 'WRN', cls: 'warn', msg: '전두엽 부하 증가 — Prefrontal cortex load increasing', msgCls: 'warn-msg' },
  ],
  overdrive: [
    { tag: '⚠ 共感機能低下', cls: 'err', msg: '감정 모듈 신호 저하 — Empathy module signal degrading', msgCls: 'err-msg' },
    { tag: 'ERR', cls: 'err', msg: '감정 버퍼 오버플로우 — Emotional buffer overflow', msgCls: 'err-msg' },
    { tag: 'WRN', cls: 'warn', msg: '뉴럴 안정성 63% — Neural stability compromised', msgCls: 'warn-msg' },
    { tag: 'ERR', cls: 'err', msg: '통증 억제 자동 활성화 — Pain suppression auto-engaged', msgCls: 'err-msg' },
    { tag: 'SYS', cls: 'sys', msg: '반사 강화 240% — Reflex enhancement at 240% baseline', msgCls: '' },
  ],
  critical: [
    { tag: '☠ 接続切断', cls: 'crit', msg: '뉴럴 붕괴 임박 — NEURAL COLLAPSE IMMINENT', msgCls: 'crit-msg' },
    { tag: '☠ 記憶崩壊', cls: 'crit', msg: '감정 모듈: 오프라인 — Empathy module: OFFLINE', msgCls: 'crit-msg' },
    { tag: '!!!', cls: 'crit', msg: '시냅스 소진 구역 7-12 — Synaptic burnout sectors 7-12', msgCls: 'crit-msg' },
    { tag: 'ERR', cls: 'err', msg: '기억 단편화 임계 — Memory fragmentation critical', msgCls: 'err-msg' },
    { tag: '!!!', cls: 'crit', msg: '피험자 정체성 일관성: 12% — Subject identity coherence: 12%', msgCls: 'crit-msg' },
    { tag: '!!!', cls: 'crit', msg: '중단 권고 — ABORT RECOMMENDED — OVERRIDE ACTIVE', msgCls: 'crit-msg' },
  ],
};

export const TICKER_MESSAGES = [
  '[경고] 전두엽 과부하 감지 — Frontal lobe overload detected',
  '[위험] 감정 모듈 바이패스 — Empathy module bypassed',
  '[긴급] 뉴럴 붕괴 임박 — Neural collapse imminent',
  '[경고] 시냅스 소진 구역 7-12 — Synaptic burnout sectors 7-12',
  '[위험] 기억 단편화 진행 중 — Memory fragmentation in progress',
  '[긴급] 피험자 정체성 일관성: 12% — Subject identity coherence: 12%',
  '[경고] 해마 반응 저하 — Hippocampal response declining',
  '[위험] 코르티솔 임계 초과 — Cortisol threshold exceeded',
  '[긴급] 뉴럴 셛다운 권고 — Neural shutdown recommended',
  '[경고] 에너지 고갈 가속 — Energy depletion accelerating',
];

export const CALORIE_MAX = 2400;
export const TICKER_MAX_LINES = 5;

export const WARNING_FLOOD_LINES = [
  '[WARNING] NEURAL OVERLOAD DETECTED ',
  '[ERR] EMPATHY MODULE BYPASSED — EMOTIONAL BUFFER OVERFLOW ',
  '[CRITICAL] 뉴럴 붕괴 임박 — NEURAL COLLAPSE IMMINENT ',
  '[WARNING] 전두엽 과부하 — FRONTAL LOBE OVERLOAD ',
  '[ERR] SYNAPTIC BURNOUT IN SECTORS 7-12 ',
  '[CRITICAL] ABORT RECOMMENDED — OVERRIDE ACTIVE ',
  '[WARNING] 감정 모듈 신호 저하 — EMPATHY SIGNAL DEGRADING ',
  '[ERR] 기억 단편화 진행 중 — MEMORY FRAGMENTATION ',
  '[CRITICAL] SUBJECT IDENTITY COHERENCE: 12% ',
  '[WARNING] 코르티솔 임계 초과 — CORTISOL THRESHOLD EXCEEDED ',
  '[ERR] PAIN SUPPRESSION AUTO-ENGAGED ',
  '[CRITICAL] 해마 반응 소실 — HIPPOCAMPAL RESPONSE LOST ',
];
