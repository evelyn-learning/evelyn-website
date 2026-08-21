/**
 * Grade 7 English Language Arts — Unit 1 CED 1.3: How Writers Build Characters.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m7ela.characterization.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M7ELA_U1_CHARACTERIZATION: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m7ela.characterization.v1',
  course: 'Grade 7 English Language Arts',
  cedUnit: 1,
  cedTopic: '1.3',
  cedTitle: 'How Writers Build Characters',
  planId: 'evelyn.ms.m7ela.characterization.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-20',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m7ela.characterization.v1' }],
  theory: [
    { loId: 'm7ela.characterization', kind: 'framework', title: 'A trait is what someone is like, not what they do', content: `A TRAIT IS WHAT SOMEONE IS LIKE, NOT WHAT THEY DO — brave, careful, jealous and generous are traits. Riding a bike, opening a box and losing a game are events. If your answer to "what is this character like" could go on a list of things that happened, it is a plot detail, not a trait. Trade it for the word the detail proves.` },
    { loId: 'm7ela.characterization', kind: 'framework', title: 'Direct characterization is the writer telling you', content: `DIRECT CHARACTERIZATION IS THE WRITER TELLING YOU — "Mateo was stubborn." It is quick and it is rare, because it does all the work for the reader and leaves nothing to notice.` },
    { loId: 'm7ela.characterization', content: `INDIRECT CHARACTERIZATION IS THE WRITER SHOWING YOU, and there are five moves to watch for: what the character SAYS, what the character DOES, what the character THINKS, how the character LOOKS, and how OTHER characters react to them. Almost every character question you will ever meet is asking you to catch one of those five.` },
    { loId: 'm7ela.characterization', kind: 'framework', title: 'The big trap', content: `THE BIG TRAP — what a character says about themselves is not automatically true. People say they are fine when they are not. When the words point one way and the actions point the other way, believe the actions. That gap is usually the whole point of the scene, and a writer builds it on purpose.` },
    { loId: 'm7ela.characterization', kind: 'framework', title: 'Every claim needs the line that proves it', content: `EVERY CLAIM NEEDS THE LINE THAT PROVES IT — a trait you cannot attach to a specific detail is a guess. Say the trait, then say "because" and quote the words that earned it. If nothing in the text fits after "because", the trait is not in the passage, no matter how likely it seems.` },
    { loId: 'm7ela.characterization', kind: 'definition', title: 'trait', content: `a word for what a character is like on the inside, such as careful, generous or jealous.` },
    { loId: 'm7ela.characterization', kind: 'definition', title: 'direct characterization', content: 'when the writer states a character trait outright.' },
    { loId: 'm7ela.characterization', kind: 'definition', title: 'indirect characterization', content: 'when the writer shows a detail and lets the reader work out the trait.' },
    { loId: 'm7ela.characterization', kind: 'definition', title: 'inference', content: `a conclusion you reach by combining a detail in the text with what you already know.` },
    { loId: 'm7ela.characterization', kind: 'definition', title: 'text evidence', content: 'the exact words from the passage that support your conclusion.' },
  ],
  methods: [
    {
      title: 'Worked infer from action',
      steps: [
        `First ask which of the five moves is doing the work here. Nobody describes Maya, and nobody reacts to her. What we get is what she DOES and one thing she SAYS.`,
        `List the actions plainly: she counts, she notices there is one short, she gives hers away, and she tells Devon she has already eaten.`,
        `Now test that last line. If she had really already eaten, she would not have counted the bars so carefully or needed to explain herself. So the claim is almost certainly not true — she said it so that Devon would take the bar without feeling bad.`,
        `Turn the details into a trait word. Giving away your own food is generous. Covering it with a small excuse so the other person is comfortable is thoughtful.`,
        `Say it with the evidence attached: Maya is generous and thoughtful, because she "slid hers across to Devon" and then said she had already eaten so that he would take it easily.`,
        `Notice what a weaker answer would look like: "Maya gave Devon a granola bar." That is true, but it is the event, not the trait. The question asks what she is like.`,
      ],
      example: { problem: `Read this and name one trait, then point at the line that proves it.

"Maya counted the granola bars in her bag. Four, and five people at the table. She slid hers across to Devon and said she had already eaten."`, solution: `Maya is generous and thoughtful. Evidence: she slides her own bar across to Devon, then says she has already eaten so that he will accept it without feeling bad.` },
      relatedLoIds: ['m7ela.characterization'],
    },
    {
      title: 'Worked says versus shows',
      steps: [
        `Two of the five moves collide here. What Theo SAYS is that he does not care. What Theo DOES is check the scoreboard and bounce his knee hard enough to shake a bench.`,
        `Take the words on their own first. "I do not care who wins" is a claim about his own feelings, and characters are allowed to be wrong or dishonest about those.`,
        `Now weigh the actions. Checking the scoreboard AGAIN means he had already checked it. A knee bouncing that hard is a body under stress. Neither of those is what not caring looks like.`,
        `When words and actions disagree, the actions win. Theo cares very much about the score and is trying not to show it.`,
        `WRONG answer to avoid: "Theo is relaxed, because he says he does not care." That takes the stated feeling as the true one and ignores every other detail in the passage. RIGHT answer: Theo is anxious about the game and is hiding it.`,
        `State it with evidence: Theo is nervous and is covering it up, because he "checked the scoreboard again" and his knee "was bouncing so hard the bench shook" right after claiming not to care.`,
      ],
      example: { problem: `What is really going on with Theo? Use the details.

"'I don't care who wins,' Theo said. He checked the scoreboard again. His knee was bouncing so hard the bench shook."`, solution: `Theo is nervous about the game and is hiding it. His words say he does not care, but he checks the scoreboard again and his knee bounces hard enough to shake the bench.` },
      relatedLoIds: ['m7ela.characterization'],
    },
  ],
  pointers: [
    { content: `Students often say "Sam is calm, because he says he is not nervous." — A character can be wrong about themselves, or can be covering something up on purpose. The line about tying the same shoelace four times is sitting right there, and it points the other way. When words and actions disagree, believe the actions: Sam is nervous and is hiding it. Writers build that gap deliberately, so it is usually the most important thing in the passage, not a detail to skip.`, kind: 'common-error' },
    { content: `Students often say "Sam ties his shoes a lot." — The question asks what the detail TELLS you, so the answer has to go one step past the text. Take the detail, add what you already know about people, and land on a trait: someone who reties the same lace four times is nervous. Then attach the line as evidence.`, kind: 'common-error' },
    { content: `A trait says what a character is LIKE. If your answer names something that happened, it is a plot detail, not a trait.`, kind: 'tip' },
    { content: `Direct characterization tells you outright. Indirect characterization shows you and lets you work it out.`, kind: 'tip' },
    { content: `The five indirect moves: what a character says, does, thinks, looks like, and how others react to them.`, kind: 'tip' },
    { content: `When a character's words disagree with their actions, believe the actions. That gap is usually the point of the scene.`, kind: 'tip' },
    { content: `Every trait needs the line that proves it. Say the trait, say "because", then quote the detail.`, kind: 'tip' },
    { content: `A trait is an adjective, not a sentence about what happened. "Maya gave Devon a granola bar" is an event. "Maya is generous" is a trait. Quick check: could your answer fit on a list of *what happened*? Then swap it for the word that detail proves.`, kind: 'common-error' },
    { content: `Don't confuse *direct* and *indirect* characterization. Direct = the writer says the trait word out loud ("Mateo was stubborn"). Indirect = you get a detail and name the trait yourself. If YOU had to supply the adjective, it was indirect.`, kind: 'vocab-note' },
    { content: `A character saying "I'm not nervous" is not proof they're calm — it's just what they claim. When words and actions clash, believe the actions. Sam retying one shoelace four times outweighs anything Sam says about himself.`, kind: 'gotcha' },
    { content: `Repeating the detail is not an answer. "Sam ties his shoes a lot" just copies the text. Go one step further: detail + what you know about people = trait. That step is the *inference*.`, kind: 'common-error' },
    { content: `Write it as trait + "because" + the exact words. If nothing in the passage fits after "because," delete the trait — no matter how likely it feels. "Nadia is smart" fails; "Nadia is careful because she 'read the instructions twice'" works.`, kind: 'tip' },
    { content: `Not every detail proves the trait you were asked about. Ben's early arrival shows he's punctual; the July umbrella shows he's over-prepared. Only the spare pencil "in case someone forgot one" shows he thinks about *other people*. Match the evidence to the exact trait.`, kind: 'edge-case' },
    { content: `Before naming a trait, ask which of the five moves is doing the work: says, does, thinks, looks, or others' reactions. Some passages use only one or two — if nobody describes the character and nobody reacts, don't invent those details.`, kind: 'tip' },
    { content: `The narrator telling you a character's thoughts is still indirect characterization if you have to name the trait yourself. "He wondered if anyone would notice" shows insecurity — the text never uses that word.`, kind: 'edge-case' },
  ],
};
