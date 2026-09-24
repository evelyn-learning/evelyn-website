/** Round 3 (A13): text-mode right column geometry; adjust-lesson menu is
 *  portalled out of the header's stacking context.
 *  GreenApple round 6: text-mode tool rail (flag NEXT_PUBLIC_TUTOR_TEXT_TOOL_RAIL,
 *  default ON) — transcript panel top == board top (same height), tools
 *  collapse to a wrench inside the panel header and open as a vertical
 *  overlay strip (md+), page nav slimmed onto the problem-chip row.
 *  Usage: npx tsx scripts/test-stage-geometry.ts */
import { readFileSync } from 'fs';
import { join } from 'path';
import {
  legacyTextColumnGeometry, textPanelTopFallbackPx, toolRailTopPx, qpinDefaultTopPx, qpinMaxWidthPx,
  HEADER_CLEARANCE_PX, RAIL_ROW_PX, TOOLS_ROW_PX, TOOLS_PANEL_GAP_PX,
  TOOL_RAIL_INSET_PX, TOOL_RAIL_BTN_PX, toolsRowDefaultOpen,
} from '../src/app/tutor/components/session/stage-geometry';

let passed = 0, failed = 0;
const assert = (c: boolean, n: string) => { c ? passed++ : failed++; console.log(`${c ? '✓' : '✗'} ${n}`); };

// ---- geometry (pure) ----
assert(textPanelTopFallbackPx({ chipRow: false }) === 64, 'rail fallback: board/panel top 64px with no chip row (56 header + pt-2)');
assert(textPanelTopFallbackPx({ chipRow: true }) === 90, 'rail fallback: 90px with the chip row (56 + 30 row + pt-1)');
assert(toolRailTopPx(90) === 98 && TOOL_RAIL_INSET_PX === 8 && TOOL_RAIL_BTN_PX === 28, 'wrench sits 8px inside the panel header (28px button)');
assert(qpinDefaultTopPx(90) === 98, 'Q-pin default under the rail: board top + 8px');
assert(qpinMaxWidthPx(0) === 160, 'Q-pin max-width: floors at 160px on a near-zero board');
assert(qpinMaxWidthPx(400) === 384, 'Q-pin max-width: board width - 16px');
assert(qpinMaxWidthPx(900) === 560, 'Q-pin max-width: caps at the pre-round-6 560px');
const a = legacyTextColumnGeometry({ hasRail: false });
assert(a.toolsTopPx === HEADER_CLEARANCE_PX && a.toolsTopPx === 68 && a.panelTopPx === 68 + TOOLS_ROW_PX + TOOLS_PANEL_GAP_PX, 'legacy (flag off): tool row at 68, panel below row + gap');
const b = legacyTextColumnGeometry({ hasRail: true });
assert(b.toolsTopPx === 68 + RAIL_ROW_PX && b.panelTopPx === 108 + 54, 'legacy (flag off) with rail row: 108 / 162');

// Defaults: voice open (R40/R57); text rail collapsed at every width; flag off = round-3 behaviour.
assert(toolsRowDefaultOpen({ sessionMode: 'text', isMdUp: true, textToolRail: true }) === false, 'rail default: collapsed at md+');
assert(toolsRowDefaultOpen({ sessionMode: 'text', isMdUp: false, textToolRail: true }) === false, 'rail default: collapsed on phones');
assert(toolsRowDefaultOpen({ sessionMode: 'text', isMdUp: true, textToolRail: false }) === true, 'flag off: open at md+');
assert(toolsRowDefaultOpen({ sessionMode: 'text', isMdUp: false, textToolRail: false }) === false, 'flag off: collapsed on phones');
assert(toolsRowDefaultOpen({ sessionMode: 'voice', isMdUp: true, textToolRail: false }) === true, 'voice: open (md+)');
assert(toolsRowDefaultOpen({ sessionMode: 'voice', isMdUp: false, textToolRail: false }) === true, 'voice: open (phones)');

// ---- source wiring (on comment-stripped code) ----
const dir = join(__dirname, '..', 'src/app/tutor/components/session');
const stage = readFileSync(join(dir, 'SessionStage.tsx'), 'utf8');
// JSX comments and whole-line // comments (not /* */: `accept="image/*"` would open one).
const code = stage.replace(/\{\/\*[\s\S]*?\*\/\}/g, '').replace(/^\s*\/\/.*$/gm, '');
const has = (t: string) => code.includes(t);

