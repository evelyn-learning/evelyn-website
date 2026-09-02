/**
 * Grade 6 ELA — Reading Informational Texts: Central Idea & Text Features:
 * Central Idea & Supporting Details.
 *
 * CONCEPT-LED fan-out row for m6ela. The student arrives with no procedure to
 * lean on, so the whole lesson builds one way of reading nonfiction: a
 * CENTRAL IDEA is a full sentence stating the main point an informational
 * text makes about its topic, and a SUPPORTING DETAIL is a specific fact that
 * helps prove that sentence true (CCSS RI.6.2). This is the informational
 * counterpart to row 2.1's literary theme, and it is built to read
 * differently on purpose: theme asks what a story's details show about
 * people in general, while central idea asks what an informational text's
 * facts add up to about its own real topic. Three traps this plan is built to
 * kill: naming a one-word TOPIC and calling it a central idea, promoting one
 * true supporting detail to the rank of the whole central idea because it is
 * the most interesting one, and letting a detail that is true but off-topic
 * stand in as if it supported an idea it never actually touches.
 *
 * SCOPE GUARD: Grade 6 row 3.1 determines the ONE central idea of an
 * informational text from its particular details, and identifies which of
 * those details actually support that central idea. DELIBERATELY EXCLUDED:
 * analyzing two or more central ideas, or tracing how a central idea develops
 * across a text — that is RI.7.2, owned by Grade 7 Unit 3, and no item or
 * worked example in this file ever asks the student to compare, rank or
 * develop more than one central idea; every passage here states exactly one.
 * Also excluded: writing an objective summary of the text (row 3.2 owns
 * that; this file never asks the student to produce a summary, only to
 * choose or check a central idea and its supporting details); naming
 * technical or domain-specific vocabulary as its own skill (row 3.3); and
 * analyzing how text features or a whole text's organization aid
 * understanding (rows 3.4 and 4.1 own that; this file never asks the student
 * to name a heading, caption or organizational pattern). Also excluded: the
 * THEME of a literary or narrative text (row 2.1), which states a message
 * about people inferred from story details — every excerpt in this file is
 * informational nonfiction, and none of the items or worked examples asks
 * what a character wants or how a character changes. DELIBERATELY ALLOWED,
 * because two neighboring rows sit close: (a) row 3.2 also uses the phrase
 * "central idea," since RI.6.2 covers identifying it (this row) and
 * reporting it inside a summary (row 3.2) as two stages of one standard;
 * sharing that vocabulary is intentional and does not mean this lesson
 * teaches summarizing. (b) rows 3.4 and 4.1 sit close because both work with
 * an informational text's structure, but naming which detail supports a
 * stated central idea is a different skill from naming a text feature or an
 * organizational pattern, and this file does neither of the latter.
 *
 * NOTE FOR FUTURE AUTHORS: every excerpt in this file is original prose
 * written for the item. This course carries no passage machinery — no
 * passageId, no shared texts — so each question must be solvable from the
 * sentences printed inside it, and no published work may be quoted or
 * closely paraphrased. Every phrase this file puts inside quotation marks
 * appears character-for-character in the excerpt printed above it; quote
 * your own excerpt exactly, never from memory. Every factual claim about the
 * real world in this file (earthworms, owls, bats, sea turtles, honey,
 * library lending programs) is true as stated and carries no invented
 * precise statistic.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6ELA_U3_CENTRAL_IDEA_AND_SUPPORTING_DETAILS: LessonPlan = {
  id: 'evelyn.ms.m6ela.central-idea-and-supporting-details.v1',
  title: 'Central Idea & Supporting Details',
  curriculum: 'MS',
  grade: '6',
  subject: 'ela',
  topic: 'grade-6-ela',
  locale: 'en',
  los: [
    {
      id: 'm6ela.central-idea-and-supporting-details',
      standard: 'M6ELA-3.1',
      description:
        'Determine a text\'s central idea and identify the particular details that convey it, stopping short of analyzing two or more central ideas and how they develop across a text (CCSS RI.6.2; that fuller analysis is RI.7.2).',
    },
  ],
  prerequisites: ['m6ela.word-choice-and-tone'],
  followUps: ['m6ela.summarizing-informational-text'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the student feel the gap between a raw pile of facts, a one-word topic, and the one sentence that ties an informational text together.',
      script:
        'A classmate forwards you five separate texts about Friday\'s field trip: the bus leaves at eight, bring a bagged lunch, the permission slip is due Wednesday, it might rain so bring a jacket, and everyone meets in the gym instead of the parking lot. Your little sister asks what the messages were about. If you answer "the field trip," that is true, and it tells her almost nothing about what she actually needs to do. If you read her all five texts word for word, she still has to do the sorting herself. What she actually needs is one sentence that ties the five facts together: everything about how Friday\'s trip starts has changed, so pay attention before then. That one sentence is called a central idea, and the five texts underneath it are called supporting details. Today we learn how to build that one sentence out of an informational text\'s facts, and how to tell which facts actually back it up.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-central-idea-and-supporting-details',
      kind: 'concept',
      goal: 'Separate topic from central idea, install the build-it-from-details method, and define what makes a detail actually supporting rather than off-topic.',
      keyIdeas: [
        'A TOPIC IS A WORD OR A SHORT PHRASE. A CENTRAL IDEA IS A WHOLE SENTENCE. Earthworms, sea turtles and public libraries are topics. They name what an informational text is about, and they make no claim about it. A central idea states the main point the text makes about that topic: "Earthworms make soil healthier in more than one way." If your answer to "what is the central idea" fits in one or two words, you have named the topic and stopped early.',
        'BUILD THE CENTRAL IDEA FROM WHAT EVERY PART OF THE TEXT ADDS UP TO, NOT FROM ONE SENTENCE ALONE. Ask what fact or idea the text keeps returning to, and what point it makes about that thing across the whole text, not just its first sentence. A central idea has to be broad enough to cover every paragraph, not narrow enough to fit only one of them.',
        'A SUPPORTING DETAIL IS A SPECIFIC FACT THAT LETS YOU ANSWER "HOW DO YOU KNOW THAT IS TRUE." Each supporting detail should connect back to the central idea and help prove it. A detail that is interesting and true, but does not connect to the stated central idea, is off topic, even when it appears in the very same paragraph.',
        'A SINGLE SUPPORTING DETAIL IS NOT A CENTRAL IDEA, EVEN WHEN IT IS THE MOST INTERESTING ONE. If your sentence describes only one fact from the text and leaves the others unexplained, you have picked a detail instead of the idea that ties every detail together.',
        'TEST YOUR CENTRAL IDEA AGAINST TWO SEPARATE DETAILS. Say the sentence, then point at two different facts in the text that support it. If you can only find one, or none, you have a guess, and if a detail in the text contradicts your sentence, the sentence is wrong, not the detail.',
      ],
      vocabulary: [
        { term: 'topic', definition: 'the subject an informational text is about, named in a word or short phrase, such as earthworms or the water cycle.' },
        { term: 'central idea', definition: 'the one sentence stating the main point a text makes about its topic, supported by the whole text.' },
        { term: 'supporting detail', definition: 'a specific fact, example or explanation from the text that helps prove the central idea is true.' },
        { term: 'informational text', definition: 'a text written to explain, describe or give facts about a real subject, rather than tell a story.' },
        { term: 'off topic', definition: 'true and printed in the text, but not connected to the central idea being discussed.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-build-a-central-idea',
      kind: 'worked_example',
      problem:
        'Read this paragraph about earthworms, then state its central idea and support it with two details.\n\n"Earthworms spend most of their lives tunneling through soil. As they move, their tunnels let air and water reach plant roots that would otherwise sit in packed, dry dirt. Earthworms also eat dead leaves and other rotting plant matter, then release it from their bodies as castings full of nutrients. Farmers and gardeners often count the number of earthworms in a patch of soil to get a quick sense of how healthy that soil is."',
      steps: [
        'Name the topic first, in a word or short phrase. This paragraph keeps circling earthworms and soil. That is the subject, not the central idea, because it makes no claim about anything.',
        'Ask what fact the paragraph returns to about that topic across every sentence, not just the first one. Sentence two says the tunnels "let air and water reach plant roots." Sentence three says eating rotten matter lets earthworms "release it from their bodies as castings full of nutrients."',
        'Ask what those two facts add up to. Tunnels bring air and water to the soil, and castings bring nutrients to the soil. Both are ways the soil becomes healthier because earthworms are living in it.',
        'Write one sentence that covers both facts, not just one of them: "Earthworms make soil healthier in more than one way, by loosening it and by adding nutrients to it."',
        'Run the two-detail test. Detail one: their tunnels "let air and water reach plant roots." Detail two: their castings are "full of nutrients." Two separate places in the paragraph, both supporting the same sentence. The central idea holds.',
        'Check the last sentence too. It says farmers count earthworms "to get a quick sense of how healthy that soil is," which only makes sense if earthworms are already doing something to make soil healthier. That sentence supports the central idea instead of adding a new one.',
      ],
      answer:
        'Central idea: earthworms make soil healthier in more than one way, by loosening it and by adding nutrients to it. Evidence: their tunnels "let air and water reach plant roots," and their castings are "full of nutrients."',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-find-the-detail-that-does-not-belong',
      kind: 'worked_example',
      problem:
        'Read the paragraph, the central idea already written below it, and a classmate\'s list of three details meant to support that idea. One of the three does not actually support it. Find the one that does not belong.\n\n"An owl cannot roll its eyes to look sideways the way a person can, because an owl\'s eyes are fixed in their sockets. Instead, an owl\'s neck contains many more bones than a human neck, arranged so the owl can turn its head far around without cutting off the blood flow to its brain. An owl also blinks using three different eyelids: one for regular blinking, one for use while sleeping, and one for keeping the eye clean."\n\nCentral idea: An owl\'s neck is built to do a job its eyes cannot do on their own — letting it watch its surroundings without turning its whole body.\n\nClassmate\'s three details:\n1. An owl\'s eyes cannot roll sideways because they are fixed in their sockets.\n2. An owl\'s neck has many more bones than a human\'s, arranged to turn far without cutting off blood flow to the brain.\n3. An owl blinks using three different eyelids, each with its own job.',
      steps: [
        'Check each detail against the central idea one at a time. Ask: does this fact explain why the owl\'s neck matters for looking around, or is it about something else?',
        'Detail one restates the paragraph\'s first sentence: "An owl cannot roll its eyes to look sideways the way a person can, because an owl\'s eyes are fixed in their sockets." That explains why the neck has to do so much work in the first place, so it connects directly to the central idea.',
        'Detail two restates the paragraph\'s second sentence: "an owl\'s neck contains many more bones than a human neck, arranged so the owl can turn its head far around without cutting off the blood flow to its brain." That describes the neck doing exactly the job the central idea names, so it also connects directly.',
        'Detail three restates the paragraph\'s last sentence: "An owl also blinks using three different eyelids: one for regular blinking, one for use while sleeping, and one for keeping the eye clean." This sentence is true, but it explains blinking and eye care, not why the neck turns or why the owl can watch its surroundings without moving its whole body. It does not connect to this central idea at all.',
        'WRONG (as a supporting detail for this central idea): "An owl also blinks using three different eyelids: one for regular blinking, one for use while sleeping, and one for keeping the eye clean." This sentence is a true fact about owls, but it supports a different idea entirely — how an owl protects and cleans its eyes — not how the neck lets it look around.',
        'CORRECT supporting-detail list for this central idea keeps only the first two details: the eyes are fixed in their sockets and cannot roll sideways, and the neck has extra bones arranged to turn far around without cutting off blood flow.',
      ],
      answer:
        'Detail three does not belong. It is a true fact about owls, but it explains blinking and eye care, not the central idea about the neck\'s job. The central idea is supported only by the fact that an owl\'s eyes are fixed in their sockets and cannot roll sideways, and the fact that its neck has extra bones arranged to turn far around without cutting off blood flow.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-central-idea-more-than-one-reason',
      kind: 'try_yourself',
      problem:
        'Read the passage, then choose the statement that is its CENTRAL IDEA.\n\n"A bat\'s legs and hip joints are built for gripping, not for standing or walking the way a bird\'s legs are. Hanging upside down lets a bat simply let go and drop into the air, which gives it enough speed to fly without ever needing a running start. Hanging from a cave ceiling or a high branch also keeps a sleeping bat away from most predators that hunt along the ground."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Bats hang upside down for more than one physical reason: it fits how their legs work, and it helps them take flight and stay safe.', correct: true },
        { id: 'b', text: 'Bats.' },
        { id: 'c', text: 'Hanging upside down lets a bat simply let go and drop into the air, which gives it enough speed to fly without ever needing a running start.' },
        { id: 'd', text: 'A bat\'s legs and hip joints are built for gripping, not for standing.' },
      ],
      expectedAnswer: 'Bats hang upside down for more than one physical reason: it fits how their legs work, and it helps them take flight and stay safe.',
      hints: [
        'One choice is only a word, not a sentence, and two choices only restate one single reason among the several the passage gives.',
        'Ask yourself: does the sentence you pick account for every fact in the passage, or just one of them?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-central-idea-do-not-contradict-the-text',
      kind: 'try_yourself',
      problem:
        'Read the passage, then choose the CENTRAL IDEA that the particular details actually support.\n\n"Female sea turtles hatch on one beach, then spend years swimming in open ocean before they are ready to nest for the first time. When that day comes, most of them return to nest on the very beach where they hatched, not just any beach that looks similar. Scientists believe hatchlings imprint on small differences in the earth\'s magnetic field at the beach where they were born, which lets a turtle recognize that same stretch of coastline years later."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Sea turtles.' },
        { id: 'b', text: 'Most sea turtles return to nest on the exact beach where they hatched, and scientists think a memory of that beach\'s magnetic field is what guides them back.', correct: true },
        { id: 'c', text: 'Female sea turtles hatch on one beach, then spend years swimming in open ocean before they are ready to nest for the first time.' },
        { id: 'd', text: 'Sea turtles will nest on any beach that looks similar to the one where they hatched, because to a turtle one quiet stretch of sandy coastline is as good as another for laying eggs.' },
      ],
      expectedAnswer: 'Most sea turtles return to nest on the exact beach where they hatched, and scientists think a memory of that beach\'s magnetic field is what guides them back.',
      hints: [
        'One choice is only a word, one restates a single fact from the middle of the passage, and one says something the passage directly denies.',
        'Reread the words "not just any beach that looks similar" before you choose. One choice contradicts those exact words.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-which-detail-explains-why',
      kind: 'try_yourself',
      problem:
        'Read the passage and the central idea written below it, then choose the detail from the passage that explains WHY the central idea is true.\n\n"Honey almost never spoils, even without a refrigerator. Bees make honey with very little water in it, and what water is left is highly acidic, which makes it a poor place for bacteria or mold to grow. Sealed jars of honey found inside ancient Egyptian tombs have been unearthed still soft and edible, after thousands of years. Because honey resists spoiling so well, some campers and hikers pack it as a food that will not go bad on a long trip."\n\nCentral idea: Honey can stay edible for an extremely long time because its own natural makeup keeps bacteria and mold from growing in it.',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Because honey resists spoiling so well, some campers and hikers pack it as a food that will not go bad on a long trip.' },
        { id: 'b', text: 'Sealed jars of honey found inside ancient Egyptian tombs have been unearthed still soft and edible, after thousands of years.' },
        { id: 'c', text: 'Bees make honey with very little water in it, and what water is left is highly acidic, which makes it a poor place for bacteria or mold to grow.', correct: true },
        { id: 'd', text: 'Bees add a special preservative chemical to honey that keeps bacteria away.' },
      ],
      expectedAnswer: 'Bees make honey with very little water in it, and what water is left is highly acidic, which makes it a poor place for bacteria or mold to grow.',
      hints: [
        'Three of these choices are about honey lasting a long time, but only one of them explains WHY, in terms of what honey itself is made of.',
        'Ask which choice you could point to if someone asked how you know honey\'s own makeup is what stops bacteria and mold. One choice describes a use, one describes an old example, and one describes something the passage never actually says.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-detail-wearing-a-central-ideas-clothes',
      kind: 'misconception_check',
      question:
        'An article explains that many public libraries now lend out far more than books: some branches lend tools, sewing machines and telescopes, offer free museum passes, and provide meeting rooms and computer labs anyone can use. A student writes two different answers for "what is the central idea of this article?" First answer: "The central idea is libraries." Second answer: "The central idea is that libraries let you borrow tools." What went wrong with each answer?',
      commonErrors: [
        {
          answer: 'The central idea is libraries.',
          misconception:
            'Naming the topic and stopping there. The word is true about the article, so it feels like a finished answer, and nothing about a single true word looks like a mistake.',
          correctsTo:
            'A topic names what the article is about. A central idea says something about it, as a full sentence. Turn the word into a sentence that covers every kind of lending the article mentions, then test it: does it fit tools, sewing machines, telescopes, museum passes, meeting rooms, and computer labs all at once? "Public libraries now offer far more than books to borrow or use" does. "Libraries" alone does not say anything yet.',
        },
        {
          answer: 'The central idea is that libraries let you borrow tools.',
          misconception:
            'Promoting one interesting supporting detail to the rank of central idea. Tools are the first item named and the most surprising one, so it is tempting to stop there, and the sentence sounds specific enough to feel finished.',
          correctsTo:
            'A central idea has to cover every detail the article gives, not just the most interesting one. This sentence explains tools, but it leaves out sewing machines, telescopes, museum passes, meeting rooms and computer labs entirely, and none of those are borrowed tools. Check any central idea by asking whether it still holds once you swap in a different detail from the same article. If the sentence stops making sense, it was a detail wearing a central idea\'s clothes.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A topic is a word or short phrase. A central idea is a whole sentence stating the main point a text makes about that topic.',
        'Build a central idea from what every part of the text adds up to, not from one sentence alone. It has to be broad enough to cover every paragraph.',
        'A single supporting detail is not a central idea, even the most interesting one. WRONG: treating "libraries let you borrow tools" as the whole idea. CORRECT: "Public libraries now offer far more than books to borrow or use," which covers tools, sewing machines, telescopes, museum passes, meeting rooms and computer labs together.',
        'A supporting detail is a specific fact that answers "how do you know that is true" for the central idea. A detail that is true but does not connect to the stated central idea is off topic, even inside the same paragraph.',
        'Test every central idea against two separate details. One detail, or none, means you have a guess, and a detail that contradicts your sentence means the sentence is wrong.',
        'A fact can be true and still not belong on a supporting-details list, when it explains something else entirely — an owl\'s three eyelids explain blinking, not why its neck turns.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '3', cedTopic: '3.1', cedTitle: 'Central Idea & Supporting Details' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
