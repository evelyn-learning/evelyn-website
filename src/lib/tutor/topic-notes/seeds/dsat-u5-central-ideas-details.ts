/**
 * Digital SAT — Unit 5 CED 5.1: Central Ideas & Details.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.testprep.dsat.central-ideas-details.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_DSAT_U5_CENTRAL_IDEAS_DETAILS: TopicNotesBaseline = {
  baselineId: 'evelyn.testprep.dsat.central-ideas-details.v1',
  course: 'Digital SAT',
  cedUnit: 5,
  cedTopic: '5.1',
  cedTitle: 'Central Ideas & Details',
  planId: 'evelyn.testprep.dsat.central-ideas-details.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.testprep.dsat.central-ideas-details.v1' }],
  theory: [
    { loId: 'dsat.central-ideas-details', content: `TWO QUESTION TYPES under this skill: CENTRAL IDEA questions ask for the passage's overall point ("best states the central idea", "best summarizes the text"). DETAIL questions ask what the text explicitly says about one specific fact ("according to the text, what...", "the text indicates that..."). Detail questions test EXPLICIT statements only — reading between the lines is a different skill (Inferences), not this one.` },
    { loId: 'dsat.central-ideas-details', kind: 'framework', title: 'Where the central idea hides', content: `WHERE THE CENTRAL IDEA HIDES — in a 25-100 word passage there's no room to bury it. Watch for a PIVOT WORD ("however", "but", "yet", "although", "despite this") partway through — the sentence right after the pivot is usually where the real claim lives, not the setup sentence before it.` },
    { loId: 'dsat.central-ideas-details', kind: 'framework', title: 'Trap 1', content: `TRAP 1 — TOO NARROW. A choice that restates a single supporting detail (one date, one example, one number) and calls it the central idea. It's true, but it's not the WHOLE passage's point.` },
    { loId: 'dsat.central-ideas-details', kind: 'framework', title: 'Trap 2', content: `TRAP 2 — TOO BROAD. A choice that's generic enough to describe a hundred other passages on the same topic. True in a vague sense, but it doesn't capture THIS passage's specific claim or contrast.` },
    { loId: 'dsat.central-ideas-details', kind: 'framework', title: 'Trap 3', content: `TRAP 3 — DISTORTED DETAIL. On detail questions specifically: a choice that reuses exact words or phrases from the passage but reverses the direction, flips cause and effect, or misattributes who said what. Skimmers who pattern-match on familiar wording fall for this every time.` },
    { loId: 'dsat.central-ideas-details', kind: 'framework', title: 'Strategy', content: `STRATEGY — predict the central idea (or the specific fact asked for) in your own words BEFORE reading the choices. Then pick whichever choice matches your prediction in MEANING, not whichever choice shares the most words with the passage.` },
    { loId: 'dsat.central-ideas-details', content: `TEST your central-idea answer against the WHOLE passage: does every sentence support it, or does it only explain part of the passage?` },
    { loId: 'dsat.central-ideas-details', kind: 'definition', title: 'central idea', content: `the single overall point the passage's sentences collectively support — not any one supporting fact.` },
    { loId: 'dsat.central-ideas-details', kind: 'definition', title: 'explicit detail', content: `a fact the text directly states; detail questions require textual support, not inference.` },
    { loId: 'dsat.central-ideas-details', kind: 'definition', title: 'distorted-detail trap', content: `a wrong choice that echoes the passage's exact wording but reverses or misattributes the actual claim.` },
  ],
  methods: [
    {
      title: 'Worked central idea',
      steps: [
        `Map the passage's shape: sentence 1 sets up the old restriction (bans), the pivot word "however" in sentence 2 signals a turn, sentence 3 is a supporting detail (one city, one date, a trend).`,
        `The pivot is where the real point lives: cities REVERSED their bans once evidence showed the fears were overstated and the benefits were real.`,
        `Central idea: many cities have reversed earlier urban-beekeeping bans after evidence showed the safety concerns were overstated and the practice brings benefits.`,
        `Reject too-narrow: "New York lifted its ban in 2010" — that's one supporting example, not the passage's overall point.`,
        `Reject too-broad: "Beekeeping is a growing hobby in America" — doesn't capture the specific ban-reversal-after-evidence angle this passage makes.`,
      ],
      example: { problem: `Read the passage: "Urban beekeeping was once banned in most U.S. cities over fears about property damage and stings. Over the past two decades, however, several major cities have reversed those bans after research showed that most bee species are not aggressive and that hive numbers correlate with healthier local gardens. New York lifted its ban in 2010, and applications for hobbyist hives have risen steadily every year since." Question: Which choice best states the central idea of the text?`, solution: `Many cities have reversed earlier bans on urban beekeeping after evidence showed the safety and benefit concerns were overstated.` },
      relatedLoIds: ['dsat.central-ideas-details'],
    },
    {
      title: 'Worked distorted detail',
      steps: [
        `This is a DETAIL question, not a central-idea question — it asks for one specific, explicitly stated claim.`,
        `Scan for the exact claim: the text names the sonar-driven efficiency gain as the "primary driver" of the decline.`,
        `TRAP: the phrase "overfishing regulations" appears right in that same sentence. A skimming reader who spots that familiar phrase might pick a choice crediting regulations for the decline — but the text names regulations only to REJECT them as the cause, not to credit them.`,
        `A correct detail answer must match what the text actually claims, not just contain a recognizable phrase from it.`,
      ],
      example: { problem: `Read the passage: "Before the 1960s, most commercial fishing vessels tracked schools of fish visually or by trial and error. The introduction of sonar technology let captains locate fish schools far below the surface, cutting average search time by more than half. Some marine biologists later argued that this efficiency gain, not overfishing regulations, was the primary driver of the steep decline in certain fish populations during the 1970s." Question: According to the text, what did some marine biologists argue was the primary cause of the 1970s fish population decline?`, solution: `The efficiency gain from sonar technology — explicitly NOT overfishing regulations.` },
      relatedLoIds: ['dsat.central-ideas-details'],
    },
  ],
  pointers: [
    { content: `The digital SAT rejects too-broad choices just as often as too-narrow ones. A central idea has to be SPECIFIC to what THIS passage actually claims — not a generic statement that could describe dozens of other passages on the same topic. If a choice is vague enough to dodge every specific, it's the too-broad trap, not a safe bet. Match the choice to the passage's particular point or contrast, not to the topic in general.`, kind: 'common-error' },
    { content: `Central-idea questions want the WHOLE passage's point; detail questions want one explicitly stated fact — don't answer one as if it's the other.`, kind: 'tip' },
    { content: `In a short passage, a pivot word ("however", "but", "despite") usually marks where the real central idea lands.`, kind: 'tip' },
    { content: `Reject too-narrow (a detail promoted to "the point"), too-broad (generic, fits any passage), and distorted-detail (echoes wording but reverses the claim) choices.`, kind: 'tip' },
    { content: `Predict the answer in your own words before reading choices — match on meaning, not on shared vocabulary with the passage.`, kind: 'tip' },
    { content: `Read the last sentence twice. Short SAT passages often end with the writer's real stance ("researchers now view X as viable rather than a last resort"). If your central idea ignores that final sentence, you've probably summarized the setup instead of the point.`, kind: 'tip' },
    { content: `A hedged passage needs a hedged answer. If the text says "cannot outpace ongoing damage" or "some biologists argued," reject choices that state the claim as settled fact ("proves," "has solved," "all scientists agree"). Overstatement is a wrong answer even when the topic matches.`, kind: 'gotcha' },
    { content: `"According to the text" and "the text indicates/states" = detail: point to the exact words. "Best states the central idea," "best summarizes the text," "main purpose of the text" = whole-passage. Misreading the stem is the single fastest way to lose this question.`, kind: 'vocab-note' },
    { content: `On detail questions, a phrase can appear in the passage purely to be rejected ("not overfishing regulations," "once attributed mainly to chromatophores"). Check whether the text ENDORSES that phrase or dismisses it before picking the choice that repeats it.`, kind: 'common-error' },
    { content: `Beware the half-right choice: it nails the first clause and adds an unsupported second half ("...and reefs will fully recover by 2050"). Read every word of every choice; the SAT hides the error after the comma or the "because."`, kind: 'gotcha' },
    { content: `Detail questions test only what's stated, not what follows from it. If you need to add a reasonable step ("so the ban must have been unnecessary"), you've slid into an Inference answer — correct-sounding, wrong skill, wrong choice.`, kind: 'edge-case' },
    { content: `"Central idea" ≠ topic. "Urban beekeeping" or "octopus skin" is a topic; a central idea makes a CLAIM about it. If your answer choice could be a chapter title, it's the too-broad trap.`, kind: 'vocab-note' },
    { content: `Quick self-check: cover the choices and say the passage's point in one sentence including its contrast ("once X, but now Y"). If a choice drops the contrast entirely, it's too narrow or too broad — the contrast IS the point in pivot-structured passages.`, kind: 'tip' },
  ],
};
