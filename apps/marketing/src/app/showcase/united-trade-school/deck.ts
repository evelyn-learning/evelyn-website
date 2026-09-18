import type { DeckConfig } from "@/components/showcase-deck/config";
import { SPEAKER_NOTES } from "./notes";
import Hero from "./slides/Hero";
import WhereYouAre from "./slides/WhereYouAre";
import ReadingToTeaching from "./slides/ReadingToTeaching";
import LiveLesson from "./slides/LiveLesson";
import StudentExperience from "./slides/StudentExperience";
import ExamPrep from "./slides/ExamPrep";
import OnTrack from "./slides/OnTrack";
import YourBrand from "./slides/YourBrand";
import Options from "./slides/Options";
import FullAcademyPricing from "./slides/FullAcademyPricing";
import PilotPlan from "./slides/PilotPlan";
import WhoDoesWhat from "./slides/WhoDoesWhat";
import CTA from "./slides/CTA";

// Passcode-gated deck for the United Trade School call (2026-09-18). Not in
// nav, sitemap or the index. Presenter notes live in ./notes.ts.
export const UTS_DECK: DeckConfig = {
  productId: "united-trade-school",
  productTitle: "United Trade School — Evelyn Academy",
  gateTitle: "Evelyn Learning for United Trade School",
  gateFooter: "Prepared for United Trade School · not for general distribution",
  passcode: "UTS2026",
  storageKey: "uts_deck_access",
  channel: "uts-deck-sync",
  presenterPath: "/showcase/united-trade-school/presenter",
  slides: [
    { id: "hero", kicker: "01", title: "Your programs, taught one-on-one", Component: Hero },
    { id: "where-you-are", kicker: "02", title: "Two programs, one promise", Component: WhereYouAre },
    { id: "reading-to-teaching", kicker: "03", title: "From reading material to taught lessons", Component: ReadingToTeaching },
    { id: "live-lesson", kicker: "04", title: "Live demo — dosage calculations", Component: LiveLesson },
    { id: "student-experience", kicker: "05", title: "One workspace per program", Component: StudentExperience },
    { id: "exam-prep", kicker: "06", title: "Exam prep built around the exam", Component: ExamPrep },
    { id: "on-track", kicker: "07", title: "Keeping self-paced students on track", Component: OnTrack },
    { id: "your-brand", kicker: "08", title: "It's your school", Component: YourBrand },
    { id: "options", kicker: "09", title: "Three ways to start", Component: Options },
    { id: "full-academy-pricing", kicker: "10", title: "Full Academy — pricing", Component: FullAcademyPricing },
    { id: "pilot-plan", kicker: "11", title: "Ninety-day pilot", Component: PilotPlan },
    { id: "who-does-what", kicker: "12", title: "Who does what, who owns what", Component: WhoDoesWhat },
    { id: "cta", kicker: "13", title: "Send us Phase 2", Component: CTA },
  ],
  notes: SPEAKER_NOTES,
};
