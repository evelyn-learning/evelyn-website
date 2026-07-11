/**
 * AP US Government & Politics — CED Unit 1.7-1.9: Relationship Between the
 * States and Federal Government, Constitutional Interpretations of
 * Federalism, and Federalism in Action.
 *
 * Unit-1 Vertical Slice content plan (follows the democratic-ideals
 * calibration template — see ap-apgov-u1-democratic-ideals.ts for the full
 * rationale and docs/superpowers/specs/2026-07-11-ap-us-government-design.md
 * for the shared Passage/rubric infra this plan reuses). Closes out the
 * unit's Federalist 51 "double security" thread from the separation-of-
 * powers lesson: this plan is the federalism half of that argument.
 *
 * Covers enumerated/reserved/concurrent powers, the Tenth and Fourteenth
 * Amendments, the Commerce/Necessary-and-Proper/Supremacy Clauses, the two
 * required Unit-1 cases (McCulloch v. Maryland 1819, US v. Lopez 1995), and
 * categorical vs. block grants.
 *
 * DATA-TABLE STIMULUS (Quantitative Analysis document type): the anchor is
 * evelyn.passage.apgov-federal-grants-table.v1, a text DESCRIPTION of a
 * data table (OMB Historical Tables, Table 12.1), not a literary excerpt —
 * so the worked example restates its figures rather than quoting a
 * continuous span of prose. All figures below are drawn only from that
 * seeded description. Per that passage's own docblock: the DOLLAR column
 * rises monotonically across all four years shown (1990/2000/2010/2019:
 * $256B -> $416B -> $680B -> $692B, constant FY2017 dollars), but the SHARE
 * column does NOT — it peaks in 2010 (10.8% -> 16.0% -> 17.6% -> 16.2%).
 * Nothing below claims the share grew monotonically; only the dollar figure
 * is described that way.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APGOV_U1_FEDERALISM: LessonPlan = {
  // NOTE: id/LO use the "federalism-foundations" slug (not plain
  // "federalism") because the legacy NCSS plan ap-gov-federalism.ts already
  // claims LO `apgov.federalism`, and plansForLoId (portal/adapters.ts)
  // pools plans by LO id with no curriculum scoping — a shared id would mix
  // the legacy item into this Unit-1 sequence.
  id: 'evelyn.ap.apgov.federalism-foundations.v1',
  title: 'U1.7-1.9 Federalism: Powers, Amendments, Clauses & Grants',
  curriculum: 'AP',
  grade: '12',
  subject: 'ss',
  topic: 'ap-us-government',
  locale: 'en',
  los: [
    {
      id: 'apgov.federalism-foundations',
      description:
        'Explain the division of enumerated, reserved, and concurrent powers between national and state governments; the roles of the Tenth and Fourteenth Amendments and the Commerce, Necessary and Proper, and Supremacy Clauses; the holdings of McCulloch v. Maryland (1819) and United States v. Lopez (1995); and the difference between categorical and block grants.',
      standard: 'AP-APGOV-1.7/1.8/1.9',
    },
  ],
  prerequisites: ['apgov.separation-of-powers'],
  followUps: [],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Get the student to see federalism not as an abstract textbook term but as the reason routine things — a school\'s curriculum, a highway\'s speed limit, a state\'s gun laws — get decided in 50 different places instead of one.',
      script:
        "Last lesson closed with a preview: Federalist 51's second paragraph argued that the American system has a \"double security\" — power divided first between the national government and the states, THEN subdivided again among branches within each. We covered the branches-within-each half last time. Today's the other half: how is power actually split between Washington and the 50 state capitals? Here's a concrete way to feel it: your state, not the federal government, sets your public school's curriculum. But your state ALSO can't print its own currency, and it can't tax a legitimate federal bank out of existence — the Supreme Court settled that one over 200 years ago. And when Congress tried to ban guns near schools using its power over interstate commerce, the Supreme Court said Congress had gone too far. Today we map exactly which powers belong to which level of government, and why the boundary keeps ending up in court.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-federalism-powers-clauses-cases',
      kind: 'concept',
      goal: 'Explain enumerated, reserved, and concurrent powers; the Tenth and Fourteenth Amendments; the Commerce, Necessary and Proper, and Supremacy Clauses; McCulloch v. Maryland and US v. Lopez; and categorical vs. block grants.',
      keyIdeas: [
        'FEDERALISM AS THE "DOUBLE SECURITY": recall Federalist 51\'s second paragraph — power is first divided between national and state governments, then subdivided further within each. Federalism means BOTH levels are sovereign in their own defined sphere, not just administrative subdivisions of one central government.',
        'ENUMERATED (EXPRESSED) POWERS: powers explicitly granted to the national government by the Constitution, most listed in Article I, §8 — e.g. coin money, declare war, raise and support armies, regulate interstate and foreign commerce. These belong to the national government specifically because the Constitution names them.',
        'RESERVED POWERS: powers the Constitution neither grants to the national government nor denies to the states are reserved to the states (or the people), per the Tenth Amendment — e.g. establishing public schools, regulating purely intrastate commerce, marriage and family law, running elections, and the general "police power" over health, safety, and welfare.',
        'CONCURRENT POWERS: powers exercised by BOTH levels of government simultaneously — e.g. the power to tax, to borrow money, to establish courts, and to build and maintain roads.',
        'THE TENTH AMENDMENT (1791): "The powers not delegated to the United States by the Constitution, nor prohibited by it to the States, are reserved to the States respectively, or to the people." This is the textual anchor for reserved powers — part of the Bill of Rights promised during the ratification debate covered earlier in this unit.',
        'THE FOURTEENTH AMENDMENT (1868): its DUE PROCESS CLAUSE has, over time, been used by the Supreme Court to apply most Bill of Rights protections against STATE governments too, not just the federal government — a process known as selective incorporation. This gradually shifted the federal-state balance from the Constitution\'s original design, in which the Bill of Rights constrained only the national government. (The Fourteenth Amendment also contains the EQUAL PROTECTION CLAUSE — a separate guarantee that states may not deny any person the equal protection of the laws; it is its own doctrine, not the mechanism of incorporation.)',
        'THREE KEY CLAUSES: the COMMERCE CLAUSE (Article I, §8) grants Congress power to regulate commerce among the states — broad, but not unlimited (see Lopez below); the NECESSARY AND PROPER CLAUSE (the "Elastic Clause," Article I, §8) lets Congress make laws "necessary and proper" for carrying out its enumerated powers — the textual basis for IMPLIED powers not explicitly listed; the SUPREMACY CLAUSE (Article VI) makes the Constitution and valid federal law "the supreme Law of the Land," so a state law that genuinely conflicts with valid federal law must yield.',
        'McCULLOCH V. MARYLAND (1819) — EXPANDED FEDERAL POWER: Congress chartered the Second Bank of the United States, even though banking is not among its enumerated powers. Maryland then tried to tax the Bank\'s Maryland branch. The Supreme Court (Chief Justice Marshall) held (1) Congress had the IMPLIED power to charter the Bank under the Necessary and Proper Clause, and (2) Maryland could NOT tax the Bank, because the Supremacy Clause bars states from taxing or otherwise interfering with a legitimate federal institution. The ruling expanded federal power on both fronts.',
        'UNITED STATES V. LOPEZ (1995) — LIMITED FEDERAL POWER: Congress had passed the Gun-Free School Zones Act, making it a federal crime to carry a gun near a school, justified under the Commerce Clause. The Supreme Court held the Act EXCEEDED Congress\'s commerce power — possessing a gun near a school is not itself economic activity that substantially affects interstate commerce. Lopez was the first major decision in decades to limit the Commerce Clause, confirming that even Congress\'s broadest enumerated power has real limits, and that reserved state powers still matter.',
        'FISCAL FEDERALISM — GRANTS-IN-AID: money the federal government gives to state and local governments, the main modern mechanism for federal influence over state policy short of direct command. CATEGORICAL GRANTS restrict funds to a narrowly defined purpose, usually with conditions or matching-fund requirements attached — more federal control. BLOCK GRANTS fund a broad policy area but leave states more discretion over exactly how to spend it — more state control. Federal MANDATES are requirements imposed on states, sometimes UNFUNDED (states must comply without full federal funding to cover the cost) — a recurring source of federal-state friction.',
      ],
      vocabulary: [
        {
          term: 'federalism',
          definition:
            'the division of governmental power between a national government and state governments, each sovereign within its own constitutional sphere.',
        },
        {
          term: 'enumerated powers',
          definition:
            "powers explicitly granted to the national government by the Constitution, mostly listed in Article I, §8 (e.g. coining money, declaring war, regulating interstate commerce).",
        },
        {
          term: 'reserved powers',
          definition:
            'powers not delegated to the national government nor prohibited to the states, reserved to the states (or the people) under the Tenth Amendment (e.g. education, intrastate commerce).',
        },
        {
          term: 'concurrent powers',
          definition:
            'powers exercised by both the national and state governments simultaneously (e.g. the power to tax, to borrow money, to establish courts).',
        },
        {
          term: 'Commerce Clause',
          definition:
            'Article I, §8 clause granting Congress power to regulate commerce among the states — broad, but limited, per United States v. Lopez (1995), to activity substantially affecting interstate commerce.',
        },
        {
          term: 'Necessary and Proper Clause',
          definition:
            'Article I, §8 clause (the "Elastic Clause") letting Congress make laws necessary and proper to carry out its enumerated powers — the textual basis for implied powers, as upheld in McCulloch v. Maryland (1819).',
        },
        {
          term: 'Supremacy Clause',
          definition:
            'Article VI clause making the Constitution and valid federal law "the supreme Law of the Land," so a conflicting state law must yield — the basis for barring Maryland from taxing the federal Bank in McCulloch v. Maryland.',
        },
        {
          term: 'categorical grant',
          definition:
            'federal grant-in-aid money restricted to a narrowly defined purpose, typically with conditions or matching-fund requirements attached, giving the federal government more influence over how it is spent.',
        },
        {
          term: 'block grant',
          definition:
            'federal grant-in-aid money provided for a broad policy area, giving state governments greater discretion over exactly how to spend it.',
        },
      ],
      passageId: 'evelyn.passage.apgov-federal-grants-table.v1',
      estimatedMinutes: 6,
    },
    {
      id: 'worked-grants-table-trend',
      kind: 'worked_example',
      problem:
        'Analyze this data table on federal grants-in-aid to state and local governments, adapted from the Office of Management and Budget\'s Historical Tables (Table 12.1): total federal grants-in-aid outlays, in billions of constant (inflation-adjusted, fiscal year 2017) dollars, and grants-in-aid outlays as a percentage of total federal outlays, for four selected fiscal years — 1990: $256 billion, 10.8% of federal outlays; 2000: $416 billion, 16.0%; 2010: $680 billion, 17.6%; 2019: $692 billion, 16.2%. A final row breaks fiscal year 2019\'s $692 billion in grant outlays down by type: categorical grants (funds restricted to a narrowly defined purpose, often with matching or compliance requirements) account for approximately $581 billion, or 84% of the total, while block grants (funds for a broad policy area with greater state discretion) account for approximately $111 billion, or 16%. (a) Identify the trend in the DOLLAR AMOUNT of federal grants from 1990 to 2019. (b) Describe the trend in grants\' SHARE of total federal outlays over the same period — is it the same trend as (a)? (c) Draw a conclusion about what the categorical/block breakdown in the final row suggests about how much control the federal government exercises over how states actually spend grant money.',
      steps: [
        'SOURCE IT. A described data table adapted from OMB\'s Historical Tables (Table 12.1), covering four selected fiscal years, 1990-2019, in constant (inflation-adjusted) FY2017 dollars.',
        'READ THE DOLLAR COLUMN — MONOTONIC GROWTH. $256B (1990) -> $416B (2000) -> $680B (2010) -> $692B (2019). This column rises at every single interval shown: real, inflation-adjusted federal grant dollars to states and localities grew across all three decades, though growth clearly slowed in the final decade (+$12B from 2010 to 2019, versus +$160B and +$264B in the two prior decades).',
        'READ THE SHARE COLUMN CAREFULLY — NOT MONOTONIC. 10.8% (1990) -> 16.0% (2000) -> 17.6% (2010) -> 16.2% (2019). This is NOT the same trend as the dollar column: the share of total federal outlays that grants represent PEAKS in 2010, then eases back down by 2019. Do not claim grants\' share of the federal budget "grew the whole time" — only the raw dollar figure did that.',
        'READ THE GRANT-TYPE BREAKDOWN (FY2019 ONLY). Categorical grants ($581B, 84%) dominate block grants ($111B, 16%) by a wide margin — for every dollar of federal grant money reaching states in 2019, roughly 84 cents came with federally defined, narrower conditions attached, and only about 16 cents left more discretion to the state.',
        'DRAW AN ACCURATE CONCLUSION. Federal grants to states have grown substantially in real dollar terms and remain a meaningfully larger share of the federal budget than in 1990, even though that share has eased slightly since its 2010 peak — AND the federal government exercises most of that fiscal influence through CATEGORICAL, not block, grants, meaning Washington retains significant say over how states actually spend the bulk of that money, not just how much of it they receive.',
        'LINK TO THE COURSE THESIS. Grants-in-aid are federalism operating through the budget rather than through constitutional text: the categorical/block balance is itself a policy choice about how much state discretion versus federal control the system should have — the same underlying tension the Commerce Clause, the Necessary and Proper Clause, and cases like McCulloch and Lopez resolve through case law instead of dollars.',
      ],
      answer:
        'The dollar amount of federal grants rose at every interval shown — $256B (1990) -> $416B (2000) -> $680B (2010) -> $692B (2019) — though growth slowed sharply in the final decade. Grants\' SHARE of total federal outlays followed a DIFFERENT trend: it rose from 10.8% to 17.6% between 1990 and 2010, then eased back down to 16.2% by 2019 — its peak was 2010, not 2019, so the dollar and share trends diverge in the last decade. The FY2019 categorical-versus-block breakdown ($581B/84% categorical vs. $111B/16% block) suggests the federal government retains substantial control over HOW states spend the grant money they receive, not just how much of it flows to them, since categorical grants carry narrower federally defined purposes and conditions.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-concept-application',
      kind: 'try_yourself',
      problem:
        'Concept Application practice. A state legislature passes a law setting its own curriculum standards for public K-12 schools. The same year, Congress considers (but does not pass) a bill that would make it a federal crime to carry a firearm within 1,000 feet of any public school nationwide, citing its Commerce Clause power. (a) Identify whether the state\'s curriculum law is an exercise of an enumerated, reserved, or concurrent power, and explain why. (b) Using the reasoning of the Supreme Court\'s decision in United States v. Lopez (1995), explain why a similar federal gun-free-school-zone law might be found to exceed Congress\'s Commerce Clause power. (c) Suppose Congress instead creates a new federal financial-regulation agency — a power not explicitly listed in the Constitution. Explain how the reasoning in McCulloch v. Maryland (1819) supports Congress\'s authority to do this.',
      responseFormat: 'frq',
      rubric: {
        parts: [
          {
            criterionId: 'a',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): correctly identifies the curriculum law as an exercise of a RESERVED power and explains why — education is not among the national government\'s enumerated powers nor prohibited to the states, so it falls to the states under the Tenth Amendment. No credit for identifying enumerated or concurrent, or an identification with no supporting reason.',
            modelResponse:
              "Setting K-12 curriculum standards is an exercise of a reserved power: education is not listed among the national government's enumerated powers in Article I, §8, and nothing in the Constitution prohibits states from regulating it, so under the Tenth Amendment this authority is reserved to the states — which is why curriculum decisions are traditionally made at the state and local level, not by Congress.",
          },
          {
            criterionId: 'b',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains, using Lopez\'s reasoning, that possessing a firearm near a school is not itself an economic activity that substantially affects interstate commerce, so a law criminalizing it under the Commerce Clause alone risks exceeding Congress\'s commerce power. No credit for a response that misstates the Lopez holding or gives no commerce-based reasoning.',
            modelResponse:
              "Under the reasoning of United States v. Lopez (1995), possessing a firearm near a school is not itself an economic activity, and it does not substantially affect interstate commerce merely because guns or schools might be tangentially connected to commerce somewhere in the chain of reasoning. Because the Commerce Clause only reaches activity that substantially affects interstate commerce, a similar federal law resting solely on that power would likely be found to exceed Congress's commerce authority, just as the actual Gun-Free School Zones Act was struck down.",
          },
          {
            criterionId: 'c',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains, using McCulloch\'s reasoning, that Congress has implied powers under the Necessary and Proper Clause to create institutions not explicitly enumerated, as long as they are a reasonable means of carrying out an enumerated power. No credit for a response that omits the Necessary and Proper Clause / implied-powers reasoning.',
            modelResponse:
              "McCulloch v. Maryland (1819) established that Congress has IMPLIED powers under the Necessary and Proper Clause to create institutions that are not explicitly listed in Article I, §8, as long as they are a reasonable means of carrying out a power the Constitution does grant — such as regulating commerce or currency. By that same reasoning, a new federal financial-regulation agency, though not itself an enumerated power, could be constitutionally justified as a necessary and proper means of exercising Congress's enumerated economic powers, just as the Court upheld Congress's implied power to charter the Second Bank of the United States despite banking not being enumerated.",
          },
        ],
      },
      estimatedMinutes: 5,
    },
    {
      id: 'misconception-mcculloch-limited-power',
      kind: 'misconception_check',
      question:
        'True or false: the Supreme Court\'s decision in McCulloch v. Maryland (1819) LIMITED the federal government\'s power by ruling that Congress could not create institutions, like a national bank, that are not explicitly listed among its enumerated powers.',
      commonErrors: [
        {
          answer: 'true',
          misconception:
            "Assuming any famous federalism case must have restrained federal power, and confusing McCulloch's actual holding (implied powers upheld) with the OPPOSITE holding of a later, genuinely power-limiting case like United States v. Lopez (1995).",
          correctsTo:
            'FALSE — McCulloch v. Maryland did the opposite: it EXPANDED federal power. The Supreme Court (Chief Justice John Marshall) held that Congress DID have the authority to charter the Second Bank of the United States, even though banking is not among its enumerated powers, because the Necessary and Proper Clause gives Congress IMPLIED powers to use reasonable means for carrying out its enumerated powers. The Court also ruled that Maryland could NOT tax the federal Bank, because the Supremacy Clause prevents states from taxing or interfering with legitimate federal institutions. So McCulloch broadened federal authority on two fronts at once: it validated implied powers, and it limited what states can do to interfere with valid federal action. The case that actually LIMITS federal power in this unit is United States v. Lopez (1995), which struck down a federal law for exceeding the Commerce Clause — don\'t mix the two holdings up.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Enumerated powers belong to the national government explicitly (Article I, §8); reserved powers belong to the states via the Tenth Amendment; concurrent powers (like taxing) are exercised by both levels at once.',
        'Three key clauses: the Commerce Clause (interstate commerce), the Necessary and Proper Clause (implied powers), and the Supremacy Clause (valid federal law wins over conflicting state law).',
        'McCulloch v. Maryland (1819) EXPANDED federal power: it upheld Congress\'s implied power to charter a national bank and barred Maryland from taxing it under the Supremacy Clause. United States v. Lopez (1995) LIMITED federal power: it struck down the Gun-Free School Zones Act because carrying a gun near a school is not itself commerce.',
        'The Fourteenth Amendment\'s Due Process Clause has gradually applied most Bill of Rights protections against the states too (selective incorporation), reshaping the federal-state balance over time — its Equal Protection Clause is a separate, distinct guarantee, not the incorporation mechanism.',
        'In the described 1990-2019 grants table, real grant DOLLARS rose every interval ($256B -> $692B), but grants\' SHARE of federal outlays peaked in 2010 (17.6%) and eased by 2019 (16.2%) — don\'t conflate the two trends. Categorical grants ($581B, 84%) dominate block grants ($111B, 16%) in FY2019, meaning the federal government keeps significant control over how that money gets spent.',
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '1',
    cedTopic: '1.7-1.9',
    cedTitle: 'Federalism: Powers, Amendments, Clauses & Grants',
    sources: [
      { type: 'plan', source: 'AP Plans Initiative — AP US Government & Politics' },
      {
        type: 'passage',
        book: 'evelyn.passage.apgov-federal-grants-table.v1',
        chapter: '1990-2019',
        note: 'Described data table (OMB Historical Tables, Table 12.1) — federal grants-in-aid outlays and categorical/block breakdown; anchor for the concept and worked example.',
      },
    ],
  },
};
