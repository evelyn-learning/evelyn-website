import mongoose, { Schema, Document } from "mongoose";

export type BusinessType = "test-prep" | "college-consulting" | "tutoring" | "homeschool" | "special-ed";
export type ShowcaseStatus = "active" | "expired" | "purchased" | "draft" | "demo" | "declined" | "needs_review";

export interface IShowcaseAnalytics {
  totalViews: number;
  uniqueVisitors: number;
  toolUsage: Record<string, number>;
  lastViewedAt?: Date;
  viewHistory: Array<{ date: Date; count: number }>;
}

export interface IShowcaseBranding {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  logoText?: string;
  logoUrl?: string;
  faviconUrl?: string;
  heroImageUrl?: string;
}

export interface IShowcaseImage {
  url: string;
  alt: string;
  context: string; // logo, hero, team, testimonial, general
}

// Navigation item with path for dynamic routing
export interface IShowcaseNavItem {
  label: string;          // Display text (e.g., "About Us")
  path: string;           // URL path (e.g., "/about-us")
  originalUrl?: string;   // Full original URL for reference
}

// Content section for dynamic page rendering
export interface IShowcaseSection {
  type: "hero" | "text" | "heading" | "image" | "gallery" | "list" | "cards" | "cta" | "testimonials" | "team" | "faq" | "pricing" | "contact" | "raw";
  title?: string;
  subtitle?: string;
  content?: string;
  items?: string[];
  images?: Array<{ url: string; alt: string; caption?: string }>;
  cards?: Array<{
    title: string;
    description?: string;
    image?: string;
    price?: string;
    link?: string;
  }>;
  backgroundColor?: string;
  textAlign?: "left" | "center" | "right";
  fullWidth?: boolean;
}

// Per-page content for dynamic rendering
export interface IShowcasePage {
  path: string;           // URL path (e.g., "/about", "/programs/sat-prep")
  title: string;
  navLabel?: string;      // Navigation label if different from title
  sections: IShowcaseSection[];
  heroImage?: string;
  metaDescription?: string;
}

export interface IShowcaseSocial {
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
}

export interface IShowcaseContact {
  email: string;
  phone: string;
  address: string;
  businessHours: string;
}

export interface IShowcaseTestimonial {
  quote: string;
  author: string;
  role?: string;
  imageUrl?: string;
}

export interface IShowcaseStat {
  value: string;
  label: string;
}

