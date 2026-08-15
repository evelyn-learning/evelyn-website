/**
 * G11 — Globalization, technology, and modern world (1990-present).
 *
 * Internet revolution, end of Cold War, 9/11, China rising, climate
 * change as global issue.
 */

import type { LessonPlan } from '../types';

export const SEED_G11_SS_GLOBALIZATION_MODERN: LessonPlan = {
  id: 'evelyn.g11.ss.us-history.modern-world.v1',
  title: 'Modern world: globalization, internet, and post-Cold War',
  curriculum: 'NCSS',
  grade: '11',
  subject: 'ss',
  topic: 'us-history',
  locale: 'en',
  los: [
    {
      id: 'ncss.911.history.modern-era',
      description: 'Analyze the major political, economic, and technological changes since 1990.',
      standard: 'NCSS.D2.His.14.9-12',
    },
  ],
  prerequisites: ['ncss.911.history.cold-war'],
  followUps: [],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame the era as the transition into the world the student lives in.',
      script: 'In 1990 there was no public internet, the USSR still existed, and China was a poor country. By 2024, billions are online, the USSR is gone, and China is the world\'s second-largest economy. The world your parents grew up in is GONE. Here\'s how it changed.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-pillars',
      kind: 'concept',
      goal: 'Five pillars of the modern era.',
      keyIdeas: [
        '1) END OF COLD WAR (1989-91): Berlin Wall fell 1989; USSR dissolved 1991. US emerged as sole superpower for ~20 years.',
        '2) INTERNET REVOLUTION (1990s-): World Wide Web invented 1989, public by ~1995. Smartphones (iPhone 2007) put internet in every pocket. Reshaped commerce, communication, news, politics.',
        '3) GLOBALIZATION: trade barriers fell. China joined WTO (2001). Manufacturing moved to lower-wage countries. US lost millions of factory jobs but consumers got cheaper goods.',
        '4) 9/11 AND WAR ON TERROR (2001-): Al-Qaeda attacks killed ~3,000 Americans. US invaded Afghanistan (2001) and Iraq (2003). 20-year wars; lasting cost in lives, money, civil liberties.',
        '5) CHINA\'S RISE: from poor agricultural society to world\'s 2nd biggest economy in 30 years. Major geopolitical competitor; dominant in manufacturing, increasingly in tech.',
        '6) CLIMATE CHANGE: scientific consensus solidified. Paris Agreement (2015). Heat waves, fires, storms intensifying. Slow political response.',
        '7) INEQUALITY: top 1% income share grew from ~10% (1980) to ~20% (2020) in US. Echoes of Gilded Age concerns.',
      ],
      vocabulary: [
        { term: 'globalization', definition: 'increasing interconnection of economies and cultures across borders.' },
        { term: 'War on Terror', definition: 'global counterterrorism military and intelligence campaign launched after 9/11.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-china',
      kind: 'worked_example',
      problem: 'How did China go from a poor country in 1980 to the world\'s second-largest economy by 2010?',
      steps: [
        'In 1978, Deng Xiaoping launched ECONOMIC REFORMS — opening China to foreign investment and partial market mechanisms.',
        '1980s-90s: Special Economic Zones (Shenzhen) attracted foreign factories. Cheap labor + huge population = manufacturing powerhouse.',
        'Joined WTO (2001) — got access to global markets. Within a decade, China was making most of the world\'s phones, laptops, clothing, toys.',
        '2008 financial crisis: China stimulus kept its economy growing while West contracted. Caught up faster.',
        'By 2010, China\'s GDP passed Japan\'s, becoming #2 after US. By 2020, gap with US narrowed further.',
        'Cost: authoritarianism continued. No multi-party democracy emerged. Tech surveillance increased. The "China model" became a alternative to Western liberal democracy.',
      ],
      answer: 'reforms opened economy to global trade; cheap manufacturing + WTO access drove growth',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Name TWO ways the smartphone (introduced 2007) has changed how people interact with information.',
      expectedAnswer: 'student-specific (e.g., constant access; news/social media in pocket; everyone is photographer/videographer)',
      responseFormat: 'free',
      hints: [
        'Before iPhone: internet was at home/desk.',
        'After: internet is in pocket 24/7. Think about news, social media, navigation, shopping, photography.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-end-of-history',
      kind: 'misconception_check',
      question: 'After the Cold War ended (1991), did liberal democracy become the dominant global system without rival?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Believing the "End of History" thesis (Fukuyama 1992).',
          correctsTo: 'It LOOKED that way in the 1990s. But by the 2000s-2020s, China grew without democratizing, Russia turned authoritarian, populist movements rose in democracies. Liberal democracy is one model among others, not the inevitable endpoint.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Cold War ended 1989-91; US briefly sole superpower.',
        'Internet (~1995) and smartphones (2007) reshaped daily life.',
        'Globalization made consumer goods cheap, hollowed out manufacturing jobs in West.',
        '9/11 → 20-year War on Terror.',
        'China rose as economic peer without democratizing.',
        'Climate change and inequality are central modern challenges.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'How might artificial intelligence (2020s onward) reshape work and society in the next 20 years?',
      hint: 'Could automate many cognitive jobs (writing, analysis, programming) the way previous waves automated manual labor. Possibilities: massive productivity gains, displacement of white-collar workers, new ethical questions, geopolitical race for AI dominance.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
