/**
 * GAC acceptance 2026-10-22 (hw-14 p1, F1): "the image showed up and then it
 * vanished when the Q-pin showed up" — a one-problem TEXT session whose
 * figure the tutor drew live in the opener.
 *
 * Root cause (measured, not guessed): in a one-problem session the static
 * Q-pin row (`data-testid="question-pin-static"`, `w-full shrink-0`) and the
 * board card are SIBLINGS in the board column, and that column was a flex
 * ROW (`flex justify-center`, no `flex-col`). The pin could not shrink, so
 * it took the whole width and the card (shrink 1, `overflow-hidden` ⇒
 * min-width 0) collapsed to its two 1px borders — the drawing inside went
 * to 0px wide. Headless chromium against the compiled Tailwind, 1280×800:
 * text — pin 436×658, card 2px wide, board 0px; voice — card 72px. Without
 * the pin, or in any session without `problemPanel` (floating pin), the
 * card kept its width. The `mb-2` on the pin row shows a column was meant.
 *
 * Part 1 (always): SessionStage rendered to static markup — the one-problem
 * column is a column (`flex-col items-center`) with the pin row before the
 * card and the card `flex-1 min-h-0`; every other session keeps its exact
 * pre-fix class strings (pinned here byte for byte: GAC engine freeze).
 * Part 2 (only when the dev/prod compiled CSS chunk and playwright's
 * chromium are on this machine — otherwise reported as skipped, never
 * faked): the same markup laid out for real — the card keeps its width and
 * sits below the pin.
 *
 * Pure: no database, no network, no model call, no live session.
 * Run: npx tsx scripts/test-stage-qpin-static.tsx  (npm run test:stage-qpin-static)
 */
import { strict as assert } from 'node:assert';
import * as fs from 'node:fs';
import * as path from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Window } from 'happy-dom';
import SessionStage from '@/app/tutor/components/session/SessionStage';

let passed = 0;
let failed = 0;
let skipped = 0;
async function section(name: string, fn: () => Promise<void> | void): Promise<void> {
  try { await fn(); console.log(`  ✓ ${name}`); passed++; }
  catch (err) { console.log(`  ✗ ${name}\n      ${(err as Error).message}`); failed++; }
}

type Mode = 'text' | 'voice';
const BOARD_H = 300;

/** The stage as TutorSession mounts it: a dummy board item stands in for the
 *  WhiteboardCanvas (its own root is `h-full`). */
function render(mode: Mode, opts: { pin: boolean; panel: boolean }): string {
  return renderToStaticMarkup(
    <SessionStage
      lessonTitle="hw-14 p1"
      hasPlan
      isFreePractice={false}
      sessionMode={mode}
      voiceState="idle"
      started
      boardEmpty={false}
      board={<div data-probe-board="1" style={{ width: '100%', height: BOARD_H }}>FIGURE</div>}
      voiceInput={null}
      transcript={null}
      onStudentInput={() => {}}
      problemPanel={opts.panel ? { n: 1, text: 'Find x.', figure: null, verified: false } : null}
      questionPin={opts.pin
        ? <div data-probe-pin="1" className="ss-cap w-full flex items-center gap-2 rounded-xl bg-amber-50/95 border border-amber-200 shadow-md px-3 py-1.5 text-left">Q: what is x?</div>
        : undefined}
      questionPinKey={opts.pin ? 'turn-1' : undefined}
    />,
  );
}

/** Structure only (happy-dom has no layout engine): the board item, its
 *  card (the element `boardCardRef` is attached to — the item's parent when
 *  the pager is not in the card), the column, and the static pin row. */
