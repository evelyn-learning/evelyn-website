/**
 * Digital SAT — Reading & Writing: Command of Evidence (Quantitative).
 *
 * A passage states a claim and is paired with a table or graph. The
 * question asks which data point BEST supports (or completes) the claim.
 * The digital SAT's quantitative evidence questions reward precision:
 * matching the claim's exact category, measure, and direction — not just
 * finding the biggest or most memorable number in the data.
 */

import type { LessonPlan } from '../types';
import { TESTPREP_PACING_THRESHOLDS, TESTPREP_SOURCE } from './_testprep-shared';

export const SEED_DSAT_U5_QUANTITATIVE_EVIDENCE: LessonPlan = {
  id: 'evelyn.testprep.dsat.quantitative-evidence.v1',
  title: 'Command of Evidence: Quantitative',
  curriculum: 'SAT',
  grade: 'sat-act',
  subject: 'test-prep',
  topic: 'digital-sat',
  locale: 'en',
  los: [
    {
      id: 'dsat.quantitative-evidence',
      standard: 'DSAT-5.3',
      description:
        'Identify which data point in a table or graph best supports or completes a passage\'s stated claim, distinguishing true-but-irrelevant data from data that precisely matches the claim\'s category and direction.',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame quantitative evidence as a recurring, scoreable Information-and-Ideas pattern worth several questions per test.',
      script:
        'A handful of Reading & Writing questions each test pair a short passage with a table or graph and ask which data point best supports the claim. The reading is short — the whole game is matching data to claim precisely. Learn the traps and these become quick, reliable points.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-quantitative-evidence',
      kind: 'concept',
      goal: 'The claim-to-checklist strategy plus the named traps in quantitative evidence questions.',
      keyIdeas: [
        'THE FORMAT — a short passage states a claim, then a table or graph is described. The question asks which choice provides the data point that best SUPPORTS (or COMPLETES) the claim.',
        'STEP 1 — restate the claim in your own words BEFORE reading the choices. Break it into parts: which group/category, which measure, which direction (increase, decrease, highest, lowest).',
        'STEP 2 — scan the table for the row(s) and column(s) that match every part of the claim, not just one.',
        'TRAP: WRONG ROW/COLUMN — the number is real and pulled from the correct table, but it describes a different time period, group, or category than the claim names.',
        'TRAP: REVERSED DIRECTION — the data point is accurate but shows the opposite trend from what the claim states (a rise cited to support a claim about a plateau or decline).',
        'TRAP: EXTREME BUT IRRELEVANT — the biggest or smallest value in the table, tempting because it sounds impressive, but it doesn\'t address the SPECIFIC comparison the claim makes.',
        'TRAP: TRUE BUT INCOMPLETE — a choice that is factually correct about the data but only confirms part of the claim (e.g., confirms a rank but not a trend, or a trend but not which group).',
        'STRATEGY — treat the claim like a checklist and test each choice against ALL of its parts before picking the one that satisfies every box.',
      ],
      vocabulary: [
        { term: 'quantitative evidence', definition: 'numerical data — a table or graph value — offered to support or complete a stated claim.' },
        { term: 'data point', definition: 'one specific value from a table or graph, tied to a category and a measure.' },
        { term: 'trend', definition: 'the direction data moves across categories or time — increasing, decreasing, or roughly flat.' },
      ],
      suggestedTools: ['show_text'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-typical',
      kind: 'worked_example',
      problem:
        'Read the passage: A city planner claims: "Since the bike-lane expansion, Downtown saw a bigger drop in average commute time than Uptown or Riverside." Average commute time (minutes): Downtown — 2022: 29, 2024: 21. Uptown — 2022: 33, 2024: 30. Riverside — 2022: 25, 2024: 24. Question: Which choice best supports the planner\'s claim? (A) Uptown\'s commute time dropped from 33 to 30 minutes. (B) Riverside\'s commute time dropped from 25 to 24 minutes. (C) Downtown\'s commute time dropped from 29 to 21 minutes, the largest decrease of the three neighborhoods. (D) All three neighborhoods saw some decrease in commute time.',
      steps: [
        'Restate the claim: DOWNTOWN specifically had the BIGGEST drop, compared to Uptown and Riverside — two parts to satisfy.',
        'Compute each neighborhood\'s drop: Downtown 29 → 21 = 8 minutes. Uptown 33 → 30 = 3 minutes. Riverside 25 → 24 = 1 minute.',
        'Check each choice: (A) and (B) name the wrong neighborhood. (D) is true but too general — it never says Downtown had the LARGEST drop, so it doesn\'t complete the specific claim. (C) names Downtown AND states it was the largest decrease — both parts of the claim are satisfied.',
      ],
      answer: '(C)',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-trap',
      kind: 'worked_example',
      problem:
        'Read the passage: A nutrition study tracked afternoon energy self-ratings (1–10 scale) for participants grouped by daily water intake. A columnist claims: "The data show that once water intake passed 6 cups per day, participants\' energy ratings stopped improving." Average energy rating by cups/day: 2 cups — 4.1. 4 cups — 5.6. 6 cups — 7.2. 8 cups — 7.3. 10 cups — 7.1. Question: Which choice best completes the columnist\'s claim? (A) The jump from 2 to 4 cups raised the rating from 4.1 to 5.6. (B) The jump from 4 to 6 cups raised the rating from 5.6 to 7.2. (C) Beyond 6 cups, ratings moved only from 7.2 to 7.3 to 7.1 — essentially flat. (D) At 10 cups per day, the average rating was 7.1, the second-highest value recorded.',
      steps: [
        'Restate the claim precisely: BEYOND 6 cups, improvement STOPS (plateaus) — not the rise before 6 cups, and not simply "still a high value."',
        '(A) and (B) describe the RISING portion of the data (2→4 and 4→6 cups) — real numbers, but the wrong rows: they\'re before the claimed plateau even starts.',
        '(D) is tempting — 7.1 is genuinely the second-highest value in the table — but that fact says nothing about whether ratings kept improving; it\'s an extreme-but-irrelevant trap.',
        '(C) covers exactly the range the claim is about (6 through 10 cups) and shows the ratings barely moving (7.2 → 7.3 → 7.1) — precisely "stopped improving."',
      ],
      answer: '(C)',
      estimatedMinutes: 3,
    },
    {
      id: 'try-basic-match',
      kind: 'try_yourself',
      problem:
        'Read the passage: A city compares annual visits across three library branches. Claim: "The Eastside branch experienced the sharpest increase in visits from 2022 to 2024." Annual visits — Eastside: 2022: 12,000, 2024: 19,000. Westside: 2022: 15,000, 2024: 18,000. Central: 2022: 20,000, 2024: 23,000. Which choice best supports the claim?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Eastside visits rose from 12,000 to 19,000 between 2022 and 2024, a bigger increase than either other branch.', correct: true },
        { id: 'b', text: 'Central branch had the highest total visits in both 2022 and 2024.' },
        { id: 'c', text: 'Westside visits rose from 15,000 to 18,000 between 2022 and 2024.' },
        { id: 'd', text: 'All three branches saw visit increases from 2022 to 2024.' },
      ],
      expectedAnswer: 'Eastside visits rose from 12,000 to 19,000 between 2022 and 2024, a bigger increase than either other branch.',
      hints: [
        'Compute each branch\'s increase before comparing the choices: Eastside +7,000, Westside +3,000, Central +3,000.',
        'The claim needs BOTH the branch name (Eastside) and the comparative word "sharpest" — find the option that names Eastside and states it had the largest increase.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-direction-trap',
      kind: 'try_yourself',
      problem:
        'Read the passage: A gym tracks average weekly workout minutes for members in a new coaching program versus a control group with no coaching, over three months. Claim: "By month 3, the coached group\'s average weekly workout time had grown faster than the control group\'s." Average weekly minutes — Month 1: coached 120, control 118. Month 2: coached 145, control 122. Month 3: coached 175, control 130. Which choice best supports the claim?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'In month 1, the coached group averaged 120 minutes compared to the control group\'s 118 minutes.' },
        { id: 'b', text: 'From month 1 to month 3, the coached group\'s average rose by 55 minutes, compared to a 12-minute rise for the control group.', correct: true },
        { id: 'c', text: 'In month 3, the control group averaged 130 minutes, its highest value in the study.' },
        { id: 'd', text: 'The coached group\'s average was higher than the control group\'s in every month recorded.' },
      ],
      expectedAnswer: 'From month 1 to month 3, the coached group\'s average rose by 55 minutes, compared to a 12-minute rise for the control group.',
      hints: [
        'The claim is about which group GREW FASTER, not which group had a higher raw number at any one point.',
        'Compute the total change from month 1 to month 3 for each group (coached: 175 − 120; control: 130 − 118), then compare the two changes.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-irrelevant-trap',
      kind: 'try_yourself',
      problem:
        'Read the passage: A survey rated resident satisfaction (1–10) with a new recycling program after residents attended an informational workshop. Claim: "Oakview, which had the highest workshop attendance, also had the highest recycling-program satisfaction rating." Workshop attendance and satisfaction — Pinehill: 15% attended, 5.2 rating. Oakview: 72% attended, 8.6 rating. Maple Row: 40% attended, 6.5 rating. Birchton: 55% attended, 7.4 rating. Which choice best supports the claim?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Oakview had 72% workshop attendance, the highest among the four neighborhoods, and an average satisfaction rating of 8.6, also the highest.', correct: true },
        { id: 'b', text: 'Birchton had the second-highest attendance rate, 55%, and a satisfaction rating of 7.4.' },
        { id: 'c', text: 'Pinehill\'s satisfaction rating of 5.2 was the lowest recorded in the survey.' },
        { id: 'd', text: 'Maple Row\'s attendance rate of 40% was closest to the four-neighborhood average.' },
      ],
      expectedAnswer: 'Oakview had 72% workshop attendance, the highest among the four neighborhoods, and an average satisfaction rating of 8.6, also the highest.',
      hints: [
        'The claim names ONE neighborhood specifically — check which choice ties THAT neighborhood\'s attendance rank to its satisfaction rank.',
        'True statements about the other neighborhoods (Birchton, Pinehill, Maple Row) are accurate but don\'t complete a claim that is specifically about Oakview.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-biggest-number',
      kind: 'misconception_check',
      question:
        'A student picks the choice with the single biggest number in the table, reasoning that the most extreme value must be the best evidence. What\'s wrong with that approach?',
      commonErrors: [
        {
          answer: 'Picked the biggest or most dramatic-looking number in the table.',
          misconception: 'Assuming the most extreme value is automatically the best evidence.',
          correctsTo:
            'The best evidence is the data point that matches EVERY part of the claim — the right category, the right measure, the right direction — not just the most impressive number. A record-high or record-low value can be a true, verifiable fact from the table and still fail to support the SPECIFIC claim being tested. Turn the claim into a checklist (who/what group, which measure, which direction) and test each choice against all of it before choosing.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Quantitative evidence questions pair a claim with a table or graph — the right choice is the data point that precisely matches the claim, not the biggest or most memorable number.',
        'Turn the claim into a checklist (group, measure, direction) before scanning choices; a correct data point must satisfy ALL parts, not just one.',
        'Watch for wrong-row/column and reversed-direction traps: real numbers pulled from the right table but describing a different range, group, or trend than the claim states.',
        'A true, verifiable fact about the data can still be the WRONG answer if it doesn\'t complete the specific claim asked about.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: TESTPREP_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '5', cedTopic: '5.3', cedTitle: 'Command of Evidence: Quantitative' },
  pacingThresholds: TESTPREP_PACING_THRESHOLDS,
};
