import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface GenerateRequest {
  type: "blog_post" | "social_media" | "email" | "outline";
  topic: string;
  tone?: "professional" | "casual" | "educational" | "engaging";
  length?: "short" | "medium" | "long";
  additionalContext?: string;
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { message: "OpenAI API key not configured" },
      { status: 500 }
    );
  }

  const body: GenerateRequest = await request.json();
  const { type, topic, tone = "educational", length = "medium", additionalContext } = body;

  if (!topic) {
    return NextResponse.json({ message: "Topic is required" }, { status: 400 });
  }

  let prompt = "";
  let maxTokens = 1500;

  switch (type) {
    case "blog_post":
      maxTokens = length === "short" ? 800 : length === "long" ? 3000 : 1500;
      prompt = `Write a ${tone} blog post about "${topic}" for an educational content company called Evelyn Learning.

The blog post should:
- Be informative and valuable for educators, educational publishers, and learning professionals
- Include an engaging introduction
- Have clear headings and subheadings
- Include practical insights or actionable advice
- End with a conclusion that reinforces key points

${additionalContext ? `Additional context: ${additionalContext}` : ""}

Write the content in Markdown format with proper headings (## for main sections, ### for subsections).`;
      break;

    case "social_media":
      maxTokens = 500;
      prompt = `Create engaging social media content about "${topic}" for Evelyn Learning, an educational content company.

Generate:
1. A LinkedIn post (professional, 150-200 words)
2. A Twitter/X thread (3-4 tweets, educational and engaging)
3. Key hashtags to use

${additionalContext ? `Additional context: ${additionalContext}` : ""}

Focus on education, e-learning, EdTech, and learning innovation themes.`;
      break;

    case "email":
      maxTokens = 1000;
      prompt = `Write a professional email newsletter segment about "${topic}" for Evelyn Learning's subscribers.

The email should:
- Have an attention-grabbing subject line
- Be informative yet concise
- Include a clear call-to-action
- Be suitable for educational professionals and publishers

${additionalContext ? `Additional context: ${additionalContext}` : ""}`;
      break;

    case "outline":
      maxTokens = 800;
      prompt = `Create a detailed content outline for a blog post about "${topic}" for Evelyn Learning.

Include:
- Suggested title options (3 variations)
- Introduction approach
- Main sections with key points to cover
- Potential subheadings
- Suggested conclusion angle
- Target keywords for SEO

${additionalContext ? `Additional context: ${additionalContext}` : ""}`;
      break;

    default:
      return NextResponse.json({ message: "Invalid content type" }, { status: 400 });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: `You are a content writer for Evelyn Learning, a leading educational content development company. Your content should be:
- Professional and authoritative
- Focused on education, e-learning, and EdTech
- Valuable for educators, publishers, and learning professionals
- Well-structured and easy to read`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: maxTokens,
      temperature: 0.7,
    });

    const generatedContent = completion.choices[0]?.message?.content;

    return NextResponse.json({
      content: generatedContent,
      type,
      topic,
      tokens: completion.usage?.total_tokens,
    });
  } catch (error: any) {
    console.error("OpenAI API error:", error);
    return NextResponse.json(
      { message: error.message || "Failed to generate content" },
      { status: 500 }
    );
  }
}
