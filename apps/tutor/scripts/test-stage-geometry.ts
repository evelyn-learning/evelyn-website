/** Round 3 (A13): text-mode right column = [tool row][gap][transcript panel]
 *  under the header; the tool row is horizontal and the adjust-lesson menu is
 *  portalled out of the header's stacking context.
 *  Usage: npx tsx scripts/test-stage-geometry.ts */
import { readFileSync } from 'fs';
import { join } from 'path';
import { textColumnGeometry, HEADER_CLEARANCE_PX, RAIL_ROW_PX, TOOLS_ROW_PX, TOOLS_PANEL_GAP_PX, toolsRowDefaultOpen } from '../src/app/tutor/components/session/stage-geometry';

let passed = 0, failed = 0;
const assert = (c: boolean, n: string) => { c ? passed++ : failed++; console.log(`${c ? '✓' : '✗'} ${n}`); };

const a = textColumnGeometry({ hasRail: false });
assert(a.toolsTopPx === HEADER_CLEARANCE_PX && a.toolsTopPx === 68, 'no rail: tools row directly under the header (68px)');
assert(a.panelTopPx === 68 + TOOLS_ROW_PX + TOOLS_PANEL_GAP_PX, 'no rail: panel starts below the tool row + gap');
const b = textColumnGeometry({ hasRail: true });
assert(b.toolsTopPx === 68 + RAIL_ROW_PX, 'rail: tools row below the rail row');
assert(b.panelTopPx - b.toolsTopPx === TOOLS_ROW_PX + TOOLS_PANEL_GAP_PX, 'rail: same row+gap spacing');

const dir = join(__dirname, '..', 'src/app/tutor/components/session');
const stage = readFileSync(join(dir, 'SessionStage.tsx'), 'utf8');
assert(stage.includes("'--ss-tools-top'") && stage.includes('textColumnGeometry('), 'stage root sets --ss-tools-top from textColumnGeometry');
assert(stage.includes('md:top-[var(--ss-tools-top)] md:right-3'), 'text md+: cluster anchored in the right column');
assert(!stage.includes('md:right-[388px]\' : \'\'} z-20'), 'cluster no longer sits over the board at md:right-[388px]');
assert(/data-testid="tools-cluster"[^>]*flex-row/.test(stage), 'cluster is a horizontal row');
const session = readFileSync(join(dir, 'TutorSession.tsx'), 'utf8');
assert(session.includes('createPortal(') && session.includes('data-testid="adjust-lesson-menu"'), 'adjust-lesson menu portalled to body');
assert(session.includes('pacingMenuPanelRef.current?.contains('), 'outside-click treats the portalled menu as inside');


// Open by default (R40/R57) except text mode on phones.
assert(toolsRowDefaultOpen({ sessionMode: 'text', isMdUp: true }) === true, 'default: open in text mode at md+');
assert(toolsRowDefaultOpen({ sessionMode: 'text', isMdUp: false }) === false, 'default: collapsed in text mode on phones');
assert(toolsRowDefaultOpen({ sessionMode: 'voice', isMdUp: true }) === true, 'default: open in voice mode (md+)');
assert(toolsRowDefaultOpen({ sessionMode: 'voice', isMdUp: false }) === true, 'default: open in voice mode (phones)');
assert(stage.includes('useState(() => toolsRowDefaultOpen(') && stage.includes('toolsUserToggledRef.current = true'), 'stage: default from toolsRowDefaultOpen; wrench toggle marks the student choice');
assert(!/pr-14/.test(stage.replace(/\/\/.*|\{\/\*[\s\S]*?\*\/\}/g, '')), 'stage: no pr-14 phone gutter left in code');
const cluster = stage.slice(stage.indexOf('data-testid="tools-cluster"'));
const clusterEnd = cluster.indexOf('===== Slim board page switcher');
const wrenchAt = cluster.indexOf('<Wrench'), qAt = cluster.indexOf("aria-label=\"Show the tutor's question\"");
assert(wrenchAt > qAt && wrenchAt < clusterEnd && !cluster.slice(0, clusterEnd).includes('order-last'), 'stage: wrench is last in DOM (no order-last)');

console.log(`${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
