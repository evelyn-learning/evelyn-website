/**
 * GDI showcase: the live-demo buttons mint a fresh demo-engine embed link per
 * click (src/app/showcase/gdi-communications/_lib/mint.ts). Pure checks: the
 * payload the tutor embed expects, a new learner every time, the signature,
 * the URL. Run: npm run test:gdi-mint
 */
import { strict as assert } from "node:assert";
import { createHmac } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { buildGdiEmbedPayload, signEmbedToken, gdiEmbedUrl, GDI_LESSONS, GDI_DEMO_EMBED_BASE } from "../src/app/showcase/gdi-communications/_lib/mint";

let passed = 0, failed = 0;
function test(name: string, fn: () => void) {
  try { fn(); passed++; console.log(`  ok - ${name}`); }
  catch (e) { failed++; console.error(`  FAIL - ${name}`, e); }
}

const b64url = (s: string) => Buffer.from(s).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

test("three lessons, each with a plan id, a teacher persona and a level", () => {
  assert.deepEqual(Object.keys(GDI_LESSONS), ["starter", "advanced", "meeting"]);
  for (const l of Object.values(GDI_LESSONS)) {
    assert.match(l.plan, /^gdi\.demo\.english\./);
    assert.ok(l.teacher.name && l.teacher.voice.voiceId, `${l.key}: teacher`);
    assert.ok(l.level && l.topic && l.title && l.minutes > 0);
  }
});

test("payload carries what the embed reads: bilingual en+ja, voice, languages subject, the plan as curriculum_module, 3 h validity", () => {
  const p = buildGdiEmbedPayload({ lesson: "starter", studentName: "Sato Kenji", nowSec: 1_792_400_000 });
  assert.equal(p.partner_id, "gdi-demo");
  assert.equal(p.student_name, "Sato Kenji");
  assert.equal(p.subject, "languages");
  assert.equal(p.curriculum_module, "gdi.demo.english.experiences.starter.v1");
  assert.equal(p.target_kind, "lessonNode");
  assert.equal(p.input_mode, "voice");
  assert.deepEqual(p.tutor_languages, ["en", "ja"]);
  assert.equal(p.teacher.id, "ryota");
  assert.equal(p.speech_rate, 0.75);
  assert.equal(p.thinking_cue, true);
  assert.equal(p.max_duration_minutes, 30);
  assert.equal(p.iat, 1_792_400_000);
  assert.equal(p.exp - p.iat, 3 * 3600);
});

test("every mint is a NEW learner (a reused id makes the tutor open as a returning student); the name defaults; whitespace and length are tamed", () => {
  const a = buildGdiEmbedPayload({ lesson: "advanced", studentName: "", nowSec: 1_792_400_000 });
  const b = buildGdiEmbedPayload({ lesson: "advanced", studentName: "   ", nowSec: 1_792_400_001 });
  assert.match(a.student_id, /^gdi-showcase-advanced-/);
  assert.notEqual(a.student_id, b.student_id);
  assert.equal(a.student_name, "Demo Learner");
  const long = buildGdiEmbedPayload({ lesson: "meeting", studentName: "  " + "x".repeat(100) + "  ", nowSec: 1 });
  assert.equal(long.student_name.length, 40);
  assert.equal(long.teacher.id, "jameson");
});

test("unknown lesson throws (the route turns this into a 400)", () => {
  assert.throws(() => buildGdiEmbedPayload({ lesson: "nope" as never, studentName: "", nowSec: 1 }), /lesson/);
});

test("HS256 token: header.payload.signature, verifiable with the secret; URL points at the demo engine embed", () => {
  const p = buildGdiEmbedPayload({ lesson: "starter", studentName: "A", nowSec: 1_792_400_000 });
  const token = signEmbedToken(p, "s3cret");
  const [h, body, sig] = token.split(".");
  assert.equal(h, b64url(JSON.stringify({ alg: "HS256", typ: "JWT" })));
  assert.deepEqual(JSON.parse(Buffer.from(body, "base64url").toString()), p);
  const expected = createHmac("sha256", "s3cret").update(`${h}.${body}`).digest("base64url");
  assert.equal(sig, expected);
  assert.equal(gdiEmbedUrl(token), `${GDI_DEMO_EMBED_BASE}?token=${token}`);
  assert.equal(GDI_DEMO_EMBED_BASE, "https://tutor-demo.evelynlearning.com/tutor-portal/embed");
});

test("the live-demo slide is interactive: the deck drops its left/right click zones there (they sat above the buttons and showed a focus bar)", () => {
  const deck = readFileSync(join(__dirname, "../src/app/showcase/gdi-communications/deck.ts"), "utf8");
  assert.match(deck, /id: "live-demo"[^\n]*interactive: true/);
  const Deck = readFileSync(join(__dirname, "../src/components/showcase-deck/Deck.tsx"), "utf8");
  assert.ok(Deck.includes("interactive"), "Deck.tsx honours DeckSlide.interactive");
  const cfg = readFileSync(join(__dirname, "../src/components/showcase-deck/config.ts"), "utf8");
  assert.ok(cfg.includes("interactive?: boolean"));
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed) process.exit(1);
