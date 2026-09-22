import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@core/db";
import { PipelineConfig, DEFAULT_STAGES, type IPipelineConfig } from "@/models";
import { PRODUCTS } from "@/lib/outreach/enums";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const docs = await PipelineConfig.find({}).lean<IPipelineConfig[]>();
  const by = new Map(docs.map((d) => [d.product, d.stages]));
  return NextResponse.json({ pipelines: PRODUCTS.map((p) => ({ product: p, stages: by.get(p) ?? DEFAULT_STAGES })) });
}

const putSchema = z.object({ product: z.enum(PRODUCTS), stages: z.array(z.string().min(1).max(40)).min(1).max(20) });

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = putSchema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  await connectDB();
  const doc = await PipelineConfig.findOneAndUpdate(
    { product: parsed.data.product }, { $set: { stages: parsed.data.stages } }, { upsert: true, new: true }
  ).lean<IPipelineConfig>();
  return NextResponse.json({ product: doc!.product, stages: doc!.stages });
}
