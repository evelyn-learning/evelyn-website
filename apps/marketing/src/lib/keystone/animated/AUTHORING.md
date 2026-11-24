# Authoring an animated solution

One item = one source folder. The shared player does everything that is the same for every item (answer bar,
board, ink strip, live caption, Play / Pause, Listen, folding steps, catch-up, transcript, taps, practice
dragging, Reset). You write only what is particular to the item: the figure, the script with its cues, the
written steps and boxes, and (when needed) a little board code.

The rules every item obeys are in `docs/whitelabel/castle-rock/enhanced-solution-playbook.md` (laptop only).
A complete worked item is `docs/whitelabel/castle-rock/keystone/animated-src/234035/` (laptop only): read its
three files beside this guide.

## 1. The folder

```
<animated-src>/<itemId>/
  spec.json      the item: answer, script and cues, step bodies, boxes, practice task
  figure.svg     the board figure
  board.js       optional: item-specific actions, the explore slider, a custom practice task
  written.md     optional: the approved written solution with its question (numbers are checked against it;
                 when absent the build looks for ../../items/<itemId>.md)
  audio/step-N.mp3, timing.json     written by the record script; do not write them by hand
```

The folder name is the item id. Sources live outside git at
`/Users/luke/Dev/evelynlearning/docs/whitelabel/castle-rock/keystone/animated-src/<itemId>/`.

## 2. Commands (run in `apps/marketing` of the worktree)

```
npx tsx scripts/keystone-animated-build.ts  <animated-src>/<itemId>      # → <animated-src>/../animated-out/<itemId>/solution.html (+ audio/)
npx tsx scripts/keystone-animated-verify.ts <animated-src>/../animated-out/<itemId>   # headless check + pictures in shots/
```

Build options: `--out dir`, `--written file.md`, `--version N`, `--lenient` (ear and number findings become
warnings; use it only while drafting). The build exits 1 when a check fails and prints each failure; the page is
still written so you can open it. Verify exits 1 on any problem and prints `GREEN` when there is none. Both
work before the clips are recorded (the player then times the captions by their length).

An item is done when: the build prints no `FAIL`, verify prints `GREEN`, and you have opened the pictures in
`<out>/shots/` (`w360-…`, `w768-…`, `w1024-…`: fresh, one per step, end, listen, practice, practice done, all
open) and each one looks right.

## 3. figure.svg

- Root element `<svg viewBox="0 0 240 H">`: 240 wide, any height (200 is usual). Give it `role="img"` and an
  `aria-label` describing the finished figure.
- A **layer** is any element with an `id`. Cues and board code address layers by id. Ids must be unique, must
  not start with `es-`, and should be short words (`vecA`, `curve`, `slot1`).
- As authored, the file is the **Fresh** board: only the givens of the question. Everything derived is in the
  file but hidden: `class="es-layer es-off"`. `es-layer` gives a layer its fade; `es-off` hides it.
- Classes you may use (every class must start with `es-`):
  - `es-layer`, `es-off` — as above
  - `es-draw` on a `line` / `path` / `polyline` that should draw itself; that element also needs `pathLength="1"`
  - `es-v` on a `tspan` for an italic variable; `es-plain` on text that should not be bold
  - `es-slot` for a drop slot of an "order" task (dashed outline; turns green when filled)
- Colours, strokes and fonts are attributes in the SVG (the page sets Arial bold for SVG text).
- No `xmlns` needed (the build removes it), no `<style>`, no `<script>`, no outside reference, no `<image>`
  unless it is a `data:` address. Markers in `<defs>` are fine.
- An element that a `move` cue or a drag moves must be positioned by `transform="translate(x,y)"` and nothing
  else in its transform (wrap rotated content in an inner `<g>`).
- Keep the bottom of the figure clear of anything that matters: the ink strip sits directly under it.

## 4. spec.json

