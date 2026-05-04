export async function extractDocxText(buffer: Buffer): Promise<string> {
  const mammoth = await import('mammoth');
  const result = await mammoth.extractRawText({ buffer });
  return result.value || '';
}

export async function extractPdfText(buffer: Buffer): Promise<string> {
  // pdf-parse v1 index.js tries to read a test PDF on import — bypass by
  // requiring the internal lib entry point directly.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const pdfParse = require('pdf-parse/lib/pdf-parse');
  const result = await pdfParse(buffer);
  return result.text || '';
}

// Smart quotes (curly single + low-9 + high-reversed-9 single).
const SMART_SINGLE_QUOTES = /[‘’‚‛]/g;
// Smart quotes (curly double + low-9 + high-reversed-9 double).
const SMART_DOUBLE_QUOTES = /[“”„‟]/g;
// En dash, em dash.
const DASHES = /[–—]/g;
// Horizontal ellipsis.
const ELLIPSIS = /…/g;
// Soft hyphen — PDFs love these; they render as nothing visible.
const SOFT_HYPHEN = /­/g;
// Exotic Unicode spaces: NBSP, en/em spaces (U+2000-200A), zero-width space (U+200B),
// narrow no-break (U+202F), medium math (U+205F), ideographic (U+3000).
const EXOTIC_SPACES = /[  -​  　]/g;
// Hyphenated line-break artifact: word-end hyphen, newline, word-start letter.
const HYPHENATED_LINEBREAK = /(\w)-\n(\w)/g;

/**
 * Normalize extracted text so the same essay produces the same input string
 * regardless of source format (PDF vs Word vs Google Doc). Steps:
 *   - CRLF → LF
 *   - smart quotes → straight ASCII quotes (Word/Docs auto-substitute these;
 *     PDF extraction may or may not preserve them)
 *   - en/em dashes → "--"
 *   - ellipsis character → "..."
 *   - soft hyphens dropped
 *   - exotic Unicode spaces (NBSP, en/em, zero-width, narrow, ideographic) → space
 *   - hyphenated line-break artifacts ("extra-\nordinary" → "extraordinary")
 *   - intra-line runs of spaces/tabs → single space, each line trimmed
 *   - 3+ consecutive blank lines → exactly one blank line (paragraph break)
 *   - leading/trailing whitespace stripped overall
 * Paragraph structure is preserved (single \n\n between paragraphs).
 */
export function normalizeExtractedText(text: string): string {
  return text
    .replace(/\r\n/g, '\n')
    .replace(SMART_SINGLE_QUOTES, "'")
    .replace(SMART_DOUBLE_QUOTES, '"')
    .replace(DASHES, '--')
    .replace(ELLIPSIS, '...')
    .replace(SOFT_HYPHEN, '')
    .replace(EXOTIC_SPACES, ' ')
    .replace(HYPHENATED_LINEBREAK, '$1$2')
    .split('\n')
    .map((line) => line.replace(/[ \t]+/g, ' ').trim())
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
