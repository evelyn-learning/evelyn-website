/**
 * Lesson-correction tooling — PURE core (no file, network or database access).
 *
 * Input: the correction writers' patch files (one per subject) and the local
 * lesson extracts (lessons/NNN.json). A patch names a segment and lists field
 * changes `{path, old, new}` with paths relative to the segment.
 *
 * STORED MAPPING (verified against a full dump of the stored documents, see
 * tooling/storage-notes.md): a local lesson's `segments` array is the stored
 * `lessonplans` document's `segments` array — same order, same `id`s, same
 * values, with null-valued fields and `teacherNote` left out. So a segment
 * path `steps[2]` is the stored path `segments.<i>.steps.2`, where `i` is the
 * position of the segment whose `id` equals the patch's `segmentId`. The
 * position is NEVER taken from the local file at write time: the generated
 * script finds it in the stored document by id.
 *
 * OBJECTIVES: a patch whose single change has path `objective.description`
 * and whose `segmentId` is an objective id changes the stored
 * `los.<i>.description` (`i` found by objective id). The same text is stored
 * twice more in the plan's recap — `mustRemember[j]` and inside `teacherNote`
 * (generate-from-text.ts `buildRecapSegment`) — so those copies are changed
 * with it; a copy that a patch already words differently is listed, never
 * overwritten.
 */

export const OBJECTIVE_PATH = 'objective.description';

export interface Change {
  path: string;
  old: string | null;
  new: string;
}

export interface Patch {
  pack: string;
  planId: string;
  segmentId: string;
  findings?: unknown;
  changes: Change[];
  check?: string;
  confidence?: string;
}

export interface PatchFile {
  /** File name, for messages only. */
  file: string;
  subject: string;
  patches: Patch[];
  skipped: unknown[];
}

export interface LessonSegment {
  id: string;
  kind: string;
  [field: string]: unknown;
}

export interface Lesson {
  pack: string;
  planId: string;
  subject?: string;
  title?: string;
  /** Set on a plan expanded from a picker plan: its segment and objective
   *  ids carry the PICKER plan's id, the stored document is `planId`. */
  pickerPack?: string;
  pickerPlanId?: string;
  objectives?: Array<{ id: string; description: string; shortTitle?: string }>;
  segments: LessonSegment[];
}

const SUBJECT_NAMES: Readonly<Record<string, string>> = {
  ALGEBRA_2: 'Algebra 2',
  AP_BIOLOGY: 'AP Biology',
  AP_CALCULUS_AB: 'AP Calculus AB',
  AP_CHEMISTRY: 'AP Chemistry',
  PHYSICS: 'Physics',
  PRECALCULUS: 'Precalculus',
};

/** The recap's brain-facing note, exactly as generate-from-text.ts
 *  `buildRecapSegment` writes it from the objective descriptions. */
export function recapTeacherNote(descriptions: readonly string[]): string {
  const n = descriptions.length;
  return `Recap the ${n} learning objective${n === 1 ? '' : 's'} covered (${descriptions.join('; ')}). Have the student state one takeaway per LO in their own words, celebrate their progress, and close the session.`;
}

export interface ParsedPath {
  field: string;
  /** null = the field itself; a number = that array element; '+' = append. */
  index: number | '+' | null;
}

/** `goal` · `steps[2]` · `steps[+]`. Anything else is not a path. */
export function parsePath(path: unknown): ParsedPath | null {
  if (typeof path !== 'string') return null;
  const m = /^([A-Za-z][A-Za-z0-9_]*)(?:\[(\d+|\+)\])?$/.exec(path);
  if (!m) return null;
  if (m[2] === undefined) return { field: m[1], index: null };
  if (m[2] === '+') return { field: m[1], index: '+' };
  return { field: m[1], index: Number(m[2]) };
}

/** Fields a correction may never touch: identity, structure, and fields the
 *  runtime reads as flags rather than as teaching text. */
const FORBIDDEN_FIELDS: ReadonlySet<string> = new Set([
  'id', 'kind', 'keyCheck', 'responseFormat', 'choices', 'prescribedRender', 'offTopic',
  'estimatedMinutes', 'references', 'vocabulary', 'suggestedTools', 'requiredPhrases',
]);

/** Per kind: the fields that must be present and non-empty after patching
 *  (what parser.ts requires, plus the fields the tutor and practice grade on). */
export const REQUIRED_FIELDS: Readonly<Record<string, ReadonlyArray<{ field: string; array: boolean }>>> = {
  hook: [{ field: 'goal', array: false }],
  concept: [{ field: 'goal', array: false }, { field: 'keyIdeas', array: true }],
  worked_example: [{ field: 'problem', array: false }, { field: 'steps', array: true }, { field: 'answer', array: false }],
  try_yourself: [{ field: 'problem', array: false }, { field: 'expectedAnswer', array: false }],
  recap: [{ field: 'mustRemember', array: true }],
};

export interface Issue {
  level: 'error' | 'warning';
  code: string;
  file: string;
  pack?: string;
  planId?: string;
  segmentId?: string;
  path?: string;
  message: string;
}

/** A field change resolved against the stored mapping. */
export interface ResolvedChange {
  field: string;
  /** Array element index; null for a scalar field. For an append: the index
   *  the new element takes (= the array's length before the append). */
  index: number | null;
  append: boolean;
  old: string | null;
  new: string;
  /** Set on a change this tooling added itself: the objective id whose
   *  description this field is a stored copy of. */
  derived?: string;
}

export interface ResolvedObjective {
  subject: string;
  pack: string;
  planId: string;
  loId: string;
  title: string;
  file: string;
  expanded: boolean;
  old: string;
  new: string;
  check?: string;
  confidence?: string;
}

