/**
 * Grade 8 ELA — Reading Informational Texts: Central Idea, Connections &
 * Paragraph Structure: How a Central Idea Develops.
 *
 * CONCEPT-LED row for the m8ela fan-out. The student arrives able to find a
 * central idea and state it as a sentence, and with the flat word "supports"
 * for everything else in the paragraph. This lesson replaces that flat word
 * with a way of reading: the sentence that first states the central idea is
 * only its FIRST VERSION, every later sentence has a nameable RELATIONSHIP
 * to it — an EXAMPLE of it, a LIMIT on it, or a CAUSE behind it — and each
 * relationship does something different to the idea, extending it or
 * refining it, so that the idea the reader holds at the last sentence is
 * more exact than the one introduced at the first (CCSS RI.8.2). Four traps
 * this plan is built to kill: labeling every later sentence "a supporting
 * detail" and never asking how it supports; reading a limit as a
 * contradiction, so that a paragraph with one developing idea looks like a
 * paragraph with two; calling a cause an example because both describe
 * something happening; and sorting sentences by the words they contain
 * ("because" means cause, a number means example) instead of by what they
 * do to the idea.
 *
 * SCOPE GUARD: Grade 8 row 3.1 traces how a central idea is introduced, then
 * refined or extended, across the sentences of a short original
 * informational excerpt, and explains how each supporting idea relates to it
 * (an example of it, a limit on it, a cause behind it) — development and
 * relationship, the phrases RI.8.2 adds to RI.7.2. Builds on
 * `m7ela-u3-central-idea-and-supporting-details.ts` (RI.7.2: state the
 * central idea as a full sentence; identify the facts that support it). G8
 * does NOT re-teach identifying a central idea or writing an objective
 * summary (`m7ela-u3-summarizing-informational-text.ts`, RI.7.2). Stops short
 * of HS `engl-u7-central-idea-and-details.ts` (RI.9-10.2, paired with
 * RI.9-10.1 inference at HS register). DELIBERATELY EXCLUDED: finding the
 * central idea — every item and both worked examples tell the student which
 * sentence introduces it, and no item asks the student to locate it (the one
 * item that asks the student to choose a statement of the idea, the third
 * try_yourself, asks for the DEVELOPED version with the introducing sentence
 * already named, which is the skill this row owns); the objective summary of
 * nonfiction — the word "summary" does not appear in this file below this
 * comment, and no step asks the student to shorten or restate a whole
 * paragraph; how a text connects or distinguishes two ideas through a
 * comparison, an analogy or a category (row 3.2) — no excerpt in this file
 * is read as a comparison between two ideas, and the honey excerpt's passing
 * mention of "other foods" is read only as part of the cause; word choice
 * and tone in nonfiction (row 3.3), neither of which is named in the body;
 * the structural jobs of a sentence in a paragraph — stating the key
 * concept, defining a term, bridging to the next idea (row 3.4), none of
 * which is named as a job in the body; and any inference that needs
 * background knowledge the excerpt does not print (HS) — every relationship
 * named in this file is decided from the printed words of its own excerpt.
 * DELIBERATELY ALLOWED, because the G7 row and rows 3.2 and 3.4 sit close:
 * (a) the hook and one keyIdea say, in a single sentence each, that the
 * student already knows how to find a central idea and put it in a sentence,
 * and one keyIdea says the student already knows to ask whether a detail
 * backs the idea up — reminders, not re-teachings, and no keyIdea walks the
 * G7 whole-text test or its first-sentence trap; (b) "example" and "limit"
 * are also two of the sentence jobs row 3.4 names, and they are unavoidable
 * here because they are two of the three relationships this row's own scope
 * line lists — this file uses them only as RELATIONSHIPS to the central
 * idea, always paired with what the sentence does to the idea (extends it,
 * refines it), and never asks what job a sentence does for the paragraph's
 * architecture; (c) the bridge excerpt in the first worked example names the
 * gaps ("they are called expansion joints") so that the example sentence is
 * recognizable, and the step reads that sentence as an example only, never
 * as a definition; (d) one keyIdea and one recap line say that a sentence
 * whose restatement turns into a different idea "is not developing this
 * idea" — that is the boundary of the skill, stated once, not a lesson on
 * off-topic sentences.
 *
 * NOTE FOR FUTURE AUTHORS: every excerpt in this file is original
 * informational prose written for the item. This course carries no passage
 * machinery — no passageId, no shared texts — so each question must be
 * solvable from the sentences printed inside it, and no published work may
 * be quoted or closely paraphrased. Every phrase this file quotes from one
 * of its excerpts appears character-for-character in that excerpt; quote
 * your own excerpt exactly, never from memory. The excerpts carry NO
 * invented statistics: every quantity is a qualitative one ("slightly",
 * "very few", "for years"), and every factual claim is ledgered below.
 *
 * CLAIM LEDGER (informational passages):
 *   Claim                                    | Where              | Kind       | Grounds
 *   A team captain's chat says the league    | hook               | STIPULATED | Invented team and
 *   will not allow a player on the field     |                    |            | league; consistent
 *   without a medical form                   |                    |            | within the hook.
 *   Cats see well in dim light               | concept keyIdeas   | REAL-WORLD | Long-settled; feline
 *                                            | 3-6, vocabulary    |            | night vision.
 *   A cat cannot see in a room with no       | concept keyIdea 4, | REAL-WORLD | Vision needs some light;
 *   light at all                             | keyIdea 6          |            | no animal sees in total
 *                                            |                    |            | darkness. Settled.
 *   A mirror-like layer at the back of a     | concept keyIdeas   | REAL-WORLD | Tapetum lucidum,
 *   cat's eye bounces light back through     | 5-6                |            | reflective layer behind
 *   the eye a second time                    |                    |            | the retina; settled.
 *   Bridges are built with gaps in their     | worked-1 passage   | REAL-WORLD | Expansion joints in
 *   decks on purpose                         |                    |            | bridge decks; settled
 *                                            |                    |            | engineering practice.
 *   Steel and concrete get slightly longer   | worked-1 passage,  | REAL-WORLD | Thermal expansion of
 *   as they warm and shorter as they cool    | steps, answer      |            | solids; long-settled.
 *   A deck locked tight at both ends would   | worked-1 passage   | REAL-WORLD | Restrained thermal
 *   strain against its supports on a hot     |                    |            | expansion produces
 *   afternoon                                |                    |            | stress; settled.
 *   The ridged metal strips a car bumps      | worked-1 passage,  | REAL-WORLD | Highway bridge
 *   over near each end of a highway bridge   | steps              |            | expansion joints sit
 *   cover the gaps and are called            |                    |            | at the abutments and
 *   expansion joints                         |                    |            | are toothed or
 *                                            |                    |            | ridged; settled.
 *   A short footbridge can often be built    | worked-1 passage,  | REAL-WORLD | Length change is
 *   without any such joint, because a short  | steps, answer      |            | proportional to
 *   deck changes length by so little that    |                    |            | length; jointless and
 *   its supports can absorb the movement     |                    |            | integral construction
 *                                            |                    |            | is standard for short
 *                                            |                    |            | spans. Hedged "often".
 *   Honey is one of the very few foods that  | worked-2 passage,  | REAL-WORLD | Long-settled; honey's
 *   does not spoil                           | steps, answer      |            | low water activity and
 *                                            |                    |            | acidity.
 *   Honey holds so little water, and is so   | worked-2 passage,  | REAL-WORLD | Low water content and
 *   acidic, that molds and bacteria cannot   | steps, answer      |            | low pH; settled food
 *   grow in it                               |                    |            | science.
 *   Old honey may turn cloudy and grainy     | worked-2 passage,  | REAL-WORLD | Crystallization of
 *   but is still safe to eat                 | steps              |            | honey is harmless;
 *                                            |                    |            | settled.
 *   Once water gets into honey, from a wet   | worked-2 passage,  | REAL-WORLD | Honey absorbs moisture
 *   spoon or a lid left open in a damp       | steps, answer      |            | from air; above a
 *   kitchen, it can begin to ferment         |                    |            | modest water content
 *                                            |                    |            | yeasts ferment it.
 *                                            |                    |            | Settled.
 *   Most trees growing where the seasons     | try-1 passage,     | REAL-WORLD | Annual growth rings in
 *   change add one new ring of wood every    | choices, hints     |            | temperate trees;
 *   year                                     |                    |            | settled. Hedged "most".
 *   Spring growth lays down a wide pale      | try-1 passage      | REAL-WORLD | Earlywood (pale, wide)
 *   band; late-summer growth is narrower     |                    |            | and latewood (dark,
 *   and darker                               |                    |            | dense); settled.
 *   Counting the dark bands across a stump   | try-1 passage,     | REAL-WORLD | Ring counting for tree
 *   tells how old the tree was when cut      | choices            |            | age; settled.
 *   Trees where it is warm and wet all year  | try-1 passage      | REAL-WORLD | Tropical trees often
 *   often add no clear rings, because        |                    |            | lack distinct rings
 *   growth never slows enough to leave a     |                    |            | because growth is
 *   dark band                                |                    |            | continuous; hedged
 *                                            |                    |            | "often". Settled.
 *   Salt spread on an icy road melts the     | try-2 passage,     | REAL-WORLD | Freezing-point
 *   ice even when the air is below freezing  | choices            |            | depression; settled.
 *   Salt dissolves into the thin film of     | try-2 passage,     | REAL-WORLD | Standard mechanism of
 *   water on the ice and lowers the          | choice a           |            | road salt; settled.
 *   temperature at which it can freeze       |                    |            |
 *   In very cold air, well below the usual   | try-2 passage,     | REAL-WORLD | Salt brine itself
 *   freezing mark, salt water freezes too    | choice b, hint 2   |            | freezes at very low
 *   and salt stops helping                   |                    |            | temperatures; road
 *                                            |                    |            | salt is ineffective in
 *                                            |                    |            | deep cold. Settled.
 *   A plow truck in bitter cold may spread   | try-2 passage      | REAL-WORLD | Sand/grit for traction
 *   sand, which gives grip without melting   |                    |            | in deep cold; standard
 *                                            |                    |            | practice.
 *   A truck spreads salt before the buses    | try-2 passage,     | STIPULATED | Invented scene; the
 *   run and the ice on the main roads turns  | choice c           |            | slush outcome follows
 *   to slush by the time they roll out       |                    |            | the real mechanism
 *                                            |                    |            | above. Consistent.
 *   Salt is also spread before a storm so    | try-2 passage,     | REAL-WORLD | Anti-icing before
 *   that falling snow melts as it lands      | choice d           |            | storms is standard
 *   instead of packing into ice              |                    |            | road practice.
 *   A popcorn kernel pops because of the     | try-3 passage,     | REAL-WORLD | Settled: moisture in
 *   water sealed inside it: heat turns the   | choices, hints     |            | the kernel becomes
 *   moisture to steam, pressure bursts the   |                    |            | steam, the hull
 *   hard shell, and the starch puffs out     |                    |            | ruptures, starch
 *                                            |                    |            | expands.
 *   Kernels left unpopped are usually the    | try-3 passage,     | REAL-WORLD | Unpopped kernels are
 *   ones that had dried out or had a         | choices            |            | typically low-moisture
 *   cracked shell, so the steam leaked away  |                    |            | or have a damaged
 *                                            |                    |            | hull; settled. Hedged
 *                                            |                    |            | "usually".
 *   Popcorn left in an open bag for months   | try-3 passage,     | REAL-WORLD | Kernels lose moisture
 *   pops poorly because the kernels have     | choices            |            | to dry air and pop
 *   lost their moisture                      |                    |            | poorly; settled.
 *   A sled dog stays warm sleeping outside   | misconception      | REAL-WORLD | Double-coated northern
 *   in the snow because a dense underlayer   | question and       |            | breeds; underfur traps
 *   of fur traps warm air against the skin   | corrections        |            | insulating air.
 *                                            |                    |            | Settled.
 *   A husky curled on a frozen lake with its | misconception      | REAL-WORLD | Documented sled-dog
 *   tail over its nose will sleep through a  | question and       |            | behavior; the snow
 *   night of falling snow                    | corrections        |            | itself insulates.
 *                                            |                    |            | Settled.
 *
 * NOTE ON prerequisites/followUps: the chain for this row is 2.4 -> 3.1 ->
 * 3.2. Both arrays carry the real neighboring loIds from the fan-out
 * contract's chain table; they are wired at the batched registration.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M8ELA_U3_HOW_A_CENTRAL_IDEA_DEVELOPS: LessonPlan = {
  id: 'evelyn.ms.m8ela.how-a-central-idea-develops.v1',
  title: 'How a Central Idea Develops',
  curriculum: 'MS',
  grade: '8',
  subject: 'ela',
  topic: 'grade-8-ela',
  locale: 'en',
  los: [
    {
      id: 'm8ela.how-a-central-idea-develops',
      standard: 'M8ELA-3.1',
      description:
        'Trace how a central idea is introduced, then refined or extended, across the sentences of a short informational excerpt, and explain how each supporting idea relates to it (an example of it, a limit on it, a cause behind it) -- development and relationship (CCSS RI.8.2).',
    },
  ],
  prerequisites: ['m8ela.modern-stories-and-traditional-patterns'],
  followUps: ['m8ela.connections-and-distinctions-among-ideas'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the student feel that an idea stated once and then limited, explained and shown at work ends up a different, more exact idea, and that stopping at the first version gets it wrong.',
      script:
        'Your team\'s group chat lights up at nine at night. First message, from the captain: "Practice is canceled tomorrow." Half the team reacts with a thumbs-up and puts the phone down. Second message: "Only for anyone who hasn\'t turned in the medical form." Third: "Coach says the league won\'t let anyone on the field without it." Fourth: "So Dev and Priya, that means you." Anyone who stopped reading after the first message now has the idea exactly wrong, and nothing in the later messages took the first one back. Each one changed it. The second drew a line around who it applied to, the third gave the reason behind it, and the fourth showed it landing on two real people. A nonfiction writer does the same thing on purpose. The central idea is stated once, and then it is limited, explained and shown at work until, by the last sentence, it is a more exact idea than the one you started with. You already know how to find a central idea and put it in a sentence. Today you learn to watch it grow.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-development-and-relationship',
      kind: 'concept',
      goal: 'Install the idea that the introducing sentence is only a first version, name the three relationships a supporting sentence can have to it, say what each does to the idea, and give the restate test that tracks the development.',
      keyIdeas: [
        'A CENTRAL IDEA IS INTRODUCED, NOT DELIVERED FINISHED. You already know how to find the central idea and state it as a full sentence. The sentence that first states it is only the first version. A writer then spends the rest of the paragraph working on that version, making it more exact or pushing it further, so the idea you hold at the last sentence is not quite the idea you were handed at the first. Reading for development means finding the sentence that introduces the idea, then watching what every later sentence does to it.',
        'EVERY SUPPORTING SENTENCE HAS A RELATIONSHIP TO THE IDEA, NOT JUST A PLACE UNDER IT. You already know to ask whether a detail backs the idea up. The question now is HOW. Three relationships cover almost every sentence you will meet: a sentence can give an EXAMPLE of the idea, put a LIMIT on the idea, or give a CAUSE behind the idea. Name the relationship and you can say exactly what the sentence did to the idea, which is the thing the flat word "supports" hides.',
        'AN EXAMPLE EXTENDS THE IDEA BY SHOWING IT AT WORK IN ONE CASE. "Cats see well in dim light. A cat crossing a yard at dusk picks its way around a garden hose you can barely make out." The second sentence does not change what the idea says; it lets you see the idea reaching one real place. That is what extending means: the idea now covers a case it had only claimed before. Test: could you delete the sentence and still state the idea in the same words? If yes, and the sentence showed you the idea happening, it is an example.',
        'A LIMIT REFINES THE IDEA BY DRAWING ITS EDGE. "Cats see well in dim light, but in a room with no light at all a cat is as blind as you are." Watch for the edge words: but, only, unless, except, not every, as long as. After a limit, the idea is smaller and truer than the version that introduced it. A limit is not the writer taking the idea back, and it is not a contradiction; it is the writer telling you exactly how far the idea goes. Test: after the sentence, your restatement of the idea gains a condition.',
        'A CAUSE REFINES THE IDEA BY GOING BEHIND IT. "Cats see well in dim light because a mirror-like layer at the back of the eye bounces light back through the eye a second time." Watch for because, since, the reason is, this happens when. After a cause, the idea has a mechanism, so you know not only that it is true but why, and you can guess where else it would hold. Do not confuse a cause with an example. An example is one case OF the idea; a cause is the reason FOR it. A cat threading a dark yard is an example. The layer behind the eye is the cause.',
        'THE RESTATE TEST TRACKS THE DEVELOPMENT. After each sentence, say the central idea again in one sentence of your own. If your sentence did not change but you can now picture the idea, that sentence was an example. If your sentence gained an "only" or an "unless", it was a limit. If it gained a "because", it was a cause. If your sentence turned into a different idea altogether, that sentence is not developing this idea; it is starting another one. Then put the first version beside the last. "Cats see well in dim light" has become "Cats see well in dim light, though not in none, because a layer behind the eye reflects light back through it." The distance between those two sentences is the development, and it is what you are being asked to trace.',
      ],
      vocabulary: [
        { term: 'develop', definition: 'what a writer does to a central idea after introducing it: refine it (make it more exact with a limit or a cause) or extend it (show it reaching a new case).' },
        { term: 'example', definition: 'a sentence that shows the central idea at work in one particular case; it extends the idea without changing its wording.' },
        { term: 'limit', definition: 'a sentence that marks where the central idea stops holding, or the condition it holds under; it refines the idea by making it smaller and truer.' },
        { term: 'cause', definition: 'a sentence that gives the reason the central idea is true; it refines the idea by adding the mechanism behind it.' },
        { term: 'the restate test', definition: 'saying the central idea again in your own words after each sentence, and noticing whether that sentence changed it, and how.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-trace-one-paragraph',
      kind: 'worked_example',
      problem:
        'The central idea of this paragraph is introduced in Sentence 1. Trace how the writer develops it: name the relationship of each later sentence to the idea, and say what each one does to it.\n\n"(1) Bridges are built with gaps in their decks on purpose. (2) The steel and concrete in a deck get slightly longer as they warm and slightly shorter as they cool, so a deck locked tight at both ends would strain against its own supports on a hot afternoon. (3) The ridged metal strips a car bumps over near each end of a highway bridge cover those gaps; they are called expansion joints. (4) A short footbridge can often be built without any such joint, because a short deck changes length by so little that its supports can absorb the movement."',
      steps: [
        'Start with the version you were handed. Sentence 1 introduces the idea: "Bridges are built with gaps in their decks on purpose." Say it back in your own words, because you will be saying it again after every sentence: bridges have deliberate gaps.',
        'Sentence 2. Ask what it does to the idea. It tells you why the gaps are there: the deck "get slightly longer as they warm and slightly shorter as they cool," and a deck "locked tight at both ends" would strain. Restate: bridges have deliberate gaps because their decks change length with the temperature. Your sentence gained a "because," so this is a CAUSE, and the idea is refined. It has a mechanism now.',
        'Sentence 3. Restate again and notice that the wording does not move: bridges have deliberate gaps because their decks change length. What Sentence 3 adds is a case you have felt through a car seat, "the ridged metal strips a car bumps over near each end of a highway bridge." You can picture the idea now. This is an EXAMPLE, and it extends the idea to a real bridge without changing what the idea says.',
        'Sentence 4 is the one that catches people who sort by words. It contains "because," so a word-hunter calls it a cause. Ask what it does to the idea instead. "A short footbridge can often be built without any such joint" tells you the rule fades as bridges get shorter. Restate: LONG bridges have deliberate gaps because their decks change length; a short deck moves so little that it can often do without them. Your sentence gained a condition. This is a LIMIT, and it refines the idea by drawing its edge. The "because" inside Sentence 4 explains the limit, not the central idea.',
        'Put the first version beside the last. First: bridges are built with gaps on purpose. Last: long bridges are built with gaps on purpose, because their decks get longer and shorter with the temperature, and a short deck moves so little that it can often do without them. The distance between those two sentences is the development. Every sentence after the first moved the idea, and no two moved it the same way.',
        'Say the whole answer, relationship by relationship. Sentence 2 is a cause and refines the idea. Sentence 3 is an example and extends it. Sentence 4 is a limit and refines it again. And the developed idea is the last version, not the first.',
      ],
      answer:
        'Sentence 2 gives a CAUSE (the deck changes length as it warms and cools), which refines the idea by adding why. Sentence 3 gives an EXAMPLE (the ridged strips near each end of a highway bridge), which extends the idea to a real case without changing it. Sentence 4 puts a LIMIT on it (a short footbridge can often do without a joint), which refines the idea to long bridges. Developed idea: long bridges are built with gaps on purpose, because their decks get longer and shorter with the temperature, and a short deck moves so little that it can often do without them.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-a-limit-is-not-a-contradiction',
      kind: 'worked_example',
      problem:
        'A student reads this paragraph and writes: "Sentence 4 contradicts Sentence 1. First the writer says honey does not spoil, then says it can ferment, so the paragraph does not have one central idea." Explain what went wrong, and state the central idea as the writer has developed it by the end.\n\n"(1) Honey is one of the very few foods that does not spoil. (2) It holds so little water, and is so acidic, that the molds and bacteria that ruin other foods cannot grow in it. (3) A jar left at the back of a cupboard for years may turn cloudy and grainy, but it is still safe to eat. (4) Honey keeps only while it stays dry, though: once water gets in, from a wet spoon or a lid left open in a damp kitchen, it can begin to ferment."',
      steps: [
        'Start where the student started. Sentence 1 says honey "does not spoil." Sentence 4 says it "can begin to ferment." Set side by side with nothing between them, those two phrases look like opposites, and that is as far as the student read. He never asked what Sentence 4 does to the idea; he only checked whether it matches the first version word for word.',
        'Run the restate test from the top instead. Sentence 1 introduces the idea: honey does not spoil. Sentence 2 gives the reason: it "holds so little water, and is so acidic," that molds and bacteria "cannot grow in it." Restate: honey does not spoil because it is too dry and too acidic for the things that spoil food to grow in it. A "because" arrived, so Sentence 2 is a CAUSE, and the idea is refined.',
        'Sentence 3. The restatement does not move; what arrives is a picture. A jar "left at the back of a cupboard for years" that has gone "cloudy and grainy" and is "still safe to eat." That is an EXAMPLE, and it extends the idea to one real jar.',
        'Sentence 4. Read its first words: "Honey keeps only while it stays dry, though." Those are edge words, "only while" and "though." Restate: honey does not spoil as long as it stays dry, because it is too dry and too acidic for molds and bacteria; let water in and it can ferment. The idea gained a condition. Sentence 4 is a LIMIT, and it refines the idea by drawing its edge.',
        'Now look at what the limit and the cause say together. Sentence 2 said the protection comes from how little water honey holds. Sentence 4 says that when water gets in, the protection ends. The limit is the cause seen from its edge. Far from contradicting Sentence 1, Sentence 4 is the most exact statement of it in the paragraph.',
        'WRONG: "Sentence 4 contradicts Sentence 1, so the paragraph has two central ideas." CORRECT: "Sentence 4 limits the idea in Sentence 1, so the paragraph has one central idea, and by the end it is more exact than when it started." A contradiction would take the idea back. A limit tells you how far it goes.',
      ],
      answer:
        'The student read a limit as a contradiction. Sentence 4 does not take back Sentence 1; it draws the idea\'s edge, and it agrees with the cause in Sentence 2, which said the protection comes from how little water honey holds. Developed idea: honey does not spoil as long as it stays dry, because it is too dry and too acidic for molds and bacteria to grow in it, and once water gets in it can begin to ferment.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-name-the-relationship',
      kind: 'try_yourself',
      problem:
        'The central idea of this paragraph is introduced in Sentence 1. Which statement correctly names the relationship between Sentence 3 and that idea?\n\n"(1) Most trees growing where the seasons change add one new ring of wood every year. (2) In spring the tree grows fast and lays down a wide band of pale wood; by late summer growth slows and the wood it adds is narrower and darker, so each year leaves one pale band beside one dark one. (3) A student who counts the dark bands across a fresh stump can tell how old the tree was when it was cut. (4) Trees that grow where it is warm and wet all year round often add no clear rings at all, because their growth never slows down long enough to leave a dark band."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Sentence 3 gives an EXAMPLE of the central idea: it shows the yearly rings being put to use in one particular case, a student counting them on a stump, and it leaves the wording of the idea in Sentence 1 unchanged.', correct: true },
        { id: 'b', text: 'Sentence 3 gives a CAUSE behind the central idea: it comes directly after the explanation of the pale and dark bands and carries that explanation one step further, so it belongs to the reason the rings form.' },
        { id: 'c', text: 'Sentence 3 puts a LIMIT on the central idea: it narrows the rule in Sentence 1 to trees that have already been cut, since a stump is the only place the sentence shows the rings being counted at all.' },
        { id: 'd', text: 'Sentence 3 introduces a NEW idea that the paragraph then leaves behind: how to find out a tree\'s age is a different point from how a tree grows, so it belongs to a second central idea rather than to this one.' },
      ],
      expectedAnswer: 'Sentence 3 gives an EXAMPLE of the central idea: it shows the yearly rings being put to use in one particular case, a student counting them on a stump, and it leaves the wording of the idea in Sentence 1 unchanged.',
      hints: [
        'Ask what Sentence 3 does to the idea, not where it sits or which words it contains: does it give a reason the idea is true, mark where the idea stops being true, or show the idea at work in one case?',
        'Run the restate test. Say the idea from Sentence 1 again after reading Sentence 3. If your sentence gained no "because" and no "only," and what you gained instead was a picture of the rings being used, you have named the relationship.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-find-the-limit',
      kind: 'try_yourself',
      problem:
        'The central idea of this paragraph is introduced in Sentence 1. Which sentence puts a LIMIT on that idea, and why?\n\n"(1) Spreading salt on an icy road makes the ice melt even when the air stays below freezing. (2) The salt dissolves into the thin film of water on the ice and lowers the temperature at which that water can freeze, so ice that would have stayed solid turns back into liquid. (3) There is a point where salt stops helping, though: when the air gets very cold, well below the usual freezing mark, salt water freezes as well, and the road stays icy no matter how much is spread. (4) On an ordinary winter morning just under freezing, a plow truck spreads salt on the main roads before the buses run, and by the time they roll out the ice has turned to slush. (5) The same truck also spreads salt before a storm arrives, so that snow melts as it lands instead of packing into ice."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Sentence 2, because explaining that the salt works by dissolving into a film of water tells the reader the one condition under which the idea holds, and a condition narrows the rule stated in Sentence 1.' },
        { id: 'b', text: 'Sentence 3, because it marks the point where the idea stops being true: in very cold air the salt water freezes as well, so the rule in Sentence 1 holds only down to a certain temperature and not below it.', correct: true },
        { id: 'c', text: 'Sentence 4, because a truck spreading salt on the main roads on one ordinary morning narrows the rule in Sentence 1 to main roads and to mornings when the air is only just under freezing.' },
        { id: 'd', text: 'Sentence 5, because spreading salt before a storm is a different use from melting ice that is already on the road, so the sentence cuts the rule in Sentence 1 down to storms alone.' },
      ],
      expectedAnswer: 'Sentence 3, because it marks the point where the idea stops being true: in very cold air the salt water freezes as well, so the rule in Sentence 1 holds only down to a certain temperature and not below it.',
      hints: [
        'A limit is the sentence after which your restatement of the idea gains a condition. Restate the idea after each of Sentences 2 through 5 and notice which one makes you add an "only" or an "unless."',
        'One sentence gives the reason the idea is true, and two show the idea at work on a particular morning or before a particular storm. None of those makes the rule smaller. Look for the sentence that says outright that there is a point where salt "stops helping."',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-the-developed-idea',
      kind: 'try_yourself',
      problem:
        'The central idea of this paragraph is introduced in Sentence 1. Which statement gives the central idea as the writer has developed it by the end of the paragraph?\n\n"(1) A popcorn kernel pops because of the water sealed inside it. (2) Each kernel holds a small amount of moisture inside a hard, tight shell; as the kernel heats, that moisture turns to steam, and the pressure builds until the shell bursts and the soft starch inside puffs out. (3) The kernels left unpopped at the bottom of the bowl are usually the ones that had dried out or had a crack in the shell, so that the steam leaked away instead of building up. (4) Popcorn that has sat in an open bag for months pops poorly for the same reason: a kernel that has lost its moisture has nothing inside it to turn to steam."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'A popcorn kernel pops because of the water sealed inside it, and every sentence after the first is a supporting detail that restates that same point in more words without changing it at all.' },
        { id: 'b', text: 'The kernels left unpopped at the bottom of the bowl are the ones that dried out or cracked, which is the point the whole paragraph has been building toward from its first sentence.' },
        { id: 'c', text: 'A popcorn kernel pops because the water sealed inside it turns to steam and bursts the shell, so a kernel pops only if it has kept its moisture and its shell has stayed unbroken.', correct: true },
        { id: 'd', text: 'By the end of the paragraph the writer has moved on to a second central idea, that popcorn should be stored in a sealed container, which Sentence 4 introduces and Sentence 1 never mentions.' },
      ],
      expectedAnswer: 'A popcorn kernel pops because the water sealed inside it turns to steam and bursts the shell, so a kernel pops only if it has kept its moisture and its shell has stayed unbroken.',
      hints: [
        'Run the restate test sentence by sentence: say the central idea after Sentence 2, then after Sentence 3, then after Sentence 4, and watch what each one adds to the version in Sentence 1.',
        'Sentence 2 hands the idea a fuller reason, and Sentences 3 and 4 hand it a condition. The developed idea has to carry both, and it still has to be about why a kernel pops, not about any one bowl or any one bag.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-flat-support-and-cause-as-example',
      kind: 'misconception_check',
      question:
        'Two students trace the same three-sentence paragraph. Its first sentence says that a sled dog stays warm sleeping outside in the snow. Its second sentence explains that the dog\'s coat has a dense underlayer of fur that traps a layer of warm air against the skin. Its third sentence says that a husky curled up on a frozen lake with its tail over its nose will sleep through a night of falling snow. One student writes: "Sentences 2 and 3 are both supporting details. They both just back up Sentence 1." The other writes: "Sentence 2 is an example, because it shows what the coat does." What has gone wrong in each case?',
      commonErrors: [
        {
          answer: 'Sentences 2 and 3 are both supporting details. They both just back up Sentence 1.',
          misconception:
            'Stopping at the question of whether a sentence supports the idea and never asking how. "Supporting detail" is a true label for both sentences, so it feels as if the job is done, but the label hides the fact that the two sentences do completely different things to the idea.',
          correctsTo:
            'Run the restate test on each. After Sentence 2 the idea gains a "because": the dog stays warm because its underfur traps warm air against the skin. That is a cause, and the idea is now refined; it has a mechanism. After Sentence 3 the wording does not change, but you can see the idea in one case, a husky on a frozen lake with its tail over its nose. That is an example, and the idea is extended to a real night. Two sentences, two relationships. "They both back it up" was true and said almost nothing. "One explains it and one shows it" is what tracing the development means.',
        },
        {
          answer: 'Sentence 2 is an example, because it shows what the coat does.',
          misconception:
            'Taking any sentence that describes something happening for an example. The sentence about the underfur trapping warm air does describe something happening, so it looks like the idea in action, but it is describing why the idea is true, not one case of it.',
          correctsTo:
            'Ask whether the sentence is one case OF the idea or the reason FOR it. A husky on a frozen lake is one case: delete it and the idea is stated in exactly the same words. The underfur trapping air is not a case of a dog staying warm; it is what makes the dog stay warm, and after it your restatement gains a "because." That makes it a cause. The test is never whether the sentence describes an action. It is what the sentence does to the idea: an example lets you picture it, and a cause tells you why it holds.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A central idea is introduced, not delivered finished. The sentence that first states it is the first version, and the rest of the paragraph works on that version.',
        'Every supporting sentence has a relationship to the idea, not just a place under it. Ask HOW it supports: as an example of the idea, a limit on it, or a cause behind it.',
        'An example extends the idea: it shows the idea at work in one case and leaves the wording alone.',
        'A limit refines the idea by drawing its edge (but, only, unless, except). It is not a contradiction and not the writer taking the idea back; the idea is now smaller and truer.',
        'A cause refines the idea by going behind it (because, since, the reason is). An example is one case OF the idea; a cause is the reason FOR it. Do not sort by the words a sentence contains; ask what it does to the idea.',
        'The restate test: say the idea again after each sentence and notice what changed. If it turned into a different idea, that sentence is not developing this one. Put the first version beside the last; the distance between them is the development.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '3', cedTopic: '3.1', cedTitle: 'How a Central Idea Develops' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
