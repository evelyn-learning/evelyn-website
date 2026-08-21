/**
 * Grade 7 English Language Arts — Unit 10 CED 10.2: Evaluating Sources.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m7ela.evaluating-sources.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M7ELA_U10_EVALUATING_SOURCES: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m7ela.evaluating-sources.v1',
  course: 'Grade 7 English Language Arts',
  cedUnit: 10,
  cedTopic: '10.2',
  cedTitle: 'Evaluating Sources',
  planId: 'evelyn.ms.m7ela.evaluating-sources.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-20',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m7ela.evaluating-sources.v1' }],
  theory: [
    { loId: 'm7ela.evaluating-sources', kind: 'framework', title: 'Question 1', content: `QUESTION 1 — WHO WROTE IT, and what do they know about THIS? Look for a name and for a reason to trust that name on this exact topic. A veterinarian who works with rabbits every day knows a lot about rabbits. That same veterinarian does not become an expert on skateboard design. If no author is listed at all, that is a real problem, because there is nobody to check and nobody who has to be right.` },
    { loId: 'm7ela.evaluating-sources', kind: 'framework', title: 'Question 2', content: `QUESTION 2 — WHEN WAS IT WRITTEN, and does that matter here? Age is not automatically bad. It depends on the topic. If you are researching what people ate in your town a hundred years ago, an old source may be the best one you can find. If you are researching what scientists now think about how sharks sleep, a source from long ago may simply be out of date. Ask whether your topic has changed since the source was written.` },
    { loId: 'm7ela.evaluating-sources', kind: 'framework', title: 'Question 3', content: `QUESTION 3 — WHY WAS IT WRITTEN? Every source was made for a reason. Some are made to inform you, some to sell you something, and some to win an argument. Read to the bottom and see what the page wants next. A page that ends with a buy button is selling. A page that ends with a list of where its facts came from is documenting. Purpose does not mean the source is lying. It tells you which parts to check hardest.` },
    { loId: 'm7ela.evaluating-sources', kind: 'framework', title: 'Question 4', content: `QUESTION 4 — CAN I CHECK IT? This one is the strongest, and it is the one students skip. Does the source say where its information came from? And can you find a second, independent source that says the same thing? Independent means the second source did not just copy the first one. Two pages repeating one claim are not two sources. They are one claim, twice.` },
    { loId: 'm7ela.evaluating-sources', content: `PRIMARY OR SECONDARY. A primary source comes straight from the event or the person: a letter, a diary, a photograph, an interview, a scientist reporting her own experiment. A secondary source describes or explains something after the fact: a magazine article about that experiment, a textbook chapter about that letter. You need both kinds, and neither kind is automatically better.` },
    { loId: 'm7ela.evaluating-sources', content: `CREDIBLE FOR WHAT? This is the whole lesson. A source is not good or bad by itself. It is good or bad for a question. A company page selling a bike helmet cannot settle whether that helmet is the safest one made, because the company wants one answer. That same page is a perfectly good source for what colors the helmet comes in. Having a purpose does not make a source useless. It makes it a source you read differently.` },
    { loId: 'm7ela.evaluating-sources', kind: 'definition', title: 'credible', content: `worth believing, because of who wrote it, why they wrote it, and whether it can be checked.` },
    { loId: 'm7ela.evaluating-sources', kind: 'definition', title: 'primary source', content: `a source that comes straight from the event or the person, such as a letter, a photograph or an interview.` },
    { loId: 'm7ela.evaluating-sources', kind: 'definition', title: 'secondary source', content: `a source that describes or explains something after the fact, such as an article written about an event later.` },
    { loId: 'm7ela.evaluating-sources', kind: 'definition', title: 'purpose', content: 'the reason a source was made — to inform, to sell, or to win an argument.' },
    { loId: 'm7ela.evaluating-sources', kind: 'definition', title: 'independent source', content: `a second source that reached the same information on its own instead of copying the first source.` },
  ],
  methods: [
    {
      title: 'Worked run the four questions',
      steps: [
        `WHO wrote it? A named veterinarian at a clinic that treats small animals. Rabbit behavior is inside what that person actually works with, so the expertise matches the question. Strong.`,
        `WHEN was it written? Updated last year. Now ask whether that matters for this topic. Rabbits have not changed their behavior recently, so even an older page would probably be fine here. The date is not a worry. Strong.`,
        `WHY was it written? A clinic page explaining rabbit behavior exists to inform pet owners. Read to the bottom and check. There is no product to buy on the page. If it had ended by selling a rabbit supplement, you would still read the behavior part, but you would check any claim that helped sell the supplement.`,
        `CAN I CHECK IT? Yes, twice over. The page names the guides it used, so you can see where the information came from. And you can look for a second, independent source, such as a rescue organization that has kept rabbits for years, and see whether it says the same thing about thumping.`,
        `Verdict: a strong source for this question. Notice that one thing is still missing. Four questions passed does not mean you are done researching. Find that second independent source anyway, because one source is never enough on its own.`,
      ],
      example: { problem: `Your research question is: "Why do pet rabbits thump their back feet?" You find a page on the site of a small-animal clinic. It is written by a veterinarian whose name is listed at the top, it says it was updated last year, and at the bottom it lists the animal-behavior guides it used. Run the four questions.`, solution: `Credible for this question: a named expert on this exact topic, a date that does not matter much here, a purpose of informing rather than selling, and information you can trace and then confirm with a second independent source.` },
      relatedLoIds: ['m7ela.evaluating-sources'],
    },
    {
      title: 'Worked same source two questions',
      steps: [
        `WHO wrote it? Nobody is named. The page is written by the company, which means no person is standing behind the claim. That is question one already failing.`,
        `WHY was it written? To sell scooters. Ask what the page wants you to do next, and the answer is at the bottom in a button. That does not prove anything on the page is false. It tells you exactly which claim to be careful with: the one that helps the sale.`,
        `CAN I CHECK IT? The safety claim has nothing behind it. The page does not say who tested the scooter or how, and the only testing it mentions is its own. There is no independent source agreeing yet.`,
        `So the page cannot answer the safety question. For "are these safe for kids", you need a source with no scooter to sell, such as a report from a group that studies traffic injuries or an article that lists the studies it used.`,
        `Now the move that matters. Do not throw the page away. Change the question. The page IS a strong source for what the company says its scooter comes with. It has front and back brakes and it ships with a helmet. Those are facts about the product, and the maker is the one who knows them.`,
        `Say why that works. On its own product, the company page is a primary source: it comes straight from the maker. On whether scooters are safe for kids in general, it is an interested party arguing for itself.`,
        `The rule: the same source got two different verdicts, and nothing about the source changed. Only the question changed.`,
      ],
      example: { problem: `A student researching "Are electric scooters safe for kids riding to school?" cites a page from the company that makes and sells one. The page says the scooter has front and back brakes, comes with a helmet, and is the safest way for a kid to get to school. Is the page usable?`, solution: `Not usable for the safety question, because the seller has a reason to want one answer and offers nothing to check. Usable for what the scooter comes with, because there the company is a primary source about its own product.` },
      relatedLoIds: ['m7ela.evaluating-sources'],
    },
  ],
  pointers: [
    { content: `Students often say "A book is right because it is a book, and a website is wrong because it is a website." — Where a source appears proves nothing. Books get printed with mistakes in them, and books go out of date and stay on the shelf. Meanwhile some of the most careful writing available is on a website, put there by a named expert who lists every source used. Run the same four questions on both. Ask who wrote it and what they know about this topic, when it was written and whether that matters here, why it was written, and whether you can check it. Paper and screen are not answers to any of those questions.`, kind: 'common-error' },
    { content: `Students often say "One source is enough as long as it is a good source." — One source cannot check itself. The whole point of question four is finding a SECOND source that reached the same information independently, meaning it did not just copy the first one. Two independent sources that agree are far stronger evidence than one impressive source alone. And if the second source disagrees, you have learned something important that one source would have hidden from you.`, kind: 'common-error' },
    { content: `Four questions for every source: WHO wrote it and what do they know about this, WHEN was it written and does that matter here, WHY was it written, and CAN I CHECK IT.`, kind: 'tip' },
    { content: `A source is credible FOR A QUESTION, not in general. Ask what you are trying to find out before you judge the source.`, kind: 'tip' },
    { content: `Purpose does not make a source useless. A seller is a fine source for what its product comes with, and a poor source for whether its product is the best.`, kind: 'tip' },
    { content: `Old is not the same as wrong. For a past event, an old source may be a primary source and the best one you have. For a topic that keeps changing, an old source may be out of date.`, kind: 'tip' },
    { content: `No author listed is a real problem, and a neat, serious-looking design is not evidence of anything. Anyone can make a page look official.`, kind: 'tip' },
    { content: `One source is never enough. Find a second, independent source that did not simply copy the first.`, kind: 'tip' },
    { content: `Never say a source is "credible" full stop. Always finish the sentence: credible **for what question**. The scooter company page is bad for "are scooters safe?" and good for "what does this scooter come with?" — same page, different verdicts.`, kind: 'vocab-note' },
    { content: `Two websites saying the same sentence are not two sources if one copied the other. "Independent" means the second source found it out on its own. Check whether the second page just links back to the first.`, kind: 'vocab-note' },
    { content: `Don't treat old = wrong. A 1962 parks booklet is the *best* source for what was planted in 1962. Ask instead: has this topic changed since then? Shark science changes; a list of trees planted that year does not.`, kind: 'edge-case' },
    { content: `A book is not automatically right and a website is not automatically wrong. Where a source *appears* answers none of the four questions. Run WHO, WHEN, WHY, CAN I CHECK IT on print and screen the same way.`, kind: 'common-error' },
    { content: `An expert is only an expert on their own subject. A rabbit vet is strong on why rabbits thump and no better than anyone else on skateboard design. Match the person's expertise to *your exact question*, not just to "science" or "animals."`, kind: 'gotcha' },
    { content: `Passing all four questions does not mean you're finished. Even a strong source needs a second, independent one beside it. One source can't check itself — and if the second one disagrees, that's information you needed.`, kind: 'tip' },
    { content: `"Primary" doesn't mean better. A company is a primary source about its own product — and still a weak source for whether that product is safest. Primary vs. secondary tells you *how close* a source is to the event, not how trustworthy it is.`, kind: 'vocab-note' },
    { content: `To find purpose, scroll to the bottom. A buy button means selling; a list of sources means documenting. And having a purpose isn't proof of lying — it just tells you which claim to check hardest, usually the one that helps the sale.`, kind: 'tip' },
  ],
};
