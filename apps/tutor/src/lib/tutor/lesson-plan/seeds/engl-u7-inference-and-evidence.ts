/**
 * HS English — Reading Informational Texts: Inferences & Supporting Evidence.
 *
 * What a nonfiction text will and will not carry (CCSS RI.9-10.1):
 * inference as evidence plus reasoning, the supported-vs-merely-possible
 * line, the smallest-step rule, and citing the words that license the
 * claim. All excerpts are short ORIGINAL prose written for this lesson —
 * no copyrighted quotations, no external passages.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_ENGL_U7_INFERENCE_AND_EVIDENCE: LessonPlan = {
  id: 'evelyn.hs.engl.inference-and-evidence.v1',
  title: 'Inferences & Supporting Evidence',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'ela',
  topic: 'hs-english',
  locale: 'en',
  los: [
    {
      id: 'engl.inference-and-evidence',
      standard: 'ENGL-7.4',
      description:
        'Draw inferences that stay within what a nonfiction text actually supports by combining the text\'s stated evidence with relevant background knowledge, and cite the specific lines that license each inference (CCSS RI.9-10.1).',
    },
  ],
  prerequisites: ['engl.text-structure'],
  followUps: ['engl.figurative-language'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Name reading between the lines as an everyday skill, then raise the standard: point at the words that let you say it.',
      script:
        'You already read between the lines a dozen times a day. When a coach announces "Friday practice is optional, but I will be there," nobody in the room hears an optional practice — everybody hears that attendance is being counted. When a job posting says the ideal candidate "thrives in a fast-paced environment with minimal supervision," the word understaffed never appears, and the message lands anyway. Careful readers do exactly this with nonfiction, with one extra rule attached: you have to be able to point at the words that let you say it. Today we make that pointing exact, because every argument you write for the rest of this course stands or falls on it.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-inference-evidence',
      kind: 'concept',
      goal: 'Define inference as evidence plus reasoning, draw the supported-vs-possible line, and name the two errors that break inferences.',
      keyIdeas: [
        'INFERENCE = EVIDENCE + REASONING — an inference is a conclusion the text does not state outright but does make available. You supply two things: the stated words you are reading from, and the reasoning (often ordinary background knowledge about how the world works) that connects those words to the conclusion. Missing either half, it is not an inference — it is a quotation or a guess.',
        'SUPPORTED IS NOT THE SAME AS POSSIBLE — a claim can be entirely plausible and still be unsupported. The question is never "could this be true?" but "does this text make me say it?" A store that shortens its hours might be losing money; unless the text gives you something that points there, that reading is your story, not the text\'s.',
        'THE SMALLEST-STEP RULE — strong inferences take ONE short step past the page and stop. The further you travel from the stated words, the more of your own assumptions you have to carry. When two readings are both available, prefer the one that needs less from you.',
        'CITE THE LINE — an inference is only as strong as the words under it. State it in the form "claim + because + the exact wording": not "the district is happy with the new form" but "the district considers the new form an improvement — the office reports that the paperwork now arrives two days earlier."',
        'STATED VS IMPLIED — a stated fact can be answered by pointing at a sentence; an implied one has to be built out of a sentence. Both are fair game in an argument, but only the implied one requires you to show your reasoning. Watch for the trap of dressing up a restatement as an inference: repeating the text in new words proves nothing.',
        'THE OVERREACH ERROR — taking a real, cited detail and stretching it past its scope. Watch the absolute words: all, every, always, never, only, no longer. A text reporting that fewer families called the office does not support "no family ever calls now." The evidence was real; the claim outran it.',
        'THE IMPORTED-EXPERIENCE ERROR — filling a gap in the text with your own life instead of ordinary background knowledge. Background knowledge is general and shared (a locked box is for keeping things safe); imported experience is specific and personal (my school did this because of budget cuts, so this one did too). The first helps you reason; the second quietly rewrites the text.',
      ],
      vocabulary: [
        { term: 'inference', definition: 'a conclusion built from a text\'s stated evidence plus reasoning, rather than stated outright in it.' },
        { term: 'textual evidence', definition: 'the specific words or lines of the text that support a claim, quoted or pointed to precisely.' },
        { term: 'overreach', definition: 'a claim that starts from real evidence but extends further than that evidence can carry it.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-draw-and-defend',
      kind: 'worked_example',
      problem:
        'Draw one inference from this excerpt and defend it with a line: "The city posted a notice at the trailhead: the north loop will close for repairs beginning Monday. Rangers added that visitors should plan for the south loop to be busier than usual, and that the small lot at the south gate fills by eight on weekend mornings."',
      steps: [
        'Separate stated from implied. STATED: the north loop closes Monday; the south loop will be busier than usual; the south lot fills by eight on weekend mornings. Nothing here states why the south loop will get busier.',
        'Find the gap worth crossing. The notice predicts a change on a trail it is not repairing — that prediction has to come from somewhere, and the only other fact on offer is the closure next door.',
        'Add the reasoning: hikers turned away from one loop do not vanish; they go to the loop that is open. That is ordinary background knowledge, general enough to be shared, not a story about one particular hiker.',
        'State the inference in cite-the-line form: the city expects the closure to push north-loop hikers onto the south loop — the notice tells visitors to "plan for the south loop to be busier than usual" in the same breath as the closure.',
        'Check the step size. The claim stops at where the crowding comes from. It does not go on to say the repairs are unpopular, or that the south lot will overflow on a Tuesday — neither of those has a line under it.',
      ],
      answer:
        'The city expects the north-loop closure to send its usual hikers to the south loop — evidence: the notice pairs the closure with a warning to "plan for the south loop to be busier than usual"',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-overreach',
      kind: 'worked_example',
      problem:
        'A student reads this excerpt and concludes that the library is phasing out print books: "The library board reported that checkouts of print books fell for the third year in a row, while audiobook checkouts rose by nearly half. The board voted to add twelve listening stations on the second floor." Where does that inference break, and what does the excerpt actually support?',
      steps: [
        'Give the student credit for the evidence: both cited facts are real. Print is down three years running, and the board is spending floor space on listening stations. The inference is not invented out of nothing — it is an overreach, which is the harder error to catch.',
        'Name the scope jump. "Falling" is not "ending," and "adding twelve stations" is not "removing shelves." Phasing out is an absolute claim about the library\'s future, built on evidence that only describes a direction so far.',
        'Test it the honest way: could every stated fact be true while the conclusion is false? Yes — a library can watch print decline for years, add listening stations, and keep buying print the entire time. When the facts survive the conclusion being false, the conclusion was never supported.',
        'Rebuild it at the right size: the board expects audiobook demand to continue — it committed floor space to twelve listening stations right after reporting that audiobook checkouts rose by nearly half.',
        'Notice what made the smaller claim safe: it stops at the board\'s expectation about audio, which the spending decision actually evidences, and says nothing about print\'s future, which nothing in the excerpt addresses.',
      ],
      answer:
        'The conclusion overreaches: falling print checkouts plus new listening stations support only that the board expects audiobook demand to continue, not that print is being phased out',
      estimatedMinutes: 3,
    },
    {
      id: 'try-supported-inference',
      kind: 'try_yourself',
      problem:
        'Read the excerpt: "The swim team moved morning practice to five-thirty this season, because the pool now hosts a youth program at seven. Attendance at morning practice has held steady, though the coach has started keeping a box of granola bars by the door." Which inference does the excerpt SUPPORT?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Some swimmers are arriving at the earlier practice without having eaten, and the coach has responded to that', correct: true },
        { id: 'b', text: 'Attendance at morning practice has dropped since the time change' },
        { id: 'c', text: 'The coach believes the youth program should be moved to a different pool' },
        { id: 'd', text: 'Every swimmer on the team now skips breakfast before practice' },
      ],
      expectedAnswer: 'Some swimmers are arriving at the earlier practice without having eaten, and the coach has responded to that',
      hints: [
        'One detail changed at the same time the practice time did. Ask what the granola bars are doing in this excerpt at all.',
        'Check each option against the words: one is contradicted by "held steady," one adds an opinion the excerpt never gives, and one turns "some" into "every."',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-locate-evidence',
      kind: 'try_yourself',
      problem:
        'Read the excerpt: "The museum extended its Thursday evening hours through December. Staff reported that the Thursday guided tour has filled every week since September, while the same tour on Tuesday still ends with empty seats. Admission prices did not change." A reader infers that visitor demand for the tour is uneven across days of the week. Which line best supports that inference?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '"The museum extended its Thursday evening hours through December."' },
        { id: 'b', text: '"the Thursday guided tour has filled every week since September, while the same tour on Tuesday still ends with empty seats"', correct: true },
        { id: 'c', text: '"Admission prices did not change."' },
        { id: 'd', text: '"The museum hired additional tour guides for the winter season."' },
      ],
      expectedAnswer: '"the Thursday guided tour has filled every week since September, while the same tour on Tuesday still ends with empty seats"',
      hints: [
        'The inference is about a difference BETWEEN days. Find the line that puts two days side by side.',
        'One option reports an action rather than demand, one only rules out price as a factor, and one never appears in the excerpt at all — check the words before you trust a choice.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-spot-overreach',
      kind: 'try_yourself',
      problem:
        'Read the excerpt: "The district replaced its paper permission slip with an online form last fall. Office staff report that forms now arrive an average of two days earlier than they did before, and that fewer families call the office asking for a replacement copy." All four statements below sound reasonable. Which one OVERREACHES what the excerpt supports?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Families are returning permission forms sooner than they did under the paper system' },
        { id: 'b', text: 'Every family in the district now prefers the online form to the paper one', correct: true },
        { id: 'c', text: 'The office is fielding fewer calls about replacement copies than it did before' },
        { id: 'd', text: 'The switch to the online form took effect last fall' },
      ],
      expectedAnswer: 'Every family in the district now prefers the online form to the paper one',
      hints: [
        'Three of these stay inside the reported numbers. One makes a claim about what people feel, not about what the office measured.',
        'Hunt for the absolute word. "Every family" and "prefers" are both larger than anything the excerpt counted.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-plausible-vs-supported',
      kind: 'misconception_check',
      question:
        'Excerpt: "A neighborhood cafe posted a sign: beginning in March, it will close at two in the afternoon on weekdays. The owner wrote that the kitchen will use the afternoons to bake the next day\'s bread." A student infers: "The cafe is losing money, so it cut its hours." The student argues the inference is fine because businesses really do cut hours when sales fall. What went wrong?',
      commonErrors: [
        {
          answer: 'The cafe is losing money, so it cut its hours.',
          misconception: 'Treating a plausible real-world explanation as a supported inference, and filling the gap with personal experience instead of reading the reason the text already gives.',
          correctsTo:
            'Plausible is not the same as supported. Nothing in the excerpt mentions sales, costs, or trouble — and the sign supplies its own reason: the afternoons go to baking. A supported inference stays with the words on offer: the cafe is trading afternoon service for kitchen time. If you want the money claim, you need a line that points there, and this text does not have one.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'An inference is evidence plus reasoning — a conclusion the text makes available without stating it.',
        'Plausible is not supported: ask "does this text make me say it?" not "could this be true?"',
        'Take the smallest step past the page, and watch the absolute words — all, every, always, never, only — that mark an overreach.',
        'Every inference needs a cited line: claim + because + the exact wording.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '7', cedTopic: '7.4', cedTitle: 'Inferences & Supporting Evidence' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
