/**
 * Homework/image upload flow — the pure decisions behind TutorSession's
 * student-media path (an uploaded image or a drawn-pad capture).
 *
 * Why this exists: on /tutor under the "Stage + Presence" UI, a `claude-brain`
 * upload was routed to the page's LEGACY handler, which only wrote page-level
 * state that the new UI never renders — the student saw and heard nothing and
 * nothing was saved. The wiring lives in two very large React files; the
 * decisions that wiring depends on live here so they can be tested.
 *
 * Tests: npx tsx scripts/test-upload-flow.ts
 */
import type { WhiteboardCommand } from '@core/knowledge/types';
import { normalizeLiteralLineBreaks } from '@/lib/tutor/whiteboard/inline-math';

export type StudentMediaType = 'image' | 'drawing';

/**
 * Does the PAGE-level upload handler (page.tsx `handleUploadHomework`) own the
 * upload for this engine? Only the legacy `realtime` engine: its branch talks
 * to the realtime socket directly and is kept exactly as it was. Every other
 * engine must use TutorSession's own path, because under the session UI the
 * board and transcript on screen are TutorSession's state, not the page's.
 */
export function pageOwnsUpload(voiceEngine: string | undefined | null): boolean {
  return voiceEngine === 'realtime';
}

export type ExtractionOutcome =
  | { kind: 'extracted'; problem: string }
  /** The request worked but nothing legible came back. */
  | { kind: 'unreadable' }
  /** Network error, server error, or a body that was not the expected JSON. */
  | { kind: 'failed' };

/**
 * Classify the result of POST /api/tutor/extract-homework. A non-2xx is a
 * failure even when its `{ error }` body parses — previously a 500 was read as
 * "nothing in the image", which blamed the student's photo for a server fault.
 */
export function classifyExtraction(
  r: { threw: true } | { httpOk: boolean; body: unknown },
): ExtractionOutcome {
  if ('threw' in r) return { kind: 'failed' };
  if (!r.httpOk || !r.body || typeof r.body !== 'object') return { kind: 'failed' };
  const p = (r.body as { extractedProblem?: unknown }).extractedProblem;
  // A Vision model that double-escapes its JSON hands back the two characters
  // backslash + n instead of line breaks. Fixed once here so the brain marker,
  // the saved card and the numbered-problem split all see real lines.
  if (typeof p === 'string' && p.trim()) return { kind: 'extracted', problem: normalizeLiteralLineBreaks(p.trim()).trim() };
  return { kind: 'unreadable' };
}

/**
 * How long the extraction request may run before it is aborted. Without a
 * bound, a hung request left the "reading the problem…" notice up forever.
 * The bound is generous: it was sized when the route made two sequential
 * Vision/LLM calls on a phone photo (this path now asks for the extraction
 * only — see extractionRequestBody); past it the student is better served by
 * "try again".
 */
export const EXTRACTION_TIMEOUT_MS = 45_000;

/**
 * Body of the session path's POST /api/tutor/extract-homework.
 *
 * `extractOnly: true` — this path uses only `extractedProblem` (the brain
 * writes the reply itself, from the marker below), so the route skips its
 * second model call, the legacy tutor reply, which added seconds to the wait
 * and was thrown away. The page-level legacy caller does not send the flag
 * and still gets its reply.
 *
 * `mimeType` comes from the data URL: the route validates it and passes it to
 * the Vision API as `media_type`, so a GIF announced as PNG is rejected. A
 * string with no data-URL prefix (a bare canvas capture) is announced as PNG.
 */
export function extractionRequestBody(input: {
  dataUrl: string; subject?: string; topic?: string; level?: string;
}): { imageData: string; mimeType: string; subject?: string; topic?: string; level?: string; extractOnly: true } {
  return {
    imageData: input.dataUrl.replace(/^data:image\/[\w.+-]+;base64,/, ''),
    mimeType: dataUrlMimeType(input.dataUrl),
    subject: input.subject,
    topic: input.topic,
    level: input.level,
    extractOnly: true,
  };
}

function dataUrlMimeType(dataUrl: string): string {
  return /^data:(image\/[\w.+-]+);base64,/.exec(dataUrl)?.[1] ?? 'image/png';
}

