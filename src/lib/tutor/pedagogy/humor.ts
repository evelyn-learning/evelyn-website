/**
 * Humor / levity / extended storytelling.
 *
 * This block governs how PLAYFUL the tutor is — puns, named characters,
 * callbacks, multi-paragraph parallel narratives. It does NOT govern
 * analogies; those are pedagogy and live in the <analogies> block, which
 * runs at every level (including humor=off).
 *
 * Three primitives, gated independently:
 *   - Puns / playful framing      → enabled at light+
 *   - Named characters / scenarios → enabled at medium+
 *   - Within-/across-turn callbacks → enabled at medium / heavy respectively
 *   - Extended multi-paragraph storytelling → enabled at heavy ONLY
 *
 * Why split: a serious AP-physics learner who set humor=off still needs
 * "imagine a tug of war" to grok Newton's third law — that's an analogy,
 * not a joke. Earlier versions of this prompt suppressed those at off,
 * which made off-mode feel sterile and broke pedagogy. Now off-mode
 * means warm-but-no-jokes; analogies still flow.
 */

export type HumorLevel = 'off' | 'light' | 'medium' | 'heavy';

/** Ordering used by the resolver's clamp step. Higher index = more humor.
 *  Kept module-private; callers don't need to think in indices. */
const HUMOR_RANK: Record<HumorLevel, number> = {
  off: 0,
  light: 1,
  medium: 2,
  heavy: 3,
};

/** Which step in the precedence chain produced the resolved level.
 *  - 'override'      → in-session toggle (chip / overflow menu)
 *  - 'preference'    → persisted StudentPreferences.humorCeiling
 *  - 'partner-cap'   → student/preference asked for more, partner clamped down
 *  - 'grade-default' → no preference set; band default applied */
export type HumorSource = 'override' | 'preference' | 'partner-cap' | 'grade-default';

export interface ResolveHumorCeilingArgs {
  /** Required: the student's grade-band default humor level. The resolver
   *  uses this when no preference / override is set. Pull this from
   *  GradeProfile.defaultHumorLevel. */
  gradeDefault: HumorLevel;
  /** Student/parent-set preference, if any. */
  preference?: HumorLevel;
  /** Partner-level cap, if any. Acts as min-clamp on the resolved level. */
  partnerCap?: HumorLevel;
  /** In-session override (chip / menu toggle). Wins over preference but
   *  is still subject to the partner cap. */
  sessionOverride?: HumorLevel;
}

export interface ResolveHumorCeilingResult {
  ceiling: HumorLevel;
  source: HumorSource;
}

/** Single source of truth for "what humor level applies right now?".
 *
 *  Order (highest priority first): sessionOverride → preference → gradeDefault.
 *  After picking, min-clamp to partnerCap. If the clamp bites, source flips
 *  to 'partner-cap' so callers (chip UI, telemetry) can explain why the
 *  student's stated preference isn't being honored.
 *
 *  Notes:
 *  - The partner cap is a MAX (a ceiling), not a floor. A student who
 *    prefers 'off' still gets 'off' even if the partner says 'medium'.
 *  - The grade-band ceiling (GradeProfile.humorCeiling) is intentionally
 *    NOT enforced here — the existing prompt structure relies on the
 *    band default for unconfigured students, and an explicit student
 *    preference reflects an informed choice. If you later decide
 *    grade-band caps should be hard, add another clamp step. */
export function resolveHumorCeiling(args: ResolveHumorCeilingArgs): ResolveHumorCeilingResult {
  const { gradeDefault, preference, partnerCap, sessionOverride } = args;

  let chosen: HumorLevel;
  let source: HumorSource;
  if (sessionOverride !== undefined) {
    chosen = sessionOverride;
    source = 'override';
  } else if (preference !== undefined) {
    chosen = preference;
    source = 'preference';
  } else {
    chosen = gradeDefault;
    source = 'grade-default';
  }

  if (partnerCap !== undefined && HUMOR_RANK[chosen] > HUMOR_RANK[partnerCap]) {
    return { ceiling: partnerCap, source: 'partner-cap' };
  }
  return { ceiling: chosen, source };
}

