import assert from "node:assert/strict";
import { readTriage, triageItem, triageUser, type TriageInput } from "./triage";

const IN: TriageInput = { subject: "Math", course: "Math 30-1", questionText: "Evaluate log.", hasImages: false, written: "Use the laws." };
const reply = (value: unknown) => ({ ok: true as const, value, cost: 0.01, model: "m", ms: 1, fellBack: false });

(async () => {
  assert.deepEqual(readTriage({ animate: false, reason: "  Three lines  of algebra. " }), { animate: false, reason: "Three lines of algebra." });
  assert.match(readTriage({ animate: "no", reason: "x" }) as string, /not \{ animate, reason \}/);
  assert.match(readTriage({ animate: false, reason: "" }) as string, /empty/);
  assert.match(readTriage({ animate: false, reason: "x".repeat(300) }) as string, /longer/);
  assert.match(readTriage({ animate: false, reason: "The model found nothing to draw." }) as string, /how the decision was made/);
  assert.match(triageUser(IN, "none"), /already been decided/);
  assert.ok(!/already been decided/.test(triageUser(IN)));

  const yes = await triageItem(IN, { model: async () => reply({ animate: true, reason: "The board would show the arm turning." }) });
  assert.ok(yes.ok && yes.animate && yes.cost === 0.01);
  // a refused reason is asked for once more
  let n = 0;
  const retried = await triageItem(IN, { model: async (c) => (n++ === 0 ? reply({ animate: false, reason: "AI decided." }) : (assert.match(c.user, /refused/), reply({ animate: false, reason: "Only algebra steps." }))) });
  assert.ok(retried.ok && !retried.animate && retried.reason === "Only algebra steps." && retried.cost === 0.02);
  const bad = await triageItem(IN, { model: async () => reply({ animate: false, reason: "" }) });
  assert.ok(!bad.ok && /empty/.test(bad.error));
  // a decision already made stays "no" whatever the model says
  const forced = await triageItem(IN, { model: async () => reply({ animate: true, reason: "Only algebra steps." }) }, "none");
  assert.ok(forced.ok && forced.animate === false);
  console.log("animated/triage.test.ts: ok");
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