/**
 * Detail text of the `image_upload` debug event. Emitted once per student
 * image/drawing by TutorSession's `handleStudentInput`, whichever control it
 * came from — it used to be emitted only by the embed's modal fallback, so an
 * upload from the Stage control left no event at all.
 */
export function studentMediaDebugDetail(type: StudentMediaType, dataUrl: string, embedded: boolean): string {
  const what = type === 'image' ? 'Homework upload' : 'Whiteboard drawing';
  return `${what}${embedded ? ' (embed)' : ''}: ${dataUrlMimeType(dataUrl)}`;
}

/**
 * Run an abortable request with a deadline. At `ms` the signal aborts, the
 * request rejects, and the caller's catch treats it like any network error
 * (`classifyExtraction({ threw: true })` → "failed"). The timer is cleared
 * when the request settles first. Hand `signal` to fetch — it also aborts a
 * body read (`resp.json()`) that stalls after the headers arrived.
 */
export async function runWithAbortTimeout<T>(ms: number, run: (signal: AbortSignal) => Promise<T>): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    return await run(controller.signal);
  } finally {
    clearTimeout(timer);
  }
}

/** Token usage in the shape of the session's brain-usage channel. */
export interface ExtractionUsage {
  inputTokens: number;
  outputTokens: number;
  cacheReadTokens: number;
  cacheCreationTokens: number;
}

/**
 * The extraction call's token usage (`usage: { inputTokens, outputTokens }`
 * in the route's 200 body), or null when absent / malformed / zero. The
 * page-level handler this path replaced added it to the session's token
 * usage; dropping it made every upload's Vision cost invisible.
 */
export function extractionUsage(body: unknown): ExtractionUsage | null {
  if (!body || typeof body !== 'object') return null;
  const u = (body as { usage?: unknown }).usage;
  if (!u || typeof u !== 'object') return null;
  const { inputTokens, outputTokens } = u as { inputTokens?: unknown; outputTokens?: unknown };
  const valid = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v) && v >= 0;
  if (!valid(inputTokens) || !valid(outputTokens) || inputTokens + outputTokens === 0) return null;
  return { inputTokens, outputTokens, cacheReadTokens: 0, cacheCreationTokens: 0 };
}

export interface NumberedProblem {
  /** The number as printed on the sheet. */
  n: number;
  /** The item's own wording, without its number. */
  text: string;
}
export interface NumberedProblemSplit {
  /** Text before the first item — instructions shared by all of them. */
  preamble: string;
  problems: NumberedProblem[];
}

// An item number: "(3)", "3)", or "3." / "3:" followed by whitespace (which
// rules out decimals and clock times), optionally led by a label word.
const ITEM_LABEL_SRC = String.raw`(?:(?:problem|question|exercise|no\.?|q|#)\s*)?`;
const ITEM_NUMBER_SRC = String.raw`(?:\((\d{1,3})\)|(\d{1,3})\)|(\d{1,3})[.:](?=\s))`;
const LINE_ITEM_RE = new RegExp(String.raw`^[ \t]*${ITEM_LABEL_SRC}${ITEM_NUMBER_SRC}[ \t]*`, 'gim');
// Mid-line items need the unambiguous bracket forms and a space before them:
// "… 2) 3c = 21" is an item, "f(2)" and "2.5" are not.
const INLINE_ITEM_RE = /(?:^|(?<=\s))(?:\((\d{1,3})\)|(\d{1,3})\))[ \t]+(?=\S)/g;
const MAX_LISTED_PROBLEMS = 40;
const MAX_LISTED_PROBLEM_CHARS = 240;

interface ItemMark { n: number; start: number; end: number }

/** The longest run of marks numbered consecutively upward. A reference such
 *  as "see (1)" inside a later problem breaks no run — it is simply not the
 *  next number. */
function consecutiveRun(marks: ItemMark[], mustStartAtOne: boolean): ItemMark[] {
  let best: ItemMark[] = [];
  for (let i = 0; i < marks.length; i++) {
    if (mustStartAtOne && marks[i].n !== 1) continue;
    const run = [marks[i]];
    for (let j = i + 1; j < marks.length; j++) {
      if (marks[j].n === run[run.length - 1].n + 1) run.push(marks[j]);
    }
    if (run.length > best.length) best = run;
  }
  return best;
}

