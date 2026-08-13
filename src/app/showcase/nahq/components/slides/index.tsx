import type { ComponentType } from "react";
import Hero from "./Hero";
import Blueprint from "./Blueprint";
import AdaptiveLoop from "./AdaptiveLoop";
import AbilityForgetting from "./AbilityForgetting";
import PrereqColdStart from "./PrereqColdStart";
import Explainability from "./Explainability";
import Pipeline from "./Pipeline";
import CandidateExperience from "./CandidateExperience";
import ProgramLeadership from "./ProgramLeadership";
import Phase1 from "./Phase1";
import Phase2 from "./Phase2";
import Ongoing from "./Ongoing";
import Ownership from "./Ownership";
import CTA from "./CTA";

export type SlideDef = {
  id: string;
  /** Short label shown on the overview grid card. */
  kicker: string;
  title: string;
  Component: ComponentType;
};

export const SLIDES: SlideDef[] = [
  { id: "hero", kicker: "01", title: "Adaptive CPHQ prep, built on your blueprint", Component: Hero },
  { id: "blueprint", kicker: "02", title: "We started from your published blueprint", Component: Blueprint },
  { id: "adaptive-loop", kicker: "03", title: "The adaptive loop", Component: AdaptiveLoop },
  { id: "ability-forgetting", kicker: "04", title: "Ability estimate + spaced review", Component: AbilityForgetting },
  { id: "prereq-cold-start", kicker: "05", title: "Prerequisites + cold start", Component: PrereqColdStart },
  { id: "explainability", kicker: "06", title: "Explainability by design", Component: Explainability },
  { id: "pipeline", kicker: "07", title: "From blueprint to course", Component: Pipeline },
  { id: "candidate-experience", kicker: "08", title: "What the candidate experiences", Component: CandidateExperience },
  { id: "program-leadership", kicker: "09", title: "What program leadership sees", Component: ProgramLeadership },
  { id: "phase-1", kicker: "10", title: "Phase 1 — Pilot", Component: Phase1 },
  { id: "phase-2", kicker: "11", title: "Phase 2 — Full program", Component: Phase2 },
  { id: "ongoing", kicker: "12", title: "Ongoing — Managed platform license", Component: Ongoing },
  { id: "ownership", kicker: "13", title: "Who owns what", Component: Ownership },
  { id: "cta", kicker: "14", title: "Let's go through it together", Component: CTA },
];
