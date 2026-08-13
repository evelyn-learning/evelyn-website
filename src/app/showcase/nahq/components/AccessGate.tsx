"use client";

import { useState } from "react";
import { Lock, ArrowRight, AlertCircle, Loader2 } from "lucide-react";

// Easily changed ahead of the call if it needs to be shared more widely.
const PASSCODE = "NAHQ2026";

export default function AccessGate({
  onUnlock,
}: {
  onUnlock: () => void;
}) {
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    setTimeout(() => {
      if (code.trim().toUpperCase() === PASSCODE) {
        sessionStorage.setItem("nahq_deck_access", "true");
        onUnlock();
      } else {
        setError(true);
        setLoading(false);
      }
    }, 400);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 25% 25%, rgba(122,42,142,0.35) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(14,165,233,0.22) 0%, transparent 50%)",
        }}
      />
      <div className="relative z-10 w-full max-w-md">
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl backdrop-blur-sm md:p-10">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500">
              <Lock className="h-7 w-7 text-white" />
            </div>
            <h1 className="font-heading text-2xl font-bold text-white">
              Evelyn Learning for NAHQ
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Presentation deck &middot; passcode required
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <label
              htmlFor="nahq-passcode"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Passcode
            </label>
            <input
              id="nahq-passcode"
              type="text"
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                setError(false);
              }}
              placeholder="Enter passcode"
              autoFocus
              autoComplete="off"
              className={[
                "w-full rounded-xl border-2 bg-white/5 px-4 py-3 text-center font-mono text-lg tracking-widest text-white placeholder-slate-500 outline-none transition-colors",
                error
                  ? "border-rose-400 focus:border-rose-400"
                  : "border-white/15 focus:border-primary-400",
              ].join(" ")}
            />
            {error && (
              <p className="mt-2 flex items-center justify-center gap-1.5 text-sm text-rose-300">
                <AlertCircle className="h-4 w-4" /> Incorrect passcode. Please
                try again.
              </p>
            )}
            <button
              type="submit"
              disabled={loading || !code.trim()}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 py-3 font-semibold text-white transition-all hover:shadow-lg hover:shadow-primary-500/20 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  View the deck <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>
        <p className="mt-6 text-center text-xs text-slate-500">
          Prepared for NAHQ &middot; not for general distribution
        </p>
      </div>
    </div>
  );
}
