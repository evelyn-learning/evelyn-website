import assert from "node:assert/strict";
import { composeSuggestion } from "./outbox";

const forbidden = /\b(AI|model|GPT|Claude|OpenAI|Gemini|DeepSeek|Anthropic)\b/i;
const ids = (n: number) => Array.from({ length: n }, (_, i) => String(1000 + i));

{
  const r = composeSuggestion("batch_received", { batchName: "Week 3", count: 25 });
  assert.deepEqual(r.to, ["julie", "vance"]);
  assert.equal(r.subject, "Received: 25 items (Week 3)");
  assert.match(r.bodyMd, /arrived/);
  assert.match(r.bodyMd, /Keystone before solutions are written/);
}
{
  const r = composeSuggestion("items_need_data", { itemIds: ["1001", "1002"] });
  assert.deepEqual(r.to, ["vance", "julie"]);
  assert.equal(r.subject, "2 items need their question data re-sent");
  assert.match(r.bodyMd, /1001, 1002/);
  assert.match(r.bodyMd, /Item data needed/);
  assert.match(r.bodyMd, /automatically/);
  assert.equal(composeSuggestion("items_need_data", { itemIds: ["1001"] }).subject, "1 item needs its question data re-sent");
}
{
  const r = composeSuggestion("keys_queried", { itemIds: ["1001", "1002", "1003"] });
  assert.deepEqual(r.to, ["julie"]);
  assert.equal(r.subject, "3 answer keys to check");
  assert.match(r.bodyMd, /Key query/);
  assert.equal(composeSuggestion("keys_queried", { itemIds: ["1001"] }).subject, "1 answer key to check");
}
{
  const r = composeSuggestion("course_missing", { itemIds: ["1001", "1002"] });
  assert.deepEqual(r.to, ["vance", "julie"]);
  assert.equal(r.subject, "2 items have no course in the spreadsheet");
  assert.match(r.bodyMd, /spreadsheet only/);
  assert.equal(composeSuggestion("course_missing", { itemIds: ["1001"] }).subject, "1 item has no course in the spreadsheet");
}
{
  const r = composeSuggestion("batch_in_review", { batchName: "Week 3", count: 25 });
  assert.deepEqual(r.to, ["julie", "markus"]);
  assert.equal(r.subject, "25 solutions ready for review (Week 3)");
  assert.equal(composeSuggestion("batch_in_review", { batchName: "W", count: 1 }).subject, "1 solution ready for review (W)");
  assert.doesNotMatch(r.bodyMd, /checked/i);
}
{
  const r = composeSuggestion("sample_requested", { kinds: ["Hot spot", "Match"] });
  assert.deepEqual(r.to, ["vance"]);
  assert.equal(r.subject, "Could you send one sample export of each of these question types?");
  assert.match(r.bodyMd, /Hot spot, Match/);
  assert.match(r.bodyMd, /QTI export/);
}
// list wrapping
{
  const short = composeSuggestion("keys_queried", { itemIds: ids(12) }).bodyMd;
  assert.ok(!/^- /m.test(short));
  assert.match(short, new RegExp(ids(12).join(", ")));
  const long = composeSuggestion("keys_queried", { itemIds: ids(13) }).bodyMd;
  assert.equal(long.split("\n").filter((l) => l.startsWith("- ")).length, 13);
}
// no forbidden words anywhere
for (const r of [
  composeSuggestion("batch_received", { batchName: "B", count: 1 }),
  composeSuggestion("items_need_data", { itemIds: ids(2) }),
  composeSuggestion("keys_queried", { itemIds: ids(20) }),
  composeSuggestion("course_missing", { itemIds: ids(1) }),
  composeSuggestion("batch_in_review", { batchName: "B", count: 3 }),
  composeSuggestion("sample_requested", { kinds: ["x"] }),
]) assert.doesNotMatch(r.bodyMd, forbidden);
for (const k of ["items_need_data", "keys_queried", "course_missing"] as const) assert.throws(() => composeSuggestion(k, { itemIds: [] }), /no items to mention/);
console.log("outbox.test ok");
