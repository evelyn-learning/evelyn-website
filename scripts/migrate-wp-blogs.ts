/**
 * WordPress Blog Migration Script
 *
 * Migrates 131 blog posts from the old WordPress database into the Next.js MongoDB blog system.
 *
 * What it does:
 * 1. Reads the WP SQL dump and extracts published posts
 * 2. Converts WP HTML content → clean Markdown
 * 3. Copies images from WP uploads → public/images/blog/
 * 4. Rewrites image URLs to point to the new location
 * 5. Strips all WP shortcodes, CSS classes, inline styles
 * 6. Maps WP categories/tags to BlogPost schema
 * 7. Seeds posts into MongoDB
 *
 * Usage:
 *   DRY_RUN=1 npx tsx scripts/migrate-wp-blogs.ts          # Preview only
 *   npx tsx scripts/migrate-wp-blogs.ts                      # Full migration
 *
 * Prerequisites:
 *   - WP SQL dump at: /Users/luke/Downloads/evelynlearning_wp1.sql
 *   - WP uploads at: /Users/luke/Downloads/uploads/
 *   - MONGODB_URI env var set
 */

import fs from "fs";
import path from "path";
import mongoose from "mongoose";

// ─── Configuration ───────────────────────────────────────────────────────────

const SQL_DUMP_PATH = "/Users/luke/Downloads/evelynlearning_wp1.sql";
const UPLOADS_SRC = "/Users/luke/Downloads/uploads";
const IMAGES_DEST = path.join(process.cwd(), "public/images/blog");
const MONGODB_URI = process.env.MONGODB_URI || "";
const DRY_RUN = process.env.DRY_RUN === "1";
// Force update existing posts with cleaned content
const FORCE_UPDATE = process.env.FORCE_UPDATE === "1";
// Optional: comma-separated list of slugs to migrate (for testing)
const SLUGS_FILTER = process.env.SLUGS_FILTER
  ? process.env.SLUGS_FILTER.split(",").map((s) => s.trim())
  : null;

// ─── BlogPost Schema (mirrors src/models/BlogPost.ts) ───────────────────────

const BlogPostSchema = new mongoose.Schema(
  {
    title: String,
    slug: { type: String, unique: true },
    excerpt: String,
    content: String,
    featuredImage: String,
    quickAnswer: String,
    category: String,
    tags: [String],
    author: { type: String, default: "Evelyn Learning" },
    status: { type: String, default: "published" },
    publishedAt: Date,
    metaTitle: String,
    metaDescription: String,
    readingTime: { type: Number, default: 5 },
  },
  { timestamps: true }
);

const BlogPost =
  mongoose.models.BlogPost ||
  mongoose.model("BlogPost", BlogPostSchema);

// ─── SQL Parser ──────────────────────────────────────────────────────────────

interface WPPost {
  id: number;
  postDate: string;
  postContent: string;
  postTitle: string;
  postExcerpt: string;
  postStatus: string;
  postName: string; // slug
  postParent: number;
  guid: string;
  postType: string;
}

interface WPTerm {
  termId: number;
  name: string;
  slug: string;
}

interface WPTermTaxonomy {
  termTaxonomyId: number;
  termId: number;
  taxonomy: string;
  description: string;
  parent: number;
  count: number;
}

interface WPTermRelationship {
  objectId: number;
  termTaxonomyId: number;
}

function parseSqlString(s: string, pos: number): [string, number] {
  const quote = s[pos];
  pos++;
  const result: string[] = [];
  while (pos < s.length) {
    const c = s[pos];
    if (c === "\\") {
      pos++;
      if (pos < s.length) {
        const nc = s[pos];
        if (nc === "n") result.push("\n");
        else if (nc === "r") result.push("\r");
        else if (nc === "t") result.push("\t");
        else if (nc === "\\") result.push("\\");
        else if (nc === "'") result.push("'");
        else if (nc === '"') result.push('"');
        else if (nc === "0") result.push("\0");
        else result.push(nc);
      }
    } else if (c === quote) {
      if (pos + 1 < s.length && s[pos + 1] === quote) {
        result.push(quote);
        pos++;
      } else {
        return [result.join(""), pos + 1];
      }
    } else {
      result.push(c);
    }
    pos++;
  }
  return [result.join(""), pos];
}