export interface IShowcaseCustomQA {
  question: string;
  answer: string;
  enabled: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IShowcaseChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface IShowcaseConversation {
  sessionId: string;
  messages: IShowcaseChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IShowcaseActivity {
  action: 'viewed' | 'expanded_banner' | 'clicked_contact' | 'clicked_schedule' | 'keep_demo' | 'declined' | 'tool_used';
  metadata?: Record<string, unknown>;
  timestamp: Date;
}

export interface IAPIUsageEntry {
  toolId: string;
  timestamp: Date;
  responseTime?: number; // ms
  tokensUsed?: number;
  successful: boolean;
  errorMessage?: string;
}

export interface IToolRequest {
  toolName: string;
  description: string;
  useCase?: string;
  submittedAt: Date;
  status: 'pending' | 'reviewed' | 'planned' | 'declined';
  adminNotes?: string;
}

export interface IShowcaseSite extends Document {
  // Identity
  slug: string;
  businessName: string;
  tagline?: string;
  businessType: BusinessType;
  originalWebsiteUrl: string;

  // Access Control
  accessCode: string;
  accessAttempts: number;
  lastAccessAt?: Date;

  // Status & Expiry
  status: ShowcaseStatus;
  expiryDate: Date;
  trialDays: number;
  declinedAt?: Date;

  // Content - New multi-page structure
  branding: IShowcaseBranding;
  contact: IShowcaseContact;
  pages: Record<string, unknown>; // Flexible page content (home, about, team, programs, pricing, contact)
  testimonials: IShowcaseTestimonial[];
  stats: IShowcaseStat[];

  // Team members (from scraping)
  team?: Array<{ name: string; role?: string; bio?: string; imageUrl?: string }>;

  // Scraped images
  images?: IShowcaseImage[];

  // Navigation items from original site (legacy - string array)
  navItems?: string[];

  // Navigation with paths for dynamic routing
  navigation?: IShowcaseNavItem[];

  // Scraped pages with content for dynamic rendering
  scrapedPages?: IShowcasePage[];

  // Social media links
  social?: IShowcaseSocial;

  // AI Tools Configuration
  enabledTools: string[];
  toolLimits: Record<string, number>;
  toolRequests: IToolRequest[]; // Requests for tools not in the library

  // Chat Configuration
  customQA: IShowcaseCustomQA[];
  conversations: IShowcaseConversation[];

  // Analytics
  analytics: IShowcaseAnalytics;

  // Activity Log (tracks user interactions)
  activityLog: IShowcaseActivity[];

  // API Usage Log (detailed tracking of AI tool API calls)
  apiUsageLog: IAPIUsageEntry[];

  // Subscription & Payment
  subscriptionTier?: "starter" | "professional" | "enterprise";
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  paidAt?: Date;

  // Review Notes (for needs_review status)
  reviewNotes?: string; // Questions or clarifications needed before finalizing demo
  reviewCreatedAt?: Date;

  // Outreach Tracking
  outreachMethod?: "email" | "linkedin" | "contact-form" | "phone";
  outreachSentAt?: Date;
  outreachNotes?: string;
  pendingContactForm?: boolean; // True when email sent but contact form not yet filled
  contactFormFilledAt?: Date;
  contactFormUrl?: string; // URL of prospect's contact page

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

const ShowcaseSiteSchema = new Schema<IShowcaseSite>(
  {
    // Identity
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^[a-z0-9-]+$/,
    },
    businessName: {
      type: String,
      required: true,
      trim: true,
    },
    tagline: {
      type: String,
      trim: true,
    },
    businessType: {
      type: String,
      required: true,
      enum: ["test-prep", "college-consulting", "tutoring", "homeschool", "special-ed"],
    },
    originalWebsiteUrl: {
      type: String,
      required: true,
    },

    // Access Control
    accessCode: {
      type: String,
      required: true,
      minlength: 6,
    },
    accessAttempts: {
      type: Number,
      default: 0,
    },
    lastAccessAt: Date,

    // Status & Expiry
    status: {
      type: String,
      enum: ["active", "expired", "purchased", "draft", "demo", "declined", "needs_review"],
      default: "draft",
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    trialDays: {
      type: Number,
      default: 14,
    },
    declinedAt: {
      type: Date,
    },

    // Branding
    branding: {
      primaryColor: { type: String, default: "#10B981" },
      secondaryColor: { type: String, default: "#0F766E" },
      accentColor: { type: String, default: "#F59E0B" },
      logoText: String,
      logoUrl: String,
      faviconUrl: String,
      heroImageUrl: String,
    },

    // Contact
    contact: {
      email: { type: String, default: "" },
      phone: { type: String, default: "" },
      address: { type: String, default: "" },
      businessHours: { type: String, default: "" },
    },

    // Pages - flexible structure for all page content
    pages: {
      type: Schema.Types.Mixed,
      default: {},
    },

    // Testimonials
    testimonials: [{
      quote: String,
      author: String,
      role: String,
      imageUrl: String,
    }],

    // Stats (displayed on homepage)
    stats: [{
      value: String,
      label: String,
    }],

    // Team members (from scraping)
    team: [{
      name: String,
      role: String,
      bio: String,
      imageUrl: String,
    }],

    // Scraped images
    images: [{
      url: { type: String, required: true },
      alt: { type: String, default: '' },
      context: { type: String, default: 'general' }, // logo, hero, team, testimonial, general
    }],

    // Navigation items from original site (legacy)
    navItems: {
      type: [String],
      default: [],
    },

    // Navigation with paths for dynamic routing
    navigation: [{
      label: { type: String, required: true },
      path: { type: String, required: true },
      originalUrl: String,
    }],

    // Scraped pages with content for dynamic rendering
    scrapedPages: [{
      path: { type: String, required: true },
      title: { type: String, required: true },
      navLabel: String,
      sections: [{
        type: {
          type: String,
          enum: ["hero", "text", "heading", "image", "gallery", "list", "cards", "cta", "testimonials", "team", "faq", "pricing", "contact", "raw"],
          required: true,
        },
        title: String,
        subtitle: String,
        content: String,
        items: [String],
        images: [{
          url: { type: String, required: true },
          alt: { type: String, default: "" },
          caption: String,
        }],
        cards: [{
          title: { type: String, required: true },
          description: String,
          image: String,
          price: String,
          link: String,
        }],
        backgroundColor: String,
        textAlign: { type: String, enum: ["left", "center", "right"] },
        fullWidth: Boolean,
      }],
      heroImage: String,
      metaDescription: String,
    }],

    // Social media links
    social: {
      facebook: String,
      twitter: String,
      instagram: String,
      linkedin: String,
      youtube: String,
    },

    // AI Tools
    enabledTools: {
      type: [String],
      default: ["test-generator", "homework-helper", "essay-scorer"],
    },
    toolLimits: {
      type: Map,
      of: Number,
      default: {
        "test-generator": 10,
        "homework-helper": 20,
        "essay-scorer": 5,
      },
    },
    toolRequests: [{
      toolName: { type: String, required: true },
      description: { type: String, required: true },
      useCase: String,
      submittedAt: { type: Date, default: Date.now },
      status: {
        type: String,
        enum: ['pending', 'reviewed', 'planned', 'declined'],
        default: 'pending',
      },
      adminNotes: String,
    }],

    // Chat Configuration
    customQA: [{
      question: { type: String, required: true },
      answer: { type: String, required: true },
      enabled: { type: Boolean, default: true },
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now },
    }],

    conversations: [{
      sessionId: { type: String, required: true },
      messages: [{
        role: { type: String, enum: ['user', 'assistant'], required: true },
        content: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
      }],
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now },
    }],

    // Analytics
    analytics: {
      totalViews: { type: Number, default: 0 },
      uniqueVisitors: { type: Number, default: 0 },
      toolUsage: {
        type: Map,
        of: Number,
        default: {},
      },
      lastViewedAt: Date,
      viewHistory: [{
        date: Date,
        count: Number,
      }],
    },

    // Activity Log - tracks user interactions
    activityLog: [{
      action: {
        type: String,
        enum: ['viewed', 'expanded_banner', 'clicked_contact', 'clicked_schedule', 'keep_demo', 'declined', 'tool_used'],
        required: true,
      },
      metadata: {
        type: Schema.Types.Mixed,
        default: {},
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
    }],

    // API Usage Log - detailed tracking of AI tool API calls
    apiUsageLog: [{
      toolId: { type: String, required: true },
      timestamp: { type: Date, default: Date.now },
      responseTime: Number, // ms
      tokensUsed: Number,
      successful: { type: Boolean, default: true },
      errorMessage: String,
    }],

    // Subscription
    subscriptionTier: {
      type: String,
      enum: ["starter", "professional", "enterprise"],
    },
    stripeCustomerId: String,
    stripeSubscriptionId: String,
    paidAt: Date,

    // Review Notes (for needs_review status)
    reviewNotes: String,
    reviewCreatedAt: Date,

    // Outreach
    outreachMethod: {
      type: String,
      enum: ["email", "linkedin", "contact-form", "phone"],
    },
    outreachSentAt: Date,
    outreachNotes: String,
    pendingContactForm: {
      type: Boolean,
      default: false,
    },
    contactFormFilledAt: Date,
    contactFormUrl: String,
  },
  {
    timestamps: true,
  }
);

// Indexes for common queries
ShowcaseSiteSchema.index({ status: 1, expiryDate: 1 });
ShowcaseSiteSchema.index({ businessType: 1 });
ShowcaseSiteSchema.index({ accessCode: 1 });

// Generate access code helper
export function generateAccessCode(businessName: string): string {
  const prefix = businessName
    .split(" ")
    .map(w => w[0]?.toUpperCase() || "")
    .join("")
    .slice(0, 4);
  const suffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}${suffix}`;
}

// Get site by slug with access code verification
export async function verifySiteAccess(slug: string, code: string): Promise<IShowcaseSite | null> {
  const site = await ShowcaseSite.findOne({ slug, accessCode: code, status: { $in: ["active", "purchased"] } });
  if (site) {
    site.accessAttempts += 1;
    site.lastAccessAt = new Date();
    await site.save();
  }
  return site;
}

// Track view
export async function trackShowcaseView(slug: string): Promise<void> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  await ShowcaseSite.updateOne(
    { slug },
    {
      $inc: { "analytics.totalViews": 1 },
      $set: { "analytics.lastViewedAt": new Date() },
      $push: {
        "analytics.viewHistory": {
          $each: [{ date: today, count: 1 }],
          $slice: -30, // Keep last 30 days
        },
      },
    }
  );
}

// Track tool usage
export async function trackToolUsage(slug: string, toolId: string): Promise<void> {
  await ShowcaseSite.updateOne(
    { slug },
    {
      $inc: { [`analytics.toolUsage.${toolId}`]: 1 },
    }
  );
}

export const ShowcaseSite =
  mongoose.models.ShowcaseSite ||
  mongoose.model<IShowcaseSite>("ShowcaseSite", ShowcaseSiteSchema);
