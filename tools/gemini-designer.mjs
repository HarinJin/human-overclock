#!/usr/bin/env node
// ═══════════════════════════════════════════════════════════
// Gemini Designer Agent — 프론트엔드 디자인 분석 + 구체적 수정 지시
// ═══════════════════════════════════════════════════════════
// Usage:
//   node tools/gemini-designer.mjs analyze <screenshot.png> [task]
//   node tools/gemini-designer.mjs generate-image <prompt> <output.png>
//
// Env: GEMINI_API_KEY (from .env)

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = resolve(__dirname, '..');

// Load .env
function loadEnv() {
  const envPath = resolve(PROJECT_ROOT, '.env');
  if (existsSync(envPath)) {
    const lines = readFileSync(envPath, 'utf-8').split('\n');
    for (const line of lines) {
      const [key, ...vals] = line.split('=');
      if (key && vals.length) process.env[key.trim()] = vals.join('=').trim();
    }
  }
  if (!process.env.GEMINI_API_KEY) {
    console.error('ERROR: GEMINI_API_KEY not found. Set it in .env');
    process.exit(1);
  }
}

// Design context — 프로젝트의 디자인 시스템 정보
const DESIGN_CONTEXT = `
## 프로젝트: Neural Overclock System (뇌 오버클럭)
- 장르: 사이버펑크 의료 모니터 UI (에반게리온, Ghost in the Shell, Blade Runner 미학)
- 기술: 바닐라 HTML/CSS/JS (ES 모듈), 빌드 도구 없음
- Phase 시스템: 화이트(정상) → 앰버(경고) → 레드(위험) → 블랙아웃(사망)

## 디자인 토큰 (CSS 변수)
--panel-bg-accent: rgba(var(--accent-rgb), 0.06)  // 패널 배경
--panel-border: rgba(var(--accent-rgb), 0.25)      // 보더
--panel-glow: 0 0 16px rgba(accent, 0.06), inset 0 0 16px rgba(accent, 0.025)
--panel-backdrop: blur(4px)
--text-glow: 0 0 8px rgba(accent, 0.3)
--text-glow-strong: 0 0 12px rgba(accent, 0.4), 0 0 30px rgba(accent, 0.15)
--divider: rgba(var(--accent-rgb), 0.15)
--font-display: 'Orbitron', sans-serif
--font-mono: 'Share Tech Mono', monospace
--font-body: 'Rajdhani', 'Noto Sans KR', sans-serif
--font-cjk: 'M PLUS 1p', sans-serif

## 파일 구조
css/variables.css  — CSS 변수, 디자인 토큰
css/layout.css     — 레이아웃, 헤더, 섹션
css/components.css — 컴포넌트 (스탯, 슬라이더, 팝업, 버튼)
css/animations.css — 애니메이션, 글리치, 오버레이
js/ui.js           — 메인 업데이트 로직
js/popups.js       — 팝업 시스템
index.html         — HTML 구조

## 중요 규칙
- 모든 수정은 기존 CSS 변수/토큰을 활용할 것
- filter: drop-shadow 대신 text-shadow/box-shadow 사용 (GPU 최적화)
- 새 파일 생성 금지, 기존 파일 수정만
`;

async function callGemini(model, payload) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.json();
}

