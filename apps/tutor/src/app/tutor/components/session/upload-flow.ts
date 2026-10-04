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
  if (typeof p === 'string' && p.trim()) return { kind: 'extracted', problem: p.trim() };
  return { kind: 'unreadable' };
}

/**
 * How long the extraction request may run before it is aborted. Without a
 * bound, a hung request left the "reading the problem…" notice up forever.
 * The route makes two sequential Vision/LLM calls on a phone photo, so the
 * bound is generous; past it the student is better served by "try again".
 */
export const EXTRACTION_TIMEOUT_MS = 45_000;

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
 */
export function buildStudentMediaBrainInput(type: StudentMediaType, outcome: ExtractionOutcome): string {
  const did = type === 'drawing' ? 'drew on' : 'uploaded an image to';
  if (outcome.kind === 'extracted') {
    return `[The student ${did} the whiteboard. It contains: "${outcome.problem}". Respond to what they shared.]`;
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
  const lines = wrapCardText(problemText, CARD_LINE_CHARS, CARD_MAX_LINES);
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
