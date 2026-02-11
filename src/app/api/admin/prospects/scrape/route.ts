import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Prospect, type IScrapedData, type IScrapedNavItem, type IScrapedPage, type IScrapedSection } from "@/models";
import OpenAI from "openai";
import * as cheerio from "cheerio";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_SHOWCASE_API_KEY,
});

// Types for extracted data
interface ExtractedImage {
  url: string;
  alt: string;
  context: string; // Where on page: hero, team, logo, etc.
}

interface ExtractedVideo {
  platform: "youtube" | "vimeo" | "other";
  videoId: string;
  embedUrl: string;
}

interface ExtractedLink {
  text: string;
  href: string;
  isNavigation: boolean;
}

interface ExtractedTeamMember {
  name: string;
  role?: string;
  bio?: string;
  imageUrl?: string;
}

interface ExtractedProgram {
  name: string;
  description?: string;
  price?: string;
  features?: string[];
}

interface ExtractedTestimonial {
  quote: string;
  author: string;
  role?: string;
  imageUrl?: string;
}

interface PageContent {
  url: string;
  path: string;          // Relative path (e.g., "/about-us")
  title: string;
  html: string;
  text: string;
  images: ExtractedImage[];
  videos: ExtractedVideo[];
  links: ExtractedLink[];
  navItems: string[];
  navItemsWithPaths: Array<{ label: string; path: string; originalUrl: string }>;
  sections: IScrapedSection[];  // Structured content sections
  meta: {
    description?: string;
    ogImage?: string;
    ogTitle?: string;
  };
}

interface ExtractedColors {
  primary?: string;
  secondary?: string;
  accent?: string;
  background?: string;
}

// Normalize URL to absolute
function normalizeUrl(url: string, baseUrl: string): string {
  try {
    if (url.startsWith("//")) {
      return `https:${url}`;
    }
    if (url.startsWith("/")) {
      const base = new URL(baseUrl);
      return `${base.origin}${url}`;
    }
    if (!url.startsWith("http")) {
      const base = new URL(baseUrl);
      return `${base.origin}/${url}`;
    }
    return url;
  } catch {
    return url;
  }
}

