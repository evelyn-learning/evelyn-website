/**
 * HS English — Research & Sources: Citing Sources & Avoiding Plagiarism.
 *
 * The closing skill of the course: integrate source material with signal
 * phrases and the frame-quote-explain move, know what actually needs a
 * citation, and recognize plagiarism in all three of its forms — uncredited
 * words, uncredited ideas, and patchwriting. Every practice item is an MCQ;
 * all sources are invented and generic.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_ENGL_U10_CITING_AND_INTEGRATING_SOURCES: LessonPlan = {
  id: 'evelyn.hs.engl.citing-and-integrating-sources.v1',
  title: 'Citing Sources & Avoiding Plagiarism',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'ela',
  topic: 'hs-english',
  locale: 'en',
  los: [
    {
      id: 'engl.citing-and-integrating-sources',
      standard: 'ENGL-10.4',
      description:
        'Integrate source material into your own writing with signal phrases and a frame-quote-explain structure, decide what requires a citation by testing whether the material is common knowledge or your own idea, and recognize plagiarism in each of its forms — uncited ideas, patchwriting, and uncredited exact words (CCSS W.9-10.8).',
    },
  ],
  prerequisites: ['engl.quoting-paraphrasing-summarizing'],
  followUps: [],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame citation as giving credit in the real world — the same instinct that makes uncredited work feel wrong in a group project or a song.',
      script:
        'Think about a group project where you did most of the design work and someone else presented it without ever saying your name. Nothing was stolen, exactly. But the credit went to the wrong person, and you felt it. That same rule runs through the rest of the world: a producer who samples four seconds of somebody else\'s drum break has to clear it, and a writer who uses somebody else\'s idea has to name them. Citation is not a punishment invented by English teachers. It is how you show your receipts — proof that you did the reading, and proof that the smart parts of your paper are backed by someone who knows. Today we learn how to fold a source into your own sentences and how to tell, every time, when a name has to go with it.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-integrate-and-credit',
      kind: 'concept',
      goal: 'What needs citation, how to integrate a source with frame-quote-explain, and the three faces of plagiarism.',
      keyIdeas: [
        'WHAT NEEDS A CITATION — cite everything that is not common knowledge and not your own idea. That covers quotations, paraphrases, summaries, statistics, images, and any interpretation you got from someone else. If you did not know it before you started researching, assume it needs a source.',
        'THE TWO-PART COMMON-KNOWLEDGE TEST — a fact is common knowledge only if it passes BOTH parts: (1) it is widely known by your readers, and (2) it appears in many sources uncontested. "Water freezes at zero degrees Celsius" passes both. "Roughly one in five teenagers reports skipping breakfast" fails part two — somebody measured that, and that somebody gets named. When only one part passes, cite it.',
        'THE DROPPED QUOTE — a quotation dumped into a paragraph as its own sentence, with no introduction, is the most common integration error. WRONG: "Attendance improved in every grade level." Nobody knows who said it or why it is here. FIX IT WITH A SIGNAL PHRASE: "According to a district attendance study, attendance improved in every grade level." Other signal phrases: "The report notes...", "The researchers argue...", "As one school counselor explains...".',
        'FRAME, QUOTE, EXPLAIN — never let a quotation speak for itself. FRAME it (who said it and why they are worth hearing), QUOTE it (only the words you actually need), then EXPLAIN it (what it proves about YOUR claim). The explain step is the one students skip, and it is the one that turns a source into evidence instead of decoration. Your sentence should always be the last word, not the source\'s.',
        'PLAGIARISM HAS THREE FACES — (1) UNCREDITED WORDS: copying phrasing without quotation marks, even one vivid phrase; (2) UNCREDITED IDEAS: putting someone else\'s argument or finding entirely in your own words but never naming them — still plagiarism, because the idea was theirs; (3) PATCHWRITING: keeping the source\'s sentence structure and swapping in synonyms. Patchwriting is the sneakiest, because it feels like paraphrasing while the skeleton of the original is still on the page.',
        'A REAL PARAPHRASE STARTS FROM UNDERSTANDING — close the source, say the idea out loud in your own words, then write that down and check it against the original for accidental overlap. And a paraphrase still gets a citation. Changing the words changes nothing about who owns the idea.',
        'CITATION STYLES EXIST, BUT THE PRINCIPLE IS UNIVERSAL — MLA is common in English classes and APA in the social sciences, and they differ on details like where the year goes. Do not memorize comma placement; you can look that up in thirty seconds. Memorize the PRINCIPLE instead: give your reader enough information to find the exact source you used — who made it, what it is called, where it lives, and when it appeared. Any citation that lets a reader retrace your steps is doing its job.',
        'ACCIDENTAL PLAGIARISM IS STILL PLAGIARISM — no school treats "I lost track of which notes were copied" as a defense, because the harm to the original writer is identical. NOTE-TAKING DISCIPLINE PREVENTS IT: put quotation marks around anything you copy the moment you copy it, write the source next to it immediately, and keep your own thoughts in a visibly separate column or color. Nearly every accidental case starts in messy notes, not in a moment of dishonesty.',
      ],
      vocabulary: [
        { term: 'signal phrase', definition: 'the short introduction that names the source before its words appear, such as "According to the report" or "The author argues".' },
        { term: 'patchwriting', definition: 'swapping synonyms into a source\'s sentence while keeping its structure — a form of plagiarism, not a paraphrase.' },
        { term: 'common knowledge', definition: 'a fact that is both widely known by your readers and repeated uncontested across many sources, and therefore needs no citation.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-frame-quote-explain',
      kind: 'worked_example',
      problem:
        'You are arguing that your school should move first period later. You found this line in an invented source, a district wellness survey: "Students who reported starting class after nine a.m. logged an average of forty more minutes of sleep per night." Integrate it properly using frame, quote, explain.',
      steps: [
        'Decide first whether it needs a citation. It is a specific statistic that somebody measured, so it fails part two of the common-knowledge test. It gets a source name.',
        'FRAME: introduce the source with a signal phrase that also tells the reader why this source is worth hearing — "A district wellness survey of high school students found..." Now the quotation has a speaker before it has words.',
        'QUOTE: take only the words that carry the point. The full sentence is long, so trim to the part that matters: "an average of forty more minutes of sleep per night."',
        'Combine the frame and the quote into one grammatical sentence: A district wellness survey found that students in later first-period classes logged "an average of forty more minutes of sleep per night."',
        'EXPLAIN: add YOUR sentence, connecting the evidence to YOUR claim — "Forty minutes is not a small gain; across a five-day week it is more than three additional hours of rest, which is exactly the deficit teachers describe when they say students look exhausted by Thursday."',
        'Check the last word. The paragraph ends with your interpretation, not with the source. That is the difference between using evidence and displaying it.',
      ],
      answer:
        'A district wellness survey found that students in later first-period classes logged "an average of forty more minutes of sleep per night." Forty minutes is not a small gain; across a five-day week it is more than three additional hours of rest, which is exactly the deficit teachers describe when they say students look exhausted by Thursday.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-dropped-quote-and-uncited-idea',
      kind: 'worked_example',
      problem:
        'A student writes this paragraph and believes it is fully honest work: "Our school should add a late-start day. Ninth graders lose the most sleep of any grade. The delay would pay for itself in fewer tardies." He explains that the middle sentence came from a regional education newsletter he read, but says: "I didn\'t need to cite it because I put it in my own words." What went wrong, and how should the paragraph be fixed?',
      steps: [
        'Look at the middle sentence first. It is a finding somebody researched, so it fails the common-knowledge test, and the writer admits it came from a newsletter. Putting it in his own words changed the wording, not the ownership.',
        'Name the error precisely: this is UNCREDITED IDEAS, the second face of plagiarism. No sentence was copied, so it does not look like cheating to the writer, but the reader still credits the insight to him instead of to the source.',
        'Now notice the second problem. Even if he added a citation in parentheses, the sentence would sit in the paragraph as a DROPPED QUOTE in paraphrase form — a fact that arrives with no introduction and no explanation of why it is there.',
        'Fix the credit with a signal phrase that names the source in the sentence itself: "A regional education newsletter reports that ninth graders lose more sleep than any other grade."',
        'Fix the integration by explaining what the evidence proves for HIS argument: "That matters here because ninth graders also carry the heaviest homework adjustment, so the grade with the least rest is the grade with the newest demands."',
        'Read the repaired paragraph and check the three tests: the idea is credited, the source is framed before it speaks, and the writer\'s own sentence closes the thought.',
      ],
      answer:
        'The middle sentence is plagiarism by uncredited idea — a paraphrase still needs its source named — and it also functions as a dropped quote with no frame or explanation. FIXED: "Our school should add a late-start day. A regional education newsletter reports that ninth graders lose more sleep than any other grade. That matters here because ninth graders also carry the heaviest homework adjustment, so the grade with the least rest is the grade with the newest demands."',
      estimatedMinutes: 3,
    },
    {
      id: 'try-what-needs-citation',
      kind: 'try_yourself',
      problem:
        'You are writing a research paper about school start times. Which of these sentences does NOT need a citation?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'A typical school week runs from Monday through Friday.', correct: true },
        { id: 'b', text: 'One survey of regional districts found that later start times reduced first-period tardies by nearly a third.' },
        { id: 'c', text: 'Some researchers argue that adolescent sleep cycles shift naturally toward later hours.' },
        { id: 'd', text: 'A county transportation study estimated that staggered bus routes would add eleven minutes to the average ride.' },
      ],
      expectedAnswer: 'A typical school week runs from Monday through Friday.',
      hints: [
        'Run the two-part test on each one: is it widely known by your readers AND repeated uncontested everywhere?',
        'Three of these are specific findings or arguments that somebody produced — a statistic, a study estimate, and a researcher\'s claim. Only one is a fact every reader already holds.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-best-integration',
      kind: 'try_yourself',
      problem:
        'A student is using this line from an invented source, a campus food-service report: "Sorting trays at the return station diverted more waste than any bin placed in the seating area." Which version integrates it best?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '"Sorting trays at the return station diverted more waste than any bin placed in the seating area." This shows composting works.' },
        { id: 'b', text: 'A campus food-service report found that sorting trays at the return station "diverted more waste than any bin placed in the seating area," which suggests our own program should start where students already stop rather than where they sit.', correct: true },
        { id: 'c', text: 'Sorting trays at the return station diverted more waste than any bin placed in the seating area.' },
        { id: 'd', text: 'Some people say that sorting trays at the return station diverted more waste than any bin placed in the seating area, and that is a good point about composting.' },
      ],
      expectedAnswer:
        'A campus food-service report found that sorting trays at the return station "diverted more waste than any bin placed in the seating area," which suggests our own program should start where students already stop rather than where they sit.',
      hints: [
        'Check each version for all three moves: is the source framed before it speaks, is the quotation trimmed and marked, and does the writer explain what it proves?',
        'One version drops the quote with no introduction, one strips the quotation marks entirely, and one hides the source behind the vague phrase "some people say."',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-identify-plagiarism',
      kind: 'try_yourself',
      problem:
        'Four students describe how they used an invented source, a local library newsletter, in a paper. Which one has committed plagiarism?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Priya quoted one sentence exactly, put it in quotation marks, and named the newsletter in her signal phrase.' },
        { id: 'b', text: 'Marcus read the newsletter, closed it, wrote the finding in his own sentence structure, and named the newsletter as his source.' },
        { id: 'c', text: 'Dana copied the newsletter\'s sentence, replaced about six words with synonyms, kept the same order and structure, and listed the newsletter in her works cited.', correct: true },
        { id: 'd', text: 'Elias summarized three paragraphs of the newsletter in two of his own sentences and credited the newsletter in the sentence itself.' },
      ],
      expectedAnswer:
        'Dana copied the newsletter\'s sentence, replaced about six words with synonyms, kept the same order and structure, and listed the newsletter in her works cited.',
      hints: [
        'A citation at the end does not repair every problem. Ask what each student did to the WORDS, not just whether a source name appeared somewhere.',
        'Swapping synonyms into a sentence whose structure you kept is patchwriting, and patchwriting is plagiarism even when the source is listed.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-changed-the-words',
      kind: 'misconception_check',
      question:
        'A student turns in a paragraph built from an online article and defends it two ways: "I changed the words, so it\'s mine now," and "besides, it\'s on the internet, so it\'s free." What went wrong in each defense?',
      commonErrors: [
        {
          answer: 'I changed the words, so the sentence belongs to me and needs no citation.',
          misconception: 'Believing that ownership lives in the wording rather than in the idea — so rewording a source converts it into original work.',
          correctsTo:
            'Citation credits the IDEA, not the phrasing. If the finding, argument, or interpretation came from somewhere else, the source gets named no matter how thoroughly you rewrite the sentence. And if the rewrite kept the original structure with synonyms dropped in, it is not even a paraphrase — it is patchwriting, which is plagiarism twice over: uncredited idea and borrowed sentence shape.',
        },
        {
          answer: 'It is on the internet, so it is free to use without credit.',
          misconception: 'Confusing free ACCESS with free USE — treating anything reachable without a paywall as unowned.',
          correctsTo:
            'Being able to read something for nothing says nothing about who made it. A page you opened without paying still has an author who did the work, exactly like a song you can stream for free still has to be cleared before it is sampled. Free access, and credit still owed.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Cite everything that is not common knowledge and not your own idea; common knowledge must pass BOTH parts of the test — widely known AND uncontested across many sources.',
        'Never drop a quotation into a paragraph alone. Frame it with a signal phrase, quote only what you need, then explain what it proves for your claim — your sentence gets the last word.',
        'Plagiarism has three faces: uncredited words, uncredited ideas, and patchwriting. A paraphrase still needs a citation, because rewording never transfers ownership.',
        'MLA and APA differ on details you can look up; the universal principle is to give a reader enough information to find your exact source.',
        'Accidental plagiarism counts, so prevent it in your notes: quotation marks the moment you copy, the source written down immediately, your own thoughts kept visibly separate.',
        'That closes the course: from the parts of a sentence through punctuation, argument, literature, and writing craft, every unit has been building toward this — writing that is clear, accurate, and honest about where it came from.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '10', cedTopic: '10.4', cedTitle: 'Citing Sources & Avoiding Plagiarism' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
