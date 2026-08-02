/**
 * HS English — Unit 6 CED 6.3: Narrative Point of View.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.engl.narrative-point-of-view.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_ENGL_U6_NARRATIVE_POINT_OF_VIEW: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.engl.narrative-point-of-view.v1',
  course: 'HS English',
  cedUnit: 6,
  cedTopic: '6.3',
  cedTitle: 'Narrative Point of View',
  planId: 'evelyn.hs.engl.narrative-point-of-view.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.engl.narrative-point-of-view.v1' }],
  theory: [
    { loId: 'engl.narrative-point-of-view', kind: 'framework', title: 'First person', content: `FIRST PERSON — the narrator is a character inside the story, using I and we: "I counted the stairs on the way down, the way I always do." You get that character's inner life in full, and nothing else first-hand.` },
    { loId: 'engl.narrative-point-of-view', kind: 'framework', title: 'Second person', content: `SECOND PERSON — the narrator addresses the reader as you: "You take the seat by the window because it is the only one left." Rare, unsettling, and used to pull the reader into the role of the character.` },
    { loId: 'engl.narrative-point-of-view', kind: 'framework', title: 'Third person limited', content: `THIRD PERSON LIMITED — an outside voice uses he, she, they, or names, but enters exactly ONE character's mind: "Kwame decided the noise was nothing. Across the hall, his roommate shut a drawer." We know what Kwame decided; the roommate is only what Kwame can observe.` },
    { loId: 'engl.narrative-point-of-view', kind: 'framework', title: 'Third person omniscient', content: `THIRD PERSON OMNISCIENT — an outside voice moves freely between minds and can report what no single character knows: "Kwame decided the noise was nothing. His roommate, three feet away, was deciding the opposite."` },
    { loId: 'engl.narrative-point-of-view', kind: 'framework', title: 'The access test', content: `THE ACCESS TEST — the one question that separates limited from omniscient: WHOSE HEAD CAN WE ENTER? Count the minds the narration reports from. Zero or one mind means first person or third limited; two or more means omniscient. Everything else about the passage is decoration.` },
    { loId: 'engl.narrative-point-of-view', kind: 'framework', title: 'What each POV cannot show', content: `WHAT EACH POV CANNOT SHOW — first person cannot show what happens when the narrator leaves the room, or what anyone else truly thinks; third limited cannot cross into a second mind; omniscient can show almost anything, which is why suspense in an omniscient story comes from what characters do not know about each other rather than from what the reader is denied.` },
    { loId: 'engl.narrative-point-of-view', kind: 'framework', title: 'Unreliable narrator flags', content: `UNRELIABLE NARRATOR FLAGS — first person narration invites doubt, and three signals raise it: the account is self-serving (the narrator always comes out reasonable); the narration contradicts the events it reports ("Nobody minded," said while describing a room emptying out); or the narrator admits limits — youth, memory gaps, a stake in the outcome. Unreliable does not mean lying; it means the gap between what the narrator says and what actually happened is itself the story.` },
    { loId: 'engl.narrative-point-of-view', kind: 'framework', title: 'POV shifts and the pronoun-only error', content: `POV SHIFTS AND THE PRONOUN-ONLY ERROR — an author who switches narrators between chapters is doing it on purpose, usually to show the same event from a second angle, so ask what the new teller can see that the old one could not. And never classify by pronouns alone: an I inside quoted dialogue belongs to the SPEAKER, not the narrator. Judge the narration, not the conversation.` },
    { loId: 'engl.narrative-point-of-view', kind: 'definition', title: 'third-person limited', content: `an outside narrator who reports the inner thoughts of exactly one character and treats everyone else from the outside.` },
    { loId: 'engl.narrative-point-of-view', kind: 'definition', title: 'omniscient', content: `an outside narrator with access to more than one character's mind, and often to information no character has.` },
    { loId: 'engl.narrative-point-of-view', kind: 'definition', title: 'unreliable narrator', content: `a narrator whose account the reader has reason to doubt, because of self-interest, limited knowledge, or contradictions inside the telling.` },
  ],
  methods: [
    {
      title: 'Worked classify access',
      steps: [
        `Check the pronouns first, as a rough sort: the narration uses he and him and a proper name, never I or you. That rules out first person and second person and leaves the two third-person options.`,
        `Now run the ACCESS test — whose head can we enter? "He wondered whether the cashier had noticed" is Dario's inner thought, reported from inside. That is one mind.`,
        `Test the second character. The cashier gets "only stared past him toward the door" — observable behavior, the kind of thing Dario himself could see. No thought, no feeling, no reason for the stare. That is not a second mind; that is a body seen from outside.`,
        `One mind entered means limited, not omniscient. Note what the choice costs the reader: we do not learn whether the cashier noticed anything, and the tension in the excerpt depends entirely on that gap.`,
      ],
      example: { problem: `Classify the point of view of this excerpt using the access test: "Dario counted the change twice before he handed it over. He wondered whether the cashier had noticed his hands shaking, but the cashier only stared past him toward the door."`, solution: `Third-person limited — the narration enters only Dario's mind and shows the cashier from the outside` },
      relatedLoIds: ['engl.narrative-point-of-view'],
    },
    {
      title: 'Worked limited mistaken for omniscient',
      steps: [
        `Name the reasoning behind the error: the student treated any reported thought as proof of omniscience. But reporting thoughts is exactly what third-person LIMITED does — that is the whole point of the mode.`,
        `Apply the access test properly by counting minds, not thoughts. Mind one: Renata, whose certainty we are told directly.`,
        `Test the uncle. We get folding, shrinking squares, and silence — all of it visible from Renata's chair. We are never told what the uncle believes about the letter, which is precisely the information an omniscient narrator would hand over.`,
        `Correct the label and read the effect: this is third-person limited, and the uncle's unreadable silence is the excerpt's pressure. Omniscience would have dissolved that tension by telling us what the folding meant.`,
      ],
      example: { problem: `A student labels this excerpt third-person omniscient because it reports a character's thoughts: "Renata was certain the letter would change nothing. Across the table, her uncle folded his napkin into a smaller and smaller square and said nothing at all." What did the student get wrong?`, solution: `Reporting one character's thoughts is limited narration, not omniscience — omniscience requires entering a SECOND mind, and the uncle is shown only from the outside` },
      relatedLoIds: ['engl.narrative-point-of-view'],
    },
  ],
  pointers: [
    { content: `Point of view is set by the NARRATION, not by the characters' speech. Cover the quoted lines and read what is left: "Halvorsen leaned across the desk," "she said." Those are third-person. The I belongs to Halvorsen as a speaker, and every story in every point of view contains characters who say I out loud.`, kind: 'common-error' },
    { content: `Four modes: first person (I), second person (you), third-person limited (one mind), third-person omniscient (many minds).`, kind: 'tip' },
    { content: `The ACCESS test settles limited vs omniscient: count how many heads the narration enters, not how many thoughts it reports.`, kind: 'tip' },
    { content: `Point of view is a set of walls — always ask what this narrator cannot show you, because the hidden part is usually where the tension lives.`, kind: 'tip' },
    { content: `Doubt a first-person account when it is self-serving, when the narration contradicts the events, or when the narrator admits a gap.`, kind: 'tip' },
    { content: `Classify the narration, never the dialogue: an I inside quotation marks belongs to the speaker.`, kind: 'tip' },
    { content: `Cover the quoted dialogue before you classify. An \`I\` inside quotation marks belongs to the *speaker*, not the narrator — every POV contains characters who say "I" out loud. Read only the unquoted narration: "she said," "Halvorsen leaned" = third person.`, kind: 'common-error' },
    { content: `Reporting a thought is NOT proof of omniscience — that's exactly what third-person limited does. Count *minds entered*, not *thoughts reported*. One mind, however many thoughts, is still limited.`, kind: 'gotcha' },
    { content: `Behavior seen from outside is not a second mind. "The uncle folded his napkin smaller and smaller" or "the cashier stared past him" is a body, not a head. Ask: could the focal character have observed this from where they're standing?`, kind: 'tip' },
    { content: `Write "third-person limited" and "third-person omniscient" in full. "Third person" alone answers nothing, and "limited" or "omniscient" alone drops the person. Both halves carry information.`, kind: 'vocab-note' },
    { content: `Unreliable ≠ lying. A narrator can be sincere and still unreliable through youth, memory gaps, or self-interest. The point isn't to catch a liar — it's the gap between what the narrator says and what actually happened.`, kind: 'vocab-note' },
    { content: `Don't call a narrator unreliable just because the story is first person. Point to a specific flag: a self-serving account, an internal contradiction, or an admitted limit — like "I remember perfectly" next to "I left before most of them arrived."`, kind: 'common-error' },
    { content: `After you label the POV, name what it *cannot* show — what the narrator misses when they leave the room, the second character's real motive. That withheld information is usually where the passage's tension lives.`, kind: 'tip' },
    { content: `Omniscient narration doesn't kill suspense — it relocates it. When the reader knows both minds, the tension comes from what the *characters* don't know about each other, not from what's hidden from you.`, kind: 'edge-case' },
  ],
};
