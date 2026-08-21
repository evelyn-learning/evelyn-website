/**
 * Grade 7 English Language Arts — Unit 10 CED 10.4: Citing Sources & Avoiding Plagiarism.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m7ela.citing-sources.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M7ELA_U10_CITING_SOURCES: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m7ela.citing-sources.v1',
  course: 'Grade 7 English Language Arts',
  cedUnit: 10,
  cedTopic: '10.4',
  cedTitle: 'Citing Sources & Avoiding Plagiarism',
  planId: 'evelyn.ms.m7ela.citing-sources.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-20',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m7ela.citing-sources.v1' }],
  theory: [
    { loId: 'm7ela.citing-sources', content: `CITATION DOES TWO JOBS. First, it lets a reader check you. A reader who wants to see the thing for themselves can follow your citation straight to it. Second, it puts the credit where it is owed. Somebody found that information, and naming them is how you say so. Both jobs happen at once, and both are ordinary. This is a habit, not a punishment.` },
    { loId: 'm7ela.citing-sources', kind: 'framework', title: 'What needs a citation', content: `WHAT NEEDS A CITATION — a direct quotation, a paraphrase, a summary, somebody else's idea or opinion, a statistic or measurement, and any image, map or chart you did not make yourself. Notice that four of those six are things you wrote in your OWN words. Rewording changes the words. It does not change who found the information.` },
    { loId: 'm7ela.citing-sources', kind: 'framework', title: 'What does not need a citation', content: `WHAT DOES NOT NEED A CITATION — common knowledge, which means something a general reader would already accept without checking. "A week has seven days" is common knowledge. It does NOT mean anything you happen to know already. You might know a lot about lizards, but a specific fact about how long a certain lizard lives came from somewhere, and it gets a source. The rule when you are stuck: if you are unsure, cite it. There is no penalty for one extra citation.` },
    { loId: 'm7ela.citing-sources', content: `A CITATION CARRIES FIVE PIECES, and each one has a reason. WHO made it, because credit goes to a person or a group. WHAT it is called, because titles are how a reader searches. WHERE it was published, meaning the website, magazine or book it sits inside, because that tells a reader what kind of source it is. WHEN it came out, because information ages. And WHERE YOU FOUND IT, such as the link or the library, because that is the path a reader retraces.` },
    { loId: 'm7ela.citing-sources', content: `CREDIT GOES IN TWO PLACES, and you need both. IN-TEXT CREDIT sits right beside the borrowed material, inside your own sentence: "A city parks newsletter reported that the skate ramps were rebuilt after students asked for them." That tells the reader, at the exact moment it matters, that this part is not yours. The WORKS-CITED ENTRY sits in a list at the end and carries all five pieces so the reader can find the source. A list at the end does not cover the in-text credit, because a reader in the middle of your paragraph cannot tell which sentence came from which entry.` },
    { loId: 'm7ela.citing-sources', content: `MOST PLAGIARISM IS A NOTE-TAKING ACCIDENT, not a plan. A student copies a sentence into their notes, comes back three days later, and cannot remember which lines were copied and which were their own. So the prevention is a habit, and it costs about four seconds. The moment you copy anything, write the source next to it. The moment you copy exact words, put quotation marks around them right then. Keep your own thoughts in a separate column or a different color. Notes that are honest are almost impossible to plagiarize from.` },
    { loId: 'm7ela.citing-sources', kind: 'definition', title: 'citation', content: `the information that tells a reader where something came from, so they can find it and so the person who made it gets the credit.` },
    { loId: 'm7ela.citing-sources', kind: 'definition', title: 'in-text credit', content: `the short mention of the source inside your own sentence, right next to the borrowed material.` },
    { loId: 'm7ela.citing-sources', kind: 'definition', title: 'works-cited entry', content: `the full listing of one source in the list at the end of your paper, carrying all five pieces of information.` },
    { loId: 'm7ela.citing-sources', kind: 'definition', title: 'common knowledge', content: `something a general reader would already accept without a source, such as the number of days in a week.` },
    { loId: 'm7ela.citing-sources', kind: 'definition', title: 'plagiarism', content: `using somebody else's words or ideas without giving them credit, whether it was done on purpose or by accident.` },
  ],
  methods: [
    {
      title: 'Worked build a citation',
      steps: [
        `First decide whether this even needs a citation. It is a finding about how shy dogs behave. A general reader would not already accept that without checking, so it is not common knowledge. It needs a source.`,
        `Now run the five pieces against your note. WHO made it: missing. WHAT it is called: you wrote "HAPPY DOGS ARTICLE," which is your nickname for it, not the real title. WHERE it was published: missing. WHEN it came out: missing. WHERE YOU FOUND IT: missing. Four and a half pieces gone, and it has been three days.`,
        `There is a second problem hiding here. You cannot tell whether those words are the writer's or yours. You did not put quotation marks on anything, so you have no way to know now. That is exactly how accidental plagiarism happens.`,
        `Go back and open the source again. This time collect all five: the author is Dana Okafor, the article is called "How Shelters Match Dogs With Families," it was published on a site called Neighborhood Paws, it went up on April 9 of last year, and the link is neighborhoodpaws.example/matching.`,
        `Build the works-cited entry. Here is ONE COMMON FORMAT, and your school may use a slightly different one: Okafor, Dana. "How Shelters Match Dogs With Families." Neighborhood Paws, 9 April 2025, neighborhoodpaws.example/matching. Do not memorize where the periods go. Look that up when you need it. Memorize the five pieces, because those are what a reader actually needs.`,
        `Then write the in-text credit into your own sentence: "Dana Okafor, writing for Neighborhood Paws, explains that shy dogs settle faster in a quiet room than in a busy hallway." Now the reader knows which sentence is borrowed AND can find the source in your list.`,
      ],
      example: { problem: `Here is a line from your research notes, exactly as you wrote it: HAPPY DOGS ARTICLE - shy dogs settle faster in a quiet room than in a hallway where people keep walking past. What is missing, and how do you turn this into a usable citation?`, solution: `The note is missing four of the five pieces (who, the real title, where it was published, when, and the link) and it does not show whether the words were copied. Reopen the source, collect all five, write the works-cited entry, and add in-text credit inside your own sentence: "Dana Okafor, writing for Neighborhood Paws, explains that shy dogs settle faster in a quiet room than in a busy hallway."` },
      relatedLoIds: ['m7ela.citing-sources'],
    },
    {
      title: 'Worked list does not cover it',
      steps: [
        `Start with the middle sentence. He reworded it, so no exact words were copied. He still borrowed the finding. Rewording changes the wording and nothing else, so this sentence needs credit.`,
        `He says the list at the end covers it. Test that claim from the reader's side. A reader in the middle of this paragraph sees three sentences and has no way to tell which one came from the newsletter. Sentence one is his opinion, sentence three is something he can see with his own eyes, and sentence two is borrowed, but they all look identical on the page.`,
        `Name the error: the works-cited list gives the reader the five pieces, but only IN-TEXT CREDIT tells the reader WHICH part is borrowed. Both jobs need doing, and the list only does one of them.`,
        `Fix it by naming the source inside the sentence itself. "A county library newsletter reported that students without a quiet place at home are more likely to finish homework at school."`,
        `Now check sentence three, "The library is already staffed until four." He knows that because he walks past the desk. It is his own observation about his own school, so it needs no source. Not everything in a paragraph gets cited.`,
        `Read the repaired paragraph and confirm both jobs are done: the reader can tell which sentence is borrowed, and the entry at the end lets the reader go find it.`,
      ],
      example: { problem: `A student hands in this paragraph. "Our school should keep the library open after last bell. Students who have nowhere quiet to work at home get their homework done at school instead. The library is already staffed until four." He put one entry in his works-cited list at the end and says the list covers everything. The middle sentence came from an invented source, a county library newsletter, and he reworded it. What is wrong, and how is it fixed?`, solution: `Rewording does not remove the need for credit, and a works-cited list alone cannot show WHICH sentence is borrowed. Add in-text credit: "Our school should keep the library open after last bell. A county library newsletter reported that students without a quiet place at home are more likely to finish homework at school. The library is already staffed until four."` },
      relatedLoIds: ['m7ela.citing-sources'],
    },
  ],
  pointers: [
    { content: `Students often say "You only have to cite direct quotes. If you reword it enough, it becomes yours." — Credit is owed for the information, not the phrasing. A paraphrase and a summary both need a citation, because somebody else found that information no matter who typed the sentence. And rewording is not automatic either: if you keep the source's sentence and only swap in a few similar words, you have not really put it in your own words at all. Close the source, say the idea out loud your own way, then write that down and name where it came from.`, kind: 'common-error' },
    { content: `Students often say "The works-cited list at the end covers everything, so in-text credit is not necessary." — The list does one job: it gives the reader the five pieces they need to go find each source. It cannot do the other job. A reader standing in the middle of your paragraph cannot tell which sentence came from which entry, or whether a sentence came from a source at all. In-text credit is what answers that, right where it matters, inside your own sentence.`, kind: 'common-error' },
    { content: `Cite for two reasons: so a reader can go check it, and so credit lands on whoever did the work.`, kind: 'tip' },
    { content: `Cite quotations, paraphrases, summaries, somebody else's idea, a statistic, and any image you did not make. Rewording does not cancel the citation.`, kind: 'tip' },
    { content: `Common knowledge is what a general reader would already accept without a source, not whatever you happen to know already. If you are unsure, cite it.`, kind: 'tip' },
    { content: `A citation carries five pieces: who made it, what it is called, where it was published, when it came out, and where you found it.`, kind: 'tip' },
    { content: `Credit goes in two places. In-text credit sits inside your sentence and shows which part is borrowed; the works-cited entry sits in the list at the end and lets the reader find it. The list alone does not cover the paragraph.`, kind: 'tip' },
    { content: `Formats differ from school to school, so look up where the periods go and memorize the five pieces instead.`, kind: 'tip' },
    { content: `Prevent accidental plagiarism in your notes: write the source down the moment you copy anything, and put quotation marks on exact words right then.`, kind: 'tip' },
    { content: `"Common knowledge" means what a *general reader* already accepts, not what *you* already know. You may know a gecko's lifespan by heart — that still came from somewhere and still needs a source. Stuck? Cite it. One extra citation costs you nothing.`, kind: 'vocab-note' },
    { content: `Rewording changes the words, not who found the information. Paraphrases and summaries need citations exactly as much as quotations do. Four of the six things on the 'must cite' list are things you wrote in your own words.`, kind: 'common-error' },
    { content: `A works-cited list at the end does NOT cover your paragraph. It tells a reader where a source lives; only in-text credit tells them *which sentence* is borrowed. Do both. Neither one substitutes for the other.`, kind: 'gotcha' },
    { content: `Swapping in a few similar words while keeping the source's sentence order is still copying. Real paraphrasing: close the source, say the idea out loud your own way, then write it down — and still name where it came from.`, kind: 'common-error' },
    { content: `Don't count your nickname for a source as the title. "HAPPY DOGS ARTICLE" is not what it's called — a reader can't search for that. Record the real title as it appears on the page.`, kind: 'gotcha' },
    { content: `In your notes, quotation marks are a time machine. Put them on exact words the *second* you copy, plus the source beside it. Three days later you cannot reconstruct what was copied and what was yours — that's how honest students plagiarize.`, kind: 'tip' },
    { content: `Not every sentence gets a citation. Your own opinion and your own observation ("the library is staffed until four — I walk past it") need no source. Cite what you borrowed, not the whole paragraph.`, kind: 'edge-case' },
    { content: `Memorize the five pieces — who, what it's called, where published, when, where you found it. Do NOT memorize where the periods and italics go; formats differ by school, so look that up. The five pieces are what a reader actually needs.`, kind: 'tip' },
  ],
};
