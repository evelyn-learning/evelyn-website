/**
 * Seed Script for Showcase Prospects
 *
 * Run with: npx ts-node scripts/showcase/seed-prospects.ts
 * Or: npx tsx scripts/showcase/seed-prospects.ts
 *
 * Make sure MONGODB_URI is set in your .env.local
 */

import mongoose from "mongoose";
import * as dotenv from "dotenv";
import * as fs from "fs";
import path from "path";

// Load environment variables
dotenv.config({ path: path.join(__dirname, "../../.env.local") });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI not found in .env.local");
  process.exit(1);
}

// Define schema inline (matches the new multi-page structure)
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

// Calculate expiry date (14 days from now)
function getExpiryDate(days: number = 14): Date {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

// Path to JSON content files
const CONTENT_DIR = path.join(__dirname, "../../apps/marketing/src/data/showcase-content");

// Load site content from JSON file if available
function loadSiteContent(slug: string): Record<string, unknown> | null {
  const filePath = path.join(CONTENT_DIR, `${slug}.json`);
  if (fs.existsSync(filePath)) {
    try {
      const content = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(content);
    } catch (error) {
      console.warn(`⚠️  Could not load content for ${slug}:`, error);
    }
  }
  return null;
}

// Prospect data - basic info for all prospects
// For prospects with JSON content files, that content will be loaded and merged
interface ProspectData {
  slug: string;
  businessName: string;
  businessType: string;
  originalWebsiteUrl: string;
  accessCode: string;
  tagline?: string;
  branding?: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    logoText?: string;
  };
  contact?: {
    email: string;
    phone: string;
    address: string;
    businessHours: string;
  };
  testimonials?: Array<{ quote: string; author: string; role?: string }>;
}

const PROSPECTS: ProspectData[] = [
  {
    slug: "firstschoolofmath",
    businessName: "First School of Mathematics",
    businessType: "test-prep",
    originalWebsiteUrl: "https://www.firstschoolofmath.com/",
    accessCode: "FSOM2025",
  },
  {
    slug: "boostmyact",
    businessName: "Boost My ACT Test Preparation",
    businessType: "test-prep",
    originalWebsiteUrl: "https://educationmotivationtx.com/",
    accessCode: "BMACT2025",
    tagline: "Expert ACT Prep Workshops in Dallas-Fort Worth",
    branding: {
      primaryColor: "#DC2626",
      secondaryColor: "#991B1B",
      accentColor: "#FBBF24",
      logoText: "BMACT",
    },
    contact: {
      email: "",
      phone: "",
      address: "Dallas-Fort Worth, TX",
      businessHours: "",
    },
  },
  {
    slug: "thetutors",
    businessName: "The Tutors",
    businessType: "test-prep",
    originalWebsiteUrl: "https://thetutorsmemphis.com/",
    accessCode: "TTUT2025",
    tagline: "Premier Test Prep & Tutoring in Memphis",
    branding: {
      primaryColor: "#7C3AED",
      secondaryColor: "#6D28D9",
      accentColor: "#F59E0B",
      logoText: "TT",
    },
    contact: {
      email: "",
      phone: "",
      address: "Memphis, TN",
      businessHours: "",
    },
  },
  {
    slug: "collegeconsultingllc",
    businessName: "College Consulting LLC",
    businessType: "college-consulting",
    originalWebsiteUrl: "https://www.collegeconsulting.net/",
    accessCode: "CCLC2025",
    tagline: "40+ Years of College Admissions Expertise",
    branding: {
      primaryColor: "#0D9488",
      secondaryColor: "#0F766E",
      accentColor: "#F59E0B",
      logoText: "CC",
    },
    contact: {
      email: "COLLEGECONSULTING@EARTHLINK.NET",
      phone: "(203) 505-5168",
      address: "Westport, CT 06880",
      businessHours: "",
    },
    testimonials: [
      {
        quote:
          "Mary Lou was a life saver. She provided a bridge for communicating with my daughter about the college planning process.",
        author: "Parent",
        role: "Westport, CT",
      },
      {
        quote: "Mary Lou saw strengths in my daughter that even her own school counselor did not.",
        author: "Parent",
        role: "Fairfield, CT",
      },
    ],
  },
  {
    slug: "tutorateam",
    businessName: "Tutor A Team",
    businessType: "tutoring",
    originalWebsiteUrl: "https://tutorateam.com/",
    accessCode: "TATE2025",
    tagline: "In-Home Tutoring & Special Education Support",
    branding: {
      primaryColor: "#059669",
      secondaryColor: "#047857",
      accentColor: "#F59E0B",
      logoText: "TAT",
    },
    contact: {
      email: "",
      phone: "",
      address: "Virginia Beach, VA",
      businessHours: "",
    },
  },
];

