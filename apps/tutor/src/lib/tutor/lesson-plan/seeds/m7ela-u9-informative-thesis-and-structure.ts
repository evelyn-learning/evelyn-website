/**
 * Grade 7 ELA — Informative Writing: Focus & Structure.
 *
 * The first row of Unit 9, and its main job is to mark the turn away from
 * Unit 8. Argument writing takes a side; informative writing explains. The
 * controlling idea of an informative piece is therefore NOT a debatable
 * claim, and a student who just spent four rows learning to argue will keep
 * writing claims unless the difference is stated out loud, repeatedly.
 *
 * Teaches: the focus statement (topic + what the piece will show), narrowing
 * a topic, the five structures (definition, process/sequence, classification,
 * compare-contrast, cause-effect) chosen AFTER the information is gathered,
 * and grouping so each paragraph does one job.
 *
 * NOTE FOR FUTURE AUTHORS: every fact used as subject matter here is plain
 * public-domain knowledge (yeast, gears, bird migration, how a library
 * orders books). There are NO invented statistics anywhere in this file, and
 * none should be added — a made-up number in a model informative paragraph
 * teaches exactly the wrong habit.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7ELA_U9_INFORMATIVE_THESIS_AND_STRUCTURE: LessonPlan = {
  id: 'evelyn.ms.m7ela.informative-thesis-and-structure.v1',
  title: 'Informative Writing: Focus & Structure',
  curriculum: 'MS',
  grade: '7',
  subject: 'ela',
  topic: 'grade-7-ela',
  locale: 'en',
  los: [
    {
      id: 'm7ela.informative-thesis-and-structure',
      standard: 'M7ELA-9.1',
      description:
        'Write a focus statement that names a narrowed topic and what an informative piece will show about it, choose an organizing structure that fits the information gathered, and group related information so that each paragraph does one job (CCSS W.7.2a).',
    },
  ],
  prerequisites: ['m7ela.organizing-an-argument'],
  followUps: ['m7ela.paragraph-development'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Separate explaining from arguing using something the student has actually had to explain.',
      script:
        'Your younger cousin points at the little levers on your bike and asks what the gears do. You do not try to win anything. You are not talking them into liking bikes. You just want them to understand, so you start with the chain, then the two sizes of gear, then what happens when you click the lever. That is informative writing, and it is a completely different job from the one you did in the last unit. For four lessons you picked a side and defended it. Today you put that down. An informative piece explains. Its one big sentence is not something a reader can argue with, and today we build that sentence and then decide what order everything else goes in.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-focus-and-structure',
      kind: 'concept',
      goal: 'Install the focus statement, the narrowing move, the five structures, and the one-job-per-paragraph rule.',
      keyIdeas: [
        'INFORMATIVE WRITING EXPLAINS; IT DOES NOT PERSUADE. In Unit 8 the whole point was to take a side. Here the point is to make a reader understand something. That changes the big sentence at the top. ARGUMENT (belongs in Unit 8): "Every school should teach students to bake bread." INFORMATIVE (belongs here): "Bread rises because the yeast in the dough feeds on sugar and gives off a gas that gets trapped inside." A reader can disagree with the first one. Nobody disagrees with the second one; they read it to find out how.',
        'A FOCUS STATEMENT NAMES THE TOPIC AND WHAT THE PIECE WILL SHOW ABOUT IT, in one sentence. The topic by itself is not enough. "Service dogs" is a topic. "How service dogs are trained" is a focus, but it is still not a sentence. FOCUS STATEMENT: "Service dogs learn their job in stages, starting with basic obedience in a volunteer home and ending with training for the one person they will work with." Now the reader knows the subject AND what is coming.',
        'NARROW UNTIL YOU CAN ACTUALLY COVER IT. A broad topic feels safe because there is more to say, but it produces the thinnest writing, because you can only give one shallow line about each part. "Dogs" is too big for anyone. "How service dogs are trained" is small enough that you can give real detail. Narrow by asking three questions about your topic: which kind, which part, and what about it.',
        'AN ANNOUNCEMENT IS NOT A FOCUS STATEMENT. WRONG: "In this paper I will tell you about why some birds migrate." That sentence talks about the paper instead of telling the reader anything. CORRECT: "Shorter fall days set off changes inside a songbird that end with it flying south at night." Cross out the words "In this paper I will tell you about" and the real focus statement is usually sitting right there underneath.',
        'FIVE STRUCTURES ARE AVAILABLE, and you pick AFTER you know what information you have, never before. DEFINITION explains what something is. PROCESS or SEQUENCE walks through steps in order. CLASSIFICATION sorts things into kinds. COMPARE-CONTRAST lines up two or more things side by side. CAUSE-EFFECT explains why something happens or what it leads to. Steps that must happen in order want sequence. Two things being weighed against each other want compare-contrast. Let the notes choose.',
        'GROUP RELATED INFORMATION SO EACH PARAGRAPH DOES ONE JOB. Before drafting, sort your notes into piles, and give every pile a job you can say in a few words: what the parts are, how you switch, why it matters. Any note that does not fit a pile either needs its own pile or does not belong in the piece at all. A sentence that argues a position never belongs in an informative paragraph.',
      ],
      vocabulary: [
        { term: 'informative writing', definition: 'writing whose job is to explain a topic clearly so a reader understands it, rather than to take a side.' },
        { term: 'focus statement', definition: 'the one sentence naming the topic and what the piece will show about it; also called the controlling idea.' },
        { term: 'text structure', definition: 'the order a writer puts information in, such as sequence, compare-contrast or cause-effect.' },
        { term: 'grouping', definition: 'sorting related facts together so each paragraph covers one job instead of a little of everything.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-narrow-to-a-focus',
      kind: 'worked_example',
      problem:
        'A student is assigned a short informative piece and writes "Bread" at the top of the page. Turn that into a focus statement.',
      steps: [
        '"Bread" is a topic, not a focus. It names a subject and says nothing about it, so the reader learns nothing and the writer has no idea where to start.',
        'A first try usually goes too broad. TOO BROAD: "Bread is eaten all over the world and comes in hundreds of kinds." A short piece cannot cover the whole world, so every sentence would end up being one thin line about a different country. Broad does not mean easier. Broad means shallow.',
        'Narrow with the three questions. Which kind of bread? The plain kind made with yeast. Which part of it? The part before it goes in the oven. What about it? The way the dough puffs up.',
        'Watch out for the announcement version. WRONG: "In this paper I will tell you about how bread rises." That sentence is about the paper, not about bread. Cross out the opening words and see what is left.',
        'Watch out for the argument version too. WRONG FOR THIS UNIT: "Homemade bread is better than store bread." That is a side, and a reader could disagree with it. It belongs in Unit 8, not in an informative piece.',
        'FOCUS STATEMENT: "Bread dough rises because the yeast in it feeds on sugar and gives off a gas that stretchy strands in the dough trap as bubbles." The reader now knows the topic and what the piece will show.',
        'Only now pick the structure. The notes are about why one thing happens, so cause-effect fits, and the steps inside it fall in order, so sequence carries the middle. The information chose the structure.',
      ],
      answer:
        'FOCUS STATEMENT: "Bread dough rises because the yeast in it feeds on sugar and gives off a gas that stretchy strands in the dough trap as bubbles." Structure: cause-effect, with the steps told in sequence.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-group-the-notes',
      kind: 'worked_example',
      problem:
        'A writer explaining how bike gears work has these six notes. (1) A chain connects a gear at the pedals to a gear at the back wheel. (2) In a low gear the pedals turn easily but the wheel turns less for each push. (3) In a high gear each push is harder but the wheel turns farther. (4) A metal arm called the derailleur pushes the chain sideways onto a different gear. (5) You shift while you are still pedaling, easing off the pressure as the chain moves. (6) Everyone should learn to fix their own bike. Group these into paragraphs and choose a structure.',
      steps: [
        'Start by throwing out what does not belong. Note 6 argues a position. It is not information about how gears work, and an informative paragraph has no room for it. Cut it.',
        'Now look for notes that answer the same question. Note 1 answers "what are the parts?" That is a job, and right now only one note does it, so it becomes a short opening paragraph that defines the setup.',
        'Notes 2 and 3 both answer "what is the difference between the gears?" They are built to sit side by side, one easy push and one hard push. Group them into one paragraph.',
        'Notes 4 and 5 both answer "how do you actually change gears?" One says what moves the chain, the other says what you do with the pedals. Group them into a third paragraph.',
        'Three piles, three jobs: what the parts are, how low and high gears differ, how you switch between them. Each paragraph does exactly one job, so a reader never has to hunt.',
        'The structure comes out of the piles. The middle paragraph is compare-contrast, because two gears are being lined up against each other. The last paragraph is sequence, because shifting happens in an order. The definition paragraph opens the piece.',
        'FOCUS STATEMENT for the whole piece: "Bike gears change how hard each push feels by sending the chain onto a different sized gear, and the rider controls that with a lever."',
      ],
      answer:
        'Three paragraphs. Paragraph 1 (definition): note 1, the parts. Paragraph 2 (compare-contrast): notes 2 and 3, low gear against high gear. Paragraph 3 (sequence): notes 4 and 5, how the shift happens. Note 6 is cut, because it argues a position instead of explaining.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-best-focus-statement',
      kind: 'try_yourself',
      problem:
        'A student is writing a short informative piece about how a public library decides which books to buy. Which of these is the best focus statement?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'How a public library gets its books.' },
        { id: 'b', text: 'In this paper I will tell you about how a public library gets its books.' },
        { id: 'c', text: 'A public library builds its shelves in a set order: staff keep track of what readers ask for, a selection team weighs those requests against reviews and the budget, and every book that is ordered is cataloged before it reaches a shelf.', correct: true },
        { id: 'd', text: 'Libraries around the world hold millions of books on every subject a person could ever want to read.' },
      ],
      expectedAnswer:
        'A public library builds its shelves in a set order: staff keep track of what readers ask for, a selection team weighs those requests against reviews and the budget, and every book that is ordered is cataloged before it reaches a shelf.',
      hints: [
        'A focus statement is a sentence that names the topic AND says what the piece will show about it. Read each choice and ask what you learned from it.',
        'One choice is only the topic, one talks about the paper instead of the library, and one is so broad that no short piece could cover it.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-sentence-that-does-not-belong',
      kind: 'try_yourself',
      problem:
        'This paragraph from an informative piece has one job: explain what happens inside a songbird as fall arrives. Which sentence does NOT belong? (1) As summer ends the hours of daylight drop, and that change sets off shifts inside many songbirds. (2) The birds start eating far more than usual and store the extra as fat for the trip ahead. (3) Cities should switch off the lights in tall buildings every fall so that fewer birds crash into the windows. (4) Within a few weeks the restless birds begin flying at night, steering partly by the stars.',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Sentence 1, because the paragraph should start with the birds and not with the daylight.' },
        { id: 'b', text: 'Sentence 2, because eating is not part of migrating.' },
        { id: 'c', text: 'Sentence 3, because it argues for something people should do instead of explaining what happens inside the bird.', correct: true },
        { id: 'd', text: 'Sentence 4, because the paragraph is about fall and flying happens later.' },
      ],
      expectedAnswer:
        'Sentence 3, because it argues for something people should do instead of explaining what happens inside the bird.',
      hints: [
        'Say the job of the paragraph out loud, then test each sentence against it. Does this sentence do that one job?',
        'Three of the sentences report something that happens to the bird. One of them tells somebody what they ought to do, which is argument writing, not informative writing.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-which-structure-fits',
      kind: 'try_yourself',
      problem:
        'A writer explaining how a town skate park gets built has these notes, and they only make sense in this order. (1) Skaters bring a request to the town council. (2) A designer draws a plan and the skaters mark it up. (3) The council votes on the money. (4) Crews clear the lot and pour the concrete bowls. (5) The park opens. Which structure fits this information best?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Sequence, because the notes are stages that have to happen in a fixed order, and each one depends on the one before it.', correct: true },
        { id: 'b', text: 'Compare-contrast, because the notes mention the council, the designer and the crews.' },
        { id: 'c', text: 'Classification, because the notes are a numbered list, and a numbered list sorts things into kinds.' },
        { id: 'd', text: 'Definition, because any informative piece has to begin by explaining what a skate park is.' },
      ],
      expectedAnswer:
        'Sequence, because the notes are stages that have to happen in a fixed order, and each one depends on the one before it.',
      hints: [
        'Try swapping two of the notes around. If the piece stops making sense, the order itself is carrying the meaning.',
        'Compare-contrast needs two things being weighed against each other, and classification needs kinds being sorted. Naming several people is not comparing them, and numbering steps is not sorting them.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-informative-vs-argument',
      kind: 'misconception_check',
      question:
        'A student writing an informative piece about how sourdough starter works hands in this focus statement: "Sourdough is the best kind of bread and everybody should try making it." When asked about it, the student says: "You told us the big sentence has to be something people could argue with, and also that a bigger topic is easier because there is more to say." What went wrong?',
      commonErrors: [
        {
          answer: 'The focus statement is fine, because a good big sentence takes a side.',
          misconception:
            'Carrying the Unit 8 rule into Unit 9. A thesis for an ARGUMENT has to be debatable, so the student assumes every big sentence must be. Informative writing has the opposite requirement.',
          correctsTo:
            'Informative writing explains; it does not persuade, so its controlling idea is not a debatable claim. "Sourdough is the best kind of bread" is a side, and a reader could disagree with it. That sentence belongs in Unit 8. A focus statement for this piece names the topic and what will be shown about it: "A sourdough starter is a jar of flour and water kept alive by wild yeast, and it has to be fed on a schedule to stay strong enough to raise a loaf." Nobody argues with that. They read on to learn how.',
        },
        {
          answer: 'A bigger topic is easier, because there is more to say about it.',
          misconception:
            'Believing that width and depth are the same thing. More ground looks like more material, so the student widens the topic to make the piece feel full.',
          correctsTo:
            'It works the other way around. A broad topic forces you to give one shallow line about each part, because there is no room for anything else, and the reader finishes knowing nothing new. "Bread" is too big. "How a sourdough starter is kept alive" is small enough that you can explain the feeding, the smell and the bubbles in real detail. Narrow the topic, then go deep.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Informative writing explains; it does not persuade. Its controlling idea is not a debatable claim, and a sentence that takes a side belongs back in Unit 8.',
        'A focus statement is one sentence naming the topic AND what the piece will show about it. A topic by itself is not a focus statement.',
        'WRONG: "In this paper I will tell you about..." That announces the paper. Cross those words out and the real focus statement is usually underneath.',
        'Narrow until you can actually cover it. Broad is not easier; broad is shallow. "Dogs" is a topic, "How service dogs are trained" is a focus.',
        'Five structures: definition, process or sequence, classification, compare-contrast, cause-effect. Gather the information first, then let it choose the structure.',
        'Group related notes so each paragraph does one job, and cut any note that does not fit a job.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '9', cedTopic: '9.1', cedTitle: 'Informative Writing: Focus & Structure' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