// Extract YouTube video ID from various URL formats
function extractYouTubeId(url: string): string | null {
  const patterns = [
    /youtube\.com\/watch\?v=([^&]+)/,
    /youtube\.com\/embed\/([^?]+)/,
    /youtu\.be\/([^?]+)/,
    /youtube\.com\/v\/([^?]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

// Extract Vimeo video ID
function extractVimeoId(url: string): string | null {
  const match = url.match(/vimeo\.com\/(\d+)/);
  return match ? match[1] : null;
}

// User agents that look like real browsers
const USER_AGENTS = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:123.0) Gecko/20100101 Firefox/123.0",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.3 Safari/605.1.15",
];

// Sleep helper for delays
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Detect bot protection / CAPTCHA pages
function isBotProtectionPage(html: string): { isProtected: boolean; type?: string } {
  const lowerHtml = html.toLowerCase();

  // SiteGround CAPTCHA (sgcaptcha)
  if (lowerHtml.includes("sgcaptcha") || lowerHtml.includes(".well-known/sgcaptcha")) {
    return { isProtected: true, type: "SiteGround CAPTCHA" };
  }

  // Cloudflare challenges
  if (lowerHtml.includes("cf-browser-verification") ||
      lowerHtml.includes("cloudflare") && lowerHtml.includes("challenge")) {
    return { isProtected: true, type: "Cloudflare" };
  }

  // Generic CAPTCHA detection
  if ((lowerHtml.includes("captcha") || lowerHtml.includes("robot")) &&
      html.length < 2000 &&
      !lowerHtml.includes("<body")) {
    return { isProtected: true, type: "CAPTCHA" };
  }

  // Meta refresh to challenge pages
  const metaRefreshMatch = html.match(/meta[^>]*http-equiv=["']refresh["'][^>]*content=["'][^"']*\/(captcha|challenge|verify)/i);
  if (metaRefreshMatch) {
    return { isProtected: true, type: "Challenge redirect" };
  }

  // Very short HTML with no body content usually indicates protection
  if (html.length < 500 && !lowerHtml.includes("<body") && lowerHtml.includes("refresh")) {
    return { isProtected: true, type: "Redirect protection" };
  }

  return { isProtected: false };
}

// Fetch raw HTML with comprehensive browser-like headers and retry logic
async function fetchRawHtml(url: string, retries = 3): Promise<string | null> {
  const userAgent = USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
  const baseUrl = new URL(url).origin;

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      // Add delay between retries (exponential backoff)
      if (attempt > 0) {
        await sleep(1000 * Math.pow(2, attempt));
        console.log(`[SCRAPER] Retry attempt ${attempt + 1} for ${url}`);
      }

      const response = await fetch(url, {
        headers: {
          "User-Agent": userAgent,
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
          "Accept-Language": "en-US,en;q=0.9",
          "Accept-Encoding": "gzip, deflate, br",
          "Connection": "keep-alive",
          "Upgrade-Insecure-Requests": "1",
          "Sec-Fetch-Dest": "document",
          "Sec-Fetch-Mode": "navigate",
          "Sec-Fetch-Site": "none",
          "Sec-Fetch-User": "?1",
          "Cache-Control": "max-age=0",
          "Referer": baseUrl + "/",
          "DNT": "1",
        },
        signal: AbortSignal.timeout(30000),
        redirect: "follow",
      });

      if (response.ok) {
        const html = await response.text();

        // Check for bot protection pages
        const protection = isBotProtectionPage(html);
        if (protection.isProtected) {
          console.log(`[SCRAPER] Bot protection detected (${protection.type}) for ${url}`);
          return null;
        }

        return html;
      }

      // If 403, try with different approach
      if (response.status === 403 && attempt < retries - 1) {
        console.log(`[SCRAPER] Got 403 for ${url}, will retry with different headers`);
        continue;
      }

      console.log(`[SCRAPER] Failed to fetch ${url}: HTTP ${response.status}`);
      return null;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (attempt < retries - 1) {
        console.log(`[SCRAPER] Error fetching ${url} (attempt ${attempt + 1}): ${errorMessage}`);
        continue;
      }
      console.log(`[SCRAPER] All retries failed for ${url}: ${errorMessage}`);
      return null;
    }
  }
  return null;
}

// Extract URL path from full URL
function extractPath(fullUrl: string, baseUrl: string): string {
  try {
    const base = new URL(baseUrl);
    const full = new URL(fullUrl);

    // If it's the same origin, return the pathname
    if (full.origin === base.origin) {
      return full.pathname === "/" ? "/" : full.pathname.replace(/\/$/, "");
    }

    // If different origin (shouldn't happen), return full URL
    return fullUrl;
  } catch {
    return "/";
  }
}

// AI-powered content section extraction for dynamic rendering
// Uses GPT-4o to intelligently analyze page structure and extract sections
async function extractPageSectionsWithAI(
  html: string,
  pageUrl: string,
  pageTitle: string
): Promise<IScrapedSection[]> {
  const $ = cheerio.load(html);

  // Clean HTML - remove scripts, styles, nav, header, footer for cleaner analysis
  $("script, style, noscript, iframe, svg, nav, header, footer, aside").remove();

  // Get the main content area
  const mainContent = $("main, #main, .main, #content, .content, article, body").first();
  let cleanedHtml = mainContent.html() || "";

  // Truncate if too long (GPT has token limits)
  if (cleanedHtml.length > 15000) {
    cleanedHtml = cleanedHtml.slice(0, 15000) + "...";
  }

  // Also get text content for context
  const textContent = mainContent.text().replace(/\s+/g, " ").trim().slice(0, 5000);

  // Extract images with their context (we'll pass URLs to AI)
  const pageImages: Array<{ url: string; alt: string }> = [];
  $("img").each((_, img) => {
    const src = $(img).attr("src") || $(img).attr("data-src");
    if (src) {
      pageImages.push({
        url: normalizeUrl(src, pageUrl),
        alt: $(img).attr("alt") || "",
      });
    }
  });

  const prompt = `You are analyzing a webpage to extract its content structure for rebuilding.

PAGE URL: ${pageUrl}
PAGE TITLE: ${pageTitle}

IMAGES ON PAGE:
${pageImages.slice(0, 10).map((img, i) => `${i + 1}. ${img.url} (alt: "${img.alt}")`).join("\n")}

HTML CONTENT:
${cleanedHtml}

TEXT CONTENT:
${textContent}

Analyze this page and extract ALL content sections in order of appearance. For each section, determine:
1. The section TYPE based on its PURPOSE and CONTENT (not CSS classes)
2. Extract all relevant content for that section type

Section types:
- "hero": Large banner/header area with headline, usually at top of page
- "text": Paragraphs of text content, articles, descriptions
- "heading": Just a heading/title with optional subtitle
- "cards": Grid of items (services, features, programs, products)
- "list": Bullet points or numbered lists
- "testimonials": Customer quotes/reviews
- "team": Staff/team member profiles
- "faq": Questions and answers
- "pricing": Pricing tables, rates, packages
- "cta": Call-to-action blocks (signup, contact prompts)
- "gallery": Image galleries
- "contact": Contact information, forms, maps
- "stats": Statistics/numbers with labels

Return a JSON array of sections. Each section should have:
{
  "type": "section_type",
  "title": "Section heading if present",
  "subtitle": "Subheading or lead text if present",
  "content": "Main text content (for text/hero sections)",
  "items": ["item1", "item2"] // For list sections
  "cards": [{"title": "Card title", "description": "Card text", "image": "image_url", "price": "$XX"}] // For cards/team/testimonials/faq
  "images": [{"url": "image_url", "alt": "alt text"}] // For gallery/hero with images
  "backgroundColor": "#hexcolor" // If section has distinct background
}

IMPORTANT:
- Extract REAL content from the page, not placeholders
- Preserve the ORDER of sections as they appear on the page
- For testimonials, use cards with: title=author name, description=quote
- For FAQ, use cards with: title=question, description=answer
- For team, use cards with: title=name, description=role/bio, image=photo
- Include image URLs where relevant
- Return ONLY valid JSON array, no explanations`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert at analyzing webpage structure and extracting content. Return only valid JSON arrays."
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.2,
      max_tokens: 4000,
    });

    const responseText = response.choices[0]?.message?.content || "[]";

    // Parse the response
    let sections: IScrapedSection[] = [];
    try {
      let jsonStr = responseText.trim();
      // Remove markdown code blocks if present
      if (jsonStr.startsWith("```")) {
        jsonStr = jsonStr.replace(/```json?\n?/g, "").replace(/```\s*$/g, "");
      }
      const parsed = JSON.parse(jsonStr);

      // Validate and normalize the sections
      if (Array.isArray(parsed)) {
        sections = parsed.map((s: Record<string, unknown>) => {
          const section: IScrapedSection = {
            type: validateSectionType(s.type as string) || "text",
          };

          if (s.title) section.title = String(s.title);
          if (s.subtitle) section.subtitle = String(s.subtitle);
          if (s.content) section.content = String(s.content);
          if (s.backgroundColor) section.backgroundColor = String(s.backgroundColor);

          if (Array.isArray(s.items)) {
            section.items = s.items.map(String);
          }

          if (Array.isArray(s.cards)) {
            section.cards = s.cards.map((c: Record<string, unknown>) => ({
              title: String(c.title || ""),
              description: c.description ? String(c.description) : undefined,
              image: c.image ? String(c.image) : undefined,
              price: c.price ? String(c.price) : undefined,
              link: c.link ? String(c.link) : undefined,
            })).filter(c => c.title);
          }

          if (Array.isArray(s.images)) {
            section.images = s.images.map((img: Record<string, unknown>) => ({
              url: String(img.url || ""),
              alt: String(img.alt || ""),
              caption: img.caption ? String(img.caption) : undefined,
            })).filter(img => img.url);
          }

          return section;
        }).filter(s => s.title || s.content || s.items?.length || s.cards?.length || s.images?.length);
      }
    } catch (parseError) {
      console.error("[SCRAPER] Failed to parse AI sections response:", parseError);
      console.error("[SCRAPER] Raw response:", responseText.slice(0, 500));
    }

    console.log(`[SCRAPER] AI extracted ${sections.length} sections from ${pageUrl}`);
    return sections;

  } catch (error) {
    console.error("[SCRAPER] AI section extraction failed:", error);
    return [];
  }
}

// Validate section type
function validateSectionType(type: string): IScrapedSection["type"] | null {
  const validTypes: IScrapedSection["type"][] = [
    "hero", "text", "heading", "image", "gallery", "list",
    "cards", "cta", "testimonials", "team", "faq", "pricing", "contact", "raw"
  ];
  return validTypes.includes(type as IScrapedSection["type"])
    ? (type as IScrapedSection["type"])
    : null;
}

