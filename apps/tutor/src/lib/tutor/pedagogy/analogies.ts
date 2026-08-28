/**
 * Analogies and concrete-pictorial-abstract framing.
 *
 * Analogies aren't humor — they're how concepts get understood. "Imagine
 * you have 3 apples and a friend takes 2" is arithmetic pedagogy, not a
 * joke. "Newton's third law is like a tug of war" is physics pedagogy,
 * not a punchline. A student set to humor=off (a serious learner who
 * just wants the material) still needs these.
 *
 * Earlier versions of the prompt bundled analogies inside the humor
 * block, which meant turning humor off accidentally turned analogies off
 * too. This module separates the concerns: analogies are always on, the
 * humor block governs whether the framing is *playful*.
 *
 * Length expectations scale with grade band — a K-2 analogy is one
 * sentence with concrete objects; a 9-12 analogy is at most one per
 * concept, two sentences, tightly mapped to the concept's structure
 * (a third sentence only if the mapping genuinely needs it).
 */

import type { GradeProfile } from './grade-profile';

export function renderAnalogiesBlock(profile: GradeProfile): string {
  const lengthGuidance: string = (() => {
    switch (profile.band) {
      case 'K-2':
        return `One sentence, concrete objects the student can picture (apples, blocks, friends). Never abstract.`;
      case '3-5':
        return `One to two sentences. Picture-able situations (sharing food, sports moves, weather) before symbols.`;
      case '6-8':
        return `Two or three sentences. Real-world parallels (recipes, sports, money, journeys) that map cleanly to the structure of the concept.`;
      case '9-12':
        return `At most one analogy per concept, two sentences; a third only if the mapping genuinely needs it. Real-world parallels chosen for structural fidelity, not just relatability — a bad analogy that breaks down halfway through is worse than no analogy.`;
    }
  })();

  return [
    `<analogies>`,
    ``,
    `Analogies and concrete-pictorial-abstract framing are pedagogy, not`,
    `humor. They are ALWAYS available regardless of the humor level — even`,
    `at humor=off. A student who's chosen a serious tone still needs to`,
    `picture three apples to learn arithmetic, or a tug of war to picture`,
    `forces.`,
    ``,
    `When you reach for an analogy:`,
    `- Pick one whose STRUCTURE matches the concept, not one that's just`,
    `  superficially relatable. "Voltage is like water pressure" works`,
    `  because pressure does drive flow; "voltage is like a busy highway"`,
    `  doesn't, because traffic is rate-limited differently than current.`,
    `- Ground new ideas in something the student can SEE first, then a`,
    `  picture, then symbols (concrete-pictorial-abstract).`,
    `- Length for ${profile.band}: ${lengthGuidance}`,
    `- If the analogy starts to drift from the concept, abandon it. A`,
    `  half-broken analogy teaches the wrong thing.`,
    `- The student's listed interests are HOBBIES they enjoy, not expertise`,
    `  — assume no technical knowledge of the interest's own domain. A`,
    `  music-loving student gets "a steady beat", not chord theory, interval`,
    `  names, or metronome markings; a football fan gets "passing the ball",`,
    `  not formation jargon. Explain any domain term you do use, in plain`,
    `  words, the moment you use it — or pick a simpler image instead.`,
    `- Draw analogies from everyday domains a student of this age knows`,
    `  FIRSTHAND (food, games, sports, school, journeys, weather, phones).`,
    `  Adult or specialist domains — financial markets and stock prices,`,
    `  workplaces, mortgages, taxes — are off the table unless the student`,
    `  brought them up or lists them as an interest.`,
    `- VARY the domain. Once you've used the same analogy domain twice in`,
    `  a session, switch to a different one — the third stock-market (or`,
    `  cooking, or sports) comparison in a row stops illuminating and`,
    `  starts sounding like a tic.`,
    ``,
    `Whether the analogy is delivered playfully (named characters, puns)`,
    `or neutrally is governed by the <humor> block below — analogies run`,
    `at every humor level, but their tone matches the active humor level.`,
    ``,
    `</analogies>`,
  ].join('\n');
}
