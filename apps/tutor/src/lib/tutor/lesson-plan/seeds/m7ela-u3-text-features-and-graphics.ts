/**
 * Grade 7 ELA — Reading Informational Text: Text Features & Graphics.
 *
 * Concept-led (CCSS RI.7.5, RI.7.7). Headings, subheadings, bold and italic
 * type, captions, sidebars, tables, charts, labeled diagrams, glossaries,
 * indexes and tables of contents — taught by the JOB each one does for a
 * reader, not by the name. The four misconceptions this lesson exists to
 * break: features are decoration you can skip; a caption repeats the picture;
 * a heading summarizes the section; a fact in a chart is also in the body.
 *
 * NOTE FOR FUTURE AUTHORS: THIS COURSE RENDERS NO IMAGES. The lesson is
 * spoken and written text only, so no item may say "look at the diagram" or
 * "using the table shown". Every artifact a question needs — a table, a page
 * of headings, a photograph and its caption — is DESCRIBED IN WORDS inside
 * the problem string, and every item is solvable from those words alone.
 * Every excerpt is original prose written for the item; this course carries
 * no passage machinery, and no published work may be quoted or paraphrased.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7ELA_U3_TEXT_FEATURES_AND_GRAPHICS: LessonPlan = {
  id: 'evelyn.ms.m7ela.text-features-and-graphics.v1',
  title: 'Text Features & Graphics',
  curriculum: 'MS',
  grade: '7',
  subject: 'ela',
  topic: 'grade-7-ela',
  locale: 'en',
  los: [
    {
      id: 'm7ela.text-features-and-graphics',
      standard: 'M7ELA-3.3',
      description:
        'Analyze how headings, subheadings, bold type, captions, sidebars, tables, charts, labeled diagrams, glossaries, indexes and tables of contents organize an informational text, and explain what each feature contributes that the body paragraphs do not (CCSS RI.7.5, RI.7.7).',
    },
  ],
  prerequisites: ['m7ela.summarizing-informational-text'],
  followUps: ['m7ela.technical-and-domain-vocabulary'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that the student already uses text features on purpose, so the lesson only names a habit they own.',
      script:
        'Your family opens a new board game. The rule booklet is twelve pages long and someone is already shuffling. You need one thing: how many cards each player starts with. You do not begin on page one. Your eyes jump down the page hunting for the word Setup, and when you find it you read four lines and you are done. That move you just made has a name. The parts of a page that are not the main sentences — the headings, the bold words, the little box off to the side, the line under a photograph, the table of numbers — are called text features. They are not decoration. Each one is doing a job for you. Today we work out what job each one does, and how a good reader uses them to get an answer fast.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-text-features',
      kind: 'concept',
      goal: 'Name the common text features by the job each performs, and set up the four traps the lesson checks.',
      keyIdeas: [
        'A TEXT FEATURE IS ANY PART OF THE PAGE THAT IS NOT THE MAIN SENTENCES — headings, subheadings, bold and italic type, captions, sidebars, tables, charts, labeled diagrams, glossaries, indexes and tables of contents. Writers add them on purpose. The right question is never "what is this called", it is "what does this let me do faster".',
        'HEADINGS AND SUBHEADINGS ARE LABELS, NOT SUMMARIES — a heading names what a section is about so you can find it, and it is often deliberately short. Subheadings sit under a heading and show how that section splits into parts. Reading the heading tells you where the answer lives. It does not tell you the answer.',
        'BOLD AND ITALIC TYPE ARE THE WRITER POINTING — bold usually marks a term that is defined nearby or in the glossary at the back, so a bold word is a promise that a definition is close. Italics usually mark emphasis, or the title of a book, film or newspaper.',
        'A CAPTION ADDS INFORMATION, IT DOES NOT REPEAT THE PICTURE — the sentence under a photograph or a diagram carries what the image cannot show: who these people are, where it was taken, what year, how big the thing really is, why it matters. If a caption only said what you can already see, there would be no reason to print it.',
        'A TABLE, A CHART OR A LABELED DIAGRAM IS PART OF THE TEXT, NOT AN EXTRA — it holds facts of its own. Very often a number appears ONLY there and never in the paragraphs, because a paragraph is a slow way to list eight opening times. Skipping the table means skipping information the writer expected you to read.',
        'THE FINDING TOOLS DO THREE DIFFERENT JOBS — a table of contents sits at the front and lists the sections in the order they appear, so use it when you want a whole topic. An index sits at the back and lists specific words in alphabetical order with every page number where each one appears, so use it when you already know the exact word you want. A glossary also sits at the back and gives the meaning of the terms used in the book, so use it when a word is new.',
      ],
      vocabulary: [
        { term: 'text feature', definition: 'any part of a page other than the main sentences, added to help a reader find or understand information.' },
        { term: 'heading', definition: 'a short label above a section that names what the section is about.' },
        { term: 'caption', definition: 'the line of text beside or under an image that tells the reader what the image cannot show by itself.' },
        { term: 'sidebar', definition: 'a small boxed piece of text set apart from the main article, holding a related story, list or extra fact.' },
        { term: 'glossary', definition: 'an alphabetical list at the back of a book giving the meaning of the terms used in it.' },
        { term: 'index', definition: 'an alphabetical list at the back of a book giving the page numbers where each specific word appears.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-headings-route-a-question',
      kind: 'worked_example',
      problem:
        'Here is a page from a field guide, described in words. The page has one heading, "How a Seed Travels". Under that heading are three subheadings, in this order: "By Wind", "By Water", "By Animal". A reader wants to know how a coconut reaches an island where no coconut palm has ever grown. Which subheading should the reader go to, and what does the heading structure tell us before we read a single paragraph?',
      steps: [
        'Start with the heading. "How a Seed Travels" is a label. It tells us the topic of the whole section is seed movement. It does not tell us any fact about any seed yet.',
        'Now read the subheadings as a set: By Wind, By Water, By Animal. Three subheadings under one heading means the writer has split the topic three ways, and those three are the three ways this book says seeds move.',
        'That set is useful on its own. Before reading one sentence we already know this section will not discuss seeds travelling in trucks or in the post, because there is no subheading for that.',
        'Match the question to the split. A coconut crossing to an island is not being carried by wind and there is no animal swimming it over. It floats. So the answer lives under "By Water".',
        'Notice what we did NOT do. We did not read the whole section and hope. We used the labels to jump straight to one paragraph, which is exactly the job subheadings are printed to do.',
        'One warning. "By Water" is a label, not a summary. It does not tell us HOW long a coconut floats or WHERE it lands. To learn that we still have to read the paragraph underneath it.',
      ],
      answer:
        'Go to the subheading "By Water". The heading names the topic as seed movement, and the three subheadings show the writer splits that topic into wind, water and animal — so the floating coconut belongs under water. The subheading points to the paragraph; it does not replace it.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-caption-adds-information',
      kind: 'worked_example',
      problem:
        'Here is a photograph and a caption from an invented town newsletter, both described in words. The photograph shows a wooden footbridge over a creek, with two people walking across it. The caption under the photograph reads: "The footbridge at Elm Creek, rebuilt by volunteers after the flood. A sign at each end asks walkers to cross no more than six at a time." The article beside the photograph is about a plan to add a bike path along the creek and never mentions the bridge. What does the caption give a reader that neither the photograph nor the article gives?',
      steps: [
        'List what the photograph alone can show: a wooden bridge, a creek, two people walking. That is everything an image can carry — things a camera can see.',
        'Now list what the caption says: the bridge has a name and a place, Elm Creek. It was rebuilt. Volunteers rebuilt it. There was a flood. Signs limit the crossing to six people at a time.',
        'Cross off anything that is on both lists. A bridge over a creek is on both, so that part of the caption is only there to tell you which image it belongs to.',
        'What is left is the caption doing its real job. A photograph cannot show who built something, or that it was rebuilt rather than built, or that a flood happened before the picture was taken, or what a sign at the far end says.',
        'Now check the article. The article is about a bike path and does not mention the bridge at all. So the flood, the volunteers and the six-person limit appear NOWHERE else on the page.',
        'That is the point to take away. WRONG: "the caption just tells me what the picture shows, so I can skip it." CORRECT: the caption is often the only place a fact lives, and a reader who skips captions loses those facts completely.',
      ],
      answer:
        'The caption adds the name and location of the bridge, the fact that it was rebuilt, that volunteers did the rebuilding, that a flood came before, and the six-person limit posted on the signs. None of that is visible in the photograph and none of it appears in the article, so the caption is the only source for it.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-table-holds-the-fact',
      kind: 'try_yourself',
      problem:
        'A page of an invented community newsletter has a paragraph and a table beside it, both described here in words.\n\nThe paragraph reads: "The library is the quietest place in town to do homework after school. A librarian sits at the front desk whenever the doors are open, and anyone may ask for help finding a book."\n\nThe table is titled "Library Hours" and has two columns, Day and Hours. The rows read: Monday, 9 to 5. Tuesday, 9 to 8. Saturday, 10 to 2.\n\nA student wants to know the latest they can stay in the library on a Tuesday. Where is the answer, and why?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'In both, because any fact printed in a table is also stated somewhere in the paragraph.' },
        { id: 'b', text: 'In the paragraph, because the paragraph is about doing homework after school.' },
        { id: 'c', text: 'The page does not answer it, so the student would have to ask the librarian.' },
        { id: 'd', text: 'In the table, because the closing times appear there and nowhere else on the page.', correct: true },
      ],
      expectedAnswer: 'In the table, because the closing times appear there and nowhere else on the page.',
      hints: [
        'Read the paragraph again and hunt for a time. Then read the table rows again and hunt for a time. Only one of them has a number in it.',
        'A table is part of the text, not an extra. When the number is only in the table, the table is the answer.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-caption-versus-picture',
      kind: 'try_yourself',
      problem:
        'A photograph in an invented school newsletter is described this way: a line of students kneel along a wire fence, each holding a small leafy plant, with a pile of soil behind them.\n\nThe caption under the photograph reads: "Seventh graders plant the new hedge along the field fence, three weeks before the first frost."\n\nWhich piece of information does the caption give that the photograph alone could not?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'That there is a fence next to the students.' },
        { id: 'b', text: 'That the students are putting plants into the ground.' },
        { id: 'c', text: 'The time of year the planting happened.', correct: true },
        { id: 'd', text: 'How tall the hedge will grow once it is finished.' },
      ],
      expectedAnswer: 'The time of year the planting happened.',
      hints: [
        'Make two lists. What can a camera see here? What does the caption say? Then cross off anything that is on both lists.',
        'One choice names something the caption never mentions at all. Two choices name things the photograph already shows. That leaves one.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-choose-the-finding-tool',
      kind: 'try_yourself',
      problem:
        'An invented book about weather has three finding tools, described here in words. At the front is a table of contents listing five chapters in this order: "Clouds", "Rain", "Snow", "Wind", "Storms". At the back is a glossary that gives the meaning of the weather terms used in the book. Also at the back is an index that lists words in alphabetical order with the page numbers where each word appears.\n\nA reader wants to find every page in the book that mentions hail. Which tool should the reader use?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The glossary, because it will explain what hail is.' },
        { id: 'b', text: 'The table of contents, because hail is a kind of weather and so it will be one of the chapters.' },
        { id: 'c', text: 'The index, because it lists the exact word alphabetically with every page number where it appears.', correct: true },
        { id: 'd', text: 'The chapter called Storms, because hail falls during storms.' },
      ],
      expectedAnswer: 'The index, because it lists the exact word alphabetically with every page number where it appears.',
      hints: [
        'The reader already knows the word. They do not need it defined and they do not want one chapter. They want a list of pages.',
        'Compare the jobs. Contents gives sections in order. Glossary gives meanings. Only one of the three gives page numbers for a specific word.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-features-are-decoration',
      kind: 'misconception_check',
      question:
        'A student says: "When I read an article I read the paragraphs. The headings, the bold words, the caption and the chart are just decoration, so I skip them. And if I do read a heading, that heading tells me what the section says." Name what went wrong.',
      commonErrors: [
        {
          answer: 'The headings, captions, sidebars and charts are decoration, so I only read the paragraphs.',
          misconception:
            'Treating text features as design added by a printer, rather than as part of the text that the writer chose to put there.',
          correctsTo:
            'Every feature on the page was placed by the writer to do a job, and some of them hold facts that appear nowhere else. A caption carries what a photograph cannot show, such as the year or who the people are. A table carries the numbers because listing eight opening times in a sentence would be painful to read. A bold word is a signal that its definition is nearby. Skipping those parts does not save time. It removes information from the article and leaves the reader with holes they do not know are there.',
        },
        {
          answer: 'The heading tells me everything the section says, so once I have read the heading I can move on.',
          misconception:
            'Reading a heading as a summary of the section instead of as a label that names the topic.',
          correctsTo:
            'A heading is a label, and it is usually kept short on purpose so that a reader scanning the page can spot it. "By Water" tells you that this paragraph is about seeds that float. It does not tell you which seeds, how far they travel or how long they last in salt water. Use the heading to decide WHERE to read, then read the paragraph underneath to learn WHAT it says. A summary is something you write after reading the section, not something the writer printed above it.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A text feature is any part of the page that is not the main sentences, and every one of them is doing a job for the reader.',
        'Headings and subheadings are labels that tell you WHERE the answer lives. They are not summaries of the section.',
        'A caption adds what the image cannot show — who, where, when, how big, why it matters. It does not repeat the picture.',
        'Tables, charts and labeled diagrams are part of the text. A fact printed there is often printed nowhere else, so read them.',
        'Contents at the front lists sections in order. An index at the back gives page numbers for a specific word. A glossary at the back gives meanings.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '3', cedTopic: '3.3', cedTitle: 'Text Features & Graphics' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
