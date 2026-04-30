/**
 * G11 / AP Biology — Evidence for evolution.
 *
 * Five lines of evidence: fossils, comparative anatomy, embryology,
 * biogeography, molecular biology. Why evolution is one of the
 * most-supported theories in science.
 */

import type { LessonPlan } from '../types';

export const SEED_G11_BIO_EVOLUTION_EVIDENCE: LessonPlan = {
  id: 'evelyn.g11.bio.evolution.evidence.v1',
  title: 'Evidence for evolution',
  curriculum: 'NGSS',
  grade: '11',
  subject: 'sci',
  topic: 'biology',
  locale: 'en',
  los: [
    {
      id: 'apbio.evolution-evidence',
      description: 'Describe the lines of evidence supporting evolution by natural selection.',
      standard: 'AP-BIO-EVO-1',
    },
  ],
  prerequisites: [],
  followUps: ['apbio.speciation'],
  estimatedMinutes: 15,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame evolution as the most-tested theory in biology.',
      script: 'In 1859 Darwin proposed evolution by natural selection. In the 165 years since, it\'s been tested by paleontologists, geneticists, ecologists, and dozens of other fields — and it has SURVIVED every test. Here\'s the evidence.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-five-lines',
      kind: 'concept',
      goal: 'Five independent lines of evidence converging on evolution.',
      keyIdeas: [
        '1) FOSSIL RECORD: layers of rock preserve organisms over hundreds of millions of years. Older layers have simpler organisms; younger layers have more complex. TRANSITIONAL FOSSILS show intermediate forms (Tiktaalik = fish-with-legs, Archaeopteryx = dinosaur-with-feathers).',
        '2) COMPARATIVE ANATOMY: HOMOLOGOUS structures — same bone layout, different functions. Human arm, whale flipper, bat wing, cat leg — all have the same arrangement of bones. Suggests common ancestor.',
        '   VESTIGIAL structures: features inherited from ancestors but no longer useful (whale pelvis bones, human appendix, ostrich wings).',
        '3) EMBRYOLOGY: early embryos of vertebrates look strikingly similar (gill slits, tails). Reflects shared developmental ancestry.',
        '4) BIOGEOGRAPHY: where species live tells a story. Australia\'s isolation produced unique marsupials. Galápagos finches (Darwin\'s finches) diverged on different islands. Closely related species are usually GEOGRAPHICALLY clustered.',
        '5) MOLECULAR BIOLOGY: DNA. Closely related species share more DNA. Humans and chimps share ~98.8%. The genetic code itself is nearly UNIVERSAL across all life — strong evidence of common ancestry. Molecular clocks let us estimate when species diverged.',
        'CONVERGENCE: independent lines of evidence agree. That\'s what makes evolution one of the most-supported theories in all of science.',
      ],
      vocabulary: [
        { term: 'homologous structure', definition: 'similar anatomy in different species, suggesting common ancestry.' },
        { term: 'vestigial structure', definition: 'a feature whose function has been lost but the structure remains.' },
        { term: 'transitional fossil', definition: 'a fossil showing intermediate features between major groups.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-tiktaalik',
      kind: 'worked_example',
      problem: 'Why is the fossil Tiktaalik (discovered 2004) such important evidence for evolution?',
      steps: [
        'PREDICTION FIRST: scientists expected a fish-tetrapod transitional fossil to exist in rocks ~375 million years old. They specifically searched the Canadian Arctic for such rocks.',
        'DISCOVERY: Tiktaalik — a fish with FINS, GILLS, and SCALES, but also a NECK, RIBS that could support weight, and proto-LIMB bones inside its fins.',
        'It\'s exactly what you\'d predict for the transition from fish to four-legged land vertebrates.',
        'WHY POWERFUL: this was a PREDICTION fulfilled. Evolution said "look in 375M-year-old rocks for a fish-tetrapod hybrid", and one was found.',
        'Predictions that come true are the hallmark of strong scientific theories.',
      ],
      answer: 'predicted intermediate, found in expected age rocks; fish-tetrapod transitional features',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'How does the genetic code being NEARLY UNIVERSAL across all life support evolution?',
      expectedAnswer: 'all life shares a common ancestor that used this code; it was inherited rather than re-invented',
      responseFormat: 'free',
      hints: [
        'If life arose multiple times independently, you\'d expect different codes.',
        'A shared code suggests one common origin.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-just-theory',
      kind: 'misconception_check',
      question: 'Is evolution "just a theory" — meaning a guess?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Confusing scientific "theory" with everyday usage.',
          correctsTo: 'No — in everyday language, "theory" means a guess. In SCIENCE, a theory is a well-tested explanation supported by extensive evidence. Evolution is a theory in the same way GERM theory or atomic theory is — explained by mountains of evidence, never falsified.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Five lines: fossil record, comparative anatomy, embryology, biogeography, molecular biology.',
        'Homologous structures suggest common ancestry.',
        'Vestigial structures suggest evolutionary leftovers.',
        'Predictions (Tiktaalik) fulfilled = hallmark of strong theory.',
        '"Theory" in science means well-tested, not "guess".',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'How do we OBSERVE evolution happening in REAL TIME today?',
      hint: 'Antibiotic-resistant bacteria evolve in months. Insect resistance to pesticides. COVID variants. Peppered moths during industrial revolution. Galápagos finch beaks shifting in drought years (the Grants\' work). Evolution isn\'t just historical.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
