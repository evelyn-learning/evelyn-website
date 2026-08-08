/**
 * Material extraction for Phase-2 doc ingestion.
 *
 * Turns the `materials` a student attaches to a plan-generate request
 * (pasted text, a PDF, a DOCX, or photos of notes — `PlanMaterial` from
 * `@evelyn/portal-contract/v1`, contract v1.10.0) into plain text the
 * existing text-to-plan pipeline (`generate-from-text.ts`,
 * MAX_INPUT_CHARS = 8000 in `/api/tutor/plan-from-text`) can consume
 * unchanged.
 *
 * Design:
 *   - All limits are enforced BEFORE we treat parsed content as usable:
 *     file count, decoded size, and (for PDFs) page count. A parser
 *     throwing for any other reason becomes `extract_failed` — we never
 *     let an extraction library crash the request.
 *   - PDF/DOCX text extraction reuses the byte-decode conventions already
 *     proven in `src/lib/utils/document-extract.ts` (same pdf-parse
 *     require-bypass, same `normalizeExtractedText` post-processing) so a
 *     pasted PDF and a PDF from Drive/plagiarism-detection behave
 *     identically.
 *   - Image materials are ALL batched into a single Claude vision call
 *     (never one call per image) using the same client/model/base64
 *     handling as `/api/tutor/extract-homework` — just a transcription
 *     prompt instead of a problem-extraction one.
 *   - `combinedText` is the join of every material's text; if that
 *     exceeds the pipeline's budget it is condensed with one Haiku call
 *     (`condenseForPipeline`) rather than blindly truncated, so an
 *     LO-extraction pass downstream still sees headings/definitions/
 *     problem types instead of a cut-off mid-paragraph.
 *   - Nothing here ever logs document content — only lengths and counts.
 */

import Anthropic from '@anthropic-ai/sdk';
import type { PlanMaterial } from '@evelyn/portal-contract/v1';
import { extractDocxText, normalizeExtractedText } from '@/lib/utils/document-extract';

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export interface ExtractedMaterial {
  text: string;
  kind: 'pdf' | 'docx' | 'image' | 'text';
  pages?: number;
}

export type ExtractResult =
  | { ok: true; materials: ExtractedMaterial[]; combinedText: string }
  | {
      ok: false;
      code: 'scanned_pdf' | 'too_large' | 'too_many_pages' | 'unsupported' | 'extract_failed';
      message: string;
    };

type ErrResult = Extract<ExtractResult, { ok: false }>;

/* ------------------------------------------------------------------ */
/* Constants                                                           */
/* ------------------------------------------------------------------ */

const MAX_MATERIALS = 4;
const MAX_DECODED_BYTES = 8 * 1024 * 1024; // 8MB decoded per file (contract caps base64 ≤11MB).
const MAX_PDF_PAGES = 30;
const SCANNED_PDF_MIN_AVG_CHARS_PER_PAGE = 40;
const DEFAULT_PIPELINE_TARGET_CHARS = 8000; // matches MAX_INPUT_CHARS in plan-from-text/route.ts
const ALLOWED_IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

// Same vision model extract-homework/route.ts uses for image reads.
const VISION_MODEL_ID = 'claude-sonnet-4-6';
// Same Haiku id generate-from-text.ts uses for its Stage 1/2 calls.
const HAIKU_MODEL_ID = 'claude-haiku-4-5-20251001';
const CONDENSE_MAX_TOKENS = 4096;
const VISION_MAX_TOKENS = 4096;

