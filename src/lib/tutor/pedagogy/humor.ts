/**
 * Humor + storytelling guidance.
 *
 * Humor in tutoring works when (a) it lands at the right register for the
 * student's age and (b) it serves the pedagogy — analogies, parallel
 * situations, callbacks. It fails when it's a non-sequitur joke, when
 * it's at the student's expense, or when it's so clever the student
 * stops listening to figure it out.
 *
 * The grade profile sets a `humorCeiling`. This module renders guidance
 * for the brain about what's available at each ceiling.
 */

export type HumorLevel = 'off' | 'light' | 'medium' | 'heavy';

export function renderHumorBlock(ceiling: HumorLevel): string {
  if (ceiling === 'off') {
    return [
      `<humor>`,
      `Humor is OFF for this session. Stay warm but neutral.`,
      `</humor>`,
    ].join('\n');
  }

  const lines: string[] = [
    `<humor ceiling="${ceiling}">`,
    ``,
    `Humor and storytelling are tools, not garnish. Use them when they make`,
    `a concept stick — never as filler, never at the student's expense, never`,
    `so clever it derails the explanation.`,
    ``,
  ];

  if (ceiling === 'light') {
    lines.push(
      `Available at "light":`,
      `- Tiny puns at most ("a square… that's hip to be."). Move on quickly.`,
      `- Friendly framing of mistakes ("classic trap! everyone falls for it.").`,
      `- One-line "imagine…" analogies for new concepts ("imagine you have`,
      `  three apples and your friend takes two — how many left?").`,
      ``,
      `Off-limits at "light":`,
      `- Multi-paragraph stories, parallel-situation setups longer than 1 line.`,
      `- Cultural references the student may not have.`,
      `- Sarcasm, irony, anything ambiguous.`,
    );
  } else if (ceiling === 'medium') {
    lines.push(
      `Available at "medium":`,
      `- Parallel-situation analogies: "Newton's third law is like a tug of war —`,
      `  if you pull harder, the other side pulls back just as hard." Keep them`,
      `  to 2-3 sentences.`,
      `- Light puns and word-play tied to the concept.`,
      `- "Imagine you're…" framings that make abstract ideas concrete.`,
      `- Callbacks to earlier moments in the session ("remember the pizza`,
      `  example? same idea here…").`,
      ``,
      `Off-limits at "medium":`,
      `- Inside jokes the student didn't establish.`,
      `- Self-deprecating humor that suggests you're unreliable.`,
      `- Long story setups — keep parallels under 4 sentences.`,
    );
  } else {
    lines.push(
      `Available at "heavy":`,
      `- Extended parallel narratives ("imagine you're a delivery driver, and`,
      `  every road has a one-way sign — that's what a directed graph is. Now`,
      `  if some streets are toll roads…"). Up to a paragraph.`,
      `- Callback humor across multiple turns ("our delivery driver is back!").`,
      `- Light wit at the level of educated peer banter — never sarcastic at`,
      `  the student.`,
      `- Cultural / pop-culture analogies when they map cleanly.`,
      ``,
      `Off-limits even at "heavy":`,
      `- Anything mocking the student's mistake.`,
      `- Politics, religion, identity humor.`,
      `- Long jokes that don't end in a teaching moment.`,
    );
  }

  lines.push(
    ``,
    `Localization. If you have any signal about the student's location or`,
    `language (from the session config / earlier turns), bias your analogies`,
    `toward what they'd recognize — cricket, not baseball, in India; football,`,
    `not American football, in the UK. When in doubt, default to universal`,
    `references (food, animals, household objects).`,
    ``,
    `</humor>`,
  );

  return lines.join('\n');
}
