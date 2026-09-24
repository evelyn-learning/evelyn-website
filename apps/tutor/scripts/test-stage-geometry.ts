/** Round 3 (A13): text-mode right column geometry; adjust-lesson menu is
 *  portalled out of the header's stacking context.
 *  GreenApple round 6: text mode — transcript panel top == board top (same
 *  height), tools collapse to a wrench inside the panel header and open as a
 *  vertical overlay strip, page nav slimmed onto the problem-chip row.
 *  Usage: npx tsx scripts/test-stage-geometry.ts */
import { readFileSync } from 'fs';
import { join } from 'path';
import {
  textColumnGeometry, toolRailTopPx, HEADER_CLEARANCE_PX, RAIL_ROW_PX,
  TOOL_RAIL_INSET_PX, TOOL_RAIL_BTN_PX, toolsRowDefaultOpen,
} from '../src/app/tutor/components/session/stage-geometry';

let passed = 0, failed = 0;
const assert = (c: boolean, n: string) => { c ? passed++ : failed++; console.log(`${c ? '✓' : '✗'} ${n}`); };

const a = textColumnGeometry({ hasRail: false });
assert(a.toolsTopPx === HEADER_CLEARANCE_PX && a.toolsTopPx === 68, 'no rail: column top directly under the header (68px)');
assert(a.panelTopPx === a.toolsTopPx, 'no rail: panel top no longer includes a tools row');
const b = textColumnGeometry({ hasRail: true });
assert(b.toolsTopPx === 68 + RAIL_ROW_PX, 'rail: column top below the rail row');
assert(b.panelTopPx === b.toolsTopPx, 'rail: panel top no longer includes a tools row');
assert(toolRailTopPx(100) === 100 + TOOL_RAIL_INSET_PX && TOOL_RAIL_BTN_PX === 28, 'wrench sits inside the panel header (28px button)');

const dir = join(__dirname, '..', 'src/app/tutor/components/session');
const stage = readFileSync(join(dir, 'SessionStage.tsx'), 'utf8');
const code = stage.replace(/\/\/.*|\{\/\*[\s\S]*?\*\/\}/g, '');
assert(stage.includes("'--ss-tools-top'") && stage.includes("'--ss-panel-top'") && stage.includes('textColumnGeometry('), 'stage root sets --ss-tools-top / --ss-panel-top');
assert(stage.includes('boardTopPx ?? textGeom.panelTopPx') && stage.includes('toolRailTopPx('), 'panel top = measured board-column content top (fallback: geometry)');
assert(stage.includes('md:top-[var(--ss-panel-top)] md:left-auto md:right-3 md:w-[360px]'), 'text panel still reads --ss-panel-top');
assert(stage.includes("data-state={toolsOpen ? 'expanded' : 'collapsed'}"), 'cluster exposes data-state collapsed|expanded');
assert(/data-testid="tools-cluster"/.test(stage), 'tools-cluster testid kept');
assert(stage.includes('md:top-[var(--ss-tools-top)] md:right-5 md:z-[55]'), 'text md+: wrench anchored in the panel header, above the panel');
assert(stage.includes('flex flex-row items-center gap-1 rounded-2xl bg-white border border-slate-200 shadow-md p-1.5'), 'voice: horizontal cluster classes unchanged');
assert(stage.includes('flex flex-row-reverse md:flex-col items-center gap-1 rounded-xl bg-white border border-slate-200 shadow-md'), 'text: vertical rail at md+');
const session = readFileSync(join(dir, 'TutorSession.tsx'), 'utf8');
assert(session.includes('createPortal(') && session.includes('data-testid="adjust-lesson-menu"'), 'adjust-lesson menu portalled to body');
assert(session.includes('pacingMenuPanelRef.current?.contains('), 'outside-click treats the portalled menu as inside');

// Defaults: voice open (R40/R57); text collapsed at every width.
assert(toolsRowDefaultOpen({ sessionMode: 'text', isMdUp: true }) === false, 'default: collapsed in text mode at md+');
assert(toolsRowDefaultOpen({ sessionMode: 'text', isMdUp: false }) === false, 'default: collapsed in text mode on phones');
assert(toolsRowDefaultOpen({ sessionMode: 'voice', isMdUp: true }) === true, 'default: open in voice mode (md+)');
assert(toolsRowDefaultOpen({ sessionMode: 'voice', isMdUp: false }) === true, 'default: open in voice mode (phones)');
assert(stage.includes('useState(() => toolsRowDefaultOpen(') && stage.includes('toolsUserToggledRef.current = true'), 'stage: default from toolsRowDefaultOpen; wrench toggle marks the student choice');
assert(/if \(!toolsAlwaysOpen \|\| sessionMode === 'text'\) setToolsOpen\(false\)/.test(stage), 'text: choosing a tool collapses the rail');
assert(!/pr-14/.test(code), 'stage: no pr-14 phone gutter left in code');

// Wrench order: voice = last in DOM (row grows leftward); text = first (strip grows downward).
const cluster = stage.slice(stage.indexOf('data-testid="tools-cluster"'));
const clusterEnd = cluster.indexOf('===== Slim board page switcher');
const body = cluster.slice(0, clusterEnd);
const textWrench = body.indexOf("{sessionMode === 'text' && wrenchEl}");
const voiceWrench = body.indexOf("{sessionMode !== 'text' && wrenchEl}");
const qAt = body.indexOf("aria-label=\"Show the tutor's question\"");
assert(textWrench >= 0 && textWrench < body.indexOf('toolsOpen && ('), 'text: wrench first in DOM');
assert(voiceWrench > qAt && !body.includes('order-last'), 'voice: wrench last in DOM (no order-last)');

// Page nav: inline on the chip row in text md+, slimmed; no pt-12 clearance there.
assert(stage.includes('const switcherInline = ') && stage.includes('renderSwitcher(true)') && stage.includes('renderSwitcher(false)'), 'switcher renders inline on the chip row (text md+) or floating');
assert(/boardColumnTopPadClass = \(showSwitcher && !pagerInCard && !switcherInline\) \? 'pt-12'/.test(stage), 'board top pad drops the floating-pager clearance when inline');
assert(stage.includes('flex flex-wrap items-center gap-1.5'), 'chip row wraps the nav under the chip only when it does not fit');

console.log(`${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
