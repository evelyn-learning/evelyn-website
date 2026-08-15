/**
 * HS English — Style & Word Choice: Precise & Concise Wording.
 *
 * The revision skill that makes every other piece of writing in the course
 * land harder (CCSS L.9-10.3, W.9-10.5): replace vague or padded phrasing
 * with exact, economical wording — cutting redundancy, empty openers, and
 * filler — while protecting the meaning the sentence has to carry. Every
 * practice item is a revision-choice MCQ over original prose.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_ENGL_U4_PRECISION_AND_CONCISION: LessonPlan = {
  id: 'evelyn.hs.engl.precision-and-concision.v1',
  title: 'Precise & Concise Wording',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'ela',
  topic: 'hs-english',
  locale: 'en',
  los: [
    {
      id: 'engl.precision-and-concision',
      standard: 'ENGL-4.1',
      description:
        'Revise vague or wordy phrasing into precise, economical wording by cutting redundancy, empty openers, and padding and by replacing weak verb-plus-noun constructions with exact ones, without dropping meaning the sentence must keep (CCSS L.9-10.3, W.9-10.5).',
    },
  ],
  prerequisites: ['engl.dashes-parentheses-quotation'],
  followUps: ['engl.connotation-and-denotation'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame precision and concision as the skill that decides whether real readers finish what you wrote — word limits, announcements, and messages people actually act on.',
      script:
        'Every college application essay you will ever write comes with a hard word limit, and every one of those limits is smaller than the story you want to tell. Same problem, smaller stakes: the club announcement nobody reads past line two, or the message to a coach that buries the one thing you needed to ask. Wordiness is not just a style flaw. It costs you space you needed and attention you had. Today you learn to squeeze a sentence down to exactly what it means, and, just as important, to notice the moment when squeezing has gone one word too far and taken the meaning with it.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-precise-and-concise',
      kind: 'concept',
      goal: 'The redundancy and padding patterns, the vague-to-precise upgrade, and the shortest-option principle together with the limit that governs it.',
      keyIdeas: [
        'TWO DIFFERENT JOBS — PRECISE means the words name exactly what you mean; CONCISE means no word is doing nothing. A sentence can be short and still vague ("It went badly"), or long and still exact. Good revision does both jobs at once.',
        'REDUNDANT PAIRS — two words repeating one idea: "each and every", "end result", "past history", "unexpected surprise", "close proximity", "merged together", "final outcome", "basic essentials", "free gift". Keep one half, delete the other. WORDY: "The end result of each and every rehearsal was exhaustion." TIGHT: "Every rehearsal ended in exhaustion."',
        'EMPTY THROAT-CLEARING OPENERS — phrases that warm up the sentence without saying anything: "due to the fact that" becomes "because"; "in order to" becomes "to"; "at this point in time" becomes "now"; "the reason why is because" becomes "because"; "it is important to note that" and "in my personal opinion" can usually be deleted whole.',
        'PADDING AND WEAK INTENSIFIERS — "very", "really", "quite", "somewhat", "basically", "actually", "the fact that" rarely add meaning. WORDY: "The plan was very unique and really quite effective." TIGHT: "The plan was unique and effective." When an intensifier feels necessary, the fix is usually a stronger word, not a bigger booster.',
        'VAGUE VERB PLUS NOUN, ONE PRECISE VERB — English hides strong verbs inside noun phrases. "Made a decision" becomes "decided"; "gave an explanation of" becomes "explained"; "conducted an investigation into" becomes "investigated"; "has the ability to" becomes "can". The precise verb is shorter AND clearer, which is why this is the highest-value single move in revision.',
        'VAGUE NOUNS AND ADJECTIVES — "thing", "stuff", "aspect", "factor", "good", "bad", "interesting", "a lot" ask the reader to guess. VAGUE: "The article had some interesting things about the water problem." PRECISE: "The article explained how the reservoir lost a third of its capacity."',
        'THE SHORTEST-OPTION PRINCIPLE — when two versions are both grammatical and mean the same thing, the shorter one is almost always better. This is a strong default, not a law.',
        'THE LIMIT ON THAT PRINCIPLE — shorter wins only while the meaning survives. A cut is too deep when it drops a fact the reader needs (a number, a date, a name, a qualifier like "after the storm"), when it flattens a specific claim into a general one, or when what is left is no longer a complete, correct sentence. Check grammar first, meaning second, length third.',
      ],
      vocabulary: [
        { term: 'redundancy', definition: 'saying the same thing twice in different words, as in "end result" or "unexpected surprise".' },
        { term: 'wordiness', definition: 'using more words than the idea requires, even when nothing is outright repeated.' },
        { term: 'precision', definition: 'choosing words that name exactly what is meant, so the reader does not have to guess.' },
      ],
      suggestedTools: ['show_text'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-wordy-to-tight',
      kind: 'worked_example',
      problem:
        'Revise this sentence for precision and concision: "Due to the fact that the volunteers made a decision to start earlier, the end result of the cleanup was that a lot of trash got picked up along the whole entire riverbank."',
      steps: [
        'Sweep for empty openers first: "Due to the fact that" is throat-clearing. Replace it with "Because" and four words become one.',
        'Sweep for the buried verb: "made a decision to start" is a vague verb plus a noun hiding the real action. It becomes "decided to start", or simply "started earlier" if the deciding is not the point.',
        'Sweep for redundant pairs: "the end result" repeats itself, and "the whole entire riverbank" stacks two words that both mean all of it. Keep "the result" and "the entire riverbank" — or cut both down further.',
        'Sweep for vague wording: "a lot of trash got picked up" is imprecise and passive. Name who acted and what changed: "the volunteers cleared the entire riverbank".',
        'Assemble the tight version: "Because the volunteers started earlier, they cleared trash from the entire riverbank." Thirty-two words become thirteen, and every surviving word carries meaning.',
        'Verify nothing required was lost: the cause (an earlier start), the actor (the volunteers), the action (clearing trash), and the scope (the entire riverbank) all remain.',
      ],
      answer:
        'Because the volunteers started earlier, they cleared trash from the entire riverbank.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-over-cutting-trap',
      kind: 'worked_example',
      problem:
        'A student is revising this sentence: "The debate club, which had won only two rounds in three years, took first place at the regional tournament in March." Applying the rule "shortest is best", the student proposes: "The club won." Is that the better revision?',
      steps: [
        'Check the grammar of the short version. "The club won." is a complete, correct sentence, so it passes the first test. Shortness alone is not the problem here.',
        'Now check the meaning, item by item. The original names WHICH club (debate), the history that makes the win surprising (only two rounds in three years), the result (first place), the event (regional tournament), and the time (March).',
        'The proposed revision keeps one of those five and deletes four. "The club won." does not tell the reader which club, what it won, or why the win matters. This is the OVER-CUT error: the sentence got shorter by dropping the content, not the padding.',
        'Ask the real revision question instead: which words are doing no work? Scan the original — "which had won only two rounds in three years" carries the contrast, "regional tournament" identifies the event, "in March" fixes the time. None of it is filler, so there is little to cut.',
        'A defensible tightening trims structure without losing facts: "After winning only two rounds in three years, the debate club took first place at March\'s regional tournament." That is shorter than the original AND keeps every fact.',
        'State the principle the student misapplied: shortest wins only among versions that are equally correct and equally complete in meaning. "The club won." is shorter but says less, so it never entered the competition.',
      ],
      answer:
        'No — "The club won." is over-cut. It drops four required facts. A revision like "After winning only two rounds in three years, the debate club took first place at March\'s regional tournament." is shorter than the original while keeping the meaning.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-redundancy-and-padding',
      kind: 'try_yourself',
      problem:
        'A student newspaper draft reads: "Due to the fact that the new schedule was announced very late, each and every one of the fall clubs had to make a change to their first meeting date." Which revision is most precise and concise?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Because the new schedule was announced late, every fall club had to reschedule its first meeting.', correct: true },
        { id: 'b', text: 'Due to the fact that the schedule came out late, each and every fall club had to make a change to their first meeting date.' },
        { id: 'c', text: 'The schedule was late, so clubs changed things.' },
        { id: 'd', text: 'Because the new schedule was announced late, every fall club canceled its first meeting.' },
      ],
      expectedAnswer:
        'Because the new schedule was announced late, every fall club had to reschedule its first meeting.',
      hints: [
        'Two padding patterns are in the original: an empty opener and a redundant pair. Which choice removes both?',
        'Choice C cuts so far that "clubs changed things" no longer says what changed, and choice D swaps rescheduling for canceling — a different event. The winner tightens the wording and leaves the meaning untouched.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-buried-verb',
      kind: 'try_yourself',
      problem:
        'A lab write-up reads: "Our group conducted an investigation into the reason why the seedlings in the north window had the tendency to grow at a slower rate." Which revision is most precise and concise?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Our group did an investigation into why the north-window seedlings tended to grow slower.' },
        { id: 'b', text: 'We investigated why the seedlings in the north window grew more slowly.', correct: true },
        { id: 'c', text: 'We looked into some stuff about the seedlings.' },
        { id: 'd', text: 'We investigated why the seedlings grew more slowly.' },
      ],
      expectedAnswer: 'We investigated why the seedlings in the north window grew more slowly.',
      hints: [
        'Find the strong verb hiding inside a noun phrase: "conducted an investigation into" can collapse into one word.',
        'Choice D is the shortest, but it drops which seedlings — the north window is the whole point of the comparison. Shortest wins only when no required detail disappears.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-shortest-loses-meaning',
      kind: 'try_yourself',
      problem:
        'A club announcement reads: "The bake sale, which raised four hundred dollars for the animal shelter last spring, will return on the first Friday of October." Which revision is most precise and concise?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The bake sale is happening again.' },
        { id: 'b', text: 'The bake sale, which raised four hundred dollars for the animal shelter last spring, will happen again in the fall at some point.' },
        { id: 'c', text: 'The bake sale, which raised four hundred dollars for the animal shelter last spring, returns on the first Friday of October.', correct: true },
        { id: 'd', text: 'The bake sale returns on the first Friday of October.' },
      ],
      expectedAnswer:
        'The bake sale, which raised four hundred dollars for the animal shelter last spring, returns on the first Friday of October.',
      hints: [
        'Ask what each version keeps: the amount raised, the cause it supported, and the exact return date are all facts a reader of an announcement needs.',
        'Choices A and D are shorter but delete required information, and choice B trades the exact date for the vague "in the fall at some point". The winner cuts only the padding: "will return on" becomes "returns on".',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-shortest-always-wins',
      kind: 'misconception_check',
      question:
        'A student revises "The storm knocked out power to nine hundred homes on Tuesday night" down to "The storm caused problems" and defends it: "You told us shorter is better, and this is way shorter." What went wrong?',
      commonErrors: [
        {
          answer: 'The shorter version is better because concision means fewer words',
          misconception: 'Treating "fewest words" as the goal, instead of "fewest words that still carry the full, exact meaning".',
          correctsTo:
            'Concision cuts words that do no work — it never cuts facts. WRONG: "The storm caused problems" deletes the damage, the scale, and the time, and replaces the precise "knocked out power" with the vague "caused problems", which is a loss of precision on top of a loss of information. CORRECT: keep the facts and trim only padding, as in "Tuesday night\'s storm cut power to nine hundred homes." Grammar first, meaning second, length third.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Precise and concise are two jobs: name exactly what you mean, and make every word earn its place.',
        'Cut on sight — redundant pairs ("end result", "each and every"), empty openers ("due to the fact that" becomes "because"), and filler intensifiers ("very", "really", "basically").',
        'Collapse a vague verb plus noun into one precise verb: "made a decision" becomes "decided", "conducted an investigation into" becomes "investigated".',
        'Shorter wins only among versions that are equally grammatical and equally complete: if a cut drops a fact, a qualifier, or a specific claim, the longer version is the right one.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '4', cedTopic: '4.1', cedTitle: 'Precise & Concise Wording' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