// Lazy singleton rather than a module-load-time `new Anthropic(...)`: in
// Next.js, env vars are guaranteed loaded before request handling, but a
// plain tsx test script that calls dotenv's config() and then imports this
// module sees its own `import` hoisted ahead of that config() call, so
// process.env.ANTHROPIC_API_KEY would be undefined if read at import time.
// Reading it lazily on first call sidesteps that ordering entirely.
let anthropicClient: Anthropic | null = null;
function getAnthropicClient(): Anthropic {
  if (!anthropicClient) {
    anthropicClient = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return anthropicClient;
}

/* ------------------------------------------------------------------ */
/* extractMaterials                                                    */
/* ------------------------------------------------------------------ */

export async function extractMaterials(materials: PlanMaterial[]): Promise<ExtractResult> {
  if (!materials || materials.length === 0) {
    return { ok: true, materials: [], combinedText: '' };
  }

  // The contract schema already caps this at 4, but a caller could still
  // hand us a raw array that skipped schema validation — re-check.
  if (materials.length > MAX_MATERIALS) {
    return {
      ok: false,
      code: 'too_large',
      message: `Too many files attached (max ${MAX_MATERIALS}).`,
    };
  }

  // Decode + validate every material BEFORE parsing any of them, so a
  // late file's oversize/unsupported-ness fails fast without burning
  // work on the earlier ones.
  const decoded: { material: PlanMaterial; buffer: Buffer }[] = [];
  for (const material of materials) {
    if (!material || !isKnownKind(material.kind)) {
      return { ok: false, code: 'unsupported', message: 'One of the attached files has an unsupported type.' };
    }

    let buffer: Buffer;
    try {
      buffer = Buffer.from(material.data, 'base64');
    } catch (err) {
      console.error('[material-extract] base64 decode failed', err instanceof Error ? err.message : err);
      return { ok: false, code: 'extract_failed', message: 'Could not read one of the attached files.' };
    }

    if (buffer.byteLength > MAX_DECODED_BYTES) {
      return {
        ok: false,
        code: 'too_large',
        message: `One of the attached files is too large (max ${MAX_DECODED_BYTES / (1024 * 1024)}MB).`,
      };
    }

    if (material.kind === 'image') {
      const mimeType = material.mimeType;
      if (!mimeType || !ALLOWED_IMAGE_MIME_TYPES.includes(mimeType)) {
        return { ok: false, code: 'unsupported', message: 'One of the attached images has an unsupported format.' };
      }
    }

    decoded.push({ material, buffer });
  }

  console.log(
    `[material-extract] processing ${decoded.length} material(s): ${decoded
      .map((d) => `${d.material.kind}(${d.buffer.byteLength}b)`)
      .join(', ')}`,
  );

  const results: (ExtractedMaterial | null)[] = new Array(decoded.length).fill(null);
  const imageItems: { position: number; material: PlanMaterial; buffer: Buffer }[] = [];

  for (let i = 0; i < decoded.length; i++) {
    const { material, buffer } = decoded[i];
    if (material.kind === 'text') {
      let text: string;
      try {
        text = buffer.toString('utf8');
      } catch (err) {
        console.error('[material-extract] text decode failed', err instanceof Error ? err.message : err);
        return { ok: false, code: 'extract_failed', message: 'Could not read one of the attached files.' };
      }
      results[i] = { text, kind: 'text' };
      continue;
    }

    if (material.kind === 'pdf') {
      const pdfResult = await extractPdf(buffer);
      if (!pdfResult.ok) return pdfResult.error;
      results[i] = { text: pdfResult.text, kind: 'pdf', pages: pdfResult.pages };
      continue;
    }

    if (material.kind === 'docx') {
      const docxResult = await extractDocx(buffer);
      if (!docxResult.ok) return docxResult.error;
      results[i] = { text: docxResult.text, kind: 'docx' };
      continue;
    }

    // material.kind === 'image' — batched below, one call for all of them.
    imageItems.push({ position: i, material, buffer });
  }

  if (imageItems.length > 0) {
    const imageResult = await transcribeImagesBatch(imageItems);
    if (!imageResult.ok) return imageResult.error;
    imageItems.forEach((item, j) => {
      results[item.position] = { text: imageResult.texts[j], kind: 'image' };
    });
  }

  const finalMaterials = results as ExtractedMaterial[]; // every slot was filled above

  const combinedRaw = finalMaterials.map((m) => m.text).join('\n\n---\n\n');
  const combinedText =
    combinedRaw.length > DEFAULT_PIPELINE_TARGET_CHARS
      ? await condenseForPipeline(combinedRaw, { targetChars: DEFAULT_PIPELINE_TARGET_CHARS })
      : combinedRaw;

  console.log(
    `[material-extract] done: ${finalMaterials.length} material(s), combinedText=${combinedText.length}c` +
      (combinedRaw.length !== combinedText.length ? ` (condensed from ${combinedRaw.length}c)` : ''),
  );

  return { ok: true, materials: finalMaterials, combinedText };
}

function isKnownKind(kind: unknown): kind is PlanMaterial['kind'] {
  return kind === 'pdf' || kind === 'docx' || kind === 'image' || kind === 'text';
}

/* ------------------------------------------------------------------ */
/* PDF                                                                  */
/* ------------------------------------------------------------------ */

interface PdfParseResult {
  text: string;
  numpages: number;
}

async function extractPdf(
  buffer: Buffer,
): Promise<{ ok: true; text: string; pages: number } | { ok: false; error: ErrResult }> {
  let parsed: PdfParseResult;
  try {
    // pdf-parse's index.js probes a bundled test PDF on import — bypass by
    // requiring the internal lib entry point directly (same trick as
    // document-extract.ts's extractPdfText).
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const pdfParseFn = require('pdf-parse/lib/pdf-parse');
    const raw = await pdfParseFn(buffer);
    parsed = { text: raw.text || '', numpages: raw.numpages || 0 };
  } catch (err) {
    console.error(
      `[material-extract] pdf parse failed bytes=${buffer.byteLength}`,
      err instanceof Error ? err.message : err,
    );
    return {
      ok: false,
      error: {
        ok: false,
        code: 'extract_failed',
        message: 'Could not read this PDF. It may be corrupted or password-protected.',
      },
    };
  }

  if (parsed.numpages > MAX_PDF_PAGES) {
    return {
      ok: false,
      error: {
        ok: false,
        code: 'too_many_pages',
        message: `This PDF has ${parsed.numpages} pages; please upload ${MAX_PDF_PAGES} pages or fewer.`,
      },
    };
  }

  const normalized = normalizeExtractedText(parsed.text);
  const avgCharsPerPage = parsed.numpages > 0 ? normalized.length / parsed.numpages : normalized.length;

  if (avgCharsPerPage < SCANNED_PDF_MIN_AVG_CHARS_PER_PAGE) {
    return {
      ok: false,
      error: {
        ok: false,
        code: 'scanned_pdf',
        message:
          'This PDF looks like a scanned image with no selectable text, so we can\'t read it directly. Try taking clear photos of the pages instead and uploading those.',
      },
    };
  }

  return { ok: true, text: normalized, pages: parsed.numpages };
}

/* ------------------------------------------------------------------ */
/* DOCX                                                                 */
/* ------------------------------------------------------------------ */

async function extractDocx(
  buffer: Buffer,
): Promise<{ ok: true; text: string } | { ok: false; error: ErrResult }> {
  try {
    const raw = await extractDocxText(buffer);
    return { ok: true, text: normalizeExtractedText(raw) };
  } catch (err) {
    console.error(
      `[material-extract] docx parse failed bytes=${buffer.byteLength}`,
      err instanceof Error ? err.message : err,
    );
    return {
      ok: false,
      error: {
        ok: false,
        code: 'extract_failed',
        message: 'Could not read this document. It may be corrupted or in an unsupported format.',
      },
    };
  }
}

/* ------------------------------------------------------------------ */
/* Images — ONE vision call for the whole batch                        */
/* ------------------------------------------------------------------ */

const TRANSCRIBE_MATERIAL_PROMPT_SINGLE = `You are transcribing a photo of a student's teaching material (a textbook page, handout, or handwritten notes) so it can be used to build a lesson.

Faithfully transcribe ALL visible text as plain text, preserving:
- Section or topic headings
- Definitions
- Formulas (plain-text math is fine — e.g. x^2, sqrt(x), a/b)
- Problem statements, exactly as written

Do NOT solve any problems, do NOT answer any questions, do NOT add commentary or summary. If the image has no legible text, reply with exactly: [no legible text].`;

function buildBatchTranscribePrompt(n: number): string {
  if (n === 1) return TRANSCRIBE_MATERIAL_PROMPT_SINGLE;
  return `You are transcribing ${n} photos of a student's teaching material (textbook pages, handouts, or handwritten notes), numbered 1 through ${n} in the order shown, so they can be used to build a lesson.

For EACH image, faithfully transcribe ALL visible text as plain text, preserving section/topic headings, definitions, formulas (plain-text math is fine — e.g. x^2, sqrt(x), a/b), and problem statements exactly as written. Do NOT solve any problems, do NOT answer any questions, do NOT add commentary.

Output EXACTLY ${n} sections, in order, each starting on its own line with the exact marker "===MATERIAL i===" (where i is the 1-based image number) followed by that image's transcription. If an image has no legible text, write "[no legible text]" for that section.`;
}

async function transcribeImagesBatch(
  items: { position: number; material: PlanMaterial; buffer: Buffer }[],
): Promise<{ ok: true; texts: string[] } | { ok: false; error: ErrResult }> {
  const n = items.length;

  const imageBlocks = items.map((item) => ({
    type: 'image' as const,
    source: {
      type: 'base64' as const,
      media_type: item.material.mimeType as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp',
      data: item.buffer.toString('base64'),
    },
  }));

  const instructionText =
    n === 1 ? 'Transcribe this teaching material.' : `Transcribe these ${n} teaching materials, in order.`;

  let raw = '';
  try {
    const response = await getAnthropicClient().messages.create({
      model: VISION_MODEL_ID,
      max_tokens: VISION_MAX_TOKENS,
      system: buildBatchTranscribePrompt(n),
      messages: [
        {
          role: 'user',
          content: [...imageBlocks, { type: 'text', text: instructionText }],
        },
      ],
    });
    for (const block of response.content) {
      if (block.type === 'text') raw += block.text;
    }
  } catch (err) {
    console.error(
      `[material-extract] vision transcription failed count=${n}`,
      err instanceof Error ? err.message : err,
    );
    return {
      ok: false,
      error: {
        ok: false,
        code: 'extract_failed',
        message: 'Could not read the uploaded image(s). Please try again with clearer photos.',
      },
    };
  }

  if (n === 1) {
    const trimmed = raw.trim();
    const text = normalizeExtractedText(trimmed === '[no legible text]' ? '' : trimmed);
    return { ok: true, texts: [text] };
  }

  const marker = /===MATERIAL\s+(\d+)===/g;
  const marks: { imageNumber: number; contentStart: number }[] = [];
  let match: RegExpExecArray | null;
  while ((match = marker.exec(raw)) !== null) {
    marks.push({ imageNumber: parseInt(match[1], 10), contentStart: match.index + match[0].length });
  }

  if (marks.length === n) {
    const texts: string[] = new Array(n).fill('');
    for (let i = 0; i < marks.length; i++) {
      const start = marks[i].contentStart;
      // Find the next marker's literal start (don't approximate its length —
      // image numbers can be multi-digit).
      const nextMarkerPos = i + 1 < marks.length ? raw.indexOf('===MATERIAL', marks[i].contentStart) : raw.length;
      const segment = raw.slice(start, nextMarkerPos === -1 ? raw.length : nextMarkerPos).trim();
      const idx = marks[i].imageNumber - 1;
      if (idx >= 0 && idx < n) {
        texts[idx] = normalizeExtractedText(segment === '[no legible text]' ? '' : segment);
      }
    }
    return { ok: true, texts };
  }

  // The model didn't follow the marker format exactly. Rather than lose
  // content, fold everything into the first image's slot — combinedText
  // still carries all transcribed text, just with coarser attribution.
  console.warn(`[material-extract] vision batch marker parse mismatch expected=${n} found=${marks.length}`);
  const texts = new Array(n).fill('');
  texts[0] = normalizeExtractedText(raw.trim());
  return { ok: true, texts };
}

/* ------------------------------------------------------------------ */
/* condenseForPipeline                                                  */
/* ------------------------------------------------------------------ */

const CONDENSE_SYSTEM_PROMPT = `You condense a student's teaching material so it fits a downstream lesson-planning pipeline's input budget, WITHOUT losing what that pipeline needs to extract learning objectives from it.

Rules:
1. PRESERVE: topic/section headings, key definitions, formula names, problem types, and the original section ordering.
2. You MAY drop redundant examples, filler prose, repeated explanations, and verbose asides.
3. Do NOT invent content that isn't in the source.
4. Output ONLY the condensed material as plain text — no preamble, no commentary, no markdown fences.`;

export async function condenseForPipeline(text: string, opts: { targetChars: number }): Promise<string> {
  const target = opts.targetChars;
  if (text.length <= target) return text;

  let condensed = '';
  try {
    const response = await getAnthropicClient().messages.create({
      model: HAIKU_MODEL_ID,
      max_tokens: CONDENSE_MAX_TOKENS,
      system: CONDENSE_SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Condense the following material to roughly ${target} characters or fewer:\n\n${text}`,
            },
          ],
        },
      ],
    });
    for (const block of response.content) {
      if (block.type === 'text') condensed += block.text;
    }
    condensed = condensed.trim();
  } catch (err) {
    console.error(
      `[material-extract] condense call failed inputLen=${text.length} target=${target}`,
      err instanceof Error ? err.message : err,
    );
    // Fail-safe: hard-truncate the original rather than dropping the request.
    return text.slice(0, target);
  }

  if (!condensed) {
    // Empty model output — fall back to a hard truncate of the original
    // rather than returning nothing.
    return text.slice(0, target);
  }

  // Hard floor: condensing is a best-effort shrink, not a guarantee.
  return condensed.length > target ? condensed.slice(0, target) : condensed;
}
