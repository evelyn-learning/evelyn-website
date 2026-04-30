/**
 * AP US History — Jacksonian Era (1820s-1840s).
 *
 * Expansion of democracy (white men), Jackson's presidency, Bank
 * War, Indian Removal, rise of mass politics.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_USH_JACKSONIAN: LessonPlan = {
  id: 'evelyn.ap.ush.jacksonian-era.v1',
  title: 'The Jacksonian Era',
  curriculum: 'NCSS',
  grade: '11',
  subject: 'ss',
  topic: 'us-history',
  locale: 'en',
  los: [
    {
      id: 'apush.jacksonian',
      description: 'Analyze the political and social changes during the Jacksonian Era including expanded democracy and Indian Removal.',
      standard: 'AP-USH-NAT-3',
    },
  ],
  prerequisites: ['apush.early-republic'],
  followUps: ['apush.civil-war-causes'],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show the contradictions of "the people\'s president".',
      script: 'Andrew Jackson opened the White House to crowds of working-class supporters at his 1829 inauguration. Same Jackson signed the Indian Removal Act and crushed Native nations. The "Jacksonian Era" was simultaneously the most democratic period yet AND a time of brutal exclusion.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-key-developments',
      kind: 'concept',
      goal: 'Five pillars of the era + the contradictions.',
      keyIdeas: [
        'EXPANSION OF SUFFRAGE: by 1830s, almost all WHITE MEN could vote (property requirements dropped). Voter turnout surged. Women, Black men, Indigenous people remained excluded.',
        'JACKSON ELECTED 1828: framed himself as champion of the "common man". Self-made, military hero, rough.',
        'SPOILS SYSTEM: Jackson rotated federal jobs to political supporters. "To the victor go the spoils". Created modern political machine.',
        'BANK WAR: Jackson VETOED renewal of Second Bank of the US (1832), arguing it served wealthy elites. Bank shut down. Caused financial instability. Foreshadowed long debate over central banking.',
        'INDIAN REMOVAL ACT (1830): forced Cherokee, Creek, Choctaw, Chickasaw, Seminole from their southeastern homelands. TRAIL OF TEARS — 4,000 Cherokee died. Jackson DEFIED Supreme Court ruling that removal was illegal (Worcester v. Georgia, 1832).',
        'NULLIFICATION CRISIS (1832-33): South Carolina tried to "nullify" federal tariffs. Jackson stood firm — threatened force. Compromise tariff defused crisis. Foreshadowed secession arguments leading to Civil War.',
        'TWO-PARTY SYSTEM: Democrats (Jackson) vs Whigs (opposition led by Henry Clay). Modern American political parties trace from this rivalry.',
      ],
      vocabulary: [
        { term: 'spoils system', definition: 'rewarding political supporters with government jobs.' },
        { term: 'nullification', definition: 'the doctrine that states could declare federal laws void within their borders.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-bank-war',
      kind: 'worked_example',
      problem: 'Why did Jackson see the Second Bank of the US as anti-democratic, and what was the consequence of killing it?',
      steps: [
        'Jackson viewed the BUS as a tool of WEALTHY elites — its private shareholders profited from federal deposits.',
        'He saw Bank president Nicholas Biddle\'s influence as a threat to popular government.',
        'He VETOED the recharter (1832), making it a campaign issue. Won re-election.',
        'WITHDREW federal deposits, forcing the Bank to wind down.',
        'CONSEQUENCE: state banks issued unstable currency, Panic of 1837 followed (severe recession). The US wouldn\'t have a central bank again until the Federal Reserve in 1913.',
        'Jackson\'s populist victory came at real economic cost.',
      ],
      answer: 'killed BUS as elite-controlled; led to financial panic; no central bank until 1913',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'In the Trail of Tears, who was forcibly removed, and where did they go?',
      expectedAnswer: 'Cherokee (and other Five Civilized Tribes); marched from southeastern US to Oklahoma',
      responseFormat: 'free',
      hints: [
        'Five major tribes were removed.',
        'They were sent west to "Indian Territory".',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-jackson-democracy-everyone',
      kind: 'misconception_check',
      question: 'Did "Jacksonian Democracy" expand voting rights to EVERYONE?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Treating Jacksonian Democracy as universal.',
          correctsTo: 'No — only WHITE MEN. Most lost property requirements. But women, Black Americans, Native Americans, and immigrants of disfavored ethnicities REMAINED EXCLUDED. The expansion was real but bounded.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Voting expanded to nearly all white men, excluding others.',
        'Spoils system: Jackson rotated jobs to supporters.',
        'Bank War: killed the BUS, caused 1837 Panic.',
        'Indian Removal Act + Trail of Tears: forcibly displaced Native nations, defied SCOTUS.',
        'Nullification Crisis: SC vs Jackson, foreshadowing Civil War tensions.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why is Jackson STILL on the $20 bill despite the Trail of Tears?',
      hint: 'Treasury planned to replace him with Harriet Tubman (announced 2016, delayed multiple times). Jackson\'s legacy is now hotly debated — populist hero vs perpetrator of ethnic cleansing.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
