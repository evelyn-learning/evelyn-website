/**
 * AP US History — CED Unit 5.7-5.8: Secession and the Civil War.
 *
 * Period-5 content plan (follows the causes-of-revolution calibration
 * template). Covers the election of 1860, the secession of the Deep
 * South (in its own stated terms), the comparative advantages of North
 * and South, the shift to total war, and the wartime home fronts —
 * and refutes the misconception that secession was primarily about
 * tariffs rather than slavery.
 *
 * Anchor text: South Carolina, Declaration of the Immediate Causes of
 * Secession (December 24, 1860) —
 * evelyn.passage.apush-sc-secession.v1 — quoted only as the seeded
 * excerpt, which names slavery explicitly as the grievance. Measured,
 * factual framing per the Global Constraints; the source transcription
 * artifacts ("have assume the right," "Constitution ;") are reproduced
 * exactly as seeded, not corrected.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APUSH_U5_SECESSION_CIVIL_WAR: LessonPlan = {
  id: 'evelyn.ap.apush.secession-civil-war.v1',
  title: 'U5.7 Secession and the Civil War',
  curriculum: 'AP',
  grade: '11',
  subject: 'ss',
  topic: 'ap-us-history',
  locale: 'en',
  los: [
    {
      id: 'apush.secession-civil-war',
      description:
        'Explain the sequence from the election of 1860 through the secession of the Deep South in its own stated terms, describe the comparative military and economic advantages of the Union and Confederacy, and explain the shift to total war and its effect on both home fronts.',
      standard: 'AP-APUSH-5.7',
    },
  ],
  prerequisites: ['apush.sectional-crisis'],
  followUps: ['apush.emancipation'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make secession a documented argument with a stated cause, not a vague dispute over abstract principle, using the seceding states\' own words.',
      script:
        "When South Carolina became the first state to secede in December 1860, its convention did not leave its reasons to historians' guesswork — it wrote them down. Within weeks, six more Deep South states followed, forming the Confederate States of America before Abraham Lincoln had even been inaugurated. What followed was four years of war fought at a scale nothing in American history had approached, ending with roughly three quarters of a million dead — and a shift, partway through, from a limited war over reunion to a total war targeting the economic and social systems that sustained the Confederacy. Today we're reading what the secession conventions actually said their grievance was, tracing why the North's advantages mattered but didn't guarantee a short war, and seeing how the war itself transformed as it went on.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-secession-civil-war',
      kind: 'concept',
      goal: "Explain the election of 1860, the Deep South's secession and its stated rationale, comparative Union/Confederate advantages, and the shift to total war on both home fronts.",
      keyIdeas: [
        'THE ELECTION OF 1860: the Democratic Party split into Northern (Stephen Douglas) and Southern (John Breckinridge) factions after failing to agree on protecting slavery in the territories; a Constitutional Union candidate (John Bell) also ran. This split allowed Republican Abraham Lincoln — who won no electoral votes in the South and ran on a platform opposing slavery\'s expansion into the territories, not immediate abolition — to win the presidency with a plurality of the popular vote but a clear electoral majority.',
        "SECESSION IN THE DEEP SOUTH'S OWN WORDS: South Carolina seceded first (convention vote December 20, 1860; Declaration of the Immediate Causes issued December 24, 1860), followed by six more Deep South states by February 1861, which formed the Confederate States of America. These states' own secession declarations named slavery — its legal security, its moral legitimacy, and fears of federal or Northern interference with it — as the central grievance, directly in response to Lincoln's election and the Republican Party's platform opposing slavery's expansion.",
        'FORT SUMTER AND THE UPPER SOUTH (April 1861): Confederate forces fired on the federal garrison at Fort Sumter, South Carolina, in April 1861. Lincoln\'s subsequent call for troops to suppress the rebellion pushed four Upper South states (Virginia, North Carolina, Tennessee, Arkansas) — which had not seceded during the initial wave — to secede and join the Confederacy rather than supply troops against fellow Southern states.',
        "COMPARATIVE ADVANTAGES: the Union held large advantages in population, industrial capacity, railroad mileage, and naval power, and controlled the pre-existing federal government and financial system. The Confederacy fought largely on the strategic defensive on its own territory (an advantage for a war of attrition), initially had strong military leadership in the Eastern theater, and hoped that European dependence on Southern cotton (\"COTTON DIPLOMACY\") would bring British or French intervention — a hope that ultimately failed, in part because of alternative cotton sources and Union diplomatic pressure.",
        'THE SHIFT TO TOTAL WAR: as the war lengthened, Union strategy shifted from a limited aim of restoring the Union toward TOTAL WAR — targeting the economic and logistical capacity that sustained the Confederate war effort, not only its armies. The Union naval blockade (the "Anaconda Plan") throttled Confederate trade, and Union commanders including Grant and Sherman pursued strategies (most visibly Sherman\'s March to the Sea in 1864) that deliberately destroyed Southern infrastructure, crops, and property to break the Confederacy\'s capacity and will to continue fighting.',
        "BOTH HOME FRONTS: the war strained civilian life on both sides. The Union financed the war partly through new greenbacks (paper currency), an income tax, and war bonds, while women took on expanded roles in nursing, industry, and farm labor; the 1863 New York City draft riots reflected working-class opposition to conscription and to a war increasingly framed around emancipation. The Confederacy faced severe inflation, food shortages worsened by the Union blockade, and growing internal dissent, especially among non-slaveholding yeoman farmers who bore a disproportionate share of conscription and hardship — the deadliest war in American history (roughly 750,000 dead) by its end in 1865.",
      ],
      vocabulary: [
        {
          term: 'Confederate States of America',
          definition:
            "the government formed by seven Deep South states that seceded between December 1860 and February 1861, joined by four Upper South states after Fort Sumter and Lincoln's April 1861 call for troops.",
        },
        {
          term: 'cotton diplomacy',
          definition:
            "the Confederacy's failed hope that European economic dependence on Southern cotton exports would bring British or French diplomatic recognition or intervention on its behalf.",
        },
        {
          term: 'Anaconda Plan',
          definition:
            "the Union's naval blockade strategy intended to strangle Confederate trade and supply, contributing to the broader Union shift toward total war.",
        },
        {
          term: 'total war',
          definition:
            "a war strategy targeting an enemy's economic and civilian capacity to fight, not only its armies — illustrated by Sherman's March to the Sea (1864), which deliberately destroyed Southern infrastructure and property.",
        },
        {
          term: 'New York City draft riots (1863)',
          definition:
            "violent Union home-front unrest protesting military conscription and the war's increasing association with emancipation, reflecting working-class opposition on the Northern home front.",
        },
      ],
      passageId: 'evelyn.passage.apush-sc-secession.v1',
      estimatedMinutes: 6,
    },
    {
      id: 'worked-sc-secession',
      kind: 'worked_example',
      problem:
        'Analyze this excerpt from South Carolina\'s Declaration of the Immediate Causes Which Induce and Justify the Secession of South Carolina from the Federal Union (December 24, 1860): "We affirm that these ends for which this Government was instituted have been defeated, and the Government itself has been made destructive of them by the action of the non-slaveholding States. Those States have assume the right of deciding upon the propriety of our domestic institutions; and have denied the rights of property established in fifteen of the States and recognized by the Constitution ; they have denounced as sinful the institution of slavery; they have permitted open establishment among them of societies, whose avowed object is to disturb the peace and to eloign the property of the citizens of other States. They have encouraged and assisted thousands of our slaves to leave their homes; and those who remain, have been incited by emissaries, books and pictures to servile insurrection." What grievance does South Carolina name, and how does this document address the claim that secession was primarily about something other than slavery?',
      steps: [
        'SOURCE IT FIRST. The South Carolina secession convention, December 24, 1860 — four days after the convention voted to secede (December 20), and directly responding to Abraham Lincoln\'s election the previous month, though Lincoln had not yet taken office.',
        'IDENTIFY THE CENTRAL CLAIM. South Carolina states the Union\'s purposes "have been defeated" and the government "made destructive" of them "by the action of the non-slaveholding States" — placing the blame specifically on free states\' conduct, not on federal taxation or spending policy.',
        'NAME THE SPECIFIC GRIEVANCES IN THE DOCUMENT\'S OWN WORDS. Free states "have assume[d] the right of deciding upon the propriety of our domestic institutions" (challenging Southern control over slavery); they "denied the rights of property established in fifteen of the States and recognized by the Constitution" (property claims in enslaved people, tied to clauses like the Fugitive Slave Clause); they "denounced as sinful the institution of slavery" (moral condemnation from abolitionists); they tolerated antislavery societies working "to disturb the peace"; and they "encouraged and assisted thousands of our slaves to leave their homes," while enslaved people who remained were "incited... to servile insurrection" (references to the Underground Railroad and fears sharpened by events like John Brown\'s 1859 raid).',
        'REFUTE THE "IT WAS ABOUT TARIFFS" CLAIM DIRECTLY. Nowhere in this excerpt does South Carolina cite tariffs, federal spending, or an abstract states\'-rights theory disconnected from slavery — every specific grievance named concerns slavery\'s legal security, its moral legitimacy, or enslaved people\'s ability to escape or resist it. This is primary-source evidence, in the seceding state\'s own words, that slavery was the stated cause.',
        'READ THE DOCUMENT CAREFULLY, NOT AS A MODERN TEXT. The transcription preserves period phrasing and artifacts ("have assume the right," "Constitution ;") exactly as written — a reminder to read primary sources as historical artifacts rather than correcting them to modern usage.',
        'STATE THE LINK TO THE COURSE THESIS. South Carolina\'s own convention document is direct evidence that the leading edge of secession centered on slavery\'s legal and moral security — its continuation, its Constitutional protection, and fear of its erosion — not a generic dispute over economic policy or federal power in the abstract.',
      ],
      answer:
        'South Carolina names slavery, specifically and repeatedly, as its grievance: it accuses non-slaveholding states of denying "the rights of property established in fifteen of the States" (property claims in enslaved people), "denounc[ing] as sinful the institution of slavery," tolerating antislavery organizing, and helping enslaved people escape or "incit[ing]" those who remained "to servile insurrection." The document never cites tariffs, federal spending, or an abstract theory of states\' rights unconnected to slavery — every grievance concerns slavery\'s legal and moral security. This directly refutes the claim that secession was primarily about tariffs: in the seceding state\'s own founding document, the stated cause is slavery itself, its continuation, and fear of Northern interference with it.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-saq',
      kind: 'try_yourself',
      problem:
        'SAQ practice. (a) Briefly describe ONE specific event in the sequence from the 1860 election to the formation of the Confederacy. (b) Briefly explain ONE piece of evidence that slavery, not tariffs or an abstract theory of states\' rights, was central to Southern secession. (c) Briefly explain ONE reason the Union held a material advantage over the Confederacy in fighting the war.',
      responseFormat: 'frq',
      rubric: {
        parts: [
          {
            criterionId: 'a',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): correctly and specifically describes a genuine event in the 1860-61 secession sequence — the split Democratic Party and Lincoln\'s election (1860), South Carolina\'s secession (December 1860), or the formation of the Confederate States of America (by February 1861). No credit for a vague statement with no specific event named.',
            modelResponse:
              'The Democratic Party split into Northern and Southern factions in the 1860 election, allowing Republican Abraham Lincoln to win the presidency despite receiving no electoral votes from the South.',
          },
          {
            criterionId: 'b',
            maxPoints: 1,
            scoringCriteria:
              "Full credit (1): explains specific, accurate evidence that slavery, not tariffs, was central to secession — e.g., South Carolina's Declaration naming free states' denial of \"rights of property\" in enslaved people and denunciation of slavery as sinful. No credit for a vague or unsupported claim.",
            modelResponse:
              'South Carolina\'s own December 1860 secession declaration names free states\' denial of "the rights of property established in fifteen of the States" (in enslaved people) and their denunciation of slavery as "sinful" as its grievances — never citing tariffs or federal spending, direct evidence that slavery was the stated cause.',
          },
          {
            criterionId: 'c',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains a specific, accurate Union advantage — greater population, industrial capacity, railroad mileage, naval power, or an existing financial/governmental system. No credit for a vague or unsupported claim.',
            modelResponse:
              'The Union had far greater industrial capacity and railroad mileage than the Confederacy, letting it produce and move war material and troops more efficiently over a long war of attrition.',
          },
        ],
      },
      estimatedMinutes: 5,
    },
    {
      id: 'misconception-tariffs',
      kind: 'misconception_check',
      question:
        'True or false: secession was primarily about tariffs and federal economic policy, with slavery only a secondary factor.',
      commonErrors: [
        {
          answer: 'true',
          misconception:
            'Substituting a later, more comfortable explanation (an abstract economic or constitutional dispute) for the cause the seceding states themselves stated, at the time, in their own founding documents.',
          correctsTo:
            'FALSE. South Carolina\'s own December 1860 Declaration of the Immediate Causes of Secession names slavery specifically and repeatedly: free states\' denial of "the rights of property" in enslaved people, their denunciation of slavery as "sinful," and their assistance to enslaved people escaping or resisting. It cites no tariff or federal spending grievance at all. This is not one historian\'s interpretation — it is the seceding state\'s own stated reasoning. The "it was really about tariffs/states\' rights in the abstract" explanation gained currency well after the war and is contradicted by the primary sources the secession conventions themselves produced.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The 1860 Democratic Party split let Republican Lincoln win the presidency without any Southern electoral votes, triggering the Deep South\'s secession.',
        'South Carolina\'s own December 1860 secession declaration names slavery — its legal security and moral legitimacy — as the grievance, not tariffs or abstract states\' rights.',
        'Fort Sumter (April 1861) and Lincoln\'s call for troops pushed four Upper South states to secede and join the Confederacy.',
        'The Union held advantages in population, industry, and naval power; the Confederacy fought defensively on home ground and hoped (unsuccessfully) for European intervention via cotton diplomacy.',
        'The war shifted toward total war — the Union naval blockade and Sherman\'s March to the Sea targeted Confederate economic capacity, not just its armies — producing roughly 750,000 deaths by 1865.',
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '5',
    cedTopic: '5.7-5.8',
    cedTitle: 'Secession and the Civil War',
    sources: [
      { type: 'plan', source: 'AP Plans Initiative — AP US History' },
      {
        type: 'passage',
        book: 'evelyn.passage.apush-sc-secession.v1',
        chapter: '1860',
        note: 'South Carolina\'s Declaration of the Immediate Causes of Secession — the seceding state\'s own stated rationale, naming slavery directly.',
      },
    ],
  },
};
