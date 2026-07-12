/**
 * AP World History: Modern — CED Unit 3.2: Empires: Administration.
 *
 * Unit-3 fan-out content plan, following the Unit-2 calibration template
 * (`ap-apworld-u2-silk-roads.ts`). concept = the historical argument (how
 * did the Ottoman devshirme/janissary system and divan, the Mughal
 * mansabdar/zamindar system, Qing banners and Confucian exams, and
 * Peter the Great's service-state reforms illustrate different methods
 * land-based empires used to build a loyal administrative/military
 * elite without letting it become an independent hereditary threat to
 * the center, 1450-1750?).
 *
 * Passages: concept anchor is Ogier de Busbecq's Turkish Letters —
 * evelyn.passage.apworld-busbecq-suleiman.v1 — on merit-based Ottoman
 * advancement (the devshirme/janissary ethos). worked_example anchor is
 * François Bernier's Travels in the Mogul Empire —
 * evelyn.passage.apworld-bernier-mughal.v1 — on crown ownership of land
 * and escheat of Omrahs'/Mansebdars' property, contrasted directly
 * against the devshirme system. try_yourself anchor is Peter the Great's
 * westernization decrees — evelyn.passage.apworld-peter-decrees.v1 — used
 * here because the SAQ prompt directly quotes and analyzes it (per the
 * Unit-3 block's "ONLY if prompt-referenced" condition).
 *
 * QUOTING DISCIPLINE: the Peter excerpt is Jean Rousset de Missy's
 * contemporary NARRATIVE account of the beard/dress decrees (no raw text
 * of Peter's original ukases survives at the cited Fordham page) — only
 * that narrative is quoted verbatim; the decrees themselves are described
 * in this plan's own paraphrase, never presented as Peter's own wording.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APWORLD_U3_EMPIRES_ADMINISTRATION: LessonPlan = {
  id: 'evelyn.ap.apworld.empires-administration.v1',
  title: 'U3.2 Empires: Administration',
  curriculum: 'AP',
  grade: '10',
  subject: 'ss',
  topic: 'ap-world-history',
  locale: 'en',
  los: [
    {
      id: 'apworld.empires-administration',
      description:
        'Explain how the Ottoman devshirme/janissary system and imperial divan, the Mughal mansabdar and zamindar systems, Qing Manchu banners and the Confucian civil-service examination, and Peter the Great\'s westernizing service-state reforms illustrate different methods land-based empires used to recruit, reward, and control administrative and military elites, 1450-1750.',
      standard: 'AP-APWORLD-3.2',
    },
  ],
  prerequisites: ['apworld.empires-expansion', 'apworld.east-asia-song'],
  followUps: ['apworld.empires-belief-systems'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the point that these empires all faced the same problem — a loyal elite that might become an independent hereditary threat — and solved it in strikingly different ways.',
      script:
        "Every land-based empire in this period faced the same quiet danger: any elite powerful enough to help run an empire was also powerful enough, given a generation or two, to pass that power to its children and stop needing the ruler at all. A hereditary aristocracy is a loyalty problem waiting to happen. The Ottomans solved it by manufacturing a whole elite class from outsiders who owed everything to the Sultan. The Mughals solved it by legally claiming an emperor's own nobles' estates back at death. The Qing solved it by combining a hereditary conquest elite with a separate, meritocratic civil bureaucracy. And Peter the Great solved it by simply ordering his existing nobility to work for a living. Four different empires, one shared problem, four genuinely different answers.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-empires-administration',
      kind: 'concept',
      goal: 'Explain how the Ottoman devshirme/divan, Mughal mansabdar/zamindar, Qing banners/exams, and Peter\'s service-state reforms each solved the problem of building a loyal, non-hereditary elite, 1450-1750.',
      keyIdeas: [
        'THE OTTOMAN DEVSHIRME recruited an elite military and administrative corps not from a hereditary aristocracy but from a periodic levy of Christian boys from the Balkans, who were converted to Islam, trained, and promoted purely on service and merit — becoming JANISSARIES (elite infantry) or high officials. Because these men began as outsiders with no independent family claim to land or office, their entire position depended on continued loyalty to the Sultan.',
        'BUSBECQ, a Habsburg ambassador at Suleiman\'s court, confirmed this ethos from a European outsider\'s perspective: "No distinction is attached to birth among the Turks"; the Sultan "examines carefully into the character, ability, and disposition of the man whose promotion is in question," so that, in Busbecq\'s words, those who "receive the highest offices from the Sultan are for the most part the sons of shepherds or herdsmen" — and take pride, not shame, in that origin.',
        'THE OTTOMAN DIVAN was the imperial council, led by the Grand Vizier, that advised the Sultan and administered the empire\'s provinces, taxation, and law — a centralized bureaucracy staffed heavily by devshirme-trained officials whose careers depended entirely on the Sultan\'s continued favor.',
        "THE MUGHAL MANSABDAR SYSTEM assigned military/administrative ranks (mansabs) to officeholders (mansabdars), who held the right to collect revenue from an assigned territory (a JAGIR) rather than owning land outright. Because the emperor legally claimed to be heir to a mansabdar's estate at death, a mansabdar's wealth and rank could not simply pass to his children as an independent hereditary power base.",
        'ZAMINDARS were local hereditary landholders and tax-collectors incorporated into Mughal revenue administration at the local level, beneath the mansabdar system — a hybrid combining centrally appointed, non-hereditary elites (mansabdars) with locally rooted, hereditary intermediaries (zamindars).',
        'QING BANNERS: the conquering Manchu military-social elite was organized into the EIGHT BANNERS, hereditary units (later extended to some Mongol and Han Chinese banners) that formed the core of Qing military power and held distinct legal and social status from the ordinary Han Chinese population.',
        'QING CONTINUATION OF THE CONFUCIAN CIVIL-SERVICE EXAMINATION: unlike the Ottomans or Mughals, the Qing preserved the exam system inherited from earlier Chinese dynasties (the same tradition studied in Unit 1\'s Song material) to recruit Han Chinese scholar-officials into the civil bureaucracy — pairing a hereditary Manchu military elite (the banners) with a nominally meritocratic Han civil elite.',
        "PETER THE GREAT'S SERVICE STATE: Peter (r. 1682-1725) required Russian nobles to perform lifelong state service, military or civil, as the price of noble status, formalized in the TABLE OF RANKS (1722) — a ranking system based on achieved office rather than birth alone, which even allowed sufficiently high-achieving commoners to be ennobled.",
        'TAX FARMING VS. SALARIED BUREAUCRACY: many land-based empires relied at least partly on TAX FARMING — selling the right to collect taxes in a region to a private financier who kept a cut — which was cheaper for the state up front but prone to extortion and weaker central oversight, versus a SALARIED BUREAUCRACY paid directly from the treasury, which cost more up front but gave the center tighter control. The Ottomans, Mughals, Qing, and Russia all relied on some mix of both across their territories.',
        'THE COMBINED EFFECT: each empire solved the same core problem — an elite loyal enough to administer and defend the state, but not independent enough to threaten it — differently. The Ottomans manufactured a loyal elite from outsiders (devshirme); the Mughals granted non-hereditary revenue rights atop crown land ownership while co-opting local zamindars; the Qing paired a hereditary conquest elite (banners) with a meritocratic civil exam bureaucracy; Russia compelled its EXISTING nobility into lifelong, rank-based service.',
      ],
      vocabulary: [
        {
          term: 'devshirme',
          definition:
            'the Ottoman levy of Christian boys from the Balkans, converted to Islam and trained for military or administrative service (as janissaries or officials) purely on merit, with no independent hereditary power base.',
        },
        {
          term: 'mansabdar / jagir',
          definition:
            "a Mughal officeholder (mansabdar) granted the right to collect revenue from an assigned territory (a jagir) rather than owning land outright — a rank and revenue right that did not simply pass to his children, since the emperor claimed to be heir to a mansabdar's estate.",
        },
        {
          term: 'zamindar',
          definition:
            'a local hereditary landholder and tax-collector incorporated into Mughal revenue administration beneath the mansabdar system.',
        },
        {
          term: 'Eight Banners',
          definition:
            'the hereditary Manchu (later also Mongol and Han) military-social units that formed the core of Qing military power and held distinct legal/social status from the ordinary Han Chinese population.',
        },
        {
          term: 'Table of Ranks',
          definition:
            "Peter the Great's 1722 system ranking Russian nobles and officials by achieved military or civil office rather than birth alone, allowing sufficiently high-achieving commoners to be ennobled.",
        },
      ],
      passageId: 'evelyn.passage.apworld-busbecq-suleiman.v1',
      estimatedMinutes: 6,
    },
    {
      id: 'worked-bernier-mansabdar-vs-devshirme',
      kind: 'worked_example',
      problem:
        'Analyze this excerpt from François Bernier\'s account of the Mughal Empire under Aurangzeb: "the Great Mogol constitutes himself heir of all the Omrahs, or lords, and likewise of the Mansebdars, or inferior lords, who are in his pay; and, what is of the utmost importance, that he is proprietor of every acre of land in the kingdom, excepting, perhaps, some houses and gardens which he sometimes permits his subjects to buy, sell, and otherwise dispose of, among themselves." How does the elite system this passage describes differ from the Ottoman devshirme/janissary system, and what problem were both systems, each in their own way, solving?',
      steps: [
        'SOURCE IT FIRST. François Bernier, a French physician and traveler at the Mughal court under Aurangzeb, wrote this account (Travels in the Mogul Empire, covering 1656-68) as a letter to Colbert, minister to Louis XIV — assessing Mughal wealth and governance for a European audience.',
        'IDENTIFY THE CLAIM. Bernier states the emperor "constitutes himself heir of all the Omrahs" (great nobles) and "Mansebdars" (lesser officeholders), and "is proprietor of every acre of land in the kingdom," excepting some private houses and gardens.',
        "CONNECT TO THE MANSABDAR/JAGIR SYSTEM. Because the crown legally claimed to inherit an officeholder's estate at death and owned virtually all land, Mughal elites (mansabdars) held assigned revenue rights (jagirs) rather than heritable landed estates — their power and wealth depended entirely on continued royal favor and office, not inherited property.",
        "CONTRAST WITH DEVSHIRME. The Ottoman devshirme system achieved a broadly similar result — an elite that could not become an independent hereditary threat — by a completely different method: recruiting elites who began as outsiders (a Balkan Christian boy-levy) with NO existing family claim to land or office at all, rather than by legally stripping inheritance rights from an existing noble class the way the Mughal crown's escheat of Omrahs' estates did.",
        "STATE THE SHARED PROBLEM SOLVED. Both systems are different solutions to the same core imperial problem: preventing a hereditary landed or military aristocracy from accumulating independent power that could rival the center. The Ottomans solved it by manufacturing a loyal elite from scratch; the Mughals solved it by legally denying durable inheritance to an elite that already existed.",
      ],
      answer:
        'Bernier\'s account — that the emperor "constitutes himself heir of all the Omrahs... and likewise of the Mansebdars" and "is proprietor of every acre of land in the kingdom" — describes a system in which Mughal elites held assigned revenue rights (jagirs) rather than heritable estates, because the crown\'s legal claim to inherit an officeholder\'s property at death prevented mansabdars from building an independent, hereditary landed power base. This differs sharply in METHOD from the Ottoman devshirme system, which achieved a similar result by recruiting elites who began as outsiders with no existing claim to land or office at all, rather than by stripping inheritance rights from an already-existing nobility. Both systems, in their own way, solved the same underlying problem every land-based empire faced: how to build an administrative/military elite loyal and dependent enough not to become an independent hereditary threat to central power.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-saq',
      kind: 'try_yourself',
      problem:
        'SAQ practice. Read this excerpt from Jean Rousset de Missy\'s contemporary account of Peter the Great\'s reforms: "The tsar, in order to reform that custom, ordered that gentlemen, merchants, and other subjects, except priests and peasants, should each pay a tax of one hundred rubles a year if they wished to keep their beards; the commoners had to pay one kopek each. … The tsar issued an ordinance abolishing that costume, commanding all the boyars [i.e., the nobles] and all those who had positions at court to dress after the French fashion, and likewise to adorn their clothes with gold or silver according to their means." (a) Describe the method of elite control this excerpt illustrates. (b) Explain how this method compares to ONE method used by another land-based empire (Ottoman, Mughal, or Qing) to build a loyal administrative or military elite. (c) Explain ONE limitation or source of resistance rulers faced when using this kind of top-down reform.',
      responseFormat: 'frq',
      passageId: 'evelyn.passage.apworld-peter-decrees.v1',
      rubric: {
        parts: [
          {
            criterionId: 'a',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): correctly describes the method — using taxation (a graduated beard tax) and mandatory dress codes to compel an EXISTING elite\'s outward conformity to a Western model, backed by financial and social pressure rather than replacing the elite itself. No credit for a response that ignores the excerpt\'s specific mechanism.',
            modelResponse:
              "The excerpt shows Peter the Great using taxation and a mandatory dress code — a beard tax scaled by social status, and an order for boyars and courtiers to dress \"after the French fashion\" — to compel Russia's EXISTING nobility to conform outwardly to a Western European model, rather than replacing that nobility with a new elite.",
          },
          {
            criterionId: 'b',
            maxPoints: 1,
            scoringCriteria:
              "Full credit (1): explains a specific, accurate comparison to another empire's elite-control method — e.g. the Ottoman devshirme (recruiting a wholly new elite from outsiders) or the Mughal mansabdar/jagir system (legally denying an existing elite durable inheritance) or Qing banners/exams (a hereditary conquest elite paired with a civil-exam bureaucracy). No credit for a vague or disconnected comparison.",
            modelResponse:
              "This differs from the Ottoman devshirme system, which built a loyal elite by recruiting entirely new members from outside the existing aristocracy; Peter instead worked with Russia's existing nobility, compelling its behavior through taxation and dress codes rather than replacing it with outsiders.",
          },
          {
            criterionId: 'c',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains a specific, historically plausible limitation or resistance — e.g. traditionalist/religious objection to abandoning long-held customs (beards, dress) as a violation of custom or religious identity, or that enforcement depended on financial and social pressure rather than universal compliance. No credit for a vague or unsupported claim.',
            modelResponse:
              'Beard and dress reforms met resistance from traditionalist Russians, including clergy, who viewed shaving and Western dress as violations of long-held custom and Orthodox religious identity; because enforcement relied on taxation and social pressure among nobles and courtiers rather than direct coercion of the whole population, compliance was uneven rather than universal.',
          },
        ],
      },
      estimatedMinutes: 5,
    },
    {
      id: 'misconception-hereditary-aristocracy-universal',
      kind: 'misconception_check',
      question:
        "True or false: land-based empires like the Ottomans, Mughals, Qing, and Russia all relied on a hereditary landed aristocracy, similar to Western Europe's, as the primary basis of administrative and military power.",
      commonErrors: [
        {
          answer: 'true',
          misconception:
            'Assuming a Western European-style hereditary nobility was the universal or default elite model — missing how differently each empire solved the problem of building a loyal, non-threatening administrative/military elite.',
          correctsTo:
            "FALSE. None of these empires relied primarily on a Western-style hereditary landed aristocracy. The Ottomans recruited their administrative/military elite from OUTSIDERS via the devshirme, explicitly rejecting birth as a qualification (\"No distinction is attached to birth among the Turks,\" per Busbecq). The Mughals granted mansabdars non-hereditary revenue rights (jagirs) while the crown legally claimed a deceased officeholder's estate, preventing a durable hereditary landed nobility from forming. The Qing paired a hereditary Manchu conquest elite (the Eight Banners) with a nominally meritocratic Han civil-exam bureaucracy — a hybrid, not a single hereditary noble class. Peter the Great compelled Russia's EXISTING nobility into lifelong state service ranked by achievement (the 1722 Table of Ranks), even allowing commoners who reached high rank to be ennobled. On the AP exam, treat 'universal hereditary aristocracy' as the misconception, not the pattern.",
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The Ottoman devshirme recruited Christian boys from the Balkans as an elite corps (janissaries, officials) promoted purely on merit — Busbecq confirmed "no distinction is attached to birth" among the Turks.',
        'The Ottoman divan, led by the Grand Vizier, administered the empire and was staffed heavily by devshirme-trained officials.',
        "The Mughal mansabdar system granted non-hereditary revenue rights (jagirs) because the crown claimed to inherit a mansabdar's estate at death, per Bernier's account; zamindars were local hereditary tax-collectors working beneath that system.",
        'The Qing paired a hereditary Manchu conquest elite (the Eight Banners) with the inherited Confucian civil-service exam system for recruiting Han Chinese officials.',
        "Peter the Great's 1722 Table of Ranks compelled Russia's existing nobility into lifelong state service ranked by achievement, not birth alone.",
        'Every empire solved the same underlying problem — a loyal elite that would not become an independent hereditary threat — differently: manufacturing a new elite (Ottoman), denying durable inheritance to an existing one (Mughal), hybridizing hereditary and meritocratic elites (Qing), or compelling an existing nobility into service (Russia).',
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '3',
    cedTopic: '3.2',
    cedTitle: 'Empires: Administration',
    sources: [
      { type: 'plan', source: 'AP Plans Initiative — AP World History' },
      {
        type: 'passage',
        book: 'evelyn.passage.apworld-busbecq-suleiman.v1',
        chapter: '1555',
        note: 'Ogier Ghiselin de Busbecq, Turkish Letters — anchor document for merit-based Ottoman devshirme/janissary advancement.',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apworld-bernier-mughal.v1',
        chapter: '1668',
        note: "François Bernier, Travels in the Mogul Empire — worked-example document contrasting Mughal mansabdar/jagir crown land ownership against the Ottoman devshirme system.",
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apworld-peter-decrees.v1',
        chapter: '1701',
        note: "Jean Rousset de Missy's contemporary narrative of Peter the Great's beard/dress decrees — SAQ stimulus for Peter's service-state elite-control method.",
      },
    ],
  },
};
