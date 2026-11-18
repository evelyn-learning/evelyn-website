// Heartbeats of the two server jobs: each writes { _id: <job name>, at } when it runs, and the daily
// status email reports a job that stopped firing. One document per job, upserted.
//
// The model lives here, not in db.ts, only because db.ts was under review when this was written; it is
// built on the same keystone connection (ks()) and honours the same read-only mode: under
// KEYSTONE_READONLY=1 beat() refuses before touching the database, and every write hook is blocked.
// No `next/*` imports: this runs from tsx scripts on the server.

import { Schema, type Connection, type Model } from "mongoose";
import { isReadOnly, ks, READ_ONLY_MESSAGE } from "../db";

export type HeartbeatDoc = { _id: string; at: Date };

function model(conn: Connection): Model<HeartbeatDoc> {
  const existing = conn.models.Heartbeat as Model<HeartbeatDoc> | undefined;
  if (existing) return existing;
  const schema = new Schema<HeartbeatDoc>({ _id: { type: String, required: true }, at: { type: Date, required: true } }, { versionKey: false });
  if (isReadOnly()) {
    const stop = function (next: (err?: Error) => void) {
      next(new Error(READ_ONLY_MESSAGE));
    };
    /* eslint-disable @typescript-eslint/no-explicit-any */
    schema.pre(["updateOne", "updateMany", "deleteOne", "deleteMany", "findOneAndUpdate", "findOneAndDelete", "findOneAndReplace", "replaceOne"] as any, stop as any);
    schema.pre("save", stop as any);
    schema.pre("insertMany", stop as any);
    /* eslint-enable @typescript-eslint/no-explicit-any */
  }
  return conn.model<HeartbeatDoc>("Heartbeat", schema, "heartbeats");
}

async function heartbeats(): Promise<Model<HeartbeatDoc>> {
  const { Item } = await ks();
  return model(Item.db);
}

/** Records that job `name` ran at `now`. */
export async function beat(name: string, now: Date = new Date()): Promise<void> {
  if (isReadOnly()) throw new Error(READ_ONLY_MESSAGE);
  const Heartbeat = await heartbeats();
  await Heartbeat.updateOne({ _id: name }, { $set: { at: now } }, { upsert: true });
}

/** When job `name` last ran; null if it never did. */
export async function lastBeat(name: string): Promise<Date | null> {
  const Heartbeat = await heartbeats();
  const row = await Heartbeat.findById(name).lean();
  return row?.at ? new Date(row.at) : null;
}
