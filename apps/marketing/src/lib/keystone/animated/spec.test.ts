// npx tsx src/lib/keystone/animated/spec.test.ts
import assert from "node:assert/strict";
import { idsIn, inspectBoard, validateSpec, validateTiming, type Spec } from "./spec";
import { BOARD_JS, SVG, spec } from "./testkit";

const ok = (value: unknown, message: string) => assert.ok(value, message);
const has = (errs: string[], re: RegExp, message: string) => assert.ok(errs.some((e) => re.test(e)), `${message}; got ${JSON.stringify(errs)}`);
const check = (s: unknown, svg = SVG, js: string | undefined = BOARD_JS) => validateSpec(s, svg, js);
const edit = (f: (s: Spec) => void): Spec => {
  const s = JSON.parse(JSON.stringify(spec())) as Spec;
  f(s);
  return s;
};

assert.deepEqual(check(spec()), [], "the fixture is valid");
assert.deepEqual(check("x"), ["spec.json is not an object"], "non-object");
assert.deepEqual(idsIn(`<g id="a"><path id='b'/></g>`), ["a", "b"], "idsIn");

// shape
has(check(edit((s) => (s.title = ""))), /"title" is missing/, "empty title");
has(check(edit((s) => (s.itemId = "ab1"))), /itemId.*digits/, "itemId digits");
has(check(edit((s) => (s.answer.text = " "))), /answer\.text/, "answer text");
has(check(edit((s) => (s.steps = s.steps.slice(0, 2)))), /3 to 7 steps/, "two steps");
has(check(edit((s) => (s.steps = [...s.steps, ...s.steps, ...s.steps]))), /3 to 7 steps/, "nine steps");
has(check(edit((s) => (s.steps[0].lines = []))), /step 1: needs at least one line/, "no lines");
has(check(edit((s) => (s.steps[1].lines[0].say = ""))), /step 2 line 1: "say"/, "empty say");

// cues
has(check(edit((s) => (s.steps[0].lines[0].cues = [{ do: "show", id: "nope" }]))), /step 1 line 1 cue 1 \(show\): id "nope" is not in figure\.svg/, "unknown id");
has(check(edit((s) => (s.steps[0].lines[0].cues = [{ do: "show", id: ["arrow", "ghost"] }]))), /id "ghost"/, "unknown id in a list");
has(check(edit((s) => (s.steps[0].lines[0].cues = [{ do: "show" }]))), /needs an "id"/, "show without id");
has(check(edit((s) => (s.steps[0].lines[0].cues = [{ do: "spin" as never, id: "arrow" }]))), /unknown "do": "spin"/, "unknown verb");
has(check(edit((s) => (s.steps[0].lines[0].cues = [{ do: "call", fn: "nothere" }]))), /action "nothere" is not defined in board\.js/, "unknown action");
has(validateSpec(spec(), SVG), /action "push" is not defined/, "call without board.js");
has(check(edit((s) => (s.steps[0].lines[0].cues = [{ do: "move", id: "arrow" }]))), /needs "to"/, "move without to");
has(check(edit((s) => (s.steps[0].lines[0].cues = [{ do: "ink" }]))), /\(ink\): needs "html"/, "ink without html");
has(check(edit((s) => (s.steps[0].lines[0].cues = [{ do: "ink", html: "x", cls: "big" as never }]))), /"cls" is "hi" or "result"/, "ink cls");
has(check(edit((s) => (s.steps[0].lines[0].cues = [{ do: "mark" }]))), /\(mark\): needs "d"/, "mark without d");
assert.deepEqual(check(edit((s) => (s.steps[0].lines[0].cues = [{ do: "move", id: "arrow", to: [1, 2], slide: true }, { do: "dim", id: "scene" }, { do: "mark", d: "M0 0L5 5" }, { do: "wither" }]))), [], "valid cues of every other kind");
has(check(edit((s) => (s.board.fresh = [{ do: "hide", id: "zz" }]))), /board\.fresh cue 1 \(hide\): id "zz"/, "board.fresh ids");
has(check(edit((s) => (s.board.buttons = [{ label: "Go", action: "zap" }]))), /board\.buttons 1: action "zap"/, "button action");

// figure
has(check(spec(), SVG.replace('viewBox="0 0 240 200"', 'viewBox="0 0 300 200"')), /240 wide/, "viewBox width");
has(check(spec(), SVG.replace('id="block"', 'id="scene"')), /id "scene" is used more than once/, "duplicate id");
has(check(spec(), SVG.replace('id="block"', 'id="es-board"')), /reserved for the player/, "reserved id");

