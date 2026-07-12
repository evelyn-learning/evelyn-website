/**
 * AP US History — Period 8 LEQ Practice: the full Long Essay Question
 * (AP APUSH Free-Response Question 2/3/4 — the LEQ).
 *
 * Unlike the DBQ, the LEQ gives NO documents — the student argues entirely
 * from their own historical knowledge of the period. This plan intentionally
 * sets no `passageId`/`passageIds` on the try_yourself segment.
 *
 * Prompt targets the civil rights movement (LO 8.9, civil-rights-movement)
 * and its transformation of American society across the full Period-8 span
 * (1945-1980), scored against the authentic AP APUSH 6-point LEQ rubric.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APUSH_U8_LEQ_PRACTICE: LessonPlan = {
  id: 'evelyn.ap.apush.u8-leq-practice.v1',
  title: 'Period 8 LEQ Practice',
  curriculum: 'AP',
  grade: '11',
  subject: 'ss',
  topic: 'ap-us-history',
  locale: 'en',
  los: [
    {
      id: 'apush.u8-leq-practice',
      description:
        'Write a complete AP APUSH Long Essay Question response evaluating the extent to which the civil rights movement transformed American society, 1945-1980 — a defensible thesis with a line of reasoning, contextualization, specific evidence drawn from the student\'s own knowledge, and historical reasoning/analysis — scored against the authentic AP APUSH 6-point LEQ rubric.',
      standard: 'AP-APUSH-8-LEQ',
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
  estimatedMinutes: 48,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the stakes of a timed, full LEQ essay concrete before the student sits down to write one, and flag the key difference from the DBQ: there are no documents — every piece of evidence has to come from what the student already knows.',
      script:
        "You've now studied the full arc of the civil rights movement, from Brown v. Board through the Voting Rights Act and its later shift toward Northern issues and Black Power. Today you put that knowledge to the test in the Long Essay Question — FRQ 2, 3, or 4 on the AP US History exam, scored on the authentic 6-point rubric: Thesis (1), Contextualization (1), Evidence (2), and Analysis and Reasoning (2). Here's the big difference from a DBQ: there are NO documents. Every piece of evidence in your essay has to come from your own knowledge of the period. You write the whole essay and get scored the way an AP reader would score it.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-leq-task-and-rubric',
      kind: 'concept',
      goal: 'Frame exactly what the LEQ task asks for and how the 6-point rubric awards points, row by row.',
      keyIdeas: [
        'THE TASK: evaluate a historical claim using ONLY your own knowledge — no documents are provided. The single most common way students lose points is listing facts about the period without connecting them to an argument, or writing evidence with no analysis of why it matters.',
        'ROW A — THESIS/CLAIM (0-1 point): full credit requires a thesis that makes a historically defensible claim responding to the prompt AND establishes a line of reasoning — e.g. taking a clear position on the EXTENT (largely transformed, transformed only in law but not in daily life, or transformed unevenly across regions and decades) to which the civil rights movement changed American society, not a vague restatement of the prompt.',
        'ROW B — CONTEXTUALIZATION (0-1 point): full credit requires describing, in at least a full sentence, a broader context relevant to the prompt — e.g. that Black Americans who served in a war fought partly against Nazi racial ideology returned home to a country that still enforced legal segregation, an ideological contradiction that helped energize a postwar push for change well before 1954.',
        'ROW C — EVIDENCE (0-2 points): 1 point for including at least two specific, accurate historical facts relevant to the topic; the full 2 points require using specific evidence to support an argument in response to the prompt — e.g. Brown v. Board of Education (1954) establishing the constitutional principle against school segregation, the Montgomery Bus Boycott (1955-56) and Birmingham campaign (1963) building sustained pressure through nonviolent direct action, the Civil Rights Act of 1964 and Voting Rights Act of 1965 as the movement\'s major legislative achievements, and the persistence of Northern urban unrest (Watts 1965, Detroit and Newark 1967) and the rise of Black Power as evidence of what those statutes did NOT resolve.',
        'ROW D — ANALYSIS AND REASONING (0-2 points): 1 point for using historical reasoning (e.g. causation, continuity/change) to frame the argument; the full 2 points require that reasoning to be used to support an argument that fully addresses the prompt, weighing evidence on both sides where relevant — e.g. explaining HOW Brown\'s legal principle, left unenforced by itself, directly CAUSED a decade of further organizing (Montgomery, Little Rock, Birmingham) that in turn produced the 1964 and 1965 statutes — while also explaining why that same causal chain did not automatically reach Northern de facto segregation or economic inequality, which is what CAUSED the movement\'s post-1965 shift and the rise of Black Power.',
        'Total = 6 points, integer, summed across the four rows (Evidence and Analysis/Reasoning are each worth 2) — the authentic AP APUSH LEQ scale, distinct from the 7-point DBQ rubric used elsewhere in the catalog.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'try-full-essay-leq',
      kind: 'try_yourself',
      problem:
        'Evaluate the extent to which the civil rights movement transformed American society in the period 1945–1980. In your response you should do the following: (1) respond to the prompt with a historically defensible thesis or claim that establishes a line of reasoning, (2) describe a broader historical context relevant to the prompt (contextualization), (3) support your argument with specific and relevant evidence, and (4) use historical reasoning to explain the relationships between the pieces of evidence and connect them to your argument (analysis and reasoning).',
      responseFormat: 'frq',
      expectedAnswer:
        'A full-credit response opens with a thesis arguing, for example, that the civil rights movement transformed American society substantially in law and formal status while leaving deeper economic and de facto segregation in the North largely unresolved by 1980, producing a change that was real but uneven rather than complete. Contextualization explains that Black Americans who served in a war fought partly against an ideology of racial supremacy returned to a country that still enforced legal segregation at home, an ideological contradiction, alongside the ongoing Great Migration to Northern cities, that helped energize a postwar push for change well before the movement\'s most famous events. The evidence section develops specific facts connected to the thesis: Brown v. Board of Education (1954) established the constitutional principle that segregated public schools violate the Fourteenth Amendment\'s Equal Protection Clause, rejecting "separate but equal," though it did not by itself desegregate a single classroom; the Montgomery Bus Boycott (1955-56) demonstrated that sustained, disciplined nonviolent action could force change and elevated Martin Luther King Jr. to national leadership; the Birmingham campaign (1963) and the March on Washington built the national attention and political pressure behind the Civil Rights Act of 1964 (banning discrimination in employment and public accommodations) and the Voting Rights Act of 1965 (banning discriminatory voting barriers); and after 1965, unrest in Northern cities (Watts in 1965, Detroit and Newark in 1967) alongside the rise of Black Power under leaders like Stokely Carmichael showed that legal victories in the South had not resolved persistent Northern joblessness, housing discrimination, and de facto segregation. Analysis and reasoning uses causation to connect these facts into an argument rather than a list: Brown\'s legal principle, left unenforced by itself, directly caused a decade of further organizing — Montgomery, Little Rock, Birmingham — because a court ruling alone could not change daily practice, and that organizing in turn directly caused the political momentum behind the 1964 and 1965 statutes; but that same causal chain, built around dismantling explicit Southern Jim Crow law, did not automatically reach Northern economic and housing conditions that were never legally mandated in the same way, which is precisely what caused the movement\'s post-1965 shift toward Northern urban issues and the emergence of Black Power as a parallel, more skeptical current within it — showing the movement\'s transformation of American society was real and historic in the realm of law and formal status, but incomplete and uneven once law met entrenched economic and de facto conditions.',
      rubric: {
        parts: [
          {
            criterionId: 'A-thesis',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): the thesis makes a historically defensible claim responding to the prompt (the extent to which the civil rights movement transformed American society, 1945-1980) AND establishes a line of reasoning for the essay to follow — a clear position on the extent and character of that transformation, not a restatement of the prompt or an unsupported assertion with no reasoning attached. No credit (0/1) for a thesis that only restates the prompt or is not historically defensible.',
            modelResponse:
              'The civil rights movement transformed American society substantially in law and formal status — dismantling legal segregation and securing federal voting protections — while leaving deeper economic inequality and de facto segregation in the North largely unresolved by 1980, producing change that was real and historic but uneven rather than complete.',
          },
          {
            criterionId: 'B-context',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): describes, in at least a full sentence of specific historical detail, a broader context relevant to the prompt — e.g. that Black Americans returning from World War II service confronted an ideological contradiction between fighting racial supremacy abroad and enduring legal segregation at home, alongside the ongoing Great Migration to Northern cities. No credit (0/1) for a single vague, unsupported phrase with no specific historical detail.',
            modelResponse:
              'Black Americans who served in a war fought partly against an ideology of racial supremacy returned home to a country that still enforced legal segregation, an ideological contradiction that, combined with the ongoing Great Migration of Black Southerners to Northern cities, helped energize a renewed postwar push for civil rights well before the movement\'s most famous events of the 1950s and 1960s.',
          },
          {
            criterionId: 'C-evidence',
            maxPoints: 2,
            scoringCriteria:
              'Full credit (2/2): uses specific, accurate historical evidence (e.g. Brown v. Board of Education, the Montgomery Bus Boycott, the Birmingham campaign, the Civil Rights Act of 1964, the Voting Rights Act of 1965, Northern urban unrest, Black Power) to support an argument in response to the prompt. 1/2: includes at least two specific, accurate facts relevant to the topic, whether or not they are clearly used to support an argument. 0/2: fewer than two specific facts, or evidence that is inaccurate or not relevant to the topic.',
            modelResponse:
              'Brown v. Board of Education (1954) established the constitutional principle against school segregation without by itself desegregating a single classroom; the Montgomery Bus Boycott (1955-56) showed sustained nonviolent action could force change and elevated Martin Luther King Jr. to national leadership; the Birmingham campaign (1963) and March on Washington built the pressure behind the Civil Rights Act of 1964 and Voting Rights Act of 1965; and unrest in Northern cities (Watts 1965, Detroit and Newark 1967) alongside the rise of Black Power under Stokely Carmichael showed persistent problems those statutes had not resolved.',
          },
          {
            criterionId: 'D-analysis',
            maxPoints: 2,
            scoringCriteria:
              'Full credit (2/2): uses historical reasoning (e.g. causation) to connect the evidence into an argument that fully addresses the prompt, explaining HOW and WHY the pieces of evidence relate to each other and to the thesis. 1/2: uses some historical reasoning to frame the response, but the connections between evidence and argument are inconsistent, or only partially developed. 0/2: evidence is listed with no explanation of how it relates to the argument, or no historical reasoning is used.',
            modelResponse:
              'Brown\'s legal principle, left unenforced by itself, directly caused a decade of further organizing (Montgomery, Little Rock, Birmingham) because a court ruling alone could not change daily practice — and that organizing in turn directly caused the political momentum behind the 1964 and 1965 statutes. But that same causal chain, built around dismantling explicit Southern Jim Crow law, did not automatically reach Northern economic and housing conditions that had never been legally mandated in the same way, which is precisely what caused the movement\'s post-1965 shift toward Northern urban issues and the emergence of Black Power as a parallel, more skeptical current.',
          },
        ],
      },
      hints: [
        'Take a clear position on the EXTENT and CHARACTER of the transformation — "largely transformed in law but not in daily economic life" is more defensible than a flat "yes" or "no."',
        'Since there are no documents, every piece of evidence needs to come from what you already know about the period — be specific (name the actual event, law, or organization), not general.',
        'Use causation to connect your evidence: does one event or ruling directly CAUSE the next stage of the movement, or a later problem you\'re also discussing?',
        'The post-1965 Northern shift and Black Power are useful for showing the transformation was uneven, not complete — a nuanced argument tends to score the strongest analysis and reasoning.',
      ],
      estimatedMinutes: 40,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The LEQ has NO documents — every piece of evidence has to come from your own knowledge of the period.',
        'The 6-point rubric: Thesis (1); Contextualization (1); Evidence (2, requires evidence used to SUPPORT an argument for full credit); Analysis and Reasoning (2, requires explaining HOW evidence connects, not just listing facts).',
        'Causation is a strong reasoning tool here: Brown\'s unenforced principle caused further organizing, which caused the 1964/1965 statutes, which did not by themselves reach Northern conditions.',
        'A nuanced thesis (transformed in law, less so in daily economic life) tends to score better than an all-or-nothing claim.',
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '8',
    cedTopic: '8-LEQ',
    cedTitle: 'Period 8 LEQ Practice',
    sources: [
      {
        type: 'frq-style',
        source: 'AP Plans Initiative author',
        note: 'Modeled on the authentic AP APUSH Long Essay Question task wording and 6-point rubric (Thesis 1 / Contextualization 1 / Evidence 2 / Analysis-Reasoning 2).',
      },
    ],
  },
};
