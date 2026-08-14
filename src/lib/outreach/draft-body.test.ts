import assert from "node:assert/strict";
import { test } from "node:test";
import { applyDemoLink, bodyToHtml, demoLinkFor } from "./draft-body";

test("demoLinkFor builds the per-lead url and tolerates a trailing slash", () => {
  assert.equal(demoLinkFor("https://www.evelynlearning.com", "abc123"), "https://www.evelynlearning.com/d/abc123");
  assert.equal(demoLinkFor("https://www.evelynlearning.com/", "abc123"), "https://www.evelynlearning.com/d/abc123");
  assert.equal(demoLinkFor("https://www.evelynlearning.com", undefined), null);
});

test("applyDemoLink substitutes the placeholder", () => {
  const body = "Hi Krista,\n\nHappy to show you a walkthrough:\n\n[DEMO_LINK]\n\nBest,\nPraveen";
  const out = applyDemoLink(body, "https://www.evelynlearning.com/d/abc123");
  assert.ok(!out.includes("[DEMO_LINK]"));
  assert.ok(out.includes("https://www.evelynlearning.com/d/abc123"));
});

test("applyDemoLink drops the placeholder line when there is no link", () => {
  // Better an email with no link than one advertising "[DEMO_LINK]".
  const body = "Hi,\n\nA walkthrough:\n\n[DEMO_LINK]\n\nBest,\nPraveen";
  const out = applyDemoLink(body, null);
  assert.ok(!out.includes("[DEMO_LINK]"));
  assert.ok(!/\n{3,}/.test(out), "collapses the gap the token left behind");
  assert.ok(out.includes("Best,\nPraveen"));
});

test("applyDemoLink leaves a body without the token untouched", () => {
  const body = "Hi,\n\nNo placeholder here.";
  assert.equal(applyDemoLink(body, "https://x/d/1"), body);
});

test("bodyToHtml turns blank-line blocks into paragraphs and single newlines into <br>", () => {
  const html = bodyToHtml("Para one.\n\nPara two.\nSign-off line");
  assert.ok(html.includes("<p>Para one.</p>"));
  assert.ok(html.includes("<p>Para two.<br>Sign-off line</p>"));
});

test("bodyToHtml linkifies bare urls so the demo link is clickable", () => {
  const html = bodyToHtml("See:\n\nhttps://www.evelynlearning.com/d/abc123\n\nBest");
  assert.ok(html.includes('<a href="https://www.evelynlearning.com/d/abc123">'));
});

test("bodyToHtml escapes markup in the body before linkifying", () => {
  // The body is LLM-written and lands in an outbound email; a stray angle
  // bracket must not become live markup.
  const html = bodyToHtml('5 < 6 & "quoted" <script>alert(1)</script>');
  assert.ok(!html.includes("<script>"));
  assert.ok(html.includes("&lt;script&gt;"));
  assert.ok(html.includes("5 &lt; 6 &amp;"));
});

test("bodyToHtml does not swallow a trailing period into the link", () => {
  const html = bodyToHtml("Visit https://example.com/d/x1. Thanks");
  assert.ok(html.includes('<a href="https://example.com/d/x1">'), html);
});