assert(has("const textToolRail = sessionMode === 'text' && process.env.NEXT_PUBLIC_TUTOR_TEXT_TOOL_RAIL !== 'off'"), 'rail flag: every text session, default ON');
assert(has("'--ss-tools-top'") && has("'--ss-panel-top'"), 'stage root sets --ss-tools-top / --ss-panel-top');
assert(has('boardTopPx ?? textPanelTopFallbackPx({ chipRow: chipRowShown })'), 'panel top = measured board top; fallback from the same layout');
assert(has('useIsomorphicLayoutEffect(() => {') && has("typeof window !== 'undefined' ? useLayoutEffect : useEffect"), 'measurement runs before paint (isomorphic layout effect)');
assert(code.indexOf('const stageRef = useRef') < code.indexOf('useIsomorphicLayoutEffect(() => {'), 'stageRef declared before the effect that reads it');
assert(has('textToolRail ? textBoardTopPx : legacyTextGeom.panelTopPx'), 'flag off: legacy panel top');
assert(has('md:top-[var(--ss-panel-top)] md:left-auto md:right-3 md:w-[360px]'), 'text panel reads --ss-panel-top');
assert(has("data-state={toolsOpen ? 'expanded' : 'collapsed'}") && has('data-testid="tools-cluster"'), 'cluster testid kept + data-state');
assert(has("textToolRail ? ' md:top-[var(--ss-tools-top)] md:right-5 md:z-[55]' : sessionMode === 'text' ? ' md:top-[var(--ss-tools-top)] md:right-3' : ''"), 'rail: wrench in the panel header above the panel; flag off: legacy anchor');
assert(has("'flex flex-row items-center gap-1 rounded-2xl bg-white border border-slate-200 shadow-md p-1.5'"), 'voice/flag-off: horizontal cluster classes unchanged');
assert(has("'flex flex-row md:flex-col items-center gap-1 rounded-2xl md:rounded-xl bg-white border border-slate-200 shadow-md p-1.5 md:p-0'"), 'rail: vertical strip md+, phone row + p-1.5 kept');
assert(has("textToolRail ? 'w-8 h-8 md:w-7 md:h-7' : 'w-8 h-8'"), 'rail: 28px buttons md+ only, 32px on phones');
assert(has("textToolRail ? 'relative md:order-first' : 'relative'") && !has('order-last'), 'wrench LAST in DOM; md:order-first lifts it in the rail strip');
assert(has('`${toolSepClass} md:hidden`'), 'rail: no trailing separator in the md+ strip');
assert(/if \(!toolsAlwaysOpen \|\| textToolRail\) setToolsOpen\(false\)/.test(code), 'rail: choosing a tool collapses');
assert(has("textToolRail ? 'grid md:hidden' : 'grid'") && has('md:right-[54px] md:z-[55]'), 'rail: Q button outside the strip at md+, left of the wrench');
assert(has('useState(() => toolsRowDefaultOpen(') && has('toolsUserToggledRef.current = true'), 'default from toolsRowDefaultOpen; wrench toggle marks the student choice');
assert(!/pr-14/.test(code), 'no pr-14 phone gutter left in code');

