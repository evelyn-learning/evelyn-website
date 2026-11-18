import { notFound } from "next/navigation";
import { requireUser } from "@/lib/keystone/auth";
import { ksBase } from "@/lib/keystone/paths";
import { getReview, type Flag } from "@/lib/keystone/animreview/store";
import { animatedUrl, parseVersion } from "@/lib/keystone/animreview/pure";
import { TopBar } from "../../_components/TopBar";
import { AnimReview, type FlagView } from "./AnimReview";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ itemId: string }> }) {
  const { itemId } = await params;
  return { title: `Animated · item ${itemId}` };
}

const view = (f: Flag): FlagView => ({
  id: f.id,
  version: f.version,
  step: f.step ?? null,
  line: f.line ?? null,
  timeMs: f.timeMs ?? null,
  comment: f.comment,
  spoken: !!f.spoken,
  shots: f.shots ?? [],
  status: f.status,
  fixedInVersion: f.fixedInVersion ?? null,
  reply: f.reply ?? null,
  reopenOf: f.reopenOf ?? null,
  createdBy: f.createdBy,
  createdAt: new Date(f.createdAt).toISOString(),
});

// One version of an item's animated solution with the flag panel. Evelyn only: any other role gets 404.
export default async function AnimatedReviewPage({ params, searchParams }: { params: Promise<{ itemId: string }>; searchParams: Promise<{ v?: string }> }) {
  const user = await requireUser();
  if (user.role !== "evelyn") notFound();
  const { itemId } = await params;
  const { v } = await searchParams;
  const r = await getReview(itemId, v === undefined ? null : parseVersion(v), user.role);
  if (!r) notFound();
  const base = await ksBase();
  const a = r.animation;
  return (
    <>
      <TopBar user={user} on="animated" />
      <main className="ks-main ks-anim">
        <AnimReview
          key={`${a.itemId}-${a.version}`}
          base={base}
          me={user.username}
          itemId={a.itemId}
          version={a.version}
          status={a.status}
          voice={a.voice ?? null}
          notes={a.notes ?? null}
          src={animatedUrl(a.itemId, a.version, a.entry || "solution.html")}
          height={a.height || 900}
          versions={r.versions.map((x) => ({ version: x.version, status: x.status }))}
          flags={r.flags.map(view)}
          fixedHere={r.fixedHere.map(view)}
          stillOpen={r.stillOpen.map(view)}
          canAccept={r.canAccept}
        />
      </main>
    </>
  );
}
