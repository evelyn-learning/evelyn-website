/**
 * R54 — every debug-event type the engine emits must be either PERSISTED for
 * embed sessions or EXPLICITLY named as deliberately excluded.
 *
 * WHY THIS GATE EXISTS. `EMBED_DEBUG_EVENT_PREFIXES` (tutor-portal/embed/
 * page.tsx) is a prefix allowlist, and anything outside it is dropped before
 * the session is saved. That is invisible: the event fires, the code looks
 * instrumented, and Mongo simply has no row. It has now bitten three times —
 * twice recorded in that file's own comments, and a third audit on
 * 2026-08-22 found **148 of 283 emitted types uncovered**, 52% of the
 * engine's instrumentation, on the surface carrying essentially all real
 * students.
 *
 * The damage is not the missing rows, it is the CONCLUSIONS drawn from them.
 * Three had already been reached and reported before the audit:
 *   · `posed_problem_unboarded` shipped with an explicit watch condition that
 *     was unfalsifiable, because the event could never arrive;
 *   · `quantities_unanchored` reading zero across the corpus was read as
 *     "the detector never fires" when it measured this filter;
 *   · `image_upload` reading zero across 318 embed sessions was reported as
 *     evidence that uploads never worked.
 * A zero from a filtered instrument is indistinguishable from a real zero,
 * which is the whole class this repo keeps re-learning.
 *
 * So: adding a new event type now forces a CHOICE. Persist it, or name it
 * below. Silence is no longer an option.
 *
 * KNOWN LIMIT, stated rather than papered over: this scans for STRING-LITERAL
 * event types — a bare literal, or (since 2026-10-09) the two literals of a
 * `cond ? 'a' : 'b'` first argument. A type built from a template literal or
 * a variable cannot be seen here and would still slip through (today:
 * `perception_${…}`, covered by its prefix; `pageDecision.event` and
 * `error.name`, not checkable here). If another is added, this gate does not
 * cover it.
 *
 * 2026-10-09 — the gate had been RED on main for weeks (event types nobody
 * had decided on), so seven new types added on a branch went unnoticed
 * inside an already-failing test, and a partner session's stall could not be
 * triaged. A red gate cannot report a NEW failure. The undecided backlog is
 * now named (`UNDECIDED_BACKLOG`) and a second test fails on any orphan
 * OUTSIDE it; the original test stays as it was, and stays red until the
 * backlog is decided.
 *
 * Run: npx tsx scripts/test-embed-debug-coverage.ts
 */
import { strict as assert } from 'node:assert';
import * as fs from 'node:fs';
import * as path from 'node:path';

const SRC = path.join(__dirname, '..', 'src');
const EMBED_PAGE = path.join(SRC, 'app', 'tutor-portal', 'embed', 'page.tsx');

/**
 * Event types deliberately NOT persisted for embed sessions.
 *
 * Being on this list is a decision, not an oversight: every persisted entry
 * lands in Mongo for every real student session, so high-volume per-turn or
 * per-render breadcrumbs stay out unless they earn their place. If you are
 * adding an entry here, the question to answer is "would I want this row
 * when triaging a session that went wrong?" — if yes, persist it instead.
 */
const DELIBERATELY_EXCLUDED = new Set<string>([
  // Per-render / per-sentence bookkeeping — high volume, low triage value.
  'show_dedup_skip', 'visual_dedup_drop', 'within_batch_dual_emit_dedup',
  'duplicate_sentence_dropped', 'duplicate_newpage_strip', 'link_dropped',
  'equation_duplicate_definition', 'equation_prose_filler',
  // 2026-10-06b: the scribble_reject_* family left this list — it is
  // persisted now (three marks vanished in portal-10beb4f5 with no reason).
  'scribble_page_fallback',
  'scrollTo_page_fallback', 'scrollTo_reject_no_match',
  'continuation_guard_strip_newpage', 'tutor_context_strip_newpage',
  'ghost_step_dropped', 'whiteboard_validation_pass', 'page_grouping_pin',
  'conic_curve_carried', 'render_fallback_card', 'server_only_tool',
  'speak_text_gated_emit', 'speak_text_gated_opener', 'queue_skip_synthetic',
  'bridge_phrase_swapped', 'disclaimer_phrase_swapped', 'kill_bridge_spoken',
  'required_phrase_check_deferred', 'dim_mismatch_suppressed',
  // Subject-specific validator chatter — useful in the harness, not in a
  // student session record.
  'acid_base_inconsistent', 'blood_type_mismatch', 'chem_unbalanced',
  'genotype_mismatch', 'punnett_repaired', 'smiles_invalid', 'smiles_mismatch',
  'geometry_mismatch', 'dim_mismatch', 'grammar_issues', 'code_run',
  'show_diagram_solver_rejected', 'narrator_mismatch',
  // Dev/manual/authoring surfaces that never run for a student.
  'dev_forced_kill', 'manual_buffered', 'manual_mode_toggled',
  'manual_send_armed', 'manual_sent', 'rt2_lesson_plan_injected',
  // 'propose_plan_swap' left this list 2026-09-10: the embed now persists it
  // (prefix added alongside the wired swap handler).
  'confirm_plan_los', 'sketch_request', 'sketch_resolved',
  'sketch_dropped', 'sketch_fallback_card', 'student_mark', 'student_mark_dropped',
  'student_mark_idle_send',
  // Routine scroll/page bookkeeping — fires on ordinary navigation, says
  // nothing about whether anything went wrong.
  'scrollTo_page_title_match',
]);