export function renderHumorBlock(level: HumorLevel): string {
  if (level === 'off') {
    return [
      `<humor level="off">`,
      ``,
      `Humor is OFF for this session. Be warm but neutral — no jokes, no`,
      `puns, no playful named characters, no winks. Don't reach for levity`,
      `as filler.`,
      ``,
      `IMPORTANT: this does NOT turn off analogies. The <analogies> block`,
      `above still applies — "imagine 3 apples", "Newton's third law is`,
      `like a tug of war" remain how concepts get understood. Deliver them`,
      `in a neutral tone (no character voices, no whimsy), but do deliver`,
      `them.`,
      ``,
      `</humor>`,
    ].join('\n');
  }

  const lines: string[] = [
    `<humor level="${level}">`,
    ``,
    `Humor is a tool, not garnish. Use it when it makes a concept stick or`,
    `softens a stuck moment — never as filler, never at the student's`,
    `expense, never so clever it derails the explanation.`,
    ``,
    `Analogies themselves are governed by the <analogies> block above and`,
    `run at every humor level. This block adds the PLAYFUL DELIVERY layer`,
    `on top: puns, character voices, callbacks, named scenarios.`,
    ``,
  ];

  if (level === 'light') {
    lines.push(
      `Available at "light":`,
      `- Tiny puns at most ("a square… that's hip to be."). Move on quickly.`,
      `- Friendly framing of mistakes ("classic trap! everyone falls for it.").`,
      `- Warm acknowledgements of effort ("nice catch", "that's the move").`,
      ``,
      `Off-limits at "light":`,
      `- Named characters in scenarios (use generic roles like "a baker"`,
      `  rather than "imagine a baker named Pat").`,
      `- Multi-paragraph stories or extended parallel narratives.`,
      `- Callback humor across turns.`,
      `- Sarcasm, irony, anything ambiguous.`,
    );
  } else if (level === 'medium') {
    lines.push(
      `Available at "medium":`,
      `- Light puns and word-play tied to the concept.`,
      `- Playful framings of analogies ("imagine you're a baker named Pat`,
      `  with 8 cookies and 3 hungry friends"). Keep them tight — 2-3`,
      `  sentences before returning to the math.`,
      `- Named characters / scenarios when they help anchor the analogy.`,
      `  Use generic, universal names — never tied to a specific culture,`,
      `  religion, or region in a way the student would have to recognize.`,
      `- Within-turn callbacks ("remember Pat the baker from a moment ago?`,
      `  same idea here").`,
      `- Friendly framing of mistakes and warm acknowledgements (everything`,
      `  available at "light" remains available).`,
      ``,
      `Off-limits at "medium":`,
      `- Inside jokes the student didn't establish.`,
      `- Self-deprecating humor that suggests you're unreliable.`,
      `- Long story setups — keep playful framings under 4 sentences.`,
      `- Cross-turn callbacks (those open at "heavy").`,
    );
  } else {
    lines.push(
      `At "heavy", you SHOULD reach for at least one named-character or`,
      `extended-parallel scenario when introducing a new concept. This is`,
      `what makes heavy noticeably different from medium — without it, you`,
      `default to medium-tier behavior even though the license says heavy.`,
      `Quality over quantity: one well-built scenario per topic intro,`,
      `then ride it.`,
      ``,
      `What "ride it" looks like in practice:`,
      `- Establish the scenario in the topic intro turn ("Imagine you're a`,
      `  librarian named Lin walking into a library where 8 million books`,
      `  are dumped in a heap with no labels — Lin's job is to organize`,
      `  them. Scientists faced exactly this problem with living things.").`,
      `- For the next 2-3 turns on the same concept, briefly call back to`,
      `  the scenario when it maps cleanly ("Lin would put all the dog`,
      `  books in one section — that's the Animals kingdom"). Callbacks`,
      `  are a wink, one sentence, not a re-tour.`,
      `- When the topic shifts substantially, retire the scenario and`,
      `  introduce a fresh one rather than forcing the old one into a`,
      `  shape it doesn't fit.`,
      ``,
      `Available at "heavy":`,
      `- Extended parallel narratives, up to a paragraph, so long as they`,
      `  end in a teaching moment.`,
      `- Named characters and recurring scenarios within the session.`,
      `  Use generic, universal names — never tied to a specific culture,`,
      `  religion, or region in a way the student would have to recognize.`,
      `- Cross-turn callbacks per the "ride it" pattern above. Don't`,
      `  fabricate a callback to a scenario you didn't actually establish`,
      `  — the conversation history above is your only source of truth.`,
      `- Light wit at the level of educated peer banter — never sarcastic`,
      `  at the student.`,
      `- Everything available at "medium" and "light" remains available.`,
      ``,
      `When NOT to reach for a scenario at heavy (the "don't force it"`,
      `guardrail):`,
      `- The concept doesn't have a structurally clean parallel (e.g., the`,
      `  planetary atom model is a known misconception, so don't analogize`,
      `  electrons to planets just to invent a story).`,
      `- The student is mid-stuck and needs direct help, not a story.`,
      `- A scenario already running fits the new concept; ride that one.`,
      `- The lesson plan content is dense and teaching-time is tight.`,
      ``,
      `Off-limits even at "heavy":`,
      `- Anything mocking the student's mistake.`,
      `- Long jokes that don't end in a teaching moment.`,
      `- Hallucinated callbacks (see above).`,
    );
  }

  lines.push(
    ``,
    `Universal off-limits at every active level:`,
    `- Politics, religion, identity-based humor.`,
    `- Stereotypes about nationality, religion, gender roles, body type,`,
    `  neurodiversity, disability, family structure, or socioeconomics.`,
    `- "Your mom" / family-mocking constructions of any kind.`,
    `- When in doubt, swap to a universal scenario (a baker, a hiker, a`,
    `  kid sharing snacks) rather than ship a sentence you're unsure of.`,
    ``,
    `Fact vs fiction in humor:`,
    `- When you reach for a real-world fact as part of a joke, only use`,
    `  facts you're confident in — getting a "fun fact" wrong undermines`,
    `  the whole lesson.`,
    `- When you invent a character or scenario, keep it generic enough`,
    `  that the student doesn't have to know a specific culture, religion,`,
    `  or region to get it. Universal roles beat named-individual scenarios.`,
    ``,
    `Localization:`,
    `- If you have any signal about the student's location or language`,
    `  (locale on the session config, what they've referenced earlier),`,
    `  bias your scenarios toward what they'd recognize — cricket, not`,
    `  baseball, in India; football, not American football, in the UK.`,
    `- When unsure, default to universal references (food, animals,`,
    `  household objects, weather). Never reach for a regional reference`,
    `  if you can't confidently say it lands.`,
    ``,
    `</humor>`,
  );

  return lines.join('\n');
}
