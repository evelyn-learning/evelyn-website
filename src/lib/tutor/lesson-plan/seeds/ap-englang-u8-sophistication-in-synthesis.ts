/**
 * AP English Language & Composition — CED Unit 8.4: Sophistication in
 * Synthesis.
 *
 * The capstone of the unit and one of the highest-value moves on the real
 * AP Lang rubric: bringing together credibility awareness (8.1), handling
 * genuine disagreement (8.2), and qualification (8.3) into a single,
 * nuanced synthesis stance that SITUATES multiple sources in a broader
 * conversation — showing how they relate to each other across time and to
 * the issue beyond the texts themselves — rather than treating them as a
 * list of separately-supported points. The trap this topic targets is
 * competent-but-surface-level synthesis: an essay that executes evidence,
 * disagreement-handling, and qualification well, but never steps back to
 * say what the SOURCES TOGETHER reveal that no single source states alone.
 *
 * See docs/superpowers/specs/2026-07-10-ap-eng-lang-design.md §2 for the
 * humanities segment semantics (try_yourself PARAGRAPH grain: responseFormat
 * 'free', rubric = Evidence + Commentary parts summing to 6) this plan
 * follows.
 *
 * Anchor text: Abraham Lincoln, "The Gettysburg Address" (1863) —
 * evelyn.passage.lincoln-gettysburg.v1 (primary passageId) — read together
 * with Patrick Henry's 1775 speech and Frederick Douglass's 1852 speech,
 * both discussed in prose as the full three-source set spanning 88 years.
 * Quotes are limited to the short structural/rhetorical phrases already used
 * as anchor evidence for these speeches elsewhere in the course.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_ENGLANG_U8_SOPHISTICATION_IN_SYNTHESIS: LessonPlan = {
  id: 'evelyn.ap.englang.sophistication-in-synthesis.v1',
  title: 'U8.4 Sophistication in Synthesis',
  curriculum: 'AP',
  grade: '11',
  subject: 'ela',
  topic: 'ap-english-language',
  locale: 'en',
  los: [
    {
      id: 'apenglang.sophistication-in-synthesis',
      description:
        'Construct a nuanced synthesis position that situates multiple sources within a broader conversation across time, stepping back to state what the sources reveal together that no single source states alone.',
      standard: 'AP-ENGLANG-8.4',
    },
  ],
  prerequisites: ['apenglang.qualifying-with-sources', 'apenglang.synthesis-line-of-reasoning'],
  followUps: [],
  estimatedMinutes: 23,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Get students to feel the difference between three separate exhibits and a single museum tour that connects them.',
      script:
        "Imagine a museum room with three plaques next to three paintings, each perfectly informative on its own — dates, artist, style. Now imagine a guide who instead says: 'notice how this second painting is answering the first one, and the third is revising what both of them assumed' — suddenly you're not looking at three separate objects, you're following ONE conversation across decades. Everything you've built so far in this unit — checking a source's credibility, handling disagreement, qualifying a claim — gets you three well-supported points. Sophistication is the guide's move: stepping back to say what the whole SEQUENCE reveals that no single piece states on its own.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-situating-in-a-broader-conversation',
      kind: 'concept',
      goal: 'Define sophistication as situating sources in a broader conversation across time, and name the surface-level trap it replaces.',
      keyIdeas: [
        "SOPHISTICATION in synthesis is not extra vocabulary or a longer thesis — it is showing the sources are in a CONVERSATION with each other and with the broader issue, not just serving as separate pieces of evidence lined up for one claim.",
        "SITUATING IN A BROADER CONVERSATION means identifying the larger question or tradition the sources are all responding to — even across decades — and showing how each source EXTENDS, REVISES, or ANSWERS the one(s) before it.",
        "A sophisticated synthesis essay often traces a THROUGH-LINE across time: e.g. Henry's demand for liberty (1775) sets the terms; Douglass's 1852 speech reveals who was excluded from that promise; Lincoln's 1863 address concedes the promise is still \"unfinished\" — read together as stages of one ongoing national argument, not three separate opinions on liberty.",
        "Sophistication also means naming WHY the tension, qualification, or credibility question surfaced earlier in the unit actually MATTERS to the larger stakes of the issue — not just resolving it and moving on to the next paragraph.",
        "THE SURFACE-LEVEL TRAP: an essay that competently executes evidence-and-commentary, handles disagreement, and qualifies its claim, yet still reads as a LIST of separate, well-supported points rather than a single argument that has genuinely thought about how the sources relate to each other and to the world beyond the texts.",
        "ONE RELIABLE MOVE: end a key paragraph (or the essay) by stepping back to state what the sources TOGETHER reveal that no single source states on its own — the through-line itself becomes part of the thesis, not just a transition sentence.",
        "Sophistication is the rarest, highest-scoring row on the real AP Lang rubric — it rewards this stand-back move specifically, not more sources, longer paragraphs, or fancier phrasing.",
      ],
      vocabulary: [
        { term: 'sophistication', definition: 'showing that sources are in conversation with each other and the broader issue, not merely serving as separate support.' },
        { term: 'broader conversation', definition: 'the larger, shared question or tradition multiple sources are all responding to, even across different eras.' },
        { term: 'through-line', definition: 'a claim traced across sources in sequence, where each extends, revises, or answers the one(s) before it.' },
        { term: 'stand-back move', definition: "stepping back to state what sources reveal TOGETHER that no single source states alone." },
      ],
      passageId: 'evelyn.passage.lincoln-gettysburg.v1',
      estimatedMinutes: 6,
    },
    {
      id: 'worked-through-line-three-sources',
      kind: 'worked_example',
      problem:
        "Using all three: Patrick Henry's 1775 call to arms, Frederick Douglass's 1852 indictment of a holiday that excludes him, and Lincoln's 1863 concession that the nation's work remains \"unfinished\" (Henry's and Douglass's speeches are discussed here in prose — this segment type carries no passageId field; the resolved texts are evelyn.passage.henry-give-me-liberty.v1 and evelyn.passage.douglass-fourth-of-july.v1), build a sophisticated synthesis claim that situates these three texts in a broader conversation about American liberty, rather than treating them as three separate opinions.",
      steps: [
        "NAME THE BROADER QUESTION ALL THREE ARE RESPONDING TO, ACROSS 88 YEARS. Not \"what is liberty\" in the abstract, but: once a nation declares liberty its founding promise, who actually receives it, and who has to keep fighting for it?",
        "TRACE THE THROUGH-LINE STAGE BY STAGE. Henry (1775) sets the terms: liberty must be won through direct, urgent action. Douglass (1852) exposes the terms' limit: winning liberty in principle from Britain did not extend it in practice to enslaved Americans. Lincoln (1863) concedes the gap directly: the \"unfinished work\" is not a rhetorical flourish but an admission that the promise remains incomplete.",
        "NAME WHAT NO SINGLE SOURCE STATES ALONE. Read individually, each text argues its own moment's case. Read TOGETHER, in sequence, they reveal that \"winning\" liberty was never a single, completed event — each generation reopens some version of the fight Henry describes, on behalf of whoever the previous fight excluded.",
        "STATE THE STAND-BACK CLAIM. American liberty, as this sequence shows, is not a possession secured once (1775) and passively inherited afterward — it is a promise perpetually reopened, by whoever it has failed to include, in terms each era's Henry, Douglass, or Lincoln must state anew.",
        "VERIFY SOPHISTICATION, NOT SUMMARY. This claim could not be made by any one text alone — it depends on reading the sequence and disagreement across all three as itself the evidence for a claim about how liberty actually operates across American history.",
      ],
      answer:
        "Read individually, Henry demands liberty through force, Douglass exposes who was excluded from it, and Lincoln admits the work remains unfinished — three separate, well-supported points. Read together, across 88 years, they reveal something none states alone: that securing liberty was never a single completed event but a promise perpetually reopened by whoever it has failed to include, restated in each era's own terms.",
      estimatedMinutes: 6,
    },
    {
      id: 'try-sophistication-paragraph',
      kind: 'try_yourself',
      problem:
        "Using Lincoln's Gettysburg Address (evelyn.passage.lincoln-gettysburg.v1) together with Henry's 1775 speech and Douglass's 1852 speech (both referenced in prose — Henry's \"we must fight!\" and Douglass's \"this Fourth of July is yours, not mine\" are the relevant lines if you need reminders), write ONE paragraph that makes a SOPHISTICATED synthesis claim: situate all three texts in a single, broader conversation about American liberty across the 88 years they span, and state what the SEQUENCE reveals that no single text states alone. Include specific evidence from at least two of the three sources, and commentary that explicitly steps back to name the through-line — do not simply describe each source in turn.",
      responseFormat: 'free',
      passageId: 'evelyn.passage.lincoln-gettysburg.v1',
      rubric: {
        parts: [
          {
            criterionId: 'evidence',
            maxPoints: 3,
            scoringCriteria:
              "Full credit (3): the paragraph cites specific, accurately-quoted or precisely-named evidence from AT LEAST TWO of the three sources (e.g. Henry's \"we must fight!\", Douglass's \"this Fourth of July is yours, not mine\", Lincoln's \"unfinished work\" or \"new birth of freedom\") clearly tied to a through-line claim about liberty across time. Partial credit (1-2) for evidence from only one source, or evidence from two+ that is vague or loosely connected to a through-line. No credit for no evidence, evidence that misquotes or misattributes any passage, or evidence that doesn't serve a claim about the sources' relationship to each other.",
            modelResponse:
              "Henry's 1775 declaration that \"we must fight!\" wins liberty as a matter of principle; Douglass's 1852 rebuke that \"this Fourth of July is yours, not mine\" exposes who that principle excluded; Lincoln's 1863 admission of \"unfinished work\" concedes, in the nation's own voice, that the gap Douglass named still had not closed.",
          },
          {
            criterionId: 'commentary',
            maxPoints: 3,
            scoringCriteria:
              "Full credit (3): commentary explicitly performs the STAND-BACK MOVE — naming a through-line or broader conversation the sources are jointly part of across their 88-year span, and stating a claim that COULD NOT be made from any single source alone (e.g. that liberty is not secured once but perpetually reopened by whoever it excludes). Must go beyond describing each source's individual point in sequence (the surface-level trap). Partial credit for commentary that touches a through-line but mostly restates each source's point separately without a genuine step-back claim. No credit for commentary that only summarizes each source in turn with no connective, sequence-level claim, or that is absent.",
            modelResponse:
              "Read individually, each of these is a well-made point about its own moment — but read together, in sequence, they trace a single unfinished argument: winning liberty in principle (Henry) does not extend it in practice (Douglass exposes the gap), and even the nation's own solemn admission of that gap (Lincoln) is itself only a renewed promise, not a resolution. No one of these texts could make that claim alone; it exists only in the pattern across all three, which suggests liberty in America has never been a possession secured once, but a demand each generation must reopen on behalf of whoever came before it was left out.",
          },
        ],
      },
      estimatedMinutes: 6,
    },
    {
      id: 'misconception-sophistication-as-decoration',
      kind: 'misconception_check',
      question:
        'A student believes that to earn the "sophistication" point, they should cite a fourth source or use more advanced-sounding vocabulary in their synthesis essay. Is this what sophistication means?',
      commonErrors: [
        {
          answer: 'yes',
          misconception:
            'Treating sophistication as a matter of QUANTITY or DECORATION (more sources, fancier words) rather than a specific analytical MOVE — situating sources in relation to each other and the broader issue.',
          correctsTo:
            "No — adding a fourth source or elevated vocabulary doesn't by itself earn the sophistication point, and can even dilute an essay if the added source isn't integrated into a through-line. Sophistication is a specific move: stepping back from the individual points already made to state what the sources reveal TOGETHER, in relation to each other and to the larger issue, that no single source states alone. A three-source essay that performs this stand-back move scores higher on sophistication than a five-source essay that never does. The test: could your \"sophisticated\" sentence have been written after reading only ONE of your sources? If yes, it isn't sophistication — it's just describing that one source in advanced language.",
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Sophistication means showing sources are in CONVERSATION with each other and the broader issue — not just lined up as separate evidence.',
        'Trace a through-line across time: each source extends, revises, or answers the one(s) before it.',
        'The surface-level trap: an essay that handles evidence, disagreement, and qualification competently but never steps back to connect the sources to each other.',
        'The stand-back move: state what the sources reveal TOGETHER that no single source states alone — that claim becomes part of the thesis.',
        'Sophistication is about a specific analytical move, not more sources or fancier vocabulary — test it by asking whether the claim could have been made from just one source.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '8',
    cedTopic: '8.4',
    cedTitle: 'Sophistication in Synthesis',
    sources: [
      { type: 'plan', source: 'AP Plans Initiative — AP English Language' },
    ],
  },
};
