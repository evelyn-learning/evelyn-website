import type { DeckConfig } from "@/components/showcase-deck/config";
import { SPEAKER_NOTES } from "./notes";
import Hero from "./slides/Hero";
import Learners from "./slides/Learners";
import HowALessonWorks from "./slides/HowALessonWorks";
import LiveDemo from "./slides/LiveDemo";
import YourContent from "./slides/YourContent";
import YourBrand from "./slides/YourBrand";
import Reporting from "./slides/Reporting";
import Commercials from "./slides/Commercials";
import NextSteps from "./slides/NextSteps";

// Passcode-gated deck for the GDI Communications call (2026-10-28, 9:00 JST).
// Not in nav, sitemap or the index. Presenter notes live in ./notes.ts. The
// live-demo slide mints real sessions on the demo engine (api/showcase/gdi/mint).
export const GDI_DECK: DeckConfig = {
  productId: "gdi-communications",
  productTitle: "GDI Communications — Bilingual Voice Tutor",
  gateTitle: "Evelyn Learning for GDI Communications",
  gateFooter: "Prepared for GDI Communications · not for general distribution",
  passcode: "GDIC2026",
  storageKey: "gdi_deck_access",
  channel: "gdi-deck-sync",
  presenterPath: "/showcase/gdi-communications/presenter",
  slides: [
    { id: "hero", kicker: "01", title: "English your learners actually speak", Component: Hero },
    { id: "learners", kicker: "02", title: "Built for Japanese professionals", Component: Learners },
    { id: "how-a-lesson-works", kicker: "03", title: "How a lesson works", Component: HowALessonWorks },
    { id: "live-demo", kicker: "04", title: "Live demo — three lessons", Component: LiveDemo, interactive: true },
    { id: "your-content", kicker: "05", title: "Your material becomes the lessons", Component: YourContent },
    { id: "your-brand", kicker: "06", title: "It's GDI's tutor", Component: YourBrand },
    { id: "reporting", kicker: "07", title: "What GDI and your clients see", Component: Reporting },
    { id: "commercials", kicker: "08", title: "Pilot pricing", Component: Commercials },
    { id: "next-steps", kicker: "09", title: "A pilot in six weeks", Component: NextSteps },
  ],
  notes: SPEAKER_NOTES,
};
