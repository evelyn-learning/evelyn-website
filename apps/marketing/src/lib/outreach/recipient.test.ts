import { strict as assert } from "node:assert";
import {
  resolveRecipient,
  applyGenericGreeting,
  routingLineFor,
  type RecipientLead,
} from "./recipient";

let passed = 0, failed = 0;
async function test(name: string, fn: () => void | Promise<void>) {
  try { await fn(); passed++; console.log(`  ok - ${name}`); }
  catch (e) { failed++; console.error(`  FAIL - ${name}`, e); }
}

const lead = (over: Partial<RecipientLead> = {}): RecipientLead => ({
  decisionMaker: { name: "Martin Chen", title: "Director of Nursing" },
  ...over,
});

const PITCH = [
  "Riverside's ADN cohort caught my eye — 240 students per intake is exactly",
  "the scale where drilling weak areas one-to-one stops being possible.",
  "",
  "Best,",
  "Praveen",
  "Evelyn Learning",
].join("\n");

(async () => {
  console.log("recipient");

  // --- resolveRecipient ---

  await test("the decision-maker's own email wins", () => {
    const r = resolveRecipient(lead({
      decisionMaker: { name: "Martin Chen", email: "mchen@riverside.edu" },
      orgEmail: "info@riverside.edu",
    }));
    assert.deepEqual(r, { email: "mchen@riverside.edu", isGeneric: false });
  });

  await test("orgEmail is the fallback and is flagged generic", () => {
    const r = resolveRecipient(lead({ orgEmail: "info@riverside.edu" }));
    assert.deepEqual(r, { email: "info@riverside.edu", isGeneric: true });
  });

  await test("neither address resolves to null, not generic", () => {
    assert.deepEqual(resolveRecipient(lead()), { email: null, isGeneric: false });
  });

  await test("a whitespace-only email is treated as absent", () => {
    const r = resolveRecipient(lead({
      decisionMaker: { name: "Martin Chen", email: "   " },
      orgEmail: "info@riverside.edu",
    }));
    assert.deepEqual(r, { email: "info@riverside.edu", isGeneric: true });
  });

  await test("addresses are trimmed", () => {
    const r = resolveRecipient(lead({ orgEmail: "  info@riverside.edu \n" }));
    assert.equal(r.email, "info@riverside.edu");
  });

  await test("a null decisionMaker is tolerated", () => {
    const r = resolveRecipient({ decisionMaker: null, orgEmail: "info@x.edu" });
    assert.deepEqual(r, { email: "info@x.edu", isGeneric: true });
  });

  // --- routingLineFor ---

  await test("the routing line names person and title", () => {
    assert.equal(
      routingLineFor({ name: "Martin Chen", title: "Director of Nursing" }),
      "I'm hoping to reach Martin Chen, your Director of Nursing — if that's not the right person, I'd be grateful for a pointer."
    );
  });

  await test("the routing line drops the title clause when there is none", () => {
    assert.equal(
      routingLineFor({ name: "Martin Chen" }),
      "I'm hoping to reach Martin Chen — if that's not the right person, I'd be grateful for a pointer."
    );
  });

  await test("no name means no routing line", () => {
    assert.equal(routingLineFor({ title: "Director of Nursing" }), null);
  });

  // --- applyGenericGreeting ---

  await test("a personal salutation becomes a generic one", () => {
    const out = applyGenericGreeting(`Hi Martin,\n\n${PITCH}`, { name: "Martin Chen" });
    assert.equal(out.split("\n")[0], "Hello,");
    assert.equal(/Hi Martin/.test(out), false);
  });

  await test("the routing line lands directly under the greeting", () => {
    const out = applyGenericGreeting(`Hi Martin,\n\n${PITCH}`, {
      name: "Martin Chen", title: "Director of Nursing",
    });
    const lines = out.split("\n");
    assert.equal(lines[0], "Hello,");
    assert.equal(lines[1], "");
    assert.equal(
      lines[2],
      "I'm hoping to reach Martin Chen, your Director of Nursing — if that's not the right person, I'd be grateful for a pointer."
    );
  });

  await test("the pitch and sign-off survive intact", () => {
    const out = applyGenericGreeting(`Hi Martin,\n\n${PITCH}`, { name: "Martin Chen" });
    assert.equal(out.includes("240 students per intake"), true);
    assert.equal(out.endsWith("Best,\nPraveen\nEvelyn Learning"), true);
  });

  await test("Dear/Hello/Hey salutations are all replaced", () => {
    for (const salutation of ["Dear Dr. Chen,", "Hello Martin,", "Hey Martin,", "Hi there,"]) {
      const out = applyGenericGreeting(`${salutation}\n\n${PITCH}`, {});
      assert.equal(out.split("\n")[0], "Hello,", salutation);
      assert.equal(out.includes(salutation), false, salutation);
    }
  });

  await test("a body with no salutation gets one rather than opening mid-pitch", () => {
    const out = applyGenericGreeting(PITCH, {});
    assert.equal(out.split("\n")[0], "Hello,");
    assert.equal(out.includes("240 students per intake"), true);
  });

  await test("a first line that merely starts with a greeting word is not eaten", () => {
    // "Hi" opens a real sentence here — no comma, well over the length cut.
    const body = "Hi — I'm writing because your spring cohort intake looks like exactly the scale we built for.";
    const out = applyGenericGreeting(body, {});
    assert.equal(out.includes("your spring cohort intake looks like exactly the scale we built for."), true);
    assert.equal(out.split("\n")[0], "Hello,");
  });

  await test("no routing line when the body already names the person", () => {
    const body = `Hi Martin,\n\nMartin, your ADN cohort caught my eye.\n\nBest,\nPraveen`;
    const out = applyGenericGreeting(body, { name: "Martin Chen" });
    assert.equal(out.includes("I'm hoping to reach"), false);
    assert.equal(out.split("\n")[0], "Hello,");
  });

  await test("first-name-only mentions count as naming the person", () => {
    const body = `Hi Martin,\n\nI saw the note Martin posted about NCLEX pass rates.\n\nBest,\nPraveen`;
    const out = applyGenericGreeting(body, { name: "Martin Chen" });
    assert.equal(out.includes("I'm hoping to reach"), false);
  });

  await test("no name on file means greeting-only, no routing line", () => {
    const out = applyGenericGreeting(`Hi there,\n\n${PITCH}`, {});
    assert.equal(out.split("\n")[0], "Hello,");
    assert.equal(out.includes("I'm hoping to reach"), false);
  });

  await test("running it twice changes nothing (idempotent)", () => {
    const once = applyGenericGreeting(`Hi Martin,\n\n${PITCH}`, {
      name: "Martin Chen", title: "Director of Nursing",
    });
    const twice = applyGenericGreeting(once, {
      name: "Martin Chen", title: "Director of Nursing",
    });
    assert.equal(twice, once);
  });

  await test("CRLF bodies are normalized rather than doubled up", () => {
    const out = applyGenericGreeting("Hi Martin,\r\n\r\nOne line.\r\n\r\nBest,\r\nPraveen", {});
    assert.equal(out.includes("\r"), false);
    assert.equal(out, "Hello,\n\nOne line.\n\nBest,\nPraveen");
  });

  await test("no more than one blank line ever appears in a row", () => {
    const out = applyGenericGreeting(`Hi Martin,\n\n\n\n${PITCH}`, { name: "Martin Chen" });
    assert.equal(/\n{3,}/.test(out), false);
  });

  await test("an empty body is returned untouched", () => {
    assert.equal(applyGenericGreeting("", { name: "Martin Chen" }), "");
    assert.equal(applyGenericGreeting("   \n\n  ", { name: "Martin Chen" }), "   \n\n  ");
  });

  await test("the demo link inside the body is preserved", () => {
    const body = `Hi Martin,\n\nWorth a look:\n\nhttps://evelynlearning.com/d/abc123\n\nBest,\nPraveen`;
    const out = applyGenericGreeting(body, { name: "Martin Chen" });
    assert.equal(out.includes("https://evelynlearning.com/d/abc123"), true);
  });

  console.log(`\n${passed} passed, ${failed} failed`);
  process.exit(failed > 0 ? 1 : 0);
})();
