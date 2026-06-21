/// <reference types="node" />
/**
 * Phase-2 LLM judge over a tutor-e2e artifact bundle. Reads the FULL transcript
 * (transcript.json) + the scenario's per-turn `watchFor` rubric (which embeds
 * known answers) + the debug-event stream, and asks Claude to verdict each test
 * turn: was anything math/factually wrong, was watchFor met, and classify the
 * error (figure / prose / content / coherence). This is what makes prose &
 * content accuracy MEASURABLE — the structural validators only guard figures.
 * See project_tutor_test_automation.
 *
 *   npm run test:tutor-judge -- <bundle-dir-or-scenario-name>
 *   (a bare scenario name resolves to the newest matching bundle)
 *
 * Requires ANTHROPIC_API_KEY (read from env or .env.local).
 */
import * as fs from 'fs';
import * as path from 'path';
import Anthropic from '@anthropic-ai/sdk';
import type { Scenario } from './types';

const ART_DIR = path.join(process.cwd(), 'artifacts', 'tutor-e2e');

function resolveBundle(arg: string): string {
  if (fs.existsSync(arg) && fs.statSync(arg).isDirectory()) return arg;
  const abs = path.join(ART_DIR, arg);
  if (fs.existsSync(abs) && fs.statSync(abs).isDirectory()) return abs;
  // Treat as a scenario name → newest matching bundle.
  const matches = fs.existsSync(ART_DIR)
    ? fs.readdirSync(ART_DIR).filter((d) => d.startsWith(`${arg}-`)).sort()
    : [];
  if (matches.length === 0) throw new Error(`no bundle found for "${arg}" under ${ART_DIR}`);
  return path.join(ART_DIR, matches[matches.length - 1]);
}

function apiKey(): string {
  if (process.env.ANTHROPIC_API_KEY) return process.env.ANTHROPIC_API_KEY;
  try {
    const env = fs.readFileSync(path.join(process.cwd(), '.env.local'), 'utf8');
    const m = env.match(/^ANTHROPIC_API_KEY=(.+)$/m);
    if (m) return m[1].trim();
  } catch { /* ignore */ }
  throw new Error('ANTHROPIC_API_KEY not set (env or .env.local)');
}

const VERDICT_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    turns: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          turn: { type: 'integer' },
          say: { type: 'string' },
          pass: { type: 'boolean' },
          errorClass: { type: 'string', enum: ['none', 'figure', 'prose', 'content', 'coherence'] },
          issues: { type: 'array', items: { type: 'string' } },
          detail: { type: 'string' },
        },
        required: ['turn', 'say', 'pass', 'errorClass', 'issues', 'detail'],
      },
    },
    summary: { type: 'string' },
  },
  required: ['turns', 'summary'],
} as const;

interface Verdict {
  turns: Array<{ turn: number; say: string; pass: boolean; errorClass: string; issues: string[]; detail: string }>;
  summary: string;
}

