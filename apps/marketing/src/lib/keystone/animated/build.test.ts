// npx tsx src/lib/keystone/animated/build.test.ts
import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { assetDirs, buildItem, inlineSvg, readBeside, renderPage } from "./build";
import { BOARD_JS, SVG, spec } from "./testkit";

const ok = (value: unknown, message: string) => assert.ok(value, message);
const HERE = dirname(fileURLToPath(import.meta.url));

// --- the page ---
const html = renderPage({ spec: spec(), svg: SVG, boardJs: BOARD_JS, version: 3 });
ok(html.startsWith("<!DOCTYPE html>"), "doctype");
ok(html.includes('<div class="ai-solution" id="es-root">'), "wrapper");
ok(html.includes("<strong>Answer: B.</strong> 12 N"), "answer bar with the letter");
ok(html.indexOf('id="es-answer"') < html.indexOf('id="es-play"'), "the answer comes before the player");
ok(html.includes("© 2026 Evelyn Learning"), "footer");
ok(!/xmlns/.test(html) && !/https?:/.test(html), "no namespace declaration or address survives");
ok(html.includes('<svg viewBox="0 0 240 200">'), "figure inlined");
ok(!html.includes("Mr. Joseph"), "the voice name is not printed");
assert.equal((html.match(/class="es-step"/g) ?? []).length, 3, "three steps");
ok(html.includes("<h3>2. The numbers</h3>"), "step titles numbered");
ok(html.includes("<span>The answer is B. Here&#39;s why.</span>") || html.includes("<span>The answer is B. Here's why.</span>"), "captions are the say text");
ok(!html.includes("option B. Here"), "speak text is not in the page");
ok(html.includes('data-button="0">Push again</button>'), "board button");
const step3 = html.slice(html.indexOf('data-step="2"'));
ok(step3.indexOf('class="es-box es-box-selfcheck"') > 0 && step3.indexOf('class="es-box es-box-selfcheck"') < step3.indexOf("12 N is option"), "the self-check sits at the top of the step it comes before");
const at = (kind: string) => html.indexOf(`class="es-box es-box-${kind}"`);
ok(at("sanity") > 0 && at("sanity") < at("slip") && at("slip") < at("takeaway") && at("takeaway") < at("diploma"), "boxes in house order");
ok(html.includes('<div class="es-choices" data-answer="4 kg">'), "choices carry the answer");
assert.equal((html.match(/Tap an equation line/g) ?? []).length, 1, "the equation hint appears once");
ok(html.includes('data-title="Show the question"'), "the question is in a fold");
ok(!renderPage({ spec: spec({ question: "" }), svg: SVG, boardJs: BOARD_JS }).includes("Show the question"), "no question fold without a question");
ok(!html.includes("esBoard.define({\n *") && !html.includes("---- board.js"), "the authoring comment is stripped from the page");
ok(html.includes("esBoard.boot();") && html.indexOf("esBoard.define({ actions") < html.indexOf("esBoard.boot();"), "board code runs before boot");

// the embedded data
const m = /<script type="application\/json" id="es-spec">([\s\S]*?)<\/script>/.exec(html);
ok(m, "embedded spec");
const data = JSON.parse(m![1]);
assert.equal(data.version, 3, "version");
assert.equal(data.steps.length, 3, "steps embedded");
assert.equal(data.steps[1].lines[0].len, "4 kilograms times 3 meters per second squared is 12 newtons.".length, "len is the length of the voice text");
assert.equal(data.steps[0].lines[0].speak, undefined, "speak not embedded");
assert.equal(data.timing, null, "no timing");
ok(!m![1].includes("<"), "no raw < inside the embedded JSON");

// escaping
const tricky = renderPage({ spec: spec({ title: "a < b & c", steps: spec().steps.map((s, i) => (i === 0 ? { ...s, title: "x </script> y", lines: [{ say: "1 < 2 </script><b>" }] } : s)) }), svg: SVG, boardJs: BOARD_JS + "\n// </script>" });
ok(tricky.includes("<h2>a &lt; b &amp; c</h2>"), "title escaped");
ok(tricky.includes("<span>1 &lt; 2 &lt;/script&gt;&lt;b&gt;</span>"), "say escaped");
assert.equal((tricky.match(/<\/script>/g) ?? []).length, 4, "only the four real script ends");
ok(inlineSvg(`<?xml version="1.0"?><!-- c --><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><use xlink:href="#a"/></svg>`) === `<svg><use href="#a"/></svg>`, "inlineSvg");

