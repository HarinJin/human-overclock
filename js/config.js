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

// ── 스탯별 코멘트 (수치 임계값 기준, 내림차순 매칭) ──
export const STAT_COMMENTS = {
  perception: [
    { threshold: 90, text: '⚡ 초감각 — 심장 박동 소리까지 들립니다' },
    { threshold: 80, text: '⚡ 감각 과부하 — 형광등 깜빡임이 보입니다' },
    { threshold: 70, text: '피부 위 공기 흐름까지 감지합니다' },
    { threshold: 60, text: '소리의 방향과 거리를 정확히 인지합니다' },
    { threshold: 50, text: '시야가 선명해집니다 — 미세 움직임 포착' },
  ],
  reflex: [
    { threshold: 90, text: '⚡ 반응속도 0.01초 — 인간 한계 초월' },
    { threshold: 80, text: '⚡ 반응속도 0.04초 — 총알 궤적이 느리게 보입니다' },
    { threshold: 70, text: '반응속도 0.08초 — 조류 수준의 반사신경' },
    { threshold: 60, text: '반응속도 0.12초 — 떨어지는 물체를 잡을 수 있습니다' },
    { threshold: 50, text: '반응속도 0.18초 — 프로 게이머 수준' },
  ],
  logic: [
    { threshold: 95, text: '⚡ 연산 능력이 슈퍼컴퓨터에 근접합니다' },
    { threshold: 85, text: '⚡ 패턴 인식 극대화 — 암호 해독 가능' },
    { threshold: 80, text: '수학적 추론 300% — 대학원 수준 논증' },
    { threshold: 75, text: '프로그래밍 언어를 보는 것만으로 이해합니다' },
    { threshold: 65, text: '복잡한 수학 문제를 암산으로 풀 수 있습니다' },
  ],
  memory: [
    { threshold: 90, text: '⚡ 완전 기억 — 잊는 것이 불가능합니다' },
    { threshold: 85, text: '⚡ 과거 기억이 영상처럼 선명하게 재생됩니다' },
    { threshold: 80, text: '맥락뿐 아니라 단어, 질감, 냄새까지 기억합니다' },
    { threshold: 75, text: '한 번 들은 멜로디를 완벽히 재현할 수 있습니다' },
    { threshold: 70, text: '기억 인출 속도가 상승하기 시작합니다' },
  ],
  empathy: [
    { threshold: 7,  text: '☠ 공감 능력 완전 소실 — 사이코패스 수준' },
    { threshold: 15, text: '☠ 거울을 봐도 자신을 "나"로 인식하지 못합니다' },
    { threshold: 30, text: '⚠ 인간관계가 체스 말처럼 느껴집니다' },
    { threshold: 45, text: '⚠ 웃음과 울음이 이해되지 않습니다' },
    { threshold: 60, text: '타인의 감정이 "정보"로만 인식됩니다' },
  ],
  stability: [
    { threshold: 5,  text: '☠ 뇌가 자기 자신을 파괴하고 있습니다' },
    { threshold: 15, text: '☠ 현실과 기억의 경계가 무너지고 있습니다' },
    { threshold: 30, text: '⚠ 시간 감각 왜곡 — 1분이 1시간처럼' },
    { threshold: 50, text: '⚠ 환각이 시야 끝에서 나타납니다' },
    { threshold: 70, text: '손끝이 미세하게 떨리기 시작합니다' },
  ],
};

// ── 칼로리 소모 마일스톤 (잔여 kcal 기준, 내림차순 매칭) ──
export const CALORIE_MILESTONES = [
  { remaining: 2300, text: '산책 30분과 동일한 에너지 소모' },
  { remaining: 2100, text: '달리기 3km에 해당하는 열량 소진' },
  { remaining: 1900, text: '성인 한 끼 식사 분량 전량 소모' },
  { remaining: 1400, text: '마라톤 절반 거리에 해당하는 칼로리' },
  { remaining: 900,  text: '⚠ 하루 기초대사량 대부분 소진' },
  { remaining: 400,  text: '⚠ 하루치 열량 거의 전부 소모 — 기아 임박' },
  { remaining: 100,  text: '☠ 체내 에너지 고갈 — 강제 셧다운 불가피' },
];

