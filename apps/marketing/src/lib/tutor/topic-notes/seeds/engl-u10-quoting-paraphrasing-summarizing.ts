/**
 * HS English — Unit 10 CED 10.3: Quoting, Paraphrasing & Summarizing.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.engl.quoting-paraphrasing-summarizing.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_ENGL_U10_QUOTING_PARAPHRASING_SUMMARIZING: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.engl.quoting-paraphrasing-summarizing.v1',
  course: 'HS English',
  cedUnit: 10,
  cedTopic: '10.3',
  cedTitle: 'Quoting, Paraphrasing & Summarizing',
  planId: 'evelyn.hs.engl.quoting-paraphrasing-summarizing.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.engl.quoting-paraphrasing-summarizing.v1' }],
  theory: [
    { loId: 'engl.quoting-paraphrasing-summarizing', kind: 'framework', title: 'The three moves', content: `THE THREE MOVES — QUOTE reproduces the source word for word inside quotation marks. PARAPHRASE restates one specific passage completely in your own words and your own sentence structure, running about the same length as the original. SUMMARIZE compresses a large stretch of source material down to its main points, so it is always much shorter than what it covers.` },
    { loId: 'engl.quoting-paraphrasing-summarizing', kind: 'framework', title: 'When quoting wins', content: `WHEN QUOTING WINS — quote when the WORDING ITSELF is the evidence: a phrase so precise or so strange that rewording it would destroy the point, a definition you intend to argue with, or a line whose exact tone matters. If you cannot say why those particular words are necessary, you do not need the quotation marks.` },
    { loId: 'engl.quoting-paraphrasing-summarizing', kind: 'framework', title: 'When paraphrasing wins', content: `WHEN PARAPHRASING WINS — paraphrase when the IDEA matters and the wording does not. This is the default move in most research writing, because it proves you understood the source well enough to rebuild it, and it keeps your own voice running through the paragraph.` },
    { loId: 'engl.quoting-paraphrasing-summarizing', kind: 'framework', title: 'When summarizing wins', content: `WHEN SUMMARIZING WINS — summarize when you need the shape of a whole report, chapter, or study rather than one passage: background your reader needs before your argument starts, or a fair account of a position you plan to answer. A summary reports the main points only and leaves the details behind.` },
    { loId: 'engl.quoting-paraphrasing-summarizing', kind: 'framework', title: 'The patchwriting trap', content: `THE PATCHWRITING TRAP — swapping in synonyms while keeping the source's sentence structure is NOT a paraphrase. It is patchwriting, and it counts as plagiarism. If your sentence marches through the original word order with a thesaurus laid over the top, you have copied the sentence and only redecorated it.` },
    { loId: 'engl.quoting-paraphrasing-summarizing', kind: 'framework', title: 'The close-the-book method', content: `THE CLOSE-THE-BOOK METHOD — read the passage until you can state its point out loud, then cover the source and write your version from memory. Only after your sentence exists do you look back, and only to check accuracy — never to borrow phrasing. Starting from the source sentence and editing it downward is how patchwriting happens.` },
    { loId: 'engl.quoting-paraphrasing-summarizing', kind: 'framework', title: 'All three moves need a citation', content: `ALL THREE MOVES NEED A CITATION — quoting, paraphrasing, and summarizing all use someone else's material, so all three get credited. Losing the quotation marks does not make the idea yours. The only thing that never needs a citation is common knowledge and your own thinking.` },
    { loId: 'engl.quoting-paraphrasing-summarizing', kind: 'framework', title: 'Quote sparingly', content: `QUOTE SPARINGLY — a paper stitched together from quotations is a quote collage, not an argument. Your sentences should carry the reasoning, with quotations dropped in where the exact words earn their place.` },
    { loId: 'engl.quoting-paraphrasing-summarizing', kind: 'definition', title: 'paraphrase', content: `a complete restatement of one passage in your own words AND your own sentence structure, at roughly the original length.` },
    { loId: 'engl.quoting-paraphrasing-summarizing', kind: 'definition', title: 'patchwriting', content: `a near-copy that replaces some words with synonyms but keeps the source's sentence structure — a form of plagiarism, citation or not.` },
  ],
  methods: [
    {
      title: 'Worked close the book',
      steps: [
        `Decide the move first. The wording here is plain — nothing about it is memorable or arguable. The IDEA is what you need, so this is a paraphrase, not a quotation.`,
        `Read until you can say the point out loud without looking: beaver dams hold back the melt, the water stays around longer, and that changed how ranchers feel about beavers.`,
        `Now close the book. Cover the passage and write your version from memory, in your own sentence shape. Notice that this is where a different structure comes from — you are building from the idea, not editing the original.`,
        `Write it: "Where beavers build, the runoff from melting snow does not rush straight through to the valley floor; it sits on the land for an extra few weeks. That extra water keeps summer pasture alive, which is why some ranchers who used to want the beavers gone now want them to stay."`,
        `Check accuracy against the source, then check length: two sentences for two, roughly the same size. A paraphrase does not shrink the passage — that would be a summary.`,
        `Add the citation. A paraphrase is still the bulletin's finding, so it gets credited exactly like a quotation would.`,
      ],
      example: { problem: `Paraphrase this passage from a county wildlife bulletin for a research paper: "Beaver dams slow the spring melt before it reaches the lower valley, holding water on the land for weeks longer than an undammed stream would. Ranchers downstream who once treated the animals as pests now credit them with keeping the summer pasture green."`, solution: `A full rewrite built from memory: "Where beavers build, the runoff from melting snow does not rush straight through to the valley floor; it sits on the land for an extra few weeks. That extra water keeps summer pasture alive, which is why some ranchers who used to want the beavers gone now want them to stay." — cited to the bulletin.` },
      relatedLoIds: ['engl.quoting-paraphrasing-summarizing'],
    },
    {
      title: 'Worked patchwriting trap',
      steps: [
        `Line the two sentences up and compare them piece by piece rather than reading for overall feel. That comparison is what exposes patchwriting.`,
        `Source: "The new bus lanes" / "cut" / "average downtown travel times" / "by nine minutes" / "but ridership rose only slightly" / "in the first year."`,
        `Student: "The fresh bus lanes" / "reduced" / "typical downtown trip times" / "by nine minutes" / "however ridership increased only a little" / "in the first year."`,
        `Every slot matches in the same order. New for old, cut for reduced, average for typical, rose for increased — the student changed the vocabulary and left the sentence skeleton untouched. That is patchwriting, and it is plagiarism.`,
        `The citation does not rescue it. A citation says where an idea came from; it does not give permission to reuse someone else's sentence structure. Either quote the line exactly with quotation marks, or genuinely rewrite it.`,
        `Fix it with the close-the-book method. Cover the source, state the point from memory, and let the new sentence find its own shape: "Downtown trips got about nine minutes faster once the bus lanes opened. The riders, though, did not follow — year-one ridership barely moved (City Report)." Two ideas, reordered, in the student's own construction.`,
      ],
      example: { problem: `A student is working from this line in a city report: "The new bus lanes cut average downtown travel times by nine minutes, but ridership rose only slightly in the first year." The student writes: "The fresh bus lanes reduced typical downtown trip times by nine minutes, however ridership increased only a little in the first year (City Report)." The citation is there. Is this an acceptable paraphrase?`, solution: `No — it is patchwriting. The synonyms are swapped in but the source's sentence structure is copied intact, and a citation does not make that acceptable. Rewrite it from memory, for example: "Downtown trips got about nine minutes faster once the bus lanes opened. The riders, though, did not follow — year-one ridership barely moved (City Report)."` },
      relatedLoIds: ['engl.quoting-paraphrasing-summarizing'],
    },
  ],
  pointers: [
    { content: `A citation answers "whose idea is this?" — it does not license reusing someone else's sentence structure. Borrowed wording needs quotation marks; a paraphrase must be genuinely rebuilt in new structure from memory. A cited patchwrite is still plagiarism, because the reader is being shown a sentence the student did not actually write.`, kind: 'common-error' },
    { content: `Quote when the exact words are the evidence; paraphrase when the idea matters and the wording does not; summarize when you need the main points of something large.`, kind: 'tip' },
    { content: `A real paraphrase changes the words AND the sentence structure, and stays about the same length as the original.`, kind: 'tip' },
    { content: `Patchwriting — the source's sentence shape with synonyms dropped in — is plagiarism, and a citation does not fix it.`, kind: 'tip' },
    { content: `Close the book: state the point from memory, write your sentence, then look back only to check accuracy.`, kind: 'tip' },
    { content: `All three moves get a citation, and quotations stay rare — your sentences should carry the argument.`, kind: 'tip' },
    { content: `A paraphrase is about the SAME LENGTH as the original; a summary is much shorter. If you 'paraphrased' a five-sentence passage into one sentence, you actually summarized it — and probably dropped detail your argument needed.`, kind: 'vocab-note' },
    { content: `Don't test your paraphrase by 'feel.' Line it up against the source slot by slot — subject, verb, modifier, clause order. If every slot matches in the same order with synonyms swapped in, it's patchwriting, no matter how different it sounds to you.`, kind: 'common-error' },
    { content: `A citation answers 'whose idea is this?' — it does not license borrowed wording or sentence shape. Cited patchwriting is still plagiarism. Borrowed words need quotation marks; borrowed structure needs a real rewrite.`, kind: 'gotcha' },
    { content: `Paraphrases and summaries need citations too. Losing the quotation marks doesn't make the idea yours — only common knowledge and your own thinking go uncited.`, kind: 'common-error' },
    { content: `Never start from the source sentence and edit it down. Cover the passage, say the point out loud, write from memory, then look back ONLY to check accuracy. Editing the original downward is the mechanism that produces patchwriting.`, kind: 'tip' },
    { content: `Before reaching for quotation marks, ask: why THESE words? If the wording is plain and you could say it yourself, paraphrase. Quote only when the phrasing is the evidence — a strange precise term, a definition you'll argue with, or a tone you need the reader to hear.`, kind: 'tip' },
    { content: `Keep proper nouns, technical terms, and numbers as they are — you can't 'paraphrase' *412 nesting pairs* or *photosynthesis*. Reaching for a synonym there creates false information, not originality.`, kind: 'edge-case' },
    { content: `A summary must stay faithful, not just short. Don't smuggle in your own judgment or promote a minor detail to the main point — summarize a position fairly even when you plan to argue against it.`, kind: 'gotcha' },
  ],
};
