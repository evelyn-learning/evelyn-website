/**
 * AP US History — Unit 5 CED 5.10-5.11: Reconstruction.
 *
 * Hand-authored baseline mirroring the lesson plan
 * `evelyn.ap.apush.reconstruction.v1`. Covers Presidential vs.
 * Radical/Congressional Reconstruction, the Reconstruction
 * Amendments, the Freedmen's Bureau and Black officeholding,
 * sharecropping/crop-lien tenancy, Klan violence and Redemption, and
 * the Compromise of 1877 — presenting the historiographic debate over
 * Reconstruction's failure neutrally. No passage anchor (unwired
 * plan).
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_APUSH_RECONSTRUCTION: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.apush.reconstruction.v1',
  course: 'AP United States History',
  cedUnit: 5,
  cedTopic: '5.10-5.11',
  cedTitle: 'Reconstruction',
  planId: 'evelyn.ap.apush.reconstruction.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-11',
  sources: [{ type: 'plan', planId: 'evelyn.ap.apush.reconstruction.v1' }],
  theory: [
    {
      loId: 'apush.reconstruction',
      kind: 'definition',
      title: 'Black Codes',
      content:
        "Restrictive laws passed by restored Southern legislatures under Presidential Reconstruction (1865-66), limiting freedpeople's labor contracts, movement, and legal rights in ways closely resembling the antebellum slave codes — the trigger for Congress's Radical Reconstruction response.",
    },
    {
      loId: 'apush.reconstruction',
      kind: 'definition',
      title: 'Reconstruction Acts (1867)',
      content:
        "Congressional legislation placing the former Confederacy under military districts and requiring Southern states to ratify the 14th Amendment and grant Black men the vote before full readmission to the Union.",
    },
    {
      loId: 'apush.reconstruction',
      kind: 'definition',
      title: 'sharecropping / crop-lien system',
      content:
        'An economic arrangement in which freedpeople and poor farmers rented land for a share of the crop (sharecropping) and borrowed supplies against future harvests at high interest (crop-lien), often trapping tenant families in long-term debt despite legal freedom.',
    },
    {
      loId: 'apush.reconstruction',
      kind: 'event',
      title: 'Presidential Reconstruction (1863-1866)',
      content:
        "Lincoln's wartime \"Ten Percent Plan\" and, after his April 1865 assassination, Andrew Johnson's similarly lenient plan required only a small loyalty oath and did not guarantee freedpeople's civil or political rights, producing the restored legislatures' Black Codes.",
    },
    {
      loId: 'apush.reconstruction',
      kind: 'event',
      title: 'Radical (Congressional) Reconstruction (1867-1877)',
      content:
        "Angered by the Black Codes and violence against freedpeople, Congress refused to seat readmitted Southern representatives and asserted its own authority: the Civil Rights Act (1866) and Reconstruction Acts (1867) required military districts, 14th Amendment ratification, and Black male suffrage before full readmission.",
    },
    {
      loId: 'apush.reconstruction',
      kind: 'definition',
      title: 'the Reconstruction Amendments (13th/14th/15th)',
      content:
        'The 13th Amendment (ratified Dec. 1865) abolished slavery nationwide; the 14th (ratified 1868) established birthright citizenship and equal protection; the 15th (ratified 1870) prohibited denying the vote based on race — a constitutional foundation Presidential Reconstruction alone had not provided.',
    },
    {
      loId: 'apush.reconstruction',
      kind: 'event',
      title: "the Freedmen's Bureau and Black officeholding",
      content:
        "The federal Freedmen's Bureau (est. 1865) provided food, medical care, legal assistance, education, and labor-contract negotiation for freedpeople. Under Radical Reconstruction, Black men held office in unprecedented numbers, including US Senators Hiram Revels and Blanche K. Bruce of Mississippi.",
    },
    {
      loId: 'apush.reconstruction',
      kind: 'event',
      title: 'the Ku Klux Klan and Redemption',
      content:
        'White supremacist paramilitary groups, most prominently the Ku Klux Klan (founded 1865-66), used violence and intimidation to suppress Black voting and officeholding and attack White Republican allies. Through the 1870s, "Redeemer" Democratic governments used this violence, fraud, and declining Northern political will to retake Southern state governments.',
    },
    {
      loId: 'apush.reconstruction',
      kind: 'event',
      title: 'the Compromise of 1877',
      content:
        'The disputed 1876 election (Hayes vs. Tilden) was resolved by an informal bargain: Hayes received the presidency in exchange for withdrawing remaining federal troops enforcing Reconstruction in the South — effectively ending Reconstruction and enabling Redeemer consolidation and the later Jim Crow system.',
    },
    {
      loId: 'apush.reconstruction',
      kind: 'framework',
      title: "the historiographic debate over Reconstruction's failure (present neutrally)",
      content:
        'An older "Dunning School" interpretation argued Reconstruction failed because it was too radical, corrupt, and imposed on an unwilling South. Later historians (notably Eric Foner\'s "unfinished revolution" framework) substantially revised this, arguing federal enforcement was NOT sustained long enough (including rejecting land redistribution) to protect freedpeople against organized violence — and that the earlier view minimized documented Klan violence and Black political achievement. Present both positions and the revision between them, not a single settled verdict.',
    },
  ],
  methods: [
    {
      title: 'Compare Presidential vs. Congressional Reconstruction requirements',
      when_to_use:
        'Use this whenever a prompt asks you to explain why Reconstruction policy changed after 1865-66, or to evaluate competing Reconstruction visions.',
      steps: [
        'STATE PRESIDENTIAL RECONSTRUCTION\'S REQUIREMENT (loyalty oath only) and what it produced (Black Codes).',
        "STATE WHAT PROVOKED CONGRESS'S RESPONSE (Black Codes, violence against freedpeople, refusal to seat Southern representatives).",
        'STATE CONGRESSIONAL RECONSTRUCTION\'S REQUIREMENTS (14th Amendment ratification, Black male suffrage, military districts) and how they differ.',
        'NAME THE UNDERLYING DISAGREEMENT: does reunion require only restoring the Union minus slavery, or active federal enforcement of Black citizenship and political rights?',
      ],
      example: {
        problem: 'Why did Congress impose stricter Reconstruction requirements than Johnson had, within just a couple of years?',
        solution:
          "Johnson's lenient loyalty-oath-only plan let restored legislatures pass Black Codes resembling the old slave codes; outraged, Congress refused to seat those representatives and instead required 14th Amendment ratification and Black male suffrage under the Reconstruction Acts (1867), reflecting a competing vision that reunion required active federal guarantees, not just restoration.",
      },
      relatedLoIds: ['apush.reconstruction'],
    },
  ],
  pointers: [
    { content: 'The #1 trap: asserting historians agree Reconstruction failed because it was "too radical." Present the Dunning School view AND its later revision (Foner) neutrally.', kind: 'trap' },
    { content: 'Sharecropping is not slavery, but the crop-lien system\'s debt cycles limited freedpeople\'s real economic independence — know both halves of this nuance.', kind: 'tip' },
    { content: 'The 14th Amendment was ratified in 1868, the 15th in 1870 — keep the Reconstruction Amendment dates (13th/1865, 14th/1868, 15th/1870) in strict order.', kind: 'tip' },
    { content: 'The Compromise of 1877 ended Reconstruction by withdrawing troops, not by any single law repealing Reconstruction legislation.', kind: 'tip' },
    { content: 'Black officeholding during Radical Reconstruction was real and significant (Revels, Bruce, state legislatures) — do not describe Reconstruction-era Black political participation as merely symbolic.', kind: 'common-error' },
  ],
};
