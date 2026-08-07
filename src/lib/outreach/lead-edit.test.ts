import { strict as assert } from "node:assert";
import { mergeDecisionMakerEdit, type DecisionMakerLike, type DecisionMakerEditInput } from "./lead-edit";

let passed = 0, failed = 0;
async function test(name: string, fn: () => void | Promise<void>) {
  try { await fn(); passed++; console.log(`  ok - ${name}`); }
  catch (e) { failed++; console.error(`  FAIL - ${name}`, e); }
}

const existing = (over: Partial<DecisionMakerLike> = {}): DecisionMakerLike => ({
  name: "Dana Smith",
  title: "Program Director",
  email: "dsmith@acme.edu",
  linkedinUrl: "https://linkedin.com/in/dana",
  emailVerified: false,
  emailSource: "vendor",
  emailProvider: "apollo",
  linkedinSource: "vendor",
  linkedinProvider: "hunter",
  ...over,
});

const incoming = (over: Partial<DecisionMakerEditInput> = {}): DecisionMakerEditInput => ({
  name: "Dana Smith",
  title: "Program Director",
  email: "dsmith@acme.edu",
  linkedinUrl: "https://linkedin.com/in/dana",
  emailVerified: false,
  ...over,
});

(async () => {
  await test("title-only edit preserves all four provenance fields", () => {
    const merged = mergeDecisionMakerEdit(existing(), incoming({ title: "Dean" }));
    assert.equal(merged.title, "Dean");
    assert.equal(merged.emailSource, "vendor");
    assert.equal(merged.emailProvider, "apollo");
    assert.equal(merged.linkedinSource, "vendor");
    assert.equal(merged.linkedinProvider, "hunter");
  });

  await test("changing the email clears emailSource/emailProvider only", () => {
    const merged = mergeDecisionMakerEdit(existing(), incoming({ email: "new@acme.edu" }));
    assert.equal(merged.email, "new@acme.edu");
    assert.equal(merged.emailSource, undefined);
    assert.equal(merged.emailProvider, undefined);
    // linkedin untouched -> its provenance survives
    assert.equal(merged.linkedinSource, "vendor");
    assert.equal(merged.linkedinProvider, "hunter");
  });

  await test("clearing the email (edited to empty) also clears its provenance", () => {
    const merged = mergeDecisionMakerEdit(existing(), incoming({ email: "" }));
    assert.equal(merged.email, "");
    assert.equal(merged.emailSource, undefined);
    assert.equal(merged.emailProvider, undefined);
  });

  await test("changing linkedinUrl clears linkedinSource/linkedinProvider only", () => {
    const merged = mergeDecisionMakerEdit(
      existing(),
      incoming({ linkedinUrl: "https://linkedin.com/in/dana-2" })
    );
    assert.equal(merged.linkedinUrl, "https://linkedin.com/in/dana-2");
    assert.equal(merged.linkedinSource, undefined);
    assert.equal(merged.linkedinProvider, undefined);
    // email untouched -> its provenance survives
    assert.equal(merged.emailSource, "vendor");
    assert.equal(merged.emailProvider, "apollo");
  });

  await test("clearing linkedinUrl (edited to empty) also clears its provenance", () => {
    const merged = mergeDecisionMakerEdit(existing(), incoming({ linkedinUrl: "" }));
    assert.equal(merged.linkedinUrl, "");
    assert.equal(merged.linkedinSource, undefined);
    assert.equal(merged.linkedinProvider, undefined);
  });

  await test("existing undefined email vs incoming empty string is not treated as a change", () => {
    const merged = mergeDecisionMakerEdit(
      existing({ email: undefined, emailSource: undefined, emailProvider: undefined }),
      incoming({ email: "" })
    );
    assert.equal(merged.email, "");
    assert.equal(merged.emailSource, undefined);
  });

  await test("emailVerified always takes the incoming (client-sent) value", () => {
    const merged = mergeDecisionMakerEdit(existing({ emailVerified: false }), incoming({ emailVerified: true }));
    assert.equal(merged.emailVerified, true);
  });

  console.log(`\n${passed} passed, ${failed} failed`);
  process.exit(failed > 0 ? 1 : 0);
})();
