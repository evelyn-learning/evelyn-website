/**
 * AP English Language & Composition — CED Unit 7.4: Rhetorical Risk and
 * Control of Style.
 *
 * Builds on 7.3 (broader context): the final route to the AP rubric's
 * SOPHISTICATION point this unit covers is stylistic — a writer who takes a
 * genuine RHETORICAL RISK (irony, an unexpected structural choice, a
 * deliberately provocative persona or register) and maintains full CONTROL
 * over it throughout is demonstrating a level of craft a safe, competent,
 * literal style cannot. The risk only pays off if the writer stays in
 * control of it; an uncontrolled risk (tone that wanders, irony the writer
 * seems not to notice, a persona that breaks) reads as a mistake, not
 * sophistication.
 *
 * See docs/superpowers/specs/2026-07-10-ap-eng-lang-design.md §2 for the
 * humanities segment semantics (try_yourself PARAGRAPH grain: responseFormat
 * 'free', rubric = two parts summing to 6) this plan follows.
 *
 * Anchor text: Jonathan Swift, "A Modest Proposal" (1729) —
 * evelyn.passage.swift-modest-proposal.v1. The teaching point is Swift's
 * sustained ironic persona — an earnest, statistic-laden economic tone that
 * never breaks even as it proposes something monstrous, with the "delicious
 * nourishing food" line as the canonical turn. Only this one short phrase is
 * quoted, per the passage's own content-safety note; no further graphic
 * detail is repeated or elaborated.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_ENGLANG_U7_RHETORICAL_RISK: LessonPlan = {
  id: 'evelyn.ap.englang.rhetorical-risk.v1',
  title: 'U7.4 Rhetorical Risk and Control of Style',
  curriculum: 'AP',
  grade: '11',
  subject: 'ela',
  topic: 'ap-english-language',
  locale: 'en',
  los: [
    {
      id: 'apenglang.rhetorical-risk',
      description:
        'Identify and analyze a writer\'s vivid, controlled stylistic choice that takes a genuine rhetorical risk (irony, register, persona, or structure) and sustains it effectively, as a route to the AP rubric\'s sophistication point.',
      standard: 'AP-ENGLANG-7.4',
    },
  ],
  prerequisites: [
    'apenglang.situating-in-context',
    'apenglang.evidence-commentary',
  ],
  followUps: [],
  estimatedMinutes: 23,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Get students to feel why a safe, literal style is easier but less memorable than a controlled, risky one, before naming "rhetorical risk."',
      script:
        "Picture a stand-up comedian who only ever tells jokes that can't possibly offend or confuse anyone — perfectly safe, perfectly forgettable. Now picture one who commits fully to an absurd, deadpan premise and never once breaks character to wink at the audience and say 'just kidding' — the commitment IS the joke, and it only works because they never flinch. The safe comedian is easier; the committed one is riskier AND better, precisely because the risk is under total control. Writers make the same choice. A writer who states a harsh truth plainly and safely is competent. A writer who commits to an ironic persona, an unexpected structure, or a provocative register — and never breaks it — is taking a real risk that, controlled, produces something a safe style never could.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-rhetorical-risk',
      kind: 'concept',
      goal: 'Define rhetorical risk and control of style, distinguish an effective risk from a failed one, and connect the move to the sophistication point.',
      keyIdeas: [
        "A RHETORICAL RISK is a stylistic choice that departs from safe, literal, expected writing — irony, an unexpected structural move, a deliberately adopted persona, a provocative register or tone — chosen because it can accomplish something a plain, safe style cannot.",
        "CONTROL is what separates a successful risk from a failure: the writer sustains the choice DELIBERATELY and CONSISTENTLY, so the effect the reader experiences (unease, dark humor, discomfort) is the one the writer intended — not tone that wanders, irony the writer seems unaware of, or a persona that breaks and reveals itself as sincere by accident.",
        "IRONY is one of the most common vehicles for rhetorical risk: saying one thing while meaning (or intending the reader to recognize) another. A PERSONA (an adopted voice distinct from the writer's own sincere position) is a related vehicle — the writer speaks AS a character or stance they do not actually hold, to expose something about that stance by inhabiting it fully.",
        "The test for whether a risk is CONTROLLED, not accidental: does the writer sustain the chosen voice/tone/structure consistently across the passage, with signals (excess, absurdity, a jarring juxtaposition) that a careful reader can use to recognize the gap between the surface and the real meaning? An uncontrolled risk breaks character, becomes literal where it should stay ironic, or loses the reader about what's meant sincerely versus not.",
        "Swift's 'A Modest Proposal' is the canonical example: he adopts the PERSONA of a coolly rational economic reformer, sustaining an earnest, statistic-laden, problem-solving tone for paragraph after paragraph — poverty statistics, a 'melancholy object,' careful cost calculations — before that same even, reasonable voice proposes something monstrous. The tonal consistency IS the risk's control: the persona never winks, never breaks into open outrage, which is exactly what makes the reader supply the outrage the text itself withholds.",
        "The risk pays off because the writer's controlled commitment to an absurd, unbroken logic FORCES the reader to do the moral work the text refuses to do explicitly — a direct, sincere denunciation of the same social conditions would be safer, clearer, and far less memorable or persuasive.",
        "This is a route to the SOPHISTICATION point because it requires the writer to demonstrate CONTROL over style and voice throughout a text — not just a single clever line, but a sustained, deliberate choice that could visibly have gone wrong (broken persona, confused tone) and didn't.",
      ],
      vocabulary: [
        { term: 'rhetorical risk', definition: 'a stylistic departure from safe, literal writing (irony, persona, unexpected structure, provocative register) chosen for an effect a plain style cannot produce.' },
        { term: 'control of style', definition: 'sustaining a chosen risky voice, tone, or structure deliberately and consistently, so the intended effect lands rather than reading as an accident.' },
        { term: 'persona', definition: "an adopted voice or stance distinct from the writer's own sincere position, used to expose something by inhabiting it fully." },
        { term: 'irony', definition: 'saying one thing while meaning, or intending the reader to recognize, another.' },
        { term: 'uncontrolled risk', definition: 'a stylistic risk that breaks — tone wanders, persona cracks, irony reads as unintentional — undermining rather than achieving its effect.' },
      ],
      passageId: 'evelyn.passage.swift-modest-proposal.v1',
      estimatedMinutes: 6,
    },
    {
      id: 'worked-swift-persona-control',
      kind: 'worked_example',
      problem:
        "Build one body paragraph analyzing HOW Swift sustains a controlled ironic persona across the passage (rather than merely noting that the proposal is 'shocking'), using the shift from earnest economic reformer to the 'delicious nourishing... food' turn as evidence.",
      steps: [
        "NAME THE RISK BEING TAKEN. Swift adopts the persona of a calm, rational social reformer — not his own sincere voice — and commits to it without ever stepping outside it to signal irony directly.",
        "SHOW THE PERSONA BEING BUILT AND SUSTAINED. Track the earnest, careful tone across several moves: opening with sober pity ('a melancholy object'), moving to methodical, statistic-minded problem-solving ('maturely weighed the several schemes of our projectors'), and framing the whole passage as responsible public-policy reasoning.",
        "IDENTIFY THE MOMENT OF MAXIMUM RISK. The persona's same even, reasonable tone is applied, without any shift in register, to the proposal itself — 'a young healthy child well nursed, is, at a year old, a most delicious nourishing and wholesome food.' The horror is in the CONTINUITY of tone, not a change in it.",
        "EXPLAIN WHY THIS IS CONTROL, NOT ACCIDENT. If the tone broke here — if Swift signaled outrage, disgust, or a wink — the irony would collapse into simple shock. By keeping the SAME calm, reasonable register from the opening pity straight through to the monstrous proposal, Swift forces the reader to supply the horror the text withholds.",
        "EXPLAIN WHAT THE CONTROLLED RISK ACCOMPLISHES. A direct, sincere denunciation of poverty and indifference would be safer and clearer, but far less unsettling; the sustained persona indicts the reader's own passive tolerance of real suffering by making them complicit in briefly, uncomfortably following 'reasonable' logic toward something monstrous.",
      ],
      answer:
        "Swift's persona takes its greatest risk exactly where it refuses to change: the same calm, statistic-minded reformer who opens with sober pity for beggar-women and their children ('a melancholy object') and methodically weighs 'the several schemes of our projectors' uses that identical even register to propose that a child is, at a year old, 'a most delicious nourishing and wholesome food.' The horror lives in the tone's CONTINUITY, not a shift — Swift never breaks character to signal outrage or wink at the reader, which is precisely what makes the persona controlled rather than a failed joke. Had the voice cracked into sincerity or disgust at the proposal, the irony would collapse into simple shock value; by keeping the reasonable, reformist register unbroken from pity through to atrocity, Swift forces readers to notice their own momentary willingness to follow 'reasonable-sounding' logic anywhere — which indicts the same complacent tolerance of poverty the persona pretends to solve.",
      estimatedMinutes: 6,
    },
    {
      id: 'try-risk-paragraph',
      kind: 'try_yourself',
      problem:
        "Using the passage evelyn.passage.swift-modest-proposal.v1, write ONE body paragraph analyzing how Swift's use of measured, economic language (e.g. describing children in terms of their cost and market value, 'two shillings,' 'a very great additional grievance,' the language of 'commonwealth' and 'projectors') is itself a controlled rhetorical risk — a deliberate choice to describe human suffering in the flat vocabulary of accounting, rather than his own sincere voice. Your paragraph must cite specific evidence AND explain how the sustained choice of register (not a single word) is what makes the risk controlled rather than accidental.",
      responseFormat: 'free',
      passageId: 'evelyn.passage.swift-modest-proposal.v1',
      rubric: {
        parts: [
          {
            criterionId: 'evidence',
            maxPoints: 3,
            scoringCriteria:
              "Full credit (3): the paragraph cites specific, accurately-quoted evidence of the sustained economic/accounting register (e.g. 'two shillings,' the cost-per-child calculation, 'a very great additional grievance,' 'sound and useful members of the commonwealth,' 'schemes of our projectors,' 'fair, cheap and easy method') and identifies it as a consistent pattern across multiple sentences, not an isolated word. Partial credit (1-2) for a single relevant quote with no sense of the pattern's sustained repetition. No credit for missing, misquoted, or irrelevant evidence.",
            modelResponse:
              "Throughout the passage, Swift describes impoverished children in the vocabulary of a cost-benefit ledger — a child may be sustained 'at most not above the value of two shillings,' the country's poor are 'a very great additional grievance' to be solved, and his imagined solution should make them 'sound and useful members of the commonwealth,' the language of 'projectors' devising a 'fair, cheap and easy method.'",
          },
          {
            criterionId: 'control',
            maxPoints: 3,
            scoringCriteria:
              "Full credit (3): commentary explains that the risk (describing children/poverty in flat accounting terms rather than in a sincere, sympathetic register) is CONTROLLED because it is sustained consistently across multiple sentences and structural moves, not just one shocking word — and explains what that consistency accomplishes (it reduces human suffering to a management problem for the reader to sit with, making the persona's later monstrous proposal feel like the logical continuation of an already-established accounting mindset, rather than an isolated shock). Partial credit for commentary that notes the register is 'cold' or 'businesslike' without connecting sustained consistency to control, or that explains the effect of a single quote without addressing the pattern. No credit for commentary that merely restates the quotes' literal content.",
            modelResponse:
              "This isn't one jarring word — it's a sustained pattern: nearly every sentence in the build-up measures children and poverty in cost, value, and public-policy vocabulary rather than sympathy, which is what makes the risk controlled rather than an accident of one bad phrase. Because the accounting register is established well before the proposal itself, the persona's later description of children as a food product doesn't read as a sudden break in tone — it reads as the same ledger-mindset simply continuing to its logical endpoint, which is exactly what makes the passage indict a reader who was following the 'reasonable' economic logic without objection until it was too late to comfortably stop."
          },
        ],
      },
      estimatedMinutes: 6,
    },
    {
      id: 'misconception-risk-without-control',
      kind: 'misconception_check',
      question:
        'A student writes: "Swift takes a big risk by writing something so shocking, which makes his essay sophisticated." Does simply identifying that the proposal is shocking earn credit for analyzing rhetorical risk?',
      commonErrors: [
        {
          answer: 'yes',
          misconception:
            'Treating the mere PRESENCE of a shocking or risky idea as evidence of sophistication, without analyzing whether the writer maintains CONTROL over the risk — the actual craft the sophistication point rewards.',
          correctsTo:
            "No — being shocking isn't, by itself, sophisticated; plenty of careless or poorly-controlled writing is shocking by accident. What earns credit is explaining HOW Swift sustains a specific, consistent register (the calm economic/reformist persona) across the whole passage WITHOUT breaking it — that sustained control is what makes the risk deliberate craft rather than a lucky or accidental provocation. The test: can the student point to the persona or register being maintained across MULTIPLE moments, not just note that one moment is disturbing? A paragraph that only says 'this part is shocking' has identified content, not the stylistic control that makes the content function as sustained irony rather than a single startling line.",
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        "A rhetorical risk is a stylistic departure from safe, literal writing — irony, persona, unexpected structure, provocative register — chosen for an effect a plain style can't achieve.",
        "Control is what makes a risk succeed: the writer sustains the chosen voice/tone/structure consistently, rather than breaking character or letting tone wander.",
        "Swift's 'delicious nourishing food' line works because the SAME calm, reasonable register is sustained from the opening pity straight through the monstrous proposal — the continuity IS the control.",
        "A shocking idea alone is not sophistication — analysis must show the sustained, deliberate control across the passage, not just note that one moment is disturbing.",
        "This is a route to the sophistication point because sustaining a risky style throughout a text — without it visibly breaking — is a level of craft a safe, literal style cannot demonstrate.",
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '7',
    cedTopic: '7.4',
    cedTitle: 'Rhetorical Risk and Control of Style',
    sources: [
      {
        type: 'plan',
        source: 'AP Plans Initiative — AP English Language',
      },
    ],
  },
};
