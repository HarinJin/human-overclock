# Neural Overclock Dashboard v2 — 개선 플랜

## 현재 상태
단일 HTML 파일(`brain-overclock.html`)로 동작하는 프로토타입.
슬라이더로 1.0~5.0 GHz 조절, 4단계 페이즈, 스탯 6개, 바이오메트릭, 시스템 로그, 뉴럴 웨이브폼.

## 목표
"뇌가 진짜 오버클럭되고 있다"는 체감을 극대화하는 인터랙티브 경험.
SNS(Thread)에 올릴 수 있는 시각적 임팩트.

---

## 변경사항 7가지

### 1. 격렬한 빨간 배경 플래시 (Red Alert Flash)
- **현재**: CRITICAL에서 미세한 글리치 + 화면 떨림만 있음
- **변경**: OVERDRIVE부터 배경 전체가 빨간색으로 깜빡거리는 효과 추가
  - OVERDRIVE: `0.5s` 간격, opacity 0.05~0.08 수준의 은은한 빨간 플래시
  - CRITICAL: `0.15s` 간격, opacity 0.1~0.2 수준의 격렬한 빨간 플래시
  - 화면 떨림(shake) 강도도 CRITICAL에서 현재 1px → 3px로 증가
  - 글리치 오버레이의 빨간색 비중 강화

### 2. Warning 텍스트 티커 (Scrolling Warning Ticker)
- **현재**: 단일 warning-bar에 한 줄 텍스트만 표시
- **변경**: 화면 하단 또는 경고 영역에 한 줄씩 위로 올라가는 경고 티커
  - 타이핑 효과로 한 글자씩 나타남
  - 메시지 큐에서 순서대로 표시 (한영 혼용)
  - 예시 메시지:
    - `"[경고] 전두엽 과부하 감지 — Frontal lobe overload detected"`
    - `"[위험] 감정 모듈 바이패스 — Empathy module bypassed"`
    - `"[긴급] 뉴럴 붕괴 임박 — Neural collapse in T-12s"`
  - OVERDRIVE부터 활성화, CRITICAL에서 속도 2배

### 3. 뇌 SVG — 영역별 인터랙티브 반응 (Brain Visualization)
- **현재**: neural-section에 canvas 웨이브폼만 있음
- **변경**: 뇌의 측면도(lateral view) SVG를 중앙에 배치
  - 구분 영역: **전두엽**(Frontal), **두정엽**(Parietal), **측두엽**(Temporal), **후두엽**(Occipital), **소뇌**(Cerebellum), **해마**(Hippocampus), **뇌간**(Brainstem)
  - 클럭 레벨에 따른 영역 반응:
    | 클럭 | 활성 영역 | 시각 효과 |
    |------|----------|----------|
    | 1.0~2.0 | 전두엽 미세 glow | 기본 시안 톤 |
    | 2.0~3.0 | 전두엽+두정엽 활성 | 앰버 펄스, 해마 미약 반응 |
    | 3.0~4.0 | 전체 활성, 해마 강조 | 오렌지 glow, 불규칙 깜빡임 시작 |
    | 4.0~5.0 | 전두엽 과부하 플래시, 해마 소실 | 빨간 글리치, 영역 경계 노이즈 |
  - SVG 내부에 `<animate>` + JS 제어로 glow/pulse/flicker 적용
  - 뇌간은 항상 녹색 계열 유지 → 생존 본능은 마지막까지 살아있다는 서사

### 4. 칼로리 게이지 + 자동 셧다운 (Calorie Drain & Auto-Shutdown)
- **신규 추가**: 칼로리 게이지 바 (화면 우측 또는 뇌 SVG 옆)
  - 초기값: 2,400 kcal (100%)
  - 소모 속도 공식: `drainRate = baseRate * (clockGHz ^ 2)`
    - 1.0 GHz: 1 kcal/s (거의 안 줄어듦)
    - 3.0 GHz: 9 kcal/s
    - 5.0 GHz: 25 kcal/s → **20초에 500kcal 소모** (100%→약 79%)
  - **핵심 메커니즘**: 게이지가 50% 이하로 떨어지면 자동 셧다운 시퀀스 시작
    - 5.0 GHz 기준 약 48초만에 50% 도달 (실제 플레이타임)
    - 셧다운 시: 클럭이 자동으로 1.0 GHz로 급격히 내려감
    - "⚠ 에너지 고갈 — 강제 셧다운" 경고 + 화면 블랙아웃 연출
    - 슬라이더 일시적 비활성화 (3초간)
    - 이후 칼로리가 서서히 회복 (5 kcal/s)
  - **사용자 조정**: 20초 동안 5.0GHz에서 100%→50%로 맞추려면:
    - drainRate at 5.0 = 2400 * 0.5 / 20 = 60 kcal/s
    - 공식 수정: `drainRate = 2.4 * (clockGHz ^ 2)` kcal/s → 5.0일 때 60 kcal/s
  - 게이지 UI: 세로 바 + 수치 표시, 50% 이하 빨간색 전환