function parseValue(
  s: string,
  pos: number
): [string | null, number] {
  while (pos < s.length && " \t\n\r".includes(s[pos])) pos++;
  if (pos >= s.length) return [null, pos];
  if (s[pos] === "'" || s[pos] === '"') {
    return parseSqlString(s, pos);
  }
  const start = pos;
  while (pos < s.length && s[pos] !== "," && s[pos] !== ")") pos++;
  const val = s.slice(start, pos).trim();
  return [val === "NULL" ? null : val, pos];
}

function parseRow(s: string, pos: number): [string[] | null, number] {
  while (pos < s.length && s[pos] !== "(") pos++;
  if (pos >= s.length) return [null, pos];
  pos++; // skip (
  const values: string[] = [];
  while (true) {
    const [val, newPos] = parseValue(s, pos);
    values.push(val ?? "");
    pos = newPos;
    while (pos < s.length && " \t\n\r".includes(s[pos])) pos++;
    if (pos >= s.length || s[pos] === ")") {
      pos++;
      break;
    }
    if (s[pos] === ",") pos++;
  }
  return [values, pos];
}

function extractInserts(
  sqlPath: string,
  tableName: string
): string[][] {
  const rows: string[][] = [];
  const data = fs.readFileSync(sqlPath, "utf-8");
  const insertPattern = `INSERT INTO \`${tableName}\``;
  let searchFrom = 0;

  while (true) {
    const idx = data.indexOf(insertPattern, searchFrom);
    if (idx === -1) break;

    // Find the end of this INSERT statement
    const endIdx = data.indexOf(";\n", idx);
    if (endIdx === -1) break;

    const block = data.slice(idx, endIdx + 1);
    const valsIdx = block.indexOf("VALUES");
    if (valsIdx === -1) {
      searchFrom = endIdx + 1;
      continue;
    }

    let pos = valsIdx + 6;
    while (pos < block.length) {
      const [row, newPos] = parseRow(block, pos);
      if (!row) break;
      rows.push(row);
      pos = newPos;
      while (pos < block.length && " ,\n\r\t".includes(block[pos])) pos++;
    }

    searchFrom = endIdx + 1;
  }

  return rows;
}

function loadPosts(sqlPath: string): WPPost[] {
  console.log("Parsing wp_posts...");
  const rows = extractInserts(sqlPath, "wp_posts");
  console.log(`  Found ${rows.length} total rows`);

  return rows
    .filter((r) => r.length >= 23)
    .map((r) => ({
      id: parseInt(r[0]) || 0,
      postDate: r[2],
      postContent: r[4],
      postTitle: r[5],
      postExcerpt: r[6],
      postStatus: r[7],
      postName: r[11],
      postParent: parseInt(r[17]) || 0,
      guid: r[18],
      postType: r[20],
    }));
}

function loadTerms(sqlPath: string): WPTerm[] {
  console.log("Parsing wp_terms...");
  const rows = extractInserts(sqlPath, "wp_terms");
  return rows.map((r) => ({
    termId: parseInt(r[0]) || 0,
    name: r[1],
    slug: r[2],
  }));
}

function loadTermTaxonomies(sqlPath: string): WPTermTaxonomy[] {
  console.log("Parsing wp_term_taxonomy...");
  const rows = extractInserts(sqlPath, "wp_term_taxonomy");
  return rows.map((r) => ({
    termTaxonomyId: parseInt(r[0]) || 0,
    termId: parseInt(r[1]) || 0,
    taxonomy: r[2],
    description: r[3],
    parent: parseInt(r[4]) || 0,
    count: parseInt(r[5]) || 0,
  }));
}