// player.js stays ES5 and free of anything the packaging rules forbid
const js = readFileSync(join(HERE, "player.js"), "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
ok(!/=>|\bconst\b|\blet\b|`|\bclass\s+\w+\s*(?:\{|extends)|\basync\b|\.\.\./.test(js), "player.js is ES5 (no arrow, const, let, template, class, async, spread)");
ok(!/https?:|localStorage|sessionStorage|cookie|fetch\(|XMLHttpRequest/.test(js), "player.js has no address, storage or network call");
const css = readFileSync(join(HERE, "player.css"), "utf8");
const classes = [...css.replace(/\/\*[\s\S]*?\*\//g, "").matchAll(/\.([a-zA-Z][\w-]*)/g)].map((x) => x[1]).filter((c) => !/^\d/.test(c));
assert.deepEqual([...new Set(classes.filter((c) => c !== "ai-solution" && !c.startsWith("es-")))], [], "every class in player.css is es- or ai-solution");
ok(!/@import|@font-face|url\(/.test(css), "player.css loads nothing");

// --- the files beside the module are found from source and from the bundled server ---
{
  ok(assetDirs()[0] === HERE, "from source: beside the module first");
  ok(readBeside("player.css") === css, "player.css read from beside the module");
  // The bundled Next server has nothing beside its compiled chunk: the source tree under the working directory serves.
  const app = join(HERE, "..", "..", "..", "..");
  const fromCwd = assetDirs(app).slice(1);
  ok(fromCwd[0] === HERE, `the app's working directory leads to the same folder (${fromCwd[0]})`);
  ok(readBeside("player.js", ["/nonexistent/.next/server/chunks", ...fromCwd]).includes("esBoard"), "falls back to <cwd>/src/lib/keystone/animated");
  ok(readBeside("AUTHORING.md", ["/nonexistent", ...assetDirs(join(app, "..", "..")).slice(1)]).length > 1000, "and to apps/marketing/src/… from the repository root");
  assert.throws(() => readBeside("player.js", ["/nonexistent/a", "/nonexistent/b"]), /player\.js not found \(looked in \/nonexistent\/a, \/nonexistent\/b\)/, "a clear error names where it looked");
  ok(renderPage({ spec: spec(), svg: SVG }).includes("esBoard.boot();"), "renderPage finds the player without being handed it");
}

// --- buildItem from a folder ---
const dir = mkdtempSync(join(tmpdir(), "es-build-"));
try {
  const src = join(dir, "1001");
  mkdirSync(join(src, "audio"), { recursive: true });
  writeFileSync(join(src, "spec.json"), JSON.stringify(spec()));
  writeFileSync(join(src, "figure.svg"), SVG);
  writeFileSync(join(src, "board.js"), BOARD_JS);
  writeFileSync(join(src, "audio", "step-1.mp3"), "x");
  const built = buildItem(src);
  ok(built.html.includes("es-root"), "built");
  ok(built.warnings.some((w) => /no timing\.json/.test(w)), "warns about missing timing");
  ok(built.warnings.some((w) => /step-2\.mp3 is missing/.test(w)) && !built.warnings.some((w) => /step-1\.mp3/.test(w)), "warns about the missing clips only");
  writeFileSync(join(src, "timing.json"), JSON.stringify({ steps: [{ file: "audio/step-1.mp3", durationMs: 5000, starts: [0, 2000] }, { file: "audio/step-2.mp3", durationMs: 4000, starts: [0] }, { file: "audio/step-3.mp3", durationMs: 3000, starts: [0] }] }));
  const timed = buildItem(src);
  ok(!timed.warnings.some((w) => /timing/.test(w)), "good timing: no timing warning");
  ok(/"timing":\{"steps":\[\{"file":"audio\/step-1\.mp3","durationMs":5000,"starts":\[0,2000\]/.test(timed.html), "timing embedded");
  writeFileSync(join(src, "timing.json"), JSON.stringify({ steps: [] }));
  const mistimed = buildItem(src);
  ok(mistimed.warnings.some((w) => /timing ignored/.test(w)) && mistimed.html.includes('"timing":null'), "timing that does not fit is ignored with a warning");
  writeFileSync(join(src, "spec.json"), JSON.stringify(spec({ title: "" })));
  assert.throws(() => buildItem(src), /spec not valid \(1\):\n- "title" is missing/, "an invalid spec throws with its problems");
  rmSync(join(src, "figure.svg"));
  assert.throws(() => buildItem(src), /figure\.svg is missing/, "a missing file is named");
} finally {
  rmSync(dir, { recursive: true, force: true });
}

console.log("animated/build.test.ts: ok");