function splitAtMarks(text: string, marks: ItemMark[]): (NumberedProblemSplit & { marks: ItemMark[] }) | null {
  if (marks.length < 2) return null;
  const problems = marks.map((m, i) => ({
    n: m.n,
    text: text.slice(m.end, i + 1 < marks.length ? marks[i + 1].start : text.length).trim(),
  }));
  // Every item must carry real content: "equation (1) and (2)" leaves the
  // fragment "and" between its marks, which is a reference, not a problem.
  if (problems.some((p) => p.text.length < 5 || !/[A-Za-z0-9]/.test(p.text))) return null;
  return { preamble: text.slice(0, marks[0].start).trim(), problems, marks };
}

function findNumberedItems(text: string): (NumberedProblemSplit & { marks: ItemMark[] }) | null {
  const marksOf = (re: RegExp): ItemMark[] => [...text.matchAll(re)].map((m) => ({
    n: Number(m[1] ?? m[2] ?? m[3]),
    start: m.index ?? 0,
    end: (m.index ?? 0) + m[0].length,
  }));
  const byLine = splitAtMarks(text, consecutiveRun(marksOf(LINE_ITEM_RE), false));
  if (byLine) return byLine;
  // Mid-line items: the list must open the text or follow a finished
  // sentence ("Solve each. 1) …"), never a dangling word ("see (1) and (2)").
  const inline = splitAtMarks(text, consecutiveRun(marksOf(INLINE_ITEM_RE), true));
  return inline && (!inline.preamble || /[.:;!?]$/.test(inline.preamble)) ? inline : null;
}

/**
 * Does this extracted text hold SEVERAL numbered problems? Returns them in
 * order with the shared instructions that precede them, or null for anything
 * that reads as a single problem.
 *
 * Deterministic on purpose. lib/tutor/lesson-plan/enumerate-problems.ts
 * answers the same question with a model call, server-side, for the
 * homework-plan pipeline; this runs in the browser inside the upload wait
 * the student is already sitting through, and it only has to decide whether
 * the marker needs its "these are separate problems" instruction — the
 * brain still receives the full text.
 *
 * Numbered lines are tried first ("1) …", "2. …", "(3) …", "Problem 4: …",
 * any consecutive run, so a sheet printed 7–16 counts). Failing that, items
 * run together on one line ("1) … 2) … 3) …") — bracket forms only, and the
 * run must start at 1. Lettered sub-parts (a, b, c) are parts of ONE problem
 * and are not split.
 *
 * Review 2026-10-04: numbered lines are far more often the PARTS of one
 * problem — answer options, the equations of a system, the steps of a
 * method, the givens, statements to judge, a two-column proof — than a
 * worksheet, and telling the brain "these are N separate problems" there
 * takes the problem apart. So a numbered list is reported only when it is
 * unmistakably a worksheet (looksLikeWorksheet); anything else returns null
 * and gets the ordinary single-problem marker.
 */
export function splitNumberedProblems(text: string): NumberedProblemSplit | null {
  // A page footer is not part of the last problem, nor "text after the list".
  const body = stripTrailingFooter(text);
  const found = findNumberedItems(body);
  if (!found || !looksLikeWorksheet(body, found)) return null;
  return { preamble: found.preamble, problems: found.problems };
}

const MIN_WORKSHEET_ITEMS = 3;
/**
 * Wording in the preamble's LAST sentence that says the items belong
 * together. Review 2026-10-04 (round 2): this used to be single words tested
 * anywhere in the preamble — "steps", "given", "follow…", "choos…" — and it
 * refused ordinary worksheets ("Solve each equation. Show your steps.",
 * "…in each given equation.", "Solve each of the following equations.",
 * "Solve. Choose any method."). Only the specific forms remain.
 */
const PREAMBLE_ONE_PROBLEM_RE = /\bthe\s+following\s+steps\b|\bthese\s+steps\b|\bfollow(?:ing)?\s+(?:the|these)\s+steps\b|\bgiven\s*:|\bsystems?\b|\bsimultaneous\b|\bstatements?\b|\boptions?\b|\bchoose\s+(?:one|the|from)\b|\bwhich\b|\bselect\b|\bproofs?\b/i;
const PREAMBLE_SYSTEM_RE = /\b(?:systems?|simultaneous)\b/i;
/** A line of page furniture: ©, "Name: ____  Date: ____", "Page 1", a
 *  software / publisher line. */
