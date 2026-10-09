/**
 * Re-render the figures of already-reviewed ProblemBank rows with the current
 * practice-figure renderer — `figure.svg` is redrawn from `figure.spec`, and
 * NOTHING else in a row changes (ids, text, key, alt and spec stay byte for
 * byte: the new SVG is spliced into the file's own text, in the file's own
 * string escaping, and the result is then checked field by field).
 *
 * Reads   <in>/problem-bank-rows.json
 * Writes  <out>/problem-bank-rows.json      the rows, new `figure.svg` only
 *         <out>/png/<id>.png                each new figure, 340 px wide at 2×
 *         <out>/before-after.html           old | new per item, with question and key
 *         <out>/legibility-warnings.json    `checkFigureLegibility` per item
 * and prints the element / attribute names the new SVGs use, against the
 * client's pinned fixture of engine output when `--client-fixture` is given.
 *
 * Every new figure must pass `validateFigureSvg` and the contract's
 * `PracticeFigureSchema` (size bound included) or nothing is written.
 *
 * Local JSON in, local files out. No database (the no-db import comes
 * first), no network, no model.
 *
 * Run from apps/tutor:
 *   npx tsx scripts/practice-extend/rerender-figure-rows.ts --in <dir> --out <dir> [--client-fixture <file>] [--no-png]
 */
import '../lib/no-db-env';
import fs from 'node:fs';
import path from 'node:path';
import { PracticeFigureSchema } from '@evelyn/portal-contract/v1';
import { checkFigureLegibility, type LegibilityWarning } from '../../src/lib/tutor/practice-figure/legibility';
import { renderPracticeFigure, type PracticeFigureSpec } from '../../src/lib/tutor/practice-figure/render';
import { MAX_FIGURE_SVG_CHARS, validateFigureSvg } from '../../src/lib/tutor/practice-figure/svg-safety';

/** PNG width in device pixels: the 340 px phone column at 2×. */
const PNG_WIDTH = 680;

interface FigureRow {
  id: string;
  problemText: string;
  answer: unknown;
  choices?: unknown;
  solutionText?: string;
  figure: { svg: string; alt: string; spec: PracticeFigureSpec };
  [key: string]: unknown;
}

/** A string as this file's writer serialised it: JSON with every non-ASCII
 *  character as a \uXXXX escape. Falls back to plain JSON when the file was
 *  not written that way (`style` is detected per file). */
function jsonString(s: string, asciiOnly: boolean): string {
  const j = JSON.stringify(s);
  return asciiOnly ? j.replace(/[\u0080-￿]/g, (ch) => `\\u${ch.charCodeAt(0).toString(16).padStart(4, '0')}`) : j;
}

