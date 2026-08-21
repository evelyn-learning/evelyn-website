/**
 * Grade 7 English Language Arts — Unit 2 CED 2.2: Point of View & Narrator.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m7ela.point-of-view.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M7ELA_U2_POINT_OF_VIEW: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m7ela.point-of-view.v1',
  course: 'Grade 7 English Language Arts',
  cedUnit: 2,
  cedTopic: '2.2',
  cedTitle: 'Point of View & Narrator',
  planId: 'evelyn.ms.m7ela.point-of-view.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-20',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m7ela.point-of-view.v1' }],
  theory: [
    { loId: 'm7ela.point-of-view', content: `POINT OF VIEW IS WHO IS TELLING THE STORY, and there is one test that sorts them all: WHOSE THOUGHTS DO YOU GET? Not whose name shows up most. Not which pronouns appear on the page. Whose head does the narration go inside? Ask that question first, every single time, and the label falls out of the answer.` },
    { loId: 'm7ela.point-of-view', kind: 'framework', title: 'First person', content: `FIRST PERSON — the narrator is a character standing inside the story, using I and we: "I counted the stairs on the way down, the way I always do." You get that one character's thoughts in full, and nobody else's. Whatever happens in a room the narrator is not in does not make it into the book.` },
    { loId: 'm7ela.point-of-view', kind: 'framework', title: 'Third person limited', content: `THIRD PERSON LIMITED — an outside voice tells the story with he, she, they and names, and it goes inside exactly ONE character's head: "Kwame decided the noise was nothing. Down the hall, his sister shut a drawer." You know what Kwame decided. His sister is only what Kwame could watch her do.` },
    { loId: 'm7ela.point-of-view', kind: 'framework', title: 'Third person omniscient', content: `THIRD PERSON OMNISCIENT — an outside voice that can go inside every head, and can tell you things no character in the book knows: "Kwame decided the noise was nothing. Three feet away, his sister was deciding the opposite." Omniscient means all-knowing.` },
    { loId: 'm7ela.point-of-view', content: `SECOND PERSON is the rare fourth one. It talks straight to the reader as you: "You take the seat by the window because it is the only one left." And here is the rule that catches most people: only the NARRATION counts. A third person story can be stuffed with characters saying I out loud, because an I inside quotation marks belongs to the SPEAKER, not to the narrator.` },
    { loId: 'm7ela.point-of-view', content: `ALWAYS ASK WHAT THE NARRATOR HIDES. Every point of view is a set of walls. First person hides what everyone else is really thinking, and it hides every scene the narrator misses. Third person limited hides the second character's reasons, which is exactly where the tension usually lives. Omniscient hides almost nothing, so the suspense has to come from what the characters do not know about each other. One more wall: the narrator is not the author. A grown writer can tell a whole book as a twelve-year-old, a grandmother, or a dog.` },
    { loId: 'm7ela.point-of-view', kind: 'definition', title: 'point of view', content: 'who is telling the story, and how much that teller is able to know.' },
    { loId: 'm7ela.point-of-view', kind: 'definition', title: 'narrator', content: `the voice telling the story. The narrator is a choice the author made, not the author.` },
    { loId: 'm7ela.point-of-view', kind: 'definition', title: 'first person', content: 'narration by a character inside the story, using I and we.' },
    { loId: 'm7ela.point-of-view', kind: 'definition', title: 'third person limited', content: `narration by an outside voice that reports the thoughts of exactly one character.` },
    { loId: 'm7ela.point-of-view', kind: 'definition', title: 'omniscient', content: 'all-knowing. An outside narrator who can report the thoughts of every character.' },
  ],
  methods: [
    {
      title: 'Worked whose thoughts',
      steps: [
        `Do the rough sort with pronouns first. The narration says Devin, he, his, Ms. Alvarez. There is no I and no you anywhere in the narration, so this is third person. That is as far as pronouns can take us.`,
        `Now run the real test: whose thoughts do you get? "He was almost sure it was a joke" is Devin thinking. That is head number one.`,
        `Test the second character before you decide. Ms. Alvarez gets "kept writing on the board and did not turn around." Both of those are things Devin could see from his own desk. No thought, no feeling, no reason. That is a person watched from the outside, not a head we entered.`,
        `One head means third person limited. Two or more heads would have meant omniscient.`,
        `Now the part the standard actually asks for: what does this choice hide? We never learn whether Ms. Alvarez knows about the note, or what she thinks of Devin. The reader is stuck at Devin's desk, which is exactly why the moment feels tense.`,
        `Say the whole answer, not just the label: third person limited, because the narration reports only Devin's thoughts, and it hides what Ms. Alvarez is thinking.`,
      ],
      example: { problem: `Name the point of view, then say one thing the reader is not allowed to find out.

"Devin read the note twice. He was almost sure it was a joke, but he folded it into his pocket anyway. Ms. Alvarez kept writing on the board and did not turn around."`, solution: `Third person limited. The narration goes inside Devin's head only, and Ms. Alvarez is shown from the outside, so the reader never finds out whether she noticed the note or what she thinks about it.` },
      relatedLoIds: ['m7ela.point-of-view'],
    },
    {
      title: 'Worked contrast two versions',
      steps: [
        `Both versions are third person. Both use she and he and names. So the pronouns cannot separate them, and anyone sorting by pronouns alone is stuck.`,
        `Count heads in Version A. "She had wanted it all afternoon" is Ines thinking. Marcus gets "said thanks and ate it in two bites," which is only what Ines could watch him do. One head. Version A is third person limited.`,
        `Count heads in Version B. Ines is still head one. Then "wondering why she was being so nice" is Marcus thinking, and Ines cannot hear that. Two heads. Version B is third person omniscient.`,
        `Now compare what the reader gets. Version B hands you both sides at once. You know Ines gave up something she wanted, and you know Marcus is suspicious instead of grateful. The gap between the two is right there on the page.`,
        `And compare what the reader loses. In Version A you are trapped with Ines, wondering along with her whether Marcus even noticed. That not-knowing is a feeling Version B deletes.`,
        `This is what it means to say an author develops and contrasts points of view. The events did not change at all. The teller changed, and that changed what the moment means.`,
      ],
      example: { problem: `Here is one moment written two ways. Which version is omniscient, and what does the reader gain and lose?

VERSION A: "Ines slid the last brownie onto Marcus's plate. She had wanted it all afternoon. Marcus said thanks and ate it in two bites."

VERSION B: "Ines slid the last brownie onto Marcus's plate. She had wanted it all afternoon. Marcus said thanks and ate it in two bites, wondering why she was being so nice."`, solution: `Version B is third person omniscient, because it reports Marcus's thoughts as well as Ines's. Version A is third person limited. B gains both sides of the moment at once. A keeps the reader inside Ines's uncertainty about whether Marcus noticed.` },
      relatedLoIds: ['m7ela.point-of-view'],
    },
  ],
  pointers: [
    { content: `Students often say "The narrator says "I", so the narrator is the author." — The narrator is a character the author built, the same way they built the setting and the plot. A forty year old writer can narrate a whole novel as a twelve year old, a grandmother, a soldier, or a stray dog. The I on the page belongs to that invented teller. So when a narrator says something unfair or gets something wrong, that is not proof the author believes it. Very often the author put the mistake there on purpose so the reader would notice it.`, kind: 'common-error' },
    { content: `Students often say "A character says "I have to go", so the story is first person." — Only the NARRATION decides the point of view, never the dialogue. Cover the quoted words and read what is left. If the leftover part says "Dev said" and "he stood up", the story is third person, no matter how many times a character says I out loud. Characters in every story talk about themselves. That is just people talking, and it tells you nothing about who is telling the story.`, kind: 'common-error' },
    { content: `Four points of view: first person (I), second person (you), third person limited (one head), third person omniscient (every head).`, kind: 'tip' },
    { content: `The test is WHOSE THOUGHTS DO YOU GET. Limited and omniscient both use he, she and they, so the pronoun alone never decides between them.`, kind: 'tip' },
    { content: `Only the narration counts. An I inside quotation marks belongs to the speaker, so a third person story can be full of characters saying I.`, kind: 'tip' },
    { content: `Always ask what the narrator hides. First person hides everyone else's real thoughts and every scene the narrator misses. Limited hides the second character's reasons.`, kind: 'tip' },
    { content: `The narrator is not the author. The narrator is a character the author chose, and changing that choice changes what the same events mean.`, kind: 'tip' },
    { content: `Cover the dialogue before you decide. A character shouting "I'm leaving!" does NOT make a story first person — that "I" belongs to the speaker. Only the narration (the unquoted words) picks the point of view.`, kind: 'common-error' },
    { content: `Pronouns only get you to "third person." Limited and omniscient BOTH use he/she/they/names. To split them you must count heads: one set of thoughts = limited, two or more = omniscient.`, kind: 'gotcha' },
    { content: `The narrator is not the author. A grown writer can narrate as a 12-year-old, a grandmother, or a dog. Write "the narrator thinks…" not "the author thinks…" when a first person narrator says something unfair or wrong.`, kind: 'vocab-note' },
    { content: `Actions are not thoughts. "Ms. Alvarez did not turn around" and "Dev shoved his markers in his bag" are things another character could SEE. Only words like *decided, wondered, was almost sure, hoped* mean you went inside a head.`, kind: 'common-error' },
    { content: `"Omniscient" means all-knowing, not "knows a lot." One extra character's thought is enough to make it omniscient — the narrator does not have to visit every character in the book.`, kind: 'vocab-note' },
    { content: `Watch for guesses about other people. "She was almost sure he had not" is still ONE head — it's the viewpoint character guessing, not the narrator entering the brother's mind. A guess about a thought is not a reported thought.`, kind: 'edge-case' },
    { content: `Never stop at the label. The question almost always asks what the teller HIDES too. Finish with a because-clause: "third person limited, because we get only Devin's thoughts, so we never learn what Ms. Alvarez knows."`, kind: 'tip' },
    { content: `Second person ("You take the last seat") is rare, and it is not the same as a narrator addressing the reader once. Check whether YOU are the one doing the actions in the story, not just being spoken to.`, kind: 'edge-case' },
  ],
};