### 5. SHUTDOWN 버튼 — 위기상황 긴급 휴면 (Emergency Hibernate)
- **신규 추가**: OVERDRIVE(3.0 GHz) 이상에서 화면에 `[SHUTDOWN]` 버튼이 출현
  - 출현 연출: 아래에서 슬라이드업 + 빨간 glow 펄스
  - CRITICAL에서는 버튼 자체가 깜빡거리며 긴급함 강조
  - **클릭 시 휴면 시퀀스**:
    1. 화면 전체 블랙아웃 (opacity 0 → 1, 0.8s ease)
    2. 시스템 로그에 셧다운 시퀀스 출력:
       - `"[SYS] 긴급 셧다운 요청 수신 — Emergency shutdown initiated"`
       - `"[SYS] 뉴럴 클럭 감속 중... 5.0 → 3.2 → 1.8 → 1.0"`
       - `"[SYS] 모든 증강 모듈 비활성화 — All enhancement modules: OFF"`
       - `"[SYS] 휴면 모드 진입 — Entering hibernation..."`
    3. 클럭이 5.0 → 1.0으로 단계적으로 내려감 (애니메이션 1.5s)
    4. 슬라이더 비활성화 (5초간)
    5. 모든 스탯 baseline으로 복귀
    6. 칼로리 게이지 서서히 회복 시작
  - 휴면 해제: 5초 후 슬라이더 잠금 풀림 + `"[SYS] 시스템 대기 중 — Standby"` 로그
  - STANDARD 단계에서는 버튼 숨김 (불필요)

### 6. UI 색상 Seamless 그라데이션 전환 (Color Interpolation)
- **현재**: 페이즈 경계(2.0, 3.0, 4.0 GHz)에서 색상이 **딱** 바뀜
- **변경**: 슬라이더 값에 따라 색상이 연속적으로 보간(interpolate)
  - 색상 키프레임:
    | GHz | 색상 | HEX |
    |-----|------|-----|
    | 1.0 | 시안 | `#00f0ff` |
    | 2.0 | 앰버 | `#ffae00` |
    | 3.0 | 오렌지 | `#ff6b35` |
    | 4.0 | 크림슨 | `#ff0040` |
    | 5.0 | 딥 레드 | `#cc0030` |
  - 구현: JS에서 RGB 채널별 `lerp()` 함수로 실시간 계산
  - 적용 대상: `--accent` CSS 변수 → border, glow, text, bar, 슬라이더 thumb, 뉴럴 웨이브, 뇌 SVG glow 등 모든 UI 요소에 자동 반영
  - `body.className`으로 페이즈 전환하던 방식을 CSS 변수 직접 주입으로 교체
  - 예: 2.5 GHz → 앰버와 오렌지의 중간색 `#ffcc1a` 같은 느낌
  - 부드러운 전환이 핵심 — 사용자가 슬라이더를 천천히 움직이면 색이 물 흐르듯 바뀌어야 함

### 7. 문구 한영 혼용 (Bilingual UI)
- 시스템 라벨은 영어 유지 (PERCEPTION, REFLEX 등 — 게임 UI 감성)
- 설명/부제/경고는 한국어 우선, 괄호로 영어 병기
- 로그 메시지: 영어 기술 용어 + 한국어 서술 혼용
  - `"[SYS] 뉴럴 경로 정상 — Neural pathways nominal"`
  - `"[ERR] 감정 모듈 신호 저하 — Empathy signal degrading"`
- 헤더: "뇌 오버클럭 시스템" / "CORTEX ENHANCEMENT PROTOCOL v2.7"

---

## 실행 전략 — 병렬 구조

```
[병렬 A] 뇌 SVG 생성 (별도 에이전트)
  └─ SVG 파일 생성 → inline SVG로 HTML에 삽입 가능한 형태
  └─ 영역별 id 부여 (frontal, parietal, temporal, occipital, cerebellum, hippocampus, brainstem)
  └─ 기본 스타일 (stroke, fill, opacity) 정의

[병렬 B] 메인 HTML 개선 (별도 에이전트)
  └─ UI 색상 seamless 보간 시스템 (body.className 방식 → CSS 변수 실시간 주입)
  └─ 빨간 배경 플래시 CSS/JS
  └─ Warning 티커 UI + 타이핑 효과
  └─ 칼로리 게이지 시스템
  └─ SHUTDOWN 버튼 + 휴면 시퀀스
  └─ 한영 혼용 문구 교체

[통합] A + B 결과를 brain-overclock.html에 병합
  └─ SVG를 HTML에 인라인 삽입
  └─ JS에서 SVG 영역 제어 로직 연결
  └─ 브라우저 테스트
```

---

## 파일 구조
단일 파일 유지: `brain-overclock.html` (CSS + JS + SVG 모두 인라인)

## 기술 스택
- Vanilla HTML/CSS/JS (프레임워크 없음)
- SVG inline (외부 파일 의존 없음)
- CSS animations + requestAnimationFrame
- Web Audio API는 사용하지 않음 (나중에 추가 가능)
