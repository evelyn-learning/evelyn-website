/**
 * AP US History — Unit 5 CED 5.4-5.6: The Sectional Crisis of the
 * 1850s.
 *
 * Hand-authored baseline mirroring the lesson plan
 * `evelyn.ap.apush.sectional-crisis.v1`. Covers the Compromise of
 * 1850, Uncle Tom's Cabin, the Kansas-Nebraska Act and Bleeding
 * Kansas, Dred Scott v. Sandford, the Lincoln-Douglas debates, and
 * John Brown's raid, treating the sequence as escalation rather than
 * inevitability. No passage anchor (unwired plan).
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_APUSH_SECTIONAL_CRISIS: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.apush.sectional-crisis.v1',
  course: 'AP United States History',
  cedUnit: 5,
  cedTopic: '5.4-5.6',
  cedTitle: 'The Sectional Crisis of the 1850s',
  planId: 'evelyn.ap.apush.sectional-crisis.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-11',
  sources: [{ type: 'plan', planId: 'evelyn.ap.apush.sectional-crisis.v1' }],
  theory: [
    {
      loId: 'apush.sectional-crisis',
      kind: 'definition',
      title: 'popular sovereignty',
      content:
        "The principle that a territory's own settlers, not Congress, should vote to decide whether to permit slavery there. Applied in the Compromise of 1850 (Utah, New Mexico) and the Kansas-Nebraska Act (1854); its ambiguity (when could a territory decide, and how) fueled Bleeding Kansas.",
    },
    {
      loId: 'apush.sectional-crisis',
      kind: 'definition',
      title: 'Fugitive Slave Act (1850)',
      content:
        'A strengthened federal law, part of the Compromise of 1850, compelling Northern officials and citizens to assist in capturing and returning escaped enslaved people, with no jury trial for the accused. Its enforcement inspired Harriet Beecher Stowe\'s Uncle Tom\'s Cabin (1852).',
    },
    {
      loId: 'apush.sectional-crisis',
      kind: 'definition',
      title: 'Dred Scott v. Sandford (1857)',
      content:
        'Supreme Court ruling (Chief Justice Taney) holding Black Americans could not be US citizens and that Congress had no constitutional power to ban slavery in the territories at all — invalidating the already-repealed Missouri Compromise line and undermining popular sovereignty\'s compromise logic.',
    },
    {
      loId: 'apush.sectional-crisis',
      kind: 'event',
      title: 'the Compromise of 1850',
      content:
        'Admitted California as a free state, organized Utah and New Mexico territories under popular sovereignty, settled a Texas boundary dispute, banned the slave trade (not slavery) in Washington, D.C., and enacted a much stronger Fugitive Slave Act. Many contemporaries, including its architects, believed it a permanent settlement.',
    },
    {
      loId: 'apush.sectional-crisis',
      kind: 'event',
      title: "Uncle Tom's Cabin (Harriet Beecher Stowe, 1852)",
      content:
        "Dramatized slavery's human cost, including the Fugitive Slave Act's cruelty, for a mass Northern readership that had often treated slavery as a distant abstraction — deepening Northern antislavery sentiment and provoking Southern rebuttal literature.",
    },
    {
      loId: 'apush.sectional-crisis',
      kind: 'event',
      title: 'the Kansas-Nebraska Act (1854) and Bleeding Kansas',
      content:
        "Stephen Douglas's law organized Kansas and Nebraska under popular sovereignty, applying it north of the Missouri Compromise line (36°30') and effectively repealing that 1820 settlement. Pro- and antislavery settlers rushed into Kansas to influence the vote, producing violent conflict (Bleeding Kansas).",
    },
    {
      loId: 'apush.sectional-crisis',
      kind: 'event',
      title: 'the Lincoln-Douglas debates (1858) and the Freeport Doctrine',
      content:
        'During the Illinois Senate race, Lincoln and Douglas debated slavery\'s expansion nationally. Douglas\'s Freeport Doctrine — that a territory could exclude slavery in practice by not passing laws protecting it, regardless of Dred Scott — alienated Southern Democrats who wanted federal protection guaranteed outright, splitting the party ahead of 1860.',
    },
    {
      loId: 'apush.sectional-crisis',
      kind: 'event',
      title: "John Brown's raid on Harpers Ferry (1859)",
      content:
        'Abolitionist John Brown led an armed attempt to seize the federal arsenal at Harpers Ferry, Virginia, to spark a wider enslaved uprising. He was captured, tried, and executed; the raid deepened Southern fears of a Northern conspiracy while some Northern abolitionists treated Brown as a martyr.',
    },
    {
      loId: 'apush.sectional-crisis',
      kind: 'framework',
      title: 'the escalation chain, 1850-1859',
      content:
        'Kansas-Nebraska (1854) reopened the territorial question the Compromise of 1850 had tried to close → Dred Scott (1857) removed even popular sovereignty\'s compromise logic by denying Congress power to ban slavery in territories at all → Lincoln-Douglas (1858) turned the conflict into national spectacle and split the Democratic Party → Harpers Ferry (1859) convinced each side the other would use force.',
    },
    {
      loId: 'apush.sectional-crisis',
      kind: 'trap',
      title: 'the Civil War was not inevitable by 1850',
      content:
        "The Compromise of 1850's own architects believed they had achieved a lasting settlement — incompatible with treating disunion as already fixed. War became foreseeable only through the specific 1854-1859 chain of ruptures, not colonial-style destiny. Avoid presentism when writing about 1850.",
    },
    {
      loId: 'apush.sectional-crisis',
      kind: 'framework',
      title: 'compromise mechanisms breaking down, one by one',
      content:
        'Track which compromise tool failed at each step: the Missouri Compromise line (repealed by Kansas-Nebraska, 1854) → popular sovereignty itself (undermined by Dred Scott, 1857) → the Democratic Party as a national institution (split by the Freeport Doctrine fallout, 1858) → political persuasion itself (undercut by armed action, Harpers Ferry, 1859).',
    },
  ],
  methods: [
    {
      title: 'Evaluate a "was X inevitable?" AP prompt',
      when_to_use:
        'Use this whenever an SAQ/LEQ/DBQ asks you to evaluate the extent to which an outcome (war, a law\'s passage, a political realignment) was inevitable at an earlier point in time.',
      steps: [
        'IDENTIFY THE EARLIER MOMENT the prompt asks about, and state what contemporaries at THAT moment actually believed or expected — not what you know happened later.',
        'LIST THE SPECIFIC INTERVENING EVENTS between that moment and the outcome, in order.',
        'FOR EACH EVENT, name what compromise mechanism, institution, or assumption it broke that had existed before it.',
        'CONCLUDE by stating the outcome resulted from this specific chain, not from destiny fixed at the earlier moment — avoid presentism.',
      ],
      example: {
        problem: 'Evaluate the extent to which the Civil War was inevitable by 1850.',
        solution:
          "Not inevitable in 1850 — the Compromise's own supporters believed it a lasting settlement. War became likely only through Kansas-Nebraska (1854, reopened the territorial question), Dred Scott (1857, removed the compromise logic), the Lincoln-Douglas debates (1858, split the Democratic Party), and Harpers Ferry (1859, convinced each side the other would use force) — a specific nine-year chain, not a fixed destiny.",
      },
      relatedLoIds: ['apush.sectional-crisis'],
    },
  ],
  pointers: [
    { content: 'Kansas-Nebraska (1854) REPEALED the Missouri Compromise line via popular sovereignty — it did not simply extend or apply that line.', kind: 'trap' },
    { content: 'Dred Scott (1857) ruled Congress could not ban slavery in ANY territory — broader than just invalidating the Missouri Compromise line specifically.', kind: 'tip' },
    { content: 'The Freeport Doctrine tried to reconcile popular sovereignty with Dred Scott — know it split the Democratic Party rather than settling the sectional question.', kind: 'tip' },
    { content: 'The #1 trap: treating 1850 as already sealing the Civil War\'s fate. Trace the specific 1854-1859 chain instead of assuming destiny.', kind: 'trap' },
    { content: "Uncle Tom's Cabin is a novel, not a legal or political document — its role is shifting Northern public opinion, not changing law directly.", kind: 'tip' },
  ],
};