export interface ObjectiveCopy {
  pack: string;
  planId: string;
  loId: string;
  where: string;
  action: 'changed' | 'already-in-patch' | 'listed';
  detail: string;
}

export interface ResolvedSegment {
  subject: string;
  pack: string;
  planId: string;
  segmentId: string;
  kind: string;
  title: string;
  file: string;
  /** The stored plan is one expanded from a picker plan. */
  expanded: boolean;
  changes: ResolvedChange[];
  /** Original path strings, same order as `changes` (for the review diff). */
  paths: string[];
  check?: string;
  confidence?: string;
}

export interface PracticeImpact {
  itemId: string;
  pack: string;
  subject: string;
  title: string;
  expanded: boolean;
  status: 'withdrawn' | 'objective-1' | 'audited' | 'neither';
  changedFields: string[];
  objective: number | null;
  withdrawn: boolean;
  auditedLessonStep: boolean;
  note: string;
}

export interface ValidationResult {
  ok: boolean;
  files: Array<{ file: string; subject: string; patches: number; changes: number; skipped: number }>;
  totals: { files: number; patches: number; changes: number; plans: number; errors: number; warnings: number };
  issues: Issue[];
  segments: ResolvedSegment[];
  objectives: ResolvedObjective[];
  objectiveCopies: ObjectiveCopy[];
  practiceImpact: PracticeImpact[];
  /** Stored text the patches leave untouched that repeats the patched text. */
  derivedNotWritten: string[];
}

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === 'object' && !Array.isArray(v);
}

/** Shape check of one parsed patch file. Returns problems as strings. */
export function patchFileShapeProblems(raw: unknown): string[] {
  const out: string[] = [];
  if (!isPlainObject(raw)) return ['not a JSON object'];
  if (typeof raw.subject !== 'string' || !raw.subject.trim()) out.push('missing "subject"');
  if (!Array.isArray(raw.patches)) out.push('"patches" is not an array');
  if (raw.skipped !== undefined && !Array.isArray(raw.skipped)) out.push('"skipped" is not an array');
  return out;
}

// eslint-disable-next-line no-control-regex
const CONTROL_RE = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/;
const INVISIBLE_RE = /[​-‏‪-‮⁠﻿�]/;

function count(s: string, re: RegExp): number {
  return (s.match(re) ?? []).length;
}

interface MarkupBalance {
  /** Unbalanced in a way that is never legitimate lesson text. */
  hard: string[];
  /** Unbalanced, but legitimate in maths (a half-open interval `[0, 5)`). */
  soft: string[];
}

