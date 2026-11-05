/**
 * The embed page's in-memory whiteboard list -> the STORED shape
 * `{ action, data, timestamp, sourceMessageIndex? }` that the session-usage
 * save writes and that ExportSessionPDFButton / the replay read. One mapping
 * for the save and the end-of-lesson PDF (a flat `cmd` loses every payload).
 * Pure, no React/Next imports.
 */
import type { WhiteboardCommand } from '@core/knowledge/types';

export type CapturedWhiteboardCommand = { cmd: WhiteboardCommand; capturedAt: string; sourceMessageIndex?: number };

export function toStoredWhiteboardCommands(list: CapturedWhiteboardCommand[]) {
  return list.map(({ cmd, capturedAt, sourceMessageIndex }) => ({
    action: cmd.action,
    data: { ...cmd, action: undefined },
    // Capture time, NOT save time: the replay reconstructs WB timing from
    // these stamps, and same-stamped arrays break it for paused-and-resumed
    // sessions (2026-07-15 replay fix).
    timestamp: capturedAt,
    // 2026-08-07: command<->message anchor, parity with /tutor. Omitted (not
    // -1) when unknown so legacy consumers see the same absence shape as
    // pre-fix rows.
    ...(typeof sourceMessageIndex === 'number' && sourceMessageIndex >= 0 ? { sourceMessageIndex } : {}),
  }));
}
