/**
 * AP World History: Modern — CED Unit 4.1-4.2: Technology and the Age of
 * Exploration.
 *
 * Unit-4 fan-out content plan, first in the within-unit chain
 * (maritime-exploration → columbian-exchange-global → maritime-empires →
 * atlantic-slave-trade → resistance-accommodation). Follows the Unit-2
 * Vertical Slice's calibration template (`ap-apworld-u2-silk-roads.ts`):
 * concept = the historical argument (what combination of motives and
 * borrowed technology let Iberian mariners begin regular transoceanic
 * voyages after 1450, and how did that compare with Ming China's own,
 * larger, state-sponsored maritime program?); worked_example = annotated
 * analysis of a described visual; try_yourself = a 3-point SAQ-style
 * short-answer.
 *
 * Anchor stimulus: a scale-comparison illustration of a Zheng He treasure
 * ship against an Iberian caravel — evelyn.passage.apworld-zheng-he-visual.v1
 * (described visual; no verbatim quoting required, figures used exactly as
 * stated in the seeded description). Columbus's 1492 voyage is discussed
 * only in factual, unquoted summary here — the Columbus letter
 * (evelyn.passage.apush-columbus-letter.v1, REUSE) is wired into this
 * topic's MCQ set in a separate task, not into this plan's segments.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APWORLD_U4_MARITIME_EXPLORATION: LessonPlan = {
  id: 'evelyn.ap.apworld.maritime-exploration.v1',
  title: 'U4.1 Technology and the Age of Exploration',
  curriculum: 'AP',
  grade: '10',
  subject: 'ss',
  topic: 'ap-world-history',
  locale: 'en',
  los: [
    {
      id: 'apworld.maritime-exploration',
      description:
        'Explain the motives for European maritime exploration after 1450, the technologies (borrowed and adapted) that made transoceanic voyages possible, and how these compare to the Ming Dynasty\'s own state-sponsored maritime expeditions and subsequent withdrawal.',
      standard: 'AP-APWORLD-4.1',
    },
  ],
  prerequisites: [],
  followUps: ['apworld.columbian-exchange-global'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Get the student to see 1450s transoceanic exploration as a European catch-up story, not a story of European technological superiority.',
      script:
        "In 1405, a Ming Chinese admiral named Zheng He set sail with a fleet of over three hundred ships and a crew in the tens of thousands — financed entirely by the imperial court. Eighty years later, Portuguese captains were creeping down the African coast in a handful of small, privately-and-crown-financed ships, using a compass, a sail design, and an instrument for measuring the stars that they had all borrowed from other cultures. And yet it was the Portuguese and Spanish, not the Ming, who kept going — across the Atlantic, around Africa, eventually around the world — while China's own treasure fleet voyages stopped for good after 1433. This unit is about why that happened: not because Europeans had better technology, but because of a very different set of motives and a very different political decision about whether to keep sailing.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-maritime-exploration',
      kind: 'concept',
      goal: 'Explain the motives, the borrowed technologies, and the comparative scale/state-sponsorship of European versus Ming maritime exploration, 1405-1522.',
      keyIdeas: [
        'MOTIVES FOR EUROPEAN EXPLORATION: Ottoman and Italian (especially Venetian) control of the overland and eastern Mediterranean spice routes raised the cost of Asian goods reaching Western Europe, giving Iberian monarchs a direct commercial incentive to find an alternate sea route that bypassed those intermediaries entirely. The Iberian Reconquista (completed in Spain in 1492) left a militarized, crusading political culture eager for new frontiers, glory, and converts, while Renaissance advances in cartography and navigation gave rulers more confidence that long ocean voyages were survivable and profitable.',
        'BORROWED, NOT INVENTED, TECHNOLOGY: the magnetic compass originated in China and reached Europe through intermediaries; the lateen (triangular) sail, which let a ship sail closer to the wind, came from Arab and Indian Ocean sailing traditions; the astrolabe, used to estimate latitude from the stars, was a Greek instrument refined and transmitted by Islamic astronomers. The caravel, the small, maneuverable ship most associated with early Portuguese voyages, combined these borrowed elements rather than reflecting any single European invention.',
        'THE PORTUGUESE AFRICAN ROUTE: sponsored initially by Prince Henry "the Navigator," Portuguese captains worked their way down the West African coast across the 1400s. Bartolomeu Dias rounded the Cape of Good Hope in 1488, and Vasco da Gama completed the sea route to India in 1498 — together opening a maritime path to Asian markets that bypassed the Ottoman- and Venetian-controlled overland and Mediterranean routes entirely.',
        "COLUMBUS AND MAGELLAN: sailing west for Spain in 1492 in search of a direct sea route to Asia, Christopher Columbus instead reached islands in the Caribbean, opening sustained European contact with the Americas. Three decades later, Ferdinand Magellan's Spanish-sponsored expedition (1519-1522) became the first to circumnavigate the globe, though Magellan himself died in the Philippines in 1521 and the voyage was completed under Juan Sebastián Elcano.",
        "ZHENG HE'S TREASURE FLEET AND THE MING WITHDRAWAL: between 1405 and 1433, the Ming court sent Admiral Zheng He on seven massive naval expeditions across the Indian Ocean as far as East Africa, projecting Chinese state power and collecting tribute — voyages financed directly by the imperial treasury on a scale (hundreds of ships, tens of thousands of crew) that dwarfed any single European voyage of the same era. After Zheng He died in 1433, the Ming court halted further expeditions and moved to restrict oceangoing shipbuilding: a deliberate political withdrawal from state-sponsored maritime expansion, not a loss of capability.",
        'THE KEY CONTRAST IS STATE COMMITMENT, NOT TECHNOLOGY: Ming China had the greater fleet, the greater resources, and arguably the more advanced program — and chose to stop. Iberian monarchs, working with smaller, mostly borrowed technology, chose to keep reinvesting in voyage after voyage because the commercial and political incentives (bypassing costly overland middlemen, continuing a crusading/exploratory momentum) remained strong and sustained.',
      ],
      vocabulary: [
        {
          term: 'caravel',
          definition:
            'a small, maneuverable Iberian ship type combining a borrowed lateen sail rig with other adapted design elements, used in early Portuguese voyages down the African coast.',
        },
        {
          term: 'astrolabe',
          definition:
            'a navigational instrument, originally Greek and refined by Islamic astronomers, used by European mariners to estimate latitude from the position of the stars.',
        },
        {
          term: 'Zheng He treasure fleet',
          definition:
            "the Ming Dynasty's seven state-financed naval expeditions (1405-1433) across the Indian Ocean, vastly larger in ships and crew than any European voyage of the period, ended by a Ming political decision after Zheng He's death rather than by any loss of Chinese capability.",
        },
      ],
      passageId: 'evelyn.passage.apworld-zheng-he-visual.v1',
      estimatedMinutes: 6,
    },
    {
      id: 'worked-zheng-he-visual',
      kind: 'worked_example',
      problem:
        'Analyze this scale-comparison description of a Ming treasure ship from Zheng He\'s fleet against a 15th-century Iberian caravel: the first (1405) voyage sailed with 317 ships, including 62 treasure ships, and a crew of roughly 20,000 to 32,000, financed directly by the Ming imperial court; the largest treasure ships are described in a contested range from roughly 440 by 180 feet (traditional Ming shi-derived figures) down to as little as roughly 170 to 250 feet in modern reconstructions, while contemporary Iberian caravels are comparably well documented at roughly 65 to 100 feet. What does this comparison reveal about the relative scale and state sponsorship of Ming versus Iberian maritime activity in this period, and what should a careful reader do with the disputed treasure-ship dimensions?',
      steps: [
        'SOURCE IT FIRST. This is a described scale-comparison illustration, of the kind used in maritime-history museum exhibits, drawing on published historical scholarship rather than a single eyewitness account — so the question is what the compiled figures show, not what any one person claims to have seen.',
        'IDENTIFY THE SCALE GAP. Even taking the most conservative modern reconstruction (roughly 170 to 250 feet), a Zheng He treasure ship still dwarfs a caravel of roughly 65 to 100 feet several times over — and that is before counting the fleet-wide gap of 317 ships and up to 32,000 crew against a handful of Iberian ships carrying at most a few hundred men.',
        'HANDLE THE CONTESTED FIGURE HONESTLY. The traditional 440-by-180-foot figure and the smaller modern estimates differ by close to a factor of two; a careful reader treats this as a genuine, unresolved scholarly disagreement rather than picking whichever number makes the argument look more dramatic, and notes that the comparison holds under either version of the figure.',
        "CONNECT TO THE CONCEPT'S CLAIM ABOUT STATE SPONSORSHIP. A fleet on this scale, financed directly by the imperial treasury, reflects a level of centralized state commitment to maritime expansion that no European monarchy of the same decades could match — which makes the Ming court's subsequent withdrawal a political choice, not a resource constraint.",
        "STATE THE LINK TO THE COURSE THESIS. The visual is evidence that scale and technology alone do not explain who kept exploring: China had the larger, state-financed program and stopped after 1433, while Iberian rulers, sailing smaller ships built from borrowed technology, kept reinvesting because their commercial and political incentives to continue were stronger and more sustained.",
      ],
      answer:
        'The comparison shows a lopsided scale gap in China\'s favor: even the most conservative modern estimate of a Zheng He treasure ship\'s size (roughly 170-250 feet) still dwarfs a caravel of roughly 65-100 feet, and the fleet-wide gap (317 ships and up to 32,000 crew, all imperially financed, versus a handful of privately-and-crown-financed Iberian ships) is larger still. A careful reader treats the traditional 440-by-180-foot figure and the smaller modern reconstructions as a genuine, unresolved scholarly disagreement rather than asserting one as settled fact — but notes the comparative conclusion holds either way. The real lesson is about state commitment, not capability: Ming China had the greater resources and chose, after Zheng He\'s death in 1433, to halt further voyages and restrict oceangoing shipbuilding, while Iberian monarchs kept reinvesting in far smaller, mostly borrowed-technology voyages because their commercial incentive (bypassing costly Ottoman- and Venetian-controlled routes) and political momentum (the Reconquista, Renaissance navigation confidence) remained strong.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-saq',
      kind: 'try_yourself',
      problem:
        'SAQ practice. (a) Identify ONE motive for European maritime exploration in the period 1450-1750. (b) Explain how ONE borrowed technology made transoceanic voyages possible. (c) Explain ONE difference between Ming China\'s Zheng He voyages and European maritime exploration in this period.',
      responseFormat: 'frq',
      rubric: {
        parts: [
          {
            criterionId: 'a',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): correctly identifies ONE genuine motive — e.g. bypassing Ottoman/Venetian-controlled overland or Mediterranean spice routes, Reconquista-era crusading/political momentum, or the desire for glory/converts/profit. No credit for a vague statement ("to explore") with no specific identifiable motive.',
            modelResponse:
              'One motive for European maritime exploration was the desire to bypass Ottoman and Venetian control of the overland and Mediterranean spice routes, which raised the cost of Asian goods reaching Western Europe.',
          },
          {
            criterionId: 'b',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains a specific, accurate mechanism by which a named borrowed technology (compass, lateen sail, astrolabe, caravel design) enabled transoceanic travel. No credit for an explanation disconnected from a named technology.',
            modelResponse:
              "The lateen sail, adapted from Arab and Indian Ocean sailing traditions, let ships sail closer to the wind than earlier square-rigged designs, which made it possible for caravels to navigate against prevailing winds on long ocean voyages rather than being limited to routes running with the wind.",
          },
          {
            criterionId: 'c',
            maxPoints: 1,
            scoringCriteria:
              "Full credit (1): explains a specific, historically accurate difference — e.g. the far greater scale and direct state financing of Zheng He's voyages compared to smaller European voyages, or the Ming court's decision to halt voyages after 1433 versus continued European reinvestment. No credit for a vague or unsupported claim.",
            modelResponse:
              "Zheng He's voyages (1405-1433) were financed directly by the Ming imperial court and sailed with hundreds of ships and tens of thousands of crew, far larger than any single European voyage of the period, but the Ming court halted further expeditions after Zheng He's death in 1433 — whereas European monarchies kept reinvesting in smaller voyages across the following century because their commercial and political incentives to continue remained strong.",
          },
        ],
      },
      estimatedMinutes: 5,
    },
    {
      id: 'misconception-tech-superiority',
      kind: 'misconception_check',
      question:
        'True or false: Europeans succeeded at transoceanic exploration because they possessed superior, uniquely European technology that other civilizations lacked.',
      commonErrors: [
        {
          answer: 'true',
          misconception:
            'Assuming European success in transoceanic exploration reflects indigenous European technological superiority, rather than recognizing that most of the key technologies were borrowed and adapted, and that state incentives and political decisions — not raw capability — explain who kept sailing.',
          correctsTo:
            "FALSE. Most of the technology behind European transoceanic voyages was borrowed and adapted, not indigenously invented: the compass originated in China, the lateen sail came from Arab and Indian Ocean traditions, and the astrolabe was a Greek instrument refined by Islamic astronomers. Ming China, meanwhile, had both the technology and far greater resources to sail farther and in far greater numbers than any European power of the same era, as Zheng He's voyages (1405-1433) demonstrate — yet the Ming court chose to halt such voyages after 1433. What actually explains the difference is state incentive and political choice: European monarchies had a strong, sustained commercial and political motive to keep reinvesting in exploration, while the Ming court did not.",
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'European motives for exploration combined bypassing costly Ottoman/Venetian-controlled trade routes, Reconquista-era political momentum, and growing confidence from Renaissance cartography and navigation.',
        'Key maritime technologies (compass, lateen sail, astrolabe) were borrowed and adapted from Chinese, Arab, and Islamic sources, not indigenous European inventions.',
        'Bartolomeu Dias (1488) and Vasco da Gama (1498) opened a sea route to Asia around Africa; Columbus (1492) reached the Caribbean seeking a westward route to Asia; Magellan\'s expedition (1519-1522) completed the first circumnavigation.',
        "Zheng He's Ming treasure fleet voyages (1405-1433) vastly outscaled any European voyage of the era, but the Ming court halted them after 1433 — a political withdrawal, not a loss of capability.",
        'The real contrast between Ming China and Iberian Europe is sustained state commitment and incentive, not technological superiority.',
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '4',
    cedTopic: '4.1-4.2',
    cedTitle: 'Technology and the Age of Exploration',
    sources: [
      { type: 'plan', source: 'AP Plans Initiative — AP World History' },
      {
        type: 'passage',
        book: 'evelyn.passage.apworld-zheng-he-visual.v1',
        chapter: '1405-1433',
        note: "Zheng He's Treasure Fleet vs. an Iberian Caravel (scale comparison) — anchor described visual for state-sponsorship contrast.",
      },
    ],
  },
};
