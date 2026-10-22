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
 * Round 11 (owner ruling 2026-10-22): the static row above the card made
 * the figure jump down when the first question arrived. The one-problem
 * pin now lives IN the board flow, under the pre-built figure: SessionStage
 * provides it through `BoardLeadPinContext` and WhiteboardCanvas renders a
 * sticky `data-wb-lead-pin` slot (page 1: right after the lead item's
 * separator; any other page: the page wrapper's first child). The
 * `question-pin-static` row is gone.
 *
 * Part 1 (always): SessionStage rendered to static markup — the one-problem
 * column is still a column (`flex-col items-center`) with the card
 * `flex-1 min-h-0`, no static pin row, and the pin reaches the board child
 * through the context (only with a problem panel); every other session
 * keeps its exact pre-fix class strings (pinned here byte for byte: GAC
 * engine freeze).
 * Part 2 (only when the dev/prod compiled CSS chunk and playwright's
 * chromium are on this machine — otherwise reported as skipped, never
 * faked): the same markup laid out for real — the card does not move or
 * resize when the pin arrives.
 * Part 3 (always): WhiteboardCanvas markup — where the slot sits, and
 * byte-identical markup when no pin is provided.
 *
 * Pure: no database, no network, no model call, no live session.
 * Run: npx tsx scripts/test-stage-qpin-static.tsx  (npm run test:stage-qpin-static)
 */
import { strict as assert } from 'node:assert';
import * as fs from 'node:fs';
import * as path from 'node:path';
import React, { act, useContext, type Context, type ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Window } from 'happy-dom';
import SessionStage from '@/app/tutor/components/session/SessionStage';

// WhiteboardCanvas imports katex's stylesheet; node cannot load a .css file.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(require as any).extensions['.css'] = () => {};
// renderToStaticMarkup warns once per useLayoutEffect in the canvas tree —
// expected on the server, noise here.
const consoleError = console.error;
console.error = (...args: unknown[]) => {
  if (String(args[0]).includes('useLayoutEffect does nothing on the server')) return;
  consoleError(...args);
};

/** Loaded in main() (dynamic so a missing module fails the sections that
 *  need it, not the whole script). */
let LeadPinCtx: Context<ReactNode | null> | null = null;

/** Stand-in for the WhiteboardCanvas: reads the board lead-pin context the
 *  way the canvas does and renders the pin above its content. */
function BoardStub() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const pin = LeadPinCtx ? useContext(LeadPinCtx) : null;
  return (
    <div data-probe-board="1" style={{ width: '100%', height: BOARD_H }}>
      {pin != null && <div data-probe-board-pin="1">{pin}</div>}
      FIGURE
    </div>
  );
}

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
      board={<BoardStub />}
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
    boardPin: win.document.querySelector('[data-probe-board-pin]')?.textContent ?? null,
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
    await section(`${mode}, one-problem, pin shown: no static pin row; the pin reaches the board child through BoardLeadPinContext; the column layout is unchanged`, () => {
      const s = structure(render(mode, { pin: true, panel: true }));
      assert.equal(s.pinPresent, false, 'no question-pin-static row in a one-problem session (round 11)');
      assert.equal(s.boardPin, 'Q: what is x?', 'the board child reads the pin from the context');
      for (const c of ['flex', 'flex-col', 'items-center']) assert.ok(s.columnClasses.includes(c), `column has ${c} (was: ${s.column})`);
      for (const c of ['w-full', maxW, 'flex-1', 'min-h-0', 'overflow-hidden']) assert.ok(s.cardClasses.includes(c), `card has ${c} (was: ${s.card})`);
      assert.ok(!s.cardClasses.includes('h-full'), `card stays flex-1, not h-full (was: ${s.card})`);
    });
    await section(`${mode}, one-problem, no pin yet: the same column layout, nothing in the context`, () => {
      const s = structure(render(mode, { pin: false, panel: true }));
      assert.equal(s.pinPresent, false);
      assert.equal(s.boardPin, null);
      for (const c of ['flex', 'flex-col', 'items-center']) assert.ok(s.columnClasses.includes(c), `column has ${c} (was: ${s.column})`);
      for (const c of ['flex-1', 'min-h-0']) assert.ok(s.cardClasses.includes(c), `card has ${c} (was: ${s.card})`);
    });
    for (const pin of [false, true]) {
      await section(`${mode}, no problem panel, pin ${pin ? 'shown' : 'absent'}: column and card keep the exact pre-fix classes (engine freeze)`, () => {
        const s = structure(render(mode, { pin, panel: false }));
        assert.equal(s.pinPresent, false, 'no static pin row outside a one-problem session');
        assert.equal(s.boardPin, null, 'no pin in the board context outside a one-problem session (the floating pin owns it)');
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
type Layout = { staticPin: boolean; card: Box; board: Box };

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
        return { staticPin: document.querySelector('[data-testid="question-pin-static"]') != null, card: box(card), board: box(board) };
      })()`) as Promise<Layout>;
    };
    for (const mode of ['text', 'voice'] as const) {
      const bare = await measure(render(mode, { pin: false, panel: true }));
      await section(`${mode}, one-problem: the card does not move or resize when the pin arrives (it is in the board flow)`, async () => {
        const l = await measure(render(mode, { pin: true, panel: true }));
        assert.equal(l.staticPin, false, 'no static pin row');
        assert.deepEqual(l.card, bare.card, 'card box with the pin = without it (round 11: the figure no longer jumps down)');
        assert.ok(l.board.w >= bare.board.w - 1, `board width with the pin ${l.board.w}px ≈ without ${bare.board.w}px`);
      });
    }
    await section('text, no problem panel: the card is laid out exactly as before (engine freeze)', async () => {
      const l = await measure(render('text', { pin: true, panel: false }));
      assert.equal(l.staticPin, false);
      // 1280 − 16 (md:pl-4) − 388 (md:pr-[388px]) = 876 = the column width; max-w-4xl (896) does not bind.
      assert.deepEqual({ x: l.card.x, w: l.card.w }, { x: 16, w: 876 });
    });
  } finally {
    await browser.close();
  }
}

// Today's (pre-round-11) WhiteboardCanvas markup for PAGE_1 with a lead item,
// captured before the slot existed: with no context value the canvas must
// render it byte for byte.
const WB_BASELINE_LEAD = '<div class="whiteboard-canvas flex flex-col h-full "><div class="relative flex-1 overflow-y-auto overflow-x-hidden pb-32" style="-webkit-overflow-scrolling:touch"><div style="position:relative" class="p-4"><div style="position:relative" class="wb-page-enter-forward"><div data-wb-lead-item="1" class="relative scroll-mt-6 select-text"><div data-probe-figure="1">FIG</div><div class="py-1" data-wb-sep="1"><div class="border-t border-gray-100"></div></div></div><div class="space-y-2"><div class="wb-item-enter"><div class="relative scroll-mt-6 select-text" data-wb-item-index="1" data-wb-item-id="a"><div class="p-4 rounded-lg bg-gray-50 border border-gray-200"><p class="text-lg overflow-x-auto"><span class="whitespace-pre-wrap "><span>one</span></span></p></div></div></div><div class="wb-item-enter"><div class="py-1" data-wb-sep="1"><div class="border-t border-gray-100"></div></div><div class="relative scroll-mt-6 select-text" data-wb-item-index="2" data-wb-item-id="b"><div class="p-4 rounded-lg bg-gray-50 border border-gray-200"><p class="text-lg overflow-x-auto"><span class="whitespace-pre-wrap "><span>two</span></span></p></div></div></div></div></div></div></div></div>';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const PAGE_1: any[] = [
  { action: 'annotate', text: 'one', id: 'a' },
  { action: 'annotate', text: 'two', id: 'b' },
];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TWO_PAGES: any[] = [
  ...PAGE_1,
  { action: 'newPage', title: 'P2' },
  { action: 'annotate', text: 'three', id: 'c' },
  { action: 'annotate', text: 'four', id: 'd' },
];
const FIG = <div data-probe-figure="1">FIG</div>;
const PIN = <div data-probe-pin="1">Q: what is x?</div>;

async function part3() {
  console.log('3 board slot (WhiteboardCanvas markup)');
  const { WhiteboardCanvas } = await import('@/app/tutor/components/whiteboard/WhiteboardCanvas');
  const withPin = (pin: ReactNode, el: React.ReactElement) => {
    assert.ok(LeadPinCtx, 'BoardLeadPinContext module loads');
    return <LeadPinCtx.Provider value={pin}>{el}</LeadPinCtx.Provider>;
  };

  await section('no context value: no slot, markup byte-identical to before round 11', () => {
    const html = renderToStaticMarkup(<WhiteboardCanvas commands={PAGE_1} chrome="minimal" leadItem={FIG} />);
    assert.equal(html, WB_BASELINE_LEAD);
    assert.ok(!html.includes('data-wb-lead-pin'));
  });
  await section('null context value: no slot either', () => {
    const html = renderToStaticMarkup(withPin(null, <WhiteboardCanvas commands={PAGE_1} chrome="minimal" leadItem={FIG} />));
    assert.equal(html, WB_BASELINE_LEAD);
  });
  await section('page 1 with a lead item: figure + separator, then the sticky slot, then the first board item', () => {
    const html = renderToStaticMarkup(withPin(PIN, <WhiteboardCanvas commands={PAGE_1} chrome="minimal" leadItem={FIG} />));
    const win = new Window();
    win.document.body.innerHTML = html;
    const lead = win.document.querySelector('[data-wb-lead-item]');
    const slot = win.document.querySelector('[data-wb-lead-pin]');
    assert.ok(lead && slot, 'lead item and slot rendered');
    assert.equal(slot.className, 'sticky top-0 z-20');
    assert.equal(slot.textContent, 'Q: what is x?');
    // A page-wrapper child right after the lead block (whose last child is
    // the separator), not inside it: sticky only sticks within its parent,
    // so inside the lead block it would scroll away with the figure.
    assert.equal(slot.previousElementSibling, lead, 'slot comes right after the lead block');
    assert.equal(lead.lastElementChild?.getAttribute('data-wb-sep'), '1', 'the lead block ends with its separator');
    assert.ok(slot.parentElement?.classList.contains('wb-page-enter-forward'), 'slot is a page wrapper child (sticks across the page)');
    const iLead = html.indexOf('data-wb-lead-item');
    const iPin = html.indexOf('data-wb-lead-pin');
    const iItem = html.indexOf('data-wb-item-index');
    assert.ok(iLead >= 0 && iLead < iPin && iPin < iItem, `order lead ${iLead} < pin ${iPin} < first item ${iItem}`);
    assert.equal(win.document.querySelectorAll('[data-wb-lead-pin]').length, 1, 'exactly one slot');
  });
  await section('page 1 without a lead item: the slot is the page wrapper\'s first child', () => {
    const html = renderToStaticMarkup(withPin(PIN, <WhiteboardCanvas commands={PAGE_1} chrome="minimal" />));
    const win = new Window();
    win.document.body.innerHTML = html;
    const wrapper = win.document.querySelector('.wb-page-enter-forward');
    assert.ok(wrapper, 'page wrapper rendered');
    assert.equal(wrapper.firstElementChild?.getAttribute('data-wb-lead-pin'), '1');
    assert.equal(win.document.querySelectorAll('[data-wb-lead-pin]').length, 1, 'exactly one slot');
  });
  // Last section on purpose: it installs happy-dom globals (react-dom's
  // client renderer reads `window`/`document` at commit time) and leaves
  // them — React's scheduler may still touch them after the last act().
  await section('page 2 (client render in happy-dom, openOnLastPage): the slot is the page wrapper\'s first child, no lead item', async () => {
    const win = new Window({ url: 'http://localhost/' });
    win.document.write('<!doctype html><html><head></head><body></body></html>');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const g = globalThis as any;
    g.window = win;
    g.document = win.document;
    for (const k of ['navigator', 'HTMLElement', 'HTMLIFrameElement', 'Element', 'Node', 'MutationObserver', 'ResizeObserver', 'getComputedStyle', 'requestAnimationFrame', 'cancelAnimationFrame']) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (g[k] === undefined) g[k] = (win as any)[k];
    }
    g.IS_REACT_ACT_ENVIRONMENT = true;
    const { createRoot } = await import('react-dom/client');
    const host = win.document.createElement('div');
    win.document.body.appendChild(host);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const root = createRoot(host as any);
    await act(async () => { root.render(withPin(PIN, <WhiteboardCanvas commands={TWO_PAGES} chrome="minimal" openOnLastPage leadItem={FIG} />)); });
    try {
      assert.equal(host.querySelector('[data-wb-lead-item]'), null, 'on page 2 (no lead item there)');
      assert.ok(host.querySelector('[data-wb-item-id="c"]'), 'page 2 is shown');
      const wrapper = host.querySelector('.wb-page-enter-forward, .wb-page-enter-backward');
      assert.ok(wrapper, 'page wrapper rendered');
      assert.equal(wrapper.firstElementChild?.getAttribute('data-wb-lead-pin'), '1', 'slot is the page wrapper\'s first child');
      assert.equal(host.querySelectorAll('[data-wb-lead-pin]').length, 1, 'exactly one slot');
    } finally {
      await act(async () => { root.unmount(); });
    }
  });
}

/** Final-review fixes on the two UI files: the scroll offset (I3, happy-dom
 *  with stubbed layout numbers), the auto-collapse guard (I4) and the tap
 *  guard (M4) — source-pattern pins (see each section for why). */
async function part4() {
  console.log('4 final review: scroll under the sticky pin; no auto-collapse; no mark from a pin tap');
  const wb = await import('@/app/tutor/components/whiteboard/WhiteboardCanvas');
  const scrollCase = (withSlot: boolean, itemAboveSlot = false) => {
    const win = new Window({ url: 'http://localhost/' });
    const doc = win.document;
    const container = doc.createElement('div');
    const slot = doc.createElement('div');
    slot.setAttribute('data-wb-lead-pin', '1');
    const item = doc.createElement('div');
    item.setAttribute('style', 'scroll-margin-top: 24px');
    if (itemAboveSlot) { container.appendChild(item); if (withSlot) container.appendChild(slot); }
    else { if (withSlot) container.appendChild(slot); container.appendChild(item); }
    doc.body.appendChild(container);
    const def = (el: object, props: Record<string, unknown>) => { for (const [k, v] of Object.entries(props)) Object.defineProperty(el, k, { value: v, configurable: true }); };
    def(slot, { offsetTop: 300, offsetHeight: 90, offsetParent: container });
    def(item, { offsetTop: itemAboveSlot ? 40 : 1000, offsetHeight: 50, offsetParent: container });
    def(container, { clientHeight: 600, scrollHeight: 5000 });
    let top = -1;
    (container as unknown as { scrollTo: (o: { top: number }) => void }).scrollTo = (o) => { top = o.top; };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const g = globalThis as any;
    const prev = g.getComputedStyle;
    g.getComputedStyle = win.getComputedStyle.bind(win);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    try { wb.scrollElementIntoContainer(container as any, item as any, 'start'); } finally { g.getComputedStyle = prev; }
    return top;
  };
  await section('I3: an item below the sticky pin lands under it (target − slot height − 8); no slot or an item above it: unchanged', () => {
    assert.equal(typeof wb.scrollElementIntoContainer, 'function', 'scrollElementIntoContainer is a named export');
    assert.equal(scrollCase(false), 1000 - 24, 'no slot: offsetTop − scroll-margin-top, as before');
    assert.equal(scrollCase(true), 1000 - 24 - 90 - 8, 'slot present, item below it: its height + 8 px subtracted');
    assert.equal(scrollCase(true, true), 40 - 24, 'item above the slot (the figure): unchanged');
  });
  await section('I4 (source pin — QPIN_AUTO_COLLAPSE is false, so no timer can arm in a render today): the collapse schedule skips one-problem sessions', () => {
    const src = fs.readFileSync(path.join(__dirname, '..', 'src/app/tutor/components/session/SessionStage.tsx'), 'utf8');
    const i = src.indexOf('// Schedule the collapse.');
    assert.ok(i > 0, 'the schedule effect is found');
    const effect = src.slice(i, src.indexOf('}, [', i));
    assert.match(effect, /if \(!QPIN_AUTO_COLLAPSE \|\| qpinStatic \|\| /, 'qpinStatic guards the timer');
  });
  await section('M4 (source pin — the tap path reads layout happy-dom does not have): a tap on the pin never fires a board mark', () => {
    const src = fs.readFileSync(path.join(__dirname, '..', 'src/app/tutor/components/whiteboard/WhiteboardCanvas.tsx'), 'utf8');
    for (const fn of ['handleMarkPointerDown', 'handleMarkPointerUp']) {
      const i = src.indexOf(`const ${fn} = useCallback(`);
      assert.ok(i > 0, `${fn} is found`);
      const body = src.slice(i, src.indexOf('}, [', i));
      assert.match(body, /\(e\.target as Element\)\.closest\('\[data-wb-lead-pin\]'\)\) \{ tapStartRef\.current = null; return; \}/, `${fn} returns early on the pin`);
    }
  });
}

async function main() {
  try {
    ({ BoardLeadPinContext: LeadPinCtx } = await import('@/app/tutor/components/whiteboard/board-lead-pin-context'));
  } catch (e) {
    console.log(`  (BoardLeadPinContext did not load: ${(e as Error).message.split('\n')[0]})`);
  }
  await part1();
  await part2();
  await part3();
  await part4();
  console.log(`\n${passed} passed, ${failed} failed${skipped ? `, ${skipped} layout check skipped (no chromium/CSS on this machine)` : ''}`);
  if (failed) process.exit(1);
}

main().catch((e) => { console.error(e); process.exit(1); });
