// Whether a run's recorded final write (RunDoc.intent) is what the item shows now. Shared by the run (a resume
// finishing its own write's bookkeeping) and the daily status (an unfinished run whose own write landed is not a
// failure). Pure. No `next/*` imports.

import type { ItemDoc, RunDoc } from "../db";

export type OwnWrite = "landed" | "landed_then_changed" | "not_ours";

/**
 * The write's own marker must be there: the solution row of that version carries this runId (`solutionRunId`:
 * the runId of the row at intent.toVersion, undefined when written by a person or absent), or (item_data /
 * key_query) the item's pipeline.runId and wroteStage were set by this run in the same update. Stage and version
 * alone never count: a person making the same change is not this run's write.
 *   landed               marker present and the item is as the write left it
 *   landed_then_changed  marker present, but the item changed again after it
 *   not_ours             no marker from this run (or no intent recorded)
 */
export function ownWriteState(
  run: Pick<RunDoc, "intent" | "runId">,
  cur: Pick<ItemDoc, "stage" | "version" | "pipeline">,
  solutionRunId: string | undefined,
): OwnWrite {
  const i = run.intent;
  if (!i) return "not_ours";
  const marked =
    i.writing === "ready" || i.writing === "held"
      ? solutionRunId === run.runId
      : cur.pipeline?.runId === run.runId && cur.pipeline?.wroteStage === i.stage;
  if (!marked) return "not_ours";
  return cur.stage === i.stage && (cur.version || 0) === i.toVersion ? "landed" : "landed_then_changed";
}
