/**
 * HS English — Unit 1 CED 1.3: Pronouns: Agreement, Case & Clarity.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.engl.pronoun-agreement-clarity.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_ENGL_U1_PRONOUN_AGREEMENT_CLARITY: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.engl.pronoun-agreement-clarity.v1',
  course: 'HS English',
  cedUnit: 1,
  cedTopic: '1.3',
  cedTitle: 'Pronouns: Agreement, Case & Clarity',
  planId: 'evelyn.hs.engl.pronoun-agreement-clarity.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.engl.pronoun-agreement-clarity.v1' }],
  theory: [
    { loId: 'engl.pronoun-agreement-clarity', kind: 'framework', title: 'Agreement with the antecedent', content: `AGREEMENT WITH THE ANTECEDENT — a pronoun matches the noun it stands for, and that noun is the TRUE antecedent, never the nearest noun. WRONG: "The debate club posted their schedule." CORRECT: "The debate club posted its schedule," because "club" names one group acting as a unit.` },
    { loId: 'engl.pronoun-agreement-clarity', kind: 'framework', title: 'Indefinite antecedents', content: `INDEFINITE ANTECEDENTS — each, either, neither, everyone, everybody, anyone, and nobody are singular, so the pronoun pointing back to them is singular. WRONG: "Each of the poets read their poem twice." CORRECT: "Each of the poets read the poem twice." Rewriting the whole sentence as plural also works: "All of the poets read their poems twice."` },
    { loId: 'engl.pronoun-agreement-clarity', content: `SUBJECT CASE vs OBJECT CASE — I, we, he, she, they, and who perform the action; me, us, him, her, them, and whom receive the action or follow a preposition. WRONG: "Me and Jordan filmed the interview." CORRECT: "Jordan and I filmed the interview."` },
    { loId: 'engl.pronoun-agreement-clarity', kind: 'framework', title: 'The cover test', content: `THE COVER TEST — in a compound, cover the other name and read the sentence alone. "The director thanked Jordan and (I / me)" becomes "The director thanked me," so the compound must be "Jordan and me." Politeness never decides case. WRONG: "between you and I." CORRECT: "between you and me," because "between" is a preposition and prepositions take object case.` },
    { loId: 'engl.pronoun-agreement-clarity', content: `WHO vs WHOM — rebuild the inner clause with he or him. If "he" fits, use who; if "him" fits, use whom. "The reporter WHO called" (he called) versus "the reporter WHOM we called" (we called him). The final m of whom matches the m of him.` },
    { loId: 'engl.pronoun-agreement-clarity', kind: 'framework', title: 'Ambiguous reference', content: `AMBIGUOUS REFERENCE — if a pronoun could point to two different nouns, the reader has to guess. WRONG: "Nadia told Priya that she had been chosen." CORRECT: name the person outright: "Nadia told Priya that Priya had been chosen."` },
    { loId: 'engl.pronoun-agreement-clarity', kind: 'framework', title: 'Vague reference', content: `VAGUE REFERENCE — this, that, it, and which must point at a specific noun, not at a whole previous clause. WRONG: "The rehearsal ran two hours late, which frustrated the crew." CORRECT: "The rehearsal ran two hours late, and the delay frustrated the crew."` },
    { loId: 'engl.pronoun-agreement-clarity', kind: 'framework', title: 'No antecedent at all', content: `NO ANTECEDENT AT ALL — a pronoun with nothing behind it is the easiest error to cut. WRONG: "In the article it says the levee held." CORRECT: "The article says the levee held." If you cannot point to the noun, delete the pronoun and name the thing.` },
    { loId: 'engl.pronoun-agreement-clarity', kind: 'definition', title: 'antecedent', content: 'the noun a pronoun stands for and must agree with in number.' },
    { loId: 'engl.pronoun-agreement-clarity', kind: 'definition', title: 'case', content: `the form a pronoun takes based on its job — subject (I, she, who) or object (me, her, whom).` },
    { loId: 'engl.pronoun-agreement-clarity', kind: 'definition', title: 'ambiguous reference', content: `a pronoun that could sensibly point to two different nouns, so the reader cannot tell which is meant.` },
  ],
  methods: [
    {
      title: 'Worked case cover test',
      steps: [
        `Decide the job the pronoun does: it sits after the preposition "to," so it is receiving something, not performing the action.`,
        `Run the cover test — hide "Jordan and" and read the sentence alone: "The festival organizers handed the microphone to me."`,
        `"To I" is not English, so the object form is the correct one. Adding a second name to the phrase never changes the case.`,
        `Final sentence: "The festival organizers handed the microphone to Jordan and ME right before the closing act."`,
      ],
      example: { problem: `Choose the correct pronoun: "The festival organizers handed the microphone to Jordan and (I / me) right before the closing act."`, solution: `me — the pronoun follows the preposition "to," so it takes object case: "to Jordan and me"` },
      relatedLoIds: ['engl.pronoun-agreement-clarity'],
    },
    {
      title: 'Worked hypercorrection trap',
      steps: [
        `Name the pattern first: "between" is a preposition, and every preposition takes an object pronoun after it.`,
        `The object forms are me, us, him, her, them, and whom, so the required phrasing is "between you and me."`,
        `Why the ear fails here: students are corrected so often for saying "me and my friend went" that they begin swapping "I" in everywhere, a habit called hypercorrection. Formality is not a grammar rule; the job of the pronoun is.`,
        `The cover test confirms it: "between I" is impossible, while "between me" is natural.`,
      ],
      example: { problem: `A student writes this line in a personal essay: "Between you and I, the interview changed how I saw my grandmother." The student defends it by saying that "I" sounds more formal. Is the sentence correct?`, solution: `No — WRONG: "Between you and I." CORRECT: "Between you and me, the interview changed how I saw my grandmother."` },
      relatedLoIds: ['engl.pronoun-agreement-clarity'],
    },
  ],
  pointers: [
    { content: `Cover the other name and the error becomes audible: "Me filmed the interview" is not English, while "I filmed the interview" is. A compound subject takes subject case, and the other person is named first: "Jordan and I filmed the interview after school."`, kind: 'common-error' },
    { content: `A pronoun agrees with its TRUE antecedent, not the nearest noun; each, everyone, and neither are singular, and a group acting as one unit takes "its."`, kind: 'tip' },
    { content: `Case follows the job: subject forms act (I, she, they, who), object forms receive or follow a preposition (me, her, them, whom).`, kind: 'tip' },
    { content: `Cover the other name in a compound to hear the right form, and rebuild the clause with he or him to settle who versus whom.`, kind: 'tip' },
    { content: `Every pronoun needs exactly one nameable antecedent — repair ambiguous "she" by naming the person, and repair vague "this/it/which" by naming the noun.`, kind: 'tip' },
    { content: `Don't let the noun in the prepositional phrase hijack agreement. In "Each of the poets read ___ poem," the antecedent is **each**, not *poets* — so singular. Mentally delete "of the ___" before you pick the pronoun.`, kind: 'common-error' },
    { content: `"I" is not the polite form of "me." After a preposition (to, for, with, between), object case is required no matter how formal the sentence sounds: *between you and me*, *to Jordan and me*. Hypercorrection is still an error.`, kind: 'gotcha' },
    { content: `For who/whom, rebuild ONLY the inner clause, not the whole sentence. "The coordinator ___ we emailed" → inner clause is "we emailed him" → **whom**. The main-clause verb ("returned") is a distractor.`, kind: 'tip' },
    { content: `Ambiguity is not fixed by adding another pronoun. "Nadia told Priya that she..." → repeat the NAME ("that Priya had been chosen"). Repetition of a name is correct writing here, not clumsy.`, kind: 'common-error' },
    { content: `"This," "it," and "which" must point to a NOUN, not to a whole idea or clause. If you can't underline a single word as the antecedent, name the concept: "which frustrated the crew" → "and the delay frustrated the crew."`, kind: 'edge-case' },
    { content: `"Antecedent" means the noun a pronoun stands FOR — not the noun standing nearest, and not the subject of the sentence. Use the word precisely when you explain a fix.`, kind: 'vocab-note' },
    { content: `A collective noun acting as one unit takes **its**: "The club posted its schedule." Switch to plural only if the members are acting separately — and even then, rewriting ("the club members posted their...") is cleaner.`, kind: 'edge-case' },
    { content: `Run the cover test on compound OBJECTS too, not just subjects. "The judges praised Marcus and (I/me)" → "praised me." And name the other person first: *Jordan and I*, not *I and Jordan*.`, kind: 'tip' },
  ],
};
