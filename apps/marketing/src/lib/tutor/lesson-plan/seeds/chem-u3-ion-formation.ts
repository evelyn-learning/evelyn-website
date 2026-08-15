/**
 * Chemistry — The Periodic Table: Ion Formation & Predicting Charges.
 *
 * Where charge comes from (NGSS HS-PS1-1): electrons move, protons never
 * do. Group position predicts the charge an atom takes, and the classic
 * errors — "valence count IS the charge", "it gained a proton", "sulfur
 * empties its shell to S⁶⁺" — get equal billing.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_CHEM_U3_ION_FORMATION: LessonPlan = {
  id: 'evelyn.hs.chem.ion-formation.v1',
  title: 'Ion Formation & Predicting Charges',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'science',
  topic: 'chemistry',
  locale: 'en',
  los: [
    {
      id: 'chem.ion-formation',
      standard: 'CHEM-3.3',
      description:
        'Predict the charge a main-group atom takes when it forms a monatomic ion, and explain that charge in terms of electron gain or loss toward a noble-gas configuration (NGSS HS-PS1-1).',
    },
  ],
  prerequisites: ['chem.periodic-trends'],
  followUps: ['chem.ionic-bonding'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Charge is not exotic — it is running the student\'s own nervous system, and the periodic table predicts it.',
      script:
        'Every thought you have just had was fired by sodium and potassium ions pushing through the walls of your nerve cells. The sports drink label calls them electrolytes; a chemist calls them Na⁺ and K⁺. And here is the part worth stopping for: nobody had to measure those charges one at a time. Sodium is 1+, magnesium is 2+, chlorine is 1−, and you can read all three straight off the periodic table before you ever open a bottle. Today you learn where that charge comes from and how to predict it on sight — because in a couple of lessons it is what lets you build chemical formulas out of thin air.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-ion-formation',
      kind: 'concept',
      goal: 'Electrons move and protons do not, the octet drives which way they move, and group position turns that into a charge you can predict.',
      keyIdeas: [
        'AN ION IS AN ATOM WITH A CHARGE — and the charge comes from ELECTRONS ONLY. Protons never move in chemistry; the proton count IS the element\'s identity. Lose electrons → positives now outnumber negatives → a CATION (+). Gain electrons → an ANION (−).',
        'THE DRIVER: NOBLE-GAS CONFIGURATION — atoms gain or lose whichever is CHEAPER to land on the electron count of the nearest noble gas (a full octet of valence electrons). Na has 1 electron too many past neon, so it drops it. Cl is 1 short of argon, so it takes one.',
        'WHY METALS LOSE AND NONMETALS GAIN — this is Unit 3.2 cashing in. Metals on the left have LOW ionization energy, so their few valence electrons come off cheaply. Nonmetals on the right have HIGH electronegativity, so they pull extra electrons in. Position predicts direction.',
        'THE GROUP → CHARGE MAP (main group) — Group 1 → 1+; Group 2 → 2+; Group 13 → 3+; Group 15 → 3−; Group 16 → 2−; Group 17 → 1−; Group 18 → no ion at all (already full). The shortcut: metals lose their valence electrons, nonmetals gain (8 − valence).',
        'NAMING — a cation keeps the element name (Na⁺ is "sodium ion"); a monatomic anion swaps its ending to -ide (Cl⁻ chloride, O²⁻ oxide, S²⁻ sulfide, N³⁻ nitride).',
        'TRANSITION METALS ARE THE EXCEPTION — they have more than one option, so their charge is NOT predictable from the column: iron gives both Fe²⁺ and Fe³⁺, copper both Cu⁺ and Cu²⁺. That is why their names carry a Roman numeral, as in iron(III) chloride.',
        'SIZE FLIPS WHEN THE ION FORMS — Na⁺ is far SMALLER than Na because losing the lone third-shell electron strips a whole shell away. Cl⁻ is LARGER than Cl because the extra electron adds repulsion while the proton count stays at 17.',
        'THE TRAP: THE VALENCE COUNT IS NOT THE CHARGE — sulfur has 6 valence electrons but forms S²⁻, not S⁶⁺ and not S⁶⁻. Ask which move is cheaper: gaining 2 beats stripping 6 every time.',
      ],
      vocabulary: [
        { term: 'ion', definition: 'an atom (or group of atoms) carrying a net electric charge because it gained or lost electrons.' },
        { term: 'cation', definition: 'a positively charged ion, formed when an atom loses one or more electrons.' },
        { term: 'anion', definition: 'a negatively charged ion, formed when an atom gains one or more electrons.' },
        { term: 'isoelectronic', definition: 'having the same number of electrons as another species, as N³⁻, O²⁻, F⁻, Na⁺, and Mg²⁺ all do with neon.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-predict-two-ions',
      kind: 'worked_example',
      problem:
        'Magnesium sits in Group 2 with 12 protons; nitrogen sits in Group 15 with 7 protons. Predict the monatomic ion each one forms, name it, and give its electron count.',
      steps: [
        'Magnesium: Group 2 → 2 valence electrons. It can lose 2 or gain 6. Losing 2 is enormously cheaper, and it lands on the neon electron count.',
        'So Mg → Mg²⁺ + 2 e⁻. The ion keeps all 12 protons but is down to 10 electrons: 12 positives vs 10 negatives = a 2+ charge. It is named simply the magnesium ion.',
        'Nitrogen: Group 15 → 5 valence electrons. Losing 5 is brutally expensive; gaining (8 − 5) = 3 completes the octet, again at the neon count.',
        'So N + 3 e⁻ → N³⁻. It keeps 7 protons and now carries 10 electrons: 7 positives vs 10 negatives = a 3− charge. The -ide ending makes it the nitride ion.',
        'Notice both ions ended with 10 electrons — they are isoelectronic with neon — yet they are still magnesium and nitrogen, because protons, not electrons, set identity.',
      ],
      answer: 'Mg²⁺ (magnesium ion, 12 protons and 10 electrons) and N³⁻ (nitride ion, 7 protons and 10 electrons)',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-valence-count-trap',
      kind: 'worked_example',
      problem:
        'A student writes: "Sulfur has 6 valence electrons, so it loses all 6 to empty its outer shell and becomes S⁶⁺." Find the flaw and give the correct ion for sulfur (16 protons).',
      steps: [
        'Test the cost. Ripping 6 electrons off a nonmetal means fighting a high effective nuclear charge six times over — successive ionization energies climb steeply, and sulfur\'s electronegativity says it PULLS electrons in rather than surrendering them.',
        'Compare the two routes to a noble gas: losing 6 electrons would reach the neon count, but gaining just (8 − 6) = 2 reaches the argon count. Two moves beat six.',
        'So sulfur gains: S + 2 e⁻ → S²⁻, the sulfide ion. Check the sign — electrons are NEGATIVE, so adding them makes the ion negative, never positive.',
        'Count the particles: protons stay locked at 16 (it is still sulfur), electrons go from 16 to 18. 16 positives vs 18 negatives = a net 2− charge.',
        'The repair to the rule: the valence count tells you how FAR an atom is from an octet; whether it goes up or down is decided by which direction is cheaper — metals lose, nonmetals gain.',
      ],
      answer: 'S²⁻, the sulfide ion — sulfur gains 2 electrons (16 protons, 18 electrons); it never forms S⁶⁺',
      estimatedMinutes: 3,
    },
    {
      id: 'try-aluminum-ion',
      kind: 'try_yourself',
      problem: 'Aluminum sits in Group 13. Which monatomic ion does it form, and why?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Al³⁺ — it loses its 3 valence electrons to reach the neon configuration', correct: true },
        { id: 'b', text: 'Al³⁻ — it has 3 valence electrons, so its charge is 3−' },
        { id: 'c', text: 'Al⁵⁻ — it gains 5 electrons to complete an octet' },
        { id: 'd', text: 'Al¹³⁺ — one positive charge for each of its 13 protons' },
      ],
      expectedAnswer: 'Al³⁺ — it loses its 3 valence electrons to reach the neon configuration',
      hints: [
        'Aluminum is a metal. Which direction do metals move electrons, and what does that do to the sign of the charge?',
        'Compare the cost: losing 3 electrons versus gaining 5. The cheaper route wins, and losing electrons leaves a POSITIVE ion.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-sodium-ion-facts',
      kind: 'try_yourself',
      problem: 'A sodium atom has 11 protons and 11 electrons. After it becomes Na⁺, which statement is correct?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'It still has 11 protons but only 10 electrons, and the ion is much smaller than the atom because a whole shell was stripped away', correct: true },
        { id: 'b', text: 'It gained a proton, and that extra positive charge is where the + comes from' },
        { id: 'c', text: 'It has 10 protons and 11 electrons, since losing charge means losing a proton' },
        { id: 'd', text: 'It has 11 protons and 10 electrons, and the ion is larger than the atom because charged particles need more room' },
      ],
      expectedAnswer: 'It still has 11 protons but only 10 electrons, and the ion is much smaller than the atom because a whole shell was stripped away',
      hints: [
        'Protons are fixed — change them and you change the element. So which particle actually moved?',
        'Sodium\'s single third-shell electron is the one that leaves. What happens to the size of the electron cloud when that outermost shell empties out?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric',
      kind: 'try_yourself',
      problem:
        'Sulfur is in Group 16 and a neutral sulfur atom has 16 protons and 16 electrons. Predict the monatomic ion sulfur forms, then state how many electrons that ion has. Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '18',
      hints: [
        'Group 16 means 6 valence electrons. How many more are needed to reach a full octet, and does a nonmetal gain them or lose them?',
        'Sulfur gains 2 electrons to become S²⁻. Add those 2 to the 16 it started with.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-isoelectronic',
      kind: 'misconception_check',
      question:
        'A student says: "N³⁻, O²⁻, F⁻, Na⁺, and Mg²⁺ all have 10 electrons, so they are basically the same particle — same element, same size." What is wrong with this reasoning?',
      commonErrors: [
        {
          answer: 'Same electron count means same element and same size',
          misconception: 'Treating electrons as the thing that defines an atom, when electrons are the only part that chemistry moves around.',
          correctsTo:
            'Identity is set by PROTONS, and those never changed: 7 protons is still nitrogen, 12 is still magnesium. Being isoelectronic only means matching electron counts. Size differs too, and predictably — Mg²⁺ has 12 protons squeezing those 10 electrons and is the smallest, while N³⁻ has only 7 protons holding the same 10 and is the largest. Same crowd of electrons, very different grip.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Only electrons move: gain them → anion (−), lose them → cation (+). Protons stay fixed and keep defining the element.',
        'Atoms move toward the nearest noble-gas electron count, choosing whichever direction is cheaper — metals lose, nonmetals gain (8 − valence).',
        'Read the charge off the column: Group 1 → 1+, 2 → 2+, 13 → 3+, 15 → 3−, 16 → 2−, 17 → 1−, 18 → none. Transition metals are the exception and need Roman numerals.',
        'Cations keep the element name; monatomic anions take the -ide ending (chloride, oxide, sulfide, nitride).',
        'The trap: the valence count is not the charge — sulfur has 6 valence electrons but forms S²⁻, and cations shrink while anions swell.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '3', cedTopic: '3.3', cedTitle: 'Ion Formation & Predicting Charges' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
