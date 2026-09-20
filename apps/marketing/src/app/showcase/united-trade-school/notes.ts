// Speaker notes for the presenter/teleprompter tab. One entry per slide, in
// the same order as UTS_DECK.slides (./deck.ts). Short, spoken-register
// paragraphs to read at a glance — not a script. Bracketed lines are cues
// for the presenter, not things to say.
export const SPEAKER_NOTES: string[][] = [
  // 01 — Hero
  [
    "Thanks for making time, Daniel. Plan for the next thirty minutes: a few questions about where you are, then a live lesson on one of your Phase 2 topics, then the platform around it, then how a first step could look.",
    "You tried the tutor yourself on Tuesday night — the pharmacy technician roles lesson. Today is about the rest of the platform: the course, the exam prep, and what your team sees.",
    "[Discovery before the demo — ask now: enrolled students today and expected in six months · what form the content is in (own writing, licensed textbook, PDFs) and who owns it · any LMS or portal at all · PTCB recognition status · tuition and the 8-week vs 66-week mix · anything beyond Alabama, Spanish speakers?]",
  ],
  // 02 — Where you are
  [
    "This is what we took from your site, so correct me. Pharmacy Technician is 330 hours in four phases, reading-based, no video. Medical Admin is 150 hours with virtual labs. Self-paced, rolling admission, and the promise is: pass the exam, get the interview.",
    "Reading-based is the cheapest way to deliver and the hardest way to finish. Every student who stalls in week six costs you a certification and an interview — and the interview is your whole pitch.",
    "The national first-time pass rate on the PTCB is around seventy percent. So even for students who finish, three in ten walk out without the credential. Those are the two numbers we're going after: completion, and pass rate.",
  ],
  // 03 — Reading to teaching
  [
    "We don't replace your curriculum. Your written material is the source; the tutor becomes the instructor.",
    "Take Phase 2 — anatomy, pharmacy law, medications, pharmacy math, a hundred hours. We break it into roughly twenty-five learning objectives you approve. Each becomes a lesson plan the tutor teaches: a hook, the concept, a worked example, the student tries one, a check, a recap. Every objective gets practice questions and notes; each phase gets quizzes and a unit test.",
    "Your subject expert reviews every lesson before a student sees it, and the content we build for you is yours.",
  ],
  // 04 — Live lesson
  [
    "[Switch to the evelyntutor.com tab. Voice on. Type: “Dosage calculations for pharmacy technicians — ratio and proportion, mg to mL”. Fallback topic: “Converting units in pharmacy: mg, g, mL and days' supply”. Safety net: the authored lesson in the third tab.]",
    "[Play the student. Give one wrong answer on purpose so he sees the correction. Let it reach the practice question. Stop at about eight minutes.]",
    "[If he raises the one-word rendering glitch from his own session: it's a known display bug — a text step occasionally goes through the math renderer, which strips the spaces. Not a content error; it's on the fix list.]",
  ],
  // 05 — Student experience
  [
    "[Switch to the Crimsora tab, your test account.] This is the same platform under a different brand. Lessons by phase, with Study or Resume. Practice — including the homework the tutor set after a session, and objectives flagged when they're due for review.",
    "Quizzes and unit tests, timed, with history. Notes written from each session, with a printable revision sheet. And a replay of any lesson.",
    "Works on a laptop or a phone. That matters for your part-time students studying five hours a week around a job.",
  ],
  // 06 — Exam prep
  [
    "The practice and the mock exams follow the exam's own domain weights — Medications forty percent, Patient Safety about twenty-six, Order Entry twenty-one, Federal Requirements twelve and a half. CMAA the same way against the NHA test plan.",
    "[Start a mock in Crimsora: show the timer, the palette, mark-for-review. Then a score report.] After a mock, a student can review every missed question with the tutor — that's the piece that moves a sixty-five to a pass.",
    "[If he asks about their virtual labs: we don't do EHR or front-office simulators. The tutor can run scenarios in conversation — a phone refill request, a difficult patient. Don't let the meeting go there.]",
  ],
  // 07 — On track
  [
    "This is the slide for the completion problem. After each session the tutor assigns practice on exactly what the student found hard, and checks it next time. Objectives come back for review before they fade.",
    "Weekly progress emails go to the student and to your counsellor — time spent, lessons covered, what's mastered, what's still open.",
    "[Show the admin students dashboard.] Every student's stage, sessions and hours. The ones who signed up and stalled are highlighted. You promise a career counsellor from day one — this is what gives that counsellor something to act on before the student drops.",
  ],
  // 08 — Your brand
  [
    "It's your school. learn.unitedtradeschool.com, your logo, your colours. Students never see our name.",
    "We already run two very different live products on this one codebase — a structured course academy and an open tutoring site. A brand is configuration for us, not a rebuild, so setup is days, not months.",
    "Your admin console: enrol students, assign counsellors, watch progress, replay sessions, export your data.",
  ],
  // 09 — Options
  [
    "Three ways to start, sized for where you are. I'll be honest: the one I'd pick for a school your age is the pilot.",
    "Pilot: fifteen hundred dollars, one-time, ninety days. We build your Pharmacy Tech Phase 2 as a real course, up to thirty students, tutor included, on a pilot subdomain. It's credited against the full academy if you go ahead.",
    "Full Academy is the whole platform under your brand, priced per student per program. Tutor embed is only if you're building your own portal — the tutor inside your app, per minute. [Kanzoo is at $0.10 — grandfathered; hold $0.15 for new partners.]",
  ],
  // 10 — Full Academy pricing
  [
    "Setup twenty-five hundred, one-time. Content adaptation six thousand for Pharmacy Tech and thirty-five hundred for Medical Admin — that's up to sixty and thirty-five lessons with practice, notes and mock forms, and the content is yours. Platform licence eighteen hundred a year.",
    "Then per student, per program: one-forty-nine up to a hundred students, one-nineteen to five hundred, ninety-nine beyond. That includes a pooled tutor allowance of two hundred and forty minutes per student — about twelve to sixteen tutor lessons — plus unlimited practice, quizzes, mocks, notes and replays.",
    "Year one for a hundred students across both programs is about twenty-eight thousand seven hundred; from year two, about sixteen thousand seven hundred. At thirty students, year one is around eighteen three. Against a two-to-four-thousand-dollar tuition, that's under five percent per student. [Internal: 240 min costs us ~$24 at full use, ~$14 realistic.]",
  ],
  // 11 — Pilot plan
  [
    "Week one: you send the Phase 2 outline and a sample of the material; we map it to objectives and you approve. Week two: the pilot course is built — lessons, practice, notes, one mock — your reviewer signs off, and the site is live.",
    "Weeks three to twelve: up to thirty students learn Phase 2 with the tutor, and you watch completion, exam readiness and replays. Week twelve: we sit down with the numbers that matter to you — completion, mock scores, time to finish — and you decide on the full academy.",
    "Small enough to say yes to today; real enough to show whether the two numbers move.",
  ],
  // 12 — Who does what
  [
    "Managed white-label: we build, host and operate — hosting, uptime, security, the review cycles, updates, onboarding, the reports and dashboard.",
    "From you: the syllabus and written material, a subject expert to review, brand assets and a subdomain, student rosters and admins, and students with a device, a mic and internet.",
    "The adapted content and your student data are yours, exportable at any time. The platform and the tutor stay ours, licensed to you.",
  ],
  // 13 — CTA
  [
    "So the ask is simple: send me Phase 2 and a sample of the material, and we'll have a pilot course ready in a week.",
    "Then your students tell us whether it works — with completion and mock scores, not a sales deck.",
    "[Agree the next step before hanging up: who sends the outline, by when, and the pilot start date. Confirm the written quote goes out today.]",
  ],
];
