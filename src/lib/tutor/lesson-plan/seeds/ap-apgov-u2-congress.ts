/**
 * AP US Government & Politics — CED Unit 2.1-2.3: Congress — Structure,
 * Powers, and Behavior.
 *
 * Unit-2 Vertical Slice content plan (follows the Unit-1 calibration
 * template — see ap-apgov-u1-federalism.ts and
 * ap-apgov-u1-separation-of-powers.ts for the shared Passage/rubric infra
 * this plan reuses). Opens Unit 2's institutional walk across the three
 * branches, picking up directly from Unit 1's separation-of-powers lesson:
 * this plan is the "legislative branch in practice" half of that structural
 * map.
 *
 * Covers bicameralism, the House/Senate procedural differences (filibuster
 * and cloture, the House Rules Committee, Senate unanimous consent),
 * committees and leadership, how a bill becomes law, congressional
 * oversight, the trustee/delegate/politico models of representation, and
 * apportionment/gerrymandering — including the two required cases Baker v.
 * Carr (1962, reapportionment justiciable under the 14th Amendment's Equal
 * Protection Clause, "one person, one vote") and Shaw v. Reno (1993, race
 * cannot be the predominant factor in redistricting without triggering
 * strict scrutiny).
 *
 * DATA-TABLE STIMULUS (Quantitative Analysis document type): the anchor is
 * evelyn.passage.apgov-congress-demographics-table.v1, a text DESCRIPTION
 * of a CRS data table (Report R43244) on women serving in Congress,
 * 1961-2021 — not a literary excerpt, so the worked example restates its
 * figures rather than quoting continuous prose. Per that passage's own
 * docblock, all four year figures (1961: 20; 1981: 23; 2001: 74; 2021: 147)
 * and the 50.8%-of-population comparison are real published CRS/Census
 * figures; growth is NOT linear — it is slight from 1961-1981, then
 * accelerates sharply after the 1990s. Nothing below claims a different
 * shape than that.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APGOV_U2_CONGRESS: LessonPlan = {
  id: 'evelyn.ap.apgov.congress-structure.v1',
  title: 'U2.1-2.3 Congress: Structure, Powers & Behavior',
  curriculum: 'AP',
  grade: '12',
  subject: 'ss',
  topic: 'ap-us-government',
  locale: 'en',
  los: [
    {
      id: 'apgov.congress-structure',
      description:
        'Explain bicameralism and the procedural differences between the House and Senate (filibuster/cloture, the Rules Committee, unanimous consent); the roles of committees and leadership; how a bill becomes law; congressional oversight; the trustee, delegate, and politico models of representation; and apportionment and gerrymandering, including the holdings of Baker v. Carr (1962) and Shaw v. Reno (1993).',
      standard: 'AP-APGOV-2.1/2.2/2.3',
    },
  ],
  prerequisites: ['apgov.separation-of-powers'],
  followUps: ['apgov.presidency-power'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Get the student to see Congress\'s internal rules — not just the Constitution\'s text — as the reason the House and Senate behave so differently, and to see redistricting fights as a recurring, high-stakes consequence of how House seats get apportioned.',
      script:
        "Last unit closed with the Constitution splitting power across three branches. Today we go inside the first one: Congress. Here's a puzzle — the House and Senate are both \"the legislature,\" but they behave completely differently. A single senator can talk a bill to death for hours unless 60 of the 100 senators vote to stop her. In the House, with 435 members, that would be chaos — so the House simply doesn't allow it. Why the difference? It's not really in the Constitution — it's each chamber's own procedural rules. And every ten years, after the census, states redraw their House district lines — and those lines have ended up in the Supreme Court more than once, over questions like: does every voter's vote have to count equally, and can a state draw a district's shape mainly to sort voters by race? Today we map Congress's structure, how a bill actually becomes law, and why redistricting keeps landing in court.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-congress-structure-powers-behavior',
      kind: 'concept',
      goal: 'Explain bicameralism, House/Senate procedural differences, committees and leadership, the legislative process, oversight, representation models, and apportionment/gerrymandering including Baker v. Carr and Shaw v. Reno.',
      keyIdeas: [
        'BICAMERALISM: Congress is divided into two chambers — the House of Representatives (435 voting members, apportioned to states by population, two-year terms) and the Senate (100 members, two per state regardless of population, six-year staggered terms). This split was itself a ratification-era compromise between large and small states.',
        'HOUSE VS. SENATE PROCEDURE — THE FILIBUSTER AND CLOTURE: the filibuster is a SENATE-ONLY tradition of extended debate used to delay or block a vote on a bill or nomination; it exists nowhere in the Constitution\'s text — it is a product of Senate rules. CLOTURE is the Senate\'s procedure for ENDING debate and forcing a vote, requiring three-fifths (60) of senators for most legislation. The House has no equivalent — with 435 members, unlimited debate would make the chamber unworkable.',
        'HOUSE VS. SENATE PROCEDURE — THE RULES COMMITTEE AND UNANIMOUS CONSENT: the House RULES COMMITTEE controls the flow of legislation to the floor, setting time limits on debate and which amendments (if any) may be offered — a powerful gatekeeping tool available because the House is large and needs tight control to function. The Senate has no equivalent gatekeeping committee; instead it typically moves bills via UNANIMOUS CONSENT agreements, negotiated arrangements that set terms for debate and votes only if literally no senator objects — a single senator can hold up business by withholding consent.',
        'COMMITTEES AND LEADERSHIP: most legislative work happens in STANDING COMMITTEES (permanent, subject-specific — e.g. Ways and Means, Armed Services), which hold hearings, mark up bills, and decide whether a bill advances at all. Chamber LEADERSHIP — the Speaker of the House (elected by the majority party, sets the legislative agenda, refers bills to committee) and the Senate Majority Leader (schedules floor votes, though with less unilateral control than the Speaker given Senate rules like the filibuster) — steers each chamber\'s priorities.',
        'HOW A BILL BECOMES LAW: introduction (in either chamber, except revenue bills, which must originate in the House per Article I, §7) → committee referral, hearings, and markup → floor debate and vote in that chamber → the SAME process in the other chamber → if the two chambers pass different versions, a CONFERENCE COMMITTEE reconciles them into one bill → both chambers must approve the reconciled bill → the President signs it into law, vetoes it, or (per the checks-and-balances lesson) lets it become law without a signature or pocket-vetoes it.',
        'CONGRESSIONAL OVERSIGHT: Congress\'s ongoing power to monitor and check how the executive branch and its agencies implement laws — through committee hearings, investigations, subpoenas for testimony/documents, and the confirmation process for major appointments. Oversight is how Congress polices the bureaucracy and the executive between elections, not just at bill-passage time.',
        'MODELS OF REPRESENTATION: the TRUSTEE model holds that a representative should use their own independent judgment about what is best for constituents, even against constituents\' stated wishes; the DELEGATE model holds that a representative should vote according to what constituents explicitly want, setting aside personal judgment; the POLITICO model blends the two — acting as a delegate on high-salience issues constituents care intensely about, and as a trustee on more technical or lower-visibility matters.',
        'APPORTIONMENT: the process of dividing the House\'s 435 seats among the states based on population, recalculated after each decennial census — a state\'s population growth or decline relative to other states can gain or cost it House seats. REDISTRICTING then draws the actual district lines within a state to match its new seat allocation.',
        'GERRYMANDERING: drawing district lines to advantage a particular party or group — e.g. "packing" opposition voters into few districts to waste their votes, or "cracking" them across many districts so they never form a majority anywhere.',
        'BAKER V. CARR (1962) — REAPPORTIONMENT IS JUSTICIABLE: for decades, some states left district lines unchanged despite huge population shifts, so rural districts had far fewer voters per representative than urban ones. The Supreme Court held that malapportionment claims ARE justiciable — federal courts CAN hear and decide them — under the 14th Amendment\'s Equal Protection Clause, opening the door to the "one person, one vote" principle: districts within a state must have roughly equal populations.',
        'SHAW V. RENO (1993) — RACE CANNOT BE THE PREDOMINANT FACTOR: North Carolina drew an unusually shaped congressional district explicitly to create a second majority-Black district. The Supreme Court held that when race is the PREDOMINANT factor in drawing a district\'s lines — overriding traditional districting principles like compactness and contiguity — the plan is subject to STRICT SCRUTINY under the Equal Protection Clause. Race-conscious districting is not automatically forbidden, but it cannot simply override traditional criteria without a compelling justification that survives strict scrutiny.',
      ],
      vocabulary: [
        {
          term: 'bicameralism',
          definition:
            'a legislature divided into two chambers — for Congress, the House of Representatives (population-based) and the Senate (two per state).',
        },
        {
          term: 'filibuster',
          definition:
            'a Senate-only tradition of extended debate used to delay or block a vote; not in the Constitution\'s text, ended only by cloture.',
        },
        {
          term: 'cloture',
          definition:
            "the Senate procedure for ending debate and forcing a vote, requiring three-fifths (60) of senators for most legislation.",
        },
        {
          term: 'Rules Committee',
          definition:
            'the House committee that controls debate time and amendment rules for bills reaching the floor — the House\'s main gatekeeping tool given its large size.',
        },
        {
          term: 'apportionment',
          definition:
            "the process of dividing the House's 435 seats among the states by population after each decennial census.",
        },
        {
          term: 'gerrymandering',
          definition:
            'drawing legislative district lines to advantage a particular party or group, e.g. by "packing" or "cracking" opposition voters.',
        },
        {
          term: 'trustee model',
          definition:
            'a model of representation in which the representative uses independent judgment about constituents\' best interests, even against their stated wishes.',
        },
        {
          term: 'delegate model',
          definition:
            "a model of representation in which the representative votes according to constituents' explicitly stated wishes.",
        },
      ],
      passageId: 'evelyn.passage.apgov-congress-demographics-table.v1',
      estimatedMinutes: 6,
    },
    {
      id: 'worked-congress-demographics-trend',
      kind: 'worked_example',
      problem:
        'Analyze this data table on women serving in the U.S. Congress, adapted from a Congressional Research Service report (CRS Report R43244): the total number of women in Congress (House and Senate combined, out of 535 voting Members) was 20 in 1961 (87th Congress: 18 House, 2 Senate); 23 in 1981 (97th Congress: 21 House, 2 Senate); 74 in 2001 (107th Congress: 60 House, 14 Senate); and 147 in 2021 (117th Congress, as of June 2021: 123 House, 24 Senate). A comparison row reports that, per the U.S. Census Bureau, women made up approximately 50.8% of the total U.S. population as of the 2020 Census. (a) Describe the trend in the number of women serving in Congress from 1961 to 2021 — was growth steady across all four periods, or did its pace change? (b) Compare women\'s 2021 share of Congress\'s 535 voting seats to their share of the U.S. population, and state what that comparison shows. (c) Draw a conclusion connecting this data to the chapter on apportionment and representation: does a rising number of women elected to Congress, by itself, guarantee that Congress\'s membership matches the population it represents?',
      steps: [
        'SOURCE IT. A described data table adapted from a Congressional Research Service report (CRS Report R43244), covering four selected Congresses, 1961-2021, with a Census Bureau comparison figure.',
        'READ THE TREND — NOT A STEADY CLIMB. 20 (1961) -> 23 (1981) -> 74 (2001) -> 147 (2021). Growth was SLIGHT in the first two decades shown (just +3 seats from 1961 to 1981), then accelerated sharply after the 1990s — more than tripling from 1981 to 2001 (23 to 74) and nearly doubling again from 2001 to 2021 (74 to 147). Don\'t describe this as one uniform rate of growth across all four points — the pace clearly changed.',
        'COMPUTE THE 2021 SHARE OF CONGRESS. 147 women served in Congress overall in 2021 — a congressional share of about 27%.',
        'COMPARE TO THE POPULATION SHARE. Women were approximately 50.8% of the U.S. population per the 2020 Census. 27% (Congress) is far below 50.8% (population) — even at this table\'s highest data point, women remain significantly underrepresented in Congress relative to their share of the country\'s population.',
        'DRAW AN ACCURATE CONCLUSION. Women\'s numeric presence in Congress has grown substantially since 1961, especially after the 1990s — but that growth, by itself, has not closed the gap between Congress\'s membership and the population\'s makeup. Rising numbers over time and demographic proportionality are two different things; one can improve markedly while the other still falls well short.',
        'LINK TO THE COURSE THESIS. Who gets elected to Congress is shaped not just by how many candidates run, but by how districts are apportioned and drawn — the same institutional machinery (apportionment after the census, redistricting, and disputes over district lines like Baker v. Carr and Shaw v. Reno) shapes which voters, and which candidates, get real electoral opportunities in the first place.',
      ],
      answer:
        'The number of women in Congress grew only slightly from 1961 to 1981 (20 to 23), then accelerated sharply afterward — more than tripling by 2001 (74) and nearly doubling again by 2021 (147); the pace of growth was NOT steady across the whole period. In 2021, women held about 27% of Congress\'s 535 voting seats, far below their approximately 50.8% share of the U.S. population per the 2020 Census — meaning women remain significantly underrepresented in Congress even at this table\'s high point. The conclusion: a rising number of women elected over time does not, by itself, guarantee that Congress\'s composition matches the population\'s — which connects directly to how apportionment and redistricting shape who has a realistic path to a House or Senate seat in the first place.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-concept-application',
      kind: 'try_yourself',
      problem:
        "Concept Application practice. A state's legislature is redrawing its congressional district lines after the decennial census reapportionment. (a) Explain how the number of U.S. House seats a state receives differs from the number of U.S. Senate seats it receives, and identify the constitutional design that accounts for the difference. (b) A voter in a district with a much larger population than other districts in the same state sues, arguing the districts violate equal representation. Explain how the Supreme Court's holding in Baker v. Carr (1962) applies to this dispute. (c) The state's new map also includes one oddly shaped, winding district drawn explicitly to concentrate voters of one race into a single district. Explain how the Supreme Court's holding in Shaw v. Reno (1993) applies to this second dispute.",
      responseFormat: 'frq',
      rubric: {
        parts: [
          {
            criterionId: 'a',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): correctly explains that House seats are apportioned by population (reapportioned each decade, at least one per state, 435 total) while Senate seats are fixed at two per state regardless of population, and identifies this as the bicameral, large-state/small-state compromise. No credit for a response that omits the population-vs-fixed distinction.',
            modelResponse:
              "House seats are apportioned to states based on population and reapportioned after each census, while every state gets exactly two Senate seats regardless of its population. This reflects the bicameral compromise reached during the Constitution's drafting: the House represents states proportionally by population (favoring larger states), while the Senate gives every state equal footing (favoring smaller states).",
          },
          {
            criterionId: 'b',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains that Baker v. Carr held malapportionment claims are justiciable under the 14th Amendment\'s Equal Protection Clause, establishing "one person, one vote" — districts within a state must have roughly equal populations. No credit for a response that misstates the holding or omits the justiciability/Equal Protection point.',
            modelResponse:
              "Baker v. Carr (1962) held that claims about unequal district populations are justiciable — meaning federal courts can hear and decide them — under the 14th Amendment's Equal Protection Clause. This established the 'one person, one vote' principle: districts within a state must have roughly equal populations so that no voter's vote counts for meaningfully more than another's, which directly supports this voter's claim.",
          },
          {
            criterionId: 'c',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains that Shaw v. Reno held race cannot be the predominant factor in drawing district lines without triggering strict scrutiny under the Equal Protection Clause. No credit for a response that claims race-based districting is automatically illegal or omits the strict-scrutiny standard.',
            modelResponse:
              "Shaw v. Reno (1993) held that when race is the PREDOMINANT factor in drawing a district's boundaries — overriding traditional districting principles like compactness — the plan must survive strict scrutiny under the Equal Protection Clause. A district drawn with an unusual, winding shape explicitly to sort voters by race would trigger this heightened judicial review, though it is not automatically unconstitutional without that scrutiny being applied.",
          },
        ],
      },
      estimatedMinutes: 5,
    },
    {
      id: 'misconception-filibuster-constitution',
      kind: 'misconception_check',
      question:
        'True or false: the Senate filibuster — a senator\'s ability to hold the floor and delay a vote — is a power explicitly granted by the U.S. Constitution.',
      commonErrors: [
        {
          answer: 'true',
          misconception:
            'Assuming that any long-standing, high-profile legislative procedure must be written into the Constitution\'s text, rather than recognizing it as an internal chamber rule that the chamber itself created and can change.',
          correctsTo:
            "FALSE. The filibuster is NOT in the Constitution — it is a Senate RULE, a tradition that grew out of the Senate's own procedures for unlimited debate. The Constitution says nothing about extended debate or a supermajority requirement to end it. Cloture — the actual procedure for ending debate and forcing a vote, requiring three-fifths (60) of senators for most legislation — is also a Senate rule, not a constitutional requirement. Because the filibuster exists only by Senate rule, the Senate itself can (and periodically does) change how it applies, for example by altering cloture requirements for certain kinds of votes such as nominations. The House has no filibuster at all, precisely because its much larger membership makes unlimited debate unworkable.",
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Bicameralism: the House (435 seats, apportioned by population) and Senate (100 seats, two per state) — a large-state/small-state compromise. The filibuster and cloture (60 votes to end debate) are SENATE-ONLY rules, not in the Constitution; the House instead uses its Rules Committee to control debate.',
        'How a bill becomes law: introduction → committee (hearings, markup) → floor vote in one chamber → the same in the other chamber → conference committee if versions differ → both chambers approve → the President signs, vetoes, or lets it become law/pocket-vetoes it.',
        'Trustee model = representative\'s own judgment; delegate model = constituents\' explicit wishes; politico model = a blend, depending on the issue\'s salience.',
        'Apportionment (dividing House seats by population after the census) and redistricting (drawing the lines) shape who actually gets elected — separate from how many candidates run.',
        'Baker v. Carr (1962): malapportionment claims ARE justiciable under the 14th Amendment\'s Equal Protection Clause — "one person, one vote." Shaw v. Reno (1993): race cannot be the PREDOMINANT factor in redistricting without triggering strict scrutiny.',
        'In the described 1961-2021 CRS data, the number of women in Congress grew only slightly through 1981, then accelerated sharply — but even at its 2021 high (about 27% of seats), it remained far below women\'s roughly 50.8% share of the U.S. population.',
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '2',
    cedTopic: '2.1-2.3',
    cedTitle: 'Congress: Structure, Powers & Behavior',
    sources: [
      { type: 'plan', source: 'AP Plans Initiative — AP US Government & Politics' },
      {
        type: 'passage',
        book: 'evelyn.passage.apgov-congress-demographics-table.v1',
        chapter: '1961-2021',
        note: 'Described data table (CRS Report R43244) — women serving in Congress vs. their share of the U.S. population; anchor for the concept and worked example.',
      },
    ],
  },
};
