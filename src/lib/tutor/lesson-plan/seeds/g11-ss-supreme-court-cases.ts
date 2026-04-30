/**
 * G11 — Landmark Supreme Court cases.
 *
 * Marbury, Plessy, Brown, Miranda, Roe, Brown II, Citizens United,
 * Obergefell. Each established a major principle in US law.
 */

import type { LessonPlan } from '../types';

export const SEED_G11_SS_SUPREME_COURT_CASES: LessonPlan = {
  id: 'evelyn.g11.ss.civics.supreme-court-cases.v1',
  title: 'Landmark Supreme Court cases',
  curriculum: 'NCSS',
  grade: '11',
  subject: 'ss',
  topic: 'civics',
  locale: 'en',
  los: [
    {
      id: 'ncss.911.civic.supreme-court',
      description: 'Analyze key Supreme Court decisions and their lasting impact on American law and society.',
      standard: 'NCSS.D2.Civ.4.9-12',
    },
  ],
  prerequisites: ['ncss.911.civic.branches'],
  followUps: [],
  estimatedMinutes: 17,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that 9 unelected justices have shaped American life.',
      script: 'Nine justices, never elected, ruling for life. They decide if school segregation is allowed, if police can search your phone, if you can marry whom you choose. The Supreme Court has shaped America as much as any law Congress has passed.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-key-cases',
      kind: 'concept',
      goal: 'Eight cases, the principle each established.',
      keyIdeas: [
        'MARBURY v. MADISON (1803): Established JUDICIAL REVIEW. The Court can strike down laws as unconstitutional. Without this, courts would be powerless against bad laws.',
        'PLESSY v. FERGUSON (1896): "Separate but equal" was constitutional. Permitted Jim Crow segregation laws for ~58 years.',
        'BROWN v. BOARD OF EDUCATION (1954): OVERTURNED Plessy. School segregation is inherently unequal — unconstitutional. Sparked civil rights movement.',
        'MIRANDA v. ARIZONA (1966): Police must inform suspects of their rights ("you have the right to remain silent…"). Protections for the accused under 5th and 6th Amendments.',
        'ROE v. WADE (1973): Constitutional right to abortion based on privacy. OVERTURNED in 2022 by Dobbs v. Jackson, sending the question back to states.',
        'CITIZENS UNITED v. FEC (2010): Corporations and unions can spend unlimited money on political speech. Massively expanded role of money in elections.',
        'OBERGEFELL v. HODGES (2015): Same-sex marriage is a constitutional right under 14th Amendment\'s equal protection.',
        'PATTERN: Court interprets the Constitution; what counts as "equal protection" or "due process" evolves with the Court\'s composition.',
      ],
      vocabulary: [
        { term: 'judicial review', definition: 'the power of courts to strike down laws as unconstitutional.' },
        { term: 'precedent', definition: 'an earlier court decision that influences later ones (stare decisis).' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-marbury',
      kind: 'worked_example',
      problem: 'Why is Marbury v. Madison (1803) the most important case in US history despite being about a relatively minor commission?',
      steps: [
        'BACKGROUND: outgoing president John Adams appointed Marbury as a judge. New president Jefferson refused to deliver the commission. Marbury sued.',
        'CHIEF JUSTICE MARSHALL\'s ruling: Marbury was entitled to his commission — but the law he\'d sued under was UNCONSTITUTIONAL.',
        'REVOLUTIONARY MOVE: by declaring a law unconstitutional, Marshall established that the COURT can do that. NOWHERE in the Constitution is this power explicitly granted.',
        'IMPACT: every Supreme Court ruling since rests on this self-granted power. Brown v. Board, Roe v. Wade, every constitutional ruling — all only possible because Marbury established judicial review.',
        'Without Marbury, Congress could pass any law and only Congress could undo it. With Marbury, courts can check Congress.',
      ],
      answer: 'established judicial review — the foundation of all later Supreme Court power',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Brown v. Board of Education (1954) overturned what earlier case, and on what principle?',
      expectedAnswer: 'Plessy v. Ferguson (1896); ruled separate is inherently NOT equal',
      responseFormat: 'free',
      hints: [
        'The earlier case allowed "separate but equal" segregation.',
        'Brown said separation in schools made true equality impossible.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-court-cant-be-overturned',
      kind: 'misconception_check',
      question: 'Once the Supreme Court rules, is that the law forever?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Treating Court rulings as eternal.',
          correctsTo: 'No — the Court can OVERTURN its own past rulings. Brown overturned Plessy. Dobbs overturned Roe. New justices can revisit old cases. Constitutional amendments can also override the Court (e.g., 16th Amendment overrode an income-tax ruling).',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Marbury (1803): judicial review — Court can strike down laws.',
        'Plessy (1896) → Brown (1954): segregation legal then illegal.',
        'Miranda (1966): police must inform suspects of rights.',
        'Roe (1973) → Dobbs (2022): abortion right granted then sent to states.',
        'Citizens United (2010): unlimited corporate political spending.',
        'Obergefell (2015): same-sex marriage right.',
        'The Court can overturn its own precedents — major rulings are not permanent.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why are Supreme Court justices appointed for LIFE rather than elected or term-limited?',
      hint: 'Framers wanted them INSULATED from political pressure — to rule on law, not popularity. But this means a single appointment can shape law for 30+ years. Trade-off between independence and accountability.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
