/**
 * Practice-figure review gallery — renders every fixture spec
 * (scripts/lib/practice-figure-fixtures.ts) through the real authoring path
 * (`buildPracticeFigure` → `validateFigureSvg`) into ONE self-contained HTML
 * file, each figure inlined at 340 px and at 720 px wide beside the question
 * it would be shown with, plus one PNG per figure.
 *
 * No database, no network, no model: pure rendering. The PNGs use `sharp`
 * (already a dependency); if it cannot be loaded they are skipped and the
 * script says so.
 *
 * PNGs: `<id>.png` is the 340 px phone column at 2× (680 px wide);
 * `<id>-720.png` is the 720 px copy at 2× (1440 px wide).
 *
 * Run:
 *   npx tsx scripts/practice-figure-gallery.ts [--out <dir>] [--no-png] [--only <id-prefix>[,<id-prefix>…]]
 * `--only` re-renders the PNGs of the matching fixtures only (the HTML always
 * holds every fixture).
 * Default <dir>:
 *   /Users/luke/Dev/evelynlearning/docs/whitelabel/greenapple/integration/practice-figures-2026-10-12-batch3
 */
import fs from 'node:fs';
import path from 'node:path';
import { buildPracticeFigure } from '../src/lib/tutor/practice-figure/render';
import { validateFigureSvg } from '../src/lib/tutor/practice-figure/svg-safety';
import { FIGURE_FIXTURES } from './lib/practice-figure-fixtures';

const DEFAULT_OUT = '/Users/luke/Dev/evelynlearning/docs/whitelabel/greenapple/integration/practice-figures-2026-10-12-batch3';
/** PNG widths in device pixels: the 340 px phone column and the 720 px copy, both at 2×. */
const PNG_WIDTH = 680;
const PNG_WIDTH_WIDE = 1440;

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

