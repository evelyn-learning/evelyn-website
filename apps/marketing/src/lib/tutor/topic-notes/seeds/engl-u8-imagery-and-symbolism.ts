/**
 * HS English — Unit 8 CED 8.2: Imagery & Symbolism.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.engl.imagery-and-symbolism.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_ENGL_U8_IMAGERY_AND_SYMBOLISM: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.engl.imagery-and-symbolism.v1',
  course: 'HS English',
  cedUnit: 8,
  cedTopic: '8.2',
  cedTitle: 'Imagery & Symbolism',
  planId: 'evelyn.hs.engl.imagery-and-symbolism.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.engl.imagery-and-symbolism.v1' }],
  theory: [
    { loId: 'engl.imagery-and-symbolism', kind: 'framework', title: 'Imagery is not just pictures', content: `IMAGERY IS NOT JUST PICTURES — imagery is language that appeals to the SENSES, and there are five of them: sight, sound, smell, taste, and touch. "The classroom radiator ticked and gave off a smell of hot dust" is imagery, and not one bit of it is visual.` },
    { loId: 'engl.imagery-and-symbolism', kind: 'framework', title: 'The underused senses do the most work', content: `THE UNDERUSED SENSES DO THE MOST WORK — sight is the easy one, so smell, taste, touch, and sound are where writers get their effects. Smell in particular reaches memory faster than description does.` },
    { loId: 'engl.imagery-and-symbolism', kind: 'framework', title: 'Imagery creates mood', content: `IMAGERY CREATES MOOD — mood is the FEELING a passage produces in the reader, and it is built out of sensory choices. Same room, two moods: "sunlight pooled on the tile" versus "the tile gave back a flat gray shine." Nothing changed but the imagery.` },
    { loId: 'engl.imagery-and-symbolism', kind: 'framework', title: 'Symbol', content: `SYMBOL — a concrete thing (an object, a place, an action, a color) that carries an ABSTRACT meaning beyond itself. The thing stays real inside the story: a locked door is still a locked door, and it can also mean the end of a relationship.` },
    { loId: 'engl.imagery-and-symbolism', kind: 'framework', title: 'The context test', content: `THE CONTEXT TEST — before calling something a symbol, ask what the TEXT does with it. REPETITION: does it come back? PLACEMENT: does it land at moments that matter — an opening, an ending, a turning point? WEIGHT: does the writing slow down and give it attention it does not need for plot? Two of three is a strong case; none of three means it is scenery.` },
    { loId: 'engl.imagery-and-symbolism', kind: 'framework', title: 'Conventional vs text-built symbols', content: `CONVENTIONAL VS TEXT-BUILT SYMBOLS — conventional symbols arrive with borrowed meaning from the wider culture (a dove, a crown, a storm), and a text may confirm, twist, or refuse that meaning. Text-built symbols are made on the spot: a cracked blue bowl means nothing to anyone until this story teaches you what it holds. Text-built symbols are more common and more interesting, and they are the ones the context test is built for.` },
    { loId: 'engl.imagery-and-symbolism', kind: 'framework', title: 'The everything-is-a-symbol error', content: `THE EVERYTHING-IS-A-SYMBOL ERROR — a mentioned object is not automatically symbolic. Characters need furniture, weather, and breakfast. If the detail appears once, carries no repetition or placement, and the story does not linger on it, the honest reading is that it is a detail.` },
    { loId: 'engl.imagery-and-symbolism', kind: 'framework', title: 'The one-right-meaning error', content: `THE ONE-RIGHT-MEANING ERROR — symbols are not a code with a key in the back of the book. A symbol usually supports a RANGE of defensible readings, and the test of a reading is not whether it is the "intended" one but whether the text supports it. Two readings can both be good; a reading with no evidence is still wrong.` },
    { loId: 'engl.imagery-and-symbolism', kind: 'definition', title: 'imagery', content: `language that appeals to any of the five senses to put the reader inside an experience.` },
    { loId: 'engl.imagery-and-symbolism', kind: 'definition', title: 'mood', content: `the emotional atmosphere a passage produces in the reader, largely built out of sensory detail.` },
    { loId: 'engl.imagery-and-symbolism', kind: 'definition', title: 'symbol', content: `a concrete thing that carries an abstract meaning beyond itself, established by how the text repeats, places, and weights it.` },
  ],
  methods: [
    {
      title: 'Worked imagery to mood',
      steps: [
        `Inventory the senses one line at a time: SOUND (the buzz of the lights, the single squeak), SMELL (rubber and sweat), SIGHT (empty bleachers). Three senses in three lines, and sight is the least of them.`,
        `Notice what the sensory choices imply about time: the smell of sweat is LEFTOVER — bodies were here and are gone. The imagery points at an absence rather than describing it.`,
        `Notice the sound design: a buzz is a sound that only becomes audible when everything else stops, and the squeak happens once and dies. Silence is being measured out for us.`,
        `Name the mood from the evidence, not from a feeling word chosen first: lonely aftermath — the emptiness of a place built for a crowd. Then check backward that every image supports it. All three do.`,
      ],
      example: { problem: `Trace the imagery to a mood in these original lines: "The gym lights buzz above the empty bleachers, / and the floor still smells of rubber and sweat, / and my sneakers squeak once, then nothing."`, solution: `The imagery builds a mood of lonely aftermath — the audible buzz, the leftover smell of a crowd, and one squeak fading into nothing all measure how empty the gym is` },
      relatedLoIds: ['engl.imagery-and-symbolism'],
    },
    {
      title: 'Worked over reading',
      steps: [
        `Run the context test on the mug. REPETITION: it appears exactly once. PLACEMENT: it sits in an ordinary opening clause, not at a turning point. WEIGHT: the sentence does not slow down for it — the mug gets three words and moves on.`,
        `Diagnose where the student's reading actually came from: yellow is culturally cheerful, so the student imported a conventional meaning and attached it to an object the text never asked us to notice.`,
        `Ask what the text DOES weight, since the weight has to be somewhere: the letter is read twice, set down, and read again. Repetition, placement, and slowed attention all land on the letter.`,
        `Revise the claim to follow the evidence: the mug is ordinary scenery that makes the morning feel real, while the letter is the detail the text treats as significant. Note the honest test — if the writer had swapped in a green mug, nothing in the passage would change; swap the letter out and the passage collapses.`,
      ],
      example: { problem: `A student reads this excerpt and writes: "The yellow mug symbolizes hope." Excerpt: "Dev poured his coffee into a yellow mug and read the letter twice, then set it down and read it again." Is the mug a symbol?`, solution: `No — the mug fails the context test (one mention, no placement, no weight), and the detail the text actually weights is the letter, read three times over` },
      relatedLoIds: ['engl.imagery-and-symbolism'],
    },
  ],
  pointers: [
    { content: `A conventional meaning is a starting hypothesis, never a verdict. The text decides: a text can confirm the borrowed meaning, twist it, or refuse it outright, and a river the characters cannot cross may be about separation rather than time. Run the context test on the actual passage, and judge a reading by the evidence it can cite — more than one reading can be defensible, but a reading with no textual support is simply wrong.`, kind: 'common-error' },
    { content: `Imagery appeals to all five senses, not just sight — and the non-visual senses usually carry the strongest effect.`, kind: 'tip' },
    { content: `Imagery builds mood: name the sensory details first, then name the feeling they produce.`, kind: 'tip' },
    { content: `A symbol is a concrete thing carrying an abstract meaning, and the text proves it through repetition, placement, and weight.`, kind: 'tip' },
    { content: `Not every object is a symbol, and no symbol has one legal meaning — cite the text, and let the evidence set the range.`, kind: 'tip' },
    { content: `"Imagery" doesn't mean "images." A line with zero visual detail — a buzzing light, the smell of rubber — is still imagery. When you inventory a passage, list sound, smell, taste, and touch *before* sight, or you'll miss what's doing the work.`, kind: 'vocab-note' },
    { content: `Name the mood **after** you list the sensory details, not before. If you pick "sad" first and then hunt for proof, you'll skip images that contradict you. Check backward: does *every* image support the mood word you chose?`, kind: 'common-error' },
    { content: `Don't confuse mood with tone or with a character's emotion. Mood is the feeling produced in the *reader* by sensory detail — a cheerful character can walk through a passage whose imagery builds dread.`, kind: 'vocab-note' },
    { content: `Before writing "X symbolizes Y," run all three checks out loud: does it **repeat**? does it land at an **opening, ending, or turning point**? does the prose **slow down** for it? Two of three is a case. Zero of three means you're describing furniture.`, kind: 'tip' },
    { content: `A color's cultural vibe is not evidence. Yellow mug ≠ hope, storm ≠ doom, river ≠ time. A conventional meaning is a *hypothesis* the text can confirm, twist, or refuse — check what this passage actually does with the object.`, kind: 'gotcha' },
    { content: `Try the swap test: replace the detail with something equivalent. If a green mug changes nothing, it's scenery. If removing the letter collapses the passage, that's where the weight is — write about *that* detail instead.`, kind: 'tip' },
    { content: `A symbol stays literally real. The locked door is still a door; the cracked bowl still holds keys. Don't write as if the object "is" the abstraction — say what it means *in addition to* being itself.`, kind: 'edge-case' },
    { content: `"Symbols can mean different things" does not mean any reading passes. Two readings can both be defensible if both cite the text; a reading with no textual support is just wrong. Range comes from evidence, not from opinion.`, kind: 'gotcha' },
  ],
};
