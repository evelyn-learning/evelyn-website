/**
 * HS English — Reading Literature: Sound Devices.
 *
 * How a line SOUNDS is part of what it means (CCSS RL.9-10.4, L.9-10.5):
 * alliteration, assonance, consonance, onomatopoeia, the rhyme family, and
 * repetition as rhythm — always paired with the effect the sound creates.
 * All verse lines are short ORIGINAL lines written for this lesson — no
 * quoted poems, songs, or slogans, and no external passages.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_ENGL_U8_SOUND_DEVICES: LessonPlan = {
  id: 'evelyn.hs.engl.sound-devices.v1',
  title: 'Sound Devices: Alliteration, Rhyme & Rhythm',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'ela',
  topic: 'hs-english',
  locale: 'en',
  los: [
    {
      id: 'engl.sound-devices',
      standard: 'ENGL-8.3',
      description:
        'Identify alliteration, assonance, consonance, onomatopoeia, rhyme (end, internal, and slant), and rhythm created by repetition, and analyze the effect each sound device produces in a line of verse (CCSS RL.9-10.4, L.9-10.5).',
    },
  ],
  prerequisites: ['engl.imagery-and-symbolism'],
  followUps: ['engl.poetic-form-and-structure'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that sound craft is something students already run on instinct — chants, tongue twisters, a cheer that lands — then aim it at verse.',
      script:
        'Say this out loud: "six slick sticks split sideways." Your mouth trips, and that is the point — somebody built that line to be hard. Now think about a chant a crowd actually keeps going for three straight minutes. It is never a long clever sentence. It is short, it repeats, and it lands on a beat: "hold the line, hold the line, hold." Same words rearranged into a paragraph and the crowd drops it in ten seconds. Sound is doing work there, before anyone thinks about meaning. Today we name the tools that do that work, and then do the part most readers skip: say what the sound actually accomplishes in the line.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-sound-toolkit',
      kind: 'concept',
      goal: 'The sound-device toolkit, the sound-not-spelling rule, and the discipline of pairing every device with its effect.',
      keyIdeas: [
        'ALLITERATION — the same CONSONANT SOUND repeated at the START of nearby words: "shutters shook and shivered" repeats the sh sound three times. It knots words together so the ear treats them as one gesture.',
        'ASSONANCE — the same VOWEL SOUND repeated INSIDE nearby words, with different consonants around it: "deep green weeds sleep" repeats the long-e sound. Assonance is a vowel effect; alliteration is a beginning-consonant effect.',
        'CONSONANCE — the same consonant sound repeated anywhere in nearby words, most often at the ENDS: "the black rock cracked" repeats a hard k at the close of word after word. Alliteration is really consonance that happens to land in front.',
        'SOUND, NOT SPELLING — this is the rule everything else depends on. "City" and "sun" DO alliterate, because the c in city is pronounced as an s. "City" and "cake" do NOT, because that c is a k. "Phone" and "fog" alliterate; "chorus" and "chase" do not. Say the words aloud before you label anything.',
        'ONOMATOPOEIA — a word whose sound imitates the thing it names: hiss, clang, thud, rattle, sizzle. The word does not describe the noise from a distance; it performs it, so the reader hears the scene instead of being told about it.',
        'RHYME COMES IN TYPES — END RHYME closes lines ("pane" / "train"); INTERNAL RHYME rhymes twice inside one line ("the rain came again down the lane"); SLANT RHYME almost matches and deliberately misses ("dark" / "work" share the final k but not the vowel). Slant rhyme is the sound of something not quite settling.',
        'REPETITION AND RHYTHM — a repeated word, phrase, or refrain resets the beat and forces emphasis. Repetition can drag a line to make effort feel heavy, or hammer it to make a demand feel urgent. Where the stresses fall is the pulse a reader feels without naming it.',
        'EVERY DEVICE SERVES AN EFFECT — naming the device is half an answer. The full move is device + evidence + effect: not "there is alliteration here" but "the repeated hard k sounds make the line feel sharp and brittle, matching the cracked ice it describes." A device with no stated effect is a label, not analysis.',
      ],
      vocabulary: [
        { term: 'assonance', definition: 'repetition of the same vowel sound inside nearby words, with differing consonants around it.' },
        { term: 'slant rhyme', definition: 'a near rhyme in which the sounds almost match but do not fully, often sharing consonants while the vowels differ.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-name-devices-and-effect',
      kind: 'worked_example',
      problem:
        'Identify the sound devices in these lines and say what they accomplish: "The kettle hissed, the shutters shook and shivered, / rain rapped a restless rhythm on the pane, / and I sat still, so still, so very still, / waiting for the whistle of the train."',
      steps: [
        'Read the lines aloud first — sound devices are found with the ear, never with the eye. Listen for repeated sounds and for anything that imitates a noise.',
        'Onomatopoeia: "hissed," "rapped," and "whistle" all perform the noise they name, so the reader hears the kitchen rather than being told about it.',
        'Alliteration: "shutters shook and shivered" repeats the sh sound; "rain rapped a restless rhythm" repeats the r sound four times — note that "rhythm" counts, because it is spelled with rh but pronounced with r.',
        'Rhyme: "pane" and "train" are a full END RHYME across lines two and four; inside line two, "rain" and "pane" rhyme within the single line, which is INTERNAL RHYME.',
        'Repetition and rhythm: "so still, so still, so very still" stalls the line, and the extra word "very" stretches it further — the sentence physically takes longer to say.',
        'Name the effect, which is the part that earns credit: the noisy devices fill the room with small restless sounds while the repetition freezes the speaker in place, so the contrast between a busy room and a motionless person builds the tension of waiting.',
      ],
      answer:
        'Onomatopoeia (hissed, rapped, whistle), alliteration (sh in shutters/shook/shivered, r in rain/rapped/restless/rhythm), internal rhyme (rain / pane) and end rhyme (pane / train), and the repetition of "so still" — together the busy sounds against the frozen repetition create the tension of waiting',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-letter-trap',
      kind: 'worked_example',
      problem:
        'A student writes: "The line \'The cellar door creaked open in the cold, / and careful candlelight crept down the stair\' is full of alliteration — cellar, cold, careful, candlelight, creaked, crept all start with c. That is the device." Two things are wrong. What are they?',
      steps: [
        'Test the claim by SOUND, one word at a time. Cold, careful, candlelight, creaked, and crept all begin with a hard k sound, so those five do alliterate.',
        '"Cellar" is the outlier: its c is pronounced as an s, so it shares a LETTER with the others and shares no SOUND with them. It cannot join the alliteration, however tidy the list looks on the page.',
        'That is error one, and it is the most common mistake in this unit: labeling from the spelling instead of the pronunciation. The fix is mechanical — read the words aloud before grouping them.',
        'Error two is that the student stopped at the label. "That is the device" is where the analysis should begin, not end.',
        'Supply the missing effect: the hard k is a stopped, clipped sound, so the repeated k gives the lines a brittle, tense edge that matches a nervous descent into a dark cellar. Naming that is what turns identification into analysis.',
      ],
      answer:
        'First, "cellar" is pronounced with an s and so does not alliterate with the hard-k words — the student grouped by letter, not by sound. Second, the student named the device without naming its effect: the clipped k sounds make the lines feel tense and brittle, matching the nervous descent',
      estimatedMinutes: 3,
    },
    {
      id: 'try-identify-device',
      kind: 'try_yourself',
      problem:
        'Which sound device is at work in this line: "The photographer fumbled with a fading flash"?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Alliteration — the repeated f sound at the start of the words', correct: true },
        { id: 'b', text: 'Assonance — a repeated vowel sound inside the words' },
        { id: 'c', text: 'Onomatopoeia — words that imitate the noise they name' },
        { id: 'd', text: 'End rhyme — matching sounds at the ends of lines' },
      ],
      expectedAnswer: 'Alliteration — the repeated f sound at the start of the words',
      hints: [
        'Say the line aloud and listen to how each stressed word begins.',
        'Do not let the spelling fool you: "photographer" begins with a ph, but the sound it makes is f — the same sound that opens fumbled, fading, and flash.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-repetition-effect',
      kind: 'try_yourself',
      problem:
        'Consider these lines: "One more step. One more step. One more step, / and the summit stopped moving away." What effect does the repetition create?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'It drags the pace so the climb feels grinding and endless', correct: true },
        { id: 'b', text: 'It speeds the lines up so the climb feels quick and easy' },
        { id: 'c', text: 'It creates a slant rhyme between "step" and "summit"' },
        { id: 'd', text: 'It is onomatopoeia, because the words imitate the sound of footsteps' },
      ],
      expectedAnswer: 'It drags the pace so the climb feels grinding and endless',
      hints: [
        'Read the first line out loud at a natural pace and notice how long it takes to get through three identical phrases.',
        'Repetition of an identical phrase slows a reader down. Match that slowing to what the speaker is physically doing.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-assonance-vs-alliteration',
      kind: 'try_yourself',
      problem:
        'In the line "Deep green weeds sleep beneath the stream," which device does the repeated long-e sound create?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Assonance, because the repeated sound is a vowel inside the words', correct: true },
        { id: 'b', text: 'Alliteration, because the repeated sound opens each word' },
        { id: 'c', text: 'Consonance, because the repeated sound is a consonant at the ends of words' },
        { id: 'd', text: 'Internal rhyme, because two words in one line rhyme fully' },
      ],
      expectedAnswer: 'Assonance, because the repeated sound is a vowel inside the words',
      hints: [
        'Ask one question first: is the repeated sound a vowel or a consonant?',
        'The words deep, green, weeds, sleep, beneath, and stream all begin with DIFFERENT consonants — what they share sits in the middle of each word.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-spelling-not-sound',
      kind: 'misconception_check',
      question:
        'A student says: "Of course \'city\' and \'cat\' alliterate — look, they both start with c. And \'phone\' and \'fog\' cannot alliterate, because one starts with p and the other with f." What went wrong?',
      commonErrors: [
        {
          answer: 'Words alliterate when they begin with the same letter',
          misconception: 'Judging sound devices with the eye — grouping words by spelling instead of by pronunciation.',
          correctsTo:
            'Sound devices are heard, not spelled. "City" begins with an s sound and "cat" with a k sound, so they do NOT alliterate despite the shared letter. "Phone" and "fog" both begin with an f sound, so they DO. The test is always the same: say the words out loud and listen to the first sound, not the first letter.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Alliteration repeats a beginning consonant SOUND; assonance repeats a vowel sound inside words; consonance repeats a consonant sound anywhere, usually at the ends.',
        'Sound, not spelling: read every candidate aloud before labeling it — "phone" and "fog" alliterate, "city" and "cake" do not.',
        'Rhyme has types: end rhyme closes lines, internal rhyme lands twice inside one line, and slant rhyme almost matches on purpose.',
        'Repetition sets the rhythm — it can drag a line to make effort feel heavy or hammer it to make a demand feel urgent.',
        'Never stop at the label: device + evidence + effect is the whole answer.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '8', cedTopic: '8.3', cedTitle: 'Sound Devices: Alliteration, Rhyme & Rhythm' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
