// Blog Generator Service
// Core AI generation logic using Claude (primary) or GPT-4 (secondary)

import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import {
  BlogGenerationRequest,
  GeneratedBlogPost,
  AIProvider,
  TopicSuggestion,
  BlogCategory,
  TargetMarket,
} from "@/types/blog-generator";
import {
  getBlogSystemPrompt,
  getTopicSuggestionPrompt,
  LENGTH_TARGETS,
} from "@/lib/prompts/blog-prompts";
import { slugify, getReadingTime } from "@/lib/utils";
import { calculateSEOScore } from "./seo-optimizer";

// Initialize AI clients
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Type for the AI-generated blog response
interface AIBlogResponse {
  title: string;
  excerpt: string;
  content: string;
  quickAnswer: string;
  metaTitle: string;
  metaDescription: string;
  tags: string[];
  suggestedKeywords: string[];
}

// Generate blog post using Claude
async function generateWithClaude(
  systemPrompt: string,
  userPrompt: string
): Promise<AIBlogResponse> {
  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 8192,
    messages: [
      {
        role: "user",
        content: `${systemPrompt}\n\n## Topic to Write About\n${userPrompt}\n\nRemember: Return ONLY valid JSON, no additional text or markdown code blocks.`,
      },
    ],
  });

  // Extract text content from response
  const textContent = message.content.find((block) => block.type === "text");
  if (!textContent || textContent.type !== "text") {
    throw new Error("No text content in Claude response");
  }

  // Parse JSON response
  let responseText = textContent.text.trim();

  // Remove markdown code blocks if present
  if (responseText.startsWith("```json")) {
    responseText = responseText.slice(7);
  } else if (responseText.startsWith("```")) {
    responseText = responseText.slice(3);
  }
  if (responseText.endsWith("```")) {
    responseText = responseText.slice(0, -3);
  }
  responseText = responseText.trim();

  try {
    return JSON.parse(responseText) as AIBlogResponse;
  } catch {
    throw new Error(`Failed to parse Claude response as JSON: ${responseText.substring(0, 200)}...`);
  }
}

// Generate blog post using GPT-4
async function generateWithGPT4(
  systemPrompt: string,
  userPrompt: string
): Promise<AIBlogResponse> {
  const completion = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: `Topic to write about: ${userPrompt}\n\nRemember: Return ONLY valid JSON, no additional text.`,
      },
    ],
    response_format: { type: "json_object" },
    max_tokens: 8192,
    temperature: 0.7,
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) {
    throw new Error("No content in GPT-4 response");
  }

  try {
    return JSON.parse(content) as AIBlogResponse;
  } catch {
    throw new Error(`Failed to parse GPT-4 response as JSON: ${content.substring(0, 200)}...`);
  }
}

// Main blog generation function
export async function generateBlogPost(
  request: BlogGenerationRequest
): Promise<GeneratedBlogPost> {
  const {
    topic,
    category,
    targetMarket,
    tone = "professional",
    length = "medium",
    aiProvider = "claude",
    keywords = [],
    includeProductMention = true,
  } = request;

  // Build the system prompt
  const systemPrompt = getBlogSystemPrompt(
    category,
    tone,
    length,
    targetMarket,
    includeProductMention
  );

  // Build the user prompt with optional keywords
  let userPrompt = topic;
  if (keywords.length > 0) {
    userPrompt += `\n\nTarget keywords to naturally include: ${keywords.join(", ")}`;
  }

  // Generate content using selected provider
  let aiResponse: AIBlogResponse;

  if (aiProvider === "gpt4") {
    aiResponse = await generateWithGPT4(systemPrompt, userPrompt);
  } else {
    aiResponse = await generateWithClaude(systemPrompt, userPrompt);
  }

  // Generate slug from title
  const slug = slugify(aiResponse.title);

  // Calculate reading time
  const wordCount = aiResponse.content.split(/\s+/).length;
  const readingTime = getReadingTime(aiResponse.content);

  // Verify content meets length requirements
  const lengthTarget = LENGTH_TARGETS[length];
  if (wordCount < lengthTarget.min * 0.8) {
    console.warn(
      `Generated content (${wordCount} words) is below target minimum (${lengthTarget.min} words)`
    );
  }

  // Calculate SEO score
  const seoScore = calculateSEOScore(
    aiResponse.content,
    aiResponse.title,
    aiResponse.metaTitle,
    aiResponse.metaDescription,
    aiResponse.tags
  );

  return {
    title: aiResponse.title,
    slug,
    excerpt: aiResponse.excerpt,
    content: aiResponse.content,
    quickAnswer: aiResponse.quickAnswer,
    category,
    tags: aiResponse.tags,
    author: "Evelyn Learning",
    metaTitle: aiResponse.metaTitle,
    metaDescription: aiResponse.metaDescription,
    readingTime,
    seoScore,
    generatedAt: new Date(),
    aiProvider,
  };
}

// Generate topic suggestions
export async function generateTopicSuggestions(
  category: BlogCategory,
  targetMarket?: string,
  existingTopics?: string[],
  aiProvider: AIProvider = "claude"
): Promise<TopicSuggestion[]> {
  const prompt = getTopicSuggestionPrompt(
    category,
    targetMarket as TargetMarket | undefined,
    existingTopics
  );

  let responseText: string;

  if (aiProvider === "gpt4") {
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
      max_tokens: 2048,
      temperature: 0.8, // Slightly higher for creativity
    });

    responseText = completion.choices[0]?.message?.content || "[]";
  } else {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2048,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const textContent = message.content.find((block) => block.type === "text");
    if (!textContent || textContent.type !== "text") {
      throw new Error("No text content in response");
    }
    responseText = textContent.text;
  }

  // Clean up response
  responseText = responseText.trim();
  if (responseText.startsWith("```json")) {
    responseText = responseText.slice(7);
  } else if (responseText.startsWith("```")) {
    responseText = responseText.slice(3);
  }
  if (responseText.endsWith("```")) {
    responseText = responseText.slice(0, -3);
  }
  responseText = responseText.trim();

  try {
    const parsed = JSON.parse(responseText);
    // Handle both array and object with topics key
    const topics = Array.isArray(parsed) ? parsed : parsed.topics || [];

    return topics.map((topic: { title: string; description: string; keywords: string[]; relevanceScore: number }) => ({
      title: topic.title,
      description: topic.description,
      keywords: topic.keywords || [],
      relevanceScore: topic.relevanceScore || 0.8,
      category,
      targetMarket: targetMarket as TopicSuggestion["targetMarket"],
    }));
  } catch {
    console.error("Failed to parse topic suggestions:", responseText);
    return [];
  }
}

// Regenerate specific sections
export async function regenerateSection(
  currentContent: string,
  sectionToRegenerate: string,
  instructions: string,
  aiProvider: AIProvider = "claude"
): Promise<string> {
  const prompt = `You are editing an existing blog post. Here is the current content:

${currentContent}

Please regenerate the section "${sectionToRegenerate}" with these instructions: ${instructions}

Return ONLY the new section content in Markdown format, nothing else.`;

  if (aiProvider === "gpt4") {
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1024,
    });
    return completion.choices[0]?.message?.content || "";
  } else {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    });
    const textContent = message.content.find((block) => block.type === "text");
    return textContent?.type === "text" ? textContent.text : "";
  }
}
