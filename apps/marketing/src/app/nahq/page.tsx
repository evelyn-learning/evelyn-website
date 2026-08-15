import type { Metadata } from "next";
import { redirect } from "next/navigation";

// Superseded by the slide deck at /showcase/nahq (passcode-gated). This
// stub only exists so any pre-shared /nahq link still lands somewhere.
export const metadata: Metadata = {
  title: "Evelyn Learning for NAHQ",
  robots: { index: false, follow: false },
};

export default function NahqPage() {
  redirect("/showcase/nahq");
}
