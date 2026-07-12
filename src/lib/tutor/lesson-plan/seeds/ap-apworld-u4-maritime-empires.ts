/**
 * AP World History: Modern — CED Unit 4.4-4.5: Maritime Trading Empires.
 *
 * Unit-4 fan-out content plan, third in the within-unit chain
 * (maritime-exploration → columbian-exchange-global → maritime-empires →
 * atlantic-slave-trade → resistance-accommodation). No passage is wired
 * here per the unit spec — the teaching point is a structural comparison
 * (trading-post empires in Asia vs. territorial empire in the Americas)
 * built from the concept's own facts rather than a primary-source analysis.
 * concept = the historical argument (why did most European maritime empires
 * before 1750 look like armed trading networks rather than territorial
 * conquests, with Spanish America the major exception?); worked_example =
 * a structured comparison exercise; try_yourself = a 3-point SAQ-style
 * short-answer.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APWORLD_U4_MARITIME_EMPIRES: LessonPlan = {
  id: 'evelyn.ap.apworld.maritime-empires.v1',
  title: 'U4.4 Maritime Trading Empires',
  curriculum: 'AP',
  grade: '10',
  subject: 'ss',
  topic: 'ap-world-history',
  locale: 'en',
  los: [
    {
      id: 'apworld.maritime-empires',
      description:
        'Compare the Portuguese, Dutch, Spanish, French, and English maritime empires established between 1450 and 1750, distinguishing trading-post empires from territorial colonial empires, and explain the shared logic of mercantilism underlying them.',
      standard: 'AP-APWORLD-4.4',
    },
  ],
  prerequisites: ['apworld.columbian-exchange-global'],
  followUps: ['apworld.atlantic-slave-trade'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Get the student to distinguish a trading-post empire from a territorial empire before assuming all European overseas expansion looked the same.',
      script:
        "When you picture a European empire in Asia in the 1600s, it's tempting to picture something like the later British Raj — armies occupying whole territories, colonial governors ruling millions of subjects. That's not what most of it looked like yet. The Portuguese Estado da India and the Dutch VOC mostly built chains of fortified ports and trading posts, strung along coastlines, extracting wealth from controlling SHIPPING LANES rather than conquering and administering huge inland populations. Spain, meanwhile, was doing something very different across the Atlantic — building an actual territorial empire in the Americas, with colonial administration reaching deep inland. Same century, same continent's worth of ambition, two completely different models. This unit is about telling them apart.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-maritime-empires',
      kind: 'concept',
      goal: 'Compare the trading-post empires of Portugal and the Dutch Republic in Asia with the Spanish territorial model in the Americas, the later French/English entries, and the shared logic of mercantilism.',
      keyIdeas: [
        'THE PORTUGUESE TRADING-POST EMPIRE (ESTADO DA INDIA, FROM c. 1505): rather than conquering large inland territories, Portugal built a network of fortified coastal trading posts (feitorias) at strategic chokepoints across the Indian Ocean — including Goa, Malacca, and Hormuz — using naval power to control and tax shipping lanes and dominate the spice trade rather than to rule large populations directly.',
        'THE DUTCH VOC (CHARTERED 1602): the Dutch East India Company (VOC) was the first major joint-stock company, raising capital from many investors and chartered by the Dutch government with quasi-sovereign powers — it could raise armies, wage war, and negotiate treaties in its own right. The VOC founded Batavia (on Java) in 1619 as its Asian headquarters and gradually displaced Portuguese control over much of the Indonesian archipelago\'s spice trade, again through fortified trading posts and naval dominance rather than deep territorial conquest.',
        "SPAIN'S TERRITORIAL MODEL IN THE AMERICAS: unlike the Portuguese and Dutch trading-post approach in Asia, Spain built an actual territorial empire in the Americas through conquest and colonial administration. The encomienda system granted Spanish colonizers the right to indigenous labor and tribute; as Indigenous populations collapsed from disease, encomienda gradually gave way to the hacienda system of large, privately owned landed estates. Spanish colonial society was structured by the casta system, a hierarchical racial classification (peninsulares, criollos, mestizos, and others) that assigned legal and social status.",
        'FRENCH AND ENGLISH ENTRIES CAME LATER: France and England entered overseas expansion later than Portugal and Spain, often through chartered joint-stock companies of their own, establishing colonies and trading posts (France chiefly in Canada and the Caribbean; England in North America, the Caribbean, and — via the English East India Company — in India), competing with the Dutch and Portuguese for territory and trade using broadly similar chartered-company tools.',
        'MERCANTILISM TIED ALL OF THESE EMPIRES TOGETHER: whatever the specific model — trading-post or territorial — every one of these European powers operated under mercantilism, the economic doctrine that colonies exist to enrich the mother country by producing a favorable balance of trade, enforced through trade monopolies, chartered-company privileges, and (for England, later) navigation acts restricting colonial trade to the parent country\'s ships and merchants.',
        "THE PATTERN BEFORE 1750: most European maritime empires in this period were armed TRADING networks controlling chokepoints and shipping lanes, not administrations ruling large inland territories — Spanish America is the major, and largely Atlantic-specific, exception, not the general rule.",
      ],
      vocabulary: [
        {
          term: 'trading-post empire',
          definition:
            'an empire built on fortified coastal trading posts controlling shipping lanes and chokepoints (e.g., the Portuguese Estado da India, the Dutch VOC in Asia), rather than on ruling large inland territories and populations.',
        },
        {
          term: 'encomienda',
          definition:
            "a Spanish colonial labor system granting colonizers rights to indigenous labor and tribute, which gradually gave way to the hacienda system of large private estates as Indigenous populations collapsed from disease.",
        },
        {
          term: 'mercantilism',
          definition:
            "the economic doctrine that colonies exist to enrich the mother country by producing a favorable balance of trade, enforced through trade monopolies and chartered-company privileges.",
        },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-trading-post-vs-territorial',
      kind: 'worked_example',
      problem:
        "Compare the Dutch VOC's approach to empire in the Indonesian archipelago with Spain's approach to empire in the Americas. Using the facts that the VOC was chartered in 1602 with quasi-sovereign powers, founded Batavia in 1619 as a trading headquarters, and operated primarily through fortified trading posts and naval dominance, while Spain built colonial administration atop conquered territory using the encomienda (and later hacienda) system and the casta social hierarchy, explain why historians classify these as two structurally different empire models.",
      steps: [
        'IDENTIFY WHAT EACH EMPIRE ACTUALLY CONTROLLED. The VOC controlled ports, forts, and shipping lanes (Batavia as a headquarters, plus scattered trading posts across the archipelago) — it did not administer the bulk of the archipelago\'s inland population or territory directly. Spain, by contrast, controlled and administered vast inland territories in the Americas, with colonial officials, courts, and labor systems reaching deep inland.',
        "IDENTIFY THE ECONOMIC MECHANISM OF EACH. The VOC extracted wealth chiefly by monopolizing and taxing the SPICE TRADE moving through the ports and shipping lanes it controlled. Spain extracted wealth chiefly through direct control of LAND AND LABOR — indigenous tribute and labor under encomienda, later large agricultural estates under hacienda, and mining (as in the Potosí silver already studied).",
        'IDENTIFY THE GOVERNING INSTITUTION IN EACH CASE. The VOC was a chartered joint-stock company exercising quasi-sovereign powers on behalf of investors, answerable ultimately to shareholders and the Dutch state. Spanish American colonies were administered through royal governors, viceroyalties, and a formal social hierarchy (the casta system) directly extending the Spanish crown\'s authority over both land and people.',
        'STATE THE STRUCTURAL DIFFERENCE. The VOC is a trading-post empire: it needed to control chokepoints and shipping, not populations, to profit. Spain is a territorial empire: its profits depended on directly ruling land and the labor of the people on it. Both were still colonial and extractive, but through structurally different mechanisms.',
        "CONNECT TO THE BROADER PATTERN. Spain's approach was the exception among European maritime empires before 1750, not the rule — most European powers in Asia and much of Africa operated more like the VOC's model, favoring fortified trading networks over full territorial administration.",
      ],
      answer:
        "The VOC and Spanish America represent two structurally different empire models. The VOC (chartered 1602) controlled ports, forts, and shipping lanes — Batavia (founded 1619) served as a trading headquarters, not a capital ruling a conquered inland population — and it profited chiefly by monopolizing and taxing the spice trade passing through the chokepoints it controlled, exercising quasi-sovereign powers as a chartered joint-stock company. Spain, by contrast, built an actual territorial empire in the Americas: colonial officials, courts, and labor systems (encomienda, later hacienda) reached deep inland, and profit depended on directly controlling land, labor, and mining output rather than merely controlling trade routes. The VOC is a trading-post empire because it needed to control shipping, not populations, to be profitable; Spain is a territorial empire because its wealth depended on ruling land and people directly. Spanish America was the major exception among European maritime empires before 1750 — most others, including the VOC, favored the trading-post model.",
      estimatedMinutes: 5,
    },
    {
      id: 'try-saq',
      kind: 'try_yourself',
      problem:
        'SAQ practice. (a) Identify ONE feature of the Portuguese or Dutch trading-post empire model in Asia. (b) Explain ONE way the Spanish territorial model in the Americas differed from the Portuguese/Dutch approach in Asia. (c) Explain ONE way mercantilism shaped the economic goals of any ONE European maritime empire, 1450-1750.',
      responseFormat: 'frq',
      rubric: {
        parts: [
          {
            criterionId: 'a',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): correctly identifies ONE genuine feature of the Portuguese Estado da India or the Dutch VOC trading-post model — e.g. fortified coastal trading posts, control of shipping lanes/chokepoints, joint-stock chartered structure. No credit for a vague or inaccurate feature.',
            modelResponse:
              'One feature of the Dutch trading-post empire model was that the VOC operated through fortified coastal trading posts and a headquarters at Batavia (founded 1619), controlling shipping lanes rather than administering large inland territories.',
          },
          {
            criterionId: 'b',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains a specific, accurate structural difference — e.g. Spain administered conquered territory and labor directly (encomienda/hacienda, casta system) rather than merely controlling trade routes. No credit for a vague or unconnected claim.',
            modelResponse:
              'Unlike the Portuguese and Dutch, who controlled trade chiefly through fortified ports and shipping lanes, Spain built an actual territorial empire in the Americas, directly administering conquered land and indigenous labor through the encomienda system, which gradually gave way to large private estates (haciendas).',
          },
          {
            criterionId: 'c',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains a specific, accurate way mercantilism shaped ONE named empire\'s economic goals — e.g. trade monopolies, chartered-company privileges, or (England) navigation acts restricting colonial trade to the mother country. No credit for a vague or unsupported claim.',
            modelResponse:
              "Under mercantilism, the Dutch government chartered the VOC with a monopoly over Asian trade specifically so that the profits of that trade would flow back to enrich the Dutch Republic rather than being captured by rival European powers or independent merchants.",
          },
        ],
      },
      estimatedMinutes: 5,
    },
    {
      id: 'misconception-all-territorial',
      kind: 'misconception_check',
      question:
        'True or false: all major European maritime empires in Asia and the Americas before 1750 were built through direct territorial conquest, ruling large inland populations.',
      commonErrors: [
        {
          answer: 'true',
          misconception:
            "Projecting the later, more territorial 19th-century age of imperialism backward onto the 1450-1750 period, and assuming Spain's territorial conquest of the Americas was the typical pattern rather than the exception.",
          correctsTo:
            "FALSE. Before 1750, most European maritime empires — including the Portuguese Estado da India and the Dutch VOC — were trading-post empires, controlling fortified ports and shipping lanes rather than ruling large inland populations. Spain's conquest-based, territorial empire in the Americas (built on encomienda, later hacienda, and the casta system) was the major exception, not the general rule. The shift toward large-scale direct territorial rule across Asia and Africa mostly came later, in the 19th century.",
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        "The Portuguese Estado da India (from c. 1505) and the Dutch VOC (chartered 1602, Batavia founded 1619) built trading-post empires — fortified ports controlling shipping lanes, not administrations ruling large inland populations.",
        "Spain built a territorial empire in the Americas instead: encomienda (later hacienda) controlled land and indigenous labor directly, structured by the casta racial hierarchy.",
        'France and England entered later, often via chartered joint-stock companies, competing for territory and trade with broadly similar tools.',
        'Mercantilism — colonies exist to enrich the mother country via a favorable balance of trade — was the shared economic logic underlying every one of these empires, trading-post or territorial.',
        'Before 1750, most European maritime empires were armed trading networks, not territorial conquests; Spanish America was the major exception.',
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '4',
    cedTopic: '4.4-4.5',
    cedTitle: 'Maritime Trading Empires',
    sources: [{ type: 'plan', source: 'AP Plans Initiative — AP World History' }],
  },
};
