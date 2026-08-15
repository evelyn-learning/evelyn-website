/**
 * Chemistry — Bonding: Covalent Bonds & Lewis Structures.
 *
 * Sharing instead of transferring (NGSS HS-PS1-1): valence-electron
 * bookkeeping turned into a repeatable recipe, with the two errors that
 * wreck it — counting a shared pair only once, and inventing electrons
 * to patch a short octet instead of making a multiple bond.
 *
 * Text-only: every structure is described in words (bonds, shared pairs,
 * lone pairs) — never sketched.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_CHEM_U4_COVALENT_BONDING_LEWIS: LessonPlan = {
  id: 'evelyn.hs.chem.covalent-bonding-lewis.v1',
  title: 'Covalent Bonds & Lewis Structures',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'science',
  topic: 'chemistry',
  locale: 'en',
  los: [
    {
      id: 'chem.covalent-bonding-lewis',
      standard: 'CHEM-4.2',
      description:
        'Explain how two nonmetals bond by sharing valence electrons, and build Lewis structures that account for every valence electron as bonding pairs or lone pairs, including molecules that require double or triple bonds (NGSS HS-PS1-1).',
    },
  ],
  prerequisites: ['chem.ionic-bonding'],
  followUps: ['chem.naming-compounds-formulas'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Nearly everything alive or breathable is held together by shared electrons — and one molecule\'s bond explains why the air is safe to sit in.',
      script:
        'Take a breath. About 78% of what just entered your lungs is N₂ — and it went right back out untouched. Nitrogen gas is famously unreactive, while the O₂ riding along with it will rust a nail or set a fire. Same air, wildly different behavior, and the reason is how many electron pairs each pair of atoms decided to SHARE: three pairs locked between the nitrogens, only two between the oxygens. Water, sugar, protein, DNA, plastic — all of it is atoms sharing electrons rather than handing them over. Today we learn to count those shared pairs exactly, using a bookkeeping tool called a Lewis structure.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-covalent-lewis',
      kind: 'concept',
      goal: 'Sharing as the mechanism, the Lewis recipe as the method, and the two counting errors that break it.',
      keyIdeas: [
        'SHARING, NOT TRANSFERRING — a covalent bond forms between two NONMETALS, atoms with similar electronegativity. Neither can strip electrons off the other (that would be ionic), so both pull on the SAME pair and both count it toward a full outer shell. One shared pair = one bond = 2 e⁻.',
        'BOND ORDER — one shared pair is a single bond, two shared pairs a double bond, three a triple bond. More shared pairs means the nuclei are pulled closer and held harder: strength rises triple > double > single, while bond LENGTH runs the other way, single > double > triple. That is why N₂ (triple) sits inert in the air and O₂ (double) reacts.',
        'THE LEWIS RECIPE — (1) add up the valence electrons of every atom; (2) put the LEAST electronegative atom in the center, never hydrogen, which only ever bonds once and sits on the outside; (3) join the outer atoms to the center with single bonds, spending 2 e⁻ each; (4) spend what is left as LONE PAIRS on the outer atoms until they have octets; (5) if the central atom is still short, pull lone pairs in from the outer atoms to form double or triple bonds.',
        'EVERY ELECTRON IS ACCOUNTED FOR — a LONE PAIR sitting on one atom and not in a bond still belongs to that atom\'s octet, still takes up space, and still appears in the structure as two dots (oxygen in water carries two lone pairs, nitrogen in ammonia one). The total from step 1 is the only currency you get: bonding pairs plus lone pairs must add back to exactly that number, or the structure is wrong.',
        'THE TRAP: A SHARED PAIR COUNTS TWICE — the two electrons in a bond count toward the octet of BOTH bonded atoms, so carbon in CO₂ reaches 8 from four shared pairs it does not exclusively own. Students who count only the electrons an atom "brought" conclude carbon has 4 and the structure is broken.',
        'THE OTHER TRAP: SHORT OCTET → MULTIPLE BOND — when the central atom ends up with 6 e⁻, you do NOT add electrons to fix it. You move an existing lone pair from an outer atom into the bond, converting a single bond into a double bond. Same total, better sharing.',
        'OCTET EXCEPTIONS — hydrogen is happy at 2 (a duet); boron often settles for 6; sulfur and phosphorus, being in Period 3, can hold expanded octets of 10 or 12.',
        'POLAR vs NONPOLAR SHARING — sharing is only fair when electronegativities match. H–H and Cl–Cl share evenly (nonpolar); in O–H the oxygen pulls harder, leaving a partial negative on O and a partial positive on H (polar). Polar bonds are why water dissolves salt and oil does not.',
      ],
      vocabulary: [
        { term: 'covalent bond', definition: 'a pair of valence electrons shared between two atoms, counting toward the outer shell of both.' },
        { term: 'lone pair', definition: 'a pair of valence electrons held by one atom and not shared in any bond.' },
        { term: 'bond order', definition: 'the number of electron pairs shared between two bonded atoms — one, two, or three.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-ammonia',
      kind: 'worked_example',
      problem:
        'Build the Lewis structure of ammonia, NH₃ (nitrogen has 5 valence electrons, each hydrogen has 1). Report every bond and every lone pair.',
      steps: [
        'Step 1 — budget: 5 from nitrogen plus 1 from each of the three hydrogens = 8 valence electrons total. Everything must be spent, and nothing more.',
        'Step 2 — skeleton: hydrogen can only ever form one bond, so it can never be central. Nitrogen takes the center with the three hydrogens around it.',
        'Step 3 — single bonds: three N–H bonds, one shared pair each, spend 3 × 2 = 6 e⁻. Two electrons remain in the budget.',
        'Step 4 — outer atoms first: each hydrogen already has its shared pair, and hydrogen wants only a duet of 2 — it is full. So the leftover pair cannot go there.',
        'Step 5 — the remainder: the last 2 e⁻ become a single LONE PAIR on the nitrogen. Check nitrogen: three shared pairs (6 e⁻, counted in full because shared electrons count for both partners) plus one lone pair (2 e⁻) = 8 e⁻, a complete octet. No multiple bond is needed.',
        'Audit the budget: 6 e⁻ in bonds + 2 e⁻ in the lone pair = 8, matching step 1 exactly.',
      ],
      answer: 'Three N–H single bonds plus one lone pair on the nitrogen — 8 valence electrons total, nitrogen at a full octet, each hydrogen at a duet',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-co2-short-octet',
      kind: 'worked_example',
      problem:
        'Build the Lewis structure of carbon dioxide, CO₂ (carbon has 4 valence electrons, each oxygen has 6). Following the recipe with single bonds leaves the carbon short — fix it without changing the electron total.',
      steps: [
        'Step 1 — budget: 4 from carbon plus 6 from each of two oxygens = 16 valence electrons.',
        'Step 2 — skeleton: carbon is less electronegative than oxygen, so carbon is the central atom with one oxygen on each side.',
        'Step 3 — single bonds: one shared pair to each oxygen spends 4 e⁻, leaving 12 in the budget.',
        'Step 4 — outer atoms first: give each oxygen three lone pairs, spending all 12. Each oxygen now has 6 lone electrons plus its 2 shared = 8, a full octet.',
        'Now audit the center: carbon has only its two shared pairs, 4 e⁻. It is four electrons short of an octet — two pairs short — and the budget is empty, so there are no spare electrons to hand it.',
        'Step 5 — the fix: move one lone pair from EACH oxygen into its bond with carbon, turning both single bonds into DOUBLE bonds. No electrons were created or destroyed; two pairs simply changed from lone to shared.',
        'Recount: carbon now sits in four shared pairs, 8 e⁻ — octet complete. Each oxygen keeps two lone pairs (4 e⁻) plus the four shared electrons of its double bond = 8 — octet complete. Budget check: 8 e⁻ in the two double bonds + 8 e⁻ in the four remaining lone pairs = 16.',
      ],
      answer: 'Two carbon–oxygen DOUBLE bonds with two lone pairs left on each oxygen — 16 electrons, every atom at an octet',
      estimatedMinutes: 3,
    },
    {
      id: 'try-n2-shared-pairs',
      kind: 'try_yourself',
      problem:
        'A nitrogen atom has 5 valence electrons. In an N₂ molecule the two nitrogen atoms bond to each other and each ends up with a full octet, and each atom also keeps one lone pair. How many electron pairs are SHARED between the two nitrogen atoms?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'One shared pair — atoms bond by sharing a single pair' },
        { id: 'b', text: 'Two shared pairs — a double bond' },
        { id: 'c', text: 'Three shared pairs — a triple bond', correct: true },
        { id: 'd', text: 'Five shared pairs — one for each valence electron on a nitrogen' },
      ],
      expectedAnswer: 'Three shared pairs — a triple bond',
      hints: [
        'Each nitrogen keeps one lone pair (2 e⁻), so it needs 6 more electrons from sharing to reach 8.',
        'Six electrons of sharing is three pairs — and every shared pair counts for both atoms at once.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-octet-counting',
      kind: 'try_yourself',
      problem:
        'In the finished Lewis structure of CO₂ — carbon in the center joined to each oxygen by a double bond, with two lone pairs left on each oxygen — how many electrons count toward the CARBON\'s octet?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '4 — carbon only brought four valence electrons of its own' },
        { id: 'b', text: '8 — both electrons of every shared pair count for carbon as well as for its oxygen partner', correct: true },
        { id: 'c', text: '12 — carbon\'s own 4 electrons plus the 8 electrons sitting in the two double bonds' },
        { id: 'd', text: '16 — every valence electron in the molecule surrounds the central atom' },
      ],
      expectedAnswer: '8 — both electrons of every shared pair count for carbon as well as for its oxygen partner',
      hints: [
        'Two double bonds means four shared pairs touching the carbon. A pair is 2 electrons.',
        'Do not split a shared pair between its two atoms — each atom counts the whole pair.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric',
      kind: 'try_yourself',
      problem:
        'Build the Lewis structure of formaldehyde, CH₂O: carbon is the central atom, bonded to both hydrogens and to the oxygen. Valence electrons: carbon 4, hydrogen 1 each, oxygen 6. When every atom has a complete shell, how many LONE PAIRS appear in the whole molecule? Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '2',
      hints: [
        'Budget first: 4 + 1 + 1 + 6 = 12 valence electrons. Three single bonds spend 6, leaving 6 for lone pairs.',
        'Those 6 go to the oxygen as three lone pairs — but then carbon has only 6 electrons, so one of those pairs must swing into the C–O bond to make it a double bond. Count what is left on the oxygen (hydrogens hold none).',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-invented-electrons',
      kind: 'misconception_check',
      question:
        'A student building CH₂O finds carbon stuck at 6 electrons after placing three single bonds and three lone pairs on the oxygen. To finish, they add one more lone pair onto the carbon — so their structure now shows 14 electrons even though the atoms only supplied 12. What is wrong, and what should they have done?',
      commonErrors: [
        {
          answer: 'Just add a lone pair to the atom that is short',
          misconception: 'Treating the electron total as flexible — inventing electrons to patch an incomplete octet.',
          correctsTo:
            'The valence count from step 1 is fixed: 12 electrons in, 12 electrons out. An atom that is short does not get new electrons, it gets a bigger SHARE of existing ones — pull a lone pair off the oxygen and into the C–O bond, making it a double bond. Carbon reaches 8, oxygen still has 8 (two lone pairs plus four shared), and the total is still 12.',
        },
        {
          answer: 'Lone pairs and bonding pairs are interchangeable, so it does not matter where the extra pair sits',
          misconception: 'Seeing a Lewis structure as decoration rather than a strict electron ledger.',
          correctsTo:
            'Where a pair sits is the whole point. A lone pair counts for ONE atom; a bonding pair counts for TWO. That is exactly why converting a lone pair into a bonding pair can complete carbon\'s octet without spending a single new electron.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Covalent bonding is two nonmetals SHARING pairs of valence electrons; every shared pair counts toward the octet of both atoms.',
        'One, two, or three shared pairs = single, double, triple bond — strength rises and bond length shrinks as the count goes up.',
        'The recipe: count total valence electrons, put the least electronegative atom in the center (never hydrogen), make single bonds, spend the rest as lone pairs on the outer atoms, then upgrade to multiple bonds if the center is short.',
        'The electron budget never changes — a short octet is fixed by re-sharing an existing lone pair, never by inventing electrons.',
        'Watch the edges: hydrogen stops at 2, boron often stops at 6, and sulfur and phosphorus can expand past 8; unequal electronegativity makes the sharing polar.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '4', cedTopic: '4.2', cedTitle: 'Covalent Bonds & Lewis Structures' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
