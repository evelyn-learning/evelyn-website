// Heartbeats of the two server jobs: each writes { _id: <job name>, at } when it runs, and the daily
// status email reports a job that stopped firing. One document per job, upserted.
//
// The model (Heartbeat, collection "heartbeats") is defined in db.ts with the others, on the same keystone
// connection, and honours the same read-only mode: under KEYSTONE_READONLY=1 beat() refuses before touching
// the database, and every write hook of the model is blocked.
// No `next/*` imports: this runs from tsx scripts on the server.

import { isReadOnly, ks, READ_ONLY_MESSAGE } from "../db";

export type { HeartbeatDoc } from "../db";

/** Records that job `name` ran at `now`. */
export async function beat(name: string, now: Date = new Date()): Promise<void> {
  if (isReadOnly()) throw new Error(READ_ONLY_MESSAGE);
  const { Heartbeat } = await ks();
  await Heartbeat.updateOne({ _id: name }, { $set: { at: now } }, { upsert: true });
}

/** When job `name` last ran; null if it never did. */
export async function lastBeat(name: string): Promise<Date | null> {
  const { Heartbeat } = await ks();
  const row = await Heartbeat.findById(name).lean();
  return row?.at ? new Date(row.at) : null;
}
