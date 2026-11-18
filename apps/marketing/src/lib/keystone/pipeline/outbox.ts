import { ks, type OutboxDoc } from "../db";

// Suggested messages. Nothing here sends anything: a daily status email lists the open
// suggestions and a person-supervised session turns each into a Gmail draft, then markDrafted.

type Kind = OutboxDoc["kind"];
type Suggestion = Omit<OutboxDoc, "createdAt" | "draftedAt">;

const openKeyOf = (kind: string, batchId?: string) => `${kind}|${batchId ?? ""}`;
let inited: Promise<unknown> | null = null;

export async function suggest(doc: Suggestion): Promise<void> {
  const { Outbox } = await ks();
  inited ??= Outbox.init().catch((e) => { inited = null; throw e; });
  await inited;
  const openKey = openKeyOf(doc.kind, doc.batchId);
  const filter = {
    kind: doc.kind,
    batchId: doc.batchId === undefined ? { $exists: false } : doc.batchId,
    draftedAt: { $exists: false },
    openKey,
  };
  const update = {
    $addToSet: { itemIds: { $each: doc.itemIds }, to: { $each: doc.to } },
    $set: { subject: doc.subject, bodyMd: doc.bodyMd },
    $setOnInsert: { kind: doc.kind, createdAt: new Date(), openKey, ...(doc.batchId === undefined ? {} : { batchId: doc.batchId }) },
  };
  for (let attempt = 0; ; attempt++) {
    try {
      // The filter's equality fields (kind, batchId) are copied into the inserted document by upsert.
      await Outbox.findOneAndUpdate(filter, update, { upsert: true });
      return;
    } catch (e) {
      // lost the race to another upsert: the open one exists now, so merge into it
      if ((e as { code?: number }).code === 11000 && attempt < 3) continue;
      throw e;
    }
  }
}

export async function openSuggestions(): Promise<(OutboxDoc & { id: string })[]> {
  const { Outbox } = await ks();
  const rows = await Outbox.find({ draftedAt: { $exists: false } }).sort({ createdAt: 1, _id: 1 }).lean();
  return rows.map(({ _id, __v, openKey, ...rest }: Record<string, unknown>) => ({ ...rest, id: String(_id) }) as unknown as OutboxDoc & { id: string });
}

export async function markDrafted(id: string): Promise<void> {
  const { Outbox } = await ks();
  if (!/^[0-9a-f]{24}$/i.test(id)) throw new Error("suggestion not found");
  const res = await Outbox.updateOne({ _id: id, draftedAt: { $exists: false } }, { $set: { draftedAt: new Date() }, $unset: { openKey: "" } });
  if (res.matchedCount) return;
  if (!(await Outbox.exists({ _id: id }))) throw new Error("suggestion not found");
}

// ---- copy ----

const list = (ids: string[]) => (ids.length > 12 ? ids.map((i) => `- ${i}`).join("\n") : ids.join(", "));
const items = (n: number) => (n === 1 ? "1 item" : `${n} items`);

type Composed = { to: OutboxDoc["to"]; subject: string; bodyMd: string };

export function composeSuggestion(kind: "batch_received" | "batch_in_review", data: { batchName: string; count: number }): Composed;
export function composeSuggestion(kind: "items_need_data" | "keys_queried" | "course_missing", data: { itemIds: string[] }): Composed;
export function composeSuggestion(kind: "sample_requested", data: { kinds: string[] }): Composed;
export function composeSuggestion(kind: Kind, data: never): Composed;
export function composeSuggestion(kind: Kind, data: unknown): Composed {
  const d = data as { batchName: string; count: number; itemIds: string[]; kinds: string[] };
  switch (kind) {
    case "batch_received":
      return {
        to: ["julie", "vance"],
        subject: `Received: ${items(d.count)} (${d.batchName})`,
        bodyMd: "The items in this batch have arrived. Anything incomplete, or any answer key we cannot reproduce, will be raised on Keystone before solutions are written.",
      };
    case "items_need_data": {
      const n = d.itemIds.length;
      return {
        to: ["vance", "julie"],
        subject: `${items(n)} ${n === 1 ? "needs its" : "need their"} question data re-sent`,
        bodyMd: `${n === 1 ? "This item is" : "These items are"} marked "Item data needed" on Keystone, with a note saying what is missing:\n\n${list(d.itemIds)}\n\nEach one returns to us automatically when it is uploaded again.`,
      };
    }
    case "keys_queried": {
      const n = d.itemIds.length;
      return {
        to: ["julie"],
        subject: `${n === 1 ? "1 answer key" : `${n} answer keys`} to check`,
        bodyMd: `Our working reached a different answer from the key on ${n === 1 ? "this item" : "these items"}:\n\n${list(d.itemIds)}\n\nOur working is on each item's page under "Key query", with the three choices there for how to respond.`,
      };
    }
    case "course_missing": {
      const n = d.itemIds.length;
      return {
        to: ["vance", "julie"],
        subject: `${items(n)} ${n === 1 ? "has" : "have"} no course in the spreadsheet`,
        bodyMd: `We could not find a course in the spreadsheet for ${n === 1 ? "this item" : "these items"}:\n\n${list(d.itemIds)}\n\nCould you send the course for each? We write to the course in the spreadsheet only.`,
      };
    }
    case "batch_in_review":
      return {
        to: ["julie", "markus"],
        subject: `${d.count === 1 ? "1 solution" : `${d.count} solutions`} ready for review (${d.batchName})`,
        bodyMd: `${d.count === 1 ? "A solution is" : "Solutions are"} ready for review on Keystone. Please let us know of anything that needs to change.`,
      };
    case "sample_requested":
      return {
        to: ["vance"],
        subject: "Could you send one sample export of each of these question types?",
        bodyMd: `We have not yet seen these question types:\n\n${list(d.kinds)}\n\nOne QTI export of each lets us confirm we read them correctly.`,
      };
  }
}
