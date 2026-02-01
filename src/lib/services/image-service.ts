// Image Service for Blog Images
// Fetches high-quality stock photos from Unsplash API

import { v2 as cloudinary } from "cloudinary";
import { ImageSuggestion, ImageStyle } from "@/types/blog-generator";
import fs from "fs";
import path from "path";
import https from "https";

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

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

// Style-specific Unsplash search modifiers
const STYLE_MODIFIERS: Record<ImageStyle, string> = {
  professional: "office business corporate professional",
  illustrative: "colorful creative design modern",
  abstract: "abstract technology digital minimal",
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

// Unsplash API response types
interface UnsplashPhoto {
  id: string;
  description: string | null;
  alt_description: string | null;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  user: {
    name: string;
    username: string;
  };
  links: {
    download_location: string;
  };
}

interface UnsplashSearchResponse {
  total: number;
  total_pages: number;
  results: UnsplashPhoto[];
}

// Build search query from title and keywords
function buildSearchQuery(title: string, keywords: string[], style: ImageStyle): string {
  // Extract key terms from title
  const titleWords = title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(" ")
    .filter(word => word.length > 3)
    .slice(0, 3);

  // Combine with keywords and style modifier
  const styleModifier = STYLE_MODIFIERS[style];
  const allTerms = [...titleWords, ...keywords.slice(0, 2), styleModifier];

  // Create focused search query
  return allTerms.join(" ");
}

// Trigger download event for Unsplash API compliance
async function triggerDownloadEvent(downloadLocation: string): Promise<void> {
  if (!UNSPLASH_ACCESS_KEY) return;

  try {
    await fetch(`${downloadLocation}?client_id=${UNSPLASH_ACCESS_KEY}`);
  } catch (error) {
    console.warn("[Unsplash] Failed to trigger download event:", error);
  }
}

// Search and get image from Unsplash
export async function generateBlogImage(
  title: string,
  keywords: string[],
  style: ImageStyle = "professional",
  isFallback: boolean = false
): Promise<ImageSuggestion> {
  if (!UNSPLASH_ACCESS_KEY) {
    throw new Error("UNSPLASH_ACCESS_KEY is not configured");
  }

  const searchQuery = buildSearchQuery(title, keywords, style);
  console.log(`[Unsplash] Searching for: "${searchQuery}"`);

  try {
    // Search Unsplash for relevant images
    const searchUrl = new URL("https://api.unsplash.com/search/photos");
    searchUrl.searchParams.set("query", searchQuery);
    searchUrl.searchParams.set("orientation", "landscape");
    searchUrl.searchParams.set("per_page", "10");
    searchUrl.searchParams.set("order_by", "relevant");

    const response = await fetch(searchUrl.toString(), {
      headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        "Accept-Version": "v1",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Unsplash API error: ${response.status} - ${errorText}`);
    }

    const data: UnsplashSearchResponse = await response.json();

    if (!data.results || data.results.length === 0) {
      if (isFallback) {
        throw new Error("No images found even with fallback search");
      }
      // Fallback to generic education search (only once)
      console.log("[Unsplash] No results, trying fallback search...");
      return generateBlogImage("education technology", ["education", "technology", "learning"], style, true);
    }

    // Pick a random image from top results for variety
    const randomIndex = Math.floor(Math.random() * Math.min(data.results.length, 5));
    const photo = data.results[randomIndex];

    // Trigger download event (required by Unsplash API guidelines)
    await triggerDownloadEvent(photo.links.download_location);

    // Use regular size (1080px width) - good balance of quality and size
    const imageUrl = photo.urls.regular;

    // Generate alt text
    const altText = photo.alt_description ||
      photo.description ||
      `${title} - Photo by ${photo.user.name} on Unsplash`;

    console.log(`[Unsplash] Found image by ${photo.user.name}`);

    return {
      imageUrl,
      altText,
      prompt: searchQuery, // Store search query as "prompt" for reference
      style,
    };
  } catch (error) {
    console.error("[Unsplash] Image search failed:", error);
    throw error;
  }
}

// Sanitize filename to prevent path traversal attacks
function sanitizeFilename(filename: string): string {
  // Get basename to strip any path components
  const basename = path.basename(filename);
  // Limit input length to prevent ReDoS attacks before regex operations
  const truncated = basename.slice(0, 200).toLowerCase();
  // Remove all non-alphanumeric characters except hyphens
  const sanitized = truncated.replace(/[^a-z0-9]+/g, "-");
  // Remove leading/trailing hyphens without using alternation regex
  const trimmed = sanitized.replace(/^-+/, "").replace(/-+$/, "");
  return trimmed.slice(0, 50) || "image"; // Fallback if empty
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

  // Search for image on Unsplash
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
