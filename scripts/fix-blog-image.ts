// Script to regenerate a blog image using Cloudinary
// Run with: npx ts-node scripts/fix-blog-image.ts

import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import OpenAI from "openai";
import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI!;
const BLOG_SLUG = "the-rise-of-personalized-learning-paths-how-ai-is-adapting-to-individual-student-needs-in-real-time";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Blog schema (simplified for this script)
const blogPostSchema = new mongoose.Schema({
  title: String,
  slug: String,
  featuredImage: String,
  content: String,
}, { collection: "blogposts" });

const BlogPost = mongoose.model("BlogPost", blogPostSchema);

async function generateAndUploadImage(title: string): Promise<string> {
  console.log("Generating image with DALL-E 3...");

  const prompt = `Create a professional, modern hero image for a blog post titled "${title}".
The image should represent personalized learning and AI in education.
Style: professional corporate photography, clean minimal design, soft lighting, modern educational setting, high quality, sharp focus.
Include visual elements that suggest: adaptive learning paths, student progress, personalized education, AI technology.
Do NOT include any text in the image.`;

  const response = await openai.images.generate({
    model: "dall-e-3",
    prompt,
    n: 1,
    size: "1792x1024",
    quality: "standard",
    response_format: "url",
  });

  if (!response.data || response.data.length === 0) {
    throw new Error("No data in DALL-E response");
  }
  const tempUrl = response.data[0]?.url;
  if (!tempUrl) {
    throw new Error("Failed to generate image");
  }

  console.log("Image generated, uploading to Cloudinary...");

  // Upload to Cloudinary
  const timestamp = Date.now();
  const safeFilename = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .slice(0, 50);

  const result = await cloudinary.uploader.upload(tempUrl, {
    public_id: `blog/${safeFilename}-${timestamp}`,
    folder: "evelyn-blog",
    resource_type: "image",
    format: "png",
  });

  console.log("Uploaded to Cloudinary:", result.secure_url);
  return result.secure_url;
}

async function main() {
  console.log("Connecting to database...");
  await mongoose.connect(MONGODB_URI);
  console.log("Connected!");

  // Find the blog post
  const post = await BlogPost.findOne({ slug: BLOG_SLUG });
  if (!post) {
    console.error("Blog post not found:", BLOG_SLUG);
    process.exit(1);
  }

  console.log("Found blog post:", post.title);
  console.log("Current image:", post.featuredImage);

  // Generate and upload new image
  const newImageUrl = await generateAndUploadImage(post.title!);

  // Update the blog post
  await BlogPost.updateOne(
    { slug: BLOG_SLUG },
    { $set: { featuredImage: newImageUrl } }
  );

  console.log("Blog post updated with new image!");
  console.log("New image URL:", newImageUrl);

  await mongoose.disconnect();
  console.log("Done!");
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
