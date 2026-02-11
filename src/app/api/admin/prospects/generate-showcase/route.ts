import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Prospect, ShowcaseSite, generateAccessCode, type IScrapedData } from "@/models";

// Default AI tools to enable based on business type
const TOOLS_BY_BUSINESS_TYPE: Record<string, string[]> = {
  "test-prep": ["test-generator", "essay-scorer", "homework-helper", "math-solver", "reading-comprehension"],
  "college-consulting": ["essay-scorer", "admissions-assistant", "career-pathways", "research-assistant"],
  "tutoring": ["homework-helper", "math-solver", "tutor-copilot", "adaptive-learning"],
  "homeschool": ["test-generator", "homework-helper", "content-authoring", "curriculum-designer"],
  "special-ed": ["adaptive-learning", "accessibility-ai", "homework-helper", "tutor-copilot"],
};

// POST - Generate showcase from scraped data
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slug, overrides } = await request.json();

    if (!slug) {
      return NextResponse.json({ error: "slug is required" }, { status: 400 });
    }

    await connectDB();

    const prospect = await Prospect.findOne({ slug });
    if (!prospect) {
      return NextResponse.json({ error: "Prospect not found" }, { status: 404 });
    }

    const scrapedData = prospect.scrapedData as IScrapedData | undefined;
    if (!scrapedData) {
      return NextResponse.json(
        { error: "Prospect has not been scraped yet. Please scrape first." },
        { status: 400 }
      );
    }

    // Check if showcase already exists - we'll update it instead of skipping
    let existingShowcase = null;
    if (prospect.showcaseSlug) {
      existingShowcase = await ShowcaseSite.findOne({ slug: prospect.showcaseSlug });
    }

    // Generate access code (keep existing if updating)
    const accessCode = existingShowcase?.accessCode || generateAccessCode(scrapedData.businessName || prospect.instituteName);

    // Calculate expiry date (14 days)
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 14);

    // Extract YouTube video ID if present
    const youtubeVideoId = scrapedData.youtube ? extractYouTubeId(scrapedData.youtube) : null;

    // Find images by context
    const logoImage = scrapedData.images?.find(i => i.context === "logo");
    const heroImage = scrapedData.images?.find(i => i.context === "hero");
    const generalImages = scrapedData.images?.filter(i => i.context === "general") || [];

    // Build pages content from scraped data
    const pages: Record<string, unknown> = {
      home: {
        hero: {
          title: scrapedData.tagline || `Welcome to ${scrapedData.businessName || prospect.instituteName}`,
          subtitle: scrapedData.description || "Excellence in Education",
          backgroundImage: heroImage?.url || scrapedData.heroImageUrl,
          ctaText: "Get Started",
          ctaLink: "/contact",
        },
        mission: scrapedData.mission,
        highlights: scrapedData.highlights || [],
        announcement: null,
        youtubeVideoId,
        youtubeEmbedUrl: scrapedData.youtube,
        featuredImages: generalImages.slice(0, 4).map(i => ({
          url: i.url,
          alt: i.alt,
        })),
      },
      about: {
        title: "About Us",
        subtitle: scrapedData.tagline,
        content: scrapedData.aboutContent || [scrapedData.description].filter(Boolean),
        mission: scrapedData.mission ? {
          title: "Our Mission",
          content: scrapedData.mission,
        } : null,
        stats: scrapedData.stats || [],
      },
      programs: {
        title: "Our Programs",
        programs: (scrapedData.programs || []).map((p, idx) => ({
          id: `prog-${idx}`,
          name: p.name,
          description: p.description || "",
          price: p.price,
          features: [],
        })),
        services: scrapedData.services || [],
      },
      team: {
        title: "Our Team",
        members: (scrapedData.team || []).map((m, idx) => ({
          id: `team-${idx}`,
          name: m.name,
          role: m.role || "",
          bio: m.bio || "",
          imageUrl: m.imageUrl, // Now includes actual image URLs!
        })),
      },
      pricing: {
        title: "Pricing",
        programs: scrapedData.programs || [],
        pricingInfo: scrapedData.pricingInfo,
      },
      faq: {
        title: "Frequently Asked Questions",
        faqs: scrapedData.faqs || [],
      },
      testimonials: {
        title: "What Our Students Say",
        testimonials: (scrapedData.testimonials || []).map((t, idx) => ({
          id: `test-${idx}`,
          quote: t.quote,
          author: t.author,
          role: t.role || "Student",
          imageUrl: t.imageUrl,
        })),
      },
      contact: {
        title: "Contact Us",
        subtitle: "We'd love to hear from you",
        email: scrapedData.email,
        phone: scrapedData.phone,
        address: scrapedData.address,
        businessHours: scrapedData.businessHours,
      },
    };

    // Determine tools based on business type
    const enabledTools = TOOLS_BY_BUSINESS_TYPE[prospect.businessType] || TOOLS_BY_BUSINESS_TYPE["tutoring"];

    // Create showcase site with all the scraped data
    const showcaseData = {
      slug: prospect.slug,
      businessName: scrapedData.businessName || prospect.instituteName,
      tagline: scrapedData.tagline || scrapedData.description || "Excellence in Education",
      businessType: prospect.businessType,
      originalWebsiteUrl: prospect.website,
      accessCode,
      status: "active",
      expiryDate,
      trialDays: 14,
      branding: {
        // Use extracted colors, fall back to defaults
        primaryColor: scrapedData.primaryColor || "#1E40AF",
        secondaryColor: scrapedData.secondaryColor || "#1E3A8A",
        accentColor: scrapedData.accentColor || "#F59E0B",
        logoText: scrapedData.businessName || prospect.instituteName,
        logoUrl: logoImage?.url || scrapedData.logoUrl,
        heroImageUrl: heroImage?.url || scrapedData.heroImageUrl,
      },
      contact: {
        email: scrapedData.email || "",
        phone: scrapedData.phone || "",
        address: scrapedData.address || "",
        businessHours: scrapedData.businessHours || "",
      },
      social: {
        facebook: scrapedData.facebook,
        instagram: scrapedData.instagram,
        linkedin: scrapedData.linkedin,
        twitter: scrapedData.twitter,
        youtube: scrapedData.youtube,
      },
      pages,
      testimonials: (scrapedData.testimonials || []).map(t => ({
        quote: t.quote,
        author: t.author,
        role: t.role,
        imageUrl: t.imageUrl,
      })),
      stats: scrapedData.stats || [],
      team: (scrapedData.team || []).map(m => ({
        name: m.name,
        role: m.role,
        bio: m.bio,
        imageUrl: m.imageUrl,
      })),
      // Store all extracted images for potential use
      images: scrapedData.images || [],
      // Navigation items from the original site (legacy)
      navItems: scrapedData.navItems || [],
      // Navigation with paths for dynamic routing
      navigation: scrapedData.navigation || [],
      // Scraped pages with content for dynamic rendering
      scrapedPages: scrapedData.scrapedPages || [],
      enabledTools,
      toolLimits: enabledTools.reduce((acc, tool) => {
        acc[tool] = 10;
        return acc;
      }, {} as Record<string, number>),
      analytics: {
        totalViews: 0,
        uniqueVisitors: 0,
        toolUsage: {},
        viewHistory: [],
      },
      // Keep reference to original contact form
      contactFormUrl: scrapedData.contactFormUrl
        ? normalizeContactUrl(prospect.website, scrapedData.contactFormUrl)
        : `${prospect.website.replace(/\/$/, "")}/contact`,
      // Scrape metadata
      scrapeQuality: scrapedData.scrapeQuality || "medium",
      pagesScraped: scrapedData.pagesScraped || 1,
      ...overrides,
    };

    let showcase;
    const isUpdate = !!existingShowcase;

    if (existingShowcase) {
      // Update existing showcase with new scraped data
      showcase = await ShowcaseSite.findOneAndUpdate(
        { slug: prospect.slug },
        { $set: showcaseData },
        { new: true }
      );
      console.log(`[SHOWCASE] Updated existing showcase for ${prospect.instituteName}`);
    } else {
      // Create new showcase
      showcase = await ShowcaseSite.create(showcaseData);
      console.log(`[SHOWCASE] Created new showcase for ${prospect.instituteName}`);
    }

    // Update prospect with showcase reference
    await Prospect.updateOne(
      { slug },
      {
        $set: {
          showcaseSiteId: showcase._id,
          showcaseSlug: showcase.slug,
          showcaseAccessCode: accessCode,
          status: "showcase_created",
        },
      }
    );

    console.log(`[SHOWCASE] ${isUpdate ? 'Updated' : 'Created'} for ${prospect.instituteName}:`, {
      scrapeQuality: scrapedData.scrapeQuality,
      pagesScraped: scrapedData.pagesScraped,
      teamMembers: scrapedData.team?.length || 0,
      programs: scrapedData.programs?.length || 0,
      testimonials: scrapedData.testimonials?.length || 0,
      images: scrapedData.images?.length || 0,
      navigation: scrapedData.navigation?.length || 0,
      scrapedPages: scrapedData.scrapedPages?.length || 0,
      hasYouTube: !!youtubeVideoId,
      hasLogo: !!logoImage,
      hasHero: !!heroImage,
      colors: {
        primary: scrapedData.primaryColor,
        secondary: scrapedData.secondaryColor,
      },
    });

    return NextResponse.json({
      success: true,
      showcase,
      accessCode,
      showcaseUrl: `/showcase/${showcase.slug}`,
      isUpdate,
      scrapeStats: {
        quality: scrapedData.scrapeQuality,
        pagesScraped: scrapedData.pagesScraped,
        teamMembers: scrapedData.team?.length || 0,
        programs: scrapedData.programs?.length || 0,
        testimonials: scrapedData.testimonials?.length || 0,
        images: scrapedData.images?.length || 0,
        navigation: scrapedData.navigation?.length || 0,
        scrapedPages: scrapedData.scrapedPages?.length || 0,
        hasVideo: !!youtubeVideoId,
      },
    });
  } catch (error) {
    console.error("[PROSPECTS] Generate Showcase Error:", error);
    return NextResponse.json(
      { error: `Failed to generate showcase: ${(error as Error).message}` },
      { status: 500 }
    );
  }
}

function extractYouTubeId(url: string): string | null {
  if (!url) return null;

  // Already an embed URL - extract ID
  if (url.includes("/embed/")) {
    const match = url.match(/\/embed\/([^?/]+)/);
    return match ? match[1] : null;
  }

  // Standard patterns
  const patterns = [
    /youtube\.com\/watch\?v=([^&]+)/,
    /youtu\.be\/([^?]+)/,
    /youtube\.com\/v\/([^?]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

function normalizeContactUrl(baseUrl: string, contactUrl: string): string {
  const base = baseUrl.replace(/\/$/, "");
  if (contactUrl.startsWith("http")) {
    return contactUrl;
  }
  const path = contactUrl.startsWith("/") ? contactUrl : `/${contactUrl}`;
  return `${base}${path}`;
}