/** Which obvious paired markers are unbalanced in `s`. */
export function unbalancedMarkup(s: string): MarkupBalance {
  const hard: string[] = [];
  const soft: string[] = [];
  if (count(s, /\(/g) !== count(s, /\)/g)) soft.push('( )');
  if (count(s, /\[/g) !== count(s, /\]/g)) soft.push('[ ]');
  if (count(s, /\{/g) !== count(s, /\}/g)) hard.push('{ }');
  if (count(s, /(?<!\\)\$/g) % 2 !== 0) soft.push('$');
  if (count(s, /\*\*/g) % 2 !== 0) hard.push('**');
  if (count(s, /`/g) % 2 !== 0) hard.push('`');
  if (count(s, /\\\(/g) !== count(s, /\\\)/g)) hard.push('\\( \\)');
  if (count(s, /\\\[/g) !== count(s, /\\\]/g)) hard.push('\\[ \\]');
  const open = count(s, /<[A-Za-z][A-Za-z0-9]*(?:\s[^<>]*)?>/g);
  const close = count(s, /<\/[A-Za-z][A-Za-z0-9]*>/g);
  if (open !== close) hard.push('<tag>');
  return { hard, soft };
}

/** LaTeX / markdown the original text did not use. */
export function markupStyleOf(s: string): string[] {
  const out: string[] = [];
  if (/\\[A-Za-z]{2,}/.test(s)) out.push('LaTeX command');
  if (/(?<!\\)\$[^$\n]+\$/.test(s)) out.push('$…$');
  if (/\*\*[^*\n]+\*\*/.test(s)) out.push('**bold**');
  if (/`[^`\n]+`/.test(s)) out.push('`code`');
  if (/^#{1,6}\s/m.test(s)) out.push('# heading');
  return out;
}

function normaliseForContainment(s: string): string {
  return s.normalize('NFKC').toLowerCase().replace(/\s+/g, ' ').trim();
}

/** Does `answer` appear verbatim in `text` (case and spacing aside), as a
 *  whole run — not as part of a longer word or number? */
export function containsAnswerVerbatim(text: string, answer: string): boolean {
  const a = normaliseForContainment(answer);
  const t = normaliseForContainment(text);
  if (!a || !t) return false;
  const wordish = /[\p{L}\p{N}]/u;
  let from = 0;
  for (;;) {
    const at = t.indexOf(a, from);
    if (at < 0) return false;
    const before = at > 0 ? t[at - 1] : '';
    const after = at + a.length < t.length ? t[at + a.length] : '';
    const leftOk = !(before && wordish.test(before) && wordish.test(a[0]));
    const rightOk = !(after && wordish.test(after) && wordish.test(a[a.length - 1]));
    // "2" inside "2.5" / "1,200" is part of a longer number, not the answer.
    const numericRun = /[\p{N}]/u.test(a[a.length - 1]) && /^[.,]\p{N}/u.test(t.slice(at + a.length, at + a.length + 2));
    if (leftOk && rightOk && !numericRun) return true;
    from = at + 1;
  }
}

function tryTexts(seg: LessonSegment): string[] {
  const out: string[] = [];
  if (typeof seg.problem === 'string') out.push(seg.problem);
  if (Array.isArray(seg.hints)) for (const h of seg.hints) if (typeof h === 'string') out.push(h);
  return out;
}

function answerLeaks(seg: LessonSegment): boolean {
  const answer = typeof seg.expectedAnswer === 'string' ? seg.expectedAnswer : '';
  if (!answer.trim()) return false;
  return tryTexts(seg).some((t) => containsAnswerVerbatim(t, answer));
}

/** The segment with a patch's changes applied (a deep copy; input untouched).
 *  Assumes the changes resolved without error. */
export function applyResolved(seg: LessonSegment, changes: readonly ResolvedChange[]): LessonSegment {
  const out = JSON.parse(JSON.stringify(seg)) as LessonSegment;
  for (const c of changes) {
    if (c.index === null) {
      out[c.field] = c.new;
    } else {
      const arr = out[c.field] as unknown[];
      if (c.append) arr.push(c.new);
      else arr[c.index] = c.new;
    }
  }
  return out;
}

/** Problems a replacement text introduces relative to the text it replaces. */
function textIssues(base: string, next: string, context: string): Array<['error' | 'warning', string, string]> {
  const out: Array<['error' | 'warning', string, string]> = [];
  if (CONTROL_RE.test(next)) out.push(['error', 'control_char', '"new" contains a control character']);
  if (INVISIBLE_RE.test(next) && !INVISIBLE_RE.test(base)) out.push(['error', 'invisible_char', '"new" introduces an invisible or replacement character']);
  if (/[\n\r\t]/.test(next) && !/[\n\r\t]/.test(base)) out.push(['error', 'line_break', '"new" introduces a line break or tab the original does not have']);
  if (next !== next.trim() && base === base.trim()) out.push(['error', 'edge_space', '"new" introduces leading or trailing white space']);
  const wasBalance = unbalancedMarkup(base);
  const nowBalance = unbalancedMarkup(next);
  const newHard = nowBalance.hard.filter((m) => !wasBalance.hard.includes(m));
  const newSoft = nowBalance.soft.filter((m) => !wasBalance.soft.includes(m));
  if (newHard.length) out.push(['error', 'unbalanced_markup', `"new" introduces unbalanced ${newHard.join(', ')}`]);
  if (newSoft.length) out.push(['warning', 'unbalanced_brackets', `"new" has unbalanced ${newSoft.join(', ')} (fine for a half-open interval or a currency sign — check)`]);
  const newStyle = markupStyleOf(next).filter((m) => !markupStyleOf(context).includes(m));
  if (newStyle.length) out.push(['warning', 'new_markup_style', `"new" uses ${newStyle.join(', ')}, which this text does not use`]);
  return out;
}

/** `<planId>.lo-3-try` → 3. */
export function objectiveNumberOf(segmentId: string): number | null {
  const m = /\.lo-(\d+)-[a-z0-9]+$/.exec(segmentId);
  return m ? Number(m[1]) : null;
}

export interface ValidateOptions {
  /** Practice-item ids (`<planId>::<segmentId>`) on the withdrawn list. */
  withdrawn?: ReadonlySet<string>;
  /** Practice-item ids on the audited lesson-step list. */
  auditedLessonSteps?: ReadonlySet<string>;
}

/**
 * Validate every patch of every file against the local lessons. Nothing is
 * resolved for a patch that has an error; `ok` is true only with zero errors.
 */
export function validatePatches(
  files: readonly PatchFile[],
  lessonsByPack: ReadonlyMap<string, Lesson>,
  opts: ValidateOptions = {},
  waivers: readonly Waiver[] = [],
): ValidationResult {
  const issues: Issue[] = [];
  const usedWaivers = new Set<number>();
  for (const [i, w] of waivers.entries()) {
    const bad = !w || typeof w.planId !== 'string' || typeof w.segmentId !== 'string' || typeof w.code !== 'string'
      ? 'needs planId, segmentId and code'
      : !WAIVABLE_CODES.has(w.code)
        ? `"${w.code}" cannot be waived`
        : typeof w.reason !== 'string' || w.reason.trim().length < 10
          ? 'needs a written reason'
          : null;
    if (bad) {
      usedWaivers.add(i);
      issues.push({ level: 'error', code: 'bad_waiver', file: 'validation-waivers.json', planId: w?.planId, segmentId: w?.segmentId, message: `waiver #${i}: ${bad}` });
    }
  }
  const segments: ResolvedSegment[] = [];
  const objectives: ResolvedObjective[] = [];
  const objectiveCopies: ObjectiveCopy[] = [];
  const practiceImpact: PracticeImpact[] = [];
  const derivedNotWritten: string[] = [];
  const seen = new Map<string, string>();
  const fileRows: ValidationResult['files'] = [];

  for (const pf of files) {
    let changeCount = 0;
    pf.patches.forEach((patch, n) => {
      const where = { file: pf.file, pack: patch?.pack, planId: patch?.planId, segmentId: patch?.segmentId };
      const err = (code: string, message: string, path?: string): void => {
        const wi = waivers.findIndex((w, i) => !(usedWaivers.has(i) && issues.some((x) => x.code === 'bad_waiver' && x.message.startsWith(`waiver #${i}:`)))
          && w && w.code === code && WAIVABLE_CODES.has(code) && w.planId === patch?.planId && w.segmentId === patch?.segmentId
          && typeof w.reason === 'string' && w.reason.trim().length >= 10);
        if (wi >= 0) {
          usedWaivers.add(wi);
          issues.push({ level: 'warning', code: `${code}_waived`, ...where, ...(path ? { path } : {}), message: `${message} — WAIVED: ${waivers[wi].reason.trim()}` });
          return;
        }
        issues.push({ level: 'error', code, ...where, ...(path ? { path } : {}), message });
      };
      const warn = (code: string, message: string, path?: string): void => {
        issues.push({ level: 'warning', code, ...where, ...(path ? { path } : {}), message });
      };
      const before = issues.filter((i) => i.level === 'error').length;

      if (!isPlainObject(patch) || typeof patch.pack !== 'string' || typeof patch.planId !== 'string' || typeof patch.segmentId !== 'string') {
        err('patch_shape', `patch #${n} lacks pack / planId / segmentId`);
        return;
      }
      if (!Array.isArray(patch.changes) || patch.changes.length === 0) {
        err('no_changes', 'patch has no changes');
        return;
      }
      changeCount += patch.changes.length;

      const key = `${patch.planId}::${patch.segmentId}`;
      const first = seen.get(key);
      if (first !== undefined) err('duplicate_segment', `segment already patched in ${first} — one patch per segment across all files`);
      else seen.set(key, pf.file);

      const lesson = lessonsByPack.get(patch.pack);
      if (!lesson) {
        err('unknown_pack', `no local lesson ${patch.pack}.json`);
        return;
      }
      if (lesson.planId !== patch.planId) {
        err('plan_mismatch', `lesson ${patch.pack} is plan ${lesson.planId}, patch says ${patch.planId}`);
        return;
      }
      const subject = SUBJECT_NAMES[lesson.subject ?? ''] ?? pf.subject;
      const expanded = typeof lesson.pickerPlanId === 'string' && lesson.pickerPlanId.length > 0;

      if (patch.changes.some((c) => isPlainObject(c) && c.path === OBJECTIVE_PATH)) {
        if (patch.changes.length !== 1) {
          err('objective_shape', `an objective patch has exactly one change, path "${OBJECTIVE_PATH}"`);
          return;
        }
        const ch = patch.changes[0];
        const los = (lesson.objectives ?? []).filter((o) => o.id === patch.segmentId);
        if (los.length !== 1) {
          err('unknown_objective', los.length === 0 ? 'objective id not in the lesson (segmentId must be the objective id)' : 'objective id appears more than once');
          return;
        }
        if (typeof ch.new !== 'string' || ch.new.trim() === '') {
          err('empty_new', '"new" must be a non-empty string', OBJECTIVE_PATH);
          return;
        }
        if (typeof ch.old !== 'string') {
          err('old_not_string', '"old" must be the exact current string', OBJECTIVE_PATH);
          return;
        }
        if (ch.old !== los[0].description) {
          err('old_mismatch', `"old" is not the current value. Current: ${JSON.stringify(los[0].description)}`, OBJECTIVE_PATH);
          return;
        }
        if (ch.new === ch.old) {
          err('no_op', '"new" equals "old"', OBJECTIVE_PATH);
          return;
        }
        // Descriptions are joined with "; " inside the recap note.
        if (ch.new.includes('; ')) warn('objective_semicolon', 'the new description contains "; ", the separator used between objectives in the recap note', OBJECTIVE_PATH);
        for (const [level, code, message] of textIssues(ch.old, ch.new, ch.old)) {
          if (level === 'error') err(code, message, OBJECTIVE_PATH);
          else warn(code, message, OBJECTIVE_PATH);
        }
        if (issues.filter((i) => i.level === 'error').length > before) return;
        objectives.push({
          subject, pack: patch.pack, planId: patch.planId, loId: patch.segmentId, title: lesson.title ?? '', file: pf.file, expanded,
          old: ch.old, new: ch.new,
          ...(typeof patch.check === 'string' ? { check: patch.check } : {}),
          ...(typeof patch.confidence === 'string' ? { confidence: patch.confidence } : {}),
        });
        return;
      }

      const matches = lesson.segments.filter((s) => s.id === patch.segmentId);
      if (matches.length !== 1) {
        err('unknown_segment', matches.length === 0 ? 'segment id not in the lesson' : 'segment id appears more than once in the lesson');
        return;
      }
      const seg = matches[0];
      if (!(seg.kind in REQUIRED_FIELDS)) warn('unknown_kind', `segment kind "${seg.kind}" has no required-field rule`);

      const resolved: ResolvedChange[] = [];
      const paths: string[] = [];
      const usedPaths = new Set<string>();
      const appendCount = new Map<string, number>();
      for (const ch of patch.changes) {
        const pathText = isPlainObject(ch) && typeof ch.path === 'string' ? ch.path : String((ch as { path?: unknown })?.path);
        const p = isPlainObject(ch) ? parsePath(ch.path) : null;
        if (!p) {
          err('bad_path', `not a valid path: ${pathText}`, pathText);
          continue;
        }
        if (FORBIDDEN_FIELDS.has(p.field)) {
          err('forbidden_field', `"${p.field}" is not teaching text and may not be patched`, pathText);
          continue;
        }
        if (p.index !== '+') {
          if (usedPaths.has(pathText)) {
            err('duplicate_path', 'path listed twice in this patch', pathText);
            continue;
          }
          usedPaths.add(pathText);
        }
        if (typeof ch.new !== 'string' || ch.new.trim() === '') {
          err('empty_new', '"new" must be a non-empty string', pathText);
          continue;
        }
        const current = seg[p.field];
        let oldValue: string | null;
        let index: number | null;
        let append = false;
        if (p.index === null) {
          if (typeof current !== 'string') {
            err('path_not_string', `"${p.field}" is not a string field of this segment`, pathText);
            continue;
          }
          oldValue = current;
          index = null;
        } else {
          if (!Array.isArray(current) || !current.every((x) => typeof x === 'string')) {
            err('path_not_array', `"${p.field}" is not an array of strings in this segment`, pathText);
            continue;
          }
          if (p.index === '+') {
            if (ch.old !== null) {
              err('append_old', 'an append ("[+]") must have "old": null', pathText);
              continue;
            }
            if (p.field !== 'steps') warn('append_field', `append to "${p.field}" — the brief allows appending a step only`, pathText);
            const k = appendCount.get(p.field) ?? 0;
            appendCount.set(p.field, k + 1);
            oldValue = null;
            index = current.length + k;
            append = true;
          } else {
            if (p.index >= current.length) {
              err('index_out_of_range', `"${p.field}" has ${current.length} element(s)`, pathText);
              continue;
            }
            oldValue = current[p.index] as string;
            index = p.index;
          }
        }
        if (!append) {
          if (typeof ch.old !== 'string') {
            err('old_not_string', '"old" must be the exact current string', pathText);
            continue;
          }
          if (ch.old !== oldValue) {
            err('old_mismatch', `"old" is not the current value. Current: ${JSON.stringify(oldValue)}`, pathText);
            continue;
          }
          if (ch.new === ch.old) {
            err('no_op', '"new" equals "old"', pathText);
            continue;
          }
        }
        const base = oldValue ?? '';
        for (const [level, code, message] of textIssues(base, ch.new, JSON.stringify(seg))) {
          if (level === 'error') err(code, message, pathText);
          else warn(code, message, pathText);
        }

        resolved.push({ field: p.field, index, append, old: oldValue, new: ch.new });
        paths.push(pathText);
      }

      if (issues.filter((i) => i.level === 'error').length > before) return;
      // Appends must come after every indexed change of the same array in
      // the stored order; they are applied in listed order.
      const after = applyResolved(seg, resolved);

      for (const req of REQUIRED_FIELDS[seg.kind] ?? []) {
        const v = after[req.field];
        const fine = req.array
          ? Array.isArray(v) && v.length > 0 && v.every((x) => typeof x === 'string' && x.trim() !== '')
          : typeof v === 'string' && v.trim() !== '';
        if (!fine) err('required_field', `after patching, required field "${req.field}" is missing or empty`);
      }

      if (seg.kind === 'try_yourself') {
        const leakedBefore = answerLeaks(seg);
        const leakedAfter = answerLeaks(after);
        if (leakedAfter && !leakedBefore) err('answer_in_problem', 'after patching, the expectedAnswer appears verbatim in the problem or hints');
        else if (leakedAfter) warn('answer_in_problem_existing', 'the expectedAnswer appears verbatim in the problem or hints (it already did before the patch)');
      }

      if (issues.filter((i) => i.level === 'error').length > before) return;

      segments.push({
        subject,
        pack: patch.pack,
        planId: patch.planId,
        segmentId: patch.segmentId,
        kind: seg.kind,
        title: lesson.title ?? '',
        file: pf.file,
        expanded,
        changes: resolved,
        paths,
        ...(typeof patch.check === 'string' ? { check: patch.check } : {}),
        ...(typeof patch.confidence === 'string' ? { confidence: patch.confidence } : {}),
      });

      if (seg.kind === 'try_yourself') {
        const changedFields = [...new Set(resolved.map((c) => c.field))];
        const itemId = `${patch.planId}::${patch.segmentId}`;
        const objective = objectiveNumberOf(patch.segmentId);
        const withdrawn = opts.withdrawn?.has(itemId) ?? false;
        const audited = opts.auditedLessonSteps?.has(itemId) ?? false;
        let note: string;
        let status: PracticeImpact['status'];
        if (withdrawn) {
          status = 'withdrawn';
          note = 'On the withdrawn list (keyed by id): stays unserved as practice on both builds and its stored key stays hidden in a session, even after the fix. Un-withdrawing is a code + data release.';
        } else if (objective === 1) {
          status = 'objective-1';
          note = 'Objective 1 step: served as practice on BOTH builds (frozen included) with no audit gate. New draws show the new text at once; sets already drawn keep the old copy.';
        } else if (audited) {
          status = 'audited';
          note = 'On the audited lesson-step list (keyed by id): the release build serves it to the audited-only partner on the strength of an audit of the OLD text. Re-audit or remove from the list before release. Not served as practice by the frozen build.';
        } else if (expanded) {
          status = 'neither';
          note = 'Objective 2+ step of an expanded plan: not served as practice on either build (skill scope draws from the picker plan, which holds no steps); taught in sessions only.';
        } else {
          status = 'neither';
          note = 'Objective 2+ step not on the audited list: not served as practice to the audited-only partner on either build; taught in sessions only.';
        }
        practiceImpact.push({ itemId, pack: patch.pack, subject, title: lesson.title ?? '', expanded, status, changedFields, objective, withdrawn, auditedLessonStep: audited, note });
      }
    });
    fileRows.push({ file: pf.file, subject: pf.subject, patches: pf.patches.length, changes: changeCount, skipped: pf.skipped.length });
  }

  // Objective descriptions: change the stored copies inside the same plan.
  for (const planId of [...new Set(objectives.map((o) => o.planId))]) {
    const ofPlan = objectives.filter((o) => o.planId === planId);
    const lesson = lessonsByPack.get(ofPlan[0].pack) as Lesson;
    const recap = lesson.segments.find((x) => x.kind === 'recap');
    const list = (o: ResolvedObjective, where: string, action: ObjectiveCopy['action'], detail: string): void => {
      objectiveCopies.push({ pack: o.pack, planId, loId: o.loId, where, action, detail });
    };
    if (!recap || !Array.isArray(recap.mustRemember)) {
      for (const o of ofPlan) list(o, 'recap', 'listed', 'the plan has no recap segment — no copies to change');
    } else {
      let rs = segments.find((x) => x.planId === planId && x.segmentId === recap.id);
      const ensure = (o: ResolvedObjective): ResolvedSegment => {
        if (!rs) {
          rs = { subject: o.subject, pack: o.pack, planId, segmentId: recap.id, kind: 'recap', title: o.title, file: o.file, expanded: o.expanded, changes: [], paths: [] };
          segments.push(rs);
        }
        return rs;
      };
      const items = recap.mustRemember as unknown[];
      for (const o of ofPlan) {
        const at = items.map((v, j) => (v === o.old ? j : -1)).filter((j) => j >= 0);
        if (at.length === 0) list(o, 'recap.mustRemember', 'listed', 'no element equals the old description exactly — nothing changed here; check the recap by hand');
        for (const j of at) {
          const existing = rs?.changes.find((c) => c.field === 'mustRemember' && c.index === j && !c.append);
          if (existing && existing.new === o.new) {
            list(o, `recap.mustRemember[${j}]`, 'already-in-patch', 'a patch already gives this copy the new description');
          } else if (existing) {
            list(o, `recap.mustRemember[${j}]`, 'listed', `a patch words this copy differently and was kept: ${JSON.stringify(existing.new)}`);
            issues.push({ level: 'warning', code: 'objective_copy_differs', file: o.file, pack: o.pack, planId, segmentId: recap.id, path: `mustRemember[${j}]`, message: `the recap copy is patched to ${JSON.stringify(existing.new)}, the objective to ${JSON.stringify(o.new)}` });
          } else {
            const target = ensure(o);
            target.changes.push({ field: 'mustRemember', index: j, append: false, old: o.old, new: o.new, derived: o.loId });
            target.paths.push(`mustRemember[${j}]`);
            list(o, `recap.mustRemember[${j}]`, 'changed', 'copy of the old description — changed with it');
          }
        }
      }
      // The note is rebuilt from ALL descriptions, old and new, by the
      // generator's own formula; the apply script verifies the stored note
      // equals the old one exactly, like any other field.
      const descriptions = (lesson.objectives ?? []).map((x) => x.description);
      const next = (lesson.objectives ?? []).map((x) => ofPlan.find((o) => o.loId === x.id)?.new ?? x.description);
      const target = ensure(ofPlan[0]);
      target.changes.push({ field: 'teacherNote', index: null, append: false, old: recapTeacherNote(descriptions), new: recapTeacherNote(next), derived: ofPlan.map((o) => o.loId).join(', ') });
      target.paths.push('teacherNote (stored only — not in the local lesson file)');
      for (const o of ofPlan) list(o, 'recap.teacherNote', 'changed', 'the note quotes every objective description — old description replaced by the new one');
    }
    for (const o of ofPlan) {
      const lo = (lesson.objectives ?? []).find((x) => x.id === o.loId);
      if (lo?.shortTitle) list(o, 'los[].shortTitle', 'listed', `not a copy of the description, left as is: ${JSON.stringify(lo.shortTitle)} — check it still fits`);
      if (o.expanded) list(o, 'metadata.availableLOs / picker plan', 'listed', `the expanded plan's metadata.availableLOs and the picker plan ${lesson.pickerPlanId} (los, pick-los text) hold the old description — not written`);
    }
  }

  // A recap line changed with no matching objective change leaves its
  // source (the objective description) and the recap note on the old text.
  for (const rs of segments.filter((x) => x.kind === 'recap')) {
    const loose = rs.changes.filter((c) => c.field === 'mustRemember' && !c.derived && !objectives.some((o) => o.planId === rs.planId && o.old === c.old));
    if (loose.length === 0) continue;
    derivedNotWritten.push(`${rs.planId} recap (lesson ${rs.pack}): mustRemember changed without an objective change — the plan's los[].description and recap.teacherNote keep the old wording.`);
    issues.push({ level: 'warning', code: 'recap_copies', file: rs.file, pack: rs.pack, planId: rs.planId, segmentId: rs.segmentId, message: 'recap.mustRemember mirrors los[].description and recap.teacherNote, which no patch changes' });
  }

  waivers.forEach((w, i) => {
    if (usedWaivers.has(i)) return;
    issues.push({ level: 'error', code: 'stale_waiver', file: 'validation-waivers.json', planId: w.planId, segmentId: w.segmentId, message: `waiver #${i} (${w.code}) matches no error — remove it` });
  });

  const errors = issues.filter((i) => i.level === 'error').length;
  const warnings = issues.length - errors;
  return {
    ok: errors === 0,
    files: fileRows,
    totals: {
      files: files.length,
      patches: fileRows.reduce((a, f) => a + f.patches, 0),
      changes: fileRows.reduce((a, f) => a + f.changes, 0),
      plans: new Set([...segments.map((s) => s.planId), ...objectives.map((o) => o.planId)]).size,
      errors,
      warnings,
    },
    issues,
    segments,
    objectives,
    objectiveCopies,
    practiceImpact,
    derivedNotWritten,
  };
}

