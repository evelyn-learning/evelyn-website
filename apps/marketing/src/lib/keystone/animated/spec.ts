// Animated solutions: the item source format (spec.json + figure.svg + optional board.js) and its validator.
// The format is the contract in docs/superpowers/plans/2026-11-18-keystone-animated-solutions.md; the authoring
// guide is AUTHORING.md next to this file. Nothing here touches the network or the database.
import vm from "node:vm";

export const CUE_VERBS = ["show", "hide", "draw", "flash", "move", "ink", "wither", "answer", "call", "reset", "dim", "undim", "mark"] as const;
export type CueVerb = (typeof CUE_VERBS)[number];

/** One board instruction. Which fields matter depends on `do` (see AUTHORING.md, "Cue reference"). */
export interface Cue {
  do: CueVerb;
  /** Target layer id(s) in figure.svg: show, hide, draw, flash, move, dim, undim. */
  id?: string | string[];
  /** ink: the line penned on the ink strip. */
  html?: string;
  /** ink: "hi" (highlighted) or "result" (the result line). */
  cls?: "hi" | "result";
  /** move: the translate, in viewBox units, the element ends at. */
  to?: [number, number];
  /** move: slide there instead of jumping. */
  slide?: boolean;
  /** call: the board.js action. */
  fn?: string;
  /** call: passed to the action. */
  args?: Record<string, unknown>;
  /** mark: path data (viewBox units) of a marker stroke that draws itself and fades. */
  d?: string;
  /** mark: stroke colour (default the highlight purple). */
  color?: string;
}

export interface Line {
  /** The caption, as displayed (plain text). */
  say: string;
  /** The text sent to the voice (default = say). */
  speak?: string;
  cues?: Cue[];
}

export interface Step {
  title: string;
  lines: Line[];
  /** HTML shown in the step: paragraphs, .es-eq lines with data-how, .es-fold blocks. */
  body: string;
}

export const BOX_KINDS = ["selfcheck", "sanity", "slip", "explore", "tryone", "takeaway", "diploma"] as const;
export type BoxKind = (typeof BOX_KINDS)[number];
export const REQUIRED_BOXES: readonly BoxKind[] = ["selfcheck", "sanity", "slip", "takeaway", "diploma"];

export interface Box {
  kind: BoxKind;
  title: string;
  html: string;
  /** A quick question: the options, one of which is `answer`. */
  choices?: string[];
  answer?: string;
  /** Plain text shown after the right choice ("Yes. <why>"). */
  why?: string;
  /** 1-based step number: the box sits at the top of that step's body instead of after the steps. */
  beforeStep?: number;
}

export interface BoardButton {
  label: string;
  /** A board.js action, run when the button is pressed (only while nothing is playing). */
  action: string;
  args?: Record<string, unknown>;
}

export interface Board {
  /** Cues applied (at once) on top of figure.svg as authored to give the Fresh state. */
  fresh: Cue[];
  readoutFresh: string;
  readoutPractice: string;
  /** Shown when the explanation has finished (default: Press "Reset board" to try it yourself.). */
  readoutEnd?: string;
  buttons?: BoardButton[];
}

interface PracticeBase {
  /** Cues applied (at once) after a reset to give the Practice state. */
  setup?: Cue[];
  /** Cues run when the task is completed. */
  done?: Cue[];
  doneText?: string;
  missText?: string;
}
export interface DragSnapPractice extends PracticeBase {
  kind: "drag-snap";
  /** The id of the element the student drags. */
  drag: string;
  /** The translate (viewBox units) that counts as right. */
  snap: [number, number];
  /** How close (viewBox units) counts; default 16. */
  tolerance?: number;
}
export interface OrderPractice extends PracticeBase {
  kind: "order";
  /** Each chip (a <g transform="translate(x,y)">) belongs in one slot (any shape with a box). */
  chips: { id: string; slot: string; placed?: Cue[] }[];
  /** Readout after a right chip; "{n}" is how many are left (default "Right. {n} to go."). */
  stepText?: string;
}
export interface CustomPractice extends PracticeBase {
  kind: "custom";
}
export type Practice = DragSnapPractice | OrderPractice | CustomPractice;

