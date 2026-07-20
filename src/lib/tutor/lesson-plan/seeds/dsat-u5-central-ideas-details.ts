/**
 * Digital SAT — Reading & Writing: Central Ideas & Details.
 *
 * Information and Ideas domain. Every digital SAT R&W passage is its own
 * short 25-100 word stimulus with one question. Central Ideas & Details
 * questions ask either (a) what the WHOLE passage's point is, or (b) what
 * the text EXPLICITLY states about one specific fact. Traps: too-narrow,
 * too-broad, and distorted-detail choices that echo passage wording while
 * reversing or misattributing what was actually said.
 */

import type { LessonPlan } from '../types';
import { TESTPREP_PACING_THRESHOLDS, TESTPREP_SOURCE } from './_testprep-shared';

export const SEED_DSAT_U5_CENTRAL_IDEAS_DETAILS: LessonPlan = {
  id: 'evelyn.testprep.dsat.central-ideas-details.v1',
  title: 'Central Ideas & Details',
  curriculum: 'SAT',
  grade: 'sat-act',
  subject: 'test-prep',
  topic: 'digital-sat',
  locale: 'en',
  los: [
    {
      id: 'dsat.central-ideas-details',
      standard: 'DSAT-5.1',
      description:
        "Identify a short passage's central idea and distinguish it from explicitly stated supporting details, avoiding too-narrow, too-broad, and distorted-detail traps.",
    },
  ],
  prerequisites: [],
  followUps: ['dsat.command-of-evidence'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame Central Ideas & Details as a guaranteed, recurring slice of the Information and Ideas domain.',
      script:
        'Information and Ideas makes up roughly a quarter of R&W — about 12 to 14 of the 54 questions. Central Ideas & Details is one of the four skills inside that domain, so expect a handful of these every single test. The passages are only 25 to 100 words, but that\'s exactly what makes them tricky: no padding, no filler, every sentence pulls weight. Learn to separate the passage\'s ONE point from its supporting facts and these become fast, reliable points.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-central-vs-detail',
      kind: 'concept',
      goal: 'Distinguish central-idea questions from detail questions, locate the central idea fast, and name the three recurring traps.',
      keyIdeas: [
        'TWO QUESTION TYPES under this skill: CENTRAL IDEA questions ask for the passage\'s overall point ("best states the central idea", "best summarizes the text"). DETAIL questions ask what the text explicitly says about one specific fact ("according to the text, what...", "the text indicates that..."). Detail questions test EXPLICIT statements only — reading between the lines is a different skill (Inferences), not this one.',
        'WHERE THE CENTRAL IDEA HIDES — in a 25-100 word passage there\'s no room to bury it. Watch for a PIVOT WORD ("however", "but", "yet", "although", "despite this") partway through — the sentence right after the pivot is usually where the real claim lives, not the setup sentence before it.',
        'TRAP 1 — TOO NARROW. A choice that restates a single supporting detail (one date, one example, one number) and calls it the central idea. It\'s true, but it\'s not the WHOLE passage\'s point.',
        'TRAP 2 — TOO BROAD. A choice that\'s generic enough to describe a hundred other passages on the same topic. True in a vague sense, but it doesn\'t capture THIS passage\'s specific claim or contrast.',
        'TRAP 3 — DISTORTED DETAIL. On detail questions specifically: a choice that reuses exact words or phrases from the passage but reverses the direction, flips cause and effect, or misattributes who said what. Skimmers who pattern-match on familiar wording fall for this every time.',
        'STRATEGY — predict the central idea (or the specific fact asked for) in your own words BEFORE reading the choices. Then pick whichever choice matches your prediction in MEANING, not whichever choice shares the most words with the passage.',
        'TEST your central-idea answer against the WHOLE passage: does every sentence support it, or does it only explain part of the passage?',
      ],
      vocabulary: [
        { term: 'central idea', definition: "the single overall point the passage's sentences collectively support — not any one supporting fact." },
        { term: 'explicit detail', definition: 'a fact the text directly states; detail questions require textual support, not inference.' },
        { term: 'distorted-detail trap', definition: 'a wrong choice that echoes the passage\'s exact wording but reverses or misattributes the actual claim.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-central-idea',
      kind: 'worked_example',
      problem:
        'Read the passage: "Urban beekeeping was once banned in most U.S. cities over fears about property damage and stings. Over the past two decades, however, several major cities have reversed those bans after research showed that most bee species are not aggressive and that hive numbers correlate with healthier local gardens. New York lifted its ban in 2010, and applications for hobbyist hives have risen steadily every year since." Question: Which choice best states the central idea of the text?',
      steps: [
        'Map the passage\'s shape: sentence 1 sets up the old restriction (bans), the pivot word "however" in sentence 2 signals a turn, sentence 3 is a supporting detail (one city, one date, a trend).',
        'The pivot is where the real point lives: cities REVERSED their bans once evidence showed the fears were overstated and the benefits were real.',
        'Central idea: many cities have reversed earlier urban-beekeeping bans after evidence showed the safety concerns were overstated and the practice brings benefits.',
        'Reject too-narrow: "New York lifted its ban in 2010" — that\'s one supporting example, not the passage\'s overall point.',
        'Reject too-broad: "Beekeeping is a growing hobby in America" — doesn\'t capture the specific ban-reversal-after-evidence angle this passage makes.',
      ],
      answer: 'Many cities have reversed earlier bans on urban beekeeping after evidence showed the safety and benefit concerns were overstated.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-distorted-detail',
      kind: 'worked_example',
      problem:
        'Read the passage: "Before the 1960s, most commercial fishing vessels tracked schools of fish visually or by trial and error. The introduction of sonar technology let captains locate fish schools far below the surface, cutting average search time by more than half. Some marine biologists later argued that this efficiency gain, not overfishing regulations, was the primary driver of the steep decline in certain fish populations during the 1970s." Question: According to the text, what did some marine biologists argue was the primary cause of the 1970s fish population decline?',
      steps: [
        'This is a DETAIL question, not a central-idea question — it asks for one specific, explicitly stated claim.',
        'Scan for the exact claim: the text names the sonar-driven efficiency gain as the "primary driver" of the decline.',
        'TRAP: the phrase "overfishing regulations" appears right in that same sentence. A skimming reader who spots that familiar phrase might pick a choice crediting regulations for the decline — but the text names regulations only to REJECT them as the cause, not to credit them.',
        'A correct detail answer must match what the text actually claims, not just contain a recognizable phrase from it.',
      ],
      answer: 'The efficiency gain from sonar technology — explicitly NOT overfishing regulations.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-central-idea',
      kind: 'try_yourself',
      problem:
        'Read the passage: "Coral reefs damaged by rising ocean temperatures were once thought to take centuries to recover, if they recovered at all. Marine biologists have recently transplanted lab-grown coral fragments onto damaged reefs in the Caribbean, and several transplanted sites showed measurable new growth within eighteen months. Researchers caution that transplantation cannot outpace the rate of ongoing damage, but they now view assisted recovery as a viable tool rather than a last resort." Question: Which choice best states the central idea of the text?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Ocean temperatures are rising faster than scientists had predicted.' },
        { id: 'b', text: "Coral transplantation has shown genuine promise as a recovery method, even though it can't fully offset ongoing damage.", correct: true },
        { id: 'c', text: 'Caribbean reefs have fully recovered within eighteen months of transplantation.' },
        { id: 'd', text: 'Marine biologists agree that coral reefs cannot be saved through human intervention.' },
      ],
      expectedAnswer: "Coral transplantation has shown genuine promise as a recovery method, even though it can't fully offset ongoing damage.",
      hints: [
        'Look for the pivot: "Researchers caution... but they now view..." — that "but" is where the real point lands.',
        'The passage never says reefs "fully recovered," and it never says intervention is hopeless — both of those flip what\'s actually stated.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-detail-library',
      kind: 'try_yourself',
      problem:
        'Read the passage: "The Library of Alexandria is often remembered as lost in a single catastrophic fire, but historians note that its decline was gradual, spanning centuries of reduced funding, political upheaval, and the slow relocation of scholars to other centers of learning. A partial fire during a military conflict in 48 BCE damaged some material, but the library continued to function for generations afterward." Question: According to the text, what does the passage say actually caused the Library of Alexandria\'s decline?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'A single catastrophic fire that destroyed the library instantly.' },
        { id: 'b', text: 'A gradual process of funding cuts, political instability, and scholars relocating over centuries.', correct: true },
        { id: 'c', text: "A military conflict in 48 BCE that ended the library's operations for good." },
        { id: 'd', text: "The relocation of the library's entire collection to a rival city." },
      ],
      expectedAnswer: 'A gradual process of funding cuts, political instability, and scholars relocating over centuries.',
      hints: [
        'The passage opens by naming the popular belief ("often remembered as...") specifically to correct it with "but".',
        'Notice the library "continued to function... afterward" the 48 BCE fire — that rules out the fire as the actual cause of the decline.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-detail-octopus',
      kind: 'try_yourself',
      problem:
        'Read the passage: "Octopuses can change both the color and texture of their skin within a fraction of a second, a feat once attributed mainly to specialized pigment cells called chromatophores. Recent studies suggest that octopuses may also rely on light-sensing proteins embedded directly in their skin, allowing parts of the body to detect and respond to color changes even without direct input from the eyes or brain." Question: According to the text, what do recent studies suggest about how octopuses change color?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Chromatophores are the sole mechanism responsible for octopus color change.' },
        { id: 'b', text: 'Skin-embedded light-sensing proteins may let the skin detect and respond to color independent of the eyes or brain.', correct: true },
        { id: 'c', text: 'Octopuses cannot change color without direct input from their eyes and brain.' },
        { id: 'd', text: "Chromatophores have recently been proven not to exist in octopus skin." },
      ],
      expectedAnswer: 'Skin-embedded light-sensing proteins may let the skin detect and respond to color independent of the eyes or brain.',
      hints: [
        '"Once attributed mainly to chromatophores" signals that\'s no longer the whole story — not that chromatophores are the sole cause.',
        'The passage says skin can respond "even without direct input from the eyes or brain" — that\'s the opposite of choice C.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-vague-is-safe',
      kind: 'misconception_check',
      question:
        'On a central-idea question, a student picks the vaguest, most general-sounding choice, reasoning that a broad statement "can\'t be wrong." What went wrong?',
      commonErrors: [
        {
          answer: 'the vaguest/broadest choice is the safe pick',
          misconception: 'Treating vagueness as safety on a central-idea question.',
          correctsTo:
            "The digital SAT rejects too-broad choices just as often as too-narrow ones. A central idea has to be SPECIFIC to what THIS passage actually claims — not a generic statement that could describe dozens of other passages on the same topic. If a choice is vague enough to dodge every specific, it\'s the too-broad trap, not a safe bet. Match the choice to the passage's particular point or contrast, not to the topic in general.",
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        "Central-idea questions want the WHOLE passage's point; detail questions want one explicitly stated fact — don't answer one as if it's the other.",
        'In a short passage, a pivot word ("however", "but", "despite") usually marks where the real central idea lands.',
        'Reject too-narrow (a detail promoted to "the point"), too-broad (generic, fits any passage), and distorted-detail (echoes wording but reverses the claim) choices.',
        'Predict the answer in your own words before reading choices — match on meaning, not on shared vocabulary with the passage.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: TESTPREP_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '5', cedTopic: '5.1', cedTitle: 'Central Ideas & Details' },
  pacingThresholds: TESTPREP_PACING_THRESHOLDS,
};
