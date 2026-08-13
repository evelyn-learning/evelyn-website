// Speaker notes for the presenter/teleprompter view (presenter/page.tsx).
// Kept separate from the slide components so copy edits to the talk track
// never touch the audience-facing deck. One entry per slide, in the same
// order as SLIDES in components/slides/index.tsx — each entry is an array
// of short, spoken-register paragraphs meant to read at a glance, not be
// read verbatim word-for-word.
//
// Index reference (components/slides/index.tsx):
// 0 hero · 1 blueprint · 2 adaptive-loop · 3 ability-forgetting ·
// 4 prereq-cold-start · 5 explainability · 6 pipeline ·
// 7 candidate-experience · 8 program-leadership · 9 phase-1 · 10 phase-2 ·
// 11 ongoing · 12 ownership · 13 cta
export const SPEAKER_NOTES: string[][] = [
  // 0 — Hero
  [
    "Thanks so much for making time today — really appreciate you both being here. Here's how I want to spend our time: show you first, talk structure and pricing after. You asked for both, so we'll get to both — I'd just rather you see something real before we talk numbers.",
    "What you're looking at is adaptive CPHQ preparation, built specifically on NAHQ's blueprint — not a generic test-prep product we tried to fit you into. Custom development like this is our core model, not a side offering, so this is genuinely what we do.",
    "One quick bit of context — Evelyn was just ranked in TIME's Top EdTech list for 2026, #9 in the US and #35 in the world. I mention it only so you know the team behind this call has already been validated at that level.",
  ],
  // 1 — Blueprint
  [
    "Here's the part I'm most excited to show you. Everything on this slide — and everything you're about to see in the demo — was built from NAHQ's published CPHQ examination content outline. We did this before this call, on our own initiative, from what's publicly available.",
    "We preserved your domains and weights exactly as published, broke the outline into roughly 37 learning objectives, and built the prerequisite structure between them. Then we generated lessons, an AI tutor grounded in that content, and a per-candidate learner model — and it's live right now, on a seeded candidate account. This isn't a mockup, it's the actual system.",
    "So here's the punchline I want you to sit with: this is what we built from your published outline alone, before one call ever happened. Imagine what we could do with your full body of knowledge — your item banks, your SME expertise, your candidate history. This is the floor, not the ceiling.",
  ],
  // 2 — Adaptive loop
  [
    "This is the engine underneath everything you just saw — one continuous loop that runs for every candidate, across all thirty-seven objectives, without anyone having to decide what to study next.",
    "It starts with evidence — every answer, hint, mock exam, quiz, practice item, lesson, and tutor turn a candidate generates. That feeds a per-objective learner model, which isn't just a percentage — it's a mastery estimate with a confidence band, so we know not just where someone stands but how sure we are of it.",
    "The session planner takes that and decides what's next: skip what's mastered, target confirmed gaps, schedule review before the candidate would naturally forget it. Then it hands off to a lesson, a tutor conversation, or practice — grounded in exactly the objective the planner picked. That generates new evidence, and the loop runs again.",
  ],
  // 3 — Ability + forgetting (under the hood 1/2)
  [
    "I'll go a level deeper for a minute, mostly because I suspect your certification team will want to know how the numbers actually work — stop me if this is more than you need right now.",
    "On the left, that's a per-objective ability estimate — it updates with every response using an Elo-family model, weighted by where the evidence came from. A mock exam question moves the needle more than a hint on a practice item, because it's stronger evidence of what someone actually knows.",
    "On the right is the piece people don't usually think about — forgetting. We model a half-life per objective and schedule review before the predicted dip, not after. A candidate who mastered Domain III in week two gets brought back to it in week six, before it decays, instead of relearning it cold in week eleven.",
  ],
  // 4 — Prereqs + cold start (under the hood 2/2)
  [
    "Two more pieces of the machinery, both about not wasting a candidate's time. On the left is prerequisite sequencing — we never recommend an objective a candidate isn't ready for. If the prerequisite hasn't been mastered, that downstream objective stays locked out of the session plan.",
    "On the right is cold start — day one, before we know anything about a candidate. Instead of a separate placement test, the first session's items double as a silent diagnostic. By the end of it we've got a calibrated starting state for every objective, and no session was wasted getting there.",
  ],
  // 5 — Explainability
  [
    "This is a stylized mock, not a live screenshot, but it's the real evidence view a candidate or reviewer sees. I want to spend a beat here, because for a credential like CPHQ this matters a lot.",
    "For a high-stakes credential, auditability isn't a nice-to-have — it's a feature. Every number the system produces can show its evidence. This candidate's 78% on performance improvement methods isn't a black box — you can see the mock exam result, the quiz score, the practice pattern, and the tutor session that flagged a partial gap, all feeding that one number.",
    "That matters for a candidate who wants to trust the number, and it matters for your team if you ever need to explain how the system reached a conclusion about someone's readiness.",
  ],
  // 6 — Pipeline / SME gate
  [
    "This is the pipeline end to end, and I want to be really clear about where your team sits in it, because I know this is a big question for both of you.",
    "Today, everything runs from your published outline through AI drafting into the objective graph, lessons, and generated practice items — and every single item clears an independent AI verification pass before a candidate ever sees it. That's live right now. When we ingest your CPHQ outline, that whole run normally happens while we're talking — five to ten minutes from PDF to a reviewable course.",
    "In Phase 2, your SMEs step into that same checkpoint. They get an approve, edit, or reject queue — nothing reaches a candidate your experts haven't signed off on. I want to be upfront that this is deliberately co-designed with your team, not something we've already built and are asking you to accept. We'd build that workflow around how your reviewers actually work.",
  ],
  // 7 — Candidate experience
  [
    "Zooming out from the mechanics — here's what this actually feels like for a candidate, day to day. Watch how little they have to decide. They open the app and today's session is already assembled from due reviews and their weakest objectives.",
    "From there it's an adaptive lesson or an AI tutor conversation grounded in that specific objective, notes that build up from their own sessions rather than a static PDF they re-read, and a readiness projection rolled up from the objective-level model — with its evidence, the same evidence view we just looked at.",
    "The whole point is candidates stop guessing what to study and start trusting a number, because they can see exactly where it comes from.",
  ],
  // 8 — Program leadership
  [
    "Flipping to your side of the house — this is what program leadership would see. I want to flag upfront these are illustrative mocks, scoped for Phase 2, not something live today.",
    "Cohort readiness as a distribution, at-risk candidates flagged automatically — falling behind schedule, going quiet, stalling on a domain — and a content-gap report showing which objectives the whole cohort is struggling with. That last one is honestly as useful to you as it is to any individual candidate — it's a signal about your content and your exam, not just about who's underprepared.",
  ],
  // 9 — Phase 1 pilot
  [
    "Let's talk structure, starting with how we'd actually begin. Phase 1 is the pilot — thirty-five thousand dollars, indicative, about six weeks from kickoff. If you continue into Phase 2, that fee is credited against it, so it's not sunk cost either way you decide.",
    "You'd get the CPHQ blueprint course fully productionized from your published outline, a cohort of up to two hundred candidates, NAHQ review gates on all the content before candidates see anything, and weekly readouts against success metrics we agree on together before we start.",
    "This is deliberately small and fast — the point is to prove it works with real candidates before either of us commits to the bigger build.",
  ],
  // 10 — Phase 2 full program
  [
    "Phase 2 is the full program — a hundred to a hundred fifty thousand dollars indicative, depending on final scope, over eight to twelve weeks. This is where the SME review workflow we talked about gets built, along with a calibrated item bank and full-length practice exams, NAHQ branding on a dedicated portal, cohort analytics for your leadership team, SSO and integrations, and a data-processing agreement.",
    "I'll say the range is wide on purpose — the real scoping conversation happens after the pilot, once we know exactly what your SMEs need from that review queue.",
  ],
  // 11 — Ongoing license
  [
    "Then there's the ongoing license — seventy-five to a hundred dollars per active candidate per year, volume-tiered. That covers hosting, operations, model and inference costs, and continuous updates as your blueprint and item bank evolve. You never see a line item for AI spend; it's built into that number.",
    "I want to anchor this for a second: CPHQ retail prep products run six hundred to fifteen hundred dollars a unit. This license is a fraction of that, and you keep the margin on what you charge candidates — we're not trying to be the retail price, we're trying to be the infrastructure underneath it.",
    "One more thing worth flagging — voice tutoring is included under a fair-use allowance, three hundred minutes per candidate per month, and text tutoring, lessons, and practice are unlimited. That's a cost-discipline mechanism, not a candidate-facing limit — almost nobody hits it. If you've got a very large cohort where voice isn't the priority, there's a text-only tier at fifty to sixty dollars a year that still gets you the full adaptive engine.",
  ],
  // 12 — Ownership
  [
    "I want to spend real time here, because I think this is the question underneath all your other questions. This is a managed white-label deployment, not a software transfer, and I want to be explicit about why, and what that means for you.",
    "You own the content — the blueprint course, the item bank, every piece of branded material. Not licensed back to us, not shared with other customers. You own every byte of candidate data — response history, mastery data, all of it — exportable any time in a standard format, so there's no lock-in. Your SMEs stay in the loop on everything that reaches a candidate.",
    "What we own is the operation — we build it, host it, and run it, so you never have to carry AI infrastructure or per-query billing internally. The continuity guarantees underneath that — escrow, export commitments — live in the contract, and we're glad to walk your team through those in as much detail as you want.",
  ],
  // 13 — CTA / close
  [
    "So here's what I'd propose as a next step: let's start the six-week pilot, with success metrics we agree on together up front. If you continue to Phase 2, that pilot fee is credited toward it, so there's no wasted spend either way you decide.",
    "This deck is yours to keep — anything that comes up after today, before, during, or after, just reach out directly. We're genuinely excited about what this could look like for CPHQ candidates, and we'd love to get started.",
  ],
];