export interface Spec {
  itemId: string;
  subject: string;
  course: string;
  voice: string;
  title: string;
  answer: { text: string; letter?: string };
  question: string;
  board: Board;
  steps: Step[];
  boxes: Box[];
  practice: Practice;
  /** Numbers the spoken-numbers check lets through, each with the reason it is not in the written solution. */
  allowNumbers?: { n: string; reason: string }[];
}

export interface Timing {
  steps: { file: string; durationMs: number; starts: number[] }[];
}

/** What board.js defined, read without a browser. */
export interface BoardDef {
  actions: string[];
  practice: boolean;
  explore: boolean;
  rest: boolean;
  solve: boolean;
  error?: string;
}

/** Runs board.js with a stub `esBoard` and reports what it defined. The file must do nothing at load except
 * call esBoard.define({...}); anything touching the page at load fails here. */
export function inspectBoard(boardJs: string | undefined): BoardDef {
  const out: BoardDef = { actions: [], practice: false, explore: false, rest: false, solve: false };
  if (!boardJs || !boardJs.trim()) return out;
  let defined = 0;
  const esBoard = {
    define(def: unknown) {
      defined += 1;
      const d = (def ?? {}) as Record<string, unknown>;
      const actions = (d.actions ?? {}) as Record<string, unknown>;
      for (const [k, v] of Object.entries(actions)) {
        if (typeof v === "function") out.actions.push(k);
        else out.error = `board.js: action "${k}" is not a function`;
      }
      for (const k of ["practice", "explore", "rest", "solve"] as const) {
        if (d[k] === undefined) continue;
        if (typeof d[k] === "function") out[k] = true;
        else out.error = `board.js: "${k}" is not a function`;
      }
    },
  };
  try {
    vm.runInNewContext(boardJs, { esBoard }, { timeout: 1000 });
  } catch (e) {
    out.error = `board.js fails at load (it may only call esBoard.define({...}) at the top level): ${(e as Error).message}`;
    return out;
  }
  if (defined !== 1 && !out.error) out.error = `board.js must call esBoard.define({...}) exactly once (called ${defined} times)`;
  return out;
}

/** Every id="…" in an SVG (or HTML) text, in order, duplicates kept. */
export function idsIn(markup: string): string[] {
  return [...markup.matchAll(/\sid\s*=\s*["']([^"']+)["']/g)].map((m) => m[1]);
}

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);
const isStr = (v: unknown): v is string => typeof v === "string";
const filled = (v: unknown): v is string => isStr(v) && v.trim().length > 0;
const isPair = (v: unknown): v is [number, number] => Array.isArray(v) && v.length === 2 && v.every((n) => typeof n === "number" && Number.isFinite(n));
const NEEDS_ID: readonly string[] = ["show", "hide", "draw", "flash", "move", "dim", "undim"];

/** The ids a cue names (none for cues that need none). */
export function cueIds(cue: Cue): string[] {
  return cue.id === undefined ? [] : Array.isArray(cue.id) ? cue.id : [cue.id];
}

/**
 * Checks a spec against its figure and board code. Returns the problems, each one sentence; empty = valid.
 * `svgText` is figure.svg; `boardJs` is board.js when the item has one.
 */
