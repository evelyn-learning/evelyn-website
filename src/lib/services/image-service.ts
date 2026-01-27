// Image Service for DALL-E Image Generation
// Generates custom blog images using OpenAI's DALL-E 3

import OpenAI from "openai";
import { v2 as cloudinary } from "cloudinary";
import { ImageSuggestion, ImageStyle } from "@/types/blog-generator";
import { getImagePrompt } from "@/lib/prompts/blog-prompts";
import fs from "fs";
import path from "path";
import https from "https";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Configure Cloudinary if credentials are available
const isCloudinaryConfigured = !!(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

// Style-specific DALL-E prompt modifiers
const STYLE_MODIFIERS: Record<ImageStyle, string> = {
  professional:
    "professional corporate photography, clean minimal design, soft lighting, modern office or educational setting, high quality, sharp focus",
  illustrative:
    "modern digital illustration, flat design with depth, vibrant gradient colors, educational iconography, clean vector-style art",
  abstract:
    "abstract conceptual art, geometric shapes, flowing gradients, blue and purple color palette, modern minimalist design, technology-inspired patterns",
};

// Extract keywords from blog title and content
export function extractImageKeywords(
  title: string,
  content?: string
): string[] {
  // Common education/tech keywords to look for
  const keywordPatterns = [
    "AI",
    "artificial intelligence",
    "machine learning",
    "education",
    "learning",
    "teaching",
    "student",
    "teacher",
    "tutor",
    "assessment",
    "test",
    "exam",
    "essay",
    "writing",
    "homework",
    "practice",
    "personalized",
    "adaptive",
    "feedback",
    "analytics",
    "data",
    "technology",
    "digital",
    "online",
    "platform",
    "classroom",
    "school",
    "university",
    "college",
  ];

  const combinedText = `${title} ${content || ""}`.toLowerCase();
  const foundKeywords: string[] = [];

  for (const keyword of keywordPatterns) {
    if (combinedText.includes(keyword.toLowerCase())) {
      foundKeywords.push(keyword);
    }
  }

  // Add generic relevant keywords if few found
  if (foundKeywords.length < 3) {
    foundKeywords.push("education", "technology", "modern");
  }

  // Limit to top 5 most relevant
  return foundKeywords.slice(0, 5);
}

// Generate image using DALL-E 3
export async function generateBlogImage(
  title: string,
  keywords: string[],
  style: ImageStyle = "professional"
): Promise<ImageSuggestion> {
  // Build the DALL-E prompt
  const basePrompt = getImagePrompt(title, keywords, style);
  const styleModifier = STYLE_MODIFIERS[style];
  const fullPrompt = `${basePrompt}\n\nStyle requirements: ${styleModifier}`;

  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: fullPrompt,
      n: 1,
      size: "1792x1024", // Landscape for blog hero images
      quality: "standard", // Use "hd" for higher quality (more expensive)
      response_format: "url",
    });

    if (!response.data || response.data.length === 0) {
      throw new Error("No data in DALL-E response");
    }
    const imageUrl = response.data[0]?.url;
    if (!imageUrl) {
      throw new Error("No image URL in DALL-E response");
    }

    // Generate alt text based on title and keywords
    const altText = `${title} - ${keywords.slice(0, 3).join(", ")} illustration`;

    return {
      imageUrl,
      altText,
      prompt: fullPrompt,
      style,
    };
  } catch (error) {
    console.error("DALL-E image generation failed:", error);
    throw error;
  }
}

// Sanitize filename to prevent path traversal attacks
function sanitizeFilename(filename: string): string {
  // Get basename to strip any path components
  const basename = path.basename(filename);
  // Remove all non-alphanumeric characters except hyphens
  return basename
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") // Remove leading/trailing hyphens
    .slice(0, 50) || "image"; // Fallback if empty
}

// Upload image to Cloudinary
async function uploadToCloudinary(
  imageUrl: string,
  filename: string
): Promise<string> {
  const timestamp = Date.now();
  const safeFilename = sanitizeFilename(filename);
  const publicId = `blog/${safeFilename}-${timestamp}`;

  const result = await cloudinary.uploader.upload(imageUrl, {
    public_id: publicId,
    folder: "evelyn-blog",
    resource_type: "image",
    format: "png",
  });

  return result.secure_url;
}

// Download and save image to local storage (fallback when Cloudinary not configured)
async function saveToLocalStorage(
  imageUrl: string,
  filename: string
): Promise<string> {
  const publicDir = path.join(process.cwd(), "public", "images", "blog", "generated");

  // Ensure directory exists
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // Generate unique filename with timestamp (sanitized to prevent path traversal)
  const timestamp = Date.now();
  const safeFilename = sanitizeFilename(filename);
  const fullFilename = `${safeFilename}-${timestamp}.png`;
  const filePath = path.join(publicDir, fullFilename);

  // Download the image
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filePath);

    https
      .get(imageUrl, (response) => {
        response.pipe(file);
        file.on("finish", () => {
          file.close();
          // Return the public URL path
          resolve(`/images/blog/generated/${fullFilename}`);
        });
      })
      .on("error", (err) => {
        fs.unlink(filePath, () => {}); // Delete partial file
        reject(err);
      });
  });
}

// Save image - uses Cloudinary if configured, otherwise local storage
export async function saveImageLocally(
  imageUrl: string,
  filename: string
): Promise<string> {
  if (isCloudinaryConfigured) {
    console.log("[Image Service] Uploading to Cloudinary...");
    return uploadToCloudinary(imageUrl, filename);
  } else {
    console.log("[Image Service] Saving to local storage (Cloudinary not configured)");
    return saveToLocalStorage(imageUrl, filename);
  }
}

// Generate and save blog image (combined helper)
export async function generateAndSaveBlogImage(
  title: string,
  content?: string,
  style: ImageStyle = "professional"
): Promise<{
  localUrl: string;
  originalUrl: string;
  altText: string;
  prompt: string;
}> {
  // Extract keywords from title/content
  const keywords = extractImageKeywords(title, content);

  // Generate image with DALL-E
  const imageResult = await generateBlogImage(title, keywords, style);

  // Save locally
  const localUrl = await saveImageLocally(imageResult.imageUrl, title);

  return {
    localUrl,
    originalUrl: imageResult.imageUrl,
    altText: imageResult.altText,
    prompt: imageResult.prompt,
  };
}

// Generate multiple image variations
export async function generateImageVariations(
  title: string,
  content?: string
): Promise<ImageSuggestion[]> {
  const keywords = extractImageKeywords(title, content);
  const styles: ImageStyle[] = ["professional", "illustrative", "abstract"];

  const results: ImageSuggestion[] = [];

  for (const style of styles) {
    try {
      const image = await generateBlogImage(title, keywords, style);
      results.push(image);
    } catch (error) {
      console.error(`Failed to generate ${style} image:`, error);
    }
  }

  return results;
}
