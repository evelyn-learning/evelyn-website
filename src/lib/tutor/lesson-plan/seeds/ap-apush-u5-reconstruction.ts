/**
 * AP US History — CED Unit 5.10-5.11: Reconstruction.
 *
 * Period-5 content plan. Covers Presidential vs. Radical/Congressional
 * Reconstruction, the 13th/14th/15th Amendments, the Freedmen's
 * Bureau, Black officeholding, sharecropping and the crop-lien system,
 * the Ku Klux Klan and Redemption, and the Compromise of 1877 — and
 * presents the historiographic debate over Reconstruction's failure
 * neutrally, per the Period-5 spec.
 *
 * No passage wired for this plan (per the Period-5 content-plan spec)
 * — the worked example instead analyzes the contrast between
 * Presidential and Congressional Reconstruction's readmission
 * requirements.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APUSH_U5_RECONSTRUCTION: LessonPlan = {
  id: 'evelyn.ap.apush.reconstruction.v1',
  title: 'U5.10 Reconstruction',
  curriculum: 'AP',
  grade: '11',
  subject: 'ss',
  topic: 'ap-us-history',
  locale: 'en',
  los: [
    {
      id: 'apush.reconstruction-era',
      description:
        'Explain the differences between Presidential and Radical/Congressional Reconstruction, the 13th, 14th, and 15th Amendments, the Freedmen\'s Bureau, Black officeholding, the sharecropping and crop-lien system, Ku Klux Klan violence and Redemption, and the Compromise of 1877, and evaluate competing historical interpretations of why Reconstruction did not secure lasting racial equality.',
      standard: 'AP-APUSH-5.10',
    },
  ],
  prerequisites: ['apush.emancipation'],
  followUps: [],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make Reconstruction feel like a genuine, contested political fight over what "freedom" would concretely mean, not a settled postscript to the war.',
      script:
        "The Civil War answered one question — the Union would not be broken, and slavery would not continue — and immediately opened a much harder one: what would freedom actually mean, in practice, for four million formerly enslaved people, most of whom owned no land, held no office, and had no vote? Between 1865 and 1877, the United States tried several different answers to that question — a lenient presidential plan that let former Confederate states mostly govern themselves again almost immediately, and then a much more assertive congressional plan backed by federal troops, new constitutional amendments, and Black political participation unprecedented in American history to that point. By 1877, federal troops had withdrawn and White Democratic governments had retaken every Southern state. Historians still debate exactly why. Today we're tracing what each side of Reconstruction actually tried to build — and looking honestly at that debate rather than assuming a single simple verdict.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-reconstruction',
      kind: 'concept',
      goal: 'Explain Presidential vs. Radical Reconstruction, the Reconstruction Amendments, Black political and economic life, and Reconstruction\'s violent rollback — and present the historiographic debate over its failure neutrally.',
      keyIdeas: [
        "PRESIDENTIAL RECONSTRUCTION (1863-1866): Lincoln's wartime \"Ten Percent Plan\" and, after his assassination in April 1865, President Andrew Johnson's similarly lenient plan required only a small loyalty oath and did not guarantee freedpeople's civil or political rights. Under this light federal hand, restored Southern legislatures quickly passed BLACK CODES — laws restricting freedpeople's labor contracts, movement, and legal standing, closely resembling the antebellum slave codes.",
        'RADICAL (CONGRESSIONAL) RECONSTRUCTION (1867-1877): outraged by the Black Codes and by violence against freedpeople, the Republican-controlled Congress refused to seat the readmitted Southern representatives and asserted its own Reconstruction authority: the Civil Rights Act (1866) and the RECONSTRUCTION ACTS (1867) placed the former Confederacy under military districts and required Southern states to ratify the 14th Amendment and grant Black men the vote before full readmission to the Union.',
        'THE RECONSTRUCTION AMENDMENTS: the 13TH AMENDMENT (ratified December 1865) abolished slavery nationwide by permanent constitutional authority; the 14TH AMENDMENT (ratified 1868) established birthright citizenship and guaranteed all citizens equal protection of the laws; the 15TH AMENDMENT (ratified 1870) prohibited denying the vote based on race. Together they gave freedpeople a constitutional foundation for citizenship and political participation that Presidential Reconstruction alone had not provided.',
        "THE FREEDMEN'S BUREAU AND BLACK OFFICEHOLDING: the federal Freedmen's Bureau (established 1865) provided food, medical care, legal assistance, and education (including founding schools) to formerly enslaved people, and helped negotiate labor contracts. Under Radical Reconstruction, Black men voted and held office in unprecedented numbers for the first time in American history, including in state legislatures and, at the federal level, US Senators Hiram Revels and Blanche K. Bruce of Mississippi.",
        "SHARECROPPING AND THE CROP-LIEN SYSTEM: with land redistribution largely rejected by Congress, most formerly enslaved people (and many poor White farmers) became SHARECROPPERS, renting land from landowners in exchange for a share of the crop rather than owning land themselves. The CROP-LIEN SYSTEM let sharecroppers borrow supplies against a future harvest at high interest from local merchants or landowners, frequently trapping tenant families in cycles of debt that limited their real economic independence even after gaining legal freedom.",
        "THE KU KLUX KLAN AND REDEMPTION: White supremacist paramilitary groups, most prominently the Ku Klux Klan (founded 1865-66), used violence and intimidation to suppress Black voting and officeholding and to attack their White Republican allies. Through the 1870s, \"REDEEMER\" Democratic governments used this violence, alongside fraud and declining Northern political will to keep enforcing Reconstruction, to retake Southern state governments one by one.",
        "THE COMPROMISE OF 1877 AND RECONSTRUCTION'S END: the disputed 1876 presidential election (Rutherford B. Hayes vs. Samuel Tilden) was resolved through an informal political bargain: Hayes received the presidency in exchange for withdrawing the remaining federal troops enforcing Reconstruction in the South. This effectively ended Reconstruction, allowing Redeemer governments to consolidate control and setting the stage for the Jim Crow system of legal segregation and disenfranchisement in subsequent decades.",
      ],
      vocabulary: [
        {
          term: 'Black Codes',
          definition:
            "restrictive laws passed by restored Southern legislatures under Presidential Reconstruction, limiting freedpeople's labor contracts, movement, and legal rights in ways closely resembling the antebellum slave codes.",
        },
        {
          term: 'Reconstruction Acts (1867)',
          definition:
            'Congressional legislation placing the former Confederacy under military districts and requiring Southern states to ratify the 14th Amendment and grant Black men the vote before full readmission to the Union.',
        },
        {
          term: 'sharecropping / crop-lien system',
          definition:
            "an economic arrangement in which freedpeople and poor farmers rented land for a share of the crop and borrowed supplies against future harvests at high interest, often trapping tenant families in long-term debt.",
        },
        {
          term: 'Redemption',
          definition:
            'the process by which White Democratic ("Redeemer") governments retook Southern state governments through the 1870s, using violence, fraud, and the North\'s declining commitment to enforcing Reconstruction.',
        },
        {
          term: 'Compromise of 1877',
          definition:
            "the informal resolution of the disputed 1876 election that gave Rutherford B. Hayes the presidency in exchange for withdrawing remaining federal troops from the South, effectively ending Reconstruction.",
        },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-presidential-vs-radical',
      kind: 'worked_example',
      problem:
        "Consider this comparison: under Presidential Reconstruction (1865-66), former Confederate states were readmitted after only a small loyalty-oath requirement, with no federal guarantee of freedpeople's civil or political rights. Under Congressional/Radical Reconstruction (1867-77), the same states were placed under military districts and required to ratify the 14th Amendment and grant Black men the vote before readmission. Explain why Congress imposed such different requirements within just a few years, and what the contrast reveals about competing visions of what Reconstruction required.",
      steps: [
        'START WITH THE CONTRAST ITSELF. Two very different sets of readmission requirements, applied to the same former Confederate states within a two-year span, already signal a genuine political conflict over what "reunion" was supposed to accomplish.',
        "IDENTIFY PRESIDENTIAL RECONSTRUCTION'S LOGIC. Lincoln's and then Johnson's lenient plans aimed for quick reunification and required only a loyalty oath, without conditioning readmission on protecting freedpeople's civil or political rights.",
        'IDENTIFY WHAT THAT LENIENCY PRODUCED. Under this light federal hand, restored Southern legislatures quickly passed Black Codes restricting freedpeople\'s labor, movement, and legal standing — laws that closely resembled the antebellum slave codes and provoked outrage in the Republican-controlled Congress.',
        "IDENTIFY CONGRESS'S RESPONSE AND ITS LOGIC. Refusing to seat the readmitted Southern representatives, Congress asserted its own Reconstruction authority: the Civil Rights Act (1866), the 14th Amendment, and the Reconstruction Acts (1867) required Southern states to ratify the 14th Amendment and grant Black male suffrage — and placed them under military districts to enforce this — before readmission.",
        'NAME WHAT THE CONTRAST REVEALS. Presidential and Congressional Reconstruction reflected two different visions of what reunion required: one treating reunion mainly as restoring the Union as it had existed, minus slavery, and tolerating a quick return to White-dominated Southern state governments; the other insisting reunion required active federal guarantees of Black citizenship and political rights, enforced, at least initially, by military presence.',
        "CONNECT FORWARD TO RECONSTRUCTION'S UNRAVELING. This same tension — how much active federal enforcement is required to make legal equality real, versus how quickly the South should regain self-governance — resurfaces in Reconstruction's later rollback: as Northern political will and military presence declined through the 1870s, Redeemer governments used Klan violence and fraud to retake Southern states without Congress renewing the kind of enforcement it had imposed in 1867, ending in the Compromise of 1877.",
      ],
      answer:
        "Presidential Reconstruction's lenient loyalty-oath requirement, with no federal guarantee of freedpeople's rights, let restored Southern legislatures pass Black Codes that closely resembled the antebellum slave codes — provoking a Republican-controlled Congress that refused to seat the readmitted representatives and instead imposed its own, far stricter requirements: the 14th Amendment's ratification, Black male suffrage, and temporary military districts under the Reconstruction Acts (1867). This contrast reveals two competing visions of Reconstruction — one treating reunion as mainly restoring the prewar Union minus slavery, the other insisting reunion required active federal enforcement of Black citizenship and political rights. That same tension — how much enforcement equality actually requires — resurfaces as Northern commitment and military presence declined through the 1870s, letting Redeemer governments retake the South through violence and fraud, ending with the Compromise of 1877.",
      estimatedMinutes: 5,
    },
    {
      id: 'try-saq',
      kind: 'try_yourself',
      problem:
        "SAQ practice. (a) Briefly describe ONE specific difference between Presidential and Radical/Congressional Reconstruction. (b) Briefly explain ONE way formerly enslaved people's political or economic status changed during Reconstruction. (c) Briefly explain ONE reason Reconstruction ended by the late 1870s.",
      responseFormat: 'frq',
      rubric: {
        parts: [
          {
            criterionId: 'a',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): correctly and specifically describes a genuine difference — e.g., Presidential Reconstruction\'s minimal loyalty-oath requirement vs. Congressional Reconstruction\'s military districts and 14th Amendment ratification requirement. No credit for a vague statement with no specific requirement named.',
            modelResponse:
              "Presidential Reconstruction required only a small loyalty oath for Southern states to be readmitted, while Radical/Congressional Reconstruction, under the Reconstruction Acts of 1867, required states to ratify the 14th Amendment and grant Black men the vote, enforced by military districts.",
          },
          {
            criterionId: 'b',
            maxPoints: 1,
            scoringCriteria:
              "Full credit (1): explains a specific, accurate change in freedpeople's status — e.g., Black officeholding (Hiram Revels, Blanche K. Bruce), the Freedmen's Bureau's aid and schools, or the shift into sharecropping/crop-lien tenancy. No credit for a vague or unsupported claim.",
            modelResponse:
              "During Radical Reconstruction, Black men voted and held office in unprecedented numbers, including US Senators Hiram Revels and Blanche K. Bruce of Mississippi — a level of Black political participation that had not existed before in American history.",
          },
          {
            criterionId: 'c',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains a specific, accurate reason Reconstruction ended — e.g., Ku Klux Klan violence and Redemption, declining Northern political will, or the Compromise of 1877 withdrawing federal troops. No credit for a vague or unsupported claim.',
            modelResponse:
              'The disputed 1876 election was resolved by the Compromise of 1877, in which Rutherford B. Hayes received the presidency in exchange for withdrawing the remaining federal troops enforcing Reconstruction in the South, allowing Redeemer governments to consolidate control.',
          },
        ],
      },
      estimatedMinutes: 5,
    },
    {
      id: 'misconception-too-radical',
      kind: 'misconception_check',
      question:
        'True or false: historians agree that Reconstruction failed mainly because it was too radical and moved too fast for the South to accept.',
      commonErrors: [
        {
          answer: 'true',
          misconception:
            'Treating one historical interpretation as settled consensus rather than recognizing that historians have substantially debated and revised this question.',
          correctsTo:
            'FALSE — historians do not agree on this, and the AP course expects you to recognize the debate rather than assume one side has won it. An older interpretation, associated with early-twentieth-century "Dunning School" historians, argued Reconstruction failed because it was too radical, corrupt, and imposed on an unwilling White South. Later historians (most influentially Eric Foner, describing Reconstruction as an "unfinished revolution") substantially revised this view, arguing instead that Reconstruction\'s central failure was that federal enforcement was NOT sustained long enough or backed by enough durable commitment (including land redistribution, which Congress largely rejected) to protect freedpeople\'s rights against organized violent resistance, and that the earlier interpretation minimized documented Ku Klux Klan violence and genuine Black political achievements. Present both the historical debate and its evolution accurately, rather than treating either single verdict as settled fact.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        "Presidential Reconstruction (1865-66) was lenient and produced the Black Codes; Radical/Congressional Reconstruction (1867-77) imposed military districts, the 14th Amendment's ratification, and Black male suffrage as readmission conditions.",
        'The 13th (1865), 14th (1868), and 15th (1870) Amendments gave freedpeople constitutional citizenship, equal protection, and voting rights.',
        "The Freedmen's Bureau provided aid and education; Black men held office in unprecedented numbers, including US Senators Revels and Bruce.",
        'Sharecropping and the crop-lien system gave freedpeople and poor farmers land access without ownership, often trapping them in debt.',
        'Ku Klux Klan violence and Redeemer governments retook Southern states through the 1870s; the Compromise of 1877 withdrew federal troops and ended Reconstruction.',
        'Historians actively debate why Reconstruction failed to secure lasting equality — present the range (the revised "Dunning School" view vs. later scholarship emphasizing insufficient, not excessive, federal enforcement) neutrally, not as a settled verdict.',
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '5',
    cedTopic: '5.10-5.11',
    cedTitle: 'Reconstruction',
    sources: [{ type: 'plan', source: 'AP Plans Initiative — AP US History' }],
  },
};
