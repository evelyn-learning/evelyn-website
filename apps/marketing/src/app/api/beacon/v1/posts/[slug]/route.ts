import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectDB } from "@core/db";
import { BlogPost } from "@/models";
import { beaconGuard } from "@/lib/beacon/guard";
import { parsePostPatch } from "@/lib/beacon/topics";

export const dynamic = "force-dynamic";

// PATCH /api/beacon/v1/posts/:slug — Beacon sets noindex / ctaProduct.
// A post a human restored (beaconLocked) is refused with 409.
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const denied = beaconGuard(request);
  if (denied) return denied;

  const { slug } = await params;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }
  const parsed = parsePostPatch(body);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });
  const { patch } = parsed;

  await connectDB();
  const post = await BlogPost.findOne({ slug })
    .select("slug noindex ctaProduct beaconLocked")
    .lean<{ _id: unknown; noindex?: boolean; ctaProduct?: string | null; beaconLocked?: boolean } | null>();
  if (!post) return NextResponse.json({ error: "not found" }, { status: 404 });
  if (post.beaconLocked) return NextResponse.json({ error: "locked" }, { status: 409 });

  const set: Record<string, unknown> = {};
  const unset: Record<string, ""> = {};
  if (patch.noindex === true) {
    set.noindex = true;
    set.noindexedAt = new Date();
    if (patch.reason !== undefined) set.noindexReason = patch.reason;
  } else if (patch.noindex === false) {
    set.noindex = false;
    unset.noindexedAt = "";
    unset.noindexReason = "";
  }
  if (patch.ctaProduct !== undefined) set.ctaProduct = patch.ctaProduct;

  // Guard the lock in the write too, so a human restore between read and write wins.
  const res = await BlogPost.updateOne(
    { slug, beaconLocked: { $ne: true } },
    { $set: set, ...(Object.keys(unset).length ? { $unset: unset } : {}) }
  );
  if (res.matchedCount === 0) return NextResponse.json({ error: "locked" }, { status: 409 });

  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  revalidatePath("/sitemap.xml");

  return NextResponse.json({
    ok: true,
    before: { noindex: post.noindex === true, ctaProduct: post.ctaProduct ?? null },
  });
}
