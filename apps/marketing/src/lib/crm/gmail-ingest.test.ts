import { strict as assert } from "node:assert";
import { ingestGmailPage, sentQuery, labelQuery } from "./gmail-ingest";
import type { FullMessage } from "@/lib/outreach/gmail";
import type { UpsertArgs } from "./upsert-lead";

let passed = 0, failed = 0;
async function test(name: string, fn: () => void | Promise<void>) {
  try { await fn(); passed++; console.log(`  ok - ${name}`); }
  catch (e) { failed++; console.error(`  FAIL - ${name}`, e); }
}

const acct = "info@evelynlearning.com";
const m = (o: Partial<FullMessage>): FullMessage => ({
  id: "x", threadId: "t", from: "", to: "", cc: "", subject: "", date: 1, labelIds: [], text: "", messageIdHeader: "", ...o,
});

// Thread A: kept — outbound then inbound reply, so flagReview is false.
const threadA: FullMessage[] = [
  m({ id: "a1", from: acct, to: "Pat <pat@x.org>", subject: "Hello", text: "hi there", labelIds: ["SENT"], date: 1 }),
  m({ id: "a2", from: "Pat <pat@x.org>", to: acct, subject: "Re: Hello", text: "sure, tell me more", date: 2 }),
];
// Thread B: skip — auto-reply only, no human reply.
const threadB: FullMessage[] = [
  m({ id: "b1", from: acct, to: "dana@y.org", subject: "Thank you for contacting Evelyn Learning", labelIds: ["SENT"], date: 1 }),
];
// Thread C: skip — machine sender.
const threadC: FullMessage[] = [
  m({ id: "c1", from: acct, to: "billing@apollo.io", subject: "x", labelIds: ["SENT"], date: 1 }),
];

function fakeListThreadIds(ids: string[], nextPageToken?: string) {
  return async (_account: string, _q: string, _pageToken?: string) => ({ ids, nextPageToken });
}

function fakeGetFullThread(byId: Record<string, FullMessage[] | Error>) {
  return async (threadId: string, _account: string): Promise<FullMessage[]> => {
    const v = byId[threadId];
    if (v instanceof Error) throw v;
    if (!v) throw new Error(`no fake thread for ${threadId}`);
    return v;
  };
}

(async () => {

await test("sentQuery formats days, clamping below 1 to 1", () => {
  assert.equal(sentQuery(365), "in:sent newer_than:365d");
  assert.equal(sentQuery(0.5), "in:sent newer_than:1d");
});

await test("labelQuery is fixed", () => {
  assert.equal(labelQuery(), "label:CRM newer_than:3d");
});

await test("dry run: scans, classifies, tallies skips, never upserts", async () => {
  const upsertCalls: UpsertArgs[] = [];
  const deps = {
    listThreadIds: fakeListThreadIds(["A", "B", "C"], "next-token-1"),
    getFullThread: fakeGetFullThread({ A: threadA, B: threadB, C: threadC }),
    upsert: async (args: UpsertArgs) => { upsertCalls.push(args); return { leadId: "L1", created: true, added: 1, matchedBy: "new" as const }; },
  };
  const r = await ingestGmailPage({ account: acct, query: "q", dryRun: true, origin: "gmail_import" }, deps);
  assert.equal(r.scanned, 3);
  assert.equal(r.kept, 1);
  assert.deepEqual(r.skipped, { auto_reply_only: 1, self_notification: 0, internal: 0, machine: 1, empty: 0 });
  assert.equal(r.nextPageToken, "next-token-1");
  assert.equal(r.samples.length, 3);
  assert.deepEqual(r.samples.map((s) => s.verdict), ["keep", "skip:auto_reply_only", "skip:machine"]);
  assert.equal(upsertCalls.length, 0);
});

await test("real run: upsert called once with origin-tagged touches and gmail:<account> source", async () => {
  const upsertCalls: UpsertArgs[] = [];
  const deps = {
    listThreadIds: fakeListThreadIds(["A"], undefined),
    getFullThread: fakeGetFullThread({ A: threadA }),
    upsert: async (args: UpsertArgs) => { upsertCalls.push(args); return { leadId: "L1", created: true, added: 2, matchedBy: "new" as const }; },
  };
  const r = await ingestGmailPage({ account: acct, query: "q", dryRun: false, origin: "gmail_label" }, deps);
  assert.equal(upsertCalls.length, 1);
  const call = upsertCalls[0];
  assert.equal(call.source, `gmail:${acct}`);
  assert.ok(call.touches.length > 0);
  assert.ok(call.touches.every((t) => t.origin === "gmail_label"));
  assert.equal(r.created, 1);
  assert.equal(r.updated, 0);
  assert.equal(r.touchesAdded, 2);
});

await test("a thread whose getFullThread throws is skipped without aborting the page", async () => {
  const upsertCalls: UpsertArgs[] = [];
  const deps = {
    listThreadIds: fakeListThreadIds(["BAD", "A"], undefined),
    getFullThread: fakeGetFullThread({ BAD: new Error("boom"), A: threadA }),
    upsert: async (args: UpsertArgs) => { upsertCalls.push(args); return { leadId: "L1", created: true, added: 1, matchedBy: "new" as const }; },
  };
  const r = await ingestGmailPage({ account: acct, query: "q", dryRun: true, origin: "gmail_import" }, deps);
  assert.equal(r.scanned, 2);
  assert.equal(r.kept, 1);
  assert.equal(r.errors, 1);
  assert.equal(r.samples.length, 1);
  assert.equal(r.samples[0].threadId, "A");
});

console.log(`\n${passed} passed, ${failed} failed`); process.exit(failed ? 1 : 0);
})();
