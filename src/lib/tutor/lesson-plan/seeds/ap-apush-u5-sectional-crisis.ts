/**
 * AP US History — CED Unit 5.4-5.6: The Sectional Crisis of the 1850s.
 *
 * Period-5 content plan. Covers the Compromise of 1850 and the
 * strengthened Fugitive Slave Act, Uncle Tom's Cabin, the
 * Kansas-Nebraska Act and Bleeding Kansas, Dred Scott v. Sandford, the
 * Lincoln-Douglas debates, and John Brown's raid on Harpers Ferry.
 *
 * No passage wired for this plan (per the Period-5 content-plan spec)
 * — the worked example instead analyzes the escalating sequence of
 * events between 1850 and 1859 as evidence against treating the Civil
 * War as inevitable at mid-century.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APUSH_U5_SECTIONAL_CRISIS: LessonPlan = {
  id: 'evelyn.ap.apush.sectional-crisis.v1',
  title: 'U5.4 The Sectional Crisis of the 1850s',
  curriculum: 'AP',
  grade: '11',
  subject: 'ss',
  topic: 'ap-us-history',
  locale: 'en',
  los: [
    {
      id: 'apush.sectional-crisis',
      description:
        'Explain how the Compromise of 1850, the Kansas-Nebraska Act, Dred Scott v. Sandford, the Lincoln-Douglas debates, and John Brown\'s raid progressively escalated sectional conflict over slavery in the 1850s, and evaluate the extent to which the Civil War was or was not a foregone conclusion by 1850.',
      standard: 'AP-APUSH-5.4',
    },
  ],
  prerequisites: ['apush.manifest-destiny', 'apush.slavery-south'],
  followUps: ['apush.secession-civil-war'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the 1850s feel like a specific, escalating sequence of ruptured compromises rather than a foregone march to war.',
      script:
        "In 1850, Congress passed a sweeping compromise that many contemporaries — including its own architects — called a final settlement of the slavery question. Ten years later, the country split apart. Nothing about that arithmetic works if you assume 1850's leaders already knew a war was coming; if they had, there would have been little point compromising at all. What actually happened is a specific chain of events, each one breaking a piece of the last settlement: a stronger fugitive slave law, a novel that turned slavery into a household argument, a law that reopened a fight everyone thought was closed, a Supreme Court ruling that tried to end the argument by force of law and instead inflamed it, a set of debates that made the argument a national spectacle, and a raid that convinced each side the other could no longer be reasoned with. Today we're tracing that specific chain — and resisting the temptation to read the ending backward into the beginning.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-sectional-crisis',
      kind: 'concept',
      goal: 'Explain the Compromise of 1850, Kansas-Nebraska, Dred Scott, the Lincoln-Douglas debates, and Harpers Ferry as a specific, escalating sequence rather than an inevitable outcome.',
      keyIdeas: [
        'THE COMPROMISE OF 1850: negotiated after the Mexican Cession forced the territorial-slavery question, it admitted California as a FREE state, organized the Utah and New Mexico territories under POPULAR SOVEREIGNTY (letting settlers vote on slavery there), settled a Texas-New Mexico boundary dispute (with the federal government assuming Texas\'s debt), banned the SLAVE TRADE (not slavery itself) in Washington, D.C., and enacted a much stronger FUGITIVE SLAVE ACT compelling Northern officials and citizens to assist in recapturing escaped enslaved people, with no jury trial for the accused. Many at the time — including Congress\'s own leaders — hoped it would permanently settle the sectional dispute.',
        'UNCLE TOM\'S CABIN (1852): Harriet Beecher Stowe\'s enormously popular antislavery novel dramatized the human cost of slavery, including the cruelty enabled by the new Fugitive Slave Act, for a mass Northern readership that had often treated slavery as an abstract, distant political issue. It converted the fugitive-slave question into a household moral argument and deepened Northern antislavery sentiment, while provoking anger and rebuttal literature in the South.',
        'THE KANSAS-NEBRASKA ACT (1854): sponsored by Senator Stephen Douglas to organize the Kansas and Nebraska territories (partly to enable a transcontinental railroad route), it applied POPULAR SOVEREIGNTY to territory that lay north of the Missouri Compromise line (36°30\'), effectively repealing that 1820 settlement and reopening the question of slavery\'s expansion that many had believed the Compromise of 1850 had closed. Pro- and antislavery settlers rushed into Kansas to influence the vote, producing violent conflict known as BLEEDING KANSAS.',
        "DRED SCOTT v. SANDFORD (1857): the Supreme Court, under Chief Justice Roger Taney, ruled that Dred Scott, an enslaved man who had lived in free territory, remained enslaved; that Black Americans, enslaved or free, could not be US citizens; and — most explosively — that Congress had no constitutional authority to ban slavery in the territories at all, effectively declaring the already-repealed Missouri Compromise line (and by extension any Wilmot-Proviso-style ban) unconstitutional. The ruling inflamed rather than settled the territorial question, since it removed even popular sovereignty's compromise logic by denying Congress or territorial legislatures the power to exclude slavery.",
        "THE LINCOLN-DOUGLAS DEBATES (1858): during Illinois's US Senate race, Republican challenger Abraham Lincoln and Democratic incumbent Stephen Douglas debated slavery's expansion before large audiences and a national press. Douglas's FREEPORT DOCTRINE — that a territory could still exclude slavery in practice by refusing to pass laws protecting it, regardless of Dred Scott — tried to reconcile popular sovereignty with the ruling, but alienated Southern Democrats who wanted federal protection of slavery in the territories guaranteed outright, splitting the Democratic Party heading into 1860.",
        "JOHN BROWN'S RAID ON HARPERS FERRY (1859): the abolitionist John Brown led a small armed group in an attempt to seize the federal arsenal at Harpers Ferry, Virginia, and spark a wider enslaved uprising. The raid failed and Brown was captured, tried, and executed, but it deepened Southern fears of a coordinated Northern conspiracy to incite slave rebellion, while some Northern abolitionists treated Brown as a martyr — hardening both sides just ahead of the 1860 election.",
      ],
      vocabulary: [
        {
          term: 'popular sovereignty',
          definition:
            "the principle that a territory's own settlers, not Congress, should vote to decide whether to permit slavery there — applied in the Compromise of 1850 and the Kansas-Nebraska Act (1854).",
        },
        {
          term: 'Fugitive Slave Act (1850)',
          definition:
            'a strengthened federal law compelling Northern officials and citizens to assist in capturing and returning escaped enslaved people, denying the accused a jury trial; part of the Compromise of 1850.',
        },
        {
          term: 'Bleeding Kansas',
          definition:
            "the violent conflict between pro- and antislavery settlers in Kansas Territory after the Kansas-Nebraska Act (1854) applied popular sovereignty there, repealing the Missouri Compromise line.",
        },
        {
          term: 'Dred Scott v. Sandford (1857)',
          definition:
            "Supreme Court ruling (Chief Justice Taney) holding that Black Americans could not be US citizens and that Congress could not ban slavery in the territories, invalidating the Missouri Compromise line and inflaming sectional conflict.",
        },
        {
          term: 'Freeport Doctrine',
          definition:
            "Stephen Douglas's 1858 position, from the Lincoln-Douglas debates, that a territory could exclude slavery in practice by declining to pass laws protecting it, regardless of Dred Scott — a compromise that split the Democratic Party.",
        },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-escalation-sequence',
      kind: 'worked_example',
      problem:
        'Consider this sequence: in 1850, Congress passed a sweeping compromise that its own architects believed had permanently settled the sectional dispute over slavery. By 1859, an armed abolitionist had attempted to seize a federal arsenal to spark a slave uprising, and the two major national parties were fracturing along sectional lines. Explain what specific events connect these two points, and evaluate whether the outcome was foreseeable in 1850.',
      steps: [
        'START WITH THE CONTRAST ITSELF. A "final settlement" in 1850 and an armed raid plus party fracture by 1859 are not the same trajectory — something specific had to happen in between to move from one to the other; treating the ending as foreordained skips over exactly what AP US History asks you to explain.',
        'TRACE THE FIRST BREAK. The Kansas-Nebraska Act (1854) applied popular sovereignty to territory north of the Missouri Compromise line, effectively repealing an 1820 settlement that had held for over three decades — reopening the territorial-slavery question the Compromise of 1850 had tried to close, and triggering violent settler conflict (Bleeding Kansas).',
        "TRACE THE SECOND BREAK. Dred Scott v. Sandford (1857) went further than reopening the question — it ruled Congress had no power to ban slavery in the territories at all, undermining the compromise logic (popular sovereignty) that had structured both 1850 and 1854, and convincing many Northerners that slavery's expansion could no longer be checked through ordinary legislative compromise.",
        'TRACE THE THIRD BREAK. The Lincoln-Douglas debates (1858) turned this legal and political conflict into a mass public spectacle, and Douglas\'s attempt to reconcile popular sovereignty with Dred Scott (the Freeport Doctrine) satisfied neither side fully — alienating Southern Democrats and splitting the party that had been the main national institution still holding North and South together.',
        "NAME THE FINAL ESCALATION. John Brown's raid (1859) showed each side that some members of the other were willing to use armed force — Brown to incite rebellion, and Southern reaction treating this as proof of a broader Northern conspiracy — collapsing the assumption, still common in 1850, that political compromise could indefinitely manage the conflict.",
        'ANSWER THE FORESEEABILITY QUESTION DIRECTLY. In 1850, prominent political leaders genuinely believed they had settled the question — that belief would make little sense if disunion were already understood as inevitable. The Civil War became foreseeable only through this specific, escalating chain of legislative failures (Kansas-Nebraska), judicial rulings (Dred Scott), public political fracture (Lincoln-Douglas), and armed action (Harpers Ferry) across the following nine years, not as a destiny already fixed in 1850.',
      ],
      answer:
        'The gap between 1850\'s "final settlement" and 1859\'s armed raid and party fracture is bridged by a specific, escalating sequence: the Kansas-Nebraska Act (1854) reopened the territorial-slavery question the Compromise of 1850 had tried to close, and its popular-sovereignty formula produced violent conflict in Kansas; Dred Scott v. Sandford (1857) then went further, ruling Congress could not ban slavery in the territories at all, undermining the compromise logic behind both 1850 and 1854; the Lincoln-Douglas debates (1858) turned this into a national spectacle and split the Democratic Party over how to reconcile popular sovereignty with the ruling; and John Brown\'s raid (1859) convinced each side the other was willing to use force. Because contemporaries in 1850 genuinely believed they had achieved a lasting settlement, the war was not foreseeable at that point — it became so only through this specific nine-year chain of broken compromises, not because disunion was fixed in advance.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-saq',
      kind: 'try_yourself',
      problem:
        'SAQ practice. (a) Briefly describe ONE specific event of the 1850s sectional crisis (the Kansas-Nebraska Act, Dred Scott v. Sandford, the Lincoln-Douglas debates, or Harpers Ferry). (b) Briefly explain ONE way that event escalated sectional conflict beyond where the Compromise of 1850 had left it. (c) Briefly explain ONE piece of evidence that the Civil War was not seen as inevitable in 1850.',
      responseFormat: 'frq',
      rubric: {
        parts: [
          {
            criterionId: 'a',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): correctly and specifically describes a genuine 1850s sectional-crisis event — the Kansas-Nebraska Act (1854), Dred Scott v. Sandford (1857), the Lincoln-Douglas debates (1858), or John Brown\'s raid on Harpers Ferry (1859). No credit for a vague statement with no specific event named.',
            modelResponse:
              'The Kansas-Nebraska Act (1854) organized the Kansas and Nebraska territories under popular sovereignty, letting settlers vote on slavery there rather than applying the existing Missouri Compromise line.',
          },
          {
            criterionId: 'b',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains a specific, accurate way the named event escalated conflict beyond 1850 — e.g., Kansas-Nebraska repealing the Missouri Compromise line and triggering Bleeding Kansas, or Dred Scott ruling Congress could not ban slavery in the territories at all. No credit for a vague or unconnected claim.',
            modelResponse:
              'By repealing the Missouri Compromise line and applying popular sovereignty north of it, the Kansas-Nebraska Act reopened a territorial question many believed the Compromise of 1850 had settled, and triggered violent conflict between pro- and antislavery settlers in Kansas known as Bleeding Kansas.',
          },
          {
            criterionId: 'c',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains specific, accurate evidence that war was not seen as inevitable in 1850 — e.g., that the Compromise of 1850\'s own architects believed it had permanently settled the sectional dispute, or that popular sovereignty and judicial rulings were still being used as compromise mechanisms into the late 1850s. No credit for a vague or unsupported claim.',
            modelResponse:
              "The Compromise of 1850's own supporters in Congress believed it had permanently resolved the sectional conflict over slavery in the Mexican Cession — a belief that would make little sense if political leaders already assumed war and disunion were inevitable at that point.",
          },
        ],
      },
      estimatedMinutes: 5,
    },
    {
      id: 'misconception-inevitable-by-1850',
      kind: 'misconception_check',
      question:
        'True or false: by 1850, the Civil War was already inevitable — the Compromise of 1850 only delayed a conflict that was certain to happen anyway.',
      commonErrors: [
        {
          answer: 'true',
          misconception:
            'Presentism / inevitability thinking — reading the outcome (civil war in 1861) backward into 1850 as though contemporaries already knew disunion was certain, rather than tracing the specific chain of legislative, judicial, and political ruptures (1854-1859) that actually produced it.',
          correctsTo:
            "FALSE. Many of the Compromise of 1850's own architects believed they had achieved a lasting settlement of the sectional dispute — a belief incompatible with treating war as already inevitable. What actually followed was a specific, escalating sequence over the next decade: the Kansas-Nebraska Act (1854) reopened the territorial question and produced Bleeding Kansas; Dred Scott v. Sandford (1857) ruled Congress could not ban slavery in the territories at all; the Lincoln-Douglas debates (1858) split the Democratic Party over how to respond; and John Brown's raid (1859) convinced each side the other was willing to use force. Collapsing this nine-year chain into an assumption that 1850 already sealed the country's fate erases the actual historical argument AP US History asks you to make.",
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The Compromise of 1850 admitted California free, applied popular sovereignty in Utah/New Mexico, and strengthened the Fugitive Slave Act — many believed it a permanent settlement.',
        'Uncle Tom\'s Cabin (1852) turned slavery, and the Fugitive Slave Act\'s cruelty, into a mass Northern moral argument.',
        'The Kansas-Nebraska Act (1854) repealed the Missouri Compromise line via popular sovereignty, triggering Bleeding Kansas.',
        'Dred Scott v. Sandford (1857) ruled Congress could not ban slavery in the territories at all, undermining popular sovereignty\'s compromise logic.',
        'The Lincoln-Douglas debates (1858) split the Democratic Party over the Freeport Doctrine; John Brown\'s raid (1859) convinced each side the other would use force.',
        'The Civil War was not inevitable in 1850 — it resulted from this specific escalating chain of ruptures across the following decade. Avoid presentism.',
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '5',
    cedTopic: '5.4-5.6',
    cedTitle: 'The Sectional Crisis of the 1850s',
    sources: [{ type: 'plan', source: 'AP Plans Initiative — AP US History' }],
  },
};
