/**
 * AP CSP — Create Performance Task (2024+ format with PPR + exam-day WR).
 *
 * Covers the workflow: building the program throughout the year, capturing
 * the PPR by April 30, and answering the 2 written-response questions
 * about that code on exam day.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_CSP_CREATE_PT: LessonPlan = {
  id: 'evelyn.ap.csp.create-pt.v1',
  title: 'AP CSP Create Performance Task: PPR + Exam-Day Written Response',
  curriculum: 'CollegeBoard',
  grade: 'ap',
  subject: 'cs',
  topic: 'ap-cs-principles',
  locale: 'en',
  los: [
    {
      id: 'apcsp.create-pt',
      description: 'Plan and build the AP CSP Create Performance Task program, prepare the Personalized Project Reference (PPR), and answer the 2 exam-day written-response questions strongly.',
      standard: 'AP-CSP-CREATE',
    },
  ],
  prerequisites: ['apcsp.exam-format'],
  followUps: [],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'The Create PT is your code, your story — but with new constraints.',
      script: 'You\'ve been writing code all year. The Create Performance Task is your chance to PROVE it on a project that\'s yours, in any language you want. The 2024+ format made one big change: instead of writing a long takehome essay about your code, you now answer 2 short questions about it on EXAM DAY, with only screenshots (the PPR) to refer to. That makes preparation different — your PPR has to capture the right code segments, and you have to know your project well enough to talk about it under time pressure.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-program-requirements',
      kind: 'concept',
      goal: 'What the Create program must include.',
      keyIdeas: [
        'PROGRAM REQUIREMENTS: your code must include (a) a LIST data structure used to manage complexity, (b) a STUDENT-DEVELOPED PROCEDURE with at least one parameter that affects functionality, (c) a SEQUENCE of code segments that calls the procedure, (d) a SELECTION (if statement) within the procedure, (e) ITERATION (a loop) within the procedure.',
        'LANGUAGE: any text-based or block-based language. Common picks: Python, Java, JavaScript, p5.js, Scratch, App Inventor.',
        'COLLABORATION: you may work WITH a partner or team during DEVELOPMENT, but the SUBMITTED code must be YOURS — your individual work and your own ideas. The PPR must show YOUR code.',
        'DEVELOPMENT TIME: ~9 hours of in-class time (per College Board guidance), though most students spend more outside class.',
        'PURPOSE: pick something meaningful to you. The exam-day questions ask about your code; if you don\'t care about the project, your written answers will sound flat.',
      ],
      vocabulary: [
        { term: 'list', definition: 'an ordered collection of values; the AP CSP Create PT requires using one to manage complexity.' },
        { term: 'student-developed procedure', definition: 'a function YOU wrote (not built-in) that takes a parameter and produces a result or effect.' },
        { term: 'selection', definition: 'a conditional (if/else) that branches based on a condition.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'concept-ppr',
      kind: 'concept',
      goal: 'What the Personalized Project Reference must include.',
      keyIdeas: [
        'PPR STRUCTURE: 3 sections, each with code screenshots, submitted via the AP Digital Portfolio: (1) PROCEDURE — your student-developed procedure including its definition + at least one call; (2) LIST — code that creates the list AND code that uses the list (gets, sets, appends, etc.); (3) PROCEDURE WITH SELECTION + ITERATION — code showing your procedure containing both an if/else and a loop.',
        'IMAGE QUALITY: code must be READABLE. Use clear monospaced font, no compression artifacts, fit each segment on screen. Don\'t shrink to unreadable.',
        'NO TEXT in the PPR — just images. Variable names and code comments tell the story.',
        'DEADLINE: April 30, 11:59 PM ET. Hard deadline. NO PPR = NO REFERENCE on exam day, which makes Section 2 effectively impossible.',
        'STRATEGY: pick code segments that PROVE the requirements. The procedure shown should clearly take a parameter and use it. The list shown should clearly be a list (not a single variable). Don\'t hide the requirements behind compact code.',
        'NAME / DATE in code: NCSBN restricts identifying info. Comments saying "by [Your Name]" can disqualify. Keep it neutral.',
      ],
      vocabulary: [
        { term: 'AP Digital Portfolio', definition: 'College Board\'s online platform where AP CSP students submit their PPR.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'concept-written-response',
      kind: 'concept',
      goal: 'The 2 exam-day written-response questions and how to answer them.',
      keyIdeas: [
        'SECTION 2 has 2 written-response questions about YOUR PPR code. ~30 minutes per question.',
        'QUESTION 1 typically asks about the PROCEDURE you defined: what does it do, what is the parameter, how does the parameter affect behavior. Answer in 3-5 short sentences using the procedure name and parameter name from your PPR.',
        'QUESTION 2 typically asks about the LIST: how does using a list (vs separate variables) make your program manage complexity? You must explain WHY a list is the right structure for your data, not just describe what the list does.',
        'COMMON FAILURE MODE: students describe what the code DOES instead of explaining WHY they used the abstractions. The rubric rewards REASONING about design choices, not summary.',
        'STRATEGY: in the months before the exam, write practice answers about your code. Show them to a peer who hasn\'t seen your project — if they can\'t follow your explanation, rewrite.',
        'TIME UNDER PRESSURE: 30 minutes per question feels short. Practice typing on a keyboard, not handwriting — Section 2 is digital.',
      ],
      vocabulary: [
        { term: 'managing complexity', definition: 'using abstractions like lists or procedures to make a program easier to understand and change; a key rubric phrase.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'You\'re writing your PPR. Your procedure is named is_valid_password(pwd) and it returns true if the password is at least 8 characters and contains a digit. The list scoreboard stores high scores from previous game runs. Which sections of your PPR show what?',
      expectedAnswer: 'Section 1 (Procedure): screenshot of is_valid_password definition + at least one call. Section 2 (List): screenshot of where scoreboard is created (e.g., scoreboard = []) AND code that uses it (e.g., scoreboard.append(score) or scoreboard[0]). Section 3 (Procedure with selection + iteration): is_valid_password fits if it has an if-statement (length check) and a loop (digit check) — ideal candidate.',
      responseFormat: 'free',
      hints: [
        'Each PPR section has a specific purpose. Match your code to the requirement.',
        'Section 3 needs a procedure that contains BOTH selection and iteration.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-collaborate',
      kind: 'misconception_check',
      question: 'You and your partner co-wrote the entire program for the Create PT — including identical PPR screenshots. Both of you submit the same PPR. That\'s allowed since you collaborated. True or false?',
      commonErrors: [
        {
          answer: 'true',
          misconception: 'Treating "collaboration during development" as "shared submission".',
          correctsTo: 'False. Collaboration is allowed during DEVELOPMENT — you can pair-program, brainstorm, debug together. But the SUBMITTED code must be YOUR INDIVIDUAL work, and identical PPRs would be flagged as a violation. Each student must submit their own program with their own design choices, even if you discussed approaches together. College Board uses similarity detection on PPR submissions; matching code from two students leads to score cancellation for both.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Program needs: list + student-developed procedure + parameter + sequence + selection + iteration.',
        'PPR = 3-section image submission by April 30. Procedure / List / Procedure-with-selection-and-iteration.',
        'Section 2 = 2 written-response questions on exam day (~30 min each) about YOUR code.',
        'Rubric rewards REASONING about design choices, not just code description.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why does the Create PT specifically require a LIST data structure rather than letting students use a dictionary, set, or any other collection?',
      hint: 'Lists are the most teachable collection — every CSP language has them, they\'re ordered (so you can iterate), and they directly demonstrate the abstraction principle (one variable holds many values vs separate variables for each). Dictionaries / sets exist in some languages but not all (Scratch, App Inventor have weaker support). Standardizing on lists makes the rubric language-agnostic. The list also pairs cleanly with iteration — a natural pedagogical pairing for "managing complexity."',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
