/**
 * AP US Government & Politics — CED Unit 1.7-1.9: Relationship Between the
 * States and Federal Government, Constitutional Interpretations of
 * Federalism, and Federalism in Action.
 *
 * Hand-authored baseline mirroring the lesson plan
 * `evelyn.ap.apgov.federalism-foundations.v1` (id renamed in review; this
 * file keeps the `ap-apgov-u1-federalism` slug for consistency with the
 * plan's source file name). Covers enumerated/reserved/concurrent powers,
 * the Tenth and Fourteenth Amendments, the Commerce/Necessary-and-Proper/
 * Supremacy Clauses, the two required Unit-1 cases (McCulloch v. Maryland
 * 1819, United States v. Lopez 1995), and categorical vs. block grants.
 *
 * Incorporation note: the Fourteenth Amendment's DUE PROCESS CLAUSE is the
 * incorporation mechanism. Its EQUAL PROTECTION CLAUSE is a separate
 * doctrine — do not conflate the two (this was a reviewed correction in
 * the source lesson plan; do not reintroduce the error here).
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_APGOV_FEDERALISM: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.apgov.federalism-foundations.v1',
  course: 'AP US Government & Politics',
  cedUnit: 1,
  cedTopic: '1.7-1.9',
  cedTitle: 'Federalism: Powers, Amendments, Clauses & Grants',
  planId: 'evelyn.ap.apgov.federalism-foundations.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-11',
  sources: [{ type: 'plan', planId: 'evelyn.ap.apgov.federalism-foundations.v1' }],
  theory: [
    {
      loId: 'apgov.federalism-foundations',
      kind: 'definition',
      title: 'federalism',
      content:
        'The division of governmental power between a national government and state governments, each sovereign within its own constitutional sphere. Recall Federalist 51\'s "double security": power is first divided between national and state governments, then subdivided further within each — federalism is the national/state half of that argument.',
    },
    {
      loId: 'apgov.federalism-foundations',
      kind: 'concept',
      title: 'enumerated, reserved, and concurrent powers',
      content:
        'ENUMERATED (expressed) powers are granted explicitly to the national government, mostly listed in Article I, §8 (coin money, declare war, regulate interstate commerce). RESERVED powers — those the Constitution neither grants to the national government nor denies to the states — belong to the states (or the people) per the Tenth Amendment (e.g. public education, intrastate commerce, marriage/family law, the general police power). CONCURRENT powers are exercised by BOTH levels simultaneously (e.g. the power to tax, to borrow money, to establish courts).',
    },
    {
      loId: 'apgov.federalism-foundations',
      kind: 'definition',
      title: 'reserved powers (Tenth Amendment)',
      content:
        'The Tenth Amendment (1791): "The powers not delegated to the United States by the Constitution, nor prohibited by it to the States, are reserved to the States respectively, or to the people." The textual anchor for reserved powers — part of the Bill of Rights promised during the ratification debate.',
    },
    {
      loId: 'apgov.federalism-foundations',
      kind: 'framework',
      title: 'three key clauses',
      content:
        'The COMMERCE CLAUSE (Article I, §8) grants Congress power to regulate commerce among the states — broad, but not unlimited (see Lopez below). The NECESSARY AND PROPER CLAUSE (the "Elastic Clause," Article I, §8) lets Congress make laws "necessary and proper" for carrying out its enumerated powers — the textual basis for IMPLIED powers. The SUPREMACY CLAUSE (Article VI) makes the Constitution and valid federal law "the supreme Law of the Land," so a state law that genuinely conflicts with valid federal law must yield.',
    },
    {
      loId: 'apgov.federalism-foundations',
      kind: 'event',
      title: 'McCulloch v. Maryland (1819) — expanded federal power',
      content:
        "Congress chartered the Second Bank of the United States, though banking is not among its enumerated powers; Maryland then tried to tax the Bank's Maryland branch. The Supreme Court (Chief Justice Marshall) held: (1) Congress had the IMPLIED power to charter the Bank under the Necessary and Proper Clause, and (2) Maryland could NOT tax the Bank, because the Supremacy Clause bars states from taxing or interfering with a legitimate federal institution. Expanded federal power on both fronts.",
    },
    {
      loId: 'apgov.federalism-foundations',
      kind: 'event',
      title: 'United States v. Lopez (1995) — limited federal power',
      content:
        "Congress had passed the Gun-Free School Zones Act, making it a federal crime to carry a gun near a school, justified under the Commerce Clause. The Supreme Court held the Act EXCEEDED Congress's commerce power — possessing a gun near a school is not itself economic activity that substantially affects interstate commerce. The first major decision in decades to limit the Commerce Clause; confirms even Congress's broadest enumerated power has real limits.",
    },
    {
      loId: 'apgov.federalism-foundations',
      kind: 'concept',
      title: 'Fourteenth Amendment: Due Process Clause → selective incorporation',
      content:
        "The Fourteenth Amendment's (1868) DUE PROCESS CLAUSE has, over time, been used by the Supreme Court to apply most Bill of Rights protections against STATE governments too, not just the federal government — a process called selective incorporation. This gradually shifted the federal-state balance from the Constitution's original design, in which the Bill of Rights constrained only the national government. The Fourteenth Amendment ALSO contains the EQUAL PROTECTION CLAUSE, but that is a separate guarantee (states may not deny equal protection of the laws) — it is its own doctrine, NOT the incorporation mechanism. Do not attribute incorporation to Equal Protection.",
    },
    {
      loId: 'apgov.federalism-foundations',
      kind: 'definition',
      title: 'categorical grant',
      content:
        'Federal grant-in-aid money restricted to a narrowly defined purpose, typically with conditions or matching-fund requirements attached — gives the federal government MORE influence over how the money is spent.',
    },
    {
      loId: 'apgov.federalism-foundations',
      kind: 'definition',
      title: 'block grant',
      content:
        'Federal grant-in-aid money provided for a broad policy area, giving state governments GREATER discretion over exactly how to spend it — the opposite end of the control spectrum from a categorical grant. (Federal mandates — sometimes UNFUNDED — are a related, distinct mechanism: requirements imposed on states without full federal funding to cover the cost.)',
    },
    {
      loId: 'apgov.federalism-foundations',
      kind: 'event',
      title: 'federal grants-in-aid data table (OMB Historical Tables, 1990-2019)',
      content:
        'DOLLAR amount of federal grants (constant FY2017 dollars) rose at EVERY interval shown: $256B (1990) -> $416B (2000) -> $680B (2010) -> $692B (2019), though growth slowed sharply in the final decade. Grants\' SHARE of total federal outlays followed a DIFFERENT trend — NOT monotonic: 10.8% (1990) -> 16.0% (2000) -> 17.6% (2010) -> 16.2% (2019), peaking in 2010 and easing by 2019. In FY2019, categorical grants ($581B, 84%) dominate block grants ($111B, 16%), meaning the federal government retains substantial control over how most of that money is spent.',
    },
    {
      loId: 'apgov.federalism-foundations',
      kind: 'trap',
      title: "don't reverse McCulloch and Lopez",
      content:
        "McCulloch v. Maryland (1819) EXPANDED federal power (upheld implied powers; barred state taxation of a federal institution). United States v. Lopez (1995) LIMITED federal power (struck down a law exceeding the Commerce Clause). These are opposite holdings — assuming any famous federalism case must restrain federal power is the most common way to mix them up.",
    },
  ],
  methods: [
    {
      title: 'Apply McCulloch or Lopez to a new federal-power scenario',
      when_to_use:
        'Use this whenever a prompt describes a new federal action (creating an agency, regulating an activity) and asks whether it is constitutionally justified.',
      steps: [
        'IDENTIFY WHETHER THE ACTION IS ENUMERATED, IMPLIED, OR BEYOND FEDERAL REACH. If it is not explicitly enumerated, ask whether it is a "necessary and proper" means of carrying out an enumerated power (McCulloch\'s implied-powers logic).',
        'IF THE ACTION RESTS ON THE COMMERCE CLAUSE, apply Lopez\'s test: is the regulated activity itself economic activity that substantially affects interstate commerce? If not, the action risks exceeding Congress\'s commerce power.',
        'STATE THE RELEVANT CASE\'S HOLDING PRECISELY before applying it — McCulloch upheld implied powers and barred state interference with valid federal action; Lopez struck down a law for lacking a substantial connection to interstate commerce.',
        'DRAW THE PARALLEL EXPLICITLY, connecting the new scenario\'s facts to the case\'s reasoning, not just its outcome.',
      ],
      example: {
        problem:
          'Congress creates a new federal financial-regulation agency, a power not explicitly listed in the Constitution. Is this constitutionally justified?',
        solution:
          "Yes, under McCulloch v. Maryland's (1819) reasoning: Congress has IMPLIED powers under the Necessary and Proper Clause to create institutions not explicitly enumerated, as long as they are a reasonable means of carrying out an enumerated power (e.g. regulating commerce or currency) — just as the Court upheld Congress's implied power to charter the Second Bank despite banking not being enumerated.",
      },
      relatedLoIds: ['apgov.federalism-foundations'],
    },
    {
      title: 'Read a federalism data table: separate the dollar trend from the share trend',
      when_to_use:
        'Use this whenever a prompt gives a data table or described table with both a raw-dollar column and a percentage-of-total column across the same years.',
      steps: [
        'READ EACH COLUMN SEPARATELY before drawing any conclusion — a raw dollar figure and its percentage share of a larger total can move in DIFFERENT directions.',
        'CHECK WHETHER A TREND IS MONOTONIC (rises or falls at every interval) or PEAKS/DIPS partway through — state which one it is explicitly rather than assuming both columns move the same way.',
        'IF THE TABLE BREAKS A TOTAL DOWN BY TYPE (e.g. categorical vs. block), use that breakdown to answer a DIFFERENT question than the trend columns — usually about WHO controls how the money is used, not how much of it there is.',
        'DRAW A CONCLUSION THAT ONLY USES WHAT THE TABLE SHOWS — do not extrapolate a cause the table itself doesn\'t state.',
      ],
      example: {
        problem:
          'Federal grant dollars rose every interval from 1990-2019, but grants\' share of federal outlays peaked in 2010 and eased by 2019. What conclusion follows?',
        solution:
          'The dollar and share trends diverge in the final decade: real grant dollars kept rising, but grants became a slightly SMALLER slice of the federal budget after 2010 than at their peak — a careful reader reports both trends separately rather than assuming one implies the other.',
      },
      relatedLoIds: ['apgov.federalism-foundations'],
    },
  ],
  pointers: [
    { content: 'McCulloch v. Maryland (1819) EXPANDED federal power; United States v. Lopez (1995) LIMITED it. This reversal is the #1 tested misconception for this topic.', kind: 'trap' },
    { content: 'Incorporation runs through the Fourteenth Amendment\'s DUE PROCESS CLAUSE, not the Equal Protection Clause — the two are separate doctrines. Don\'t conflate them.', kind: 'trap' },
    { content: 'Categorical grants = narrow purpose + conditions/matching funds = more FEDERAL control. Block grants = broad purpose = more STATE discretion.', kind: 'tip' },
    { content: 'On a data table, check the dollar-amount trend and the percentage-share trend separately — they can diverge (e.g. dollars rise every year while share peaks partway through).', kind: 'tip' },
    { content: 'To classify a power as enumerated/reserved/concurrent, ask: does the Constitution explicitly grant this to the national government? If yes and only the national government exercises it, enumerated. If neither granted nor prohibited, reserved to the states. If both levels do it, concurrent.', kind: 'tip' },
  ],
};
