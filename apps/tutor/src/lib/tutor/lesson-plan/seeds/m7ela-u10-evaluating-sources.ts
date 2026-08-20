/**
 * Grade 7 ELA — Research & Inquiry: Evaluating Sources.
 *
 * Row 10.2 (CCSS W.7.8): assess the credibility and accuracy of each source.
 * Four questions a twelve-year-old can actually run — WHO, WHEN, WHY, and
 * CAN I CHECK IT — plus the idea the lesson is really built around: a source
 * is not credible or not credible in general. It is credible FOR A QUESTION.
 * The same seller's page that cannot settle "is this safe" is a fine source
 * for "what does the company say this comes with".
 *
 * NOTE FOR FUTURE AUTHORS: every source in this file is INVENTED and
 * described generically ("a page with no author listed", "a company page
 * selling the product"). Do not add real websites, publications,
 * organizations or people, and do not rate a real source as credible or
 * not. This is a public course page, and a lesson that judges real
 * organizations by name would be publishing that judgment.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7ELA_U10_EVALUATING_SOURCES: LessonPlan = {
  id: 'evelyn.ms.m7ela.evaluating-sources.v1',
  title: 'Evaluating Sources',
  curriculum: 'MS',
  grade: '7',
  subject: 'ela',
  topic: 'grade-7-ela',
  locale: 'en',
  los: [
    {
      id: 'm7ela.evaluating-sources',
      standard: 'M7ELA-10.2',
      description:
        'Assess the credibility and accuracy of each source by asking who wrote it, when it was written, why it was written, and whether it can be checked against an independent source, and decide whether a source is trustworthy for the specific research question being asked (CCSS W.7.8).',
    },
  ],
  prerequisites: ['m7ela.research-questions'],
  followUps: ['m7ela.quoting-paraphrasing-summarizing'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that the student already sorts sources every day, and that the sorting is usually done on a feeling.',
      script:
        'Somebody in your group chat says there is a secret way to unlock a character in a game. They send a link. The page looks clean, it has a big headline, and it sounds sure of itself. Do you believe it? Most people decide in about two seconds, and they decide on how confident the page sounded. Then they try the trick for twenty minutes and nothing happens. Today you get four questions to ask instead of guessing. And here is the part that surprises people: the same page can be a great source for one question and a terrible source for another. So the four questions are not really about the page. They are about the page and your question together.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-four-questions',
      kind: 'concept',
      goal: 'Install the four credibility questions, the primary and secondary distinction, and the rule that credibility depends on the question being asked.',
      keyIdeas: [
        'QUESTION 1 — WHO WROTE IT, and what do they know about THIS? Look for a name and for a reason to trust that name on this exact topic. A veterinarian who works with rabbits every day knows a lot about rabbits. That same veterinarian does not become an expert on skateboard design. If no author is listed at all, that is a real problem, because there is nobody to check and nobody who has to be right.',
        'QUESTION 2 — WHEN WAS IT WRITTEN, and does that matter here? Age is not automatically bad. It depends on the topic. If you are researching what people ate in your town a hundred years ago, an old source may be the best one you can find. If you are researching what scientists now think about how sharks sleep, a source from long ago may simply be out of date. Ask whether your topic has changed since the source was written.',
        'QUESTION 3 — WHY WAS IT WRITTEN? Every source was made for a reason. Some are made to inform you, some to sell you something, and some to win an argument. Read to the bottom and see what the page wants next. A page that ends with a buy button is selling. A page that ends with a list of where its facts came from is documenting. Purpose does not mean the source is lying. It tells you which parts to check hardest.',
        'QUESTION 4 — CAN I CHECK IT? This one is the strongest, and it is the one students skip. Does the source say where its information came from? And can you find a second, independent source that says the same thing? Independent means the second source did not just copy the first one. Two pages repeating one claim are not two sources. They are one claim, twice.',
        'PRIMARY OR SECONDARY. A primary source comes straight from the event or the person: a letter, a diary, a photograph, an interview, a scientist reporting her own experiment. A secondary source describes or explains something after the fact: a magazine article about that experiment, a textbook chapter about that letter. You need both kinds, and neither kind is automatically better.',
        'CREDIBLE FOR WHAT? This is the whole lesson. A source is not good or bad by itself. It is good or bad for a question. A company page selling a bike helmet cannot settle whether that helmet is the safest one made, because the company wants one answer. That same page is a perfectly good source for what colors the helmet comes in. Having a purpose does not make a source useless. It makes it a source you read differently.',
      ],
      vocabulary: [
        { term: 'credible', definition: 'worth believing, because of who wrote it, why they wrote it, and whether it can be checked.' },
        { term: 'primary source', definition: 'a source that comes straight from the event or the person, such as a letter, a photograph or an interview.' },
        { term: 'secondary source', definition: 'a source that describes or explains something after the fact, such as an article written about an event later.' },
        { term: 'purpose', definition: 'the reason a source was made — to inform, to sell, or to win an argument.' },
        { term: 'independent source', definition: 'a second source that reached the same information on its own instead of copying the first source.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-run-the-four-questions',
      kind: 'worked_example',
      problem:
        'Your research question is: "Why do pet rabbits thump their back feet?" You find a page on the site of a small-animal clinic. It is written by a veterinarian whose name is listed at the top, it says it was updated last year, and at the bottom it lists the animal-behavior guides it used. Run the four questions.',
      steps: [
        'WHO wrote it? A named veterinarian at a clinic that treats small animals. Rabbit behavior is inside what that person actually works with, so the expertise matches the question. Strong.',
        'WHEN was it written? Updated last year. Now ask whether that matters for this topic. Rabbits have not changed their behavior recently, so even an older page would probably be fine here. The date is not a worry. Strong.',
        'WHY was it written? A clinic page explaining rabbit behavior exists to inform pet owners. Read to the bottom and check. There is no product to buy on the page. If it had ended by selling a rabbit supplement, you would still read the behavior part, but you would check any claim that helped sell the supplement.',
        'CAN I CHECK IT? Yes, twice over. The page names the guides it used, so you can see where the information came from. And you can look for a second, independent source, such as a rescue organization that has kept rabbits for years, and see whether it says the same thing about thumping.',
        'Verdict: a strong source for this question. Notice that one thing is still missing. Four questions passed does not mean you are done researching. Find that second independent source anyway, because one source is never enough on its own.',
      ],
      answer:
        'Credible for this question: a named expert on this exact topic, a date that does not matter much here, a purpose of informing rather than selling, and information you can trace and then confirm with a second independent source.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-same-source-two-questions',
      kind: 'worked_example',
      problem:
        'A student researching "Are electric scooters safe for kids riding to school?" cites a page from the company that makes and sells one. The page says the scooter has front and back brakes, comes with a helmet, and is the safest way for a kid to get to school. Is the page usable?',
      steps: [
        'WHO wrote it? Nobody is named. The page is written by the company, which means no person is standing behind the claim. That is question one already failing.',
        'WHY was it written? To sell scooters. Ask what the page wants you to do next, and the answer is at the bottom in a button. That does not prove anything on the page is false. It tells you exactly which claim to be careful with: the one that helps the sale.',
        'CAN I CHECK IT? The safety claim has nothing behind it. The page does not say who tested the scooter or how, and the only testing it mentions is its own. There is no independent source agreeing yet.',
        'So the page cannot answer the safety question. For "are these safe for kids", you need a source with no scooter to sell, such as a report from a group that studies traffic injuries or an article that lists the studies it used.',
        'Now the move that matters. Do not throw the page away. Change the question. The page IS a strong source for what the company says its scooter comes with. It has front and back brakes and it ships with a helmet. Those are facts about the product, and the maker is the one who knows them.',
        'Say why that works. On its own product, the company page is a primary source: it comes straight from the maker. On whether scooters are safe for kids in general, it is an interested party arguing for itself.',
        'The rule: the same source got two different verdicts, and nothing about the source changed. Only the question changed.',
      ],
      answer:
        'Not usable for the safety question, because the seller has a reason to want one answer and offers nothing to check. Usable for what the scooter comes with, because there the company is a primary source about its own product.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-most-credible-for-this-question',
      kind: 'try_yourself',
      problem:
        'Your research question is: "Does listening to music while studying help students remember more?" Which source is the most credible for THAT question?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'An article in a science magazine for young readers, written by a named memory researcher, that lists the studies it used.', correct: true },
        { id: 'b', text: 'A page on the site of a company that sells study playlists, with no author listed.' },
        { id: 'c', text: 'A forum thread where nine students describe how music affects their own homework.' },
        { id: 'd', text: 'A neatly designed site with a serious-sounding name that gives no author and no sources.' },
      ],
      expectedAnswer: 'An article in a science magazine for young readers, written by a named memory researcher, that lists the studies it used.',
      hints: [
        'Run WHO and WHY on each one. Which source names a person with expertise on memory, and which one has something to sell?',
        'Then run CAN I CHECK IT. Two of these give you no way to trace where their information came from, and one offers personal stories rather than anything measured.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-credible-for-which-question',
      kind: 'try_yourself',
      problem:
        'You find a page on the website of the company that makes and sells a brand of bike helmet. Which research question is this page a good source for?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'What sizes and colors this brand of helmet comes in.', correct: true },
        { id: 'b', text: 'Whether this brand of helmet is the safest helmet a rider can buy.' },
        { id: 'c', text: 'Whether wearing a helmet lowers the chance of injury in a bike crash.' },
        { id: 'd', text: 'Which brand of helmet most riders in the country choose.' },
      ],
      expectedAnswer: 'What sizes and colors this brand of helmet comes in.',
      hints: [
        'The page is not useless and it is not trustworthy for everything. Ask which question the company is genuinely the best-informed source about.',
        'For three of these, the company benefits from one particular answer. For one of them, the company is simply reporting a fact about its own product.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-when-depends-on-topic',
      kind: 'try_yourself',
      problem:
        'A student finds a booklet printed in 1962 by a town parks department. It lists the trees planted in the town park that year and names the families who paid for them. Which research question is this booklet a strong source for?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Which trees were planted in the town park in 1962, and who paid for them.', correct: true },
        { id: 'b', text: 'Which kinds of trees grow in the town park today.' },
        { id: 'c', text: 'Which kinds of trees are the best choice to plant in the town now.' },
        { id: 'd', text: 'Whether the town park is a good place to watch birds this spring.' },
      ],
      expectedAnswer: 'Which trees were planted in the town park in 1962, and who paid for them.',
      hints: [
        'Old does not mean wrong. Ask whether your topic has changed since 1962.',
        'For one of these questions the booklet is a primary source, written by the people who did the planting, in the year they did it. For the other three, a lot has happened since.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-medium-and-single-source',
      kind: 'misconception_check',
      question:
        'A student says: "My report only uses one source, but that is fine. It is a printed book from the library, not a website, so I know it is right." What is wrong with that?',
      commonErrors: [
        {
          answer: 'A book is right because it is a book, and a website is wrong because it is a website.',
          misconception:
            'Using the MEDIUM as the test. The student sorts sources by where they appear instead of by who wrote them, why, and whether they can be checked.',
          correctsTo:
            'Where a source appears proves nothing. Books get printed with mistakes in them, and books go out of date and stay on the shelf. Meanwhile some of the most careful writing available is on a website, put there by a named expert who lists every source used. Run the same four questions on both. Ask who wrote it and what they know about this topic, when it was written and whether that matters here, why it was written, and whether you can check it. Paper and screen are not answers to any of those questions.',
        },
        {
          answer: 'One source is enough as long as it is a good source.',
          misconception:
            'Stopping at one source because it looked convincing. The student treats question four as satisfied by the source itself.',
          correctsTo:
            'One source cannot check itself. The whole point of question four is finding a SECOND source that reached the same information independently, meaning it did not just copy the first one. Two independent sources that agree are far stronger evidence than one impressive source alone. And if the second source disagrees, you have learned something important that one source would have hidden from you.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Four questions for every source: WHO wrote it and what do they know about this, WHEN was it written and does that matter here, WHY was it written, and CAN I CHECK IT.',
        'A source is credible FOR A QUESTION, not in general. Ask what you are trying to find out before you judge the source.',
        'Purpose does not make a source useless. A seller is a fine source for what its product comes with, and a poor source for whether its product is the best.',
        'Old is not the same as wrong. For a past event, an old source may be a primary source and the best one you have. For a topic that keeps changing, an old source may be out of date.',
        'No author listed is a real problem, and a neat, serious-looking design is not evidence of anything. Anyone can make a page look official.',
        'One source is never enough. Find a second, independent source that did not simply copy the first.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '10', cedTopic: '10.2', cedTitle: 'Evaluating Sources' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
