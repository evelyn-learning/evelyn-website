/* Session PDF: which CJK font a document is printed in (Japanese, Traditional Chinese, Simplified Chinese),
 * the two Chinese font files, and one export end to end per script. Set PDF_CJK_OUT=<dir> to keep the PDFs. */
import assert from 'node:assert/strict';
import { copyFileSync, existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { CJK_FONTS, CJK_FONT_FAMILY, CJK_FONT_URL, pickCjkFont, pickPdfFont } from '../src/lib/utils/export/pdf-cjk-font';

let n = 0;
const t = async (name: string, f: () => void | Promise<void>) => { await f(); n++; console.log('PASS', name); };
const FONT_DIR = join(__dirname, '..', 'public', 'fonts');

/** Run one export in a scratch directory with `fetch` serving public/fonts; returns the PDF and the URLs fetched. */
async function exportSession(name: string, tutorLines: string[], board: string[], languages?: string[]): Promise<{ pdf: string; fetched: string[] }> {
  const { exportTutorSessionPDF } = await import('../src/lib/utils/export/pdf-tutor-session');
  const scratch = mkdtempSync(join(tmpdir(), 'pdf-cjk-font-test-'));
  const prevCwd = process.cwd();
  const prevFetch = globalThis.fetch;
  const fetched: string[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).fetch = async (url: string) => {
    fetched.push(String(url));
    const file = join(FONT_DIR, String(url).replace(/^\/fonts\//, ''));
    return String(url).startsWith('/fonts/') && existsSync(file) ? new Response(readFileSync(file)) : new Response('nope', { status: 404 });
  };
  process.chdir(scratch);
  try {
    await exportTutorSessionPDF(
      tutorLines.map((text, i) => ({ id: String(i), timestamp: new Date('2026-11-24T18:00:00Z'), role: i % 2 ? 'student' as const : 'tutor' as const, text })),
      [{ action: 'newPage', data: { title: board[0] } }, ...board.slice(1).map((text) => ({ action: 'handwrite', text }))],
      board[0]!, 'concept-review', 'Test Student',
      { subject: 'math', level: '8', ...(languages ? { languages } : {}) },
    );
    const file = join(scratch, readdirSync(scratch).filter((f) => f.endsWith('.pdf'))[0]!);
    if (process.env.PDF_CJK_OUT) copyFileSync(file, join(process.env.PDF_CJK_OUT, `${name}.pdf`));
    return { pdf: readFileSync(file, 'latin1'), fetched };
  } finally {
    process.chdir(prevCwd);
    globalThis.fetch = prevFetch;
    rmSync(scratch, { recursive: true, force: true });
  }
}

async function main() {
  await t('no CJK text: no font', () => {
    assert.equal(pickCjkFont('Solve 2x + 3 = 7. θ is an angle.'), null);
    assert.equal(pickCjkFont(''), null);
    assert.equal(pickCjkFont('Solve 2x + 3 = 7.', 'zh-TW'), null);
    assert.equal(pickCjkFont('Solve 2x + 3 = 7.', ['ja']), null);
  });
  await t('kana is Japanese', () => {
    assert.equal(pickCjkFont('ここまでのポイント: you worked on your job.'), 'jp');
    assert.equal(pickCjkFont('連立方程式を解きましょう。'), 'jp');
  });
  await t('the lesson language decides when it is known', () => {
    assert.equal(pickCjkFont('方程式', 'zh-TW'), 'tc'); assert.equal(pickCjkFont('方程式', 'zh-Hant'), 'tc');
    assert.equal(pickCjkFont('方程式', 'zh-CN'), 'sc'); assert.equal(pickCjkFont('方程式', 'zh'), 'sc');
    assert.equal(pickCjkFont('方程式', 'ja'), 'jp'); assert.equal(pickCjkFont('方程式', 'ja-JP'), 'jp');
    assert.equal(pickCjkFont('方程式', ['zh-TW']), 'tc'); assert.equal(pickCjkFont('方程式', ['zh-CN']), 'sc');
    // An English lesson with help in a second language prints in that language's font.
    assert.equal(pickCjkFont('概要', ['en', 'ja']), 'jp'); assert.equal(pickCjkFont('這是概要', ['en', 'ja']), 'jp');
    assert.equal(pickCjkFont('方程式', ['en', 'zh-TW']), 'tc');
    // A language with no CJK font of its own leaves the text to decide.
    assert.equal(pickCjkFont('這是方程式', ['en']), 'tc'); assert.equal(pickCjkFont('这是方程式', 'ko'), 'sc');
    assert.equal(pickCjkFont('方程式', null), 'jp'); assert.equal(pickCjkFont('方程式', []), 'jp');
  });
  await t('Traditional-only characters with no language: TC', () => {
    assert.equal(pickCjkFont('聯立方程式：加減消去法'), 'jp', 'no marker here: 聯 is also a Japanese kanji');
    assert.equal(pickCjkFont('所以 x 等於 4。為什麼兩式可以相加？'), 'tc');
    assert.equal(pickCjkFont('我們來驗算。'), 'tc');
  });
  await t('Simplified-only characters with no language: SC', () => {
    assert.equal(pickCjkFont('联立方程组：加减消元法'), 'sc');
    assert.equal(pickCjkFont('所以 x 等于 4。为什么两式可以相加？'), 'sc');
    assert.equal(pickCjkFont('這個说法对吗？这样对吗？'), 'sc', 'the larger count wins');
  });
  await t('Chinese written the same in both scripts: TC', () => {
    assert.equal(pickCjkFont('你好，答案是 4 吧？'), 'tc');
  });
  await t('kanji-only Japanese with no language keeps the JP font', () => {
    for (const s of ['数学', '練習問題', '時間', '連立方程式', '学習', '会社', '来週', '経験', '渡邊', '問題 3：答案', '「」', '概要']) {
      assert.equal(pickCjkFont(s), 'jp', s);
    }
  });
  await t('pickPdfFont draws CJK in the document font, JP unless told', () => {
    assert.equal(CJK_FONT_FAMILY, 'NotoSansJP'); assert.equal(CJK_FONT_URL, '/fonts/NotoSansJP-Regular-subset.ttf');
    assert.equal(pickPdfFont('概要', 'helvetica', 'bold', true).family, 'NotoSansJP');
    assert.deepEqual(pickPdfFont('說', 'helvetica', 'bold', true, CJK_FONTS.tc.family), { family: 'NotoSansTC', style: 'normal' });
    assert.deepEqual(pickPdfFont('Solve', 'helvetica', 'bold', true, CJK_FONTS.tc.family), { family: 'helvetica', style: 'bold' });
    assert.deepEqual(pickPdfFont('說', 'helvetica', 'bold', false, CJK_FONTS.tc.family), { family: 'helvetica', style: 'bold' });
  });
  await t('the font files are shipped (TrueType outlines, 0.5–4 MB)', () => {
    // No font parser is a dependency of this repo, so the character coverage is checked at build time with
    // fontTools (public/fonts/FONTS.md); here: the files exist, are TrueType (jsPDF reads glyf, not CFF) and sane in size.
    for (const key of ['jp', 'tc', 'sc'] as const) {
      const file = join(FONT_DIR, CJK_FONTS[key].file);
      assert.ok(existsSync(file), file);
      const size = statSync(file).size;
      assert.ok(size > 500_000 && size < 4_000_000, `${file}: ${size} bytes`);
      const head = readFileSync(file).subarray(0, 4096);
      assert.equal(head.readUInt32BE(0), 0x00010000, `${file}: not a TrueType font`);
      assert.ok(head.includes('glyf') && !head.includes('CFF '), `${file}: needs a glyf table`);
      assert.ok(existsSync(join(FONT_DIR, `OFL-${CJK_FONTS[key].family}.txt`)), `licence text for ${CJK_FONTS[key].family}`);
    }
  });

  const TC = { lines: ['所以 x 等於 4。為什麼兩式可以相加？', '因為等號兩邊加上相同的數，等式還是成立。'], board: ['聯立方程式：加減消去法', '2x + y = 11', '把兩式相加，消去 y。'] };
  const SC = { lines: ['所以 x 等于 4。为什么两式可以相加？', '因为等号两边加上相同的数，等式还是成立。'], board: ['联立方程组：加减消元法', '2x + y = 11', '把两式相加，消去 y。'] };
  await t('export, zh-TW lesson: one fetch, the TC file, embedded', async () => {
    const r = await exportSession('zh-TW', TC.lines, TC.board, ['zh-TW']);
    assert.deepEqual(r.fetched, ['/fonts/NotoSansTC-Regular-subset.ttf']);
    assert.ok(/NotoSansTC/.test(r.pdf) && !/NotoSansJP|NotoSansSC/.test(r.pdf));
    assert.ok(!r.pdf.includes('[Chinese text]'));
  });
  await t('export, Traditional text and no language: the TC file', async () => {
    const r = await exportSession('zh-TW-by-text', TC.lines, TC.board);
    assert.deepEqual(r.fetched, []); // cached from the export above: one fetch per file per page load
    assert.ok(/NotoSansTC/.test(r.pdf) && !/NotoSansJP|NotoSansSC/.test(r.pdf));
  });
  await t('export, zh-CN lesson: one fetch, the SC file, embedded', async () => {
    const r = await exportSession('zh-CN', SC.lines, SC.board, ['zh-CN']);
    assert.deepEqual(r.fetched, ['/fonts/NotoSansSC-Regular-subset.ttf']);
    assert.ok(/NotoSansSC/.test(r.pdf) && !/NotoSansJP|NotoSansTC/.test(r.pdf));
  });
  await t('export, Japanese text: the JP file, as before', async () => {
    const r = await exportSession('ja', ['ここまでのポイント: you worked on your job.', 'I worked with a customer.'], ['Part 2 · レベルチェック', '概要']);
    assert.deepEqual(r.fetched, ['/fonts/NotoSansJP-Regular-subset.ttf']);
    assert.ok(/NotoSansJP/.test(r.pdf) && !/NotoSansTC|NotoSansSC/.test(r.pdf));
  });
  await t('export, English lesson: no font fetched', async () => {
    const r = await exportSession('en', ['Solve 2x + 3 = 7.', 'x is 2.'], ['Linear equations', 'Subtract 3 from both sides']);
    assert.deepEqual(r.fetched, []);
    assert.ok(!/NotoSans/.test(r.pdf) && /Helvetica-Bold/.test(r.pdf));
  });

  console.log(`\n${n} passed`);
}
main().catch((err) => { console.error(err); process.exit(1); });
