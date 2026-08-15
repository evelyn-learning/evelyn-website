/**
 * HS English — Unit 1 CED 1.1: Parts of Speech in Action.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.engl.parts-of-speech.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_ENGL_U1_PARTS_OF_SPEECH: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.engl.parts-of-speech.v1',
  course: 'HS English',
  cedUnit: 1,
  cedTopic: '1.1',
  cedTitle: 'Parts of Speech in Action',
  planId: 'evelyn.hs.engl.parts-of-speech.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.engl.parts-of-speech.v1' }],
  theory: [
    { loId: 'engl.parts-of-speech', kind: 'framework', title: 'Function, not memorization', content: `FUNCTION, NOT MEMORIZATION — a part of speech is a JOB a word does in one specific sentence, not a permanent tag. Ask "what is this word doing here?" before you name it. Change the sentence and the answer can change.` },
    { loId: 'engl.parts-of-speech', kind: 'framework', title: 'Nouns and pronouns', content: `NOUNS AND PRONOUNS — nouns name a person, place, thing, or idea and can take "the" or "a" in front of them ("the counselor", "a deadline", "freedom"). Pronouns stand in for a noun already known: she, they, it, who, everyone, myself.` },
    { loId: 'engl.parts-of-speech', kind: 'framework', title: 'Verbs', content: `VERBS — verbs carry the action or the state of being: "she drafted", "the room felt quiet". The test is tense: if you can put it in the past or future ("yesterday she ___", "tomorrow she will ___"), it is working as a verb in that slot.` },
    { loId: 'engl.parts-of-speech', kind: 'framework', title: 'Adjectives and adverbs', content: `ADJECTIVES AND ADVERBS — adjectives modify nouns and pronouns and answer which one, what kind, or how many ("a blunt reply", "three drafts"). Adverbs modify verbs, adjectives, or other adverbs and answer how, when, where, or to what degree ("replied bluntly", "almost finished", "arrived early").` },
    { loId: 'engl.parts-of-speech', kind: 'framework', title: 'Prepositions, conjunctions, interjections', content: `PREPOSITIONS, CONJUNCTIONS, INTERJECTIONS — prepositions start a phrase that locates something in space, time, or relationship ("in the folder", "after lunch", "about the schedule"). Conjunctions join: and, but, or, so, yet for equal parts; because, although, when, if to attach a dependent idea. Interjections are stand-alone bursts of feeling: "Ouch", "Well", "Honestly".` },
    { loId: 'engl.parts-of-speech', kind: 'framework', title: 'The same word, different jobs', content: `THE SAME WORD, DIFFERENT JOBS — the biggest source of wrong answers. "Study" is a noun in "her study of local water", a verb in "I study at night", and an adjective in "the study group meets Thursday". WRONG — answering "study is a noun" without reading the sentence. CORRECT — naming the job the word does in the sentence in front of you.` },
    { loId: 'engl.parts-of-speech', kind: 'framework', title: 'The -ly shortcut trap', content: `THE -LY SHORTCUT TRAP — most adverbs end in -ly, but the ending never decides the answer. WRONG — calling "lovely" and "friendly" adverbs because of the -ly. CORRECT — both modify nouns ("a lovely afternoon", "a friendly opening line"), so both are adjectives. Meanwhile "fast", "early", "hard", and "well" are adverbs with no -ly at all: "she writes fast".` },
    { loId: 'engl.parts-of-speech', kind: 'framework', title: 'Watch the helpers', content: `WATCH THE HELPERS — forms of be, have, and do often team up with a main verb ("has been revising", "did not answer"). The whole cluster is doing the verb job; "not" is an adverb that sneaked into the middle of it, never part of the verb itself.` },
    { loId: 'engl.parts-of-speech', kind: 'definition', title: 'function', content: `the job a word performs in one particular sentence — the only thing that decides its part of speech.` },
    { loId: 'engl.parts-of-speech', kind: 'definition', title: 'modifier', content: `a word that changes or narrows the meaning of another word; adjectives modify nouns, adverbs modify verbs, adjectives, and other adverbs.` },
  ],
  methods: [
    {
      title: 'Worked name the jobs',
      steps: [
        `"Before" — it opens the phrase "before the interview", which tells us WHEN relative to something else. A word that starts a phrase locating something in time is a PREPOSITION.`,
        `"Practiced" — apply the tense test: yesterday Dara practiced, tomorrow Dara will practice. It carries the action, so it is a VERB.`,
        `"Carefully" — ask what it modifies. It tells us HOW she practiced, and "practiced" is a verb, so this is an ADVERB.`,
        `"And" — it sits between two complete ideas ("Dara practiced her answers" and "her hands finally stopped shaking") and joins them as equals. That is a CONJUNCTION.`,
        `Notice the routine never once required a memorized list: each answer came from asking what the word was doing in this sentence.`,
      ],
      example: { problem: `Name the part of speech of "before", "practiced", "carefully", and "and" in this sentence: "Before the interview, Dara practiced her answers carefully, and her hands finally stopped shaking."`, solution: 'before = preposition, practiced = verb, carefully = adverb, and = conjunction' },
      relatedLoIds: ['engl.parts-of-speech'],
    },
    {
      title: 'Worked same word three jobs',
      steps: [
        `Sentence one: "the light" takes the article "the" and names a thing that buzzed. It is the subject of the verb "buzzed", so here "light" is a NOUN.`,
        `Sentence two: run the tense test — yesterday we lit the grill, tomorrow we will light the grill. It carries the action of the sentence, so here "light" is a VERB.`,
        `Sentence three: ask what "light" is doing to "jacket". It answers what kind of jacket, and "jacket" is a noun, so here "light" is an ADJECTIVE.`,
        `So the student claim is WRONG as stated: "light is a noun" is only true of sentence one. CORRECT version of the claim: "light" can function as a noun, a verb, or an adjective, and the sentence decides which.`,
        `The lesson: never answer from the word alone. Cover the word, read what surrounds it, and ask what job the slot needs filled.`,
      ],
      example: { problem: `A student insists that "light" is a noun, full stop. Test that claim against three sentences: "The light above the podium buzzed all evening." / "We light the grill before the guests arrive." / "She packed one light jacket for the trip."`, solution: `Noun in the first sentence, verb in the second, adjective in the third — the same word doing three different jobs.` },
      relatedLoIds: ['engl.parts-of-speech'],
    },
  ],
  pointers: [
    { content: `The label comes from the job, not the dictionary. Here "water" passes the tense test — yesterday we watered the plants, tomorrow we will water them — so it is the VERB of the sentence. It would be a noun in "The water tasted like pennies."`, kind: 'common-error' },
    { content: `"Every" modifies the noun "Friday", not the verb, so it is an ADJECTIVE answering how many. The phrase "every Friday" as a whole tells when, but the individual word still does an adjective job.`, kind: 'common-error' },
    { content: `A part of speech is a JOB in one sentence, not a permanent label — ask "what is this word doing here?" every single time.`, kind: 'tip' },
    { content: `Nouns and pronouns name; verbs pass the tense test; adjectives modify nouns; adverbs modify verbs, adjectives, and other adverbs.`, kind: 'tip' },
    { content: `Prepositions open locating phrases, conjunctions join, interjections stand alone as bursts of feeling.`, kind: 'tip' },
    { content: `The -ly ending proves nothing: "lovely" and "friendly" are adjectives, and "fast", "early", and "hard" are adverbs with no -ly.`, kind: 'tip' },
    { content: `Never answer "what part of speech is X?" from the word alone. Cover the word, read the sentence around it, and ask what job the slot needs. "Light" is a noun, verb, AND adjective — the sentence decides, not the dictionary.`, kind: 'common-error' },
    { content: `The **-ly ending proves nothing**. "Lovely afternoon" and "friendly line" modify nouns → adjectives. "She writes fast", "arrived early", "studied hard", "sang well" → adverbs with no -ly. Check what word is modified, not the spelling.`, kind: 'gotcha' },
    { content: `A phrase can tell WHEN while the individual word inside it does a different job. In "every Friday", the phrase answers when, but "every" modifies the noun "Friday" — so "every" is an adjective, not an adverb.`, kind: 'edge-case' },
    { content: `With helping verbs, the whole cluster does the verb job: "has been revising", "did not answer". But "not" is an ADVERB that sneaked inside — never label it part of the verb.`, kind: 'gotcha' },
    { content: `Say "functions as" not "is": *"Home functions as an adjective in this sentence,"* not *"home is an adjective."* The phrasing keeps you honest about the fact that the label is sentence-specific.`, kind: 'vocab-note' },
    { content: `Two quick tests, used in the right place: the article test (can "the"/"a" go in front?) points to a noun; the tense test ("yesterday she ___", "tomorrow she will ___") confirms a verb. Don't run the tense test on a word you haven't first read in context.`, kind: 'tip' },
    { content: `A noun sitting in front of another noun is doing an adjective's job: "home match", "study group", "water bottle". Ask "what kind of match?" — if it answers that, it's an adjective in that slot no matter how noun-like it looks.`, kind: 'edge-case' },
    { content: `Don't lump all joining words together. Prepositions open a phrase that locates ("before the interview", "in the folder"); conjunctions link two ideas ("and", "because"). "Before" can be either — check whether a noun phrase or a whole idea follows.`, kind: 'vocab-note' },
  ],
};
