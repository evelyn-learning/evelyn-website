<!--
  Solution rules: the single source for the author's instructions (write.ts) and the
  rules audit. Every rule is one line, in exactly one of these forms:

    - [R-some-id] (appliesTo, YYYY-MM-DD) One checkable statement.           (a reviewer rule)
    - [R-some-id] (appliesTo, YYYY-MM-DD, house) One checkable statement.    (our own house rule)

  appliesTo: all | short | diploma | extended | alternate | errors | figure | table.
  The date is when the rule was given. Ids are short, kebab-case, unique and stable:
  never rename or reuse one (audit findings and history refer to it).
  To add a rule (e.g. a new reviewer note): add one line under the right heading,
  one checkable statement per line (split compound notes), neutral wording
  ("reviewer rule"), checkable by reading the solution and the question alone.
  Mark it "house" when the requirement is ours, not the reviewer's.
  Where no rule here applies, follow Chicago/journal style (reviewer, 2026-11-16);
  that is guidance, not an audited rule.
  loadRules() throws on a malformed rule line (including a numbered or unbulleted line
  that names a rule id, and a date that does not exist), a duplicate id, or a file with
  no rules; other lines are ignored.
-->

# Solution rules

## Every section

- [R-order] (all, 2026-11-11) The sections appear in this order: Short answer, the second section (Diploma-style answer, or the course's own title), Extended answer, Alternate answer, Common errors.
- [R-short-present] (all, 2026-11-11) The Short answer is always present.
- [R-diploma-present] (all, 2026-11-11) The second section is always present.
- [R-optional-omitted] (all, 2026-11-11) An Extended answer, Alternate answer or Common errors section that is not warranted is left out entirely, heading included.
- [R-answer-first] (all, 2026-10-08) The correct answer is stated at the top, before any steps.
- [R-answer-agreed] (all, 2026-11-17, house) Every final answer stated anywhere in the solution is exactly the agreed answer (same option letter, value or labels).
- [R-question-untouched] (all, 2026-11-17, house) The item's own question and options are never rewritten; when the solution quotes them, it quotes them exactly.
- [R-no-making-of] (all, 2026-11-17, house) Nothing in the solution says how it was made: no mention of a model, vendor, tool, "AI", generation or automation.
- [R-no-other-solution] (all, 2026-11-17, house) The solution never mentions or refers to any other solution to the item.
- [R-no-option-tour] (all, 2026-11-11) No section tours the wrong options: there is no option-by-option account of why each wrong choice is wrong.
- [R-no-exam-note] (all, 2026-11-11) There is no "Diploma note" or other aside about the provincial exam unless the course is a diploma course.
- [R-no-diploma-wording] (all, 2026-11-17, house) The words diploma, exam, Alberta or any jurisdiction name appear only when the course is a diploma course.
- [R-no-collapsible] (all, 2026-11-16) No section or part of the written solution is collapsible or hidden behind a control.
- [R-canadian-spelling] (all, 2026-11-11) Spelling is Canadian (labelled, colour, centre).
- [R-si-units] (all, 2026-11-11) Quantities use SI units.
- [R-unit-space] (all, 2026-11-11) A space separates every number from its unit, e.g. $9.81\ \text{m/s}^2$.
- [R-decimal-places] (all, 2026-11-11) Decimal places are kept consistent.
- [R-italic-variables] (all, 2026-11-11) Variables are italic.
- [R-latex-variables] (all, 2026-11-11, house) Variables are written in LaTeX, e.g. $x$, $v_{AB}$.
- [R-upright-units] (all, 2026-11-11, house) Units and chemical symbols are upright, e.g. $\text{m/s}$, $\text{Sn}^{2+}$.
- [R-latex-math] (all, 2026-11-11, house) Mathematics and chemical formulas are written in LaTeX: $…$ inline and $$…$$ for display.
- [R-compass-caps] (all, 2026-10-08) Compass directions in the solution's own text are capitalised (North, South of East); text quoted from the question keeps its own wording.
- [R-zero-o] (all, 2026-11-16) The digit 0 and the letter O are distinguishable wherever both could be read.

## Short answer

- [R-short-length] (short, 2026-11-11) The Short answer is one or two sentences.
- [R-short-direct] (short, 2026-11-16) The Short answer answers the question stem directly; it states the answer, not an explanation of why.
- [R-short-stem-words] (short, 2026-11-16) The Short answer reuses the stem's own words: a stem "What is the balanced oxidation half-reaction for the given reaction?" gets "The balanced oxidation half-reaction for <the reaction> is <the half-reaction>".
- [R-short-restate-only] (short, 2026-11-11) The Short answer restates only the parts of the question that matter to the answer, nothing extra.
- [R-short-no-plan] (short, 2026-11-11) The Short answer contains no plan.
- [R-short-no-method] (short, 2026-11-11) The Short answer contains no method or working.
- [R-short-option-letter] (short, 2026-11-11) For a multiple-choice question the Short answer names the option letter of the answer.
- [R-short-closing] (short, 2026-11-17, house) A multiple-choice Short answer ends with the sentence 'So the answer is X.' (or 'So the answers are X and Y.').

## Second section (Diploma-style answer)

- [R-diploma-lean] (diploma, 2026-11-11) The second section is lean: what a strong student writes on the exam within the time limit.
- [R-diploma-no-asides] (diploma, 2026-11-11, house) The second section contains no teaching asides.
- [R-diploma-plan] (diploma, 2026-11-11) For a multi-part question the second section opens with the plan in one line ("First find A, which gives C and D; then P and Q").
- [R-diploma-choice-logic] (diploma, 2026-11-11) The second section gives explicit logic for choosing the answer.
- [R-diploma-course-methods] (diploma, 2026-11-11) Every method used is one taught in the named course or earlier.
- [R-diploma-steps] (diploma, 2026-10-08) Intermediate working is shown: no line combines several steps a student would write separately.
- [R-diploma-round-last] (diploma, 2026-11-11) Rounding happens only at the final step.
- [R-diploma-intermediate-digits] (diploma, 2026-11-11, house) Intermediate values that are shown carry at least one more digit than the final answer.
- [R-diploma-summary] (diploma, 2026-11-11) A long derivation ends with a brief summary of its logic before the final-answer sentence.
- [R-diploma-closing] (diploma, 2026-11-17, house) A multiple-choice Diploma answer ends with the sentence 'So the answer is X.' (or 'So the answers are X and Y.').
- [R-diploma-final-sentence] (diploma, 2026-11-11) The second section ends with one clear final-answer sentence.
- [R-diploma-shortcut] (diploma, 2026-11-11) A Biology or Chemistry Diploma answer may add a one-line thought shortcut; it is at most one line.

## Extended answer

- [R-extended-warranted] (extended, 2026-11-11) An Extended answer is present only when it adds teaching the second section does not contain.
- [R-extended-steps] (extended, 2026-11-11) The Extended answer gives step-by-step reasoning.
- [R-extended-why] (extended, 2026-11-11) The Extended answer says why each move is allowed.
- [R-extended-foundations] (extended, 2026-11-11) The Extended answer links back to Grade 10–12 foundations.
- [R-extended-diagram] (extended, 2026-11-11) The Extended answer may add a diagram the second section does not have.
- [R-extended-restate] (extended, 2026-11-11) The Extended answer restates the final answer at its end.

## Alternate answer

- [R-alternate-warranted] (alternate, 2026-11-11) An Alternate answer uses a method that differs from the second section's method in its steps, not only in its wording.
- [R-alternate-own-section] (alternate, 2026-11-17, house) A second method appears only in its own Alternate answer section, never inside the second section or any other section.
- [R-alternate-full] (alternate, 2026-11-11) The Alternate answer shows full working.
- [R-alternate-same-answer] (alternate, 2026-11-11) The Alternate answer ends at the same final answer.

## Common errors

- [R-errors-optional] (errors, 2026-11-11) Common errors is optional and used sparingly: it is omitted when there is no slip worth warning about.
- [R-errors-max-two] (errors, 2026-11-11) Common errors lists at most two errors.
- [R-errors-slip-and-fix] (errors, 2026-11-11) Each Common errors bullet names the slip and how to avoid it.
- [R-errors-corrected] (errors, 2026-10-08) A common error is stated and corrected at once; it is not left as a wrong statement.

## Figures

- [R-figure-width] (figure, 2026-11-11) A figure is at most 240 px wide.
- [R-figure-primary-line] (figure, 2026-11-11) Primary lines in a figure are 1.33 px (1 pt) wide.
- [R-figure-secondary-line] (figure, 2026-11-11) Secondary lines in a figure are 0.67 px (0.5 pt) wide.
- [R-figure-labels] (figure, 2026-11-11, house) Figure labels are in Arial.
- [R-figure-label-size] (figure, 2026-11-11, house) Figure labels are 12 px.
- [R-figure-text-black] (figure, 2026-11-11) Text in a figure stays black.
- [R-figure-curve-colour] (figure, 2026-11-11) Curves in a figure may use colour.
- [R-figure-line-colour] (figure, 2026-11-11, house) Lines and arrows in a figure may also use colour.
- [R-figure-italic-variables] (figure, 2026-10-08) Variables in figures are italic, the same as in the text.
- [R-figure-axis-intervals] (figure, 2026-10-08) Axis intervals in a graph are consistent along each axis.
- [R-figure-glyphs-readable] (figure, 2026-11-16) Every glyph in a figure is available to a screen reader through its alt text.
- [R-figure-alt] (figure, 2026-11-11, house) Every figure has alt text.
- [R-figure-alt-linear] (figure, 2026-11-11, house) Figure alt text is linear, in an order a screen reader can read.
- [R-figure-alt-unicode] (figure, 2026-11-11, house) Figure alt text writes every symbol in Unicode.
- [R-image-alt] (figure, 2026-11-11, house) Every image in the solution has alt text.

## Tables

- [R-table-no-vertical-rules] (table, 2026-11-11) Tables have no vertical rules.
- [R-table-caption] (table, 2026-11-11) A table's caption is above the table.
- [R-table-caption-syntax] (table, 2026-11-11, house) A table's caption is written as a "Table: Caption text" line directly above the table.
- [R-table-units-header] (table, 2026-11-11) Units go in the column headers, e.g. "Volume (mL)".
- [R-table-no-units-in-cells] (table, 2026-11-11, house) Table cells do not repeat the unit.
- [R-table-dash] (table, 2026-11-11) A cell that does not apply holds a dash, never nothing.
- [R-table-dash-glyph] (table, 2026-11-11, house) The not-applicable dash is an en dash (–).
- [R-table-no-nesting] (table, 2026-11-11) Tables are never nested.
- [R-table-text-black] (table, 2026-11-16) Table text is black.
- [R-table-decimal-align] (table, 2026-11-16) Numbers in a table column are aligned on the decimal point.
- [R-table-footnotes] (table, 2026-11-16) Table footnotes use superscript letters.
