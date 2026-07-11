/**
 * AP English Language & Composition — CED Unit 3.3: Taking a Position Across
 * Sources.
 *
 * Builds on 3.2 (attribution mechanics): once a student can cite sources
 * cleanly, the harder skill is forming an argument that USES the sources
 * rather than one that just represents them. The two failure modes this
 * topic targets are the source-summary trap (walking through each source's
 * content with no throughline) and false neutrality (describing disagreement
 * between sources without ever committing to a position).
 *
 * See docs/superpowers/specs/2026-07-10-ap-eng-lang-design.md §2 for the
 * humanities segment semantics this plan follows.
 *
 * Anchor text: Frederick Douglass, "What to the Slave Is the Fourth of July?"
 * (1852) — evelyn.passage.douglass-fourth-of-july.v1, discussed alongside
 * Lincoln's 1863 Gettysburg Address in prose as the contrasting member of the
 * synthesis source set. The teaching point is the rhetorical MOVE of forming
 * a position, not the atrocity content the speech condemns — quotes below
 * are limited to the short structural/rhetorical-question phrases already
 * used as anchor evidence for this speech elsewhere in the course.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_ENGLANG_U3_POSITION_ACROSS_SOURCES: LessonPlan = {
  id: 'evelyn.ap.englang.position-across-sources.v1',
  title: 'U3.3 Taking a Position Across Sources',
  curriculum: 'AP',
  grade: '11',
  subject: 'ela',
  topic: 'ap-english-language',
  locale: 'en',
  los: [
    {
      id: 'apenglang.position-across-sources',
      description:
        "Form an original, defensible position on a shared issue that uses multiple sources as supporting evidence, avoiding both the source-summary trap and false neutrality.",
      standard: 'AP-ENGLANG-3.3',
    },
  ],
  prerequisites: ['apenglang.citing-attributing-sources', 'apenglang.defensible-thesis'],
  followUps: ['apenglang.integrating-evidence'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Get students to feel the difference between repeating a panel and delivering a closing argument.',
      script:
        "Imagine you're asked to give the closing statement after a panel discussion where three experts each spoke for five minutes. A weak closing statement just repeats what each panelist said, in order: 'Panelist one said X, panelist two said Y, panelist three said Z. Thank you.' A strong closing statement takes a stand — 'Here's what I think we should conclude, and here's how each panelist's point actually supports it' — even if some panelists would disagree with each other. A synthesis essay is the closing statement, not the recap. Today we build the habit of stating YOUR position and making the sources work for you.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-position-not-summary',
      kind: 'concept',
      goal: 'Define the two failure modes that keep a synthesis attempt from being a real position, and name what a genuine synthesis thesis does instead.',
      keyIdeas: [
        'FAILURE MODE 1 — SOURCE SUMMARY: walking through each source\'s content, one at a time, with no claim of the writer\'s own tying them together. Delete any single sentence and the "argument" is unaffected, because there isn\'t one.',
        'FAILURE MODE 2 — FALSE NEUTRALITY: accurately describing that sources disagree ("some see liberty as X, others as Y") without ever committing to the writer\'s own claim about the issue. Naming disagreement is not the same as taking a position on it.',
        'A synthesis THESIS is the writer\'s OWN claim about the shared issue. Sources are cited because they support that claim — not because the writer is obligated to represent every source equally or give each one identical space.',
        'A writer is allowed, and often rewarded, for using a source AGAINST its surface meaning, or using only PART of what it says, as long as the use stays accurate and honest to the source\'s actual content.',
        'A synthesis thesis is arguable in the same way a rhetorical-analysis thesis is (Unit 1) — but now the claim is about the ISSUE itself, supported across texts, not about one writer\'s rhetorical choices in a single text.',
        'THE STRIP TEST: remove every reference to the sources from a proposed thesis. Is there still a real claim left? "The promise of liberty has never been self-executing — it has always required someone to demand and defend it" survives the strip test. "These sources show different views on liberty" does not — it collapses into an observation ABOUT the sources, not a position ON the issue.',
        'Sources that seem to DISAGREE with the writer\'s position are still useful — engaging honestly with a source that complicates the claim (rather than avoiding it) is what an advanced synthesis essay does.',
      ],
      vocabulary: [
        { term: 'synthesis thesis', definition: "the writer's own arguable claim on a shared issue, supported by multiple sources." },
        { term: 'source-summary trap', definition: "walking through each source's content in turn with no unifying claim." },
        { term: 'false neutrality', definition: 'describing disagreement between sources without ever committing to a position.' },
        { term: 'strip test', definition: 'removing source references from a thesis to check whether a real, arguable claim remains.' },
      ],
      passageId: 'evelyn.passage.douglass-fourth-of-july.v1',
      estimatedMinutes: 6,
    },
    {
      id: 'worked-diagnose-and-fix-thesis',
      kind: 'worked_example',
      problem:
        "A student drafts this synthesis \"thesis\" for the issue of what America's promise of liberty and equality means and to whom it applies, drawing on Douglass's 1852 speech (evelyn.passage.douglass-fourth-of-july.v1) and Lincoln's 1863 Gettysburg Address (mentioned here in prose — this segment type carries no passageId field): \"Douglass says the Fourth of July excludes enslaved people, while Lincoln says the nation is dedicated to the idea that all men are created equal. These sources show different perspectives on liberty.\" Diagnose the problem and fix it.",
      steps: [
        'TEST AGAINST THE STRIP TEST. Remove the source references: "These sources show different perspectives on liberty." Nothing is left but an observation about the sources — this fails the test.',
        'NAME THE FAILURE MODE. This is FALSE NEUTRALITY: the draft accurately notes disagreement (Douglass shows exclusion, Lincoln reasserts the ideal) but never commits to what the WRITER thinks that disagreement means.',
        "IDENTIFY THE SHARED ISSUE THE DRAFT IS CIRCLING. Whether the promise of liberty and equality is automatically real or must be actively extended and defended.",
        'DECIDE A GENUINE POSITION. Not "sources disagree" but a specific claim: the gap Douglass exposes and the "unfinished work" Lincoln names are the SAME phenomenon seen from opposite sides — proof that the promise of liberty has never applied itself; it has to be forced into being.',
        "REWRITE AS A THESIS THAT SURVIVES THE STRIP TEST. \"The promise of liberty and equality has never been self-executing: Douglass's 1852 indictment of a holiday that excludes him and Lincoln's 1863 admission that the nation's 'unfinished work' remains undone are two views of the same truth — the promise only becomes real when someone forces the nation to look at where it has failed to keep it.\"",
        'VERIFY BOTH SOURCES NOW SERVE THE CLAIM RATHER THAN JUST BEING DESCRIBED. Douglass is evidence of the gap; Lincoln is evidence that even the nation\'s own most solemn occasions concede the gap remains — both support one position instead of sitting side by side.',
      ],
      answer:
        "The draft commits false neutrality — it notes that Douglass and Lincoln differ but never states what the writer concludes from that difference. The fix: state that the promise of liberty has never been self-executing, using Douglass's exposure of exclusion and Lincoln's admission of \"unfinished work\" as two forms of the SAME evidence for that single claim.",
      estimatedMinutes: 6,
    },
    {
      id: 'try-position-thesis',
      kind: 'try_yourself',
      problem:
        "Consider the synthesis prompt: 'Using multiple sources, take a position on whether America's promise of liberty and equality for all has been fulfilled.' Write ONE thesis sentence that states YOUR OWN defensible position on this issue. Avoid both the source-summary trap (describing what a source says with no claim) and false neutrality (noting that sources differ without committing to a stance). Your thesis should pass the strip test: it must state a real claim even with source references removed.",
      responseFormat: 'free',
      passageId: 'evelyn.passage.douglass-fourth-of-july.v1',
      rubric: {
        parts: [
          {
            criterionId: 'thesis',
            maxPoints: 6,
            scoringCriteria:
              "Full credit (6): a single sentence stating a genuine, arguable position on whether the promise of liberty/equality has been fulfilled (a reasonable reader could contest it), specific enough to predict what kind of source evidence would support it, and passing the strip test (a real claim survives even without naming sources). Partial credit (3-4) for a thesis that gestures toward a position but hedges into false neutrality ('it depends on perspective') or is too vague to predict supporting evidence. Partial credit (1-2) for a thesis that falls fully into the source-summary trap (describing what a source says with no claim) or restates the prompt's question without answering it. No credit for a statement of fact no reasonable reader could contest, or a thesis with no stance at all.",
            modelResponse:
              "America's promise of liberty and equality has never been automatically fulfilled — it has only become real in moments when someone was willing to expose where the nation was failing to keep it and insist that the work of fulfilling it was not yet finished.",
          },
        ],
      },
      estimatedMinutes: 4,
    },
    {
      id: 'misconception-false-neutrality',
      kind: 'misconception_check',
      question:
        'A student argues: "Some sources say liberty was fully granted to Americans, and other sources say it wasn\'t — so really, both are right depending on how you look at it." Is this a defensible synthesis position?',
      commonErrors: [
        {
          answer: 'yes',
          misconception:
            'Treating an observation that sources disagree as if it were itself a position — FALSE NEUTRALITY, mistaking "it depends" for an arguable claim.',
          correctsTo:
            "No — \"both are right depending on how you look at it\" refuses to take a position at all; it describes disagreement without resolving it into a claim a reader could push back on. A defensible position has to commit: for example, that the sources' disagreement itself proves the promise was never automatically real, or that one source's account (with reasons why) should carry more weight than another's for this specific issue. The test: could a reasonable reader argue the OPPOSITE of your sentence? \"It depends\" has no opposite to argue against — that's the sign it isn't a position yet.",
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A synthesis thesis is the writer\'s OWN claim about the shared issue — sources support it, they don\'t define it.',
        'Avoid the source-summary trap: describing each source\'s content in turn with no unifying claim.',
        'Avoid false neutrality: noting that sources disagree is not the same as taking a position on what that disagreement means.',
        'The strip test: remove source references from your thesis — if no real claim is left, it isn\'t a position yet.',
        'A source that disagrees with your position is still useful evidence — engaging it honestly is stronger than ignoring it.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '3',
    cedTopic: '3.3',
    cedTitle: 'Taking a Position Across Sources',
    sources: [
      { type: 'plan', source: 'AP Plans Initiative — AP English Language' },
    ],
  },
};
