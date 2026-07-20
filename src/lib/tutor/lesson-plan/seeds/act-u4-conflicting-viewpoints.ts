/**
 * ACT — Science / Conflicting Viewpoints: mapping claims, agreement &
 * disagreement, and evaluating new evidence.
 *
 * Conflicting Viewpoints is the one ACT Science passage type with ZERO
 * data to look up — no tables, no graphs, no curves. It's pure reading
 * comprehension wearing a lab coat: 2-3 named scientists/students each
 * argue a different explanation for the same phenomenon, and the
 * questions test whether you can track who claims what, find the shared
 * ground, and reason from each viewpoint's own logic. All stimuli are
 * original.
 */

import type { LessonPlan } from '../types';
import { TESTPREP_PACING_THRESHOLDS, TESTPREP_SOURCE } from './_testprep-shared';

export const SEED_ACT_U4_CONFLICTING_VIEWPOINTS: LessonPlan = {
  id: 'evelyn.testprep.act.conflicting-viewpoints.v1',
  title: 'Conflicting Viewpoints',
  curriculum: 'ACT',
  grade: 'sat-act',
  subject: 'test-prep',
  topic: 'act',
  locale: 'en',
  los: [
    {
      id: 'act.conflicting-viewpoints',
      standard: 'ACT-4.5',
      description:
        'Map each viewpoint\'s claim and evidence in a no-data ACT Science passage, identify where viewpoints agree and disagree, and evaluate which new evidence would support or undercut each one.',
    },
  ],
  prerequisites: ['act.data-representation'],
  followUps: [],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Reframe Conflicting Viewpoints as the one ACT Science passage with no data — a reading-comprehension test in disguise.',
      script:
        'Every ACT Science section has exactly one Conflicting Viewpoints passage — worth about 6 to 7 of the section\'s 40 questions, so roughly 15-17% of your Science score. And here\'s the twist: there\'s no table, no graph, nothing to look up. Two or three scientists argue different explanations for the same phenomenon, and every question is answered from their words alone. It runs longer than the other passages — budget about 6-7 minutes instead of the usual 52 seconds a question — because the payoff is careful reading, not fast lookup.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-mapping-viewpoints',
      kind: 'concept',
      goal: 'Passage shape, margin note-taking, the five question types, and the traps unique to a no-data conflicting-viewpoints passage.',
      keyIdeas: [
        'PASSAGE SHAPE: a short intro names the phenomenon being debated, then 2-3 labeled viewpoints (Scientist 1/2/3, Student A/B, Dr. X/Dr. Y). No tables, no graphs — every fact you need is in the prose.',
        'TIME BUDGET: this passage appears once per test and runs longer than a data passage — plan on ~6-7 minutes for its ~6-7 questions.',
        'AS YOU READ, jot a 3-4 word margin note per viewpoint: their CLAIM and their key EVIDENCE — e.g. "Alvarez: selection, cost." This saves re-reading the whole passage per question.',
        'FIND THE SHARED FACT FIRST. Viewpoints almost always agree on ONE baseline observation (the phenomenon itself, or a basic cause) and diverge on the WHY/mechanism, not the WHAT.',
        'FIVE QUESTION TYPES: (1) WHAT ONE BELIEVES — direct lookup. (2) AGREEMENT — find the shared baseline. (3) DISAGREEMENT — find the mechanism they split on. (4) RESPONSE/PREDICT — extend one viewpoint\'s own logic to a new scenario. (5) SUPPORT/UNDERCUT WITH NEW EVIDENCE — pick the finding that moves ONE viewpoint, not all or none.',
        'TRAP — EVIDENCE THAT CUTS BOTH WAYS: a finding phrased broadly enough to seem to support every viewpoint is rarely the credited answer; the real answer is specific to ONE viewpoint\'s stated mechanism.',
        'TRAP — OUTSIDE KNOWLEDGE: your own science background can mislead you. Answer from what the NAMED scientist argues in the passage, even if you think a different explanation is more scientifically accurate.',
        'TRAP — MIXING UP NAMES: three viewpoints means three chances to attribute the wrong claim to the wrong person. Reread the name in the question before you answer.',
      ],
      vocabulary: [
        { term: 'viewpoint', definition: 'one named scientist\'s or student\'s full claim plus the evidence they cite for it.' },
        { term: 'point of agreement', definition: 'a claim or observation every viewpoint accepts — usually the basic phenomenon, not its cause.' },
        { term: 'corroborate', definition: 'to provide evidence that supports (strengthens) a claim; the opposite of undercut or weaken.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-identify-claim',
      kind: 'worked_example',
      problem:
        'Passage: a species of cave fish that lives in total darkness has lost functional eyesight over many generations. Dr. Alvarez: eyes are metabolically costly to build and maintain, so fish born with smaller or non-functional eyes conserved energy, survived better, and passed on that trait — natural selection actively favored blindness. Dr. Brennan: in total darkness, eyes provide neither benefit nor cost significant enough to be selected on, so eye-related mutations simply accumulated unchecked over generations — genetic drift, not selection, explains the blindness. Dr. Chen: the same genes that suppress eye development also enhance the lateral-line system that senses water vibration; blindness is a side effect of selection favoring better non-visual senses, not a direct target of selection itself. Question: which scientist attributes the loss of eyesight primarily to eyes being an active metabolic drain that natural selection acted against?',
      steps: [
        'Scan for the scientist\'s NAME plus their core CLAIM — don\'t rely on memory of the whole passage.',
        'Dr. Alvarez\'s claim: eyes cost energy to build/maintain; fish with reduced eyes conserved that energy, survived and reproduced better.',
        'That is a direct "selection actively acted against a costly trait" argument — exactly matches the question.',
        'Check the other two to be sure: Dr. Brennan explicitly argues NO selection pressure either way (drift); Dr. Chen argues the mechanism is a side effect of selection on a DIFFERENT trait. Neither matches "actively selected against for being costly."',
      ],
      answer: 'Dr. Alvarez.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-evaluate-new-evidence',
      kind: 'worked_example',
      problem:
        'Using the same three viewpoints: researchers raise cave-fish embryos engineered to keep functional eyes and compare them to normal blind embryos, both in total darkness. The eyed embryos grow measurably slower and use more oxygen than the blind embryos. Which scientist\'s hypothesis does this finding support, and which does it undercut?',
      steps: [
        'Isolate exactly what the finding shows: functioning eyes carry a real energy/oxygen COST, independent of the light environment.',
        'Dr. Alvarez claims eyes are costly and therefore actively selected against — a measured cost directly supports her.',
        'Dr. Brennan claims eye loss is NEUTRAL (no real cost or benefit, just drift) — a measured cost contradicts that premise, so this finding undercuts him.',
        'Dr. Chen\'s claim is about a linked developmental trade-off, not about eye cost directly — this finding is roughly neutral for Chen, neither strongly supporting nor undercutting her.',
        'TRAP: don\'t pick "supports all three" or "supports none" — a specific enough finding moves exactly one viewpoint up and one down, leaving the third largely untouched.',
      ],
      answer: 'Supports Dr. Alvarez; undercuts Dr. Brennan; roughly neutral for Dr. Chen.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-agreement',
      kind: 'try_yourself',
      problem:
        'Same three viewpoints (Alvarez: active selection against costly eyes; Brennan: neutral drift; Chen: linked trade-off with enhanced lateral-line sensing). Which of the following would ALL THREE scientists agree on?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Natural selection alone explains why the fish lost functional eyesight.' },
        {
          id: 'b',
          text: 'Living in permanent darkness played a role in these fish losing functional eyesight over many generations.',
          correct: true,
        },
        { id: 'c', text: 'Eye-suppression genes are directly linked to genes that enhance the lateral-line sensory system.' },
        { id: 'd', text: 'Random mutation accumulation, unconstrained by selection, is the primary driver of the blindness.' },
      ],
      expectedAnswer: 'Living in permanent darkness played a role in these fish losing functional eyesight over many generations.',
      hints: [
        'All three scientists start from the same basic observation before disagreeing on WHY it happened.',
        'Look for what is stated as a shared fact in the passage intro, not inside any one scientist\'s own argument.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-response-prediction',
      kind: 'try_yourself',
      problem:
        'A second, separate cave system is discovered where thin cracks let a small amount of surface light reach a pool of fish; those fish have small but still-functioning eyes. Based on Dr. Alvarez\'s view, why would these fish still have functioning eyes?',
      responseFormat: 'mcq',
      choices: [
        {
          id: 'a',
          text: 'Because faint light still allows the eyes to provide enough of a survival benefit that natural selection did not favor losing them.',
          correct: true,
        },
        { id: 'b', text: 'Because random mutations happened not to accumulate in that particular population.' },
        { id: 'c', text: 'Because the gene pathway linking eye suppression to other senses was never activated.' },
        { id: 'd', text: 'Because eyes in this species are never metabolically costly to maintain.' },
      ],
      expectedAnswer:
        'Because faint light still allows the eyes to provide enough of a survival benefit that natural selection did not favor losing them.',
      hints: [
        'Alvarez\'s whole argument rests on whether eyes are useful enough to be worth their energy cost.',
        'If eyes still provide SOME benefit, selection pressure to lose them is weaker — extend her own logic to the new scenario.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-evidence-support',
      kind: 'try_yourself',
      problem:
        'Researchers find that experimentally blocking the same embryonic gene pathway that halts eye development ALSO measurably strengthens the lateral-line (vibration-sensing) system in fish raised under normal light — even though those fish never needed extra vibration-sensing. Which scientist\'s hypothesis does this finding BEST support?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Dr. Alvarez, because it shows eyes are costly to build.' },
        { id: 'b', text: 'Dr. Brennan, because it shows the mutation was random.' },
        {
          id: 'c',
          text: 'Dr. Chen, because it shows the eye-suppression gene pathway is directly linked to enhancing a different sensory system, independent of the light environment.',
          correct: true,
        },
        { id: 'd', text: 'All three equally, since it is a genetic finding.' },
      ],
      expectedAnswer:
        'Dr. Chen, because it shows the eye-suppression gene pathway is directly linked to enhancing a different sensory system, independent of the light environment.',
      hints: [
        'Dr. Chen\'s claim is specifically about eye-suppression genes being LINKED to another sense — not about cost (Alvarez) or randomness (Brennan).',
        'The finding holds even in normal light, isolating a genetic link rather than a darkness-driven cost or benefit — that pins down one scientist\'s mechanism.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-outside-knowledge',
      kind: 'misconception_check',
      question:
        'A question asks "Which scientist\'s view is most likely correct?" A student answers based on what they remember from a biology class about mutation accumulation, without rereading the passage. What went wrong?',
      commonErrors: [
        {
          answer: 'Picks whichever explanation sounds most familiar from outside science knowledge',
          misconception: 'Believing ACT Conflicting Viewpoints questions reward real-world scientific accuracy.',
          correctsTo:
            'These questions almost always test reading comprehension of the passage, not outside knowledge — some presented hypotheses may even be scientifically shaky on purpose. Support/weaken/response questions want the answer that is INTERNALLY CONSISTENT with a named scientist\'s own stated claim and evidence, not the one you personally believe is true.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Conflicting Viewpoints has zero data to look up — it\'s the one ACT Science passage type that\'s pure reading comprehension.',
        'Track each named viewpoint\'s CLAIM and EVIDENCE as you read; note the shared point of agreement (usually a basic observation) and where they diverge (usually the WHY).',
        'Support/weaken/response questions test what\'s internally consistent with a named viewpoint\'s OWN claim — not your outside science knowledge.',
        'Watch the trap: evidence broad enough to seem to support every viewpoint is rarely the credited answer — the real answer moves exactly one viewpoint.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: TESTPREP_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '4', cedTopic: '4.5', cedTitle: 'Conflicting Viewpoints' },
  pacingThresholds: TESTPREP_PACING_THRESHOLDS,
};
