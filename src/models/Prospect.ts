import mongoose, { Schema, Document } from "mongoose";

export type ProspectStatus =
  | "new"           // Just imported, not processed
  | "scraped"       // Website data extracted
  | "showcase_created" // Demo site created
  | "outreach_pending" // Ready for outreach
  | "email_sent"    // Email sent, waiting for contact form
  | "contacted"     // Both email and contact form done
  | "responded"     // Prospect replied
  | "demo_viewed"   // Prospect viewed the demo
  | "interested"    // Expressed interest
  | "meeting_scheduled" // Call/demo scheduled
  | "converted"     // Became a customer
  | "declined"      // Not interested
  | "unresponsive"; // No response after follow-ups

export type BusinessType = "test-prep" | "college-consulting" | "tutoring" | "homeschool" | "special-ed";

export interface IScrapedImage {
  url: string;
  alt: string;
  context: string; // logo, hero, team, testimonial, general
}

// Navigation item with path for dynamic routing
export interface IScrapedNavItem {
  label: string;          // Display text (e.g., "About Us")
  path: string;           // URL path (e.g., "/about-us")
  originalUrl?: string;   // Full original URL for reference
}

// Per-page scraped content for dynamic rendering
export interface IScrapedPage {
  path: string;           // URL path (e.g., "/about", "/programs/sat-prep")
  title: string;          // Page title
  navLabel?: string;      // Navigation label if different from title

  // Raw content for flexible rendering
  sections: IScrapedSection[];

  // Page-specific extracted data (optional, for enhanced pages)
  heroImage?: string;
  metaDescription?: string;
}

// A section of content on a page
export interface IScrapedSection {
  type: "hero" | "text" | "heading" | "image" | "gallery" | "list" | "cards" | "cta" | "testimonials" | "team" | "faq" | "pricing" | "contact" | "raw";

  // Content fields (used based on type)
  title?: string;
  subtitle?: string;
  content?: string;       // Text content or HTML for "raw" type
  items?: string[];       // For lists
  images?: Array<{ url: string; alt: string; caption?: string }>;

  // For complex sections
  cards?: Array<{
    title: string;
    description?: string;
    image?: string;
    price?: string;
    link?: string;
  }>;

  // Styling hints extracted from original
  backgroundColor?: string;
  textAlign?: "left" | "center" | "right";
  fullWidth?: boolean;
}

export interface IScrapedData {
  // Basic Info
  businessName: string;
  tagline?: string;
  description?: string;

  // Contact
  email?: string;
  phone?: string;
  address?: string;
  businessHours?: string;
  contactFormUrl?: string;

  // Content
  services?: string[];
  programs?: Array<{
    name: string;
    description?: string;
    price?: string;
  }>;
  testimonials?: Array<{
    quote: string;
    author: string;
    role?: string;
    imageUrl?: string;
  }>;
  stats?: Array<{
    value: string;
    label: string;
  }>;
  team?: Array<{
    name: string;
    role?: string;
    bio?: string;
    imageUrl?: string;
  }>;
  faqs?: Array<{
    question: string;
    answer: string;
  }>;

  // Pricing details
  pricingInfo?: {
    summary?: string; // Brief pricing overview
    rates?: Array<{
      service: string;
      price: string;
      details?: string;
    }>;
    hasFreeTrial?: boolean;
    hasFreeConsultation?: boolean;
  };

  // Branding
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  logoUrl?: string;
  heroImageUrl?: string;

  // Navigation - legacy string array (kept for backwards compatibility)
  navItems?: string[];

  // Navigation with paths for dynamic routing
  navigation?: IScrapedNavItem[];

  // All scraped pages with their content
  scrapedPages?: IScrapedPage[];

  // All extracted images
  images?: IScrapedImage[];

  // Social
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  twitter?: string;
  youtube?: string;

  // Additional content
  aboutContent?: string[];
  mission?: string;
  highlights?: string[];

  // Scrape metadata
  scrapedAt?: Date;
  pagesScraped?: number;
  scrapeQuality?: "high" | "medium" | "low"; // How much data we extracted
}

export interface IOutreachLog {
  type: "email" | "contact_form" | "follow_up_email" | "linkedin" | "phone";
  sentAt: Date;
  subject?: string;
  message?: string;
  status: "sent" | "delivered" | "opened" | "replied" | "bounced" | "failed";
  errorMessage?: string;
}

