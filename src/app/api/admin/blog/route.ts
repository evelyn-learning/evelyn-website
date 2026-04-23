import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { BlogPost } from "@/models";
import { slugify, getReadingTime } from "@/lib/utils";

// GET all blog posts (admin)
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const status = searchParams.get("status");

  const query: any = {};
  if (status) query.status = status;

  const [posts, total] = await Promise.all([
    BlogPost.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    BlogPost.countDocuments(query),
  ]);

  return NextResponse.json({
    posts,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}

// POST create new blog post
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { title, content, excerpt, category, tags, featuredImage, quickAnswer, status } = body;

  if (!title || !content) {
    return NextResponse.json(
      { message: "Title and content are required" },
      { status: 400 }
    );
  }

  await connectDB();

  // Generate slug
  let slug = slugify(title);
  const existingPost = await BlogPost.findOne({ slug });
  if (existingPost) {
    slug = `${slug}-${Date.now()}`;
  }

  const post = await BlogPost.create({
    title,
    slug,
    content,
    excerpt: excerpt || content.substring(0, 200),
    category: category || "Education",
    tags: tags || [],
    featuredImage,
    quickAnswer,
    status: status || "draft",
    publishedAt: status === "published" ? new Date() : undefined,
    readingTime: getReadingTime(content),
    author: session.user?.name || "Evelyn Learning",
  });

  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath(`/blog/${post.slug}`);

  return NextResponse.json(post, { status: 201 });
}