function structure(html: string) {
  const win = new Window();
  win.document.body.innerHTML = html;
  const board = win.document.querySelector('[data-probe-board]');
  assert.ok(board, 'the board item is in the stage');
  const card = board.parentElement!;
  const column = card.parentElement!;
  const pin = win.document.querySelector('[data-testid="question-pin-static"]');
  const classes = (el: { className: string }) => el.className.split(/\s+/).filter(Boolean);
  return {
    column: column.className,
    columnClasses: classes(column),
    card: card.className,
    cardClasses: classes(card),
    pinPresent: pin != null,
    pinThenCard: pin != null && pin.parentElement === column && pin.nextElementSibling === card,
  };
}

// The pre-fix class strings of every session WITHOUT a problem panel —
// those sessions are under the GAC engine freeze and must not change by a
// byte. (`pt-2` is `boardColumnTopPadClass` with no page switcher; the two
// spaces in the card string are the empty `pagerInCard` slot.)
const NON_STATIC_COLUMN: Record<Mode, string> = {
  text: 'absolute inset-0 pt-2 pb-2 px-2 sm:px-0 flex justify-center md:pl-4 md:pr-[388px]',
  voice: 'absolute inset-0 pt-2 pb-2 px-2 sm:px-0 flex justify-center ',
};
const NON_STATIC_CARD: Record<Mode, string> = {
  text: 'w-full max-w-4xl h-full  rounded-2xl bg-white/85 border border-slate-200 shadow-sm overflow-hidden',
  voice: 'w-full max-w-3xl h-full  rounded-2xl bg-white/85 border border-slate-200 shadow-sm overflow-hidden',
};

async function part1() {
  console.log('1 structure (static markup)');
  for (const mode of ['text', 'voice'] as const) {
    const maxW = mode === 'text' ? 'max-w-4xl' : 'max-w-3xl';
    await section(`${mode}, one-problem, pin shown: the column is a column, the pin row sits before the card, the card fills the rest`, () => {
      const s = structure(render(mode, { pin: true, panel: true }));
      assert.ok(s.pinPresent, 'static pin row rendered');
      assert.ok(s.pinThenCard, `pin row and card are column siblings, pin first (column: ${s.column})`);
      for (const c of ['flex', 'flex-col', 'items-center']) assert.ok(s.columnClasses.includes(c), `column has ${c} (was: ${s.column})`);
      for (const c of ['w-full', maxW, 'flex-1', 'min-h-0', 'overflow-hidden']) assert.ok(s.cardClasses.includes(c), `card has ${c} (was: ${s.card})`);
      assert.ok(!s.cardClasses.includes('h-full'), `card is flex-1, not h-full, under the pin row (was: ${s.card})`);
    });
    await section(`${mode}, one-problem, no pin yet: the same column layout (nothing flips when the pin arrives)`, () => {
      const s = structure(render(mode, { pin: false, panel: true }));
      assert.equal(s.pinPresent, false);
      for (const c of ['flex', 'flex-col', 'items-center']) assert.ok(s.columnClasses.includes(c), `column has ${c} (was: ${s.column})`);
      for (const c of ['flex-1', 'min-h-0']) assert.ok(s.cardClasses.includes(c), `card has ${c} (was: ${s.card})`);
    });
    for (const pin of [false, true]) {
      await section(`${mode}, no problem panel, pin ${pin ? 'shown' : 'absent'}: column and card keep the exact pre-fix classes (engine freeze)`, () => {
        const s = structure(render(mode, { pin, panel: false }));
        assert.equal(s.pinPresent, false, 'no static pin row outside a one-problem session');
        assert.equal(s.column, NON_STATIC_COLUMN[mode]);
        assert.equal(s.card, NON_STATIC_CARD[mode]);
      });
    }
  }
}

/** The compiled Tailwind for the tutor app: the Turbopack dev chunk for
 *  globals.css, else a production `.next/static/css` chunk. Null when no
 *  build has run on this machine. */
function findCompiledCss(): string | null {
  const next = path.join(__dirname, '..', '.next');
  const candidates: string[] = [];
  for (const dir of [path.join(next, 'dev', 'static', 'chunks'), path.join(next, 'static', 'css')]) {
    if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir)) if (f.endsWith('.css')) candidates.push(path.join(dir, f));
  }
  for (const f of candidates) {
    const css = fs.readFileSync(f, 'utf8');
    if (css.includes('.max-w-4xl') && css.includes('.flex-col') && css.includes('.min-h-0')) return f;
  }
  return null;
}