// Parse HTML and extract structured content
function parsePageContent(html: string, url: string): PageContent {
  const $ = cheerio.load(html);

  // Extract page title
  const title = $("title").text().trim() || $("h1").first().text().trim() || "";

  // Extract meta information
  const meta = {
    description: $('meta[name="description"]').attr("content") || $('meta[property="og:description"]').attr("content"),
    ogImage: $('meta[property="og:image"]').attr("content"),
    ogTitle: $('meta[property="og:title"]').attr("content"),
  };

  // Extract all images with context - using comprehensive detection
  const images: ExtractedImage[] = [];
  let foundLogo = false;
  let foundHero = false;

  $("img").each((_, el) => {
    const src = $(el).attr("src") || $(el).attr("data-src") || $(el).attr("data-lazy-src");
    if (!src) return;

    const normalizedSrc = normalizeUrl(src, url);
    const alt = $(el).attr("alt") || "";
    const srcLower = src.toLowerCase();

    // Collect all identifying info from element and ancestors
    const imgClass = $(el).attr("class") || "";
    const imgId = $(el).attr("id") || "";

    // Get ancestor info (up to 4 levels)
    let ancestorClasses = "";
    let ancestorIds = "";
    let inHeader = false;
    let inNav = false;
    let currentEl = $(el);

    for (let i = 0; i < 4; i++) {
      const parent = currentEl.parent();
      if (!parent.length) break;

      const tagName = parent.prop("tagName")?.toLowerCase() || "";
      ancestorClasses += " " + (parent.attr("class") || "");
      ancestorIds += " " + (parent.attr("id") || "");

      if (tagName === "header" || tagName === "nav") {
        inHeader = true;
        if (tagName === "nav") inNav = true;
      }

      currentEl = parent;
    }

    const allClasses = (imgClass + " " + ancestorClasses).toLowerCase();
    const allIds = (imgId + " " + ancestorIds).toLowerCase();
    const allContext = allClasses + " " + allIds + " " + srcLower + " " + alt.toLowerCase();

    // Determine context with priority-based detection
    let context = "general";

    // LOGO DETECTION - multiple signals
    const isLogo = (
      allContext.includes("logo") ||
      srcLower.includes("logo") ||
      alt.toLowerCase().includes("logo") ||
      (inHeader && !inNav && allIds.includes("logo")) ||
      (inHeader && srcLower.match(/brand|icon.*main/i))
    );

    // HERO DETECTION - large featured images
    const isHero = (
      allContext.match(/hero|banner|jumbotron|featured|showcase|splash|main-image/) ||
      allClasses.includes("background") && allClasses.includes("image") ||
      srcLower.includes("hero") ||
      srcLower.includes("banner")
    );

    // TEAM DETECTION
    const isTeam = (
      allContext.match(/team|staff|founder|about-us|leadership|our-people|employee/) ||
      alt.toLowerCase().match(/ceo|founder|director|manager|teacher|tutor/)
    );

    // TESTIMONIAL DETECTION
    const isTestimonial = allContext.match(/testimonial|review|quote|client|customer-photo/);

    // Assign context with priority
    if (isLogo && !foundLogo) {
      context = "logo";
      foundLogo = true;
    } else if (isHero && !foundHero && !isLogo) {
      context = "hero";
      foundHero = true;
    } else if (isTeam) {
      context = "team";
    } else if (isTestimonial) {
      context = "testimonial";
    }

    images.push({ url: normalizedSrc, alt, context });
  });

  // HERO DETECTION - Also check for CSS background images
  // Many sites (especially Squarespace) use background-image for heroes
  if (!foundHero) {
    // Check for background-image in style attributes on sections
    $("section, div, [class*='hero'], [class*='banner'], [class*='splash']").each((_, el) => {
      if (foundHero) return;

      const style = $(el).attr("style") || "";
      const dataImg = $(el).attr("data-image") || $(el).attr("data-background") || "";
      const classes = $(el).attr("class") || "";

      // Look for background-image URL in style
      const bgMatch = style.match(/background(?:-image)?:\s*url\(['"]?([^'")\s]+)['"]?\)/i);
      if (bgMatch && bgMatch[1]) {
        const bgUrl = normalizeUrl(bgMatch[1], url);
        images.unshift({ url: bgUrl, alt: "Hero Background", context: "hero" });
        foundHero = true;
        return;
      }

      // Look for data-image attribute (Squarespace pattern)
      if (dataImg) {
        const imgUrl = normalizeUrl(dataImg, url);
        images.unshift({ url: imgUrl, alt: "Hero Background", context: "hero" });
        foundHero = true;
        return;
      }

      // Check for Squarespace-style background images in data attributes
      const dataStyles = $(el).attr("data-current-styles");
      if (dataStyles) {
        try {
          const stylesObj = JSON.parse(dataStyles.replace(/&quot;/g, '"'));
          if (stylesObj.backgroundImage?.id) {
            // Squarespace stores image IDs, construct URL
            const sqId = stylesObj.backgroundImage.id;
            // The actual image URL would need to be found elsewhere, but mark this section as having a hero
          }
        } catch {}
      }

      // If it's a hero/banner section, use the first img inside as hero
      if (classes.match(/hero|banner|splash|jumbotron|featured/i)) {
        const firstImg = $(el).find("img").first();
        const imgSrc = firstImg.attr("src") || firstImg.attr("data-src");
        if (imgSrc) {
          const existing = images.find(i => i.url === normalizeUrl(imgSrc, url));
          if (existing) {
            existing.context = "hero";
            foundHero = true;
          }
        }
      }
    });
  }

  // If still no hero, use first large/featured image after the logo
  if (!foundHero && images.length > 1) {
    // Find first non-logo image that could be a hero
    for (const img of images) {
      if (img.context !== "logo" && img.context !== "team" && img.context !== "testimonial") {
        // Check if it looks like a stock photo or featured image
        if (img.url.match(/istock|shutterstock|featured|banner|hero|1920|1080/i) ||
            img.alt.match(/student|learning|education|tutoring/i)) {
          img.context = "hero";
          foundHero = true;
          break;
        }
      }
    }
  }

  // If no logo found, try og:image or first image in header as fallback
  if (!foundLogo && meta.ogImage) {
    // Check if og:image looks like a logo
    const ogImageLower = meta.ogImage.toLowerCase();
    if (ogImageLower.includes("logo")) {
      images.unshift({ url: meta.ogImage, alt: "Logo", context: "logo" });
      foundLogo = true;
    }
  }

  // If still no logo, check for first small image in header
  if (!foundLogo) {
    const headerImg = $("header img, #header img, .header img, nav img, #logo img").first();
    if (headerImg.length) {
      const src = headerImg.attr("src") || headerImg.attr("data-src");
      if (src) {
        const existing = images.find(i => i.url === normalizeUrl(src, url));
        if (existing) {
          existing.context = "logo";
          foundLogo = true;
        }
      }
    }
  }

  // If no hero found, use og:image as hero (if it's not the logo)
  if (!foundHero && meta.ogImage && !foundLogo) {
    const ogUrl = meta.ogImage;
    const existing = images.find(i => i.url === ogUrl);
    if (existing && existing.context !== "logo") {
      existing.context = "hero";
    } else if (!existing) {
      images.push({ url: ogUrl, alt: "Hero", context: "hero" });
    }
  }

  // Extract videos (YouTube, Vimeo)
  const videos: ExtractedVideo[] = [];

  // YouTube iframes
  $('iframe[src*="youtube"], iframe[src*="youtu.be"], iframe[data-src*="youtube"]').each((_, el) => {
    const src = $(el).attr("src") || $(el).attr("data-src") || "";
    const videoId = extractYouTubeId(src);
    if (videoId) {
      videos.push({
        platform: "youtube",
        videoId,
        embedUrl: `https://www.youtube.com/embed/${videoId}`,
      });
    }
  });

  // Vimeo iframes
  $('iframe[src*="vimeo"]').each((_, el) => {
    const src = $(el).attr("src") || "";
    const videoId = extractVimeoId(src);
    if (videoId) {
      videos.push({
        platform: "vimeo",
        videoId,
        embedUrl: `https://player.vimeo.com/video/${videoId}`,
      });
    }
  });

  // YouTube links (not embedded)
  $('a[href*="youtube.com/watch"], a[href*="youtu.be"]').each((_, el) => {
    const href = $(el).attr("href") || "";
    const videoId = extractYouTubeId(href);
    if (videoId && !videos.some(v => v.videoId === videoId)) {
      videos.push({
        platform: "youtube",
        videoId,
        embedUrl: `https://www.youtube.com/embed/${videoId}`,
      });
    }
  });

  // Extract navigation links with paths
  const navItems: string[] = [];
  const navItemsWithPaths: Array<{ label: string; path: string; originalUrl: string }> = [];
  const links: ExtractedLink[] = [];
  const baseOrigin = new URL(url).origin;

  $("nav a, header a, .nav a, .menu a, .navigation a").each((_, el) => {
    const text = $(el).text().trim();
    const href = $(el).attr("href") || "";
    if (text && href && !href.startsWith("#") && !href.startsWith("javascript:") && !href.startsWith("mailto:") && !href.startsWith("tel:")) {
      const fullUrl = normalizeUrl(href, url);
      navItems.push(text);

      // Only include internal links in navigation with paths
      if (fullUrl.startsWith(baseOrigin) || href.startsWith("/")) {
        const path = extractPath(fullUrl, url);
        // Avoid duplicates
        if (!navItemsWithPaths.some(n => n.path === path)) {
          navItemsWithPaths.push({
            label: text,
            path,
            originalUrl: fullUrl,
          });
        }
      }

      links.push({ text, href: fullUrl, isNavigation: true });
    }
  });

  // Extract all other links
  $("a").each((_, el) => {
    const text = $(el).text().trim();
    const href = $(el).attr("href") || "";
    if (text && href && !links.some(l => l.href === normalizeUrl(href, url))) {
      links.push({ text, href: normalizeUrl(href, url), isNavigation: false });
    }
  });

  // Sections will be extracted with AI separately (async)
  const sections: IScrapedSection[] = [];

  // Get clean text (preserve some structure)
  $("script, style, noscript").remove();
  const text = $("body").text().replace(/\s+/g, " ").trim();

  // Compute page path
  const path = extractPath(url, url);

  return {
    url,
    path,
    title,
    html,
    text: text.slice(0, 30000), // More generous limit
    images,
    videos,
    links,
    navItems: [...new Set(navItems)], // Dedupe
    navItemsWithPaths,
    sections,
    meta,
  };
}

