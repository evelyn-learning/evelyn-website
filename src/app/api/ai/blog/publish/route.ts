import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@core/db";
import { BlogPost } from "@/models/BlogPost";
import { GeneratedBlogPost } from "@/types/blog-generator";

// POST - Publish a generated blog post
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { generatedPost, status = "published" } = body;

    if (!generatedPost) {
      return NextResponse.json(
        { success: false, error: "Generated post data is required" },
        { status: 400 }
      );
    }

    const post = generatedPost as GeneratedBlogPost;

    // Validate required fields
    if (!post.title || !post.content || !post.slug) {
      return NextResponse.json(
        { success: false, error: "Post must have title, content, and slug" },
        { status: 400 }
      );
    }

    await connectDB();

    // Check for slug uniqueness
    let slug = post.slug;
    const existingPost = await BlogPost.findOne({ slug });
    if (existingPost) {
      slug = `${slug}-${Date.now()}`;
    }

    // Create the blog post
    const blogPost = await BlogPost.create({
      title: post.title,
      slug,
      excerpt: post.excerpt,
      content: post.content,
      quickAnswer: post.quickAnswer,
      featuredImage: post.featuredImage,
      category: post.category,
      tags: post.tags || [],
      author: post.author || session.user?.name || "Evelyn Learning",
      status: status === "published" ? "published" : "draft",
      publishedAt: status === "published" ? new Date() : undefined,
      metaTitle: post.metaTitle,
      metaDescription: post.metaDescription,
      readingTime: post.readingTime,
    });

    return NextResponse.json(
      {
        success: true,
        postId: blogPost._id.toString(),
        slug: blogPost.slug,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Blog publish error:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to publish blog post",
      },
      { status: 500 }
    );
  }
}
