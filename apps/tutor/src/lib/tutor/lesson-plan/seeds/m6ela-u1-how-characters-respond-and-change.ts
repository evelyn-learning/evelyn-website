/**
 * Grade 6 ELA — Reading Literature: Plot, Character & Structure: How
 * Characters Respond & Change.
 *
 * CONCEPT-LED fan-out row, built on the discipline the concept-led exemplar
 * (m6ela-u2-theme-and-objective-summary.ts) models: de-escalate a skill that
 * also exists in the shipped Grade 7 course down to its Grade 6 wording. The
 * student arrives with no procedure to lean on, so the whole lesson builds
 * one way of reading: find the character's starting point, name the event
 * that provokes a reaction, and read the ending against the starting point to
 * say what is different (CCSS RL.6.3). Three traps this plan is built to
 * kill: naming a trait the story only CLAIMS rather than SHOWS, mistaking a
 * single reaction for a lasting change, and describing a change with no event
 * in the text to point at as its cause.
 *
 * SCOPE GUARD: Grade 6 row 1.3 describes how a character responds to an
 * event, or changes, as the plot moves toward its resolution, using the
 * character's own words, thoughts and actions as evidence. DELIBERATELY
 * EXCLUDED: naming the plot's own stages — exposition, rising action,
 * climax, resolution — which is row 1.2's job, not this one's; analyzing how
 * one sentence, chapter or scene fits into a text's overall structure, which
 * is row 1.4's job; and RL.7.3's "elements interact" framing, where setting
 * or another story element is analyzed as the thing that SHAPES the
 * character or the plot — that is Grade 7 territory, and no item in this
 * file asks the student to explain why an event happened, only how the
 * character responded to it. DELIBERATELY ALLOWED, because the boundary with
 * row 1.2 is close: every item in this file names the event a character is
 * responding to, because a response cannot be evaluated without knowing what
 * provoked it, and one worked example uses the words "by the last week" to
 * mark where a change is measured from. Neither one names or teaches a plot
 * stage, and neither one claims that the event caused anything beyond the
 * one character's own reaction.
 *
 * NOTE FOR FUTURE AUTHORS: every story in this file is original prose written
 * for the item. This course carries no passage machinery — no passageId, no
 * shared texts — so each question must be solvable from the sentences
 * printed inside it, and no published work may be quoted or closely
 * paraphrased. Every phrase this file puts inside quotation marks appears
 * character-for-character in the excerpt above it; quote your own excerpt
 * exactly, never from memory.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6ELA_U1_HOW_CHARACTERS_RESPOND_AND_CHANGE: LessonPlan = {
  id: 'evelyn.ms.m6ela.how-characters-respond-and-change.v1',
  title: 'How Characters Respond & Change',
  curriculum: 'MS',
  grade: '6',
  subject: 'ela',
  topic: 'grade-6-ela',
  locale: 'en',
  los: [
    {
      id: 'm6ela.how-characters-respond-and-change',
      standard: 'M6ELA-1.3',
      description:
        'Describe how a character responds to events, or changes, as the plot moves toward its resolution. RL.6.3 covers both the plot\'s shape (previous topic) and the character\'s arc within it (this topic); split here by pedagogical stage (CCSS RL.6.3).',
    },
  ],
  prerequisites: ['m6ela.how-a-storys-plot-unfolds'],
  followUps: ['m6ela.how-a-scene-fits-the-whole-story'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the student feel the gap between an assumed reaction and the reaction the text actually shows.',
      script:
        'You lend your favorite hoodie to a friend, and it comes back with a hole in the sleeve. You could guess how that story ends: you are furious, and you never lend anything again. That guess sounds fair. But if you read the actual story, the friend spent an hour that night sewing a patch shaped like a small rocket over the hole, and you end up wearing the hoodie to school on purpose to show it off. Same hole, a completely different ending, and the only way to know which one is true is to read the words on the page instead of guessing. Today we learn to find exactly that: how a character responds to something that happens, and how that character is different by the end of the story.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-response-and-change',
      kind: 'concept',
      goal: 'Install the difference between a shown response and a claimed trait, and the two-point comparison that proves a lasting change.',
      keyIdeas: [
        'A RESPONSE IS WHAT A CHARACTER DOES, SAYS OR THINKS RIGHT AFTER AN EVENT — not what a reader assumes a person would do. Look for an action, spoken words inside quotation marks, or a thought the narrator reports, right after the event happens.',
        'A RESPONSE CAN BE SHOWN INSTEAD OF TOLD. The text does not have to say "she felt angry." Watch what she does instead: walking away without a word, snapping at something small, staying an hour late to fix a mistake.',
        'A CHANGE MEANS THE CHARACTER IS DIFFERENT AT THE END THAN AT THE START — the same character, compared at two different moments. To describe a change, find one detail from near the beginning and one detail from near the end that show the same kind of thing done two different ways.',
        'NOT EVERY REACTION IS A CHANGE. A character can respond strongly to one event and go right back to acting the same way afterward. A change has to last: check whether the difference still shows up later in the story, not only in the sentence right after the event.',
        'A CLAIMED TRAIT IS NOT EVIDENCE. If a sentence says a character "is brave" or "is responsible" but nothing in the story shows the character doing anything brave or responsible, that sentence is a label, not proof. Trust what the character does over what anyone says about them.',
        'EVERY RESPONSE OR CHANGE NEEDS AN EVENT TO POINT AT. Before naming a response or a change, name the moment in the story that provoked it. If you cannot point at an event in the text, you are guessing a response, not describing one.',
      ],
      vocabulary: [
        { term: 'response', definition: 'what a character does, says or thinks right after an event happens.' },
        { term: 'change', definition: 'a character acting or feeling differently near the end of a story than near the start.' },
        { term: 'provoke', definition: 'to cause a reaction. The event that provokes a response always comes first.' },
        { term: 'claimed trait', definition: 'a quality a sentence assigns to a character in words, rather than one the character\'s actions show.' },
        { term: 'evidence', definition: 'the exact words from the text you point to in order to prove a response or a change is real.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-find-the-response',
      kind: 'worked_example',
      problem:
        'Read the story, then describe how the character responds to what happens.\n\n"Theo\'s cousin Mika came to stay for the summer and immediately rearranged every book on Theo\'s shelf by color instead of by series. Theo opened his door, saw the rainbow of spines, and said nothing. He walked straight to the kitchen and ate half a sleeve of crackers standing at the counter."',
      steps: [
        'Find the event first: the thing that happens right before the character does anything. Mika rearranges every book on Theo\'s shelf by color instead of by series.',
        'Find the response: what Theo does right after. He "said nothing" and then "walked straight to the kitchen and ate half a sleeve of crackers standing at the counter."',
        'Notice the response is shown, not told. The text never uses a feeling word like annoyed or angry. The silence and the trip to the kitchen show the response instead.',
        'Put the response into your own words, then point at the exact words that prove it: Theo responds to the rearranged books by staying quiet and leaving the room instead of talking about it.',
        'Check your answer against the words on the page. It names the actual event, the books being rearranged, and the actual actions, "said nothing" and "walked straight to the kitchen," not a guess like "Theo was furious," which the text never states.',
      ],
      answer:
        'Theo responds to Mika rearranging his books by color by saying nothing and walking straight to the kitchen instead of talking about it. The evidence is "said nothing" and "walked straight to the kitchen and ate half a sleeve of crackers standing at the counter" — the text shows the response through actions rather than naming a feeling.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-find-the-change',
      kind: 'worked_example',
      problem:
        'Read the story, then describe how the character changes from the beginning to the end.\n\n"On the first day of walking his neighbor\'s dog, Theo kept the leash short and crossed the street twice to avoid other dogs. In the second week, the dog pulled loose from its collar during a thunderstorm, and Theo chased it three blocks before catching it under a parked truck. By the last week of the job, Theo let the dog greet every dog on the block and walked an extra loop around the park because the dog liked the ducks there."',
      steps: [
        'Find the starting point: what the character does near the beginning. Theo "kept the leash short and crossed the street twice to avoid other dogs" — he is cautious around other dogs.',
        'Find the event partway through: the dog pulling loose during the thunderstorm and Theo chasing it three blocks. That is a single moment. On its own, it is a response, not yet a change.',
        'Find the ending point: what the character does near the end. Theo "let the dog greet every dog on the block and walked an extra loop around the park" — he now seeks out other dogs instead of avoiding them.',
        'Compare the two points, not only the middle event. WRONG: stopping at the storm and writing "Theo is brave when the dog gets loose." That describes one response, not a change across the story. CORRECT: comparing the first week to the last week to say what is different by the end.',
        'Write the change as one sentence that names both ends: Theo changes from someone who avoids other dogs to someone who goes out of his way for his neighbor\'s dog to enjoy its walk.',
        'Check the answer names two moments, not one, and both moments come from the text: crossing the street to avoid dogs at the start, letting the dog greet every dog and adding an extra loop at the end.',
      ],
      answer:
        'Theo changes from someone who avoids other dogs — he "crossed the street twice to avoid other dogs" in the first week — to someone who welcomes them, letting the dog "greet every dog on the block" and walking "an extra loop around the park" by the last week. Naming only the thunderstorm chase would describe a response, not the change across the whole story.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-identify-the-response',
      kind: 'try_yourself',
      problem:
        'Read the story, then choose the description that correctly states how the character RESPONDS to what happens.\n\n"Priya\'s science fair project — a model volcano — collapsed into a puddle of baking soda paste ten minutes before judging started. Priya knelt down, scraped the wet cardboard back into a rough cone shape with both hands, and taped a paper flag on top that read \'Volcano (still erupting).\'"',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Priya rebuilds a rough version of the volcano by hand and labels it with a joke instead of giving up.', correct: true },
        { id: 'b', text: 'Priya panics and cries when she sees that her model volcano has collapsed into a puddle of baking soda paste.' },
        { id: 'c', text: 'Priya leaves her table and does not finish the project before judging starts.' },
        { id: 'd', text: 'Priya is naturally talented at science projects and rarely needs to fix her own work.' },
      ],
      expectedAnswer: 'Priya rebuilds a rough version of the volcano by hand and labels it with a joke instead of giving up.',
      hints: [
        'Look for what the character actually does or says right after the volcano collapses, not what you assume someone would feel.',
        'Two choices describe something the story never prints, and one choice describes leaving the table, which the actions in the excerpt contradict.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-identify-the-change',
      kind: 'try_yourself',
      problem:
        'Read the story, then choose the description that best states how the character CHANGES from the beginning of the story to the end.\n\n"In September, Lena signed up for the debate club but sat in the back of every practice without raising her hand. When a scheduling mix-up left her partner absent right before a real debate in November, Lena stood up alone, argued both halves of the case herself, and finished four minutes early. By the last tournament in the spring, Lena volunteered to go first in every round and stayed after to help newer members practice their opening lines."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Lena feels nervous during the November debate when her partner is absent and she has to argue both halves of the case alone.' },
        { id: 'b', text: 'Lena changes from someone who stayed quiet in practice to someone who volunteers first and helps other members.', correct: true },
        { id: 'c', text: 'Lena stays exactly the same throughout the debate season.' },
        { id: 'd', text: 'Lena joins the debate club in September and sits in the back of every practice.' },
      ],
      expectedAnswer: 'Lena changes from someone who stayed quiet in practice to someone who volunteers first and helps other members.',
      hints: [
        'A change compares two different moments in the story, not only the middle event.',
        'Find one detail from September and one detail from the last tournament in spring, and check which choice uses both.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-shown-not-claimed',
      kind: 'try_yourself',
      problem:
        'Read the story, then choose the choice that describes something the text actually SHOWS the character doing, rather than a trait or a feeling the text only claims.\n\n"When the assembly line at the recycling drive jammed for the third time, Marcus grabbed a flashlight, wedged himself behind the sorting table, and worked the stuck bottles loose one at a time while everyone else took a break."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Marcus feels embarrassed that the assembly line has jammed for the third time in front of everyone.' },
        { id: 'b', text: 'Marcus tells the volunteers to take a longer break next time.' },
        { id: 'c', text: 'Marcus grabs a flashlight and works the stuck bottles loose while everyone else takes a break.', correct: true },
        { id: 'd', text: 'Marcus is a natural leader who takes charge whenever a group gets stuck.' },
      ],
      expectedAnswer: 'Marcus grabs a flashlight and works the stuck bottles loose while everyone else takes a break.',
      hints: [
        'The correct choice describes exactly what Marcus does with his hands, not a word someone might use to describe him.',
        'Three choices are either a trait the text never shows, a feeling the text never states, or an action nobody in the story takes.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-trait-and-rule',
      kind: 'misconception_check',
      question:
        'A student reads a story where a character spends the whole book avoiding her little brother, then in the last scene teaches him to ride a bike. The student writes: "The character is very patient. She changes because the story says people should be patient with their siblings." What two things went wrong?',
      commonErrors: [
        {
          answer: 'The character is very patient.',
          misconception:
            'Naming a claimed trait instead of pointing at what the character actually does. The word patient sounds like a fair description, so it does not look like a mistake, but nothing in the sentence points at an action.',
          correctsTo:
            'A trait is only evidence when it comes from something the character does, not from a word the student picked. Instead of naming a trait, describe the action: "She spends an afternoon teaching her little brother to ride a bike, holding the seat until he can balance on his own." That sentence points at something in the text a reader could check.',
        },
        {
          answer: 'She changes because the story says people should be patient with their siblings.',
          misconception:
            'Turning the story into a rule about people in general instead of describing what is different about this one character. This sounds like a thoughtful conclusion, which is exactly why it does not look wrong.',
          correctsTo:
            'A change is a comparison between two moments for this character, not a rule about people in general. Compare how she treated her brother at the start of the story to how she treats him at the end, and name both moments: avoiding him at the beginning, then teaching him to ride a bike at the end. A rule about people belongs to a different lesson, finding the theme, not to describing this character\'s own change.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A response is what a character does, says or thinks right after an event — not what a reader assumes.',
        'A response can be shown instead of told. Watch the actions and the words in quotation marks, not only the feeling words.',
        'A change means the character is different at the end than at the start. Compare one detail from near the beginning to one detail from near the end.',
        'Not every reaction is a change. WRONG: "Theo is brave when the dog gets loose" (one moment only). CORRECT: "Theo changes from someone who avoids other dogs to someone who welcomes them" (compares the start of the story to the end).',
        'A claimed trait is not evidence. Trust what the character does over a label like brave or responsible.',
        'Every response or change needs an event to point at. Before naming one, name the moment in the story that provoked it.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '1', cedTopic: '1.3', cedTitle: 'How Characters Respond & Change' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