function loadTermRelationships(sqlPath: string): WPTermRelationship[] {
  console.log("Parsing wp_term_relationships...");
  const rows = extractInserts(sqlPath, "wp_term_relationships");
  return rows.map((r) => ({
    objectId: parseInt(r[0]) || 0,
    termTaxonomyId: parseInt(r[1]) || 0,
  }));
}

// ─── HTML to Markdown Converter ──────────────────────────────────────────────

function htmlToMarkdown(html: string): string {
  let md = html;

  // 1. Handle [caption] shortcodes → markdown image with caption
  md = md.replace(
    /\[caption[^\]]*\]([\s\S]*?)\[\/caption\]/gi,
    (_, inner) => {
      const imgMatch = inner.match(/<img[^>]+src=["']([^"']+)["'][^>]*(?:alt=["']([^"']*)["'])?[^>]*>/i);
      if (imgMatch) {
        const src = imgMatch[1];
        const alt = imgMatch[2] || "";
        // Extract caption text after the img tag
        const captionText = inner
          .replace(/<img[^>]*>/i, "")
          .replace(/<[^>]+>/g, "")
          .trim();
        return `![${alt || captionText}](${src})\n*${captionText}*\n`;
      }
      return inner;
    }
  );

  // 2. Remove remaining WP shortcodes (non-content ones)
  md = md.replace(/\[\/?(vc_[^\]]*|wpforms[^\]]*|rev_slider[^\]]*|Infographic|Evelyn|Students|Continuous|Changing)\]/gi, "");

  // 3. Convert headings
  md = md.replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, (_, c) => `# ${stripTags(c).trim()}\n\n`);
  md = md.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, (_, c) => `## ${stripTags(c).trim()}\n\n`);
  md = md.replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, (_, c) => `### ${stripTags(c).trim()}\n\n`);
  md = md.replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, (_, c) => `#### ${stripTags(c).trim()}\n\n`);
  md = md.replace(/<h5[^>]*>([\s\S]*?)<\/h5>/gi, (_, c) => `##### ${stripTags(c).trim()}\n\n`);
  md = md.replace(/<h6[^>]*>([\s\S]*?)<\/h6>/gi, (_, c) => `###### ${stripTags(c).trim()}\n\n`);

  // 4. Convert images (not already handled by caption)
  md = md.replace(
    /<img[^>]+src=["']([^"']+)["'][^>]*(?:alt=["']([^"']*)["'])?[^>]*\/?>/gi,
    (match, src, alt) => {
      // Also try to extract alt if it comes before src
      if (!alt) {
        const altMatch = match.match(/alt=["']([^"']*?)["']/i);
        alt = altMatch ? altMatch[1] : "";
      }
      return `![${alt || ""}](${src})\n`;
    }
  );

  // 5. Convert figure/figcaption
  md = md.replace(
    /<figure[^>]*>([\s\S]*?)<\/figure>/gi,
    (_, inner) => {
      const captionMatch = inner.match(/<figcaption[^>]*>([\s\S]*?)<\/figcaption>/i);
      const imgMatch = inner.match(/!\[([^\]]*)\]\(([^)]+)\)/);
      if (imgMatch && captionMatch) {
        return `${imgMatch[0]}\n*${stripTags(captionMatch[1]).trim()}*\n\n`;
      }
      return inner;
    }
  );

  // 6. Convert bold and italic
  md = md.replace(/<strong[^>]*>([\s\S]*?)<\/strong>/gi, (_, c) => `**${c.trim()}**`);
  md = md.replace(/<b[^>]*>([\s\S]*?)<\/b>/gi, (_, c) => `**${c.trim()}**`);
  md = md.replace(/<em[^>]*>([\s\S]*?)<\/em>/gi, (_, c) => `*${c.trim()}*`);
  md = md.replace(/<i[^>]*>([\s\S]*?)<\/i>/gi, (_, c) => `*${c.trim()}*`);

  // 7. Convert links
  md = md.replace(/<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi, (_, href, text) => {
    const cleanText = stripTags(text).trim();
    if (!cleanText) return "";
    return `[${cleanText}](${href})`;
  });

  // 8. Convert lists
  md = md.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, (_, inner) => {
    return (
      inner.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (_: string, li: string) => `- ${stripTags(li).trim()}\n`) + "\n"
    );
  });
  md = md.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, (_, inner) => {
    let idx = 0;
    return (
      inner.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (_: string, li: string) => {
        idx++;
        return `${idx}. ${stripTags(li).trim()}\n`;
      }) + "\n"
    );
  });

  // 9. Convert blockquotes
  md = md.replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, (_, c) => {
    const lines = stripTags(c)
      .trim()
      .split("\n")
      .map((l: string) => `> ${l.trim()}`)
      .join("\n");
    return lines + "\n\n";
  });

  // 10. Convert <pre> / <code>
  md = md.replace(/<pre[^>]*>([\s\S]*?)<\/pre>/gi, (_, c) => `\`\`\`\n${stripTags(c).trim()}\n\`\`\`\n\n`);
  md = md.replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, (_, c) => `\`${stripTags(c).trim()}\``);

  // 11. Convert paragraphs
  md = md.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, (_, c) => {
    const content = c.trim();
    if (!content) return "";
    return `${content}\n\n`;
  });

  // 12. Convert <br> tags
  md = md.replace(/<br\s*\/?>/gi, "\n");

  // 13. Convert horizontal rules
  md = md.replace(/<hr[^>]*\/?>/gi, "\n---\n\n");

  // 14. Remove all remaining HTML tags
  md = md.replace(/<div[^>]*>/gi, "");
  md = md.replace(/<\/div>/gi, "\n");
  md = md.replace(/<span[^>]*>([\s\S]*?)<\/span>/gi, "$1");
  md = md.replace(/<\/?(?:table|thead|tbody|tr|td|th|nav|header|footer|section|article|aside|main)[^>]*>/gi, "");
  md = md.replace(/<[^>]+>/g, "");

  // 15. Decode HTML entities
  md = decodeHtmlEntities(md);

  // 16. Fix internal links: /clone/ URLs → relative paths
  md = md.replace(/https?:\/\/(?:www\.)?evelynlearning\.com\/clone\//g, "/");
  md = md.replace(/https?:\/\/(?:www\.)?evelynlearning\.com\//g, "/");
  md = md.replace(/http:\/\/(?:www\.)?evelynlearning\.com\/clone\//g, "/");

  // 17. Remove boilerplate footers
  md = md.replace(/```\s*\*?For (?:more information|further reading)[^`]*```/gs, "");
  md = md.replace(/\*?For (?:more information|further reading),?\s*(?:visit|please visit)[^\n]*(?:blog[^\n]*\n?)?/gi, "");
  // Remove "Create.Engage.Inspire" in all markdown formatting variants
  md = md.replace(/\*{0,3}Create\.?\s*Engage\.?\s*Inspire\.?\*{0,3}\s*\n?/gi, "");

  // 18. Clean up whitespace
  md = md.replace(/\n{3,}/g, "\n\n"); // Max 2 consecutive newlines
  md = md.replace(/[ \t]+\n/g, "\n"); // Trailing spaces
  md = md.replace(/^\n+/, ""); // Leading newlines
  md = md.replace(/\n+$/, "\n"); // Trailing newlines

  return md;
}

function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, "");
}

function decodeHtmlEntities(text: string): string {
  const entities: Record<string, string> = {
    "&nbsp;": " ",
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
    "&apos;": "'",
    "&#8216;": "\u2018",
    "&#8217;": "\u2019",
    "&#8218;": "\u201A",
    "&#8220;": "\u201C",
    "&#8221;": "\u201D",
    "&#8222;": "\u201E",
    "&#8230;": "\u2026",
    "&#8211;": "\u2013",
    "&#8212;": "\u2014",
    "&#038;": "&",
    "&#39;": "'",
    "&#34;": '"',
  };

  let result = text;
  for (const [entity, char] of Object.entries(entities)) {
    result = result.split(entity).join(char);
  }

  // Handle numeric entities
  result = result.replace(/&#(\d+);/g, (_, code) =>
    String.fromCharCode(parseInt(code))
  );
  result = result.replace(/&#x([0-9a-fA-F]+);/g, (_, code) =>
    String.fromCharCode(parseInt(code, 16))
  );

  return result;
}

// ─── Image Processing ────────────────────────────────────────────────────────

function resolveImagePath(wpPath: string): string | null {
  // wpPath is like "2019/11/some-image.png"
  const fullPath = path.join(UPLOADS_SRC, wpPath);

  // Direct match
  if (fs.existsSync(fullPath)) return fullPath;

  // Try without WP size suffix: "image-1024x682.jpg" → "image.jpg"
  const withoutSize = wpPath.replace(/-\d+x\d+(\.\w+)$/, "$1");
  if (withoutSize !== wpPath) {
    const altPath = path.join(UPLOADS_SRC, withoutSize);
    if (fs.existsSync(altPath)) return altPath;
  }

  // Try with "-scaled" suffix: "image-1024x682.jpg" → "image-scaled-1024x682.jpg"
  const dir = path.dirname(wpPath);
  const base = path.basename(wpPath);
  const scaledMatch = base.match(/^(.+?)(-\d+x\d+)?(\.\w+)$/);
  if (scaledMatch) {
    const [, name, dims, ext] = scaledMatch;
    const scaledVariants = [
      `${name}-scaled-1${dims || ""}${ext}`,
      `${name}-scaled${dims || ""}${ext}`,
      `${name}-scaled-1${ext}`,
      `${name}-scaled${ext}`,
    ];
    for (const variant of scaledVariants) {
      const varPath = path.join(UPLOADS_SRC, dir, variant);
      if (fs.existsSync(varPath)) return varPath;
    }
  }

  // Try finding any file with a similar base name in the same directory
  const dirPath = path.join(UPLOADS_SRC, dir);
  if (fs.existsSync(dirPath)) {
    const baseName = path.basename(wpPath).replace(/-\d+x\d+/, "").replace(/\.\w+$/, "");
    const files = fs.readdirSync(dirPath);
    // Prefer exact base name match with different dimensions
    const match = files.find((f) => {
      const fBase = f.replace(/-\d+x\d+/, "").replace(/-scaled-?\d*/, "").replace(/\.\w+$/, "");
      return fBase === baseName && !f.includes("-150x") && !f.includes("-300x");
    });
    if (match) return path.join(dirPath, match);
  }

  return null;
}

function copyImage(srcPath: string, slug: string, originalFilename: string): string {
  const destDir = path.join(IMAGES_DEST, slug);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  // Clean filename: remove WP size suffixes, lowercase
  let cleanName = path.basename(originalFilename)
    .replace(/-\d+x\d+/, "")
    .replace(/-scaled-?\d*/, "")
    .replace(/-e\d+/, "") // Remove WP edit hash
    .replace(/\s+/g, "-")
    .toLowerCase();

  const destPath = path.join(destDir, cleanName);

  if (!DRY_RUN) {
    fs.copyFileSync(srcPath, destPath);
  }

  return `/images/blog/${slug}/${cleanName}`;
}

function processImages(content: string, slug: string): { content: string; featuredImage: string | null } {
  let featuredImage: string | null = null;
  let imageIndex = 0;

  // Process all image references in the markdown
  const processed = content.replace(
    /!\[([^\]]*)\]\(([^)]+)\)/g,
    (match, alt, src) => {
      imageIndex++;

      // Extract the wp-content/uploads path
      let wpPath: string | null = null;
      const uploadsMatch = src.match(/wp-content\/uploads\/(.+)/);
      if (uploadsMatch) {
        wpPath = uploadsMatch[1];
      }

      // Skip Google-hosted images (they're dead)
      if (src.includes("googleusercontent.com") || src.includes("edsurge.imgix.net")) {
        return ""; // Remove dead external images
      }

      if (!wpPath) {
        // External image - keep as-is if accessible, otherwise remove
        return match;
      }

      const resolvedPath = resolveImagePath(wpPath);
      if (!resolvedPath) {
        console.warn(`    ⚠ Missing image: ${wpPath}`);
        return ""; // Remove reference to missing image
      }

      const newUrl = copyImage(resolvedPath, slug, wpPath);

      // Set first image as featured image
      if (imageIndex === 1) {
        featuredImage = newUrl;
      }

      return `![${alt}](${newUrl})`;
    }
  );

  return { content: processed, featuredImage };
}

// ─── Category & Tag Mapping ──────────────────────────────────────────────────

const CATEGORY_MAP: Record<string, string> = {
  // WP category slug → clean category name
  elearning: "E-Learning",
  "distance-learning": "E-Learning",
  "teaching-methodologies": "Teaching & Pedagogy",
  "stem-education": "STEM Education",
  "assessment-of-learning": "Assessment",
  "learning-styles": "Learning Styles",
  "artificial-intelligence": "AI & Technology",
  technology: "AI & Technology",
  "educational-standards": "Curriculum & Standards",
  publishing: "Educational Publishing",
  "learner-counselling": "Career & Counseling",
  newsletter: "Industry News",
  "programming-language": "AI & Technology",
  uncategorized: "Education",
};

function inferCategory(
  postId: number,
  relationships: WPTermRelationship[],
  taxonomies: WPTermTaxonomy[],
  terms: WPTerm[],
  content: string,
  title: string
): string {
  // Try to get from WP category
  const postRels = relationships.filter((r) => r.objectId === postId);
  const catTaxIds = taxonomies
    .filter((t) => t.taxonomy === "category")
    .map((t) => t.termTaxonomyId);

  for (const rel of postRels) {
    if (catTaxIds.includes(rel.termTaxonomyId)) {
      const tax = taxonomies.find((t) => t.termTaxonomyId === rel.termTaxonomyId);
      if (tax) {
        const term = terms.find((t) => t.termId === tax.termId);
        if (term && CATEGORY_MAP[term.slug]) {
          return CATEGORY_MAP[term.slug];
        }
      }
    }
  }

  // Fallback: infer from title/content
  const text = (title + " " + content).toLowerCase();
  if (text.includes("ai ") || text.includes("artificial intelligence") || text.includes("generative ai"))
    return "AI & Technology";
  if (text.includes("assessment") || text.includes("evaluation") || text.includes("dok") || text.includes("depth of knowledge"))
    return "Assessment";
  if (text.includes("curriculum") || text.includes("common core") || text.includes("standards"))
    return "Curriculum & Standards";
  if (text.includes("gamification")) return "E-Learning";
  if (text.includes("stem") || text.includes("virtual lab")) return "STEM Education";
  if (text.includes("plagiarism") || text.includes("content writing") || text.includes("editing"))
    return "Educational Publishing";
  if (text.includes("blended learning") || text.includes("online learning") || text.includes("e-learning"))
    return "E-Learning";
  if (text.includes("learning style") || text.includes("visual learn")) return "Learning Styles";
  if (text.includes("pedagogy") || text.includes("teaching")) return "Teaching & Pedagogy";
  if (text.includes("career") || text.includes("college") || text.includes("lsat"))
    return "Career & Counseling";

  return "Education";
}

function extractTags(
  postId: number,
  relationships: WPTermRelationship[],
  taxonomies: WPTermTaxonomy[],
  terms: WPTerm[]
): string[] {
  const postRels = relationships.filter((r) => r.objectId === postId);
  const tagTaxIds = taxonomies
    .filter((t) => t.taxonomy === "post_tag")
    .map((t) => t.termTaxonomyId);

  const tags: string[] = [];
  for (const rel of postRels) {
    if (tagTaxIds.includes(rel.termTaxonomyId)) {
      const tax = taxonomies.find((t) => t.termTaxonomyId === rel.termTaxonomyId);
      if (tax) {
        const term = terms.find((t) => t.termId === tax.termId);
        if (term) {
          // Clean up tag name
          const tagName = term.name
            .replace(/&amp;/g, "&")
            .replace(/&#8217;/g, "'")
            .trim();
          if (tagName && !tags.includes(tagName)) {
            tags.push(tagName);
          }
        }
      }
    }
  }

  return tags.slice(0, 10); // Limit to 10 tags
}

// ─── Excerpt & Reading Time ──────────────────────────────────────────────────

function generateExcerpt(markdown: string, wpExcerpt: string): string {
  // Use WP excerpt if available
  if (wpExcerpt && wpExcerpt.trim().length > 50) {
    return stripTags(wpExcerpt)
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 300);
  }

  // Generate from content: take first meaningful paragraph
  const lines = markdown.split("\n").filter((l) => {
    const trimmed = l.trim();
    return (
      trimmed.length > 50 &&
      !trimmed.startsWith("#") &&
      !trimmed.startsWith("!") &&
      !trimmed.startsWith(">") &&
      !trimmed.startsWith("-") &&
      !trimmed.startsWith("*") &&
      !trimmed.match(/^\d+\./)
    );
  });

  if (lines.length > 0) {
    return lines[0].trim().slice(0, 300);
  }

  return markdown.replace(/[#*!\[\]()>-]/g, " ").replace(/\s+/g, " ").trim().slice(0, 300);
}

function calculateReadingTime(markdown: string): number {
  const words = markdown.split(/\s+/).filter((w) => w.length > 0).length;
  return Math.max(1, Math.ceil(words / 200));
}

// ─── Main Migration ──────────────────────────────────────────────────────────

async function migrate() {
  console.log("═══════════════════════════════════════════════════════════════");
  console.log("  WordPress → Next.js Blog Migration");
  console.log(`  Mode: ${DRY_RUN ? "DRY RUN (no changes)" : "LIVE"}`);
  console.log("═══════════════════════════════════════════════════════════════\n");

  // 1. Parse SQL dump
  const allPosts = loadPosts(SQL_DUMP_PATH);
  const terms = loadTerms(SQL_DUMP_PATH);
  const taxonomies = loadTermTaxonomies(SQL_DUMP_PATH);
  const relationships = loadTermRelationships(SQL_DUMP_PATH);

  console.log(`  Terms: ${terms.length}, Taxonomies: ${taxonomies.length}, Relationships: ${relationships.length}\n`);

  // 2. Filter to published blog posts only
  const publishedPosts = allPosts.filter(
    (p) => p.postStatus === "publish" && p.postType === "post"
  );
  console.log(`Published blog posts: ${publishedPosts.length}\n`);

  // 3. Filter out posts with minimal content
  const viablePosts = publishedPosts.filter((p) => {
    const cleanContent = p.postContent
      .replace(/\[\/?\w[^\]]*\]/g, "")
      .replace(/<[^>]+>/g, "")
      .replace(/%[0-9A-Fa-f]{2}/g, "")
      .replace(/\s+/g, " ")
      .trim();
    return cleanContent.length > 300;
  });
  console.log(`Posts with substantial content (>300 chars): ${viablePosts.length}`);

  // 3b. Apply slug filter if provided
  const postsToMigrate = SLUGS_FILTER
    ? viablePosts.filter((p) => SLUGS_FILTER.includes(p.postName))
    : viablePosts;

  if (SLUGS_FILTER) {
    console.log(`Filtered to ${postsToMigrate.length} posts: ${SLUGS_FILTER.join(", ")}`);
  }
  console.log();

  // 4. Create images destination
  if (!DRY_RUN && !fs.existsSync(IMAGES_DEST)) {
    fs.mkdirSync(IMAGES_DEST, { recursive: true });
  }

  // 5. Connect to MongoDB
  if (!DRY_RUN) {
    if (!MONGODB_URI) {
      console.error("ERROR: MONGODB_URI not set");
      process.exit(1);
    }
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB\n");
  }

  // 6. Process each post
  const results = {
    migrated: 0,
    skipped: 0,
    errors: 0,
    duplicates: 0,
    imagesCopied: 0,
    imagesMissing: 0,
  };

  const slugsProcessed = new Set<string>();

  for (const post of postsToMigrate) {
    const slug = post.postName;

    // Skip duplicates
    if (slugsProcessed.has(slug)) {
      results.duplicates++;
      continue;
    }
    slugsProcessed.add(slug);

    try {
      console.log(`\n── ${slug} ──`);
      console.log(`   Title: ${decodeHtmlEntities(post.postTitle)}`);

      // Convert HTML to Markdown
      let markdown = htmlToMarkdown(post.postContent);

      // Process images
      const { content: processedContent, featuredImage } = processImages(markdown, slug);
      markdown = processedContent;

      // Get category and tags
      const category = inferCategory(
        post.id,
        relationships,
        taxonomies,
        terms,
        post.postContent,
        post.postTitle
      );
      const tags = extractTags(post.id, relationships, taxonomies, terms);

      // Generate excerpt and reading time
      const excerpt = generateExcerpt(markdown, post.postExcerpt);
      const readingTime = calculateReadingTime(markdown);

      // Clean title
      const title = decodeHtmlEntities(post.postTitle).trim();

      console.log(`   Category: ${category}`);
      console.log(`   Tags: ${tags.join(", ") || "(none)"}`);
      console.log(`   Reading time: ${readingTime} min`);
      console.log(`   Featured image: ${featuredImage || "(none)"}`);
      console.log(`   Content: ${markdown.length} chars, ${markdown.split(/\s+/).length} words`);

      if (DRY_RUN) {
        // Write preview to temp dir
        const previewDir = "/tmp/wp-migration-preview";
        if (!fs.existsSync(previewDir)) fs.mkdirSync(previewDir, { recursive: true });
        fs.writeFileSync(
          path.join(previewDir, `${slug}.md`),
          `---\ntitle: "${title}"\ncategory: ${category}\ntags: [${tags.join(", ")}]\nreadingTime: ${readingTime}\nfeaturedImage: ${featuredImage || "none"}\n---\n\n${markdown}`
        );
        results.migrated++;
        continue;
      }

      // Check if post already exists
      const existing = await BlogPost.findOne({ slug });
      if (existing && !FORCE_UPDATE) {
        console.log(`   ⏭ Already exists, skipping (use FORCE_UPDATE=1 to overwrite)`);
        results.skipped++;
        continue;
      }

      if (existing && FORCE_UPDATE) {
        // Update existing post with cleaned content
        await BlogPost.updateOne(
          { slug },
          {
            $set: {
              title,
              excerpt,
              content: markdown,
              featuredImage: featuredImage || existing.featuredImage,
              category,
              tags,
              metaTitle: title,
              metaDescription: excerpt.slice(0, 160),
              readingTime,
            },
          }
        );
        results.migrated++;
        console.log(`   ✓ Updated (FORCE_UPDATE)`);
        continue;
      }

      // Create the blog post
      await BlogPost.create({
        title,
        slug,
        excerpt,
        content: markdown,
        featuredImage,
        category,
        tags,
        author: "Evelyn Learning",
        status: "published",
        publishedAt: new Date(post.postDate),
        metaTitle: title,
        metaDescription: excerpt.slice(0, 160),
        readingTime,
      });

      results.migrated++;
      console.log(`   ✓ Migrated`);
    } catch (err) {
      console.error(`   ✗ Error: ${err}`);
      results.errors++;
    }
  }

  // 7. Summary
  console.log("\n═══════════════════════════════════════════════════════════════");
  console.log("  Migration Summary");
  console.log("═══════════════════════════════════════════════════════════════");
  console.log(`  Migrated:   ${results.migrated}`);
  console.log(`  Skipped:    ${results.skipped} (already exist)`);
  console.log(`  Duplicates: ${results.duplicates} (duplicate slugs in WP)`);
  console.log(`  Errors:     ${results.errors}`);
  console.log("═══════════════════════════════════════════════════════════════\n");

  if (DRY_RUN) {
    console.log("📁 Preview files written to /tmp/wp-migration-preview/");
    console.log("   Review them, then run without DRY_RUN=1 to migrate.\n");
  }

  if (!DRY_RUN) {
    await mongoose.disconnect();
  }
}

migrate().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