type Box = { x: number; y: number; w: number; h: number };
type Layout = { pin: Box | null; card: Box; board: Box; pinNextIsCard: boolean | null };

async function part2() {
  console.log('2 layout (headless chromium + compiled Tailwind)');
  const cssPath = findCompiledCss();
  if (!cssPath) { console.log('  - skipped: no compiled CSS chunk under .next (run the dev server or a build once)'); skipped++; return; }
  let chromium: typeof import('playwright').chromium;
  try { ({ chromium } = await import('playwright')); }
  catch { console.log('  - skipped: playwright is not installed'); skipped++; return; }
  let browser: Awaited<ReturnType<typeof chromium.launch>>;
  try { browser = await chromium.launch(); }
  catch (e) { console.log(`  - skipped: chromium did not launch (${(e as Error).message.split('\n')[0]})`); skipped++; return; }
  const css = fs.readFileSync(cssPath, 'utf8');
  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    const measure = async (html: string): Promise<Layout> => {
      await page.setContent(`<!doctype html><html><head><style>${css}</style></head><body style="margin:0"><div style="position:relative;width:1280px;height:800px">${html}</div></body></html>`);
      // A string, not a function: tsx's esbuild `__name` helper does not exist in the page.
      return page.evaluate(`(() => {
        const box = (e) => { if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; };
        const board = document.querySelector('[data-probe-board]');
        const card = board.parentElement;
        const pin = document.querySelector('[data-testid="question-pin-static"]');
        return { pin: box(pin), card: box(card), board: box(board), pinNextIsCard: pin ? pin.nextElementSibling === card : null };
      })()`) as Promise<Layout>;
    };
    for (const mode of ['text', 'voice'] as const) {
      const bare = await measure(render(mode, { pin: false, panel: true }));
      await section(`${mode}, one-problem: the card keeps its width when the pin row appears, and sits below it`, async () => {
        const l = await measure(render(mode, { pin: true, panel: true }));
        assert.ok(l.pin && l.pinNextIsCard, 'pin row rendered before the card');
        assert.ok(l.card.w >= bare.card.w - 1, `card width with the pin ${l.card.w}px ≈ without ${bare.card.w}px (F1: the row squeezed it)`);
        assert.ok(l.board.w >= bare.board.w - 1, `board width with the pin ${l.board.w}px ≈ without ${bare.board.w}px (F1: the row squeezed it)`);
        assert.ok(l.pin!.h < 120, `pin row is one row tall, not stretched (${l.pin!.h}px)`);
        assert.ok(l.card.y >= l.pin!.y + l.pin!.h, `card top ${l.card.y} is below the pin row's bottom ${l.pin!.y + l.pin!.h}`);
        assert.ok(l.card.h >= BOARD_H, `card ${l.card.h}px tall still holds the ${BOARD_H}px board item`);
      });
    }
    await section('text, no problem panel: the card is laid out exactly as before (engine freeze)', async () => {
      const l = await measure(render('text', { pin: true, panel: false }));
      assert.equal(l.pin, null);
      // 1280 − 16 (md:pl-4) − 388 (md:pr-[388px]) = 876 = the column width; max-w-4xl (896) does not bind.
      assert.deepEqual({ x: l.card.x, w: l.card.w }, { x: 16, w: 876 });
    });
  } finally {
    await browser.close();
  }
}

async function main() {
  await part1();
  await part2();
  console.log(`\n${passed} passed, ${failed} failed${skipped ? `, ${skipped} layout check skipped (no chromium/CSS on this machine)` : ''}`);
  if (failed) process.exit(1);
}

main().catch((e) => { console.error(e); process.exit(1); });