async function seed() {
  console.log("🌱 Starting seed...\n");

  try {
    await mongoose.connect(MONGODB_URI!);
    console.log("✅ Connected to MongoDB\n");

    // Ensure content directory exists
    if (!fs.existsSync(CONTENT_DIR)) {
      fs.mkdirSync(CONTENT_DIR, { recursive: true });
      console.log(`📁 Created content directory: ${CONTENT_DIR}\n`);
    }

    for (const prospect of PROSPECTS) {
      // Check if already exists
      const existing = await ShowcaseSite.findOne({ slug: prospect.slug });
      if (existing) {
        console.log(`⏭️  Skipping ${prospect.businessName} (already exists)`);
        continue;
      }

      // Try to load rich content from JSON file
      const jsonContent = loadSiteContent(prospect.slug);

      // Build site data
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let siteData: any;

      if (jsonContent) {
        // Use JSON content (has all the rich multi-page data)
        siteData = {
          slug: jsonContent.slug || prospect.slug,
          businessName: jsonContent.businessName || prospect.businessName,
          tagline: jsonContent.tagline,
          businessType: jsonContent.businessType || prospect.businessType,
          originalWebsiteUrl: jsonContent.originalWebsiteUrl || prospect.originalWebsiteUrl,
          accessCode: prospect.accessCode, // Always use prospect's access code
          status: "active",
          expiryDate: getExpiryDate(14),
          trialDays: 14,
          branding: jsonContent.branding,
          contact: jsonContent.contact,
          pages: jsonContent.pages,
          testimonials: jsonContent.testimonials,
          stats: jsonContent.stats,
          enabledTools: ["test-generator", "homework-helper", "essay-scorer"],
          analytics: {
            totalViews: 0,
            uniqueVisitors: 0,
            toolUsage: {},
            viewHistory: [],
          },
        };
      } else {
        // Use basic prospect data
        siteData = {
          slug: prospect.slug,
          businessName: prospect.businessName,
          tagline: prospect.tagline,
          businessType: prospect.businessType,
          originalWebsiteUrl: prospect.originalWebsiteUrl,
          accessCode: prospect.accessCode,
          status: "active",
          expiryDate: getExpiryDate(14),
          trialDays: 14,
          branding: prospect.branding || {
            primaryColor: "#10B981",
            secondaryColor: "#0F766E",
            accentColor: "#F59E0B",
          },
          contact: prospect.contact || {
            email: "",
            phone: "",
            address: "",
            businessHours: "",
          },
          pages: {},
          testimonials: prospect.testimonials || [],
          stats: [],
          enabledTools: ["test-generator", "homework-helper", "essay-scorer"],
          analytics: {
            totalViews: 0,
            uniqueVisitors: 0,
            toolUsage: {},
            viewHistory: [],
          },
        };
      }

      const site = await ShowcaseSite.create(siteData);

      console.log(`✅ Created: ${site.businessName}`);
      console.log(`   URL: /showcase/${site.slug}`);
      console.log(`   Access Code: ${site.accessCode}`);
      console.log(`   Content Source: ${jsonContent ? "JSON file ✨" : "basic data"}\n`);
    }

    console.log("\n🎉 Seed complete!");
    console.log("\nAccess codes:");
    PROSPECTS.forEach((p) => {
      console.log(`  • ${p.businessName}: ${p.accessCode}`);
    });
  } catch (error) {
    console.error("❌ Seed error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("\n👋 Disconnected from MongoDB");
  }
}

seed();
