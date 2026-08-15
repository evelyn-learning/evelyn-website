/**
 * HS English — Reading Literature: Imagery & Symbolism.
 *
 * How concrete language does abstract work (CCSS RL.9-10.2, RL.9-10.4):
 * sensory imagery across all five senses, the mood it builds, and the
 * context test that separates a real symbol from an ordinary detail.
 * All excerpts and verse lines are short ORIGINAL writing composed for
 * this lesson — no copyrighted quotations, no external passages.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_ENGL_U8_IMAGERY_AND_SYMBOLISM: LessonPlan = {
  id: 'evelyn.hs.engl.imagery-and-symbolism.v1',
  title: 'Imagery & Symbolism',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'ela',
  topic: 'hs-english',
  locale: 'en',
  los: [
    {
      id: 'engl.imagery-and-symbolism',
      standard: 'ENGL-8.2',
      description:
        'Identify sensory imagery across all five senses and analyze the mood it creates, and interpret symbols — concrete objects that carry abstract meaning — by testing the repetition, placement, and weight the text itself gives them (CCSS RL.9-10.4, RL.9-10.2).',
    },
  ],
  prerequisites: ['engl.figurative-language'],
  followUps: ['engl.sound-devices'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that students already read images and symbols fluently outside of books — then aim that fluency at a page.',
      script:
        'A logo on a jersey is a few shapes and two colors, and yet a whole city argues about it. A shelf of trophies is metal and plastic, and yet walking past it says something about a family. And if you have ever smelled onions in butter and been standing in a grandparent\'s kitchen ten years ago, you know that a smell can carry more than a paragraph could. Writers work with exactly that: concrete things you can see, hear, smell, taste, and touch, doing abstract work. Today we name the two moves — imagery, which puts you inside a scene, and symbolism, which makes an object mean something larger — and, just as important, we learn how to tell when a detail is only a detail.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-imagery-and-symbol',
      kind: 'concept',
      goal: 'Sensory imagery and mood, the definition of a symbol, the context test that proves one, and the two errors that wreck symbol readings.',
      keyIdeas: [
        'IMAGERY IS NOT JUST PICTURES — imagery is language that appeals to the SENSES, and there are five of them: sight, sound, smell, taste, and touch. "The classroom radiator ticked and gave off a smell of hot dust" is imagery, and not one bit of it is visual.',
        'THE UNDERUSED SENSES DO THE MOST WORK — sight is the easy one, so smell, taste, touch, and sound are where writers get their effects. Smell in particular reaches memory faster than description does.',
        'IMAGERY CREATES MOOD — mood is the FEELING a passage produces in the reader, and it is built out of sensory choices. Same room, two moods: "sunlight pooled on the tile" versus "the tile gave back a flat gray shine." Nothing changed but the imagery.',
        'SYMBOL — a concrete thing (an object, a place, an action, a color) that carries an ABSTRACT meaning beyond itself. The thing stays real inside the story: a locked door is still a locked door, and it can also mean the end of a relationship.',
        'THE CONTEXT TEST — before calling something a symbol, ask what the TEXT does with it. REPETITION: does it come back? PLACEMENT: does it land at moments that matter — an opening, an ending, a turning point? WEIGHT: does the writing slow down and give it attention it does not need for plot? Two of three is a strong case; none of three means it is scenery.',
        'CONVENTIONAL VS TEXT-BUILT SYMBOLS — conventional symbols arrive with borrowed meaning from the wider culture (a dove, a crown, a storm), and a text may confirm, twist, or refuse that meaning. Text-built symbols are made on the spot: a cracked blue bowl means nothing to anyone until this story teaches you what it holds. Text-built symbols are more common and more interesting, and they are the ones the context test is built for.',
        'THE EVERYTHING-IS-A-SYMBOL ERROR — a mentioned object is not automatically symbolic. Characters need furniture, weather, and breakfast. If the detail appears once, carries no repetition or placement, and the story does not linger on it, the honest reading is that it is a detail.',
        'THE ONE-RIGHT-MEANING ERROR — symbols are not a code with a key in the back of the book. A symbol usually supports a RANGE of defensible readings, and the test of a reading is not whether it is the "intended" one but whether the text supports it. Two readings can both be good; a reading with no evidence is still wrong.',
      ],
      vocabulary: [
        { term: 'imagery', definition: 'language that appeals to any of the five senses to put the reader inside an experience.' },
        { term: 'mood', definition: 'the emotional atmosphere a passage produces in the reader, largely built out of sensory detail.' },
        { term: 'symbol', definition: 'a concrete thing that carries an abstract meaning beyond itself, established by how the text repeats, places, and weights it.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-imagery-to-mood',
      kind: 'worked_example',
      problem:
        'Trace the imagery to a mood in these original lines: "The gym lights buzz above the empty bleachers, / and the floor still smells of rubber and sweat, / and my sneakers squeak once, then nothing."',
      steps: [
        'Inventory the senses one line at a time: SOUND (the buzz of the lights, the single squeak), SMELL (rubber and sweat), SIGHT (empty bleachers). Three senses in three lines, and sight is the least of them.',
        'Notice what the sensory choices imply about time: the smell of sweat is LEFTOVER — bodies were here and are gone. The imagery points at an absence rather than describing it.',
        'Notice the sound design: a buzz is a sound that only becomes audible when everything else stops, and the squeak happens once and dies. Silence is being measured out for us.',
        'Name the mood from the evidence, not from a feeling word chosen first: lonely aftermath — the emptiness of a place built for a crowd. Then check backward that every image supports it. All three do.',
      ],
      answer:
        'The imagery builds a mood of lonely aftermath — the audible buzz, the leftover smell of a crowd, and one squeak fading into nothing all measure how empty the gym is',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-over-reading',
      kind: 'worked_example',
      problem:
        'A student reads this excerpt and writes: "The yellow mug symbolizes hope." Excerpt: "Dev poured his coffee into a yellow mug and read the letter twice, then set it down and read it again." Is the mug a symbol?',
      steps: [
        'Run the context test on the mug. REPETITION: it appears exactly once. PLACEMENT: it sits in an ordinary opening clause, not at a turning point. WEIGHT: the sentence does not slow down for it — the mug gets three words and moves on.',
        'Diagnose where the student\'s reading actually came from: yellow is culturally cheerful, so the student imported a conventional meaning and attached it to an object the text never asked us to notice.',
        'Ask what the text DOES weight, since the weight has to be somewhere: the letter is read twice, set down, and read again. Repetition, placement, and slowed attention all land on the letter.',
        'Revise the claim to follow the evidence: the mug is ordinary scenery that makes the morning feel real, while the letter is the detail the text treats as significant. Note the honest test — if the writer had swapped in a green mug, nothing in the passage would change; swap the letter out and the passage collapses.',
      ],
      answer:
        'No — the mug fails the context test (one mention, no placement, no weight), and the detail the text actually weights is the letter, read three times over',
      estimatedMinutes: 3,
    },
    {
      id: 'try-sense-and-mood',
      kind: 'try_yourself',
      problem:
        'Read the excerpt: "Grease popped in the pan, the window ran with steam, and the whole apartment smelled of onions and Sunday." Which senses does the imagery mainly appeal to, and what mood does it build?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Sound and smell — a warm, lived-in comfort', correct: true },
        { id: 'b', text: 'Sight only — a cold, clinical distance' },
        { id: 'c', text: 'Taste only — a mood of hunger and desperation' },
        { id: 'd', text: 'Touch only — a mood of physical danger' },
      ],
      expectedAnswer: 'Sound and smell — a warm, lived-in comfort',
      hints: [
        'Go phrase by phrase and label the sense: what does "popped" reach, and what does "smelled of onions" reach?',
        'Then ask what those choices make you feel. Attaching a day of the week to a smell is doing something warm, not something clinical.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-text-built-symbol',
      kind: 'try_yourself',
      problem:
        'Read the excerpt: "Every night after his shift, her father dropped his keys into the cracked blue bowl by the door. After the funeral, the bowl stayed empty, and no one moved it." What does the bowl most defensibly symbolize here?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Her father\'s nightly return home, so its emptiness now marks his absence', correct: true },
        { id: 'b', text: 'Wealth, because bowls are a traditional symbol of abundance in literature' },
        { id: 'c', text: 'Anger, because the bowl is described as cracked' },
        { id: 'd', text: 'Nothing — it is ordinary set dressing with no symbolic weight' },
      ],
      expectedAnswer: 'Her father\'s nightly return home, so its emptiness now marks his absence',
      hints: [
        'This is a text-built symbol, so ignore what bowls mean elsewhere and ask what THIS text taught the bowl to mean.',
        'The story pairs the bowl with a repeated action, then shows the same bowl after a loss. What changed, and what does the change stand for?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-which-detail-is-symbolic',
      kind: 'try_yourself',
      problem:
        'Read the excerpt: "Mateo wore his brother\'s old jersey to the first practice, and to the second, and to the tryout in the rain. He also carried a blue backpack, a dented water bottle, and a bus pass he was always losing." Which detail does the text treat as symbolic?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The blue backpack' },
        { id: 'b', text: 'The brother\'s old jersey', correct: true },
        { id: 'c', text: 'The dented water bottle' },
        { id: 'd', text: 'The bus pass' },
      ],
      expectedAnswer: 'The brother\'s old jersey',
      hints: [
        'Run the context test on each item: which one repeats, and which ones are listed once and dropped?',
        'Placement matters too — one detail is attached to every moment that counts, including the tryout.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-fixed-meanings',
      kind: 'misconception_check',
      question:
        'A student says: "I looked it up, and a river always symbolizes the passage of time. So that is what the river means in this story, and any other reading is wrong." What went wrong?',
      commonErrors: [
        {
          answer: 'Symbols have fixed meanings you can look up, and the correct reading is the one in the list',
          misconception: 'Treating symbolism as a decoder ring — importing a conventional meaning instead of reading what this particular text does with the object.',
          correctsTo:
            'A conventional meaning is a starting hypothesis, never a verdict. The text decides: a text can confirm the borrowed meaning, twist it, or refuse it outright, and a river the characters cannot cross may be about separation rather than time. Run the context test on the actual passage, and judge a reading by the evidence it can cite — more than one reading can be defensible, but a reading with no textual support is simply wrong.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Imagery appeals to all five senses, not just sight — and the non-visual senses usually carry the strongest effect.',
        'Imagery builds mood: name the sensory details first, then name the feeling they produce.',
        'A symbol is a concrete thing carrying an abstract meaning, and the text proves it through repetition, placement, and weight.',
        'Not every object is a symbol, and no symbol has one legal meaning — cite the text, and let the evidence set the range.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '8', cedTopic: '8.2', cedTitle: 'Imagery & Symbolism' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