// ── ANALYZE: 스크린샷 분석 → 구체적 CSS 수정 지시 ──
async function analyze(screenshotPath, task) {
  const imgBuffer = readFileSync(screenshotPath);
  const imgBase64 = imgBuffer.toString('base64');
  const mimeType = screenshotPath.endsWith('.jpg') || screenshotPath.endsWith('.jpeg')
    ? 'image/jpeg' : 'image/png';

  const prompt = `${DESIGN_CONTEXT}

## 현재 작업
${task || '전체적인 UI/UX 디자인 개선점을 찾고, 구체적인 CSS 수정사항을 제시해주세요.'}

## 출력 형식
다음 JSON 형식으로 응답해주세요. 반드시 유효한 JSON만 출력하세요:

\`\`\`json
{
  "overall_score": 7,
  "impression": "한 줄 총평",
  "fixes": [
    {
      "priority": "P0",
      "target": "css/components.css의 .stat-card",
      "problem": "문제 설명",
      "css_before": "background: rgba(var(--accent-rgb), 0.03);",
      "css_after": "background: var(--panel-bg-accent);",
      "reason": "변경 이유"
    }
  ],
  "layout_suggestions": ["레이아웃 제안1", "제안2"],
  "color_notes": ["색상 관련 노트"]
}
\`\`\`

주의사항:
- P0(즉시), P1(중요), P2(개선), P3(선택) 우선순위 사용
- css_before/css_after는 실제 적용 가능한 CSS여야 함
- 기존 디자인 토큰(--panel-*, --text-glow 등)을 최대한 활용
- 최소 5개, 최대 15개 수정사항 제시`;

  const data = await callGemini('gemini-2.5-flash', {
    contents: [{
      parts: [
        { text: prompt },
        { inlineData: { mimeType, data: imgBase64 } },
      ]
    }],
    generationConfig: {
      temperature: 0.4,
      maxOutputTokens: 8192,
      thinkingConfig: { thinkingBudget: 0 },
    }
  });

  if (!data.candidates) {
    console.error('API Error:', JSON.stringify(data, null, 2).slice(0, 500));
    process.exit(1);
  }

  const text = data.candidates[0].content.parts
    .filter(p => p.text)
    .map(p => p.text)
    .join('');

  // JSON 추출 (```json ... ``` 블록에서)
  const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
  if (jsonMatch) {
    try {
      const result = JSON.parse(jsonMatch[1]);
      console.log(JSON.stringify(result, null, 2));
    } catch (e) {
      // JSON 파싱 실패 시 원문 출력
      console.log(text);
    }
  } else {
    console.log(text);
  }
}

// ── GENERATE-IMAGE: 이미지 생성 ──
async function generateImage(prompt, outputPath) {
  const data = await callGemini('gemini-2.5-flash-image', {
    contents: [{
      parts: [{ text: prompt }]
    }],
    generationConfig: {
      responseModalities: ['IMAGE', 'TEXT'],
    }
  });

  if (!data.candidates) {
    console.error('API Error:', JSON.stringify(data, null, 2).slice(0, 500));
    process.exit(1);
  }

  for (const part of data.candidates[0].content.parts) {
    if (part.inlineData) {
      const imgBuffer = Buffer.from(part.inlineData.data, 'base64');
      writeFileSync(outputPath, imgBuffer);
      console.log(JSON.stringify({
        status: 'ok',
        path: outputPath,
        size: `${(imgBuffer.length / 1024).toFixed(0)}KB`,
      }));
      return;
    }
  }
  console.error('No image generated');
  process.exit(1);
}

// ── REVIEW: 변경 전후 비교 리뷰 ──
async function review(beforePath, afterPath, changeDescription) {
  const beforeB64 = readFileSync(beforePath).toString('base64');
  const afterB64 = readFileSync(afterPath).toString('base64');

  const prompt = `${DESIGN_CONTEXT}

## 변경 내용
${changeDescription || '디자인 변경이 적용되었습니다.'}

## 요청
변경 전(Image 1)과 변경 후(Image 2)를 비교하여:
1. 개선된 점 (구체적으로)
2. 아직 부족한 점
3. 추가 수정이 필요한 사항 (CSS 수준)
4. 전체 점수 (10점 만점, 변경 전 vs 변경 후)

한국어로 응답해주세요.`;

  const data = await callGemini('gemini-2.5-flash', {
    contents: [{
      parts: [
        { text: prompt },
        { inlineData: { mimeType: 'image/png', data: beforeB64 } },
        { inlineData: { mimeType: 'image/png', data: afterB64 } },
      ]
    }],
    generationConfig: {
      temperature: 0.5,
      maxOutputTokens: 4096,
      thinkingConfig: { thinkingBudget: 0 },
    }
  });

  if (data.candidates) {
    const text = data.candidates[0].content.parts
      .filter(p => p.text).map(p => p.text).join('');
    console.log(text);
  } else {
    console.error('Error:', JSON.stringify(data, null, 2).slice(0, 500));
  }
}

// ── Main ──
loadEnv();
const [,, command, ...args] = process.argv;

switch (command) {
  case 'analyze':
    await analyze(args[0], args.slice(1).join(' '));
    break;
  case 'generate-image':
    await generateImage(args[0], args[1] || 'output.png');
    break;
  case 'review':
    await review(args[0], args[1], args.slice(2).join(' '));
    break;
  default:
    console.log(`Usage:
  node tools/gemini-designer.mjs analyze <screenshot.png> [task description]
  node tools/gemini-designer.mjs generate-image "<prompt>" <output.png>
  node tools/gemini-designer.mjs review <before.png> <after.png> [change description]`);
}
