/**
 * Grade 6 Science (Earth & Space Science) — Minerals, Rocks & the Rock
 * Cycle: Identifying Minerals by Their Properties.
 *
 * This row installs four testable mineral properties -- hardness (the Mohs
 * scale), streak, luster, and cleavage/fracture -- and the mineral-versus-
 * rock distinction that those properties exist to support. The student has
 * no specimen and no scratch kit, so every test result in this file is a
 * printed observation to reason from, never an instruction to try something.
 * The organizing idea is that color, the property a student trusts first, is
 * also the property that fails first, and every other property in the
 * lesson is introduced partly to replace it.
 *
 * The two traps this plan is built to kill are (a) trusting outward color as
 * if it were a fixed fact about a mineral, when trace impurities can change
 * it while every testable property stays the same, and (b) confusing "one
 * solid piece you can pick up" with "one mineral," when a rock like granite
 * is just as solid and just as much one object while still being a mixture
 * on the inside.
 *
 * SCOPE GUARD: this plan teaches four testable mineral properties --
 * hardness (Mohs scale), streak, luster, and cleavage/fracture -- and the
 * mineral-versus-rock distinction, and nothing past that.
 *   - Neighboring Grade 6 rows: row 3.1 (Earth's layered structure) covers
 *     the crust, mantle, and core by position, thickness, and physical
 *     state, and is not referenced anywhere in this file. Row 3.3 (the three
 *     rock types) classifies rocks by HOW they formed -- igneous,
 *     sedimentary, metamorphic -- which this plan does not attempt; this
 *     plan's own "rock" idea goes no further than "a mixture of minerals
 *     fused together," stated to make the mineral definition make sense by
 *     contrast, and no rock-forming process is named. Row 3.4 (the rock
 *     cycle) is not touched at all.
 *   - GRADE 7 LIFE SCIENCE boundary: no life-science content is in scope for
 *     this row, and none appears -- "living things" is never mentioned.
 *   - GRADE 8 PHYSICAL SCIENCE boundary: this plan states THAT hardness and
 *     breaking pattern are properties a mineral has; it never explains WHY --
 *     keyIdea 6 says outright that the atomic bonding behind hardness and
 *     breakage is Grade 8 chemistry and stops there, and no chemical formula,
 *     element, or compound/mixture-at-the-particle-level claim appears.
 *     Luster is described only as "how a surface reflects light," a bare
 *     descriptive fact with no wave, ray, angle, or brightness treatment,
 *     matching the same bare-fact use of reflected sunlight for the Moon in
 *     row 2.3. Specific gravity and density are not mentioned anywhere in
 *     this file; identification in every item rests on hardness, streak,
 *     luster, and cleavage/fracture only, per this row's own scope line.
 *
 * NOTE FOR FUTURE AUTHORS: there are NO IMAGES in this course. Every
 * specimen, streak result, and breaking pattern in this file is written out
 * in words, and every item is solvable from the text printed inside it.
 * Never write "look at the sample," and never assume the student has a rock
 * kit, a streak plate, or a hardness set in front of them -- every test
 * result a student needs is handed to them as a printed observation.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6SCI_U3_IDENTIFYING_MINERALS_BY_THEIR_PROPERTIES: LessonPlan = {
  id: 'evelyn.ms.m6sci.identifying-minerals-by-their-properties.v1',
  title: 'Identifying Minerals by Their Properties',
  curriculum: 'MS',
  grade: '6',
  subject: 'science',
  topic: 'grade-6-earth-space-science',
  locale: 'en',
  los: [
    {
      id: 'm6sci.identifying-minerals-by-their-properties',
      standard: 'M6SCI-3.2',
      description:
        'Use hardness, streak, luster, and cleavage/fracture to identify a mineral sample, and distinguish a mineral (one substance, defined crystal structure) from a rock (mixture of minerals) (DCI ESS2.A; foundational to Topics 3-4, not named by an MS-ESS PE).',
    },
  ],
  prerequisites: ['m6sci.earths-layered-structure'],
  followUps: ['m6sci.the-three-rock-types'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Use the "fool\'s gold" story to establish that color is the least trustworthy property, before naming any real test.',
      script:
        'Picture finding a shiny, gold-colored rock in a creek bed or along a hiking trail. Real gold is one of the rarest materials on Earth, so for a second you might wonder if you just got lucky. Here is the problem: color is the very first thing your eyes notice about a mineral, and it turns out to be one of the least trustworthy clues a mineral gives you. There is a mineral so good at looking like gold that people have nicknamed it "fool\'s gold" -- more on that name in a minute. Geologists do not decide what a mineral is by staring at its color. They run a short list of tests that do not care what a specimen looks like on the outside. Today you learn that list, so a rock cannot fool you the way it has fooled people for centuries.',
      suggestedTools: ['show_diagram'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-mineral-properties',
      kind: 'concept',
      goal: 'Install hardness, streak, luster, and cleavage/fracture as testable properties, establish the mineral-versus-rock distinction, and flag color as unreliable and bonding as out of scope.',
      keyIdeas: [
        'MINERAL VERSUS ROCK. A mineral is a single natural substance with its own set of properties that stays the same from sample to sample. A rock is a mixture -- usually of two or more different minerals -- fused or stuck together. Granite is a rock: look closely and you can see separate grains of quartz, feldspar, and mica in it, each with its own properties. Quartz by itself, with nothing else mixed in, is a mineral. Everything else in this lesson is about identifying which MINERAL a sample is, using the same testable properties every time.',
        'HARDNESS AND THE MOHS SCALE. Hardness is how well a mineral resists being SCRATCHED, not how hard it is to break. Geologists rank minerals on the Mohs scale, from 1 (talc, soft enough to scratch with a fingernail) to 10 (diamond, hard enough to scratch everything else, with nothing able to scratch it back). A few practical comparisons make the scale usable without a mineral kit: a fingernail is about 2.5, a copper penny is about 3.5, a piece of glass is about 5.5, and a steel file is about 6.5. If a specimen scratches glass, its hardness is above about 5.5. If a fingernail scratches the specimen, its hardness is below about 2.5. Testing hardness always means comparing two objects and asking which one leaves a mark on the other -- the harder one wins and leaves the scratch, and the softer one loses and gets scratched.',
        'STREAK IS MORE TRUSTWORTHY THAN COLOR. Streak is the color of the powder a mineral leaves behind when it is rubbed across a rough, unglazed tile called a streak plate. Streak often does not match a mineral\'s outward color, and that mismatch is exactly why it is useful: a mineral\'s outward color can be changed by thin coatings, weathering, or trace amounts of other material mixed into it, but its streak color stays the same from sample to sample. The classic case is pyrite, a shiny, brassy-gold mineral often mistaken for real gold. Pyrite\'s streak is greenish-black to black. Real gold\'s streak matches its color, a golden yellow. Two minerals that can look almost identical on the outside give completely different answers on a streak plate.',
        'LUSTER. Luster describes how a mineral\'s surface reflects light. METALLIC luster looks shiny like a polished metal surface, the way pyrite does. NONMETALLIC luster covers everything else, including GLASSY (looking like glass, the way quartz does) and DULL or EARTHY (looking flat and chalky with no shine, the way some clay minerals do).',
        'CLEAVAGE AND FRACTURE. These describe HOW a mineral breaks. CLEAVAGE is breaking along smooth, flat surfaces that repeat in the same direction every time. Mica shows this clearly: it peels apart into thin, flat, shiny sheets. Halite, the mineral form of table salt, breaks into small cubes for the same reason. FRACTURE is breaking with no flat, repeating pattern. Quartz does this: instead of splitting along a flat plane, it breaks with curved, shell-shaped surfaces, called a CONCHOIDAL fracture. A mineral shows one or the other, and which one it shows is a property just as identifying as hardness or streak.',
        'WHY A MINERAL BREAKS THE WAY IT DOES, OR RESISTS SCRATCHING THE WAY IT DOES, COMES DOWN TO HOW ITS ATOMS ARE BONDED TOGETHER ON THE INSIDE. This lesson does not go into that -- the bonding itself is Grade 8 chemistry. For now, treat hardness, streak, luster, and cleavage or fracture as four separate, testable properties you use together, the way a detective uses several clues instead of relying on just one.',
      ],
      vocabulary: [
        { term: 'mineral', definition: 'a single natural substance with its own set of properties that stays the same from sample to sample.' },
        { term: 'rock', definition: 'a mixture of two or more minerals fused or stuck together.' },
        { term: 'hardness', definition: 'how well a mineral resists being scratched, ranked on the Mohs scale.' },
        { term: 'streak', definition: 'the color of the powder a mineral leaves on an unglazed streak plate.' },
        { term: 'luster', definition: 'how a mineral\'s surface reflects light, described as metallic or nonmetallic.' },
        { term: 'cleavage', definition: 'breaking along smooth, flat surfaces that repeat in the same direction.' },
        { term: 'fracture', definition: 'breaking with no flat, repeating pattern.' },
      ],
      suggestedTools: ['show_diagram', 'show_table'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-gold-or-pyrite',
      kind: 'worked_example',
      problem:
        'A hiker finds a shiny, brassy-gold mineral sample with a metallic luster. The hiker scratches it against a copper penny and against a piece of window glass -- it scratches both of them. Then the hiker rubs it across a streak plate and gets a greenish-black streak. Is this gold or pyrite?',
      steps: [
        'Start with what the two candidates have in common, so you know which properties will not decide this. Both pyrite and real gold can look shiny and brassy-gold, and both have a metallic luster. Color and luster alone cannot separate them here, so hardness and streak have to do the work.',
        'Check hardness. On the Mohs scale, real gold is about 2.5 to 3 -- close to the hardness of a fingernail and clearly softer than a copper penny, at about 3.5. A genuine gold sample would not scratch a penny, and it would not scratch glass, at about 5.5, either. This specimen scratched both the penny and the glass, so its hardness is well above gold\'s. Pyrite, on the other hand, is about 6 to 6.5 on the Mohs scale -- hard enough to scratch glass easily. The hardness result points to pyrite.',
        'Check streak. WRONG: "It looks gold, so its streak should be golden-yellow too." CORRECT: "A mineral\'s streak does not have to match its outward color, and pyrite is the reason this rule matters." Real gold\'s streak matches its color, a golden yellow, because gold is a soft, pure metal that smears onto the plate close to unchanged. Pyrite\'s streak is greenish-black to black, even though pyrite itself looks golden. This specimen left a greenish-black streak, which matches pyrite and rules out gold.',
        'Add one more kind of clue, a reasoning check rather than a test: real gold is extremely rare, while pyrite is one of the most common minerals on Earth and is very often found looking exactly like this. A shiny gold-colored rock turning up on an ordinary hike is far more likely to be the common mineral that mimics gold than to be the rare one.',
        'Now put the three clues together, because they are three different KINDS of evidence, not three copies of the same one: a hardness test, a streak test, and a reasoning check about which mineral is more likely to turn up at all. All three point the same way.',
        'Change one condition and check that the answer moves with it. Suppose the specimen had NOT scratched the penny, a fingernail alone had been enough to mark it, and its streak had come out golden-yellow instead of greenish-black. Every one of those results now matches real gold instead of pyrite, so the conclusion would flip. The test is not whether you land on the same answer -- it is whether the answer changes when the evidence changes.',
      ],
      answer:
        'Pyrite, not gold -- which is exactly why pyrite has earned the nickname "fool\'s gold." Its hardness (scratches glass) and its streak (greenish-black, not golden) both point away from real gold, and pyrite is also the far more common of the two minerals to find.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-mineral-or-rock',
      kind: 'worked_example',
      problem:
        'A geology teacher hands a student two samples. Sample 1 is uniform all the way through: every part of it has the same glassy luster, the same light color, and it breaks with curved, shell-shaped surfaces with no flat plane anywhere. Sample 2 is speckled: it has small pink grains with a glassy luster, black flaky grains that peel into thin sheets, and gray grains with a dull surface, all fused together. Which sample is a mineral and which is a rock, and how can the student tell?',
      steps: [
        'Start with the definition, not the appearance. A mineral is one substance with one set of properties all the way through. A rock is a mixture of two or more minerals fused together, and that mixture usually shows up as visibly different grains.',
        'Look at Sample 1 first. Every part of it shares the same luster (glassy), the same color, and the same breaking pattern (curved, shell-shaped surfaces, which is a fracture, not a cleavage, since there is no flat repeating plane anywhere). One set of properties, all the way through -- that is the signature of a single mineral.',
        'Now look at Sample 2. It has three visibly different kinds of grains, each with its own properties: pink grains with a glassy luster, black grains that peel into thin flat sheets (cleavage), and gray grains with a dull surface. Three different sets of properties in one sample means three different minerals are mixed together in it. That mixture is what makes Sample 2 a rock, not a mineral.',
        'WRONG: "Sample 2 must be a mineral, because it is a single solid piece you can pick up in one hand." CORRECT: "Being one solid piece has nothing to do with being one mineral. What matters is whether the properties are the same throughout the sample or whether they change from grain to grain." A rock like Sample 2 is just as solid and just as much one object as a mineral is -- the difference is on the inside, not whether it holds together.',
        'Run the three-different-kinds check. Composition says Sample 1 is uniform and Sample 2 has three distinct grain types. Breaking pattern says Sample 1 fractures the same way everywhere, while Sample 2\'s grains break differently from each other. And the definition itself -- a mineral is one substance, a rock is a mixture -- agrees with both of those observations. Three different kinds of evidence, one conclusion.',
        'Change one condition and check that the answer moves. Suppose the black flaky grains in Sample 2 were removed, leaving only the pink and gray grains fused together -- it would still be a rock, because it would still be more than one mineral mixed together, just two instead of three. Now suppose instead that Sample 2 turned out, on closer inspection, to have the same glassy luster and pink color everywhere, with no black or gray grains at all -- at that point it would no longer show a mixture, and the correct call would flip to a single mineral.',
      ],
      answer:
        'Sample 1 is a mineral -- one substance with the same luster, color, and fracture throughout. Sample 2 is a rock -- a mixture of at least three different minerals, each keeping its own luster and breaking pattern, fused together into one sample.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-hardness-bracket',
      kind: 'try_yourself',
      problem:
        'A mineral sample resists being scratched by a fingernail, but a steel file does scratch it. Using the practical hardness comparisons from the lesson (fingernail about 2.5, glass about 5.5, steel file about 6.5 on the Mohs scale), what can you conclude about the specimen\'s hardness?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Its hardness is above 6.5, because a tool hard enough to leave a scratch must itself be at least as hard as the specimen it scratches.' },
        { id: 'b', text: 'Its hardness is somewhere above about 2.5 and below about 6.5 on the Mohs scale, because it resisted the softer fingernail but was scratched by the harder file.', correct: true },
        { id: 'c', text: 'Its hardness is below 2.5, because getting scratched by any object at all means a mineral belongs among the softest ones on the Mohs scale, regardless of the tool used.' },
        { id: 'd', text: 'It is impossible to say anything about the specimen\'s hardness from these two scratch tests without comparing it against every reference object on the Mohs scale.' },
      ],
      expectedAnswer:
        'Its hardness is somewhere above about 2.5 and below about 6.5 on the Mohs scale, because it resisted the softer fingernail but was scratched by the harder file.',
      hints: [
        'In a scratch test, the harder object is the one that leaves the mark, and the softer object is the one that gets marked. Figure out, for each test, which object in the pair was harder.',
        'You have two separate results here, not one: a comparison against a fingernail and a comparison against a file. Use both of them together to bracket the hardness between two values, rather than picking just one comparison to trust.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-streak-reliability',
      kind: 'try_yourself',
      problem:
        'Hematite can look shiny black, dull gray, or dull reddish-brown depending on the sample, but every sample of it leaves the same reddish-brown streak on a streak plate. Why do geologists trust the streak test more than the sample\'s outward color when identifying a mineral like hematite?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Because streak testing changes the mineral into its true color, so every sample would then look reddish-brown on the outside too, matching the color of the streak.' },
        { id: 'b', text: 'Because the outward color always matches the streak color for metallic-looking minerals, so checking either property gives a geologist the same answer either way.' },
        { id: 'c', text: 'Because the outward color of a hematite sample can differ from sample to sample, while the streak color stays the same reddish-brown, making streak the more consistent property to check.', correct: true },
        { id: 'd', text: 'Because streak testing only works on minerals with a dull, nonmetallic luster, so it would tell a geologist nothing useful about identifying a specimen that had a shiny, metallic surface instead, the way pyrite does.' },
      ],
      expectedAnswer:
        'Because the outward color of a hematite sample can differ from sample to sample, while the streak color stays the same reddish-brown, making streak the more consistent property to check.',
      hints: [
        'Look at what stays the same across every hematite sample versus what changes from sample to sample.',
        'A property is useful for identifying a mineral when it does not change between different pieces of the same mineral. Ask which property that is here: the outward color, or the streak.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-cleavage-vs-fracture',
      kind: 'try_yourself',
      problem:
        'A student is given two specimens. Specimen A breaks into thin, flat, shiny sheets that peel apart easily, always along the same smooth flat surface. Specimen B breaks unevenly, leaving curved, shell-shaped surfaces with no flat repeating pattern anywhere. Which property distinguishes these two specimens, and how would a geologist describe each one?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Hardness -- Specimen A is harder than Specimen B, because breaking into more separate thin pieces under the same amount of force is usually a sign of higher hardness on the Mohs scale.' },
        { id: 'b', text: 'Luster -- Specimen A has a metallic luster and Specimen B has a nonmetallic luster, based on the shiny sheets Specimen A peels into compared with the duller, less reflective surfaces Specimen B leaves behind.' },
        { id: 'c', text: 'Streak -- Specimen A would leave a lighter-colored streak than Specimen B, because breaking into thin, flat pieces produces a finer and paler powder on a streak plate.' },
        { id: 'd', text: 'Cleavage and fracture -- Specimen A shows cleavage, because it breaks along smooth, flat, repeating surfaces, and Specimen B shows fracture, because it breaks unevenly with no flat repeating pattern.', correct: true },
      ],
      expectedAnswer:
        'Cleavage and fracture -- Specimen A shows cleavage, because it breaks along smooth, flat, repeating surfaces, and Specimen B shows fracture, because it breaks unevenly with no flat repeating pattern.',
      hints: [
        'This question is about HOW a mineral breaks, not about how hard it is to scratch or what color powder it leaves behind. Two different breaking patterns are being compared.',
        'One specimen breaks along the same smooth, flat surface every time -- that repeating flat surface has a specific name. The other breaks with no flat pattern at all, which is a different named property.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-color-and-solidity',
      kind: 'misconception_check',
      question:
        'A student picks up a chunk of granite from a driveway and says, "This must be a mineral -- it is one solid rock and it is really hard." The same student later says, "And these purple and clear crystals I found are two different minerals, since they are not the same color." What is wrong with each statement?',
      commonErrors: [
        {
          answer: 'Granite must be a mineral because it is one solid, hard piece.',
          misconception:
            'Assuming that being one solid object, or being hard, is what makes something a single mineral -- confusing solidity and hardness with having one uniform composition throughout.',
          correctsTo:
            'Granite is a rock, not a mineral, because it is a mixture of different minerals -- typically visible grains of quartz, feldspar, and mica -- fused together. Being one solid piece just means it holds together; it says nothing about whether the inside is uniform. A mineral is identified by having the SAME properties, such as hardness, streak, luster, and cleavage or fracture, all the way through a sample. Granite fails that test the moment you look closely enough to see its different-colored grains.',
        },
        {
          answer: 'The purple and clear crystals must be two different minerals because they are different colors.',
          misconception:
            'Trusting color as the deciding property, because color is the most obvious difference to the eye.',
          correctsTo:
            'Color is the least reliable property a mineral has, because trace amounts of other material mixed into a mineral can tint it without changing anything else about it. Quartz is the clearest example: it can be colorless, purple (called amethyst), or pink (called rose quartz), all while sharing the exact same hardness, streak, luster, and fracture. Two samples are only different minerals if their TESTABLE properties differ, not their color alone.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A mineral is one substance with the same properties throughout. A rock, like granite, is a mixture of two or more minerals fused together.',
        'Hardness is resistance to being scratched, ranked on the Mohs scale from 1 (talc) to 10 (diamond). A fingernail is about 2.5, a penny is about 3.5, glass is about 5.5, and a steel file is about 6.5.',
        'Streak is the color of a mineral\'s powder on a streak plate, and it is more reliable than surface color because it does not change from sample to sample the way outward color can.',
        'Pyrite ("fool\'s gold") looks golden but streaks greenish-black; real gold\'s streak matches its golden color. Hardness also separates them: gold is soft, about 2.5 to 3, and pyrite is hard enough to scratch glass, about 6 to 6.5.',
        'Luster describes how a surface reflects light: metallic (shiny like polished metal) or nonmetallic (including glassy and dull or earthy).',
        'Cleavage is breaking along smooth, flat, repeating surfaces, like mica peeling into sheets or halite breaking into cubes. Fracture is breaking with no flat repeating pattern, like quartz\'s curved, shell-shaped break.',
        'Color is the least reliable property, because trace impurities can tint the same mineral different colors without changing anything else about it -- quartz can be colorless, purple, or pink and still be the same mineral.',
        'Identifying a mineral means combining several of these testable properties together, never relying on just one -- especially not color.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '3', cedTopic: '3.2', cedTitle: 'Identifying Minerals by Their Properties' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
