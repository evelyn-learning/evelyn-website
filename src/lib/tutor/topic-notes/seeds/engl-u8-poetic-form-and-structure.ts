/**
 * HS English — Unit 8 CED 8.4: Poetic Form & Structure.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.engl.poetic-form-and-structure.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_ENGL_U8_POETIC_FORM_AND_STRUCTURE: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.engl.poetic-form-and-structure.v1',
  course: 'HS English',
  cedUnit: 8,
  cedTopic: '8.4',
  cedTitle: 'Poetic Form & Structure',
  planId: 'evelyn.hs.engl.poetic-form-and-structure.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.engl.poetic-form-and-structure.v1' }],
  theory: [
    { loId: 'engl.poetic-form-and-structure', kind: 'framework', title: 'Line vs sentence', content: `LINE VS SENTENCE — the sentence is the unit of MEANING; the line is the poet's unit of ATTENTION. Prose ends its lines wherever the margin happens to fall, but a poet chooses every single ending, so each break is a small instruction about where to look and how long to linger.` },
    { loId: 'engl.poetic-form-and-structure', content: `STANZA = PARAGRAPH OF POETRY — a group of lines set off by white space. A stanza break signals a shift: new time, new speaker, new idea, or simply a silence the reader has to walk across before the next line arrives.` },
    { loId: 'engl.poetic-form-and-structure', kind: 'framework', title: 'End-stopped', content: `END-STOPPED — the line ends where the thought ends, usually with punctuation: "The kettle screamed. / We let it." The reader gets a full stop at the edge of the line, so the poem moves in clean, deliberate steps.` },
    { loId: 'engl.poetic-form-and-structure', kind: 'framework', title: 'Enjambed', content: `ENJAMBED — the sentence runs over the break into the next line: "Some mornings the noise / is the only company." The reader has to keep going, so the poem gains speed, and the word stranded at the line end ("noise") gets a moment of extra weight before the sentence resolves it.` },
    { loId: 'engl.poetic-form-and-structure', kind: 'framework', title: 'Pacing is the point', content: `PACING IS THE POINT — a stack of end-stopped lines feels measured, even heavy; a run of enjambed lines feels breathless. Switching between the two is how a poet changes the speed of a poem without changing a single word of the sentence.` },
    { loId: 'engl.poetic-form-and-structure', kind: 'framework', title: 'Free verse vs fixed forms', content: `FREE VERSE VS FIXED FORMS — free verse inherits no meter and no rhyme scheme, but it is structure BY CHOICE, not the absence of structure: the poet still picks every line ending and every stanza length. A fixed form arrives with its rules already attached — a SONNET runs fourteen lines and pivots at a turn called the VOLTA, where the argument changes direction; a HAIKU runs three lines of five, seven, and five syllables and pivots on an image rather than an argument.` },
    { loId: 'engl.poetic-form-and-structure', kind: 'framework', title: 'Read the sentence, not the line', content: `READ THE SENTENCE, NOT THE LINE — when a poem confuses you, read straight through the breaks to the punctuation and find the sentence first. Then reread and ask what each break did to it. Stopping hard at every line ending is the most common way to garble an enjambed poem.` },
    { loId: 'engl.poetic-form-and-structure', kind: 'framework', title: 'Line breaks are never random', content: `LINE BREAKS ARE NEVER RANDOM — "the poet just hit enter" is not an analysis. Assume the ending word was chosen on purpose, ask why THAT word was given the edge of the line, and the structural argument writes itself.` },
    { loId: 'engl.poetic-form-and-structure', kind: 'definition', title: 'enjambment', content: `a line break that interrupts a sentence, carrying the thought over into the next line.` },
    { loId: 'engl.poetic-form-and-structure', kind: 'definition', title: 'end-stopped line', content: `a line whose ending coincides with the end of a phrase or sentence, usually marked by punctuation.` },
    { loId: 'engl.poetic-form-and-structure', kind: 'definition', title: 'volta', content: `the turn in a sonnet where the argument or feeling shifts direction, traditionally near line nine.` },
  ],
  methods: [
    {
      title: 'Worked enjambment emphasis',
      steps: [
        `Find the sentence first, ignoring the breaks: The bridge held everything we carried across the water and then let go. One sentence spread over four lines, so every line ending except the last is enjambed.`,
        `Now read line by line and notice the false endings. Line 1, "The bridge held," lands as a complete thought — the bridge held, it did not fail. The reader commits to that reading for a beat.`,
        `Line 2 revises it: the bridge did not simply hold, it held "everything we carried." The enjambment let the reader believe one thing and then corrected it, so the emphasis is built out of the break rather than out of an adjective.`,
        `The final break is the loudest. After three lines of holding, "and then let go" sits alone at the end, isolated by the break. Run those same words together in one prose sentence and the reversal slides by unnoticed.`,
      ],
      example: { problem: `Analyze how the line breaks shape emphasis in these four original lines: "The bridge held / everything we carried / across the water / and then let go."`, solution: `The enjambments create false endings — "The bridge held" reads as complete until line 2 revises it — and the last break isolates "and then let go," so the structure, not the vocabulary, delivers the reversal` },
      relatedLoIds: ['engl.poetic-form-and-structure'],
    },
    {
      title: 'Worked hard stop error',
      steps: [
        `Error one: treating line breaks as punctuation. Stopping hard after "the light" turns a fragment into a false sentence, and "on for a boy who never" is not a thought at all. The lines were never meant to be read as separate sentences.`,
        `The fix is to read the sentence, not the line: My mother kept the light on for a boy who never came home. The meaning is clear now, and the breaks become a second layer sitting on top of a sentence the reader already understands.`,
        `Reread with a light hesitation, not a stop, at each break. "My mother kept the light" holds a hopeful image for a beat; "on for a boy who never" strands the reader on "never"; "came home" drops the ending. That hesitation is the effect the poet built.`,
        `Error two: free verse is not the absence of structure. There is no fixed meter or rhyme here, but the poet still chose to break after "never" instead of after "boy." That choice IS the structure, and naming it is exactly what the analysis is supposed to do.`,
      ],
      example: { problem: `A student reads these original lines aloud, stopping hard at the end of every line: "My mother kept the light / on for a boy who never / came home." The student then says the poem is confusing, and that because it is free verse the breaks were random anyway. Two things went wrong — what are they?`, solution: `The student read the line breaks as full stops instead of reading the sentence through them, and mistook the absence of a fixed form for the absence of structural choices — the break that strands "never" is deliberate and analyzable` },
      relatedLoIds: ['engl.poetic-form-and-structure'],
    },
  ],
  pointers: [
    { content: `Free verse gives up fixed meter and rhyme, not structure. The poet still decides where every line ends, how long each stanza runs, and which word is left hanging at a break — and those decisions do the pacing and emphasis work that meter and rhyme do inside a sonnet. Ask why THIS word was given the end of the line, and the analysis is already underway.`, kind: 'common-error' },
    { content: `The sentence is the unit of meaning and the line is the poet's unit of attention — read the sentence first, then ask what the breaks did to it.`, kind: 'tip' },
    { content: `End-stopped lines close a thought and slow the poem down; enjambed lines push the sentence over the break, speed it up, and strand the last word for emphasis.`, kind: 'tip' },
    { content: `A stanza is a paragraph of poetry, and the white space between stanzas is a silence the reader has to cross.`, kind: 'tip' },
    { content: `Fixed forms arrive with rules — a sonnet is fourteen lines with a volta, a haiku is three lines of five, seven, and five with an image pivot — while free verse makes structural choices without inheriting them.`, kind: 'tip' },
    { content: `Don't read a line break as a period. Read straight through to the punctuation to find the sentence first, then reread with a *hesitation* — not a stop — at each break. Stopping hard at every line ending is how enjambed poems get garbled.`, kind: 'common-error' },
    { content: `"The poet just hit enter" is not analysis. Free verse drops fixed meter and rhyme, not structure — every line ending and stanza length is still a choice. Always ask why THAT word got the edge of the line.`, kind: 'gotcha' },
    { content: `Enjambed vs. end-stopped describes the LINE ENDING, not the whole line or the poem. A poem can mix both — say "lines 3–5 are enjambed," not "the poem is enjambment." Enjambment is the noun; enjambed is the adjective.`, kind: 'vocab-note' },
    { content: `Volta = the *turn* in a sonnet's argument, traditionally near line 9 — not the rhyme scheme, not the last couplet, not any random shift. A haiku pivots too, but on an image, not an argument.`, kind: 'vocab-note' },
    { content: `Fourteen lines alone doesn't make it a sonnet, and 5-7-5 alone doesn't make it a haiku. Check for the turn: an argument that changes direction, or an image that pivots. Line count is the shell, the pivot is the form.`, kind: 'edge-case' },
    { content: `Punctuated end-stops aren't the only ones. A line can be end-stopped with no comma or period if the phrase simply finishes there. Test the thought, not the punctuation mark.`, kind: 'edge-case' },
    { content: `White space between stanzas is content. Don't skip it — name what the silence does (time passing, a speaker change, a loss) instead of just noting "there are two stanzas."`, kind: 'tip' },
    { content: `When a break creates a false ending, say so. "The bridge held" reads as complete until the next line revises it — that revision IS the emphasis. Don't credit the vocabulary for work the line break did.`, kind: 'tip' },
  ],
};
