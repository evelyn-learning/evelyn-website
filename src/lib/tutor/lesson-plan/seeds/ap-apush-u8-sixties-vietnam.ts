/**
 * AP US History — CED Unit 8.7-8.8/8.11-8.13: The Sixties, the Great
 * Society, and Vietnam.
 *
 * Period-8 content plan (follows the Period-3 calibration template — see
 * ap-apush-u3-causes-of-revolution.ts for the full rationale).
 *
 * Anchor text: Lyndon Johnson's May 22, 1964 remarks at the University of
 * Michigan — evelyn.passage.apush-lbj-great-society.v1. The passage's own
 * fullText marks an internal ellipsis between the vision-statement
 * paragraphs and the closing "not a safe harbor" line (a short passage on
 * renewing contact with nature is elided between them); the worked example
 * below preserves that ellipsis explicitly and NEVER presents the two
 * segments as adjacent, unbroken prose.
 *
 * COPYRIGHT NOTE — SDS / PORT HURON STATEMENT (1962): still under
 * copyright. Described in the plan's own words only; ZERO quoted text
 * appears anywhere below.
 *
 * Covers: JFK's New Frontier -> LBJ's Great Society (War on Poverty,
 * Medicare/Medicaid, ESEA, Immigration and Nationality Act of 1965) ->
 * Gulf of Tonkin (1964) -> escalation -> Tet Offensive (1968) -> antiwar
 * movement and counterculture (SDS/Port Huron, described) -> the watershed
 * year 1968 -> Nixon's "silent majority."
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APUSH_U8_SIXTIES_VIETNAM: LessonPlan = {
  id: 'evelyn.ap.apush.sixties-vietnam.v1',
  title: 'U8.7-8.8/8.11-8.13 The Sixties, the Great Society, and Vietnam',
  curriculum: 'AP',
  grade: '11',
  subject: 'ss',
  topic: 'ap-us-history',
  locale: 'en',
  los: [
    {
      id: 'apush.sixties-vietnam',
      description:
        'Explain JFK\'s New Frontier and LBJ\'s Great Society programs, the escalation of American involvement in Vietnam from the Gulf of Tonkin through the Tet Offensive, the antiwar movement and counterculture, and the political consequences of the watershed year 1968.',
      standard: 'AP-APUSH-8.11',
    },
  ],
  prerequisites: ['apush.cold-war-origins', 'apush.civil-rights-movement'],
  followUps: ['apush.seventies-crisis'],
  estimatedMinutes: 24,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Get the student to see 1964-68 as the moment the most ambitious domestic reform program of the century and the most divisive war of the century happened at the SAME TIME, under the SAME president.',
      script:
        "In a single stretch of a few years, the same American president signed into law federal health insurance for the elderly, the first major federal aid to public schools, and an immigration law that reopened the country to the world after four decades of restriction — one of the most ambitious bursts of domestic legislation in US history. That same president also escalated a war in Vietnam from a few thousand military advisers to hundreds of thousands of combat troops, a war that would eventually help drive him from office. Those two stories — the Great Society and the Vietnam War — are usually taught separately, but they happened in the same years, under the same administration, competing for the same federal budget and the same public attention. Today we trace both, and how one increasingly crowded out the other by 1968.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-great-society-and-vietnam',
      kind: 'concept',
      goal: 'Explain JFK\'s New Frontier, LBJ\'s Great Society programs, the escalation of the Vietnam War from Tonkin to Tet, the antiwar movement and counterculture, and the political fallout of 1968.',
      keyIdeas: [
        "JFK'S NEW FRONTIER: President Kennedy's domestic and foreign-policy agenda included the Peace Corps (sending young American volunteers abroad) and a public commitment to land an American on the Moon by the end of the 1960s, framed partly as Cold War competition with the Soviet Union. Much of Kennedy's more ambitious domestic legislation stalled in Congress; he was assassinated in Dallas in November 1963, and Vice President Lyndon Johnson succeeded him.",
        "THE GREAT SOCIETY — MORE THAN POVERTY: Johnson, elected in his own right in a landslide in 1964, used his legislative skill and the national mood after Kennedy's assassination to push through the most ambitious burst of federal social legislation since the New Deal. Its scope went well beyond poverty alone: the War on Poverty (Economic Opportunity Act, 1964, creating Job Corps, VISTA, and Head Start); Medicare (federal health insurance for the elderly) and Medicaid (health coverage for the poor), both 1965; the Elementary and Secondary Education Act (ESEA, 1965), the first major federal aid to public schools; the Immigration and Nationality Act of 1965, which ended the discriminatory national-origins quota system in place since the 1920s and opened immigration much more broadly from Asia, Latin America, and Africa; and new federal agencies for the arts (the National Endowment for the Arts/Humanities), consumer protection, and environmental and urban policy. The Civil Rights Act (1964) and Voting Rights Act (1965) were also part of this same legislative burst.",
        "THE GULF OF TONKIN (1964) AND ESCALATION: after reported (and later disputed) naval clashes between US and North Vietnamese ships in the Gulf of Tonkin in August 1964, Congress passed the Gulf of Tonkin Resolution, granting the president broad authority to use military force in Vietnam without a formal declaration of war. Johnson used this authority to escalate US involvement dramatically in 1965 — a sustained bombing campaign (Operation Rolling Thunder) and the commitment of American combat ground troops, growing to several hundred thousand by the late 1960s.",
        "THE TET OFFENSIVE (JANUARY 1968): North Vietnamese and Viet Cong forces launched a massive, coordinated surprise offensive across South Vietnam during the Tet (Lunar New Year) holiday, briefly seizing territory including part of the US embassy grounds in Saigon before being pushed back with heavy losses. Tet was a MILITARY defeat for the Communist forces, but it was a POLITICAL/psychological turning point in the United States: after years of official assurances that the war was being won, the offensive's scale badly damaged American public confidence in that claim, accelerating the decline in support for the war.",
        "THE ANTIWAR MOVEMENT AND COUNTERCULTURE: opposition to the war grew steadily through the mid-to-late 1960s — campus teach-ins, mass demonstrations, and draft resistance. Students for a Democratic Society (SDS), a student activist organization founded in 1960, articulated its founding vision in the Port Huron Statement (1962) — described here in the plan's own words, never quoted — which called for greater \"participatory democracy\" and criticized both Cold War militarism and what it saw as the complacency of mainstream Cold War-era liberalism. A broader youth counterculture, extending beyond organized antiwar politics, rejected mainstream consumerism and social conventions in favor of alternative lifestyles, communal living, and experimentation.",
        "1968 — THE WATERSHED YEAR: after the political shock of Tet, President Johnson announced in March 1968 that he would not seek reelection. Martin Luther King Jr. was assassinated in Memphis in April 1968; Senator Robert F. Kennedy, a leading Democratic presidential candidate, was assassinated in June 1968 shortly after winning California's primary. The Democratic National Convention in Chicago that August was marked by chaotic clashes between antiwar protesters and police. Republican Richard Nixon won the November election on a platform emphasizing law and order and a promise to end the war, narrowly defeating the Democratic nominee amid a fractured, exhausted political landscape.",
        "THE \"SILENT MAJORITY\": as president, Nixon appealed directly to Americans he described as a \"silent majority\" — those who, in his framing, quietly supported a gradual, negotiated American withdrawal from Vietnam (a policy of \"Vietnamization,\" shifting combat responsibility to South Vietnamese forces) rather than joining the vocal antiwar protests that dominated media coverage.",
      ],
      vocabulary: [
        {
          term: 'Great Society',
          definition:
            "LBJ's ambitious program of federal social legislation (1964-65) including the War on Poverty, Medicare/Medicaid, federal aid to education (ESEA), and the Immigration and Nationality Act of 1965 — far broader than anti-poverty measures alone.",
        },
        {
          term: 'Gulf of Tonkin Resolution',
          definition:
            '1964 congressional resolution, passed after reported naval clashes with North Vietnam, granting the president broad authority to use military force in Vietnam without a formal declaration of war.',
        },
        {
          term: 'Tet Offensive',
          definition:
            'a January 1968 surprise offensive by Communist forces across South Vietnam; a military defeat for the attackers but a major political/psychological blow to American public confidence in the war effort.',
        },
        {
          term: 'Students for a Democratic Society (SDS)',
          definition:
            "a student activist organization (founded 1960) whose Port Huron Statement (1962) called for greater \"participatory democracy\" and criticized Cold War militarism and mainstream political complacency.",
        },
        {
          term: '"silent majority"',
          definition:
            "Nixon's term for Americans he described as quietly supporting a gradual, negotiated end to the Vietnam War, in contrast to the vocal, visible antiwar protest movement.",
        },
      ],
      passageId: 'evelyn.passage.apush-lbj-great-society.v1',
      estimatedMinutes: 8,
    },
    {
      id: 'worked-great-society-vision',
      kind: 'worked_example',
      problem:
        'Analyze this excerpt from Lyndon Johnson\'s remarks at the University of Michigan, May 22, 1964: "The Great Society rests on abundance and liberty for all. It demands an end to poverty and racial injustice, to which we are totally committed in our time. But that is just the beginning. The Great Society is a place where every child can find knowledge to enrich his mind and to enlarge his talents. It is a place where leisure is a welcome chance to build and reflect, not a feared cause of boredom and restlessness. It is a place where the city of man serves not only the needs of the body and the demands of commerce but the desire for beauty and the hunger for community. ... But most of all, the Great Society is not a safe harbor, a resting place, a final objective, a finished work. It is a challenge constantly renewed, beckoning us toward a destiny where the meaning of our lives matches the marvelous products of our labor." (Note: the ellipsis marks text Johnson delivered between these two sections, not reproduced here.) (a) According to this excerpt, is the Great Society only about ending poverty? (b) Why does Johnson insist, at the end, that it is not a "finished work"?',
      steps: [
        'SOURCE IT. Johnson\'s commencement address at the University of Michigan, May 22, 1964 — the speech in which he first laid out the "Great Society" vision, months before the legislative program (Medicare, ESEA, immigration reform) that would implement it.',
        'ANSWER (a) DIRECTLY FROM THE TEXT. Johnson does name "an end to poverty and racial injustice" — but he immediately adds "that is just the beginning," and then describes a much broader vision: children finding "knowledge to enrich" their minds (education), leisure as "a welcome chance to build and reflect" (quality of life, not just material need), and cities serving "the desire for beauty and the hunger for community" (urban and civic life). Poverty is named, but explicitly framed as only one part of a far larger vision.',
        'CONNECT TO THE ACTUAL LEGISLATIVE PROGRAM. This broader framing matches what the Great Society became in practice: not just the War on Poverty, but Medicare/Medicaid (health care), ESEA (education), the Immigration and Nationality Act of 1965 (immigration policy), and new environmental, consumer, and arts agencies — confirming that Johnson\'s vision here was not merely rhetorical breadth but a preview of the actual scope of the legislation that followed within the next two years.',
        'ANSWER (b). Johnson closes by insisting the Great Society is "not a safe harbor, a resting place, a final objective, a finished work" but "a challenge constantly renewed." This frames the vision as an ONGOING, open-ended commitment rather than a finite checklist of programs to complete and then stop — consistent with how ambitiously the actual legislative agenda kept expanding through 1965-66.',
        'STATE THE LINK TO THE COURSE THESIS. Read this way, the speech previews both the genuine breadth of the Great Society (well beyond poverty) and the political vulnerability of an open-ended, ever-expanding federal commitment — one that would soon have to compete for funding and attention with an escalating war in Vietnam.',
      ],
      answer:
        'No — the excerpt explicitly frames ending "poverty and racial injustice" as "just the beginning," then describes a much broader vision covering education ("knowledge to enrich [the] mind"), quality of life and leisure, and civic/urban life ("the desire for beauty and the hunger for community"). This matches the actual scope of the Great Society legislation that followed: not just the War on Poverty, but Medicare/Medicaid, federal aid to education (ESEA), and the Immigration and Nationality Act of 1965, among other programs. Johnson insists the Great Society is not a "finished work" because he frames it as an open-ended, ongoing national commitment rather than a fixed checklist of programs — a framing that matches how the legislative agenda kept expanding through 1965-66, but also one that would prove vulnerable once the Vietnam War began competing for the same federal budget and political attention.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-saq',
      kind: 'try_yourself',
      problem:
        "SAQ practice. (a) Briefly describe ONE Great Society program besides the War on Poverty. (b) Briefly explain ONE specific step in the escalation of US involvement in Vietnam between 1964 and 1968. (c) Briefly explain ONE way 1968 marked a turning point in American politics.",
      responseFormat: 'frq',
      rubric: {
        parts: [
          {
            criterionId: 'a',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): correctly and specifically describes a genuine Great Society program other than the War on Poverty — e.g. Medicare, Medicaid, the Elementary and Secondary Education Act (1965), or the Immigration and Nationality Act of 1965. No credit for restating the War on Poverty or a vague statement with no specific program named.',
            modelResponse:
              'One Great Society program was Medicare (1965), which created federal health insurance for Americans age 65 and older, alongside the related Medicaid program providing health coverage for the poor.',
          },
          {
            criterionId: 'b',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains a specific, accurate escalation step — e.g. the Gulf of Tonkin Resolution (1964), Operation Rolling Thunder / the commitment of US combat ground troops (1965), or the Tet Offensive (1968) as the turning point in public opinion. No credit for a vague or unconnected claim.',
            modelResponse:
              'After reported naval clashes in the Gulf of Tonkin in August 1964, Congress passed the Gulf of Tonkin Resolution granting the president broad authority to use military force in Vietnam without a formal declaration of war, which Johnson used to begin a sustained bombing campaign and commit American combat ground troops starting in 1965.',
          },
          {
            criterionId: 'c',
            maxPoints: 1,
            scoringCriteria:
              "Full credit (1): explains a specific, accurate way 1968 marked a turning point — e.g. the Tet Offensive undermining confidence in the war, LBJ's withdrawal from the presidential race, the assassinations of MLK and RFK, the chaotic Democratic convention, or Nixon's election on a law-and-order platform. No credit for a vague claim with no specific event named.",
            modelResponse:
              "1968 marked a turning point because the Tet Offensive in January badly damaged public confidence in official claims that the war was being won, leading President Johnson to announce in March that he would not seek reelection; combined with the assassinations of Martin Luther King Jr. and Robert F. Kennedy and a chaotic Democratic National Convention that summer, this instability helped Republican Richard Nixon win the presidency that November on a law-and-order platform.",
          },
        ],
      },
      estimatedMinutes: 5,
    },
    {
      id: 'misconception-great-society-only-poverty',
      kind: 'misconception_check',
      question:
        'True or false: the Great Society was essentially just an anti-poverty program.',
      commonErrors: [
        {
          answer: 'true',
          misconception:
            'Reducing the entire Great Society legislative agenda to its most famous single component (the War on Poverty), rather than recognizing the much broader scope of federal legislation Johnson pursued under that name.',
          correctsTo:
            'FALSE. The War on Poverty (Economic Opportunity Act, 1964) was only one part of the Great Society. The same legislative burst also created Medicare and Medicaid (1965, health care for the elderly and the poor), the Elementary and Secondary Education Act (1965, the first major federal aid to public schools), the Immigration and Nationality Act of 1965 (ending the discriminatory national-origins quota system), and new federal agencies for the arts, consumer protection, and environmental and urban policy — alongside the Civil Rights Act (1964) and Voting Rights Act (1965). Johnson\'s own May 1964 speech at the University of Michigan explicitly framed ending poverty as "just the beginning" of a much larger vision covering education, civic life, and quality of life generally. Reducing the Great Society to poverty policy alone significantly understates its scope.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        "LBJ's Great Society (1964-66) went well beyond the War on Poverty: Medicare/Medicaid, ESEA (federal aid to education), and the Immigration and Nationality Act of 1965 were all part of the same legislative burst.",
        'The Gulf of Tonkin Resolution (1964) gave Johnson broad authority to escalate US involvement in Vietnam without a formal declaration of war; combat troops and sustained bombing followed in 1965.',
        'The Tet Offensive (January 1968) was a military defeat for Communist forces but a major political/psychological turning point that damaged American public confidence in the war.',
        "SDS's Port Huron Statement (1962, described here, never quoted) called for \"participatory democracy\" and criticized Cold War militarism, part of a broader antiwar/counterculture current.",
        '1968 was a watershed: Tet, LBJ\'s withdrawal from the race, the assassinations of MLK and RFK, the chaotic Democratic convention, and Nixon\'s election appealing to a "silent majority."',
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '8',
    cedTopic: '8.7-8.8/8.11-8.13',
    cedTitle: 'The Sixties, the Great Society, and Vietnam',
    sources: [
      { type: 'plan', source: 'AP Plans Initiative — AP US History' },
      {
        type: 'passage',
        book: 'evelyn.passage.apush-lbj-great-society.v1',
        chapter: '1964',
        note: 'LBJ\'s University of Michigan remarks — anchor document for the Great Society\'s breadth beyond anti-poverty policy.',
      },
    ],
  },
};
