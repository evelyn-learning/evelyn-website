import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  generateBlogImage,
  generateAndSaveBlogImage,
  extractImageKeywords,
} from "@/lib/services/image-service";
import { ImageStyle } from "@/types/blog-generator";

// POST - Generate a DALL-E image for a blog post
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, keywords, style = "professional", content, saveLocally = true } = body;

    // Validate required fields
    if (!title || typeof title !== "string") {
      return NextResponse.json(
        { success: false, error: "Title is required" },
        { status: 400 }
      );
    }

    // Validate style
    const validStyles: ImageStyle[] = ["professional", "illustrative", "abstract"];
    if (!validStyles.includes(style as ImageStyle)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid style. Must be one of: ${validStyles.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // Use provided keywords or extract from title/content
    const imageKeywords =
      Array.isArray(keywords) && keywords.length > 0
        ? keywords
        : extractImageKeywords(title, content);

    if (saveLocally) {
      // Generate and save to local storage
      const result = await generateAndSaveBlogImage(title, content, style as ImageStyle);

      return NextResponse.json({
        success: true,
        image: {
          imageUrl: result.localUrl,
          originalUrl: result.originalUrl,
          altText: result.altText,
          prompt: result.prompt,
          style,
        },
      });
    } else {
      // Just generate, return temporary URL
      const image = await generateBlogImage(title, imageKeywords, style as ImageStyle);

      return NextResponse.json({
        success: true,
        image,
      });
    }
  } catch (error) {
    console.error("Image generation error:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to generate image",
      },
      { status: 500 }
    );
  }
}
