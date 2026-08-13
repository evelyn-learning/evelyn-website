"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import AccessGate from "./components/AccessGate";
import Deck from "./components/Deck";

export default function NahqShowcasePage() {
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

  return <Deck />;
}
