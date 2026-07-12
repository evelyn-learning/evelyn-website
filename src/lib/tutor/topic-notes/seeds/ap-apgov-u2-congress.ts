/**
 * AP US Government & Politics — CED Unit 2.1-2.3: Congress — Structure,
 * Powers, and Behavior.
 *
 * Hand-authored baseline mirroring the lesson plan
 * `evelyn.ap.apgov.congress-structure.v1`. Covers bicameralism, the
 * House/Senate procedural differences (filibuster/cloture, the Rules
 * Committee, unanimous consent), committees and leadership, how a bill
 * becomes law, congressional oversight, the trustee/delegate/politico
 * models of representation, apportionment/gerrymandering, and the two
 * required cases: Baker v. Carr (1962) and Shaw v. Reno (1993).
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_APGOV_CONGRESS_STRUCTURE: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.apgov.congress-structure.v1',
  course: 'AP US Government & Politics',
  cedUnit: 2,
  cedTopic: '2.1-2.3',
  cedTitle: 'Congress: Structure, Powers & Behavior',
  planId: 'evelyn.ap.apgov.congress-structure.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-11',
  sources: [{ type: 'plan', planId: 'evelyn.ap.apgov.congress-structure.v1' }],
  theory: [
    {
      loId: 'apgov.congress-structure',
      kind: 'definition',
      title: 'bicameralism',
      content:
        'A legislature divided into two chambers. Congress\'s two chambers are the House of Representatives (435 voting members, apportioned to states by population, two-year terms) and the Senate (100 members, two per state regardless of population, six-year staggered terms) — itself a ratification-era compromise between large and small states.',
    },
    {
      loId: 'apgov.congress-structure',
      kind: 'definition',
      title: 'cloture',
      content:
        'The Senate procedure for ENDING debate and forcing a vote, requiring three-fifths (60) of senators for most legislation. It is the only way to stop a filibuster; the House has no equivalent because unlimited debate among 435 members would be unworkable.',
    },
    {
      loId: 'apgov.congress-structure',
      kind: 'definition',
      title: 'gerrymandering',
      content:
        'Drawing legislative district lines to advantage a particular party or group — e.g. "packing" opposition voters into few districts to waste their votes, or "cracking" them across many districts so they never form a majority anywhere.',
    },
    {
      loId: 'apgov.congress-structure',
      kind: 'concept',
      title: 'House vs. Senate procedure: filibuster, Rules Committee, unanimous consent',
      content:
        'The FILIBUSTER is a Senate-only tradition of extended debate used to delay or block a vote on a bill or nomination; it exists nowhere in the Constitution\'s text — it is a product of Senate rules, ended only by cloture. The House instead relies on its RULES COMMITTEE, which controls the flow of legislation to the floor by setting time limits on debate and which amendments (if any) may be offered — a gatekeeping tool the House needs because of its large size. The Senate has no equivalent gatekeeping committee; it typically moves bills via UNANIMOUS CONSENT agreements, negotiated arrangements that set terms for debate and votes only if literally no senator objects — a single senator can hold up business by withholding consent.',
    },
    {
      loId: 'apgov.congress-structure',
      kind: 'concept',
      title: 'committees and leadership',
      content:
        'Most legislative work happens in STANDING COMMITTEES (permanent, subject-specific — e.g. Ways and Means, Armed Services), which hold hearings, mark up bills, and decide whether a bill advances at all. Chamber LEADERSHIP — the Speaker of the House (elected by the majority party, sets the legislative agenda, refers bills to committee) and the Senate Majority Leader (schedules floor votes, though with less unilateral control than the Speaker given Senate rules like the filibuster) — steers each chamber\'s priorities.',
    },
    {
      loId: 'apgov.congress-structure',
      kind: 'framework',
      title: 'how a bill becomes law',
      content:
        'Introduction (in either chamber, except revenue bills, which must originate in the House per Article I, §7) -> committee referral, hearings, and markup -> floor debate and vote in that chamber -> the SAME process in the other chamber -> if the two chambers pass different versions, a CONFERENCE COMMITTEE reconciles them into one bill -> both chambers must approve the reconciled bill -> the President signs it into law, vetoes it, or lets it become law without a signature or pocket-vetoes it.',
    },
    {
      loId: 'apgov.congress-structure',
      kind: 'concept',
      title: 'congressional oversight',
      content:
        'Congress\'s ongoing power to monitor and check how the executive branch and its agencies implement laws — through committee hearings, investigations, subpoenas for testimony/documents, and the confirmation process for major appointments. Oversight is how Congress polices the bureaucracy and the executive between elections, not just at bill-passage time.',
    },
    {
      loId: 'apgov.congress-structure',
      kind: 'framework',
      title: 'trustee, delegate, and politico models of representation',
      content:
        'The TRUSTEE model holds that a representative should use their own independent judgment about what is best for constituents, even against constituents\' stated wishes. The DELEGATE model holds that a representative should vote according to what constituents explicitly want, setting aside personal judgment. The POLITICO model blends the two — acting as a delegate on high-salience issues constituents care intensely about, and as a trustee on more technical or lower-visibility matters.',
    },
    {
      loId: 'apgov.congress-structure',
      kind: 'concept',
      title: 'apportionment vs. redistricting',
      content:
        'APPORTIONMENT is the process of dividing the House\'s 435 seats among the states based on population, recalculated after each decennial census — a state\'s population growth or decline relative to other states can gain or cost it House seats. REDISTRICTING then draws the actual district lines within a state to match its new seat allocation. Apportionment decides HOW MANY seats a state gets; redistricting decides WHERE the lines go.',
    },
    {
      loId: 'apgov.congress-structure',
      kind: 'event',
      title: 'Baker v. Carr (1962) — reapportionment is justiciable',
      content:
        'For decades, some states left district lines unchanged despite huge population shifts, so rural districts had far fewer voters per representative than urban ones. The Supreme Court held that malapportionment claims ARE justiciable — federal courts CAN hear and decide them — under the Fourteenth Amendment\'s Equal Protection Clause, opening the door to the "one person, one vote" principle: districts within a state must have roughly equal populations.',
    },
    {
      loId: 'apgov.congress-structure',
      kind: 'event',
      title: 'Shaw v. Reno (1993) — race cannot be the predominant factor',
      content:
        'North Carolina drew an unusually shaped congressional district explicitly to create a second majority-Black district. The Supreme Court held that when race is the PREDOMINANT factor in drawing a district\'s lines — overriding traditional districting principles like compactness and contiguity — the plan is subject to STRICT SCRUTINY under the Equal Protection Clause. Race-conscious districting is not automatically forbidden, but it cannot simply override traditional criteria without a compelling justification that survives strict scrutiny.',
    },
    {
      loId: 'apgov.congress-structure',
      kind: 'event',
      title: 'women in Congress, 1961-2021 (CRS Report R43244)',
      content:
        'Described data table adapted from a Congressional Research Service report: the total number of women in Congress (out of 535 voting Members) rose from 20 (1961) to 23 (1981) to 74 (2001) to 147 (2021) — growth was SLIGHT through 1981, then accelerated sharply after the 1990s. In 2021, that 147 was about 27% of Congress\'s 535 voting seats, far below women\'s roughly 50.8% share of the U.S. population per the 2020 Census — numeric growth over time and demographic proportionality are two different things.',
    },
  ],
  methods: [
    {
      title: 'Apply Baker v. Carr or Shaw v. Reno to a new districting dispute',
      when_to_use:
        'Use this whenever a prompt describes a state drawing or redrawing congressional districts and asks whether a resulting challenge is likely to succeed.',
      steps: [
        'IDENTIFY THE TYPE OF CLAIM. Is the challenge about unequal POPULATION across districts (a malapportionment claim) or about RACE being used to shape a district\'s boundaries (a racial-gerrymandering claim)? These trigger different precedents.',
        'IF POPULATION-BASED, APPLY BAKER V. CARR (1962). The claim is justiciable under the Fourteenth Amendment\'s Equal Protection Clause, and the governing standard is "one person, one vote" — districts within a state must have roughly equal populations.',
        'IF RACE-BASED, APPLY SHAW V. RENO (1993). Ask whether race was the PREDOMINANT factor overriding traditional districting principles (compactness, contiguity). If so, the plan is subject to STRICT SCRUTINY under the Equal Protection Clause — not automatically struck down, but requiring a compelling justification.',
        'STATE THE HOLDING PRECISELY before applying it — Baker v. Carr made malapportionment claims justiciable; it did not itself set district lines. Shaw v. Reno triggers strict scrutiny for race-predominant districting; it does not ban all consideration of race.',
      ],
      example: {
        problem:
          'A voter sues, arguing their district has twice the population of a neighboring district in the same state, violating equal representation.',
        solution:
          'This is a malapportionment claim. Under Baker v. Carr (1962), it is justiciable — a federal court can hear it — and the "one person, one vote" principle requires the state\'s districts to have roughly equal populations, so the voter has a viable claim.',
      },
      relatedLoIds: ['apgov.congress-structure'],
    },
    {
      title: 'Read a described data table: separate the trend from the comparison',
      when_to_use:
        'Use this whenever a prompt gives (or describes) a table showing values across several time points, plus a separate comparison figure (e.g. a population share).',
      steps: [
        'READ EACH TIME POINT IN ORDER before concluding anything about the trend\'s shape — do not assume growth (or decline) is steady just because the endpoints moved in one direction.',
        'CHECK WHETHER THE PACE CHANGED. Compare the size of the change between each pair of adjacent points; state explicitly if growth accelerated, slowed, or reversed partway through rather than describing one uniform rate.',
        'COMPUTE THE MOST RECENT VALUE AS A SHARE of whatever total the question asks about, then compare that share to any OUTSIDE comparison figure the table provides (e.g. a population percentage).',
        'DRAW A CONCLUSION THAT ONLY USES WHAT THE TABLE SHOWS — growth over time and proportionality to an outside benchmark are different questions; do not let one answer stand in for the other.',
      ],
      example: {
        problem:
          'Women in Congress rose from 20 (1961) to 147 (2021) out of 535 seats, while making up about 50.8% of the U.S. population in 2020. What does this show?',
        solution:
          'The number grew slightly through 1981, then accelerated sharply after the 1990s, reaching about 27% of seats by 2021 — but that 27% remains far below the 50.8% population share, so growth over time has not closed the proportionality gap.',
      },
      relatedLoIds: ['apgov.congress-structure'],
    },
  ],
  pointers: [
    { content: 'Baker v. Carr (1962) = justiciability + "one person, one vote" under Equal Protection. Shaw v. Reno (1993) = race as predominant factor triggers strict scrutiny. Don\'t reverse which case does which.', kind: 'trap' },
    { content: 'The filibuster and cloture are SENATE-ONLY rules, not in the Constitution\'s text. The House instead uses its Rules Committee to control debate.', kind: 'trap' },
    { content: 'Apportionment = how many seats a state gets (by population, after the census). Redistricting = where the lines go within the state. Keep the two distinct.', kind: 'tip' },
    { content: 'Trustee = representative\'s own judgment; delegate = constituents\' explicit wishes; politico = blends the two depending on the issue\'s salience.', kind: 'tip' },
    { content: 'On a described data table, report the trend\'s pace (steady vs. accelerating) and any outside comparison figure separately — a rising raw count does not by itself mean proportionality was reached.', kind: 'tip' },
  ],
};
