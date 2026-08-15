/**
 * HS English — Research & Inquiry: Evaluating Source Credibility.
 *
 * The judgment step that makes research honest (CCSS W.9-10.8): interrogate
 * a source with four questions — WHO wrote it, WHEN, WHY, and WHAT DO OTHERS
 * SAY — and read LATERALLY, checking what independent sources report about
 * the source itself. Every source in this plan is invented and generic.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_ENGL_U10_EVALUATING_SOURCES: LessonPlan = {
  id: 'evelyn.hs.engl.evaluating-sources.v1',
  title: 'Evaluating Source Credibility',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'ela',
  topic: 'hs-english',
  locale: 'en',
  los: [
    {
      id: 'engl.evaluating-sources',
      standard: 'ENGL-10.2',
      description:
        'Judge a source\'s credibility by interrogating its authorship and expertise, its currency, its purpose and bias, and its corroboration by independent sources, including reading laterally to find out what other sources say about the source itself (CCSS W.9-10.8, RI.9-10.8).',
    },
  ],
  prerequisites: ['engl.research-questions-and-sources'],
  followUps: ['engl.quoting-paraphrasing-summarizing'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Credibility judgment is a daily skill, not a school ritual — frame it around claims students already have to sort out.',
      script:
        'A post crosses your feed claiming that one cheap supplement fixes eight hours of bad sleep. Two reviews of the same pair of headphones say opposite things. A friend defends an argument with "I read it on some site." In every one of those moments you are already deciding what to believe, usually in about two seconds, usually on the strength of how confident the source sounded. Today you learn to slow that decision down to four questions, and one move that professional fact-checkers use constantly: instead of staring harder at the page in front of you, go find out what everyone else says about it.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-four-questions',
      kind: 'concept',
      goal: 'The four credibility questions, lateral reading, and the two traps that fool careful readers.',
      keyIdeas: [
        'WHO WROTE IT — look for demonstrated expertise, not confidence. Ask what training, position, or firsthand access the author has on THIS specific question. A physician writing about vaccine schedules carries weight; the same physician writing about bridge engineering does not. An unsigned page with no author at all is a warning by itself, because there is nobody to hold accountable.',
        'WHEN IT WAS WRITTEN — currency matters more for some questions than others. For a fast-moving question (medical guidance, technology, a developing news story), a source from six years ago may already be wrong. For a stable question (the events of a historical treaty, the definition of a literary term), age is not a defect and an older source may be the better one. Match the age of the source to the pace of the field.',
        'WHY IT EXISTS — every source was made for a reason: to inform, to persuade, to sell, or to attract attention. Find who paid for it and what the page wants you to do next. A page that ends in a purchase button is selling; a page that ends in a citation list is documenting. Purpose does not tell you the source is wrong, but it tells you where to check hardest.',
        'WHAT DO OTHERS SAY — this is the strongest question, and the one students skip. Does independent reporting or research reach the same conclusion? Two sources that both trace back to the same original claim are not two sources; they are one claim repeated.',
        'LATERAL READING — do not evaluate a source by reading further DOWN the page. Leave it. Open a search and find out what other people say about that organization, that author, that study. Fact-checkers judge a source from the outside in, because a source is the least reliable narrator of its own trustworthiness.',
        'PROFESSIONAL-LOOKING IS NOT CREDIBLE — clean typography, a logo, charts, and a domain that sounds official are design decisions, and anyone can buy them. Credibility lives in who wrote it and whether independent sources agree, never in how the page looks.',
        'BIAS DOES NOT AUTOMATICALLY DISQUALIFY — almost every source has a perspective, and discarding all of them leaves you with nothing. Weigh bias instead: note which direction the source leans, expect it to present the strongest case for that side, and require independent corroboration before treating its factual claims as settled.',
        'THE SINGLE-SOURCE ERROR — building a claim on one source, however good it looks, is the most common research failure. Two or three independent sources that agree beat one impressive source every time.',
      ],
      vocabulary: [
        { term: 'lateral reading', definition: 'leaving a source to see what independent sources say about it, rather than judging it from its own page.' },
        { term: 'corroboration', definition: 'independent confirmation of a claim by a source that did not get it from the first source.' },
        { term: 'purpose', definition: 'the reason a source was created — to inform, persuade, sell, or attract attention — which shapes what it includes and leaves out.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-four-questions-pass',
      kind: 'worked_example',
      problem:
        'Your research question is: "Has local farmland in your state been shrinking over the past decade?" You find a report titled "Farmland Acreage Trends" published last year by a state agriculture department, written by two staff economists, with a data appendix and a list of survey methods. Evaluate it with the four questions.',
      steps: [
        'WHO — named staff economists inside the agency that collects the state farm surveys. They have both training and firsthand access to the underlying data, and they are named, so the work is attributable. Strong.',
        'WHEN — published last year, and the question is about a decade-long trend. Acreage data moves slowly, so a one-year-old report is current enough. Strong.',
        'WHY — a state agency reporting acreage exists to inform policy and the public. Nothing on the page asks you to buy anything or join anything. Watch for one soft pressure: agencies can present their own state favorably, so treat any self-congratulatory framing more carefully than the raw acreage numbers.',
        'WHAT DO OTHERS SAY — read laterally. Search for the agency and the report to see whether a university agricultural research center or independent farm reporting cites the same acreage figures. If two independent sources land on the same numbers, the trend is corroborated.',
        'Verdict: usable as a strong source for the acreage numbers, with the mild caution that interpretation and framing are the agency\'s own and deserve a second source.',
      ],
      answer:
        'Credible and usable — named expert authorship, current for a slow-moving question, an informing purpose with only mild institutional self-interest, and figures that can be corroborated laterally.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-polish-over-substance',
      kind: 'worked_example',
      problem:
        'Same kind of question, different pair of sources. Researching whether a mineral supplement improves athletic endurance, a student finds two pages. Source A is a sleek site called "The Endurance Science Institute" with custom charts, a stock photo of a laboratory, and confident summaries, but no author names. Source B is a plain page on a university nutrition department site, one column of text, written by a named professor of exercise physiology, with a reference list. The student cites Source A. Where did the reasoning go wrong?',
      steps: [
        'Name the pull: Source A looks like authority. Charts, a scientific-sounding name, and a laboratory photo all trigger the same feeling that real expertise triggers, so the student trusted the feeling instead of testing it.',
        'Apply WHO to Source A: no author is named anywhere. There is no person with credentials attached to any claim, which means there is nobody who can be checked and nobody who is accountable.',
        'Apply WHY to Source A: read to the bottom of the page and each article ends with a link to buy a mineral blend, and the site is operated by the company that makes it. The purpose is to sell, and the claims that flatter the product are exactly the ones that need the hardest checking.',
        'Read laterally on Source A: leave the page and search the institute name. Independent coverage describes it as the marketing arm of a supplement manufacturer rather than a research body. That single search settles the question in under a minute, and no amount of reading further down the page would have revealed it.',
        'Now score Source B: a named professor of exercise physiology writing within her own field, on a university department page, with references to studies that can each be checked. Plain design, high credibility.',
        'The correction: design quality measured nothing. Once WHO and WHY were applied and the lateral check was run, the plain page was clearly the stronger source, and the polished one turned out to be advertising.',
      ],
      answer:
        'The student mistook production quality for evidence quality. Source A is anonymous, commercially motivated, and revealed by one lateral search to be a manufacturer\'s marketing site; Source B is the credible source despite looking plainer.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-most-credible',
      kind: 'try_yourself',
      problem:
        'Research question: "How effective are school start-time delays at improving teen sleep?" Which source is the most credible for answering it?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'A peer-reviewed study of teen sleep outcomes in twelve districts, published three years ago by researchers at a university sleep laboratory.', correct: true },
        { id: 'b', text: 'A polished blog post on a site run by a company that sells sleep-tracking wristbands, with no author listed.' },
        { id: 'c', text: 'A parent forum thread where fourteen people describe how the change affected their own teenagers.' },
        { id: 'd', text: 'A newspaper column from nineteen years ago arguing that later start times would be too expensive to schedule.' },
      ],
      expectedAnswer:
        'A peer-reviewed study of teen sleep outcomes in twelve districts, published three years ago by researchers at a university sleep laboratory.',
      hints: [
        'Run WHO and WHY on each option: which one has named researchers with relevant expertise and no product to sell?',
        'The forum offers personal anecdote rather than measured outcomes, the wristband post is anonymous and selling, and the column is both nineteen years old and about cost rather than sleep.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-name-the-problem',
      kind: 'try_yourself',
      problem:
        'A student supports the claim "a new water-filter design removes nearly all lead" with a glossy report published by the trade association of filter manufacturers. The report is dated this year, is written by a named engineer, and cites its own testing. What is the credibility problem?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The source is out of date, so its testing no longer reflects current filter designs.' },
        { id: 'b', text: 'The source has a commercial interest in the result and its testing is not independently corroborated.', correct: true },
        { id: 'c', text: 'The source is unusable because it was written by an engineer rather than a journalist.' },
        { id: 'd', text: 'The source is worthless because any organization with a point of view must be discarded.' },
      ],
      expectedAnswer:
        'The source has a commercial interest in the result and its testing is not independently corroborated.',
      hints: [
        'Check each question in turn. WHEN and WHO both look fine here, so the problem is hiding in one of the other two.',
        'A trade association exists to advance its members\' products, and the only testing cited is its own — bias plus a single source, not a disqualification but a demand for corroboration.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-lateral-move',
      kind: 'try_yourself',
      problem:
        'You land on a confident page from an organization you have never heard of, called the Center for Family Nutrition Policy. What is the best lateral-reading move?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Read the rest of the page carefully to see whether the argument holds together.' },
        { id: 'b', text: 'Open the About page on the same site to learn who the organization is.' },
        { id: 'c', text: 'Leave the site and search for what independent sources report about the organization and who funds it.', correct: true },
        { id: 'd', text: 'Check whether the site looks professionally designed and uses an official-sounding web address.' },
      ],
      expectedAnswer:
        'Leave the site and search for what independent sources report about the organization and who funds it.',
      hints: [
        'Lateral means sideways — away from the page, not further down it.',
        'The About page and the design are both written or chosen by the source itself, so neither is independent evidence about the source.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-design-equals-evidence',
      kind: 'misconception_check',
      question:
        'A student defends a source this way: "It has to be reliable — the site is beautifully designed, the charts look professional, and the organization has an official-sounding name." What went wrong?',
      commonErrors: [
        {
          answer: 'A polished, professional-looking site is evidence that the information is trustworthy',
          misconception: 'Treating design quality as evidence quality — using production values as a proxy for expertise and accuracy.',
          correctsTo:
            'Design is purchased, not earned: a template, a logo, and a chart tool are available to anyone, including a company selling a product. Credibility comes from named expertise, an honest purpose, and corroboration by independent sources. Test the source laterally instead — leave the page and see what others say about it, because a plain page by a named expert routinely beats a beautiful page by nobody in particular.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Four questions: WHO wrote it and what expertise do they have, WHEN was it written and does the field move fast, WHY does it exist and who pays for it, and WHAT DO OTHERS SAY.',
        'Read laterally — leave the source and search for what independent sources say about it. A source is the least reliable narrator of its own trustworthiness.',
        'Professional design is a purchase, not proof; bias is something to weigh and corroborate, not an automatic disqualification.',
        'One impressive source is not enough — independent agreement is what turns a claim into support.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '10', cedTopic: '10.2', cedTitle: 'Evaluating Source Credibility' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
