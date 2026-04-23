import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { BlogPost } from "@/models";
import { getReadingTime } from "@/lib/utils";

// GET single blog post
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await connectDB();

  const post = await BlogPost.findById(id).lean();
  if (!post) {
    return NextResponse.json({ message: "Post not found" }, { status: 404 });
  }

  return NextResponse.json(post);
}

// PUT update blog post
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();

  await connectDB();

  const post = await BlogPost.findById(id);
  if (!post) {
    return NextResponse.json({ message: "Post not found" }, { status: 404 });
  }

  // Update fields
  const updateData: any = { ...body };
  if (body.content) {
    updateData.readingTime = getReadingTime(body.content);
  }
  if (body.status === "published" && post.status !== "published") {
    updateData.publishedAt = new Date();
  }

  const updatedPost = await BlogPost.findByIdAndUpdate(id, updateData, { new: true });

  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath(`/blog/${post.slug}`);
  if (updatedPost && updatedPost.slug !== post.slug) {
    revalidatePath(`/blog/${updatedPost.slug}`);
  }

  return NextResponse.json(updatedPost);
}

// DELETE blog post
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await connectDB();

  const post = await BlogPost.findByIdAndDelete(id);
  if (!post) {
    return NextResponse.json({ message: "Post not found" }, { status: 404 });
  }

  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath(`/blog/${post.slug}`);

  return NextResponse.json({ message: "Post deleted" });
}
