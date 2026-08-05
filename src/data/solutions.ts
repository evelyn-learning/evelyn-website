/**
 * Segment registry for the /solutions/[segment] marketing pages.
 *
 * Each segment drives a static landing page built from a shared template:
 * a hero + three pain/solution cards, an embedded live voice-tutor demo
 * preconfigured with segment-relevant seed lessons, and (on academic
 * segments only) a Crimsora client-story block.
 *
 * Every `demoLessons[].planId` MUST exist in SEED_PLANS. Guarded by
 * scripts/test-solutions-demo-lessons.ts (npm run test:solutions-demo) —
 * run it after renaming or removing seeds.
 *
 * Interim note: nursing and corporate-ld currently point at the nearest
 * existing seed lessons (exam-strategy / adjacent-college content) rather
 * than purpose-built demo lessons. They swap to authored plans once the
 * owner supplies content (see docs/superpowers/plans/
 * 2026-08-04-solutions-segment-pages.md, Task 6).
 */

export interface SolutionSegment {
  slug: string;
  name: string;
  heroTitle: string;
  heroSub: string;
  pains: Array<{ problem: string; solution: string }>;
  demoLessons: Array<{
    planId: string;
    title: string;
    subjectLabel: string;
    levelLabel: string;
    hook: string;
  }>;
  demoSubject: string;
  demoLevel: string;
  /**
   * Shown under the demo header, only for segments whose demo lessons are an
   * interim stand-in (i.e. not yet purpose-built for the segment) — see the
   * "Interim note" above. Omit for segments where the demo lessons already
   * match the segment's claims (e.g. nursing's NCLEX plans).
   */
  demoNote?: string;
  showCrimsora: boolean;
  metaTitle: string;
  metaDescription: string;
}

/**
 * The owner's booking-call link (Google Calendar appointment schedule).
 * When set, every segment CTA points here and opens in a new tab; when null,
 * consumers fall back to `/contact?segment=<slug>&demo=true`.
 *
 * Note: Google appointment-schedule links don't accept prefill params, so the
 * per-segment attribution the /contact fallback captured is not carried into
 * the booking record. Which segment page drove a booking is visible via the
 * GA4 page path preceding the outbound click, not in the calendar entry.
 */
export const BOOKING_URL: string | null =
  "https://calendar.app.google/4EF3V1Qgy2rp9FQ19";

