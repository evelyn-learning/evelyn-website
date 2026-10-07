import type { ComponentType, ReactNode } from "react";

export type Subject = "Mathematics" | "Physics" | "Chemistry" | "Biology";

export type SolutionStep = {
  title: string;
  body: ReactNode;
  /** What the tutor says for this step, written as the student reads it. */
  caption: string;
};

export type SolutionOption = { label: string; content: ReactNode; correct?: boolean };

/** Props every figure receives: the step being played, or steps.length when at rest. */
export type FigureProps = { step: number; playing: boolean };

export type Solution = {
  /** SOLARO item number — also the URL segment and the audio folder name. */
  itemId: string;
  subject: Subject;
  course: string;
  itemType: string;
  topic: string;
  title: string;
  question: ReactNode;
  options: SolutionOption[];
  /** Index of the step at which the correct option is revealed during playback. */
  revealAnswerAt: number;
  steps: SolutionStep[];
  Figure: ComponentType<FigureProps>;
  figureAlt: string;
  /** One-line answer shown under the figure when nothing is playing. */
  summary: string;
};

export const audioSrc = (itemId: string, stepIndex: number) =>
  `/showcase/castle-rock/audio/${itemId}/step-${stepIndex + 1}.mp3`;
