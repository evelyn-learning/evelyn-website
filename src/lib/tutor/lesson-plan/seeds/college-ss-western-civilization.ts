/**
 * College Intro — Western Civilization (survey).
 *
 * Greco-Roman roots → medieval synthesis → modernity → contemporary.
 */

import type { LessonPlan } from '../types';

export const SEED_COLLEGE_SS_WESTERN_CIVILIZATION: LessonPlan = {
  id: 'evelyn.college.western-civilization.v1',
  title: 'Western civilization — roots, synthesis, modernity',
  curriculum: 'CCSS',
  grade: 'college',
  subject: 'social-studies',
  topic: 'western-civilization',
  locale: 'en',
  los: [
    {
      id: 'college.westciv',
      description: 'Trace continuity and change across major eras of Western civilization with attention to ideas, institutions, and material conditions.',
      standard: 'COLLEGE-WESTCIV',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame Western civ as a contested narrative, not a triumphalist march.',
      script: 'The "Western civilization" narrative has had multiple lives — as celebration, as critique, as something to redefine. The modern serious version: trace specific ideas (rule of law, individual rights, scientific method, market economy, human rights) AND specific harms (colonialism, slavery, religious wars, total wars), without either airbrushing or only-blaming. Both threads are part of the story.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-eras',
      kind: 'concept',
      goal: 'Greco-Roman → medieval → modern → contemporary, ideas + material.',
      keyIdeas: [
        'GRECO-ROMAN: Greek philosophy (Socrates, Plato, Aristotle), democracy in Athens (limited — citizens only), Roman law, Roman engineering, mythology + literature.',
        'MEDIEVAL SYNTHESIS: collapse of Western Rome → feudalism. Catholic Church integrates classical + Christian (Augustine, Aquinas). Universities emerge 1100s. Scholastic method — disputatio.',
        'EARLY MODERN (1450-1789): Renaissance + Reformation + Scientific Revolution + Age of Exploration. Printing press (Gutenberg, 1440s) democratizes knowledge. Atlantic slave trade begins; Indigenous Americas devastated by European disease + conquest.',
        'ENLIGHTENMENT + REVOLUTIONS: reason + natural rights as political language. American + French revolutions test it. Industrial Revolution begins reshaping economies.',
        'NINETEENTH C: nation-states consolidate. Liberalism, socialism, conservatism, nationalism crystallize. European empires expand globally. Romanticism + realism in arts.',
        'TWENTIETH C: World Wars, Holocaust, decolonization, Cold War. Welfare state, mass democracy, civil rights movements, women\'s movements.',
        'CONTEMPORARY (1989+): post-Cold War order, EU integration, globalization, digital revolution, climate crisis, populism.',
        'TENSION: liberty vs equality, individual vs community, secular vs religious, expansion vs critique. Persistent debates, not resolved.',
      ],
      vocabulary: [
        { term: 'scholasticism', definition: 'medieval intellectual method synthesizing classical philosophy with Christian theology.' },
        { term: 'Scientific Revolution', definition: '16th-17th century shift to systematic observation, experiment, and mathematical models in natural philosophy.' },
        { term: 'liberalism (classical)', definition: '18th-c. political tradition emphasizing individual rights, consent of the governed, and limited government.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-printing',
      kind: 'worked_example',
      problem: 'Argue that the printing press was as consequential as any single political event in early modern Europe.',
      steps: [
        'Before 1450: books copied by hand, expensive, scarce. Literacy and ideas highly mediated by Church + state.',
        'After Gutenberg (1440s): print runs of 1,000+, costs collapse, vernacular books spread.',
        'Direct effects: Reformation (Luther\'s 95 Theses go viral via print), Scientific Revolution (data + equations widely shared), national languages standardized (Bibles in German, French, English).',
        'Indirect effects: literacy rises, new public sphere of pamphlets and newspapers, eventually mass political debate.',
        'Without print, neither Reformation nor Scientific Revolution unfolds the way it did. A technology of REPRODUCTION reshapes politics, religion, science, language.',
      ],
      answer: 'Print enabled mass diffusion of ideas, accelerating Reformation and scientific exchange.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'How can a course on Western civilization simultaneously credit accomplishments (rule of law, scientific method) and account for harms (colonialism, slavery)?',
      expectedAnswer: 'by treating both as factual results of the same societies and analyzing the connections — accomplishments often funded by extraction, harms often justified by ideologies the same societies produced',
      responseFormat: 'free',
      hints: [
        'Accomplishments and harms aren\'t separate stories.',
        'Atlantic slavery + colonial wealth + scientific institutions overlap in time and beneficiaries.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-progress',
      kind: 'misconception_check',
      question: 'A student says: "Western history is a story of progress — things keep getting better." What\'s wrong?',
      commonErrors: [
        {
          answer: 'because we improve',
          misconception: 'Whig history.',
          correctsTo: 'Some metrics (life expectancy, literacy, child mortality) have improved dramatically over centuries. Others (war intensity, environmental destruction, political stability) have not improved monotonically. The 20th century saw both massive expansions of human rights AND the Holocaust, GDP growth AND climate crisis. Honest history acknowledges genuine progress on many fronts WITHOUT smoothing over collapse, regression, and current open challenges.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Eras: Greco-Roman → medieval → early modern → modern → contemporary.',
        'Ideas + institutions + material conditions move together.',
        'Accomplishments and harms are inseparable — analyze both.',
        'Progress is real on many metrics, not on all, not monotonically.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
