/**
 * HS English — Unit 8 CED 8.3: Sound Devices: Alliteration, Rhyme & Rhythm.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.engl.sound-devices.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_ENGL_U8_SOUND_DEVICES: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.engl.sound-devices.v1',
  course: 'HS English',
  cedUnit: 8,
  cedTopic: '8.3',
  cedTitle: 'Sound Devices: Alliteration, Rhyme & Rhythm',
  planId: 'evelyn.hs.engl.sound-devices.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.engl.sound-devices.v1' }],
  theory: [
    { loId: 'engl.sound-devices', kind: 'framework', title: 'Alliteration', content: `ALLITERATION — the same CONSONANT SOUND repeated at the START of nearby words: "shutters shook and shivered" repeats the sh sound three times. It knots words together so the ear treats them as one gesture.` },
    { loId: 'engl.sound-devices', kind: 'framework', title: 'Assonance', content: `ASSONANCE — the same VOWEL SOUND repeated INSIDE nearby words, with different consonants around it: "deep green weeds sleep" repeats the long-e sound. Assonance is a vowel effect; alliteration is a beginning-consonant effect.` },
    { loId: 'engl.sound-devices', kind: 'framework', title: 'Consonance', content: `CONSONANCE — the same consonant sound repeated anywhere in nearby words, most often at the ENDS: "the black rock cracked" repeats a hard k at the close of word after word. Alliteration is really consonance that happens to land in front.` },
    { loId: 'engl.sound-devices', kind: 'framework', title: 'Sound, not spelling', content: `SOUND, NOT SPELLING — this is the rule everything else depends on. "City" and "sun" DO alliterate, because the c in city is pronounced as an s. "City" and "cake" do NOT, because that c is a k. "Phone" and "fog" alliterate; "chorus" and "chase" do not. Say the words aloud before you label anything.` },
    { loId: 'engl.sound-devices', kind: 'framework', title: 'Onomatopoeia', content: `ONOMATOPOEIA — a word whose sound imitates the thing it names: hiss, clang, thud, rattle, sizzle. The word does not describe the noise from a distance; it performs it, so the reader hears the scene instead of being told about it.` },
    { loId: 'engl.sound-devices', kind: 'framework', title: 'Rhyme comes in types', content: `RHYME COMES IN TYPES — END RHYME closes lines ("pane" / "train"); INTERNAL RHYME rhymes twice inside one line ("the rain came again down the lane"); SLANT RHYME almost matches and deliberately misses ("dark" / "work" share the final k but not the vowel). Slant rhyme is the sound of something not quite settling.` },
    { loId: 'engl.sound-devices', kind: 'framework', title: 'Repetition and rhythm', content: `REPETITION AND RHYTHM — a repeated word, phrase, or refrain resets the beat and forces emphasis. Repetition can drag a line to make effort feel heavy, or hammer it to make a demand feel urgent. Where the stresses fall is the pulse a reader feels without naming it.` },
    { loId: 'engl.sound-devices', kind: 'framework', title: 'Every device serves an effect', content: `EVERY DEVICE SERVES AN EFFECT — naming the device is half an answer. The full move is device + evidence + effect: not "there is alliteration here" but "the repeated hard k sounds make the line feel sharp and brittle, matching the cracked ice it describes." A device with no stated effect is a label, not analysis.` },
    { loId: 'engl.sound-devices', kind: 'definition', title: 'assonance', content: `repetition of the same vowel sound inside nearby words, with differing consonants around it.` },
    { loId: 'engl.sound-devices', kind: 'definition', title: 'slant rhyme', content: `a near rhyme in which the sounds almost match but do not fully, often sharing consonants while the vowels differ.` },
  ],
  methods: [
    {
      title: 'Worked name devices and effect',
      steps: [
        `Read the lines aloud first — sound devices are found with the ear, never with the eye. Listen for repeated sounds and for anything that imitates a noise.`,
        `Onomatopoeia: "hissed," "rapped," and "whistle" all perform the noise they name, so the reader hears the kitchen rather than being told about it.`,
        `Alliteration: "shutters shook and shivered" repeats the sh sound; "rain rapped a restless rhythm" repeats the r sound four times — note that "rhythm" counts, because it is spelled with rh but pronounced with r.`,
        `Rhyme: "pane" and "train" are a full END RHYME across lines two and four; inside line two, "rain" and "pane" rhyme within the single line, which is INTERNAL RHYME.`,
        `Repetition and rhythm: "so still, so still, so very still" stalls the line, and the extra word "very" stretches it further — the sentence physically takes longer to say.`,
        `Name the effect, which is the part that earns credit: the noisy devices fill the room with small restless sounds while the repetition freezes the speaker in place, so the contrast between a busy room and a motionless person builds the tension of waiting.`,
      ],
      example: { problem: `Identify the sound devices in these lines and say what they accomplish: "The kettle hissed, the shutters shook and shivered, / rain rapped a restless rhythm on the pane, / and I sat still, so still, so very still, / waiting for the whistle of the train."`, solution: `Onomatopoeia (hissed, rapped, whistle), alliteration (sh in shutters/shook/shivered, r in rain/rapped/restless/rhythm), internal rhyme (rain / pane) and end rhyme (pane / train), and the repetition of "so still" — together the busy sounds against the frozen repetition create the tension of waiting` },
      relatedLoIds: ['engl.sound-devices'],
    },
    {
      title: 'Worked letter trap',
      steps: [
        `Test the claim by SOUND, one word at a time. Cold, careful, candlelight, creaked, and crept all begin with a hard k sound, so those five do alliterate.`,
        `"Cellar" is the outlier: its c is pronounced as an s, so it shares a LETTER with the others and shares no SOUND with them. It cannot join the alliteration, however tidy the list looks on the page.`,
        `That is error one, and it is the most common mistake in this unit: labeling from the spelling instead of the pronunciation. The fix is mechanical — read the words aloud before grouping them.`,
        `Error two is that the student stopped at the label. "That is the device" is where the analysis should begin, not end.`,
        `Supply the missing effect: the hard k is a stopped, clipped sound, so the repeated k gives the lines a brittle, tense edge that matches a nervous descent into a dark cellar. Naming that is what turns identification into analysis.`,
      ],
      example: { problem: `A student writes: "The line 'The cellar door creaked open in the cold, / and careful candlelight crept down the stair' is full of alliteration — cellar, cold, careful, candlelight, creaked, crept all start with c. That is the device." Two things are wrong. What are they?`, solution: `First, "cellar" is pronounced with an s and so does not alliterate with the hard-k words — the student grouped by letter, not by sound. Second, the student named the device without naming its effect: the clipped k sounds make the lines feel tense and brittle, matching the nervous descent` },
      relatedLoIds: ['engl.sound-devices'],
    },
  ],
  pointers: [
    { content: `Sound devices are heard, not spelled. "City" begins with an s sound and "cat" with a k sound, so they do NOT alliterate despite the shared letter. "Phone" and "fog" both begin with an f sound, so they DO. The test is always the same: say the words out loud and listen to the first sound, not the first letter.`, kind: 'common-error' },
    { content: `Alliteration repeats a beginning consonant SOUND; assonance repeats a vowel sound inside words; consonance repeats a consonant sound anywhere, usually at the ends.`, kind: 'tip' },
    { content: `Sound, not spelling: read every candidate aloud before labeling it — "phone" and "fog" alliterate, "city" and "cake" do not.`, kind: 'tip' },
    { content: `Rhyme has types: end rhyme closes lines, internal rhyme lands twice inside one line, and slant rhyme almost matches on purpose.`, kind: 'tip' },
    { content: `Repetition sets the rhythm — it can drag a line to make effort feel heavy or hammer it to make a demand feel urgent.`, kind: 'tip' },
    { content: 'Never stop at the label: device + evidence + effect is the whole answer.', kind: 'tip' },
    { content: `Test every candidate by SOUND, not spelling. "Phone"/"fog" alliterate; "city"/"cake" don't; "rhythm" alliterates with "rain" despite the silent h. Say the words aloud and listen to the first *sound* before you group them.`, kind: 'common-error' },
    { content: `Don't stop at naming the device. "There is alliteration here" is a label, not analysis. Always finish with device + evidence + effect: which sound, in which words, doing what to the line's feel.`, kind: 'common-error' },
    { content: `Alliteration = repeated consonant sound at the START; assonance = repeated VOWEL sound INSIDE; consonance = repeated consonant sound anywhere, usually at the ENDS. If the repeated sound is a vowel, it can never be alliteration.`, kind: 'vocab-note' },
    { content: `Internal rhyme happens *within a single line* ("rain" and "lane" in the same line); end rhyme links the ends of two lines. A word can do both at once — "pane" rhymes internally with "rain" and ends-rhymes with "train."`, kind: 'edge-case' },
    { content: `Slant rhyme isn't a failed rhyme — it's deliberate. "Dark"/"work" share the final k but miss the vowel. Read the mismatch as meaning: unease, something not settling, a refusal to resolve.`, kind: 'gotcha' },
    { content: `Repetition doesn't have one fixed effect. "So still, so still, so very still" drags and stalls; "One more step" grinds; a shouted refrain hammers urgency. Decide the effect from the content of the line, not from a memorized rule.`, kind: 'tip' },
    { content: `Onomatopoeia performs a noise, it doesn't describe one. "Hissed," "clang," "rapped" are onomatopoeia; "loud," "noisy," "deafening" are just adjectives about sound.`, kind: 'vocab-note' },
    { content: `One odd word can break your list. In "cellar, cold, careful, candlelight," the k-words alliterate but "cellar" (s sound) is out. Check each word individually instead of trusting a tidy column of matching letters.`, kind: 'edge-case' },
  ],
};
