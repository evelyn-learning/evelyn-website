// SEO Optimizer Service
// Analyzes and optimizes blog content for search engines and AI-powered search (GEO)

import { SEOAnalysis } from "@/types/blog-generator";

// Optimal ranges for SEO elements
const SEO_GUIDELINES = {
  metaTitle: { min: 50, max: 60 },
  metaDescription: { min: 150, max: 160 },
  keywordDensity: { min: 1, max: 3 }, // percentage
  minHeadings: 3,
  minParagraphs: 5,
  maxSentenceLength: 25, // words
  minWordCount: 600,
};

// Count words in text
function countWords(text: string): number {
  return text.split(/\s+/).filter((word) => word.length > 0).length;
}

// Count sentences in text
function countSentences(text: string): number {
  return text.split(/[.!?]+/).filter((s) => s.trim().length > 0).length;
}

// Extract headings from markdown content
function extractHeadings(content: string): { h2: string[]; h3: string[] } {
  const h2Matches = content.match(/^## .+$/gm) || [];
  const h3Matches = content.match(/^### .+$/gm) || [];

  return {
    h2: h2Matches.map((h) => h.replace(/^## /, "")),
    h3: h3Matches.map((h) => h.replace(/^### /, "")),
  };
}

// Calculate keyword density
function calculateKeywordDensity(
  content: string,
  keywords: string[]
): Record<string, number> {
  const lowerContent = content.toLowerCase();
  const wordCount = countWords(content);
  const density: Record<string, number> = {};

  for (const keyword of keywords) {
    const regex = new RegExp(keyword.toLowerCase(), "gi");
    const matches = lowerContent.match(regex) || [];
    density[keyword] = Math.round((matches.length / wordCount) * 100 * 100) / 100;
  }

  return density;
}

// Check if content has proper heading hierarchy
function hasProperHeadingHierarchy(content: string): boolean {
  const lines = content.split("\n");
  let lastLevel = 0;

  for (const line of lines) {
    if (line.startsWith("### ")) {
      if (lastLevel === 0) {
        // H3 without H2 before it
        return false;
      }
      lastLevel = 3;
    } else if (line.startsWith("## ")) {
      lastLevel = 2;
    }
  }

  return true;
}

// Check for common SEO issues
function getRecommendations(
  content: string,
  title: string,
  metaTitle: string,
  metaDescription: string,
  _tags: string[]
): string[] {
  const recommendations: string[] = [];
  const headings = extractHeadings(content);
  const wordCount = countWords(content);
  const sentenceCount = countSentences(content);
  const avgWordsPerSentence = Math.round(wordCount / sentenceCount);

  // Meta title checks
  if (metaTitle.length < SEO_GUIDELINES.metaTitle.min) {
    recommendations.push(
      `Meta title is too short (${metaTitle.length} chars). Aim for ${SEO_GUIDELINES.metaTitle.min}-${SEO_GUIDELINES.metaTitle.max} characters.`
    );
  } else if (metaTitle.length > SEO_GUIDELINES.metaTitle.max) {
    recommendations.push(
      `Meta title is too long (${metaTitle.length} chars). It may be truncated in search results.`
    );
  }

  // Meta description checks
  if (metaDescription.length < SEO_GUIDELINES.metaDescription.min) {
    recommendations.push(
      `Meta description is too short (${metaDescription.length} chars). Aim for ${SEO_GUIDELINES.metaDescription.min}-${SEO_GUIDELINES.metaDescription.max} characters.`
    );
  } else if (metaDescription.length > SEO_GUIDELINES.metaDescription.max) {
    recommendations.push(
      `Meta description is too long (${metaDescription.length} chars). It may be truncated.`
    );
  }

  // Heading checks
  if (headings.h2.length < SEO_GUIDELINES.minHeadings) {
    recommendations.push(
      `Add more H2 headings to improve content structure. Currently have ${headings.h2.length}, recommend at least ${SEO_GUIDELINES.minHeadings}.`
    );
  }

  if (!hasProperHeadingHierarchy(content)) {
    recommendations.push(
      "Review heading hierarchy. H3 headings should follow H2 headings."
    );
  }

  // Content length check
  if (wordCount < SEO_GUIDELINES.minWordCount) {
    recommendations.push(
      `Content is thin (${wordCount} words). Consider expanding to at least ${SEO_GUIDELINES.minWordCount} words for better SEO.`
    );
  }

  // Readability check
  if (avgWordsPerSentence > SEO_GUIDELINES.maxSentenceLength) {
    recommendations.push(
      `Sentences are quite long (avg ${avgWordsPerSentence} words). Consider breaking them up for readability.`
    );
  }

  // Check for lists (good for featured snippets)
  const hasBulletLists = /^[-*] .+$/m.test(content);
  const hasNumberedLists = /^\d+\. .+$/m.test(content);
  if (!hasBulletLists && !hasNumberedLists) {
    recommendations.push(
      "Consider adding bullet or numbered lists to improve scannability and featured snippet potential."
    );
  }

  // Check for FAQ potential
  const hasQuestions = /\?/g.test(content);
  if (!hasQuestions) {
    recommendations.push(
      "Consider adding a FAQ section with common questions to improve GEO optimization."
    );
  }

  // Check if title keywords are in meta title
  const titleWords = title.toLowerCase().split(/\s+/);
  const metaTitleLower = metaTitle.toLowerCase();
  const missingKeywords = titleWords.filter(
    (word) => word.length > 4 && !metaTitleLower.includes(word)
  );
  if (missingKeywords.length > 2) {
    recommendations.push(
      "Meta title could better reflect the main title keywords."
    );
  }

  return recommendations;
}

// Calculate overall SEO score (0-100)
export function calculateSEOScore(
  content: string,
  title: string,
  metaTitle: string,
  metaDescription: string,
  tags: string[]
): number {
  let score = 100;
  const headings = extractHeadings(content);
  const wordCount = countWords(content);

  // Meta title scoring (-15 max)
  if (
    metaTitle.length < SEO_GUIDELINES.metaTitle.min ||
    metaTitle.length > SEO_GUIDELINES.metaTitle.max
  ) {
    score -= 10;
  }

  // Meta description scoring (-15 max)
  if (
    metaDescription.length < SEO_GUIDELINES.metaDescription.min ||
    metaDescription.length > SEO_GUIDELINES.metaDescription.max
  ) {
    score -= 10;
  }

  // Heading structure scoring (-15 max)
  if (headings.h2.length < 2) {
    score -= 10;
  }
  if (!hasProperHeadingHierarchy(content)) {
    score -= 5;
  }

  // Content length scoring (-20 max)
  if (wordCount < 300) {
    score -= 20;
  } else if (wordCount < SEO_GUIDELINES.minWordCount) {
    score -= 10;
  }

  // Tags scoring (-10 max)
  if (tags.length < 3) {
    score -= 5;
  }
  if (tags.length > 10) {
    score -= 5;
  }

  // List presence scoring (-5 max)
  const hasLists = /^[-*\d+.] .+$/m.test(content);
  if (!hasLists) {
    score -= 5;
  }

  // Title keyword in content (-10 max)
  const titleKeywords = title
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 4);
  const contentLower = content.toLowerCase();
  const keywordsInContent = titleKeywords.filter((k) =>
    contentLower.includes(k)
  );
  if (keywordsInContent.length < titleKeywords.length * 0.5) {
    score -= 10;
  }

  return Math.max(0, Math.min(100, score));
}

// Full SEO analysis
export function analyzeSEO(
  content: string,
  title: string,
  metaTitle: string,
  metaDescription: string,
  tags: string[]
): SEOAnalysis {
  const headings = extractHeadings(content);
  const wordCount = countWords(content);
  const sentenceCount = countSentences(content);

  // Extract primary keyword from title (longest significant word)
  const titleWords = title
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 4);
  const primaryKeyword = titleWords[0] || title.split(/\s+/)[0];

  return {
    score: calculateSEOScore(content, title, metaTitle, metaDescription, tags),
    metaTitle: {
      value: metaTitle,
      length: metaTitle.length,
      isOptimal:
        metaTitle.length >= SEO_GUIDELINES.metaTitle.min &&
        metaTitle.length <= SEO_GUIDELINES.metaTitle.max,
    },
    metaDescription: {
      value: metaDescription,
      length: metaDescription.length,
      isOptimal:
        metaDescription.length >= SEO_GUIDELINES.metaDescription.min &&
        metaDescription.length <= SEO_GUIDELINES.metaDescription.max,
    },
    recommendations: getRecommendations(
      content,
      title,
      metaTitle,
      metaDescription,
      tags
    ),
    keywordDensity: calculateKeywordDensity(content, [
      primaryKeyword,
      ...tags.slice(0, 3),
    ]),
    headingStructure: {
      h2Count: headings.h2.length,
      h3Count: headings.h3.length,
      hasProperHierarchy: hasProperHeadingHierarchy(content),
    },
    readability: {
      sentenceCount,
      wordCount,
      avgWordsPerSentence: Math.round(wordCount / sentenceCount),
    },
  };
}

// Optimize meta title
export function optimizeMetaTitle(
  title: string,
  primaryKeyword?: string
): string {
  let metaTitle = title;

  // If title is too long, truncate intelligently
  if (metaTitle.length > SEO_GUIDELINES.metaTitle.max) {
    metaTitle = metaTitle.substring(0, SEO_GUIDELINES.metaTitle.max - 3) + "...";
  }

  // If title is too short and we have a keyword, try to expand
  if (
    metaTitle.length < SEO_GUIDELINES.metaTitle.min &&
    primaryKeyword &&
    !metaTitle.toLowerCase().includes(primaryKeyword.toLowerCase())
  ) {
    metaTitle = `${metaTitle} | ${primaryKeyword}`;
  }

  return metaTitle;
}

// Optimize meta description
export function optimizeMetaDescription(
  excerpt: string,
  callToAction: string = "Learn more."
): string {
  let metaDescription = excerpt;

  // Truncate if too long
  if (metaDescription.length > SEO_GUIDELINES.metaDescription.max) {
    metaDescription =
      metaDescription.substring(0, SEO_GUIDELINES.metaDescription.max - callToAction.length - 4) +
      "... " +
      callToAction;
  }

  // Add CTA if too short
  if (metaDescription.length < SEO_GUIDELINES.metaDescription.min) {
    metaDescription = `${metaDescription} ${callToAction}`;
  }

  return metaDescription;
}
