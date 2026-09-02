/**
 * Grade 6 Science (Earth & Space Science) — Earth\'s History in the Rock
 * Record: Absolute Dating & the Geologic Time Scale.
 *
 * PROCEDURE-LED fan-out row for m6sci (NGSS MS-ESS1-4), modeled on this
 * course's procedure-led exemplar (relative dating, row 5.1). One routine
 * runs the whole lesson: (1) match the material to a method, (2) turn a
 * measured decay ratio (or an already-computed lab result) into an age in
 * years using a fixed half-life, (3) check that age against the method's
 * reliable range, (4) place the age on the geologic time scale by comparing
 * it to era boundary years with every number written out in full, and
 * (5) read the placement back to check it makes sense. Both worked examples
 * run this same five-step routine so the pattern is unmistakable, exactly
 * as the procedure-led exemplar's two worked examples share one routine.
 *
 * The two traps this row is built to kill are (a) treating relative order
 * and an age in years as the same kind of answer, and (b) stretching
 * carbon-14 past its roughly 50,000-year range onto rock or onto ages far
 * outside it ("carbon-14-on-rock").
 *
 * SCOPE GUARD: this plan converts a measured parent-to-daughter ratio, or an
 * already-computed lab age, into a number of years using a fixed half-life,
 * and places that number inside the eon-era-period nesting of the geologic
 * time scale, down to the ERA level only. Because the rest of Unit 5 sits
 * very close, the guard states what is deliberately EXCLUDED and also what
 * is deliberately ALLOWED at that edge, and why:
 *   - ROW 5.1 (relative dating and rock layers) is referenced only as "the
 *     previous lesson", never by name, and only to contrast an ORDER with
 *     an AGE IN YEARS. Superposition, cross-cutting relationships, original
 *     horizontality and rock-layer ordering are not re-taught here.
 *   - ROW 5.3 (fossils as evidence) and ROW 5.4 (mass extinctions as time
 *     markers) are not touched. No index fossil appears anywhere in this
 *     file, and fossils are named only in one passage, in passing, to
 *     explain why the Phanerozoic Eon is named for its abundant fossil
 *     record -- never as a tool used to date a layer. The five specific
 *     mass-extinction boundaries that divide the Phanerozoic into its eras
 *     are never named, counted or listed here; this plan states the three
 *     Phanerozoic ERA NAMES and their boundary YEARS as given facts to
 *     place a number against, and never explains what event produced any
 *     boundary.
 *   - PERIOD is named as the level below era in the eon-era-period nesting,
 *     and one period (the Cretaceous, the Mesozoic Era's last) is named
 *     purely to show that the nesting is real -- but no item in this plan
 *     asks a student to place an age at period resolution or requires a
 *     period boundary year. That stays coarse on purpose, matching this
 *     course's preference for the divisions a sixth grader needs over a
 *     full stratigraphic column.
 *   - GRADE 8 PHYSICAL SCIENCE boundary: this plan states THAT a parent atom
 *     decays into a daughter atom at a fixed, measurable rate, and uses that
 *     rate as a clock. It states plainly, once, that it does NOT explain WHY
 *     a nucleus decays -- that mechanism, along with atomic structure and
 *     any particle-level account of decay, is Grade 8 physical science.
 *   - GRADE 7 LIFE SCIENCE boundary: no life-science content is in scope for
 *     this row, and none appears. No fossil, extinction or organism is
 *     discussed as evidence of how life changed.
 *
 * NOTE FOR FUTURE AUTHORS: there are NO IMAGES in this course. Every rock,
 * boundary and time span in this file is written out in words, and every
 * item is solvable from the text printed inside it. Never write "see the
 * time scale above", and never assume the student has a lab report, a rock
 * sample, or a textbook diagram in front of them.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6SCI_U5_ABSOLUTE_DATING_AND_THE_GEOLOGIC_TIME_SCALE: LessonPlan = {
  id: 'evelyn.ms.m6sci.absolute-dating-and-the-geologic-time-scale.v1',
  title: 'Absolute Dating & the Geologic Time Scale',
  curriculum: 'MS',
  grade: '6',
  subject: 'science',
  topic: 'grade-6-earth-space-science',
  locale: 'en',
  los: [
    {
      id: 'm6sci.absolute-dating-and-the-geologic-time-scale',
      standard: 'M6SCI-5.2',
      description:
        'Explain how radiometric dating (e.g., carbon-14 for organic material, uranium-lead for rock) gives an age in years, and place that age within the eon-era-period divisions of the geologic time scale (shares MS-ESS1-4 with the rest of Unit 5 as a coarse split by pedagogical stage).',
    },
  ],
  prerequisites: ['m6sci.relative-dating-and-rock-layers'],
  followUps: ['m6sci.fossils-as-evidence-of-earths-history'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Contrast an order with a real number of years, using an everyday object the student already thinks of that way.',
      script:
        'Somebody in your family probably owns an old coin, an old photograph, or something they call an antique. Ask how old it is, and they can usually give a real number: this coin is from 1965, or this photograph is sixty years old. Now think back to the last lesson. All that work sorting rock layers only ever produced an ORDER -- this layer came before that one. It never gave a year. Today that changes. There is a way to look inside a rock or an old bone and read off an actual age, in years, using something as steady and dependable as a clock that has been ticking since long before there were people to read it.',
      suggestedTools: ['show_timeline'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-radiometric-dating-and-time-scale',
      kind: 'concept',
      goal: 'Install the half-life mechanism as a measurable rate, match the two named methods to their materials and ranges, and lay out the eon-era-period nesting used to place a computed age -- without touching why an atom decays.',
      keyIdeas: [
        'RADIOMETRIC DATING GIVES AN AGE IN YEARS, NOT JUST AN ORDER. Unlike the previous lesson, which could only put layers and events in ORDER relative to each other, this lesson produces an actual number of years. It works because a radioactive atom (the PARENT) is unstable and, over time, changes into a different, stable atom (the DAUGHTER). That change happens at a fixed, measurable rate for a given radioactive element, called its HALF-LIFE: the amount of time it takes for exactly half of the parent atoms in a sample to become the daughter atom. A half-life does not speed up or slow down no matter how hot, cold, wet or dry the surroundings are, which is what makes it usable as a clock. This lesson does not explain WHY a parent atom decays -- that mechanism belongs to Grade 8 physical science. What matters here is that the rate is fixed and measurable.',
        'COUNTING HALF-LIVES GIVES AN AGE. If half of the original parent atoms remain, exactly 1 half-life has passed. If a quarter remain, that is half of a half, so 2 half-lives have passed. If an eighth remain, that is half of a half of a half, so 3 half-lives have passed. Multiply the number of half-lives that have passed by the length of one half-life, in years, and the result is the age of the sample in years.',
        'TWO METHODS, MATCHED TO MATERIAL. There are several radiometric methods, but this lesson covers the two used most often at this level. CARBON-14 DATING measures the decay of carbon-14 in once-living material -- wood, bone, shell -- and its half-life is about 5,730 years; because that half-life is short, carbon-14 gives reliable ages anywhere from very recent up to about 50,000 years, and past that point too little of it remains to measure accurately. URANIUM-LEAD DATING measures the decay of uranium locked inside minerals that crystallize as igneous rock cools, and its half-life is about 4.5 billion years, which is why it is used for rock rather than organic material, and why it is the method that reaches back hundreds of millions to billions of years. WRONG: "Carbon-14 dating shows this rock is 300 million years old." CORRECT: "Carbon-14 cannot date rock at all, and it cannot measure ages anywhere near 300 million years; a number that large would come from uranium-lead dating of a mineral in the rock, not from carbon-14."',
        'THE GEOLOGIC TIME SCALE NESTS EON, THEN ERA, THEN PERIOD, LARGEST TO SMALLEST -- similar to how a calendar nests decade, then year, then month. Almost all of Earth\'s roughly 4.6-billion-year history, before fossils became abundant in the rock record, is grouped as the PRECAMBRIAN. The eon we are still in, the PHANEROZOIC, began about 541 million years ago and is named for its abundant, visible fossils. The Phanerozoic Eon holds three eras: the PALEOZOIC ("ancient life", about 541 million to about 252 million years ago), the MESOZOIC ("middle life", about 252 million to about 66 million years ago, when most dinosaurs lived), and the CENOZOIC ("recent life", about 66 million years ago to today, the age of mammals, including humans). Each era is further split into PERIODS -- the Mesozoic Era\'s last period, for example, is called the Cretaceous -- but this lesson places an age only down to the ERA, not the period.',
        'PLACE THE AGE BY COMPARING NUMBERS. Once an age in years is known, compare it to the era boundary years just given: an age that falls between two boundary numbers belongs to the era between them. Two cautions. First, always write every number out in full before comparing -- million and billion look similar side by side in a sentence, but a billion is a thousand times a million, and lining up the zeros is what keeps that difference from disappearing. Second, an age far older than the Phanerozoic\'s roughly 541-million-year start is not sorted into the Paleozoic, Mesozoic or Cenozoic Era at all -- it falls in the Precambrian instead.',
        'THE ROUTINE, IN ORDER -- (1) Identify the material: once-living organic material points to carbon-14; a mineral inside igneous rock points to uranium-lead. (2) Get an age in years: either count half-lives from the fraction of parent atoms remaining and multiply by the half-life length, or read an already-computed age straight from a lab report. (3) Check the age against the method\'s range: a carbon-14 result should be well under about 50,000 years; a uranium-lead result in the hundreds of millions to billions is expected. (4) Place the age on the geologic time scale by comparing it to the era boundary years, after writing every number out in full so millions and billions cannot be confused. (5) Read the placement back and ask whether it makes sense: an igneous rock reported at 1.8 billion years old, for instance, cannot belong to any of the three named eras, because all three sit inside the Phanerozoic\'s most recent 541 million years.',
      ],
      vocabulary: [
        { term: 'radiometric dating', definition: 'finding the age of an object in years by measuring the decay of a radioactive element it contains.' },
        { term: 'half-life', definition: 'the fixed amount of time it takes for half of the radioactive (parent) atoms in a sample to change into a different, stable (daughter) atom.' },
        { term: 'parent atom', definition: 'the original radioactive atom in a sample, before it decays.' },
        { term: 'daughter atom', definition: 'the new, stable atom a parent atom becomes after it decays.' },
        { term: 'carbon-14 dating', definition: 'a radiometric method that measures the decay of carbon-14 in once-living material, reliable for ages up to about 50,000 years.' },
        { term: 'uranium-lead dating', definition: 'a radiometric method that measures the decay of uranium in minerals within igneous rock, used for ages of hundreds of millions to billions of years.' },
        { term: 'geologic time scale', definition: 'the nested system of eons, eras and periods scientists use to organize Earth\'s history.' },
      ],
      suggestedTools: ['show_timeline', 'show_table'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-carbon-14-half-life',
      kind: 'worked_example',
      problem:
        'A wooden tool found buried at an old campsite is tested for carbon-14. The lab reports that exactly one-quarter of the wood\'s original carbon-14 is still present; the rest has already decayed into nitrogen. Carbon-14\'s half-life is about 5,730 years. How old is the wood, and which era of the geologic time scale does it belong to?',
      steps: [
        'Step 1, identify the material and method. The tool is wood, once part of a living plant, so carbon-14 dating is the right method -- it measures decay in once-living material, not in rock.',
        'Step 2, get an age in years. The wood has 1/4 of its original carbon-14 remaining. After 1 half-life, 1/2 remains; after 2 half-lives, half of that half remains: 1/2 x 1/2 = 1/4. So 2 half-lives have passed. Multiply: 2 half-lives x 5,730 years per half-life = 11,460 years. (2 x 5,730 = 11,460.)',
        'Step 3, check the age against the method\'s range. Carbon-14 stays reliable up to about 50,000 years, because past that point too little of it remains to measure accurately. 11,460 years is well under 50,000 years, so this result is inside carbon-14\'s reliable range.',
        'Step 4, place the age on the time scale. 11,460 years is far smaller than even the Cenozoic Era\'s span of about 66 million years, so the wood clearly belongs to the Cenozoic Era, right near the present-day end of it -- no comparison to the older Paleozoic or Mesozoic boundaries is even needed once a number this small shows up.',
        'WRONG: "Since some of the carbon-14 has decayed, this wood could be millions of years old." CORRECT: "Carbon-14 can only measure ages up to about 50,000 years; a measurable amount of carbon-14 remaining tells us the wood is thousands of years old, not millions."',
        'Step 5, read the answer back with the two checks a science answer needs, because there is no equation to work backward here. First, clues of DIFFERENT KINDS that agree: the fraction remaining (1/4) gives 2 half-lives; the material (once-living wood) confirms carbon-14 is the right tool; the size of the answer (11,460 years, far under 50,000) confirms the result sits inside the method\'s reliable range. Three different kinds of check, one answer. Second, change one thing and see the answer move with it: if only 1/8 of the carbon-14 remained instead of 1/4, that would be 3 half-lives (1/2 x 1/2 x 1/2 = 1/8), for an age of 3 x 5,730 = 17,190 years -- still comfortably inside the 50,000-year range and still Cenozoic, but a different, larger number than before, exactly as it should be.',
      ],
      answer:
        'The wood is about 11,460 years old (2 half-lives x 5,730 years = 11,460 years), well inside carbon-14\'s reliable range, and it belongs to the Cenozoic Era.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-uranium-lead-and-era-placement',
      kind: 'worked_example',
      problem:
        'A geologist collects a sample of solid igneous rock. A lab test of the uranium locked inside one of its minerals reports a uranium-lead age of about 1.8 billion years. Using the era boundaries -- Paleozoic Era: about 541 million to about 252 million years ago; Mesozoic Era: about 252 million to about 66 million years ago; Cenozoic Era: about 66 million years ago to today -- say whether this rock belongs to one of the three Phanerozoic eras, and if not, say what that means.',
      steps: [
        'Step 1, identify the material and method. This is igneous rock -- rock that cooled from magma or lava -- so uranium-lead dating is the right method, not carbon-14; uranium-lead\'s half-life of about 4.5 billion years is built for spans this large, while carbon-14 would have run out of measurable carbon-14 within the first 50,000 years of this rock\'s history.',
        'Step 2, get an age in years. The lab has already converted the measured uranium-to-lead ratio into an age for us: about 1.8 billion years. (Turning a ratio that is not a clean fraction like 1/2 or 1/4 into an exact age uses math beyond this lesson; a lab instrument does that conversion.)',
        'Step 3, check the age against the method\'s range. Uranium-lead dating is used for ages of hundreds of millions to billions of years, and 1.8 billion years sits comfortably inside that range.',
        'Step 4, place the age on the time scale. Line up the units before comparing anything: 1.8 billion years is 1,800,000,000 years, and the oldest Phanerozoic boundary given is 541 million years, or 541,000,000 years. Since 1,800,000,000 is much larger than 541,000,000, the rock is much older than the start of the Phanerozoic Eon, so it does not belong to the Paleozoic, Mesozoic or Cenozoic Era at all -- it formed during the Precambrian, the span before the Phanerozoic began.',
        'A number worth seeing, just for scale: how much of Earth\'s roughly 4.6-billion-year history came before the Phanerozoic even started? 4,600,000,000 years minus 541,000,000 years is 4,059,000,000 years, or about 4.06 billion years. This rock, at 1.8 billion years, sits well inside that huge Precambrian stretch, nowhere near the three named eras.',
        'WRONG: "The rock is 1.8 billion years old, so it must belong to the Paleozoic Era, since that is the oldest era listed." CORRECT: "The Paleozoic Era only reaches back to about 541 million years ago. An age of 1.8 billion years is far older than that, so the rock predates the entire Phanerozoic Eon, and none of the three named eras applies."',
        'Step 5, read the answer back with the two checks. First, clues of DIFFERENT KINDS that agree: the material (igneous rock, not organic) points to uranium-lead; the size of the number (1.8 billion, far past any Phanerozoic boundary) points to a time before the Phanerozoic; and the definition of the Precambrian (everything before the Phanerozoic) is exactly where a number like this belongs. Second, change one thing and check the answer moves: if the lab had instead reported 68 million years, that number falls between the Mesozoic\'s boundaries of about 252 million and about 66 million years ago, so the rock would land in the Mesozoic Era instead of the Precambrian -- a much smaller age lands in a much later part of the time scale, exactly as it should.',
      ],
      answer:
        'The rock is about 1.8 billion years old. Because that is far older than the Phanerozoic Eon\'s start at about 541 million years ago, the rock belongs to the Precambrian rather than to the Paleozoic, Mesozoic or Cenozoic Era.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-choosing-a-method',
      kind: 'try_yourself',
      problem:
        'An archaeologist finds a piece of charcoal (burned wood) at a dig site and wants an age in years for it. Which method should she use, and why?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Relative dating, using the law of superposition, because the position of the charcoal in the ground will directly tell her how many years old it is.' },
        { id: 'b', text: 'Uranium-lead dating, because a method built for igneous rock will also work on burned wood, since both are simply very old.' },
        { id: 'c', text: 'Either method works equally well here, since both measure the decay of a radioactive element in a sample.' },
        { id: 'd', text: 'Carbon-14 dating, because charcoal comes from a once-living plant and carbon-14 dating gives reliable ages up to about 50,000 years.', correct: true },
      ],
      expectedAnswer: 'Carbon-14 dating, because charcoal comes from a once-living plant and carbon-14 dating gives reliable ages up to about 50,000 years.',
      hints: [
        'Ask what kind of material this is first -- was it ever alive, or is it a mineral that formed inside rock?',
        'Carbon-14 measures decay of carbon in once-living material and works well up to about 50,000 years; uranium-lead measures decay of uranium in minerals within igneous rock, over hundreds of millions to billions of years. Match the material to the right range.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-checking-a-second-method',
      kind: 'try_yourself',
      problem:
        'A geologist finds a layer of solid igneous rock and wants to know its age in years. A lab test shows the rock\'s uranium-lead ratio gives an age of about 1.8 billion years. A friend suggests double-checking the result with a carbon-14 test on the same rock. Is that a good idea?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'No -- carbon-14 only measures decay in once-living organic material, and it becomes unreliable after about 50,000 years, nowhere close to confirming an age of 1.8 billion years.', correct: true },
        { id: 'b', text: 'Yes -- running a second radiometric method on the same sample should give a more precise combined age, since two independent measurements are usually better than one.' },
        { id: 'c', text: 'Yes -- carbon-14 measures the decay of carbon found in any kind of rock, so it would confirm the same age that uranium-lead already found for this sample.' },
        { id: 'd', text: 'No -- the rock is far too young for either method to work, since radiometric dating only becomes accurate once a measurable amount of decay has had time to build up.' },
      ],
      expectedAnswer: 'No -- carbon-14 only measures decay in once-living organic material, and it becomes unreliable after about 50,000 years, nowhere close to confirming an age of 1.8 billion years.',
      hints: [
        'Think about what material each method is built to measure, and how long each method\'s reliable range actually lasts.',
        'Carbon-14 is built for once-living material and stops being reliable after about 50,000 years -- it was never designed to reach into the billions of years, no matter what other method already gave an answer.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-placing-an-age-on-the-time-scale',
      kind: 'try_yourself',
      problem:
        'A rock layer is radiometrically dated to about 130 million years old. Using the era boundaries -- Paleozoic Era: about 541 million to about 252 million years ago; Mesozoic Era: about 252 million to about 66 million years ago; Cenozoic Era: about 66 million years ago to today -- which era does this rock layer belong to?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Cenozoic Era, because 130 million years ago is closer to today than to the start of the Phanerozoic Eon, not to any specific era boundary.' },
        { id: 'b', text: 'Mesozoic Era, because 130 million years ago falls between the era\'s boundaries of about 252 million and about 66 million years ago.', correct: true },
        { id: 'c', text: 'Paleozoic Era, because 130 million years is a very large number of years, and the Paleozoic is the oldest and longest era.' },
        { id: 'd', text: 'It cannot be placed in any era, because 130 million does not exactly match any of the boundary numbers given, so no era can be confirmed.' },
      ],
      expectedAnswer: 'Mesozoic Era, because 130 million years ago falls between the era\'s boundaries of about 252 million and about 66 million years ago.',
      hints: [
        'Compare the rock\'s age to the era boundary numbers given in the problem, rather than to how large or small 130 million sounds by itself.',
        'The Mesozoic Era runs from about 252 million years ago to about 66 million years ago. Check whether 130 million years ago falls between those two numbers.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-carbon-dating-limits-and-half-life',
      kind: 'misconception_check',
      question:
        'A student claims: "Carbon-14 dating showed that this dinosaur bone is 230 million years old, and after two half-lives all of a sample\'s radioactive atoms are completely gone." Two separate things are wrong here. What are they?',
      commonErrors: [
        {
          answer: 'Carbon-14 dating showed the dinosaur bone is 230 million years old.',
          misconception:
            'Extending carbon-14 past the roughly 50,000-year range where it works, because "radiometric dating" sounds like one single tool that should be able to answer any age question.',
          correctsTo:
            'Carbon-14 becomes unreliable after about 50,000 years, because so little of it is left by then that it cannot be measured accurately. A dinosaur bone this old -- dinosaurs lived in the Mesozoic Era, tens to hundreds of millions of years ago -- needs a method built for much larger spans, such as uranium-lead dating of minerals in nearby igneous rock. Carbon-14 cannot produce a number like 230 million years at all.',
        },
        {
          answer: 'After two half-lives, all of a sample\'s radioactive atoms are completely gone.',
          misconception:
            'Treating half-life like a countdown to zero rather than a repeated halving, because "half is gone, so twice that should finish the job" seems to follow.',
          correctsTo:
            'Half-life means half of whatever is LEFT decays each time, not half of the original amount every time. After 1 half-life, half remains (1/2). After 2 half-lives, half of that half remains (1/4), not zero. The amount keeps shrinking by half, getting smaller and smaller, but it never mathematically reaches exactly zero -- it just eventually gets too small to measure.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Radiometric dating gives an age in YEARS; relative dating (the previous lesson) gives only an ORDER.',
        'A half-life is the fixed time it takes for half of a sample\'s parent atoms to decay into daughter atoms. It never speeds up or slows down.',
        'Multiply the number of half-lives that have passed by the length of one half-life to get an age in years.',
        'Carbon-14 dating (half-life about 5,730 years) works on once-living material and stays reliable up to about 50,000 years.',
        'Uranium-lead dating (half-life about 4.5 billion years) works on minerals in igneous rock and reaches back hundreds of millions to billions of years.',
        'The geologic time scale nests eon, then era, then period. The Phanerozoic Eon (started about 541 million years ago) holds the Paleozoic, Mesozoic and Cenozoic Eras; everything before it is the Precambrian.',
        'Place an age by comparing it to the era boundary numbers, after writing every number out in full so millions are never confused with billions.',
        'This lesson does not explain WHY an atom decays -- that mechanism is Grade 8 physical science.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '5', cedTopic: '5.2', cedTitle: 'Absolute Dating & the Geologic Time Scale' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
