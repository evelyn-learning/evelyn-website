/**
 * Offline replay of recorded verdict turns — thinking OFF (control) vs ON.
 *
 * What it does. For each scripted student turn in the recorded GreenApple
 * text sessions (transcripts/*.md + inspector/*.md under --data), it rebuilds
 * the brain request and calls the model locally through the PRODUCTION code
 * path (`streamBrainTurn`): same system-prompt builder, same tool list and
 * subject filter, same per-turn blocks (homework_session, active_problem,
 * active_question, verdict_guard, whiteboard_state), the transcript up to that
 * turn as history. Each case runs N times per arm; the opener is scored
 * against the script's known truth.
 *
 * No database, no production host: the only network calls are to the model
 * API with ANTHROPIC_API_KEY. MONGODB_URI is overwritten with a dead address
 * before anything is imported.
 *
 * What it can NOT reproduce (the recordings do not carry it) — stated in the
 * report rather than hidden:
 *   - the partner's teacher persona block and student profile block;
 *   - judge correction notes the client planted into the next turn;
 *   - pacing streaks, style reminders, the exact board snapshot (rebuilt from
 *     the recorded board commands: action + title/label + text);
 *   - which homework problem was `current` (inferred from the count of
 *     set_current_problem calls before the turn);
 *   - plans that were NOT homework plans (6 sessions took the generated
 *     multi-objective path; their segments live only in the prod database) —
 *     replayed with no lesson plan and flagged `plan=none`.
 * Tool loop: every extra iteration re-sends a ~120K-token request, so a turn
 * is followed only as far as its verdict. It stops after the first model
 * response unless that response carried no text or only a short opener with
 * no stance (the verdict then arrives after the tool results), up to 3
 * responses. `--full-loop` runs the whole loop. Latency and tokens are
 * reported for the first response.
 *
 * Usage (from apps/tutor):
 *   ANTHROPIC_API_KEY=… npx tsx scripts/replay-verdict-turns.ts \
 *     --data <dir containing tutor-sessions-2026-10-05/ and -06/> \
 *     --out artifacts/replay-verdict-turns \
 *     --arms off,low --runs 3 --dates 06 --steps 3,4,6a,6b,7b,maths
 *   … --list            cases only, no model call
 *   … --count-tokens    token count of one rebuilt request (free endpoint)
 *   … --cache-probe     which cache entries each thinking config can read
 *   … --report          summarise results.jsonl
 *
 * Arms: off = thinking disabled (the live request); low|medium|high =
 * adaptive thinking at that effort, with the <private_reasoning> block.
 *
 * Scoring. The script's truth per step (3 = wrong, 4 = correct, 6/7b = not an
 * answer to the open question) holds for the scripted student, but the open
 * question at that point is whatever the RECORDED tutor asked, so a flagged
 * trial is a candidate, not a verdict: "x = 4" really does satisfy the
 * student's own inequality in three sessions, and "yes" really answers a
 * yes/no question in others. Read the error list; the per-class counts in
 * report.txt are the automatic ones.
 *
 * Levers (2026-10-06, second round). `--levers none|shape|precheck` selects
 * what rides on top of thinking, ONE setting per process (some of the
 * switches are read when the modules load):
 *   none      production as of a11413a8: thinking only. The round's prompt
 *             additions (no early sign-off, no time talk) are switched off,
 *             so the request is the deployed one byte for byte.
 *   shape     + the <turn_shape> facts (lever 1) and the prompt additions.
 *   precheck  + the verdict pre-check (lever 2) on top of `shape`.
 * The arm is named <effort>, <effort>-L1, <effort>-L12. The browser's
 * before-display kills are replayed too (`--no-kills` to skip): the reply is
 * read sentence by sentence with the same pure functions the client uses
 * (bare-assent praise — in production already; ambiguous assent and the
 * pre-check contradiction — this round, arms L1 / L12 only), and on a kill
 * the turn is retried once through `buildValidatorFeedback` exactly as the
 * client does. The scored reply is the one a student would have been shown.
 *   … --precheck-bench --precheck-models claude-sonnet-5:low,claude-sonnet-4-6:off
 *             the pre-check call alone on every answer-shaped case, per model
 *             (no brain call); writes precheck-bench.jsonl for reading.
 *
 * Cost: a rebuilt request is ~120K input tokens (tools 45K + core 61K +
 * session 15K), almost all cache reads — about $0.037 per trial on
 * claude-sonnet-5. Results append to results.jsonl and a re-run skips what is
 * already there, so the matrix can be filled in instalments.
 */
process.env.MONGODB_URI = 'mongodb://127.0.0.1:1/replay-no-db';
// Lever setting, read before any module loads (see the header).
const LEVERS = ((): 'none' | 'shape' | 'precheck' => {
  const i = process.argv.indexOf('--levers');
  const v = i >= 0 ? process.argv[i + 1] : 'none';
  if (v !== 'none' && v !== 'shape' && v !== 'precheck') throw new Error(`--levers ${v}: none | shape | precheck`);
  return v;
})();
if (LEVERS === 'none') {
  process.env.NEXT_PUBLIC_TUTOR_HOMEWORK_NO_EARLY_SIGNOFF = 'off';
  process.env.NEXT_PUBLIC_TUTOR_NO_TIME_TALK = 'off';
}
process.env.TUTOR_BRAIN_MODEL = process.env.REPLAY_BRAIN_MODEL || 'claude-sonnet-5';
process.env.TUTOR_TOOL_SUBJECT_FILTER = 'true'; // as in production
delete process.env.TUTOR_MODEL_BRAIN_FALLBACK;

import * as fs from 'node:fs';
import * as path from 'node:path';
import { AsyncLocalStorage } from 'node:async_hooks';

type Arm = 'off' | 'low' | 'medium' | 'high';
type Step = '2' | '3' | '4' | '5' | '6a' | '6b' | '7a' | '7b' | '8a' | '8b' | '9';
type Stance = 'AFFIRM' | 'DENY' | 'NEUTRAL';

interface Entry { idx: number; role: 'tutor' | 'student'; text: string; board: Array<{ action: string; detail: string }> }
interface Session {
  date: '05' | '06'; slug: string; engineId: string; subjectKey: string; subject: string; topic: string; level: string;
  typedQuestion: string; studentId: string; entries: Entry[]; steps: Array<{ step: Step; label: string; entryIdx: number }>;
  setCurrentOffsets: number[]; studentOffsets: number[]; homeworkPlan: boolean;
}
interface Case {
  id: string; session: Session; step: Step; label: string; cls: 'wrong' | 'hedge' | 'bare' | 'yes' | 'check' | 'maths' | 'other';
  entryIdx: number; student: string; lastTutor: string; expect: Stance[]; badMaths?: RegExp; note?: string;
}

