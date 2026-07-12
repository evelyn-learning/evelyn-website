/**
 * AP US History — CED Unit 8.9-8.10: The Civil Rights Movement.
 *
 * Period-8 content plan (follows the Period-3 calibration template — see
 * ap-apush-u3-causes-of-revolution.ts for the full rationale).
 *
 * DOCUMENT STIMULUS: REUSES evelyn.passage.apgov-brown-opinion.v1 (seeded
 * for AP Gov Unit 3; do NOT re-seed). Per that passage's own docblock, the
 * excerpt covers only: the "deprive... of equal educational opportunities"
 * question, the "generates a feeling of inferiority" finding, and the
 * "'separate but equal' has no place... inherently unequal" / Fourteenth
 * Amendment equal-protection conclusion. The worked example below quotes
 * and analyzes only that language — here reframed for its APUSH
 * significance (the doctrinal spark of a decade-long movement, not a
 * standalone con-law holding).
 *
 * COPYRIGHT NOTE — MARTIN LUTHER KING JR.: King's speeches (including his
 * address at the March on Washington) and his "Letter from Birmingham
 * Jail" (1963) are still under copyright. This plan describes their
 * context and argument structure ENTIRELY IN THE PLAN'S OWN WORDS — ZERO
 * quoted sentences from King's works appear anywhere below. The same
 * applies to Malcolm X: his ideas are described, never quoted.
 *
 * Sequence covered: Brown (1954) -> Montgomery Bus Boycott (1955-56) ->
 * Little Rock Nine (1957) -> sit-ins/Freedom Rides (1960-61) -> Birmingham
 * campaign (1963) -> March on Washington (Aug 1963) -> Civil Rights Act
 * (1964) / Voting Rights Act (1965) -> the movement's shift north and the
 * rise of Black Power (Malcolm X, described). Measured, exam-neutral tone
 * throughout on civil-rights-era violence and resistance.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APUSH_U8_CIVIL_RIGHTS: LessonPlan = {
  id: 'evelyn.ap.apush.civil-rights-movement.v1',
  title: 'U8.9-8.10 The Civil Rights Movement',
  curriculum: 'AP',
  grade: '11',
  subject: 'ss',
  topic: 'ap-us-history',
  locale: 'en',
  los: [
    {
      id: 'apush.civil-rights-movement',
      description:
        'Explain the course and significance of the civil rights movement, including Brown v. Board of Education, the Montgomery Bus Boycott, Little Rock, sit-ins and Freedom Rides, the Birmingham campaign, the March on Washington, the Civil Rights Act of 1964 and Voting Rights Act of 1965, the movement\'s later shift toward northern urban issues, and the rise of Black Power.',
      standard: 'AP-APUSH-8.9',
    },
  ],
  prerequisites: ['apush.postwar-society'],
  followUps: ['apush.sixties-vietnam'],
  estimatedMinutes: 24,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Get the student to see the civil rights movement as a decade-long sequence of escalating tactics by many organizations, not a single event or a single strategy.',
      script:
        "It's tempting to compress the civil rights movement into a single moment — a Court ruling, a speech, a march. But 1954 to 1965 was actually a decade-long chain: a Supreme Court ruling that changed the LAW but not, by itself, daily life; a bus boycott that showed ordinary people could sustain months of economic pressure; a school crisis that forced the federal government to choose between a governor and the Constitution; young people sitting at lunch counters and riding interstate buses specifically to provoke a legal crisis; a campaign in one of the most segregated cities in the country that finally moved national public opinion; and, only after all of that, two of the most significant federal statutes in American history. No single organization ran this whole sequence, and no single tactic won it. Today we trace how each stage built on the last — and why the movement didn't stop being complicated after 1965.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-civil-rights-sequence',
      kind: 'concept',
      goal: 'Explain the sequence of the civil rights movement from Brown through the Voting Rights Act, the context and argument structure of MLK\'s major works (described, not quoted), the movement\'s northern shift, and the rise of Black Power.',
      keyIdeas: [
        'BROWN V. BOARD OF EDUCATION (1954): the Supreme Court ruled that state-mandated racial segregation in public schools violates the Fourteenth Amendment\'s Equal Protection Clause, rejecting the "separate but equal" doctrine that had permitted segregation since Plessy v. Ferguson (1896). Brown established the constitutional PRINCIPLE, but did not by itself desegregate a single classroom — many Southern states and districts engaged in years of open resistance.',
        "THE MONTGOMERY BUS BOYCOTT (1955-56): after Rosa Parks was arrested for refusing to give up her bus seat to a white passenger, Montgomery's Black community organized a sustained boycott of the city bus system — lasting over a year — that demonstrated ordinary people, through disciplined economic pressure rather than legal argument alone, could force change. The boycott ended when the Supreme Court ruled Montgomery's bus segregation unconstitutional, and it launched a young minister, Martin Luther King Jr., to national leadership; he and other ministers organized the Southern Christian Leadership Conference (SCLC) the following year to coordinate further nonviolent campaigns.",
        "LITTLE ROCK (1957): when nine Black students (the \"Little Rock Nine\") attempted to enroll at previously all-white Central High School under a federal desegregation order, Arkansas's governor used the state National Guard to block them. President Eisenhower responded by federalizing the Guard and sending US Army troops to enforce the students' enrollment — showing that implementing Brown sometimes required direct federal force against a defiant state government.",
        "SIT-INS AND FREEDOM RIDES (1960-61): in February 1960, four Black college students sat down at a whites-only lunch counter in Greensboro, North Carolina, and refused to leave; the tactic spread rapidly to other cities, leading student activists to found the Student Nonviolent Coordinating Committee (SNCC) later that year. In 1961, activists organized by the Congress of Racial Equality (CORE) rode interstate buses into the Deep South specifically to test (and provoke federal enforcement of) court rulings desegregating interstate bus terminals — these \"Freedom Rides\" faced violent resistance in several cities, forcing federal intervention.",
        "THE BIRMINGHAM CAMPAIGN (1963): SCLC organized a major campaign of marches and sit-ins against segregation in Birmingham, Alabama, deliberately choosing a city known for harsh enforcement of segregation. Public Safety Commissioner Bull Connor's forceful response to the protests — including the arrest of large numbers of demonstrators, among them schoolchildren in what became known as the \"Children's Crusade\" — was widely covered by national media and shifted public opinion in the movement's favor. King was jailed during the campaign; his \"Letter from Birmingham Jail\" (described below, never quoted) was written in response to local clergy who had criticized the campaign's timing.",
        "MLK'S \"LETTER FROM BIRMINGHAM JAIL\" (1963) — DESCRIBED, NOT QUOTED: written from jail during the Birmingham campaign, responding to white clergymen who urged King to pursue change more slowly through courts and negotiation alone. King argues that a law is unjust — and thus one people have a moral responsibility to disobey openly, while accepting the legal penalty — when it degrades human dignity or is imposed on a group with no voice in enacting it. He defends nonviolent direct action as necessary because negotiation had repeatedly failed, describing its purpose as creating a crisis that forces a community which has refused to confront an issue voluntarily to finally negotiate it. He also criticizes moderates who prioritize order and a comfortable, gradual timeline over the substance of justice.",
        "THE MARCH ON WASHINGTON (August 1963): a coalition of civil rights organizations (SCLC, SNCC, NAACP, CORE, the National Urban League, and allied labor unions) organized a massive march for \"Jobs and Freedom\" in Washington, DC. King delivered the event's best-known address (described, not quoted here): built around the image of a promissory note the nation had failed to honor for Black Americans, and a closing vision of a future free of racial division, the speech is widely credited with building the political momentum behind the civil rights legislation that followed within a year.",
        "THE CIVIL RIGHTS ACT OF 1964 AND VOTING RIGHTS ACT OF 1965: the Civil Rights Act of 1964 prohibited discrimination in employment (Title VII) and public accommodations (e.g. restaurants, hotels), reaching PRIVATE conduct the Equal Protection Clause alone could not touch. The Voting Rights Act of 1965 — passed after the violently suppressed Selma-to-Montgomery march (\"Bloody Sunday,\" March 1965) drew national attention — banned literacy tests and other discriminatory voting barriers and authorized direct federal oversight of voting procedures in jurisdictions with a history of discrimination.",
        "THE MOVEMENT'S NORTHERN SHIFT: after 1965, King and others increasingly turned attention to entrenched Northern and urban problems — housing discrimination, unemployment, and de facto (not legally mandated, but real) segregation — that federal civil-rights statutes aimed mainly at the Jim Crow South did not directly address. Frustration over these unresolved conditions contributed to unrest in several Northern cities during the mid-to-late 1960s (e.g. Watts in 1965, Detroit and Newark in 1967).",
        "BLACK POWER AND MALCOLM X (DESCRIBED, NOT QUOTED): by the mid-1960s, some younger activists — including SNCC's Stokely Carmichael, who popularized the phrase \"Black Power\" in 1966 — grew frustrated with the pace of change under strictly nonviolent, integrationist strategies and turned toward Black self-determination, racial pride, and in some cases separatism. Malcolm X, a minister associated for years with the Nation of Islam and later an independent voice after a 1964 pilgrimage to Mecca that revised some of his earlier views, argued (in his own words, not reproduced here) that Black Americans had a right to self-defense against violence and should build independent economic and political power rather than relying solely on appeals to white conscience; he was assassinated in February 1965. Black Power did not replace the earlier nonviolent movement so much as represent a parallel and, at times, competing current within it.",
      ],
      vocabulary: [
        {
          term: '"separate but equal"',
          definition:
            'the doctrine from Plessy v. Ferguson (1896) permitting state-mandated racial segregation if facilities were nominally equal; rejected by Brown v. Board of Education (1954) as "inherently unequal."',
        },
        {
          term: 'Southern Christian Leadership Conference (SCLC)',
          definition:
            "organization founded in 1957 by Martin Luther King Jr. and allied ministers, following the Montgomery Bus Boycott, to coordinate nonviolent direct-action campaigns across the South.",
        },
        {
          term: 'Student Nonviolent Coordinating Committee (SNCC)',
          definition:
            'organization founded in 1960 by student activists involved in the sit-in movement; later, under leaders like Stokely Carmichael, moved toward Black Power politics by the mid-1960s.',
        },
        {
          term: 'Civil Rights Act of 1964',
          definition:
            'federal statute prohibiting discrimination based on race, color, religion, sex, and national origin in employment (Title VII) and public accommodations — reaching private conduct the Equal Protection Clause alone could not.',
        },
        {
          term: 'Voting Rights Act of 1965',
          definition:
            'federal statute banning literacy tests and similar discriminatory voting barriers and authorizing direct federal oversight of voting procedures in jurisdictions with a history of discrimination.',
        },
        {
          term: 'Black Power',
          definition:
            "a phrase popularized by Stokely Carmichael in 1966, describing a current within the movement emphasizing Black self-determination, racial pride, and (for some) separatism, distinct from strictly integrationist nonviolence.",
        },
      ],
      passageId: 'evelyn.passage.apgov-brown-opinion.v1',
      estimatedMinutes: 8,
    },
    {
      id: 'worked-brown-as-movement-spark',
      kind: 'worked_example',
      problem:
        'Analyze this excerpt from the Supreme Court\'s opinion in Brown v. Board of Education, 347 U.S. 483 (1954): "We come then to the question presented: Does segregation of children in public schools solely on the basis of race, even though the physical facilities and other \'tangible\' factors may be equal, deprive the children of the minority group of equal educational opportunities? We believe that it does. ... To separate them from others of similar age and qualifications solely because of their race generates a feeling of inferiority as to their status in the community that may affect their hearts and minds in a way unlikely ever to be undone. We conclude that in the field of public education the doctrine of \'separate but equal\' has no place. Separate educational facilities are inherently unequal. ... [D]eprived of the equal protection of the laws guaranteed by the Fourteenth Amendment." (a) What harm does the Court identify beyond any gap in physical facilities? (b) Why, historically, was this ruling only the BEGINNING of the civil rights movement rather than its conclusion?',
      steps: [
        'SOURCE IT. Chief Justice Earl Warren\'s opinion of the Court, 1954, the ruling that segregated public schools violate Equal Protection.',
        'IDENTIFY THE HARM. The Court finds that separating children "solely because of their race generates a feeling of inferiority as to their status in the community" that may never "be undone" — a psychological and social harm, not merely an inequality of buildings or books. This means the ruling rejects segregation even where facilities are nominally equal.',
        'IDENTIFY THE HOLDING. The Court concludes "the doctrine of \'separate but equal\' has no place" because "separate educational facilities are inherently unequal," grounding this in the Fourteenth Amendment\'s equal-protection guarantee.',
        'EXPLAIN WHY THIS WAS ONLY THE BEGINNING. Brown declared a constitutional PRINCIPLE about public schools — it did not, by itself, desegregate a single classroom, provide any enforcement timeline, or address discrimination outside public education (private businesses, employment, voting). Many states and school districts resisted for years, sometimes only complying after further court orders and federal enforcement (as at Little Rock in 1957).',
        'CONNECT TO THE MOVEMENT\'S NEXT DECADE. Because Brown left implementation and every other form of discrimination (transportation, lunch counters, voting, employment) untouched, the following decade of organizing — the Montgomery boycott, Little Rock, sit-ins, Freedom Rides, Birmingham, the March on Washington — was necessary to convert Brown\'s legal principle into changed practice and, eventually, new federal statutes (the Civil Rights Act of 1964, the Voting Rights Act of 1965) that reached far beyond what Brown alone ever addressed.',
      ],
      answer:
        "The Court identifies a psychological and social harm beyond any gap in physical facilities: separating children by race \"generates a feeling of inferiority as to their status in the community\" that may never be undone, which is why \"separate but equal\" is rejected outright as \"inherently unequal\" under the Fourteenth Amendment's Equal Protection Clause. But Brown was only the beginning of the movement because it established a constitutional PRINCIPLE about public schools specifically — it did not desegregate a single classroom by itself, set no enforcement timeline, and said nothing about segregation in transportation, restaurants, employment, or voting. The following decade of organizing (Montgomery, Little Rock, sit-ins, Freedom Rides, Birmingham, the March on Washington) was required to turn Brown's legal principle into changed practice and, eventually, into new federal statutes reaching well beyond what the ruling itself covered.",
      estimatedMinutes: 5,
    },
    {
      id: 'try-saq',
      kind: 'try_yourself',
      problem:
        "SAQ practice. (a) Briefly describe ONE specific event or campaign in the civil rights movement between 1955 and 1965. (b) Briefly explain ONE way that event or campaign built political pressure toward federal civil rights legislation. (c) Briefly explain ONE way the movement's goals or methods shifted after 1965.",
      responseFormat: 'frq',
      rubric: {
        parts: [
          {
            criterionId: 'a',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): correctly and specifically describes a genuine civil rights movement event/campaign — e.g. the Montgomery Bus Boycott (1955-56), Little Rock (1957), the Greensboro sit-ins (1960), the Freedom Rides (1961), or the Birmingham campaign (1963). No credit for a vague statement with no specific event named.',
            modelResponse:
              'One event was the Montgomery Bus Boycott (1955-56), a sustained boycott of Montgomery\'s city bus system organized after Rosa Parks was arrested for refusing to give up her seat to a white passenger.',
          },
          {
            criterionId: 'b',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains a specific way the event named in (a) built pressure toward federal legislation (public attention, court rulings, national leadership emergence, etc.), connected clearly to that event. No credit for evidence unconnected to the stated event.',
            modelResponse:
              "The boycott's success — sustained for over a year and ended only after the Supreme Court ruled Montgomery's bus segregation unconstitutional — demonstrated that disciplined, nonviolent mass action could force real change, and it launched Martin Luther King Jr. to national leadership, building organizational and public momentum for the larger campaigns (Birmingham, the March on Washington) that directly preceded the Civil Rights Act of 1964.",
          },
          {
            criterionId: 'c',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains a specific, accurate post-1965 shift — e.g. the movement\'s turn toward Northern urban issues (housing, employment, de facto segregation) or the rise of Black Power (Stokely Carmichael, SNCC\'s shift, or Malcolm X\'s ideas described in the student\'s own words). No credit for a vague or inaccurate contrast.',
            modelResponse:
              'After 1965, the movement increasingly turned attention to Northern and urban problems — housing discrimination, unemployment, and de facto segregation — that federal statutes aimed mainly at the Jim Crow South had not directly addressed, and some activists, including SNCC under Stokely Carmichael, shifted toward "Black Power" politics emphasizing Black self-determination and racial pride rather than relying solely on integrationist, strictly nonviolent strategies.',
          },
        ],
      },
      estimatedMinutes: 5,
    },
    {
      id: 'misconception-single-organization',
      kind: 'misconception_check',
      question:
        'True or false: the civil rights movement was essentially a single organization led by one person, pursuing one consistent strategy from 1954 to 1965.',
      commonErrors: [
        {
          answer: 'true',
          misconception:
            "Collapsing a broad, multi-organizational movement into a single iconic leader and moment, rather than recognizing the distinct organizations, strategies, and internal disagreements that actually made up the movement.",
          correctsTo:
            "FALSE. The civil rights movement involved multiple organizations pursuing overlapping but distinct strategies: the NAACP's long-running legal strategy (culminating in Brown), the SCLC's nonviolent direct action under Martin Luther King Jr. (Montgomery, Birmingham), SNCC's student-led organizing (sit-ins, later shifting toward Black Power under Stokely Carmichael), and CORE's direct-action tactics (the Freedom Rides). These groups sometimes cooperated closely (as in the March on Washington coalition) and sometimes disagreed sharply over pace and method — and by the mid-1960s, competing currents like Black Power (and figures like Malcolm X) offered real alternatives to strictly nonviolent, integrationist strategy. Treating the movement as one leader with one strategy erases this internal diversity and the real debates within it.",
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Brown v. Board (1954) established the constitutional principle against school segregation but did not, by itself, change daily practice — implementation required a decade of further organizing.',
        'Montgomery (1955-56), Little Rock (1957), sit-ins/Freedom Rides (1960-61), and Birmingham (1963) each escalated tactics and built the pressure behind the Civil Rights Act of 1964 and Voting Rights Act of 1965.',
        "MLK's \"Letter from Birmingham Jail\" and March on Washington address (described here, never quoted) argued for nonviolent direct action against the risk of endless, comfortable gradualism.",
        'The Civil Rights Act of 1964 (private conduct) and Voting Rights Act of 1965 (voting barriers, federal oversight) extended protection by statute beyond what Brown\'s constitutional holding alone reached.',
        'After 1965 the movement shifted toward Northern/urban issues, and Black Power (Carmichael, Malcolm X) offered a parallel, sometimes competing current to strictly nonviolent, integrationist strategy — the movement was never a single organization with one strategy.',
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '8',
    cedTopic: '8.9-8.10',
    cedTitle: 'The Civil Rights Movement',
    sources: [
      { type: 'plan', source: 'AP Plans Initiative — AP US History' },
      {
        type: 'passage',
        book: 'evelyn.passage.apgov-brown-opinion.v1',
        chapter: '1954',
        note: 'Brown v. Board of Education opinion excerpt (REUSED from AP Gov Unit 3) — anchor document reframed for its role as the doctrinal spark of the civil rights movement.',
      },
    ],
  },
};
