import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@core/db";
import { BlogPost } from "@/models";
import { beaconGuard } from "@/lib/beacon/guard";

export const dynamic = "force-dynamic";

// GET /api/beacon/v1/posts — published posts with their Beacon flags.
export async function GET(request: NextRequest) {
  const denied = beaconGuard(request);
  if (denied) return denied;

  await connectDB();
  const posts = await BlogPost.find({ status: "published" })
    .select("slug title publishedAt createdAt noindex ctaProduct beaconLocked")
    .sort({ publishedAt: -1 })
    .lean<
      Array<{
        slug: string;
        title: string;
        publishedAt?: Date;
        createdAt: Date;
        noindex?: boolean;
        ctaProduct?: string | null;
        beaconLocked?: boolean;
      }>
    >();

  return NextResponse.json({
    posts: posts.map((p) => ({
      slug: p.slug,
      title: p.title,
      publishedAt: new Date(p.publishedAt ?? p.createdAt).toISOString(),
      noindex: p.noindex === true,
      ctaProduct: p.ctaProduct ?? null,
      beaconLocked: p.beaconLocked === true,
    })),
  });
}
