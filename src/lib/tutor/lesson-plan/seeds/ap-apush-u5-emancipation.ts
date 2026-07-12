/**
 * AP US History — CED Unit 5.9: Emancipation.
 *
 * Period-5 content plan (follows the causes-of-revolution calibration
 * template). Covers the shift from a war for reunion to a war for
 * emancipation, Black soldiers' service, the Gettysburg Address's
 * reframing of the war's purpose (described, not quoted — the
 * Gettysburg passage is reserved for MCQs/DBQ practice per the
 * Period-5 spec), and the 13th Amendment — and precisely distinguishes
 * what the Emancipation Proclamation did and did not do.
 *
 * Anchor text: Abraham Lincoln, the Emancipation Proclamation (January
 * 1, 1863) — evelyn.passage.apush-emancipation-proclamation.v1.
 * PRECISION TRAP handled explicitly in the worked example: the
 * passage's opening clause ("shall be then, thenceforward, and forever
 * free") is the January 1 document's own RECITAL of the September 22,
 * 1862 preliminary proclamation's promise — the January 1 document's
 * actual OPERATIVE clause, later in the same excerpt, reads "are, and
 * henceforward shall be free." The worked example teaches this
 * distinction rather than treating the recital as the operative text.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APUSH_U5_EMANCIPATION: LessonPlan = {
  id: 'evelyn.ap.apush.emancipation.v1',
  title: 'U5.9 Emancipation',
  curriculum: 'AP',
  grade: '11',
  subject: 'ss',
  topic: 'ap-us-history',
  locale: 'en',
  los: [
    {
      id: 'apush.emancipation',
      description:
        'Explain the legal basis, scope, and limitations of the Emancipation Proclamation (1863), the war\'s shift from a war for reunion to a war for reunion and emancipation, Black soldiers\' military service, and the 13th Amendment\'s completion of legal abolition.',
      standard: 'AP-APUSH-5.9',
    },
  ],
  prerequisites: ['apush.secession-civil-war'],
  followUps: ['apush.reconstruction'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the Emancipation Proclamation feel like a precisely limited wartime legal act, not a single sweeping moment that ended slavery everywhere.',
      script:
        "On January 1, 1863, Abraham Lincoln signed a document that most Americans remember as the moment slavery ended. It didn't. It was a carefully limited wartime order, issued under the president's war powers, that applied only to specific Confederate territory still in rebellion — and explicitly did not touch slavery in the loyal border states or in Confederate areas already under Union military control. It took two more years and a constitutional amendment to actually abolish slavery everywhere in the United States. That gap between the document's reputation and its actual, narrower legal text is exactly what this lesson is built to close — because the AP exam rewards knowing precisely what the Proclamation did, what it didn't, and why Lincoln built it the way he did.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-emancipation',
      kind: 'concept',
      goal: 'Explain what the Emancipation Proclamation did and did not do, the war\'s shift toward emancipation as a war aim, Black military service, and the 13th Amendment.',
      keyIdeas: [
        'THE PRELIMINARY PROCLAMATION (September 22, 1862): five days after the Union\'s costly victory at Antietam (September 17, 1862) — the first clear Union battlefield success in the Eastern theater — Lincoln announced that if the rebellion did not end by January 1, 1863, he would declare enslaved people in still-rebelling areas free. Waiting for a Union victory let Lincoln issue the announcement from a position of relative strength, not apparent desperation.',
        'THE FINAL PROCLAMATION (January 1, 1863): Lincoln issued the final Emancipation Proclamation as promised, ORDERING AND DECLARING that enslaved people within the specifically named rebelling states and parts of states "are, and henceforward shall be free," and committing the US government and military to "recognize and maintain" that freedom as Union forces advanced.',
        'WHAT IT DID NOT DO: the Proclamation applied only to areas the document specifically designated as still in rebellion — it explicitly EXEMPTED the loyal border states (Missouri, Kentucky, Maryland, Delaware, which had never seceded) and Union-occupied parts of Confederate states already back under federal control. It also did not abolish slavery permanently or nationwide by constitutional authority; as a WAR MEASURE grounded in the president\'s commander-in-chief powers "upon military necessity," its legal survival past the war was uncertain, which is exactly why abolitionists pushed for a constitutional amendment.',
        'BLACK MILITARY SERVICE: the Proclamation also opened the door to formal Black enlistment in the Union Army and Navy. Roughly 180,000 Black soldiers, including the celebrated 54th Massachusetts Infantry Regiment, served in the Union military by the war\'s end — service that both aided the Union war effort militarily and became a powerful argument, made by Black soldiers and their advocates, for full citizenship and postwar political rights.',
        'THE WAR\'S PURPOSE REFRAMED: emancipation transformed the Union\'s stated war aim from reunion alone into reunion PLUS emancipation. Lincoln\'s Gettysburg Address (November 1863), delivered at the dedication of a Union cemetery on the battlefield of the Battle of Gettysburg (fought that July 1863), reframed the war in terms of the nation\'s spiritual rebirth through renewed dedication to freedom — a rhetorical and political shift building directly on the Emancipation Proclamation issued ten months earlier.',
        'THE 13TH AMENDMENT (1865): the Emancipation Proclamation\'s limitations — its narrow wartime legal basis and geographic exemptions — were resolved only by the 13th Amendment, passed by Congress in January 1865 and ratified in December 1865, which abolished slavery throughout the entire United States by permanent constitutional authority, not as a temporary war measure.',
      ],
      vocabulary: [
        {
          term: 'Emancipation Proclamation',
          definition:
            'Lincoln\'s January 1, 1863 executive order declaring enslaved people free in specifically designated Confederate states and parts of states still in rebellion, issued as a war measure under his commander-in-chief powers.',
        },
        {
          term: 'war measure / military necessity',
          definition:
            "the Proclamation's legal basis: the president's war powers as commander-in-chief during rebellion, not a general or permanent constitutional power to abolish slavery — which is why its legal survival past the war was uncertain absent a constitutional amendment.",
        },
        {
          term: 'border states',
          definition:
            'the slaveholding states (Missouri, Kentucky, Maryland, Delaware) that remained loyal to the Union and never seceded; explicitly exempted from the Emancipation Proclamation.',
        },
        {
          term: '54th Massachusetts Infantry',
          definition:
            'a celebrated regiment of Black Union soldiers, part of roughly 180,000 Black troops who served in the Union Army and Navy after the Emancipation Proclamation opened the door to Black enlistment.',
        },
        {
          term: '13th Amendment (1865)',
          definition:
            'the constitutional amendment abolishing slavery throughout the entire United States by permanent authority, resolving the Emancipation Proclamation\'s narrower wartime and geographic limitations.',
        },
      ],
      passageId: 'evelyn.passage.apush-emancipation-proclamation.v1',
      estimatedMinutes: 6,
    },
    {
      id: 'worked-emancipation-proclamation',
      kind: 'worked_example',
      problem:
        'Analyze this excerpt from the Emancipation Proclamation (January 1, 1863): "That on the first day of January, in the year of our Lord one thousand eight hundred and sixty-three, all persons held as slaves within any State or designated part of a State, the people whereof shall then be in rebellion against the United States, shall be then, thenceforward, and forever free;... Now, therefore I, Abraham Lincoln, President of the United States, by virtue of the power in me vested as Commander-in-Chief, of the Army and Navy of the United States in time of actual armed rebellion against the authority and government of the United States, and as a fit and necessary war measure for suppressing said rebellion,... I do order and declare that all persons held as slaves within said designated States, and parts of States, are, and henceforward shall be free; and that the Executive government of the United States, including the military and naval authorities thereof, will recognize and maintain the freedom of said persons... And upon this act, sincerely believed to be an act of justice, warranted by the Constitution, upon military necessity, I invoke the considerate judgment of mankind, and the gracious favor of Almighty God." Precisely what does this document do, what does it not do, and on what legal authority does it rest?',
      steps: [
        'SOURCE IT FIRST. Abraham Lincoln, January 1, 1863 — one hundred days after the preliminary proclamation of September 22, 1862 (itself issued five days after the Union victory at Antietam), which had promised this exact action if the rebellion continued.',
        'DISTINGUISH THE RECITAL FROM THE OPERATIVE CLAUSE — A PRECISION TRAP. The opening line, "shall be then, thenceforward, and forever free," is the January 1 document RESTATING the promise it had already made back in the September 1862 preliminary proclamation — it is a recital of what was previously announced, not yet the act itself. The document\'s actual OPERATIVE clause comes later: "I do order and declare that all persons held as slaves within said designated States, and parts of States, are, and henceforward shall be free." That "order and declare... are... free" clause is what legally executes the Proclamation on January 1, 1863 — not the earlier recital, which an unwary reader can mistake for the operative text because it appears first and uses similarly emphatic language.',
        'NAME WHAT IT DID. As of January 1, 1863, it legally declared enslaved people free within the specifically "designated States, and parts of States" still in rebellion, and committed the US government and military to "recognize and maintain" that freedom — meaning enforcement would follow as Union armies advanced into and occupied Confederate territory.',
        'NAME WHAT IT DID NOT DO. The operative language applies only to the "designated States, and parts of States" — by restricting itself to specifically named rebelling territory, the document (in the fuller text this excerpt elides) explicitly excluded the loyal border states, which had never seceded, and Union-occupied parts of Confederate states already back under federal control. It did not abolish slavery nationwide or permanently by constitutional amendment; that step came only with the 13th Amendment in 1865.',
        'NAME THE LEGAL BASIS AND ITS LIMIT. Lincoln grounds the act in his power "as Commander-in-Chief... in time of actual armed rebellion," calling it "a fit and necessary war measure... warranted by the Constitution, upon military necessity" — a claim to a specific WARTIME power, not a general presidential authority to abolish slavery. This is precisely why the Proclamation\'s legal survival after the war was uncertain, and why abolitionists pushed for the 13th Amendment to put abolition on permanent constitutional footing.',
        'STATE THE LINK TO THE COURSE THESIS. The Proclamation transformed the Union war effort\'s stated purpose — adding emancipation to reunion — and functioned as enforceable policy within reachable Confederate territory, but its narrow war-powers legal basis and its geographic exemptions show it was a significant, limited wartime measure, not the completed abolition of slavery, which required the 13th Amendment two years later.',
      ],
      answer:
        'The Proclamation\'s opening "shall be then, thenceforward, and forever free" is the January 1, 1863 document\'s own recital of the promise it had already made in the September 1862 preliminary proclamation — the document\'s actual operative act comes later, in the clause "I do order and declare... are, and henceforward shall be free." That operative clause legally freed enslaved people, as of January 1, 1863, within the specifically designated rebelling states and parts of states, and committed the Union government and military to enforce that freedom as its armies advanced. It explicitly did not apply to the loyal border states or to Union-occupied Confederate territory, both of which fell outside the "designated States, and parts of States" the document named, and it did not abolish slavery permanently or nationwide — Lincoln grounds the whole act in his wartime power as Commander-in-Chief "upon military necessity," a limited legal basis whose survival past the war was uncertain until the 13th Amendment (1865) abolished slavery everywhere by permanent constitutional authority.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-saq',
      kind: 'try_yourself',
      problem:
        'SAQ practice. (a) Briefly describe what the Emancipation Proclamation legally did as of January 1, 1863. (b) Briefly explain ONE specific limitation of the Emancipation Proclamation. (c) Briefly explain ONE way the purpose of the Civil War changed as a result of emancipation.',
      responseFormat: 'frq',
      rubric: {
        parts: [
          {
            criterionId: 'a',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): correctly and specifically describes the Proclamation\'s legal effect — declaring enslaved people free within specifically designated Confederate states/parts of states still in rebellion, as a war measure under Lincoln\'s commander-in-chief power. No credit for a vague claim that it "freed the slaves" with no specificity about scope or basis.',
            modelResponse:
              "As of January 1, 1863, the Emancipation Proclamation declared enslaved people free within the specifically designated Confederate states and parts of states still in rebellion against the United States, issued by Lincoln as a war measure under his power as Commander-in-Chief.",
          },
          {
            criterionId: 'b',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains a specific, accurate limitation — e.g., its exemption of the loyal border states and Union-occupied Confederate territory, or its status as a wartime measure rather than a permanent constitutional abolition (requiring the 13th Amendment). No credit for a vague or unsupported claim.',
            modelResponse:
              "The Proclamation exempted the loyal border states (like Kentucky and Missouri), which had never seceded, and Union-occupied parts of Confederate territory already back under federal control — it applied only to specifically designated rebelling areas, not the whole country.",
          },
          {
            criterionId: 'c',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains a specific, accurate way the war\'s purpose changed — e.g., adding emancipation to reunion as a stated war aim, or opening formal Black enlistment in the Union military. No credit for a vague or unsupported claim.',
            modelResponse:
              "The Proclamation opened the door to formal Black enlistment in the Union Army and Navy, and reframed the Union's stated war aim from reunion alone to reunion combined with emancipation — a shift Lincoln built on later that year in the Gettysburg Address.",
          },
        ],
      },
      estimatedMinutes: 5,
    },
    {
      id: 'misconception-freed-all-slaves-immediately',
      kind: 'misconception_check',
      question:
        'True or false: the Emancipation Proclamation immediately freed all enslaved people throughout the United States.',
      commonErrors: [
        {
          answer: 'true',
          misconception:
            'Confusing the Proclamation\'s symbolic and political significance with its actual, narrower legal text — and mistaking the document\'s recital of its earlier promise for the operative clause that executes it.',
          correctsTo:
            'FALSE. The Proclamation applied only to enslaved people within specifically designated Confederate states and parts of states still in rebellion as of January 1, 1863 — it explicitly exempted the loyal border states (Missouri, Kentucky, Maryland, Delaware), which had never seceded, and Union-occupied Confederate territory already under federal control. It was issued as a wartime measure under Lincoln\'s commander-in-chief power "upon military necessity," not a permanent constitutional abolition — slavery was not abolished throughout the entire United States until the 13th Amendment was ratified in December 1865. Treating "January 1, 1863" as the moment slavery ended everywhere is a common and testable AP US History error.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The preliminary proclamation (Sept. 22, 1862) followed the Union victory at Antietam (Sept. 17, 1862); the final Proclamation (Jan. 1, 1863) executed its promise via the operative "are, and henceforward shall be free" clause.',
        'The Proclamation exempted the loyal border states and Union-occupied Confederate territory, and rested on wartime commander-in-chief power, not permanent constitutional authority.',
        'It opened formal Black enlistment in the Union military — roughly 180,000 Black soldiers served, including the 54th Massachusetts.',
        'It reframed the war\'s purpose from reunion alone to reunion plus emancipation, a shift Lincoln built on in the Gettysburg Address (Nov. 1863).',
        'Slavery was not abolished nationwide and permanently until the 13th Amendment (ratified December 1865) — not by the Proclamation itself.',
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '5',
    cedTopic: '5.9',
    cedTitle: 'Emancipation',
    sources: [
      { type: 'plan', source: 'AP Plans Initiative — AP US History' },
      {
        type: 'passage',
        book: 'evelyn.passage.apush-emancipation-proclamation.v1',
        chapter: '1863',
        note: 'The Emancipation Proclamation — analyzed to distinguish its recital of the September 1862 preliminary promise from its actual January 1, 1863 operative clause, and to teach the document\'s scope and limitations precisely.',
      },
    ],
  },
};
