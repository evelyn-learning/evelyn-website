import type { ComponentType } from "react";

/**
 * A passcode-gated client deck: audience tab + presenter/teleprompter tab
 * synced over a BroadcastChannel, printable as a leave-behind PDF. The kit
 * is the NAHQ deck (src/app/showcase/nahq) generalised; each client deck
 * supplies one of these and its slides.
 */
export type DeckSlide = {
  id: string;
  /** Short label on the overview grid card (usually the slide number). */
  kicker: string;
  title: string;
  Component: ComponentType;
  /** The slide has controls the viewer clicks (inputs, buttons, an embed).
   *  The deck then drops its invisible left/right click zones on this slide
   *  — they sit above the slide content and would take the click (and show
   *  a focus bar). Arrow keys and the bottom chrome still page. */
  interactive?: boolean;
};

export type DeckConfig = {
  /** Must match `productId` in src/config/showcaseProducts.ts (admin aggregation). */
  productId: string;
  productTitle: string;
  /** Shown on the passcode gate. */
  gateTitle: string;
  gateFooter: string;
  passcode: string;
  /** sessionStorage key — unlocking the deck unlocks the presenter tab too. */
  storageKey: string;
  /** BroadcastChannel name — unique per deck so two decks open at once never cross-talk. */
  channel: string;
  presenterPath: string;
  slides: DeckSlide[];
  /** One entry per slide, same order as `slides`; short spoken-register paragraphs. */
  notes: string[][];
};
