// npx tsx src/lib/keystone/animated/caption.test.ts
// Captions and the transcript show the item's variables italic, as the step bodies do (reviewer rule, 304631).
import assert from "node:assert/strict";
import { captionHtml, captionVars } from "./build";
import type { Spec } from "./spec";

const spec = { steps: [{ body: "<p><var>x</var> = 2 and <var>m</var> = 3 and <var>a</var> = 1</p>" }] } as unknown as Spec;
const vars = captionVars(spec, '<text>2<tspan class="es-v">n</tspan></text>');
assert.deepEqual(vars, ["m", "n", "x"], "letters marked as variables in the spec or the figure; a is left out");

assert.equal(captionHtml("So x = 13/4, or x = −2.", vars), "So <var>x</var> = 13/4, or <var>x</var> = −2.");
assert.equal(captionHtml("A gamete is haploid, n; the zygote is 2n.", vars), "A gamete is haploid, <var>n</var>; the zygote is 2<var>n</var>.");
assert.equal(captionHtml("The x-axis and next maximum mean nothing new.", vars), "The <var>x</var>-axis and next maximum mean nothing new.", "letters inside words are untouched");
assert.equal(captionHtml("It moves 14 m when m = 2.", vars), "It moves 14 m when <var>m</var> = 2.", "a unit after a number stays upright");
assert.equal(captionHtml("If x < 3 & n > 1, it isn't x.", vars), "If <var>x</var> &lt; 3 &amp; <var>n</var> &gt; 1, it isn't <var>x</var>.", "escaped text is not broken");
assert.equal(captionHtml("Plain words only.", []), "Plain words only.");
console.log("caption: ok");
