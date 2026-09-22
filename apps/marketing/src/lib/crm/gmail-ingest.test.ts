import { strict as assert } from "node:assert";
import { ingestGmailPage, isRateLimitError, sentQuery, labelQuery, GmailRateLimitError } from "./gmail-ingest";
import type { FullMessage } from "@/lib/outreach/gmail";
import type { UpsertArgs } from "./upsert-lead";

// No-op sleep for every fake `deps` below — these tests must run instantly,
// never wait out a real backoff/pacing delay.
const noopSleep = async (_ms: number) => {};

// Shaped like a googleapis/gaxios error: `.status` (what `httpStatusOf`
// reads) plus `.message`/`.errors[].reason` (what `isRateLimitError` reads
// for the 403 quota case).
function rateLimitError(status: 429 | 403 = 429, message = "Quota exceeded for quota metric 'Units per minute per user'"): Error {
  return Object.assign(new Error(message), { status });
}

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
    sleep: noopSleep,
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
    sleep: noopSleep,
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
    sleep: noopSleep,
  };
  const r = await ingestGmailPage({ account: acct, query: "q", dryRun: true, origin: "gmail_import" }, deps);
  assert.equal(r.scanned, 2);
  assert.equal(r.kept, 1);
  assert.equal(r.errors, 1);
  assert.equal(r.samples.length, 1);
  assert.equal(r.samples[0].threadId, "A");
});

await test("isRateLimitError: true for 429, true for 403 w/ quota reason, false otherwise", () => {
  assert.equal(isRateLimitError(rateLimitError(429, "Quota exceeded for quota metric 'Units per minute per user'")), true);
  assert.equal(isRateLimitError(Object.assign(new Error("nope"), { status: 403, errors: [{ reason: "userRateLimitExceeded" }] })), true);
  assert.equal(isRateLimitError(Object.assign(new Error("forbidden"), { status: 403 })), false);
  assert.equal(isRateLimitError(new Error("boom")), false);
  assert.equal(isRateLimitError(Object.assign(new Error("not found"), { status: 404 })), false);
});

await test("getFullThread: 429 twice then succeeds — thread kept, no error counted", async () => {
  const upsertCalls: UpsertArgs[] = [];
  let calls = 0;
  const deps = {
    listThreadIds: fakeListThreadIds(["A"], undefined),
    getFullThread: async (_threadId: string, _account: string): Promise<FullMessage[]> => {
      calls++;
      if (calls <= 2) throw rateLimitError();
      return threadA;
    },
    upsert: async (args: UpsertArgs) => { upsertCalls.push(args); return { leadId: "L1", created: true, added: 1, matchedBy: "new" as const }; },
    sleep: noopSleep,
  };
  const r = await ingestGmailPage({ account: acct, query: "q", dryRun: true, origin: "gmail_import" }, deps);
  assert.equal(calls, 3);
  assert.equal(r.kept, 1);
  assert.equal(r.errors, 0);
});

await test("getFullThread: always 429 — errors === 1 after exactly 4 calls", async () => {
  let calls = 0;
  const deps = {
    listThreadIds: fakeListThreadIds(["A"], undefined),
    getFullThread: async (_threadId: string, _account: string): Promise<FullMessage[]> => {
      calls++;
      throw rateLimitError();
    },
    upsert: async (_args: UpsertArgs) => { throw new Error("must not be called"); },
    sleep: noopSleep,
  };
  const r = await ingestGmailPage({ account: acct, query: "q", dryRun: true, origin: "gmail_import" }, deps);
  assert.equal(calls, 4);
  assert.equal(r.errors, 1);
  assert.equal(r.kept, 0);
});

await test("getFullThread: a non-rate-limit throw is not retried (1 call, errors === 1)", async () => {
  let calls = 0;
  const deps = {
    listThreadIds: fakeListThreadIds(["A"], undefined),
    getFullThread: async (_threadId: string, _account: string): Promise<FullMessage[]> => {
      calls++;
      throw new Error("boom");
    },
    upsert: async (_args: UpsertArgs) => { throw new Error("must not be called"); },
    sleep: noopSleep,
  };
  const r = await ingestGmailPage({ account: acct, query: "q", dryRun: true, origin: "gmail_import" }, deps);
  assert.equal(calls, 1);
  assert.equal(r.errors, 1);
});

await test("listThreadIds throwing 429 twice: GmailRateLimitError propagates out of ingestGmailPage", async () => {
  let calls = 0;
  const deps = {
    listThreadIds: async (_account: string, _q: string, _pageToken?: string) => {
      calls++;
      throw rateLimitError();
    },
    getFullThread: fakeGetFullThread({}),
    upsert: async (_args: UpsertArgs) => { throw new Error("must not be called"); },
    sleep: noopSleep,
  };
  await assert.rejects(
    () => ingestGmailPage({ account: acct, query: "q", dryRun: true, origin: "gmail_import" }, deps),
    (e: unknown) => e instanceof GmailRateLimitError && e.retryAfterMs === 60_000
  );
  assert.equal(calls, 2);
});

await test("listThreadIds: 429 then a plain Error — the plain Error propagates, not GmailRateLimitError", async () => {
  let calls = 0;
  const plainError = new Error("boom, not a rate limit");
  const deps = {
    listThreadIds: async (_account: string, _q: string, _pageToken?: string) => {
      calls++;
      if (calls === 1) throw rateLimitError();
      throw plainError;
    },
    getFullThread: fakeGetFullThread({}),
    upsert: async (_args: UpsertArgs) => { throw new Error("must not be called"); },
    sleep: noopSleep,
  };
  await assert.rejects(
    () => ingestGmailPage({ account: acct, query: "q", dryRun: true, origin: "gmail_import" }, deps),
    (e: unknown) => e === plainError
  );
  assert.equal(calls, 2);
});

console.log(`\n${passed} passed, ${failed} failed`); process.exit(failed ? 1 : 0);
})();
