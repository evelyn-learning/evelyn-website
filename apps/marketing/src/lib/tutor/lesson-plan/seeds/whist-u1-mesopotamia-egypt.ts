/**
 * World History — Early Civilizations: Mesopotamia & Egypt.
 *
 * The first river valleys are where the course's biggest machinery gets
 * installed: cities, writing, written law, kingship. Two rivers, two very
 * different personalities — and two civilizations that thought about gods,
 * kings, and death in ways their floodwaters help explain.
 * C3 D2.His.1.9-12, D2.Geo.5.9-12.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_WHIST_U1_MESOPOTAMIA_EGYPT: LessonPlan = {
  id: 'evelyn.hs.whist.mesopotamia-egypt.v1',
  title: 'Mesopotamia & Egypt: River Valley Civilizations',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'social-studies',
  topic: 'world-history',
  locale: 'en',
  los: [
    {
      id: 'whist.mesopotamia-egypt',
      standard: 'WHIST-1.3',
      description:
        'Compare the environments, belief systems, writing, law, and political development of Mesopotamia and Egypt, and explain how each river shaped the civilization that grew beside it (C3 D2.His.1.9-12, D2.Geo.5.9-12).',
    },
  ],
  prerequisites: ['whist.features-of-civilization'],
  followUps: ['whist.early-india-china'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame the two river valleys as a natural comparison: same idea (farm a floodplain), opposite rivers, opposite outcomes.',
      script:
        'Two groups of farmers, roughly the same era, both betting their lives on a river. One river floods on schedule — you can practically set a calendar by it. The other floods whenever it feels like it, sometimes gently, sometimes carrying whole villages away. Five thousand years later, one of those societies had left behind stories about gods who drown humanity on a whim, and the other had left behind tombs built for a comfortable eternity. Geography is not destiny — but it is a very loud suggestion. Today we trace how two rivers helped produce two worldviews, two kinds of government, and the first written laws anyone had to obey.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-river-valleys',
      kind: 'concept',
      goal: 'The environmental contrast, then what each civilization built on top of it: cities, writing, law, kingship, and political shape.',
      keyIdeas: [
        'RIVERS MADE SURPLUS — annual flooding dumps silt, silt makes fertile soil, fertile soil makes more grain than the farmers themselves eat. That surplus is what pays for people who are NOT farmers: priests, soldiers, scribes, artisans, rulers. Every early civilization in this unit sits on a floodplain for exactly this reason.',
        'TWO RIVERS, NO PROMISES — Mesopotamia means "land between the rivers," the Tigris and Euphrates in modern Iraq. Their floods were violent and unpredictable in both timing and size, and the plain was flat and open with almost no natural defenses. Survival required irrigation ditches, cooperation, and constant repair.',
        'THE NILE WAS A CALENDAR — Egypt\'s Nile flooded reliably each summer, depositing silt and receding on a predictable schedule that Egyptians organized their year around. Deserts on both sides, cataracts (rapids) to the south, and the sea to the north made Egypt hard to invade. Herodotus later called Egypt "the gift of the Nile."',
        'ENVIRONMENT ECHOED IN BELIEF — Mesopotamian religion pictured gods as powerful and capricious and the afterlife as a bleak "land of no return"; the Epic of Gilgamesh, humanity\'s oldest surviving long poem, is largely about failing to escape death and includes a devastating flood story. Egyptian religion emphasized order and balance (ma\'at) and an afterlife worth preparing for — hence mummification, grave goods, and elaborate tombs. Careful: this is a strong correlation historians point to, not a claim that rivers caused every belief.',
        'CITY-STATES, NOT A COUNTRY — Sumer, in southern Mesopotamia, was a set of independent city-states: Ur, Uruk, Lagash, Eridu. Each had its own patron god, its own ruler, and a ziggurat — a stepped temple platform — at its center. They traded, and they fought each other constantly. Unity came only when an outside conqueror imposed it (Sargon of Akkad, c. 2334 BCE; later Babylon; later Assyria).',
        'WRITING BEGAN AS BOOKKEEPING — cuneiform (wedge-shaped marks pressed into wet clay, c. 3200 BCE) started as temple and palace accounting: how much barley, owed by whom. Literature came later. Egypt developed hieroglyphics around the same period, written on stone monuments and on papyrus. Common student error: assuming writing was invented to tell stories — it was invented to track debts and taxes.',
        'HAMMURABI PUT LAW IN PUBLIC STONE — Babylon\'s king Hammurabi issued roughly 282 laws (c. 1754 BCE) carved on a tall stone pillar where people could see them. Punishments were harsh and openly unequal — penalties depended on the social rank of victim and offender. Two corrections students need: these were not the first laws ever written (Ur-Nammu\'s code is about 350 years older), and the point is not the severity but the principle that law is written, public, and enforced by the state rather than by private revenge.',
        'EGYPT UNIFIED EARLY AND STAYED THAT WAY — Upper and Lower Egypt were joined around 3100 BCE, a unification Egyptian tradition credits to a king remembered as Narmer or Menes. Egypt then ran as one kingdom through the Old, Middle, and New Kingdoms — roughly three thousand years, broken only by shorter "intermediate periods" of division. The pharaoh was not merely a king with priestly support; he was understood as divine, a god on earth responsible for keeping ma\'at intact. The pyramids, including the Great Pyramid at Giza (c. 2560 BCE), are royal tombs built by that centralized state.',
      ],
      vocabulary: [
        { term: 'ziggurat', definition: 'a massive stepped temple platform at the heart of a Mesopotamian city, dedicated to that city\'s patron god.' },
        { term: 'cuneiform', definition: 'the wedge-shaped writing system pressed into clay tablets in Mesopotamia — the world\'s earliest known writing.' },
        { term: 'pharaoh', definition: 'the ruler of unified Egypt, regarded as a living god responsible for maintaining cosmic and political order.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-geography-to-politics',
      kind: 'worked_example',
      problem:
        'Build the comparison step by step: both civilizations farmed a flooding river, so why did Mesopotamia stay a patchwork of rival city-states while Egypt held together as one kingdom for thousands of years?',
      steps: [
        'Start with the terrain. Mesopotamia is a broad, flat, open plain with no mountains, deserts, or seas sealing it off. Anyone with an army — Akkadians, Amorites, Hittites, Kassites, Assyrians, Persians — could walk in. Egypt sits in a narrow green ribbon walled by deserts, with rapids upriver and the Mediterranean at its mouth.',
        'Add the river\'s behavior. Unpredictable Tigris and Euphrates floods meant each Sumerian community had to build and defend its OWN irrigation works — and neighbors upstream were rivals for the same water. The Nile\'s dependable flood could be managed from a single administrative center, so cooperation scaled up instead of fragmenting.',
        'Look at movement. The Nile flows north while the prevailing wind blows south, so boats could travel both directions along the whole length of Egypt. That is a communication network — orders, taxes, and troops move easily, which is exactly what holding a large state requires.',
        'Now read the political results. Sumer produced independent city-states with separate patron gods and separate rulers, unified only when a conqueror like Sargon forced it — and those empires kept collapsing into the next conquest. Egypt produced one kingdom under a divine pharaoh, with a bureaucracy of scribes collecting grain taxes, interrupted only by relatively brief intermediate periods.',
        'State the comparison cleanly, and keep it honest: exposure plus water competition pushed Mesopotamia toward fragmentation and repeated conquest; isolation plus a predictable river and easy river travel pushed Egypt toward long, centralized unity. Geography set the odds — human decisions still played the hand.',
      ],
      answer:
        'Open terrain and an erratic, contested river fragmented Mesopotamia into rival city-states repeatedly conquered from outside, while natural barriers, a reliable Nile flood, and two-way river travel let Egypt hold together as one centralized kingdom for roughly three thousand years.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-hammurabi-source',
      kind: 'worked_example',
      problem:
        'Analyze this paraphrase of two provisions from Hammurabi\'s Code: "If a builder builds a house so badly that it collapses and kills the owner, that builder shall be put to death. If the collapse instead kills an enslaved person belonging to the owner, the builder shall give the owner an enslaved person of equal value." What does this tell a historian about Babylonian society around 1754 BCE?',
      steps: [
        'Read what the law actually does before judging it. It defines a specific wrong (shoddy construction with a fatal result) and attaches a specific, publicly known penalty. That alone tells you Babylon had a state willing to write rules down and take responsibility for enforcing them.',
        'Notice who the punishment tracks. The penalty changes based on WHO died, not on how careless the builder was. A free owner\'s death costs the builder his life; an enslaved person\'s death costs him property. Babylonian law treated people as belonging to legally distinct ranks, and it says so out loud.',
        'Infer the society behind the rule. A law about collapsing houses implies professional builders, contracts of some kind, urban construction, and disputes frequent enough to need a standard answer. Laws are evidence of the problems a society actually had.',
        'Weigh the principle against the punishment. The retaliatory logic ("an eye for an eye") looks brutal to modern readers, but it also caps revenge: the penalty is fixed, public, and imposed by the state instead of by a wronged family feuding indefinitely.',
        'Finish with what the source cannot tell you. One inscribed pillar shows the law as the king wanted it displayed; it does not prove how often courts applied it, or that Hammurabi\'s claim to be a just protector of the weak matched daily life. Treat it as a statement of official ideals plus legal categories — strong evidence for both, weak evidence for lived experience.',
      ],
      answer:
        'It shows a state-enforced, written, publicly displayed law code that standardized punishment and limited private revenge, in a society with sharp legal ranks where an enslaved person\'s death was compensated as property loss — but the pillar records official ideals, not proof of everyday enforcement.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-flood-worldview',
      kind: 'try_yourself',
      problem:
        'Historians often note that Mesopotamian literature, including the Epic of Gilgamesh, presents gods as unpredictable and the afterlife as grim, while Egyptian religion stressed order and a well-prepared afterlife. Which environmental contrast do historians most often connect to that difference?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The Tigris and Euphrates flooded violently and without a reliable schedule, while the Nile flooded predictably each year', correct: true },
        { id: 'b', text: 'Mesopotamia had no river floods at all, so farming there depended entirely on rainfall' },
        { id: 'c', text: 'Egypt had far more rainfall than Mesopotamia, making irrigation unnecessary there' },
        { id: 'd', text: 'Mesopotamia was surrounded by deserts and mountains while Egypt lay on an open plain' },
      ],
      expectedAnswer: 'The Tigris and Euphrates flooded violently and without a reliable schedule, while the Nile flooded predictably each year',
      hints: [
        'Both civilizations depended on river floods — the difference historians point to is whether that flood could be counted on.',
        'A river you can schedule your year around suggests a universe with rules; a river that destroys villages at random suggests powers you cannot bargain with.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-hammurabi',
      kind: 'try_yourself',
      problem:
        'Hammurabi had his law code carved on a large stone pillar set up in public, around 1754 BCE. Why do historians treat this as a turning point in the history of government?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'It made law written, public, and enforced by the state rather than left to private revenge or a ruler\'s mood', correct: true },
        { id: 'b', text: 'It was the very first set of written laws produced anywhere in the world' },
        { id: 'c', text: 'It established that every person in Babylon received identical treatment regardless of social rank' },
        { id: 'd', text: 'It was issued by Sargon of Akkad in the 500s BCE to unify the Persian Empire' },
      ],
      expectedAnswer: 'It made law written, public, and enforced by the state rather than left to private revenge or a ruler\'s mood',
      hints: [
        'Focus on what changes when rules are carved where everyone can see them, instead of living only in a ruler\'s head.',
        'Check the tempting options against the facts: earlier codes existed, penalties openly varied by rank, and Hammurabi ruled Babylon centuries before Persia existed.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-writing-origin',
      kind: 'try_yourself',
      problem:
        'The earliest cuneiform tablets from Sumer, dating to roughly 3200 BCE, are dominated by one kind of content. What are they, and what does that reveal about why writing was invented?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Records of goods, grain, and debts — writing emerged to manage the surpluses and obligations of temple and palace economies', correct: true },
        { id: 'b', text: 'Copies of the Epic of Gilgamesh — writing emerged so poets could preserve their stories' },
        { id: 'c', text: 'Personal letters between families — writing emerged so ordinary people could stay in touch across long distances' },
        { id: 'd', text: 'Treaties with Egypt — writing emerged from the need to negotiate with neighboring kingdoms' },
      ],
      expectedAnswer: 'Records of goods, grain, and debts — writing emerged to manage the surpluses and obligations of temple and palace economies',
      hints: [
        'Ask who had both a reason and the resources to invent writing first: the institution collecting the grain.',
        'Literature written in cuneiform appears centuries after the earliest tablets, so it cannot be the original purpose.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-pyramid-labor',
      kind: 'misconception_check',
      question:
        'A student says: "The pyramids were built by enslaved foreign laborers, whipped into place by pharaohs who cared nothing for them." What does the evidence actually show?',
      commonErrors: [
        {
          answer: 'Enslaved foreign laborers built the pyramids',
          misconception: 'Taking a popular film-and-storytelling image as the historical record, and collapsing very different Egyptian eras into one.',
          correctsTo:
            'Archaeology at Giza has uncovered workers\' settlements with bakeries, breweries, medical care for injuries, and workers buried in their own tombs near the pyramids — indicating an organized, provisioned Egyptian workforce, including farmers conscripted during the flood season when fields were underwater. Egypt did hold enslaved people, especially later in the New Kingdom, but the Great Pyramid (c. 2560 BCE) was built more than a thousand years before that period. The real story is arguably more impressive: a centralized state that could feed, house, and coordinate tens of thousands of workers for decades.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Floodplain silt produced grain surpluses, and surpluses paid for priests, scribes, soldiers, and rulers — the reason both civilizations began beside a river.',
        'The Tigris and Euphrates flooded unpredictably on an open plain; the Nile flooded on schedule behind desert barriers — a contrast historians link to Mesopotamian anxiety about capricious gods versus the Egyptian emphasis on order and an afterlife worth preparing for.',
        'Mesopotamia stayed a patchwork of Sumerian city-states (Ur, Uruk, Lagash) with ziggurats, cuneiform, the Epic of Gilgamesh, and Hammurabi\'s public law code of about 282 provisions (c. 1754 BCE), unified only by conquest.',
        'Egypt unified around 3100 BCE under god-king pharaohs, wrote in hieroglyphics, built pyramids as royal tombs, and held together for roughly three thousand years.',
        'Geography set the odds — exposure and water competition pushed Mesopotamia toward fragmentation, isolation and a reliable river pushed Egypt toward unity — but human choices, not rivers alone, made the history.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '1', cedTopic: '1.3', cedTitle: 'Mesopotamia & Egypt: River Valley Civilizations' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
