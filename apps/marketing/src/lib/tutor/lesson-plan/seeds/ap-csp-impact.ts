/**
 * AP CSP — Impact of Computing.
 *
 * Digital divide, bias in algorithms, intellectual property, computing innovations.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_CSP_IMPACT: LessonPlan = {
  id: 'evelyn.ap.csp.impact.v1',
  title: 'Impact of Computing',
  curriculum: 'CollegeBoard',
  grade: '11',
  subject: 'cs',
  topic: 'ap-cs-principles',
  locale: 'en',
  los: [
    {
      id: 'apcsp.impact',
      description: 'Analyze the social, economic, and ethical impacts of computing innovations including digital divide, algorithmic bias, and intellectual property.',
      standard: 'AP-CSP-5',
    },
  ],
  prerequisites: ['apcsp.internet'],
  followUps: [],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Computing reshapes society — for better and worse.',
      script: 'Every computing innovation has a beneficial side and a harmful side. GPS gets you to the hospital faster — and helps governments track citizens. Social media keeps families connected — and amplifies misinformation. AP CSP asks you to weigh both: who benefits, who is harmed, what unintended consequences emerge.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-frameworks',
      kind: 'concept',
      goal: 'Five lenses for analyzing impact.',
      keyIdeas: [
        'BENEFICIAL vs HARMFUL: every innovation cuts both ways. Identify at least one of each. The exam expects nuance.',
        'DIGITAL DIVIDE: unequal access to computing resources. Affects rural areas, low-income communities, older populations. Causes: cost of devices and connectivity, lack of infrastructure, digital literacy gaps. Consequences: educational and economic inequality.',
        'ALGORITHMIC BIAS: algorithms can encode bias from their training data or design. Examples: facial recognition with higher error rates on darker skin; loan algorithms approving fewer applicants from certain ZIP codes; hiring tools penalizing female-coded resumes. NOT because the algorithm is "racist" — because the data reflects historic biases the algorithm learns from.',
        'INTELLECTUAL PROPERTY: who owns code, music, images? COPYRIGHT (default for original works), CREATIVE COMMONS (explicit reuse permissions), OPEN SOURCE (code free to read, modify, redistribute under specific licenses). Plagiarism = passing off others\' work as yours.',
        'PRIVACY: data you generate (location, search history, photos) is collected and combined. Companies aggregate and sell. PII (personally identifiable information) — names, addresses, SSNs — needs special care.',
        'CROWDSOURCING: many people contribute small pieces (Wikipedia, OpenStreetMap, citizen science). Power: massive scale at low cost. Risk: quality control, vandalism.',
        'CITIZEN SCIENCE: nonexperts contribute to research (galaxy classification, bird counts). Computing makes coordination feasible.',
      ],
      vocabulary: [
        { term: 'digital divide', definition: 'inequality in access to computing technology.' },
        { term: 'algorithmic bias', definition: 'systematic unfair outcomes from an algorithm, often from biased training data.' },
        { term: 'creative commons', definition: 'a set of licenses authors use to grant explicit reuse permissions.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-analysis',
      kind: 'worked_example',
      problem: 'Analyze the impact of a smartphone app that uses GPS to recommend nearby restaurants.',
      steps: [
        'BENEFICIAL: helps users discover places they didn\'t know existed; supports local businesses; saves time.',
        'HARMFUL: tracks user location continuously; data may be sold to advertisers; could expose movement patterns to anyone with database access.',
        'DIGITAL DIVIDE: the app requires a smartphone with data plan + GPS — excludes those without. Restaurants without a digital presence are invisible.',
        'BIAS: if recommendations are based on past user ratings, popular spots dominate. New or non-mainstream restaurants get less exposure (rich-get-richer dynamic).',
        'PRIVACY: every restaurant visit is logged. Even after deleting the app, the data may persist on servers.',
        'GOOD ANSWER on the exam: name a beneficial AND a harmful effect, then identify which group is affected.',
      ],
      answer: 'Beneficial (discovery + local business support) ↔ Harmful (privacy erosion + visibility bias).',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Name one beneficial AND one harmful effect of automated facial recognition.',
      expectedAnswer: 'Beneficial: faster identification of missing persons or known suspects. Harmful: higher misidentification rates for people of color, and surveillance overreach that chills public expression.',
      responseFormat: 'free',
      hints: [
        'Think about: who benefits in policing or unlocking phones? Who is misidentified more often?',
        'Privacy + bias are common harm angles.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-tech-neutral',
      kind: 'misconception_check',
      question: 'Is technology neutral — it\'s only the people using it that make it good or bad?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Treating tech as a passive tool with no embedded values.',
          correctsTo: 'Mostly false. Algorithms reflect their designers\' assumptions and training data. A face-recognition system trained on mostly light-skinned faces will misidentify darker faces — that\'s baked in, regardless of intent. Defaults matter: a social-media algorithm that maximizes engagement learns to amplify outrage. The "neutrality" framing lets designers off the hook for unintended harms.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Every innovation has both beneficial and harmful sides — name at least one of each.',
        'Digital divide = unequal access. Bias = unfair outcomes baked in.',
        'Privacy: your data is aggregated, sold, and persists.',
        'Crowdsourcing + citizen science = scale; quality control matters.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'A free-to-use app makes money by selling user data to advertisers. What is the implicit "trade" the user makes?',
      hint: 'You pay with your data instead of money. The app providers monetize attention + behavior. "If the product is free, you are the product." This trade is increasingly examined by regulation (GDPR, CCPA).',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