// Page nav
assert(has('const switcherInline = textToolRail && !pagerInCard && !isFullscreen'), 'switcher inline only for the text rail at md+, not fullscreen');
assert(has('renderSwitcher(true)') && has('renderSwitcher(false)'), 'switcher renders inline on the chip row or floating');
assert(/boardColumnTopPadClass = \(showSwitcher && !pagerInCard && !switcherInline\) \? 'pt-12'/.test(code), 'board top pad drops the floating-pager clearance when inline');
assert(has('relative z-[25] shrink-0 order-2 px-2 md:pl-4 md:pr-[388px] pt-1.5 flex flex-wrap items-center gap-1.5'), 'chip row: board-column width, above the Q-pin');
assert(has("${inline ? 'left-0 right-0' : 'left-1/2 -translate-x-1/2 w-[min(86vw,360px)]'}"), 'inline dropdown matches the pill width (cannot cross the board edge)');
// renderSwitcher(false) = the pre-round-6 floating markup, exact class strings.
const floating = [
  "`absolute ${railEl && !isFullscreen ? 'top-[98px]' : 'top-[58px]'} left-1/2 -translate-x-1/2 z-30 pointer-events-auto ${sessionMode === 'text' ? 'md:left-[calc(50%_-_186px)]' : ''}`",
  "'flex items-center gap-0.5 rounded-full bg-white/95 backdrop-blur border border-slate-200 shadow-md pl-1 pr-1 py-1 w-[min(86vw,360px)]'",
  "`shrink-0 grid place-items-center ${inline ? 'w-6 h-[22px]' : 'w-7 h-7'} rounded-full hover:bg-slate-100 text-slate-600 disabled:opacity-30`",
  "`relative shrink-0 grid place-items-center ${inline ? 'w-6 h-[22px]' : 'w-7 h-7'} rounded-full hover:bg-slate-100 text-slate-600 disabled:opacity-30`",
  "`flex-1 min-w-0 flex items-center justify-center gap-1.5 px-1 ${inline ? 'h-[22px]' : 'h-7'} rounded-full hover:bg-slate-50`",
  "`truncate ${inline ? 'text-[11px]' : 'text-xs'} font-medium text-slate-700`",
  "`shrink-0 ${inline ? 'text-[10px]' : 'text-[11px]'} font-semibold tabular-nums text-slate-400`",
  "max-h-[50vh] overflow-y-auto rounded-2xl bg-white border border-slate-200 shadow-xl p-1.5`",
];
assert(floating.every(has), 'renderSwitcher(false): floating class strings unchanged');
// Evaluate the inline:false branch of each template to the literal pre-round-6 strings.
const evalFalse = (t: string) => t.replace(/\$\{inline \? '[^']*' : '([^']*)'\}/g, '$1');
assert(evalFalse(floating[2]) === "`shrink-0 grid place-items-center w-7 h-7 rounded-full hover:bg-slate-100 text-slate-600 disabled:opacity-30`"
  && evalFalse(floating[4]) === "`flex-1 min-w-0 flex items-center justify-center gap-1.5 px-1 h-7 rounded-full hover:bg-slate-50`"
  && evalFalse(floating[5]) === "`truncate text-xs font-medium text-slate-700`"
  && evalFalse(floating[6]) === "`shrink-0 text-[11px] font-semibold tabular-nums text-slate-400`", 'renderSwitcher(false) resolves to the exact voice classes');
assert(has('? { top: `${qpinDefaultTopPx(textBoardTopPx)}px` }') && has('const HEADER_CLEARANCE = textToolRail ? textBoardTopPx :'), 'Q-pin default/auto anchors follow the rail board top');

// Q-pin width clamp (folded-in task 2): board CARD width (not the column),
// all text-mode sessions, voice untouched.
assert(has('const boardCardRef = useRef<HTMLDivElement>(null)'), 'board card has its own ref (distinct from the column ref)');
assert(has('ref={boardCardRef}'), 'ref attached to the board card element');
assert(has('const [boardWidthPx, setBoardWidthPx] = useState<number | null>(null)'), 'board card width tracked in state');
assert(/if \(sessionMode !== 'text'\) return;/.test(code) && has('if (card) setBoardWidthPx(Math.round(card.getBoundingClientRect().width))'), 'width measured in every text-mode session, not just the rail');
assert(has("sm:max-w-[min(88vw,var(--qpin-max-w,560px))]"), 'Q-pin max-width class reads a CSS var (mobile full-width banner untouched)');
assert(has("'--qpin-max-w' as any") && has('qpinMaxWidthPx(boardWidthPx)'), 'Q-pin sets --qpin-max-w from the measured board card width');
assert(has('qpinMaxWidthPx') && stage.includes("from './stage-geometry'") && has('qpinMaxWidthPx,'), 'qpinMaxWidthPx imported from stage-geometry');

// Fold-in 1: chip row keyed on switcherInline && chipRowShown, not
// showSwitcher — so it doesn't jump sideways when a 2nd page appears.
assert(has('{(switcherInline && chipRowShown) ? (') , 'chip row branch keyed on switcherInline/chipRowShown, not showSwitcher');
assert(has('{showSwitcher ? renderSwitcher(true) : null}'), 'switcher pill still gated on showSwitcher inside the stable-padding row');

// Fold-in 2: the z-[25] chip row must not block a dragged Q-pin underneath it.
assert(has('z-[25] shrink-0 order-2 px-2 md:pl-4 md:pr-[388px] pt-1.5 flex flex-wrap items-center gap-1.5 pointer-events-none'), 'chip row itself does not capture pointer events');
assert(has('min-w-0 max-w-full pointer-events-auto'), 'rail element inside the chip row re-enables pointer events');

// Fold-in 3: useIsomorphicLayoutEffect declared after the import block.
const importsEnd = code.lastIndexOf("import type { SessionGoal }");
const isoDecl = code.indexOf('const useIsomorphicLayoutEffect =');
assert(importsEnd > -1 && isoDecl > importsEnd, 'useIsomorphicLayoutEffect declared below the import block');

const session = readFileSync(join(dir, 'TutorSession.tsx'), 'utf8');
assert(session.includes('createPortal(') && session.includes('data-testid="adjust-lesson-menu"'), 'adjust-lesson menu portalled to body');
assert(session.includes('pacingMenuPanelRef.current?.contains('), 'outside-click treats the portalled menu as inside');

console.log(`${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
