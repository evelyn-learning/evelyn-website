/**
 * Session PDF export — task 32 (GDI trial lesson, run 18 PDF): pure pins for
 * the exporter's text + layout helpers, plus one end-to-end export under
 * jsPDF's Node build (no DOM: every branch exercised here is native jsPDF).
 *
 *   §A CJK text: sanitiser keeps CJK when the CJK font is embedded, labels it
 *      "[Japanese text]" (kana first, kanji by session language) when not.
 *
 * Run: cd apps/tutor && npx tsx scripts/test-pdf-tutor-session.ts
 */
import { mkdtempSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { sanitizeForPDF, toWinAnsiSafe } from '../src/lib/utils/export/pdf-tutor-session';
import {
  hasCjk, inferSessionLanguages, labelCjkRun, pickPdfFont, CJK_FONT_FAMILY,
} from '../src/lib/utils/export/pdf-cjk-font';

let passed = 0;
let failed = 0;
function check(name: string, cond: boolean, detail?: string) {
  if (cond) { passed++; console.log(`  ok  ${name}`); }
  else { failed++; console.log(`  FAIL ${name}${detail ? `  — ${detail}` : ''}`); }
}

const WITH_FONT = { cjkFont: true, languages: ['en', 'ja'] };
const NO_FONT_JA = { cjkFont: false, languages: ['en', 'ja'] };
const NO_FONT_UNKNOWN = { cjkFont: false, languages: [] as string[] };

console.log('\n§A CJK text');
{
  const title = 'Part 2 · Level check · レベルチェック';
  check('font available: page title keeps its Japanese', sanitizeForPDF(title, { textContext: WITH_FONT }) === title,
    sanitizeForPDF(title, { textContext: WITH_FONT }));
  const gloss = '「営業をしていて、お客様に合う商品を選ぶお手伝いをしています」という意味です。';
  check('font available: gloss with CJK punctuation preserved', sanitizeForPDF(gloss, { textContext: WITH_FONT }) === gloss);
  check('font available: kanji-only table cell preserved', sanitizeForPDF('仕事について', { textContext: WITH_FONT }) === '仕事について');
  check('font available: transcript line preserved (toWinAnsiSafe)',
    toWinAnsiSafe('ここまでのポイント: you worked on it.', WITH_FONT) === 'ここまでのポイント: you worked on it.');
  check('font available: Greek still transliterated', sanitizeForPDF('θ = π/4 and 概要', { textContext: WITH_FONT }) === 'theta = pi/4 and 概要');
  check('font available: non-CJK non-Latin-1 still "?"', sanitizeForPDF('a ☃b 概要', { textContext: WITH_FONT }).includes('概要'));

  check('no font, ja session: kana run → [Japanese text]',
    sanitizeForPDF('Part 2 · レベルチェック', { textContext: NO_FONT_JA }) === 'Part 2 · [Japanese text]',
    sanitizeForPDF('Part 2 · レベルチェック', { textContext: NO_FONT_JA }));
  check('no font, ja session: kanji-only run (仕事) → [Japanese text], not Chinese',
    sanitizeForPDF('仕事', { textContext: NO_FONT_JA }) === '[Japanese text]');
  check('no font: never "??" for CJK', !sanitizeForPDF('概要 まとめ', { textContext: NO_FONT_JA }).includes('?'));
  check('no font: space-separated CJK runs share one label',
    sanitizeForPDF('概要 まとめ', { textContext: NO_FONT_JA }) === '[Japanese text]');
  check('no font, ja session: transcript kanji-only → [Japanese text]',
    toWinAnsiSafe('Today: 現在完了.', NO_FONT_JA) === 'Today: [Japanese text].');
  check('no font, unknown languages: kana still Japanese (kana first)', labelCjkRun('まとめ', []) === '[Japanese text]');
  check('no font, zh session: hanzi → [Chinese text]', labelCjkRun('工作', ['zh']) === '[Chinese text]');
  check('no font, unknown languages: transcript Hindi label unchanged', toWinAnsiSafe('नमस्ते', NO_FONT_UNKNOWN) === '[Hindi speech]');

  check('languages inferred from kana', inferSessionLanguages('仕事 について').includes('ja'));
  check('explicit languages win', inferSessionLanguages('仕事', ['zh']).join() === 'zh');
  check('hasCjk: Latin-only session is false (no font fetch)', !hasCjk('I have worked here for five years. θ π —'));
  check('hasCjk: string array', hasCjk(['abc', 'まとめ']));
  check('pickPdfFont: CJK string + font → NotoSansJP', pickPdfFont('概要', 'helvetica', 'bold', true).family === CJK_FONT_FAMILY);
  check('pickPdfFont: Latin string keeps helvetica bold', pickPdfFont('Overview', 'helvetica', 'bold', true).family === 'helvetica');
  check('pickPdfFont: no font → helvetica', pickPdfFont('概要', 'helvetica', 'normal', false).family === 'helvetica');
}

// ── End-to-end (jsPDF Node build) ──
async function exportRun18Like(fontAvailable: boolean): Promise<string> {
  const { exportTutorSessionPDF } = await import('../src/lib/utils/export/pdf-tutor-session');
  const scratch = mkdtempSync(join(tmpdir(), 'pdf-tutor-session-test-'));
  const prevCwd = process.cwd();
  const prevFetch = globalThis.fetch;
  const fontPath = join(__dirname, '..', 'public', 'fonts', 'NotoSansJP-Regular-subset.ttf');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).fetch = async (url: string) => {
    if (fontAvailable && String(url).endsWith('/fonts/NotoSansJP-Regular-subset.ttf')) {
      const buf = readFileSync(fontPath);
      return new Response(buf);
    }
    return new Response('nope', { status: 404 });
  };
  process.chdir(scratch);
  try {
    await exportTutorSessionPDF(
      [
        { id: '1', timestamp: new Date('2026-11-02T16:46:33Z'), role: 'tutor', text: 'ここまでのポイント: you worked on your job.' },
        { id: '2', timestamp: new Date('2026-11-02T16:47:00Z'), role: 'student', text: 'I worked with a customer from Canada last year.' },
      ],
      [
        { action: 'newPage', data: { title: 'Part 2 · Level check · レベルチェック' } },
        { action: 'showTable', data: { headers: ['#', 'Part', 'Part (ja)'], rows: [['1', 'Overview', '概要']] } },
      ],
      'Work projects',
      'concept-review',
      'Praveen',
      { subject: 'languages', level: 'Adult' },
    );
    const files = readdirSync(scratch).filter((f) => f.endsWith('.pdf'));
    return readFileSync(join(scratch, files[0]), 'latin1');
  } finally {
    process.chdir(prevCwd);
    globalThis.fetch = prevFetch;
    rmSync(scratch, { recursive: true, force: true });
  }
}

async function main() {
  console.log('\n§A end-to-end');
  // No-font first: the loader caches a successful fetch for the page's life.
  const noFont = await exportRun18Like(false);
  check('font fetch fails: PDF has no embedded CJK font', !/NotoSansJP/.test(noFont));
  check('font fetch fails: CJK printed as "[Japanese text]"', noFont.includes('[Japanese text]'));
  check('font fetch fails: no "??" run for the Japanese cells', !/\(\?\?/.test(noFont));
  const withFont = await exportRun18Like(true);
  check('font fetched: PDF embeds the NotoSansJP font', /NotoSansJP/.test(withFont));
  check('font fetched: no "[Japanese text]" label in the PDF', !withFont.includes('[Japanese text]'));

  console.log(`\n${passed} passed, ${failed} failed`);
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error('Fatal error in test-pdf-tutor-session:', err);
  process.exit(1);
});
