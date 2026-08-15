/**
 * G11 — Great Depression and New Deal.
 *
 * Stock market crash, Dust Bowl, FDR's response. Permanent expansion
 * of federal government's role.
 */

import type { LessonPlan } from '../types';

export const SEED_G11_SS_GREAT_DEPRESSION_NEW_DEAL: LessonPlan = {
  id: 'evelyn.g11.ss.us-history.great-depression-new-deal.v1',
  title: 'The Great Depression and the New Deal',
  curriculum: 'NCSS',
  grade: '11',
  subject: 'ss',
  topic: 'us-history',
  locale: 'en',
  los: [
    {
      id: 'ncss.911.history.depression',
      description: 'Analyze the causes of the Great Depression and the impact of New Deal programs.',
      standard: 'NCSS.D2.His.14.9-12',
    },
  ],
  prerequisites: ['ncss.68.history.progressive-era'],
  followUps: ['ncss.911.history.world-war-2'],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Set the stakes — 25% unemployment, banks failing, families losing everything.',
      script: 'October 1929: the stock market crashed. By 1933, ONE in FOUR Americans was unemployed. Banks closed taking people\'s savings with them. Hungry families lined up for soup. This was the worst economic crisis in US history.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-causes-and-response',
      kind: 'concept',
      goal: 'Multiple causes triggered the crash; the New Deal redefined government\'s role.',
      keyIdeas: [
        'CAUSES of the Depression: 1) Stock speculation (people buying on margin = borrowing to buy stocks). 2) Bank failures (no insurance — savings vanished). 3) Overproduction — factories made more than people could buy. 4) Tariffs (Smoot-Hawley) crushed international trade. 5) Drought + Dust Bowl on the Plains.',
        'BLACK TUESDAY (Oct 29, 1929): biggest one-day stock crash. Wiped out billions in wealth. Many investors ruined; some died by suicide.',
        'HOOVER\'s response: limited. Believed government shouldn\'t intervene much. "Hoovervilles" — shantytowns — named bitterly after him.',
        'FDR (Franklin D. Roosevelt) elected 1932 on promise of a "New Deal".',
        'NEW DEAL — 3 Rs: RELIEF (jobs, food for desperate), RECOVERY (rebuild economy), REFORM (prevent next crisis).',
        'KEY PROGRAMS: CCC (jobs in parks/forests), WPA (jobs in arts and infrastructure), Social Security (1935 — pensions for elderly), FDIC (insured bank deposits), SEC (regulated stock market).',
      ],
      vocabulary: [
        { term: 'Great Depression', definition: 'global economic collapse from 1929 to ~1939.' },
        { term: 'New Deal', definition: 'FDR\'s package of reforms, programs, and laws to fight the Depression.' },
        { term: 'Dust Bowl', definition: 'severe dust storms in the Plains 1930s, caused by drought + over-farming.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-social-security',
      kind: 'worked_example',
      problem: 'Why was Social Security (1935) such a huge change in US history?',
      steps: [
        'Before 1935, the elderly relied on family or charity. No federal old-age pension existed.',
        'During the Depression, families couldn\'t support grandparents — many elderly were destitute.',
        'Social Security taxed workers and gave monthly checks to retirees, plus payments for the disabled and surviving children of dead workers.',
        'IMPACT: federal government took permanent responsibility for citizens\' economic security in old age — a massive expansion of government\'s role.',
        'Today Social Security is the single largest US federal program; over 65 million Americans receive checks.',
      ],
      answer: 'permanent federal responsibility for elderly economic security — biggest expansion of government role',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'What does FDIC do, and why did it matter after the 1929 crash?',
      expectedAnswer: 'insures bank deposits',
      responseFormat: 'free',
      hints: [
        'FDIC = Federal Deposit Insurance Corporation.',
        'Before FDIC, when a bank failed, you LOST your savings. After FDIC, the government guarantees up to a limit.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-new-deal-ended-depression',
      kind: 'misconception_check',
      question: 'Did the New Deal completely end the Great Depression?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Treating the New Deal as the full economic cure.',
          correctsTo: 'No — unemployment stayed high through the 1930s. What truly ended the Depression was WORLD WAR II spending: factories ran 24/7 making weapons. The New Deal RELIEVED suffering and reformed institutions, but didn\'t cure the economy.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Great Depression: started Oct 1929 with stock market crash, lasted through 1930s.',
        'Causes: speculation, bank failures, overproduction, tariffs, Dust Bowl.',
        'New Deal = FDR\'s 3 Rs: Relief, Recovery, Reform.',
        'Social Security and FDIC permanently changed government\'s role.',
        'WW2 spending finally ended the Depression.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'How is the 2008 financial crisis response similar to and different from the New Deal?',
      hint: 'Both involved bank rescues and stimulus. Both expanded federal regulation (Dodd-Frank vs Glass-Steagall/SEC). 2008 was much shorter; 1930s reforms were broader.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
