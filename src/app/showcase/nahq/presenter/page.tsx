"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import AccessGate from "../components/AccessGate";
import PresenterView from "../components/PresenterView";

// Presenter/teleprompter window for the NAHQ deck — same passcode gate as
// the audience-facing deck (src/app/showcase/nahq/page.tsx), same
// sessionStorage key, so unlocking either one unlocks both within a
// session. Meant to be opened in its own tab (see the "Presenter view"
// links on the gate and on the deck's first slide) and never shared over
// Meet — see components/PresenterView.tsx for the actual teleprompter UI.
export default function NahqPresenterPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const stored = sessionStorage.getItem("nahq_deck_access");
    if (stored === "true") setUnlocked(true);
    setChecking(false);
  }, []);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <Loader2 className="h-8 w-8 animate-spin text-primary-400" />
      </div>
    );
  }

  if (!unlocked) {
    return <AccessGate onUnlock={() => setUnlocked(true)} />;
  }

  return <PresenterView />;
}
