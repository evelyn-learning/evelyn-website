// Animated solutions: builds one self-contained solution.html from an item source folder
// (spec.json, figure.svg, optional board.js, optional timing.json). Inline CSS, JS and SVG; the only files beside
// the page are audio/step-N.mp3. See AUTHORING.md for the source format.
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { validateSpec, validateTiming, type Box, type BoxKind, type Spec, type Timing } from "./spec";

/**
 * Where the files beside this module (player.js, player.css, AUTHORING.md) may be: beside the module when it runs
 * from source (tsx scripts, tests), else the source tree under the working directory. The bundled Next server has
 * no file beside its compiled chunk, and its import.meta.url may not be a file address at all, but it runs with
 * the app's source tree at its working directory.
 */
export function assetDirs(cwd: string = process.cwd()): string[] {
  const dirs: string[] = [];
  try {
    dirs.push(dirname(fileURLToPath(import.meta.url)));
  } catch {
    // not a file address (bundled)
  }
  dirs.push(join(cwd, "src", "lib", "keystone", "animated"), join(cwd, "apps", "marketing", "src", "lib", "keystone", "animated"));
  return dirs;
}

/** The text of a file that ships beside this module, from the first folder that has it. */
export function readBeside(name: string, dirs: string[] = assetDirs()): string {
  for (const d of dirs) {
    const p = join(d, name);
    if (existsSync(p)) return readFileSync(p, "utf8");
  }
  throw new Error(`${name} not found (looked in ${dirs.join(", ")})`);
}

const FOOTER = "© 2026 Evelyn Learning";
const BOX_ORDER: readonly BoxKind[] = ["selfcheck", "sanity", "slip", "explore", "tryone", "takeaway", "diploma"];
const EQ_HINT = `<p class="es-small">Tap an equation line to see the operation behind it.</p>`;

/** Text → HTML text. */
export const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/**
 * The single letters this item marks as variables anywhere in its spec or figure (<var>x</var>, or class es-v in
 * the figure). Captions and the transcript are plain text, so their variables came out upright while the step
 * bodies had them italic (Castle Rock's reviewer on 304631, 2026-11-25: "the n's should all be italic").
 * "a", "A" and "I" are left out: in a caption they are almost always words.
 */
export function captionVars(spec: Spec, figureSvg = ""): string[] {
  const text = JSON.stringify(spec) + figureSvg;
  const found = new Set<string>();
  for (const m of text.matchAll(/<var>([A-Za-z])<\/var>/g)) found.add(m[1]);
  for (const m of text.matchAll(/class=\\?"es-v\\?"[^>]*>([A-Za-z])</g)) found.add(m[1]);
  for (const w of ["a", "A", "I"]) found.delete(w);
  return [...found].sort();
}

/** Letters that are also unit symbols: after a number and a space ("14 m") they are the unit, not the variable. */
const UNIT_LETTERS = new Set(["m", "s", "g", "L", "N", "J", "V", "W", "C", "K", "h"]);