```
{ "itemId": "234035", "subject": "Physics", "course": "Physics 30", "voice": "Mr. Joseph",
  "title": "Two cars collide and stick together",
  "answer": { "text": "8.3 m/s at 42° South of East", "letter": "A" },
  "question": "<p>…the stem…</p>",
  "allowNumbers": [ { "n": "41.8", "reason": "the angle before rounding to 42" } ],
  "allowLetters": [],
  "board": { "fresh": [], "readoutFresh": "…", "readoutPractice": "…", "readoutEnd": "…", "buttons": [ … ] },
  "steps": [ { "title": "…", "lines": [ { "say": "…", "speak": "…", "cues": [ … ] } ], "body": "…" } ],
  "boxes": [ … ],
  "practice": { … } }
```

| Field | What it is |
|---|---|
| `itemId` | digits; same as the folder name |
| `subject`, `course` | "Physics" / "Physics 30" etc. The course is printed under the title |
| `voice` | "Mr. Joseph" (Physics, Mathematics) or "Ms. Michelle" (Biology, Chemistry). Not printed |
| `title` | plain text heading. A short description of the situation, not the answer |
| `answer.text` | the answer statement (HTML allowed, e.g. `<var>`). `answer.letter` only for multiple choice |
| `question` | HTML of the stem; shown in a closed "Show the question" fold. `""` leaves it out |
| `allowNumbers` | numbers that are not in the written solution or question, each with the reason (see §8) |
| `allowLetters` | optional. Letter spellings the ear check lets through in the voice text (`["dee"]`): only for a variable that has no name (see `speak` below) |
| `board.fresh` | cues applied at once on top of figure.svg to make the Fresh board. Usually `[]` |
| `board.readoutFresh` | the line under the board before play ("Press play. The board draws as the tutor speaks.") |
| `board.readoutPractice` | the practice instruction, starting "Now you: …" |
| `board.readoutEnd` | optional; shown when the explanation ends (default `Press "Reset board" to try it yourself.`) |
| `board.buttons` | optional extra board buttons: `{ "label": "↻ Replay collision", "action": "collide", "args": { "thenRest": true } }`. The action must finish by calling `api.rest()` |
| `steps` | 3 to 7 (4 to 6 is the house norm). `title` is a short noun phrase, plain text |
| `steps[].lines` | the script, one entry per spoken sentence or clause that has its own board moment |
| `steps[].body` | HTML of the written step (see §6) |

### Lines: `say`, `speak`, `cues`

- `say` is the caption exactly as displayed, plain text (symbols and unit abbreviations are fine: `14 m/s`,
  `42°`). It is highlighted in the step while spoken, shown under the board, and listed in the transcript.
- `speak` is the text sent to the voice. Leave it out when `say` is already written for the ear. Write it by
  Part 5 of the playbook: units spelled out and American ("meters per second"), no symbols, "car A" never a
  bare letter, "sine/cosine/tangent", never three numbers in a row. `say` and `speak` of a line must have the
  same number of sentences.
- **Name the quantity; do not spell its letter.** A letter symbol is never written by its sound: not "dee",
  "en", "el", "em", "vee", "kay" (the full list is in §8). A recorded voice read "dee" as "day". Say what the
  letter stands for: "the slit separation" (not "dee"), "the number of moles" (not "en"), "the speed" (not
  "vee"), "the mass" (not "em"). This overrides the playbook's "dee why over dee ex" respellings. "ex" and
  "why" for the math variables x and y are fine (heard and accepted). Only when a variable has no name at all
  (a bare parameter called d in the question) list its spelling in `allowLetters` and use it.