// ── 칼로리 위험 경고 (잔여 % 기준) ──
export const CALORIE_WARNINGS = [
  { percent: 70, text: '뇌가 평소보다 3배 빠르게 포도당을 소모하고 있습니다' },
  { percent: 50, text: '체지방이 뇌 연료로 강제 전환되고 있습니다' },
  { percent: 30, text: '⚠ 저혈당 위험 — 시야 흐림, 손 떨림 발생 가능' },
  { percent: 15, text: '⚠ 근육 단백질 분해 시작 — 신체 기능 저하 임박' },
  { percent: 5,  text: '☠ 이 상태가 지속되면 뇌 단백질이 변성됩니다' },
];

// ── Phase별 동적 텍스트 ──
export const SLIDER_HINTS = [
  { threshold: 4.0, text: '☠ 근육 단백질이 분해되고 있습니다 — 비가역적 손상 진행 중' },
  { threshold: 3.0, text: '⚠ 체지방이 연료로 강제 연소되고 있습니다 — 정지를 권고합니다' },
  { threshold: 2.0, text: '⚠ 기초대사량을 초과하는 에너지가 뇌에 집중되고 있습니다' },
  { threshold: 1.0, text: '▼ 열량을 소모하여 뇌의 인지능력을 향상시킬 수 있습니다 ▼' },
];

export const BRAIN_TITLES = [
  { threshold: 4.0, text: '☠ 뇌 온도 임계점 돌파 — 단백질 변성 개시' },
  { threshold: 3.0, text: '⚠ 과열 경고 — 체지방 급속 연소 중' },
  { threshold: 2.0, text: '피질 강화 모드 — 열량 소모 가속 중' },
  { threshold: 1.0, text: '피질 활동 모니터링 — 정상 범위' },
];

export const BIOMETRICS = [
  { id: 'heartRate',  name: '심박수 HEART RATE',   base: 72,   unit: 'BPM',   calc: (t) => Math.round(72 + t * 48 + Math.sin(Date.now() / 500) * 3) },
  { id: 'cortisol',   name: '코르티솔 CORTISOL',     base: 12,   unit: 'μg/dL', calc: (t) => (12 + t * 28).toFixed(1) },
  { id: 'brainTemp',  name: '뇌 온도 BRAIN TEMP',  base: 36.8, unit: '°C',    calc: (t) => (36.8 + t * 2.4).toFixed(1) },
  { id: 'neuralSync', name: '동기화율 SYNC RATE', base: 99.2, unit: '%',     calc: (t) => Math.max(0, (99.2 - t * 42)).toFixed(1) },
];

export const PHASES = [
  { name: 'NOMINAL',  threshold: 1.0, cls: 'standard',  label: 'PHASE 01 — 정상 · 뇌파 안정 · 36.8°C' },
  { name: 'ELEVATED', threshold: 2.0, cls: 'enhanced',  label: 'PHASE 02 — 강화 · 집중력 증폭 · 38.5°C' },
  { name: 'CRITICAL', threshold: 3.0, cls: 'overdrive', label: 'PHASE 03 — 경고 · 인체 한계 초과 · 40.2°C' },
  { name: 'COLLAPSE', threshold: 4.0, cls: 'critical',  label: 'PHASE 04 — 임계 · 비가역적 손상 · 41.0°C+' },
];