/* ------------------------------------------------------------------ */
/* Waivers — an owner's decision to accept one flagged patch           */
/* ------------------------------------------------------------------ */

export interface Waiver {
  planId: string;
  segmentId: string;
  code: string;
  reason: string;
}

/** Error codes an owner may waive: a judgement about wording, where the
 *  patch is well-formed and applies cleanly. Everything else (a wrong `old`,
 *  a bad path, a duplicate…) can never be waived. */
export const WAIVABLE_CODES: ReadonlySet<string> = new Set(['answer_in_problem']);

/**
 * Re-validate with waivers: a waived error is reported as a warning
 * (`<code>_waived`, reason attached) and its patch is resolved like any
 * other. A waiver that names a non-waivable code, lacks a reason, or matches
 * no error is itself an error — a stale waiver must not linger unnoticed.
 */
export function validateWithWaivers(
  files: readonly PatchFile[],
  lessonsByPack: ReadonlyMap<string, Lesson>,
  waivers: readonly Waiver[],
  opts: ValidateOptions = {},
): ValidationResult {
  const result = validatePatches(files, lessonsByPack, opts, waivers);
  return result;
}

/* ------------------------------------------------------------------ */
/* Apply data — what the generated mongosh script reads                */
/* ------------------------------------------------------------------ */

