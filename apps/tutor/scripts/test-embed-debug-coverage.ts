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
 * event types. A type built from a template literal or a variable cannot be
 * seen here and would still slip through. No such call exists today; if one
 * is added, this gate does not cover it.
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
  'show_equation_label_duplicate_silent', 'scribble_reject_empty_silent',
  'scribble_reject_no_match_silent', 'scribble_page_fallback',
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
  'confirm_plan_los', 'propose_plan_swap', 'sketch_request', 'sketch_resolved',
  'sketch_dropped', 'sketch_fallback_card', 'student_mark', 'student_mark_dropped',
  'student_mark_idle_send',
  // Routine scroll/page bookkeeping — fires on ordinary navigation, says
  // nothing about whether anything went wrong.
  'scrollTo_page_title_match',
]);

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
  const out = new Set<string>();
  for (const file of walk(SRC)) {
    const text = fs.readFileSync(file, 'utf8');
    let m: RegExpExecArray | null;
    while ((m = re.exec(text)) !== null) out.add(m[1]);
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
