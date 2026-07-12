/**
 * AP US History — CED Unit 8.2-8.3: The Origins of the Cold War.
 *
 * Period-8 content plan (follows the Period-3 calibration template — see
 * ap-apush-u3-causes-of-revolution.ts for the full rationale and
 * docs/superpowers/specs/2026-07-10-ap-us-history-design.md for the shared
 * Passage/rubric infra this plan reuses).
 *
 * First stop in Period 8 (1945-1980): how wartime cooperation between the
 * US and USSR curdled into a decades-long ideological and geopolitical
 * standoff, and how containment became the organizing doctrine of American
 * foreign policy — with real domestic costs (Red Scare, defense spending,
 * a permanent national-security apparatus).
 *
 * Anchor text: Harry Truman's March 12, 1947 address to Congress —
 * evelyn.passage.apush-truman-doctrine.v1. Teaching point is how Truman
 * converts a specific request (aid to Greece and Turkey) into a general,
 * open-ended doctrine of American commitment abroad — quoted only as the
 * short excerpt already seeded.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APUSH_U8_COLD_WAR: LessonPlan = {
  id: 'evelyn.ap.apush.cold-war-origins.v1',
  title: 'U8.2-8.3 The Origins of the Cold War',
  curriculum: 'AP',
  grade: '11',
  subject: 'ss',
  topic: 'ap-us-history',
  locale: 'en',
  los: [
    {
      id: 'apush.cold-war-origins',
      description:
        'Explain the origins of the Cold War, including the breakdown of the wartime US-Soviet alliance, the containment doctrine (Truman Doctrine, Marshall Plan, NATO), the Berlin crisis, NSC-68 and the Korean War, the domestic Red Scare, and the Eisenhower-era "New Look" and Sputnik.',
      standard: 'AP-APUSH-8.2',
    },
  ],
  prerequisites: [],
  followUps: ['apush.postwar-society'],
  estimatedMinutes: 23,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Get the student to see the Cold War as a specific policy CHOICE (containment) made in response to a specific 1947 crisis, not an automatic continuation of WWII alliances.',
      script:
        "In 1945, the United States and the Soviet Union were allies who had just defeated Nazi Germany together. Within two years, American policymakers were calling the USSR an existential threat requiring a permanent global commitment to stop its spread. What changed wasn't a single event — it was a breakdown in trust over occupied Europe, followed by a specific 1947 moment when Britain told Washington it could no longer afford to prop up Greece and Turkey against Communist pressure. The United States had a choice: let those countries go, or step in. The answer it gave — and HOW it justified that answer — became the blueprint for four decades of American foreign policy. That's containment, and today we're tracing where it came from and what it cost at home.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-containment-cold-war',
      kind: 'concept',
      goal: 'Explain the containment doctrine and its major applications (Truman Doctrine, Marshall Plan, NATO, Berlin, NSC-68/Korea), the domestic Red Scare, and Eisenhower-era Cold War policy (New Look, Sputnik).',
      keyIdeas: [
        "FROM ALLIANCE TO RIVALRY: the US and USSR had cooperated to defeat Germany and Japan, but disagreed sharply over postwar Europe — especially the fate of Eastern Europe, where the Soviet Union installed friendly Communist governments rather than allowing the free elections promised at Yalta (1945). By 1946-47, mutual suspicion had hardened into an ideological standoff between American capitalist democracy and Soviet Communism.",
        "CONTAINMENT: American diplomat George Kennan, in a famous analysis sent from Moscow and later published anonymously (the \"Long Telegram\"/\"Mr. X\" article), argued the Soviet Union was inherently expansionist but could be checked, over time, through firm and patient resistance wherever it tried to expand — WITHOUT necessarily invading or attempting to overthrow existing Communist governments. This idea, CONTAINMENT, became the intellectual foundation of US Cold War strategy: stop Communism from SPREADING, rather than trying to eliminate where it already existed.",
        "THE TRUMAN DOCTRINE (1947): when Britain announced it could no longer afford to support Greece (fighting Communist insurgents) and Turkey (facing Soviet pressure), President Truman asked Congress for aid to both countries — but framed the request in sweeping, universal terms: the United States would support \"free peoples\" resisting subjugation anywhere, not just in Greece and Turkey specifically. This rhetorical move turned a narrow aid request into an open-ended global commitment, the practical launch of containment as policy.",
        "THE MARSHALL PLAN (1948): a massive US economic aid program to rebuild Western European economies, reasoning that poverty and instability made countries vulnerable to Communist movements — economic strength, not just military deterrence, was a containment tool. The Soviet Union refused to let Eastern-bloc states participate, deepening the continent's division.",
        "NATO (1949) AND THE DIVISION OF EUROPE: the North Atlantic Treaty Organization committed the US and Western European allies to mutual defense — an attack on one treated as an attack on all — formalizing a permanent American military commitment to Europe, a sharp break from prior US non-entanglement traditions. The Soviet Union responded years later by organizing its own Eastern European allies into the Warsaw Pact (1955).",
        "THE BERLIN CRISIS (1948-49): occupied Germany (and Berlin, deep inside the Soviet zone) had been divided into American/British/French and Soviet sectors. When the Western powers moved to unify their zones economically, the USSR blockaded all land access to West Berlin. Rather than fight through the blockade, the US and allies supplied the city entirely by air for nearly a year (the Berlin Airlift) until the Soviets lifted the blockade — a Cold War crisis resolved without direct combat, but confirming Germany's (and Berlin's) permanent division into rival states.",
        "NSC-68 AND THE KOREAN WAR (1950): a classified policy paper, NSC-68, recommended a dramatic, sustained expansion of US military spending to contain Communism globally, treating any Communist advance anywhere as a threat to American security. It was a hard sell to Congress until the Korean War (1950-53) — when Communist North Korea invaded US-allied South Korea — provided the crisis that made the buildup politically possible. The war ended in a stalemate near the original dividing line (the 38th parallel), with no formal peace treaty, but it cemented containment as a costed, standing military commitment rather than just a doctrine on paper.",
        "THE DOMESTIC RED SCARE (measured): Cold War anxiety abroad fueled fear of Communist subversion at home. The House Un-American Activities Committee (HUAC) investigated alleged Communist influence in government and Hollywood, producing a blacklist of entertainment professionals; Senator Joseph McCarthy made sweeping, often unsubstantiated accusations of Communist infiltration in government from 1950 on. McCarthy's influence collapsed after the televised Army-McCarthy hearings (1954) exposed his methods to a national audience, and the Senate formally censured him later that year — but the broader climate of suspicion had already damaged many careers and civil liberties.",
        "EISENHOWER'S \"NEW LOOK\" (1950s): President Eisenhower, seeking to contain Communism without the Korean War's level of spending, shifted defense strategy toward relying on nuclear weapons and airpower (\"massive retaliation\") as a cheaper deterrent than large conventional (ground) forces — a strategic bet that a nuclear threat could contain Soviet expansion at lower cost.",
        "SPUTNIK (1957): the Soviet Union's launch of the first artificial satellite shocked American confidence in its technological and military lead, accelerating the Space Race and prompting the National Defense Education Act (1958), which funded science, math, and foreign-language education — treating education itself as a Cold War competitiveness tool.",
      ],
      vocabulary: [
        {
          term: 'containment',
          definition:
            "the Cold War strategy, associated with diplomat George Kennan, of resisting Soviet/Communist expansion wherever it occurred, without necessarily attacking or overthrowing existing Communist governments.",
        },
        {
          term: 'Truman Doctrine',
          definition:
            'President Truman\'s March 1947 policy, announced in a request for aid to Greece and Turkey, committing the US to support "free peoples" resisting subjugation anywhere — the practical launch of containment.',
        },
        {
          term: 'Marshall Plan',
          definition:
            "US economic aid program (1948) to rebuild Western Europe, based on the idea that poverty and instability made nations vulnerable to Communism; the USSR barred Eastern-bloc participation.",
        },
        {
          term: 'NSC-68',
          definition:
            'a 1950 classified US policy paper recommending a major, sustained expansion of military spending to contain Communism globally; politically difficult to enact until the Korean War provided justification.',
        },
        {
          term: 'Red Scare (Second)',
          definition:
            "the post-WWII wave of fear over Communist subversion at home, driven by HUAC investigations and Senator Joseph McCarthy's accusations; McCarthy's influence collapsed after the 1954 Army-McCarthy hearings and Senate censure.",
        },
      ],
      passageId: 'evelyn.passage.apush-truman-doctrine.v1',
      estimatedMinutes: 7,
    },
    {
      id: 'worked-truman-doctrine',
      kind: 'worked_example',
      problem:
        'Analyze this excerpt from President Truman\'s address to Congress, March 12, 1947: "At the present moment in world history nearly every nation must choose between alternative ways of life. The choice is too often not a free one. One way of life is based upon the will of the majority, and is distinguished by free institutions, representative government, free elections, guarantees of individual liberty, freedom of speech and religion, and freedom from political oppression. The second way of life is based upon the will of a minority forcibly imposed upon the majority. It relies upon terror and oppression, a controlled press and radio; fixed elections, and the suppression of personal freedoms. I believe that it must be the policy of the United States to support free peoples who are resisting attempted subjugation by armed minorities or by outside pressures. I believe that we must assist free peoples to work out their own destinies in their own way. I believe that our help should be primarily through economic and financial aid which is essential to economic stability and orderly political processes." What kind of argument is Truman making here, and why does it go well beyond a simple request for aid?',
      steps: [
        'SOURCE IT FIRST. Truman is speaking to a joint session of Congress on March 12, 1947, specifically to request aid for Greece (fighting a Communist insurgency) and Turkey (facing Soviet pressure) after Britain announced it could no longer afford to support either country.',
        'IDENTIFY THE FRAMING MOVE. Notice Truman never names Greece or Turkey in this excerpt. Instead he frames the entire world as facing a binary choice between "alternative ways of life" — one free and democratic, one built on "terror and oppression" and "fixed elections." This is a universal, ideological framing, not a country-specific one.',
        'IDENTIFY THE THREE COMMITMENTS. The three "I believe" sentences move from the general framing to a specific policy: (1) support "free peoples" resisting "subjugation by armed minorities or by outside pressures," (2) let them "work out their own destinies in their own way," (3) provide help "primarily through economic and financial aid." Note the commitment is stated with NO geographic limit — "free peoples" anywhere, not just in the two countries Truman is asking Congress to fund right now.',
        'EXPLAIN WHY THIS GOES BEYOND THE IMMEDIATE REQUEST. By stating the commitment in universal terms rather than limiting it to Greece and Turkey, Truman is doing more than requesting a specific appropriation — he is asking Congress (and the country) to accept a GENERAL DOCTRINE that will justify future aid and intervention decisions well beyond this one vote. This is exactly why historians treat this address as the origin of "containment" as an applied policy, not just an aid bill.',
        'CONNECT TO THE COURSE THESIS. The speech converts a narrow, practical problem (two countries needing money) into an open-ended ideological commitment (opposing Communist expansion everywhere) — the rhetorical hinge on which the entire containment-era foreign policy (Marshall Plan, NATO, Korea, and beyond) would be built.',
      ],
      answer:
        'Truman frames the request for Greek and Turkish aid as evidence of a much larger, universal choice facing every nation between free institutions and a "second way of life" based on terror, oppression, and fixed elections. His three "I believe" statements commit the United States to support "free peoples" resisting subjugation "by armed minorities or by outside pressures" anywhere — with no geographic limit to Greece and Turkey specifically. This goes well beyond a simple aid request: by stating the commitment as a general principle rather than a one-time appropriation, Truman is asking Congress to accept an open-ended doctrine that will justify future American intervention decisions for years to come — the origin point of "containment" as an applied Cold War policy.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-saq',
      kind: 'try_yourself',
      problem:
        "SAQ practice. (a) Briefly describe ONE way the United States pursued the policy of containment between 1947 and 1955. (b) Briefly explain ONE specific piece of historical evidence that supports your answer to (a). (c) Briefly explain ONE domestic consequence, inside the United States, of the Cold War consensus that containment helped create.",
      responseFormat: 'frq',
      rubric: {
        parts: [
          {
            criterionId: 'a',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): correctly and specifically describes ONE genuine containment-era policy or action — e.g. the Truman Doctrine (aid to Greece/Turkey), the Marshall Plan (economic aid to Western Europe), NATO (mutual-defense alliance), the Berlin Airlift, or NSC-68/the Korean War (military buildup and intervention). No credit for a vague statement ("the US fought Communism") with no specific policy named.',
            modelResponse:
              'One way the US pursued containment was the Marshall Plan (1948), which provided large-scale economic aid to rebuild Western European economies on the theory that poverty and instability made countries vulnerable to Communist movements.',
          },
          {
            criterionId: 'b',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains a specific piece of historical evidence (an event, statistic, or document) that supports the policy named in (a), connected clearly to that policy. No credit for evidence unconnected to the stated policy or too generic to verify.',
            modelResponse:
              "When the Soviet Union blockaded all land access to West Berlin in 1948-49 to pressure the Western Allies out of the city, the US and its allies responded not with military force through the blockade but by supplying West Berlin entirely by air for nearly a year — the Berlin Airlift — demonstrating a firm but non-military form of containment in action.",
          },
          {
            criterionId: 'c',
            maxPoints: 1,
            scoringCriteria:
              "Full credit (1): explains a specific, accurate domestic consequence of Cold War containment policy — e.g. the Red Scare/HUAC investigations and McCarthyism, the buildup in defense spending following NSC-68, or the National Defense Education Act following Sputnik. No credit for a vague or unconnected consequence.",
            modelResponse:
              'One domestic consequence was the Red Scare: fear that Communist agents had infiltrated the US government and entertainment industry fueled HUAC investigations and, from 1950, Senator Joseph McCarthy\'s sweeping accusations of Communist influence — damaging many careers and civil liberties until McCarthy\'s methods were exposed in the televised Army-McCarthy hearings of 1954 and he was censured by the Senate.',
          },
        ],
      },
      estimatedMinutes: 5,
    },
    {
      id: 'misconception-containment-rollback',
      kind: 'misconception_check',
      question:
        'True or false: containment meant the United States sought to actively overthrow ("roll back") existing Communist governments wherever they already existed.',
      commonErrors: [
        {
          answer: 'true',
          misconception:
            'Confusing CONTAINMENT (stopping further Communist expansion, without necessarily attacking existing Communist states) with ROLLBACK (actively trying to overthrow or liberate territory already under Communist control) — two distinct ideas that some contemporaries debated but which were not the same policy.',
          correctsTo:
            "FALSE. Containment, as Kennan formulated it and as the Truman Doctrine, Marshall Plan, and NATO applied it, aimed to STOP Communism from SPREADING to new countries — not to overthrow governments where it already existed. A more aggressive alternative, sometimes called \"rollback,\" was debated by some American politicians in the early 1950s, but it was not the policy actually pursued: even during the Korean War, when UN/US forces pushed north toward the Yalu River in 1950 (arguably a rollback-style move), the result was Chinese intervention and a costly stalemate — reinforcing, rather than overturning, the containment approach of holding an existing line rather than trying to eliminate Communist states outright.",
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Containment (Kennan) meant resisting Communist expansion wherever it occurred, WITHOUT necessarily attacking existing Communist governments — distinct from a more aggressive "rollback."',
        'The Truman Doctrine (1947) converted a specific aid request (Greece, Turkey) into a universal, open-ended commitment to support "free peoples" — the practical launch of containment.',
        'The Marshall Plan (economic aid), NATO (military alliance), and the Berlin Airlift (crisis response without direct combat) were containment tools short of war; NSC-68 and the Korean War made containment a costed, standing military commitment.',
        'The domestic Red Scare (HUAC, McCarthy) was a real cost of Cold War anxiety at home — McCarthy\'s influence collapsed only after the 1954 Army-McCarthy hearings and Senate censure.',
        "Eisenhower's \"New Look\" leaned on nuclear deterrence to contain Communism more cheaply than Korea-style conventional buildup; Sputnik (1957) triggered a crisis of confidence and new federal investment in science education.",
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '8',
    cedTopic: '8.2-8.3',
    cedTitle: 'The Origins of the Cold War',
    sources: [
      { type: 'plan', source: 'AP Plans Initiative — AP US History' },
      {
        type: 'passage',
        book: 'evelyn.passage.apush-truman-doctrine.v1',
        chapter: '1947',
        note: 'Truman Doctrine address — anchor document for the containment doctrine as applied policy.',
      },
    ],
  },
};