const FOOTER_LINE_RE = /^(?:©|\(c\)\s|copyright\b)|^(?:name|date|period|class|score|teacher)\b\s*(?:[:_]|$)|^page\s+\d+(?:\s+of\s+\d+)?\.?$|\ball\s+rights\s+reserved\b|\bwww\.|\.(?:com|org|net)\b/i;
/** Case-sensitive: a company name, not "use the software to check". */
const PUBLISHER_LINE_RE = /\b(?:Software|LLC|Inc|Ltd|Publishing|Publications)\b/;
const isFooterLine = (line: string): boolean => {
  const t = line.trim();
  return t.length > 0 && t.length <= 80 && (FOOTER_LINE_RE.test(t) || PUBLISHER_LINE_RE.test(t));
};

/** The text without the footer lines that end it. */
function stripTrailingFooter(text: string): string {
  const lines = text.split('\n');
  let end = lines.length;
  let dropped = false;
  while (end > 1) {
    const line = lines[end - 1];
    if (!line.trim()) { end--; continue; }
    if (!isFooterLine(line)) break;
    end--; dropped = true;
  }
  return dropped ? lines.slice(0, end).join('\n') : text;
}

/** The preamble's sentences (a line break ends one too), page furniture
 *  ("Name: ____") left out. */
function preambleSentences(preamble: string): string[] {
  return preamble.split('\n').filter((l) => !isFooterLine(l))
    .flatMap((l) => l.split(/(?<=[.!?])\s+/)).map((x) => x.trim()).filter(Boolean);
}

const INSTRUCTION_VERB_SRC = String.raw`(?:solve|find|simplify|factor|evaluate|calculate|compute|graph|plot|sketch|expand|differentiate|integrate|determine|reduce|add|subtract|multiply|divide)`;
/** "Solve each …", "Find the slope of every …", "Factor completely": an
 *  instruction handed out to every item. */
const DISTRIBUTIVE_INSTRUCTION_RE = new RegExp(String.raw`^${INSTRUCTION_VERB_SRC}\b.*\b(?:each|every|all|completely|the\s+following)\b`, 'i');
/** "Evaluate.", "Simplify.", "Solve:" — the verb and nothing else. */
const BARE_VERB_INSTRUCTION_RE = new RegExp(String.raw`^${INSTRUCTION_VERB_SRC}\s*[.:!]?$`, 'i');
/** A function's name before its bracket ("f(x)", "g'(x)") is not a variable. */
const FUNCTION_NAME_RE = /(?<![A-Za-z])[fgh]'*(?=\()/g;
/** An item that opens with an instruction is a task in its own right. */
const TASK_VERB_RE = /^[^A-Za-z0-9]*(?:solve|find|simplify|factor|evaluate|calculate|graph|write|determine|compute|expand|differentiate|integrate|prove|explain|describe|name|define)\b/i;
const RELATION_RE = /[=<>\u2264\u2265\u2260]|\\(?:leq?|geq?|neq?|lt|gt)\b/;
/** A single letter standing alone ("x", the "y" of "4y") — a variable. */
const VARIABLE_RE = /(?<![A-Za-z])[A-Za-z](?![A-Za-z])/g;
/** "x = 4", "m = 1200 kg", "force = 3000 N": a value, not a task. */
const VALUE_ASSIGNMENT_RE = /^[A-Za-z][A-Za-z_ ]{0,20}?\s*=\s*[-\u2212]?\d[\d.,/]*\s*[A-Za-z\u00b5\u00b0%/^\u00b2\u00b3\d ]{0,12}\.?$/;
/** "12 + 7 = ___", "30 - 4 =", "6 × 5 = ?": the blank is the unknown. */
const BLANK_UNKNOWN_RE = /=\s*(?:_+|\?|\u25a1|\u2610)?\s*$|(?:_{2,}|\u25a1|\u2610)\s*=/;

const plainItem = (t: string) => t.replace(/\$/g, '').replace(/\s+/g, ' ').trim();
const variablesOf = (t: string) => new Set((plainItem(t).replace(/\\[A-Za-z]+/g, ' ').match(VARIABLE_RE) ?? []).map((v) => v));

