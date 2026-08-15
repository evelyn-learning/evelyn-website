/**
 * Biology — Molecular Genetics: Transcription, Translation & the Central Dogma.
 *
 * The information-flow template for the HS Biology fan-out (NGSS HS-LS1-1).
 * Every check is an MCQ with the sequences written into the choice text:
 * students must never need an off-screen codon chart, so any codon meaning a
 * question turns on is stated in the problem itself. The classic errors here
 * are clerical — leaving a T in mRNA, copying the template strand instead of
 * pairing with it, and building protein in the nucleus — so the distractors
 * are those three errors made concrete.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_BIO_U6_TRANSCRIPTION_TRANSLATION: LessonPlan = {
  id: 'evelyn.hs.bio.transcription-translation.v1',
  title: 'Transcription, Translation & the Central Dogma',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'science',
  topic: 'biology',
  locale: 'en',
  los: [
    {
      id: 'bio.transcription-translation',
      standard: 'BIO-6.2',
      description:
        'Explain how the information in a DNA sequence is transcribed into mRNA in the nucleus and translated into a chain of amino acids at the ribosome, using codons, the start codon AUG, stop codons, and tRNA anticodons to trace a sequence from gene to protein (NGSS HS-LS1-1).',
    },
  ],
  prerequisites: ['bio.dna-structure-replication'],
  followUps: ['bio.mutations'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame the central dogma as a code we can now read, write and hand to a cell.',
      script:
        'Every dose of insulin a person with diabetes injects was made by bacteria. Someone took the human gene for insulin, dropped it into E. coli, and the bacteria read it and built human protein — because the code from DNA to protein is the same in a bacterium as it is in you. The mRNA vaccines work the same way in reverse: they hand your own cells a short message and let your ribosomes build the protein. In this lesson you follow that message from DNA to RNA to protein, one three-letter word at a time, and by the end you will be able to read a gene out loud.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-central-dogma',
      kind: 'concept',
      goal: 'The two-step path DNA → RNA → protein, where each step happens, and how three-base codons are read.',
      keyIdeas: [
        'THE CENTRAL DOGMA — information flows DNA → RNA → protein. DNA is the master file that stays in the nucleus; RNA is the disposable working copy that travels; protein is the finished machine that does the job. Two steps, two names: making the RNA copy is TRANSCRIPTION, building the protein from it is TRANSLATION.',
        'RNA IS NOT DNA — three differences, every time. RNA uses the sugar RIBOSE (DNA uses deoxyribose); RNA uses URACIL (U) wherever DNA would use thymine (T); RNA is SINGLE-stranded, not a double helix. If a T ever appears in your mRNA, you have made a mistake.',
        'TRANSCRIPTION — happens in the NUCLEUS. The enzyme RNA POLYMERASE unzips a stretch of DNA and builds an mRNA strand by base-pairing against the template strand: DNA C pairs with RNA G, DNA G with C, DNA T with A, and DNA A with U (not T). The finished mRNA leaves the nucleus through a pore.',
        'TRANSLATION — happens at a RIBOSOME out in the CYTOPLASM. The ribosome clamps onto the mRNA and reads it three bases at a time, adding one amino acid per word, until the chain is finished and folds into a protein. Nothing is translated inside the nucleus.',
        'CODONS ARE THREE-BASE WORDS — a CODON is three mRNA bases read together, and each codon names one amino acid. Reading always starts at the START CODON AUG (which itself codes for methionine) and moves in threes from there. Three codons — UAA, UAG and UGA — are STOP codons: they name no amino acid and simply end the chain.',
        'tRNA CARRIES THE AMINO ACIDS — each transfer-RNA molecule holds a specific amino acid at one end and a three-base ANTICODON at the other. The anticodon base-pairs with the matching mRNA codon, which is how the right amino acid lands in the right spot. Codon AUG is met by anticodon UAC.',
        'REDUNDANT BUT NOT AMBIGUOUS — there are 64 codons for only about 20 amino acids, so most amino acids have several codons: GUU, GUC, GUA and GUG all code for valine. That is REDUNDANCY. But no single codon ever codes for two different amino acids, so reading is never a guess — given a codon, the amino acid is certain.',
        'READING A CODON CHART IN WORDS — find AUG, then cut the rest into groups of three without regrouping partway, look up each group, and stop at the first stop codon. The bases after a stop codon are simply not translated.',
      ],
      vocabulary: [
        { term: 'codon', definition: 'a group of three mRNA bases that names one amino acid or a stop signal.' },
        { term: 'anticodon', definition: 'the three bases on a tRNA that pair with a matching mRNA codon.' },
        { term: 'mRNA', definition: 'messenger RNA — the single-stranded working copy of a gene that carries the message out of the nucleus.' },
      ],
      suggestedTools: ['show_diagram', 'show_table'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-full-trace',
      kind: 'worked_example',
      problem:
        'A gene has the DNA template strand 3\'-TACCACGGAATT-5\'. Transcribe it into mRNA, then translate it. Use these codon meanings: AUG codes for methionine and is the start codon, GUG codes for valine, CCU codes for proline, and UAA is a stop codon.',
      steps: [
        'Transcribe by PAIRING, not copying. Take the template one base at a time: DNA T gives RNA A, DNA A gives RNA U, DNA C gives RNA G. So TAC becomes AUG.',
        'Continue through the rest of the template: CAC gives GUG, GGA gives CCU, ATT gives UAA. The full mRNA is 5\'-AUGGUGCCUUAA-3\'. Check it: no T anywhere, because RNA uses U.',
        'Send the mRNA out of the nucleus to a ribosome in the cytoplasm, and cut it into codons starting at AUG: AUG / GUG / CCU / UAA.',
        'Translate word by word using the meanings given: AUG is the start and places methionine, GUG places valine, CCU places proline, and UAA is a stop codon that ends the chain without adding an amino acid.',
        'Count what was actually built: three amino acids, because the stop codon is punctuation, not a fourth amino acid.',
      ],
      answer: 'mRNA 5\'-AUGGUGCCUUAA-3\'; the polypeptide is methionine-valine-proline, built at a ribosome in the cytoplasm.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-copied-template',
      kind: 'worked_example',
      problem:
        'A student is given the DNA template strand 3\'-TACAAACCT-5\' and writes the mRNA as 5\'-UACAAACCU-3\', explaining that they "changed every T to a U." Find the error and produce the correct mRNA. Codon meanings you need: AUG codes for methionine and is the start codon, UUU codes for phenylalanine, GGA codes for glycine, and UAC codes for tyrosine.',
      steps: [
        'Name what the student actually did: they COPIED the template letter for letter and swapped T for U. Transcription does not copy the template — RNA polymerase base-PAIRS against it, so every base changes.',
        'Test the student\'s answer for a start codon. Their mRNA begins UAC, which codes for tyrosine, not AUG. A ribosome would have nothing to start on — a strong sign the strand was copied instead of paired.',
        'Redo it by pairing: DNA T gives A, DNA A gives U, DNA C gives G. So the template TAC gives AUG — the start codon, exactly what should appear.',
        'Finish the strand the same way: AAA gives UUU, CCT gives GGA. The correct mRNA is 5\'-AUGUUUGGA-3\'. Notice it contains no T, and notice it is the student\'s answer with every base flipped to its partner.',
        'Translate to confirm it makes sense: AUG / UUU / GGA gives methionine-phenylalanine-glycine — a real polypeptide that starts where it should.',
      ],
      answer: 'The mRNA must be paired against the template, not copied from it: 5\'-AUGUUUGGA-3\', which translates to methionine-phenylalanine-glycine.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-transcribe',
      kind: 'try_yourself',
      problem:
        'A gene has the DNA template strand 3\'-TACGGCACT-5\'. Which sequence is the mRNA transcribed from it?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '5\'-ATGCCGTGA-3\'' },
        { id: 'b', text: '5\'-UACGGCACU-3\'' },
        { id: 'c', text: '5\'-AUGCCGUGA-3\'', correct: true },
        { id: 'd', text: '5\'-AGUGCCGUA-3\'' },
      ],
      expectedAnswer: '5\'-AUGCCGUGA-3\'',
      hints: [
        'RNA polymerase pairs with the template rather than copying it — and RNA never contains thymine.',
        'Pair the first three bases: DNA T gives A, DNA A gives U, DNA C gives G, so TAC gives AUG. Continue base by base.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-translate',
      kind: 'try_yourself',
      problem:
        'An mRNA reads 5\'-AUGCACGGUUAG-3\'. In this message AUG codes for methionine and is the start codon, CAC codes for histidine, GGU codes for glycine, and UAG is a stop codon. Which polypeptide is made, and where in the cell is it assembled?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Methionine-histidine-glycine, assembled at a ribosome in the cytoplasm', correct: true },
        { id: 'b', text: 'Methionine-histidine-glycine-tryptophan, assembled at a ribosome in the cytoplasm' },
        { id: 'c', text: 'Histidine-glycine, assembled at a ribosome in the cytoplasm' },
        { id: 'd', text: 'Methionine-histidine-glycine, assembled by RNA polymerase inside the nucleus' },
      ],
      expectedAnswer: 'Methionine-histidine-glycine, assembled at a ribosome in the cytoplasm',
      hints: [
        'Cut the message into threes starting at AUG, then decide whether the last group adds an amino acid or ends the chain.',
        'AUG both starts translation and places methionine; a stop codon is punctuation, and protein is never built in the nucleus.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-redundancy',
      kind: 'try_yourself',
      problem:
        'A single DNA base change alters one codon of an mRNA from GUG to GUA. Both GUG and GUA code for valine, and neither is a stop codon. What happens to the protein built from this mRNA?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Every amino acid after that point changes, because the reading frame shifts' },
        { id: 'b', text: 'The chain is cut short at that codon, because a changed codon ends translation' },
        { id: 'c', text: 'An extra amino acid is added at that position, because the codon now names two amino acids' },
        { id: 'd', text: 'The protein is unchanged — the code is redundant, so both codons place valine', correct: true },
      ],
      expectedAnswer: 'The protein is unchanged — the code is redundant, so both codons place valine',
      hints: [
        'Only one base changed, and no base was added or removed — so the groups of three stay lined up exactly as before.',
        'Several codons can name the same amino acid. Ask what amino acid GUA places, then compare it to GUG.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-redundant-vs-ambiguous',
      kind: 'misconception_check',
      question:
        'A student says: "The genetic code is redundant, so one codon can stand for several different amino acids — you can never be sure which protein a gene will make." What went wrong?',
      commonErrors: [
        {
          answer: 'One codon can stand for several different amino acids',
          misconception: 'Reading "redundant" backwards — treating many-codons-per-amino-acid as though it meant many-amino-acids-per-codon, which would make the code ambiguous.',
          correctsTo:
            'Redundancy runs the other way. Several codons can name the SAME amino acid — GUU, GUC, GUA and GUG all place valine — but no codon ever names two different amino acids. Given GUA, the answer is valine, every time, in every organism. The code is redundant but NOT ambiguous, which is exactly why a gene makes the same protein each time it is read.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The central dogma: DNA → RNA → protein. Transcription makes the RNA copy; translation builds the protein.',
        'RNA differs from DNA in three ways: ribose sugar, uracil in place of thymine, single-stranded. A T in your mRNA is an error.',
        'Transcription happens in the nucleus by RNA polymerase, base-pairing against the template strand — pair with it, never copy it.',
        'Translation happens at a ribosome in the cytoplasm: read the mRNA in three-base codons starting at AUG, and stop at UAA, UAG or UGA without adding an amino acid.',
        'tRNA anticodons pair with mRNA codons to deliver amino acids; the code is redundant (several codons per amino acid) but never ambiguous.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '6', cedTopic: '6.2', cedTitle: 'Transcription, Translation & the Central Dogma' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
