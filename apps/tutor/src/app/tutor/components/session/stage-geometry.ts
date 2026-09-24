/** Round 3 (A13): shared text-mode right-column geometry. The header card
 *  (h-12 + mt-2 = 56px) plus a 12px gap puts the first right-column item at
 *  68px; the agenda/homework rail adds a 40px row. The tool row is 32px buttons
 *  + p-1.5 (6px) top/bottom + 1px borders = 46px.
 *
 *  GreenApple round 6 (text mode, md+): the tools no longer take a row of
 *  their own above the transcript panel — they collapse to one wrench that
 *  floats INSIDE the panel's header — so the panel starts at the same top as
 *  the board column and the two are the same height. `TOOLS_ROW_PX` /
 *  `TOOLS_PANEL_GAP_PX` are kept for reference (voice mode's row is still that
 *  size) but no longer feed `panelTopPx`. These pixel values are only the
 *  first-paint fallback: SessionStage measures the board column's real content
 *  top and overrides `--ss-panel-top` with it. */
export const HEADER_CLEARANCE_PX = 68;
export const RAIL_ROW_PX = 40;
export const TOOLS_ROW_PX = 46;
export const TOOLS_PANEL_GAP_PX = 8;
/** Text-mode tool rail: 28px buttons, 4px gap, vertical strip. */
export const TOOL_RAIL_BTN_PX = 28;
export const TOOL_RAIL_GAP_PX = 4;
/** Wrench offset from the panel's top edge: the panel header is ~45px tall
 *  (py-3 + 20px line + 1px border) and the collapsed rail is 30px (28px
 *  button + 1px borders), so 8px centres it in the header. */
export const TOOL_RAIL_INSET_PX = 8;

export function textColumnGeometry({ hasRail }: { hasRail: boolean }): { toolsTopPx: number; panelTopPx: number } {
  const toolsTopPx = HEADER_CLEARANCE_PX + (hasRail ? RAIL_ROW_PX : 0);
  return { toolsTopPx, panelTopPx: toolsTopPx };
}

/** Top of the text-mode wrench (md+), given the panel's top. */
export function toolRailTopPx(panelTopPx: number): number {
  return panelTopPx + TOOL_RAIL_INSET_PX;
}

/** Tools default: open (R40/R57) in voice mode at every width. Text mode
 *  (GreenApple round 6) starts COLLAPSED to the wrench at every width, on a
 *  fresh start and on resume — nothing is persisted. */
export function toolsRowDefaultOpen({ sessionMode }: { sessionMode: string; isMdUp: boolean }): boolean {
  return sessionMode === 'voice';
}