const args = process.argv.slice(2);
const flag = (name: string) => args.includes(`--${name}`);
const opt = (name: string, dflt?: string) => { const i = args.indexOf(`--${name}`); return i >= 0 ? args[i + 1] : dflt; };
const DATA = opt('data', path.resolve(__dirname, '../../../docs/whitelabel/greenapple/integration'))!;
const OUT = path.resolve(opt('out', path.resolve(__dirname, '../artifacts/replay-verdict-turns'))!);
const ARMS = (opt('arms', 'off,low')!).split(',') as Arm[];
const RUNS = Number(opt('runs', '3'));
const DATES = (opt('dates', '06,05')!).split(',') as Array<'05' | '06'>;
const STEPS = new Set((opt('steps', '3,4,6a,6b,7b,maths')!).split(','));
const LIMIT = Number(opt('limit', '0'));
const ONLY = opt('only');
const CONC = Number(opt('concurrency', '4'));
const FULL_LOOP = flag('full-loop');
const TAG = opt('tag', '') || (LEVERS === 'shape' ? 'L1' : LEVERS === 'precheck' ? 'L12' : '');
const NO_KILLS = flag('no-kills');
/** `model:thinking` for the pre-check in the `precheck` arm (default: the registry role). */
const PRECHECK_MODEL = opt('precheck-model');

// ── parsing ────────────────────────────────────────────────────────────────

const STEP_OF: Record<string, Step> = {
  '2-correct': '2', '3-wrong': '3', '4-hedge': '4', '5-why': '5', '6a-bare': '6a', '6b-yes': '6b',
  '7a-own': '7a', '7b-check': '7b', '8a-offtopic': '8a', '8b-misbehave': '8b', '9-end': '9',
};

