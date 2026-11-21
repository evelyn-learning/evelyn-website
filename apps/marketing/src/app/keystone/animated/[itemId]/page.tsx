import { redirect } from "next/navigation";
import { requireUser } from "@/lib/keystone/auth";
import { ksHref } from "@/lib/keystone/paths";
import { isItemId, parseVersion } from "@/lib/keystone/animreview/pure";

export const dynamic = "force-dynamic";

// Old address of the animation review: it now lives on the item page (section "Animated solution").
export default async function AnimatedReviewPage({ params, searchParams }: { params: Promise<{ itemId: string }>; searchParams: Promise<{ v?: string }> }) {
  await requireUser();
  const { itemId } = await params;
  const { v } = await searchParams;
  const ver = v === undefined ? null : parseVersion(v);
  redirect(await ksHref(isItemId(itemId) ? `/item/${itemId}${ver ? `?av=${ver}` : ""}#animated` : "/queue"));
}
