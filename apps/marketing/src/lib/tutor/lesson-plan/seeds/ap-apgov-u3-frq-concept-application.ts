/**
 * AP US Government & Politics — Unit 3 FRQ Practice: Concept Application
 * (AP Gov FRQ 1) — 3 points, one point per lettered part, no stimulus
 * document.
 *
 * Format (per the authentic AP Gov Concept Application FRQ): a short,
 * non-partisan hypothetical political scenario, followed by three parts —
 * (A) DESCRIBE a course concept the scenario illustrates, (B) EXPLAIN how
 * that concept, in the context of the scenario, affects a political
 * institution or behavior, and (C) EXPLAIN how a different course
 * principle could be used to respond to the situation. NO
 * passageId/passageIds — the scenario is entirely self-contained prose;
 * every modelResponse answers strictly from the scenario text.
 *
 * Scenario draws on the Unit-3 religion/speech and press/assembly/arms
 * content plans (ap-apgov-u3-religion-speech.ts,
 * ap-apgov-u3-press-assembly-arms.ts): a public-school student's T-shirt
 * and silent lunchtime sit-in raise the First Amendment free-speech and
 * assembly issue for part (A), the required case Tinker v. Des Moines
 * (1969) substantial-disruption standard for part (B), and a school
 * district's constitutional counterargument for part (C).
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APGOV_U3_FRQ_CONCEPT_APPLICATION: LessonPlan = {
  id: 'evelyn.ap.apgov.u3-frq-concept-application.v1',
  title: 'Unit 3 FRQ Practice — Concept Application',
  curriculum: 'AP',
  grade: '12',
  subject: 'ss',
  topic: 'ap-us-government',
  locale: 'en',
  los: [
    {
      id: 'apgov.u3-frq-concept-application',
      description:
        'Answer a complete AP Gov Concept Application free-response question — a short non-partisan scenario about a suspended student\'s T-shirt and silent sit-in — describing the First Amendment free-speech and assembly provision at issue, explaining the required case Tinker v. Des Moines\'s substantial-disruption standard in context, and explaining how a school district could argue its policy is constitutional despite that standard — scored against the authentic AP Gov 3-point Concept Application rubric (1 point per part).',
      standard: 'AP-APGOV-3-FRQ-CA',
    },
  ],
  prerequisites: ['apgov.religion-speech-liberties', 'apgov.press-assembly-arms'],
  followUps: [],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the stakes of the shortest AP Gov FRQ format concrete for a school-speech scenario, and correct the instinct to write a mini-essay when the task wants three tight, targeted answers.',
      script:
        "Of the four free-response questions on the AP Gov exam, Concept Application is the shortest — just 3 points — but it trips up more students than its length suggests. You'll get a short political scenario, usually invented and deliberately non-partisan, and three parts: describe a concept the scenario illustrates, explain how that concept affects something in the scenario, and explain how a completely different course principle could respond to what's happening. Unit 3's version of this trap often shows up around student speech, where students blur together \"the First Amendment protects it\" with \"the school can never restrict it,\" missing that the real test — from the required case Tinker v. Des Moines — asks whether the speech would materially and substantially disrupt school operations. Today's scenario is a student suspended for both a T-shirt and a silent sit-in protesting a new cell-phone ban — and you'll answer all three parts the way an AP reader would score them, part by part.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-ca-task-and-rubric',
      kind: 'concept',
      goal: 'Frame exactly what each part of the Concept Application FRQ asks for and how the 3-point, one-point-per-part rubric awards credit.',
      keyIdeas: [
        'THE TASK: you get a short, invented, non-partisan political scenario (never a real current event) and three parts, each worth 1 point and graded independently. There is no thesis, no contextualization, no document — this format tests whether you can APPLY course concepts to a new, concrete situation, not whether you can recite a definition in the abstract.',
        'PART (A) — DESCRIBE (0-1 point): "describe" is a lower bar than "explain" but still higher than "name." Full credit requires stating what the constitutional provision IS and connecting it to the specific tension in the scenario — not just dropping "First Amendment" with no elaboration.',
        'PART (B) — EXPLAIN THE STANDARD IN CONTEXT (0-1 point): "explain" always means applying a rule to specific facts, not restating the rule alone. Full credit requires stating Tinker v. Des Moines\'s substantial-disruption standard (schools may restrict student expression only if it would materially and substantially interfere with school discipline; mere apprehension of disturbance is not enough) AND applying it to the scenario\'s specific facts (the T-shirt, the silent sit-in), not a textbook restatement of Tinker with no connection to this scenario.',
        'PART (C) — EXPLAIN A COUNTERARGUMENT (0-1 point): full credit requires explaining how the school district could argue its policy is constitutional DESPITE the Tinker standard — for example, arguing the sit-in itself created an actual or reasonably forecasted disruption to cafeteria operations, or that the code provision is a viewpoint-neutral, generally applicable rule about a limited forum. Full credit requires a plausible constitutional argument tied to the scenario, not a bare assertion that the school "has authority."',
        'THE SINGLE MOST COMMON WAY TO LOSE POINTS: naming a case or clause without describing/explaining it ("this is a First Amendment issue" and nothing more), or reciting Tinker\'s standard in the abstract without applying it to the scenario\'s specific facts.',
        'Total = 3 points, one per part, each graded independently — missing part (a) does not cost you credit on (b) or (c). This is the authentic AP Gov Concept Application scale.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'try-concept-application-frq',
      kind: 'try_yourself',
      problem:
        "Read the scenario and answer parts (A), (B), and (C).\n\nA public school district adopts a new policy banning student cell phone use anywhere on school grounds. A student, Maya, wears a T-shirt to school printed with the slogan \"MY PHONE, MY CHOICE — REPEAL THE BAN.\" The same week, Maya organizes a silent sit-in during the lunch period: about thirty students sit together at one long cafeteria table, say nothing, eat their lunches as usual, and hold small printed signs with the same slogan. School administrators suspend Maya for three days, citing a student-conduct provision barring \"campaigns against school policy on school grounds\" for both the T-shirt and the sit-in. Maya's parents sue the district, arguing the suspension violates her constitutional rights.\n\n(A) Describe the constitutional provision at issue in the scenario.\n(B) In the context of the scenario, explain the standard from a required Supreme Court case a court would apply to Maya's T-shirt and sit-in.\n(C) Explain how the school district could argue its policy is constitutional despite that standard.",
      responseFormat: 'frq',
      expectedAnswer:
        "(A) The provision at issue is the First Amendment's protection of freedom of speech, which the Supreme Court has long held extends to public school students and to symbolic or expressive conduct, not just spoken or written words — meaning both Maya's slogan T-shirt and her organized, sign-holding sit-in are the kind of expressive activity the First Amendment presumptively protects, even though the school is a government actor with some authority to regulate conduct on its own campus. (B) The required standard is Tinker v. Des Moines (1969): public school students do not \"shed their constitutional rights... at the schoolhouse gate,\" and a school may restrict student expression only if it would \"materially and substantially interfere with the requirements of appropriate discipline in the operation of the school\" — mere \"undifferentiated fear or apprehension of disturbance\" is not enough. Applied here, Maya's T-shirt is passive, silent clothing exactly like Tinker's armbands, and her sit-in was silent, seated, and did not stop students from eating lunch as usual, so under Tinker's standard a court would likely find no actual or reasonably forecasted substantial disruption, making the suspension constitutionally vulnerable. (C) The district could argue that, unlike Tinker's passive armbands, the sit-in actually disrupted the cafeteria's normal operation — for example, that thirty students occupying one table slowed the lunch line, required additional staff supervision, or generated disciplinary reports — meeting Tinker's own substantial-disruption bar rather than falling short of it, and that its conduct code provision is a viewpoint-neutral, generally applicable rule about organized campaigning in the cafeteria during a limited, orderly lunch period, not a restriction aimed at Maya's particular message.",
      rubric: {
        parts: [
          {
            criterionId: 'A-describe',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): describes — more than simply names — the First Amendment free-speech provision at issue, connecting it to the scenario\'s specific facts (the T-shirt and the sit-in as forms of student expression). No credit (0/1) for naming "the First Amendment" or "free speech" with no description, or a description with no connection to the scenario.',
            modelResponse:
              "The provision at issue is the First Amendment's protection of freedom of speech, which extends to public school students and to symbolic or expressive conduct, not just spoken or written words — meaning Maya's slogan T-shirt and her organized, sign-holding sit-in are both the kind of expressive activity the First Amendment presumptively protects against a government-run school's restriction.",
          },
          {
            criterionId: 'B-explain-standard',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): explains Tinker v. Des Moines\'s substantial-disruption standard (schools may restrict student expression only if it would materially and substantially interfere with school discipline; mere apprehension of disturbance is not enough) AND applies it to the scenario\'s specific facts (the passive T-shirt, the silent sit-in). No credit (0/1) for stating Tinker\'s standard in the abstract with no application to Maya\'s facts, or for citing the wrong case/standard.',
            modelResponse:
              "The required standard is Tinker v. Des Moines (1969): a school may restrict student expression only if it would \"materially and substantially interfere with the requirements of appropriate discipline in the operation of the school,\" and mere \"undifferentiated fear or apprehension of disturbance\" is not enough. Maya's T-shirt is passive, silent clothing much like Tinker's armbands, and her sit-in was silent, seated, and did not stop lunch from proceeding as usual, so under this standard a court would likely find no actual or reasonably forecasted substantial disruption.",
          },
          {
            criterionId: 'C-explain-counter',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): explains a plausible constitutional argument, tied to the scenario, for why the district\'s policy could survive Tinker\'s standard — e.g., that the sit-in caused an actual or reasonably forecasted disruption to cafeteria operations, or that the rule is a viewpoint-neutral, generally applicable restriction on organized campaigning in a limited forum. No credit (0/1) for a bare assertion of school authority with no constitutional reasoning tied to the facts.',
            modelResponse:
              "The district could argue that, unlike Tinker's passive armbands, the sit-in actually disrupted the cafeteria's normal operation — thirty students occupying one table could slow the lunch line, require additional staff supervision, or generate disciplinary reports — satisfying Tinker's own substantial-disruption bar rather than falling short of it, and that its conduct-code provision is a viewpoint-neutral, generally applicable rule about organized campaigning during a limited, orderly lunch period rather than a restriction targeting Maya's particular message.",
          },
        ],
      },
      hints: [
        'Each part is its own answer — don\'t blend (A), (B), and (C) into one paragraph.',
        '"Describe" wants the provision plus the scenario detail that shows it; "explain" always wants the rule APPLIED to the scenario\'s specific facts, not a textbook definition.',
        'Part (C) wants a real constitutional argument for the district (disruption in fact, or a neutral rule about the forum) — not just "schools have authority."',
      ],
      estimatedMinutes: 12,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Concept Application is 3 points, one per part, each graded independently — a short non-partisan scenario, no document, no thesis.',
        '"Describe" (part A) wants the provision plus the scenario detail that shows it; "explain" (parts B/C) always wants the rule or reasoning APPLIED to the scenario\'s specific facts, not a general definition.',
        'Tinker v. Des Moines (1969): schools may restrict student expression only if it would materially and substantially interfere with school discipline — mere apprehension of disturbance is not enough.',
        'A school district can argue its policy survives Tinker by showing an actual or reasonably forecasted disruption in fact, or by framing its rule as a viewpoint-neutral, generally applicable restriction on a limited forum.',
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '3',
    cedTopic: '3-FRQ-CA',
    cedTitle: 'Unit 3 FRQ Practice — Concept Application',
    sources: [
      {
        type: 'frq-style',
        source: 'AP Plans Initiative author',
        note: 'Modeled on the authentic AP US Government & Politics Concept Application free-response task wording and 3-point rubric (1 point per lettered part).',
      },
    ],
  },
};
