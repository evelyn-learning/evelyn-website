/**
 * HS English — Unit 6 CED 6.4: Finding & Tracing Theme.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.engl.theme.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_ENGL_U6_THEME: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.engl.theme.v1',
  course: 'HS English',
  cedUnit: 6,
  cedTopic: '6.4',
  cedTitle: 'Finding & Tracing Theme',
  planId: 'evelyn.hs.engl.theme.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.engl.theme.v1' }],
  theory: [
    { loId: 'engl.theme', content: `TOPIC IS A WORD; THEME IS A SENTENCE — the topic of a story might be "loyalty" or "grief" or "ambition." That is the subject the story keeps circling. The theme is what the story SAYS about that subject: "Loyalty that is never questioned becomes a way of avoiding responsibility." One word names the room; a full sentence tells you what happened inside it.` },
    { loId: 'engl.theme', kind: 'framework', title: 'The theme formula', content: `THE THEME FORMULA — ask two questions and answer them in one sentence: what does the main character learn, or fail to learn, and what did it cost? "Nadia learns that an apology delivered too late protects the giver, not the receiver" is a theme; "apologies" is not.` },
    { loId: 'engl.theme', kind: 'framework', title: 'Theme must be text-supported, not imported', content: `THEME MUST BE TEXT-SUPPORTED, NOT IMPORTED — a theme is a claim you can defend with lines from the page. If your statement would fit a hundred other stories equally well, you have imported a general belief rather than read this text. The test is always: which specific moments force this reading?` },
    { loId: 'engl.theme', kind: 'framework', title: 'One text, several valid themes', content: `ONE TEXT, SEVERAL VALID THEMES — a story about a family losing a house can develop a theme about memory and another about pride, at the same time. Valid does not mean identical; it means each statement is supported by its own chain of evidence. Two readers can disagree and both be right, and neither is right without proof.` },
    { loId: 'engl.theme', kind: 'framework', title: 'Trace 1', content: `TRACE 1 — CHARACTER CHANGE — the gap between who a character is on page one and who they are at the end is the story's clearest argument. Name what changed, then name what caused it. If nothing changes, that refusal to change is itself the claim.` },
    { loId: 'engl.theme', kind: 'framework', title: 'Trace 2', content: `TRACE 2 — CONFLICT RESOLUTION — how a conflict ends is the author choosing a side. A character who wins by lying and a character who loses by telling the truth deliver very different verdicts about honesty. Ask what the ending rewards and what it punishes.` },
    { loId: 'engl.theme', kind: 'framework', title: 'Trace 3', content: `TRACE 3 — REPETITION — an image, object, phrase, or situation that returns is the author underlining. A locked door in scene one, scene six, and the last paragraph is not scenery. Track the repeated thing and ask what it means differently each time it appears.` },
    { loId: 'engl.theme', kind: 'framework', title: 'The two classic errors', content: `THE TWO CLASSIC ERRORS — the ONE-WORD ANSWER ("the theme is friendship") states a topic and stops before the insight; the PREACHY MORAL ("always be nice to your family") issues a command the story never issued. Themes observe how life works; they do not hand out instructions.` },
    { loId: 'engl.theme', kind: 'definition', title: 'topic', content: `the subject a text keeps returning to, nameable in a word or short phrase: grief, ambition, forgiveness.` },
    { loId: 'engl.theme', kind: 'definition', title: 'theme', content: `a complete statement of what the text says about its topic — an insight about human experience that the text's own details support.` },
    { loId: 'engl.theme', kind: 'definition', title: 'motif', content: `an image, object, or phrase that repeats across a text and accumulates meaning, often carrying a theme.` },
  ],
  methods: [
    {
      title: 'Worked derive theme',
      steps: [
        `Name the topic first, in a word or two: grief, or more precisely the way people preserve the dead. That is the subject, not yet the theme.`,
        `Trace the character change: Ines begins as a caretaker of an unchanged garden and ends as someone planting something new and speaking her mother's name. The change is from preservation to release.`,
        `Trace the conflict and its resolution: the conflict is between honoring her mother and living her own life. The drought resolves it by force, and the ending rewards the departure rather than the loyalty — the new plant thrives and the grief loosens.`,
        `Trace the repetition: the same three rows, replanted every spring for eleven years, are the story underlining sameness. Breaking that pattern is the story's loudest moment.`,
        `State it as a complete insight, not a command: preserving a person exactly as they were can hold grief in place, and letting the memory change is what finally makes it speakable. Check it against the text — every step above supports it.`,
      ],
      example: { problem: `Derive a theme statement from this short story: "For eleven years Ines kept her mother's garden exactly as it had been left, replanting the same three rows every spring. The year the drought killed everything anyway, she planted lemon balm instead, which her mother had hated. It came up thick, and she found she could finally say her mother's name out loud."`, solution: `Theme: holding a memory perfectly unchanged can keep grief frozen, and allowing it to change is what makes loss finally speakable — supported by the eleven unchanged springs, the deliberate planting of the hated herb, and her ability to say the name only afterward` },
      relatedLoIds: ['engl.theme'],
    },
    {
      title: 'Worked topic and moral errors',
      steps: [
        `Diagnose the first answer: "friendship" is a topic. It names what the story is about and says nothing about what the story argues. Any test of it against the page is impossible, because there is no claim to test.`,
        `Diagnose the second answer: "always forgive your friends" is a commanded moral, and it is also unsupported. The story never shows forgiveness working out. It shows the friendship surviving in a reduced form, which is a different outcome entirely.`,
        `Go back to the evidence: the character change is that Dev moves from confrontation to silence to a wordless return. The resolution rewards neither a confrontation nor a real repair — the closing line insists on the cost, "friendly for years afterward, and never close again."`,
        `Notice the repeated detail: the saved seat appears as a withdrawal and then as a return, and the story deliberately refuses to let either character name it. Silence is the motif.`,
        `Rewrite as a supported insight: a friendship can be repaired without ever being discussed, but what is left is smaller than what was broken. That statement is a full sentence, it observes rather than commands, and the last line of the story states its cost directly.`,
      ],
      example: { problem: `A student reads this story and says the theme is "friendship," then revises it to "always forgive your friends." Story: "When Dev found out who had told the coach, he did not confront Amara; he simply stopped saving her a seat. Three months later he sat beside her at the assembly without a word, and neither of them mentioned the seat or the coach again. They were friendly for years afterward, and never close again."`, solution: `Both answers fail: "friendship" is a topic, not a claim, and "always forgive your friends" is a moral the story never supports. A defensible theme is that avoidance can preserve a friendship while permanently shrinking it — evidenced by the withdrawn seat, the wordless return, and the closing "never close again"` },
      relatedLoIds: ['engl.theme'],
    },
  ],
  pointers: [
    { content: `Two separate errors. "Courage" is the TOPIC — the subject the story circles — and it makes no claim, so there is nothing to prove or disprove from the page. "Always stand up for what you believe in" is a MORAL: it gives an order, and it would fit almost any story, which means it was imported rather than read. A theme is a full sentence stating what THIS text argues about courage, defensible from specific moments: how the character changed, how the conflict resolved, and what the story kept repeating. Try instead: "Courage looks like certainty from the outside and feels like guessing from the inside" — then point to the lines that force it.`, kind: 'common-error' },
    { content: `Topic is a word, theme is a sentence: the topic names what the story is about, the theme states what the story says about it.`, kind: 'tip' },
    { content: `Build the theme from what the main character learns or fails to learn, and what it cost.`, kind: 'tip' },
    { content: `Trace it three ways — character change, how the conflict resolves, and what image or situation repeats.`, kind: 'tip' },
    { content: `A theme must be provable from this text, and it observes rather than commands: no one-word answers, no "always be nice" morals.`, kind: 'tip' },
    { content: `If your theme statement contains "should," "always," "never," or "you must," you've written a moral, not a theme. Rewrite it as an observation: not "always forgive your friends" but "avoidance can preserve a friendship while permanently shrinking it."`, kind: 'common-error' },
    { content: `A theme is never a plot summary. "Ines planted lemon balm and could finally say her mother's name" retells events; the theme generalizes past the characters' names: "holding a memory unchanged can keep grief frozen." Drop the proper nouns and see if a claim survives.`, kind: 'gotcha' },
    { content: `Test every theme for the "fits a hundred stories" problem. If your sentence would work equally well for a text you've never read, you imported a general belief. Ask: which specific moments in THIS text force this reading?`, kind: 'tip' },
    { content: `Use *motif* for a repeating image, object, or phrase (the saved seat, the three rows), not *symbol* or "theme." A motif is the thing that repeats; the theme is the claim that repetition builds. Say "the locked-door motif develops the theme that..."`, kind: 'vocab-note' },
    { content: `A character who refuses to change still gives you a theme. Don't write "no character change, so no theme" — the refusal IS the claim. Tomas keeping the shop for six years without building anything is a change-free arc making an argument.`, kind: 'edge-case' },
    { content: `Two different themes from one text can both be right — but only if each has its OWN chain of evidence. "Both are valid" is not a defense; "here are the three moments that force mine" is.`, kind: 'gotcha' },
    { content: `Ask what the ending REWARDS and what it PUNISHES, not what you wish it did. If a liar wins and a truth-teller loses, the text's verdict on honesty is bleak — don't smooth it into a comforting theme the resolution never earned.`, kind: 'common-error' },
    { content: `Build the sentence with the formula: what did the character learn (or fail to learn), and what did it cost? The cost half is what students drop — without it you get half a theme, an insight with no consequence attached.`, kind: 'tip' },
  ],
};
