/**
 * AP English Language & Composition — Unit 7 CED 7.4: Rhetorical Risk and
 * Control of Style.
 *
 * Hand-authored baseline (mirrors the lesson plan
 * `evelyn.ap.englang.rhetorical-risk.v1`). Builds on 7.3 (broader context):
 * the final route to the AP rubric's SOPHISTICATION point covered in this
 * unit is stylistic — a writer who takes a genuine RHETORICAL RISK (irony,
 * an unexpected structural choice, a deliberately provocative persona) and
 * maintains full CONTROL over it throughout.
 *
 * Anchor text: Jonathan Swift, "A Modest Proposal" (1729). The teaching
 * point is Swift's sustained ironic persona — an earnest, statistic-laden
 * economic tone that never breaks even as it proposes something monstrous,
 * with the "delicious nourishing food" line as the canonical turn. Only this
 * one short phrase is quoted, per the passage's own content-safety note; no
 * further graphic detail is repeated or elaborated.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_ENGLANG_RHETORICAL_RISK: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.englang.rhetorical-risk.v1',
  course: 'AP English Language & Composition',
  cedUnit: 7,
  cedTopic: '7.4',
  cedTitle: 'Rhetorical Risk and Control of Style',
  planId: 'evelyn.ap.englang.rhetorical-risk.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.englang.rhetorical-risk.v1' }],
  theory: [
    {
      loId: 'apenglang.rhetorical-risk',
      kind: 'definition',
      title: 'rhetorical risk',
      content:
        'A stylistic choice that departs from safe, literal, expected writing — irony, an unexpected structural move, a deliberately adopted persona, a provocative register or tone — chosen because it can accomplish something a plain, safe style cannot.',
    },
    {
      loId: 'apenglang.rhetorical-risk',
      kind: 'definition',
      title: 'control of style',
      content:
        'What separates a successful risk from a failure: the writer sustains the choice DELIBERATELY and CONSISTENTLY, so the effect the reader experiences (unease, dark humor, discomfort) is the one the writer intended — not tone that wanders, irony the writer seems unaware of, or a persona that breaks and reveals itself as sincere by accident.',
    },
    {
      loId: 'apenglang.rhetorical-risk',
      kind: 'definition',
      title: 'persona and irony',
      content:
        'A **persona** is an adopted voice distinct from the writer\'s own sincere position — the writer speaks AS a character or stance they do not actually hold, to expose something about that stance by inhabiting it fully. **Irony** is saying one thing while meaning (or intending the reader to recognize) another; persona is one of irony\'s most common vehicles.',
    },
    {
      loId: 'apenglang.rhetorical-risk',
      kind: 'framework',
      title: 'the test for control',
      content:
        "Does the writer sustain the chosen voice/tone/structure CONSISTENTLY across the passage, with signals (excess, absurdity, a jarring juxtaposition) that a careful reader can use to recognize the gap between the surface and the real meaning? An uncontrolled risk breaks character, becomes literal where it should stay ironic, or loses the reader about what's meant sincerely versus not.",
    },
    {
      loId: 'apenglang.rhetorical-risk',
      kind: 'strategy',
      title: 'Swift\'s sustained persona',
      content:
        'Swift\'s "A Modest Proposal" is the canonical example: he adopts the persona of a coolly rational economic reformer, sustaining an earnest, statistic-laden, problem-solving tone for paragraph after paragraph before that same even, reasonable voice proposes something monstrous. The tonal consistency IS the risk\'s control: the persona never winks, never breaks into open outrage, which is exactly what makes the reader supply the outrage the text itself withholds.',
    },
    {
      loId: 'apenglang.rhetorical-risk',
      kind: 'strategy',
      title: 'why the risk pays off',
      content:
        "The risk pays off because the writer's controlled commitment to an absurd, unbroken logic FORCES the reader to do the moral work the text refuses to do explicitly — a direct, sincere denunciation of the same conditions would be safer, clearer, and far less memorable or persuasive. This is a route to the SOPHISTICATION point because it requires demonstrating control over style and voice throughout a text, not just a single clever line.",
    },
    {
      loId: 'apenglang.rhetorical-risk',
      kind: 'strategy',
      title: 'a safe style is competent, not memorable',
      content:
        "A writer who states a harsh truth plainly and safely is competent — the claim lands, nothing goes wrong, and nothing about the delivery is memorable. A writer who commits to an ironic persona, an unexpected structure, or a provocative register — and never breaks it — is taking a real risk that, controlled, produces something a safe style never could: the reader supplies part of the meaning themselves.",
    },
    {
      loId: 'apenglang.rhetorical-risk',
      kind: 'trap',
      title: 'shock is not sophistication',
      content:
        "Treating the mere PRESENCE of a shocking or risky idea as evidence of sophistication, without analyzing whether the writer maintains CONTROL over it, is a common error — plenty of careless writing is shocking by accident. The test: can you point to the persona or register being maintained across MULTIPLE moments, not just note that one moment is disturbing?",
    },
  ],
  methods: [
    {
      title: "Analyze a writer's controlled rhetorical risk",
      when_to_use:
        'Use when a passage sustains an unusual voice, register, or persona across multiple sentences or paragraphs — especially one that stays consistent even as its content grows more extreme.',
      steps: [
        'NAME THE RISK BEING TAKEN — what departure from safe, literal writing is present (irony, persona, register, structure)?',
        'SHOW THE PERSONA OR REGISTER BEING BUILT AND SUSTAINED — track the tone across several moves, not just one line.',
        'IDENTIFY THE MOMENT OF MAXIMUM RISK — where does the same tone get applied to its most extreme or startling content, without any shift in register?',
        'EXPLAIN WHY THIS IS CONTROL, NOT ACCIDENT — what would collapse if the tone broke here instead of holding steady?',
        'EXPLAIN WHAT THE CONTROLLED RISK ACCOMPLISHES — what does the sustained choice force the reader to do that a direct, sincere statement would not?',
      ],
      example: {
        problem:
          "Build one body paragraph analyzing HOW Swift sustains a controlled ironic persona across the passage (rather than merely noting that the proposal is 'shocking'), using the shift from earnest economic reformer to the 'delicious nourishing... food' turn as evidence.",
        solution:
          "Swift's persona takes its greatest risk exactly where it refuses to change: the same calm, statistic-minded reformer who opens with sober pity for beggar-women and their children ('a melancholy object') and methodically weighs 'the several schemes of our projectors' uses that identical even register to propose that a child is, at a year old, 'a most delicious nourishing and wholesome food.' The horror lives in the tone's CONTINUITY, not a shift — Swift never breaks character to signal outrage or wink at the reader, which is precisely what makes the persona controlled rather than a failed joke. Had the voice cracked into sincerity or disgust, the irony would collapse into simple shock value.",
      },
      relatedLoIds: ['apenglang.rhetorical-risk'],
    },
  ],
  pointers: [
    { content: 'A rhetorical risk is a stylistic departure (irony, persona, unexpected structure, provocative register) chosen for an effect a plain style can\'t achieve.', kind: 'tip' },
    { content: 'Control is what makes a risk succeed: the writer sustains the voice/tone consistently rather than breaking character or letting tone wander.', kind: 'tip' },
    { content: 'A shocking idea alone is not sophistication — analysis must show the sustained, deliberate control across the passage.', kind: 'trap' },
    { content: 'Swift\'s "delicious nourishing food" line works because the SAME calm register is sustained from the opening pity straight through the proposal — the continuity IS the control.', kind: 'tip' },
    { content: 'Test: can you point to the persona or register being maintained across MULTIPLE moments, not just note one disturbing moment?', kind: 'trap' },
    { content: 'This is a route to the sophistication point because sustaining a risky style throughout a text — without it visibly breaking — is a level of craft a safe style can\'t demonstrate.', kind: 'tip' },
  ],
};
