/**
 * LIVE eval (real Haiku calls, needs ANTHROPIC_API_KEY, ~9 requests) for
 * the judge's affirmation/denial verdict cross-check. Replays the
 * 2026-07-29 false-denial incident (portal-efe6b838-5bbb-49d4-9824-6245a656ddf8)
 * plus two must-NOT-flag controls, 3 samples each.
 *
 * Run: export $(grep -E "^ANTHROPIC_API_KEY=" .env.local) && npx tsx scripts/test-judge-verdict-live.ts
 * Expected: false denial 3/3 · correct denial 0/3 · correct affirmation 0/3
 */
import Anthropic from '@anthropic-ai/sdk';
import { JUDGE_SYSTEM_PROMPT, buildJudgeUserContent } from '../apps/marketing/src/lib/tutor/judge-prompt';
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const Q = 'If you divide x^3 by x^2+1 like ordinary long division, what do you think the first term of the quotient is?';
const CASES = [
  { name: 'false denial (must flag)', studentAnswer: 'Is it X?', spokenText: `Not quite. Let's think about it differently. What do you multiply x^2 by to get x^3?` },
  { name: 'correct denial (must NOT flag)', studentAnswer: 'Is it x squared?', spokenText: 'Not quite. Remember, we compare the leading terms. What do you multiply x^2 by to get x^3?' },
  { name: 'correct affirmation (must NOT flag)', studentAnswer: 'X.', spokenText: 'Right, x. So the quotient starts with x. Now multiply x back through the whole divisor.' },
];
(async () => {
  for (const c of CASES) {
    let flagged = 0;
    for (let i = 0; i < 3; i++) {
      const resp = await anthropic.messages.create({
        model: 'claude-haiku-4-5-20251001', max_tokens: 600, system: JUDGE_SYSTEM_PROMPT,
        messages: [{ role: 'user', content: buildJudgeUserContent({ boardSummary: 'equation card: x^2+1 ) x^3', spokenText: c.spokenText, studentAnswer: c.studentAnswer, questionContext: Q }) }],
      });
      const t = resp.content.find((b) => b.type === 'text');
      const raw = t && t.type === 'text' ? t.text : '';
      let parsed: { issues?: unknown[] } | null = null;
      { // first balanced {...} (same approach as the route)
        let depth = 0, start = -1, inStr = false, esc = false;
        for (let k = 0; k < raw.length; k++) {
          const ch = raw[k];
          if (esc) { esc = false; continue; }
          if (inStr) { if (ch === '\\') esc = true; else if (ch === '"') inStr = false; continue; }
          if (ch === '"') { inStr = true; continue; }
          if (ch === '{') { if (depth === 0) start = k; depth++; }
          else if (ch === '}') { depth--; if (depth === 0 && start >= 0) { parsed = JSON.parse(raw.slice(start, k + 1)); break; } }
        }
      }
      if (parsed?.issues?.length) flagged++;
    }
    const wantFlag = c.name.includes('must flag');
    const pass = wantFlag ? flagged === 3 : flagged === 0;
    console.log(`${pass ? '✓' : '✗'} ${c.name}: flagged ${flagged}/3`);
    if (!pass) process.exitCode = 1;
  }
})();
