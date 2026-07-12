/**
 * AP US History — Unit 5 CED 5.7-5.8: Secession and the Civil War.
 *
 * Hand-authored baseline mirroring the lesson plan
 * `evelyn.ap.apush.secession-civil-war.v1`. Covers the election of
 * 1860, the Deep South's secession in its own stated terms,
 * comparative Union/Confederate advantages, and the shift to total
 * war on both home fronts — anchored by South Carolina's Declaration
 * of the Immediate Causes of Secession (1860).
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_APUSH_SECESSION_CIVIL_WAR: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.apush.secession-civil-war.v1',
  course: 'AP United States History',
  cedUnit: 5,
  cedTopic: '5.7-5.8',
  cedTitle: 'Secession and the Civil War',
  planId: 'evelyn.ap.apush.secession-civil-war.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-11',
  sources: [{ type: 'plan', planId: 'evelyn.ap.apush.secession-civil-war.v1' }],
  theory: [
    {
      loId: 'apush.secession-civil-war',
      kind: 'definition',
      title: 'Confederate States of America',
      content:
        'The government formed by seven Deep South states that seceded between December 1860 and February 1861 (following Lincoln\'s election), joined by four Upper South states (Virginia, North Carolina, Tennessee, Arkansas) after Fort Sumter and Lincoln\'s April 1861 call for troops.',
    },
    {
      loId: 'apush.secession-civil-war',
      kind: 'definition',
      title: 'cotton diplomacy',
      content:
        "The Confederacy's hope that European economic dependence on Southern cotton exports would bring British or French diplomatic recognition or intervention. It ultimately failed, partly due to alternative cotton sources and Union diplomatic pressure.",
    },
    {
      loId: 'apush.secession-civil-war',
      kind: 'definition',
      title: 'total war',
      content:
        "A war strategy targeting an enemy's economic and civilian capacity to fight, not only its armies — illustrated by the Union naval blockade (the \"Anaconda Plan\") and Sherman's March to the Sea (1864), which deliberately destroyed Southern infrastructure, crops, and property.",
    },
    {
      loId: 'apush.secession-civil-war',
      kind: 'event',
      title: 'the election of 1860',
      content:
        'The Democratic Party split into Northern (Stephen Douglas) and Southern (John Breckinridge) factions over protecting slavery in the territories; John Bell ran as a Constitutional Union candidate. The split let Republican Abraham Lincoln win the presidency with no Southern electoral votes.',
    },
    {
      loId: 'apush.secession-civil-war',
      kind: 'event',
      title: "South Carolina's Declaration of the Immediate Causes (Dec. 24, 1860)",
      content:
        'South Carolina seceded first (convention vote Dec. 20, 1860); its Declaration names slavery directly — free states\' denial of "the rights of property" in enslaved people, their denunciation of slavery as "sinful," and assistance to enslaved people escaping or resisting. It cites no tariff or federal-spending grievance.',
    },
    {
      loId: 'apush.secession-civil-war',
      kind: 'event',
      title: 'Fort Sumter and the Upper South (April 1861)',
      content:
        "Confederate forces fired on the federal garrison at Fort Sumter, South Carolina, in April 1861. Lincoln's call for troops to suppress the rebellion pushed four Upper South states, which had not seceded initially, to join the Confederacy rather than supply troops against fellow Southern states.",
    },
    {
      loId: 'apush.secession-civil-war',
      kind: 'framework',
      title: 'comparative Union/Confederate advantages',
      content:
        'Union: larger population, greater industrial capacity, more railroad mileage, naval power, existing federal government/financial system. Confederacy: strategic defensive position on home ground (favorable for a war of attrition), initially strong Eastern-theater leadership, and a (ultimately failed) hope for European intervention via cotton diplomacy.',
    },
    {
      loId: 'apush.secession-civil-war',
      kind: 'event',
      title: 'the shift to total war',
      content:
        'As the war lengthened, Union strategy shifted from restoring the Union alone toward targeting Confederate economic/logistical capacity: the naval blockade throttled trade, and commanders including Grant and Sherman (most visibly the March to the Sea, 1864) deliberately destroyed infrastructure and property to break the Confederacy\'s capacity and will to fight.',
    },
    {
      loId: 'apush.secession-civil-war',
      kind: 'event',
      title: 'both home fronts',
      content:
        'Union: financed the war via greenbacks, an income tax, and war bonds; women expanded roles in nursing/industry/farming; the 1863 New York City draft riots reflected working-class opposition to conscription and emancipation. Confederacy: severe inflation, blockade-worsened shortages, and dissent especially among non-slaveholding yeoman farmers. ~750,000 died — the deadliest war in American history.',
    },
    {
      loId: 'apush.secession-civil-war',
      kind: 'trap',
      title: 'secession was about slavery, not tariffs',
      content:
        'South Carolina\'s own founding secession document cites no tariff or federal-spending grievance — every specific grievance concerns slavery\'s legal security, moral legitimacy, or enslaved people\'s ability to escape/resist it. The "it was really about tariffs/abstract states\' rights" explanation gained currency well after the war and contradicts the primary sources the secession conventions themselves produced.',
    },
  ],
  methods: [
    {
      title: 'Read a secession declaration for its stated cause (HIPP)',
      when_to_use:
        'Use this whenever a prompt asks you to evaluate the causes of secession using a state\'s own declaration or convention document.',
      steps: [
        'H — HISTORICAL CONTEXT: what specific recent event (e.g., Lincoln\'s election) triggered this document?',
        'I — INTENDED AUDIENCE: who is the convention addressing — its own citizens, other Southern states, or a national/international audience?',
        'P — PURPOSE: state the purpose as a verb (justify secession, rally other states) not a topic.',
        'IDENTIFY THE SPECIFIC GRIEVANCES NAMED, IN THE DOCUMENT\'S OWN WORDS. Do not substitute a grievance the document does not actually state.',
        "CHECK WHAT'S ABSENT. If tariffs or federal spending are not mentioned, that absence is itself evidence against later reinterpretations that center those causes.",
      ],
      example: {
        problem: 'What grievance does South Carolina\'s Dec. 1860 Declaration name for secession?',
        solution:
          'It names slavery specifically and repeatedly: denial of "rights of property" in enslaved people, denunciation of slavery as "sinful," and assistance to enslaved people escaping or resisting — with no mention of tariffs or federal spending at all.',
      },
      relatedLoIds: ['apush.secession-civil-war'],
    },
  ],
  pointers: [
    { content: 'The #1 trap: claiming secession was "really" about tariffs. South Carolina\'s own declaration names slavery and cites no tariff grievance — quote the document, not a later reinterpretation.', kind: 'trap' },
    { content: 'Fort Sumter (April 1861) triggered the SECOND wave of secession (Upper South) — the Deep South had already seceded by February 1861, before Sumter.', kind: 'tip' },
    { content: 'Cotton diplomacy failed — do not describe British/French intervention as if it happened; the Confederacy hoped for it but did not receive it.', kind: 'trap' },
    { content: 'Total war is a STRATEGIC SHIFT partway through the war (blockade, Sherman\'s March), not the Union\'s strategy from the war\'s first days.', kind: 'tip' },
    { content: 'Reproduce quoted transcription artifacts from period documents exactly ("have assume the right," "Constitution ;") rather than silently correcting them.', kind: 'edge-case' },
  ],
};
