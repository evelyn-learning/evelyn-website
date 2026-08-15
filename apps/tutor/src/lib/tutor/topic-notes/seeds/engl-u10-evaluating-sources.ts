/**
 * HS English — Unit 10 CED 10.2: Evaluating Source Credibility.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.engl.evaluating-sources.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_ENGL_U10_EVALUATING_SOURCES: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.engl.evaluating-sources.v1',
  course: 'HS English',
  cedUnit: 10,
  cedTopic: '10.2',
  cedTitle: 'Evaluating Source Credibility',
  planId: 'evelyn.hs.engl.evaluating-sources.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.engl.evaluating-sources.v1' }],
  theory: [
    { loId: 'engl.evaluating-sources', kind: 'framework', title: 'Who wrote it', content: `WHO WROTE IT — look for demonstrated expertise, not confidence. Ask what training, position, or firsthand access the author has on THIS specific question. A physician writing about vaccine schedules carries weight; the same physician writing about bridge engineering does not. An unsigned page with no author at all is a warning by itself, because there is nobody to hold accountable.` },
    { loId: 'engl.evaluating-sources', kind: 'framework', title: 'When it was written', content: `WHEN IT WAS WRITTEN — currency matters more for some questions than others. For a fast-moving question (medical guidance, technology, a developing news story), a source from six years ago may already be wrong. For a stable question (the events of a historical treaty, the definition of a literary term), age is not a defect and an older source may be the better one. Match the age of the source to the pace of the field.` },
    { loId: 'engl.evaluating-sources', kind: 'framework', title: 'Why it exists', content: `WHY IT EXISTS — every source was made for a reason: to inform, to persuade, to sell, or to attract attention. Find who paid for it and what the page wants you to do next. A page that ends in a purchase button is selling; a page that ends in a citation list is documenting. Purpose does not tell you the source is wrong, but it tells you where to check hardest.` },
    { loId: 'engl.evaluating-sources', kind: 'framework', title: 'What do others say', content: `WHAT DO OTHERS SAY — this is the strongest question, and the one students skip. Does independent reporting or research reach the same conclusion? Two sources that both trace back to the same original claim are not two sources; they are one claim repeated.` },
    { loId: 'engl.evaluating-sources', kind: 'framework', title: 'Lateral reading', content: `LATERAL READING — do not evaluate a source by reading further DOWN the page. Leave it. Open a search and find out what other people say about that organization, that author, that study. Fact-checkers judge a source from the outside in, because a source is the least reliable narrator of its own trustworthiness.` },
    { loId: 'engl.evaluating-sources', kind: 'framework', title: 'Professional-looking is not credible', content: `PROFESSIONAL-LOOKING IS NOT CREDIBLE — clean typography, a logo, charts, and a domain that sounds official are design decisions, and anyone can buy them. Credibility lives in who wrote it and whether independent sources agree, never in how the page looks.` },
    { loId: 'engl.evaluating-sources', kind: 'framework', title: 'Bias does not automatically disqualify', content: `BIAS DOES NOT AUTOMATICALLY DISQUALIFY — almost every source has a perspective, and discarding all of them leaves you with nothing. Weigh bias instead: note which direction the source leans, expect it to present the strongest case for that side, and require independent corroboration before treating its factual claims as settled.` },
    { loId: 'engl.evaluating-sources', kind: 'framework', title: 'The single-source error', content: `THE SINGLE-SOURCE ERROR — building a claim on one source, however good it looks, is the most common research failure. Two or three independent sources that agree beat one impressive source every time.` },
    { loId: 'engl.evaluating-sources', kind: 'definition', title: 'lateral reading', content: `leaving a source to see what independent sources say about it, rather than judging it from its own page.` },
    { loId: 'engl.evaluating-sources', kind: 'definition', title: 'corroboration', content: `independent confirmation of a claim by a source that did not get it from the first source.` },
    { loId: 'engl.evaluating-sources', kind: 'definition', title: 'purpose', content: `the reason a source was created — to inform, persuade, sell, or attract attention — which shapes what it includes and leaves out.` },
  ],
  methods: [
    {
      title: 'Worked four questions pass',
      steps: [
        `WHO — named staff economists inside the agency that collects the state farm surveys. They have both training and firsthand access to the underlying data, and they are named, so the work is attributable. Strong.`,
        `WHEN — published last year, and the question is about a decade-long trend. Acreage data moves slowly, so a one-year-old report is current enough. Strong.`,
        `WHY — a state agency reporting acreage exists to inform policy and the public. Nothing on the page asks you to buy anything or join anything. Watch for one soft pressure: agencies can present their own state favorably, so treat any self-congratulatory framing more carefully than the raw acreage numbers.`,
        `WHAT DO OTHERS SAY — read laterally. Search for the agency and the report to see whether a university agricultural research center or independent farm reporting cites the same acreage figures. If two independent sources land on the same numbers, the trend is corroborated.`,
        `Verdict: usable as a strong source for the acreage numbers, with the mild caution that interpretation and framing are the agency's own and deserve a second source.`,
      ],
      example: { problem: `Your research question is: "Has local farmland in your state been shrinking over the past decade?" You find a report titled "Farmland Acreage Trends" published last year by a state agriculture department, written by two staff economists, with a data appendix and a list of survey methods. Evaluate it with the four questions.`, solution: `Credible and usable — named expert authorship, current for a slow-moving question, an informing purpose with only mild institutional self-interest, and figures that can be corroborated laterally.` },
      relatedLoIds: ['engl.evaluating-sources'],
    },
    {
      title: 'Worked polish over substance',
      steps: [
        `Name the pull: Source A looks like authority. Charts, a scientific-sounding name, and a laboratory photo all trigger the same feeling that real expertise triggers, so the student trusted the feeling instead of testing it.`,
        `Apply WHO to Source A: no author is named anywhere. There is no person with credentials attached to any claim, which means there is nobody who can be checked and nobody who is accountable.`,
        `Apply WHY to Source A: read to the bottom of the page and each article ends with a link to buy a mineral blend, and the site is operated by the company that makes it. The purpose is to sell, and the claims that flatter the product are exactly the ones that need the hardest checking.`,
        `Read laterally on Source A: leave the page and search the institute name. Independent coverage describes it as the marketing arm of a supplement manufacturer rather than a research body. That single search settles the question in under a minute, and no amount of reading further down the page would have revealed it.`,
        `Now score Source B: a named professor of exercise physiology writing within her own field, on a university department page, with references to studies that can each be checked. Plain design, high credibility.`,
        `The correction: design quality measured nothing. Once WHO and WHY were applied and the lateral check was run, the plain page was clearly the stronger source, and the polished one turned out to be advertising.`,
      ],
      example: { problem: `Same kind of question, different pair of sources. Researching whether a mineral supplement improves athletic endurance, a student finds two pages. Source A is a sleek site called "The Endurance Science Institute" with custom charts, a stock photo of a laboratory, and confident summaries, but no author names. Source B is a plain page on a university nutrition department site, one column of text, written by a named professor of exercise physiology, with a reference list. The student cites Source A. Where did the reasoning go wrong?`, solution: `The student mistook production quality for evidence quality. Source A is anonymous, commercially motivated, and revealed by one lateral search to be a manufacturer's marketing site; Source B is the credible source despite looking plainer.` },
      relatedLoIds: ['engl.evaluating-sources'],
    },
  ],
  pointers: [
    { content: `Design is purchased, not earned: a template, a logo, and a chart tool are available to anyone, including a company selling a product. Credibility comes from named expertise, an honest purpose, and corroboration by independent sources. Test the source laterally instead — leave the page and see what others say about it, because a plain page by a named expert routinely beats a beautiful page by nobody in particular.`, kind: 'common-error' },
    { content: `Four questions: WHO wrote it and what expertise do they have, WHEN was it written and does the field move fast, WHY does it exist and who pays for it, and WHAT DO OTHERS SAY.`, kind: 'tip' },
    { content: `Read laterally — leave the source and search for what independent sources say about it. A source is the least reliable narrator of its own trustworthiness.`, kind: 'tip' },
    { content: `Professional design is a purchase, not proof; bias is something to weigh and corroborate, not an automatic disqualification.`, kind: 'tip' },
    { content: `One impressive source is not enough — independent agreement is what turns a claim into support.`, kind: 'tip' },
    { content: `Two sources aren't corroboration if both trace back to the same original claim. Before counting a source as independent, check whether it's just repeating (or citing) the first one. Three articles quoting one press release = one source.`, kind: 'common-error' },
    { content: `"Lateral reading" means LEAVING the page to search what others say about the source — not scrolling further down it. Reading the About page, the mission statement, or the footer is still vertical reading, and the source is grading its own homework.`, kind: 'vocab-note' },
    { content: `Don't disqualify a source just because it has a perspective. Bias is weighed, not banned: name which direction it leans, expect the strongest case for that side, and require independent corroboration before treating its facts as settled.`, kind: 'gotcha' },
    { content: `Expertise is topic-specific, not a general status. A credentialed author outside their field carries no more weight than anyone else. Ask what training or firsthand access they have on *this* question, not whether the title sounds impressive.`, kind: 'common-error' },
    { content: `"Old" isn't automatically "bad." Match source age to how fast the field moves: six years is stale for medical guidance or a developing story, and irrelevant for the terms of a 1919 treaty or the definition of a literary device.`, kind: 'edge-case' },
    { content: `No named author is a finding, not a blank. Write it down as a weakness — an unsigned page means nobody is accountable and nobody's credentials can be checked. Don't skip WHO just because the answer is missing.`, kind: 'gotcha' },
    { content: `Check what the page wants you to do next. A purchase button, a donation ask, or a signup form signals a selling/persuading purpose; a reference list signals documenting. Purpose doesn't prove the source is wrong — it tells you which claims to check hardest.`, kind: 'tip' },
    { content: `Design is bought, not earned. Charts, a laboratory photo, a logo, and an "Institute" or "Center" in the name are all purchasable by anyone, including a manufacturer's marketing arm. A plain page by a named expert routinely beats a beautiful page by nobody.`, kind: 'common-error' },
  ],
};