/**
 * Is this numbered list a worksheet of separate problems? Structural, and
 * every test must pass — the list is otherwise left as one problem:
 *  - at least three items (two numbered lines are a pair of parts, or a
 *    fact and the question about it, as often as two problems);
 *  - the text before item 1 is empty or an instruction, not a question, and
 *    its LAST sentence does not say the items belong together
 *    (PREAMBLE_ONE_PROBLEM_RE);
 *  - nothing follows the last item (a closing "Which are true?", "Find the
 *    acceleration." makes the list its givens) — the caller has already
 *    taken a page footer off;
 *  - EVERY item is a task on its own: it opens with a task verb, or it is
 *    an equation / inequality with an unknown (a variable, or a blank). An
 *    instruction handed out to every item ("Simplify each expression.",
 *    "Factor completely.", a bare "Evaluate.") LICENSES items that are
 *    expressions: each then only needs a digit or a variable;
 *  - the items are not all value assignments ("x = 2" — a list of options
 *    or givens), and the bare equations do not read as one system (several
 *    variables each, shared between them). The system test stands down for
 *    an "each / every / all / the following" instruction ("Graph each
 *    line." over y = 2x + 1, y = −x + 4) unless the preamble itself says
 *    "system" / "simultaneous"; under a bare "Solve:" or no preamble it
 *    applies as before.
 */
function looksLikeWorksheet(text: string, found: NumberedProblemSplit & { marks: ItemMark[] }): boolean {
  const { preamble, problems, marks } = found;
  if (problems.length < MIN_WORKSHEET_ITEMS) return false;
  const sentences = preambleSentences(preamble);
  const lastSentence = sentences[sentences.length - 1] ?? '';
  if (preamble.includes('?') || PREAMBLE_ONE_PROBLEM_RE.test(lastSentence)) return false;
  const distributive = sentences.some((x) => DISTRIBUTIVE_INSTRUCTION_RE.test(x));
  const licensed = distributive || sentences.some((x) => BARE_VERB_INSTRUCTION_RE.test(x));

  // Text after the last item. Items split by line: a paragraph after a blank
  // line, or a continuation line when no earlier item has one (a problem that
  // runs over several lines stays one problem only if that is the list's habit).
  const linesOf = (t: string) => t.split('\n').filter((l) => l.trim()).length;
  const last = problems[problems.length - 1];
  const lastRaw = text.slice(marks[marks.length - 1].end);
  if (/\n[ \t]*\n\s*\S/.test(lastRaw)) return false;
  if (linesOf(last.text) > 1 && !problems.slice(0, -1).some((p) => linesOf(p.text) > 1)) return false;

  const items = problems.map((p) => plainItem(p.text));
  const isVerbTask = (t: string) => TASK_VERB_RE.test(t);
  const isEquationTask = (t: string) => RELATION_RE.test(t) && (variablesOf(t).size > 0 || BLANK_UNKNOWN_RE.test(t));
  const isExpression = (t: string) => /\d/.test(t) || variablesOf(t).size > 0;
  if (!items.every((t) => isVerbTask(t) || isEquationTask(t) || (licensed && isExpression(t)))) return false;
  if (items.every((t) => VALUE_ASSIGNMENT_RE.test(t))) return false;

  // One system of equations: bare equations in several variables that share them.
  if (!distributive || PREAMBLE_SYSTEM_RE.test(preamble)) {
    const multiVar = items.filter((t) => !isVerbTask(t)).map((t) => variablesOf(t.replace(FUNCTION_NAME_RE, ' '))).filter((v) => v.size >= 2);
    if (multiVar.length >= 2 && multiVar.some((a, i) => multiVar.some((b, j) => i !== j && [...a].some((v) => b.has(v))))) return false;
  }
  return true;
}

/**
 * The instruction appended to the success marker when the shared content is
 * several problems. Its wording is about problems in general — nothing about
 * a subject, a topic or a kind of exercise — because the same text is sent
 * for every upload in every course.
 */