/** A caption as HTML: escaped, with the item's variable letters italic wherever they stand alone ("x = 3", "2n", "x-axis"). */
export function captionHtml(say: string, vars: string[]): string {
  const safe = esc(say);
  if (!vars.length) return safe;
  const re = new RegExp(`(?<![A-Za-z&;'’])(${vars.join("|")})(?![A-Za-z]|\\.[A-Za-z])`, "g");
  return safe.replace(re, (m, v: string, at: number) => (UNIT_LETTERS.has(v) && /\d\s$/.test(safe.slice(0, at)) ? m : `<var>${v}</var>`));
}
const attr = (s: string) => esc(s).replace(/"/g, "&quot;");
/** JSON that is safe inside a <script> element. */
const jsonForScript = (v: unknown) => JSON.stringify(v).replace(/</g, "\\u003c").replace(/>/g, "\\u003e").replace(/&/g, "\\u0026").replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
/** Inline script text cannot contain a closing script tag. */
const scriptSafe = (js: string) => js.replace(/<\/(script)/gi, "<\\/$1");

/** figure.svg ready for inlining: prolog, comments and namespace declarations (which carry an address) removed. */
export function inlineSvg(svgText: string): string {
  return svgText
    .replace(/<\?xml[\s\S]*?\?>/g, "")
    .replace(/<!DOCTYPE[^>]*>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/\sxmlns(?::[a-z]+)?\s*=\s*(?:"[^"]*"|'[^']*')/gi, "")
    .replace(/\sxlink:href\s*=/gi, " href=")
    .trim();
}

function boxHtml(b: Box): string {
  const choices = b.choices
    ? `<div class="es-choices" data-answer="${attr(b.answer ?? "")}"${b.why ? ` data-why="${attr(b.why)}"` : ""}>${b.choices.map((c) => `<button type="button">${esc(c)}</button>`).join("")}</div><p class="es-fb" aria-live="polite"></p>`
    : "";
  const inner = b.html.includes("{{choices}}") ? b.html.replace("{{choices}}", choices) : b.html + choices;
  return `<div class="es-box es-box-${b.kind}"><h3>${esc(b.title)}</h3>${inner}</div>`;
}

export interface PageInput {
  spec: Spec;
  svg: string;
  boardJs?: string;
  timing?: Timing;
  /** Fallback version number when the page's address has no /vN/ in it. */
  version?: number;
  /** player.js and player.css (read from beside this module by default). */
  playerJs?: string;
  playerCss?: string;
}

/** The page for a valid spec. Pure: no file access when playerJs and playerCss are given. */
export function renderPage(input: PageInput): string {
  const { spec } = input;
  const css = input.playerCss ?? readBeside("player.css");
  const js = (input.playerJs ?? readBeside("player.js")).replace(/^\s*\/\*[\s\S]*?\*\/\s*/, ""); // the authoring notes stay out of the page

  let hinted = false;
  const vars = captionVars(spec, input.svg);
  const stepsHtml = spec.steps
    .map((st, k) => {
      const before = spec.boxes.filter((b) => b.beforeStep === k + 1).map(boxHtml).join("");
      let body = st.body;
      if (!hinted && /data-how\s*=/.test(body)) {
        hinted = true;
        body += EQ_HINT;
      }
      const caption = st.lines.map((l) => `<span>${captionHtml(l.say, vars)}</span>`).join(" ");
      return (
        `<li class="es-step" data-step="${k}"><div class="es-stephead"><button type="button" class="es-chev" aria-label="Show or hide step ${k + 1}">▼</button>` +
        `<h3>${k + 1}. ${esc(st.title)}</h3><button type="button" class="es-listen" aria-label="Listen from step ${k + 1}">▶ Listen</button></div>` +
        `<div class="es-body"><p class="es-caption">${caption}</p>${before}${body}</div></li>`
      );
    })
    .join("\n");

  const after = BOX_ORDER.flatMap((kind) => spec.boxes.filter((b) => b.kind === kind && b.beforeStep === undefined)).map(boxHtml).join("\n");
  const transcript = spec.steps.map((st, k) => `<p><strong>Step ${k + 1}.</strong> ${st.lines.map((l) => captionHtml(l.say, vars)).join(" ")}</p>`).join("");
  const buttons = (spec.board.buttons ?? []).map((b, i) => `<button type="button" class="es-ghost" data-button="${i}">${esc(b.label)}</button>`).join("");
  const answer = spec.answer.letter ? `<strong>Answer: ${esc(spec.answer.letter)}.</strong> ${spec.answer.text}` : `<strong>Answer:</strong> ${spec.answer.text}`;
  const question = spec.question.trim() ? `<div class="es-question"><div class="es-fold" data-title="Show the question">${spec.question}</div></div>` : "";

  const data = {
    version: input.version ?? 0,
    steps: spec.steps.map((st) => ({ title: st.title, lines: st.lines.map((l) => ({ say: l.say, ...(captionHtml(l.say, vars) !== esc(l.say) ? { html: captionHtml(l.say, vars) } : {}), len: (l.speak ?? l.say).length, cues: l.cues ?? [] })) })),
    board: spec.board,
    practice: spec.practice,
    timing: input.timing ?? null,
  };

  return `<!DOCTYPE html>
<html lang="en-CA">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Solution: Item ${esc(spec.itemId)}</title>
<style>
html, body { margin: 0; padding: 0; background-color: #ffffff; }
${css.trim()}
</style>
</head>
<body>
<div class="ai-solution" id="es-root">
<h2>${esc(spec.title)}</h2>
<p class="es-small">${esc(spec.course)} · Item ${esc(spec.itemId)}</p>
<p class="es-answer" id="es-answer">${answer}</p>
${question}
<div class="es-bar"><button type="button" id="es-play">▶ Play the explanation</button><button type="button" id="es-pause" class="es-ghost es-pause" disabled>Pause</button><button type="button" id="es-transcript-btn" class="es-ghost" aria-expanded="false">Transcript</button></div>
<div class="es-transcript" id="es-transcript">${transcript}</div>
<div class="es-main">
<div class="es-player">
<div class="es-board" id="es-board">
${inlineSvg(input.svg)}
<div class="es-ink" id="es-ink"></div>
</div>
<div class="es-live" id="es-live" aria-live="off"><span class="es-live-head" id="es-live-head"></span><span class="es-live-text" id="es-live-text"></span></div>
<div class="es-boardbar">${buttons}<button type="button" class="es-ghost" id="es-reset">Reset board</button></div>
<p class="es-readout" id="es-readout">${esc(spec.board.readoutFresh)}</p>
</div>
<div class="es-content">
<ol class="es-steps" id="es-steps">
${stepsHtml}
</ol>
${after}
</div>
</div>
<div class="es-footer">${FOOTER}</div>
</div>
<script type="application/json" id="es-spec">${jsonForScript(data)}</script>
<script>
${scriptSafe(js.trim())}
</script>
${input.boardJs && input.boardJs.trim() ? `<script>\n${scriptSafe(input.boardJs.trim())}\n</script>\n` : ""}<script>esBoard.boot();</script>
</body>
</html>
`;
}

export interface BuildResult {
  html: string;
  warnings: string[];
  spec: Spec;
}

/** An item source folder read from disk. */
export function readSource(srcDir: string): { spec: unknown; svg: string; boardJs?: string; timing?: unknown } {
  const need = (f: string) => {
    const p = join(srcDir, f);
    if (!existsSync(p)) throw new Error(`${f} is missing in ${srcDir}`);
    return readFileSync(p, "utf8");
  };
  let spec: unknown;
  try {
    spec = JSON.parse(need("spec.json"));
  } catch (e) {
    throw new Error(`spec.json: ${(e as Error).message}`);
  }
  const svg = need("figure.svg");
  const boardJs = existsSync(join(srcDir, "board.js")) ? readFileSync(join(srcDir, "board.js"), "utf8") : undefined;
  let timing: unknown;
  if (existsSync(join(srcDir, "timing.json"))) {
    try {
      timing = JSON.parse(readFileSync(join(srcDir, "timing.json"), "utf8"));
    } catch (e) {
      throw new Error(`timing.json: ${(e as Error).message}`);
    }
  }
  return { spec, svg, boardJs, timing };
}

/**
 * Builds the page for the item in `srcDir`. Throws (listing every problem) when the spec is not valid.
 * Warnings: a missing clip, missing or unusable timing (the player then times the captions by their length).
 */
export function buildItem(srcDir: string, opts: { version?: number } = {}): BuildResult {
  const src = readSource(srcDir);
  const errs = validateSpec(src.spec, src.svg, src.boardJs);
  if (errs.length) throw new Error(`spec not valid (${errs.length}):\n- ${errs.join("\n- ")}`);
  const spec = src.spec as Spec;
  const warnings: string[] = [];
  let timing: Timing | undefined;
  if (src.timing === undefined) warnings.push("no timing.json: captions are timed by their length until the clips are recorded");
  else {
    const terrs = validateTiming(src.timing, spec);
    if (terrs.length) warnings.push(...terrs.map((t) => `${t} (timing ignored)`));
    else timing = src.timing as Timing;
  }
  spec.steps.forEach((_, k) => {
    if (!existsSync(join(srcDir, "audio", `step-${k + 1}.mp3`))) warnings.push(`audio/step-${k + 1}.mp3 is missing: that step plays silently`);
  });
  return { html: renderPage({ spec, svg: src.svg, boardJs: src.boardJs, timing, version: opts.version }), warnings, spec };
}
