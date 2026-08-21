/**
 * Grade 7 ELA — Research: Citing Sources & Avoiding Plagiarism.
 *
 * The LAST row of the m7ela course (CCSS W.7.8), so followUps is [].
 * Procedure-led: why we cite, what needs citing, what a citation contains,
 * where the credit goes (in-text and in the list), and the note-taking habit
 * that prevents accidental plagiarism.
 *
 * NOTE FOR FUTURE AUTHORS: this row deliberately teaches the PARTS of a
 * citation and the reason for each, NOT an MLA or APA template. Formats
 * differ by school and by year, and an item whose answer turns on comma
 * versus period placement tests typography, not research. Every graded item
 * here sits on the underlying judgement — does this need a citation, what
 * information is missing, is this plagiarism. Keep it that way.
 *
 * Tone is matter-of-fact. The audience is twelve. This is a skill, not a
 * warning, so nothing in this file threatens the student with consequences.
 * Every source, site, author and article named here is invented.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7ELA_U10_CITING_SOURCES: LessonPlan = {
  id: 'evelyn.ms.m7ela.citing-sources.v1',
  title: 'Citing Sources & Avoiding Plagiarism',
  curriculum: 'MS',
  grade: '7',
  subject: 'ela',
  topic: 'grade-7-ela',
  locale: 'en',
  los: [
    {
      id: 'm7ela.citing-sources',
      standard: 'M7ELA-10.4',
      description:
        'Decide which material in a research draft needs a citation, name the five pieces of information a citation carries, give credit both beside the borrowed material and in a list at the end, and prevent accidental plagiarism by recording the source and marking quotations at the moment of note-taking (CCSS W.7.8).',
    },
  ],
  prerequisites: ['m7ela.quoting-paraphrasing-summarizing'],
  followUps: [],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame a citation as the ordinary answer to "where did you hear that?"',
      script:
        'Say you tell your friends at lunch that the game everybody plays is getting a new map next month. Somebody immediately asks, "Wait, where did you hear that?" You do not take that as an insult. You just say where. Maybe it was a video, maybe a post, maybe your cousin who works nowhere near the company. Your friends want to know so they can go look for themselves, and so they know whether to get excited. A citation is that same answer, written down. It tells your reader where a piece of information came from, so the reader can go check it, and it puts the credit on the person who actually did the work. That is the whole idea. The rest of today is just where to put it and what to include.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-what-to-cite-and-how',
      kind: 'concept',
      goal: 'Install the two reasons to cite, the list of what needs citing, the five parts of a citation, the two places credit appears, and the note-taking habit that prevents plagiarism.',
      keyIdeas: [
        'CITATION DOES TWO JOBS. First, it lets a reader check you. A reader who wants to see the thing for themselves can follow your citation straight to it. Second, it puts the credit where it is owed. Somebody found that information, and naming them is how you say so. Both jobs happen at once, and both are ordinary. This is a habit, not a punishment.',
        'WHAT NEEDS A CITATION — a direct quotation, a paraphrase, a summary, somebody else\'s idea or opinion, a statistic or measurement, and any image, map or chart you did not make yourself. Notice that four of those six are things you wrote in your OWN words. Rewording changes the words. It does not change who found the information.',
        'WHAT DOES NOT NEED A CITATION — common knowledge, which means something a general reader would already accept without checking. "A week has seven days" is common knowledge. It does NOT mean anything you happen to know already. You might know a lot about lizards, but a specific fact about how long a certain lizard lives came from somewhere, and it gets a source. The rule when you are stuck: if you are unsure, cite it. There is no penalty for one extra citation.',
        'A CITATION CARRIES FIVE PIECES, and each one has a reason. WHO made it, because credit goes to a person or a group. WHAT it is called, because titles are how a reader searches. WHERE it was published, meaning the website, magazine or book it sits inside, because that tells a reader what kind of source it is. WHEN it came out, because information ages. And WHERE YOU FOUND IT, such as the link or the library, because that is the path a reader retraces.',
        'CREDIT GOES IN TWO PLACES, and you need both. IN-TEXT CREDIT sits right beside the borrowed material, inside your own sentence: "A city parks newsletter reported that the skate ramps were rebuilt after students asked for them." That tells the reader, at the exact moment it matters, that this part is not yours. The WORKS-CITED ENTRY sits in a list at the end and carries all five pieces so the reader can find the source. A list at the end does not cover the in-text credit, because a reader in the middle of your paragraph cannot tell which sentence came from which entry.',
        'MOST PLAGIARISM IS A NOTE-TAKING ACCIDENT, not a plan. A student copies a sentence into their notes, comes back three days later, and cannot remember which lines were copied and which were their own. So the prevention is a habit, and it costs about four seconds. The moment you copy anything, write the source next to it. The moment you copy exact words, put quotation marks around them right then. Keep your own thoughts in a separate column or a different color. Notes that are honest are almost impossible to plagiarize from.',
      ],
      vocabulary: [
        { term: 'citation', definition: 'the information that tells a reader where something came from, so they can find it and so the person who made it gets the credit.' },
        { term: 'in-text credit', definition: 'the short mention of the source inside your own sentence, right next to the borrowed material.' },
        { term: 'works-cited entry', definition: 'the full listing of one source in the list at the end of your paper, carrying all five pieces of information.' },
        { term: 'common knowledge', definition: 'something a general reader would already accept without a source, such as the number of days in a week.' },
        { term: 'plagiarism', definition: 'using somebody else\'s words or ideas without giving them credit, whether it was done on purpose or by accident.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-build-a-citation',
      kind: 'worked_example',
      problem:
        'Here is a line from your research notes, exactly as you wrote it: HAPPY DOGS ARTICLE - shy dogs settle faster in a quiet room than in a hallway where people keep walking past. What is missing, and how do you turn this into a usable citation?',
      steps: [
        'First decide whether this even needs a citation. It is a finding about how shy dogs behave. A general reader would not already accept that without checking, so it is not common knowledge. It needs a source.',
        'Now run the five pieces against your note. WHO made it: missing. WHAT it is called: you wrote "HAPPY DOGS ARTICLE," which is your nickname for it, not the real title. WHERE it was published: missing. WHEN it came out: missing. WHERE YOU FOUND IT: missing. Four and a half pieces gone, and it has been three days.',
        'There is a second problem hiding here. You cannot tell whether those words are the writer\'s or yours. You did not put quotation marks on anything, so you have no way to know now. That is exactly how accidental plagiarism happens.',
        'Go back and open the source again. This time collect all five: the author is Dana Okafor, the article is called "How Shelters Match Dogs With Families," it was published on a site called Neighborhood Paws, it went up on April 9 of last year, and the link is neighborhoodpaws.example/matching.',
        'Build the works-cited entry. Here is ONE COMMON FORMAT, and your school may use a slightly different one: Okafor, Dana. "How Shelters Match Dogs With Families." Neighborhood Paws, 9 April 2025, neighborhoodpaws.example/matching. Do not memorize where the periods go. Look that up when you need it. Memorize the five pieces, because those are what a reader actually needs.',
        'Then write the in-text credit into your own sentence: "Dana Okafor, writing for Neighborhood Paws, explains that shy dogs settle faster in a quiet room than in a busy hallway." Now the reader knows which sentence is borrowed AND can find the source in your list.',
      ],
      answer:
        'The note is missing four of the five pieces (who, the real title, where it was published, when, and the link) and it does not show whether the words were copied. Reopen the source, collect all five, write the works-cited entry, and add in-text credit inside your own sentence: "Dana Okafor, writing for Neighborhood Paws, explains that shy dogs settle faster in a quiet room than in a busy hallway."',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-list-does-not-cover-it',
      kind: 'worked_example',
      problem:
        'A student hands in this paragraph. "Our school should keep the library open after last bell. Students who have nowhere quiet to work at home get their homework done at school instead. The library is already staffed until four." He put one entry in his works-cited list at the end and says the list covers everything. The middle sentence came from an invented source, a county library newsletter, and he reworded it. What is wrong, and how is it fixed?',
      steps: [
        'Start with the middle sentence. He reworded it, so no exact words were copied. He still borrowed the finding. Rewording changes the wording and nothing else, so this sentence needs credit.',
        'He says the list at the end covers it. Test that claim from the reader\'s side. A reader in the middle of this paragraph sees three sentences and has no way to tell which one came from the newsletter. Sentence one is his opinion, sentence three is something he can see with his own eyes, and sentence two is borrowed, but they all look identical on the page.',
        'Name the error: the works-cited list gives the reader the five pieces, but only IN-TEXT CREDIT tells the reader WHICH part is borrowed. Both jobs need doing, and the list only does one of them.',
        'Fix it by naming the source inside the sentence itself. "A county library newsletter reported that students without a quiet place at home are more likely to finish homework at school."',
        'Now check sentence three, "The library is already staffed until four." He knows that because he walks past the desk. It is his own observation about his own school, so it needs no source. Not everything in a paragraph gets cited.',
        'Read the repaired paragraph and confirm both jobs are done: the reader can tell which sentence is borrowed, and the entry at the end lets the reader go find it.',
      ],
      answer:
        'Rewording does not remove the need for credit, and a works-cited list alone cannot show WHICH sentence is borrowed. Add in-text credit: "Our school should keep the library open after last bell. A county library newsletter reported that students without a quiet place at home are more likely to finish homework at school. The library is already staffed until four."',
      estimatedMinutes: 3,
    },
    {
      id: 'try-what-needs-citing',
      kind: 'try_yourself',
      problem:
        'These four sentences all come from one student\'s research paper about animal shelters. Which sentence does NOT need a citation?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The shelter on Trellis Road started taking in rabbits three years ago.' },
        { id: 'b', text: 'More dogs are returned to the shelter in the weeks right after winter break than at any other time of year.' },
        { id: 'c', text: 'Shy dogs settle faster in a quiet room than in a hallway where people keep walking past.' },
        { id: 'd', text: 'An animal shelter is a place that takes in pets who do not have a home.', correct: true },
      ],
      expectedAnswer: 'An animal shelter is a place that takes in pets who do not have a home.',
      hints: [
        'Ask the common-knowledge question about each one: would a general reader accept this without checking anywhere? Remember that common knowledge does not mean anything you happen to know already.',
        'Three of these are findings somebody had to observe, measure or look up, even though none of them names a source out loud. One is a plain definition of the word itself.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-missing-part',
      kind: 'try_yourself',
      problem:
        'A student copied one sentence into her notes and wrote this beside it. TITLE: "Why Rain Gardens Work." WHERE IT WAS PUBLISHED: a website called Green Block. WHEN IT WAS PUBLISHED: March of last year. WHERE I FOUND IT: greenblock.example/rain-gardens. Which piece of a citation is still missing?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Nothing is missing, because she already wrote down the exact sentence.' },
        { id: 'b', text: 'What it is called - the title of the article.' },
        { id: 'c', text: 'When it came out - the date it was published.' },
        { id: 'd', text: 'Who made it - the author, or the group that published it.', correct: true },
      ],
      expectedAnswer: 'Who made it - the author, or the group that published it.',
      hints: [
        'Run the five pieces down the list one at a time: who, what it is called, where it was published, when, and where you found it. Check each one off against her note.',
        'Three of the four choices name something her note already has. The fourth confuses the borrowed sentence itself with the information about where it came from.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-who-plagiarized',
      kind: 'try_yourself',
      problem:
        'Four students used the same invented source, a neighborhood gardening blog, in their papers. Which one has plagiarized?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Ana copied one sentence exactly, put quotation marks around it, and named the blog in her own sentence right before it.' },
        { id: 'b', text: 'Ben read the post, closed the tab, wrote the idea in his own sentences, and named the blog in the sentence where he used it.' },
        { id: 'c', text: 'Cora copied a sentence, swapped in a few similar words, kept the order the same, and put the blog only in the list at the end.', correct: true },
        { id: 'd', text: 'Dev wrote that plants need water to grow and did not cite it anywhere.' },
      ],
      expectedAnswer: 'Cora copied a sentence, swapped in a few similar words, kept the order the same, and put the blog only in the list at the end.',
      hints: [
        'Ask two separate questions about each student. What did they do to the words, and where did the credit go? A source name somewhere in the paper does not answer both.',
        'One student wrote something a general reader already accepts, so no source is needed there. Another kept the source\'s sentence and only changed a few words in it.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-rewording-and-the-list',
      kind: 'misconception_check',
      question:
        'A student turns in a research paper and explains it two ways: "I only cited the quotes, because I reworded everything else in my own words," and "anyway, all my sources are in the list at the end, so the whole paper is covered." What is wrong with each explanation?',
      commonErrors: [
        {
          answer: 'You only have to cite direct quotes. If you reword it enough, it becomes yours.',
          misconception:
            'Believing that credit is owed for the WORDS rather than for the information, so changing the words removes the debt.',
          correctsTo:
            'Credit is owed for the information, not the phrasing. A paraphrase and a summary both need a citation, because somebody else found that information no matter who typed the sentence. And rewording is not automatic either: if you keep the source\'s sentence and only swap in a few similar words, you have not really put it in your own words at all. Close the source, say the idea out loud your own way, then write that down and name where it came from.',
        },
        {
          answer: 'The works-cited list at the end covers everything, so in-text credit is not necessary.',
          misconception:
            'Treating the list as a blanket receipt for the whole paper, instead of as the place a reader goes to find one specific source.',
          correctsTo:
            'The list does one job: it gives the reader the five pieces they need to go find each source. It cannot do the other job. A reader standing in the middle of your paragraph cannot tell which sentence came from which entry, or whether a sentence came from a source at all. In-text credit is what answers that, right where it matters, inside your own sentence.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Cite for two reasons: so a reader can go check it, and so credit lands on whoever did the work.',
        'Cite quotations, paraphrases, summaries, somebody else\'s idea, a statistic, and any image you did not make. Rewording does not cancel the citation.',
        'Common knowledge is what a general reader would already accept without a source, not whatever you happen to know already. If you are unsure, cite it.',
        'A citation carries five pieces: who made it, what it is called, where it was published, when it came out, and where you found it.',
        'Credit goes in two places. In-text credit sits inside your sentence and shows which part is borrowed; the works-cited entry sits in the list at the end and lets the reader find it. The list alone does not cover the paragraph.',
        'Formats differ from school to school, so look up where the periods go and memorize the five pieces instead.',
        'Prevent accidental plagiarism in your notes: write the source down the moment you copy anything, and put quotation marks on exact words right then.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '10', cedTopic: '10.4', cedTitle: 'Citing Sources & Avoiding Plagiarism' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
