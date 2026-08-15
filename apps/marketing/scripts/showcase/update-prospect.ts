/**
 * Update Script for Showcase Prospects
 *
 * Updates an existing showcase site from its JSON content file.
 * Run with: npx tsx scripts/showcase/update-prospect.ts <slug>
 * Example: npx tsx scripts/showcase/update-prospect.ts firstschoolofmath
 *
 * Make sure MONGODB_URI is set in your .env.local
 */

import mongoose from "mongoose";
import * as dotenv from "dotenv";
import * as fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// ESM compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, "../../.env.local") });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI not found in .env.local");
  process.exit(1);
}

// Define schema inline (matches the multi-page structure)
const ShowcaseSiteSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    businessName: { type: String, required: true, trim: true },
    tagline: { type: String, trim: true },
    businessType: {
      type: String,
      required: true,
      enum: ["test-prep", "college-consulting", "tutoring", "homeschool", "special-ed"],
    },
    originalWebsiteUrl: { type: String, required: true },
    accessCode: { type: String, required: true, minlength: 6 },
    accessAttempts: { type: Number, default: 0 },
    lastAccessAt: Date,
    status: {
      type: String,
      enum: ["active", "expired", "purchased", "draft"],
      default: "active",
    },
    expiryDate: { type: Date, required: true },
    trialDays: { type: Number, default: 14 },
    branding: {
      primaryColor: { type: String, default: "#10B981" },
      secondaryColor: { type: String, default: "#0F766E" },
      accentColor: { type: String, default: "#F59E0B" },
      logoText: String,
      logoUrl: String,
      faviconUrl: String,
    },
    contact: {
      email: { type: String, default: "" },
      phone: { type: String, default: "" },
      address: { type: String, default: "" },
      businessHours: { type: String, default: "" },
    },
    pages: { type: mongoose.Schema.Types.Mixed, default: {} },
    testimonials: [{ quote: String, author: String, role: String }],
    stats: [{ value: String, label: String }],
    enabledTools: { type: [String], default: ["test-generator", "homework-helper", "essay-scorer"] },
    toolLimits: { type: Map, of: Number },
    analytics: {
      totalViews: { type: Number, default: 0 },
      uniqueVisitors: { type: Number, default: 0 },
      toolUsage: { type: Map, of: Number, default: {} },
      lastViewedAt: Date,
      viewHistory: [{ date: Date, count: Number }],
    },
    subscriptionTier: { type: String, enum: ["starter", "professional", "enterprise"] },
    stripeCustomerId: String,
    stripeSubscriptionId: String,
    paidAt: Date,
    outreachMethod: { type: String, enum: ["email", "linkedin", "contact-form", "phone"] },
    outreachSentAt: Date,
    outreachNotes: String,
  },
  { timestamps: true }
);

const ShowcaseSite = mongoose.model("ShowcaseSite", ShowcaseSiteSchema);

// Path to JSON content files
const CONTENT_DIR = path.join(__dirname, "../../src/data/showcase-content");

// Load site content from JSON file
function loadSiteContent(slug: string): Record<string, unknown> | null {
  const filePath = path.join(CONTENT_DIR, `${slug}.json`);
  if (fs.existsSync(filePath)) {
    try {
      const content = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(content);
    } catch (error) {
      console.error(`❌ Could not load content for ${slug}:`, error);
    }
  }
  return null;
}

async function updateProspect(slug: string) {
  console.log(`\n🔄 Updating showcase site: ${slug}\n`);

  try {
    await mongoose.connect(MONGODB_URI!);
    console.log("✅ Connected to MongoDB\n");

    // Check if site exists
    const existing = await ShowcaseSite.findOne({ slug });
    if (!existing) {
      console.error(`❌ Site "${slug}" not found in database. Use seed script to create it first.`);
      process.exit(1);
    }

    // Load JSON content
    const jsonContent = loadSiteContent(slug);
    if (!jsonContent) {
      console.error(`❌ JSON content file not found at: ${CONTENT_DIR}/${slug}.json`);
      process.exit(1);
    }

    // Update the site with new content (preserve some existing fields)
    const updateData = {
      businessName: jsonContent.businessName || existing.businessName,
      tagline: jsonContent.tagline,
      businessType: jsonContent.businessType || existing.businessType,
      originalWebsiteUrl: jsonContent.originalWebsiteUrl || existing.originalWebsiteUrl,
      branding: jsonContent.branding || existing.branding,
      contact: jsonContent.contact || existing.contact,
      pages: jsonContent.pages || existing.pages,
      testimonials: jsonContent.testimonials || existing.testimonials,
      stats: jsonContent.stats || existing.stats,
      // Keep access code, status, analytics, etc. from existing
    };

    const result = await ShowcaseSite.updateOne({ slug }, { $set: updateData });

    if (result.modifiedCount > 0) {
      console.log(`✅ Updated: ${updateData.businessName}`);
      console.log(`   URL: /showcase/${slug}`);
      console.log(`   Pages updated: ${Object.keys(jsonContent.pages || {}).join(", ") || "none"}`);
      console.log(`   Testimonials: ${(jsonContent.testimonials as unknown[])?.length || 0}`);
      console.log(`   Stats: ${(jsonContent.stats as unknown[])?.length || 0}`);
    } else {
      console.log("⚠️  No changes made (content may be the same)");
    }

    console.log("\n🎉 Update complete!");
  } catch (error) {
    console.error("❌ Update error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("\n👋 Disconnected from MongoDB");
  }
}

// Get slug from command line arguments
const slug = process.argv[2];

if (!slug) {
  console.error("❌ Please provide a slug as an argument");
  console.error("   Usage: npx tsx scripts/showcase/update-prospect.ts <slug>");
  console.error("   Example: npx tsx scripts/showcase/update-prospect.ts firstschoolofmath");
  process.exit(1);
}

updateProspect(slug);