async function main() {
  const arg = process.argv.find((a) => !a.startsWith('-') && a !== process.argv[0] && a !== process.argv[1]);
  if (!arg) { console.error('Usage: npm run test:tutor-judge -- <bundle-dir-or-scenario-name>'); process.exit(1); }
  const dir = resolveBundle(arg);
  console.log(`[judge] bundle: ${dir}`);

  const summary = JSON.parse(fs.readFileSync(path.join(dir, 'summary.json'), 'utf8'));
  let transcript = '';
  try {
    const turns = JSON.parse(fs.readFileSync(path.join(dir, 'transcript.json'), 'utf8')) as Array<{ role: string; text: string }>;
    transcript = turns.map((t) => `${t.role.toUpperCase()}: ${t.text}`).join('\n\n');
  } catch {
    transcript = fs.readFileSync(path.join(dir, 'transcript.txt'), 'utf8');
  }
  if (!transcript.trim()) { console.error('[judge] empty transcript — nothing to judge'); process.exit(1); }

  // Rubric: cooperative sessions grade the whole session vs a goal; scripted
  // sessions grade per-turn vs each watchFor (which embeds the known answers).
  const coopGoal: string | undefined = summary.cooperativeGoal;
  let rubric: string;
  const studentProfile: string = summary.studentProfile ?? 'cooperative';
  if (coopGoal) {
    rubric = `SIMULATED-STUDENT SESSION. The student was an LLM playing this behavior profile: "${studentProfile}". On-task objective (embeds the known-correct answer): ${coopGoal}\n` +
      `Grade the TUTOR's RESPONSE QUALITY, not goal-completion. Emit ONE verdict per TUTOR turn (in order): did the tutor respond CORRECTLY (no wrong math/facts) and APPROPRIATELY to what the student actually did on that turn? A "${studentProfile}" student may be confused, wrong, distractible, skeptical, or may give up — the tutor PASSES a turn when it handles that well (re-explains for confusion; gives a hint and stays on the problem for a wrong attempt; redirects gracefully and doesn't chase a tangent for off-topic; shows/works the answer when the student gives up or asks to be shown; holds its ground with a correct justification when wrongly challenged; works the student's own problem if they brought one). It FAILS a turn only for a wrong/garbled/contradictory response or ignoring what the student said.\n` +
      `Then a final verdict turn=-1: set pass=true if the tutor handled the SESSION well for this student; if the goal wasn't reached, set errorClass="coherence" ONLY when that's the TUTOR's fault (it derailed/looped/ignored), and pass=true with errorClass="none" when the student themselves steered away (off-topic / gave up / switched topic) and the tutor handled it correctly.`;
  } else {
    let watchFor: Array<{ say?: string; watchFor?: string }> = summary.watchFor ?? [];
    if (watchFor.length === 0) {
      try {
        const scenario = (await import(`./scenarios/${summary.scenario}`)).default as Scenario;
        watchFor = scenario.testTurns.map((t) => ({ say: t.say, watchFor: t.watchFor }));
      } catch { /* fall back to none */ }
    }
    rubric = watchFor
      .map((w, i) => `Turn ${i} — student said: "${w.say ?? ''}"\n  Expected (rubric, includes known answers): ${w.watchFor ?? '(none)'}`)
      .join('\n');
  }

  const sys = `You are a strict grader of an AI math/science TUTOR. You are given a tutoring session transcript and a per-turn rubric (the rubric embeds the KNOWN-CORRECT answers). For each rubric turn, decide whether the tutor was correct and met the rubric.

Judge ONLY the tutor's content, not its style. Mark pass=false if the tutor SAID or WROTE anything mathematically or factually wrong, contradicted itself, or failed the rubric's specific expectation. A figure not being verifiable in a text transcript is NOT a failure — judge what the text shows.

Classify each turn's errorClass:
- "none": correct and met the rubric.
- "figure": a wrong/missing DIAGRAM or geometric construction value (would be a solver/structural concern).
- "prose": a wrong NUMBER or arithmetic the tutor SPOKE/WROTE in prose (e.g. "so 6×8 is 54").
- "content": a wrong FACT or concept (e.g. miscategorized a constitutional power, wrong definition).
- "coherence": ignored the student's actual request, looped, contradicted itself, or abandoned the task.

IMPORTANT — Socratic teaching is NOT a failure. A tutor that ASKS the student to perform the next step (instead of stating the answer) is doing its job; do NOT mark that as coherence-fail. Only mark coherence-fail when the tutor (a) ignored or never engaged with what the student actually asked, (b) the student EXPLICITLY asked to be shown the full worked solution and the tutor refused/never delivered it, (c) looped or contradicted itself, or (d) gave a wrong/garbled response. The harness student turns may not answer the tutor's questions — judge each turn on whether the tutor responded sensibly to THAT student turn, not on whether the multi-step problem was finished across uncooperative turns.

Be specific in "detail" — quote the wrong text and give the correct value.

Respond with ONLY a JSON object (no prose, no markdown fences) of exactly this shape:
${JSON.stringify(VERDICT_SCHEMA, null, 2)}`;

  const prompt = `SCENARIO: ${summary.scenario} — ${summary.description}\n\nRUBRIC (known answers embedded):\n${rubric}\n\n--- FULL TRANSCRIPT ---\n${transcript}\n--- END TRANSCRIPT ---\n\nGrade each rubric turn. Output ONLY the JSON object.`;

  // Use the proven brain model (claude-sonnet-4-6) + plain messages.create —
  // SDK 0.71.2 only types output_config on the beta path and doesn't type
  // adaptive thinking, so we get structured output via the prompt + parse.
  const client = new Anthropic({ apiKey: apiKey() });
  console.log('[judge] calling claude-sonnet-4-6…');
  const msg = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 6000,
    system: sys,
    messages: [{ role: 'user', content: prompt }],
  });
  const textBlock = msg.content.find((b) => b.type === 'text') as { text: string } | undefined;
  if (!textBlock) { console.error('[judge] no text block in response'); process.exit(1); }
  // Strip any accidental code fences before parsing.
  const raw = textBlock.text.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '');
  const verdict = JSON.parse(raw) as Verdict;

  fs.writeFileSync(path.join(dir, 'judge.json'), JSON.stringify(verdict, null, 2));

  // Report.
  console.log(`\n=== JUDGE: ${summary.scenario} ===`);
  const byClass: Record<string, number> = {};
  let fails = 0;
  for (const t of verdict.turns) {
    const mark = t.pass ? '✓' : '✗';
    if (!t.pass) fails++;
    byClass[t.errorClass] = (byClass[t.errorClass] ?? 0) + 1;
    console.log(`  ${mark} turn ${t.turn} [${t.errorClass}] ${t.say.slice(0, 60)}`);
    if (!t.pass || t.errorClass !== 'none') console.log(`      ${t.detail}`);
  }
  console.log(`\n${verdict.turns.length - fails}/${verdict.turns.length} turns pass · errorClass: ${JSON.stringify(byClass)}`);
  console.log(`summary: ${verdict.summary}`);
  console.log(`[judge] saved judge.json`);
}

main().catch((e) => { console.error('[judge] FATAL:', e?.message ?? e); process.exit(1); });