/**
 * Event types that were ALREADY neither persisted nor excluded when the
 * ratchet below was added (2026-10-09). Nobody has decided on them; this list
 * is NOT a decision and is not a place to add a new type — a new type goes
 * in EMBED_DEBUG_EVENT_PREFIXES or DELIBERATELY_EXCLUDED. Entries leave this
 * list when they are decided; the stale check below enforces that.
 */
const UNDECIDED_BACKLOG = new Set<string>([
  'equation_placeholder',
  // Emitted on the server by practice generation (portal/practice-gen.ts).
  'practice_gen_background_stored', 'practice_gen_deadline', 'practice_gen_empty',
  'practice_gen_gate_failed', 'practice_gen_skipped',
  // Seen only once the scan learned to read `cond ? 'a' : 'b'` arguments.
  'rt2_judge_advisory', 'rt2_judge_kill',
  'student_problem_grounding_show_problem', 'student_problem_grounding_worked_example',
]);

/**
 * Types introduced by the 2026-10-08/09 text-session rounds. Pinned by name
 * so that narrowing a prefix later cannot silently drop one.
 */
const TEXT_ROUND_EVENTS = [
  // 2026-10-08: typed message vs the automatic opening turn; a failed
  // realtime connect in a text session; the opener stall retry; the
  // whole-answer reveal guard.
  'opening_turn_superseded', 'typed_queued_after_opening', 'realtime_connect_failed_text',
  'opener_stall_retry', 'whole_answer_reveal_hit', 'whole_answer_reveal_retry', 'whole_answer_reveal_fallback',
  // 2026-10-09: a typed message held for the homework plan; the judge
  // contradicting a pre-check the tutor agreed with.
  'typed_held_for_homework', 'typed_homework_released', 'typed_homework_wait_timeout',
  'judge_precheck_disagreement',
  // Whether the tutor opened a text session, or stood down for the student.
  'text_kickoff', 'homework_text_kickoff', 'homework_text_kickoff_skipped', 'homework_current_problem',
];

let passed = 0, failed = 0;
function test(name: string, fn: () => void) {
  try { fn(); passed++; console.log(`  ✓ ${name}`); }
  catch (e) { failed++; console.log(`  ✗ ${name}`); console.log(`      ${(e as Error).message}`); }
}

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (/\.(ts|tsx)$/.test(entry.name)) out.push(full);
  }
  return out;
}

