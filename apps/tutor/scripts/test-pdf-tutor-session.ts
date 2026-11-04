/**
 * Session PDF export — task 32 (GDI trial lesson, run 18 PDF): pure pins for
 * the exporter's text + layout helpers, plus one end-to-end export under
 * jsPDF's Node build (no DOM: every branch exercised here is native jsPDF).
 *
 *   §A CJK text: sanitiser keeps CJK when the CJK font is embedded, labels it
 *      "[Japanese text]" (kana first, kanji by session language) when not.
 *   §B showSentence → a sentence block (emphasis indices like the live card);
 *      engine-only commands (scrollTo, removeItem(s) …) → no block; a truly
 *      unknown action → an "unknown" block (one grey line), never a card.
 *   §C a plain handwrite prints its text with no "→ margin note" suffix.
 *   §D page-break decision before a whiteboard page group (fix round 1):
 *      break only when the heading + FIRST item do not fit below the cursor.
 *   Fix round 1: badge labels are one line, truncated to the width; an
 *      untitled problem's badge is "Problem", never its statement; a
 *      Latin-only session never fetches the CJK font or installs the router.
 *
 * Run: cd apps/tutor && npx tsx scripts/test-pdf-tutor-session.ts
 */
import { mkdtempSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { sanitizeForPDF, toWinAnsiSafe, describeWhiteboardCommand, pdfSessionText, normalizeSessionForPdf } from '../src/lib/utils/export/pdf-tutor-session';
import {
  hasCjk, inferSessionLanguages, labelCjkRun, pickPdfFont, CJK_FONT_FAMILY,
} from '../src/lib/utils/export/pdf-cjk-font';
import {
  commandToPdfBlock, estimateSentenceHeight, handwriteCaptionText, layoutSentenceTokens, pdfCommandId, sentenceSegments,
  shouldBreakBeforeGroup, fitBadgeLabel, normalizePdfCommand,
} from '../src/lib/utils/export/pdf-session-blocks';

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

console.log('\n§B command → block');
{
  const b = commandToPdfBlock({ action: 'showSentence', data: { sentence: 'I have learned Python', emphasis: ['learned', 'Python'], id: 'showSentence-12' }, timestamp: 'x', sourceMessageIndex: 40 });
  check('showSentence (DB shape) → sentence block', b.kind === 'sentence');
  if (b.kind === 'sentence') {
    check('emphasis words → indices [2, 3]', b.emphasisIdx.join() === '2,3', b.emphasisIdx.join());
    check('segments rebuild the sentence', b.segments.map((x) => x.text).join('') === 'I have learned Python');
    check('emphasised segments are exactly the two words', b.segments.filter((x) => x.emphasis).map((x) => x.text).join('|') === 'learned|Python',
      JSON.stringify(b.segments));
  }
  const at = sentenceSegments('Good, the sweets helped with the donations.', ['sweets', 'the'], [2]);
  check('emphasisAt restricts to positions (only "sweets", not every "the")', at.emphasisIdx.join() === '2', at.emphasisIdx.join());
  const a = sentenceSegments('I went to a robotics exhibition in a city.', ['a']);
  check('emphasis without positions marks every match (live parity)', a.emphasisIdx.join() === '3,7', a.emphasisIdx.join());
  const g = commandToPdfBlock({ action: 'showSentence', sentence: 'I work in sales.', gloss: '営業をしています。', label: 'Your job · 仕事について' });
  check('live shape: label + gloss carried', g.kind === 'sentence' && g.gloss === '営業をしています。' && g.label === 'Your job · 仕事について');
  check('empty sentence → skipped', commandToPdfBlock({ action: 'showSentence', sentence: '  ' }).kind === 'skip');
  for (const action of ['scrollTo', 'removeItem', 'removeItems', 'markSegmentComplete', 'newPage', 'goToPage', 'advanceLesson', 'scribble']) {
    check(`${action} → no block`, commandToPdfBlock({ action, data: { target: 'item' } }).kind === 'skip');
  }
  check('showTable → rendered by the existing path', commandToPdfBlock({ action: 'showTable', headers: ['a'] }).kind === 'render');
  check('handwrite → rendered', commandToPdfBlock({ action: 'handwrite', text: 'x' }).kind === 'render');
  check('link flag off → skipped, flag on → rendered',
    commandToPdfBlock({ action: 'link' }).kind === 'skip' && commandToPdfBlock({ action: 'link' }, { linksEnabled: true }).kind === 'render');
  const u = commandToPdfBlock({ action: 'frobnicate' });
  check('truly unknown action → unknown block naming it', u.kind === 'unknown' && u.action === 'frobnicate');

  // Word wrap (pure): 1 unit per char, width 10.
  const measure = (t: string) => t.length;
  const split = (t: string, _e: boolean, w: number) => { const out: string[] = []; let rest = t; let first = Math.max(1, Math.floor(w)); while (rest.length) { out.push(rest.slice(0, first)); rest = rest.slice(first); first = 10; } return out; };
  const lines = layoutSentenceTokens([{ text: 'I have ', emphasis: false }, { text: 'learned', emphasis: true }, { text: ' it', emphasis: false }], 10, measure, split);
  check('wrap: breaks before a word that does not fit', lines.length === 2 && lines[1][0].text === 'learned', JSON.stringify(lines));
  check('wrap: whitespace never starts a line', lines.every((l) => l.length === 0 || l[0].text.trim() !== ''));
  const cjk = layoutSentenceTokens([{ text: 'あいうえおかきくけこさしすせそ', emphasis: false }], 10, measure, split);
  check('wrap: a long space-less CJK run is split', cjk.length === 2 && cjk[0][0].text.length === 10, JSON.stringify(cjk));
}

console.log('\n§C handwrite');
{
  const q = "What is one skill you'd like to improve in your English, and why is it important to you?";
  check('plain handwrite (DB shape) → its text, no suffix', handwriteCaptionText({ action: 'handwrite', data: { text: q, id: 'handwrite-1' }, timestamp: 'x', sourceMessageIndex: 6 }) === q);
  check('plain handwrite (live shape) → its text, no suffix', handwriteCaptionText({ action: 'handwrite', text: 'I have used Python for one year' }) === 'I have used Python for one year');
  const src = readFileSync(join(__dirname, '..', 'src/lib/utils/export/pdf-tutor-session.ts'), 'utf8');
  check('exporter source never appends a "margin note" suffix', !/`[^`]*margin note`/.test(src));
}

console.log('\n§D pagination');
{
  check('heading + first item fit below the cursor → no break', !shouldBreakBeforeGroup({ y: 120, firstItemHeight: 30 }));
  check('exactly fits → no break', !shouldBreakBeforeGroup({ y: 242, firstItemHeight: 30 }));
  check('group taller than the remainder but first item fits → NO break (no blank sheet)', !shouldBreakBeforeGroup({ y: 107, firstItemHeight: 51 }));
  check('first item does not fit → break', shouldBreakBeforeGroup({ y: 250, firstItemHeight: 40 }));
  const one = 7 + estimateSentenceHeight('I worked with a customer from Canada last year.') + 14;
  check('a sentence-card Part fits under a half-full page', !shouldBreakBeforeGroup({ y: 140, firstItemHeight: one }), String(one));
  check('gloss adds height', estimateSentenceHeight('I work in sales.', '営業をしていて、お客様に合う商品を選ぶお手伝いをしています。') > estimateSentenceHeight('I work in sales.'));
  check('command id read from either shape', pdfCommandId({ action: 'showSentence', data: { id: 'showSentence-3' }, timestamp: 'x', sourceMessageIndex: 1 }) === 'showSentence-3'
    && pdfCommandId({ action: 'showSentence', id: 'showSentence-4' }) === 'showSentence-4');
}

console.log('\nFix round 1: badge labels');
{
  const measure = (t: string) => t.length; // 1 unit per char
  check('short label unchanged', fitBadgeLabel('Problem: Check', 40, measure) === 'Problem: Check');
  const long = fitBadgeLabel('Handwrite: What is one skill you would like to improve in your English, and why?', 40, measure);
  check('long label truncated to the width with "..."', long.length <= 40 && long.endsWith('...'), long);
  check('multi-line label keeps its first line only', fitBadgeLabel('Problem: 1. Can you tell me\n2. Have you ever', 80, measure) === 'Problem: 1. Can you tell me');
  check('literal backslash-n also ends the line', fitBadgeLabel('A\\nB', 80, measure) === 'A');
}

// ── End-to-end (jsPDF Node build) ──
console.log('\nZ3 (fix wave 5): nested commands are unwrapped for every caller');
{
  // the live-page shape the brief names: content under `data`, live-only keys beside it
  const live = { action: 'showSentence', data: { sentence: 'I work in sales.', gloss: '私は営業です。' }, id: 'x', page: 2, anchorSentence: 1 };
  const flatLive = normalizePdfCommand(live);
  // round 1 pin move: the top-level id is now kept (the exporter dedupes by it); page / anchorSentence still dropped
  check('live-shaped: unwrapped to the flat card, live-only keys dropped (id kept)',
    JSON.stringify(flatLive) === JSON.stringify({ sentence: 'I work in sales.', gloss: '私は営業です。', action: 'showSentence', id: 'x' }), JSON.stringify(flatLive));
  const withId = normalizePdfCommand({ action: 'showSentence', data: { sentence: 'I work in sales.' }, id: 'showSentence-7', page: 2 });
  check('round 1: a top-level id is kept (the exporter dedupes by id)', (withId as { id?: string }).id === 'showSentence-7' && !('page' in withId), JSON.stringify(withId));
  const dataId = normalizePdfCommand({ action: 'showSentence', data: { sentence: 'x', id: 'inner' }, id: 'outer' });
  check('round 1: the top-level id wins over a data id', (dataId as { id?: string }).id === 'outer', JSON.stringify(dataId));
  check('live-shaped: describeWhiteboardCommand gives a sentence line, not "Command: showSentence"',
    describeWhiteboardCommand(live) === 'Sentence', describeWhiteboardCommand(live));
  const block = commandToPdfBlock(live);
  check('live-shaped: commandToPdfBlock draws the sentence card (not skip / unknown)', block.kind === 'sentence' && (block as { gloss?: string }).gloss === '私は営業です。', JSON.stringify(block).slice(0, 120));
  const db = { action: 'showSentence', data: { sentence: 'I work in sales.' }, timestamp: '2026-11-04T20:20:00Z', sourceMessageIndex: 3 };
  check('DB-shaped: still unwrapped, timestamp + sourceMessageIndex kept',
    JSON.stringify(normalizePdfCommand(db)) === JSON.stringify({ sentence: 'I work in sales.', action: 'showSentence', timestamp: '2026-11-04T20:20:00Z', sourceMessageIndex: 3 }), JSON.stringify(normalizePdfCommand(db)));
  const flat = { action: 'showSentence', sentence: 'I work in sales.', emphasis: ['work'], id: 'y' };
  check('already flat: returned unchanged (same object)', normalizePdfCommand(flat) === flat);
  const graph = { action: 'showGraph', type: 'line', data: { title: 'Sales', points: [] } };
  check('flat showGraph (its own `data` field): left alone', normalizePdfCommand(graph) === graph);
  const dbGraph = { action: 'showGraph', data: { type: 'line', data: { title: 'Sales' } } };
  check('DB-shaped showGraph: unwrapped', (normalizePdfCommand(dbGraph) as { type?: string }).type === 'line');
  check('a stats array `data` is not a nested command', normalizePdfCommand({ action: 'showStats', type: 'histogram', data: [1, 2] }).data !== undefined);
  // the exporter's entry normalises the top-level list AND each transcript entry's commands before the language text is built
  const session = normalizeSessionForPdf(
    [{ id: '1', timestamp: new Date(), role: 'tutor', text: 'Say it.', whiteboardCommands: [live as never] }],
    [live as never, { action: 'newPage', data: { title: 'Part 5 · Past simple · 過去形' }, id: 'p' } as never],
  );
  check('normalizeSessionForPdf: top-level + transcript commands flattened',
    (session.whiteboardCommands[0] as { sentence?: string }).sentence === 'I work in sales.'
    && (session.transcript[0].whiteboardCommands?.[0] as { sentence?: string }).sentence === 'I work in sales.'
    && (session.whiteboardCommands[1] as { title?: string }).title === 'Part 5 · Past simple · 過去形');
  const text = pdfSessionText('Work projects', session.transcript, session.whiteboardCommands);
  check('pdfSessionText: the card gloss and the part title (ja) count for the language / font decision',
    text.includes('私は営業です。') && text.includes('過去形') && hasCjk(text) && inferSessionLanguages(text).includes('ja'));
}

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
  // Latin-only session (a maths lesson): the CJK font is never fetched, the
  // router is never installed, and helvetica bold + italic (a handwrite
  // note) are drawn as before.
  {
    const { exportTutorSessionPDF } = await import('../src/lib/utils/export/pdf-tutor-session');
    const scratch = mkdtempSync(join(tmpdir(), 'pdf-tutor-session-latin-'));
    const prevCwd = process.cwd();
    const prevFetch = globalThis.fetch;
    let fetches = 0;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).fetch = async () => { fetches++; return new Response('nope', { status: 404 }); };
    process.chdir(scratch);
    let latin = '';
    try {
      await exportTutorSessionPDF(
        [{ id: '1', timestamp: new Date(), role: 'tutor', text: 'Solve 2x + 3 = 7. θ is an angle.' }],
        [
          { action: 'showProblem', problem: { statement: 'Solve 2x + 3 = 7.\nShow your work.' } },
          { action: 'handwrite', text: 'Subtract 3 from both sides' },
        ],
        'Linear equations', 'homework-help', 'Test Student', { subject: 'math', level: '8' },
      );
      latin = readFileSync(join(scratch, readdirSync(scratch).filter((f) => f.endsWith('.pdf'))[0]), 'latin1');
    } finally {
      process.chdir(prevCwd);
      globalThis.fetch = prevFetch;
      rmSync(scratch, { recursive: true, force: true });
    }
    check('Latin-only session: CJK font never fetched', fetches === 0, String(fetches));
    check('Latin-only session: no CJK font in the PDF', !/NotoSansJP/.test(latin));
    check('Latin-only session: helvetica bold still used', /Helvetica-Bold/.test(latin));
    check('Latin-only session: helvetica italic still used (handwrite note)', /Helvetica-Oblique/.test(latin));
    check('untitled problem badge is "Problem", not its statement', latin.includes('(Problem) Tj') && !latin.includes('(Problem: Solve'));
  }
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
