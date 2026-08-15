/**
 * AP US History — Unit 5 CED 5.9: Emancipation.
 *
 * Hand-authored baseline mirroring the lesson plan
 * `evelyn.ap.apush.emancipation.v1`. Precisely distinguishes the
 * Emancipation Proclamation's recital of the September 1862
 * preliminary promise ("shall be then, thenceforward, and forever
 * free") from its actual January 1, 1863 operative clause ("are, and
 * henceforward shall be free"), and covers its scope, limitations,
 * Black military service, and the 13th Amendment.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_APUSH_EMANCIPATION: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.apush.emancipation.v1',
  course: 'AP United States History',
  cedUnit: 5,
  cedTopic: '5.9',
  cedTitle: 'Emancipation',
  planId: 'evelyn.ap.apush.emancipation.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-11',
  sources: [{ type: 'plan', planId: 'evelyn.ap.apush.emancipation.v1' }],
  theory: [
    {
      loId: 'apush.emancipation',
      kind: 'definition',
      title: 'Emancipation Proclamation',
      content:
        "Lincoln's January 1, 1863 executive order declaring enslaved people free within specifically designated Confederate states and parts of states still in rebellion, issued as a war measure under his commander-in-chief powers. It is not a general or immediate abolition of slavery everywhere.",
    },
    {
      loId: 'apush.emancipation',
      kind: 'definition',
      title: 'war measure / military necessity',
      content:
        "The Proclamation's legal basis: the president's wartime power as Commander-in-Chief during rebellion, not a permanent constitutional power to abolish slavery. Because this basis was wartime-specific, its legal survival past the war was uncertain absent a constitutional amendment.",
    },
    {
      loId: 'apush.emancipation',
      kind: 'definition',
      title: 'border states',
      content:
        'The slaveholding states (Missouri, Kentucky, Maryland, Delaware) that remained loyal to the Union and never seceded; explicitly exempted from the Emancipation Proclamation, along with Union-occupied Confederate territory.',
    },
    {
      loId: 'apush.emancipation',
      kind: 'event',
      title: 'the preliminary proclamation (September 22, 1862)',
      content:
        "Five days after the Union's victory at Antietam (Sept. 17, 1862), Lincoln announced that if the rebellion did not end by January 1, 1863, enslaved people in still-rebelling areas would be declared free. Waiting for a battlefield victory let Lincoln announce this from strength, not apparent desperation.",
    },
    {
      loId: 'apush.emancipation',
      kind: 'trap',
      title: 'the recital vs. the operative clause — a precision trap',
      content:
        'The January 1, 1863 document OPENS by restating ("shall be then, thenceforward, and forever free") the promise already made in the September 1862 preliminary proclamation — that is a recital, not yet the act. The document\'s actual OPERATIVE clause comes later: "I do order and declare that all persons held as slaves... are, and henceforward shall be free." That "order and declare... are... free" clause is what legally executes emancipation on January 1, 1863 — do not quote the earlier recital as if it were the operative text.',
    },
    {
      loId: 'apush.emancipation',
      kind: 'framework',
      title: 'what the Proclamation did',
      content:
        'As of January 1, 1863, it legally declared enslaved people free within the specifically "designated States, and parts of States" still in rebellion, and committed the US government and military to "recognize and maintain" that freedom — enforcement following as Union armies advanced into and occupied Confederate territory.',
    },
    {
      loId: 'apush.emancipation',
      kind: 'framework',
      title: 'what the Proclamation did NOT do',
      content:
        'It did not apply to the loyal border states (never seceded) or to Union-occupied parts of Confederate states already under federal control — both fell outside the "designated States, and parts of States" it named. It did not abolish slavery nationwide or permanently by constitutional authority; that step required the 13th Amendment (1865).',
    },
    {
      loId: 'apush.emancipation',
      kind: 'event',
      title: 'Black military service',
      content:
        'The Proclamation opened formal Black enlistment in the Union Army and Navy. Roughly 180,000 Black soldiers, including the 54th Massachusetts Infantry Regiment, served by war\'s end — aiding the Union militarily and becoming a powerful argument for postwar citizenship and political rights.',
    },
    {
      loId: 'apush.emancipation',
      kind: 'event',
      title: 'the war\'s purpose reframed; the Gettysburg Address (Nov. 1863)',
      content:
        'Emancipation transformed the Union\'s stated war aim from reunion alone to reunion plus emancipation. Lincoln\'s Gettysburg Address, delivered at a Union cemetery dedication ten months after the Proclamation, reframed the war as a moment for the nation\'s renewal and recommitment to freedom.',
    },
    {
      loId: 'apush.emancipation',
      kind: 'definition',
      title: '13th Amendment (1865)',
      content:
        'Passed by Congress in January 1865, ratified in December 1865: abolished slavery throughout the entire United States by permanent constitutional authority, resolving the Proclamation\'s narrower wartime legal basis and geographic exemptions.',
    },
  ],
  methods: [
    {
      title: 'Precisely scope a legal/executive document\'s claims',
      when_to_use:
        'Use this whenever a document (executive order, court ruling, statute) makes a claim about who or what it covers — before assuming it applies universally or permanently.',
      steps: [
        'FIND THE OPERATIVE CLAUSE — the verb that actually performs the act ("order and declare," "is hereby enacted") — and distinguish it from any recital or preamble restating an earlier promise or finding.',
        'IDENTIFY THE EXACT SCOPE LANGUAGE (named states, named parties, named territory) and note what falls OUTSIDE it.',
        'IDENTIFY THE LEGAL AUTHORITY CITED (e.g., wartime commander-in-chief power vs. constitutional amendment) and whether that authority is permanent or contingent.',
        'STATE PRECISELY what the document did and did not do, rather than defaulting to its popular reputation.',
      ],
      example: {
        problem: 'Does the Emancipation Proclamation\'s opening clause ("shall be then, thenceforward, and forever free") free anyone on January 1, 1863?',
        solution:
          'No — that opening clause is a recital restating the September 1862 preliminary promise. The document\'s operative clause, later in the same text ("I do order and declare... are, and henceforward shall be free"), is what actually executes emancipation on January 1, 1863, and only within the specifically designated rebelling states/parts of states.',
      },
      relatedLoIds: ['apush.emancipation'],
    },
  ],
  pointers: [
    { content: 'The #1 trap: writing that the Proclamation "freed all enslaved people immediately." It exempted border states and Union-occupied territory and rested on wartime power alone.', kind: 'trap' },
    { content: 'Do not quote the Proclamation\'s opening recital ("shall be then, thenceforward, and forever free") as the operative clause — the operative clause is "are, and henceforward shall be free."', kind: 'edge-case' },
    { content: 'Slavery was not abolished nationwide until the 13th Amendment (ratified Dec. 1865) — a full two years after the Proclamation.', kind: 'tip' },
    { content: 'Antietam (Sept. 17, 1862) came BEFORE the preliminary proclamation (Sept. 22, 1862) — Lincoln waited for a victory before announcing.', kind: 'tip' },
    { content: 'The Proclamation\'s legal basis is "military necessity" under commander-in-chief war powers, not a general presidential power over slavery.', kind: 'frq-vocab' },
  ],
};
