/**
 * AP Macroeconomics — Unit 1 FRQ Practice.
 *
 * End-of-unit consolidation: three FRQ-style problems exercising the
 * full Unit 1 surface (scarcity / PPC / comparative advantage / marginal
 * analysis). Problems are MODELED on documented past-exam patterns; the
 * AP Plans Initiative has a follow-up to swap in verbatim CB FRQs once
 * the FRQ scraper lands. Where possible the metadata records the
 * historical year/question this draft mirrors.
 *
 * Per Q8a-(5): each unit gets one dedicated FRQ-practice plan.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_MACRO_U1_FRQ_PRACTICE: LessonPlan = {
  id: 'evelyn.ap.macro.u1-frq-practice.v1',
  title: 'Unit 1 FRQ Practice',
  curriculum: 'AP',
  grade: '12',
  subject: 'ss',
  topic: 'ap-macroeconomics',
  locale: 'en',
  los: [
    {
      id: 'apmacro.u1-frq-practice',
      description:
        'Apply Unit 1 concepts (scarcity, PPC, opportunity cost, comparative advantage, marginal analysis) to multi-part free-response problems with AP-style rubric scoring.',
      standard: 'AP-MACRO-1-FRQ',
    },
  ],
  prerequisites: [
    'apmacro.scarcity',
    'apmacro.resource-allocation',
    'apmacro.ppc',
    'apmacro.comparative-advantage',
    'apmacro.cost-benefit',
    'apmacro.marginal-analysis-consumer',
  ],
  followUps: [],
  estimatedMinutes: 32,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Set FRQ stakes: this is exam practice, not just review.',
      script:
        "Free-response questions are where AP Macro is won or lost — they make up half your score. The good news: every FRQ rewards SHOWING THE WORK. Even when you do not reach the final answer, partial credit accrues for each correctly-stated definition, each correct setup, each correct intermediate step. We will work through three Unit-1-style FRQs the way an AP grader scores them.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-frq-strategy',
      kind: 'concept',
      goal: 'Quick refresher on FRQ scoring conventions.',
      keyIdeas: [
        'AP MACRO FRQ STRUCTURE: 2-3 multi-part problems on each exam, broken into (a)/(b)/(c)/... sub-parts. Each sub-part scores independently — DO NOT skip a part because you struggled with the previous one.',
        'PARTIAL CREDIT: graders give points for correct DEFINITIONS, correct GRAPH ELEMENTS (axes, curves, labels), correct CALCULATIONS, and correct EXPLANATIONS. Each is a separate scoring opportunity.',
        'GRAPH RUBRIC: when a graph is required, the rubric scores it on (1) correctly labeled axes (price level on Y, real GDP on X for AD/AS, etc.), (2) correct curve names and slopes, (3) correct shifts when applicable, (4) correct equilibrium points labeled.',
        'SHOW YOUR WORK: a number with no calculation gets fewer points than a number with a brief computation. Show the formula, plug in, then state the answer.',
        'NEVER LEAVE A PART BLANK if you have ANY idea — guess the direction, name the concept, sketch the graph. Zero is worse than a partial attempt.',
        'TIME BUDGET on the AP Macro exam: ~10 min for each long FRQ, ~5-7 min for short FRQs. Practice pacing as much as content.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'worked-frq-example',
      kind: 'worked_example',
      problem:
        'Sample FRQ (modeled on AP Macro past exam structure): Country X has the following PPC for cars and grain: 100 cars OR 200 grain, bowed-out. (a) Define opportunity cost. (b) Compute the opportunity cost of moving from (40 cars, 175 grain) to (70 cars, 120 grain). (c) Country X is currently at (30 cars, 100 grain). Identify whether this is on, inside, or outside the curve, and explain what economic condition this typically signals.',
      steps: [
        'PART (a): DEFINITION. "Opportunity cost is the value of the next-best alternative forgone when a choice is made." Worth 1 point. A vague answer like "what you give up" earns partial; a precise answer with "next-best alternative" earns full.',
        'PART (b): CALCULATION. From (40, 175) to (70, 120). Cars gained: 70-40 = 30. Grain lost: 175-120 = 55. Opportunity cost of 30 cars = 55 grain. Per car: 55/30 ≈ 1.83 grain per car. State the formula (Δ grain / Δ cars), substitute, give the result. Worth 2 points: 1 for setup, 1 for correct numerical answer.',
        'PART (c): IDENTIFY + EXPLAIN. At x=30, the bowed-out curve y ≈ 200·√(1-0.09) = 200·√0.91 ≈ 191. The point (30, 100) has y=100 << 191, so the point is INSIDE the curve. This typically signals UNEMPLOYMENT or UNUSED PRODUCTIVE CAPACITY — resources that could be producing more of both goods are sitting idle. Worth 2 points: 1 for correct classification, 1 for correct economic interpretation.',
        'TOTAL FRQ POINTS POSSIBLE: 5. Expected ranges: 5/5 (full mastery), 3-4/5 (correct concept but missed a calc step), 1-2/5 (partial — got the definition but mishandled the math).',
      ],
      answer:
        '(a) Opportunity cost = next-best alternative forgone. (b) 55/30 ≈ 1.83 grain per car. (c) Inside the curve → typically signals unemployment / underutilized resources.',
      estimatedMinutes: 6,
    },
    {
      id: 'try-frq-ppc',
      kind: 'try_yourself',
      problem:
        "FRQ Practice 1 — PPC and opportunity cost. (a) Define a production possibilities curve. (b) Country Z's PPC has endpoints (0, 80) on the cheese axis and (40, 0) on the wine axis (linear). Compute the opportunity cost of producing 1 wine. (c) Country Z's government wants to increase production possibilities for both goods. Name two policy actions that could shift Z's PPC outward, and briefly explain how each would do so.",
      expectedAnswer:
        '(a) PPC = a graph showing the maximum combinations of two goods an economy can produce given fixed resources and technology. (1 point) (b) Linear PPC, slope = 80 cheese / 40 wine = 2 cheese per wine. So 1 wine costs 2 cheese in opportunity cost. (1 point for showing the slope; 1 point for the numerical answer = 2 points total) (c) Two policy actions: (i) INVEST IN CAPITAL (e.g. tax incentives for business investment, public infrastructure spending) → more capital per worker → both axes shift out. (ii) IMPROVE EDUCATION / HUMAN CAPITAL (training, R&D subsidies) → workers more productive → both axes shift out. Other valid answers: immigration (more labor), technology investment, trade liberalization (effective resource expansion). Each policy needs (a) a name, (b) a brief mechanism for how it grows productive capacity. (2 points: 1 per policy with mechanism)\nTotal: 5 points.',
      responseFormat: 'frq',
      hints: [
        'Part (a) is just the definition. State it precisely.',
        'Part (b) — for a linear PPC, slope is constant. Compute (cheese forgone) / (wine gained).',
        'Part (c) — what changes the productive CAPACITY? Resources or technology.',
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'try-frq-ca',
      kind: 'try_yourself',
      problem:
        "FRQ Practice 2 — Comparative advantage. Country A and Country B each have one hour of labor. Country A can produce 10 shirts OR 5 phones in one hour. Country B can produce 4 shirts OR 4 phones in one hour. (a) Compute the opportunity cost of one phone in each country. (b) Identify which country has the comparative advantage in phones, and which in shirts. Explain. (c) State a terms-of-trade rate (e.g. 'X shirts per phone') that would benefit BOTH countries if they specialize and trade. (d) The president of Country A says: 'Country A is better at making everything than Country B, so we should produce both goods ourselves and not trade.' Evaluate this argument.",
      expectedAnswer:
        '(a) Country A: 1 phone costs 10/5 = 2 shirts. Country B: 1 phone costs 4/4 = 1 shirt. (1 point for each opportunity cost = 2 points) (b) Country B has CA in phones (lower OC: 1 < 2). Country A has CA in shirts (1 phone in A costs 2 shirts; 1 phone in B costs 1 shirt; reciprocal: 1 shirt costs 0.5 phones in A vs 1 phone in B → A has lower OC for shirts: 0.5 < 1). (1 point for each correct CA assignment = 2 points; partial credit if assignment is right but explanation is missing) (c) Terms of trade must lie BETWEEN the two opportunity costs of phones: between 1 shirt (B\'s OC) and 2 shirts (A\'s OC). Any rate like 1.5 shirts per phone would benefit both. (1 point) (d) The president is WRONG. Country A has ABSOLUTE advantage in everything (10>4 shirts/hour and 5>4 phones/hour) but Country B has COMPARATIVE advantage in phones (lower opportunity cost). When A specializes in shirts (its CA) and B in phones (its CA), and they trade at any rate strictly between 1 and 2 shirts per phone, BOTH countries can consume more than they could in autarky. Absolute advantage is irrelevant for trade decisions; comparative advantage is what determines mutually beneficial specialization. Strong answers explicitly distinguish AA from CA and cite the principle. (2 points)\nTotal: 7 points.',
      responseFormat: 'frq',
      hints: [
        'Compute opportunity cost from the per-hour production numbers.',
        'CA goes to the country with the LOWER opportunity cost in that good.',
        'Terms of trade range: strictly between the two opportunity costs.',
        'Part (d) — does AA matter for trade decisions, or does CA?',
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'try-frq-marginal',
      kind: 'try_yourself',
      problem:
        "FRQ Practice 3 — Marginal analysis and consumer choice. A consumer has $24 to spend on tacos ($3 each) and burritos ($6 each). MU schedule for tacos: 1st=24, 2nd=18, 3rd=15, 4th=9, 5th=6. MU schedule for burritos: 1st=42, 2nd=30, 3rd=24, 4th=12. (a) Compute the marginal utility per dollar (MU/P) for each unit of each good. (b) Find the utility-maximizing bundle within the $24 budget. (c) State the equimarginal principle and verify it holds (or note where it doesn't and why). (d) The consumer's friend says: 'Just buy the burritos — they have higher MU, so they must be the better choice.' Evaluate this argument.",
      expectedAnswer:
        '(a) MU/P for tacos (P=$3): 1st=8, 2nd=6, 3rd=5, 4th=3, 5th=2. MU/P for burritos (P=$6): 1st=7, 2nd=5, 3rd=4, 4th=2. (1 point for each schedule = 2 points)\n(b) Allocate one purchase per round, highest MU/P first.\n• Taco-1 (MU/P=8): buy. $21 left.\n• Burrito-1 (7) vs Taco-2 (6): burrito wins. Buy burrito-1. $15 left.\n• Taco-2 (6) vs Burrito-2 (5): taco wins. Buy taco-2. $12 left.\n• Burrito-2 (5) tied with Taco-3 (5). Pick either; say burrito-2. $6 left.\n• Taco-3 (5) vs Burrito-3 (4): taco wins. Buy taco-3. $3 left.\n• Burrito-3 (4) costs $6, can\'t afford. Taco-4 (MU/P=3) costs $3 → buy. $0 left.\nFinal bundle: 4 tacos + 2 burritos. Total spent = 4×$3 + 2×$6 = $24. ✅\nTotal utility = (24+18+15+9) + (42+30) = 66 + 72 = 138 utils. (2 points: 1 for the allocation method, 1 for correct final bundle)\n(c) Equimarginal: MU_taco/P_taco = MU_burrito/P_burrito at the optimum. Last taco bought (taco-4) has MU/P=3. Last burrito bought (burrito-2) has MU/P=5. They are NOT equal — the budget binds asymmetrically. The consumer would prefer Burrito-3 (MU/P=4) over Taco-4 (MU/P=3) but can\'t afford a $6 burrito with only $3 left. Strict equimarginal equality fails because of the integer constraint and budget binding; in continuous units the principle would be exactly satisfied. (1 point for stating the principle correctly; 1 point for noting where it fails or holds)\n(d) The friend is WRONG. Higher MU does not equal "better choice" — what matters is MU PER DOLLAR. Burritos have higher raw MU but cost twice as much. Comparing MU/P shows a mixed bundle is better than burritos-only. With $24, all-burritos = 4 burritos × $6 = $24, total utility = 42+30+24+12 = 108 utils. The mixed bundle yields 138 utils — 30 more — for the same money. The friend conflates raw MU with the dollar-adjusted decision metric. (2 points)\nTotal: 8 points.',
      responseFormat: 'frq',
      hints: [
        'Always compute MU/P first — that is the comparison metric.',
        'Allocate one purchase at a time, picking the highest available MU/P each round.',
        'For (c), check whether MU/P of the LAST units bought are equal across goods.',
        'For (d), compute and compare total utility of all-burritos vs the mixed bundle.',
      ],
      estimatedMinutes: 7,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'FRQs reward partial credit. ALWAYS attempt every part.',
        'Show your work — formula, substitution, answer. A bare number gets fewer points.',
        'PPC: state the definition, compute opportunity cost via Δ-up / Δ-across, identify regions correctly.',
        'Comparative advantage: compute OC, identify CA via lower OC, terms-of-trade range strictly between the two OCs.',
        'Consumer choice: MU/P is the decision metric, not raw MU. Allocate from highest MU/P down until budget exhausts.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '1',
    cedTopic: '1-FRQ',
    cedTitle: 'Unit 1 FRQ Practice',
    sources: [
      { type: 'frq-style', source: 'AP Plans Initiative author', note: 'Modeled on documented past AP Macro FRQ patterns (PPC + opportunity cost, comparative advantage 2x2, consumer choice with MU/P). Verbatim CB FRQs to be swapped in once scrape-ced-frqs.ts ships.' },
    ],
  },
};
