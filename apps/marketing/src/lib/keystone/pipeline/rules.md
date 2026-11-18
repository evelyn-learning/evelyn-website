<!--
  Solution rules: the single source for the author's instructions (write.ts) and the
  rules audit. Every line that starts with "- [" is one rule, in exactly this form:

    - [R-some-id] (appliesTo, YYYY-MM-DD) One checkable statement.

  appliesTo: all | short | diploma | extended | alternate | errors | figure | table.
  The date is when the rule was given. Ids are short, kebab-case, unique and stable:
  never rename or reuse one (audit findings and history refer to it).
  To add a rule (e.g. a new reviewer note): add one line under the right heading,
  one checkable statement per line (split compound notes), neutral wording
  ("reviewer rule"), checkable by reading the solution and the question alone.
  loadRules() throws on a malformed rule line or a duplicate id; other lines are ignored.
-->

# Solution rules

## Every section

- [R-order] (all, 2026-11-11) The sections appear in this order: Short answer, the second section (Diploma-style answer, or the course's own title), Extended answer, Alternate answer, Common errors.
- [R-required-sections] (all, 2026-11-11) The Short answer and the second section are always present; Extended answer, Alternate answer and Common errors are left out entirely when not warranted.
- [R-answer-agreed] (all, 2026-11-17) Every final answer stated anywhere in the solution is exactly the agreed answer (same option letter, value or labels).
- [R-question-untouched] (all, 2026-11-17) The item's own question and options are never rewritten; when the solution quotes them, it quotes them exactly.
- [R-no-making-of] (all, 2026-11-17) Nothing in the solution says how it was made: no mention of a model, vendor, tool, "AI", generation or automation.
- [R-no-other-solution] (all, 2026-11-17) The solution never mentions or refers to any other solution to the item.
- [R-no-option-tour] (all, 2026-11-11) No section tours the wrong options: there is no option-by-option account of why each wrong choice is wrong.
- [R-no-diploma-wording] (all, 2026-11-11) The words "diploma", "Diploma exam" or any province or jurisdiction name appear only when the course is a diploma course (Math 30-1, Math 30-2, Biology 30, Chemistry 30, Physics 30, Science 30).
- [R-no-exam-note] (all, 2026-11-11) There is no "Diploma note" or other aside about a provincial exam unless the course is a diploma course.
- [R-canadian-spelling] (all, 2026-11-11) Spelling is Canadian (labelled, colour, centre, metre, analyze).
- [R-si-units] (all, 2026-11-11) Quantities use SI units and symbols.
- [R-unit-space] (all, 2026-11-11) A space separates every number from its unit, e.g. $9.81\ \text{m/s}^2$, 12 kg.
- [R-decimal-places] (all, 2026-11-11) A quantity keeps the same number of decimal places everywhere it appears.
- [R-italic-variables] (all, 2026-11-11) Variables are italic, written in LaTeX ($x$, $v_{AB}$); units and chemical symbols are upright ($\text{m/s}$, $\text{Sn}^{2+}$).
- [R-latex-math] (all, 2026-11-11) Mathematics and chemical formulas are written in LaTeX: $…$ inline and $$…$$ for display.
- [R-compass-caps] (all, 2026-11-17) Compass directions in the solution's own text are capitalised (North, South of East); text quoted from the question keeps its own wording.

## Short answer

- [R-short-length] (short, 2026-11-11) The Short answer is one or two sentences.
- [R-short-direct] (short, 2026-11-16) The Short answer answers the question stem directly; it states the answer, not an explanation of why.
- [R-short-stem-words] (short, 2026-11-16) The Short answer reuses the stem's own words: a stem "What is the balanced oxidation half-reaction for the given reaction?" gets "The balanced oxidation half-reaction for <the reaction> is <the half-reaction>".
- [R-short-restate-only] (short, 2026-11-11) The Short answer restates only the parts of the question that matter to the answer, nothing extra.
- [R-short-no-plan] (short, 2026-11-11) The Short answer contains no plan.
- [R-short-no-method] (short, 2026-11-11) The Short answer contains no method or working.
- [R-short-option-letter] (short, 2026-11-11) For a multiple-choice question the Short answer names the option letter of the answer.

## Second section (Diploma-style answer)

- [R-diploma-lean] (diploma, 2026-11-11) The second section is what a strong student writes on the exam within the time limit: lean working, no teaching asides.
- [R-diploma-plan] (diploma, 2026-11-11) For a multi-part question the second section opens with the plan in one line ("First find A, which gives C and D; then P and Q").
- [R-diploma-choice-logic] (diploma, 2026-11-11) The second section gives explicit logic for choosing the answer.
- [R-diploma-course-methods] (diploma, 2026-11-11) The second section uses only methods taught at the level of the item's course.
- [R-diploma-round-last] (diploma, 2026-11-11) Rounding to the answer's precision happens only at the final step; intermediate values carry extra digits.
- [R-diploma-final-sentence] (diploma, 2026-11-11) The second section ends with one clear final-answer sentence.
- [R-diploma-no-alternate] (diploma, 2026-11-17) The second section presents one method only; a second method never appears inside it.
- [R-diploma-shortcut] (diploma, 2026-11-11) A one-line thought shortcut may appear in the second section only for Biology or Chemistry courses, and is at most one line.

## Extended answer

- [R-extended-warranted] (extended, 2026-11-11) The Extended answer is present only when there is teaching to add beyond the second section.
- [R-extended-teaching] (extended, 2026-11-11) The Extended answer teaches: step-by-step reasoning, why each move is allowed, and links back to Grade 10–12 foundations (an extra diagram where it helps).
- [R-extended-restate] (extended, 2026-11-11) The Extended answer restates the final answer at its end.

## Alternate answer

- [R-alternate-warranted] (alternate, 2026-11-11) The Alternate answer is present only when a genuinely different valid method exists, not a reworded version of the first method.
- [R-alternate-own-section] (alternate, 2026-11-17) An alternate method appears only in its own Alternate answer section, never inside the second section or any other section.
- [R-alternate-full] (alternate, 2026-11-11) The Alternate answer shows full working.
- [R-alternate-same-answer] (alternate, 2026-11-11) The Alternate answer ends at the same final answer.

## Common errors

- [R-errors-sparingly] (errors, 2026-11-11) Common errors is used sparingly: only for a slip students really make on this question.
- [R-errors-max-two] (errors, 2026-11-11) Common errors has at most two bullets.
- [R-errors-slip-and-fix] (errors, 2026-11-11) Each Common errors bullet names the slip and how to avoid it.

## Figures

- [R-figure-width] (figure, 2026-11-11) A figure is at most 240 px wide (its width attribute and viewBox), so it reads on a phone.
- [R-figure-primary-line] (figure, 2026-11-11) Primary lines in a figure are 1.33 px (1 pt) wide.
- [R-figure-secondary-line] (figure, 2026-11-11) Secondary lines in a figure are 0.67 px (0.5 pt) wide.
- [R-figure-labels] (figure, 2026-11-11) Figure labels are Arial 12 px.
- [R-figure-text-black] (figure, 2026-11-11) All text in a figure is black; colour is used only on curves, lines and arrows.
- [R-figure-alt] (figure, 2026-11-11) Every figure and image has alt text that describes it in a linear order a screen reader can read, with every symbol written out in Unicode.

## Tables

- [R-table-no-vertical-rules] (table, 2026-11-11) Tables have no vertical rules.
- [R-table-caption] (table, 2026-11-11) A table's caption is above it, written as a "Table: Caption text" line directly above the table.
- [R-table-units-header] (table, 2026-11-11) Units go in the column headers, e.g. "Volume (mL)", not in the cells.
- [R-table-dash] (table, 2026-11-11) A cell that does not apply holds a dash (–), never nothing.
- [R-table-no-nesting] (table, 2026-11-11) Tables are never nested.