export interface ApplyChange {
  field: string;
  index: number | null;
  append: boolean;
  old: string | null;
  new: string;
}

export interface ApplyData {
  formatVersion: 1;
  collection: 'lessonplans';
  database: 'evelyn';
  /** `fields` counts every stored value changed, objective descriptions included. */
  counts: { plans: number; segments: number; fields: number; objectives: number };
  plans: Array<{
    planId: string;
    pack: string;
    subject: string;
    objectives: Array<{ loId: string; old: string; new: string }>;
    segments: Array<{ segmentId: string; kind: string; changes: ApplyChange[] }>;
  }>;
}

/** Group the validated segments by plan. Deterministic order (pack, then the
 *  order the patches were listed in). Appends are moved after the indexed
 *  changes of their segment, keeping their own order. */
export function buildApplyData(segments: readonly ResolvedSegment[], objectives: readonly ResolvedObjective[] = []): ApplyData {
  const byPlan = new Map<string, ApplyData['plans'][number]>();
  const planOf = (x: { planId: string; pack: string; subject: string }): ApplyData['plans'][number] => {
    let plan = byPlan.get(x.planId);
    if (!plan) {
      plan = { planId: x.planId, pack: x.pack, subject: x.subject, objectives: [], segments: [] };
      byPlan.set(x.planId, plan);
    }
    return plan;
  };
  for (const s of [...segments].sort((a, b) => a.pack.localeCompare(b.pack))) {
    const changes = [...s.changes.filter((c) => !c.append), ...s.changes.filter((c) => c.append)]
      .map((c) => ({ field: c.field, index: c.index, append: c.append, old: c.old, new: c.new }));
    planOf(s).segments.push({ segmentId: s.segmentId, kind: s.kind, changes });
  }
  for (const o of objectives) planOf(o).objectives.push({ loId: o.loId, old: o.old, new: o.new });
  const plans = [...byPlan.values()].sort((a, b) => a.pack.localeCompare(b.pack));
  const objectiveCount = plans.reduce((a, p) => a + p.objectives.length, 0);
  return {
    formatVersion: 1,
    collection: 'lessonplans',
    database: 'evelyn',
    counts: {
      plans: plans.length,
      segments: plans.reduce((a, p) => a + p.segments.length, 0),
      fields: objectiveCount + plans.reduce((a, p) => a + p.segments.reduce((b, s) => b + s.changes.length, 0), 0),
      objectives: objectiveCount,
    },
    plans,
  };
}