export interface IProspect extends Document {
  // Identity
  instituteName: string;
  website: string;
  slug: string; // Generated from name for showcase URL

  // Classification
  businessType: BusinessType;
  location: string;
  services: string; // From Excel
  estimatedSize: string;
  techAssessment: string;
  potentialSolutions: string;

  // Pipeline Status
  status: ProspectStatus;
  priority: "high" | "medium" | "low";

  // Scraped Data
  scrapedData?: IScrapedData;

  // Showcase Reference
  showcaseSiteId?: mongoose.Types.ObjectId;
  showcaseSlug?: string;
  showcaseAccessCode?: string;

  // Outreach
  outreachLogs: IOutreachLog[];
  lastOutreachAt?: Date;
  nextFollowUpAt?: Date;
  followUpCount: number;

  // Response Tracking
  respondedAt?: Date;
  responseNotes?: string;
  demoViewedAt?: Date;
  demoViewCount: number;

  // Notes
  notes?: string;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

const ProspectSchema = new Schema<IProspect>(
  {
    // Identity
    instituteName: {
      type: String,
      required: true,
      trim: true,
    },
    website: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    // Classification
    businessType: {
      type: String,
      required: true,
      enum: ["test-prep", "college-consulting", "tutoring", "homeschool", "special-ed"],
    },
    location: {
      type: String,
      default: "",
    },
    services: {
      type: String,
      default: "",
    },
    estimatedSize: {
      type: String,
      default: "",
    },
    techAssessment: {
      type: String,
      default: "",
    },
    potentialSolutions: {
      type: String,
      default: "",
    },

    // Pipeline Status
    status: {
      type: String,
      enum: [
        "new", "scraped", "showcase_created", "outreach_pending",
        "email_sent", "contacted", "responded", "demo_viewed",
        "interested", "meeting_scheduled", "converted", "declined", "unresponsive"
      ],
      default: "new",
    },
    priority: {
      type: String,
      enum: ["high", "medium", "low"],
      default: "medium",
    },

    // Scraped Data
    scrapedData: {
      type: Schema.Types.Mixed,
    },

    // Showcase Reference
    showcaseSiteId: {
      type: Schema.Types.ObjectId,
      ref: "ShowcaseSite",
    },
    showcaseSlug: String,
    showcaseAccessCode: String,

    // Outreach
    outreachLogs: [{
      type: {
        type: String,
        enum: ["email", "contact_form", "follow_up_email", "linkedin", "phone"],
        required: true,
      },
      sentAt: {
        type: Date,
        default: Date.now,
      },
      subject: String,
      message: String,
      status: {
        type: String,
        enum: ["sent", "delivered", "opened", "replied", "bounced", "failed"],
        default: "sent",
      },
      errorMessage: String,
    }],
    lastOutreachAt: Date,
    nextFollowUpAt: Date,
    followUpCount: {
      type: Number,
      default: 0,
    },

    // Response Tracking
    respondedAt: Date,
    responseNotes: String,
    demoViewedAt: Date,
    demoViewCount: {
      type: Number,
      default: 0,
    },

    // Notes
    notes: String,
  },
  {
    timestamps: true,
  }
);

// Indexes
ProspectSchema.index({ status: 1 });
ProspectSchema.index({ priority: 1 });
ProspectSchema.index({ businessType: 1 });
ProspectSchema.index({ lastOutreachAt: 1 });
ProspectSchema.index({ nextFollowUpAt: 1 });

// Helper to generate slug
export function generateProspectSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 50);
}

// Helper to determine business type from services
export function inferBusinessType(services: string): BusinessType {
  const lower = services.toLowerCase();
  if (lower.includes("college") || lower.includes("admissions") || lower.includes("counseling")) {
    return "college-consulting";
  }
  if (lower.includes("sat") || lower.includes("act") || lower.includes("test prep") || lower.includes("gre") || lower.includes("gmat") || lower.includes("lsat")) {
    return "test-prep";
  }
  if (lower.includes("homeschool")) {
    return "homeschool";
  }
  if (lower.includes("special") || lower.includes("setss") || lower.includes("iep")) {
    return "special-ed";
  }
  return "tutoring";
}

export const Prospect =
  mongoose.models.Prospect ||
  mongoose.model<IProspect>("Prospect", ProspectSchema);
