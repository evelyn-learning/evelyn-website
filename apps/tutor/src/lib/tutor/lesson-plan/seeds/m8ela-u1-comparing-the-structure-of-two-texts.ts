/**
 * Grade 8 ELA — Reading Literature: Evidence, Dialogue & Structure: Comparing
 * the Structure of Two Texts.
 *
 * CONCEPT-LED row in the m8ela fan-out. The student arrives with no procedure
 * to lean on, so the whole lesson builds one way of reading: STRUCTURE is the
 * path a reader takes through a text — the order its pieces arrive in and the
 * shape that holds them — and two texts can share every event, person and
 * ending while sending the reader down different paths. The comparison is
 * done by asking, of each text, what the reader gets first and what is held
 * back, and then saying what that difference does to meaning or to style
 * (CCSS RL.8.5). Two structural pairs carry the file: a chronological
 * paragraph beside one that opens at the ending and looks back, and a
 * paragraph beside a short free-verse stanza on the same subject. Three
 * traps this plan is built to kill: comparing CONTENT (a detail one text has
 * and the other lacks) and calling it structure; treating structure as order
 * only, so that a stanza with the same sequence as a paragraph is called
 * "the same structure with fewer words"; and naming the two structures
 * without saying what the difference changes, which is the half of the
 * standard that does the work.
 *
 * SCOPE GUARD: Grade 8 row 1.4 compares and contrasts the structure of two
 * short original texts on a similar subject (e.g., a chronological prose
 * paragraph vs. one that opens at the end and looks back; a prose paragraph
 * vs. a short free-verse stanza) and explains how the differing structure
 * changes meaning or style. Both texts are 1-3 original sentences or lines
 * embedded in the item. No RL.7.5 row exists in the shipped G7 course
 * (`ELA-FANOUT-CONTRACT.md` table, verified) and G6's
 * `m6ela-u1-how-a-scene-fits-the-whole-story.ts` (RL.6.5) reads one text's
 * structure only, so this is the first two-text structure comparison. Stops
 * short of HS `engl-u8-poetic-form-and-structure.ts` (RL.9-10.5: enjambment,
 * end-stopped lines, sonnet, haiku, fixed forms). DELIBERATELY EXCLUDED: the
 * five plot stages and the turning-point test, which are
 * `m7ela-u1-plot-structure-and-conflict.ts`'s (RL.7.3) and are assumed — no
 * stage name (exposition, rising action, climax, falling action, resolution)
 * appears in this file's body below this comment, and no item asks where a
 * text's turning point is; flashback and foreshadowing as named structural
 * devices, which are HS `engl-u6-plot-and-conflict.ts`'s — neither word
 * appears in the body, and the text that opens at the ending is described in
 * plain words ("opens with how things turned out and then looks back") and
 * named "outcome-first order", never as a device; every poetic-form term the
 * HS row owns — enjambment, end-stopped, sonnet, haiku, fixed form, meter,
 * rhyme scheme — none of which appears in the body, and no item or step in
 * this file asks where a line ends, why it breaks where it does, or what the
 * word at a line's end gains; the literary terms "tone" and "mood", which are
 * `m7ela-u2-tone-mood-and-word-choice.ts`'s — neither word appears in the
 * body, and the lesson says "style", "feel" and "pace" instead; how one
 * scene contributes to a whole story (G6 RL.6.5) — no item here asks what a
 * part does for the rest of its text, only how two whole texts are built;
 * theme (row 2.1) — the word appears nowhere in any spoken field of the
 * body, only inside the `followUps` loId the contract requires; the reader-versus-character
 * knowledge gap as a named device (row 2.2) — the word "irony" is not in the
 * body; and how an incident provokes a decision (row 1.3) and what a line of
 * dialogue does to the plot (row 1.2) — no item asks either question.
 * DELIBERATELY ALLOWED, because the HS poetry row and row 2.2 sit close:
 * (a) the words "stanza", "line" and "free verse" are used and "stanza" and
 * "free verse" are defined once, at the level of "a group of lines in a
 * poem" and "poetry with no set rhyme pattern or beat", because the row's
 * own scope names a free-verse stanza as one of the two structures — the
 * file goes exactly as far as saying that each line holds one picture and
 * stops and that the linking words are dropped, which is what a
 * thirteen-year-old needs to see the SHAPE differ, and no further; (b) the
 * concept, the first worked example and the first and third items say
 * that outcome-first order lets the reader know the
 * ending before the character reaches it, because that is the mechanism by
 * which order changes meaning — the file never names that gap as a device
 * and never asks what it will cost the character, which is row 2.2's whole
 * subject; (c) the words "surprise", "relief" and "regret" name what a
 * reader feels at a given point, never a device; (d) the lesson says a
 * stanza "slows the reader down" because each line stands alone — that is
 * one observation about the effect of shape, not a lesson on pacing, which
 * belongs to `m7ela-u9-narrative-technique.ts` as a writing technique and to
 * the HS row as line-level analysis; and (e) the word "chronological" is
 * used throughout as the ordinary name for events-in-the-order-they-happened,
 * which the G7 plot row's stage vocabulary never covers.
 *
 * NOTE FOR FUTURE AUTHORS: every text in this file — every paragraph and
 * every stanza — is original prose or verse written for the item. This
 * course carries no passage machinery — no passageId, no shared texts — so
 * each question must be solvable from the sentences and lines printed
 * inside it, and no published work may be quoted or closely paraphrased.
 * Every phrase this file quotes from one of its own texts appears character-
 * for-character in that text, including the stanza lines; quote your own
 * excerpt exactly, never from memory. Because this row's skill is a
 * comparison, every item prints BOTH texts, labeled TEXT A and TEXT B,
 * inside its own strings — never compare a printed text against a
 * remembered one.
 *
 * CLAIM LEDGER: none required. Every text in this file is invented narrative
 * fiction or verse about invented people, which is true by construction, so
 * there is no factual claim to verify. Rows whose passages are INFORMATIONAL
 * (all of Units 3 and 4, and any other row needing nonfiction) must carry
 * the four-column claim ledger described in the fan-out contract instead of
 * this line.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M8ELA_U1_COMPARING_THE_STRUCTURE_OF_TWO_TEXTS: LessonPlan = {
  id: 'evelyn.ms.m8ela.comparing-the-structure-of-two-texts.v1',
  title: 'Comparing the Structure of Two Texts',
  curriculum: 'MS',
  grade: '8',
  subject: 'ela',
  topic: 'grade-8-ela',
  locale: 'en',
  los: [
    {
      id: 'm8ela.comparing-the-structure-of-two-texts',
      standard: 'M8ELA-1.4',
      description:
        'Compare and contrast the structure of two short texts on a similar subject (e.g., a chronological prose paragraph vs. one that opens at the end and looks back; a prose paragraph vs. a short free-verse stanza) and explain how the differing structure changes meaning or style (CCSS RL.8.5).',
    },
  ],
  prerequisites: ['m8ela.how-an-incident-provokes-a-decision'],
  followUps: ['m8ela.how-a-theme-develops-through-character-and-setting'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the student notice that the same events told in a different order, or in a different shape, are read differently, and that the difference has a name worth learning.',
      script:
        'Two people from your grade tell the same story in the group chat. The first one types it in order: we got to the theater, the ticket machine ate Dev\'s card, we ended up in the wrong screening, an usher with a flashlight found us in row three. The second one opens with "WE GOT WALKED OUT OF A MOVIE BY A GUY WITH A FLASHLIGHT" and only then goes back to the ticket machine. Same afternoon, same four people, same usher. But you read them differently. The first one you read waiting to find out how it ends. The second one you read already knowing, watching every earlier step for the moment it went wrong. Then a third person posts three short lines, one under the other, with no "and" or "because" anywhere: "Row three. A flashlight. Dev\'s card, still in the machine." Nothing is explained, and somehow it is the one everybody reacts to. Structure is the word for what those three messages did differently: the order the pieces arrive in, and the shape that holds them. Today you compare the structures of two texts on the same subject and say, precisely, what the difference does to what they mean and how they feel.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-structure-as-the-readers-path',
      kind: 'concept',
      goal: 'Define structure as the reader\'s path rather than the events, install the what-comes-first test for finding a structure, show how order and shape each change meaning and style, and separate a structural difference from a difference in content.',
      keyIdeas: [
        'STRUCTURE IS THE PATH THE READER TAKES, NOT THE EVENTS ON IT. Two texts can hold the same events, the same people and the same ending and still be built differently. Structure is the order the pieces arrive in and the shape that holds them: a paragraph that runs straight through, a paragraph that opens at the ending and looks back, a stanza that sets each picture on its own line. When you compare two structures you are comparing paths, not contents. "Text B mentions the coach and Text A does not" is a difference in content. "Text B tells you the result before it tells you the tryout" is a difference in structure.',
        'FIND A TEXT\'S STRUCTURE BY ASKING WHAT THE READER GETS FIRST AND WHAT IS HELD BACK. A CHRONOLOGICAL text gives events in the order they happened, so the reader finds out how things turn out at the same moment the character does. An OUTCOME-FIRST text opens with how things turned out and then looks back at how they got there, so the reader carries the ending into every earlier sentence. Run the question on both texts before you compare them: what do I know after the first sentence, and what am I still waiting for?',
        'THE SAME SENTENCE READS DIFFERENTLY DEPENDING ON WHAT THE READER ALREADY KNOWS. That is the mechanism, and it is worth saying slowly. In a chronological text, a boy checking his project folder twice reads as care, and the reader hopes with him. In an outcome-first text that has already shown the empty file, the same checking reads as effort that was never going to be enough. The sentence did not change. The reader\'s knowledge did, and the structure is what changed the knowledge. So chronological order tends to build toward a result and let it land as a surprise or a relief, while outcome-first order takes the surprise away and puts something else in its place, often regret, often a sense that the ending was coming all along.',
        'A PARAGRAPH CONNECTS; A STANZA SEPARATES. Prose runs its details together with linking words such as "and", "so", "while" and "because", and it usually tells the reader why. A short free-verse stanza takes the same subject and breaks it into lines, drops most of the linking words, and lets each line hold one picture and stop. The order of the pictures may be identical to the paragraph\'s, and the structure is still different, because the shape is different. That shape does two things: it slows the reader down, since each line asks to be taken on its own, and it hands the connecting work to the reader, who has to supply the "so" and the "because" that the poem left out.',
        'A COMPARISON NAMES THE DIFFERENCE; AN EXPLANATION NAMES WHAT THE DIFFERENCE DOES. It is not enough to say that Text A is chronological and Text B opens at the ending, or that Text A is a paragraph and Text B is a stanza. The question is what the differing structure changes, and there are two things it can change. MEANING: what the events add up to, which is why the same walk home can mean defeat in one text and patience in the other. STYLE: how the text feels and moves, which is why the same bus stop can feel easygoing in a sentence full of "because" and spare and slow in four short lines. Say the difference, then say the change, and tie the change to something the reader knows or does at a specific point in the text.',
        'THE TRAP IS COMPARING WORDS INSTEAD OF STRUCTURE. When two texts share their events, the eye goes to the details one has and the other lacks, or to which one has the better words. Those are real differences, and they are not structural. Test any difference you find with one question: is this about the ORDER the pieces arrive in or the SHAPE that holds them? If the answer is no, set it aside. If the answer is yes, you have found structure, and the next job is to say what it does.',
      ],
      vocabulary: [
        { term: 'structure', definition: 'the order in which a text\'s pieces arrive and the shape that holds them; the path the reader takes through the events, as distinct from the events themselves.' },
        { term: 'chronological order', definition: 'a structure that gives events in the order they happened, so the reader learns the outcome at the same moment the character does.' },
        { term: 'outcome-first order', definition: 'a structure that opens with how things turned out and then looks back at how they got there, so the reader carries the ending into every earlier sentence.' },
        { term: 'stanza', definition: 'a group of lines in a poem, set off by space from the lines around it; the unit of shape in a poem, the way the paragraph is in prose.' },
        { term: 'free verse', definition: 'poetry that does not follow a set rhyme pattern or beat; its shape comes from its lines and its stanzas.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-same-events-two-orders',
      kind: 'worked_example',
      problem:
        'Both texts tell the same events. Name each text\'s structure, then explain how the difference changes the meaning of the rehearsing.\n\nTEXT A: "Nadia ran her lines on the bus, again in the hallway, and one last time in the wings. The lights came up, she stepped into them, and the first word came out clean. The second word did not come at all."\n\nTEXT B: "For three long seconds on opening night, Nadia stood in the light and said nothing. She had run her lines on the bus, again in the hallway, and one last time in the wings. None of it had mattered."',
      steps: [
        'Check the contents first, so you know the difference is not there. Both texts have the rehearsing on the bus, in the hallway and in the wings, and both have Nadia standing in the light unable to speak. Same events, same person, same ending. Whatever reads differently between them is being done by the structure.',
        'Find Text A\'s structure by asking what the reader gets first. Rehearsing, then lights, then "the first word came out clean" and then "The second word did not come at all." The events arrive in the order they happened, so this is chronological. The reader reaches the blank at the same instant Nadia does, and nothing before it warned you; the rehearsing reads as hope right up to the last sentence.',
        'Find Text B\'s structure the same way. The first thing the reader gets is the ending: Nadia "stood in the light and said nothing." Only then does the text look back to the bus, the hallway and the wings. This is outcome-first order. The reader carries the blank into the rehearsing.',
        'Now explain what that does to the meaning of the rehearsing, because that is the question. In Text A the bus, the hallway and the wings are preparation, and the reader hopes it will be enough. In Text B the reader already knows it was not, so the very same three places read as wasted effort. The last sentence says out loud what the structure had already made the reader feel: "None of it had mattered."',
        'Say something about style too, since the order changes how the text moves. Text A moves forward quickly and drops off a cliff on its last sentence. Text B opens standing still for "three long seconds" and then looks back slowly, closer to regret than to shock.',
        'Put the whole answer together: the difference, then the change, tied to a specific point. Text A is chronological and Text B opens at the ending; because Text B\'s reader already knows Nadia will freeze, the rehearsing that means hope in Text A means wasted effort in Text B, and the shock of Text A\'s last sentence becomes the regret of Text B\'s.',
      ],
      answer:
        'Text A is chronological: rehearsing, then the lights, then the blank, so the reader hopes with Nadia and is caught by "The second word did not come at all." Text B is outcome-first: it opens on Nadia standing "in the light" saying nothing and then looks back, so the same rehearsing reads as effort the reader already knows was wasted, and the shock of Text A becomes the regret of Text B.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-paragraph-vs-stanza',
      kind: 'worked_example',
      problem:
        'Both texts describe the same afternoon. Compare their structures and explain what the difference does to the style and the meaning.\n\nTEXT A (a paragraph): "On the last day of the season the pool closed at four, and while the lifeguard stacked the chairs, a few of us stood dripping by the fence, because nobody wanted to be the first one to leave."\n\nTEXT B (a stanza):\n"Four o\'clock, the last day.\nThe chairs stacked, the water going still.\nNobody wanted to be the first to leave."',
      steps: [
        'Check the contents. Both have the last day, four o\'clock, the chairs being stacked and nobody wanting to leave first. The order of those pieces is the same in both texts, too: the time, the chairs, the not-leaving. So this time the difference is not the order. It is the shape.',
        'Look at what the paragraph does with the connections. It is a single sentence, and it holds together with linking words: "and while the lifeguard stacked the chairs," and "because nobody wanted to be the first one to leave." Every detail is tied to the next, and the reader is told why the group is standing there. The paragraph carries you straight through and hands you the reason.',
        'Look at what the stanza does with the same connections. There are none. "Four o\'clock, the last day." stops. "The chairs stacked, the water going still." stops. There is no "and", no "while", no "because". Each line holds one picture and then ends, and the reason for standing there is never given; the last line simply states that "Nobody wanted to be the first to leave."',
        'Now the style. The paragraph is easygoing and explanatory; it sounds like someone telling you about their day. The stanza is spare and slow, because a line that stands alone asks to be taken on its own, and the reader supplies the "because" that the poem left out. Same afternoon, different pace, different feel.',
        'Now the meaning. The paragraph is about what happened on the last day. The stanza ends on the not-leaving, alone on its own line, with nothing after it to soften it, so that is what the reader carries away: the stanza is about not wanting to leave. The order did not change; the shape moved the weight.',
        'Put it together. Text A is a paragraph that connects and explains; Text B is a stanza that separates and withholds. The structural difference makes Text B slower and sparer in style, and it shifts the meaning from an account of an afternoon to the feeling of its last minute.',
      ],
      answer:
        'Text A is a single paragraph that links every detail with "and", "while" and "because" and tells the reader why the group stayed; Text B is a stanza that sets each picture on its own line with no linking words and no reason given. The stanza is slower and sparer in style, and because it ends on the line about not leaving, its meaning shifts from what happened that afternoon to the feeling of not wanting it to end.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-outcome-first-changes-the-checking',
      kind: 'try_yourself',
      problem:
        'Both texts tell the same events. Choose the statement that best explains how Text B\'s structure changes the effect.\n\nTEXT A: "Marcus checked the shared project folder twice on Sunday night and counted all twelve slides. On Monday morning he opened the file in front of the whole class. The screen showed the title slide and nothing else."\n\nTEXT B: "On Monday morning, in front of the whole class, Marcus opened a file that held the title slide and nothing else. The night before, he had checked the shared folder twice and counted all twelve slides. Twice."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The two texts have the same structure, because they hold the same events, the same folder, the same twelve slides and the same empty file, so whatever difference in feeling there is between them comes from word choice alone.' },
        { id: 'b', text: 'Text B opens with the outcome, so the reader already knows the slides are gone while reading about Sunday night, and the checking that read as reassurance in Text A now reads as effort that was never going to be enough.', correct: true },
        { id: 'c', text: 'Text B is the chronological telling and Text A is the one that opens at the ending, so Text A is where the reader knows about the empty file before reading about the checking on Sunday night.' },
        { id: 'd', text: 'Text B opens with the outcome so that the empty file lands as a surprise, since a reader who is handed the result first is caught off guard in the same instant Marcus is when the file opens on Monday morning.' },
      ],
      expectedAnswer: 'Text B opens with the outcome, so the reader already knows the slides are gone while reading about Sunday night, and the checking that read as reassurance in Text A now reads as effort that was never going to be enough.',
      hints: [
        'Ask what the reader gets first in each text and what is held back until the end. Only after you have that for both texts should you ask what the order does to the sentences about Sunday night.',
        'Text A ends on the empty file; Text B begins on it. Decide which order lets the reader be caught off guard, and which order makes the reader read the checking already knowing how it turns out. Then ask what that knowledge does to the last word of Text B, "Twice."',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-paragraph-vs-stanza-bus-stop',
      kind: 'try_yourself',
      problem:
        'Both texts describe the same morning. Choose the statement that correctly compares the two structures and explains what the difference does.\n\nTEXT A (a paragraph): "The first cold morning of the year caught everyone at the bus stop in T-shirts, so we stood in a tight bunch with our hands in our sleeves and laughed at each other, because it was easier than admitting we had all checked the weather and ignored it."\n\nTEXT B (a stanza):\n"First cold morning.\nEight of us in T-shirts at the stop,\nhands pulled up inside our sleeves,\nlaughing."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The stanza counts eight people and the paragraph gives no number, and that added count is the real difference between them, since the two texts otherwise carry the reader from the cold morning to the T-shirts to the laughing in the same order and in the same way.' },
        { id: 'b', text: 'The stanza is the paragraph with its connecting words cut out, the same details in the same order minus the "so" and the "because", so its structure is the same and it is only shorter, which makes it quicker to read and lighter in feeling than the long single sentence of the paragraph.' },
        { id: 'c', text: 'The paragraph links each detail to the next with "so" and "because" and hands the reader the reason for the laughing, while the stanza sets each picture on its own line with no reason given, so the reader slows down and has to work out why eight people in T-shirts are laughing.', correct: true },
        { id: 'd', text: 'The paragraph makes the reader slow down because its one long sentence is hard to follow, while the short lines of the stanza move quickly, each one stating a plain fact, and explain the laughing more directly than the paragraph manages to.' },
      ],
      expectedAnswer: 'The paragraph links each detail to the next with "so" and "because" and hands the reader the reason for the laughing, while the stanza sets each picture on its own line with no reason given, so the reader slows down and has to work out why eight people in T-shirts are laughing.',
      hints: [
        'Structure includes the shape that holds the words, not only the order they come in. Look at what each text does with the connections between its details, and at what each one does with the reason for the laughing.',
        'Find the reason for the laughing in the paragraph; it comes right after "because". Now look for that reason in the stanza. What the stanza does instead of stating it is the structural difference, and what that does to the reader is the effect you are asked to name.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-outcome-first-good-news',
      kind: 'try_yourself',
      problem:
        'Both texts tell the same events. Choose the statement that correctly compares their structures and explains how the change in order changes the meaning of the walk home.\n\nTEXT A: "Jonah\'s name was not on the first list the coach posted, or on the second. He walked home the long way and did not check his phone. On Friday a third list went up, with two names added at the bottom, and one of them was his."\n\nTEXT B: "On Friday a third list went up, with two names added at the bottom, and one of them was Jonah\'s. His name had not been on the first list, or on the second. He had walked home the long way and had not checked his phone."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Text A and Text B share the same structure, since each begins with a posted list and ends with a posted list, so the difference between them is only which of the three lists the writer chose to describe in the most detail.' },
        { id: 'b', text: 'Text B is the chronological telling, because it starts on Friday and Friday is the last day named, while Text A is the one that opens at the ending, because it starts with the first list the coach posted.' },
        { id: 'c', text: 'Text B opens with the outcome, so the reader feels the shock of Jonah making the team more sharply than in Text A, where the good news is held until the end and arrives too late to surprise anyone.' },
        { id: 'd', text: 'Text A holds the third list back until the end, so the long walk home reads as the misery of a boy who has been cut, while Text B gives the third list first, so the same walk reads as a wait the reader already knows will end well.', correct: true },
      ],
      expectedAnswer: 'Text A holds the third list back until the end, so the long walk home reads as the misery of a boy who has been cut, while Text B gives the third list first, so the same walk reads as a wait the reader already knows will end well.',
      hints: [
        'Both texts contain a walk home and three lists. Find where the third list sits in each text, then ask what the reader knows about Jonah during the walk home in each one.',
        'In one text the reader takes the walk home not knowing whether a third list is coming; in the other the reader takes it knowing his name is on it. Same sentence, different knowledge. Choose the statement that says which text is which and what that knowledge does to the walk.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-order-only-and-no-structure',
      kind: 'misconception_check',
      question:
        'Two students compare these texts. TEXT A: "The rain started in the second inning, and by the fourth the field was a pond, so the umpire called the game." TEXT B: "Second inning, rain. / Fourth inning, a pond where the infield was. / The umpire\'s arm went up." One student writes, "Same structure. Both go second inning, then fourth, then the umpire, so the only difference is that Text B has fewer words." The other writes, "Text B has no structure at all. It is three pieces with the connections missing, so the umpire\'s decision has no cause in Text B and the meaning Text A had is gone." What went wrong each time?',
      commonErrors: [
        {
          answer: 'Same structure. Both go second inning, then fourth, then the umpire, so the only difference is that Text B has fewer words.',
          misconception:
            'Treating structure as order only. The student checked the sequence of events, found it identical, and concluded the structures matched, which ignores the second half of what structure is: the shape that holds the pieces.',
          correctsTo:
            'The order is the same in both texts, and the structures are still different, because a paragraph and a stanza are different shapes. Text A ties its three pieces together with "and" and "so" and moves the reader straight through to the decision. Text B puts each piece on its own line and stops after each one, with no linking word anywhere. That changes the reader\'s path even though it does not change the sequence: the reader slows down at every line and does the connecting that Text A did for them. Fewer words is the least of it. The shape is part of the structure, and the shape changed.',
        },
        {
          answer: 'Text B has no structure at all. It is three pieces with the connections missing, so the umpire\'s decision has no cause in Text B and the meaning Text A had is gone.',
          misconception:
            'Reading the missing linking words as a missing structure and a lost meaning. The student is right that the stanza dropped the "so", and wrong about what that does: a structure that withholds the connection is still a structure, and the cause is still on the page.',
          correctsTo:
            'Dropping the "so" is the stanza\'s structural choice, not the absence of one. The cause of the decision is still there, carried by the order of the lines: rain, then a pond, then "The umpire\'s arm went up." What Text B has done is hand the reader the job of supplying the "so", and that is exactly the change in style and meaning you are asked to name. Text A explains the decision; Text B makes you watch it happen one line at a time and work out for yourself why the arm went up. The meaning has not gone anywhere. It has moved from the page to the reader.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Structure is the path the reader takes through a text: the order the pieces arrive in and the shape that holds them. It is not the events, the people or the ending, which two differently built texts can share completely.',
        'Find a structure by asking what the reader gets first and what is held back. Chronological order gives events as they happened; outcome-first order gives the ending and then looks back.',
        'The same sentence reads differently depending on what the reader already knows. Chronological order lets a result land as a surprise or a relief; outcome-first order takes the surprise away and turns earlier details into signs of what was coming.',
        'A paragraph connects with "and", "so" and "because" and tells you why; a stanza sets each picture on its own line, drops the links, and makes the reader slow down and supply the why. Same order, different shape, still a different structure.',
        'A comparison names the difference; an explanation names what the difference changes, in meaning (what the events add up to) or in style (how the text feels and moves). Tie the change to a specific point where the reader knows or does something different.',
        'A detail one text has and the other lacks, or better words in one than in the other, is a difference in content or word choice, not in structure. Ask whether a difference is about order or about shape before you call it structural.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '1', cedTopic: '1.4', cedTitle: 'Comparing the Structure of Two Texts' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