export function validateSpec(spec: unknown, svgText: string, boardJs?: string): string[] {
  const errs: string[] = [];
  if (!isObj(spec)) return ["spec.json is not an object"];
  const s = spec as Record<string, unknown>;

  for (const k of ["itemId", "subject", "course", "voice", "title"]) if (!filled(s[k])) errs.push(`"${k}" is missing or empty`);
  if (filled(s.itemId) && !/^\d+$/.test(s.itemId)) errs.push(`"itemId" must be digits only`);
  if (!isObj(s.answer) || !filled(s.answer.text)) errs.push(`"answer.text" is missing or empty`);
  else if (s.answer.letter !== undefined && !filled(s.answer.letter)) errs.push(`"answer.letter" must be a non-empty string when present`);
  if (!isStr(s.question)) errs.push(`"question" must be a string (HTML of the stem; "" to leave it out)`);

  // figure
  const ids = idsIn(svgText);
  const idSet = new Set(ids);
  if (!/<svg[\s>]/.test(svgText)) errs.push("figure.svg has no <svg> element");
  const vb = /<svg[^>]*\sviewBox\s*=\s*["']\s*0[\s,]+0[\s,]+([\d.]+)[\s,]+([\d.]+)\s*["']/.exec(svgText);
  if (!vb) errs.push(`figure.svg needs viewBox="0 0 240 H"`);
  else if (Number(vb[1]) !== 240) errs.push(`figure.svg viewBox must be 240 wide (it is ${vb[1]})`);
  for (const id of new Set(ids.filter((x, i) => ids.indexOf(x) !== i))) errs.push(`figure.svg: id "${id}" is used more than once`);
  for (const id of idSet) if (/^es-/.test(id)) errs.push(`figure.svg: id "${id}" starts with "es-", which is reserved for the player`);

  // board code
  const def = inspectBoard(boardJs);
  if (def.error) errs.push(def.error);

  const checkCues = (cues: unknown, where: string) => {
    if (cues === undefined) return;
    if (!Array.isArray(cues)) return void errs.push(`${where}: cues must be a list`);
    cues.forEach((c, i) => {
      const at = `${where} cue ${i + 1}`;
      if (!isObj(c) || !isStr(c.do)) return void errs.push(`${at}: needs a "do"`);
      if (!(CUE_VERBS as readonly string[]).includes(c.do)) return void errs.push(`${at}: unknown "do": "${c.do}"`);
      const cue = c as unknown as Cue;
      if (c.id !== undefined && !isStr(c.id) && !(Array.isArray(c.id) && c.id.every(isStr))) return void errs.push(`${at}: "id" must be a string or a list of strings`);
      const named = cueIds(cue);
      if (NEEDS_ID.includes(cue.do) && named.length === 0) errs.push(`${at} (${cue.do}): needs an "id"`);
      for (const id of named) if (!idSet.has(id)) errs.push(`${at} (${cue.do}): id "${id}" is not in figure.svg`);
      if (cue.do === "move") {
        if (!isPair(c.to)) errs.push(`${at} (move): needs "to": [dx, dy]`);
        if (named.length > 1) errs.push(`${at} (move): moves one element`);
      }
      if (cue.do === "ink") {
        if (!filled(c.html)) errs.push(`${at} (ink): needs "html"`);
        if (c.cls !== undefined && c.cls !== "hi" && c.cls !== "result") errs.push(`${at} (ink): "cls" is "hi" or "result"`);
      }
      if (cue.do === "mark" && !filled(c.d)) errs.push(`${at} (mark): needs "d" (path data)`);
      if (cue.do === "call") {
        if (!filled(c.fn)) errs.push(`${at} (call): needs "fn"`);
        else if (!def.actions.includes(c.fn)) errs.push(`${at} (call): action "${c.fn}" is not defined in board.js`);
        if (c.args !== undefined && !isObj(c.args)) errs.push(`${at} (call): "args" must be an object`);
      }
    });
  };

  // board
  if (!isObj(s.board)) errs.push(`"board" is missing`);
  else {
    const b = s.board;
    if (!Array.isArray(b.fresh)) errs.push(`"board.fresh" must be a list of cues (may be empty)`);
    else checkCues(b.fresh, "board.fresh");
    if (!filled(b.readoutFresh)) errs.push(`"board.readoutFresh" is missing or empty`);
    if (!filled(b.readoutPractice)) errs.push(`"board.readoutPractice" is missing or empty`);
    if (b.readoutEnd !== undefined && !filled(b.readoutEnd)) errs.push(`"board.readoutEnd" must be a non-empty string when present`);
    if (b.buttons !== undefined) {
      if (!Array.isArray(b.buttons)) errs.push(`"board.buttons" must be a list`);
      else
        b.buttons.forEach((btn, i) => {
          if (!isObj(btn) || !filled(btn.label) || !filled(btn.action)) return void errs.push(`board.buttons ${i + 1}: needs "label" and "action"`);
          if (!def.actions.includes(btn.action)) errs.push(`board.buttons ${i + 1}: action "${btn.action}" is not defined in board.js`);
        });
    }
  }

  // steps
  let folds = 0;
  const steps = Array.isArray(s.steps) ? s.steps : [];
  if (!Array.isArray(s.steps)) errs.push(`"steps" must be a list`);
  else if (steps.length < 3 || steps.length > 7) errs.push(`an item has 3 to 7 steps (this one has ${steps.length})`);
  steps.forEach((st, k) => {
    const at = `step ${k + 1}`;
    if (!isObj(st)) return void errs.push(`${at}: not an object`);
    if (!filled(st.title)) errs.push(`${at}: "title" is missing or empty`);
    if (!isStr(st.body)) errs.push(`${at}: "body" must be a string`);
    else folds += (st.body.match(/class\s*=\s*["'][^"']*\bes-fold\b/g) ?? []).length;
    if (!Array.isArray(st.lines) || st.lines.length === 0) return void errs.push(`${at}: needs at least one line`);
    st.lines.forEach((ln, i) => {
      const lat = `${at} line ${i + 1}`;
      if (!isObj(ln) || !filled(ln.say)) return void errs.push(`${lat}: "say" is missing or empty`);
      if (ln.speak !== undefined && !filled(ln.speak)) errs.push(`${lat}: "speak" must be a non-empty string when present`);
      checkCues(ln.cues, lat);
    });
  });
  if (steps.length && folds === 0) errs.push(`no fold in any step body: at least one <div class="es-fold" data-title="…"> (a Why-fold) is required`);

  // boxes
  const boxes = Array.isArray(s.boxes) ? s.boxes : [];
  if (!Array.isArray(s.boxes)) errs.push(`"boxes" must be a list`);
  boxes.forEach((bx, i) => {
    const at = `box ${i + 1}`;
    if (!isObj(bx) || !isStr(bx.kind)) return void errs.push(`${at}: needs a "kind"`);
    if (!(BOX_KINDS as readonly string[]).includes(bx.kind)) return void errs.push(`${at}: unknown kind "${bx.kind}"`);
    const bat = `${at} (${bx.kind})`;
    if (!filled(bx.title)) errs.push(`${bat}: "title" is missing or empty`);
    if (!isStr(bx.html)) errs.push(`${bat}: "html" must be a string`);
    if (bx.choices !== undefined) {
      if (!Array.isArray(bx.choices) || bx.choices.length < 2 || !bx.choices.every(filled)) errs.push(`${bat}: "choices" needs at least two non-empty strings`);
      else if (!isStr(bx.answer) || !bx.choices.includes(bx.answer)) errs.push(`${bat}: "answer" must be one of the choices, spelled the same`);
    }
    if (bx.kind === "selfcheck" && bx.choices === undefined) errs.push(`${bat}: a self-check needs "choices" and "answer"`);
    if (bx.why !== undefined && !filled(bx.why)) errs.push(`${bat}: "why" must be a non-empty string when present`);
    if (bx.beforeStep !== undefined && !(Number.isInteger(bx.beforeStep) && (bx.beforeStep as number) >= 1 && (bx.beforeStep as number) <= steps.length))
      errs.push(`${bat}: "beforeStep" must be a step number from 1 to ${steps.length}`);
    if (bx.kind === "tryone" && isStr(bx.html) && !/\bes-fold\b/.test(bx.html)) errs.push(`${bat}: the worked answer goes in a fold (<div class="es-fold" data-title="Show the worked answer">…</div>)`);
    if (bx.kind === "explore" && !def.explore) errs.push(`${bat}: an explore box needs explore(api) in board.js`);
  });
  for (const kind of REQUIRED_BOXES) if (!boxes.some((b) => isObj(b) && b.kind === kind)) errs.push(`required box missing: ${kind}`);

  // practice
  if (!isObj(s.practice) || !isStr(s.practice.kind)) errs.push(`"practice" is missing (kind "drag-snap", "order" or "custom")`);
  else {
    const p = s.practice;
    checkCues(p.setup, "practice.setup");
    checkCues(p.done, "practice.done");
    for (const k of ["doneText", "missText", "stepText"]) if (p[k] !== undefined && !filled(p[k])) errs.push(`practice.${k} must be a non-empty string when present`);
    if (p.kind === "drag-snap") {
      if (!filled(p.drag)) errs.push(`practice (drag-snap): needs "drag", the id of the element to drag`);
      else if (!idSet.has(p.drag)) errs.push(`practice (drag-snap): id "${p.drag}" is not in figure.svg`);
      if (!isPair(p.snap)) errs.push(`practice (drag-snap): needs "snap": [dx, dy]`);
      if (p.tolerance !== undefined && !(typeof p.tolerance === "number" && p.tolerance > 0)) errs.push(`practice (drag-snap): "tolerance" must be a positive number`);
      if (!filled(p.doneText)) errs.push(`practice (drag-snap): needs "doneText"`);
    } else if (p.kind === "order") {
      if (!Array.isArray(p.chips) || p.chips.length < 2) errs.push(`practice (order): needs at least two "chips"`);
      else
        p.chips.forEach((c, i) => {
          if (!isObj(c) || !filled(c.id) || !filled(c.slot)) return void errs.push(`practice (order) chip ${i + 1}: needs "id" and "slot"`);
          if (!idSet.has(c.id)) errs.push(`practice (order) chip ${i + 1}: id "${c.id}" is not in figure.svg`);
          if (!idSet.has(c.slot)) errs.push(`practice (order) chip ${i + 1}: slot "${c.slot}" is not in figure.svg`);
          checkCues(c.placed, `practice (order) chip ${i + 1} placed`);
        });
      if (!filled(p.doneText)) errs.push(`practice (order): needs "doneText"`);
    } else if (p.kind === "custom") {
      if (!def.practice) errs.push(`practice (custom): needs practice(api) in board.js`);
      if (!def.solve) errs.push(`practice (custom): needs solve(api) in board.js (it completes the task; the headless check uses it)`);
    } else errs.push(`practice: unknown kind "${p.kind}"`);
  }

  // allowNumbers
  if (s.allowNumbers !== undefined) {
    if (!Array.isArray(s.allowNumbers)) errs.push(`"allowNumbers" must be a list`);
    else
      s.allowNumbers.forEach((a, i) => {
        if (!isObj(a) || !filled(a.n) || !filled(a.reason)) errs.push(`allowNumbers ${i + 1}: needs "n" (the number, as a string) and a "reason"`);
      });
  }
  return errs;
}

/** Checks timing.json against the spec; returns the problems (empty = usable). */
export function validateTiming(timing: unknown, spec: Spec): string[] {
  if (!isObj(timing) || !Array.isArray(timing.steps)) return [`timing.json: needs "steps"`];
  const errs: string[] = [];
  if (timing.steps.length !== spec.steps.length) errs.push(`timing.json: ${timing.steps.length} steps, the spec has ${spec.steps.length}`);
  timing.steps.forEach((t, k) => {
    const st = spec.steps[k];
    if (!st) return;
    if (!isObj(t) || !Array.isArray(t.starts) || typeof t.durationMs !== "number") return void errs.push(`timing.json step ${k + 1}: needs "durationMs" and "starts"`);
    if (t.starts.length !== st.lines.length) errs.push(`timing.json step ${k + 1}: ${t.starts.length} starts for ${st.lines.length} lines`);
    const starts = t.starts as unknown[];
    if (!starts.every((n, i) => typeof n === "number" && n >= 0 && (i === 0 || n >= (starts[i - 1] as number)))) errs.push(`timing.json step ${k + 1}: starts must be numbers that never go down`);
  });
  return errs;
}
