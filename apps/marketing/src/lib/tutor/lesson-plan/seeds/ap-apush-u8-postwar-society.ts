/**
 * AP US History — CED Unit 8.4-8.6: Postwar Society, Culture, and Prosperity.
 *
 * Period-8 content plan (follows the Period-3 calibration template — see
 * ap-apush-u3-causes-of-revolution.ts for the full rationale). No passage is
 * wired to this plan: the period block specifies "no passage" for this LO,
 * so the worked example instead performs a close read of a described
 * demographic contrast (suburban growth vs. redlined exclusion) rather than
 * a primary-source excerpt.
 *
 * Covers the postwar economic boom and its institutional drivers (GI Bill,
 * federal highway/housing policy), the baby boom, the Sunbelt, mass culture
 * (television), cultural critics (the Beats), and the persistence of poverty
 * amid affluence — the through-line being that postwar prosperity was REAL
 * but UNEVENLY distributed, not universal.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APUSH_U8_POSTWAR_SOCIETY: LessonPlan = {
  id: 'evelyn.ap.apush.postwar-society.v1',
  title: 'U8.4-8.6 Postwar Society, Culture, and Prosperity',
  curriculum: 'AP',
  grade: '11',
  subject: 'ss',
  topic: 'ap-us-history',
  locale: 'en',
  los: [
    {
      id: 'apush.postwar-society',
      description:
        'Explain the causes and consequences of postwar economic growth and demographic change, including the GI Bill, suburbanization and redlining, the baby boom, the Sunbelt, the interstate highway system, television and mass culture, cultural critics of conformity, and the persistence of poverty amid general affluence.',
      standard: 'AP-APUSH-8.4',
    },
  ],
  prerequisites: ['apush.cold-war-origins'],
  followUps: ['apush.civil-rights-movement'],
  estimatedMinutes: 23,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Get the student to see postwar prosperity as real but UNEVENLY distributed, not a uniform national experience.',
      script:
        "Picture the stereotype of the 1950s: a single-family house in a brand-new suburb, a car in the driveway, a television in the living room, a growing family. That image is not a myth — for millions of American families, it was genuinely true, and it was built by specific federal policies, not just good luck. But the same policies that built that suburb also, in many cases, made sure certain families could never buy a house in it. Postwar America was, at the very same time, the most broadly prosperous the country had ever been AND a place where prosperity was distributed along lines of race and geography that federal policy itself helped draw. Today we're tracing both halves of that story.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-postwar-boom-and-its-limits',
      kind: 'concept',
      goal: 'Explain the institutional drivers of postwar prosperity (GI Bill, suburbanization, highways), demographic shifts (baby boom, Sunbelt), mass culture and its critics, and the persistence of poverty amid affluence.',
      keyIdeas: [
        "THE GI BILL (Servicemen's Readjustment Act, 1944): provided returning WWII veterans with funded college tuition, low-interest home loans, and unemployment benefits. It dramatically expanded college attendance and homeownership for millions of (mostly white) veteran families, functioning as one of the largest federal investments in the middle class in American history.",
        "SUBURBANIZATION: mass-produced, affordable suburban housing developments — the prototype being Levittown, New York (and its imitators nationwide) — used standardized construction methods to build homes quickly and cheaply, fueling a historic wave of suburban growth financed heavily by federally backed FHA and VA home loans.",
        "REDLINING — THE UNEVEN REALITY: federal housing agencies (and the private lenders who followed their maps) routinely rated racially mixed or Black neighborhoods as poor credit risks, denying mortgages and loan guarantees there while subsidizing new all-white suburbs. Many suburban developments, including Levittown itself, also used racially restrictive sales practices. The result: white families disproportionately built wealth through federally subsidized suburban homeownership, while Black families were often excluded from that same subsidized growth and confined to underinvested urban neighborhoods — a gap in generational wealth-building with effects lasting long after redlining itself was later outlawed.",
        'THE BABY BOOM: the sharp, sustained rise in the US birth rate from the mid-1940s through the early 1960s, driven by postwar economic confidence, younger marriage ages, and the same suburban family-formation boom — producing the large "Baby Boomer" generation that would shape American culture and politics for decades.',
        "THE SUNBELT: the South and West grew rapidly in population and economic weight after WWII, driven by wartime and Cold War-era defense spending (military bases, aerospace and electronics manufacturing), the spread of air conditioning (making the climate more livable year-round), and state policies (including \"right-to-work\" laws limiting union power) that attracted new business investment — a long-term regional power shift away from the older industrial Northeast/Midwest.",
        "THE INTERSTATE HIGHWAY SYSTEM (Federal-Aid Highway Act, 1956): President Eisenhower championed a national highway network, justified partly on Cold War national-defense grounds (rapid military and civilian movement/evacuation), that reshaped American life around the automobile — accelerating suburban growth and long-distance commuting, but also cutting through and displacing existing (often minority) urban neighborhoods to build urban highway segments.",
        "TELEVISION AND MASS CULTURE: television spread into the vast majority of American homes during the 1950s, becoming the dominant shared cultural experience — sitcoms and advertising broadcast a fairly narrow, idealized image of (white, suburban, middle-class) domestic life nationwide, contributing to a real, but sometimes overstated, sense of cultural conformity.",
        "CULTURAL CRITICS — THE BEATS: writers associated with the \"Beat\" movement (e.g. Jack Kerouac, Allen Ginsberg) rejected mainstream 1950s conformity and consumerism, celebrating spontaneity, nonconformity, and alternative lifestyles — an early crack in the postwar consensus that anticipated the broader 1960s counterculture.",
        "PERSISTENT POVERTY AMID AFFLUENCE: despite the general boom, poverty remained widespread and, in the era's own popular framing, largely INVISIBLE to the prosperous majority — concentrated in inner cities left behind by suburban flight, in Appalachia, and among many rural and elderly Americans, and often obscured by the dominant image of suburban abundance broadcast on television. This \"discovery\" of persistent poverty amid general prosperity would help set up the War on Poverty in the following decade.",
      ],
      vocabulary: [
        {
          term: 'GI Bill',
          definition:
            "(Servicemen's Readjustment Act, 1944) federal law funding college tuition, low-interest home loans, and unemployment benefits for returning WWII veterans, fueling a major expansion of the (mostly white) middle class.",
        },
        {
          term: 'redlining',
          definition:
            'the federally sanctioned and privately followed practice of denying mortgages/loans in racially mixed or Black neighborhoods while subsidizing new white-only suburban development — a major driver of the racial wealth gap.',
        },
        {
          term: 'Sunbelt',
          definition:
            'the South and West, whose population and economic weight grew rapidly after WWII due to defense spending, air conditioning, and business-friendly state policy — a long-term regional power shift.',
        },
        {
          term: 'baby boom',
          definition:
            'the sustained rise in the US birth rate from the mid-1940s through the early 1960s, producing the large postwar generation that shaped subsequent American culture and politics.',
        },
        {
          term: 'the Beats',
          definition:
            'a group of writers (e.g. Kerouac, Ginsberg) who rejected 1950s conformity and consumerism, celebrating nonconformity and spontaneity — an early cultural crack in the postwar consensus.',
        },
      ],
      estimatedMinutes: 7,
    },
    {
      id: 'worked-suburb-redlining-contrast',
      kind: 'worked_example',
      problem:
        'Consider two federal policies from the same postwar period: (1) the FHA and VA home-loan programs that made suburban homeownership affordable for millions of veteran families, and (2) the practice, by those same federal agencies, of rating racially mixed and Black neighborhoods as poor credit risks ("redlining") and denying mortgage guarantees there. How can BOTH of these be true descriptions of the same federal housing policy era, and what does that combination tell you about how postwar prosperity was actually distributed?',
      steps: [
        'IDENTIFY THE APPARENT TENSION. One description makes federal policy sound like a broad, generous middle-class investment (GI Bill loans, FHA/VA-backed mortgages funding suburban growth for millions). The other describes the same federal apparatus systematically excluding Black families from that exact benefit. Both are accurate — the tension is real, not a contradiction to explain away.',
        'RESOLVE IT BY LOOKING AT WHO THE POLICY REACHED. Federal loan guarantees genuinely lowered the cost of homeownership and built enormous middle-class wealth — but underwriting standards used by the same agencies rated racially mixed or Black neighborhoods as poor investments, so loans there were routinely denied regardless of an individual applicant\'s creditworthiness. The benefit was real; access to it was not equally distributed.',
        'IDENTIFY THE MECHANISM, NOT JUST THE OUTCOME. This was not simply private prejudice operating on the margins of an otherwise neutral program — the federal agencies\' own neighborhood-rating maps built the exclusion into the underwriting process itself, and many private developments (including some of the most famous, like Levittown) added their own racially restrictive sales practices on top of that.',
        'CONNECT TO LONG-TERM CONSEQUENCES. Because a house is typically a family\'s largest source of accumulated wealth, and because that wealth is often passed down across generations, excluding Black families from the same subsidized suburban homeownership boom that built white middle-class wealth created a racial wealth gap whose effects persisted for decades after redlining itself was later outlawed (1968).',
        'STATE THE BROADER LESSON. Postwar prosperity was not evenly distributed by accident — some of the very federal programs credited with building the postwar middle class also actively excluded Black Americans from that same wealth-building process, which is why "the postwar boom" and "persistent racial inequality" are both accurate descriptions of the SAME period, not competing ones.',
      ],
      answer:
        "Both descriptions are accurate because they describe different effects of the same federal housing apparatus: FHA and VA loan guarantees genuinely made homeownership affordable and built real middle-class wealth for millions of families, but the underwriting standards those same agencies used rated racially mixed and Black neighborhoods as poor credit risks, systematically denying loans there regardless of individual creditworthiness (redlining) — and many suburban developments added their own racially restrictive sales practices on top of that. Because home equity is a family's main source of wealth, often passed down across generations, this meant postwar federal policy built enormous wealth for white families while excluding Black families from the identical subsidized process — producing a racial wealth gap whose effects lasted long after redlining was formally outlawed. Postwar prosperity was real, but it was distributed along lines that federal policy itself helped draw, not evenly across the population.",
      estimatedMinutes: 5,
    },
    {
      id: 'try-saq',
      kind: 'try_yourself',
      problem:
        "SAQ practice. (a) Briefly describe ONE federal policy that fueled postwar suburban growth and prosperity. (b) Briefly explain ONE piece of specific historical evidence showing that this prosperity was NOT equally distributed. (c) Briefly explain ONE way American culture or society showed signs of dissent from, or limits to, the dominant postwar consensus.",
      responseFormat: 'frq',
      rubric: {
        parts: [
          {
            criterionId: 'a',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): correctly and specifically describes a genuine federal driver of postwar prosperity — e.g. the GI Bill (education/home loans for veterans), FHA/VA-backed mortgages fueling suburban construction, or the Federal-Aid Highway Act (1956) building the interstate system. No credit for a vague statement ("the economy grew") with no specific policy named.',
            modelResponse:
              "One federal policy was the GI Bill (Servicemen's Readjustment Act, 1944), which funded college tuition and provided low-interest home loans for returning WWII veterans, expanding both college attendance and homeownership.",
          },
          {
            criterionId: 'b',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains a specific piece of evidence showing postwar prosperity was unevenly distributed — e.g. redlining/FHA discriminatory lending maps, racially restrictive suburban sales covenants, or persistent inner-city/rural/Appalachian poverty amid general affluence. No credit for a vague or unconnected claim.',
            modelResponse:
              'Federal housing agencies routinely rated racially mixed or Black neighborhoods as poor credit risks and denied mortgage guarantees there (redlining), while subsidizing new all-white suburban developments — meaning the same federal programs that built white middle-class wealth through homeownership largely excluded Black families from that identical process.',
          },
          {
            criterionId: 'c',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains a specific, accurate example of cultural dissent from or limits to the postwar consensus — e.g. the Beat writers\' rejection of conformity and consumerism, or the "discovery"/persistence of poverty amid general affluence. No credit for a vague claim with no specific example.',
            modelResponse:
              'Writers associated with the Beat movement, such as Jack Kerouac and Allen Ginsberg, rejected the era\'s dominant suburban conformity and consumerism, celebrating nonconformity and spontaneity instead — an early cultural crack in the postwar consensus that anticipated the broader 1960s counterculture.',
          },
        ],
      },
      estimatedMinutes: 5,
    },
    {
      id: 'misconception-prosperity-reached-everyone',
      kind: 'misconception_check',
      question:
        'True or false: postwar economic prosperity (roughly 1945-1960) reached essentially all Americans fairly equally.',
      commonErrors: [
        {
          answer: 'true',
          misconception:
            'Overgeneralizing from the era\'s dominant television/advertising image (a white, suburban, middle-class family) to the whole population, rather than recognizing that the same federal policies fueling that image also actively excluded many Americans from it.',
          correctsTo:
            "FALSE. Postwar prosperity was real and historic, but it was UNEVENLY distributed. Federal housing policy — the same GI Bill and FHA/VA loan guarantees that fueled suburban homeownership for millions — routinely redlined racially mixed and Black neighborhoods, denying mortgage access there while subsidizing new white-only suburbs. Poverty also persisted, often unseen by the prosperous majority, in inner cities left behind by suburban flight, in Appalachia, and among many rural and elderly Americans. The dominant television image of suburban abundance was a real experience for many families, but treating it as a description of postwar America as a whole erases the substantial population left out of — or actively excluded from — that same prosperity.",
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The GI Bill and FHA/VA-backed loans fueled real, historic suburban homeownership growth and middle-class wealth-building after WWII.',
        'Redlining — the same federal apparatus rating racially mixed/Black neighborhoods as poor credit risks — systematically excluded Black families from that identical subsidized process, producing a lasting racial wealth gap.',
        'The baby boom and Sunbelt growth (defense spending, air conditioning, right-to-work laws) reshaped American demographics and regional power after WWII.',
        'The interstate highway system (1956) reshaped American life around the car — and displaced urban minority neighborhoods to build city highway segments.',
        'Postwar prosperity was real but UNEVEN — the Beats\' cultural dissent and persistent, often "invisible" poverty amid affluence both complicate the suburban-abundance image without contradicting that the boom itself happened.',
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '8',
    cedTopic: '8.4-8.6',
    cedTitle: 'Postwar Society, Culture, and Prosperity',
    sources: [{ type: 'plan', source: 'AP Plans Initiative — AP US History' }],
  },
};
