/**
 * Grade 7 Science — Unit 3 CED 3.1: Cells to Tissues to Organs to Systems.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m7sci.levels-of-organization.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M7SCI_U3_LEVELS_OF_ORGANIZATION: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m7sci.levels-of-organization.v1',
  course: 'Grade 7 Science',
  cedUnit: 3,
  cedTopic: '3.1',
  cedTitle: 'Cells to Tissues to Organs to Systems',
  planId: 'evelyn.ms.m7sci.levels-of-organization.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-21',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m7sci.levels-of-organization.v1' }],
  theory: [
    { loId: 'm7sci.levels-of-organization', kind: 'framework', title: 'The ladder, smallest to largest', content: `THE LADDER, SMALLEST TO LARGEST — CELLS make up TISSUES, tissues make up ORGANS, organs make up ORGAN SYSTEMS, and organ systems make up the whole ORGANISM. Each level is built out of the level below it. Learn the order once, and then spend your effort on what each level actually means, because that is where the questions live.` },
    { loId: 'm7sci.levels-of-organization', kind: 'framework', title: 'A tissue is similar cells doing one shared job', content: `A TISSUE IS SIMILAR CELLS DOING ONE SHARED JOB — not any handful of cells that happen to be near each other. Muscle tissue is many muscle cells that all shorten to pull. Nervous tissue is many nerve cells that all carry signals. WRONG: "A tissue is a group of cells." CORRECT: "A tissue is a group of SIMILAR cells that work together on the same job." The word similar is doing all the work in that sentence.` },
    { loId: 'm7sci.levels-of-organization', kind: 'framework', title: 'An organ is different tissues working together', content: `AN ORGAN IS DIFFERENT TISSUES WORKING TOGETHER — that is the jump from the level below. The heart is an organ, and it contains muscle tissue that squeezes, nervous tissue that carries the signals which speed the beat up or slow it down, and connective tissue that holds the whole thing together. The stomach is an organ too: muscle tissue churns the food while the tissue lining the inside releases the juices that break the food down. One kind of tissue is a tissue. Several kinds built into one structure with one big job is an organ.` },
    { loId: 'm7sci.levels-of-organization', kind: 'framework', title: 'An organ system is organs working together', content: `AN ORGAN SYSTEM IS ORGANS WORKING TOGETHER — the circulatory system is the heart plus the blood vessels plus the blood, and it moves materials around the body. The digestive system is the mouth, the stomach, the small intestine and more, and it breaks food down into pieces small enough to enter the blood. All the organ systems together make one ORGANISM, which is one complete living thing.` },
    { loId: 'm7sci.levels-of-organization', kind: 'framework', title: 'The levels depend on each other, and that is the real point', content: `THE LEVELS DEPEND ON EACH OTHER, AND THAT IS THE REAL POINT — a body is a system made of smaller systems that interact. Nothing works alone. Your muscle cells cannot get oxygen unless the circulatory system delivers it, and the circulatory system has no oxygen to deliver unless the respiratory system takes air in. So a problem at a low level does not stay at that level. Damage a tissue and you have damaged an organ; weaken an organ and the whole system it belongs to does less; weaken a system and the entire organism feels it.` },
    { loId: 'm7sci.levels-of-organization', kind: 'framework', title: 'Two traps worth naming now', content: `TWO TRAPS WORTH NAMING NOW — first, LEVEL IS ABOUT ORGANIZATION, NOT SIZE. A large single cell, like a bird egg cell, is still just a cell, and a tiny scrap of muscle is still a tissue. Bigger does not mean higher up the ladder. Second, SYSTEMS OVERLAP. One organ can belong to more than one system: the pancreas releases juices that help digest food, which makes it part of the digestive system, and it also releases hormones into the blood that control blood sugar, which places it in the endocrine system, the hormone system, as well. The systems are names we use to describe the body, not walls inside it.` },
    { loId: 'm7sci.levels-of-organization', kind: 'definition', title: 'tissue', content: 'a group of similar cells that work together to carry out the same job.' },
    { loId: 'm7sci.levels-of-organization', kind: 'definition', title: 'organ', content: `a structure made of two or more different tissues that work together to do one main job.` },
    { loId: 'm7sci.levels-of-organization', kind: 'definition', title: 'organ system', content: 'a group of organs that work together to carry out a large task for the body.' },
    { loId: 'm7sci.levels-of-organization', kind: 'definition', title: 'organism', content: 'one complete living thing, made of all of its organ systems working together.' },
    { loId: 'm7sci.levels-of-organization', kind: 'definition', title: 'level of organization', content: `one step in the order cell, tissue, organ, organ system, organism, where each step is built from the step below it.` },
  ],
  methods: [
    {
      title: 'Worked sort the heart',
      steps: [
        `Start with the muscle tissue. Ask the tissue question: is this many SIMILAR cells doing one shared job? Yes, muscle tissue is many muscle cells that all shorten to pull. So the muscle tissue sits at the TISSUE level.`,
        `Now the heart. Ask the organ question: are there DIFFERENT kinds of tissue built into one structure with one main job? Yes, three different kinds are listed, and together they do one job, which is pushing blood forward. So the heart is an ORGAN.`,
        `A quick check on that reasoning. If the heart were made of muscle tissue and nothing else, it would just be a lump of muscle tissue. It is the combination of different tissues in one structure that makes something an organ.`,
        `Now the heart plus the vessels plus the blood. These are separate parts working together on one large task, moving materials around the body. That is the ORGAN SYSTEM level, and this particular one is the circulatory system.`,
        `One extra fact that catches students out: blood is counted as a tissue, even though it is a liquid. It is a group of similar cells carried in fluid, doing a shared job. The definition never mentioned being solid.`,
        `Finish by walking the ladder in order to check nothing was skipped: muscle cell, then muscle tissue, then the heart, then the circulatory system, then the whole person. Every step is built out of the step before it.`,
      ],
      example: { problem: `A student is told three things about the heart. It is built from muscle tissue, nervous tissue and connective tissue. It squeezes to push blood forward. It works alongside the blood vessels and the blood to move materials around the body. Name the level of organization of (1) the muscle tissue in it, (2) the heart itself, and (3) the heart together with the blood vessels and the blood.`, solution: `The muscle tissue is at the tissue level. The heart is an organ, because different tissues are built into one structure with one main job. The heart together with the blood vessels and the blood is an organ system, the circulatory system.` },
      relatedLoIds: ['m7sci.levels-of-organization'],
    },
    {
      title: 'Worked trace a failure upward',
      steps: [
        `Start at the level where the trouble is. Weak muscle tissue means the cells of that tissue pull with less force. That is the TISSUE level.`,
        `Step up to the ORGAN. The heart is built from that muscle tissue, so a weaker squeeze means less blood is pushed out with each beat. The heart is not a separate thing from its tissues, so damaged tissue is a damaged organ.`,
        `Step up to the ORGAN SYSTEM. The circulatory system depends on the heart to move blood through the vessels. Less blood moving means the system delivers less oxygen and fewer nutrients to the cells of the body, and carries away waste more slowly.`,
        `Step sideways for a moment, because systems interact. Body cells need oxygen to release the energy stored in food. If oxygen arrives more slowly, cells release energy more slowly. The respiratory system responds by taking in air faster, which is why breathing gets quick and shallow after very little effort.`,
        `Step up to the whole ORGANISM. The person feels tired and out of breath climbing the same stairs that were easy last year. That symptom began in a tissue, several levels down.`,
        `WRONG way to describe this: "Only the heart is affected, because the other organs are fine." CORRECT way: "The heart is a subsystem of the body, so when it does less every system that depends on the blood it moves does less too." Nothing in the body chose to slow down. Each part simply had less of what it needed.`,
      ],
      example: { problem: `A woman has weak heart muscle tissue, so her heart cannot squeeze as hard as it used to. Every other part of her body starts out healthy. Trace what happens at the organ level, at the system level, and for the whole person.`, solution: `Weak muscle tissue means the heart, an organ, pushes out less blood per beat. The circulatory system then delivers less oxygen and fewer nutrients to cells and removes waste more slowly, so cells release energy from food more slowly and the respiratory system works harder. The whole person tires quickly and gets out of breath. A change at the tissue level traveled all the way up.` },
      relatedLoIds: ['m7sci.levels-of-organization'],
    },
  ],
  pointers: [
    { content: `Students often say "Each organ works independently, so a problem with one organ stays with that organ." — The body is a system made of smaller systems that interact, and the jobs are linked in a chain. The lungs take oxygen into the blood, but that oxygen goes nowhere unless the heart moves the blood. The stomach breaks food down, but the pieces feed the body only after the blood carries them to the cells. So when the heart pushes out less blood, muscle cells all over the body receive less oxygen and less food, and the person tires quickly even though the muscles themselves are healthy. State it as a chain, not as a list: this organ supplies that system, which supplies those cells.`, kind: 'common-error' },
    { content: `Students often say "The bigger a structure is, the higher its level of organization, and each organ belongs to exactly one system." — Level describes how something is ORGANIZED, not how big it is. A bird egg cell is large and is still a single cell; a scrap of muscle far smaller than that egg is still a tissue, because it is many similar cells doing a shared job. And systems overlap. The pancreas releases juices that help digest food, which puts it in the digestive system, and it also releases hormones into the blood that control blood sugar, which puts it in the endocrine (hormone) system too. Organ systems are useful names for describing the body, not walls built inside it.`, kind: 'common-error' },
    { content: `The order, smallest to largest: cell, tissue, organ, organ system, organism. Each level is built out of the level below it.`, kind: 'tip' },
    { content: `A tissue is SIMILAR cells doing one shared job -- muscle tissue, nervous tissue. Not just any group of cells.`, kind: 'tip' },
    { content: `An organ is DIFFERENT tissues built into one structure with one main job -- the heart holds muscle, nervous and connective tissue.`, kind: 'tip' },
    { content: `An organ system is organs working together -- the circulatory system is the heart, the vessels and the blood; the digestive system is the mouth, stomach, small intestine and more.`, kind: 'tip' },
    { content: `The real idea behind this lesson: the body is a system of interacting subsystems, so a failure at one level shows up at every level above it. Weak heart muscle tissue ends as a person out of breath on the stairs.`, kind: 'tip' },
    { content: `Level means organization, not size: a large egg cell is still one cell. And systems overlap -- the pancreas serves both the digestive system and the endocrine system.`, kind: 'tip' },
    { content: `Don't define a tissue as "a group of cells." Say **similar** cells doing the **same job**. A random handful of cells sitting next to each other (muscle + nerve + connective) is not a tissue — that combination is already an organ.`, kind: 'vocab-note' },
    { content: `Level = organization, not size. A bird's egg cell is huge and still just **one cell**. A crumb of muscle smaller than that egg is still a **tissue**. Never rank things up the ladder because they look bigger.`, kind: 'gotcha' },
    { content: `Blood counts as a **tissue**, even though it's a liquid. It's similar cells carried in fluid doing one shared job. Nothing in the definition of tissue says "solid."`, kind: 'edge-case' },
    { content: `One organ can belong to two systems. The pancreas makes digestive juices (digestive system) **and** hormones that control blood sugar (endocrine system). System names are labels we use, not walls inside the body.`, kind: 'edge-case' },
    { content: `When a tissue is damaged, don't write "only that part is affected." The organ IS its tissues, so damaged tissue = damaged organ. Trace it up: tissue → organ → system → whole person.`, kind: 'common-error' },
    { content: `Answer these as a **chain**, not a list. Weak heart muscle → heart pushes less blood → circulatory system delivers less oxygen → cells release energy slower → person is out of breath. Each arrow must be there.`, kind: 'tip' },
    { content: `Check yourself: to name a level, ask "what is this built out of?" Similar cells → tissue. Different tissues in one structure → organ. Several organs on one big task → organ system.`, kind: 'tip' },
    { content: `Body parts don't "decide" to slow down. Say cells got **less oxygen**, not that the body "chose to rest" or "gave up." Describe supply and demand, not intentions.`, kind: 'common-error' },
  ],
};