/** Element and attribute names used across a set of SVG strings. */
export function svgVocabulary(svgs: string[]): { elements: string[]; attributes: string[] } {
  const elements = new Set<string>();
  const attributes = new Set<string>();
  for (const svg of svgs) {
    for (const m of svg.matchAll(/<([A-Za-z][\w:.-]*)((?:\s+[\w:.-]+="[^"]*")*)\s*\/?>/g)) {
      elements.add(m[1]);
      for (const a of m[2].matchAll(/\s([\w:.-]+)=/g)) attributes.add(a[1]);
    }
  }
  return { elements: [...elements].sort(), attributes: [...attributes].sort() };
}

/** Every string in a JSON value that is an SVG document. */
function svgStringsIn(value: unknown, out: string[] = []): string[] {
  if (typeof value === 'string') {
    if (value.startsWith('<svg')) out.push(value);
  } else if (value && typeof value === 'object') {
    for (const v of Object.values(value as Record<string, unknown>)) svgStringsIn(v, out);
  }
  return out;
}

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function arg(argv: string[], name: string): string | undefined {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : undefined;
}

async function main(): Promise<void> {
  const argv = process.argv.slice(2);
  const inDir = arg(argv, '--in');
  const outDir = arg(argv, '--out');
  if (!inDir || !outDir) throw new Error('usage: rerender-figure-rows.ts --in <dir> --out <dir> [--client-fixture <file>] [--no-png]');
  if (path.resolve(inDir) === path.resolve(outDir)) throw new Error('--out must not be --in: the reviewed rows are never overwritten');
  const text = fs.readFileSync(path.join(inDir, 'problem-bank-rows.json'), 'utf8');
  const rows = JSON.parse(text) as FigureRow[];
  if (!Array.isArray(rows)) throw new Error('problem-bank-rows.json is not an array');
  // eslint-disable-next-line no-control-regex
  const asciiOnly = !/[^\x00-\x7f]/.test(text);

  // 1. Redraw and validate everything before writing anything.
  let out = text;
  const failures: string[] = [];
  const done: Array<{ row: FigureRow; svg: string; changed: boolean; warnings: LegibilityWarning[] }> = [];
  for (const row of rows) {
    try {
      if (!row.figure || typeof row.figure.svg !== 'string' || !row.figure.spec) throw new Error('row has no figure {svg, spec}');
      const { svg } = renderPracticeFigure(row.figure.spec);
      const safety = validateFigureSvg(svg);
      if (!safety.ok) throw new Error(`svg-safety: ${safety.issues.join(', ')}`);
      if (svg.length > MAX_FIGURE_SVG_CHARS) throw new Error(`svg is ${svg.length} characters (limit ${MAX_FIGURE_SVG_CHARS})`);
      PracticeFigureSchema.parse({ svg, alt: row.figure.alt, spec: row.figure.spec });
      const before = jsonString(row.figure.svg, asciiOnly);
      const at = out.indexOf(before);
      if (at < 0 || out.indexOf(before, at + 1) >= 0) throw new Error('the stored svg string is not found exactly once in the file text');
      out = out.slice(0, at) + jsonString(svg, asciiOnly) + out.slice(at + before.length);
      done.push({ row, svg, changed: svg !== row.figure.svg, warnings: checkFigureLegibility(row.figure.spec) });
    } catch (err) {
      failures.push(`${row?.id ?? '?'}: ${(err as Error).message}`);
    }
  }
  if (failures.length > 0) throw new Error(`${failures.length} of ${rows.length} rows failed — nothing written\n  ${failures.join('\n  ')}`);

  // 2. Prove that only figure.svg changed.
  const after = JSON.parse(out) as FigureRow[];
  if (after.length !== rows.length) throw new Error('row count changed');
  after.forEach((row, i) => {
    const want = JSON.stringify({ ...rows[i], figure: { ...rows[i].figure, svg: done[i].svg } });
    if (JSON.stringify(row) !== want) throw new Error(`${rows[i].id}: something other than figure.svg changed`);
    if (JSON.stringify(Object.keys(row)) !== JSON.stringify(Object.keys(rows[i]))) throw new Error(`${rows[i].id}: key order changed`);
  });

  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'problem-bank-rows.json'), out);
  const warned = done.filter((d) => d.warnings.length > 0);
  fs.writeFileSync(
    path.join(outDir, 'legibility-warnings.json'),
    JSON.stringify({
      items: done.length,
      itemsWithWarnings: warned.length,
      warnings: warned.reduce((n, d) => n + d.warnings.length, 0),
      byCode: warned.flatMap((d) => d.warnings).reduce<Record<string, number>>((acc, w) => ({ ...acc, [w.code]: (acc[w.code] ?? 0) + 1 }), {}),
      rows: done.map((d) => ({ id: d.row.id, kind: d.row.figure.spec.type, warnings: d.warnings })),
    }, null, 2),
  );

  // 3. Side by side. The old copy's ids are renamed for THIS page only — both
  // pictures come from one spec, so they would otherwise share an id prefix.
  const cards = done.map((d, i) => {
    const old = d.row.figure.svg.replace(/(\sid="|url\(#)(pf[0-9a-z]+-)/g, '$1old-$2');
    const choices = Array.isArray(d.row.choices) && d.row.choices.length > 0
      ? `<ol type="A">${(d.row.choices as unknown[]).map((c) => `<li>${esc(typeof c === 'string' ? c : JSON.stringify(c))}</li>`).join('')}</ol>`
      : '';
    return `<section class="card" id="${esc(d.row.id)}">`
      + `<h2>${i + 1}. ${esc(d.row.id)} <span class="kind">${esc(d.row.figure.spec.type)}</span>${d.changed ? '' : ' <span class="same">picture unchanged</span>'}</h2>`
      + `<p class="q"><b>Question:</b> ${esc(d.row.problemText)}</p>${choices}`
      + `<p class="q"><b>Key:</b> ${esc(typeof d.row.answer === 'string' ? d.row.answer : JSON.stringify(d.row.answer))}${d.row.solutionText ? ` — ${esc(d.row.solutionText)}` : ''}</p>`
      + `<p class="alt"><b>Alt:</b> ${esc(d.row.figure.alt)}</p>`
      + (d.warnings.length > 0 ? `<ul class="warn">${d.warnings.map((w) => `<li>${esc(w.code)}: ${esc(w.message)}</li>`).join('')}</ul>` : '')
      + `<div class="row"><figure><figcaption>before (as reviewed)</figcaption><div class="w340">${old}</div></figure>`
      + `<figure><figcaption>after (re-rendered)</figcaption><div class="w340">${d.svg}</div></figure></div>`
      + `</section>`;
  });
  fs.writeFileSync(path.join(outDir, 'before-after.html'), `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Practice figures — before and after the re-render</title>
<style>
  body { margin: 0; padding: 24px 16px 64px; background: #f1f5f9; color: #0f172a; font: 15px/1.5 system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
  h1 { font-size: 22px; margin: 0 0 4px; }
  .lead { color: #475569; max-width: 860px; margin: 0 0 20px; }
  .card { background: #fff; border: 1px solid #cbd5e1; border-radius: 8px; padding: 16px; margin: 0 0 20px; max-width: 780px; }
  .card h2 { font-size: 15px; margin: 0 0 6px; overflow-wrap: anywhere; }
  .kind { font-weight: 500; color: #1d4ed8; font-size: 13px; margin-left: 6px; }
  .same { font-weight: 500; color: #475569; font-size: 13px; margin-left: 6px; }
  .q, .alt { margin: 0 0 4px; }
  .alt { color: #475569; font-size: 13px; }
  ol { margin: 0 0 4px; }
  .warn { color: #92400e; font-size: 13px; margin: 4px 0; }
  .row { display: flex; flex-wrap: wrap; gap: 20px; align-items: flex-start; margin-top: 10px; }
  figure { margin: 0; }
  figcaption { font-size: 12px; color: #64748b; margin-bottom: 4px; }
  .w340 { width: 340px; max-width: 100%; border: 1px dashed #94a3b8; }
  .w340 svg { display: block; width: 100%; height: auto; }
</style></head><body>
<h1>Practice figures — before and after the re-render</h1>
<p class="lead">${done.length} reviewed items, each figure redrawn from its stored spec by the current renderer and shown at 340 px beside the picture that was reviewed. ${done.filter((d) => d.changed).length} pictures changed; ${warned.length} items carry legibility warnings. Only <code>figure.svg</code> differs from the reviewed rows. Generated ${new Date().toISOString().slice(0, 10)} by apps/tutor/scripts/practice-extend/rerender-figure-rows.ts.</p>
${cards.join('\n')}
</body></html>
`);

  // 4. PNGs.
  let pngs = 0;
  if (!argv.includes('--no-png')) {
    const mod = (await import('sharp')) as unknown as { default?: unknown };
    const sharp = (mod.default ?? mod) as (input: Buffer, opts?: { density?: number }) => { resize(o: { width: number }): { png(): { toFile(p: string): Promise<unknown> } } };
    const pngDir = path.join(outDir, 'png');
    fs.mkdirSync(pngDir, { recursive: true });
    for (const d of done) {
      await sharp(Buffer.from(d.svg), { density: 192 }).resize({ width: PNG_WIDTH }).png().toFile(path.join(pngDir, `${d.row.id}.png`));
      pngs++;
    }
  }

  // 5. Vocabulary, against the client's pinned fixture when given.
  const vocab = svgVocabulary(done.map((d) => d.svg));
  console.log(`re-rendered ${done.length}/${rows.length} rows — all pass svg-safety and the contract (largest ${Math.max(...done.map((d) => d.svg.length))} of ${MAX_FIGURE_SVG_CHARS} characters); ${done.filter((d) => d.changed).length} pictures changed`);
  console.log(`legibility: ${warned.reduce((n, d) => n + d.warnings.length, 0)} warnings on ${warned.length} items`);
  console.log(`wrote ${outDir}/{problem-bank-rows.json, before-after.html, legibility-warnings.json}${pngs ? ` and ${pngs} PNGs (${PNG_WIDTH} px wide)` : ''}`);
  console.log(`elements:   ${vocab.elements.join(' ')}`);
  console.log(`attributes: ${vocab.attributes.join(' ')}`);
  const fixturePath = arg(argv, '--client-fixture');
  if (fixturePath) {
    const pinned = svgVocabulary(svgStringsIn(JSON.parse(fs.readFileSync(fixturePath, 'utf8'))));
    const newEl = vocab.elements.filter((e) => !pinned.elements.includes(e));
    const newAt = vocab.attributes.filter((a) => !pinned.attributes.includes(a));
    console.log(`not in the client fixture — elements: ${newEl.join(' ') || '(none)'}; attributes: ${newAt.join(' ') || '(none)'}`);
  }
}

main().catch((err) => {
  console.error((err as Error).message ?? err);
  process.exit(1);
});
