import { strict as assert } from "node:assert";
import { blogRobots, isSitemapPost, CTA_COPY } from "./beacon-flags";

let passed = 0, failed = 0;
function test(name: string, fn: () => void) {
  try { fn(); passed++; console.log(`  ok - ${name}`); }
  catch (e) { failed++; console.error(`  FAIL - ${name}`, e); }
}

test("noindex post → index:false, follow:true", () => {
  assert.deepEqual(blogRobots({ noindex: true }), { index: false, follow: true });
});
test("unflagged post → index:true, follow:true", () => {
  assert.deepEqual(blogRobots({}), { index: true, follow: true });
});
test("noindex:false (restored) → index:true", () => {
  assert.deepEqual(blogRobots({ noindex: false }), { index: true, follow: true });
});
test("published + noindex is not in the sitemap", () => {
  assert.equal(isSitemapPost({ status: "published", noindex: true }), false);
});
test("published, no flag is in the sitemap", () => {
  assert.equal(isSitemapPost({ status: "published" }), true);
});
test("draft is not in the sitemap", () => {
  assert.equal(isSitemapPost({ status: "draft" }), false);
});
test("voice-tutor CTA links to the product page", () => {
  assert.equal(CTA_COPY["voice-tutor"].href, "/products/voice-tutor");
});
test("academy CTA links to the product page", () => {
  assert.equal(CTA_COPY.academy.href, "/products/academy");
});
test("no CTA copy makes a pricing claim", () => {
  for (const [key, copy] of Object.entries(CTA_COPY)) {
    for (const text of [copy.heading, copy.body, copy.button]) {
      assert.doesNotMatch(text, /\$|\bprice\b/i, `${key}: ${text}`);
    }
  }
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed) process.exit(1);
