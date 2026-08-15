import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generateTopicSuggestions } from "@/lib/services/blog-generator";
import { BLOG_CATEGORIES, BlogCategory, AIProvider } from "@/types/blog-generator";

// GET - Get AI-generated topic suggestions
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get("category");
    const targetMarket = searchParams.get("targetMarket");
    const aiProvider = (searchParams.get("aiProvider") as AIProvider) || "claude";
    const existingTopicsParam = searchParams.get("existingTopics");

    // Validate category
    if (!category || !BLOG_CATEGORIES.includes(category as BlogCategory)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid category. Must be one of: ${BLOG_CATEGORIES.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // Parse existing topics
    let existingTopics: string[] = [];
    if (existingTopicsParam) {
      try {
        existingTopics = JSON.parse(existingTopicsParam);
      } catch {
        existingTopics = existingTopicsParam.split(",").map((t) => t.trim());
      }
    }

    // Generate topic suggestions
    const topics = await generateTopicSuggestions(
      category as BlogCategory,
      targetMarket || undefined,
      existingTopics.length > 0 ? existingTopics : undefined,
      aiProvider
    );

    return NextResponse.json({
      success: true,
      topics,
    });
  } catch (error) {
    console.error("Topic suggestion error:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to generate topic suggestions",
      },
      { status: 500 }
    );
  }
}