export const SOLUTION_SEGMENTS: SolutionSegment[] = [
  {
    slug: "nursing",
    name: "Nursing Programs",
    heroTitle: "Every nursing student gets a 1-on-1 NCLEX tutor",
    heroSub:
      "Live voice tutoring that walks students through NCLEX-NGN format and clinical-judgment reasoning until it's second nature — not just another question bank.",
    pains: [
      {
        problem:
          "The NCLEX-NGN's Clinical Judgment Measurement Model is a format students have never seen before nursing school, and case-study items punish the same test-taking habits that worked on every prior standardized test.",
        solution:
          "Evelyn walks each student through the CJMM's six-step cognitive process — recognize cues, analyze, prioritize hypotheses — on a live whiteboard, session after session, until the format stops being the obstacle.",
      },
      {
        problem:
          "Faculty know exactly which students need one-on-one remediation, but there are only so many clinical instructors and only so many hours before pass rates are reported.",
        solution:
          "A live voice tutor scales the remediation faculty already know how to give — the same worked examples, the same probing questions — to every student who needs it, on their own schedule.",
      },
      {
        problem:
          "By the time a struggling student shows up in office hours or a low practice-exam score, they may already be weeks behind on foundational content.",
        solution:
          "Because every session is a real conversation, not a static video, gaps in reasoning surface the moment they happen — early enough for faculty to intervene before a swing to remediation status.",
      },
    ],
    demoLessons: [
      {
        planId: "evelyn.testprep.nclex.ngn-overview.v1",
        title: "NCLEX-NGN Format & Clinical Judgment",
        subjectLabel: "Nursing",
        levelLabel: "NCLEX-NGN",
        hook: "The Clinical Judgment Measurement Model, explained step by step",
      },
      {
        planId: "evelyn.testprep.nclex.heart-failure.v1",
        title: "Heart Failure: Left vs Right & the Compensatory Loop",
        subjectLabel: "Nursing",
        levelLabel: "NCLEX",
        hook: "Why the body's own compensation makes a failing heart worse",
      },
      {
        planId: "evelyn.testprep.nclex.insulin-management.v1",
        title: "Insulin Timing, Hypoglycemia & DKA vs HHS",
        subjectLabel: "Nursing",
        levelLabel: "NCLEX",
        hook: "Matching insulin onset and peak to a patient's actual day",
      },
    ],
    demoSubject: "Nursing",
    demoLevel: "NCLEX",
    showCrimsora: true,
    metaTitle: "Nursing Programs — 1-on-1 NCLEX Voice Tutoring",
    metaDescription:
      "Give every nursing student a live voice tutor for NCLEX-NGN clinical-judgment prep. Scale faculty remediation and catch at-risk students earlier.",
  },
  {
    slug: "test-prep-academies",
    name: "Test Prep Academies",
    heroTitle: "Scale your best tutor to every student",
    heroSub:
      "Live voice tutoring across the Digital SAT, ACT, and every AP exam — the one-on-one experience families pay for, at the enrollment your instructors can't cover alone.",
    pains: [
      {
        problem:
          "Tutor payroll is the single largest line item on a test-prep academy's budget, and it caps how many students you can serve without raising prices.",
        solution:
          "Evelyn handles the one-on-one practice and drilling that fills instructor time today, at a fraction of the marginal cost of another human tutor — freeing your best people for the sessions that need them most.",
      },
      {
        problem:
          "Demand clusters in the same after-school and evening hours, so even a fully staffed academy runs out of tutor capacity right when families want to book.",
        solution:
          "A voice tutor doesn't run out of evening slots — every student gets an on-demand 1-on-1 session the moment they sit down, no waitlist for the 6pm hour.",
      },
      {
        problem:
          "Parents paying for test prep expect to see measurable progress, not just seat time, and academies without score reporting lose renewals.",
        solution:
          "Every session works real, leveled practice problems live on the whiteboard, so progress is visible in the conversation itself — not just inferred from a monthly invoice.",
      },
    ],
    demoLessons: [
      {
        planId: "evelyn.testprep.dsat.linear-equations-one-var.v1",
        title: "SAT Linear Equations",
        subjectLabel: "Digital SAT",
        levelLabel: "Test prep",
        hook: "Real SAT-style items, worked on the live whiteboard",
      },
      {
        planId: "evelyn.testprep.act.english.v1",
        title: "ACT English: Grammar & Rhetoric",
        subjectLabel: "ACT",
        levelLabel: "Test prep",
        hook: "Grammar rules and rhetorical skills the ACT actually tests",
      },
      {
        planId: "evelyn.ap.calcbc.introducing-calculus.v1",
        title: "AP Calculus BC: Introducing Calculus",
        subjectLabel: "AP Calculus BC",
        levelLabel: "AP",
        hook: "Can change occur at an instant? The question that starts calculus",
      },
    ],
    demoSubject: "Test Prep",
    demoLevel: "SAT/ACT/AP",
    showCrimsora: true,
    metaTitle: "Test Prep Academies — Live Voice Tutoring at Scale",
    metaDescription:
      "Scale your best tutor to every student with live voice tutoring for the Digital SAT, ACT, and AP exams — without adding tutor headcount.",
  },
  {
    slug: "schools",
    name: "Schools & Districts",
    heroTitle: "1-on-1 voice tutoring for every student, every subject",
    heroSub:
      "From grade 3 fractions to high school algebra, Evelyn gives every student the individual attention that intervention blocks and after-school programs can't scale on their own.",
    pains: [
      {
        problem:
          "Intervention blocks exist on the schedule, but there are never enough intervention specialists to give every student who needs one-on-one time an actual one-on-one session.",
        solution:
          "A live voice tutor can run inside the same intervention block, giving each student individual, spoken instruction on exactly their gap — without waiting for a specialist to be free.",
      },
      {
        problem:
          "The homework help a student needed at 3:30pm often isn't available until the next school day, by which point the assignment is already late or the confusion has compounded.",
        solution:
          "Evelyn is available the moment a student sits down with their homework, any evening, walking through the same problem a teacher would — with a whiteboard and a real conversation, not a canned video.",
      },
      {
        problem:
          "IEP-level differentiation asks a single teacher to run a different lesson pace for every student in the room, every period, every day — a scale no human classroom can sustain alone.",
        solution:
          "Because every session is a live, adaptive conversation, each student gets instruction paced to their own understanding — the differentiation an IEP calls for, delivered as a matter of course.",
      },
    ],
    demoLessons: [
      {
        planId: "evelyn.g3.math.fractions.intro.v1",
        title: "Fractions",
        subjectLabel: "Math",
        levelLabel: "Grade 3",
        hook: "Equal parts of a whole, visually",
      },
      {
        planId: "evelyn.hs.alg1.quadratic-graphs-vertex.v1",
        title: "Quadratic Graphs",
        subjectLabel: "Algebra 1",
        levelLabel: "High school",
        hook: "Parabolas & vertex form",
      },
      {
        planId: "evelyn.g5.science.life.photosynthesis-basics.v1",
        title: "Photosynthesis",
        subjectLabel: "Science",
        levelLabel: "Grade 5",
        hook: "How plants make their own food",
      },
    ],
    demoSubject: "K-12",
    demoLevel: "All grades",
    showCrimsora: true,
    metaTitle: "Schools & Districts — 1-on-1 Voice Tutoring at Scale",
    metaDescription:
      "Live voice tutoring for every student and subject, from grade 3 fractions to high school algebra — scaling intervention, homework help, and IEP-level differentiation.",
  },
  {
    slug: "homeschool-charters",
    name: "Homeschool & Charter Programs",
    heroTitle: "A patient tutor for every subject you don't teach",
    heroSub:
      "Curriculum-neutral, live voice tutoring that covers the subjects a single parent-educator can't — with a session record that documents real learning for charter funding.",
    pains: [
      {
        problem:
          "No single parent-educator can be fluent in calculus, chemistry, and every other high school subject their student needs — something eventually gets skipped or under-taught.",
        solution:
          "Evelyn covers the subjects outside a parent's expertise directly with the student, live and one-on-one, so nothing on the transcript gets shortchanged for lack of a specialist in the house.",
      },
      {
        problem:
          "Homeschool and charter families use a wide range of curricula, and most supplemental tools assume a specific textbook or scope-and-sequence that doesn't match what the student is actually using.",
        solution:
          "Evelyn tutors the concept, not a locked curriculum — a student can bring whatever unit they're on and work through it live, regardless of which program the family has chosen.",
      },
      {
        problem:
          "Charter programs that reimburse for supplemental instruction need real evidence of learning, not just a log of hours, to satisfy funding requirements.",
        solution:
          "Every session is a recorded, transcript-backed conversation showing exactly what the student worked through and how they progressed — documentation a charter can actually submit.",
      },
    ],
    demoLessons: [
      {
        planId: "evelyn.g5.science.life.photosynthesis-basics.v1",
        title: "Photosynthesis",
        subjectLabel: "Science",
        levelLabel: "Grade 5",
        hook: "How plants make their own food",
      },
      {
        planId: "evelyn.hs.engl.thesis-statements.v1",
        title: "Thesis Statements",
        subjectLabel: "English",
        levelLabel: "High school",
        hook: "From claim to defensible thesis",
      },
      {
        planId: "evelyn.lang.9-10.spanish-1-3.v1",
        title: "Spanish I-III: Preterite vs. Imperfect",
        subjectLabel: "World Language",
        levelLabel: "Grades 9-10",
        hook: "The past-tense distinction that trips up every Spanish learner",
      },
    ],
    demoSubject: "K-12",
    demoLevel: "All grades",
    showCrimsora: true,
    metaTitle: "Homeschool & Charter Programs — Live Voice Tutoring",
    metaDescription:
      "Curriculum-neutral live voice tutoring for homeschool and charter students, covering the subjects a parent-educator can't — with session records for funding documentation.",
  },
  {
    slug: "publishers-agencies",
    name: "Publishers & Agencies",
    heroTitle: "Put a live voice tutor inside your product",
    heroSub:
      "White-label Evelyn's voice + whiteboard tutoring engine and 1,700+ lesson catalog into your platform — interactive instruction your users can talk to, not another page of static content.",
    pains: [
      {
        problem:
          "Static content — articles, videos, PDFs — is losing engagement to interactive competitors that let a learner ask a question and get a real answer back.",
        solution:
          "Embed a live voice tutor directly in your product so a learner can talk through the material, not just consume it, using the same tutoring engine already running at scale.",
      },
      {
        problem:
          "Building conversational voice AI in-house means solving real-time speech, a live whiteboard, and pedagogical prompting from scratch before you've shipped a single lesson.",
        solution:
          "That engine already exists, is already tutoring students across math, science, humanities, and test prep, and is available to integrate rather than rebuild.",
      },
      {
        problem:
          "A tutoring integration is only worth shipping if it can carry your brand and drop into your existing product surface without a multi-quarter engineering lift.",
        solution:
          "The embed is white-label and API-driven — your branding, your product surface, our tutoring engine underneath — with an integration scoped in weeks, not quarters.",
      },
    ],
    demoLessons: [
      {
        planId: "evelyn.hs.alg1.quadratic-graphs-vertex.v1",
        title: "Quadratic Graphs",
        subjectLabel: "Algebra 1",
        levelLabel: "High school",
        hook: "Parabolas & vertex form",
      },
      {
        planId: "evelyn.g5.science.life.photosynthesis-basics.v1",
        title: "Photosynthesis",
        subjectLabel: "Science",
        levelLabel: "Grade 5",
        hook: "How plants make their own food",
      },
    ],
    demoSubject: "K-12",
    demoLevel: "All grades",
    showCrimsora: false,
    metaTitle: "Publishers & Agencies — White-Label Voice Tutoring",
    metaDescription:
      "Embed Evelyn's live voice + whiteboard tutoring engine and 1,700+ lesson catalog into your product, white-labeled to your brand.",
  },
  {
    slug: "corporate-ld",
    name: "Corporate L&D",
    heroTitle: "Training that talks back",
    heroSub:
      "Live voice tutoring for corporate learning that asks employees to actually engage with the material — and to rehearse it out loud — instead of clicking through slides to a completion certificate.",
    pains: [
      {
        problem:
          "Most compliance training measures completion by whether an employee clicked 'next' through every slide, not whether they understood or retained anything.",
        solution:
          "A live voice tutor turns the training into an actual conversation — asking questions, checking understanding, and adapting when an employee doesn't get it — instead of a slide deck that never finds out whether anything landed.",
      },
      {
        problem:
          "Technical and compliance material is usually taught the same way regardless of what an employee already knows — a slide deck or recorded video that can't adjust pace or check whether a harder concept actually landed.",
        solution:
          "Evelyn tutors the material live over its lesson catalog, working it out with the employee on a whiteboard they watch get drawn in real time — asking questions back and not moving on until the employee can explain the idea themselves.",
      },
      {
        problem:
          "L&D teams invest heavily in course content that employees skim once and never revisit, so the underlying skill never gets rehearsed into place.",
        solution:
          "Because every session is a spoken, interactive walkthrough rather than a static module, the same content can be practiced repeatedly in a genuinely different conversation each time.",
      },
    ],
    demoLessons: [
      {
        planId: "evelyn.college.corpld.reading-a-pl-statement.v1",
        title: "How to Read a P&L Statement",
        subjectLabel: "Corporate L&D",
        levelLabel: "Professional",
        hook: "What the numbers your finance team sends you actually mean",
      },
      {
        planId: "evelyn.college.corpld.how-generative-ai-works.v1",
        title: "How Generative AI Actually Works",
        subjectLabel: "Corporate L&D",
        levelLabel: "Professional",
        hook: "Tokens, next-word prediction, and why context length matters",
      },
    ],
    demoSubject: "Business & technical concepts",
    demoLevel: "Professional",
    showCrimsora: false,
    metaTitle: "Corporate L&D — Voice Tutoring That Talks Back",
    metaDescription:
      "Live voice tutoring for corporate learning and development — interactive training that requires real engagement, not another click-through compliance module.",
  },
];

export function getSegment(slug: string): SolutionSegment | undefined {
  return SOLUTION_SEGMENTS.find((s) => s.slug === slug);
}
