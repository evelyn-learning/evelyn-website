/** Round 3 (A13): shared text-mode right-column geometry. The header card
 *  (h-12 + mt-2 = 56px) plus a 12px gap puts the first right-column item at
 *  68px; the agenda/homework rail adds a 40px row. The tool row is 32px buttons
 *  + p-1.5 (6px) top/bottom + 1px borders = 46px. */
export const HEADER_CLEARANCE_PX = 68;
export const RAIL_ROW_PX = 40;
export const TOOLS_ROW_PX = 46;
export const TOOLS_PANEL_GAP_PX = 8;

export function textColumnGeometry({ hasRail }: { hasRail: boolean }): { toolsTopPx: number; panelTopPx: number } {
  const toolsTopPx = HEADER_CLEARANCE_PX + (hasRail ? RAIL_ROW_PX : 0);
  return { toolsTopPx, panelTopPx: toolsTopPx + TOOLS_ROW_PX + TOOLS_PANEL_GAP_PX };
}

/** Round 3 (A13, fix round 1): the horizontal tools row opens by default ONLY
 *  where it has its own slot — text mode at md+, in the right column above
 *  the transcript panel. Everywhere else (voice mode on every brand, and text
 *  mode on phones) it floats over the board, so it starts collapsed to the
 *  wrench; open, it would cover the board's top strip. */
export function toolsRowDefaultOpen({ sessionMode, isMdUp }: { sessionMode: string; isMdUp: boolean }): boolean {
  return sessionMode === 'text' && isMdUp;
}
