/**
 * AP World History: Modern — Unit 5 SAQ Practice: a full three-part Short
 * Answer Question (AP World Section I Part B, the SAQ format — not an FRQ),
 * stimulus-based on Simón Bolívar's Jamaica Letter.
 *
 * This SAQ explicitly says "use the excerpt below," so it DOES set a single
 * `passageId` (the SAQ shape's stimulus convention — a passageId is only
 * appropriate when the prompt explicitly quotes/references a document; here
 * it does). Each of the three parts is graded independently, 1 point each,
 * brief-response format (2-4 sentences), scored against the authentic AP
 * World SAQ rubric style. Draws on the Atlantic Revolutions (5.2).
 *
 * KEY-AMBIGUITY DISCIPLINE:
 * - Part (a) is checked against what the excerpt ACTUALLY says: Spanish
 *   Americans were shut out of viceregal, ecclesiastical, diplomatic, and
 *   administrative office ("we were never viceroys or governors except by
 *   very extraordinary reasons; archbishops and bishops, seldom;
 *   ambassadors, never...neither magistrates nor financiers, and hardly
 *   merchants"). The excerpt never mentions taxation, land seizure, or
 *   religious persecution — only exclusion from office and commerce — so
 *   the key names ONLY that exclusion, not an unstated grievance.
 * - Part (b) is checked against what the excerpt shows, not what it names:
 *   it never uses the words "Enlightenment," "natural rights," or
 *   "sovereignty." The correct idea to identify is popular
 *   self-government/self-determination — Americans assuming for themselves
 *   the "dignity of legislators, magistrates, administrators...diplomats,
 *   generals" — i.e., the capacity and right of a people to govern
 *   themselves, rather than a rights-language claim the excerpt does not
 *   make.
 * - Part (c) is checked against the historical record of what actually
 *   followed Bolívar's stated hope ("to see the formation in America the
 *   greatest nation in the world...its glory and freedom") — Gran Colombia,
 *   the state Bolívar himself led, fractured into separate republics
 *   (Venezuela, New Granada/Colombia, Ecuador) within a year of his 1830
 *   death, rather than the single great American nation he envisioned; this
 *   is the only outcome cited, not a claim about slavery, monarchy, or a
 *   topic the excerpt does not raise.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APWORLD_U5_SAQ_PRACTICE: LessonPlan = {
  id: 'evelyn.ap.apworld.u5-saq-practice.v1',
  title: 'Unit 5 SAQ Practice — Reading Bolívar\'s Jamaica Letter',
  curriculum: 'AP',
  grade: '10',
  subject: 'ss',
  topic: 'ap-world-history',
  locale: 'en',
  los: [
    {
      id: 'apworld.u5-saq-practice',
      description:
        'Answer a complete three-part AP World History Short Answer Question using Simón Bolívar\'s Jamaica Letter as a stimulus — briefly identifying and explaining specific historical developments in short, focused responses grounded in the excerpt\'s stated content — scored against the authentic AP World SAQ rubric (1 point per part).',
      standard: 'AP-APWORLD-5-SAQ',
    },
  ],
  prerequisites: [
    'apworld.enlightenment',
    'apworld.atlantic-revolutions',
    'apworld.nationalism-unification',
    'apworld.industrial-revolution',
    'apworld.industrial-society',
  ],
  followUps: [],
  estimatedMinutes: 24,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the stakes of a timed, full three-part SAQ concrete before the student answers one, and contrast its short, targeted answers with the long-essay demands of the DBQ/LEQ.',
      script:
        "You've studied how Bolívar and other creole leaders argued for Spanish American independence. Now you'll answer a Short Answer Question — one of three SAQs on the AP World History exam, each worth 3 points total, 1 point per part. Unlike the DBQ and LEQ, an SAQ doesn't want a full essay: each part just wants you to briefly identify or explain ONE specific thing, grounded in the excerpt below, in a few sentences. Precision beats length here — and every claim you make about the excerpt has to match what it actually says.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-saq-task-and-rubric',
      kind: 'concept',
      goal: 'Frame exactly what each part of the SAQ asks for, how to read the excerpt precisely, and how the 1-point-per-part rubric awards credit.',
      keyIdeas: [
        'THE TASK: each part (a, b, c) asks you to briefly IDENTIFY or EXPLAIN one specific historical development, grounded in the excerpt\'s stated content — not to write a full essay with a thesis. No contextualization, no outside-evidence requirement beyond what a part asks for, no line of reasoning across paragraphs: each part stands alone and is graded independently.',
        '"Briefly describe" wants an accurate reading of the stimulus stated directly — here, correctly identifying a grievance the excerpt actually names, not a plausible-sounding guess about colonial rule in general.',
        '"Briefly explain" wants you to go one step further than identification: state a fact grounded in (or consistent with) the excerpt AND connect it to WHY or HOW it matters to the specific question asked.',
        'READ THE EXCERPT CAREFULLY: Bolívar\'s grievance in this excerpt is entirely about exclusion from colonial office and commerce — Spanish Americans were "never viceroys or governors except by very extraordinary reasons," rarely archbishops or bishops, never ambassadors, and "neither magistrates nor financiers, and hardly merchants." The excerpt never mentions taxation, land seizure, or religious persecution, so those are NOT valid answers here.',
        'The excerpt never uses the words "Enlightenment," "natural rights," or "sovereignty" — but it reflects the Enlightenment idea of popular self-government: Bolívar describes Americans rising to assume for themselves "the eminent dignity of legislators, magistrates, administrators of the public treasury, diplomats, generals," i.e., the capacity and right of a people to govern themselves rather than be ruled by a distant colonial hierarchy.',
        'The single most common way students lose SAQ points here is citing a real detail from the excerpt but attaching it to the wrong claim (e.g. describing the exclusion-from-office grievance in part (b) instead of an Enlightenment idea, or vice versa). Each part is worth 1 point, graded independently — missing part (a) does not prevent full credit on (b) or (c). Total = 3 points across the three parts.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'try-full-saq',
      kind: 'try_yourself',
      problem:
        'Use the excerpt below, from Simón Bolívar\'s Jamaica Letter (1815), to answer parts (a), (b), and (c).\n(a) Describe ONE grievance against Spanish colonial rule expressed in the excerpt.\n(b) Explain ONE Enlightenment idea reflected in the excerpt.\n(c) Explain ONE way the actual outcome of Latin American independence differed from the hope Bolívar expresses at the end of the excerpt.',
      responseFormat: 'frq',
      passageId: 'evelyn.passage.apworld-bolivar-jamaica.v1',
      expectedAnswer:
        '(a) The excerpt expresses the grievance that Spanish Americans were systematically excluded from colonial office and commerce under Spanish rule: they were "never viceroys or governors except by very extraordinary reasons," rarely archbishops or bishops, never ambassadors, only subordinate military officers, and "neither magistrates nor financiers, and hardly merchants" — a wholesale exclusion Bolívar says stood in direct opposition to American institutions. (b) The excerpt reflects the Enlightenment idea of popular self-government, or self-determination: rather than describing Americans waiting for a colonial authority to grant them rights, Bolívar describes them rising "suddenly" to assume for themselves "the eminent dignity of legislators, magistrates, administrators of the public treasury, diplomats, generals and all the supreme and subordinate authorities" of an organized state — the Enlightenment premise that a people is capable of, and entitled to, governing itself rather than being ruled by a remote hierarchy. (c) Bolívar closes the excerpt hoping to see "the formation in America [of] the greatest nation in the world," valued for "its glory and freedom" rather than its size or wealth — a single great American nation. In fact, Gran Colombia, the large republic Bolívar himself led, fractured within a year of his 1830 death into separate states (Venezuela, New Granada/Colombia, and Ecuador), and Spanish America as a whole splintered into many separate republics rather than the single unified nation Bolívar had envisioned.',
      rubric: {
        parts: [
          {
            criterionId: 'a',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): describes a grievance the excerpt actually states — exclusion of Spanish Americans from colonial office and commerce (viceroys/governors "only by very extraordinary reasons," rarely bishops, never ambassadors, subordinate-only military roles, never magistrates/financiers, hardly merchants). No credit (0/1) for a grievance not stated in the excerpt (e.g. taxation, land seizure, religious persecution) or an unsupported generalization about colonial rule.',
            modelResponse:
              'The excerpt expresses the grievance that Spanish Americans were systematically excluded from colonial office and commerce: they were "never viceroys or governors except by very extraordinary reasons," rarely archbishops or bishops, never ambassadors, only subordinate military officers, and "neither magistrates nor financiers, and hardly merchants" — an exclusion Bolívar says stood in direct opposition to American institutions.',
          },
          {
            criterionId: 'b',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): explains an Enlightenment idea genuinely reflected in the excerpt\'s content — popular self-government/self-determination, grounded in the excerpt\'s description of Americans assuming for themselves the roles of legislators, magistrates, administrators, diplomats, and generals. No credit (0/1) for naming an Enlightenment idea (e.g. natural rights, separation of powers) with no connection to what this specific excerpt actually describes, or for restating part (a)\'s grievance without connecting it to an Enlightenment idea.',
            modelResponse:
              'The excerpt reflects the Enlightenment idea of popular self-government: Bolívar describes Americans rising "suddenly" to assume for themselves "the eminent dignity of legislators, magistrates, administrators of the public treasury, diplomats, generals and all the supreme and subordinate authorities" of an organized state — the premise that a people is capable of, and entitled to, governing itself rather than being ruled by a remote colonial hierarchy.',
          },
          {
            criterionId: 'c',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): explains a specific, historically accurate way the actual outcome of Latin American independence differed from Bolívar\'s stated hope for "the formation in America [of] the greatest nation in the world" valued for "its glory and freedom" — e.g. the fragmentation of Gran Colombia into separate republics after Bolívar\'s 1830 death, rather than the single unified nation he envisioned. No credit (0/1) for a vague claim disconnected from the excerpt\'s stated hope, or a claim about a topic (e.g. slavery, monarchy) the excerpt does not raise.',
            modelResponse:
              'Bolívar closes the excerpt hoping to see "the formation in America [of] the greatest nation in the world," prized for "its glory and freedom" rather than its size or wealth. In fact, Gran Colombia, the large republic Bolívar himself led, fractured within a year of his 1830 death into separate states (Venezuela, New Granada/Colombia, and Ecuador), and Spanish America as a whole splintered into many separate republics rather than the single unified nation Bolívar had envisioned.',
          },
        ],
      },
      hints: [
        'Each part just needs a specific fact grounded in the excerpt — you don\'t need a thesis or an introduction.',
        'For part (a), stick to what the excerpt actually names: exclusion from office and commerce, not taxation or land seizure, which it never mentions.',
        'For part (b), the excerpt never says "Enlightenment" — look at WHAT Bolívar describes Americans doing (assuming self-government) and connect it to the Enlightenment idea it reflects.',
        'For part (c), compare Bolívar\'s stated hope (one great, unified American nation) to what you know actually happened (fragmentation into many separate republics) — don\'t introduce a topic the excerpt doesn\'t raise.',
      ],
      estimatedMinutes: 15,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'An SAQ wants brief, specific identification/explanation per part, grounded in the stimulus — no thesis, no contextualization.',
        'Each part is graded independently and worth 1 point; missing one part does not cost you credit on the others.',
        'The excerpt\'s grievance is entirely about exclusion from colonial office and commerce — never taxation, land, or religion, which it does not mention.',
        'Bolívar hoped for one great, unified American nation; Gran Colombia (which he led) instead fractured into separate republics within a year of his death — the transformation the excerpt hoped for and the outcome that actually followed were not the same.',
      ],
      estimatedMinutes: 3,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '5',
    cedTopic: '5-SAQ',
    cedTitle: 'Unit 5 SAQ Practice — Reading Bolívar\'s Jamaica Letter',
    sources: [
      {
        type: 'frq-style',
        source: 'AP Plans Initiative author',
        note: 'Modeled on the authentic AP World History Short Answer Question task wording and rubric style (1 point per part, briefly identify/explain), stimulus-based on a primary-source letter.',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apworld-bolivar-jamaica.v1',
        chapter: '1815',
        note: 'Simón Bolívar, the Jamaica Letter (Sherwell 1921 English rendering) — sole stimulus for this SAQ.',
      },
    ],
  },
};
