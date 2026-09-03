/**
 * Grade 6 English Language Arts — Unit 10 CED 10.4: Giving Basic Source Information.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m6ela.giving-basic-source-information.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M6ELA_U10_GIVING_BASIC_SOURCE_INFORMATION: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m6ela.giving-basic-source-information.v1',
  course: 'Grade 6 English Language Arts',
  cedUnit: 10,
  cedTopic: '10.4',
  cedTitle: 'Giving Basic Source Information',
  planId: 'evelyn.ms.m6ela.giving-basic-source-information.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-03',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m6ela.giving-basic-source-information.v1' }],
  theory: [
    { loId: 'm6ela.giving-basic-source-information', kind: 'framework', title: 'A source is anywhere information comes from', content: `A SOURCE IS ANYWHERE INFORMATION COMES FROM — a website, a book, a magazine, or a video. Whenever a source gets quoted, paraphrased, or just used for a fact, a short record of it gets kept so it can be found again later.` },
    { loId: 'm6ela.giving-basic-source-information', content: `A COMPLETE BASIC SOURCE RECORD HAS THREE PIECES. WHO made it — the person or group responsible for it, such as a writer, a magazine's staff, or the channel that posted a video. WHAT it is called — the exact title, printed on the source itself. WHERE it can be found — the name of the place holding it, such as a website, a magazine, a book, or a channel, clear enough that someone else could go find it there.` },
    { loId: 'm6ela.giving-basic-source-information', content: `THE TOPIC IS NOT THE TITLE. Writing what a source is about, such as "the chicken article" or "the frog video," is not the same as writing what it is actually called. The real title sits printed on the source itself, and that exact wording is what belongs in the record.` },
    { loId: 'm6ela.giving-basic-source-information', content: `THE PERSON WHO MADE A SOURCE IS NOT ALWAYS THE PERSON QUOTED INSIDE IT. A magazine article can quote someone the writer interviewed. A video can feature a guest speaking on camera. The maker of the source — the writer, the magazine, or the channel — goes in the WHO spot, not a person the source merely quotes or features.` },
    { loId: 'm6ela.giving-basic-source-information', content: `WRITE THE RECORD DOWN THE MOMENT A SOURCE GETS USED. Waiting until later means trying to remember an exact title or an author's name from memory, and those details fade fast. Three short labeled lines take a few seconds and save the trouble entirely.` },
    { loId: 'm6ela.giving-basic-source-information', content: `THIS IS A RECORD, NOT YET A FORMATTED CITATION. Arranging these three pieces into one exact order with specific punctuation is a later skill. For now the job is only to capture WHO, WHAT, and WHERE accurately, in any clear layout, such as three labeled lines.` },
    { loId: 'm6ela.giving-basic-source-information', kind: 'definition', title: 'source', content: `a place information comes from, such as a website, a book, a magazine, or a video.` },
    { loId: 'm6ela.giving-basic-source-information', kind: 'definition', title: 'author', content: `the person or group who made a source, such as a writer, a magazine's staff, or the channel that posted a video.` },
    { loId: 'm6ela.giving-basic-source-information', kind: 'definition', title: 'title', content: 'the exact name of a source, printed on the source itself.' },
    { loId: 'm6ela.giving-basic-source-information', kind: 'definition', title: 'source record', content: `a short note that saves the who, what, and where of a source together, so it can be found again.` },
    { loId: 'm6ela.giving-basic-source-information', kind: 'definition', title: 'quoted', content: `featured or interviewed inside a source, without being the person or group who made it.` },
  ],
  methods: [
    {
      title: 'Worked fix a website note',
      steps: [
        `Check the note against the three pieces one at a time, starting with WHERE. It already has coopcorner.example, which is enough to point back to the website, so WHERE is in decent shape.`,
        `Check WHO. No name appears anywhere in the note. Go back to the page and look for a byline — it reads "By Priya Anand." Add that name to the record.`,
        `Check WHAT. The note says "chickens," which is the topic the article covers, not its title. Look at the top of the page for the exact words printed there: "Picking the Right Chicken Breed for Your Yard." That exact wording replaces "chickens" in the record.`,
        `Write the three pieces as three labeled lines instead of one running phrase, so nothing gets lost again: WHO: Priya Anand. WHAT: "Picking the Right Chicken Breed for Your Yard." WHERE: Coop Corner, coopcorner.example.`,
        `Read the finished record back and confirm all three pieces are there and none of them is standing in for another: a name in the WHO spot, an exact title in the WHAT spot, and a place in the WHERE spot.`,
      ],
      example: { problem: `A student is taking notes for something she is writing about backyard chickens. She found a website called Coop Corner with an article by Priya Anand titled "Picking the Right Chicken Breed for Your Yard." Her note so far says only this: "chickens - coopcorner.example". Fix her note into a complete basic source record.`, solution: `WHO: Priya Anand. WHAT: "Picking the Right Chicken Breed for Your Yard." WHERE: Coop Corner, coopcorner.example. The original note had part of WHERE but was missing WHO entirely, and had the topic, "chickens," sitting in the WHAT spot instead of the real title.` },
      relatedLoIds: ['m6ela.giving-basic-source-information'],
    },
    {
      title: 'Worked fix a video note',
      steps: [
        `Check WHERE first. "Bright Sprout Science's channel" names the place holding the video clearly enough for someone else to go find it there, so WHERE is fine as written.`,
        `Check WHAT. "The frog video" describes what the video is about, not what it is called. The exact title printed under the video is "Why Do Frogs Disappear in Winter?" That exact wording replaces the description.`,
        `Check WHO, and read it carefully this time. The note lists Dr. Elena Vance as the author. But Dr. Elena Vance is a guest who appears and speaks inside the video — she is quoted in it. She did not make it or post it. The channel Bright Sprout Science did both of those things, so Bright Sprout Science belongs in the WHO spot.`,
        `Rewrite the fixed record: WHO: Bright Sprout Science. WHAT: "Why Do Frogs Disappear in Winter?" WHERE: Bright Sprout Science's channel. Dr. Elena Vance can still be mentioned as the scientist quoted in the video, but that detail is separate from who made the source.`,
        `Notice the pattern across both worked examples: WHERE is often the piece already sitting in a note, WHAT gets swapped for a topic, and WHO gets swapped for whoever's name is easiest to remember, whether or not that person made the source.`,
      ],
      example: { problem: `A student watches a video called "Why Do Frogs Disappear in Winter?", posted by a channel called Bright Sprout Science. In the video, a guest scientist named Dr. Elena Vance explains that many frogs stay still and barely move through the coldest months. The student's note reads: AUTHOR: Dr. Elena Vance. TITLE: the frog video. FOUND: Bright Sprout Science's channel. Fix whatever is wrong with this record.`, solution: `WHO: Bright Sprout Science. WHAT: "Why Do Frogs Disappear in Winter?" WHERE: Bright Sprout Science's channel. The title was written as a description instead of the exact words printed under the video, and the author was written as the scientist quoted inside the video instead of the channel that made and posted it.` },
      relatedLoIds: ['m6ela.giving-basic-source-information'],
    },
  ],
  pointers: [
    { content: `Students often say "Writing what a source is about, such as "the frog video" or "the chicken article," in the title spot." — The title is the exact wording printed on the source itself, not a summary of what the source covers. "The frog video" describes a topic that many different videos could share; "Why Do Frogs Disappear in Winter?" identifies exactly one video. Copy the title as printed, word for word.`, kind: 'common-error' },
    { content: `Students often say "Writing the name of a person quoted or featured inside a source as the author, because that person's name is the one most easily remembered." — The author is whoever made the source — the writer of an article, or the channel that produced and posted a video — even when someone else is quoted or featured inside it. Bright Sprout Science made and posted the frog video; Dr. Elena Vance is the scientist it features. Both facts can be true, and only the first one belongs in the WHO spot.`, kind: 'common-error' },
    { content: `A complete basic source record has three pieces: WHO made it, WHAT it is called, and WHERE it can be found.`, kind: 'tip' },
    { content: `WHO is the person or group who made the source — a writer, a magazine, or the channel that posted a video — not necessarily anyone the source quotes or features.`, kind: 'tip' },
    { content: `WHAT is the exact title printed on the source itself, not a summary of its topic.`, kind: 'tip' },
    { content: `WHERE is the name of the place holding the source, clear enough that someone else could go find it there.`, kind: 'tip' },
    { content: `Write the record down the moment a source gets used. Waiting means trying to remember details that have already started to fade.`, kind: 'tip' },
    { content: `This closes the research skills in this course. The three-piece habit works on any source, in any class, for the rest of a student's life, any time something needs to be found again.`, kind: 'tip' },
    { content: `Don't write what the source is about (the topic). Write the exact title printed on the source itself. "The chicken article" describes a topic; "Picking the Right Chicken Breed for Your Yard" is the real title someone can search for.`, kind: 'common-error' },
    { content: `The author is whoever MADE the source, not whoever is QUOTED inside it. A magazine writer is the author even if the article interviews five people. A channel is the author even if a guest scientist explains everything.`, kind: 'gotcha' },
    { content: `Write down the record the moment you use a source. Don't wait until later. Exact titles and author names fade from memory fast, but three labeled lines take only seconds.`, kind: 'tip' },
    { content: `Use three labeled lines: WHO, WHAT, WHERE. This layout keeps the three pieces from sliding into each other. "Priya Anand coopcorner.example" is one running blur; WHO: Priya Anand. WHAT: [title]. WHERE: coopcorner.example is clear.`, kind: 'tip' },
    { content: `WHERE needs to be specific enough for someone else to find the source. "The internet" doesn't work. Write the actual website name, magazine name, or channel name—something concrete.`, kind: 'edge-case' },
    { content: `A title is a label for one specific source, not a category. Many videos could be called "the frog video," but only one is called "Why Do Frogs Disappear in Winter?" Copy the exact wording printed on or under the source.`, kind: 'vocab-note' },
    { content: `This is a record, not a formatted citation. You're just capturing WHO, WHAT, and WHERE clearly on three labeled lines. Fancy punctuation and alphabetizing come later in a different lesson.`, kind: 'edge-case' },
  ],
};
