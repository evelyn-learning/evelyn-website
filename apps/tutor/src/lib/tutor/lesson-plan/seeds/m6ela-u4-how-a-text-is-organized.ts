/**
 * Grade 6 ELA — Text Structure, Author's Purpose & Comparing Accounts: How a
 * Text Is Organized.
 *
 * CONCEPT-LED lesson for the m6ela fan-out. The student arrives with no
 * procedure to lean on, so the whole lesson builds one way of reading: a
 * whole informational text is built from one of four repeatable shapes —
 * chronological, cause/effect, problem/solution or compare/contrast — and
 * naming the shape is only half the job, because a text's topic decides
 * which shape actually fits it (CCSS RI.6.5). Three traps this plan is built
 * to kill: mistaking real events moving through time for cause/effect just
 * because a causal-sounding sentence sits somewhere inside a chronological
 * or problem/solution text, mistaking a before-and-after description of one
 * subject for compare/contrast, and mistaking the order two topics happen to
 * be introduced in for chronological order.
 *
 * SCOPE GUARD: Grade 6 row 4.1 identifies a WHOLE text's organizational
 * pattern from among four named shapes — chronological, cause/effect,
 * problem/solution, compare/contrast — and explains how that shape fits the
 * text's topic. DELIBERATELY EXCLUDED: how a single heading, caption,
 * sidebar or graphic fits into and aids understanding of ONE SECTION of a
 * text, which is row 3.4's job at the smaller scale RI.6.5 also covers — no
 * heading, caption, sidebar or graphic appears anywhere in this file, and
 * every passage here is judged only by how its paragraphs connect to each
 * other, never by a visual feature. Also excluded: an author's point of view
 * or purpose and how word choice or selected details convey it (row 4.2,
 * RI.6.6); sorting an author's claims into supported and unsupported without
 * judging whether the reasoning is sound (row 4.3, RI.6.8) — this file never
 * asks whether a passage's reasoning holds up, only what shape carries it;
 * and comparing two different authors' accounts of the same event or topic
 * (row 4.4, RI.6.9) — every passage in this file is a single account, and no
 * item ever asks the student to weigh one telling against another. Also
 * excluded, as Grade 7 territory: any categories-or-hierarchies structural
 * analysis that groups a whole text's ideas into classes (RI.7.5) — this
 * file's four patterns are exhaustive on their own terms, and no fifth
 * "classification" shape is introduced or hinted at. DELIBERATELY ALLOWED,
 * because rows 3.4 and 4.2 sit close: (a) a passage may state that a
 * neighborhood or a town felt a certain way about a problem, but no item
 * asks why the author chose to write about it, which keeps this file on the
 * structure side of row 4.2's boundary; (b) a passage may be read start to
 * finish exactly the way row 3.4's passages are, but every judgment call
 * here is about paragraph-to-paragraph shape, never about a printed text
 * feature, which keeps it on the whole-text side of row 3.4's boundary.
 *
 * NOTE FOR FUTURE AUTHORS: every excerpt in this file is original prose
 * written for the item. This course carries no passage machinery — no
 * passageId, no shared texts — so each question must be solvable from the
 * sentences printed inside it, and no published work may be quoted or
 * closely paraphrased. Every phrase this file puts inside quotation marks
 * appears character-for-character in the excerpt it is drawn from; quote
 * your own excerpt exactly, never from memory.
 *
 * CLAIM LEDGER (informational passages):
 *   Claim                                    | Where                | Grounds
 *   Leaves stay green in summer because they  | worked example 1      | Long-settled plant biology:
 *   hold chlorophyll, and losing chlorophyll  | passage & keyIdeas    | chlorophyll masks the other
 *   in fall lets other colors show through    |                       | pigments already in a leaf.
 *   Shorter, cooler autumn days slow a tree's | worked example 1      | Long-settled plant biology;
 *   chlorophyll production                    | passage               | standard seasonal-color-change fact.
 *   Dune grass roots hold sand in place and   | worked example 2      | Long-settled coastal-ecology /
 *   can slow beach erosion                    | passage               | erosion-control practice.
 *   Salmon hatch in fresh water, migrate to   | try-1 passage         | Long-settled biology of
 *   the ocean to grow, then return to the     |                       | anadromous fish life cycles.
 *   stream where they hatched to spawn        |                       |
 *   Solar panels convert sunlight to          | try-2 passage         | Long-settled basic principles
 *   electricity and produce virtually none    |                       | of photovoltaic and wind-
 *   after dark; wind turbines convert wind to |                       | turbine engineering.
 *   electricity and can run at night given    |                       |
 *   wind                                      |                       |
 * No live hypothesis appears in this file — every claim above is a settled,
 * textbook-level mechanism, so none needed a hedge. No precise statistic
 * appears anywhere; every quantity in every passage is qualitative ("many",
 * "most of its life", "a few years", "a season"). The invented town and
 * street names (Fairport, Birch Street) and their events are fictional
 * frames for real mechanisms, the same way a word problem's characters are
 * invented — the mechanisms themselves are the claims checked above.
 *
 * NOTE ON prerequisites/followUps: this row's chain is wired from the
 * fan-out contract's course table — prerequisite is row 3.4
 * (m6ela.text-features-and-how-they-aid-understanding) and follow-up is row
 * 4.2 (m6ela.authors-purpose), both already-registered LOs by the time this
 * batch lands.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6ELA_U4_HOW_A_TEXT_IS_ORGANIZED: LessonPlan = {
  id: 'evelyn.ms.m6ela.how-a-text-is-organized.v1',
  title: 'How a Text Is Organized',
  curriculum: 'MS',
  grade: '6',
  subject: 'ela',
  topic: 'grade-6-ela',
  locale: 'en',
  los: [
    {
      id: 'm6ela.how-a-text-is-organized',
      standard: 'M6ELA-4.1',
      description:
        'Identify a whole informational text\'s organizational pattern — chronological, cause/effect, problem/solution or compare/contrast — from how its paragraphs connect to one another, and explain how that pattern fits the topic the text is explaining (CCSS RI.6.5).',
    },
  ],
  prerequisites: ['m6ela.text-features-and-how-they-aid-understanding'],
  followUps: ['m6ela.authors-purpose'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that the student already builds a text around a shape without noticing, and that writers pick shapes on purpose.',
      script:
        'Say you want to tell your best friend how you finally beat the hardest level in your favorite game. You could tell it like a play-by-play: first this happened, then that happened, and finally you won. Or you could tell it like a fix: you kept losing at the same spot, so you changed your strategy, and that is what finally worked. Same story, two different shapes, and your friend would follow either one without noticing you picked a shape at all. Writers of nonfiction pick shapes on purpose too. Today we learn to spot four shapes a whole text can be built from, and why a writer would choose one shape over another for a particular topic.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-four-organizational-patterns',
      kind: 'concept',
      goal: 'Install the four organizational patterns, their signal words, the traps that make one look like another, and the idea that a pattern has to fit its topic.',
      keyIdeas: [
        'AN ORGANIZATIONAL PATTERN IS THE SHAPE OF THE WHOLE TEXT. Four shapes show up again and again in informational writing: chronological, cause/effect, problem/solution and compare/contrast. The pattern is not one sentence — it is how every paragraph connects to the next one.',
        'CHRONOLOGICAL TEXT MOVES THROUGH REAL EVENTS IN THE ORDER THEY HAPPEN. Signal words: first, next, after, when, once, finally. A life cycle, a set of directions and a historical timeline usually take this shape.',
        'CAUSE/EFFECT TEXT SHOWS ONE EVENT MAKING ANOTHER EVENT HAPPEN. Signal words: because, so, as a result, which causes. Watch out: a single sentence can use a word like because without the whole text being built that way — check whether the cause-to-effect chain runs the full length of the passage, not just through one line of it.',
        'PROBLEM/SOLUTION TEXT NAMES A REAL TROUBLE, THEN EXPLAINS THE FIX. Signal words: problem, trouble, worried, solved this by, in response. A text about fixing something broken, unsafe or unfair usually takes this shape.',
        'COMPARE/CONTRAST TEXT SETS TWO SEPARATE THINGS SIDE BY SIDE. Signal words: but, both, unlike, in contrast, while, however. Watch out: a text that shows one subject at two different points in time, a before-and-after, is not automatically compare/contrast — that is usually problem/solution wearing two costumes.',
        'A PATTERN FITS ITS TOPIC FOR A REASON. Ask what the topic itself needs: real steps over time need chronological order, an explanation of why needs cause/effect, a fix for something wrong needs problem/solution, and weighing two things against each other needs compare/contrast. Naming the pattern is only half the job — saying why it fits the topic is the other half.',
      ],
      vocabulary: [
        { term: 'organizational pattern', definition: 'the shape a whole text uses to connect its paragraphs and ideas to one another.' },
        { term: 'chronological', definition: 'a pattern that presents real events in the order they happen in time.' },
        { term: 'cause/effect', definition: 'a pattern that shows one event making another event happen.' },
        { term: 'problem/solution', definition: 'a pattern that names a real trouble and then explains what fixed it.' },
        { term: 'compare/contrast', definition: 'a pattern that sets two separate things side by side to show how they are alike and different.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-cause-and-effect',
      kind: 'worked_example',
      problem:
        'Read this text, then name its organizational pattern and explain how you know.\n\n"Paragraph 1: Each fall, the leaves on many trees turn red, orange and yellow before they drop. Paragraph 2: All summer, leaves stay green because they are full of a chemical called chlorophyll, which lets the tree turn sunlight into food. Paragraph 3: In autumn, the days grow shorter and cooler, so the tree slows down and stops making new chlorophyll. Paragraph 4: As the green chlorophyll fades, the other colors that were hiding underneath it become visible, and the leaves finally drop once the tree seals off the stem."',
      steps: [
        'Notice that the paragraphs do move through the calendar, from summer into fall. That might tempt you to call this chronological, but time passing is not the whole story here.',
        'Look at the connecting words instead of just the order of events: "because," "so" and "once." Each one links an event to a result it produces, rather than simply saying what happened next.',
        'Trace the chain paragraph by paragraph. Paragraph 2 says the leaves stay green "because" they hold chlorophyll. Paragraph 3 says the shorter, cooler days make the tree stop making new chlorophyll, signaled by "so." Paragraph 4 says the fading chlorophyll is what lets the other colors show through, and that the leaf drops "once" the tree seals off the stem.',
        'Name the pattern. A chain where one event makes the next one happen, running from the first paragraph to the last, is cause/effect — not chronological, even though the events also happen to occur across a season.',
        'Explain how the pattern fits the topic. This text\'s job is to explain WHY leaves change color, and cause/effect is the shape built for showing why one thing leads to another, so it fits this topic better than a plain timeline would.',
      ],
      answer:
        'Cause/effect. The text says the tree stays green because it holds chlorophyll, that shorter, cooler days make the tree stop producing new chlorophyll, and that fading chlorophyll is what lets the other colors show through before the leaf drops. Each event causes the next, which fits a topic that is explaining why something happens rather than just listing events in order.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-repair-a-mislabeled-pattern',
      kind: 'worked_example',
      problem:
        'Read this text. A student labeled it compare/contrast. Explain what the student got wrong, and name the pattern that actually fits.\n\n"Paragraph 1: The town of Fairport had a problem: every winter storm washed away more of its beach, and the boardwalk started to tip toward the water. Paragraph 2: Some worried that swimmers and walkers would have nowhere safe to go if the sand kept disappearing. Paragraph 3: The town solved this by planting rows of dune grass, whose roots hold sand in place and slow the wind that blows it away. Paragraph 4: A few years after the planting, the beach stopped shrinking, and the boardwalk was safe again."\n\nThe student\'s reasoning: "This is compare/contrast, because it talks about the beach before the dune grass and the beach after the dune grass, and before-and-after is a comparison."',
      steps: [
        'Check the student\'s reasoning against what compare/contrast actually means. Compare/contrast sets two separate things side by side, such as two animals or two machines, to note how they are alike and different.',
        'Ask whether this text is doing that, or something else. It does not introduce two separate subjects. It follows one subject, the Fairport beach, and tracks what happened to it over time.',
        'Look for the actual shape instead. Paragraph 1 names a real trouble, signaled by "had a problem" and the washing-away beach. Paragraph 3 names the fix, signaled by "solved this by" and the dune grass. Naming a problem and then explaining what solved it is the problem/solution pattern, not compare/contrast.',
        'WRONG: "This is compare/contrast, because it talks about the beach before the dune grass and the beach after the dune grass." CORRECT: "This is problem/solution, because the text names the beach\'s erosion as a problem and then explains how planting dune grass fixed it."',
        'Explain how the pattern fits the topic. The topic is a town fixing a beach that kept washing away, and problem/solution is the shape built exactly for a topic about naming trouble and then explaining a fix, so it fits better than a side-by-side comparison would.',
      ],
      answer:
        'Problem/solution, not compare/contrast. The text names one real trouble, the eroding beach, and then explains the one fix that solved it, the dune grass. A before-and-after description of a single subject is not automatically a comparison of two separate things — that shape belongs to problem/solution when a fix is what causes the change.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-salmon-life-cycle',
      kind: 'try_yourself',
      problem:
        'Read this text, then choose the statement that correctly names its organizational pattern and explains why.\n\n"Paragraph 1: A salmon\'s life begins in a stream, where it hatches from an egg buried in the gravel. Paragraph 2: After several months in the stream, the young salmon swims downstream to the ocean, where it will spend most of its life growing bigger. Paragraph 3: When it is old enough, the salmon leaves the ocean and swims back upstream to the very stream where it hatched. Paragraph 4: Once it reaches that stream, the salmon lays or fertilizes eggs, and its long journey ends there."',
      responseFormat: 'mcq',
      choices: [
        {
          id: 'a',
          text: 'Problem/solution, because the salmon has to work out how to find its way back to the exact stream where it was born, which the text presents as something the salmon must solve.',
        },
        {
          id: 'b',
          text: 'Chronological, because the four paragraphs move through the stages of the salmon\'s life in the order they actually happen, from hatching to the final return upstream.',
          correct: true,
        },
        {
          id: 'c',
          text: 'Cause/effect, because the ocean stop is what causes the salmon to grow big enough to survive the whole trip back upstream to the stream where it originally hatched from an egg.',
        },
        {
          id: 'd',
          text: 'Compare/contrast, because the freshwater stream where the salmon hatches and the ocean where it spends most of its life growing are described as two very different kinds of places.',
        },
      ],
      expectedAnswer:
        'Chronological, because the four paragraphs move through the stages of the salmon\'s life in the order they actually happen, from hatching to the final return upstream.',
      hints: [
        'Look at the connecting words that open paragraphs two, three and four: "After," "When" and "Once." Those tell you the text is moving through time, not naming a trouble that got fixed or setting two things side by side to compare them.',
        'Check each paragraph against a real-life stage: hatching, swimming to the ocean, growing there, returning to the stream, and finally spawning. That is a sequence of real events happening one after another, which is the definition of one particular pattern.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-solar-and-wind',
      kind: 'try_yourself',
      problem:
        'Read this text, then choose the statement that correctly names its organizational pattern and explains why.\n\n"Paragraph 1: Solar panels and wind turbines are both used to make clean electricity, but they work in very different ways. Paragraph 2: Solar panels are made of cells that turn sunlight directly into electricity, so they work best on clear days and produce nothing after dark. Paragraph 3: Wind turbines have blades that spin when the wind pushes them, turning a generator inside, so they can make electricity at night as long as the wind is blowing. Paragraph 4: Both machines need the right weather to work well, but a place with steady wind and a place with strong sun are not always the same place."',
      responseFormat: 'mcq',
      choices: [
        {
          id: 'a',
          text: 'Problem/solution, because towns once had a real problem finding a steady source of clean electricity, and the passage frames both solar panels and wind turbines as two different fixes that finally solved that same shared problem.',
        },
        {
          id: 'b',
          text: 'Chronological, because the passage happens to introduce solar panels in its first paragraph and wind turbines only afterward in its second paragraph, and that order of introduction is treated as if it were the order of real events in time.',
        },
        {
          id: 'c',
          text: 'Compare/contrast, because the passage sets solar panels and wind turbines side by side, explaining how each one works and pointing out a difference in when each one can produce electricity.',
          correct: true,
        },
        {
          id: 'd',
          text: 'Cause/effect, because the wind pushing hard against the turbine\'s spinning blades is what causes the generator hidden inside the turbine to turn and finally produce usable electricity for the town\'s homes.',
        },
      ],
      expectedAnswer:
        'Compare/contrast, because the passage sets solar panels and wind turbines side by side, explaining how each one works and pointing out a difference in when each one can produce electricity.',
      hints: [
        'The order the paragraphs happen to be written in is not the same thing as time actually passing. Ask instead what the paragraphs are doing with the two machines: narrating a sequence of events, or setting two things next to each other to note how they work?',
        'Look for the connecting word "but" in the first and last paragraphs. That word signals a difference being pointed out between two things placed side by side, which is a specific pattern with its own name.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-birch-street-lot',
      kind: 'try_yourself',
      problem:
        'Read this text, then choose the statement that correctly names its organizational pattern and explains why.\n\n"Paragraph 1: The corner lot on Birch Street had been a problem for years: trash collected there, and weeds grew tall enough to spill onto the sidewalk. Paragraph 2: Neighbors worried that the mess made the block feel unsafe to walk past after dark. Paragraph 3: A group of residents asked the city for permission to turn the lot into a shared garden, and the city cleared away the trash and put up a low fence. Paragraph 4: Within a season, the lot held raised beds of vegetables, and neighbors who had never met before started showing up on the same evenings to water their plants."',
      responseFormat: 'mcq',
      choices: [
        {
          id: 'a',
          text: 'Chronological, because the four paragraphs move in time from the lot sitting empty and trashed to the garden growing in it later, and that passage of time is the only reason the paragraphs appear in this order.',
        },
        {
          id: 'b',
          text: 'Cause/effect, because neighbors feeling unsafe caused the group of residents to ask the city for a garden, and the city\'s help is what caused the empty lot to fill with vegetables by the next season.',
        },
        {
          id: 'c',
          text: 'Compare/contrast, because the lot before the garden and the lot after the garden are two very different scenes that the passage places side by side for the reader to notice and weigh against each other.',
        },
        {
          id: 'd',
          text: 'Problem/solution, because the passage names a real problem, an empty lot collecting trash that made neighbors uneasy, and then explains the fix the residents and the city carried out together to solve it.',
          correct: true,
        },
      ],
      expectedAnswer:
        'Problem/solution, because the passage names a real problem, an empty lot collecting trash that made neighbors uneasy, and then explains the fix the residents and the city carried out together to solve it.',
      hints: [
        'This passage does move through time, but so does almost every true story. Ask instead whether the paragraphs are shaped around naming a difficulty and then explaining what fixed it, rather than just narrating events in order.',
        'Find the sentence that names the trouble on Birch Street and the sentence that names what the residents and the city did about it. A text shaped trouble-first, fix-second has a name of its own, and it is not the same pattern as a plain timeline or a side-by-side comparison.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-before-after-is-not-compare-contrast',
      kind: 'misconception_check',
      question:
        'A student reads this text: "Paragraph 1: The town library had a problem: its shelves ran out of room for new books. Paragraph 2: The crowded shelves caused the town to build a small addition onto the back of the building, and now every shelf has room to spare." The student writes: "This is compare/contrast, because it describes the library before the addition and the library after the addition, and comparing two versions of the same building counts. It could also be cause/effect, since the paragraph says the crowded shelves caused the addition." What has gone wrong, and what is the actual pattern?',
      commonErrors: [
        {
          answer:
            'This is compare/contrast, because it describes the library before the addition and the library after the addition.',
          misconception:
            'Mistaking a before-and-after picture for a side-by-side comparison. Two different scenes of the very same subject feel like two things being compared, so the mismatch is easy to miss.',
          correctsTo:
            'Compare/contrast sets two separate things side by side to note how they are alike and different, such as two machines or two animals. A text that shows one subject changing because of a fix is problem/solution instead: it names the trouble, then explains the response. This text names a problem, the shelves running out of room, and then explains what fixed it, so it is problem/solution.',
        },
        {
          answer: 'It could also be cause/effect, since the paragraph says the crowded shelves caused the addition.',
          misconception:
            'Finding one sentence that names a cause and letting that single sentence decide the whole text\'s shape. A causal word can appear inside almost any pattern without making the whole text cause/effect.',
          correctsTo:
            'Check the shape of the whole passage, not one word in one sentence. This text opens by naming a problem and closes by explaining the fix that solved it, which is the problem/solution shape start to finish. The word "caused" inside it explains why the addition happened; it does not overrule the shape of the whole text.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'An organizational pattern is the shape a whole text uses to arrange its ideas: chronological, cause/effect, problem/solution or compare/contrast.',
        'Chronological text moves through real events in the order they truly happen, signaled by words such as after, when, next and finally.',
        'Cause/effect text shows one event making another happen, signaled by words such as because, so and as a result — a single causal-sounding sentence does not by itself decide the whole text\'s shape.',
        'Problem/solution text names a real trouble and then explains what fixed it. WRONG: calling a before-and-after description compare/contrast just because it shows two versions of the same thing. CORRECT: checking whether the text names a problem and a fix, which makes it problem/solution instead.',
        'Compare/contrast text sets two separate things side by side to note how they are alike and different, usually signaled by words such as but, both and while — the order two topics happen to be introduced in is not the same thing as time passing.',
        'A text\'s pattern fits its topic: real steps over time call for chronological order, explaining why something happens calls for cause/effect, fixing something calls for problem/solution, and weighing two things against each other calls for compare/contrast.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '4', cedTopic: '4.1', cedTitle: 'How a Text Is Organized' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
