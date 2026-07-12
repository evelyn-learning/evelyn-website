/**
 * AP World History: Modern — Unit 4 SAQ Practice: a full three-part Short
 * Answer Question (AP World Section I Part B, the SAQ format — not an FRQ),
 * stimulus-based on the Potosí silver table.
 *
 * This SAQ explicitly says "use the table below," so it DOES set a single
 * `passageId` (the SAQ shape's stimulus convention — a passageId is only
 * appropriate when the prompt explicitly quotes/references a document; here
 * it does). Each of the three parts is graded independently, 1 point each,
 * brief-response format (2-4 sentences), scored against the authentic AP
 * World SAQ rubric style. Draws on the global Columbian Exchange (4.3).
 *
 * KEY-AMBIGUITY DISCIPLINE (a lesson from a sibling unit): part (a)'s key is
 * checked against the table's ACTUAL two Potosí sub-periods — 1574-1735
 * (~18,000 metric tons, ~112 t/yr average) versus 1736-1760 (~1,600 metric
 * tons, ~67 t/yr average, explicitly described in the passage as a decline)
 * — so "1574-1735" is the only period a correct reading of the table can
 * identify as the peak; the table's separate 1550-1800 Spanish-America-wide
 * span carries a single cumulative total (136,000 t), not a period-specific
 * output figure, so it cannot be mistaken for the peak-output period.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APWORLD_U4_SAQ_PRACTICE: LessonPlan = {
  id: 'evelyn.ap.apworld.u4-saq-practice.v1',
  title: 'Unit 4 SAQ Practice — Reading the Potosí Silver Table',
  curriculum: 'AP',
  grade: '10',
  subject: 'ss',
  topic: 'ap-world-history',
  locale: 'en',
  los: [
    {
      id: 'apworld.u4-saq-practice',
      description:
        'Answer a complete three-part AP World History Short Answer Question using the Potosí silver table as a stimulus — briefly identifying and explaining specific historical developments in short, focused responses grounded in the table\'s stated figures — scored against the authentic AP World SAQ rubric (1 point per part).',
      standard: 'AP-APWORLD-4-SAQ',
    },
  ],
  prerequisites: [
    'apworld.maritime-exploration',
    'apworld.columbian-exchange-global',
    'apworld.maritime-empires',
    'apworld.atlantic-slave-trade',
    'apworld.resistance-accommodation',
  ],
  followUps: [],
  estimatedMinutes: 24,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the stakes of a timed, full three-part SAQ concrete before the student answers one, and contrast its short, targeted answers with the long-essay demands of the DBQ/LEQ.',
      script:
        "You've studied how Potosí silver tied Spanish America to Ming China's monetary economy. Now you'll answer a Short Answer Question — one of three SAQs on the AP World History exam, each worth 3 points total, 1 point per part. Unlike the DBQ and LEQ, an SAQ doesn't want a full essay: each part just wants you to briefly identify or explain ONE specific thing, grounded in the table below, in a few sentences. Precision beats length here — and every claim you make about the table has to match what it actually says.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-saq-task-and-rubric',
      kind: 'concept',
      goal: 'Frame exactly what each part of the SAQ asks for, how to read the table\'s figures precisely, and how the 1-point-per-part rubric awards credit.',
      keyIdeas: [
        'THE TASK: each part (a, b, c) asks you to briefly IDENTIFY or EXPLAIN one specific historical development, grounded in the table\'s stated figures — not to write a full essay with a thesis. No contextualization, no outside-evidence requirement beyond what a part asks for, no line of reasoning across paragraphs: each part stands alone and is graded independently.',
        '"Briefly identify" wants an accurate reading of the stimulus stated directly — here, correctly picking out the period or figure the table actually supports, not a plausible-sounding guess.',
        '"Briefly explain" wants you to go one step further than identification: state a fact grounded in (or consistent with) the table AND connect it to WHY or HOW it matters to the specific question asked.',
        'READ THE TABLE\'S PERIODS CAREFULLY: the table gives Potosí-specific figures for two distinct periods — approximately 18,000 metric tons over 1574-1735 (an average of roughly 112 metric tons per year) versus approximately 1,600 metric tons over 1736-1760 (roughly 67 metric tons per year), which the table itself describes as a decline. The 1550-1800 span is a separate, Spanish-America-wide cumulative total (136,000 metric tons), not a period with its own annual figure — so it is never the correct answer to a question about Potosí\'s peak output specifically.',
        'The single most common way students lose SAQ points here is citing a real figure from the table but attaching it to the wrong claim (e.g. citing the 30-40 percent China figure while explaining an effect on Spain instead of China). Each part is worth 1 point, graded independently — missing part (a) does not prevent full credit on (b) or (c). Total = 3 points across the three parts.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'try-full-saq',
      kind: 'try_yourself',
      problem:
        'Use the table below to answer parts (a), (b), and (c).\n(a) Identify the period shown in the table during which Potosí\'s registered silver output, on an annual average basis, reached its peak.\n(b) Explain ONE way American silver, as shown in the table, affected Ming China\'s economy in this period.\n(c) Explain ONE consequence for Spain\'s economy of the silver dependence described in the table.',
      responseFormat: 'frq',
      passageId: 'evelyn.passage.apworld-potosi-silver-table.v1',
      expectedAnswer:
        '(a) The table shows Potosí\'s registered silver output at its peak in the 1574-1735 period, when it produced approximately 18,000 metric tons (an average of roughly 112 metric tons per year) — far above the approximately 1,600 metric tons (roughly 67 metric tons per year) it produced during the following 1736-1760 period, which the table describes as a decline. (b) As the table shows, an estimated 30 to 40 percent of all American silver production flowed onward across the Pacific to China, chiefly via the Manila galleon route established in 1571, drawing a substantial share of Spanish America\'s silver output into the Chinese monetary economy — silver the Ming state increasingly needed as its tax system was converted to require payment in silver. (c) The table shows Spanish America producing roughly 136,000 metric tons of silver from 1550 to 1800, on the order of 80 percent of the world\'s documented output, and this massive, sustained silver influx into Spain drove sustained price inflation (often called the Price Revolution) as the money supply grew faster than the underlying supply of goods.',
      rubric: {
        parts: [
          {
            criterionId: 'a',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): identifies 1574-1735 as the period of Potosí\'s peak registered silver output (by total tons or by annual average), correctly reading the table\'s explicit contrast between that period\'s ~18,000 metric tons (~112 t/yr) and the 1736-1760 period\'s decline to ~1,600 metric tons (~67 t/yr). No credit (0/1) for identifying 1736-1760, the 1550-1800 Spanish-America-wide span (which carries a single cumulative total, not a period-specific peak figure), or an unsupported period.',

            modelResponse:
              'The table shows Potosí\'s registered silver output at its peak in the 1574-1735 period, when it produced approximately 18,000 metric tons (an average of roughly 112 metric tons per year) — far above the approximately 1,600 metric tons (roughly 67 metric tons per year) it produced during the following 1736-1760 period, which the table itself describes as a decline.',
          },
          {
            criterionId: 'b',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): explains a specific, accurate effect of American silver on Ming China\'s economy grounded in the table\'s 30-40 percent China-share figure — e.g. that a substantial share of American silver was drawn into China\'s monetary economy via the Manila galleon route, feeding the Ming state\'s silver-based tax demand. No credit (0/1) for a vague claim untethered from the table\'s stated figures, or for describing an effect on Spain instead of China.',
            modelResponse:
              'As the table shows, an estimated 30 to 40 percent of all American silver production flowed onward across the Pacific to China, chiefly via the Manila galleon route established in 1571, drawing a substantial share of Spanish America\'s silver output into the Chinese monetary economy as the Ming state\'s tax system increasingly required payment in silver.',
          },
          {
            criterionId: 'c',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): explains a specific, accurate consequence of Spain\'s silver dependence connected to the table\'s ~136,000-metric-ton, ~80-percent figure — e.g. sustained price inflation (the Price Revolution) as the money supply outgrew the supply of goods. No credit (0/1) for a vague or unsupported claim disconnected from the table\'s scale, or for describing an effect on China instead of Spain.',
            modelResponse:
              'The table shows Spanish America producing roughly 136,000 metric tons of silver from 1550 to 1800 — about 80 percent of the world\'s documented output — and this massive, sustained silver influx into Spain drove sustained price inflation, often called the Price Revolution, as the money supply grew faster than the underlying supply of goods.',
          },
        ],
      },
      hints: [
        'Each part just needs a specific fact grounded in the table — you don\'t need a thesis or an introduction.',
        'For part (a), compare the table\'s TWO Potosí periods (1574-1735 vs. 1736-1760) directly — the 1550-1800 span is a separate, hemisphere-wide total, not a period with its own peak figure.',
        '"Briefly explain" means going one step past the fact: connect it to WHY it matters to the specific question asked (China in (b), Spain in (c) — don\'t swap them).',
        'Answer each part independently — if you\'re unsure on (a), you can still earn full credit on (b) and (c).',
      ],
      estimatedMinutes: 15,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'An SAQ wants brief, specific identification/explanation per part, grounded in the stimulus — no thesis, no contextualization.',
        'Each part is graded independently and worth 1 point; missing one part does not cost you credit on the others.',
        'The table\'s two Potosí periods (1574-1735 vs. 1736-1760) show a clear peak-then-decline — the 1550-1800 span is a separate hemisphere-wide total, not a competing "peak" period.',
        'American silver tied Spain (price inflation, the Price Revolution) and China (a 30-40 percent share via the Manila galleon, feeding Ming silver-based taxation) into the same global silver circuit.',
      ],
      estimatedMinutes: 3,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '4',
    cedTopic: '4-SAQ',
    cedTitle: 'Unit 4 SAQ Practice — Reading the Potosí Silver Table',
    sources: [
      {
        type: 'frq-style',
        source: 'AP Plans Initiative author',
        note: 'Modeled on the authentic AP World History Short Answer Question task wording and rubric style (1 point per part, briefly identify/explain), stimulus-based on a described data table.',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apworld-potosi-silver-table.v1',
        chapter: '1550-1760',
        note: 'Registered Silver Output, Potosí and Spanish America (described data table) — sole stimulus for this SAQ.',
      },
    ],
  },
};
