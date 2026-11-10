/// <reference types="node" />
/**
 * Replay harness — v2 offline: the scripted student against the v2 turn engine
 * (src/lib/tutor/v2), with no browser and no client. The board is the engine's
 * own record. This is how v2's teaching is compared with the v1 baseline before
 * a v2 session client exists; audio and the real whiteboard are not exercised.
 *
 * LIVE: real model calls for the tutor and the student. Nothing is written to
 * any database.
 *
 *   npx tsx scripts/tutor/replay-harness/run-offline-v2.ts --fixture calc-lhopital [--arm v2] [--mode voice|text] [--effort low|medium|high] [--max-min N]
 */
import fs from 'node:fs';
import path from 'node:path';

const arg = (k: string, d: string) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };

// Repo-root .env.local into process.env before anything reads it (values are never printed).
for (const line of fs.readFileSync(path.resolve(process.cwd(), '../../.env.local'), 'utf8').split('\n')) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2].trim().replace(/^(['"])(.*)\1$/, '$2');
}

async function main() {
  const { scriptedStudentTurn } = await import('./scripted-student');
  const { scoreRun } = await import('./scorecard');
  const { runV2Turn } = await import('../../../src/lib/tutor/v2/turn');
  const { newV2State } = await import('../../../src/lib/tutor/v2/types');
  const { summariseBoardCall } = await import('../../../src/lib/tutor/v2/board');
  const { getLessonPlan } = await import('../../../src/lib/tutor/lesson-plan/store');
  type Fixture = import('./scripted-student').Fixture;
  type ReplayTurn = import('./scripted-student').ReplayTurn;
  type RunBundle = import('./scorecard').RunBundle;

  const fixture = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures', `${arg('--fixture', 'calc-lhopital')}.json`), 'utf8')) as Fixture;
  const arm = arg('--arm', 'v2');
  const mode = arg('--mode', String(fixture.claims.input_mode ?? 'voice')) as 'voice' | 'text';
  // No --effort means the engine's own default (medium).
  const effortArg = arg('--effort', '');
  const effort = (effortArg || undefined) as 'low' | 'medium' | 'high' | undefined;
  const maxMin = Number(arg('--max-min', String(fixture.maxMinutes)));
  const outDir = arg('--out', path.join(process.cwd(), 'artifacts', 'replay-harness'));
  fs.mkdirSync(outDir, { recursive: true });
  const runId = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`;

  const planId = String(fixture.claims.curriculum_module ?? '');
  const plan = planId ? await getLessonPlan(planId) : null;
  if (planId && !plan) { console.error(`plan ${planId} not found`); process.exit(1); }
  const session = {
    studentName: String(fixture.claims.student_name ?? ''), subject: String(fixture.claims.subject), level: String(fixture.claims.level),
    mode, timeBoxMinutes: fixture.maxMinutes, ...(plan ? { plan } : {}),
  };

  const log: string[] = [];
  const say = (s: string) => { const line = `${new Date().toISOString().slice(11, 19)} ${s}`; console.log(line); log.push(line); };
  const t0 = Date.now();
  // A virtual clock: nobody speaks aloud here, so time is advanced by what was said
  // (about 150 words a minute) plus a pause before each student reply. The tutor is told this time.
  let clockMs = t0;
  const speak = (text: string, pauseMs: number) => { clockMs += Math.round(text.split(/\s+/).filter(Boolean).length * 400) + pauseMs; };
  let state = newV2State(t0);
  const turns: ReplayTurn[] = [];
  const events: RunBundle['events'] = [];
  let endedBy: RunBundle['endedBy'] = 'cap';
  let studentSaid: string | null = null;
  let studentTurns = 0;
  say(`offline v2 fixture=${fixture.name} arm=${arm} mode=${mode} effort=${effort ?? 'engine default'}`);

  while (clockMs - t0 < maxMin * 60000 && studentTurns < fixture.maxStudentTurns) {
    let r;
    try { r = await runV2Turn({ session, state, studentSaid, effort, nowMs: clockMs }); }
    catch (e) { say(`TUTOR ERROR ${(e as Error).message.slice(0, 200)}`); endedBy = 'error'; break; }
    state = r.state;
    events.push({ type: 'brain_turn', message: `Brain ${r.totalMs}ms · ${r.toolCalls.length} tool call(s) · first_sentence=${r.firstTextMs ?? r.totalMs}ms · in=${r.usage.inputTokens} out=${r.usage.outputTokens} cr=${r.usage.cacheReadTokens} cc=${r.usage.cacheCreationTokens}` });
    for (const w of r.withdrawn ?? []) events.push({ type: 'board_withdrawn', message: w });
    for (const t of r.toolCalls) events.push({ type: 'tool_call', message: `${t.name} → ${t.outcome}${t.sayWith ? ` · with "${t.sayWith}"` : ''}${t.inline ? ' · inline' : ''}` });
    say(`TUTOR  ${r.spoken.replace(/\s+/g, ' ').slice(0, 400)}${r.toolCalls.length ? `   [tools: ${r.toolCalls.map((t) => `${t.name}(${t.outcome})`).join(', ')}]` : ''}`);
    const history = [...turns];
    turns.push({ role: 'tutor', text: r.spoken || '(the tutor says nothing and waits)' });
    speak(r.spoken, r.totalMs);
    if (state.closed) { endedBy = 'tutor_close'; break; }
    const board = r.toolCalls.filter((t) => /^painted|^new page/.test(t.outcome) && !['update_session_note', 'set_goal_status', 'end_lesson', 'highlight'].includes(t.name)).map((t) => `${t.name}: ${summariseBoardCall(t.name, t.args)}`);
    const reply = await scriptedStudentTurn(fixture.student, board.length ? `${r.spoken}\n[board now shows] ${board.join(' | ')}` : r.spoken, history);
    if (reply.tag === 'end' || !reply.say) { say('STUDENT(end)'); endedBy = 'student_end'; break; }
    turns.push({ role: 'student', text: reply.say, tag: reply.tag });
    studentTurns += 1; studentSaid = reply.say;
    speak(reply.say, 4000);
    say(`STUDENT(${reply.tag}) ${reply.say.slice(0, 400)}`);
  }

  const bundle: RunBundle = { fixture: fixture.name, arm, startedAt: new Date(t0).toISOString(), minutes: (clockMs - t0) / 60000, turns, events, endedBy };
  const base = path.join(outDir, `${fixture.name}-${arm}-${runId}`);
  fs.writeFileSync(`${base}.json`, JSON.stringify({ ...bundle, note: state.note, goals: state.goals, board: state.board, closeSummary: state.closeSummary }, null, 2));
  fs.writeFileSync(`${base}.log`, log.join('\n'));
  const card = scoreRun(bundle);
  fs.writeFileSync(`${base}.score.json`, JSON.stringify(card, null, 2));
  console.log(`\n=== ${fixture.name} / ${arm} · ${bundle.minutes.toFixed(1)} min · bundle ${base}.json`);
  console.log(`note at end: ${state.note}`);
  console.log(`goals: ${JSON.stringify(state.goals)}`);
  console.log(JSON.stringify(card, null, 2));
}
main().catch((e) => { console.error(e); process.exit(1); });
