import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generateBlogPost } from "@/lib/services/blog-generator";
import {
  BlogGenerationRequest,
  BLOG_CATEGORIES,
  BlogCategory,
} from "@/types/blog-generator";

// POST - Generate a blog post using AI
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      topic,
      category,
      targetMarket,
      tone,
      length,
      aiProvider,
      keywords,
      includeProductMention,
    } = body;

    // Validate required fields
    if (!topic || typeof topic !== "string" || topic.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Topic is required" },
        { status: 400 }
      );
    }

    if (!category || !BLOG_CATEGORIES.includes(category as BlogCategory)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid category. Must be one of: ${BLOG_CATEGORIES.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // Build request object
    const generationRequest: BlogGenerationRequest = {
      topic: topic.trim(),
      category: category as BlogCategory,
      targetMarket: targetMarket || undefined,
      tone: tone || "professional",
      length: length || "medium",
      aiProvider: aiProvider || "claude",
      keywords: Array.isArray(keywords) ? keywords : [],
      includeProductMention: includeProductMention !== false,
    };

    // Generate the blog post
    const generatedPost = await generateBlogPost(generationRequest);

    return NextResponse.json({
      success: true,
      post: generatedPost,
    });
  } catch (error) {
    console.error("Blog generation error:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to generate blog post",
      },
      { status: 500 }
    );
  }
}