function severalProblemsInstruction(split: NumberedProblemSplit): string {
  const clip = (t: string) => {
    const flat = t.replace(/\s+/g, ' ').trim();
    return flat.length > MAX_LISTED_PROBLEM_CHARS ? `${flat.slice(0, MAX_LISTED_PROBLEM_CHARS)}…` : flat;
  };
  const listed = split.problems.slice(0, MAX_LISTED_PROBLEMS).map((p) => `${p.n}. ${clip(p.text)}`);
  const more = split.problems.length - listed.length;
  if (more > 0) listed.push(`(and ${more} more, numbered on in the same way)`);
  const shared = split.preamble ? `\nInstructions they share: "${clip(split.preamble)}"` : '';
  // Worded as an observation ("looks like … If so"), not an assertion: the
  // split is a text heuristic and the brain can see the content itself.
  return ` [This looks like ${split.problems.length} separate numbered problems:\n${listed.join('\n')}${shared}\n`
    + 'If so, do not put the whole list on the board as one problem card. Ask the student which problem they want to start with, or start with the first. '
    + 'Put ONLY the problem being worked into the problem card — that one item, with the shared instructions it needs — and work through the problems one at a time, '
    + 'boarding the next one only when the current one is finished.]';
}

/**
 * The bracketed marker handed to the brain as the student's input.
 *
 * Two contracts with other modules ride on the exact wording:
 *  - it must START "[The student drew|uploaded" — VoiceTutorRealtime's handle
 *    treats that prefix as a real student gesture (starts the session clock,
 *    unlocks audio); any other bracketed string is a synthetic directive;
 *  - the SUCCESS form must keep `the whiteboard. It contains: "X". Respond to
 *    what they shared.]` — marker-student-echo.ts anchors on it to put the
 *    student's problem into the saved transcript.
 * The drawing strings are unchanged. The image FAILURE strings are new: they
 * say what the student actually did (uploaded), tell the tutor it has not seen
 * the image, and have it ask for another try.
 *
 * Several numbered problems (a worksheet): the success form above is kept
 * whole and unchanged as the HEAD of the marker, and a second bracketed
 * sentence follows it. That keeps both contracts — the prefix, and the echo
 * extractor's anchor, which still ends at the first `Respond to what they
 * shared.]` and so saves the worksheet text, never the instruction — and the
 * string as a whole still starts "[" and ends "]", which is how the brain
 * turn recognises a marker. Without the instruction the brain boarded a
 * ten-item worksheet as ONE problem card: the active problem then held ten
 * relations, so answer and step checking stood down, and the student got a
 * wall of text.
 */
export function buildStudentMediaBrainInput(type: StudentMediaType, outcome: ExtractionOutcome): string {
  const did = type === 'drawing' ? 'drew on' : 'uploaded an image to';
  if (outcome.kind === 'extracted') {
    const head = `[The student ${did} the whiteboard. It contains: "${outcome.problem}". Respond to what they shared.]`;
    const split = splitNumberedProblems(outcome.problem);
    return split ? head + severalProblemsInstruction(split) : head;
  }
  if (type === 'drawing') {
    return outcome.kind === 'unreadable'
      ? '[The student drew on the whiteboard but the content could not be extracted. Ask them to describe what it shows.]'
      : '[The student drew on the whiteboard but it could not be analyzed. Ask them to describe what it shows.]';
  }
  return outcome.kind === 'unreadable'
    ? '[The student uploaded an image to the whiteboard, but no problem could be read from it. You have NOT seen its contents — do not guess what it shows. Tell them you could not read the image and ask them to try again with a clearer photo, or to type or say the problem instead.]'
    : '[The student uploaded an image to the whiteboard, but a technical problem stopped it from being processed. You have NOT seen its contents — do not guess what it shows. Tell them the upload did not go through and ask them to try uploading it again, or to type or say the problem instead.]';
}

export type StudentMediaPhase = 'analyzing' | 'unreadable' | 'failed' | 'not-ready';