async function main(): Promise<void> {
  const argv = process.argv.slice(2);
  const outIdx = argv.indexOf('--out');
  const outDir = outIdx >= 0 && argv[outIdx + 1] ? path.resolve(argv[outIdx + 1]) : DEFAULT_OUT;
  const wantPng = !argv.includes('--no-png');
  const onlyIdx = argv.indexOf('--only');
  const only = onlyIdx >= 0 && argv[onlyIdx + 1] ? argv[onlyIdx + 1].split(',').filter(Boolean) : null;
  fs.mkdirSync(outDir, { recursive: true });

  const cards: string[] = [];
  const rendered: Array<{ id: string; svg: string }> = [];
  let failed = 0;
  for (const fx of FIGURE_FIXTURES) {
    let svg: string;
    try {
      svg = buildPracticeFigure(fx.spec, fx.alt).svg;
    } catch (err) {
      failed++;
      console.error(`  FAIL ${fx.id}: ${(err as Error).message}`);
      cards.push(`<section class="card"><h2>${esc(fx.id)} <span class="kind">${esc(fx.spec.type)}</span></h2><p class="err">did not render: ${esc((err as Error).message)}</p></section>`);
      continue;
    }
    const safety = validateFigureSvg(svg);
    rendered.push({ id: fx.id, svg });
    cards.push(
      `<section class="card" id="${esc(fx.id)}">`
      + `<h2>${esc(fx.id)} <span class="kind">${esc(fx.spec.type)}</span></h2>`
      + `<p class="note">${esc(fx.note)}</p>`
      + `<p class="q"><b>Question:</b> ${esc(fx.question)}</p>`
      + `<p class="alt"><b>Alt:</b> ${esc(fx.alt)}</p>`
      + `<p class="meta">${svg.length.toLocaleString('en-US')} characters · safety check ${safety.ok ? 'passed' : `FAILED (${safety.issues.join(', ')})`}</p>`
      + `<div class="row"><figure><figcaption>340 px</figcaption><div class="w340">${svg}</div></figure>`
      + `<figure><figcaption>720 px</figcaption><div class="w720">${svg}</div></figure></div>`
      + `<details><summary>spec</summary><pre>${esc(JSON.stringify(fx.spec, null, 2))}</pre></details>`
      + `</section>`,
    );
    console.log(`  ok   ${fx.id}  (${svg.length} chars)`);
  }

  const kinds = [...new Set(FIGURE_FIXTURES.map((f) => f.spec.type))];
  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Practice figures — review gallery</title>
<style>
  body { margin: 0; padding: 24px 16px 64px; background: #f1f5f9; color: #0f172a; font: 15px/1.5 system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
  h1 { font-size: 22px; margin: 0 0 4px; }
  .lead { color: #475569; max-width: 860px; margin: 0 0 20px; }
  .card { background: #fff; border: 1px solid #cbd5e1; border-radius: 8px; padding: 16px; margin: 0 0 20px; max-width: 1140px; }
  .card h2 { font-size: 16px; margin: 0 0 4px; }
  .kind { font-weight: 500; color: #1d4ed8; font-size: 13px; margin-left: 6px; }
  .note { color: #92400e; margin: 0 0 6px; }
  .q, .alt, .meta { margin: 0 0 4px; max-width: 860px; }
  .alt, .meta { color: #475569; font-size: 13px; }
  .err { color: #b91c1c; }
  .row { display: flex; flex-wrap: wrap; gap: 20px; align-items: flex-start; margin-top: 10px; }
  figure { margin: 0; }
  figcaption { font-size: 12px; color: #64748b; margin-bottom: 4px; }
  .w340 { width: 340px; max-width: 100%; border: 1px dashed #94a3b8; }
  .w720 { width: 720px; max-width: 100%; border: 1px dashed #94a3b8; }
  .w340 svg, .w720 svg { display: block; width: 100%; height: auto; }
  details { margin-top: 8px; font-size: 13px; }
  pre { background: #f8fafc; padding: 10px; overflow: auto; border-radius: 6px; }
</style></head><body>
<h1>Practice figures — review gallery</h1>
<p class="lead">${FIGURE_FIXTURES.length} fixture figures across ${kinds.length} kinds (${esc(kinds.join(', '))}), each drawn by the engine's authoring renderer and shown inline at 340 px and 720 px. Check three things per figure: the question can be answered from it; nothing on it states the answer unless the note says the spec asked for that; every label is readable in the 340 px copy. Generated ${new Date().toISOString().slice(0, 10)} by apps/tutor/scripts/practice-figure-gallery.ts.</p>
${cards.join('\n')}
</body></html>
`;
  const htmlPath = path.join(outDir, 'gallery.html');
  fs.writeFileSync(htmlPath, html);
  console.log(`\nwrote ${htmlPath}  (${rendered.length} figures, ${failed} failed)`);

  if (wantPng) {
    type Sharp = (input: Buffer, opts?: { density?: number }) => { resize(o: { width: number }): { png(): { toFile(p: string): Promise<unknown> } } };
    const loadSharp = async (): Promise<Sharp | null> => {
      try {
        const mod = (await import('sharp')) as unknown as { default?: Sharp };
        return mod.default ?? (mod as unknown as Sharp);
      } catch (err) {
        console.log(`PNGs skipped — sharp could not be loaded (${(err as Error).message})`);
        return null;
      }
    };
    const sharp = await loadSharp();
    if (sharp) {
      const pngDir = path.join(outDir, 'png');
      fs.mkdirSync(pngDir, { recursive: true });
      let n = 0;
      for (const { id, svg } of rendered) {
        if (only && !only.some((prefix) => id.startsWith(prefix))) continue;
        try {
          await sharp(Buffer.from(svg), { density: 192 }).resize({ width: PNG_WIDTH }).png().toFile(path.join(pngDir, `${id}.png`));
          await sharp(Buffer.from(svg), { density: 384 }).resize({ width: PNG_WIDTH_WIDE }).png().toFile(path.join(pngDir, `${id}-720.png`));
          n += 2;
        } catch (err) {
          console.error(`  png FAIL ${id}: ${(err as Error).message}`);
          failed++;
        }
      }
      console.log(`wrote ${n} PNGs (<id>.png ${PNG_WIDTH} px wide = the 340 px column at 2×; <id>-720.png ${PNG_WIDTH_WIDE} px = the 720 px copy at 2×) to ${pngDir}`);
    }
  }
  if (failed > 0) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
