// A small valid item used by the tests in this folder.
import type { Spec } from "./spec";

export const SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 200"><g id="scene"><rect id="block" class="es-layer" x="10" y="10" width="20" height="20"/></g>
<g id="arrow" class="es-layer es-off" transform="translate(0,0)"><line class="es-draw" pathLength="1" x1="0" y1="0" x2="10" y2="0"/></g>
<rect id="slotA" class="es-slot" x="10" y="150" width="40" height="18"/><rect id="slotB" class="es-slot" x="60" y="150" width="40" height="18"/>
<g id="chipA" transform="translate(120,150)"><rect width="40" height="18"/></g><g id="chipB" transform="translate(170,150)"><rect width="40" height="18"/></g></svg>`;

export const BOARD_JS = `esBoard.define({ actions: { push: function (api, args) { api.show('arrow'); } }, explore: function (api) {} });`;

export const spec = (over: Partial<Spec> = {}): Spec => ({
  itemId: "1001",
  subject: "Physics",
  course: "Physics 30",
  voice: "Mr. Joseph",
  title: "A block is pushed",
  answer: { text: "12 N", letter: "B" },
  question: "<p>A 4 kg block accelerates at 3 m/s². What is the net force?</p>",
  board: { fresh: [], readoutFresh: "Press play.", readoutPractice: "Now you: drag the arrow.", buttons: [{ label: "Push again", action: "push" }] },
  steps: [
    {
      title: "The law",
      lines: [
        { say: "The answer is B. Here's why.", speak: "The answer is option B. Here's why.", cues: [{ do: "reset" }] },
        { say: "Force is mass times acceleration.", cues: [{ do: "ink", html: "<var>F</var> = <var>m</var><var>a</var>", cls: "hi" }] },
      ],
      body: `<p>Newton's second law.</p><div class="es-fold" data-title="Why net force?"><p>Only the net force accelerates the block.</p></div>`,
    },
    {
      title: "The numbers",
      lines: [{ say: "4 kg times 3 m/s² is 12 N.", speak: "4 kilograms times 3 meters per second squared is 12 newtons.", cues: [{ do: "call", fn: "push" }, { do: "draw", id: "arrow" }] }],
      body: `<div class="es-eq"><span data-how="multiply 4 by 3"><var>F</var> = (4 kg)(3 m/s<sup>2</sup>) = 12 N</span></div>`,
    },
    { title: "The answer", lines: [{ say: "So the net force is 12 N: option B.", speak: "So the net force is 12 newtons, option B.", cues: [{ do: "answer" }] }], body: "<p>12 N is option <strong>B</strong>.</p>" },
  ],
  boxes: [
    { kind: "selfcheck", title: "Check yourself first", html: "<p>Which quantity is the mass?</p>", choices: ["4 kg", "3 m/s²"], answer: "4 kg", beforeStep: 3 },
    { kind: "sanity", title: "Sanity check", html: "<p>A bigger mass needs a bigger force.</p>" },
    { kind: "slip", title: "One common slip", html: "<p>Dividing instead of multiplying.</p>" },
    { kind: "takeaway", title: "The idea to remember", html: "<p>Net force is mass times acceleration.</p>" },
    { kind: "diploma", title: "Diploma note", html: "<p>Give the unit.</p>" },
  ],
  practice: { kind: "drag-snap", drag: "arrow", snap: [30, 0], setup: [{ do: "show", id: "arrow" }], done: [{ do: "ink", html: "<var>F</var> = 12 N", cls: "result" }], doneText: "That is the net force." },
  ...over,
});

export const WRITTEN = "## Question\nA 4 kg block accelerates at $3\\ \\text{m/s}^2$.\n## Diploma answer\n$F = ma = (4)(3) = 12\\ \\text{N}$, option B.";
