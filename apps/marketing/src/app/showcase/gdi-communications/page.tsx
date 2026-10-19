"use client";

import { DeckPage } from "@/components/showcase-deck/DeckPage";
import { GDI_DECK } from "./deck";

export default function GdiShowcasePage() {
  return <DeckPage config={GDI_DECK} />;
}
