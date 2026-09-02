/**
 * Grade 6 ELA — Reading Literature: Plot, Character & Structure: How a Scene
 * Fits the Whole Story.
 *
 * CONCEPT-LED row in the m6ela fan-out. The student arrives with no procedure
 * to lean on, so the whole lesson builds one way of reading: a sentence,
 * paragraph or scene has a JOB for the rest of the story, and that job is
 * something you find by holding the whole story in mind — what comes before
 * the part, what comes after it, and what the ending would stop making sense
 * without (CCSS RL.6.5). Because the skill itself is "how a part fits the
 * whole," every item in this file prints its story in full, numbered sentence
 * by sentence, rather than the usual short fragment — the "fits the whole"
 * judgment is only available to the student if the whole short story is on
 * the page. Three traps this plan is built to kill: naming a plot STAGE
 * ("it is the rising action") and mistaking that location for a job; naming a
 * SUMMARY of the part (restating what happens in it) and mistaking that for a
 * job; and describing a character's trait or feeling instead of what the
 * sentence does for the rest of the story.
 *
 * SCOPE GUARD: Grade 6 row 1.4 analyzes how one sentence, paragraph or scene
 * fits into a text's overall structure and contributes to the development of
 * its plot, its setting, or the point the whole story is building toward
 * (RL.6.5), using a short, self-contained story printed in full inside every
 * item so the "fits the whole" judgment is actually available from the words
 * on the page. DELIBERATELY EXCLUDED: naming or working through the plot
 * stages exposition, rising action, climax and resolution as their own
 * procedure — that is row 1.2's job, and this file never defines, orders or
 * teaches those stages; describing how a character responds to events or
 * changes over the course of the plot — that is row 1.3's job, and no correct
 * answer in this file describes a character's feeling, trait or change, only
 * what a sentence does for the sentences around it; the theme-naming
 * procedure of topic-versus-theme, the build-a-theme-from-details method and
 * the two-details test — that is row 2.1's job, and the one item here that
 * touches the theme strand is told what point the story is building toward
 * inside its own prompt, and only asks how one sentence contributes to
 * reaching it, never asking the student to determine or state a theme from
 * scratch; and RL.7.3's analysis of how one story element shapes another —
 * the setting item here treats a setting detail as something reused later
 * (a setup that a later sentence pays off), never as a device that shapes a
 * character's personality or the plot's causation. DELIBERATELY ALLOWED,
 * because rows 1.2 and 1.3 sit immediately next to this one in the same unit:
 * this file uses the ordinary words "plot" and "scene" throughout, the way
 * the standard itself does, and a worked example, a try_yourself distractor
 * and the misconception check all name "rising action" specifically — but
 * only where the term is being corrected or contrasted against the job-based
 * answer that replaces it, never presented as sufficient on its own and never
 * defined, ordered or taught as a procedure anywhere in this file.
 *
 * NOTE FOR FUTURE AUTHORS: every story in this file is original prose written
 * for the item. This course carries no passage machinery — no passageId, no
 * shared texts — so each question must be solvable from the sentences
 * printed inside it, and no published work may be quoted or closely
 * paraphrased. Every phrase this file puts inside quotation marks appears
 * character-for-character in the numbered sentence it is drawn from; quote
 * your own sentences exactly, never from memory. Every story here is printed
 * in full and numbered sentence by sentence, because this row's own skill —
 * judging how one sentence fits a whole story — is unavailable unless the
 * whole story is on the page; do not shorten a future revision's excerpts
 * down to an unnumbered fragment.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6ELA_U1_HOW_A_SCENE_FITS_THE_WHOLE_STORY: LessonPlan = {
  id: 'evelyn.ms.m6ela.how-a-scene-fits-the-whole-story.v1',
  title: 'How a Scene Fits the Whole Story',
  curriculum: 'MS',
  grade: '6',
  subject: 'ela',
  topic: 'grade-6-ela',
  locale: 'en',
  los: [
    {
      id: 'm6ela.how-a-scene-fits-the-whole-story',
      standard: 'M6ELA-1.4',
      description:
        'Analyze how one sentence, chapter, or scene fits into a text\'s overall structure and contributes to the development of its theme, setting, or plot (CCSS RL.6.5).',
    },
  ],
  prerequisites: ['m6ela.how-characters-respond-and-change'],
  followUps: ['m6ela.theme-and-objective-summary'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the student feel why judging a part requires holding the whole story in mind.',
      script:
        'Think of a movie scene that feels almost pointless the first time you watch it — maybe a character stops to fix a bike chain, or somebody mentions an old key kept in a drawer. It barely seems worth the screen time. Then, an hour later, that same bike is the one thing fast enough to reach the fire station in time, or that same key is the one that opens the door everyone has been stuck outside of. The scene was never pointless. It was doing a job you could not see yet, because you did not have the whole movie in your head. Reading a story works the same way. To say how one sentence, paragraph or scene fits into a story, you need to hold the whole story in mind at once — what comes before it, and what comes after. That is what we practice today.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-job-not-location-or-summary',
      kind: 'concept',
      goal: 'Install what "fits the whole story" means, and how to tell a structural job apart from a location label or a summary.',
      keyIdeas: [
        'A TEXT\'S OVERALL STRUCTURE IS HOW ITS PARTS CONNECT TO EACH OTHER, NOT JUST THE ORDER THEY COME IN. Almost every sentence, paragraph or scene does a job for the parts that come before or after it. A part can set up a detail the plot needs later, establish something about the setting that matters again, or add a piece to what the whole story is building toward.',
        'TO FIND THE JOB, HOLD THE WHOLE STORY IN YOUR HEAD, NOT JUST THE ONE PART. Ask three questions in order: what happens right before this part, what happens right after it, and what would stop making sense in the ending if this part were cut out?',
        'A JOB IS NOT THE SAME AS A LOCATION. Saying a part is near the beginning, the middle or the end tells you where it sits. It does not tell you what the part does for the rest of the story. WRONG: naming that a sentence sits in the middle of the story. CORRECT: naming the later moment that depends on it.',
        'A JOB IS NOT THE SAME AS A SUMMARY. Repeating what happens in a part answers a different question than the one this lesson asks. WRONG: an answer that only restates what a sentence says. CORRECT: an answer that names the later sentence whose meaning depends on it. If your answer would still be true for a reader who had not finished the story yet, it is a summary, not a structural job.',
        'A PART CAN CONTRIBUTE TO PLOT, SETTING, OR THEME. A plot job sets up a detail an ending needs. A setting job establishes a place, or a detail about a place, that matters again later. A theme job adds a piece to what the whole story is showing, beyond just what happened in it.',
        'WHATEVER JOB YOU NAME, PROVE IT BY POINTING AT THE LATER MOMENT THAT NEEDS IT. A part can technically do more than one job, but you should always be able to point to a specific place, later in the text, where the job you named actually pays off.',
      ],
      vocabulary: [
        { term: 'overall structure', definition: 'how the parts of a text connect to each other from beginning to end, not just the order they appear in.' },
        { term: 'job (of a part)', definition: 'what a sentence, paragraph or scene does for the rest of the story, separate from what happens inside that part.' },
        { term: 'setup', definition: 'a detail placed early in a text that a later moment in the story depends on.' },
        { term: 'payoff', definition: 'the later moment in a text where a setup planted earlier actually matters.' },
        { term: 'setting', definition: 'the time and place of a story, including any detail about it that can matter again later.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-plot-setup-and-payoff',
      kind: 'worked_example',
      problem:
        'How does Sentence 2 fit into the overall structure of this story?\n\nSentence 1: "Every summer, Priya and her older brother Sam ran a lemonade stand at the end of their driveway, and every summer their metal cash box got so hot in the sun that the lid stuck shut by noon."\nSentence 2: "Priya started keeping a small tub of cooking oil in her backpack and rubbed a drop on the hinge each morning before they opened the stand."\nSentence 3: "In late July, a man buying four lemonades pulled out a fifty-dollar bill and asked for change, and Sam needed the box open fast because a line was forming behind him."\nSentence 4: "The lid popped open on the first try, and Sam counted out the change before the man\'s ice melted."',
      steps: [
        'Read all four sentences first, so you have the whole story before judging any one part of it.',
        'Look at what comes before Sentence 2: the cash box gets so hot that the lid sticks shut every summer. That is a problem the story has already introduced.',
        'Look at what comes after Sentence 2: in Sentence 3, Sam needs the box open fast with a line forming, and in Sentence 4, the lid pops open on the first try.',
        'Ask what would stop making sense if Sentence 2 were cut. Without it, Sentence 4\'s easy opening happens for no reason at all — nothing in the story explains why the box did not stick that day.',
        'Name the job: Sentence 2 sets up a detail, the oiled hinge, that Sentence 4\'s ending depends on. That makes Sentence 2 a setup, and Sentence 4 its payoff.',
        'Reject the look-alike wrong answers. Restating Sentence 2 — saying only that Priya keeps oil in her backpack — is a summary, not a job. Naming where the sentence sits, such as calling it the middle of the story, is a location, not a job. CORRECT: Sentence 2 sets up the oiled hinge that Sentence 4 needs, so the box opens easily right when Sam needs it to.',
      ],
      answer:
        'Sentence 2 sets up a detail — the oiled hinge — that the story\'s ending depends on. Sentence 4 is where that setup pays off: the lid pops open on the first try because Priya had been oiling it every morning.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-job-not-a-stage',
      kind: 'worked_example',
      problem:
        'A student was asked how Sentence 2 fits into the story below, and answered: "It is the rising action, right before the climax." Explain what is missing from that answer, then give an answer that actually describes Sentence 2\'s job.\n\nSentence 1: "For two weeks, Yusuf left his robot\'s bent front wheel alone because the science fair was still far off and the wheel only wobbled a little on his kitchen floor."\nSentence 2: "Ms. Petrov, the club sponsor, warned him that judges test every robot on the same day it will run, not on a day it happens to work."\nSentence 3: "On the morning of the fair, the wheel wobbled in front of three judges and cost Yusuf fifteen seconds on the course."\nSentence 4: "He finished last of the six robots that ran the course that morning."',
      steps: [
        'Notice what the student\'s answer names: rising action is a stage in the plot\'s shape, not a job for the story. It says where Sentence 2 sits, not what it does.',
        'Read the whole story again. Sentence 1 already tells us the wheel is bent and nothing is done about it. Sentence 2 adds a warning about how judges test robots.',
        'Ask what Sentence 4 needs from Sentence 2. For the last-place finish to read as a result rather than bad luck, the reader needs to already know, from Sentence 2, that a warning about testing conditions existed.',
        'Name the job: Sentence 2 sets up a warning that stays unresolved, so that Sentence 3\'s wobble and Sentence 4\'s last-place finish read as the outcome of that gap rather than an accident.',
        'Reject the location-only answer and a summary-only answer too. Naming the plot stage only tells you where Sentence 2 sits. Saying only that Ms. Petrov warns Yusuf about testing conditions restates Sentence 2 without saying what it does for Sentences 3 and 4.',
        'Correct answer: Sentence 2 plants a warning that stays unresolved, and that gap is what makes Sentence 4\'s last-place finish read as a consequence rather than an accident — that is its job in the story\'s structure, not its position as the rising action.',
      ],
      answer:
        'Sentence 2 sets up a warning that is never acted on. That unresolved gap is what makes Sentence 4\'s last-place finish read as a consequence rather than bad luck, which is its job in the story\'s structure — not just its position as the rising action.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-plot-setup',
      kind: 'try_yourself',
      problem:
        'How does Sentence 1 fit into the overall structure of this story?\n\nSentence 1: "Every Friday after school, Noor fed the classroom goldfish exactly three flakes, no more, because the tank had flooded once when someone dumped in a whole handful."\nSentence 2: "In April, a new student named Faisal offered to feed the fish while Noor was at a dentist appointment, and Noor told him about the three-flake rule before she left."\nSentence 3: "The next Monday, the tank was cloudy and one of the two fish was gone, and the teacher asked what had happened while Noor was out."\nSentence 4: "Faisal admitted he had dropped in a big pinch because the fish looked hungry, and the class started keeping the food measured out in a labeled cup after that."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Noor feeds the classroom goldfish exactly three flakes every Friday after school.' },
        { id: 'b', text: 'It sets up the reason overfeeding causes a problem, so that the cloudy tank after Faisal\'s big pinch in Sentence 4 reads as a result rather than a coincidence.', correct: true },
        { id: 'c', text: 'It shows that Noor is a careful, responsible student who pays attention to small rules.' },
        { id: 'd', text: 'It sets up how new Faisal is to the class, so that his big pinch in Sentence 4 reads as the honest mistake of someone who had never been told about the three-flake rule.' },
      ],
      expectedAnswer: 'It sets up the reason overfeeding causes a problem, so that the cloudy tank after Faisal\'s big pinch in Sentence 4 reads as a result rather than a coincidence.',
      hints: [
        'Ask what happens later in the story that this sentence explains. Two of the choices only describe Noor, or repeat what she does, without saying what the sentence sets up.',
        'Find the exact detail in Sentence 4 that only makes sense because of the flood story told in Sentence 1.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-setting-detail',
      kind: 'try_yourself',
      problem:
        'How does Sentence 1 fit into the overall structure of this story?\n\nSentence 1: "The Diaz family moved into a house two blocks from the ocean, and the first thing Mateo noticed was how loud the waves sounded at night through his open window, so loud that he kept the window shut for the first week."\nSentence 2: "During a storm in October, the town\'s power went out, and Mateo\'s little sister was scared of the dark."\nSentence 3: "Mateo opened his window so they could hear the waves instead of the silence, and he told her the ocean was still out there, the same as always, no matter what the lights did."\nSentence 4: "She fell asleep before the power came back on."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The Diaz family moves into a house two blocks from the ocean, and Mateo hears the waves at night.' },
        { id: 'b', text: 'It shows that Mateo does not like loud noises and prefers a quiet room.' },
        { id: 'c', text: 'It establishes the sound of the ocean at night as a detail about the setting, which becomes the exact thing Mateo uses to comfort his sister when the power goes out in Sentence 2.', correct: true },
        { id: 'd', text: 'It sets up Mateo\'s fear of the dark, so that his little sister being scared when the power goes out in Sentence 2 reads as a fear he already understands from his own first week in the house.' },
      ],
      expectedAnswer: 'It establishes the sound of the ocean at night as a detail about the setting, which becomes the exact thing Mateo uses to comfort his sister when the power goes out in Sentence 2.',
      hints: [
        'Ask what later moment in the story needs the reader to already know that the ocean is loud at night. Two of the choices describe Mateo or restate what happened instead of answering that.',
        'Find the exact sentence where the ocean sound comes back and does a job for the story.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-theme-turning-point',
      kind: 'try_yourself',
      problem:
        'This story is building toward a point about how people take care of a shared space. How does Sentence 2 fit into the overall structure of the story?\n\nSentence 1: "The birdbath in Fernwood Park had a long crack down one side, and for two summers nobody in the neighborhood did anything about it except step around the puddle it left on the path."\nSentence 2: "One Saturday morning, a boy named Deshawn came early with a tube of pond sealant from his uncle\'s shed and patched the crack himself, without telling anyone."\nSentence 3: "By the next week, a woman named Mrs. Okafor had noticed the fix and left a bag of birdseed on the bench beside it."\nSentence 4: "By the end of the summer, someone had planted marigolds around the base of the birdbath, and a different family had built a small sign that read PLEASE REFILL, and nobody ever found out who did which part."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Deshawn comes early one Saturday with a tube of pond sealant and patches the crack himself.' },
        { id: 'b', text: 'It shows that Deshawn is a generous person who helps without being asked.' },
        { id: 'c', text: 'It is the moment the neighborhood agrees to fix the birdbath together, so the birdseed, the marigolds and the sign in Sentences 3 and 4 all come out of one shared plan.' },
        { id: 'd', text: 'It is the turning point the rest of the story builds on: one quiet, unclaimed fix leads to birdseed, marigolds and a sign, so the story\'s point about a shared space grows outward from this single sentence.', correct: true },
      ],
      expectedAnswer: 'It is the turning point the rest of the story builds on: one quiet, unclaimed fix leads to birdseed, marigolds and a sign, so the story\'s point about a shared space grows outward from this single sentence.',
      hints: [
        'Ask what happens after Sentence 2, one addition at a time, and notice that nobody in Sentences 3 and 4 is asked or thanked by name.',
        'Two of these choices only restate what Deshawn does or say something about Deshawn himself, and one describes a shared plan the story never shows anybody making. Find the choice that says what Sentence 2 causes.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-stage-and-summary',
      kind: 'misconception_check',
      question:
        'A student read this story and was asked how Sentence 2 fits into its overall structure.\n\nSentence 1: "The Ortiz family\'s van would not start on the morning of the move, so twelve-year-old Sam borrowed his neighbor\'s wagon to haul boxes the four blocks to the new apartment by himself."\nSentence 2: "Two blocks in, the wagon\'s back wheel came off, and Sam had to carry the last two boxes the rest of the way in his arms."\nSentence 3: "When the movers finally got the van running that afternoon, Sam\'s mother asked why the porch was already empty."\nSentence 4: "Sam just said he had found another way."\n\nThe student answered: "It is the rising action, and it means the wagon wheel comes off and Sam carries the boxes himself." What is wrong with each part of that answer?',
      commonErrors: [
        {
          answer: 'It is the rising action.',
          misconception:
            'Naming the plot stage instead of the job. Rising action says where Sentence 2 sits in the story\'s shape, and it sounds like a real literary answer, so it is easy to mistake for a finished one.',
          correctsTo:
            'A stage name tells you location, not job. Ask what later sentence depends on Sentence 2. Sentence 4 only makes sense, without Sam having to explain himself, because the reader already knows from Sentence 2 that he solved the problem alone and the hard way. That dependency, not the stage name, is the actual answer.',
        },
        {
          answer: 'it means the wagon wheel comes off and Sam carries the boxes himself.',
          misconception:
            'Repeating the event instead of saying what it contributes to the whole story. The sentence is true, which makes it feel like an answer, but it only restates what Sentence 2 says.',
          correctsTo:
            'The job is what Sentence 2 does for the sentences around it, not what happens inside it. Sentence 2 sets up the exact effort behind Sam\'s short answer in Sentence 4, so that "he had found another way" carries the whole story instead of needing an explanation.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A part\'s job is what it does for the rest of the story, not just what happens inside it or where it sits.',
        'To find the job, check what comes right before the part, what comes right after it, and what would stop making sense in the ending without it.',
        'A location is not a job. WRONG: naming that a sentence is in the rising action or in the middle of the story. CORRECT: naming the later moment that depends on it.',
        'A summary is not a job either. If your answer would still be true for a reader who had not finished the story, you have restated the part instead of explaining its job.',
        'A part can contribute to plot (a setup an ending needs), setting (a detail about a place that matters again), or theme (a piece of what the whole story is building toward).',
        'Prove any job you name by pointing at the exact later place in the text where it pays off.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '1', cedTopic: '1.4', cedTitle: 'How a Scene Fits the Whole Story' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