/** The on-screen notice for each phase (shown in voice AND text sessions). */
export function studentMediaNotice(
  type: StudentMediaType,
  phase: StudentMediaPhase,
): { tone: 'progress' | 'error'; text: string } {
  const upload = type === 'image';
  switch (phase) {
    case 'analyzing':
      return { tone: 'progress', text: upload ? 'Got your upload — reading the problem…' : 'Got your drawing — taking a look…' };
    case 'unreadable':
      return {
        tone: 'error',
        text: upload
          ? 'We couldn’t read a problem in that image. Please try again with a clearer photo, or type the problem.'
          : 'We couldn’t make that out. Please try again, or type it instead.',
      };
    case 'failed':
      return {
        tone: 'error',
        text: upload
          ? 'That upload didn’t go through. Please try uploading it again, or type the problem.'
          : 'That didn’t go through. Please try again, or type it instead.',
      };
    case 'not-ready':
      return {
        tone: 'error',
        text: upload
          ? 'The tutor isn’t ready yet, so the upload wasn’t sent. Please try again in a moment.'
          : 'The tutor isn’t ready yet, so that wasn’t sent. Please try again in a moment.',
      };
  }
}

/** Word-wrap for the card. Keeps explicit line breaks, hard-splits a run longer
 *  than a line, and marks truncation with an ellipsis on the last kept line. */
export function wrapCardText(text: string, maxChars: number, maxLines: number): string[] {
  const out: string[] = [];
  for (const para of text.split(/\r?\n/)) {
    let line = '';
    for (let word of para.split(/\s+/).filter(Boolean)) {
      while (word.length > maxChars) {
        if (line) { out.push(line); line = ''; }
        out.push(word.slice(0, maxChars));
        word = word.slice(maxChars);
      }
      if (!word) continue;
      if (!line) line = word;
      else if (line.length + 1 + word.length <= maxChars) line += ` ${word}`;
      else { out.push(line); line = word; }
    }
    if (line) out.push(line);
  }
  if (out.length <= maxLines) return out;
  const kept = out.slice(0, maxLines);
  kept[maxLines - 1] = `${kept[maxLines - 1]}…`;
  return kept;
}

const escXml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Card text with every numbered item starting its own line. Text that
 *  already has its line breaks comes back unchanged; only items the
 *  extraction ran together on one line ("1) … 2) … 3) …") are broken apart. */
function oneLinePerNumberedItem(text: string): string {
  const found = findNumberedItems(text);
  if (!found) return text;
  let out = text;
  // Last item first, so the earlier offsets stay valid as breaks go in.
  for (const mark of [...found.marks].reverse()) {
    const before = out.slice(0, mark.start);
    if (before.trim() && !/\n[ \t]*$/.test(before)) {
      out = `${before.replace(/[ \t]+$/, '')}\n${out.slice(mark.start)}`;
    }
  }
  return out;
}

const CARD_LINE_CHARS = 54;
const CARD_MAX_LINES = 24;
const CARD_LINE_HEIGHT = 18;

/**
 * The board card that goes through the PERSISTED whiteboard-command channel
 * (onWhiteboardCommand → the host's event log → saved `whiteboardCommands` →
 * replay / PDF) for an uploaded problem.
 *
 * It is the extracted TEXT, not the image: the save payload is re-sent on
 * every periodic flush and on unload via sendBeacon, and a phone photo is
 * megabytes of base64 — it would make every flush huge and the unload save
 * fail outright. The image itself stays on the live board only. Same
 * `showSvgDiagram` action the other student cards use, so every renderer that
 * replays a saved board already draws it.
 */
export function buildUploadedProblemCard(problemText: string): WhiteboardCommand {
  const lines = wrapCardText(oneLinePerNumberedItem(problemText), CARD_LINE_CHARS, CARD_MAX_LINES);
  const height = 44 + Math.max(1, lines.length) * CARD_LINE_HEIGHT;
  const body = lines
    .map((l, i) => `<text x="16" y="${46 + i * CARD_LINE_HEIGHT}" font-size="13" fill="#1e293b">${escXml(l)}</text>`)
    .join('');
  return {
    action: 'showSvgDiagram',
    title: 'Uploaded problem',
    svg: `<svg viewBox="0 0 400 ${height}" xmlns="http://www.w3.org/2000/svg"><rect x="5" y="5" width="390" height="${height - 10}" rx="8" fill="#eff6ff" stroke="#bfdbfe" stroke-width="1"/><text x="16" y="24" font-size="11" fill="#6b7280">Student uploaded this problem:</text>${body}</svg>`,
  } as WhiteboardCommand;
}