/** Every string-literal event type passed to onDebugEvent / addDebugEvent. */
function emittedTypes(): Set<string> {
  const re = /(?:onDebugEvent\??\.?\??\(|addDebugEvent\()\s*'([a-zA-Z_][a-zA-Z_0-9]*)'/g;
  // `onDebugEvent?.(cond ? 'a' : 'b', …)` — both literals are emitted types.
  // The condition is a plain expression: no quote, comma or parenthesis.
  const ternary = /(?:onDebugEvent\??\.?\??\(|addDebugEvent\()\s*[^'"`,()?]+\?\s*'([a-zA-Z_][a-zA-Z_0-9]*)'\s*:\s*'([a-zA-Z_][a-zA-Z_0-9]*)'/g;
  const out = new Set<string>();
  for (const file of walk(SRC)) {
    const text = fs.readFileSync(file, 'utf8');
    let m: RegExpExecArray | null;
    while ((m = re.exec(text)) !== null) out.add(m[1]);
    while ((m = ternary.exec(text)) !== null) { out.add(m[1]); out.add(m[2]); }
  }
  return out;
}

function prefixes(): string[] {
  const text = fs.readFileSync(EMBED_PAGE, 'utf8');
  const m = /const EMBED_DEBUG_EVENT_PREFIXES = \[([\s\S]*?)\];/.exec(text);
  assert.ok(m, 'EMBED_DEBUG_EVENT_PREFIXES not found — did it move or get renamed?');
  // STRIP COMMENTS FIRST. The array is heavily commented and those comments
  // contain apostrophes ("R49b's retry-context bug"), so a bare quoted-string
  // scan pairs a comment apostrophe with the next quote and yields garbage
  // "prefixes" — which silently made real entries look missing. This is the
  // repo's own recorded trap (a search matches its own documentation) hitting
  // the very gate written to stop silent drops; the recorded remedy is
  // exactly this line.
  const body = m![1].replace(/\/\/[^\n]*/g, '');
  return [...body.matchAll(/'([^']+)'/g)].map((x) => x[1]);
}

console.log('\nR54 — embed debug-event coverage');

const emitted = emittedTypes();
const prefixList = prefixes();
const covered = (t: string) => prefixList.some((p) => t.startsWith(p));

test('the scanner actually finds events (control — a dead scan proves nothing)', () => {
  // Without this, a regex that matched nothing would make the whole gate
  // pass vacuously — the exact failure mode this file is about.
  assert.ok(emitted.size > 100, `expected >100 emitted types, found ${emitted.size}`);
  assert.ok(emitted.has('turn_latency'), 'known-emitted type missing from scan');
  assert.ok(emitted.has('brain_turn'), 'known-emitted type missing from scan');
});

test('the prefix list parses and is non-trivial (control)', () => {
  assert.ok(prefixList.length > 20, `expected >20 prefixes, found ${prefixList.length}`);
  assert.ok(prefixList.includes('turn_latency'));
});

test('EVERY emitted event type is persisted or explicitly excluded', () => {
  const orphans = [...emitted].filter((t) => !covered(t) && !DELIBERATELY_EXCLUDED.has(t)).sort();
  assert.deepEqual(
    orphans, [],
    `\n${orphans.length} event type(s) are silently dropped for embed sessions.\n` +
    `Either add a prefix to EMBED_DEBUG_EVENT_PREFIXES (tutor-portal/embed/page.tsx)\n` +
    `or add the type to DELIBERATELY_EXCLUDED in this file with a reason:\n` +
    orphans.map((o) => `    ${o}`).join('\n'),
  );
});

test('NO NEW orphan: every emitted type outside the undecided backlog is persisted or excluded', () => {
  // The ratchet. The test above is red while the backlog is undecided, and a
  // red test cannot report a new failure — this one can.
  const fresh = [...emitted].filter((t) => !covered(t) && !DELIBERATELY_EXCLUDED.has(t) && !UNDECIDED_BACKLOG.has(t)).sort();
  assert.deepEqual(
    fresh, [],
    `\n${fresh.length} NEW event type(s) are silently dropped for embed sessions.\n` +
    `Add a prefix to EMBED_DEBUG_EVENT_PREFIXES (tutor-portal/embed/page.tsx) or name the type in\n` +
    `DELIBERATELY_EXCLUDED with a reason — do NOT add it to UNDECIDED_BACKLOG:\n` +
    fresh.map((o) => `    ${o}`).join('\n'),
  );
});

test('the undecided backlog only shrinks (no entry that is decided, or no longer emitted)', () => {
  const stale = [...UNDECIDED_BACKLOG].filter((t) => !emitted.has(t) || covered(t) || DELIBERATELY_EXCLUDED.has(t)).sort();
  assert.deepEqual(stale, [], `UNDECIDED_BACKLOG entries that are now decided or gone — remove them:\n` + stale.map((s) => `    ${s}`).join('\n'));
});

test('the scan reads both literals of a conditional event type (control)', () => {
  assert.ok(emitted.has('homework_text_kickoff') && emitted.has('text_kickoff'), 'cond ? \'a\' : \'b\' not scanned');
  assert.ok(emitted.has('figure_redraw_replace') && emitted.has('figure_evolve_replace'));
});

test('the 2026-10-08/09 text-session events are emitted AND persisted', () => {
  for (const t of TEXT_ROUND_EVENTS) {
    assert.ok(emitted.has(t), `${t} is pinned here but no longer emitted — update this list`);
    assert.ok(covered(t), `${t} must be persisted for embed sessions`);
  }
});

test('the exclusion list has no stale entries', () => {
  // An excluded type that is no longer emitted, or that is now ALSO covered
  // by a prefix, is a lie about the current system — and a reader trusts it.
  const stale = [...DELIBERATELY_EXCLUDED].filter((t) => !emitted.has(t) || covered(t)).sort();
  assert.deepEqual(stale, [], `stale DELIBERATELY_EXCLUDED entries (not emitted, or now covered):\n` +
    stale.map((s) => `    ${s}`).join('\n'));
});

test('the R50-R53 diagnostic families are persisted', () => {
  // These are the ones whose absence produced wrong conclusions.
  for (const t of ['qpin_set', 'qpin_drop', 'qpin_stale_cleared', 'segment_overlong',
                   'posed_problem_unboarded', 'quantities_unanchored',
                   'map_pins_out_of_bounds', 'image_upload', 'ack_echo_refused']) {
    assert.ok(covered(t), `${t} must be persisted for embed sessions`);
  }
});

test('the correctness family is persisted', () => {
  // A tutor stating something false is the single most important thing to
  // have a record of, and none of it was being kept.
  for (const t of ['whiteboard_false_claim', 'fact_wrong', 'wrong_final_answer',
                   'answer_miscorrection', 'spoken_card_mismatch', 'voice_board_mismatch',
                   'context_loss']) {
    assert.ok(covered(t), `${t} must be persisted for embed sessions`);
  }
});

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
