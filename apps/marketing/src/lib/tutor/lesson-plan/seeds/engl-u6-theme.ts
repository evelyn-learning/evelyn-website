/**
 * HS English — Reading Literature: Finding & Tracing Theme.
 *
 * What a story is ABOUT versus what it SAYS (CCSS RL.9-10.2): topic vs
 * theme, stating a theme as a complete insight, and tracing that insight
 * through character change, conflict resolution, and repeated images. All
 * excerpts are short ORIGINAL prose written for this lesson — no
 * copyrighted quotations, no external passages.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_ENGL_U6_THEME: LessonPlan = {
  id: 'evelyn.hs.engl.theme.v1',
  title: 'Finding & Tracing Theme',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'ela',
  topic: 'hs-english',
  locale: 'en',
  los: [
    {
      id: 'engl.theme',
      standard: 'ENGL-6.4',
      description:
        'Distinguish a text\'s topic from its theme, state that theme as a complete insight about life rather than a single word or a commanded moral, and trace how character change, the resolution of conflict, and repeated images develop it across the whole text (CCSS RL.9-10.2).',
    },
  ],
  prerequisites: ['engl.narrative-point-of-view'],
  followUps: ['engl.central-idea-and-details'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Use the everyday experience of two people disagreeing about the same story to separate what a story is about from what it says.',
      script:
        'Two friends walk out of the same movie. One says it was about a girl and her grandmother. The other says it was about how we only ask people questions when we are afraid of running out of time to ask them. Both are right, but they are answering different questions. The first names the SUBJECT. The second states what the story argues about being alive. That second answer is theme, and it is the thing a writer actually built the story to deliver. Today we learn how to find it and how to prove it from the page.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-topic-vs-theme',
      kind: 'concept',
      goal: 'Separate topic from theme, give students a formula for stating theme, and set the two rules that keep a theme claim honest and traceable.',
      keyIdeas: [
        'TOPIC IS A WORD; THEME IS A SENTENCE — the topic of a story might be "loyalty" or "grief" or "ambition." That is the subject the story keeps circling. The theme is what the story SAYS about that subject: "Loyalty that is never questioned becomes a way of avoiding responsibility." One word names the room; a full sentence tells you what happened inside it.',
        'THE THEME FORMULA — ask two questions and answer them in one sentence: what does the main character learn, or fail to learn, and what did it cost? "Nadia learns that an apology delivered too late protects the giver, not the receiver" is a theme; "apologies" is not.',
        'THEME MUST BE TEXT-SUPPORTED, NOT IMPORTED — a theme is a claim you can defend with lines from the page. If your statement would fit a hundred other stories equally well, you have imported a general belief rather than read this text. The test is always: which specific moments force this reading?',
        'ONE TEXT, SEVERAL VALID THEMES — a story about a family losing a house can develop a theme about memory and another about pride, at the same time. Valid does not mean identical; it means each statement is supported by its own chain of evidence. Two readers can disagree and both be right, and neither is right without proof.',
        'TRACE 1 — CHARACTER CHANGE — the gap between who a character is on page one and who they are at the end is the story\'s clearest argument. Name what changed, then name what caused it. If nothing changes, that refusal to change is itself the claim.',
        'TRACE 2 — CONFLICT RESOLUTION — how a conflict ends is the author choosing a side. A character who wins by lying and a character who loses by telling the truth deliver very different verdicts about honesty. Ask what the ending rewards and what it punishes.',
        'TRACE 3 — REPETITION — an image, object, phrase, or situation that returns is the author underlining. A locked door in scene one, scene six, and the last paragraph is not scenery. Track the repeated thing and ask what it means differently each time it appears.',
        'THE TWO CLASSIC ERRORS — the ONE-WORD ANSWER ("the theme is friendship") states a topic and stops before the insight; the PREACHY MORAL ("always be nice to your family") issues a command the story never issued. Themes observe how life works; they do not hand out instructions.',
      ],
      vocabulary: [
        { term: 'topic', definition: 'the subject a text keeps returning to, nameable in a word or short phrase: grief, ambition, forgiveness.' },
        { term: 'theme', definition: 'a complete statement of what the text says about its topic — an insight about human experience that the text\'s own details support.' },
        { term: 'motif', definition: 'an image, object, or phrase that repeats across a text and accumulates meaning, often carrying a theme.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-derive-theme',
      kind: 'worked_example',
      problem:
        'Derive a theme statement from this short story: "For eleven years Ines kept her mother\'s garden exactly as it had been left, replanting the same three rows every spring. The year the drought killed everything anyway, she planted lemon balm instead, which her mother had hated. It came up thick, and she found she could finally say her mother\'s name out loud."',
      steps: [
        'Name the topic first, in a word or two: grief, or more precisely the way people preserve the dead. That is the subject, not yet the theme.',
        'Trace the character change: Ines begins as a caretaker of an unchanged garden and ends as someone planting something new and speaking her mother\'s name. The change is from preservation to release.',
        'Trace the conflict and its resolution: the conflict is between honoring her mother and living her own life. The drought resolves it by force, and the ending rewards the departure rather than the loyalty — the new plant thrives and the grief loosens.',
        'Trace the repetition: the same three rows, replanted every spring for eleven years, are the story underlining sameness. Breaking that pattern is the story\'s loudest moment.',
        'State it as a complete insight, not a command: preserving a person exactly as they were can hold grief in place, and letting the memory change is what finally makes it speakable. Check it against the text — every step above supports it.',
      ],
      answer:
        'Theme: holding a memory perfectly unchanged can keep grief frozen, and allowing it to change is what makes loss finally speakable — supported by the eleven unchanged springs, the deliberate planting of the hated herb, and her ability to say the name only afterward',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-topic-and-moral-errors',
      kind: 'worked_example',
      problem:
        'A student reads this story and says the theme is "friendship," then revises it to "always forgive your friends." Story: "When Dev found out who had told the coach, he did not confront Amara; he simply stopped saving her a seat. Three months later he sat beside her at the assembly without a word, and neither of them mentioned the seat or the coach again. They were friendly for years afterward, and never close again."',
      steps: [
        'Diagnose the first answer: "friendship" is a topic. It names what the story is about and says nothing about what the story argues. Any test of it against the page is impossible, because there is no claim to test.',
        'Diagnose the second answer: "always forgive your friends" is a commanded moral, and it is also unsupported. The story never shows forgiveness working out. It shows the friendship surviving in a reduced form, which is a different outcome entirely.',
        'Go back to the evidence: the character change is that Dev moves from confrontation to silence to a wordless return. The resolution rewards neither a confrontation nor a real repair — the closing line insists on the cost, "friendly for years afterward, and never close again."',
        'Notice the repeated detail: the saved seat appears as a withdrawal and then as a return, and the story deliberately refuses to let either character name it. Silence is the motif.',
        'Rewrite as a supported insight: a friendship can be repaired without ever being discussed, but what is left is smaller than what was broken. That statement is a full sentence, it observes rather than commands, and the last line of the story states its cost directly.',
      ],
      answer:
        'Both answers fail: "friendship" is a topic, not a claim, and "always forgive your friends" is a moral the story never supports. A defensible theme is that avoidance can preserve a friendship while permanently shrinking it — evidenced by the withdrawn seat, the wordless return, and the closing "never close again"',
      estimatedMinutes: 3,
    },
    {
      id: 'try-theme-vs-topic',
      kind: 'try_yourself',
      problem: 'Which statement is a THEME rather than a topic, a plot summary, or a moral?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Ambition and its consequences' },
        { id: 'b', text: 'People who chase recognition often lose the thing that earned it in the first place', correct: true },
        { id: 'c', text: 'A young violinist practices for years, wins a competition, and then quits the orchestra' },
        { id: 'd', text: 'Never let your ambition get in the way of your friendships' },
      ],
      expectedAnswer: 'People who chase recognition often lose the thing that earned it in the first place',
      hints: [
        'A theme is a complete sentence that makes a claim about how life works — not a subject, not a sequence of events, and not an order.',
        'Two choices name a subject or retell the plot; one issues a command starting with "never." Only one observes something about people.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-best-supported-theme',
      kind: 'try_yourself',
      problem:
        'Read the excerpt: "Coach Ellery posted the roster an hour late every year, because every year he rewrote the last two names. He told the cut players himself, in the hallway, one at a time. He said it took an hour because it should cost him something too." Which theme is BEST supported by this excerpt?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Authority is meaningful only when the person holding it accepts part of the burden it creates', correct: true },
        { id: 'b', text: 'Coaching' },
        { id: 'c', text: 'Always tell people bad news in person' },
        { id: 'd', text: 'A coach delays posting his roster and then speaks with the players he has cut' },
      ],
      expectedAnswer: 'Authority is meaningful only when the person holding it accepts part of the burden it creates',
      hints: [
        'Three of these are not theme statements at all — find the one that makes a claim about human experience in a full sentence.',
        'The last line is the excerpt telling you what it is about: "it should cost him something too." Which statement is built from that line?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-detail-develops-theme',
      kind: 'try_yourself',
      problem:
        'A story develops the theme that inherited expectations can outlast the people who set them. Read the excerpt: "Tomas hung his father\'s work apron on the same nail for six years after the shop closed. He kept the tools sharpened. He had not built anything since the funeral, but he swept the floor every Sunday." Which detail most directly DEVELOPS that theme?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'He maintains the shop\'s routines for years although the work itself has ended', correct: true },
        { id: 'b', text: 'The shop closed at some point before the story begins' },
        { id: 'c', text: 'He owns a set of tools that can be sharpened' },
        { id: 'd', text: 'Sundays are traditionally a day of rest' },
      ],
      expectedAnswer: 'He maintains the shop\'s routines for years although the work itself has ended',
      hints: [
        'The theme is about expectations OUTLASTING the person who set them. Look for the detail that shows something continuing past its purpose.',
        'Two choices are background facts and one imports outside knowledge the excerpt never states. Only one shows a pattern repeating for years without a reason of its own.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-topic-and-moral',
      kind: 'misconception_check',
      question:
        'A student says: "The theme of this story is courage. Basically, it is telling us to always stand up for what we believe in." What went wrong, twice?',
      commonErrors: [
        {
          answer: 'The theme is courage, and the story is telling us to always stand up for what we believe in',
          misconception: 'Collapsing theme into a one-word topic, then rescuing it with a commanded moral that the text never supports.',
          correctsTo:
            'Two separate errors. "Courage" is the TOPIC — the subject the story circles — and it makes no claim, so there is nothing to prove or disprove from the page. "Always stand up for what you believe in" is a MORAL: it gives an order, and it would fit almost any story, which means it was imported rather than read. A theme is a full sentence stating what THIS text argues about courage, defensible from specific moments: how the character changed, how the conflict resolved, and what the story kept repeating. Try instead: "Courage looks like certainty from the outside and feels like guessing from the inside" — then point to the lines that force it.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Topic is a word, theme is a sentence: the topic names what the story is about, the theme states what the story says about it.',
        'Build the theme from what the main character learns or fails to learn, and what it cost.',
        'Trace it three ways — character change, how the conflict resolves, and what image or situation repeats.',
        'A theme must be provable from this text, and it observes rather than commands: no one-word answers, no "always be nice" morals.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '6', cedTopic: '6.4', cedTitle: 'Finding & Tracing Theme' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
