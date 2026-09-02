/**
 * Grade 6 World Geography — Place & Perception: How People Perceive Places
 * Differently.
 *
 * CONCEPT-LED exemplar-following lesson for the m6geo fan-out (National
 * Geography Standard 6). The whole lesson installs one picture: the very same
 * place can be described in two different, equally true ways, because a
 * description is built out of the describer's own experience, not out of the
 * place changing. The recurring pair is a resident (shaped by routine) and a
 * visitor (shaped by newness and by whatever place they are already used to
 * comparing things to).
 *
 * THE SHARPEST HAZARD FOR THIS ROW, AND HOW THIS FILE HANDLES IT: a lesson
 * about differing perception is the easiest lesson in the course to write an
 * item whose key is a matter of opinion, or that quietly says one person's
 * view is the true one. Every keyed answer in this file is forced by a fact
 * the scenario STATES about that one person's experience -- how long they
 * have been somewhere, what they do there routinely, or what they are already
 * used to comparing it to -- and never by a claim about personality, honesty,
 * or which person is right. Every distractor set also spends one slot on each
 * of the two specific wrong moves this hazard invites: (a) treating one
 * person's perception as the single correct fact about the place, and (b)
 * explaining the difference by character ("more observant," "more
 * sociable," "exaggerating") instead of by stated experience. The
 * misconception check targets exactly those same two moves directly.
 *
 * SCOPE GUARD: this row explains only THAT two people's different, STATED
 * experiences with the very same place can lead them to describe it
 * differently, using a resident/visitor pair as the running example. It names
 * NO typology of region and sorts nothing into a category of region. The
 * formal/functional/perceptual region typology -- including the term
 * "perceptual region" itself -- and the adapt/modify/depend
 * human-environment-interaction framework both belong to Grade 7
 * (`m7geo-u1-regions-and-place.ts`) and neither appears here. Sideways: what
 * makes a place unique by its physical and human characteristics is Grade 6
 * row 8.1 (`what-makes-a-place-unique`) and stays out of this file; comparing
 * two different places side by side is Grade 6 row 8.3
 * (`comparing-two-places`) and also stays out -- this row keeps both
 * descriptions pointed at the SAME single place throughout. What IS
 * deliberately built here, because those two neighbors sit close: naming that
 * a resident and a visitor can describe one place differently, and tracing
 * that difference to routine versus newness, without ever ranking the two
 * descriptions or turning them into a named category of place. Every person
 * and every place in this lesson is invented -- Millbrook, Fenwick,
 * Rivergate, Cliffend, and Sedge Harbor are not real towns, and Talia, Rohan,
 * Deshawn, Priya, Amara, and Ben are not real people -- which removes the
 * locality-care and register risks this course has hit before, since this
 * row's own subject (a resident's view versus a visitor's view) does not need
 * a real place to teach.
 *
 * DEPTH CEILING NOTE FOR THE FAN-OUT: every keyIdea and every item is answered
 * by DEFINE or IDENTIFY -- what perception is, and which stated fact a given
 * description traces to. There is no closed typology, no causal chain longer
 * than one link (routine makes a path feel fast; newness makes a hill feel
 * steep), and nothing that would sit comfortably in the Grade 7 file on
 * regions and place without anyone noticing it came from Grade 6.
 *
 * CHECK-MOVE NOTE: the wave's two standardized geography check moves (three
 * independent clues of different kinds; rewind the input, then test a
 * contrasting case) were built for a physical-evidence claim and a
 * location-routine claim, and neither fits an experience-tracing claim about
 * people cleanly. Both worked examples below use an adapted third move that
 * does the same job in this row's idiom: confirm the explanation rests ONLY
 * on a fact the scenario states, then swap which person has which stated
 * experience and confirm the description would swap with it -- which shows
 * the difference tracks the experience, not the particular person. Flagged in
 * the report as an invented equivalent, per the contract's instruction to say
 * so when neither named variant fits.
 *
 * ANSWER-CUE NOTE: written against deferred finding DF-3 (in the shipped
 * Grade 7 Geography bank the keyed answer was the strictly longest choice 67%
 * of the time, rising to 94% at difficulty 4; chance with four choices is
 * 25%). Every distractor here states a full wrong reason rather than a short
 * wrong label, and no key was built to be the longest choice BECAUSE it is
 * the key. Character counts and the longest-key count are reported in the
 * fan-out report, not summarized here, since the count is a diagnostic to
 * report rather than a target to hit. The three keys sit at ids a, b and d --
 * the id set `(8 + 2) mod 4 = 2` requires, omitting c.
 *
 * NOTE ON prerequisites/followUps: unlike the two hand-written exemplars
 * (whose chain arrays were left empty only because they were registered alone
 * before their neighbors existed), this row's brief supplies real, already
 * anchored neighbors -- row 8.1 as prerequisite and row 8.3 as followUp --
 * and both are populated below.
 *
 * There are NO MAPS AND NO IMAGES in this course. Every item is solvable from
 * the words printed inside it.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6GEO_U8_HOW_PEOPLE_PERCEIVE_PLACES_DIFFERENTLY: LessonPlan = {
  id: 'evelyn.ms.m6geo.how-people-perceive-places-differently.v1',
  title: 'How People Perceive Places Differently',
  curriculum: 'MS',
  grade: '6',
  subject: 'social-studies',
  topic: 'grade-6-world-geography',
  locale: 'en',
  los: [
    {
      id: 'm6geo.how-people-perceive-places-differently',
      standard: 'M6GEO-8.2',
      description:
        "Explain, using a described scenario, how two people's different experiences (such as a resident's and a visitor's) can lead them to describe the very same place differently (National Geography Standard 6: how culture and experience influence people's perceptions of places and regions).",
    },
  ],
  prerequisites: ['m6geo.what-makes-a-place-unique'],
  followUps: ['m6geo.comparing-two-places'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the student notice that a description of a place says as much about the describer as about the place before any vocabulary arrives.',
      script:
        'Think about the room you are sitting in right now. If a person who has never been in this room before walked in, what would they notice first? Maybe a smell you stopped noticing years ago, or a window that lets in more light than they are used to at home. Now think about you. You could probably walk through this room with your eyes closed. Same room, two very different descriptions -- and here is the strange part: neither description would be wrong. Today you find out why the very same place can honestly look like two different places, depending on who is looking at it and what that person has already experienced.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-perception-and-experience',
      kind: 'concept',
      goal: 'Install perception as experience-built, the resident/routine and visitor/newness patterns, the equal-validity rule, and the practice of tracing a description back to a stated fact about experience.',
      keyIdeas: [
        "PERCEPTION IS HOW ONE PARTICULAR PERSON UNDERSTANDS OR DESCRIBES A PLACE, AND IT COMES FROM THAT PERSON'S OWN EXPERIENCE, NOT FROM THE PLACE ITSELF CHANGING. Two people standing in the very same spot can describe it in different ways, and both descriptions can be true at the same time, because each description is built out of what that one person has actually experienced there.",
        "A RESIDENT IS SOMEONE WHO LIVES IN A PLACE, AND A RESIDENT'S PERCEPTION IS SHAPED BY ROUTINE. Living somewhere means being there again and again, at different times, doing ordinary tasks. That routine teaches a resident things a short visit cannot -- which street stays quiet at night, which path is the fastest way across a square, which store opens earliest.",
        "A VISITOR IS SOMEONE EXPERIENCING A PLACE FOR THE FIRST TIME, AND A VISITOR'S PERCEPTION IS SHAPED BY NEWNESS. Nothing about the place is routine to a visitor yet, so a visitor notices things a resident stopped noticing long ago -- an unusual smell in the air, a building shaped unlike anything at home, a hill that stands out.",
        'A VISITOR ALSO, WITHOUT MEANING TO, COMPARES THE NEW PLACE TO WHATEVER PLACE THEY ARE ALREADY USED TO. The same hill looks steep to a visitor who is used to flat ground, and looks unremarkable to a visitor who is used to living among hills. The hill has not changed. What each visitor is used to comparing it to has.',
        "NEITHER PERCEPTION IS MORE CORRECT THAN THE OTHER. When a resident's description and a visitor's description of the same place do not match, that is not a disagreement to settle, and it does not mean either person made a mistake. Both are accurately reporting what their own experience of the place actually was.",
        'TO EXPLAIN WHY TWO PEOPLE PERCEIVE THE SAME PLACE DIFFERENTLY, POINT TO THE STATED EXPERIENCE BEHIND EACH VIEW. The reason traces to something specific about how each person has experienced the place -- how long they have been there, what they usually do there, or what they are used to comparing it to somewhere else -- never to one person being smarter, more honest, more observant, or simply right.',
      ],
      vocabulary: [
        { term: 'perception', definition: "the way one particular person understands or describes a place, built out of that person's own experience of it." },
        { term: 'resident', definition: 'a person who lives in a place and experiences it through routine, over and over, across many ordinary days.' },
        { term: 'visitor', definition: 'a person who is experiencing a place for the first time, or without a routine there.' },
        { term: 'familiar', definition: 'something a person has experienced often enough that it feels ordinary rather than noticeable.' },
        { term: 'point of comparison', definition: 'the place a person is already used to, which they measure a new place against without meaning to.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-market-square-fast-or-slow',
      kind: 'worked_example',
      problem:
        "In the invented town of Millbrook, a resident named Talia crosses the market square every day on her way to work. She says, \"The square is a quick shortcut.\" A visitor named Rohan is crossing the square for the first time. He says, \"This square is huge, and it takes forever to get across.\" Using only what the scenario states about each person's experience, explain why they describe the same square so differently.",
      steps: [
        'Start with what the scenario actually states about each person, not with a guess. It states that Talia crosses the square every day, and that Rohan is crossing it for the first time.',
        "Trace Talia's description to her stated experience. Because she crosses the square every day, she has learned exactly which path across it is fastest, and using that known path is what makes the square feel like a quick shortcut to her.",
        "Trace Rohan's description to his stated experience. Because this is his first time, he has no known path through the square yet, so he has to find his way as he goes, which takes longer and can make the same square feel large and slow to cross.",
        'Check that the explanation rests only on stated experience. Nothing in the scenario says Talia is a faster walker or that Rohan is easily confused -- the only stated facts are how often each of them has crossed the square, and that is enough to explain the difference on its own.',
        'Test the explanation by swapping who has which experience. If Rohan crossed the same square every day for a summer, he would very likely learn the same fast path Talia uses and start describing the square as quick too -- which confirms that the difference comes from the amount of experience with the square, not from anything about who Rohan or Talia are as people.',
        'State the conclusion. Both descriptions are accurate. Talia\'s routine taught her a fast path; Rohan has not yet had the chance to learn one. Neither person is wrong about the square.',
      ],
      answer:
        "Talia calls the square a quick shortcut because her daily routine has taught her the fastest path across it. Rohan calls it huge and slow because he is crossing it for the first time and has not yet learned a path through it. Both descriptions are accurate reports of what each person has actually experienced, and neither is more correct than the other.",
      estimatedMinutes: 3,
    },
    {
      id: 'worked-hill-steep-or-not',
      kind: 'worked_example',
      problem:
        'In the invented town of Fenwick, a resident named Deshawn walks up and down the hill near his home almost every day, and he says the hill is not very steep. A visitor named Priya, who is used to walking on flat land in her own town, is walking up the hill for the first time, and she says it is quite steep. A student concludes: "Priya must be exaggerating, because Deshawn has lived there and knows the hill best." Two things are wrong with that conclusion. Find both and correct them, using only what the scenario states about each person.',
      steps: [
        "Identify the stated experience behind each person's description before judging the conclusion. The scenario states that Deshawn walks this hill almost every day, and that Priya is used to flat land at home and is walking this hill for the first time.",
        'Test the first part of the conclusion. WRONG: "Priya must be exaggerating." CORRECT: Priya is reporting what she actually experienced. The scenario gives a specific, stated reason for her impression -- she is used to flat land, so a hill that might feel ordinary to someone used to hills feels steep to her by comparison.',
        'Test the second part of the conclusion. WRONG: "Deshawn knows the hill best, so his description is the correct one." CORRECT: Deshawn\'s daily routine has made the hill feel ordinary to him. That changes how noticeable the hill is to him. It does not change how steep the ground actually is, and it does not make his description more correct than Priya\'s.',
        "Check that both corrections point at stated experience and nothing else. Priya's impression traces to what she is already used to comparing hills to. Deshawn's impression traces to how many times he has walked the hill. Neither correction needs to say Deshawn is more honest or that Priya is more sensitive.",
        "Test the explanation by swapping who has which experience. If Deshawn moved to Priya's flat hometown and Priya moved to Fenwick and walked this same hill every day for a year, their two descriptions would very likely swap -- which confirms the descriptions were never about who Deshawn or Priya are, only about each person's own stated experience with the hill.",
        'State the conclusion. Priya is not exaggerating, and Deshawn is not more correct. Both are giving accurate accounts built from different stated experience with the very same hill.',
      ],
      answer:
        "Both parts of the conclusion are wrong because they treat one person's view as simply true. Priya's sense that the hill is steep traces to being used to flat land at home. Deshawn's sense that it is not very steep traces to walking it almost every day. Neither description is more correct; both are accurate reports built from different stated experience.",
      estimatedMinutes: 3,
    },
    {
      id: 'try-rivergate-quiet-or-busy',
      kind: 'try_yourself',
      problem:
        'A family moves to the invented town of Rivergate. On their first weekend there, a parent says, "This town feels very quiet." A neighbor who has lived in Rivergate for ten years says, "This town is busy -- there is always something going on." Both are describing the same town. What does the scenario suggest most likely explains why they perceive the town so differently?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: "The parent has not yet experienced enough of the town's regular activity to notice it, while the neighbor has experienced ten years of it.", correct: true },
        { id: 'b', text: "The parent is simply mistaken about what Rivergate is really like, and the neighbor's description is the only accurate one." },
        { id: 'c', text: 'Rivergate must have become busier at some point during the ten years the neighbor has lived there, so both descriptions were true at different times.' },
        { id: 'd', text: 'The neighbor is a more sociable person than the parent, so the neighbor notices more of the activity happening around them.' },
      ],
      expectedAnswer: "The parent has not yet experienced enough of the town's regular activity to notice it, while the neighbor has experienced ten years of it.",
      hints: [
        'Ask what each person has actually had the chance to experience in Rivergate, not what kind of person each one is.',
        'The scenario states how long the neighbor has lived there and that the family is on its very first weekend -- it never says the town changed, and it never says one person is more truthful than the other.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-cliffend-path-height',
      kind: 'try_yourself',
      problem:
        'In the invented village of Cliffend, a resident named Amara walks along the cliffside path every morning on her way to work. A visitor named Ben is walking the same path for the first time. He says, "This path is amazing -- I have never walked next to anything this high before." Amara does not mention the height at all. What does the scenario suggest is the reason for that difference?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Amara is not a very observant person, while Ben pays closer attention to his surroundings than she does.' },
        { id: 'b', text: "Ben has never walked next to anything this high before, so the height stands out to him, while Amara's daily walk on the same path has made the height feel ordinary to her.", correct: true },
        { id: 'c', text: "The path is actually more impressive than Amara admits, so Ben's description is the more accurate one." },
        { id: 'd', text: 'Cliffend must have recently added a new lookout point along the path, which is why Ben notices something Amara does not mention.' },
      ],
      expectedAnswer: "Ben has never walked next to anything this high before, so the height stands out to him, while Amara's daily walk on the same path has made the height feel ordinary to her.",
      hints: [
        'Ask what the scenario states about how many times each person has walked this exact path.',
        'The scenario never says Amara failed to notice the height because she is inattentive, and it never says the path itself changed -- it only states how new or how routine the path is to each person.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-sedge-harbor-fountain',
      kind: 'try_yourself',
      problem:
        "Read four short accounts of the same plaza in the invented town of Sedge Harbor. Which one gives a reason, stated directly in the account, for why two people would describe the plaza's fountain differently?",
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'A resident calls the fountain calm, and a visitor calls it overwhelming. The visitor must simply be a more nervous person than the resident.' },
        { id: 'b', text: 'A resident calls the fountain plain, and a visitor calls it beautiful. The fountain must have been redecorated sometime between their two visits.' },
        { id: 'c', text: 'A resident calls the fountain pleasant, and a visitor calls it unpleasant. The visitor is wrong, because the resident has lived there longer and knows the fountain best.' },
        { id: 'd', text: 'A resident calls the fountain ordinary, since she walks past it every day, and a visitor calls it the most amazing thing she has seen all trip, since she has never seen a public fountain before.', correct: true },
      ],
      expectedAnswer: 'A resident calls the fountain ordinary, since she walks past it every day, and a visitor calls it the most amazing thing she has seen all trip, since she has never seen a public fountain before.',
      hints: [
        "Look for the account where the explanation names a specific difference in what each person has experienced, not a difference in the person's character.",
        'Three of the four accounts explain the difference by guessing that the plaza changed, that one person is mistaken, or that one person has a certain personality -- none of those is stated in the account itself.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-one-true-view-and-personality',
      kind: 'misconception_check',
      question:
        'A student says: "A resident\'s description of a place is always the correct one, since a resident knows a place best. Also, if two people describe the same place differently, it must be because one of them has a better personality for noticing things." What is wrong with each half of that?',
      commonErrors: [
        {
          answer: "A resident's description of a place is always the correct one, since a resident knows a place best.",
          misconception:
            "Assuming that more time in a place produces the one true description of it, rather than one more description built from a different kind of experience.",
          correctsTo:
            "A resident's long experience does not make their description more correct than a visitor's -- it only makes it come from a different, longer kind of experience. A visitor's fresh eyes can notice real things a resident has stopped noticing, such as an unusual smell or an unusually tall building. Both descriptions can be equally accurate reports of what each person actually experienced. WRONG: \"the resident's view is the correct one.\" CORRECT: \"the resident's view and the visitor's view are both accurate, built from different experience with the same place.\"",
        },
        {
          answer: 'If two people describe the same place differently, it must be because one of them has a better personality for noticing things.',
          misconception:
            'Explaining a difference in perception by a trait of the person -- more observant, more sociable, more honest -- instead of by something specific and stated about that person\'s experience with the place.',
          correctsTo:
            'A difference in perception traces to a stated experience: how long a person has been somewhere, what they do there routinely, or what they are used to comparing it to from somewhere else. It does not trace to one person simply being a better or more careful kind of person. A visitor notices a hill because that visitor is not used to hills at home, not because that visitor is more observant than a resident. WRONG: "one of them has a better personality for noticing things." CORRECT: "one of them has different stated experience with the place."',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        "Perception is how one particular person understands or describes a place, and it comes from that person's own experience with the place, not from the place itself changing.",
        "A resident's perception is shaped by routine -- being in a place again and again teaches things a short visit cannot.",
        "A visitor's perception is shaped by newness, and also by whatever place the visitor is already used to comparing things to.",
        'The same feature, such as a hill or a square, can produce two different descriptions without the feature itself changing at all.',
        'Neither perception is more correct than the other. A difference in description is not a disagreement to settle.',
        'To explain why two people perceive the same place differently, point to the stated experience behind each view -- never to personality, honesty, or who is right.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '8', cedTopic: '8.2', cedTitle: 'How People Perceive Places Differently' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
