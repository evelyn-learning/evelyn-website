/** Text-mode right-column geometry (md+).
 *
 *  Two layouts, chosen by `NEXT_PUBLIC_TUTOR_TEXT_TOOL_RAIL` (default ON):
 *
 *  - Tool rail (GreenApple round 6): the tools collapse to one wrench that
 *    floats INSIDE the transcript panel's header, and the page switcher rides
 *    the chip row, so the panel starts at the board column's content top and
 *    the two are the same height. SessionStage measures that top from the
 *    live column; `textPanelTopFallbackPx` is the pre-measurement value
 *    (first paint / SSR) derived from the same layout, so there is no jump.
 *
 *  - Legacy (flag 'off', round 3 A13): a horizontal tool row in its own slot
 *    above the panel — `legacyTextColumnGeometry`. The header card
 *    (h-12 + mt-2 = 56px) plus a 12px gap puts the row at 68px; the agenda /
 *    homework rail adds a 40px row; the tool row is 32px buttons + p-1.5 +
 *    1px borders = 46px, then an 8px gap to the panel. */

/** Header card: h-12 (48) + mt-2 (8). */
export const HEADER_CARD_PX = 56;
/** Board column top padding without a chip row (`pt-2`). */
export const BOARD_PAD_NO_ROW_PX = 8;
/** Board column top padding under the chip row (`pt-1`). */
export const BOARD_PAD_UNDER_ROW_PX = 4;
/** Chip row: pt-1.5 (6) + a 24px chip / slim pager (16px line + py-1). */
export const CHIP_ROW_PX = 30;

/** Board-column content top (= transcript panel top) before measurement:
 *  64px with no chip row, 90px with one. */
export function textPanelTopFallbackPx({ chipRow }: { chipRow: boolean }): number {
  return HEADER_CARD_PX + (chipRow ? CHIP_ROW_PX + BOARD_PAD_UNDER_ROW_PX : BOARD_PAD_NO_ROW_PX);
}

/** Wrench offset from the panel's top edge: the panel header is ~45px tall
 *  (py-3 + 20px line + 1px border) and the collapsed rail is 30px (28px
 *  button + 1px borders), so 8px centres it in the header. */
export const TOOL_RAIL_INSET_PX = 8;
export const TOOL_RAIL_BTN_PX = 28;

/** Top of the text-mode wrench (md+), given the panel's top. */
export function toolRailTopPx(panelTopPx: number): number {
  return panelTopPx + TOOL_RAIL_INSET_PX;
}

/** Q-pin default anchor under the tool rail: just below the board top. */
export const QPIN_BOARD_GAP_PX = 8;
export function qpinDefaultTopPx(boardTopPx: number): number {
  return boardTopPx + QPIN_BOARD_GAP_PX;
}

export const HEADER_CLEARANCE_PX = 68;
export const RAIL_ROW_PX = 40;
export const TOOLS_ROW_PX = 46;
export const TOOLS_PANEL_GAP_PX = 8;

/** Legacy (rail flag 'off'): [tool row][gap][panel] under the header. */
export function legacyTextColumnGeometry({ hasRail }: { hasRail: boolean }): { toolsTopPx: number; panelTopPx: number } {
  const toolsTopPx = HEADER_CLEARANCE_PX + (hasRail ? RAIL_ROW_PX : 0);
  return { toolsTopPx, panelTopPx: toolsTopPx + TOOLS_ROW_PX + TOOLS_PANEL_GAP_PX };
}

/** Tools default: open (R40/R57) in voice mode at every width. Text mode with
 *  the tool rail starts COLLAPSED at every width (fresh start and resume,
 *  nothing persisted) — the open strip overlays the transcript. Legacy text
 *  mode (rail flag 'off'): open at md+ (its own slot), collapsed on phones
 *  where the open row would cover the board card's top strip. */
export function toolsRowDefaultOpen({ sessionMode, isMdUp, textToolRail }: { sessionMode: string; isMdUp: boolean; textToolRail: boolean }): boolean {
  if (sessionMode === 'voice') return true;
  return sessionMode === 'text' && !textToolRail && isMdUp;
}
