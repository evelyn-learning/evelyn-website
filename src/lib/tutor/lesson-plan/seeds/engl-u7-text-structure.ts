/**
 * HS English — Reading Informational Text: Nonfiction Text Structures.
 *
 * How writers arrange ideas (CCSS RI.9-10.5, RI.9-10.6): the five common
 * nonfiction patterns, the signal words that hint at each, the relationship
 * test that beats signal words when the two disagree, and the step past
 * labeling — asking why the author chose that shape. All excerpts are short
 * ORIGINAL nonfiction-style prose written for this lesson — no copyrighted
 * quotations, no external passages.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_ENGL_U7_TEXT_STRUCTURE: LessonPlan = {
  id: 'evelyn.hs.engl.text-structure.v1',
  title: 'Nonfiction Text Structures',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'ela',
  topic: 'hs-english',
  locale: 'en',
  los: [
    {
      id: 'engl.text-structure',
      standard: 'ENGL-7.3',
      description:
        'Identify the five common nonfiction text structures — chronological, cause and effect, compare and contrast, problem and solution, and description — from signal words and from how the ideas actually relate, and analyze why an author chose one structure over another (CCSS RI.9-10.5, RI.9-10.6).',
    },
  ],
  prerequisites: ['engl.authors-purpose-and-perspective'],
  followUps: ['engl.inference-and-evidence'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that arrangement is a writing decision by contrasting two texts about the same subject.',
      script:
        'Picture two pieces of writing about the same bowl of soup. A recipe walks you through it in order: heat the oil, add the onions, simmer twenty minutes. A review of the same soup does something else entirely — it sets this bowl against the one down the street, weighing broth against broth. Same subject, two completely different shapes, because the writers wanted two different things from you. That shape has a name, it is called text structure, and once you can see it you can also see what the writer was trying to do to you. You already make this choice yourself: a lab report is arranged nothing like a history summary, and you would not turn one in for the other.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-five-structures',
      kind: 'concept',
      goal: 'Name the five structures with their signal words and their underlying idea-relationships, then establish the relationship test, purpose, and mixed structures.',
      keyIdeas: [
        'CHRONOLOGICAL / SEQUENCE — ideas are arranged by time or by order of steps. Signal words: first, then, next, later, in 1998, by the following spring, finally. Relationship test: does each idea come AFTER the one before it in time or in procedure? Recipes, histories, and process explanations live here.',
        'CAUSE AND EFFECT — one thing produces another. Signal words: because, since, therefore, as a result, consequently, led to. Relationship test: could you rewrite the passage as "X happened, so Y happened" without lying about it? If the second idea would still be true had the first never occurred, the relationship is not cause and effect.',
        'COMPARE AND CONTRAST — two or more subjects are held up against each other. Signal words: however, both, unlike, whereas, similarly, on the other hand. Relationship test: are the same categories applied to two subjects? Watch for the block pattern (all of subject A, then all of subject B) as well as the point-by-point pattern, which alternates.',
        'PROBLEM AND SOLUTION — a difficulty is named, then a fix is proposed or reported. Signal words: the challenge, one difficulty, to address this, the answer, resolved. Relationship test: is there something clearly broken or unmet in the first part, and does the second part act on it? A text can describe a problem without this structure; the fix has to actually appear.',
        'DESCRIPTION — a single subject is expanded through its features, examples, or parts, with no time order, no comparison, and no fix. Signal words are the weakest here: for example, such as, characteristics, in addition. Relationship test: are the ideas siblings, each adding another detail about one subject, rather than leading into one another? Description is the default when nothing else fits.',
        'THE RELATIONSHIP TEST BEATS SIGNAL WORDS — signal words are a hint, never a verdict. "Because" can appear inside a supporting detail of a compare and contrast piece; a date can appear inside a description. Read for how the IDEAS relate across the whole excerpt, and when the words and the relationships disagree, trust the relationships.',
        'THE SIGNAL-WORD-ONLY ERROR — the most common mistake is scanning for one word, spotting "because" or "however," and labeling the whole text from it. That is reading one tile and naming the mosaic. A single connective describes the link between two sentences; structure describes the link between the parts of the whole.',
        'STRUCTURE SERVES PURPOSE — writers do not pick a shape at random. Comparison exists to help a reader choose or judge; problem and solution exists to move a reader toward action; chronology exists to make a process repeatable or a history followable; cause and effect exists to explain why. Naming the structure is step one; step two is asking what that choice does for the writer.',
      ],
      vocabulary: [
        { term: 'text structure', definition: 'the organizational pattern a writer uses to arrange the ideas in a nonfiction text.' },
        { term: 'signal words', definition: 'transition words that hint at a structure (because, however, first, to address this) — evidence, but not proof.' },
        { term: 'dominant structure', definition: 'the pattern that organizes a text as a whole, even when smaller patterns appear inside its parts.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-relationships-over-words',
      kind: 'worked_example',
      problem:
        'Identify the structure of this excerpt, using the relationship test rather than the signal words: "For years the town of Ridgeline lost nearly a third of its drinking water to pipes that cracked every summer. In 2021 the water district began replacing the oldest mains with flexible tubing that expands in heat. Losses fell below five percent within two years."',
      steps: [
        'Do not start with the words — start by labeling what each sentence DOES. S1 names something broken (a third of the water lost). S2 reports an action taken on it. S3 reports the result of that action.',
        'Now check the tempting label. There are two dates, 2021 and "within two years," which pulls toward chronological. But test it: is the passage ABOUT a sequence of events, or is the sequence just how a fix gets reported? Remove the dates and the excerpt still holds together as broken-thing, fix, outcome. That means time is a detail here, not the organizing idea.',
        'Test cause and effect the same way. The tubing does cause the drop, so there is a causal link inside the passage. But the excerpt does not exist to explain why pipes crack; it exists to present a difficulty and what was done about it.',
        'Apply the problem and solution test directly: is something clearly unmet in the first part, and does a later part act on it? Yes to both, and the outcome sentence confirms the fix worked.',
        'Label it problem and solution, with chronological and causal details serving inside that frame.',
      ],
      answer:
        'Problem and solution — S1 states the water loss, S2 gives the fix, S3 reports the result; the dates are supporting detail, not the organizing pattern',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-because-trap',
      kind: 'worked_example',
      problem:
        'A student reads this excerpt, sees "because," and labels it cause and effect: "Rooftop gardens and ground-level gardens both cool a building, but they do it in different ways. A rooftop garden lowers the roof temperature directly, because the soil layer absorbs sunlight before it ever reaches the roof membrane. A ground-level garden instead cools the air around the building, which the vents then draw inside." What did the student miss?',
      steps: [
        'Find where the signal word actually sits. "Because" appears in the middle of sentence two, linking one garden type to one mechanism. It governs a detail, not the excerpt.',
        'Now label the parts. S1 announces two subjects and states that they share an outcome but differ in method. S2 covers subject A. S3 covers subject B, and the word "instead" marks the pivot.',
        'Ask the compare and contrast relationship test: are the same categories applied to two subjects? Yes — how each garden cools, treated one after the other. That is the block pattern.',
        'The student read one tile and named the mosaic. The cause and effect link inside S2 is real, but it is nested inside a comparison; the comparison is what holds the three sentences together.',
        'Correct the label and keep the nuance: the dominant structure is compare and contrast, and the causal detail is doing work for subject A only.',
      ],
      answer:
        'The excerpt is compare and contrast overall — "because" governs only a detail inside sentence two, while S1 sets up two subjects and S2 and S3 treat them in matching terms',
      estimatedMinutes: 3,
    },
    {
      id: 'try-identify-structure',
      kind: 'try_yourself',
      problem:
        'Read the excerpt: "After the Halvern Creek dam was removed, the water temperature downstream dropped by three degrees in a single season. The cooler water allowed native trout eggs to survive at rates the county biologists had not recorded in forty years." What is the dominant structure of this excerpt?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Cause and effect', correct: true },
        { id: 'b', text: 'Problem and solution' },
        { id: 'c', text: 'Chronological sequence' },
        { id: 'd', text: 'Description' },
      ],
      expectedAnswer: 'Cause and effect',
      hints: [
        'Try the rewrite test: can you restate the excerpt as "X happened, so Y happened" without misrepresenting it?',
        'The removal drops the temperature, and the drop lets the eggs survive — a chain of consequences. No difficulty is named and no fix is proposed, which rules out problem and solution.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-why-this-structure',
      kind: 'try_yourself',
      problem:
        'An article written for parents lays out two after-school tutoring programs, Brightpath and Study Hall, working through cost, then schedule, then class size, then results — covering both programs under each heading. Why would the author choose compare and contrast for this piece?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Because the reader has a choice to make, and matching categories side by side makes the differences easy to weigh', correct: true },
        { id: 'b', text: 'Because the reader needs the founding of each program told in the order it happened' },
        { id: 'c', text: 'Because the article must explain what caused each program to be created' },
        { id: 'd', text: 'Because compare and contrast is the clearest structure for any nonfiction article' },
      ],
      expectedAnswer: 'Because the reader has a choice to make, and matching categories side by side makes the differences easy to weigh',
      hints: [
        'Ask what the parents reading this article actually need to do when they finish it.',
        'Structure serves purpose. One option names a job the comparison performs for the reader; the others name jobs a different structure would do, or claim one structure is always best.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-goal-to-structure',
      kind: 'try_yourself',
      problem:
        'You are writing a piece for the Millbrook town newsletter about the flooding that keeps closing Depot Street, and you want to finish by recommending the drainage upgrade the public works office has proposed. Which structure fits that goal best?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Chronological sequence' },
        { id: 'b', text: 'Problem and solution', correct: true },
        { id: 'c', text: 'Compare and contrast' },
        { id: 'd', text: 'Description' },
      ],
      expectedAnswer: 'Problem and solution',
      hints: [
        'Name the two jobs the piece has to do: establish something is wrong, and push the reader toward one specific action.',
        'A flood timeline would explain what happened without arguing for the upgrade, and a description of Depot Street would not move anyone. Only one structure ends on a fix.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-dates-mean-chronological',
      kind: 'misconception_check',
      question:
        'A student reads a two-paragraph profile of a bridge that mentions the year it opened and the year it was repainted, and concludes: "There are dates in it, so the structure is chronological." What went wrong?',
      commonErrors: [
        {
          answer: 'The passage contains dates, so it must be organized chronologically',
          misconception: 'Treating an isolated signal — a date, a "because," a "however" — as the label for the whole text.',
          correctsTo:
            'Dates are signal words, and signal words are hints, not verdicts. Chronological structure means TIME is what orders the parts: remove the sequence and the text falls apart. In a profile, the dates are simply two more facts about one subject, sitting alongside its span, its color, and its traffic count. Those facts are siblings rather than a chain, which makes the structure description.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Five patterns: chronological, cause and effect, compare and contrast, problem and solution, and description.',
        'Signal words are evidence, not proof — when the words and the idea-relationships disagree, trust the relationships.',
        'One connective describes a link between two sentences; structure describes how the whole text is put together, so never label a text from a single "because" or "however."',
        'Most real nonfiction mixes patterns; name the dominant one and treat the rest as detail work inside it.',
        'Finish the job by asking why: comparison helps a reader judge, problem and solution pushes toward action, chronology makes a process followable, cause and effect explains.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '7', cedTopic: '7.3', cedTitle: 'Nonfiction Text Structures' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
