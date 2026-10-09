/**
 * Prompts of the FIGURE track of the practice-extension job. Pure (no I/O).
 *
 * As in prompts.ts, all wording is subject-agnostic: no topic, no example
 * question, no example answer. What the prompts DO spell out is the tool —
 * the figure kinds the renderer draws, their parameters, and the checkers
 * that recompute an answer from a figure.
 */
import type { Prompt } from '../../src/lib/tutor/portal/key-verify-prompts';
import { PRACTICE_FIGURE_KINDS, checkerCatalogue } from './figure-core';

const obj = (properties: Record<string, unknown>) => ({ type: 'object', properties, required: Object.keys(properties), additionalProperties: false });

/** What each kind can and cannot draw — shared by both prompts. */
const KIND_CAPABILITIES = `- function_graph: one to six curves y = f(x), each given by a formula in x, on a numbered grid; a curve may be limited to a piece of the x-axis with an open or a filled endpoint; marked points (filled or open, optionally labelled); dashed vertical or horizontal guide lines. It cannot shade a region, draw a curve that is not a function of x (closed, sideways, parametric or polar curves), draw vectors, angles or geometric shapes, or show two panels.
- motion_graph: one to four lines of one quantity against time or against any other variable, each made of straight segments between given points (or one smooth curve through them), on a numbered grid; both axis labels are free text. It cannot shade a region.
- bar_chart: ONE series of bars over named categories on a numbered value axis. No grouped or stacked bars, no bars over a continuous scale, no error bars.
- line_plot: a dot plot — dots stacked above the ticks of a number line.
- scatter_plot: dots on a numbered grid, optionally in named groups and optionally labelled, with an optional straight line.
- reaction_coordinate: an energy profile — a starting level, ONE peak per pathway (one to four pathways drawn together), a final level; a numbered energy axis. No intermediates, no second step.
- titration_curve: pH against volume of titrant for one strong or weak acid or base (a single ionisation) titrated with a strong base or acid.
- slope_field: short segments of dy/dx = F(x, y) on a lattice, optionally with one solution curve through a marked point.
- free_body_diagram: one object (box, circle or person), an optional horizontal, inclined or vertical surface, and labelled force arrows.`;

// ── which kind fits each figure-dependent objective? ────────────────────────

const KIND_SYSTEM = `You are given learning objectives of one skill of a school or college-entry course. Each was set aside because practising it needs a figure. A program can now draw ONE figure per practice question, of the kinds listed below, and the student answers by READING that figure: multiple choice with four text options, or one number. The student cannot draw anything, and the answer options cannot contain figures.

The kinds, with what each can and cannot draw:
${KIND_CAPABILITIES}

For each objective decide:
- kind: the ONE listed kind with which what the objective itself asks for can be practised honestly by reading a figure of that kind — or unsupported when no listed kind can show what is needed.
- student_must_draw: true when the objective's own demand is to PRODUCE a figure (sketch, draw, plot, construct, shade, label) and reading a finished figure would not practise it. Then kind is unsupported.
- needed_figure: when kind is unsupported, two to five words that name, in general terms, the type of figure the objective would need; otherwise "".
- reason: one short sentence.

Be strict about the limits stated for each kind: a kind that can draw something only roughly similar to what the objective needs is not a fit.

Reply as JSON: objectives — one entry per objective, in the order given, with n (its number), kind, student_must_draw, needed_figure and reason.`;

export interface KindView {
  description: string;
  why: string;
  lesson?: string;
}

export function buildKindPrompt(subject: string, skillTitle: string, objectives: KindView[]): Prompt {
  return {
    system: KIND_SYSTEM,
    user: `Subject: ${subject}\nSkill: ${skillTitle}\n\n${objectives.map((o, i) => `${i + 1}. ${o.description}\n   Why it needs a figure: ${o.why}${o.lesson ? `\n   Lesson: ${o.lesson}` : ''}`).join('\n')}`,
    schema: obj({
      objectives: {
        type: 'array',
        items: obj({ n: { type: 'integer' }, kind: { type: 'string', enum: [...PRACTICE_FIGURE_KINDS, 'unsupported'] }, student_must_draw: { type: 'boolean' }, needed_figure: { type: 'string' }, reason: { type: 'string' } }),
      },
    }),
  };
}

