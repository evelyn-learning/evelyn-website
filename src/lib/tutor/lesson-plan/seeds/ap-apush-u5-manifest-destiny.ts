/**
 * AP US History — CED Unit 5.2-5.3: Manifest Destiny and the
 * Mexican-American War.
 *
 * Period-5 content plan (follows the causes-of-revolution calibration
 * template — see ap-apush-u3-causes-of-revolution.ts). Covers Texas
 * annexation (1845), the Oregon dispute (1846), the Mexican-American
 * War (1846-48) and the Treaty of Guadalupe Hidalgo, the Wilmot
 * Proviso, and the California Gold Rush — and pushes back on the
 * misconception that expansionist ideology went uncontested.
 *
 * Anchor text: John L. O'Sullivan, "Annexation" (1845) —
 * evelyn.passage.apush-osullivan-annexation.v1 — the essay that coined
 * "manifest destiny." Quoted only as the single sentence already
 * seeded; the essay's broader argument (that Britain and France had
 * diplomatically encouraged Texas to remain independent, partly to
 * check American power and partly out of British anti-slavery
 * interest) is the student's own outside evidence, not attributed to
 * the passage's content.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APUSH_U5_MANIFEST_DESTINY: LessonPlan = {
  id: 'evelyn.ap.apush.manifest-destiny.v1',
  title: 'U5.2 Manifest Destiny and the Mexican-American War',
  curriculum: 'AP',
  grade: '11',
  subject: 'ss',
  topic: 'ap-us-history',
  locale: 'en',
  los: [
    {
      id: 'apush.manifest-destiny',
      description:
        'Explain the ideology of manifest destiny and its role in Texas annexation, the Oregon dispute, and the Mexican-American War, including the Wilmot Proviso and the California Gold Rush, and evaluate the extent to which expansionism was politically contested rather than a national consensus.',
      standard: 'AP-APUSH-5.2',
    },
  ],
  prerequisites: ['apush.jacksonian-democracy'],
  followUps: ['apush.sectional-crisis'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make manifest destiny feel like a contested political argument invented to justify a specific 1840s land grab, not a timeless American belief.',
      script:
        "In the summer of 1845, a magazine editor named John O'Sullivan coined a phrase that would outlive almost everything else he ever wrote: \"manifest destiny.\" He didn't invent the idea that America might expand westward — settlers, speculators, and politicians had been pushing that for decades. What he did was give a specific, contested argument — that Britain and France had no business objecting to America annexing Texas — a name that made expansion sound inevitable, even divinely ordained. Within three years, the United States would fight a war with Mexico, gain roughly half of Mexico's territory, and open a fight over slavery in the new lands that would outlast the war itself. Today we're tracing how a magazine phrase turned into a war, a treaty, and a political crisis — and asking who, exactly, thought this \"destiny\" was so obvious.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-manifest-destiny',
      kind: 'concept',
      goal: 'Explain Texas annexation, the Oregon settlement, the Mexican-American War and its territorial and political consequences, and the contested nature of manifest destiny.',
      keyIdeas: [
        'MANIFEST DESTINY: the belief, popularized by the phrase John O\'Sullivan coined in his 1845 essay "Annexation," that the United States was providentially destined to expand across the North American continent. It combined religious and racial justifications with concrete political arguments for specific annexations already underway.',
        'TEXAS ANNEXATION (1845): American settlers had moved into Mexican Texas through the 1820s-30s; cultural and political tensions (including over slavery, which Mexico had abolished) led to the Texas Revolution (1836) and a decade of Texan independence. The United States annexed Texas by congressional joint resolution in 1845 — the very question O\'Sullivan\'s essay was written to defend against foreign objection.',
        'THE OREGON DISPUTE (1846): the US and Britain had jointly occupied the Oregon Country since 1818. Expansionist Democrats campaigned in 1844 on "Fifty-Four Forty or Fight," demanding the entire territory up to the line of 54°40\'. The dispute was resolved DIPLOMATICALLY, not by war: the Oregon Treaty (1846) split the territory at the 49th parallel, the modern US-Canada border in the region.',
        "THE MEXICAN-AMERICAN WAR (1846-1848): Texas annexation created a border dispute with Mexico (the US claimed the Rio Grande as the border; Mexico maintained it was the Nueces River, farther north). President Polk sent troops into the disputed zone, provoking a clash that Polk used to ask Congress for a declaration of war in 1846. The war ended with the Treaty of Guadalupe Hidalgo (1848): Mexico ceded roughly half its territory — the MEXICAN CESSION, including California and the future New Mexico, Arizona, Nevada, Utah, and parts of Colorado and Wyoming — in exchange for a US payment and assumption of some claims.",
        'THE WILMOT PROVISO (1846): Pennsylvania congressman David Wilmot proposed banning slavery in any territory acquired from Mexico. It repeatedly passed the House (where the more populous North had a majority) but failed in the Senate (where slave and free states were evenly balanced), and it never became law — but it revealed that territorial expansion had reopened the exact question the country had tried to set aside: whether slavery would expand into new Western land.',
        "THE CALIFORNIA GOLD RUSH (1848-49): gold was discovered at Sutter's Mill in January 1848, just before Guadalupe Hidalgo was signed. The resulting rush of migration swelled California's population so fast that it applied for statehood as a FREE state within two years — forcing Congress to confront the territorial slavery question immediately, rather than gradually, and setting up the crisis that produced the Compromise of 1850.",
        'MANIFEST DESTINY WAS CONTESTED, NOT CONSENSUS: expansion had real, organized opposition. Whigs in Congress broadly opposed the Mexican War as an unnecessary, presidentially provoked conflict; a freshman Whig congressman named Abraham Lincoln introduced the "Spot Resolutions" (1847) demanding Polk identify the exact spot where American blood had supposedly been shed on American soil. Abolitionists and antislavery Northerners opposed the war specifically because they saw it as a scheme to expand slaveholding territory — a fear the Wilmot Proviso fight then confirmed.',
      ],
      vocabulary: [
        {
          term: 'manifest destiny',
          definition:
            'the belief, named by John O\'Sullivan\'s 1845 essay "Annexation," that the United States was providentially destined to expand across the continent — a contested political argument, not a national consensus.',
        },
        {
          term: 'Mexican Cession',
          definition:
            'the roughly half of Mexico\'s territory (including California and the future New Mexico, Arizona, Nevada, Utah) ceded to the United States under the Treaty of Guadalupe Hidalgo (1848), which ended the Mexican-American War.',
        },
        {
          term: 'Wilmot Proviso',
          definition:
            "David Wilmot's 1846 proposal to ban slavery in any territory acquired from Mexico; repeatedly passed the House but failed in the Senate and never became law, but revealed expansion had reopened the fight over slavery's spread.",
        },
        {
          term: 'Oregon Treaty (1846)',
          definition:
            'the diplomatic settlement splitting the jointly occupied Oregon Country between the US and Britain at the 49th parallel, resolving the dispute without war.',
        },
        {
          term: 'Spot Resolutions',
          definition:
            "Abraham Lincoln's 1847 congressional resolutions demanding President Polk identify the exact \"spot\" where American blood was shed to justify the Mexican War — an example of organized political opposition to the war.",
        },
      ],
      passageId: 'evelyn.passage.apush-osullivan-annexation.v1',
      estimatedMinutes: 6,
    },
    {
      id: 'worked-osullivan-annexation',
      kind: 'worked_example',
      problem:
        'Analyze this sentence from John L. O\'Sullivan\'s "Annexation" (The United States Magazine and Democratic Review, July-August 1845): "Why, were other reasoning wanting, in favor of now elevating this question of the reception of Texas into the Union, out of the lower region of our past party dissensions, up to its proper level of a high and broad nationality, it surely is to be found, found abundantly, in the manner in which other nations have undertaken to intrude themselves into it, between us and the proper parties to the case, in a spirit of hostile interference against us, for the avowed object of thwarting our policy and hampering our power, limiting our greatness and checking the fulfilment of our manifest destiny to overspread the continent allotted by Providence for the free development of our yearly multiplying millions." What is O\'Sullivan arguing, and what does the phrase he coins reveal about how expansionists justified annexation?',
      steps: [
        "SOURCE IT FIRST. John L. O'Sullivan, a Democratic magazine editor, writing in the summer of 1845 — after Congress had already voted to annex Texas by joint resolution, but while the annexation remained a live, contested question, both domestically (\"our past party dissensions\") and internationally.",
        'IDENTIFY THE CLAIM. O\'Sullivan argues Texas annexation should be lifted "out of the lower region of our past party dissensions" (i.e., stop treating it as a partisan squabble) because OTHER NATIONS have interfered "in a spirit of hostile interference against us" to thwart it — reframing a domestic political fight as a matter of national sovereignty under foreign threat.',
        'IDENTIFY THE PHRASE HE COINS. "Manifest destiny to overspread the continent allotted by Providence" — this single clause gives the whole expansionist argument a name: American continental expansion is not one policy choice among several, but a destiny "allotted by Providence," making foreign objection to it sound illegitimate by definition.',
        'READ THE RHETORICAL MOVE CRITICALLY. Calling something "manifest" (obvious, self-evident) and "Providence[-allotted]" is itself an argument, not a neutral description — it forecloses debate by treating a contested annexation (which many Whigs and antislavery Northerners opposed, partly over fears of expanding slave territory) as though its rightness required no defense.',
        "CONNECT TO THE HISTORICAL CONTEXT. Britain and France had in fact engaged diplomatically with the independent Republic of Texas, partly to preserve a counterweight to US power in North America and partly out of British antislavery interest in an independent, non-slaveholding Texas — real diplomatic activity that O'Sullivan recasts here as illegitimate \"hostile interference,\" the outside evidence a student would bring to fully contextualize this claim.",
        "STATE THE LINK TO THE COURSE THESIS. O'Sullivan's essay shows expansionist Democrats supplying a providential, nationalist justification for a specific, still-contested policy (Texas annexation) — turning a partisan and diplomatic dispute into what would become the enduring rhetorical banner, \"manifest destiny,\" for the decade of expansion that followed.",
      ],
      answer:
        'O\'Sullivan argues that Texas annexation should be treated not as a partisan dispute but as a matter of national destiny under threat from foreign meddling, and in doing so he coins "manifest destiny" — the claim that continental expansion is providentially "allotted," not merely one contested policy choice among others. That rhetorical move is itself evidence of contestation: by insisting expansion is "manifest" (self-evident) and Providence-ordained, O\'Sullivan is arguing against real domestic opposition (Whigs, antislavery Northerners) and against real foreign diplomatic activity (Britain and France\'s engagement with independent Texas, partly over antislavery interest), which he recasts as illegitimate "hostile interference." The passage shows expansionist ideology being manufactured, in real time, to settle a genuinely disputed annexation — not describing a preexisting national consensus.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-saq',
      kind: 'try_yourself',
      problem:
        'SAQ practice. (a) Briefly describe ONE specific way the United States acquired territory in the 1840s (Texas annexation, the Oregon Treaty, or the Mexican Cession). (b) Briefly explain ONE way that territorial expansion reopened the political conflict over slavery (e.g., the Wilmot Proviso). (c) Briefly explain ONE piece of evidence that manifest destiny was politically contested rather than a national consensus.',
      responseFormat: 'frq',
      rubric: {
        parts: [
          {
            criterionId: 'a',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): correctly and specifically describes a genuine 1840s territorial acquisition — Texas annexation (1845), the Oregon Treaty (1846, 49th parallel), or the Mexican Cession via the Treaty of Guadalupe Hidalgo (1848). No credit for a vague statement ("America got bigger") with no specific acquisition named.',
            modelResponse:
              "The United States annexed Texas by congressional joint resolution in 1845, then acquired California and much of the future Southwest as the Mexican Cession under the Treaty of Guadalupe Hidalgo in 1848, after winning the Mexican-American War.",
          },
          {
            criterionId: 'b',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains a specific, accurate connection between territorial expansion and the reopened slavery conflict — e.g., the Wilmot Proviso (1846) proposing to ban slavery in territory won from Mexico, or California\'s 1849-50 free-state statehood bid. No credit for a vague or unconnected claim.',
            modelResponse:
              "The Wilmot Proviso (1846) proposed banning slavery in any territory acquired from Mexico; it repeatedly passed the House but failed in the Senate, showing that newly acquired Western land reopened the sectional fight over whether slavery would expand.",
          },
          {
            criterionId: 'c',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains specific, accurate evidence that expansion was contested — e.g., Whig opposition to the Mexican War, Lincoln\'s Spot Resolutions (1847), or antislavery Northern opposition tied to fears of expanding slave territory. No credit for a vague or unsupported claim.',
            modelResponse:
              'Whig congressman Abraham Lincoln introduced the Spot Resolutions in 1847, demanding President Polk identify the exact spot where American blood had been shed to justify the war — direct evidence that the Mexican War, and the expansionism behind it, was politically contested rather than universally supported.',
          },
        ],
      },
      estimatedMinutes: 5,
    },
    {
      id: 'misconception-uncontested',
      kind: 'misconception_check',
      question:
        'True or false: manifest destiny was a widely shared, largely uncontested belief in 1840s America.',
      commonErrors: [
        {
          answer: 'true',
          misconception:
            "Reading a single, memorable slogan as though it reflected national consensus, rather than a specific political argument advanced by expansionist Democrats against real, organized opposition.",
          correctsTo:
            'FALSE. Manifest destiny was a contested political argument, not a national consensus. Whigs in Congress broadly opposed the Mexican War as an unnecessary conflict provoked by President Polk; Abraham Lincoln\'s 1847 Spot Resolutions publicly challenged Polk\'s justification for the war; and abolitionists and antislavery Northerners opposed the war specifically because they feared — correctly, as the Wilmot Proviso fight showed — that new territory would become new slave territory. Treating "manifest destiny" as a description of universal American belief, rather than an argument some Americans made and others actively fought, is a common and testable AP US History error.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'John O\'Sullivan coined "manifest destiny" in 1845 to defend a specific, contested policy — Texas annexation — as providentially inevitable, not to describe a preexisting consensus.',
        'Texas was annexed in 1845; the Oregon dispute was settled diplomatically by the Oregon Treaty (1846, 49th parallel); the Mexican-American War (1846-48) ended with the Treaty of Guadalupe Hidalgo, ceding the Mexican Cession.',
        'The Wilmot Proviso (1846) failed to pass, but revealed that newly acquired Western territory reopened the sectional fight over slavery\'s expansion.',
        'The California Gold Rush (1848-49) accelerated California\'s free-state statehood bid, forcing Congress to confront the territorial slavery question immediately.',
        'Expansion was politically contested — Whig opposition to the war, Lincoln\'s Spot Resolutions, and antislavery fears of slavery\'s spread — not a uniform national belief.',
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '5',
    cedTopic: '5.2-5.3',
    cedTitle: 'Manifest Destiny and the Mexican-American War',
    sources: [
      { type: 'plan', source: 'AP Plans Initiative — AP US History' },
      {
        type: 'passage',
        book: 'evelyn.passage.apush-osullivan-annexation.v1',
        chapter: '1845',
        note: 'John L. O\'Sullivan, "Annexation" — the essay that coined "manifest destiny," analyzed as a contested argument for Texas annexation, not a description of national consensus.',
      },
    ],
  },
};