- **Read a coordinate pair as one point.** "negative 9, 6 moves to negative 3, 6" is heard as loose numbers
  that attach to the words around them (Praveen's flag on 302347, 2026-11-24). Write `speak` as "the point with
  ex equal to negative 9 and why equal to 6"; when only one coordinate changes, say so ("moves to ex equal to
  negative 3, with why still 6"). `say` keeps the usual (−9, 6).
- `cues` are what the board does when the line starts. A line with no cue is a pause.
- The first line of step 1 is "The answer is … Here's why." The last line of the last step states the answer
  and carries `{ "do": "answer" }`.
- Nothing derived may appear before the line that says it.

### Cue reference

| `do` | Fields | Effect |
|---|---|---|
| `show` | `id` | fade the layer in |
| `hide` | `id` | fade it out |
| `draw` | `id` | show it and draw its `es-draw` strokes |
| `flash` | `id` | pulse it twice (emphasis; fades by itself) |
| `dim` / `undim` | `id` | grey it back to 28 % / restore it |
| `move` | `id`, `to: [dx, dy]`, `slide` | set its transform to `translate(dx,dy)` (viewBox units); `"slide": true` glides there in 1.2 s |
| `ink` | `html`, `cls` | pen a line on the ink strip. `cls`: `"hi"` (purple), `"result"` (bold pink), or leave out |
| `wither` | — | fade all ink away (normally the first cue of a step that writes new ink) |
| `mark` | `d`, `color` | a marker stroke (SVG path data in viewBox units) that draws itself, stays about 3 s and fades |
| `answer` | — | flash the answer bar |
| `reset` | — | put the figure back exactly as authored and clear the ink |
| `call` | `fn`, `args` | run the board.js action `fn(api, args)` |

`id` may be one id or a list (`"id": ["labR", "ang"]`); `move` takes one. Ink `html` may use `<var>`, `<sub>`,
`<sup>`, `<em>`, `<strong>`; keep each ink line short enough to fit one line of the 300 px board (about 38
characters), and no more than four ink lines between two `wither`s.

How playback uses the cues: a jump (Play, Listen on a step, `playFrom`) first resets the figure, applies
`board.fresh`, then applies every cue of all earlier steps at once without animation, then plays. So the state
at the start of a step is always "everything before it", and you never need to repeat earlier cues. You do
need a `reset` or `hide` where a step wants something from an earlier step gone.

## 5. Boxes

```
{ "kind": "selfcheck", "title": "Check yourself first", "html": "<p>What mass is moving after the collision?</p>",
  "choices": ["400 kg", "500 kg", "900 kg"], "answer": "900 kg", "why": "The cars are locked together, so their masses add.",
  "beforeStep": 4 }
```

| `kind` | Required | Notes |
|---|---|---|
| `selfcheck` | yes | needs `choices` and `answer`; give `beforeStep` = the last step's number so the student predicts before the reveal |
| `sanity` | yes | why the answer is reasonable |
| `slip` | yes | the one common slip, stated as what to do instead. Never a walk through the wrong options |
| `explore` | no | a slider on one given; needs `explore(api)` in board.js (§7). Put its `<input type="range">` and small figure in `html` |
| `tryone` | no | a sibling question; the worked answer goes inside a fold in `html` |
| `takeaway` | yes | "The idea to remember", one or two sentences |
| `diploma` | yes | how this is examined on the Diploma |

- `title` is plain text; `html` is HTML (§6).
- `choices` / `answer` / `why` work on any box. `answer` must be spelled exactly as one of the choices. The
  buttons are placed after `html`, or where `html` contains `{{choices}}`. Feedback is "Yes. <why>" or "Not
  quite. Try again, or read on."
- `beforeStep: N` (1-based) puts the box at the top of step N's body. Without it the box follows the steps, in
  the house order of the table above.

## 6. HTML in bodies and boxes

Plain HTML: `<p>`, `<strong>`, `<em>`, `<var>` for variables, `<sub>`, `<sup>`. Every class must start with
`es-`. No `<details>`, no `<style>`, no `<script>`, no link, no image file (inline `data:` only). Canadian
spelling. Components:

- **Fold** (Why-fold, Refresher, hidden worked answer). At least one fold in some step body is required.
  ```
  <div class="es-fold" data-title="Why not just add 5600 + 5000?"><p>…</p></div>
  ```
- **Equation lines** with the operation behind each (tap to show). The hint line "Tap an equation line…" is
  added once automatically.
  ```
  <div class="es-eq"><span data-how="momentum = mass × velocity; multiply 400 by 14"><var>p</var><sub>A</sub> = (400 kg)(14 m/s) = 5600 kg·m/s East</span></div>
  ```
- **Fraction**: `<span class="es-frac"><span>5000</span><span>5600</span></span>`
- **Term tap**: `<span class="es-term" data-def="the product of mass and velocity">momentum</span>`
- **Small print**: `<p class="es-small">…</p>`. **Small figure**: `<div class="es-fig"><svg viewBox="0 0 240 H">…</svg></div>`
  (elements inside may have ids for board.js; they must not clash with figure.svg ids).

## 7. Practice task and board.js

### Practice (`spec.practice`)

Opens when Reset board is pressed after the explanation has run. `setup` cues (applied at once, on top of the
figure as authored) make the Practice board; `done` cues run when the student completes the task.

```
"practice": { "kind": "drag-snap", "drag": "vecB", "snap": [12, 39], "tolerance": 16,
  "setup": [ { "do": "hide", "id": "motion" }, { "do": "show", "id": ["vecA", "vecB", "hint"] } ],
  "done":  [ { "do": "show", "id": ["labR", "ang"] }, { "do": "wither" }, { "do": "ink", "html": "…", "cls": "result" } ],
  "doneText": "Tip to tail. The diagonal is the total momentum.",
  "missText": "Close, but B's tail should start exactly where A's arrow ends. Try again." }
```

- **`drag-snap`**: the student drags element `drag`; it is right when its translate is within `tolerance`
  (default 16, viewBox units) of `snap`. Show a dashed outline of the target in `setup` (a hidden layer in the
  figure). `doneText` required.
- **`order`**: chips go into slots.
  ```
  "practice": { "kind": "order", "setup": [ { "do": "show", "id": ["slots", "chips"] } ],
    "chips": [ { "id": "chipLag", "slot": "slot1", "placed": [ { "do": "flash", "id": "seg0" } ] }, … ],
    "stepText": "Right. {n} to go.", "missText": "Not there. Try another place.", "doneText": "All four in order." }
  ```
  A chip is `<g id="chipLag" transform="translate(x,y)"><rect width="40" height="18" rx="4"/><text …>4 Lag</text></g>`
  (the player styles the rect and text). A slot is any shape with a box, not transformed, e.g.
  `<rect id="slot1" class="es-slot" x="30" y="172" width="40" height="18" rx="4"/>`. Author the chips in their
  shuffled home positions; a chip dropped on the wrong slot goes home. `doneText` required.
- **`custom`**: board.js provides `practice(api)` (wire the task once, at load; act only while
  `api.practising()`; call `api.practiceDone(text)` when complete) and `solve(api)` (completes the task from
  code; the headless check uses it).

### board.js

Only needed for `call` cues, board buttons, an explore box or a custom practice task. At load the file may do
one thing only: call `esBoard.define`. ES5 only (`var`, `function`; no arrow functions, `let`, `const`,
template strings). No network, storage or timers of your own (`api.after` instead of `setTimeout`).

```js
esBoard.define({
  actions: {
    collide: function (api, args) { /* run by {"do":"call","fn":"collide","args":{…}} and by board buttons */ }
  },
  explore:  function (api) { /* wire the explore slider once, at load */ },
  practice: function (api) { /* custom practice only */ },
  solve:    function (api) { /* custom practice only */ },
  rest:     function (api, played) { /* optional: after every return to Fresh (false) or Practice (true) */ }
});
```

`api` (an element works wherever an id does):

| Call | Effect |
|---|---|
| `api.fast` | true while the board is brought up to date silently |
| `api.el(id)` | the element |
| `api.show(id)`, `api.hide(id)`, `api.draw(id)`, `api.flash(id)`, `api.dim(id)`, `api.undim(id)` | as the cues |
| `api.move(id, dx, dy, slide, done)` | as the cue; `done()` runs on arrival (at once when fast) |
| `api.pos(id)` | `[dx, dy]` of its current translate |
| `api.ink(html, cls)`, `api.wither()`, `api.mark(d, color)`, `api.answer()` | as the cues |
| `api.readout(text)` | set the line under the board |
| `api.after(ms, fn)` | a timer cancelled on reset; runs at once when fast |
| `api.animate(ms, frame, done)` | `frame(u)` with u from 0 to 1; when fast `frame(1)` then `done()` at once |
| `api.svgPoint(evt)` | a pointer event's position in viewBox units `{x, y}` |
| `api.playing()`, `api.played()`, `api.practising()` | state |
| `api.practiceDone(text)` | custom practice: complete |
| `api.rest()` | back to the resting board (Fresh, or Practice once played) |
| `api.cue(cue)` | run one cue object |

**The fast rule.** Every action must leave the board in its end state immediately when `api.fast` is true. If
you only use the `api` helpers (including `api.after` and `api.animate`) this holds automatically. Never use
`setTimeout` or `requestAnimationFrame` directly, and never leave the end state to something that only happens
in the animated path. Verify compares the board after a full play with the board built silently and fails when
they differ.

**Resets are exact.** A reset restores every attribute and text of every element of figure.svg and removes
elements added since, so an action may change anything in the figure. It does not undo changes outside the
figure (e.g. an explore box).

## 8. What the checks enforce

**Build: spec** (fails the build): required fields; 3 to 7 steps, each with at least one line; every cue well
formed and every `id` present in figure.svg; every `call` and button action defined in board.js; board.js
does nothing at load but `esBoard.define`; required boxes present (selfcheck, sanity, slip, takeaway,
diploma); at least one fold in a step body; `beforeStep` in range; choice answers match a choice; a try-one
box has a fold; an explore box has `explore(api)`; practice ids exist; figure 240 wide, ids unique and not
`es-…`; each `allowNumbers` entry has a reason; each `allowLetters` entry is one word.

**Build: numbers** (fails unless `--lenient`): every number in the answer, `say`, `speak`, ink, step titles
and bodies, boxes, readouts and practice texts must occur in the written solution or the question. Compared by
value: `31 360 000` = `31,360,000`; `3.0 × 10<sup>8</sup>` = `3.0 \times 10^{8}`; signs ignored; `8.30` =
`8.3`. Subscripts and digits attached to letters (`H2O`, `v1`) are labels and are not checked; exponents are.
Numbers written as words are not checked. For a number that is right but not in the written solution (an
intermediate line of working, a value of the try-one question) add `{ "n": "…", "reason": "…" }` to
`allowNumbers`; the reviewer reads the reasons. Do not use it to wave through a different rounding of the
answer.

**Build: ear** (fails unless `--lenient`), on `speak` (or `say` where a line has no `speak`): no symbols
(`= + × ÷ / ° ² ³ √ ^ _ % · → ≈ < > −` and Greek letters); no unit abbreviation after a number (`14 m`, `400 kg`);
no `sin` / `cos` / `tan`; no three numbers in a row (a spaced number such as `56 360 000` counts as three);
no letter symbol spelled by its sound as a whole word, in any case (`ay`, `cee`, `dee`, `eff`, `aitch`, `kay`,
`el`, `em`, `en`, `ess`, `vee`, `zee`, `zed`; `ex` and `why` are allowed) unless the spelling is listed in
`allowLetters`; `say` and `speak` have the same number of sentences.

**Build: packaging** (fails the build): no outside address anywhere; no `<details>`, `<link>`, `@import`,
`@font-face`, frame or form; no file reference other than `audio/step-N.mp3`; no storage, cookie or network
call; every class `es-…`; the footer; no word about how the page was made (model, vendor or tool names).

**Verify** (at 360×740, 768×1024, 1024×768): Fresh board (hidden layers hidden, empty ink; it prints a note
when a layer that a cue reveals is already visible before play); Reset and board buttons before play return to
Fresh; full Play with the right step open and marked, one caption sentence highlighted, earlier steps folded,
events in order; Pause freezes the clock and the fold and keeps the button row's size; **the board and the
caption never move or change size**; finished board equals the board built silently; Listen on step 3 then
step 1; Reset during play opens the practice task; the task rejects a wrong drop and completes on the right
one; Reset opens it again; transcript, folds, equation lines, choices and sliders respond; nothing runs past
the right edge; no console error; no request but the page and its clips.

## 9. Common mistakes

- A derived label is visible on the Fresh board (forgot `es-off`).
- An ink line too long for the strip: it wraps and is hard to read. Keep ink lines short (look at the step pictures).
- An action sets something inside `setTimeout`: Listen on a later step shows a different board. Use `api.after`.
- `speak` left out on a line whose `say` has `m/s`, `°` or `=`: the ear check fails. Write the `speak`.
- A letter spelled out in `speak` ("dee equals…"): the voice may read another word. Name the quantity.
- A number rounded differently in `speak` than in the written solution: the numbers check reports it. Say the
  written value.
- A moved element has a rotate in its transform: `move` replaces the whole transform. Rotate an inner `<g>`.