export const LOG_MESSAGES = {
  standard: [
    { tag: 'SYS', cls: 'sys', msg: '뇌 신경 회로 정상 작동 중 — 시냅스 전달 속도 정상', msgCls: '' },
    { tag: 'SYS', cls: 'sys', msg: '뇌파 α파 12Hz 안정 — 이완 상태 유지 중', msgCls: '' },
    { tag: 'SYS', cls: 'sys', msg: '뇌 심부 온도 36.8°C — 정상 범위 내', msgCls: '' },
    { tag: 'SYS', cls: 'sys', msg: '초당 시냅스 발화 횟수: 기준치 — 에너지 소모 최소', msgCls: '' },
    { tag: 'SYS', cls: 'sys', msg: '편도체-전전두엽 연결 정상 — 감정 조절 기능 유지', msgCls: '' },
  ],
  enhanced: [
    { tag: '⚠ 熱暴走', cls: 'warn', msg: '뇌 에너지 소모량이 기초대사량을 초과했습니다', msgCls: 'warn-msg' },
    { tag: 'SYS', cls: 'sys', msg: 'γ파 30Hz 돌파 — 집중력이 인간 평균의 4배입니다', msgCls: '' },
    { tag: 'WRN', cls: 'warn', msg: '스트레스 호르몬 급상승 — 몸이 위험을 감지하고 있습니다', msgCls: 'warn-msg' },
    { tag: 'SYS', cls: 'sys', msg: '시각 피질 과활성화 — 초당 인식 프레임 증가', msgCls: '' },
    { tag: 'WRN', cls: 'warn', msg: '전두엽 과열 중 — 판단력 왜곡 가능성', msgCls: 'warn-msg' },
  ],
  overdrive: [
    { tag: '⚠ 共感機能低下', cls: 'err', msg: '타인의 고통에 대한 반응이 사라지고 있습니다', msgCls: 'err-msg' },
    { tag: 'ERR', cls: 'err', msg: '감정 처리 회로 포화 — 무감각 상태 진입', msgCls: 'err-msg' },
    { tag: 'WRN', cls: 'warn', msg: '뇌가 스스로를 보호하려는 반응을 멈추고 있습니다', msgCls: 'warn-msg' },
    { tag: 'ERR', cls: 'err', msg: '통증을 느끼지 못합니다 — 부상 위험 급증', msgCls: 'err-msg' },
    { tag: 'SYS', cls: 'sys', msg: '신경 전달 속도 240% — 근육이 뇌를 따라가지 못합니다', msgCls: '' },
  ],
  critical: [
    { tag: '☠ 接続切断', cls: 'crit', msg: '뇌 세포가 열에 의해 파괴되기 시작합니다', msgCls: 'crit-msg' },
    { tag: '☠ 記憶崩壊', cls: 'crit', msg: '"감정"이라는 단어의 의미를 잊어가고 있습니다', msgCls: 'crit-msg' },
    { tag: '!!!', cls: 'crit', msg: '해마 영역 시냅스 소진 — 최근 기억부터 삭제됩니다', msgCls: 'crit-msg' },
    { tag: 'ERR', cls: 'err', msg: '이름, 얼굴, 목소리... 기억이 모래처럼 흩어집니다', msgCls: 'err-msg' },
    { tag: '!!!', cls: 'crit', msg: '"나는 누구인가?"라는 질문에 답할 수 없습니다', msgCls: 'crit-msg' },
    { tag: '!!!', cls: 'crit', msg: '지금 멈추지 않으면 다시는 원래로 돌아갈 수 없습니다', msgCls: 'crit-msg' },
  ],
};

export const TICKER_MESSAGES = [
  '[경고] 전두엽 과열 — 판단력이 왜곡되고 있습니다',
  '[위험] 타인의 고통에 대한 감각이 소실되었습니다',
  '[긴급] 뇌 세포가 열에 의해 파괴되기 시작합니다',
  '[경고] 해마 시냅스 소진 — 최근 기억부터 삭제 중',
  '[위험] 이름, 얼굴, 목소리... 기억이 흩어지고 있습니다',
  '[긴급] "나는 누구인가?"에 답할 수 없습니다',
  '[경고] 체지방 고갈 — 근육 단백질 분해 개시',
  '[위험] 스트레스 호르몬이 치사량에 근접합니다',
  '[긴급] 지금 멈추지 않으면 되돌릴 수 없습니다',
  '[경고] 뇌가 스스로를 보호하기를 포기했습니다',
];

export const CALORIE_MAX = 2400;
export const TICKER_MAX_LINES = 5;

export const WARNING_FLOOD_LINES = [
  '[WARNING] 뇌 에너지 소모 기초대사량 초과 ',
  '[ERR] 감정 처리 회로 포화 — 무감각 상태 ',
  '[CRITICAL] 뇌 세포 열파괴 개시 — NEURAL COLLAPSE ',
  '[WARNING] 전두엽 과열 — 판단력 왜곡 ',
  '[ERR] 해마 시냅스 소진 — 기억 삭제 진행 ',
  '[CRITICAL] 지금 멈추지 않으면 되돌릴 수 없습니다 ',
  '[WARNING] 타인의 감정에 대한 반응 소실 ',
  '[ERR] 기억이 모래처럼 흩어지고 있습니다 ',
  '[CRITICAL] "나는 누구인가?" — 정체성 12% ',
  '[WARNING] 스트레스 호르몬 치사량 근접 ',
  '[ERR] 통증 감각 소실 — 부상 위험 급증 ',
  '[CRITICAL] 뇌가 자기 보호를 포기했습니다 ',
];
