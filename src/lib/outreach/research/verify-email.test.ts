import { strict as assert } from "node:assert";
import { emailAppearsInText, verifyEmailPublished } from "./verify-email";

let passed = 0, failed = 0;
async function test(name: string, fn: () => void | Promise<void>) {
  try { await fn(); passed++; console.log(`  ok - ${name}`); }
  catch (e) { failed++; console.error(`  FAIL - ${name}`, e); }
}

(async () => {
  await test("plain email found (case-insensitive)", () => {
    assert.ok(emailAppearsInText("dsmith@acme.edu", "Contact: DSmith@Acme.edu for details"));
  });
  await test("obfuscated [at]/[dot] found", () => {
    assert.ok(emailAppearsInText("dsmith@acme.edu", "dsmith [at] acme [dot] edu"));
    assert.ok(emailAppearsInText("dsmith@acme.edu", "dsmith (at) acme (dot) edu"));
    assert.ok(emailAppearsInText("dsmith@acme.edu", "email dsmith at acme dot edu"));
  });
  await test("absent email not found", () => {
    assert.equal(emailAppearsInText("dsmith@acme.edu", "Contact the dean's office at 555-1234"), false);
  });
  await test("similar-but-different email not matched", () => {
    assert.equal(emailAppearsInText("dsmith@acme.edu", "asmith@acme.edu is the contact"), false);
  });
  await test("domain-suffix false positive rejected", () => {
    assert.equal(emailAppearsInText("dsmith@acme.edu", "contact dsmith@acme.education for help"), false);
    assert.equal(emailAppearsInText("dsmith@acme.edu", "dsmith@acme.edu.au is the person"), false);
  });
  await test("email matched when followed by punctuation/space/end", () => {
    assert.ok(emailAppearsInText("dsmith@acme.edu", "email dsmith@acme.edu."));
    assert.ok(emailAppearsInText("dsmith@acme.edu", "dsmith@acme.edu is the contact"));
    assert.ok(emailAppearsInText("dsmith@acme.edu", "dsmith@acme.edu"));
  });

  await test("verifyEmailPublished true when page contains email", async () => {
    const fakeFetch = (async () => new Response("reach Dana at dsmith@acme.edu")) as typeof fetch;
    assert.equal(await verifyEmailPublished("dsmith@acme.edu", "https://acme.edu/staff", fakeFetch), true);
  });
  await test("verifyEmailPublished false when absent", async () => {
    const fakeFetch = (async () => new Response("no contacts here")) as typeof fetch;
    assert.equal(await verifyEmailPublished("dsmith@acme.edu", "https://acme.edu/staff", fakeFetch), false);
  });
  await test("verifyEmailPublished false on fetch error", async () => {
    const fakeFetch = (async () => { throw new Error("ECONNREFUSED"); }) as unknown as typeof fetch;
    assert.equal(await verifyEmailPublished("dsmith@acme.edu", "https://acme.edu/staff", fakeFetch), false);
  });
  await test("verifyEmailPublished false on non-2xx", async () => {
    const fakeFetch = (async () => new Response("gone", { status: 404 })) as typeof fetch;
    assert.equal(await verifyEmailPublished("dsmith@acme.edu", "https://acme.edu/staff", fakeFetch), false);
  });

  console.log(`\n${passed} passed, ${failed} failed`);
  process.exit(failed > 0 ? 1 : 0);
})();
