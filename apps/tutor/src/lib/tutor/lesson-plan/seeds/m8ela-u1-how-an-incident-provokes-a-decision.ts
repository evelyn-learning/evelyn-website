/**
 * Grade 8 ELA — Reading Literature: Evidence, Dialogue & Structure: How an
 * Incident Provokes a Decision.
 *
 * CONCEPT-LED row (built on the shape of the m8ela concept-led exemplar). The
 * student arrives able to read what a character DOES as a clue to what they
 * are like and able to say what a place or a moment forces on a character;
 * this lesson isolates one link neither of those skills names: a single
 * INCIDENT (one event that happens to a character, which the character did
 * not choose) PROVOKES a DECISION (a choice with a visible alternative), and
 * the decision, read against the alternative the character passed up, is
 * what reveals the character. The lesson gives the student one way of
 * reading that finds the link: the COVER TEST on an event (cover the
 * incident, read on, ask whether the character would still have made this
 * choice, then confirm the choice is ABOUT what the incident changed), the
 * three ways an incident provokes (it changes what the character knows, what
 * the character can do, or what a choice will cost), and the one-sentence
 * chain "when INCIDENT, NAME decides to CHOICE instead of ALTERNATIVE, which
 * shows WHAT" (CCSS RL.8.3). Three traps this plan is built to kill: taking
 * any event that comes BEFORE the decision for the event that caused it
 * (after is not because); reading the character off the incident, which
 * happened to them and shows nothing about them; and stating what a decision
 * "shows" without ever naming what the character chose it over, so that the
 * reveal floats free of the page.
 *
 * SCOPE GUARD: Grade 8 row 1.3 analyzes how one specific incident in a short
 * excerpt provokes a character's decision and what that decision reveals
 * about the character — a cause-to-choice chain traced through a single
 * event, not a map of the whole plot. Builds on
 * `m7ela-u1-plot-structure-and-conflict.ts` (RL.7.3: five stages,
 * turning-point test, conflict type) and
 * `m7ela-u1-setting-and-story-elements.ts` (RL.7.3: how setting limits and
 * reveals a character), neither of which isolates the incident-decision link.
 * Stops short of HS `engl-u6-plot-and-conflict.ts` (RL.9-10.5: how flashback
 * and foreshadowing as structural choices build tension). DELIBERATELY
 * EXCLUDED: the five plot stages, the turning-point test and the four
 * conflict types, which are `m7ela-u1-plot-structure-and-conflict.ts`'s —
 * none of the words "exposition", "rising action", "climax", "falling
 * action", "resolution", "turning point" or "conflict" appears in this
 * file's body below this comment, and no question asks where an event sits
 * in the shape of a whole story; the three jobs of setting (creates the
 * problem, limits the options, reveals character) and the sentence shape
 * "the setting causes X, which forces the character to Y", which are
 * `m7ela-u1-setting-and-story-elements.ts`'s — the word "setting" does not
 * appear in the body, and no item asks what a place or a time does to a
 * character; flashback and foreshadowing, which are HS
 * `engl-u6-plot-and-conflict.ts`'s — neither word appears in the body, and
 * every excerpt here runs in plain order with no jump in time; inferring a
 * character's MOTIVE, which is HS `engl-u6-characterization.ts`'s — the word
 * "motive" does not appear in the body, and no item asks WHY a character
 * chose, only what the choice, read against its alternative, shows; the
 * five indirect-characterization moves and the labels "direct" and
 * "indirect", which are `m7ela-u1-characterization.ts`'s — none of
 * "characterization", "direct" or "indirect" appears in the body; how a LINE
 * of dialogue propels the action, which is row 1.2 — every incident in this
 * file is an event, and no question asks what a line causes; ranking several
 * true details for strength, which is row 1.1; and theme, which is row 2.1 —
 * the word does not appear in the body. DELIBERATELY ALLOWED, because the
 * G7 rows and row 1.2 sit close: (a) the hook and one keyIdea say in a
 * single sentence that the student already reads a character from what
 * they do — that is the G7 skill named as the floor, not
 * re-taught, and the reveal in this file is always read from a CHOICE
 * against its alternative, which no G7 row asks for; (b) one keyIdea says
 * that an incident provokes a decision by changing what the character can
 * do, alongside what they know and what a choice will cost — that one clause
 * touches the G7 setting row's "limits the options" idea, because it is the
 * mechanism of provocation and cannot be left out, but the three jobs of
 * setting are never listed and the incident here is always an EVENT, never
 * a place or a time; (c) the cover test in this file is the same move row
 * 1.2 applies to a line of dialogue, applied here to an event, and the
 * concept says so in one sentence so the student can carry it across;
 * (d) characters in this file speak, and a decision is sometimes announced
 * in a spoken line ("We wash with what we have"), because that is how people
 * decide out loud — every such line is read as the STATEMENT of a decision
 * an event provoked, never as the cause of anything; (e) the word "plot"
 * appears only in the LO description, where the curriculum's own wording
 * uses it to say what this lesson is NOT, and nowhere in the spoken body.
 *
 * NOTE FOR FUTURE AUTHORS: every story in this file is original prose written
 * for the item. This course carries no passage machinery — no passageId, no
 * shared texts — so each question must be solvable from the sentences printed
 * inside it, and no published work may be quoted or closely paraphrased.
 * Every phrase this file quotes from one of its excerpts appears character-
 * for-character in that excerpt; quote your own excerpt exactly, never from
 * memory. Contractions appear only inside quoted character speech and quoted
 * text messages (reported speech), never in the tutor's own voice.
 *
 * CLAIM LEDGER: none required. Every excerpt in this file is invented
 * narrative fiction, which is true by construction, so there is no factual
 * claim to verify. Rows whose passages are INFORMATIONAL (all of Units 3 and
 * 4, and any other row needing nonfiction) must carry the four-column claim
 * ledger described in the fan-out contract instead of this line.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M8ELA_U1_HOW_AN_INCIDENT_PROVOKES_A_DECISION: LessonPlan = {
  id: 'evelyn.ms.m8ela.how-an-incident-provokes-a-decision.v1',
  title: 'How an Incident Provokes a Decision',
  curriculum: 'MS',
  grade: '8',
  subject: 'ela',
  topic: 'grade-8-ela',
  locale: 'en',
  los: [
    {
      id: 'm8ela.how-an-incident-provokes-a-decision',
      standard: 'M8ELA-1.3',
      description:
        'Analyze how one specific incident in a short excerpt provokes a character\'s decision and what that decision reveals about the character -- a cause-to-choice chain traced through a single event, not a map of the whole plot (CCSS RL.8.3).',
    },
  ],
  prerequisites: ['m8ela.how-dialogue-propels-action-and-reveals-character'],
  followUps: ['m8ela.comparing-the-structure-of-two-texts'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the student feel the difference between a thing that happens to a person, which shows nothing about them, and the choice they make right after it, which shows almost everything.',
      script:
        'Your friend\'s phone dies halfway through the bus ride home, so the message that practice moved to the other field never reaches them, and at four o\'clock they walk onto an empty field. Stop there. What do you know about your friend? Nothing. A dead battery and a moved practice happened TO them; they would have happened to anyone on that bus. Now keep going. Your friend can walk the mile to the other field and show up twenty minutes late, or turn around, go home, and say the message never came, which is true. Whichever one they pick, you have just learned something, and you learned it from the choice, not from the battery. That is the pattern this lesson is about. In a story, things happen to characters all the time, and the things themselves tell you what the world of the story is like. It is the decision a character makes right after that tells you who they are. You already know how to read a character from what they do. Today you learn to find the one event that provoked a decision, to prove that it provoked it, and to say what the decision shows.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-incident-decision-and-the-chain',
      kind: 'concept',
      goal: 'Define an incident as one event a character did not choose and a decision as a choice with a visible alternative, install the cover test that proves the one provoked the other, and read what the choice shows from the option the character passed up.',
      keyIdeas: [
        'AN INCIDENT IS ONE EVENT THAT HAPPENS TO A CHARACTER. A text arrives, a bus leaves early, a hose splits, a coach posts a roster. It is something the character did not choose, and it is one thing you can point at in one sentence. It is not the situation the story opened with (six weeks of practice, a position shared for two seasons), and it is not a feeling. Those were already true before anything happened, and a decision is provoked by something that HAPPENS, not by a condition that was sitting there all along.',
        'A DECISION IS A CHOICE BETWEEN AT LEAST TWO THINGS THE CHARACTER COULD HAVE DONE. Find the thing the character does, and then find the alternative, the thing they passed up. A good writer almost always shows it: the character looks at the program in her hand before giving it away, types the message and deletes it, watches the others head for the shade before picking up a bucket. If you cannot find a second thing the character could have done, you have found an event, not a decision. And a decision can be quiet. Staying put, saying nothing and handing something over are all choices.',
        'THE COVER TEST PROVES THE INCIDENT PROVOKED THE DECISION. This is the same move you used on a line of dialogue in the last lesson, now applied to an event. Put your thumb over the incident and read on. Would the character still have made this choice? If yes, the incident did not provoke it. Then check the reverse: the choice has to be ABOUT what the incident changed. An event that comes before a decision did not automatically cause it; a fire alarm can go off between the incident and the choice and have nothing to do with either. After is not because.',
        'AN INCIDENT PROVOKES A DECISION BY CHANGING ONE OF THREE THINGS. It changes what the character KNOWS (she now knows a younger student has nothing to play), what the character CAN DO (the bus is gone, so the planned way to get there is gone), or what a choice will COST (keeping the solo now costs someone else her one night). Name which one, because that is the link in the chain, and the link is what the question is asking for.',
        'THE DECISION REVEALS THE CHARACTER; THE INCIDENT NEVER DOES. You already read a character from what they do. Here the action is a choice, and the reveal lives in the gap between what they chose and what they passed up. The same incident can provoke opposite decisions from two people standing on the same curb, which is exactly why the incident tells you nothing about either of them and the decision tells you almost everything. Say the reveal as what mattered more: she chose someone else\'s one night over six weeks of her own work. WRONG: "The bus leaving without him shows that he is unlucky." That reads the incident as if it were about him. CORRECT: "When the bus leaves without him, he decides to text the teacher that it was not his fault instead of finding another way there, which shows that his first concern is who gets blamed."',
        'SAY THE WHOLE CHAIN IN ONE SENTENCE, WITH THE INCIDENT CITED EXACTLY. The shape is: when INCIDENT, NAME decides to CHOICE instead of ALTERNATIVE, which shows WHAT. All four parts, in that order, and the incident quoted from the page, not from memory. A sentence that stops after the choice has not done the analysis, and a sentence that skips the alternative has not earned its "which shows", because a choice only shows something when you know what it was chosen over.',
      ],
      vocabulary: [
        { term: 'incident', definition: 'one event that happens to a character and that the character did not choose; the first link in the chain.' },
        { term: 'decision', definition: 'a choice between at least two things a character could have done; it can be quiet, and it can be a choice not to act.' },
        { term: 'provoke', definition: 'to bring about a decision by changing what a character knows, can do or must pay. An incident provokes a decision when the decision would not have happened without it and is about what it changed.' },
        { term: 'alternative', definition: 'the thing the character could have done and did not, usually shown on the page; the decision reveals the character only when read against it.' },
        { term: 'cause-to-choice chain', definition: 'the one-sentence statement of incident, decision, alternative and what the decision shows, in that order.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-trace-one-chain',
      kind: 'worked_example',
      problem:
        'Find the incident, the decision and the alternative, prove the incident provoked the decision, and say what the decision reveals.\n\n"Nadia had rehearsed the solo for six weeks, and her name sat in bold on the program. Ten minutes before the spring concert, Mr. Okafor pulled her aside: Wren, the seventh grader who had learned the piece as a backup, was in the hallway trying not to cry, because her grandmother had driven three hours to hear her play and there was nothing on the program for her to play. Nadia looked at the program in her hand for a long moment. Then she handed her sheet music to Mr. Okafor and said, \'Give it to Wren. Tell her I said the solo is hers tonight,\' and went to find a seat in the second row."',
      steps: [
        'Find the incident: one event that happens to Nadia and that she did not choose. It is the second sentence. "Mr. Okafor pulled her aside" and told her about Wren and the grandmother who "had driven three hours to hear her play" and now had nothing to hear. Notice what is NOT the incident: the six weeks of rehearsal and the name "in bold on the program" were already true when the excerpt opened. They are the situation the incident lands on, not the incident.',
        'Find the decision and the alternative. The decision is in the last sentence: she "handed her sheet music to Mr. Okafor" and said "Give it to Wren." The alternative is on the page too. Her name is in bold, she has six weeks in this piece, and she "looked at the program in her hand for a long moment." That pause is the writer showing you the other choice, keeping the solo, and showing you that Nadia saw it.',
        'Run the cover test. Cover the sentence where Mr. Okafor pulls her aside and read the rest. Nadia rehearses for six weeks, her name is on the program, and then she hands her music away? Nothing left in the excerpt gives her any reason to. So the decision does not survive without the incident. Now the reverse: is the decision about what the incident changed? Yes. Every word she says is about Wren, and Wren is what the incident put in front of her.',
        'Name how the incident provoked the decision. Did it take an option away? No. She could still have played. Did it change what she knew? Yes, and that is the link: she now knows a seventh grader is in the hallway with a grandmother who drove three hours and nothing to play. Knowing that put a cost on keeping the solo that was not there ten minutes earlier.',
        'Read the decision against the alternative to find the reveal. On one side, six weeks of her own work and a bold name on a program. On the other, one younger student\'s one night. She chose the second, and notice that nothing in the excerpt says Mr. Okafor asked her to. Read against what she gave up, the choice shows that another person\'s moment matters more to her than her own recognition.',
        'Say the whole chain in one sentence, with the incident cited. When "Mr. Okafor pulled her aside" ten minutes before the concert and told her Wren had nothing to play, Nadia decides to give Wren the solo instead of keeping the one her name was printed for, which shows that someone else\'s one night matters more to her than six weeks of her own work.',
      ],
      answer:
        'Incident: ten minutes before the concert, "Mr. Okafor pulled her aside" and told Nadia that Wren\'s grandmother "had driven three hours to hear her play" and that there was nothing for Wren to play. Decision: Nadia hands over her sheet music and says "Give it to Wren." instead of keeping the solo her name was printed for, which the long look at the program shows she considered. The incident provoked it by changing what she knew, and the choice, read against six weeks of work and a bold name, shows that another person\'s one night matters more to her than her own recognition.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-same-incident-two-decisions',
      kind: 'worked_example',
      problem:
        'One incident, two characters. Trace both chains, and say why the two decisions show something the incident does not.\n\n"The bus to the regional science fair pulled out of the parking lot at 6:40, and at 6:52 Priya and Marcus, who had been in the lab finishing the wiring on their shared project, stood at the curb watching its taillights turn onto the highway. Marcus sat down on the curb, took out his phone and started a text to their teacher explaining that they had been in the lab the whole time and that missing the bus was not their fault. Priya pulled up the city bus schedule, saw that the 7:05 route stopped two blocks from the convention center, picked up the project box and started walking to the stop."',
      steps: [
        'Find the incident, and notice that there is exactly one. The bus left without them: they "stood at the curb watching its taillights turn onto the highway." It happened to both of them at once, and neither chose it. Hold on to that, because it is the point of this example: whatever you learn about Marcus and whatever you learn about Priya, none of it can come from the bus.',
        'Marcus first. His decision: he "sat down on the curb" and "started a text to their teacher" saying that "missing the bus was not their fault." His alternative is printed in the very next sentence, because Priya takes it: find another way to the fair. So Marcus chooses explaining over arriving.',
        'Priya. Her decision: she "pulled up the city bus schedule," found a route, "picked up the project box and started walking to the stop." Her alternative is printed in the sentence before hers, because Marcus takes it: sit down and explain. So Priya chooses arriving over explaining.',
        'Cover test, both. Cover the first sentence. Does Marcus text the teacher about a bus that never left? Does Priya go looking for a city bus? Neither. And both decisions are about what the incident changed: the bus is what Marcus is explaining and the bus is what Priya is replacing. So the same incident provoked both.',
        'Name the link. The incident changed what they could do: the planned way to the fair is gone. Then notice that each of them answered a different part of that loss. Marcus answers the question of who will be blamed for it. Priya answers the question of how to get there anyway. Same event, different piece of it picked up.',
        'Now the reveal, read against the alternative each one passed up. Marcus, choosing to explain instead of to go, shows that his first concern when something goes wrong is that it not be counted against him. Priya, choosing to go instead of to explain, shows that her first concern is the fair itself, and that she treats a problem as something to solve before anyone talks about it. Neither decision is silly. They are just different, and the difference is the whole reveal. If the incident could show character, both of them would have to be shown the same thing by the same bus, and they plainly are not.',
      ],
      answer:
        'The one incident is the bus leaving without them. When it does, Marcus decides to sit down and text the teacher that "missing the bus was not their fault" instead of finding another way there, which shows that his first concern is not being blamed; Priya decides to find the 7:05 city bus and start walking with the project instead of stopping to explain, which shows that her first concern is getting the project to the fair. The same event provoked opposite choices, so the reveal is in each decision, not in the incident.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-find-the-incident',
      kind: 'try_yourself',
      problem:
        'Read the excerpt, then choose the event that is the incident provoking Jonah\'s decision to spend practice repairing the net.\n\n"Jonah had wanted the goalkeeper spot since fourth grade, and for two seasons he had shared it with Eli, switching at halftime. On Tuesday the coach posted the roster for the championship with Eli\'s name at keeper for the whole game and Jonah\'s on the bench. Jonah read it twice, walked to the equipment shed, and spent the rest of practice repairing the torn net that nobody had touched all season. On Thursday the coach moved him into the starting lineup at left back."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The coach posting the championship roster with Eli at keeper for the whole game and Jonah on the bench, because Jonah\'s walk to the shed comes only after he reads it and is his answer to being left out of the game.', correct: true },
        { id: 'b', text: 'Jonah wanting the goalkeeper spot since fourth grade and sharing it with Eli for two seasons, because those years of caring about the position are what make him care enough about the team to fix its equipment even on the afternoon he has just been benched.' },
        { id: 'c', text: 'The coach moving Jonah into the starting lineup at left back on Thursday, because that is the moment the story shows the coach noticing the work Jonah put into the net and rewarding him for it.' },
        { id: 'd', text: 'Jonah reading the roster twice and walking to the equipment shed, because reading it is where his afternoon changes and the walk to the shed is the first thing he does about being benched for the championship.' },
      ],
      expectedAnswer: 'The coach posting the championship roster with Eli at keeper for the whole game and Jonah on the bench, because Jonah\'s walk to the shed comes only after he reads it and is his answer to being left out of the game.',
      hints: [
        'An incident is one event that happens to Jonah and that he did not choose. Sort the four: which ones were already true when the excerpt opened, which one is something Jonah himself does, and which one happens after the decision you are explaining?',
        'Cover the sentence about the roster and read the rest. Does Jonah still walk to the shed and fix the net? Then check that his decision is about what that sentence changed: the roster is what took the championship game away from him, and repairing the net is what he does with the practice that follows.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-what-the-decision-reveals',
      kind: 'try_yourself',
      problem:
        'Read the excerpt. The split hose is the incident that provokes Tamsin\'s decision. Choose the statement that best says what her decision reveals about her.\n\n"Halfway through the club\'s fundraiser car wash, the hose split, and the water that had been filling the buckets slowed to a dribble. The other volunteers started drifting toward the shade, and someone said they could just tell the six cars still in line that the car wash was closing early. Tamsin looked at the line, counted the buckets that were already full, and said, \'We wash with what we have. Bring me every bucket, and somebody go find the garden club\'s watering can.\'"',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'That she likes being the one in charge, because the moment something goes wrong she starts giving orders to the whole group, telling them to bring her buckets and to go find a watering can, and none of it is phrased as a question.' },
        { id: 'b', text: 'That when a job gets harder she would rather finish it with less than stop early, because the story puts closing early in front of her as the easy way out and she chooses the full buckets and the watering can instead.', correct: true },
        { id: 'c', text: 'That the afternoon has gone badly for her, because a hose splitting halfway through a car wash is the kind of setback that can wreck a fundraiser, and there was nothing she could have done to prevent it.' },
        { id: 'd', text: 'That she has run a car wash before and knows exactly what one needs, because she counts the full buckets and calls for the garden club\'s watering can without wasting a second on the problem.' },
      ],
      expectedAnswer: 'That when a job gets harder she would rather finish it with less than stop early, because the story puts closing early in front of her as the easy way out and she chooses the full buckets and the watering can instead.',
      hints: [
        'The reveal never comes from the incident itself, which only happened to her. Find her choice, then find the option the story shows her passing up, and read one against the other.',
        'The alternative is already on the page: someone says they could just tell the six cars that the car wash is closing early, and Tamsin picks the harder option with less water instead. Whatever her decision shows has to come from that gap, not from how she sounds giving instructions and not from the bad luck of the hose.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-trace-the-whole-chain',
      kind: 'try_yourself',
      problem:
        'Read the excerpt, then choose the statement that correctly traces the whole chain: the incident, the decision it provokes, and what that decision reveals about Devon.\n\n"Devon\'s group had agreed to split the history presentation four ways, and by Sunday night three of the four sections were finished, including his own. Then Aisha texted the group that her section was \'basically done\' and sent a slide with a title and nothing under it. Devon typed \'Aisha, that is a title, not a section\' into the chat, looked at it, and deleted it. He had a chemistry quiz in the morning. He closed his chemistry notes anyway, spent the next hour building Aisha\'s section out from her title, and texted the group: \'Last part is done. We\'re good for tomorrow.\'"',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The incident is the group agreeing to split the presentation four ways, which provokes Devon to finish his own section before Sunday night instead of leaving it for the last minute, and that shows he is the most responsible member of the group, since his section is one of the three already finished by Sunday night.' },
        { id: 'b', text: 'The incident is Devon deleting the message he typed to Aisha, which provokes him to build her section himself instead of waiting for her to fix it, and that shows he will do almost anything to avoid an argument with a teammate, even at the cost of the chemistry notes he closes.' },
        { id: 'c', text: 'The incident is Aisha sending a slide with a title and nothing under it, which provokes Devon to build her section himself instead of sending the message he typed, and that shows he puts the group\'s presentation ahead of his own evening and ahead of being right about whose fault it is.', correct: true },
        { id: 'd', text: 'The incident is the chemistry quiz Devon has in the morning, which provokes him to close his notes and spend the hour on history instead of studying, and that shows he has a hard time keeping his attention on the subject in front of him, since he closes his notes the moment the group chat lights up.' },
      ],
      expectedAnswer: 'The incident is Aisha sending a slide with a title and nothing under it, which provokes Devon to build her section himself instead of sending the message he typed, and that shows he puts the group\'s presentation ahead of his own evening and ahead of being right about whose fault it is.',
      hints: [
        'Check the first link before anything else. An incident is one thing that happens TO Devon and that he did not choose. It is not something he does himself, and it is not a condition that was already true before the excerpt starts.',
        'Once you have the incident, cover it and ask whether Devon would still spend an hour on someone else\'s slide. Then find the alternative the story shows him passing up, the message he typed and deleted, and make sure the "which shows" part is read against that gap rather than against the quiz.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-after-is-not-because',
      kind: 'misconception_check',
      question:
        'Two students read the same short scene. Lila is in the cafeteria when a message goes around that a screenshot of her team\'s private group chat, in which three of her teammates made fun of Bea, has been posted for the whole grade to see. A minute later the fire alarm goes off and everyone files outside. On the sidewalk, while people whisper and look at Bea standing by herself, Lila walks across the grass and stands next to her. One student writes, "The fire alarm provoked Lila\'s decision, because she made it right after the alarm went off." The other writes, "The screenshot provoked her decision, and the decision shows that Lila is the kind of person people gossip about." What went wrong each time?',
      commonErrors: [
        {
          answer: 'The fire alarm provoked Lila\'s decision, because she made it right after the alarm went off.',
          misconception:
            'Treating the event that comes right before a decision as the event that caused it. The alarm is the last thing that happens before Lila moves, so the student read the order of events as a chain, without checking whether the decision is about what the alarm changed.',
          correctsTo:
            'After is not because. Run the cover test both ways. Cover the alarm: would Lila still cross to Bea? Yes. She would do it in the cafeteria instead of on the sidewalk, because the alarm changed where everyone was standing and nothing else. Now cover the screenshot: is there any reason left for Lila to walk over to Bea while people whisper and look at her? None. And the decision is about what the screenshot changed, which is that Bea is now standing alone in front of the whole grade. The screenshot is the incident. The alarm is just an event that happened to land between the incident and the choice.',
        },
        {
          answer: 'The screenshot provoked her decision, and the decision shows that Lila is the kind of person people gossip about.',
          misconception:
            'Reading the character off the incident instead of off the decision. The student found the right incident and then took what the incident says about Lila\'s situation, that her team is being talked about, as if it were what the decision shows about Lila.',
          correctsTo:
            'The screenshot happened to Lila. It tells you what the world of the story is like on that day, and it tells you nothing about who she is, because it would have happened to every person in that chat. The reveal is in the choice, read against the alternative. Her alternative is easy to see: stay on the grass with everyone else, at a safe distance from the person the whole grade is looking at. She walks across and stands next to Bea instead. So the chain is: when the screenshot goes around and Bea is left standing alone, Lila decides to stand beside her instead of keeping her distance, which shows that being seen next to someone who is being laughed at matters more to her than staying out of it.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'An incident is one event that happens to a character and that the character did not choose. Point at it in one sentence. A situation that was already true when the story opened is not an incident.',
        'A decision is a choice with an alternative, and the writer usually shows the alternative on the page. No alternative means you have found an event, not a decision.',
        'The cover test proves the link: cover the incident, and ask whether the character would still have chosen this. Then check that the choice is about what the incident changed. After is not because.',
        'An incident provokes a decision by changing what the character knows, what the character can do, or what a choice will cost. Name which.',
        'The decision reveals the character; the incident never does. WRONG: "The bus leaving without them shows that Marcus is unlucky." CORRECT: read the choice against what he passed up, and say what mattered more to him.',
        'Say the whole chain in one sentence: when INCIDENT, NAME decides to CHOICE instead of ALTERNATIVE, which shows WHAT. All four parts, with the incident quoted exactly.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '1', cedTopic: '1.3', cedTitle: 'How an Incident Provokes a Decision' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
