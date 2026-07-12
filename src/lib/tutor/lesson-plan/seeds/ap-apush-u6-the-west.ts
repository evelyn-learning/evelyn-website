/**
 * AP US History — CED Unit 6.2-6.3: The West and the New South.
 *
 * Period-6 content plan (follows the causes-of-revolution calibration
 * template — see ap-apush-u3-causes-of-revolution.ts for the full
 * rationale and docs/superpowers/specs/2026-07-10-ap-us-history-design.md
 * for the shared Passage/rubric infra this plan reuses).
 *
 * Opens Period 6's arc: the transcontinental railroad and its role in
 * federally subsidized western settlement, the Plains Wars (measured
 * treatment of Little Bighorn 1876 and Wounded Knee 1890), the Dawes Act's
 * assimilationist land-allotment policy, and the gap between "New South"
 * boosterism and the Jim Crow/tenant-farming reality it coexisted with
 * (through Plessy v. Ferguson, 1896).
 *
 * No passage is wired to this plan — the period block reserves its five
 * seeded documents (Carnegie, Omaha Platform, Chinese Exclusion Act,
 * immigration table, Cross of Gold) for the four other Period-6 plans and
 * the DBQ packet. The worked example instead walks a described,
 * non-passage primary-source data point (public-domain-status homestead
 * claim figures from the General Land Office) rather than quoting any
 * seeded document.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APUSH_U6_THE_WEST: LessonPlan = {
  id: 'evelyn.ap.apush.the-west-new-south.v1',
  title: 'U6.2-6.3 The West and the New South',
  curriculum: 'AP',
  grade: '11',
  subject: 'ss',
  topic: 'ap-us-history',
  locale: 'en',
  los: [
    {
      id: 'apush.the-west-new-south',
      description:
        'Explain the causes and effects of federally subsidized western settlement (the transcontinental railroad, the Homestead Act), the conflicts between Plains nations and the U.S. government and settlers, the assimilationist goal of the Dawes Act, and the gap between "New South" industrial boosterism and the entrenchment of Jim Crow and tenant farming in the postwar South.',
      standard: 'AP-APUSH-6.2',
    },
  ],
  prerequisites: [],
  followUps: ['apush.industrialization-big-business'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Get the student to see the postwar West and South not as empty land waiting to be filled or a fresh start waiting to be built, but as places already full of people and old power structures reasserting themselves under new names.',
      script:
        "Picture two \"blank slates\" that Americans in the 1870s and 1880s liked to imagine: an \"empty\" West waiting for settlers, and a \"New South\" ready to industrialize and leave slavery behind. Neither was actually blank. The West was home to Plains nations who had lived there for generations and depended on the buffalo herds the railroads and hide-hunters were wiping out. The \"New South\" that boosters promised — mills, railroads, diversified farms — mostly delivered something else: the same cotton economy as before, now run through tenant farming and sharecropping, locked in place by a new legal system of racial segregation. In both regions, the story Americans told themselves about a fresh start ran into the reality of who already lived there and who still held power. Today we're tracing both stories side by side.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-west-and-new-south',
      kind: 'concept',
      goal: 'Explain the transcontinental railroad and Homestead Act, the Plains Wars and the Dawes Act, and the gap between New South rhetoric and Jim Crow/tenant-farming reality.',
      keyIdeas: [
        'FEDERALLY SUBSIDIZED SETTLEMENT: the Homestead Act (1862) offered 160 acres of public land nearly free to settlers who worked it for five years, while the federal government granted railroad companies enormous land grants and loans to build the transcontinental railroad. The Union Pacific (building west from Omaha) and Central Pacific (building east from Sacramento, relying heavily on Chinese immigrant laborers) met at Promontory Summit, Utah, completing the line in 1869 — dramatically cutting travel time and cost between the coasts and accelerating settlement, mining, and cattle ranching across the interior West.',
        'THE PLAINS WARS: as railroads, settlers, and commercial buffalo hunters pushed onto the Great Plains, conflict with Plains nations (Lakota Sioux, Cheyenne, and others) escalated. At the Battle of the Little Bighorn (1876), Lakota and Cheyenne forces under leaders including Sitting Bull and Crazy Horse defeated Lt. Col. George Custer\'s Seventh Cavalry in Montana Territory — a rare decisive Native victory that provoked an intensified U.S. military response. By 1890, U.S. cavalry killed some 150-300 Lakota men, women, and children at Wounded Knee, South Dakota, in the context of the Ghost Dance movement\'s suppression — an event generally treated by historians as marking the end of large-scale armed resistance on the Plains. Both events deserve measured treatment: neither a triumphant frontier narrative nor a single simple villain/victim frame captures the sustained, asymmetric conflict over land and survival that produced them.',
        'THE DAWES ACT (1887): shifted federal policy from treating Native nations as collective, treaty-recognized political entities toward an assimilationist goal — breaking up communally held reservation land into individual allotments (typically 160 acres per family) intended to convert Native families into individual farmers on the Euro-American model. "Surplus" reservation land left over after allotment was sold to non-Native settlers. The policy is now understood to have devastated Native landholding (Native-controlled land fell by roughly half over the following decades) while failing to achieve its stated assimilationist aims.',
        '"NEW SOUTH" RHETORIC: boosters like Atlanta journalist Henry Grady promoted a vision of a modernized South — diversified agriculture, textile mills, railroads, northern investment — that would move past the antebellum plantation economy and reconcile with the North. Some real industrial growth did occur (textile mills, some rail expansion), but it remained small relative to Northern industry and did not transform the region\'s basic economic structure.',
        'THE REALITY BENEATH THE RHETORIC: most former slaves and many poor white farmers ended up as tenant farmers or sharecroppers, farming land owned by others (often former planters) for a share of the crop, frequently trapped in debt through the crop-lien system (buying supplies on credit against a future harvest, at terms that kept many farmers perpetually in debt). This was a continuation of dependence on cotton monoculture, not the diversified New South that boosters promised.',
        'JIM CROW SOLIDIFIES: Southern state legislatures passed laws mandating racial segregation in public accommodations, transportation, and schools ("Jim Crow" laws), alongside voting restrictions (poll taxes, literacy tests, grandfather clauses) designed to disenfranchise Black voters. In Plessy v. Ferguson (1896), the Supreme Court upheld racial segregation on railway cars under a "separate but equal" doctrine, giving constitutional cover to segregation that would remain in place for nearly six decades.',
        'THE THROUGH-LINE: both the West and the New South were sold to contemporaries and are sometimes remembered since as open frontiers of opportunity — but both stories require reckoning with who was already there (Plains nations; formerly enslaved Black Southerners) and how quickly new legal and economic structures (allotment policy; Jim Crow and the crop-lien system) reasserted control over land and labor.',
      ],
      vocabulary: [
        {
          term: 'Homestead Act (1862)',
          definition:
            'federal law granting 160 acres of public land nearly free to settlers who worked and improved it for five years, accelerating westward settlement.',
        },
        {
          term: 'Dawes Act (1887)',
          definition:
            'federal law breaking up communally held reservation land into individual family allotments to assimilate Native Americans into individual farming, selling "surplus" land to non-Native settlers; devastated Native landholding.',
        },
        {
          term: 'crop-lien system',
          definition:
            "a credit arrangement in which tenant farmers and sharecroppers borrowed against a future harvest to buy supplies, frequently trapping them in cyclical debt to landowners or merchants.",
        },
        {
          term: 'Jim Crow laws',
          definition:
            'state and local laws mandating racial segregation in public accommodations, transportation, and schools in the post-Reconstruction South, upheld by the Supreme Court\'s "separate but equal" doctrine in Plessy v. Ferguson (1896).',
        },
        {
          term: 'Ghost Dance',
          definition:
            'a Native religious and cultural revival movement among Plains nations in the late 1880s, whose suppression by U.S. authorities formed the immediate context for the killings at Wounded Knee (1890).',
        },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-homestead-claims-data',
      kind: 'worked_example',
      problem:
        'Analyze this General Land Office record of homestead entries: in the Dakota Territory, annual homestead land-entry filings rose from a few hundred per year in the early 1870s to tens of thousands per year by the early 1880s, closely tracking the arrival of railroad branch lines through the territory in the same years. What does this pattern reveal about how western settlement actually worked, and what does it leave out of the picture?',
      steps: [
        'READ THE PATTERN LITERALLY FIRST. Homestead filings in Dakota Territory were low before railroads arrived and rose sharply once branch lines reached an area — the pattern is a close, repeated correlation between rail access and settlement, not settlers spreading evenly across "open" land on their own initiative.',
        'CONNECT TO THE POLICY MACHINERY BEHIND IT. The Homestead Act made land nearly free, but land alone was not the driver — settlers needed a way to get themselves, supplies, and crops to and from markets. Federally subsidized railroad construction supplied that access, so the Homestead Act and railroad land grants functioned as ONE combined federal settlement policy, not two separate stories.',
        'NOTICE WHAT THE FILING NUMBERS DO NOT SHOW. A count of federal land-office filings only records settlers claiming land under federal law — it says nothing about who already occupied or depended on that land. Every acre "opened" for homestead filing in the path of a rail line was land the U.S. government had already taken, or was in active conflict over taking, from Plains nations whose treaty claims and subsistence (especially buffalo-herd access) it displaced.',
        'STATE THE FULLER PICTURE. The data shows genuinely rapid settlement enabled by railroad access — an accurate story about federal policy accelerating economic development. But read on its own, it also tells an incomplete story: it measures the arrival of settlers making legal land claims, not the removal of the people whose land those claims were made on. Both parts of the story are historically necessary; treating settlement statistics as though the land were simply "empty" and waiting is the exact misconception AP US History asks you to avoid.',
        'STATE THE LINK TO THE COURSE THESIS. Federal subsidy (Homestead Act land grants, railroad land grants and loans) drove documented, rapid settlement of the Plains — and that same subsidized settlement was the material cause of escalating conflict with Plains nations, culminating in the Plains Wars and, eventually, the assimilationist Dawes Act.',
      ],
      answer:
        'The data shows homestead filings tracking railroad access almost exactly: few filings before a rail line arrived, a sharp jump afterward. This confirms that federal policy (the Homestead Act\'s land grants plus federally subsidized railroad construction) actively drove settlement rather than settlers simply discovering open land on their own — the two policies worked together. But the filing count only measures settlers making legal claims; it says nothing about who already used or depended on that land. Every acre newly "opened" to homestead claims in a rail corridor was land whose Plains-nation inhabitants were being displaced or fighting to keep, so the same data that shows rapid, subsidized development is also, read fully, evidence of the displacement that produced the era\'s armed conflicts. Treating the land as simply empty and waiting — rather than recognizing removal as the necessary flip side of "settlement" — is the central misconception this kind of source invites and that a strong historical analysis must correct.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-saq',
      kind: 'try_yourself',
      problem:
        "SAQ practice. (a) Briefly describe ONE way the federal government actively promoted settlement of the West in this period. (b) Briefly explain how this settlement contributed to conflict between the U.S. government and Plains nations. (c) Briefly explain ONE way the reality of the post-Reconstruction South differed from \"New South\" boosters' promises.",
      responseFormat: 'frq',
      rubric: {
        parts: [
          {
            criterionId: 'a',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): correctly and specifically describes a genuine federal settlement policy — e.g. the Homestead Act (1862) granting nearly free public land to settlers, or federal land grants/loans subsidizing transcontinental railroad construction (completed 1869). No credit for a vague statement ("the government encouraged settlers to move west") with no specific policy named.',
            modelResponse:
              'The federal government passed the Homestead Act (1862), which granted 160 acres of public land nearly free to settlers who worked it for five years, directly encouraging rapid settlement of the Great Plains.',
          },
          {
            criterionId: 'b',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains a specific, accurate causal link between subsidized settlement and conflict with Plains nations — e.g. railroads and settlers destroying buffalo herds Plains nations depended on, settlers and miners encroaching on treaty-recognized land, provoking wars such as the conflict culminating at Little Bighorn (1876) or the U.S. military response ending at Wounded Knee (1890). No credit for a disconnected or vague explanation.',
            modelResponse:
              "Railroad construction and the settlers it brought devastated the buffalo herds Plains nations like the Lakota depended on for subsistence, and settlement pushed onto treaty-recognized land, escalating conflict that included Lakota and Cheyenne forces defeating Custer's Seventh Cavalry at the Battle of the Little Bighorn in 1876.",
          },
          {
            criterionId: 'c',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains a specific, accurate gap between New South rhetoric and reality — e.g. persistence of cotton monoculture and tenant farming/the crop-lien system rather than genuine economic diversification, or the entrenchment of Jim Crow segregation (upheld in Plessy v. Ferguson, 1896) rather than the racial progress implied by "New South" boosterism. No credit for a vague or unsupported contrast.',
            modelResponse:
              '"New South" boosters like Henry Grady promised a diversified, industrialized economy, but most former slaves and many poor white farmers instead became tenant farmers or sharecroppers trapped in the crop-lien system, continuing the region\'s dependence on cotton rather than achieving the promised economic transformation.',
          },
        ],
      },
      estimatedMinutes: 5,
    },
    {
      id: 'misconception-empty-frontier',
      kind: 'misconception_check',
      question:
        'True or false: the "frontier" that western settlers moved into in this period was empty, unclaimed land, so homesteading did not require displacing anyone.',
      commonErrors: [
        {
          answer: 'true',
          misconception:
            'The "empty frontier" myth — treating the Great Plains and the West as vacant land simply waiting to be filled, rather than land already inhabited, used, and often treaty-recognized as belonging to Plains nations.',
          correctsTo:
            'FALSE. The Plains and the broader West were home to Native nations — including the Lakota Sioux and Cheyenne — who depended on the land and its buffalo herds for subsistence and held treaty-recognized claims to much of it. Federally subsidized settlement (the Homestead Act, railroad land grants) and the destruction of the buffalo herds directly displaced these nations and destroyed their way of life, provoking sustained armed conflict — the Plains Wars, including the Lakota and Cheyenne victory at Little Bighorn (1876) and the U.S. military\'s killing of Lakota men, women, and children at Wounded Knee (1890) — and culminating in the assimilationist, land-seizing Dawes Act (1887). Describing the West as "empty" erases the displacement AP US History asks you to explain as a direct effect of federal settlement policy, not a side note to it.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The Homestead Act (1862) and federally subsidized railroads (transcontinental line completed 1869) worked together to drive rapid, government-backed western settlement.',
        'The Plains Wars were a sustained, asymmetric conflict over land and survival — Little Bighorn (1876, a rare decisive Native victory) and Wounded Knee (1890, the end of large-scale armed resistance) deserve measured, non-triumphalist treatment.',
        'The Dawes Act (1887) broke up communally held reservation land into individual allotments to force assimilation, devastating Native landholding rather than achieving its stated goal.',
        '"New South" boosterism promised industrial diversification; the reality was continued cotton dependence through tenant farming and the crop-lien system, plus the entrenchment of Jim Crow (upheld in Plessy v. Ferguson, 1896).',
        'The West was not empty land — describing it that way erases the displacement of Plains nations that subsidized settlement directly caused.',
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '6',
    cedTopic: '6.2-6.3',
    cedTitle: 'The West and the New South',
    sources: [{ type: 'plan', source: 'AP Plans Initiative — AP US History' }],
  },
};