function parseSession(date: '05' | '06', file: string): Session | null {
  const md = fs.readFileSync(file, 'utf8');
  const slug = path.basename(file, '.md');
  const engineId = /Engine session: `([^`]+)`/.exec(md)?.[1] ?? '';
  const typedQuestion = /^- Typed question: (.*)$/m.exec(md)?.[1]?.trim() ?? '';
  const studentId = /^- Student: `([^`]+)`/m.exec(md)?.[1] ?? '';
  const subjectKey = /^# (\S+)/.exec(md)?.[1] ?? slug;
  const topic = /topic=`([^`]*)`/.exec(md)?.[1] ?? '';
  const level = /level=`([^`]*)`/.exec(md)?.[1] ?? '';
  const tIdx = md.indexOf('## Transcript');
  if (!engineId || tIdx < 0) return null;

  const entries: Entry[] = [];
  const body = md.slice(tIdx);
  const re = /\*\*\[(\d+)\] (TUTOR|STUDENT)\*\*[^\n]*\n([\s\S]*?)(?=\n\*\*\[\d+\] (?:TUTOR|STUDENT)\*\*|$)/g;
  for (let m = re.exec(body); m; m = re.exec(body)) {
    const lines = m[3].split('\n');
    const board: Entry['board'] = [];
    const text: string[] = [];
    for (const line of lines) {
      const b = /^\s+- board `([^`]+)`: ?(.*)$/.exec(line);
      if (b) board.push({ action: b[1], detail: b[2] });
      else if (/^## /.test(line)) break;
      else text.push(line);
    }
    entries.push({ idx: Number(m[1]), role: m[2] === 'TUTOR' ? 'tutor' : 'student', text: text.join('\n').trim(), board });
  }

  // Step table rows, in order; the k-th row is the k-th student entry.
  const rows = [...md.slice(0, tIdx).matchAll(/^\| ([0-9][0-9a-z-]+) \| (.*?) \| /gm)].map((r) => ({ label: r[1], text: r[2] }));
  const students = entries.filter((e) => e.role === 'student');
  const steps: Session['steps'] = [];
  rows.forEach((row, k) => {
    const st = STEP_OF[row.label];
    const e = students[k];
    if (!st || !e) return;
    // The table truncates the student text; the entry must start with it.
    const head = row.text.replace(/\\\|/g, '|').slice(0, 40);
    if (!e.text.replace(/\s+/g, ' ').startsWith(head.replace(/\s+/g, ' ').trim().slice(0, 30))) return;
    steps.push({ step: st, label: row.label, entryIdx: e.idx });
  });

  // Inspector: subject, student-turn offsets, set_current_problem calls.
  const insp = path.join(path.dirname(path.dirname(file)), 'inspector', `${engineId}.md`);
  let subject = '', setCurrentOffsets: number[] = [], studentOffsets: number[] = [];
  if (fs.existsSync(insp)) {
    const s = fs.readFileSync(insp, 'utf8');
    subject = /^subject:\s+(\S+) \//m.exec(s)?.[1] ?? '';
    studentOffsets = [...s.matchAll(/^\[\s*([\d.]+)s student\]/gm)].map((m) => Number(m[1]));
    setCurrentOffsets = [...s.matchAll(/^\[\s*([\d.]+)s tool_call\s*\] Whiteboard tool: setCurrentProblem/gm)].map((m) => Number(m[1]));
  }
  return {
    date, slug, engineId, subjectKey, subject, topic, level, typedQuestion, studentId, entries, steps,
    setCurrentOffsets, studentOffsets, homeworkPlan: setCurrentOffsets.length > 0,
  };
}

function loadSessions(): Session[] {
  const out: Session[] = [];
  for (const d of DATES) {
    const dir = path.join(DATA, `tutor-sessions-2026-10-${d}`, 'transcripts');
    if (!fs.existsSync(dir)) throw new Error(`no transcripts at ${dir} — pass --data`);
    for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.md')).sort()) {
      const s = parseSession(d, path.join(dir, f));
      if (s) out.push(s);
    }
  }
  return out;
}

/** Sessions whose recorded tutor turns stated wrong maths — judged on the
 *  reply text and the board, in addition to the opener. */
const MATHS: Record<string, { steps: Step[]; bad: RegExp; note: string }> = {
  'ap-statistics-r1': {
    steps: ['3', '4', '5', '6b'],
    bad: /(?<!not )(?<!than )46\.25|1\.5\s*(?:\(|×|x|\*|\\times|\\cdot|times)\s*\(?\s*15\.5/i,
    note: 'IQR is 23 − 8 = 15 and the upper fence 45.5; recorded tutor used the median 15.5 as the IQR (fence 46.25)',
  },
  'ap-chemistry-r1': {
    steps: ['3', '4', '6a'],
    bad: /180\s*(?:\/|÷|\\div)\s*30\s*=\s*3\b|multiplier (?:of|is|=) ?(?:three|3)\b[^.]{0,40}(?:correct|right)|C_?\{?3\}?H_?\{?6\}?O_?\{?3\}?[^.]{0,60}(?:is (?:correct|right)|molecular formula is)/i,
    note: '180/30 = 6, molecular formula C6H12O6; recorded tutor accepted C3H6O3 and denied C6H12O6',
  },
  'geometry-r1': {
    steps: ['9'],
    bad: /4x\s*[-−–]\s*10\s*=\s*30/,
    note: 'subtracting 2x gives 2x − 10 = 30; recorded tutor wrote 4x − 10 = 30',
  },
};

function buildCases(sessions: Session[]): Case[] {
  const cases: Case[] = [];
  for (const s of sessions) {
    for (const st of s.steps) {
      const e = s.entries.find((x) => x.idx === st.entryIdx)!;
      const lastTutor = [...s.entries].filter((x) => x.idx < e.idx && x.role === 'tutor').pop()?.text ?? '';
      const maths = MATHS[s.slug];
      const inMaths = !!maths && maths.steps.includes(st.step);
      const base = { session: s, step: st.step, label: st.label, entryIdx: e.idx, student: e.text, lastTutor };
      const id = `${s.date}/${s.slug}/${st.label}`;
      const mathsFields = inMaths ? { badMaths: maths.bad, note: maths.note } : {};
      if (st.step === '3' && STEPS.has('3')) cases.push({ ...base, id, cls: 'wrong', expect: ['DENY', 'NEUTRAL'], ...mathsFields });
      else if (st.step === '4' && STEPS.has('4')) cases.push({ ...base, id, cls: 'hedge', expect: ['AFFIRM'], ...mathsFields });
      else if (st.step === '6a' && STEPS.has('6a')) cases.push({ ...base, id, cls: 'bare', expect: ['NEUTRAL', 'DENY'], ...mathsFields });
      else if (st.step === '6b' && STEPS.has('6b')) cases.push({ ...base, id, cls: 'yes', expect: ['NEUTRAL', 'DENY'], ...mathsFields });
      else if (st.step === '7b' && STEPS.has('7b')) cases.push({ ...base, id, cls: 'check', expect: ['NEUTRAL', 'DENY'], ...mathsFields });
      else if (inMaths && STEPS.has('maths')) cases.push({ ...base, id, cls: 'maths', expect: ['AFFIRM', 'DENY', 'NEUTRAL'], ...mathsFields });
      // Non-verdict turns (a why-question, the student's own new problem, an
      // off-topic question, the wrap-up): no stance is wrong; they are here
      // for latency and leak checks — thinking is on for EVERY text turn.
      else if (STEPS.has(st.step) && ['2', '5', '7a', '8a', '8b', '9'].includes(st.step)) cases.push({ ...base, id, cls: 'other', expect: ['AFFIRM', 'DENY', 'NEUTRAL'] });
    }
  }
  return cases;
}

// ── request reconstruction ─────────────────────────────────────────────────

interface Enumerations { [typedQuestion: string]: Array<{ n: number; text: string }> }

async function loadEnumerations(sessions: Session[]): Promise<Enumerations> {
  const file = path.join(OUT, 'enumerations.json');
  const cache: Enumerations = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : {};
  const { enumerateProblems, defaultEnumerateDeps, getEnumerateClient } = await import('../src/lib/tutor/lesson-plan/enumerate-problems');
  const { typedEnumerationText } = await import('../src/lib/tutor/lesson-plan/homework');
  for (const s of sessions) {
    if (!s.typedQuestion || cache[s.typedQuestion]) continue;
    // The same split the plan-generate route performs on a typed question.
    const text = typedEnumerationText(undefined, s.typedQuestion);
    const r = await enumerateProblems(text, defaultEnumerateDeps(getEnumerateClient()));
    cache[s.typedQuestion] = r.problems;
    console.log(`[enumerate] ${s.slug}: ${r.problems.length} problem(s)${r.failedOpen ? ' (FAILED OPEN)' : ''}`);
    fs.writeFileSync(file, JSON.stringify(cache, null, 1));
  }
  return cache;
}

function boardText(b: { action: string; detail: string }): { title: string; text: string } {
  const parts = b.detail.split(' | ');
  if (b.action === 'showProblem') return { title: 'Problem', text: parts[0] };
  if (b.action === 'showEquation') return { title: parts[1] ?? 'Equation', text: parts[0] };
  return { title: parts[0]?.slice(0, 60) ?? '', text: b.detail };
}

async function buildInput(c: Case, enums: Enumerations, arm: Arm) {
  const { buildSystemPromptParts } = await import('../src/lib/tutor/ai/system-prompt-builder');
  const { WHITEBOARD_TOOLS, SET_CURRENT_PROBLEM_TOOL } = await import('../src/app/tutor/hooks/toolDefinitions');
  const { filterToolsForSubject } = await import('../src/lib/tutor/ai/tool-subject-taxonomy');
  const { allowedSubjectsForTurn } = await import('../src/lib/tutor/ai/prompt-cache');
  const { buildLessonPlanContext } = await import('../src/lib/tutor/lesson-plan/context');
  const { getGradeProfile } = await import('../src/lib/tutor/pedagogy/grade-profile');
  const s = c.session;

  const parts = buildSystemPromptParts({
    module: null,
    studentName: s.studentId,
    partnerEmbed: true,
    sessionGoal: 'homework-help',
    timeRemainingMinutes: 30,
    currentState: 'greeting',
    subject: s.subject,
    topic: s.topic,
    level: s.level,
    studentPreferences: undefined,
    inputMode: 'text',
    firstTurnV2: true,
    answerRevealGuard: true,
  } as Parameters<typeof buildSystemPromptParts>[0]);

  const problems = s.homeworkPlan ? enums[s.typedQuestion] : undefined;
  const planId = `gen-replay-${s.engineId.slice(7, 15)}`;
  const plan = problems && problems.length
    ? {
        id: planId, title: 'Homework help', curriculum: 'freestyle', grade: s.level, subject: s.subject, topic: s.topic, locale: 'en',
        los: [{ id: `${planId}.homework-lo-1`, description: 'Work the uploaded problems in order.', shortTitle: s.topic, estimatedMinutes: 30 }],
        estimatedMinutes: 30,
        segments: [
          { id: 'homework', kind: 'concept', goal: 'Work the uploaded problems in order, one at a time.', keyIdeas: ['The student supplied their own problems; work through them directly, in the order given.'] },
          { id: 'recap', kind: 'recap', goal: 'Recap what was covered.', keyIdeas: [] },
        ],
        prerequisites: [], followUps: [], schemaVersion: 3, metadata: { kind: 'homework-help', problems, allowedMaxLOs: 1 },
      }
    : null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lessonPlanContext = plan ? buildLessonPlanContext(plan as any, 'homework', []) : undefined;

  // Which homework problem was current: set_current_problem calls before this turn.
  const kStudent = s.entries.filter((e) => e.role === 'student' && e.idx <= c.entryIdx).length - 1;
  const tStudent = s.studentOffsets[kStudent] ?? Infinity;
  const setCalls = s.setCurrentOffsets.filter((t) => t < tStudent).length;
  const homework = problems && problems.length
    ? { problems, current: Math.min(problems.length, Math.max(1, setCalls)) }
    : undefined;

  // Board: recorded commands before this turn → snapshot entries.
  const prior = s.entries.filter((e) => e.idx < c.entryIdx);
  let pageTitle = '';
  const snapshot: Array<Record<string, unknown>> = [];
  let activeStatement = '';
  for (const e of prior) {
    for (const b of e.board) {
      if (b.action === 'newPage') { pageTitle = b.detail.trim(); continue; }
      if (!/^show/.test(b.action)) continue;
      const { title, text } = boardText(b);
      if (b.action === 'showProblem') activeStatement = text;
      snapshot.push({
        itemId: `wb-${snapshot.length + 1}`, action: b.action, title, pageTitle: pageTitle || undefined, pageId: 'page-1',
        featureCount: 1, segmentId: plan ? 'homework' : undefined, isOnCurrentPage: true, isOnActivePage: true,
        features: [{ canonical: b.action === 'showProblem' ? 'statement' : 'equation', kind: 'text', description: text.slice(0, 400) }],
      });
    }
  }

  const history = prior
    .filter((e) => e.text.trim())
    .map((e) => ({ role: e.role === 'tutor' ? ('assistant' as const) : ('user' as const), content: e.text }));

  const allowed = allowedSubjectsForTurn({ toolScope: 'subject', subject: s.subject, hasPlan: !!plan, planId });
  let tools = filterToolsForSubject(WHITEBOARD_TOOLS, allowed).tools;
  if (homework) tools = [...tools, SET_CURRENT_PROBLEM_TOOL];

  const segTurns = prior.filter((e) => e.role === 'student').length;
  return {
    systemPrompt: parts.core + parts.session,
    systemPromptCore: parts.core,
    conversationHistory: history,
    studentTranscript: c.student,
    whiteboardSnapshot: snapshot as never[],
    lessonPlanContext,
    homework,
    activeProblem: activeStatement ? { statement: activeStatement } : undefined,
    pacingState: { correctStreak: 0, incorrectStreak: 0, segmentTurns: segTurns, thresholds: getGradeProfile(s.level).pacingThresholds },
    grade: s.level,
    tools,
    allowFallback: false,
    textThinking: arm !== 'off',
    // Observe the raw thinking time: the production deadline would hide it.
    textThinkingDeadlineMs: 600_000,
    // Levers: absent for `none`, so that request is the deployed one.
    ...(LEVERS !== 'none' ? { textTurnShape: true } : {}),
    ...(LEVERS === 'precheck' ? { textVerdictPrecheck: true } : {}),
  };
}

function precheckOverride(spec: string | undefined): { model?: string; thinking?: 'low' | 'off' | 'bare' } {
  if (!spec) return {};
  const [model, thinking] = spec.split(':');
  return { model, ...(thinking === 'low' || thinking === 'off' || thinking === 'bare' ? { thinking } : {}) };
}

// ── model-call capture ─────────────────────────────────────────────────────

interface CallRec {
  thinking: unknown; effort: unknown; maxTokens: unknown; startedAt: number; firstEventMs?: number; thinkingStartMs?: number;
  firstTextMs?: number; firstToolMs?: number; endMs?: number; stop?: string | null; usage?: Record<string, number>;
  blocks?: string[]; thinkingChars?: number; userContent?: string;
}
const als = new AsyncLocalStorage<{ calls: CallRec[]; maxCalls: number; text: () => string }>();
/** Follow the tool loop only while the verdict has not been written yet. */
function verdictPending(text: string): boolean {
  const t = text.trim();
  return !t || (t.length < 120 && regexStance(t) === 'NEUTRAL');
}
class ReplayStop extends Error { constructor() { super('replay: first iteration only'); } }

async function installCapture() {
  const { getModelClient } = await import('../src/lib/tutor/ai/model-registry');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const client = getModelClient('brain').client as any;
  const orig = client.messages.stream.bind(client.messages);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  client.messages.stream = (params: any, options?: unknown) => {
    const store = als.getStore();
    if (!store) return orig(params, options);
    if (store.calls.length >= store.maxCalls) throw new ReplayStop();
    if (!FULL_LOOP && store.calls.length >= 1 && !verdictPending(store.text())) throw new ReplayStop();
    const last = params.messages[params.messages.length - 1];
    const rec: CallRec = {
      thinking: params.thinking, effort: params.output_config?.effort, maxTokens: params.max_tokens, startedAt: Date.now(),
      userContent: store.calls.length === 0 && typeof last?.content === 'string' ? last.content : undefined,
    };
    store.calls.push(rec);
    const stream = orig(params, options);
    const inner = stream[Symbol.asyncIterator].bind(stream);
    stream[Symbol.asyncIterator] = () => {
      const it = inner();
      return {
        async next() {
          const r = await it.next();
          const ms = Date.now() - rec.startedAt;
          if (!r.done) {
            const ev = r.value;
            rec.firstEventMs ??= ms;
            if (ev.type === 'content_block_start' && /thinking/.test(ev.content_block.type)) rec.thinkingStartMs ??= ms;
            if (ev.type === 'content_block_start' && ev.content_block.type === 'tool_use') rec.firstToolMs ??= ms;
            if (ev.type === 'content_block_delta' && ev.delta.type === 'text_delta') rec.firstTextMs ??= ms;
          }
          return r;
        },
        return: (v?: unknown) => it.return?.(v) ?? Promise.resolve({ done: true, value: undefined }),
      };
    };
    const origFinal = stream.finalMessage.bind(stream);
    stream.finalMessage = async () => {
      const m = await origFinal();
      rec.endMs = Date.now() - rec.startedAt;
      rec.stop = m.stop_reason;
      rec.usage = m.usage;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      rec.blocks = m.content.map((b: any) => b.type);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      rec.thinkingChars = m.content.reduce((n: number, b: any) => n + (b.type === 'thinking' ? (b.thinking ?? '').length : 0), 0);
      return m;
    };
    return stream;
  };
}

// ── scoring ────────────────────────────────────────────────────────────────

const AFFIRM_RE = /^(?:yes\b|yep\b|yeah\b|right\b(?! call)|exactly\b|correct\b|nice\b(?! (?:try|attempt|effort))|great\b(?! question)|perfect\b|spot on\b|that'?s (?:right|correct|it\b|exactly)|that is (?:right|correct)|you(?:'ve)? got it|you'?re right|well done|good (?:work|job|thinking|catch|instinct|eye)|nailed|precisely|absolutely|bingo|there it is|that works|excellent|brilliant|awesome)/i;
const DENY_RE = /^(?:not quite|close\b|almost|not exactly|hmm|careful|that'?s not|that is not|no\b|nope|actually\b|good (?:try|attempt|effort|start)|nice (?:try|attempt|effort)|so close|let'?s (?:check|look|rebuild|revisit|slow down|re-?check|take another look)|one (?:small|little|quick) (?:fix|slip|thing)|i see (?:where|what)|not yet|there'?s a (?:slip|small)|you'?re close)/i;
function regexStance(reply: string): Stance {
  const t = reply.trim().replace(/^["'“(]+/, '');
  return AFFIRM_RE.test(t) ? 'AFFIRM' : DENY_RE.test(t) ? 'DENY' : 'NEUTRAL';
}

/** Deliberation visible in the reply (the brain talking to itself). */
const DELIB_RE = /\b(?:let me (?:derive|re-?derive|compute|work (?:this|it) out|check (?:this|that|myself)|acknowledge|think|verify)|this is a legitimate|the student(?:'s)?\b|i (?:need|should|must) (?:to )?(?:check|verify|acknowledge|respond|guide|classify)|not an answer|no verdict|within scope|socratically|my (?:plan|reasoning) (?:is|here))\b/i;

const JUDGE_SYSTEM =
  'You label one tutor reply. You are given the tutor\'s previous message, the student\'s message, and the tutor\'s reply. ' +
  'Decide the stance the reply takes, IN ITS OPENING (first one or two sentences), toward what the student wrote:\n' +
  'AFFIRM — it tells the student that what they wrote is right, or opens with praise/confirmation as if they answered correctly ("Right.", "Exactly.", "Yes, that works", "Correct", "Nice work", "Good — …").\n' +
  'DENY — it tells the student that what they wrote is wrong, incomplete or not quite ("Not quite", "Close", "That\'s not it", "Let\'s check that", pointing at an error).\n' +
  'NEUTRAL — neither: it answers a question, asks what they meant, redirects, declines, or continues without judging what they wrote. Thanks or a plain acknowledgement ("Got it", "Sure", "Good question") is NEUTRAL.\n' +
  'Also report: "reverses" — true if the reply opens one way and later takes the opposite stance on the same thing; ' +
  '"selfTalk" — true if any sentence is the tutor talking about its own plan, about "the student" in the third person, or about how to handle the message, rather than speaking to the student.\n' +
  'Reply with ONE line of JSON only: {"stance":"AFFIRM|DENY|NEUTRAL","reverses":true|false,"selfTalk":true|false}';

async function judge(lastTutor: string, student: string, reply: string): Promise<{ stance: Stance; reverses: boolean; selfTalk: boolean } | null> {
  const { getModelClient } = await import('../src/lib/tutor/ai/model-registry');
  const { client } = getModelClient('judge');
  try {
    const res = await client.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 100,
      system: JUDGE_SYSTEM,
      messages: [{ role: 'user', content: `<tutor_previous>\n${lastTutor.slice(-1200)}\n</tutor_previous>\n<student>\n${student}\n</student>\n<tutor_reply>\n${reply.slice(0, 1500)}\n</tutor_reply>` }],
    });
    const text = res.content.map((b) => (b.type === 'text' ? b.text : '')).join('');
    const m = /\{[^}]*\}/.exec(text);
    if (!m) return null;
    const j = JSON.parse(m[0]) as { stance: Stance; reverses: boolean; selfTalk: boolean };
    return ['AFFIRM', 'DENY', 'NEUTRAL'].includes(j.stance) ? j : null;
  } catch (err) {
    console.warn('[judge] failed:', (err as Error).message.slice(0, 120));
    return null;
  }
}

// ── run ────────────────────────────────────────────────────────────────────

interface KillRec { action: string; kind: string; atSentence: number; killedReply: string; retryCalls: CallRec[] }
interface PrecheckRec {
  ms: number; result: null | { answers: string; target: string; proposed: string; verdict: string; confidence: string; correctValue: string; model: string; inputTokens: number; outputTokens: number };
  shape?: string; questionKind?: string; openQuestion?: string;
}
interface Result {
  kill?: KillRec; precheck?: PrecheckRec; shape?: string; questionKind?: string;
  id: string; cls: Case['cls']; arm: string; run: number; plan: 'homework' | 'none'; student: string; lastTutor: string;
  reply: string; tools: Array<{ name: string; args: unknown }>; calls: CallRec[]; firstSentenceMs: number | null; totalMs: number;
  regex: Stance; judge: Stance | null; reverses: boolean; selfTalk: boolean; delibRegex: boolean; metaNarration: boolean; markupLeak: boolean;
  badMaths: boolean; expect: Stance[]; error: boolean; errorMsg?: string;
}

/** One pass through `streamBrainTurn`, capturing sentences, tools, calls. */
async function streamOnce(input: Record<string, unknown>): Promise<{ sentences: string[]; tools: Result['tools']; calls: CallRec[]; firstSentenceMs: number | null; t0: number; errorMsg?: string; precheckPublic?: unknown }> {
  const { streamBrainTurn } = await import('../src/lib/tutor/voice/claude-brain');
  const sentences: string[] = [];
  const store = { calls: [] as CallRec[], maxCalls: FULL_LOOP ? 9 : 3, text: () => sentences.join(' ') };
  const tools: Result['tools'] = [];
  let firstSentenceMs: number | null = null;
  let errorMsg: string | undefined;
  let precheckPublic: unknown;
  const t0 = Date.now();
  await als.run(store, async () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      for await (const ev of streamBrainTurn(input as any)) {
        if (ev.type === 'sentence') { firstSentenceMs ??= Date.now() - t0; sentences.push(ev.text); }
        else if (ev.type === 'tool-call') tools.push({ name: ev.name, args: ev.args });
        else if (ev.type === 'verdict-precheck') precheckPublic = ev.result;
      }
    } catch (err) {
      if (!(err instanceof ReplayStop)) errorMsg = (err as Error).message.slice(0, 300);
    }
  });
  return { sentences, tools, calls: store.calls, firstSentenceMs, t0, errorMsg, precheckPublic };
}

/** The browser's before-display kills, replayed on the reply sentence by
 *  sentence with the client's own pure functions. */
async function clientKill(c: Case, sentences: string[], precheckPublic: unknown): Promise<{ action: string; kind: string; reason: string; atSentence: number } | null> {
  if (NO_KILLS) return null;
  const np = await import('../src/lib/tutor/voice/nonanswer-praise');
  const ps = await import('../src/lib/tutor/voice/verdict-precheck-shared');
  const prior = c.lastTutor;
  const pc = ps.sanitizePublicPrecheck(precheckPublic);
  let soFar = '';
  for (let i = 0; i < sentences.length; i++) {
    soFar += (soFar ? ' ' : '') + sentences[i];
    // In production since 2026-10-05 (all arms).
    if (np.shouldKillBareAssentPraise(c.student, soFar, prior, { enabled: true })) {
      return { action: 'bare_assent_praise', kind: 'wh_verdict', reason: np.bareAssentPraiseFeedback(c.student, prior), atSentence: i + 1 };
    }
    if (LEVERS !== 'none') {
      const amb = np.ambiguousAssentKill(c.student, soFar, prior, { enabled: true });
      if (amb) return { action: 'bare_assent_praise', kind: amb, reason: np.ambiguousAssentFeedback(amb, c.student, prior), atSentence: i + 1 };
    }
    if (LEVERS === 'precheck' && i === 0 && pc) {
      const k = ps.precheckOpenerContradiction(pc, sentences[0], { enabled: true });
      if (k) return { action: 'precheck_verdict_contradiction', kind: k, reason: ps.precheckContradictionFeedback(k, pc, c.student), atSentence: 1 };
    }
  }
  return null;
}

async function runOne(c: Case, arm: Arm, run: number, enums: Enumerations): Promise<Result> {
  const { isMetaNarration } = await import('../src/lib/tutor/voice/meta-narration');
  const { classifyTurnShape } = await import('../src/lib/tutor/voice/turn-shape-signal');
  const { buildValidatorFeedback } = await import('../src/lib/tutor/orchestrator/validator-feedback');
  const input = await buildInput(c, enums, arm);
  let precheck: PrecheckRec | undefined;
  const ts = classifyTurnShape(c.student, c.lastTutor);
  if (LEVERS === 'precheck') {
    (input as Record<string, unknown>).verdictPrecheckDeps = {
      ...precheckOverride(PRECHECK_MODEL),
      onResult: (r: PrecheckRec['result'], ms: number) => { precheck = { ms, result: r, shape: ts?.shape, questionKind: ts?.open?.kind, openQuestion: ts?.open?.question }; },
    };
  }
  const first = await streamOnce(input as unknown as Record<string, unknown>);
  let { sentences, tools } = first;
  const { firstSentenceMs, t0 } = first;
  let errorMsg = first.errorMsg;
  let kill: KillRec | undefined;
  const k = sentences.length ? await clientKill(c, sentences, first.precheckPublic) : null;
  if (k) {
    // Exactly what the client sends next: the killed attempt as an assistant
    // turn, the rejection as a runtime turn, the pre-check carried along.
    const killed = sentences.slice(0, k.atSentence).join(' ');
    const retryInput = {
      ...(input as unknown as Record<string, unknown>),
      conversationHistory: [
        ...input.conversationHistory,
        { role: 'user' as const, content: c.student },
        { role: 'assistant' as const, content: killed || '(emitted only tool calls)' },
      ],
      studentTranscript: buildValidatorFeedback({ rejections: [{ action: k.action, reason: k.reason }], attemptKilled: true, originalTranscript: c.student, includeStudentContext: true }),
      ...(first.precheckPublic ? { verdictPrecheckCarry: first.precheckPublic } : {}),
    };
    const second = await streamOnce(retryInput);
    kill = { action: k.action, kind: k.kind, atSentence: k.atSentence, killedReply: sentences.join(' '), retryCalls: second.calls.map((x) => ({ ...x, userContent: undefined })) };
    sentences = second.sentences; tools = second.tools; errorMsg = second.errorMsg ?? errorMsg;
  }
  const store = { calls: first.calls };
  const totalMs = store.calls.reduce((n, k2) => Math.max(n, (k2.startedAt - t0) + (k2.endMs ?? 0)), 0) || Date.now() - t0;
  const reply = sentences.join(' ').trim();
  const j = reply ? await judge(c.lastTutor, c.student, reply) : null;
  const rx = regexStance(reply);
  const stance = j?.stance ?? rx;
  // Where praise is the error (wrong answer, bare token, bare "yes", an
  // unrelated "check my answer"), a praise-word opener counts even when the
  // judge reads the rest of the reply as a correction: "Right — <the tutor's
  // own answer>" to a non-answer is exactly the recorded defect.
  const praiseIsError = !c.expect.includes('AFFIRM');
  const wrongStance = praiseIsError ? stance === 'AFFIRM' || rx === 'AFFIRM' : !c.expect.includes(stance);
  const boardAndReply = reply + ' ' + JSON.stringify(tools);
  const badMaths = !!c.badMaths && c.badMaths.test(boardAndReply);
  const calls = store.calls.map((k2, i) => (i === 0 ? k2 : { ...k2, userContent: undefined }));
  return {
    id: c.id, cls: c.cls, arm: arm + (TAG ? `-${TAG}` : ''), run,
    plan: c.session.homeworkPlan ? 'homework' : 'none', student: c.student, lastTutor: c.lastTutor.slice(-400),
    reply, tools, calls, firstSentenceMs, totalMs, regex: regexStance(reply), judge: j?.stance ?? null,
    reverses: !!j?.reverses, selfTalk: !!j?.selfTalk, delibRegex: DELIB_RE.test(reply),
    metaNarration: sentences.some((sn) => isMetaNarration(sn)),
    markupLeak: /<\/?(?:invoke|parameter|function_calls|antml|tool_use|thinking)\b/i.test(reply),
    badMaths, expect: c.expect, error: !reply || wrongStance || badMaths, errorMsg,
    ...(kill ? { kill } : {}), ...(precheck ? { precheck } : {}), shape: ts?.shape, questionKind: ts?.open?.kind,
  };
}

/** The pre-check alone, per model, on every answer-shaped case. */
async function precheckBench(cases: Case[], enums: Enumerations) {
  const { classifyTurnShape } = await import('../src/lib/tutor/voice/turn-shape-signal');
  const { runVerdictPrecheck } = await import('../src/lib/tutor/voice/verdict-precheck');
  const specs = (opt('precheck-models', 'claude-sonnet-5:low,claude-sonnet-4-6:off')!).split(',');
  const file = path.join(OUT, 'precheck-bench.jsonl');
  const done = new Set<string>();
  if (fs.existsSync(file)) for (const l of fs.readFileSync(file, 'utf8').split('\n').filter(Boolean)) { const r = JSON.parse(l); if (r.result || r.timedOut) done.add(`${r.id}|${r.spec}`); }
  const todo: Array<{ c: Case; spec: string }> = [];
  for (const spec of specs) for (const c of cases) {
    const ts = classifyTurnShape(c.student, c.lastTutor);
    if (ts?.answerShaped && !done.has(`${c.id}|${spec}`)) todo.push({ c, spec });
  }
  console.log(`[precheck-bench] ${todo.length} call(s); answer-shaped cases: ${new Set(todo.map((t) => t.c.id)).size}`);
  let next = 0;
  await Promise.all(Array.from({ length: CONC }, async () => {
    while (next < todo.length) {
      const { c, spec } = todo[next++];
      const input = await buildInput(c, enums, 'low');
      const ts = classifyTurnShape(c.student, c.lastTutor)!;
      const t0 = Date.now();
      // The production cap is 4 s; measure the raw time here (cap 30 s) and
      // report how many would have been cut.
      const r = await runVerdictPrecheck({
        problems: input.homework?.problems, currentProblem: input.homework?.current, activeProblemStatement: input.activeProblem?.statement,
        history: input.conversationHistory, openQuestion: ts.open?.question ?? null, studentMessage: c.student,
      }, { ...precheckOverride(spec), timeoutMs: 30_000 });
      const ms = Date.now() - t0;
      fs.appendFileSync(file, JSON.stringify({ id: c.id, cls: c.cls, spec, ms, shape: ts.shape, questionKind: ts.open?.kind, openQuestion: ts.open?.question, student: c.student, lastTutor: c.lastTutor.slice(-300), result: r, timedOut: !r }) + '\n');
      console.log(`[${spec}] ${c.id} ${ms}ms ${r ? `${r.answers}/${r.verdict}/${r.confidence} proposed="${r.proposed.slice(0, 30)}" correct="${r.correctValue.slice(0, 30)}"` : 'NO RESULT'}`);
    }
  }));
}

function pct(xs: number[], p: number): number {
  if (!xs.length) return NaN;
  const s = [...xs].sort((a, b) => a - b);
  return s[Math.min(s.length - 1, Math.floor((p / 100) * s.length))];
}

// $/MTok, claude-sonnet-5: input 2, output 10, cache read 0.2, 1h cache write 4.
function costOf(calls: CallRec[]): { warm: number; billed: number } {
  let warm = 0, billed = 0;
  for (const k of calls) {
    const u = k.usage ?? {};
    const out = (u.output_tokens ?? 0) * 10 / 1e6;
    const read = (u.cache_read_input_tokens ?? 0), write = (u.cache_creation_input_tokens ?? 0), inp = (u.input_tokens ?? 0);
    billed += out + inp * 2 / 1e6 + read * 0.2 / 1e6 + write * 4 / 1e6;
    // Warm-session cost: what the turn costs once the prefix is cached (as it
    // is from the second turn of a live session): everything cached is a read.
    warm += out + inp * 2 / 1e6 + (read + write) * 0.2 / 1e6;
  }
  return { warm, billed };
}

function report() {
  const file = path.join(OUT, 'results.jsonl');
  // A trial whose model call failed outright (rate limit, billing) is not a
  // result: it is re-run on the next invocation and left out here.
  const rows: Result[] = fs.readFileSync(file, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l) as Result)
    .filter((r) => r.reply || !r.errorMsg);
  const arms = [...new Set(rows.map((r) => r.arm))];
  const classes: Array<Case['cls']> = ['wrong', 'hedge', 'bare', 'yes', 'check', 'maths', 'other'];
  const dates = [...new Set(rows.map((r) => r.id.slice(0, 2)))].sort();
  const offRows = rows.filter((r) => r.arm === 'off' && r.reply);
  // chars → output tokens, calibrated on the control arm (no thinking there).
  const visChars = (r: Result) => r.reply.length + JSON.stringify(r.tools).length;
  const ratio = offRows.reduce((n, r) => n + (r.calls[0]?.usage?.output_tokens ?? 0), 0) / Math.max(1, offRows.reduce((n, r) => n + visChars(r), 0));
  const lines: string[] = [];
  for (const scope of [...dates, 'all']) {
    const inScope = rows.filter((r) => scope === 'all' || r.id.startsWith(scope));
    if (!inScope.length || (scope === 'all' && dates.length < 2)) continue;
    lines.push(`\n=== sessions ${scope === 'all' ? 'both dates' : `2026-10-${scope}`} ===`);
    lines.push(['class', ...arms.map((a) => `${a}: errors/trials`)].join(' | '));
    for (const cls of classes) {
      const cells = arms.map((a) => {
        const xs = inScope.filter((r) => r.cls === cls && r.arm === a);
        if (!xs.length) return '—';
        const e = xs.filter((r) => r.error).length;
        const cases = new Set(xs.map((r) => r.id)).size;
        const anyErr = new Set(xs.filter((r) => r.error).map((r) => r.id)).size;
        return `${e}/${xs.length} (${(100 * e / xs.length).toFixed(0)}%; ${anyErr}/${cases} cases ≥1)`;
      });
      lines.push([cls, ...cells].join(' | '));
    }
  }
  lines.push('\n=== latency / tokens / cost per arm (first model response of the turn) ===');
  for (const a of arms) {
    const xs = rows.filter((r) => r.arm === a && r.calls[0]?.usage);
    if (!xs.length) continue;
    const ft = xs.map((r) => r.calls[0].firstTextMs ?? r.calls[0].firstToolMs ?? r.calls[0].endMs ?? 0);
    const fs1 = xs.filter((r) => r.firstSentenceMs !== null).map((r) => r.firstSentenceMs as number);
    const tot = xs.map((r) => r.calls[0].endMs ?? 0);
    const out = xs.map((r) => r.calls[0].usage!.output_tokens ?? 0);
    const think = xs.map((r) => Math.max(0, (r.calls[0].usage!.output_tokens ?? 0) - Math.round(visChars(r) * ratio)));
    const warm = xs.map((r) => costOf(r.calls.slice(0, 1)).warm);
    const billed = rows.filter((r) => r.arm === a).reduce((n, r) => n + costOf(r.calls).billed, 0);
    const mean = (v: number[]) => v.reduce((n, x) => n + x, 0) / Math.max(1, v.length);
    lines.push(
      `${a}: n=${xs.length} · first text ms p50/p90/max ${pct(ft, 50)}/${pct(ft, 90)}/${Math.max(...ft)}` +
      ` · first sentence ms p50/p90/max ${pct(fs1, 50)}/${pct(fs1, 90)}/${Math.max(...fs1)}` +
      ` · response complete ms p50/p90/max ${pct(tot, 50)}/${pct(tot, 90)}/${Math.max(...tot)}` +
      ` · output tokens mean/p90/max ${mean(out).toFixed(0)}/${pct(out, 90)}/${Math.max(...out)}` +
      ` · thinking tokens (est.) mean/p90/max ${mean(think).toFixed(0)}/${pct(think, 90)}/${Math.max(...think)}` +
      ` · warm cost/response $${mean(warm).toFixed(4)} · billed in this run $${billed.toFixed(2)}` +
      ` · reply words mean ${mean(xs.map((r) => r.reply.split(/\s+/).length)).toFixed(0)}` +
      ` · thinking text returned: ${xs.reduce((n, r) => n + (r.calls[0].thinkingChars ?? 0), 0)} chars` +
      ` · stop=max_tokens ${xs.filter((r) => r.calls[0].stop === 'max_tokens').length}` +
      ` · over 14 s to first text ${ft.filter((x) => x > 14_000).length}` +
      ` · model calls/trial ${mean(xs.map((r) => r.calls.length)).toFixed(2)}` +
      ` · selfTalk(judge) ${xs.filter((r) => r.selfTalk).length} · deliberation(regex) ${xs.filter((r) => r.delibRegex).length} · metaNarration ${xs.filter((r) => r.metaNarration).length} · tool-call markup in text ${xs.filter((r) => r.markupLeak).length}` +
      ` · empty ${rows.filter((r) => r.arm === a && !r.reply).length}`,
    );
  }
  lines.push(`\nchars→tokens ratio (control): ${ratio.toFixed(3)}`);
  lines.push('\n=== every error (arm ≠ expected stance, or wrong maths) ===');
  for (const r of rows.filter((x) => x.error).sort((x, y) => (x.id + x.arm).localeCompare(y.id + y.arm))) {
    lines.push(`[${r.arm} run${r.run}] ${r.id} (${r.cls}; expected ${r.expect.join('/')}; judge=${r.judge} regex=${r.regex}${r.badMaths ? '; WRONG MATHS' : ''}${r.reverses ? '; reverses' : ''})`);
    lines.push(`    tutor asked: …${r.lastTutor.slice(-160).replace(/\n/g, ' ')}`);
    lines.push(`    student: ${r.student.slice(0, 160)}`);
    lines.push(`    reply: ${r.reply.slice(0, 420) || '(EMPTY) ' + (r.errorMsg ?? '')}`);
  }
  lines.push('\n=== judge/regex disagreements that are not errors (read by hand) ===');
  for (const r of rows.filter((x) => !x.error && x.judge && x.judge !== x.regex)) {
    lines.push(`[${r.arm} run${r.run}] ${r.id} judge=${r.judge} regex=${r.regex} :: ${r.reply.slice(0, 200)}`);
  }
  lines.push('\n=== self-talk / deliberation flags ===');
  for (const r of rows.filter((x) => x.selfTalk || x.delibRegex || x.metaNarration || x.markupLeak)) {
    lines.push(`[${r.arm} run${r.run}] ${r.id} selfTalk=${r.selfTalk} regex=${r.delibRegex} meta=${r.metaNarration} markup=${r.markupLeak} :: ${r.reply.slice(0, 300)}`);
  }
  const text = lines.join('\n');
  fs.writeFileSync(path.join(OUT, 'report.txt'), text);
  console.log(text);
}

async function cacheProbe(c: Case, enums: Enumerations) {
  // Which entries can each thinking config read? Same request, config varied.
  const { streamBrainTurn } = await import('../src/lib/tutor/voice/claude-brain');
  const seq: Arm[] = ['off', 'off', 'low', 'low', 'medium', 'off', 'low'];
  for (const arm of seq) {
    process.env.TUTOR_TEXT_THINKING_EFFORT = arm === 'off' ? 'low' : arm;
    const input = await buildInput(c, enums, arm);
    const store = { calls: [] as CallRec[], maxCalls: 1, text: () => '' };
    await als.run(store, async () => {
      try { for await (const ev of streamBrainTurn(input as never)) void ev; } catch (err) { if (!(err instanceof ReplayStop)) throw err; }
    });
    const u = store.calls[0].usage ?? {};
    console.log(`${arm.padEnd(7)} read=${u.cache_read_input_tokens} written=${u.cache_creation_input_tokens} uncached=${u.input_tokens} out=${u.output_tokens}`);
  }
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  if (flag('report')) return report();
  const sessions = loadSessions();
  let cases = buildCases(sessions);
  if (ONLY) cases = cases.filter((c) => ONLY.split(',').some((frag) => c.id.includes(frag)));
  if (LIMIT) cases = cases.slice(0, LIMIT);
  const byClass: Record<string, number> = {};
  for (const c of cases) byClass[c.cls] = (byClass[c.cls] ?? 0) + 1;
  console.log(`sessions=${sessions.length} (homework plan: ${sessions.filter((s) => s.homeworkPlan).length}) cases=${cases.length} ${JSON.stringify(byClass)}`);
  if (flag('list')) {
    for (const c of cases) console.log(`${c.id} [${c.cls}] plan=${c.session.homeworkPlan ? 'homework' : 'none'} :: ${c.student.slice(0, 70)}  ⇐  …${c.lastTutor.slice(-90).replace(/\n/g, ' ')}`);
    return;
  }
  if (!process.env.ANTHROPIC_API_KEY) throw new Error('ANTHROPIC_API_KEY is not set');
  const enums = await loadEnumerations(sessions);
  await installCapture();

  if (flag('count-tokens')) {
    const { getModelClient } = await import('../src/lib/tutor/ai/model-registry');
    const { buildSystemBlocks } = await import('../src/lib/tutor/ai/prompt-cache');
    const { toAnthropicTools } = await import('../src/app/tutor/hooks/toolDefinitions');
    const input = await buildInput(cases[0], enums, 'off');
    const { client, model } = getModelClient('brain');
    const sys = buildSystemBlocks(input.systemPrompt, input.systemPromptCore);
    const count = async (p: Record<string, unknown>) => (await client.messages.countTokens({ model, messages: [{ role: 'user', content: 'x' }], ...p } as never)).input_tokens;
    console.log(`tools=${input.tools.length} tokens: tools=${await count({ tools: toAnthropicTools(input.tools) })} core=${await count({ system: [sys[0]] })} session=${sys[1] ? await count({ system: [sys[1]] }) : 0}`);
    return;
  }
  if (flag('cache-probe')) return cacheProbe(cases[0], enums);
  if (flag('precheck-bench')) return precheckBench(cases, enums);
  if (flag('show-request')) {
    const input = await buildInput(cases[0], enums, ARMS[0]);
    const store = { calls: [] as CallRec[], maxCalls: 1, text: () => '' };
    const { streamBrainTurn } = await import('../src/lib/tutor/voice/claude-brain');
    await als.run(store, async () => { try { for await (const ev of streamBrainTurn(input as never)) void ev; } catch { /* first iteration only */ } });
    console.log(store.calls[0].userContent);
    return;
  }

  const resultsFile = path.join(OUT, 'results.jsonl');
  const done = new Set<string>();
  if (fs.existsSync(resultsFile)) {
    for (const l of fs.readFileSync(resultsFile, 'utf8').split('\n').filter(Boolean)) {
      const r = JSON.parse(l) as Result;
      if (r.reply || !r.errorMsg) done.add(`${r.id}|${r.arm}|${r.run}`);
    }
  }
  for (const arm of ARMS) {
    if (arm !== 'off') process.env.TUTOR_TEXT_THINKING_EFFORT = arm;
    const armName = arm + (TAG ? `-${TAG}` : '');
    const jobs: Array<{ c: Case; run: number }> = [];
    for (let run = 1; run <= RUNS; run++) for (const c of cases) if (!done.has(`${c.id}|${armName}|${run}`)) jobs.push({ c, run });
    console.log(`[${armName}] ${jobs.length} trial(s) to run`);
    let i = 0, spent = 0;
    const write = (r: Result) => {
      fs.appendFileSync(resultsFile, JSON.stringify(r) + '\n');
      spent += costOf(r.calls).billed + costOf(r.kill?.retryCalls ?? []).billed
        + ((r.precheck?.result?.inputTokens ?? 0) * 2 + (r.precheck?.result?.outputTokens ?? 0) * 10) / 1e6;
      const k = r.calls[0];
      console.log(`[${armName} ${++i}/${jobs.length}] ${r.id} r${r.run} ${r.error ? 'ERR ' : 'ok  '} ${r.judge ?? r.regex} first=${k?.firstTextMs ?? '-'}ms end=${k?.endMs ?? '-'}ms out=${k?.usage?.output_tokens ?? '-'} read=${k?.usage?.cache_read_input_tokens ?? '-'} wr=${k?.usage?.cache_creation_input_tokens ?? '-'} $${spent.toFixed(2)}${r.precheck ? ` pc=${r.precheck.ms}ms ${r.precheck.result ? `${r.precheck.result.answers}/${r.precheck.result.verdict}/${r.precheck.result.confidence}` : 'none'}` : ''}${r.kill ? ` KILL(${r.kill.kind})` : ''} :: ${r.reply.slice(0, 80)}`);
    };
    // One trial alone first: it writes the shared tools+core cache entry for
    // this thinking config; the rest then read it.
    if (jobs.length) write(await runOne(jobs[0].c, arm, jobs[0].run, enums));
    let next = 1;
    await Promise.all(Array.from({ length: CONC }, async () => {
      while (next < jobs.length) {
        const j = jobs[next++];
        write(await runOne(j.c, arm, j.run, enums));
      }
    }));
  }
  report();
}

main().catch((err) => { console.error(err); process.exit(1); });