// ── generation ──────────────────────────────────────────────────────────────

export const FIGURE_GENERATE_SYSTEM = `You write practice questions for a secondary-school or college-entry course. Each question is shown to the student together with ONE figure, which a program draws from a specification you give. You are given one learning objective — with the lesson material that teaches it, the questions it already has, and the KIND of figure assigned to it — and you write the requested number of NEW questions, each with its own figure.

The student reads the figure
- The question must be answerable ONLY by reading the figure. The question text gives no value that the figure is there to supply, and a student who covers the figure cannot answer. The text refers to the figure in plain words.
- The question text does not describe the figure: it does not say what shape a graph has, where its features are, or which feature to use. It says in a few words what the figure is about, and asks. Finding and reading the relevant feature is the student's work.
- Everything the student needs is visible and exact: every value to be read lies ON a gridline or at a marked point — never an estimate between gridlines; the plotted ranges contain every feature the question refers to; curves and points stay inside the plot.
- Nothing printed on the figure states the answer: no title, legend entry, point label, level name or annotation that gives the value or the conclusion asked for, and no displayed equation. Name curves, points and bars with a letter or a short neutral word. The options that print values or equations on the figure (showValues, annotateValues, showEquation, showExpression) stay off whenever the question asks for what they would print.
- A feature the student reads never sits on the edge of the plot: leave at least one step of range beyond it. Every curve has its own name and one colour; a single curve needs no name unless the question uses it. A free-body diagram carries at most three forces.
- Never ask the student to draw, sketch, shade, plot, mark or label anything.
- The question practises its own objective, at the level the objective's verb demands, and needs the objective's own idea: reading a number off an axis with no further thought practises nothing unless reading that kind of figure IS the objective.
- There is exactly one defensible answer. State in the text any condition, constant or rounding rule the answer depends on and the figure does not show. Do not name the method or the formula to use, and do not hint at the answer; guidance belongs in hints.
- You have worked the answer out from the figure exactly as specified, before finalising: the stored answer is what the figure gives.

Different tasks, not different numbers
- The questions you write for the objective are DIFFERENT types of task — another aspect, the reverse direction of reasoning, another kind of given and unknown — and none repeats the type of task of a question the objective already has. Label each with taskType: two to five general words.

Formats
- mcq: exactly four options in choices, exactly one correct; answer is its letter (A, B, C or D). Each option is ONE plain value or one short statement of the result, with no reason attached; no two options say the same thing; no "all / none of the above". Each wrong option is the outcome of one specific mistake a student could really make in reading or using the figure. Fill distractorRationales: one entry per option, in order — the mistake behind each wrong option (each a different mistake) and the single word correct for the right one. The correct option does not stand out, and its position varies.
- numeric: answer is ONE plain number (integer, decimal or a/b fraction) with no unit or word; the question names the unit expected. choices and distractorRationales are empty.
- free: only when the answer is a single term of at most three words; otherwise use mcq. choices and distractorRationales are empty.
- Plain text with Unicode symbols (× · − ± √ π ° ≤ ≥ → ² ³); no LaTeX and no dollar signs anywhere.

The figure specification
- figureType: the kind assigned to the objective. figureParamsJson: the parameters of that kind, as JSON text (a JSON object written inside the string). All text parameters are plain text. Do not give a title unless the figure cannot be understood without one.
- In THIS job every numbered axis is given explicitly — its range AND its step — and each end of a range is a multiple of the step. Numbered gridlines are drawn at multiples of the step and lighter gridlines halfway between them (at fifths when the step is 5, 50, 0.5 …); a value is readable only on one of those lines. Keep a range to at most 12 steps across and 14 up.

Parameters of each kind
function_graph { xRange: [min, max], yRange: [min, max], xStep, yStep, curves: [{ expr, domain?: [min | null, max | null], from?: "open" | "closed", to?: "open" | "closed", label?, dashed? }], points?: [{ x, y, label?, open? }], asymptotes?: [{ x, label? } | { y, label? }], xLabel?, yLabel? }
  expr is a formula in x: numbers, + - * / ^, parentheses, sin cos tan sqrt abs ln exp, pi, e; write every multiplication between letters or brackets explicitly, and put brackets round a power that follows a minus sign, as in -(x^2). Equal step sizes on both axes give square cells.
motion_graph { quantity?: "position" | "velocity" | "acceleration", series: [{ points: [[t, value], …], label?, dashed? }], interpolation?: "linear" | "smooth", showPoints?, tRange: [min, max], yRange: [min, max], tStep, yStep, tLabel?, yLabel? }
  tLabel and yLabel name the two axes with their units (they default to time in seconds and the quantity in SI units); with them this kind draws any straight-segment graph. Put every corner point on gridlines.
bar_chart { categories: [names], values: [numbers], yMin, yMax, yStep, yLabel?, xLabel?, showValues?: false }
line_plot { values: [every data value, repeated as often as it occurs], step, xLabel? }
scatter_plot { points: [[x, y] | { x, y, label?, series? }], xRange, yRange, xStep, yStep, xLabel?, yLabel?, trendLine?: { slope, intercept } | true, showEquation?: false }
reaction_coordinate { reactantsEnergy?: 0, productsEnergy, activationEnergies: [one per pathway, measured from the reactant level], curveLabels?: [one per pathway], reactantLabel?, productLabel?, units?: "kJ/mol", showAxisValues?: true, annotate?: ["Ea", "deltaH"] (arrows with the symbol only), annotateValues?: false }
  The energy axis is laid out by the program: choose round energies (multiples of 10 or 20 in the usual range) so that every level and peak falls on a gridline — a checker refuses a level that does not.
titration_curve { analyte: { type: "strong_acid" | "weak_acid" | "strong_base" | "weak_base", concentration (mol/L), volume (mL), pKa? (weak acid), pKb? (weak base) }, titrantConcentration (mol/L), maxVolume (mL), mark?: ["equivalence", "half_equivalence"] (a dot and guide lines, no numbers) }
  The pH axis runs 0 to 14 with gridlines every 1. The volume axis runs 0 to maxVolume in round steps (at most 8); choose the amounts so the equivalence volume falls on a gridline.
slope_field { expr (dy/dx as a formula in x and y), xRange, yRange, xStep, yStep, gridStep (spacing of the segments; a number or [xSpacing, ySpacing]), solutionThrough?: [x, y], showExpression?: false }
free_body_diagram { object: { shape?: "box" | "circle" | "person", label?, mass? }, surface?: { type: "horizontal" | "inclined" | "vertical" | "none", angle?, friction? }, forces: [{ name, magnitude? (text with unit), direction: "up" | "down" | "left" | "right" | "up-left" | "up-right" | "down-left" | "down-right" | "normal" | "up-slope" | "down-slope" | "into-surface" | an angle in degrees counter-clockwise from rightward }] }
  Each arrow is labelled "name = magnitude" (or the name alone). Arrow lengths are NOT to scale and an angle given as a number is not printed: anything the student needs must be in a printed label or in the question text.

alt text
- alt: one or two sentences (at most 600 characters) for a reader who cannot see the figure: what kind of figure it is and what its axes or parts show. It must NOT state the answer or the values to be read.

The answer is recomputed from the figure
- A program recomputes the answer from your specification. Name the checker that yields the stored answer in derivationChecker and give its arguments as JSON text in derivationArgsJson. The stored answer (for multiple choice: the keyed option, and no other option) must state exactly the checker's result; a disagreement discards the question. Indices are 0-based, in the order of the specification.
- When the answer is a further step beyond what any checker returns, or a judgement no checker makes, set derivationChecker to none and derivationArgsJson to {} — the question is then checked by independent solvers only. Prefer a question a checker can confirm.
Checkers, by kind:
${checkerCatalogue()}

Each item also carries
- hints: one or two, which point the way without giving the answer;
- solutionText: one to three sentences with the decisive steps, naming what is read off the figure;
- difficulty: 1 to 4;
- covers: one line naming the part of the objective the question exercises.

If the objective cannot honestly be practised with the assigned kind of figure, write NO question and list it under cannotWrite with a one-sentence reason.

Reply as JSON with items (one entry per question) and cannotWrite (an empty list when there is none).`;
