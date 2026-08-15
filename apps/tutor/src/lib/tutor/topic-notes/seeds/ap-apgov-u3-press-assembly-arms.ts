/**
 * AP US Government & Politics — CED Unit 3.5-3.6: Press, Assembly, and the
 * Second Amendment.
 *
 * Hand-authored baseline mirroring the lesson plan
 * `evelyn.ap.apgov.press-assembly-arms.v1`. Covers freedom of the press and
 * prior restraint (New York Times Co. v. United States, 1971 — the
 * Pentagon Papers case), the rights of assembly and petition, and the
 * Second Amendment as incorporated against the states via the Fourteenth
 * Amendment's Due Process Clause (McDonald v. Chicago, 2010).
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_APGOV_PRESS_ASSEMBLY_ARMS: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.apgov.press-assembly-arms.v1',
  course: 'AP US Government & Politics',
  cedUnit: 3,
  cedTopic: '3.5-3.6',
  cedTitle: 'Press, Assembly & the Second Amendment',
  planId: 'evelyn.ap.apgov.press-assembly-arms.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-11',
  sources: [{ type: 'plan', planId: 'evelyn.ap.apgov.press-assembly-arms.v1' }],
  theory: [
    {
      loId: 'apgov.press-assembly-arms',
      kind: 'concept',
      title: 'freedom of the press',
      content:
        'The First Amendment protects the press from government censorship and interference, on the theory that an independent press able to report on government (including unfavorably) is essential to self-government and to holding officials accountable.',
    },
    {
      loId: 'apgov.press-assembly-arms',
      kind: 'definition',
      title: 'prior restraint',
      content:
        'Government action blocking speech or publication BEFORE it happens, rather than punishing it afterward. Prior restraint carries a "heavy presumption" against its constitutionality — the government must clear an extremely high bar to justify stopping publication in advance. Established as the leading modern doctrine in New York Times Co. v. United States (1971).',
    },
    {
      loId: 'apgov.press-assembly-arms',
      kind: 'event',
      title: 'New York Times Co. v. United States (1971) — the Pentagon Papers case',
      content:
        'The federal government sought a court injunction to stop the New York Times and Washington Post from publishing the "Pentagon Papers," a classified Defense Department study of Vietnam War decision-making, arguing publication would harm national security. The Supreme Court refused to block publication, holding the government had NOT met the heavy burden required to justify a prior restraint. The government could still, in principle, pursue OTHER remedies (e.g. prosecution) after publication, but could not stop publication in advance on the showing it made here.',
    },
    {
      loId: 'apgov.press-assembly-arms',
      kind: 'definition',
      title: 'assembly and petition',
      content:
        'First Amendment rights to peaceably gather (protest, march, demonstrate) and to formally ask government for a redress of grievances (e.g. organized lobbying). Government may impose reasonable, content-neutral time/place/manner restrictions (e.g. permit requirements) but cannot ban assembly or petition based on the viewpoint being expressed.',
    },
    {
      loId: 'apgov.press-assembly-arms',
      kind: 'concept',
      title: 'the Second Amendment: unresolved as to the states',
      content:
        '"A well regulated Militia, being necessary to the security of a free State, the right of the people to keep and bear Arms, shall not be infringed." For most of American history, whether this right applied to STATE and local gun regulations (as opposed to purely federal law) was unresolved.',
    },
    {
      loId: 'apgov.press-assembly-arms',
      kind: 'event',
      title: 'McDonald v. Chicago (2010) — Second Amendment incorporated',
      content:
        "Chicago had a handgun ban. The Supreme Court held the Second Amendment's individual right to keep and bear arms is INCORPORATED against state and local governments via the Fourteenth Amendment's DUE PROCESS CLAUSE — the same selective-incorporation mechanism (NOT the Equal Protection Clause) used to apply most other Bill of Rights protections to the states. After McDonald, state and local gun laws, not just federal gun laws, are subject to Second Amendment scrutiny.",
    },
    {
      loId: 'apgov.press-assembly-arms',
      kind: 'concept',
      title: 'incorporation as an ongoing process',
      content:
        "McDonald is one installment in the ongoing, CASE-BY-CASE process of selective incorporation — the Fourteenth Amendment's Due Process Clause has been used, right by right over more than a century, to apply most (not automatically all) Bill of Rights protections to the states.",
    },
    {
      loId: 'apgov.press-assembly-arms',
      kind: 'trap',
      title: 'NYT v. US does not immunize the press from all consequences',
      content:
        'New York Times Co. v. United States (1971) held only that the government had not met its burden to justify a PRIOR RESTRAINT (blocking publication in advance). It did not immunize the press from all after-the-fact legal consequences — the press can still, in principle, face libel/defamation liability for false and damaging statements. The core distinction is stopping speech BEFORE it happens (prior restraint, the heaviest scrutiny) vs. consequences AFTER it happens (a different, less demanding analysis).',
    },
  ],
  methods: [
    {
      title: 'Apply the prior-restraint standard to a new publication scenario',
      when_to_use:
        'Use this whenever a prompt describes government trying to stop speech or publication before it happens.',
      steps: [
        'IDENTIFY THAT THIS IS PRIOR RESTRAINT — government action stopping speech BEFORE it occurs, not punishing it afterward.',
        'STATE THE STANDARD: New York Times Co. v. United States (1971) held prior restraint carries a "heavy presumption" against constitutionality; the government bears a heavy burden to justify it.',
        'COMPARE THE GOVERNMENT\'S JUSTIFICATION to what NYT v. US found insufficient — even a national-security claim from a classified wartime study did not meet the burden; a weaker justification (e.g. embarrassment) meets it even less.',
        'DISTINGUISH SUBSEQUENT REMEDIES: if the prompt asks about consequences AFTER publication (e.g. libel for false claims), note this is a separate, less demanding question from prior restraint.',
      ],
      example: {
        problem: 'A federal agency asks a court to block a newspaper from publishing a story based on leaked memos, citing embarrassment to the agency. Will the court likely grant the block?',
        solution:
          'No. Under New York Times Co. v. United States (1971), prior restraint carries a heavy presumption against constitutionality. A claim of mere embarrassment is a weaker showing than the national-security claim the government made and lost in NYT v. US itself, so a court would likely deny the request and allow publication.',
      },
      relatedLoIds: ['apgov.press-assembly-arms'],
    },
    {
      title: 'Identify the incorporation mechanism in a Second Amendment scenario',
      when_to_use:
        'Use this whenever a prompt asks whether a STATE or local gun law is subject to Second Amendment constraints, or what mechanism applies it to the states.',
      steps: [
        'CONFIRM THE RIGHT AT ISSUE is the Second Amendment right to keep and bear arms.',
        'CONFIRM THE ACTOR is a STATE or LOCAL government, not the federal government — this is what makes incorporation the relevant question.',
        'NAME THE MECHANISM PRECISELY: the Fourteenth Amendment\'s DUE PROCESS CLAUSE (McDonald v. Chicago, 2010) — NOT the Equal Protection Clause.',
        'NOTE THAT THIS IS ONE INSTALLMENT of the broader selective-incorporation doctrine, not a one-time or final event.',
      ],
      relatedLoIds: ['apgov.press-assembly-arms'],
    },
  ],
  pointers: [
    { content: 'McDonald v. Chicago incorporated the Second Amendment via the Fourteenth Amendment\'s DUE PROCESS Clause, not the Equal Protection Clause — don\'t conflate the two.', kind: 'trap' },
    { content: 'NYT v. US (1971) addressed prior restraint only — it does not mean the press faces zero legal consequences after publication (e.g. libel is still possible).', kind: 'trap' },
    { content: 'Prior restraint bears the HEAVIEST First Amendment scrutiny — a much higher bar than punishing speech after the fact.', kind: 'tip' },
    { content: 'Assembly/petition restrictions are only constitutional if content-neutral (time/place/manner); a rule singling out protest specifically is a viewpoint-based restriction.', kind: 'tip' },
    { content: 'Incorporation is an ongoing, case-by-case doctrine — McDonald (2010) is one installment, following Gideon (1963) and preceding this unit\'s due-process lesson.', kind: 'tip' },
  ],
};