// Extract CSS colors from stylesheets - enhanced version
function extractColors(html: string): ExtractedColors {
  const colors: ExtractedColors = {};
  const $ = cheerio.load(html);

  // Color patterns
  const hexPattern = /#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})\b/g;
  const rgbPattern = /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/g;

  // Non-brand colors to filter out
  const nonBrandColors = new Set([
    "#fff", "#ffffff", "#000", "#000000",
    "#111", "#222", "#333", "#444", "#555", "#666", "#777", "#888", "#999",
    "#aaa", "#bbb", "#ccc", "#ddd", "#eee",
    "#f0f0f0", "#f5f5f5", "#fafafa", "#f8f8f8", "#f9f9f9",
    "#e0e0e0", "#d0d0d0", "#c0c0c0", "#b0b0b0", "#a0a0a0",
    "#111111", "#222222", "#333333", "#444444", "#555555",
    "#666666", "#777777", "#888888", "#999999", "#aaaaaa",
    "#bbbbbb", "#cccccc", "#dddddd", "#eeeeee",
  ]);

  // Priority colors (likely brand colors) with weights
  const priorityColors: { color: string; weight: number }[] = [];

  // 1. CSS custom properties (highest priority)
  const cssVarPattern = /--(?:primary|brand|main|accent|secondary|theme)[^:]*:\s*(#[0-9a-fA-F]{3,6}|rgb[^;)]+)/gi;
  const styleContent = (html.match(/<style[^>]*>[\s\S]*?<\/style>/gi) || []).join(" ");

  let varMatch;
  while ((varMatch = cssVarPattern.exec(styleContent)) !== null) {
    const color = extractHexFromValue(varMatch[1]);
    if (color && !nonBrandColors.has(color.toLowerCase())) {
      priorityColors.push({ color, weight: 10 });
    }
  }

  // 2. Button colors (high priority - often brand colors)
  $("button, .btn, .button, [class*='btn-'], a.cta, .cta-button").each((_, el) => {
    const style = $(el).attr("style") || "";
    const className = $(el).attr("class") || "";

    // Check inline background-color
    const bgMatch = style.match(/background(?:-color)?:\s*(#[0-9a-fA-F]{3,6}|rgb[^;)]+)/i);
    if (bgMatch) {
      const color = extractHexFromValue(bgMatch[1]);
      if (color && !nonBrandColors.has(color.toLowerCase())) {
        priorityColors.push({ color, weight: 8 });
      }
    }

    // Check for Tailwind-style color classes
    const tailwindMatch = className.match(/bg-(blue|indigo|purple|pink|red|orange|yellow|green|teal|cyan)-(\d+)/);
    if (tailwindMatch) {
      const tailwindColor = getTailwindColor(tailwindMatch[1], tailwindMatch[2]);
      if (tailwindColor) {
        priorityColors.push({ color: tailwindColor, weight: 7 });
      }
    }
  });

  // 3. Header/nav background colors (medium-high priority)
  $("header, nav, .navbar, .header, #header, .nav-wrapper").each((_, el) => {
    const style = $(el).attr("style") || "";
    const bgMatch = style.match(/background(?:-color)?:\s*(#[0-9a-fA-F]{3,6}|rgb[^;)]+)/i);
    if (bgMatch) {
      const color = extractHexFromValue(bgMatch[1]);
      if (color && !nonBrandColors.has(color.toLowerCase())) {
        priorityColors.push({ color, weight: 6 });
      }
    }
  });

  // 4. Link colors
  const linkColorPattern = /a\s*\{[^}]*color:\s*(#[0-9a-fA-F]{3,6})/gi;
  let linkMatch;
  while ((linkMatch = linkColorPattern.exec(styleContent)) !== null) {
    const color = linkMatch[1];
    if (!nonBrandColors.has(color.toLowerCase())) {
      priorityColors.push({ color, weight: 5 });
    }
  }

  // 5. Collect all hex colors from styles with lower weight
  const allStyles = styleContent + " " + (html.match(/style="[^"]*"/g) || []).join(" ");
  const hexColors = allStyles.match(hexPattern) || [];

  hexColors.forEach(color => {
    if (!nonBrandColors.has(color.toLowerCase())) {
      priorityColors.push({ color: color.toLowerCase(), weight: 1 });
    }
  });

  // Aggregate colors by frequency and weight
  const colorScores: Record<string, number> = {};
  priorityColors.forEach(({ color, weight }) => {
    const normalized = color.toLowerCase();
    colorScores[normalized] = (colorScores[normalized] || 0) + weight;
  });

  // Sort by score
  const sortedColors = Object.entries(colorScores)
    .sort((a, b) => b[1] - a[1])
    .map(([color]) => color);

  // Assign colors, ensuring they're visually distinct
  if (sortedColors.length > 0) colors.primary = sortedColors[0];

  // Find secondary that's different from primary
  for (let i = 1; i < sortedColors.length && !colors.secondary; i++) {
    if (!areColorsSimilar(sortedColors[0], sortedColors[i])) {
      colors.secondary = sortedColors[i];
    }
  }

  // Find accent that's different from both
  for (let i = 1; i < sortedColors.length && !colors.accent; i++) {
    const c = sortedColors[i];
    if (c !== colors.secondary &&
        !areColorsSimilar(sortedColors[0], c) &&
        (!colors.secondary || !areColorsSimilar(colors.secondary, c))) {
      colors.accent = c;
    }
  }

  return colors;
}

// Helper: Extract hex color from various formats
function extractHexFromValue(value: string): string | null {
  if (value.startsWith("#")) {
    return value.length === 4
      ? `#${value[1]}${value[1]}${value[2]}${value[2]}${value[3]}${value[3]}`
      : value;
  }

  const rgbMatch = value.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
  if (rgbMatch) {
    const r = parseInt(rgbMatch[1]).toString(16).padStart(2, "0");
    const g = parseInt(rgbMatch[2]).toString(16).padStart(2, "0");
    const b = parseInt(rgbMatch[3]).toString(16).padStart(2, "0");
    return `#${r}${g}${b}`;
  }

  return null;
}

// Helper: Check if two colors are visually similar
function areColorsSimilar(c1: string, c2: string): boolean {
  const hex1 = c1.replace("#", "");
  const hex2 = c2.replace("#", "");

  const r1 = parseInt(hex1.slice(0, 2), 16);
  const g1 = parseInt(hex1.slice(2, 4), 16);
  const b1 = parseInt(hex1.slice(4, 6), 16);

  const r2 = parseInt(hex2.slice(0, 2), 16);
  const g2 = parseInt(hex2.slice(2, 4), 16);
  const b2 = parseInt(hex2.slice(4, 6), 16);

  // Simple Euclidean distance in RGB space
  const distance = Math.sqrt(
    Math.pow(r1 - r2, 2) + Math.pow(g1 - g2, 2) + Math.pow(b1 - b2, 2)
  );

  // Colors are similar if distance < 60 (out of max ~441)
  return distance < 60;
}

// Helper: Get Tailwind color hex value
function getTailwindColor(color: string, shade: string): string | null {
  const tailwindColors: Record<string, Record<string, string>> = {
    blue: { "500": "#3B82F6", "600": "#2563EB", "700": "#1D4ED8" },
    indigo: { "500": "#6366F1", "600": "#4F46E5", "700": "#4338CA" },
    purple: { "500": "#A855F7", "600": "#9333EA", "700": "#7E22CE" },
    pink: { "500": "#EC4899", "600": "#DB2777", "700": "#BE185D" },
    red: { "500": "#EF4444", "600": "#DC2626", "700": "#B91C1C" },
    orange: { "500": "#F97316", "600": "#EA580C", "700": "#C2410C" },
    yellow: { "500": "#EAB308", "600": "#CA8A04", "700": "#A16207" },
    green: { "500": "#22C55E", "600": "#16A34A", "700": "#15803D" },
    teal: { "500": "#14B8A6", "600": "#0D9488", "700": "#0F766E" },
    cyan: { "500": "#06B6D4", "600": "#0891B2", "700": "#0E7490" },
  };

  return tailwindColors[color]?.[shade] || null;
}

// Extract team members from page content
function extractTeamMembers($: cheerio.CheerioAPI, pageContent: PageContent): ExtractedTeamMember[] {
  const members: ExtractedTeamMember[] = [];

  // Look for team sections
  const teamSelectors = [
    ".team-member", ".staff-member", ".our-team .member",
    "[class*='team'] [class*='member']",
    ".about-team .person", ".team-grid > div",
    ".leadership .person", ".founders .person",
  ];

  for (const selector of teamSelectors) {
    $(selector).each((_, el) => {
      const name = $(el).find("h3, h4, .name, .member-name, [class*='name']").first().text().trim();
      const role = $(el).find(".role, .title, .position, [class*='role'], [class*='title']").first().text().trim();
      const bio = $(el).find(".bio, .description, p").first().text().trim();
      const img = $(el).find("img").first();
      const imageUrl = img.attr("src") || img.attr("data-src");

      if (name) {
        members.push({
          name,
          role: role || undefined,
          bio: bio || undefined,
          imageUrl: imageUrl ? normalizeUrl(imageUrl, pageContent.url) : undefined,
        });
      }
    });

    if (members.length > 0) break;
  }

  // Also check team images from our parsed images
  if (members.length === 0) {
    const teamImages = pageContent.images.filter(img => img.context === "team");
    teamImages.forEach(img => {
      if (img.alt && img.alt.length > 2) {
        members.push({
          name: img.alt,
          imageUrl: img.url,
        });
      }
    });
  }

  return members;
}

// Extract programs/services with pricing
function extractPrograms($: cheerio.CheerioAPI, _pageContent: PageContent): ExtractedProgram[] {
  const programs: ExtractedProgram[] = [];

  // Look for program/service cards
  const selectors = [
    ".program-card", ".service-card", ".pricing-card",
    "[class*='program']", "[class*='service'] > div",
    ".price-box", ".plan-card", ".offering",
  ];

  for (const selector of selectors) {
    $(selector).each((_, el) => {
      const name = $(el).find("h2, h3, h4, .title, .name").first().text().trim();
      const description = $(el).find("p, .description, .summary").first().text().trim();
      const priceEl = $(el).find(".price, [class*='price'], .cost, .fee");
      const price = priceEl.text().trim() || undefined;

      // Extract features/bullet points
      const features: string[] = [];
      $(el).find("li, .feature").each((_, feat) => {
        const text = $(feat).text().trim();
        if (text) features.push(text);
      });

      if (name) {
        programs.push({
          name,
          description: description || undefined,
          price,
          features: features.length > 0 ? features : undefined,
        });
      }
    });

    if (programs.length > 0) break;
  }

  return programs;
}

// Extract testimonials
function extractTestimonials($: cheerio.CheerioAPI, pageContent: PageContent): ExtractedTestimonial[] {
  const testimonials: ExtractedTestimonial[] = [];

  const selectors = [
    ".testimonial", ".review", "[class*='testimonial']",
    ".quote-card", ".client-review", ".feedback-item",
    "blockquote",
  ];

  for (const selector of selectors) {
    $(selector).each((_, el) => {
      const quote = $(el).find("p, .quote, .text, blockquote").first().text().trim()
        .replace(/^["']|["']$/g, ""); // Remove surrounding quotes
      const author = $(el).find(".author, .name, .client-name, cite, [class*='author']").first().text().trim();
      const role = $(el).find(".role, .title, .position").first().text().trim();
      const img = $(el).find("img").first();
      const imageUrl = img.attr("src") || img.attr("data-src");

      if (quote && quote.length > 20) {
        testimonials.push({
          quote,
          author: author || "Client",
          role: role || undefined,
          imageUrl: imageUrl ? normalizeUrl(imageUrl, pageContent.url) : undefined,
        });
      }
    });

    if (testimonials.length > 0) break;
  }

  return testimonials;
}

// Crawl multiple pages of a website
async function crawlWebsite(baseUrl: string): Promise<PageContent[]> {
  const pages: PageContent[] = [];
  const visited = new Set<string>();
  const base = baseUrl.replace(/\/$/, "");

  // First try to fetch homepage - this is critical
  console.log(`[SCRAPER] Attempting to fetch homepage: ${base}`);
  const homeHtml = await fetchRawHtml(base);

  if (!homeHtml) {
    // Try with www prefix or without
    const altBase = base.includes("www.")
      ? base.replace("www.", "")
      : base.replace("://", "://www.");
    console.log(`[SCRAPER] Trying alternate URL: ${altBase}`);
    const altHtml = await fetchRawHtml(altBase);
    if (altHtml) {
      pages.push(parsePageContent(altHtml, altBase));
      visited.add(altBase);
    }
  } else {
    pages.push(parsePageContent(homeHtml, base));
    visited.add(base);
  }

  // If we couldn't get homepage, return empty
  if (pages.length === 0) {
    console.log(`[SCRAPER] Could not fetch homepage, aborting crawl`);
    return pages;
  }

  // Now discover internal links from the homepage
  const homePage = pages[0];

  // Helper to normalize URLs - strip anchors and trailing slashes
  const normalizeUrlForVisit = (url: string): string => {
    const withoutAnchor = url.split("#")[0];
    return withoutAnchor.replace(/\/$/, "");
  };

  const internalLinks = homePage.links
    .filter(l => l.href.startsWith(base) || l.href.startsWith(base.replace("www.", "")))
    .map(l => normalizeUrlForVisit(l.href))
    .filter(l => l !== base && l !== base.replace("www.", "")); // Exclude homepage

  // Remove duplicates
  const uniqueInternalLinks = [...new Set(internalLinks)];

  // Priority pages to try - expanded list
  const priorityPaths = [
    "/about", "/about-us", "/who-we-are", "/our-story",
    "/programs", "/services", "/offerings", "/what-we-offer",
    "/pricing", "/rates", "/tuition", "/cost", "/fees", "/cost-and-referrals",
    "/team", "/our-team", "/staff", "/meet-the-team", "/leadership",
    "/contact", "/contact-us", "/get-in-touch",
    "/testimonials", "/reviews", "/success-stories",
  ];

  // Priority keywords for matching
  const priorityKeywords = [
    "about", "who", "story", "mission",
    "program", "service", "offer", "class", "course", "tutor",
    "price", "pricing", "cost", "rate", "tuition", "fee",
    "team", "staff", "teacher", "instructor",
    "contact", "location", "reach",
    "testimonial", "review", "success",
  ];

  // Build ordered list: first from discovered links, then from priority paths
  const urlsToTry: string[] = [];

  // Add discovered links that match priority keywords
  for (const link of uniqueInternalLinks) {
    const lowerLink = link.toLowerCase();
    if (priorityKeywords.some(kw => lowerLink.includes(kw))) {
      if (!urlsToTry.includes(link)) urlsToTry.push(link);
    }
  }

  // Add standard paths as fallback
  for (const path of priorityPaths) {
    const url = `${base}${path}`;
    if (!urlsToTry.includes(url)) urlsToTry.push(url);
  }

  // Crawl additional pages with longer delays
  for (const url of urlsToTry) {
    const normalizedUrl = normalizeUrlForVisit(url);
    if (visited.has(normalizedUrl)) continue;
    visited.add(normalizedUrl);

    // Longer delay between requests to avoid rate limiting
    await sleep(1500 + Math.random() * 1000);

    const html = await fetchRawHtml(url);
    if (html) {
      console.log(`[SCRAPER] Successfully fetched: ${url}`);
      const content = parsePageContent(html, url);
      pages.push(content);

      // Limit to avoid overwhelming
      if (pages.length >= 6) break;
    }
  }

  // If we still need more pages, try nav links
  if (pages.length > 0 && pages.length < 4) {
    const allNavLinks = pages.flatMap(p => p.links.filter(l => l.isNavigation));
    const importantKeywords = ["program", "service", "about", "team", "price", "cost", "tutor", "class", "course", "who"];

    for (const link of allNavLinks) {
      const normalizedHref = normalizeUrlForVisit(link.href);
      if (visited.has(normalizedHref)) continue;
      if (!normalizedHref.startsWith(base) && !normalizedHref.startsWith(base.replace("www.", ""))) continue;

      const isImportant = importantKeywords.some(kw =>
        link.text.toLowerCase().includes(kw) || normalizedHref.toLowerCase().includes(kw)
      );

      if (isImportant) {
        visited.add(normalizedHref);

        // Delay between requests
        await sleep(1500 + Math.random() * 1000);

        const html = await fetchRawHtml(normalizedHref);
        if (html) {
          console.log(`[SCRAPER] Crawled nav link: ${normalizedHref}`);
          pages.push(parsePageContent(html, normalizedHref));
        }

        if (pages.length >= 6) break;
      }
    }
  }

  console.log(`[SCRAPER] Crawl complete: ${pages.length} pages fetched`);
  return pages;
}

// AI-first comprehensive extraction - analyzes HTML structure and content
async function extractWithAI(
  pages: PageContent[],
  websiteUrl: string,
  existingInfo: { name: string; services: string; location: string },
  programmaticData: {
    team: ExtractedTeamMember[];
    programs: ExtractedProgram[];
    testimonials: ExtractedTestimonial[];
    colors: ExtractedColors;
  }
): Promise<IScrapedData> {
  // Collect all images and videos
  const allImages = pages.flatMap(p => p.images);
  const logoImage = allImages.find(i => i.context === "logo");
  const heroImage = allImages.find(i => i.context === "hero");
  const allVideos = pages.flatMap(p => p.videos);
  const navItems = [...new Set(pages.flatMap(p => p.navItems))];
  const homeMeta = pages[0]?.meta || {};

  // Build a rich context for AI including HTML snippets
  const pageContents = pages.map(p => {
    // Clean HTML - remove scripts, styles, and excessive whitespace
    const $ = cheerio.load(p.html);
    $("script, style, noscript, iframe").remove();

    // Get key sections
    const headerHtml = $("header, #header, .header").first().html() || "";
    const navHtml = $("nav, .nav, .navigation, .menu").first().html() || "";
    const mainHtml = $("main, #main, .main, #content, .content, article").first().html() || "";
    const footerHtml = $("footer, #footer, .footer").first().html() || "";

    // Truncate each section
    const truncate = (s: string, max: number) => s.length > max ? s.slice(0, max) + "..." : s;

    return {
      url: p.url,
      title: p.title,
      text: p.text.slice(0, 8000),
      headerHtml: truncate(headerHtml, 2000),
      mainHtml: truncate(mainHtml, 10000),
      footerHtml: truncate(footerHtml, 1500),
    };
  });

  // Create a comprehensive prompt for AI extraction
  const prompt = `You are analyzing an education/tutoring business website to extract ALL content for rebuilding it.

WEBSITE: ${websiteUrl}
BUSINESS NAME: ${existingInfo.name}
SERVICES: ${existingInfo.services}
LOCATION: ${existingInfo.location}

IMAGES FOUND (with context):
${allImages.slice(0, 15).map(i => `- ${i.url} (alt: "${i.alt}", context: ${i.context})`).join("\n")}

NAVIGATION ITEMS: ${navItems.join(", ")}

PAGE CONTENTS:
${pageContents.map(p => `
=== ${p.title} (${p.url}) ===
TEXT CONTENT: ${p.text}
MAIN HTML: ${p.mainHtml}
`).join("\n---\n")}

Extract ALL information comprehensively. Look carefully at:
1. Team member names, roles, and bios - look for names with titles like "Director", "Founder", "Teacher"
2. ALL program/service names with their full descriptions and any pricing mentioned
3. Testimonial quotes with author names
4. FAQ questions and answers if present
5. Detailed pricing information - look for dollar amounts ($XXX), rate structures, packages
6. Hero/banner images - look for large featured images, background images, or images in hero sections
7. Brand colors from CSS classes, buttons, headers

Return a comprehensive JSON object:
{
  "businessName": "Official business name",
  "tagline": "Main slogan/tagline from hero section",
  "description": "2-3 sentence business description",
  "mission": "Mission statement if found",
  "email": "Contact email",
  "phone": "Phone number",
  "address": "Full address",
  "businessHours": "Hours of operation",
  "services": ["Service 1", "Service 2", "Service 3"],
  "programs": [
    {"name": "Program Name", "description": "FULL description from the website - be comprehensive", "price": "$XXX if found"}
  ],
  "pricingInfo": {
    "summary": "Brief overview of pricing structure",
    "rates": [
      {"service": "Service name", "price": "$XXX", "details": "Additional details like 'per hour' or 'per session'"}
    ],
    "hasFreeTrial": true/false,
    "hasFreeConsultation": true/false
  },
  "faqs": [
    {"question": "Question text", "answer": "Answer text"}
  ],
  "testimonials": [
    {"quote": "Full testimonial text", "author": "Name", "role": "Student/Parent/etc"}
  ],
  "team": [
    {"name": "Full Name", "role": "Title/Position", "bio": "Bio paragraph - be comprehensive"}
  ],
  "stats": [{"value": "25+", "label": "Years of experience"}],
  "highlights": ["Key selling point 1", "Unique feature 2"],
  "aboutContent": ["Full paragraph 1 about the business", "Full paragraph 2"],
  "colors": {
    "primary": "#hexcode - look at buttons, headers, links",
    "secondary": "#hexcode - look at backgrounds, accents",
    "accent": "#hexcode - look at CTAs, highlights"
  },
  "logoUrl": "URL of logo image - look for images with 'logo' in path/alt or in header",
  "heroImageUrl": "URL of main hero/banner/featured image - look for large images at top of pages",
  "facebook": "Facebook URL",
  "instagram": "Instagram URL",
  "linkedin": "LinkedIn URL",
  "twitter": "Twitter URL"
}

CRITICAL INSTRUCTIONS:
- Extract REAL content from the website, not generic placeholders
- For programs, include the FULL description text, not summaries
- For pricing, extract EXACT dollar amounts when found (e.g., "$150.00 for one subject")
- For hero images, look for: background-image URLs, data-image attributes, large images in sections with classes like 'hero', 'banner', 'splash', 'featured'
- If you find images that could be heroes, include them even if not 100% certain
- If you can't find something, omit the field entirely
- Return ONLY valid JSON, no explanations`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",  // Use full GPT-4o for better extraction
    messages: [
      {
        role: "system",
        content: "You are an expert web scraper that extracts structured data from HTML. Return only valid JSON. Never include explanatory text outside the JSON."
      },
      { role: "user", content: prompt },
    ],
    temperature: 0.2,
    max_tokens: 4000,
  });

  const responseText = response.choices[0]?.message?.content || "{}";

  // Parse AI response
  let aiData: Record<string, unknown> = {};
  try {
    let jsonStr = responseText.trim();
    // Remove markdown code blocks if present
    if (jsonStr.startsWith("```")) {
      jsonStr = jsonStr.replace(/```json?\n?/g, "").replace(/```\s*$/g, "");
    }
    aiData = JSON.parse(jsonStr);
  } catch (e) {
    console.error("[SCRAPER] Failed to parse AI response:", e);
    console.error("[SCRAPER] Raw response:", responseText.slice(0, 500));
  }

  // Extract colors from AI or use programmatic fallback
  const aiColors = (aiData.colors as Record<string, string>) || {};
  const primaryColor = aiColors.primary || programmaticData.colors.primary;
  const secondaryColor = aiColors.secondary || programmaticData.colors.secondary;
  const accentColor = aiColors.accent || programmaticData.colors.accent;

  // Merge AI data with programmatic data (AI takes priority)
  const aiTeam = (aiData.team as ExtractedTeamMember[]) || [];
  const aiPrograms = (aiData.programs as ExtractedProgram[]) || [];
  const aiTestimonials = (aiData.testimonials as ExtractedTestimonial[]) || [];

  // Use AI data if available, fall back to programmatic
  const team = aiTeam.length > 0 ? aiTeam : programmaticData.team;
  const programs = aiPrograms.length > 0 ? aiPrograms : programmaticData.programs;
  const testimonials = aiTestimonials.length > 0 ? aiTestimonials : programmaticData.testimonials;

  // Determine logo and hero URLs
  const aiLogoUrl = aiData.logoUrl as string | undefined;
  const aiHeroUrl = aiData.heroImageUrl as string | undefined;

  // Build navigation with paths from home page
  const navigationWithPaths: IScrapedNavItem[] = pages[0]?.navItemsWithPaths.map(n => ({
    label: n.label,
    path: n.path,
    originalUrl: n.originalUrl,
  })) || [];

  // Extract sections with AI for each page (in parallel)
  console.log(`[SCRAPER] Extracting sections with AI for ${pages.length} pages...`);
  const sectionsPerPage = await Promise.all(
    pages.map(p => extractPageSectionsWithAI(p.html, p.url, p.title))
  );

  // Build scraped pages array with AI-extracted sections
  const scrapedPages: IScrapedPage[] = pages.map((p, idx) => ({
    path: p.path,
    title: p.title,
    navLabel: navigationWithPaths.find(n => n.path === p.path)?.label,
    sections: sectionsPerPage[idx] || [],
    heroImage: p.images.find(i => i.context === "hero")?.url,
    metaDescription: p.meta.description,
  }));

  const mergedData: IScrapedData = {
    businessName: (aiData.businessName as string) || existingInfo.name,
    tagline: (aiData.tagline as string) || homeMeta.ogTitle,
    description: (aiData.description as string) || homeMeta.description,
    mission: aiData.mission as string | undefined,

    email: aiData.email as string | undefined,
    phone: aiData.phone as string | undefined,
    address: aiData.address as string | undefined,
    businessHours: aiData.businessHours as string | undefined,

    services: (aiData.services as string[]) || [],

    programs: programs.length > 0
      ? programs.map(p => ({
          name: p.name,
          description: p.description,
          price: p.price,
        }))
      : undefined,

    testimonials: testimonials.map(t => ({
      quote: t.quote,
      author: t.author,
      role: t.role,
    })),

    // FAQs from AI extraction
    faqs: aiData.faqs as Array<{ question: string; answer: string }> | undefined,

    // Detailed pricing info
    pricingInfo: aiData.pricingInfo as {
      summary?: string;
      rates?: Array<{ service: string; price: string; details?: string }>;
      hasFreeTrial?: boolean;
      hasFreeConsultation?: boolean;
    } | undefined,

    stats: aiData.stats as Array<{ value: string; label: string }> | undefined,

    team: team.map(m => ({
      name: m.name,
      role: m.role,
      bio: m.bio,
      imageUrl: m.imageUrl,
    })),

    highlights: aiData.highlights as string[] | undefined,
    aboutContent: aiData.aboutContent as string[] | undefined,

    primaryColor: normalizeColor(primaryColor),
    secondaryColor: normalizeColor(secondaryColor),
    accentColor: normalizeColor(accentColor),
    logoUrl: aiLogoUrl || logoImage?.url,
    heroImageUrl: aiHeroUrl || heroImage?.url,

    youtube: allVideos.find(v => v.platform === "youtube")?.embedUrl,

    facebook: aiData.facebook as string | undefined,
    instagram: aiData.instagram as string | undefined,
    linkedin: aiData.linkedin as string | undefined,
    twitter: aiData.twitter as string | undefined,

    // Legacy nav items (string array)
    navItems,

    // New navigation with paths for dynamic routing
    navigation: navigationWithPaths,

    // Per-page scraped content
    scrapedPages,

    images: allImages.slice(0, 20).map(i => ({
      url: i.url,
      alt: i.alt,
      context: i.context,
    })),

    scrapedAt: new Date(),
    pagesScraped: pages.length,
    scrapeQuality: calculateAIScrapeQuality(aiData, team, programs, testimonials),
  };

  console.log("[SCRAPER] AI extraction complete:", {
    team: team.length,
    programs: programs.length,
    testimonials: testimonials.length,
    navigation: navigationWithPaths.length,
    scrapedPages: scrapedPages.length,
    hasColors: !!primaryColor,
    hasLogo: !!mergedData.logoUrl,
    hasHero: !!mergedData.heroImageUrl,
  });

  return mergedData;
}

// Normalize color values to hex
function normalizeColor(color: string | undefined): string | undefined {
  if (!color) return undefined;

  // Already hex
  if (color.startsWith("#")) return color.toLowerCase();

  // Named colors to hex mapping
  const namedColors: Record<string, string> = {
    blue: "#2563eb",
    red: "#dc2626",
    green: "#16a34a",
    yellow: "#eab308",
    purple: "#9333ea",
    pink: "#ec4899",
    orange: "#ea580c",
    teal: "#0d9488",
    cyan: "#06b6d4",
    indigo: "#4f46e5",
    navy: "#1e3a5f",
    maroon: "#7f1d1d",
  };

  const lowerColor = color.toLowerCase();
  for (const [name, hex] of Object.entries(namedColors)) {
    if (lowerColor.includes(name)) return hex;
  }

  return color;
}

// Calculate quality based on AI extraction
function calculateAIScrapeQuality(
  aiData: Record<string, unknown>,
  team: ExtractedTeamMember[],
  programs: ExtractedProgram[],
  testimonials: ExtractedTestimonial[]
): "high" | "medium" | "low" {
  let score = 0;

  if (team.length > 0) score += 2;
  if (programs.length > 0) score += 2;
  if (testimonials.length > 0) score += 2;
  if (aiData.email || aiData.phone) score += 1;
  if (aiData.description || aiData.tagline) score += 1;
  if ((aiData.services as string[])?.length > 2) score += 1;
  if ((aiData.stats as unknown[])?.length > 0) score += 1;
  if ((aiData.colors as Record<string, string>)?.primary) score += 1;
  if (aiData.logoUrl) score += 1;

  if (score >= 8) return "high";
  if (score >= 5) return "medium";
  return "low";
}

// POST - Scrape a prospect's website
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slug } = await request.json();

    if (!slug) {
      return NextResponse.json({ error: "slug is required" }, { status: 400 });
    }

    await connectDB();

    const prospect = await Prospect.findOne({ slug });
    if (!prospect) {
      return NextResponse.json({ error: "Prospect not found" }, { status: 404 });
    }

    console.log(`[SCRAPER] Starting comprehensive scrape for: ${prospect.website}`);

    // STEP 1: Crawl multiple pages
    const pages = await crawlWebsite(prospect.website);

    if (pages.length === 0) {
      return NextResponse.json(
        { error: "Failed to fetch any pages from the website" },
        { status: 400 }
      );
    }

    console.log(`[SCRAPER] Crawled ${pages.length} pages`);

    // Validate that we got real content, not just empty/protected pages
    const totalTextLength = pages.reduce((sum, p) => sum + p.text.length, 0);
    const totalImages = pages.reduce((sum, p) => sum + p.images.length, 0);
    const hasNavigation = pages.some(p => p.navItems.length > 0);

    if (totalTextLength < 500 && totalImages === 0 && !hasNavigation) {
      console.log(`[SCRAPER] Insufficient content detected: ${totalTextLength} chars, ${totalImages} images`);
      return NextResponse.json(
        {
          error: "Website has bot protection that prevents scraping. The site requires human verification (CAPTCHA).",
          details: {
            pagesAttempted: pages.length,
            textLength: totalTextLength,
            imagesFound: totalImages,
            suggestion: "Try manually visiting the website and entering content data.",
          },
        },
        { status: 400 }
      );
    }

    // STEP 2: Extract structured data from HTML
    const $ = cheerio.load(pages[0].html);
    const team = extractTeamMembers($, pages[0]);
    let programs = extractPrograms($, pages[0]);
    let testimonials = extractTestimonials($, pages[0]);

    // Try other pages if home didn't have this data
    for (const page of pages.slice(1)) {
      const page$ = cheerio.load(page.html);

      if (team.length === 0) {
        team.push(...extractTeamMembers(page$, page));
      }
      if (programs.length === 0) {
        programs = extractPrograms(page$, page);
      }
      if (testimonials.length === 0) {
        testimonials = extractTestimonials(page$, page);
      }
    }

    // STEP 3: Extract colors from CSS
    const colors = extractColors(pages[0].html);

    console.log(`[SCRAPER] Programmatic extraction: ${team.length} team, ${programs.length} programs, ${testimonials.length} testimonials`);

    // STEP 4: Use AI to comprehensively extract all content
    console.log(`[SCRAPER] Starting AI extraction for ${prospect.instituteName}...`);
    const scrapedData = await extractWithAI(
      pages,
      prospect.website,
      {
        name: prospect.instituteName,
        services: prospect.services,
        location: prospect.location,
      },
      { team, programs, testimonials, colors }
    );

    // Update prospect with scraped data
    await Prospect.updateOne(
      { slug },
      {
        $set: {
          scrapedData,
          status: prospect.status === "new" ? "scraped" : prospect.status,
        },
      }
    );

    const updatedProspect = await Prospect.findOne({ slug });

    console.log(`[SCRAPER] Scrape complete. Quality: ${scrapedData.scrapeQuality}`);

    return NextResponse.json({
      success: true,
      scrapedData,
      prospect: updatedProspect,
      stats: {
        pagesScraped: pages.length,
        imagesFound: pages.flatMap(p => p.images).length,
        videosFound: pages.flatMap(p => p.videos).length,
        teamMembersFound: team.length,
        programsFound: programs.length,
        testimonialsFound: testimonials.length,
      },
    });
  } catch (error) {
    console.error("[SCRAPER] Scrape Error:", error);
    return NextResponse.json(
      { error: `Failed to scrape website: ${(error as Error).message}` },
      { status: 500 }
    );
  }
}