// boxes and folds
for (const kind of ["selfcheck", "sanity", "slip", "takeaway", "diploma"] as const) has(check(edit((s) => (s.boxes = s.boxes.filter((b) => b.kind !== kind)))), new RegExp(`required box missing: ${kind}`), `missing ${kind}`);
has(check(edit((s) => (s.steps[0].body = "<p>No fold.</p>"))), /no fold in any step body/, "no fold");
has(check(edit((s) => (s.boxes[0].beforeStep = 4))), /"beforeStep" must be a step number from 1 to 3/, "beforeStep too high");
has(check(edit((s) => (s.boxes[0].beforeStep = 0))), /"beforeStep"/, "beforeStep zero");
has(check(edit((s) => (s.boxes[0].answer = "5 kg"))), /"answer" must be one of the choices/, "answer not a choice");
has(check(edit((s) => delete s.boxes[0].choices)), /a self-check needs "choices"/, "self-check without choices");
has(check(edit((s) => s.boxes.push({ kind: "tryone", title: "Try one more", html: "<p>Q</p>" }))), /worked answer goes in a fold/, "try-one without fold");
has(check(edit((s) => s.boxes.push({ kind: "explore", title: "Explore", html: "<p>Q</p>" })), SVG, BOARD_JS.replace(", explore: function (api) {}", "")), /explore box needs explore\(api\)/, "explore without code");

// practice
has(check(edit((s) => ((s.practice as { drag: string }).drag = "gone"))), /practice \(drag-snap\): id "gone"/, "drag id");
has(check(edit((s) => delete (s.practice as { snap?: unknown }).snap)), /needs "snap"/, "snap");
const order = (chips: { id: string; slot: string }[]) => edit((s) => (s.practice = { kind: "order", chips, doneText: "In order." }));
assert.deepEqual(check(order([{ id: "chipA", slot: "slotA" }, { id: "chipB", slot: "slotB" }])), [], "valid order practice");
has(check(order([{ id: "chipA", slot: "slotA" }, { id: "chipB", slot: "slotZ" }])), /chip 2: slot "slotZ" is not in figure\.svg/, "order slot id");
has(check(order([{ id: "chipA", slot: "slotA" }])), /at least two "chips"/, "one chip");
has(check(edit((s) => (s.practice = { kind: "custom" }))), /needs practice\(api\) in board\.js/, "custom without practice");
has(check(edit((s) => (s.practice = { kind: "custom" }))), /needs solve\(api\)/, "custom without solve");
assert.deepEqual(check(edit((s) => (s.practice = { kind: "custom" })), SVG, `esBoard.define({ actions: { push: function () {} }, practice: function () {}, solve: function () {} });`), [], "valid custom practice");
has(check(edit((s) => (s.practice = { kind: "quiz" } as never))), /unknown kind "quiz"/, "practice kind");

// allowLetters
assert.deepEqual(check(edit((s) => (s.allowLetters = ["dee", "En"]))), [], "allowLetters: a list of spellings is valid");
has(check(edit((s) => ((s as unknown as { allowLetters: unknown }).allowLetters = "dee"))), /"allowLetters" must be a list/, "allowLetters not a list");
has(check(edit((s) => (s.allowLetters = ["dee", ""]))), /allowLetters 2: needs a letter spelling/, "allowLetters empty entry");
has(check(edit((s) => (s.allowLetters = ["d = 4"]))), /allowLetters 1: needs a letter spelling/, "allowLetters entry is one word");

// allowNumbers
has(check(edit((s) => (s.allowNumbers = [{ n: "7", reason: "" }]))), /allowNumbers 1: needs "n".*"reason"/, "allowNumbers reason");

// board.js
assert.deepEqual(inspectBoard(BOARD_JS).actions, ["push"], "actions read");
ok(inspectBoard(BOARD_JS).explore && !inspectBoard(BOARD_JS).practice, "hooks read");
ok(/fails at load/.test(inspectBoard(`document.title = "x"; esBoard.define({});`).error ?? ""), "board.js touching the page at load");
ok(/exactly once/.test(inspectBoard(`var x = 1;`).error ?? ""), "board.js that never defines");
ok(/not a function/.test(inspectBoard(`esBoard.define({ actions: { a: 1 } });`).error ?? ""), "action that is not a function");
assert.deepEqual(inspectBoard(undefined), { actions: [], practice: false, explore: false, rest: false, solve: false }, "no board.js");

// timing
const good = { steps: [{ file: "audio/step-1.mp3", durationMs: 5000, starts: [0, 2000] }, { file: "audio/step-2.mp3", durationMs: 4000, starts: [0] }, { file: "audio/step-3.mp3", durationMs: 3000, starts: [0] }] };
assert.deepEqual(validateTiming(good, spec()), [], "good timing");
has(validateTiming({ steps: good.steps.slice(0, 2) }, spec()), /2 steps, the spec has 3/, "timing step count");
has(validateTiming({ steps: [{ ...good.steps[0], starts: [0] }, good.steps[1], good.steps[2]] }, spec()), /step 1: 1 starts for 2 lines/, "timing line count");
has(validateTiming({ steps: [{ ...good.steps[0], starts: [500, 100] }, good.steps[1], good.steps[2]] }, spec()), /never go down/, "timing order");

console.log("animated/spec.test.ts: ok");
