/**
 * Grade 6 ELA — Reading Informational Texts: Central Idea & Text Features:
 * Text Features & How They Aid Understanding.
 *
 * CONCEPT-LED exemplar shape for the m6ela fan-out. The student arrives with
 * no procedure to lean on, so the whole lesson builds one way of reading: a
 * heading, a caption, a sidebar, or a graphic is not decoration, and the
 * right question about any of them is never "what is this called" but "what
 * does this give a reader that the section's own sentences do not" (CCSS
 * RI.6.5). Because every one of these features is VISUAL and the student in
 * a spoken tutoring session cannot see a picture, every feature this file
 * uses is rendered precisely in words inside the item that needs it: a
 * heading is printed as a short label line, a caption is printed as a
 * quoted sentence introduced as a caption, a sidebar is printed as a quoted
 * boxed note introduced as a sidebar, and a graphic is described part by
 * part in prose rather than gestured at. No item asks the student to judge
 * anything about a feature it has not itself printed.
 *
 * SCOPE GUARD: Grade 6 row 3.4 identifies how ONE heading, caption, sidebar,
 * or graphic fits into ONE SECTION of an informational text, and explains
 * what that single feature contributes to a reader's understanding of that
 * one section. DELIBERATELY EXCLUDED: (a) analyzing categories or a
 * hierarchy of features across a WHOLE text — that is RI.7.5, already taught
 * end to end by the shipped `m7ela-u3-text-features-and-graphics.ts`, and it
 * must not appear here; (b) identifying a text's overall organizational
 * pattern (chronological, cause/effect, problem/solution, compare/contrast)
 * — that is row 4.1, `how-a-text-is-organized`, which shares this same
 * RI.6.5 code but works at the scale of a whole text rather than one
 * section; (c) the finding tools a reader uses to navigate a whole book —
 * table of contents, index, glossary — which belong to the Grade 7 file's
 * broader scope and are never named here; (d) determining a central idea or
 * writing a summary (rows 3.1 and 3.2) and determining the meaning of a
 * technical or domain-specific word (row 3.3) — this file never asks a
 * student to state a passage's central idea or define a bolded term.
 * DELIBERATELY ALLOWED, because these neighboring rows sit close: every passage
 * here is a real informational paragraph with a real point, because a
 * feature cannot be shown to aid understanding of a section that has no
 * content to understand — but no item in this file ever asks the student to
 * name that point, only to explain what the printed feature contributes to
 * it.
 *
 * NOTE FOR FUTURE AUTHORS: this course renders no images, and every excerpt
 * in this file is original prose written for the item. There is no passage
 * machinery — no passageId, no shared texts — so every heading, caption,
 * sidebar and diagram a question needs is described fully inside that
 * question's own strings, and every item is solvable from those words
 * alone. No published work is quoted or paraphrased anywhere in this file.
 * Every phrase this file puts inside quotation marks appears character-for-
 * character in the excerpt printed above it; quote your own excerpt
 * exactly, never from memory.
 *
 * CLAIM LEDGER (informational passages):
 *   Claim                                    | Where              | Grounds
 *   An ant presses a scent (a pheromone)     | worked example 1   | Long-settled
 *   onto the ground as it walks, and follows |                    | entomology
 *   its own trail, and other ants from the   |                    | (trail
 *   same nest, back to the nest.             |                    | pheromones).
 *   Some monarch butterflies migrate each    | worked example 2   | Well-documented
 *   fall from as far north as Canada to      |                    | migration
 *   forests in central Mexico, and back      |                    | route; no
 *   again in spring.                         |                    | precise
 *                                             |                    | distance or
 *                                             |                    | date is
 *                                             |                    | stated.
 *   Exactly how one new generation of        | worked example 2   | Genuinely
 *   monarchs finds a wintering ground it     |                    | unresolved
 *   has never visited is hedged as unsettled |                    | in the
 *   ("scientists still are not sure exactly  |                    | science;
 *   how").                                   |                    | hedged in
 *                                             |                    | the passage
 *                                             |                    | itself.
 *   A volcano has an underground magma       | try-yourself 1     | Long-settled
 *   chamber, a vent, and a crater at the     |                    | earth-science
 *   top, and pressure forces magma upward    |                    | definitions.
 *   through the vent and out the crater.     |                    |
 *   Food scraps broken down in a compost     | try-yourself 2     | Long-settled
 *   bin turn into new soil over time; the    |                    | composting
 *   sidebar's amount and timeframe are kept  |                    | chemistry;
 *   qualitative ("about a season's worth",   |                    | no precise
 *   "a few months").                         |                    | figure
 *                                             |                    | invented.
 *   Hexagonal wax cells share walls with     | try-yourself 3     | Long-settled
 *   neighboring cells, which uses less wax   |                    | geometry
 *   than round or square cells would to hold |                    | (proven
 *   the same amount of honey.                |                    | honeycomb
 *                                             |                    | conjecture).
 *   The reason bees settle on the hexagon    | try-yourself 3     | Evolutionary
 *   shape is hedged as a belief ("scientists |                    | causation
 *   believe bees settle on this shape        |                    | hedged
 *   because...").                            |                    | rather than
 *                                             |                    | asserted.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6ELA_U3_TEXT_FEATURES_AND_HOW_THEY_AID_UNDERSTANDING: LessonPlan = {
  id: 'evelyn.ms.m6ela.text-features-and-how-they-aid-understanding.v1',
  title: 'Text Features & How They Aid Understanding',
  curriculum: 'MS',
  grade: '6',
  subject: 'ela',
  topic: 'grade-6-ela',
  locale: 'en',
  los: [
    {
      id: 'm6ela.text-features-and-how-they-aid-understanding',
      standard: 'M6ELA-3.4',
      description:
        'Identify how a heading, caption, sidebar, or graphic fits into one section of an informational text and explain what it contributes to a reader\'s understanding of that section (CCSS RI.6.5).',
    },
  ],
  prerequisites: ['m6ela.technical-and-domain-vocabulary'],
  followUps: ['m6ela.how-a-text-is-organized'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the student feel that they already use text features on purpose, under time pressure, so the lesson only names a move they already own.',
      script:
        'Your science teacher hands out a two-page magazine article about ants for homework, and you have four minutes before your bus arrives. You are not going to read every sentence. Your eyes jump straight to one heading, then to one caption under a photograph, then to one boxed note off to the side, and in under a minute you have the exact fact you needed. Every one of those things you just used — the heading, the caption, the boxed note — is called a text feature, and a writer put each one there on purpose to help a reader exactly like you. Today we work out what job each feature does, and how to explain what it contributes to a reader trying to understand one section of a text.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-text-features-in-one-section',
      kind: 'concept',
      goal: 'Name the four features by the job each performs inside one section, and install the thumb-test for finding what a feature contributes.',
      keyIdeas: [
        'A TEXT FEATURE IS ANY PART OF A SECTION THAT IS NOT THE MAIN PARAGRAPH SENTENCES: a heading above it, a caption under a picture, a sidebar box beside it, or a graphic such as a diagram or a chart. A writer chooses to add each one, so the right question about any of them is never "what is this called" — it is "what does this give me that the paragraph alone does not."',
        'A HEADING NAMES WHAT ITS OWN SECTION COVERS AND SEPARATES IT FROM THE SECTIONS NEXT TO IT. When a page has several sections, each with its own heading, the set of headings lets a reader see how the page is divided before reading a single sentence, and tells a reader which one section to go to for a particular question. A heading is a short label. It does not tell a reader what the section\'s sentences actually say.',
        'A CAPTION ADDS SOMETHING THE PICTURE AND THE PARAGRAPH DO NOT ALREADY GIVE. Sometimes that is a brand-new fact — a place, a date, an amount — that appears nowhere else on the page. Other times a caption makes visible something the paragraph only described in words, so a reader can see the detail rather than only read about it. Either way, a caption earns its place by adding, never by only repeating what the picture already shows.',
        'A SIDEBAR HOLDS A RELATED FACT THAT SITS BESIDE THE MAIN EXPLANATION WITHOUT BREAKING IT. A reader could skip a sidebar and still follow the section\'s main point, but a reader who reads it understands the topic more fully. A sidebar is not proof of anything the main paragraph claims, and it does not attempt to cover every example of the thing it describes.',
        'A GRAPHIC SHOWS A RELATIONSHIP THAT WOULD BE AWKWARD TO WRITE OUT IN SENTENCES. A labeled diagram can show where several parts sit in relation to each other all at once; a paragraph has to describe them one at a time, in order, which makes the same relationship harder to hold in your head. Ask what a graphic lets a reader see in one glance that the paragraph\'s sentences would need several sentences to say.',
        'TO FIND WHAT A FEATURE CONTRIBUTES, COVER IT WITH YOUR THUMB AND REREAD THE SECTION\'S PARAGRAPH ALONE. Whatever is missing from the paragraph but present under your thumb is that feature\'s contribution to this section. If nothing is missing, the feature is not contributing anything new to this particular section, and a real answer has to name the one thing that actually is missing.',
      ],
      vocabulary: [
        { term: 'text feature', definition: 'any part of a section that is not the main paragraph sentences, added on purpose to help a reader find or understand information.' },
        { term: 'heading', definition: 'a short label above a section that names what that section covers.' },
        { term: 'caption', definition: 'a line of text under or beside a picture or graphic that tells a reader something the picture and the paragraph do not already give.' },
        { term: 'sidebar', definition: 'a boxed piece of text set apart from the main paragraph, holding a related fact that adds to the topic without being part of the main explanation.' },
        { term: 'graphic', definition: 'a diagram or chart that shows a relationship, such as where parts sit relative to each other, more compactly than a paragraph could.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-heading-fits-one-section',
      kind: 'worked_example',
      problem:
        'A two-page magazine article about ants has three headings, in this order: "How Ants Build Their Tunnels", "How Ants Find Their Way Home", and "How Ants Warn Each Other of Danger". Here is the paragraph printed under the second heading, "How Ants Find Their Way Home":\n\n"As an ant walks away from the nest, it presses a scent onto the ground with the tip of its body. Scientists call this a pheromone trail. On the way back, the ant follows its own trail by smell, and other ants from the same nest follow it too, which is why a line of ants often marches along the exact same path for hours."\n\nExplain what the heading "How Ants Find Their Way Home" contributes to a reader\'s understanding of this section.',
      steps: [
        'Read all three headings first, before reading any paragraph. They show that the page is split into three separate topics: tunnels, finding the way home, and warning each other of danger.',
        'The heading over this section, "How Ants Find Their Way Home", names exactly which of those three topics belongs in this paragraph. A reader who wants to know how ants navigate can skip the other two sections and come straight here.',
        'Notice what the heading does NOT do. It does not say pheromone, and it says nothing about smell. Reading the heading tells us WHERE the answer lives, not WHAT the answer is.',
        'Now read the paragraph, since we are in the right place: the ant presses a scent, a pheromone, onto the ground on the way out, and follows that same scent back, with other ants from the nest following the same trail.',
        'Put the two together. The heading\'s job here is to sort three related topics into three findable places and let a reader locate the navigation explanation without first reading about tunnels or warning signals.',
      ],
      answer:
        'The heading tells a reader that this section, and only this section, explains how ants find their way — as opposed to how they dig tunnels or warn each other of danger — so a reader who wants that one fact can go straight to it without reading the other two sections. The heading names the topic; it does not state the answer. The actual explanation, that an ant follows its own pheromone trail, is only in the paragraph itself.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-caption-adds-to-one-section',
      kind: 'worked_example',
      problem:
        'A nature magazine\'s section on monarch butterflies includes a photograph, described here in words: a cluster of orange and black butterflies covering a tree branch, so thick that almost no bark shows through.\n\nThe caption printed under the photograph reads: "Monarch butterflies resting in a forest in central Mexico, partway through a fall journey that started as far north as Canada."\n\nThe paragraph beside the photograph reads: "Each fall, some monarch butterflies leave the places where they hatched and fly toward warmer places, then fly back again the following spring. Scientists still are not sure exactly how one new generation of butterflies finds a wintering ground it has never visited before."\n\nWhat does the caption give a reader that neither the photograph nor the paragraph gives, and how does that help the reader understand this section?',
      steps: [
        'List what the photograph alone shows: many orange and black butterflies resting close together on a branch. That is everything a picture can carry — what a camera saw.',
        'List what the paragraph says: some monarchs fly to warmer places in fall and back in spring, and scientists are still not certain how a new generation finds a wintering ground it has never seen.',
        'Now read the caption again: "Monarch butterflies resting in a forest in central Mexico, partway through a fall journey that started as far north as Canada."',
        'Cross off anything the caption shares with the other two. The paragraph already says the butterflies migrate, so the caption is not just repeating that.',
        'What is left is the caption\'s real job here: it pins the paragraph\'s general claim to two specific places, central Mexico and as far north as Canada, which the photograph cannot show and the paragraph never states.',
        'That is the caption\'s contribution to this section: it turns the paragraph\'s vague sense of distant travel into two concrete points, without the reader having to leave the page to find them.',
      ],
      answer:
        'The caption gives two specific place names, central Mexico and as far north as Canada, that pin down the paragraph\'s general claim about migration. The photograph shows only the resting butterflies, and the paragraph states the seasonal pattern but names no particular places, so the caption is the only place on the page those two locations appear.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-graphic-shows-a-relationship',
      kind: 'try_yourself',
      problem:
        'A science magazine\'s section on how a volcano erupts includes a labeled diagram, described here in words: a triangular mountain shape with three labels pointing to three parts, from bottom to top. The first label, "magma chamber", points to a wide pocket underground. The second label, "vent", points to a narrow passage running up through the mountain. The third label, "crater", points to the opening at the very top where material escapes.\n\nThe paragraph beside the diagram reads: "Deep under a volcano, melted rock called magma collects in an underground pocket. When pressure builds, the magma is forced upward through a narrow passage and out through an opening at the top of the mountain."\n\nWhat does the diagram contribute to a reader\'s understanding of this section that the paragraph, on its own, does not make as clear?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'It repeats the same three facts the paragraph already states in its two sentences, so a reader who has already read every word of the paragraph gains nothing new from studying the labels pointing to the magma chamber, the vent, and the crater.' },
        { id: 'b', text: 'It proves that the volcano described in this section is currently active rather than an extinct volcano that could never erupt again, since a magazine would only bother printing a labeled diagram of a mountain that still has the ability to erupt.' },
        { id: 'c', text: 'It tells the reader how many times this particular volcano has erupted in the past and roughly when geologists expect its next eruption to happen, a history the paragraph\'s two sentences never get into at all.' },
        { id: 'd', text: 'It shows, in one glance, exactly where the magma chamber, the vent, and the crater sit relative to each other inside the mountain, which the paragraph\'s two sentences describe one part at a time rather than all together.', correct: true },
      ],
      expectedAnswer:
        'It shows, in one glance, exactly where the magma chamber, the vent, and the crater sit relative to each other inside the mountain, which the paragraph\'s two sentences describe one part at a time rather than all together.',
      hints: [
        'Read the paragraph\'s two sentences and count how many separate parts you have to hold in your head before you can picture where the magma chamber, the vent, and the crater sit relative to each other.',
        'Nothing on this page gives an eruption date, an eruption count, or a judgment about whether the volcano is active or extinct — if a choice claims one of those, this section never actually said it.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-sidebar-adds-beside-the-paragraph',
      kind: 'try_yourself',
      problem:
        'A newsletter article about the school\'s new compost bin has a sidebar next to the main paragraph. The sidebar is boxed off to the side, titled "Quick Fact", and reads: "A single compost bin can turn about a season\'s worth of lunchroom apple cores and banana peels into new soil in a few months."\n\nThe main paragraph beside it reads: "The school built a compost bin behind the cafeteria this fall. Every day, staff scrape uneaten fruit and vegetable scraps from lunch trays into the bin instead of the trash can. Over time, the scraps break down and turn into soil that the garden club spreads on the vegetable beds in spring."\n\nWhat does the sidebar contribute to a reader\'s understanding of this section?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'It adds one extra detail, roughly how much scrap the bin can turn into new soil and about how long that takes, without interrupting the main paragraph\'s step-by-step explanation of how the bin was built and used.', correct: true },
        { id: 'b', text: 'It repeats the main paragraph\'s claim that the scraps break down into soil, only in different words, so a reader who has already read all three of the paragraph\'s sentences does not need to read the boxed sidebar at all.' },
        { id: 'c', text: 'It proves that composting food scraps behind the cafeteria is a healthier and more responsible choice for the school than throwing those same scraps straight into the trash can.' },
        { id: 'd', text: 'It lists every single kind of food scrap that the compost bin behind the cafeteria is able to break down into soil, down to the exact vegetable trimmings the garden club later spreads on the beds each spring.' },
      ],
      expectedAnswer:
        'It adds one extra detail, roughly how much scrap the bin can turn into new soil and about how long that takes, without interrupting the main paragraph\'s step-by-step explanation of how the bin was built and used.',
      hints: [
        'Compare the sidebar\'s one sentence with the main paragraph\'s three sentences, and ask what specific detail — a rough amount, or a rough length of time — shows up only in the sidebar.',
        'The sidebar never lists every kind of scrap and never compares composting to throwing food away, so rule out any choice claiming either of those two things.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-caption-fits-this-section',
      kind: 'try_yourself',
      problem:
        'A section of a nature magazine has the heading "How Worker Bees Build the Hive". The paragraph under that heading reads: "Worker bees build the inside of a hive out of small wax cells shaped like hexagons, each with six flat sides. A hexagon shares its walls with the cells around it, so one shared wall does the job of two separate walls. Scientists believe bees settle on this shape because it uses less wax than a round or a square cell would to hold the same amount of honey."\n\nBelow the paragraph is a close-up photograph, described here in words: a tight grid of six-sided wax cells, each one touching six neighbors with no gaps between them.\n\nThe caption under the photograph reads: "A close-up of honeycomb, showing how each six-sided cell shares its walls with the cells beside it."\n\nWhich choice best explains how this caption fits THIS particular section, rather than being a fact that could belong to any article about bees?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'It fits because bees are insects, and this caption describes a structure that an insect built for itself to live in, the same way any caption about an insect\'s home would fit under a heading about that insect building its hive.' },
        { id: 'b', text: 'It fits because the caption shows the exact wall-sharing arrangement the paragraph says saves wax, making the paragraph\'s claim about the hexagon shape visible instead of only stated in words.', correct: true },
        { id: 'c', text: 'It fits because the caption proves that a hexagon-shaped cell holds more honey than a round or a square cell of the same size would hold, which explains why beekeepers value this particular shape so highly.' },
        { id: 'd', text: 'It fits because any photograph of honeycomb would belong under this heading, no matter what the paragraph beside it happened to say, since a heading about building the hive only needs a picture of the finished result.' },
      ],
      expectedAnswer:
        'It fits because the caption shows the exact wall-sharing arrangement the paragraph says saves wax, making the paragraph\'s claim about the hexagon shape visible instead of only stated in words.',
      hints: [
        'Reread the paragraph\'s claim about why the hexagon shape saves wax, then reread the caption, and ask which exact detail the caption makes visible rather than only stated in words.',
        'The caption never compares how much honey different cell shapes hold, and it names a specific detail from THIS paragraph rather than a fact true of bees in general — rule out any choice that ignores that connection.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-features-are-skippable',
      kind: 'misconception_check',
      question:
        'A student says: "When I read an informational article, I only read the paragraphs. The heading, the caption, and the sidebar are just decoration, so I skip them, and once I have read the heading I already know what the section says." Name what went wrong.',
      commonErrors: [
        {
          answer: 'The heading, caption, and sidebar are decoration, so I only read the paragraphs.',
          misconception:
            'Treating text features as design added by a printer rather than as part of the section that the writer chose to include on purpose.',
          correctsTo:
            'Every feature in a section was placed there by the writer to do a job, and some of them hold information that appears nowhere else on the page. A caption can carry a specific place or amount that the paragraph never states. A sidebar can add a related fact beside the main explanation without interrupting it. Skipping those parts does not save a reader time — it removes information the writer expected the reader to have.',
        },
        {
          answer: 'Once I have read the heading, I already know what the section says.',
          misconception:
            'Reading a heading as a summary of the section instead of as a label that only names its topic.',
          correctsTo:
            'A heading is a short label, kept brief on purpose so a reader can spot it quickly. "How Ants Find Their Way Home" tells a reader that this section is about navigation, not about tunnels or warning signals. It does not say how ants navigate. Use the heading to decide WHERE to read, then read the paragraph itself to learn WHAT it says.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A text feature is any part of a section that is not the main paragraph sentences, and each one is doing a job for the reader inside that one section.',
        'A heading is a label that tells a reader WHERE the answer to a question lives. It does not tell the reader WHAT the paragraph says.',
        'A caption adds something the picture and the paragraph do not already give — a new fact, or a detail the paragraph only described in words, now made visible.',
        'A sidebar adds a related fact beside the main explanation without becoming part of it. A reader could skip it and still follow the section\'s point, but would understand it less fully.',
        'A graphic shows how several parts relate to each other all at once, which a paragraph\'s sentences can only describe one part at a time.',
        'To find what any feature contributes, cover it with your thumb and reread the paragraph alone. Whatever is missing from the paragraph but present under your thumb is that feature\'s contribution.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '3', cedTopic: '3.4', cedTitle: 'Text Features & How They Aid Understanding' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