/* ------------------------------------------------------------------ */
/* Review document                                                     */
/* ------------------------------------------------------------------ */

function fence(text: string): string {
  let ticks = '```';
  while (text.includes(ticks)) ticks += '`';
  return `${ticks}text\n${text}\n${ticks}`;
}

function shortSegment(planId: string, segmentId: string): string {
  return segmentId.startsWith(`${planId}.`) ? segmentId.slice(planId.length + 1) : segmentId;
}

const STATUS_LABEL: Readonly<Record<PracticeImpact['status'], string>> = {
  withdrawn: 'withdrawn',
  'objective-1': 'objective 1 — served now, both builds',
  audited: 'on the audited list',
  neither: 'neither',
};

function cell(text: string): string {
  return text.replace(/\|/g, '\\|').replace(/\s+/g, ' ');
}

/** Summary, then the practice steps that change, then per subject → lesson →
 *  segment: old vs new for each field. */
export function renderDiffMarkdown(result: ValidationResult, generatedAt: string): string {
  const lines: string[] = [];
  const fieldCount = result.objectives.length + result.segments.reduce((a, s) => a + s.changes.length, 0);
  lines.push('# Lesson corrections — old vs new');
  lines.push('');
  lines.push(`Generated ${generatedAt} from ${result.totals.files} patch file(s): ${result.totals.plans} lesson(s), ${result.segments.length} segment(s), ` +
    `${result.objectives.length} objective description(s), ${fieldCount} stored value(s) changed.`);
  lines.push('');
  if (!result.ok) {
    lines.push(`**Validation FAILED: ${result.totals.errors} error(s).** Patches with an error are NOT shown below; see validation-report.json.`);
    lines.push('');
    for (const i of result.issues.filter((x) => x.level === 'error')) {
      lines.push(`- ${i.file}${i.pack ? ` · lesson ${i.pack}` : ''}${i.segmentId ? ` · \`${i.segmentId}\`` : ''}${i.path ? ` · ${i.path}` : ''} — ${i.code}: ${i.message}`);
    }
    lines.push('');
  }
  const subjects = [...new Set([...result.segments.map((s) => s.subject), ...result.objectives.map((o) => o.subject)])].sort();

  lines.push('## Summary');
  lines.push('');
  lines.push('| Subject | Lessons | of which expanded plans | Segments | Objective descriptions | Values changed |');
  lines.push('|---|---:|---:|---:|---:|---:|');
  const row = (name: string, segs: readonly ResolvedSegment[], objs: readonly ResolvedObjective[]): string => {
    const packs = new Set([...segs.map((s) => s.pack), ...objs.map((o) => o.pack)]);
    const expandedPacks = new Set([...segs.filter((s) => s.expanded).map((s) => s.pack), ...objs.filter((o) => o.expanded).map((o) => o.pack)]);
    return `| ${name} | ${packs.size} | ${expandedPacks.size} | ${segs.length} | ${objs.length} | ${objs.length + segs.reduce((a, s) => a + s.changes.length, 0)} |`;
  };
  for (const subject of subjects) lines.push(row(subject, result.segments.filter((s) => s.subject === subject), result.objectives.filter((o) => o.subject === subject)));
  lines.push(row('**Total**', result.segments, result.objectives));
  lines.push('');

  lines.push('## Practice steps whose question or answer changes');
  lines.push('');
  const counts = (st: PracticeImpact['status']): number => result.practiceImpact.filter((p) => p.status === st).length;
  lines.push(`${result.practiceImpact.length} step(s): ${counts('withdrawn')} withdrawn · ${counts('objective-1')} objective 1 (served now, on the frozen build too) · ${counts('audited')} on the audited list · ${counts('neither')} neither.`);
  lines.push('');
  lines.push('- **withdrawn** — never served as practice on either build; the fix shows in sessions only.');
  lines.push('- **objective 1** — served as practice now on both builds; new draws get the new text at once.');
  lines.push('- **on the audited list** — the release build serves it on an audit of the OLD text: re-audit or remove before release.');
  lines.push('- **neither** — not served as practice; taught in sessions only.');
  lines.push('');
  const order: Array<PracticeImpact['status']> = ['objective-1', 'audited', 'neither', 'withdrawn'];
  const segOf = new Map(result.segments.map((s) => [`${s.planId}::${s.segmentId}`, s]));
  lines.push('| Status | Lesson | Step | Field | Old | New |');
  lines.push('|---|---|---|---|---|---|');
  for (const st of order) {
    for (const p of result.practiceImpact.filter((x) => x.status === st).sort((a, b) => a.pack.localeCompare(b.pack))) {
      const s = segOf.get(p.itemId) as ResolvedSegment;
      s.changes.forEach((c, i) => {
        lines.push(`| ${STATUS_LABEL[st]} | ${p.pack}${p.expanded ? ' (expanded)' : ''} ${cell(p.title)} | lo-${p.objective ?? '?'} | ${s.paths[i]} | ${cell(c.old ?? '')} | ${cell(c.new)} |`);
      });
    }
  }
  lines.push('');

  if (result.objectiveCopies.length) {
    lines.push('## Objective descriptions and their stored copies');
    lines.push('');
    lines.push('| Lesson | Objective | Where | What was done |');
    lines.push('|---|---|---|---|');
    for (const c of result.objectiveCopies) lines.push(`| ${c.pack} | ${shortSegment(c.planId, c.loId)} | ${c.where} | ${c.action === 'listed' ? 'NOT changed' : c.action === 'changed' ? 'changed' : 'already in a patch'} — ${cell(c.detail)} |`);
    lines.push('');
  }

  const impactById = new Map(result.practiceImpact.map((p) => [p.itemId, p]));
  for (const subject of subjects) {
    const ofSubject = result.segments.filter((s) => s.subject === subject);
    const objsOfSubject = result.objectives.filter((o) => o.subject === subject);
    lines.push(`## ${subject}`);
    lines.push('');
    const packs = [...new Set([...ofSubject.map((s) => s.pack), ...objsOfSubject.map((o) => o.pack)])].sort();
    for (const pack of packs) {
      const ofPack = ofSubject.filter((s) => s.pack === pack);
      const objsOfPack = objsOfSubject.filter((o) => o.pack === pack);
      const head = ofPack[0] ?? objsOfPack[0];
      lines.push(`### Lesson ${pack} — ${head.title}${head.expanded ? ' (expanded plan)' : ''}`);
      lines.push('');
      lines.push(`Plan \`${head.planId}\``);
      lines.push('');
      for (const o of objsOfPack) {
        lines.push(`#### objective ${shortSegment(o.planId, o.loId).replace(/^.*\.(lo-\d+)$/, '$1')} — description`);
        lines.push('');
        lines.push('Old:');
        lines.push('');
        lines.push(fence(o.old));
        lines.push('');
        lines.push('New:');
        lines.push('');
        lines.push(fence(o.new));
        lines.push('');
        if (o.check) {
          lines.push(`Writer's check: ${o.check}${o.confidence ? ` (confidence: ${o.confidence})` : ''}`);
          lines.push('');
        }
      }
      for (const s of ofPack) {
        lines.push(`#### ${shortSegment(s.planId, s.segmentId).replace(/^gen-[0-9a-f-]{36}\./, '')} (${s.kind})`);
        lines.push('');
        const impact = impactById.get(`${s.planId}::${s.segmentId}`);
        if (impact) {
          lines.push(`Practice step: ${impact.note}`);
          lines.push('');
        }
        s.changes.forEach((c, i) => {
          lines.push(`**${s.paths[i]}**${c.derived ? ' — stored copy of an objective description, changed with it' : ''}`);
          lines.push('');
          if (c.append) {
            lines.push('Added:');
            lines.push('');
            lines.push(fence(c.new));
          } else {
            lines.push('Old:');
            lines.push('');
            lines.push(fence(c.old ?? ''));
            lines.push('');
            lines.push('New:');
            lines.push('');
            lines.push(fence(c.new));
          }
          lines.push('');
        });
        if (s.check) {
          lines.push(`Writer's check: ${s.check}${s.confidence ? ` (confidence: ${s.confidence})` : ''}`);
          lines.push('');
        }
      }
    }
  }
  return `${lines.join('\n').trimEnd()}\n`;
}
