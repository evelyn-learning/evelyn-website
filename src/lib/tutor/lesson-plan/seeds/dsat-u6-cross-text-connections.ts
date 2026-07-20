/**
 * Digital SAT — Reading & Writing: Cross-Text Connections.
 *
 * A Craft & Structure question type: two short, original passages on the
 * same topic, then a question asking how the second author's findings or
 * position relate to the first's claim (support, challenge, qualify, or
 * extend). No calculator, no long paired passages from the paper SAT —
 * each pair is self-contained and under 100 words combined.
 */

import type { LessonPlan } from '../types';
import { TESTPREP_PACING_THRESHOLDS, TESTPREP_SOURCE } from './_testprep-shared';

export const SEED_DSAT_U6_CROSS_TEXT_CONNECTIONS: LessonPlan = {
  id: 'evelyn.testprep.dsat.cross-text-connections.v1',
  title: 'Cross-Text Connections',
  curriculum: 'SAT',
  grade: 'sat-act',
  subject: 'test-prep',
  topic: 'digital-sat',
  locale: 'en',
  los: [
    {
      id: 'dsat.cross-text-connections',
      standard: 'DSAT-6.3',
      description:
        'Analyze how a claim or finding in a short Text 2 relates to a claim or finding in a paired Text 1 — supporting, challenging, qualifying, or extending it — grounded strictly in what Text 2 states.',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame Cross-Text Connections as a small but reliable slice of Craft & Structure — a handful of questions with a repeatable pattern.',
      script:
        'Cross-Text Connections shows up a handful of times across the Reading and Writing section — a small slice of the roughly 13 to 15 Craft and Structure questions, but a reliably repeatable pattern once you know it. You get two short original passages, both on the same topic, and you have to figure out how the second author would react to the first author\'s claim. It is never about who is "right" — it is about what the text actually says.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-cross-text',
      kind: 'concept',
      goal: 'The Cross-Text format, the four relationship types, and the two traps that catch students.',
      keyIdeas: [
        'FORMAT — two short original passages, Text 1 and Text 2, on the same topic but usually by different authors or from different studies. The question asks how Text 2 relates to a specific claim in Text 1.',
        'FOUR RELATIONSHIP TYPES — Text 2 can SUPPORT (corroborate) Text 1\'s claim, CHALLENGE (refute) it, QUALIFY it (agree only under a specific condition), or EXTEND it (build on it with a new angle Text 1 didn\'t cover).',
        'STEP 1 — paraphrase Text 1\'s claim in one short sentence. STEP 2 — paraphrase Text 2\'s finding or position in one short sentence, SEPARATELY, before comparing. Blending the two too early causes mistakes.',
        'TRAP 1 — SAME TOPIC DOES NOT MEAN SAME POSITION. Both texts studying the same phenomenon does not imply agreement; look at what each one actually concludes.',
        'TRAP 2 — EXTREME LANGUAGE. Choices with "completely agrees," "entirely rejects," or "has no effect at all" are usually wrong. Real cross-text relationships are almost always qualified — Text 2 usually adds a condition rather than flatly agreeing or disagreeing.',
        'TRAP 3 — OUTSIDE KNOWLEDGE OR "PLAUSIBLE" ANSWERS. The correct choice must be grounded in what Text 2 specifically says, not in what sounds reasonable in general or in what a scientist would "probably" think.',
        'STRATEGY — after paraphrasing both claims, ask: does Text 2\'s finding support, refute, complicate (add a condition to), or extend Text 1\'s claim? That single question usually eliminates two of the four choices immediately.',
      ],
      vocabulary: [
        { term: 'corroborate', definition: 'to provide independent support that confirms a claim.' },
        { term: 'refute', definition: 'to provide evidence that directly contradicts a claim.' },
        { term: 'qualify', definition: 'to limit or add a condition to a claim rather than fully accepting or rejecting it.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-typical',
      kind: 'worked_example',
      problem:
        'Text 1: A researcher played classical music during a two-hour study session for 60 undergraduates and measured stress with a standard self-report scale afterward. Reported stress dropped by nearly a third compared to a silent control group. The researcher concluded that classical music is a simple, universal tool students can use to reduce stress while studying. Text 2: A second researcher repeated the experiment but first asked participants whether they generally enjoyed classical music. Among students who already liked the genre, stress dropped as before. Among students who disliked it, stress actually rose. The researcher concluded that the effect depends on individual musical preference, not on any special calming property of classical music itself. Question: Based on the texts, how would the author of Text 2 most likely respond to the claim in Text 1 that classical music is a universal stress-reducing tool for studying?',
      steps: [
        'Paraphrase Text 1\'s claim: classical music reduces study stress for everyone, universally.',
        'Paraphrase Text 2\'s finding: the effect only holds for students who already like classical music; it backfires for students who dislike it.',
        'Text 2 directly undermines the word "universal" — the benefit is conditional on the listener\'s existing preference, not automatic.',
        'This is a QUALIFY relationship, not a flat CHALLENGE — Text 2 does not say classical music never helps, only that the "universal" framing is too broad.',
        'The correct answer states a qualified challenge: the effect is real for some but not universal — not flat agreement, not total rejection.',
      ],
      answer:
        'The author of Text 2 would likely argue that classical music\'s stress-reducing effect isn\'t universal — it depends on whether the listener already likes classical music, so Text 1\'s conclusion is too broad.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-trap',
      kind: 'worked_example',
      problem:
        'Text 1: An entomologist surveyed wild bee populations along stretches of farmland and found a sharp decline that tracked closely with a rise in the use of a common pesticide nearby. Based on this pattern, the entomologist recommended banning the pesticide as the primary way to reverse the decline. Text 2: A second entomologist studying the same region set up control plots several miles from any farmland, free of the pesticide entirely. Bee populations in these plots also declined, though less sharply. The researcher pointed to habitat loss from large-scale monoculture planting as an additional major driver, concluding that pesticide use is one contributor among several, not the sole cause. Question: Based on the texts, how would the author of Text 2 most likely respond to the claim in Text 1 that banning the pesticide would fix the wild bee decline?',
      steps: [
        'Paraphrase Text 1\'s claim: the pesticide is the cause, so banning it is THE fix.',
        'Paraphrase Text 2\'s finding: bees declined even in pesticide-free control plots (just less sharply); habitat loss from monoculture planting is also a major driver.',
        'TRAP — a tempting wrong choice says Text 2 would "completely disagree that pesticides play any role." Too extreme: the sharper decline near farmland is still consistent with pesticides mattering; Text 2 just shows they are not the ONLY factor.',
        'The correct relationship is QUALIFY, not CHALLENGE: pesticides likely do contribute, but banning them alone would not fully solve the problem because habitat loss is a separate, significant driver.',
        'Reject any choice using "no role at all" or "the pesticide is not a factor" — Text 2 never claims that.',
      ],
      answer:
        'The author of Text 2 would likely agree pesticides contribute but caution that banning them alone would not solve the decline, since habitat loss also plays a significant role.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem:
        'Text 1: A sleep researcher had one group of students nap for twenty minutes after learning a new vocabulary list, while a control group stayed awake. The next day, the nappers recalled significantly more words than the group that stayed awake. The researcher concluded that napping itself strengthens memory consolidation. Text 2: A second researcher ran a similar nap study but deliberately woke some students during deep sleep and others during lighter sleep stages. Students woken during light sleep still showed the memory boost, but those woken during deep sleep lost it entirely. The researcher concluded that reaching deep sleep, not napping in general, drives the benefit. Question: Based on the texts, how would the author of Text 2 most likely respond to the claim in Text 1 that napping itself strengthens memory consolidation?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Agree without qualification — any nap, regardless of sleep stage reached, strengthens memory.' },
        { id: 'b', text: 'Disagree entirely — napping has no relationship to memory consolidation.' },
        {
          id: 'c',
          text: 'Refine the claim — the memory benefit depends on reaching deep sleep during the nap, not on napping alone.',
          correct: true,
        },
        { id: 'd', text: 'Argue that memory consolidation depends on the length of the vocabulary list, not on sleep at all.' },
      ],
      expectedAnswer:
        'Refine the claim — the memory benefit depends on reaching deep sleep during the nap, not on napping alone.',
      hints: [
        'Paraphrase Text 2\'s finding separately from Text 1\'s: what specifically mattered — napping, or the sleep stage reached?',
        'Choices (a) and (b) both use extreme, all-or-nothing language — check whether Text 2 actually supports either extreme.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-2',
      kind: 'try_yourself',
      problem:
        'Text 1: A city planner surveyed residents living near newly built community gardens and found that self-reported neighborhood satisfaction rose sharply in the year after installation. Based on this, the planner concluded that community gardens boost neighborhood wellbeing wherever they are built. Text 2: A researcher studying gardens in a different city found the same satisfaction boost, but only where residents helped plan and maintain the garden themselves. In neighborhoods where a garden was installed without resident input, satisfaction did not change. The researcher concluded that participation, not the garden\'s mere presence, drives the benefit. Question: Based on the texts, how would the author of Text 2 most likely respond to the claim in Text 1 that community gardens boost wellbeing wherever they are built?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Endorse it fully, since gardens boosted satisfaction in both studies.' },
        { id: 'b', text: 'Reject it, arguing that community gardens have no effect on wellbeing in any neighborhood.' },
        {
          id: 'c',
          text: 'Qualify it — the boost depends on residents participating in planning and upkeep, not simply on a garden being built.',
          correct: true,
        },
        { id: 'd', text: 'Argue that neighborhood satisfaction depends only on the size of the garden, a factor neither text discusses.' },
      ],
      expectedAnswer:
        'Qualify it — the boost depends on residents participating in planning and upkeep, not simply on a garden being built.',
      hints: [
        'What condition does Text 2 add that Text 1\'s claim ("wherever they are built") ignores?',
        'Choice (d) introduces a factor neither text mentions — that is an outside-knowledge trap, not a text-grounded answer.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-3',
      kind: 'try_yourself',
      problem:
        'Text 1: An education researcher tracked middle-schoolers\' daily recreational screen time and their reading comprehension scores across a semester. Students who logged more than three hours of screen time a day scored noticeably lower on comprehension tests than lighter users. The researcher concluded that recreational screen time directly harms reading comprehension. Text 2: A second researcher controlled for the type of screen activity rather than just the total time. Heavy users of video-based entertainment scored lower, as before, but students who spent equally heavy time reading digitally, on e-books and articles, scored as well as light screen-time users. The researcher concluded that the content of screen time, not the raw amount, predicts comprehension. Question: Based on the texts, how would the author of Text 2 most likely respond to the claim in Text 1 that recreational screen time directly harms reading comprehension?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Agree fully — any screen time, regardless of what it is spent on, harms comprehension.' },
        { id: 'b', text: 'Disagree entirely — screen time has no relationship to comprehension scores.' },
        {
          id: 'c',
          text: 'Complicate it — the harm tracks the type of content, video versus reading, rather than the raw amount of screen time.',
          correct: true,
        },
        { id: 'd', text: 'Argue that comprehension scores depend only on a student\'s grade level, a factor neither text measured.' },
      ],
      expectedAnswer:
        'Complicate it — the harm tracks the type of content, video versus reading, rather than the raw amount of screen time.',
      hints: [
        'Text 2 kept the total screen-time amount just as high for one group — what changed was the activity type. What does that isolate?',
        'Eliminate choices with all-or-nothing language first, then eliminate the choice with a factor neither text measured.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-same-topic-same-side',
      kind: 'misconception_check',
      question:
        'A student picks the choice saying the author of Text 2 would "strongly agree" with Text 1\'s claim, reasoning that both texts are about the same topic and both authors are researchers studying the same phenomenon. What went wrong?',
      commonErrors: [
        {
          answer: 'Text 2\'s author strongly agrees with Text 1\'s claim',
          misconception:
            'Assuming agreement because both texts share a topic and both authors are credible researchers, rather than checking what Text 2\'s specific finding actually says.',
          correctsTo:
            'Same topic and equal credibility do not guarantee the same conclusion. Cross-Text Connections questions are answered from the WORDS of Text 2, not from a general impression that "they are both researchers, so they probably agree." Reread Text 2\'s stated finding before choosing — the relationship (support, challenge, qualify, extend) must be grounded in what Text 2 actually reports.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Paraphrase Text 1\'s claim and Text 2\'s finding SEPARATELY before comparing — do not blend them.',
        'The relationship is rarely all-or-nothing: choices with "completely agrees" or "entirely rejects" are usually wrong.',
        'The correct answer must be grounded in what TEXT 2 specifically says, not in outside knowledge or a general impression that the texts are "on the same side."',
        'Four relationship types to watch for: Text 2 supports, challenges, qualifies (adds a condition to), or extends Text 1\'s claim.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: TESTPREP_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '6', cedTopic: '6.3', cedTitle: 'Cross-Text Connections' },
  pacingThresholds: TESTPREP_PACING_THRESHOLDS,
};
