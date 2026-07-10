/**
 * AP English Language & Composition — CED Unit 2.2: Selecting and Sequencing
 * Evidence.
 *
 * Builds on 2.1 (building an argument): once a student has a defensible
 * position, the essay needs evidence that is genuinely relevant and
 * sufficient — not just present — and DELIBERATELY sequenced rather than
 * dumped in whatever order it was thought of. This is the argument-essay
 * cousin of 1.4's evidence-and-commentary skill, scaled up to handling
 * MULTIPLE pieces of evidence of different types across a paragraph.
 *
 * See docs/superpowers/specs/2026-07-10-ap-eng-lang-design.md §2 for the
 * humanities segment semantics (try_yourself PARAGRAPH grain: responseFormat
 * 'free', rubric = two parts summing to 6) this plan follows.
 *
 * Anchor text: Patrick Henry, "Give Me Liberty or Give Me Death" (1775) —
 * evelyn.passage.henry-give-me-liberty.v1, used here as a model of marshaling
 * several evidence types against the same objection. Quotes below are
 * limited to the short structural phrases already used elsewhere in the
 * unit.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_ENGLANG_U2_SELECTING_EVIDENCE: LessonPlan = {
  id: 'evelyn.ap.englang.selecting-evidence.v1',
  title: 'U2.2 Selecting and Sequencing Evidence',
  curriculum: 'AP',
  grade: '11',
  subject: 'ela',
  topic: 'ap-english-language',
  locale: 'en',
  los: [
    {
      id: 'apenglang.selecting-evidence',
      description:
        'Choose evidence — examples, anecdotes, data, and appeals to authority — that is relevant and sufficient to support a claim, and sequence it deliberately for persuasive effect in an original argument.',
      standard: 'AP-ENGLANG-2.2',
    },
  ],
  prerequisites: ['apenglang.building-an-argument', 'apenglang.evidence-commentary'],
  followUps: ['apenglang.line-of-reasoning-argument'],
  estimatedMinutes: 23,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Get students to feel that relevance, sufficiency, AND sequencing all matter, before naming any of the three terms.',
      script:
        "Imagine a lawyer walks into court and dumps a random box of exhibits on the table — a photo, a receipt, a witness statement — with no order and no explanation of why each one is there. Even if every item in the box is technically relevant, the jury has no idea which one to weigh first or how they connect. Now imagine the same lawyer picks exactly the right handful of exhibits and presents them in a deliberate order: the one that establishes the general pattern first, then the one that makes it concrete and undeniable. That's the difference between having evidence and building a case with it. Selecting evidence for your own argument works the same way — it's not enough to gather relevant material, you have to choose enough of it, of the right kinds, in the right order.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-selecting-evidence',
      kind: 'concept',
      goal: 'Name the evidence types available for an original argument, define relevance and sufficiency, and explain why sequencing is a deliberate rhetorical choice.',
      keyIdeas: [
        "Four EVIDENCE TYPES cover most arguments: an EXAMPLE (an illustrative case, real or hypothetical), an ANECDOTE (a specific narrative instance, personal or reported), DATA (statistics, studies, measured facts), and an APPEAL TO AUTHORITY (a credible expert or institution's judgment). Most persuasive arguments draw on more than one type, because each compensates for what the others lack.",
        "RELEVANCE means the evidence bears directly on the SPECIFIC claim, not just the general topic. A statistic about teenage sleep matters to a start-time argument only when it's tied to the specific policy being proposed, not sleep in general.",
        "SUFFICIENCY means enough well-chosen evidence that a skeptical reader can't dismiss the claim as a fluke, an outlier, or a cherry-picked case. One anecdote alone is rarely sufficient; pairing an anecdote with data usually is, because each corroborates the other from a different angle.",
        "SEQUENCING is a deliberate choice, not an accident of what you thought of first. Reliable orders include broad-to-specific (data establishing scale, then an anecdote making it concrete) and climactic (building from a solid piece to the most decisive one), so the paragraph's structure itself argues, not just its content.",
        "THE #1 FAILURE at this stage is the 'EVIDENCE DUMP' — stringing multiple pieces of evidence together with no reasoning for why this piece precedes that one, and no commentary linking each piece back to the claim. This is quote-and-drop (1.4) at paragraph scale: more exhibits, still no case being made about them.",
        "Selecting evidence is itself an argument about what your audience will find persuasive: leading with data signals you expect a skeptical, numbers-driven reader; leading with an anecdote signals you expect to need to make the stakes feel human first.",
        "Henry's argument marshals more than one evidence type against the same counter-view (that the colonies are too weak to fight): the history of failed petitions functions as precedent evidence that peaceful means are exhausted, the appeal to 'a just God who... will raise up friends' functions as an appeal to authority, and 'three millions of people, armed in the holy cause of liberty' functions as a scale-based claim. He SEQUENCES them so the exhaustion of peaceful means comes first, establishing necessity, before he answers the weakness objection with numbers and providence.",
      ],
      vocabulary: [
        { term: 'evidence type', definition: 'a category of support — example, anecdote, data, or appeal to authority — a writer selects to fit a claim.' },
        { term: 'relevance', definition: 'evidence bearing directly on the specific claim, not merely the general topic.' },
        { term: 'sufficiency', definition: "enough well-chosen evidence that a skeptical reader can't dismiss the claim as a fluke or outlier." },
        { term: 'sequencing', definition: "the deliberate order in which evidence is presented, so the paragraph's structure itself argues." },
        { term: 'evidence dump', definition: 'stringing multiple pieces of evidence together with no order or commentary connecting them to the claim.' },
      ],
      passageId: 'evelyn.passage.henry-give-me-liberty.v1',
      estimatedMinutes: 6,
    },
    {
      id: 'worked-evidence-sequencing',
      kind: 'worked_example',
      problem:
        "Build one body paragraph selecting and sequencing evidence for this position (from 2.1): 'Because chronic sleep deprivation measurably impairs teenagers' attention, mood, and safety behind the wheel, high schools should push start times to 8:30 a.m. or later.' Use at least two different evidence types, echoing how Henry marshals more than one type against the same objection (mentioned in prose here; this segment type carries no passageId field).",
      steps: [
        "WRITE THE TOPIC SENTENCE. State the mini-claim this paragraph proves: delaying start times addresses a measurable, not merely felt, safety problem.",
        "SELECT EVIDENCE TYPE 1: DATA. Choose a specific, relevant statistic — research finding that adolescent drivers under chronic sleep restriction show reaction-time deficits comparable to mild alcohol impairment. Note why THIS statistic, not a vaguer one: it ties directly to the SAFETY strand of the claim, not just 'sleep is good.'",
        "SELECT EVIDENCE TYPE 2: ANECDOTE. Choose a specific, illustrative case — a district that shifted start times later and logged a documented drop in early-morning car crashes involving teen drivers the following year. Note why: it corroborates the data with a real-world instance, answering the 'so what actually happens' skepticism data alone can't.",
        "DECIDE THE SEQUENCE. Lead with the data (establishes the general, measurable scale of the problem) before the anecdote (makes the abstract statistic concrete with a specific case) — broad-to-specific order, so the paragraph builds rather than just lists.",
        "WRITE COMMENTARY FOR EACH PIECE. After the data: explain why a reaction-time deficit matters specifically for teen drivers, not students in general. After the anecdote: explain why one district's result strengthens, rather than merely repeats, the statistical claim.",
        "LINK BACK TO THE CLAIM. Close by tying both pieces together: the risk isn't hypothetical (data), and it isn't unfixable (anecdote) — later start times measurably reduce it.",
      ],
      answer:
        "Delaying start times addresses a measurable safety problem, not just a felt inconvenience. Sleep researchers have found that adolescents under chronic sleep restriction show reaction-time deficits comparable to mild alcohol impairment — a finding that matters specifically for teen drivers, who are already the least experienced people on the road, not students in the abstract. That risk isn't hypothetical: when one district shifted its high school start time to 8:35 a.m., it logged a documented drop in early-morning crashes involving teen drivers the following year, showing the statistic translates into an outcome a single policy change can actually move. Together, the data establishes the scale of the danger and the case shows it is not unfixable — exactly the pairing a skeptical reader needs to stop treating 'kids are tired' as background noise and start treating it as a solvable safety problem.",
      estimatedMinutes: 6,
    },
    {
      id: 'try-evidence-academic',
      kind: 'try_yourself',
      problem:
        "Continuing the same argument essay (position: high schools should push start times to 8:30 a.m. or later because of teen sleep deprivation's effects on attention, mood, and safety), write ONE body paragraph that selects and sequences at least two different types of evidence (example, anecdote, data, or appeal to authority) to support the ACADEMIC-PERFORMANCE strand of the claim — not the safety strand used in the worked example. Include a topic sentence, the evidence itself, and commentary connecting each piece to the claim. Do not evidence-dump — sequence your evidence deliberately and explain why it matters.",
      responseFormat: 'free',
      rubric: {
        parts: [
          {
            criterionId: 'evidence-selection',
            maxPoints: 3,
            scoringCriteria:
              "Full credit (3): the paragraph selects at least two relevant, specific pieces of evidence bearing on the ACADEMIC-PERFORMANCE strand of the claim (e.g., a data point on later start times correlating with higher grades or test scores, an appeal to an authority such as a pediatric-health body's recommendation on adolescent sleep needs, or a specific example/anecdotal case of a district's academic results after a start-time change). Partial credit (1-2) for evidence that is present but vague or generic ('research shows sleep is good for learning' with no specific mechanism or source), or only one piece where two distinct types were required. No credit for no evidence, evidence irrelevant to the academic-performance strand, or evidence that actually only supports a different strand (e.g., safety) with no adaptation to academics.",
            modelResponse:
              "The American Academy of Pediatrics has recommended that high schools start no earlier than 8:30 a.m., citing adolescents' delayed circadian sleep-wake cycle; when a Minnesota district pushed its start time from 7:15 to 8:20 a.m., it recorded measurable increases in students' grade-point averages and standardized test scores over the following two years.",
          },
          {
            criterionId: 'sequencing-commentary',
            maxPoints: 3,
            scoringCriteria:
              "Full credit (3): commentary explains HOW each piece of evidence works (e.g., why an authority like a pediatric-health body carries weight on a biological claim; why a district's specific results corroborate rather than merely repeat that authority) AND WHY the chosen sequence serves the paragraph's persuasive logic (e.g., authority-then-case establishes the mechanism before showing it plays out in practice), going beyond restating the evidence in different words. Partial credit for commentary that explains one piece's relevance but not the other, or that describes the evidence without explaining the sequencing choice. No credit for commentary that is absent, only restates the evidence's content, or lists the evidence with no connecting explanation (an evidence dump).",
              modelResponse:
                "Leading with the pediatric recommendation establishes that the problem is biological, not a discipline failure, before the Minnesota result shows that aligning schedules with that biology produces a measurable academic gain — the authority explains WHY the change should work, and the case confirms that it actually does.",
          },
        ],
      },
      estimatedMinutes: 6,
    },
    {
      id: 'misconception-evidence-dump',
      kind: 'misconception_check',
      question:
        'A student writes this paragraph: "Studies show later start times help students. Also, health experts recommend 8:30 a.m. or later. Also, a Minnesota district saw better grades after switching. Later start times are clearly beneficial." Is this a strong evidence paragraph?',
      commonErrors: [
        {
          answer: 'yes',
          misconception:
            "Mistaking an EVIDENCE DUMP — three relevant pieces of evidence strung together with 'also' and no commentary — for a complete evidence paragraph.",
          correctsTo:
            "No — every piece of evidence here is actually relevant, which makes this a useful diagnostic: relevance alone isn't enough. Nothing explains HOW the health experts' recommendation carries authority, HOW the Minnesota case corroborates it, or WHY this order was chosen rather than another. Strip out 'also,' 'studies show,' and 'clearly beneficial' — is there any actual explanation left connecting one piece of evidence to the next, or to the claim? There isn't; it's three exhibits with no case being made about them. Fix: turn each 'also' into a sentence of commentary that says why THIS evidence, in THIS position, is doing persuasive work.",
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        "Four evidence types cover most arguments — example, anecdote, data, appeal to authority — and most strong arguments draw on more than one, because each compensates for what the others lack.",
        "Relevance means evidence bears on the SPECIFIC claim, not just the general topic; sufficiency means enough of it that a skeptical reader can't dismiss the claim as an outlier.",
        "Sequencing is a deliberate choice — broad-to-specific and climactic order are two reliable patterns — not an accident of what came to mind first.",
        "The evidence dump — relevant evidence with no order and no commentary — is the paragraph-scale version of quote-and-drop.",
        "Choosing which evidence type to lead with is itself an argument about what your audience will find persuasive.",
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '2',
    cedTopic: '2.2',
    cedTitle: 'Selecting and Sequencing Evidence',
    sources: [
      {
        type: 'concept',
        book: 'ap-englang-ced',
        chapter: '2',
        note: 'AP English Language and Composition Course and Exam Description, Unit 2 — selecting relevant, sufficient evidence and sequencing it deliberately for an original argument.',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.henry-give-me-liberty.v1',
        chapter: '1775',
        note: 'Patrick Henry, "Give Me Liberty or Give Me Death" — model of marshaling multiple evidence types against a single objection.',
      },
    ],
  },
};
