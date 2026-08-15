// Blog Generator TypeScript Interfaces

export type AIProvider = "claude" | "gpt4";
export type BlogTone = "professional" | "educational" | "engaging" | "thought-leadership";
export type BlogLength = "short" | "medium" | "long";
export type ImageStyle = "professional" | "illustrative" | "abstract";
export type TargetMarket = "k12" | "higher-ed" | "corporate" | "publishers" | "general";

// Blog Categories - matches existing blog system
export const BLOG_CATEGORIES = [
  "AI in Education",
  "Ed-Tech Trends",
  "Product Updates",
  "Case Studies",
  "Industry Insights",
  "Best Practices",
  "Research & Data",
] as const;

export type BlogCategory = (typeof BLOG_CATEGORIES)[number];

// Request for generating a blog post
export interface BlogGenerationRequest {
  topic: string;
  category: BlogCategory;
  targetMarket?: TargetMarket;
  tone?: BlogTone;
  length?: BlogLength;
  aiProvider?: AIProvider;
  keywords?: string[];
  includeProductMention?: boolean;
}

// The generated blog post before publishing
export interface GeneratedBlogPost {
  title: string;
  slug: string;
  excerpt: string;
  content: string; // Markdown content
  quickAnswer?: string;
  featuredImage?: string;
  category: string;
  tags: string[];
  author: string;
  metaTitle: string;
  metaDescription: string;
  readingTime: number;
  seoScore: number;
  suggestedImages?: ImageSuggestion[];
  generatedAt: Date;
  aiProvider: AIProvider;
}

// AI-generated topic suggestion
export interface TopicSuggestion {
  title: string;
  description: string;
  keywords: string[];
  relevanceScore: number;
  targetMarket?: TargetMarket;
  category: BlogCategory;
}

// Image suggestion from DALL-E
export interface ImageSuggestion {
  imageUrl: string;
  altText: string;
  prompt: string;
  style: ImageStyle;
}

// SEO analysis result
export interface SEOAnalysis {
  score: number;
  metaTitle: {
    value: string;
    length: number;
    isOptimal: boolean;
  };
  metaDescription: {
    value: string;
    length: number;
    isOptimal: boolean;
  };
  recommendations: string[];
  keywordDensity: Record<string, number>;
  headingStructure: {
    h2Count: number;
    h3Count: number;
    hasProperHierarchy: boolean;
  };
  readability: {
    sentenceCount: number;
    wordCount: number;
    avgWordsPerSentence: number;
  };
}

// Scheduled blog post in queue
export interface ScheduledPost {
  _id: string;
  title: string;
  generatedPost: GeneratedBlogPost;
  scheduledFor: Date;
  status: "pending" | "published" | "failed";
  createdAt: Date;
  publishedAt?: Date;
  error?: string;
}

// API response types
export interface GenerateResponse {
  success: boolean;
  post?: GeneratedBlogPost;
  error?: string;
}

export interface TopicsResponse {
  success: boolean;
  topics?: TopicSuggestion[];
  error?: string;
}

export interface ImageResponse {
  success: boolean;
  image?: ImageSuggestion;
  error?: string;
}

export interface PublishResponse {
  success: boolean;
  postId?: string;
  slug?: string;
  error?: string;
}

export interface ScheduleResponse {
  success: boolean;
  scheduled?: ScheduledPost;
  queue?: ScheduledPost[];
  error?: string;
}

// Knowledge base content types
export interface ProductInfo {
  name: string;
  description: string;
  features: string[];
  targetMarket: TargetMarket[];
  benefits: string[];
}

export interface CompanyInfo {
  name: string;
  description: string;
  mission: string;
  values: string[];
  expertise: string[];
}

export interface KnowledgeBaseContent {
  company: CompanyInfo;
  products: ProductInfo[];
  targetMarkets: {
    [key in TargetMarket]: {
      name: string;
      description: string;
      challenges: string[];
      solutions: string[];
    };
  };
}
