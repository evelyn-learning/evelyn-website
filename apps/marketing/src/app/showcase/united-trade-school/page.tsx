"use client";

import { DeckPage } from "@/components/showcase-deck/DeckPage";
import { UTS_DECK } from "./deck";

export default function UtsShowcasePage() {
  return <DeckPage config={UTS_DECK} />;
}
