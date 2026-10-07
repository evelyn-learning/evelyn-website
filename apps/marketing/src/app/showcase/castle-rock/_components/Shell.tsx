"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AlertCircle, ArrowRight, Loader2, Lock } from "lucide-react";
import { DemoTrackingProvider } from "@/components/demos/DemoTrackingContext";
import { useDemoTracking } from "@/hooks/useDemoTracking";
import { NAV, SHOWCASE } from "../_lib/config";
import "../castle-rock.css";

function Copyright({ dark = false }: { dark?: boolean }) {
  return <p className={["text-center text-xs", dark ? "text-slate-500" : "text-slate-500"].join(" ")}>&copy; 2026 Evelyn Learning. Prepared for Castle Rock Research. Not for general distribution.</p>;
}

function Gate({ onUnlock }: { onUnlock: () => void }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    setTimeout(() => {
      if (code.trim().toUpperCase() === SHOWCASE.passcode.toUpperCase()) {
        sessionStorage.setItem(SHOWCASE.storageKey, "true");
        onUnlock();
      } else {
        setError(true);
        setLoading(false);
      }
    }, 400);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-slate-950 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.04] p-8 md:p-10">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-500">
            <Lock className="h-6 w-6 text-white" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-white">Evelyn Learning for Castle Rock Research</h1>
          <p className="mt-1 text-sm text-slate-400">Partner showcase &middot; passcode required</p>
        </div>
        <form onSubmit={submit}>
          <label htmlFor="cr-passcode" className="mb-2 block text-sm font-medium text-slate-300">
            Passcode
          </label>
          <input
            id="cr-passcode"
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
              error ? "border-rose-400" : "border-white/15 focus:border-primary-400",
            ].join(" ")}
          />
          {error && (
            <p className="mt-2 flex items-center justify-center gap-1.5 text-sm text-rose-300">
              <AlertCircle className="h-4 w-4" /> Incorrect passcode. Please try again.
            </p>
          )}
          <button
            type="submit"
            disabled={loading || !code.trim()}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-primary-500 py-3 font-semibold text-white transition-colors hover:bg-primary-600 disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <>Open the showcase <ArrowRight className="h-4 w-4" /></>}
          </button>
        </form>
      </div>
      <Copyright dark />
    </div>
  );
}

/**
 * Gate, header, menu and footer shared by every page in the showcase.
 * Tracking mirrors the deck showcases: Views = link opened, Interactions =
 * passcode accepted, Recent = pages opened and walkthroughs played.
 */
export default function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [unlocked, setUnlocked] = useState(false);
  const [checking, setChecking] = useState(true);
  const { trackView, trackTry, trackInteraction } = useDemoTracking({
    productId: SHOWCASE.productId,
    productTitle: SHOWCASE.productTitle,
  });

  useEffect(() => {
    if (sessionStorage.getItem(SHOWCASE.storageKey) === "true") setUnlocked(true);
    setChecking(false);
  }, []);

  useEffect(() => {
    trackView();
  }, [trackView]);

  useEffect(() => {
    if (unlocked && pathname) trackInteraction("navigation", pathname);
  }, [unlocked, pathname, trackInteraction]);

  const handleUnlock = useCallback(() => {
    setUnlocked(true);
    trackTry({ event: "passcode_accepted" });
  }, [trackTry]);

  if (checking) return <div className="min-h-screen bg-slate-950" />;
  if (!unlocked) return <Gate onUnlock={handleUnlock} />;

  return (
    <DemoTrackingProvider trackInteraction={trackInteraction}>
      <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
            <Link href={SHOWCASE.basePath} className="min-w-0 truncate font-heading text-[15px] font-semibold text-slate-900">
              Evelyn Learning <span className="font-normal text-slate-400">&times;</span> Castle Rock Research
            </Link>
            <nav aria-label="Showcase sections" className="flex shrink-0 items-center gap-1">
              {NAV.map((item) => {
                const active = pathname?.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={[
                      "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                      active ? "bg-primary-50 text-primary-700" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                    ].join(" ")}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-slate-200 bg-white px-4 py-5">
          <Copyright />
        </footer>
      </div>
    </DemoTrackingProvider>
  );
}
