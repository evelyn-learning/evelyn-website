/**
 * AP US History — Period 8 SAQ Practice: a full three-part Short Answer
 * Question (AP APUSH Free-Response Question 1-3, the SAQ format), stimulus-
 * based on Truman's 1947 "Truman Doctrine" address.
 *
 * The prompt explicitly says "the excerpt" in part (a), so this plan SETS
 * `passageId` (the P3 gotcha in reverse: a passageId belongs whenever the
 * prompt explicitly references the document). Each of the three parts is
 * graded independently, 1 point each, brief-response format (2-4
 * sentences), scored against the authentic AP APUSH SAQ rubric style.
 *
 * DOCUMENT FIDELITY: part (a) draws only on what the excerpt itself states
 * (the two-ways-of-life framing and the three "I believe" commitments) —
 * Truman's excerpt never names Greece or Turkey. Parts (b) and (c) require
 * evidence BEYOND the excerpt (a specific 1947-1955 program/action, and a
 * specific domestic consequence), which the excerpt does not itself supply.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APUSH_U8_SAQ_PRACTICE: LessonPlan = {
  id: 'evelyn.ap.apush.u8-saq-practice.v1',
  title: 'Period 8 SAQ Practice',
  curriculum: 'AP',
  grade: '11',
  subject: 'ss',
  topic: 'ap-us-history',
  locale: 'en',
  los: [
    {
      id: 'apush.u8-saq-practice',
      description:
        'Answer a complete three-part AP APUSH Short Answer Question stimulus-based on the Truman Doctrine address — briefly describing and explaining specific historical developments in short, focused responses — scored against the authentic AP APUSH SAQ rubric (1 point per part).',
      standard: 'AP-APUSH-8-SAQ',
    },
  ],
  prerequisites: [
    'apush.cold-war-origins',
    'apush.postwar-society',
    'apush.civil-rights-movement',
    'apush.sixties-vietnam',
    'apush.seventies-crisis',
  ],
  followUps: [],
  estimatedMinutes: 24,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the stakes of a timed, full three-part SAQ concrete before the student answers one, and contrast its short, targeted answers with the long-essay demands of the DBQ/LEQ.',
      script:
        "You've studied how the Cold War reshaped American foreign policy and domestic life. Now you'll answer a Short Answer Question — one of three SAQs on the AP US History exam, each worth 3 points total, 1 point per part. This one gives you a short excerpt to work from: Truman's March 1947 address to Congress. Unlike the DBQ and LEQ, an SAQ doesn't want a full essay: each part just wants you to briefly describe or explain ONE specific thing, in a few sentences, with a concrete historical fact backing it up. Precision beats length here.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-saq-task-and-rubric',
      kind: 'concept',
      goal: 'Frame exactly what each part of the SAQ asks for and how the 1-point-per-part rubric awards credit, using the Truman Doctrine excerpt as the stimulus.',
      keyIdeas: [
        'THE TASK: each part (a, b, c) asks you to briefly DESCRIBE or EXPLAIN one specific historical development — not to write a full essay with a thesis. No contextualization, no outside-evidence requirement across all three parts, no line of reasoning across paragraphs: each part stands alone and is graded independently.',
        'THE STIMULUS: the excerpt is from Truman\'s address to a joint session of Congress, March 12, 1947. It frames the world as facing a choice between "alternative ways of life" and commits the United States, in three "I believe" statements, to "support free peoples who are resisting attempted subjugation by armed minorities or by outside pressures," to let them "work out their own destinies in their own way," and to help "primarily through economic and financial aid." Note what the excerpt does NOT do: it never names Greece or Turkey, the two countries the speech was actually about.',
        '"Briefly describe" wants an accurate historical fact or characteristic stated directly — here, part (a) wants the general POLICY COMMITMENT the excerpt announces (support for "free peoples" resisting subjugation), not the specific country-level details the excerpt omits.',
        '"Briefly explain" wants you to go one step further than description: state a fact AND connect it to WHY or HOW it matters to the specific question asked — parts (b) and (c) both require evidence from OUTSIDE the excerpt, since the excerpt itself names no specific program and describes no domestic consequence.',
        'The single most common way students lose SAQ points here is treating the excerpt as if it already supplies the specific 1947-1955 program (b) or domestic consequence (c) — it does not; those require the student\'s own outside knowledge, applied to explain what the excerpt\'s general commitment led to in practice.',
        'Each part is worth 1 point, graded independently — missing part (a) does not prevent full credit on (b) or (c). Total = 3 points across the three parts.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'try-full-saq',
      kind: 'try_yourself',
      problem:
        'Using the excerpt below from President Truman\'s address to a joint session of Congress, March 12, 1947, answer parts (a), (b), and (c).\n(a) Describe the policy commitment the excerpt announces.\n(b) Explain ONE specific program or action that implemented it (1947–1955).\n(c) Explain ONE domestic consequence of the Cold War consensus the excerpt helped create.',
      responseFormat: 'frq',
      passageId: 'evelyn.passage.apush-truman-doctrine.v1',
      expectedAnswer:
        '(a) The excerpt announces a commitment, stated in universal terms with no country named, "to support free peoples who are resisting attempted subjugation by armed minorities or by outside pressures," to let such peoples "work out their own destinies in their own way," and to provide that support "primarily through economic and financial aid" — the policy that came to be known as containment. (b) One specific program that implemented this commitment was the Marshall Plan (1948), a large-scale US economic aid program to rebuild Western European economies on the theory that poverty and instability made nations vulnerable to Communist movements, directly extending the excerpt\'s promise of "economic and financial aid" from the specific case of Greece and Turkey (which the excerpt itself does not name) to Western Europe as a whole; NATO (1949), a mutual-defense alliance committing the US to the military defense of Western Europe, or NSC-68 and the resulting Korean War intervention (1950-53), would also earn credit. (c) One domestic consequence was the Red Scare: the same Cold War consensus that committed the US to opposing Communism abroad fueled fear of Communist subversion at home, driving HUAC investigations and, from 1950, Senator Joseph McCarthy\'s sweeping accusations of Communist infiltration in government — damaging many careers and civil liberties until his methods were exposed in the televised Army-McCarthy hearings of 1954 and he was censured by the Senate; a large, sustained increase in peacetime defense spending (following NSC-68) would also earn credit.',
      rubric: {
        parts: [
          {
            criterionId: 'a',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): briefly and accurately describes the general policy commitment the excerpt itself announces — a US commitment to support "free peoples" resisting subjugation by armed minorities or outside pressures, mainly through economic/financial aid, stated in universal terms. No credit (0/1) for a vague statement with no specific content from the excerpt, or for naming Greece/Turkey as if the excerpt itself named them (it does not).',
            modelResponse:
              'The excerpt announces a US commitment, stated in universal terms, "to support free peoples who are resisting attempted subjugation by armed minorities or by outside pressures," to let them "work out their own destinies in their own way," with aid provided "primarily through economic and financial aid" — the policy that became known as containment.',
          },
          {
            criterionId: 'b',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): explains ONE specific, accurate 1947-1955 program or action that implemented the excerpt\'s commitment, drawing on outside knowledge since the excerpt itself names no specific program — e.g. the Marshall Plan (1948), NATO (1949), or NSC-68/the Korean War (1950-53). No credit (0/1) for a vague claim, an inaccurate program, or one not connected to the commitment in (a).',
            modelResponse:
              'The Marshall Plan (1948) provided large-scale US economic aid to rebuild Western European economies, on the theory that poverty and instability made nations vulnerable to Communist movements — a direct extension of the excerpt\'s promise of "economic and financial aid" from the specific case of Greece and Turkey to Western Europe as a whole.',
          },
          {
            criterionId: 'c',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): explains ONE specific, accurate domestic consequence of the Cold War consensus the excerpt\'s commitment helped create, drawing on outside knowledge since the excerpt describes no domestic consequence — e.g. the Red Scare/HUAC investigations and McCarthyism, or the sustained rise in defense spending following NSC-68. No credit (0/1) for a vague or unconnected consequence.',
            modelResponse:
              'One domestic consequence was the Red Scare: the same Cold War consensus that committed the US to opposing Communism abroad fueled fear of Communist subversion at home, driving HUAC investigations and, from 1950, Senator Joseph McCarthy\'s sweeping accusations of Communist infiltration in government, until his methods were exposed in the 1954 Army-McCarthy hearings and he was censured by the Senate.',
          },
        ],
      },
      hints: [
        'Each part just needs a specific, accurate fact — you don\'t need a thesis or an introduction.',
        'Part (a) should stick to what the excerpt actually says — it never names Greece or Turkey, so don\'t invent that the excerpt does.',
        'Parts (b) and (c) both require going BEYOND the excerpt — name a real program (Marshall Plan, NATO, NSC-68/Korea) and a real domestic consequence (Red Scare, defense spending) from your own knowledge.',
        'Answer each part independently — if you\'re unsure on (a), you can still earn full credit on (b) and (c).',
      ],
      estimatedMinutes: 15,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'An SAQ wants brief, specific description/explanation per part — no thesis, no contextualization requirement across parts.',
        'Each part is graded independently and worth 1 point; missing one part does not cost you credit on the others.',
        'When a prompt says "the excerpt," stick to what it actually contains — this excerpt never names Greece or Turkey, only the universal "free peoples" commitment.',
        'The Truman Doctrine\'s general commitment (containment) was implemented through specific programs (Marshall Plan, NATO, NSC-68/Korea) and carried real domestic consequences (the Red Scare, rising defense spending) that the excerpt itself does not describe.',
      ],
      estimatedMinutes: 3,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '8',
    cedTopic: '8-SAQ',
    cedTitle: 'Period 8 SAQ Practice',
    sources: [
      {
        type: 'frq-style',
        source: 'AP Plans Initiative author',
        note: 'Modeled on the authentic AP APUSH Short Answer Question task wording and rubric style (1 point per part, briefly describe/explain), stimulus-based on the Truman Doctrine address.',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apush-truman-doctrine.v1',
        chapter: '1947',
        note: 'Truman Doctrine address — the SAQ\'s single stimulus document.',
      },
    ],
  },
};
