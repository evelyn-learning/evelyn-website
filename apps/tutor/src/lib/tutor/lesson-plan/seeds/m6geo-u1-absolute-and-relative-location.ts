/**
 * Grade 6 World Geography — Thinking Like a Geographer & Spatial Skills:
 * Absolute & Relative Location.
 *
 * CONCEPT-LED exemplar shape (this row builds meaning where the student has
 * no procedure to lean on, matching the fan-out contract's own grouping of
 * "site/situation"-style rows). National Geography Standard 1. The lesson
 * installs one contrast: an absolute location is a place's exact, fixed spot,
 * true no matter who describes it or where they are standing; a relative
 * location describes a place by its distance and direction from another,
 * already-known place. Two traps this plan is built to kill: assuming any
 * description that mentions a place name must be relative, and assuming a
 * description that contains a number must be absolute.
 *
 * SCOPE GUARD: this row distinguishes a fixed address from a nearness-based
 * description and has the student describe an invented place using both. It
 * names NO kind of coordinate mechanics: no degrees, no hemisphere letters,
 * no coordinate pair is ever written or read anywhere in this file. Reading
 * or writing a full latitude-longitude coordinate pair, and the ranges those
 * numbers run through, is Grade 7 (`m7geo-u1-latitude-longitude-and-location.ts`)
 * and must not appear here. What IS deliberately allowed, because the row's
 * own scope line names it: the word "coordinate" appears once, defined only
 * as "a fixed grid of numbers that mapmakers use to mark one exact spot" --
 * a naming fact about absolute location's second common form, with no number,
 * no degree sign and no notation of any kind attached to it. Sideways, this
 * row stops before the neighboring Grade 6 row 1.4 (`site-and-situation`,
 * to be authored in this same fan-out): this file never describes a place's
 * physical characteristics at its exact spot (that is "site") and never uses
 * a place's surroundings to reason about why a settlement formed there (that
 * is "situation" and its settlement-pattern payoff). This file only teaches
 * the two ways to STATE where a place is; row 1.4 teaches what a place's
 * exact spot is physically like and uses its surroundings to explain why
 * people settled there.
 *
 * DEPTH CEILING NOTE FOR THE FAN-OUT: every item here is answered by DEFINE,
 * IDENTIFY or CLASSIFY. Nothing here measures a location, and nothing asks
 * why a location system works the way it does. If a sentence you write for
 * your own row would sit comfortably in a Grade 7 file on the same subject,
 * it is over the ceiling.
 *
 * CHECK-MOVE NOTE: this row's worked examples use a variant not printed in
 * either shipped exemplar, because neither of the two standardized moves
 * (three-independent-clues; rewind-then-contrast) fits a classification task
 * directly. The move used here is the rewind-then-contrast family's own
 * cousin: after classifying a description, the check swaps in a DIFFERENT
 * reference point (or a different address) and confirms the classification
 * still holds -- the geography equivalent of testing a routine on a case that
 * must come out the same way, so the student cannot overlearn one example.
 *
 * ANSWER-CUE NOTE: written against deferred finding DF-3 (in the shipped
 * Grade 7 Geography bank the keyed answer was the strictly longest choice 67%
 * of the time, and 94% at difficulty 4; chance with four choices is 25%). The
 * PER-ITEM discipline is the point: every distractor here states a full wrong
 * reason rather than a short wrong label, and no key was built to be the
 * longest choice BECAUSE it is the key. Measured as a diagnostic, not as a
 * score to minimize: the key is the strictly longest choice in exactly ONE of
 * the three items (item 3), and character counts for all twelve choices are
 * reported in the authoring notes returned with this file. Zero is NOT the
 * target -- see the note in `m6geo-u3-earths-moving-plates.ts`. The three keys
 * sit at ids b, c and d, which is the id set `(1 + 3) mod 4 = 0` requires,
 * omitting a.
 *
 * NOTE ON prerequisites/followUps: this row's real chain is
 * `m6geo.mental-maps-and-spatial-thinking` -> this row ->
 * `m6geo.site-and-situation`, taken from the signed curriculum's row order.
 * Both neighbors are authored in the fan-out that follows this commit, so the
 * lint will not be able to resolve them until the full 40-row batch is
 * registered together -- that registration-order gap is expected, per the
 * fan-out contract, and is not a defect in this file.
 *
 * There are NO MAPS AND NO IMAGES in this course. Every item is solvable from
 * the words printed inside it.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6GEO_U1_ABSOLUTE_AND_RELATIVE_LOCATION: LessonPlan = {
  id: 'evelyn.ms.m6geo.absolute-and-relative-location.v1',
  title: 'Absolute & Relative Location',
  curriculum: 'MS',
  grade: '6',
  subject: 'social-studies',
  topic: 'grade-6-world-geography',
  locale: 'en',
  los: [
    {
      id: 'm6geo.absolute-and-relative-location',
      standard: 'M6GEO-1.3',
      description:
        'Distinguish an absolute location (a fixed address or coordinate) from a relative location (described by nearness to another place) and describe a place using both, without yet reading or writing a full latitude-longitude coordinate (National Geography Standard 1: how to use maps and other geographic representations to acquire, process and report information).',
    },
  ],
  prerequisites: ['m6geo.mental-maps-and-spatial-thinking'],
  followUps: ['m6geo.site-and-situation'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that there are two different, equally useful ways to tell someone where a place is.',
      script:
        'A friend calls and asks where you are. You could say "right next to the popcorn machine," and if your friend already knows the movie theater, that works perfectly. Now imagine a delivery driver needs to bring a package to your house from clear across the country. "Next to the popcorn machine" is useless to that driver -- they need your exact street address instead. Neither way of describing a place is the wrong way. They are two different tools, and today you learn exactly when each one does its job.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-two-kinds-of-location',
      kind: 'concept',
      goal: 'Install the absolute/relative contrast, both common forms of absolute location, and the one-fixed-spot-versus-many-descriptions idea.',
      keyIdeas: [
        'THERE ARE TWO DIFFERENT WAYS TO SAY WHERE A PLACE IS. Geographers call them ABSOLUTE LOCATION and RELATIVE LOCATION. Neither one is the better tool -- each answers the question "where is it?" in a different way, and a full description of a place often uses both.',
        'AN ABSOLUTE LOCATION IS A PLACE\'S EXACT, FIXED SPOT. It does not depend on who is describing it or where that person happens to be standing. A street address is one common kind of absolute location: a house number and a street name point to one exact building, and that address points to the same building whether the person reading it is standing right outside or a thousand miles away.',
        'A COORDINATE IS THE OTHER COMMON KIND OF ABSOLUTE LOCATION. Mapmakers agree on a fixed grid of numbers that marks one exact spot on Earth, so that the same set of numbers means the same exact spot to everyone who reads it. Like a street address, a coordinate does not depend on who is looking at it or where they are standing.',
        'A RELATIVE LOCATION DESCRIBES A PLACE BY HOW NEAR IT IS TO SOMETHING ELSE. A relative location gives a distance and a direction from another, already-known place -- for example, describing a bakery as "two doors down from the pet shop," or a town as "just west of the lake." The description only makes sense once you already know where that other place is.',
        'RELATIVE LOCATION ONLY WORKS IF THE LISTENER ALREADY KNOWS THE REFERENCE POINT. The place being used to describe another place is called a REFERENCE POINT. If a listener has never heard of the pet shop, "two doors down from the pet shop" tells them nothing at all. A street address does not have that problem, because it points to the same exact spot no matter what the listener already knows.',
        'ONE PLACE HAS ONLY ONE ABSOLUTE LOCATION, BUT IT CAN HAVE MANY RELATIVE LOCATIONS. Depending on which reference point someone chooses, the relative description of a place can change completely -- the very same building could correctly be called "next to the school" by one person and "across the street from the bakery" by another. Both can be true at once. The building\'s absolute location never changes, because it does not depend on a reference point at all.',
      ],
      vocabulary: [
        { term: 'absolute location', definition: 'the exact, fixed position of a place, true no matter who describes it or where they are standing.' },
        { term: 'relative location', definition: 'the position of a place described by its distance and direction from another, already-known place.' },
        { term: 'reference point', definition: 'the already-known place that a relative location is described in relation to.' },
        { term: 'coordinate', definition: 'a set of fixed numbers, agreed on by mapmakers, that marks one exact spot so it means the same spot to everyone.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-classify-two-sentences',
      kind: 'worked_example',
      problem:
        'A magazine describes a bakery two different ways: "The bakery is at 42 Willow Street" and "The bakery is two doors down from the pet shop." Identify which sentence is an absolute location and which is a relative location, and explain how you know.',
      steps: [
        'Look at the first sentence. "42 Willow Street" is a house number and a street name -- a street address. It does not mention any other place at all, and it does not depend on where the reader is standing. That makes it an absolute location.',
        'Look at the second sentence. "Two doors down from the pet shop" names another place, the pet shop, and gives a distance ("two doors") and a direction ("down," along the row of shops) from it. Because the description depends on a reference point, that makes it a relative location.',
        'Check the first sentence by asking whether it needs anything else to work. Could you find the bakery from "42 Willow Street" alone, with no other information? Yes -- the address points to one exact building by itself, which confirms it is absolute.',
        'Check the second sentence the same way. Could you find the bakery from "two doors down from the pet shop" if you had never heard of the pet shop? No -- without already knowing where the pet shop is, the sentence tells you nothing. That confirms it depends on a reference point, which is what makes it relative.',
        'Now swap in a different reference point and see whether the classification still holds. Someone else might describe the very same bakery as "across the street from the movie theater." That is a completely different sentence, but it still needs a reference point (the movie theater) to work, so it is still a relative location. Changing the reference point changes the sentence -- it never changes which kind of location the sentence is.',
      ],
      answer:
        '"42 Willow Street" is the absolute location, because it is a fixed address that does not depend on any other place. "Two doors down from the pet shop" is the relative location, because it only makes sense once you already know where the pet shop is.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-fix-the-mixed-up-reasoning',
      kind: 'worked_example',
      problem:
        'A student writes: "The tree house is an absolute location, because it sits exactly behind Mia\'s house." Explain what is wrong with that reasoning, and then write a true absolute location and a true relative location for the same tree house.',
      steps: [
        'WRONG: "The tree house is an absolute location, because it sits exactly behind Mia\'s house." Look at what the sentence actually depends on: it names a reference point, Mia\'s house, and a direction, "behind." Depending on knowing where another place is is exactly what makes a description relative, not absolute.',
        'CORRECT: "Behind Mia\'s house" is a relative location, because it only works for someone who already knows where Mia\'s house is. The word "exactly" does not change that. Being precise and being fixed are not the same thing -- "exactly behind Mia\'s house" is a very precise relative description, but it still depends on Mia\'s house, so it is still relative.',
        'Now write the tree house\'s absolute location. For example: "612 Birchwood Lane." A fixed address like this stays the same no matter who is describing the tree house or where they are standing.',
        'Now write the tree house\'s relative location. For example: "right behind Mia\'s house." This description uses a nearby, already-known place as its reference point.',
        'Check both by asking the same question each time: does the description depend on a reference point? "612 Birchwood Lane" does not, so it is absolute. "Right behind Mia\'s house" does, so it is relative. Swap the address for a different fake address and the check still comes out the same way: a fixed address is always absolute, no matter which address it is.',
      ],
      answer:
        'The student is wrong because "behind Mia\'s house" depends on a reference point (Mia\'s house), which makes it a relative location, not an absolute one. A true absolute location for the tree house is a fixed address such as "612 Birchwood Lane." A true relative location for the same tree house is "right behind Mia\'s house."',
      estimatedMinutes: 3,
    },
    {
      id: 'try-classify-the-address',
      kind: 'try_yourself',
      problem: 'A tour guide says: "The museum sits at 88 Harbor Street." Which choice best describes that statement?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'It is a relative location, because the street\'s name mentions a harbor, which must mean the museum sits close to the water.' },
        { id: 'b', text: 'It is an absolute location, because a street address points to one exact building no matter who is describing it.', correct: true },
        { id: 'c', text: 'It is a relative location, because it gives an exact number that most people would not know already.' },
        { id: 'd', text: 'It is an absolute location, because it includes a number, and numbers always describe an absolute location.' },
      ],
      expectedAnswer: 'It is an absolute location, because a street address points to one exact building no matter who is describing it.',
      hints: [
        'Ask whether the statement depends on knowing some other, separate place first, or whether it stands on its own.',
        'A street address does not mention any other place at all. A description that depends on a reference point -- or that is only picked because it has a number in it -- is not automatically the right answer.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-pick-the-relative-one',
      kind: 'try_yourself',
      problem: 'Which sentence gives a relative location for a farm?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The farm covers a wide, flat field, with a pond at one edge.' },
        { id: 'b', text: 'The farm is located at 215 County Road 9.' },
        { id: 'c', text: 'The farm sits just past the old red barn, on the right.', correct: true },
        { id: 'd', text: 'The farm has been owned by the same family for many years.' },
      ],
      expectedAnswer: 'The farm sits just past the old red barn, on the right.',
      hints: [
        'A relative location has to name another, already-known place and give a distance or direction from it.',
        'Describing what a place looks like is not the same as saying where it is, and neither is a fact about who owns it. A fixed address is a location, but it is the other kind.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-one-place-many-descriptions',
      kind: 'try_yourself',
      problem:
        'A hospital has one official address. One person says the hospital is "across the street from the library." A different person says the same hospital is "right next to the fire station." What does this tell you about relative and absolute location?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The hospital\'s absolute location changed between the two descriptions, since the two sentences do not match each other.' },
        { id: 'b', text: 'The hospital does not have a real absolute location, since two different relative locations were both used to describe it.' },
        { id: 'c', text: 'The two relative locations cannot both be true at once, because a hospital can only be described in relation to one other place.' },
        { id: 'd', text: 'A single place can have many different relative locations, one for each reference point chosen, while its absolute location never changes.', correct: true },
      ],
      expectedAnswer: 'A single place can have many different relative locations, one for each reference point chosen, while its absolute location never changes.',
      hints: [
        'Both sentences are relative locations, since both name a separate reference point. Ask whether two relative descriptions of the same place are allowed to both be true.',
        'A place\'s address does not change just because two different people picked two different nearby landmarks to describe it by.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-name-means-relative-and-one-gives-the-other',
      kind: 'misconception_check',
      question:
        'A student says: "42 Willow Street is a relative location, because it has a street name that tells you where things are nearby. And once you know a place\'s relative location, you also know its absolute location." What is wrong with each part of that?',
      commonErrors: [
        {
          answer: '42 Willow Street is a relative location, because it has a street name.',
          misconception:
            'Assuming that any description containing a place name must be relative, instead of checking whether the description depends on a SEPARATE, already-known place.',
          correctsTo:
            'A street address does not depend on knowing some other place first -- it points to one exact building whether or not the reader knows anything else nearby. That makes it an absolute location, not a relative one. WRONG: "a street name makes a description relative." CORRECT: "a description is relative only when it depends on a separate reference point, such as another named place."',
        },
        {
          answer: 'Once you know a place\'s relative location, you also know its absolute location.',
          misconception:
            'Believing the two kinds of location carry the same information, so that knowing one automatically hands you the other.',
          correctsTo:
            'A relative location such as "next to the library" does not give you the exact address of either place -- it only tells you how the two places sit next to each other. The two kinds of location answer different questions: an absolute location gives one exact, fixed spot, and a relative location gives a distance and direction from another known place. Knowing a place\'s relative location does not hand you its absolute location.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'An absolute location is a place\'s exact, fixed spot, true no matter who describes it or where they are standing.',
        'A street address and a coordinate (a fixed grid of numbers mapmakers agree on) are both common kinds of absolute location.',
        'A relative location describes a place by its distance and direction from another, already-known place, called a reference point.',
        'A relative location only works if the listener already knows the reference point. An absolute location does not have that problem.',
        'One place has only one absolute location, but it can have many different relative locations, one for each reference point chosen.',
        'A number appearing in a description does not automatically make it absolute, and a place name appearing in a description does not automatically make it relative -- check whether the description depends on a separate reference point.',
        'A full description of a place often uses both an absolute location and a relative location together.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '1', cedTopic: '1.3', cedTitle: 'Absolute & Relative Location' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
