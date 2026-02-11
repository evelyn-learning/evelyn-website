import mongoose, { Schema, Document } from "mongoose";

export type AIToolCategory =
  | "test-prep"
  | "writing"
  | "math"
  | "language"
  | "study-aids"
  | "college-prep"
  | "tutoring"
  | "content-creation"
  | "analytics"
  | "assessment"
  | "accessibility"
  | "research"
  | "training";

export type AIToolStatus = "active" | "beta" | "coming-soon" | "deprecated";

// Demo availability status - matches the product pages
export type DemoAvailability = "live-demo" | "interactive-preview" | "request-demo";

export interface IAITool extends Document {
  // Identity
  toolId: string; // Unique identifier (e.g., "test-generator", "essay-scorer")
  name: string;
  description: string;
  shortDescription: string;
  icon: string; // Lucide icon name

  // Categorization
  category: AIToolCategory;
  tags: string[];

  // Link to React component name in /components/demos/
  demoComponent?: string;

  // Display
  color: string; // Primary color for the tool
  previewImage?: string;

  // Configuration
  status: AIToolStatus;
  demoAvailability: DemoAvailability; // Live Demo, Interactive Preview, or Request Demo
  isDefault: boolean; // Included in new demos by default
  sortOrder: number;

  // Limits & Pricing
  defaultDailyLimit: number;
  defaultMonthlyLimit: number;
  tokensPerUse: number; // Estimated tokens per API call

  // API Configuration (for real API integration)
  apiEndpoint?: string; // Internal API route
  apiModel?: string; // Which AI model to use (e.g., "gpt-4o-mini", "claude-3-haiku")
  systemPrompt?: string;
  maxInputTokens?: number;
  maxOutputTokens?: number;
  temperature?: number;

  // Business type compatibility
  compatibleBusinessTypes: string[]; // Empty = compatible with all

  // Feature flags
  requiresAuth: boolean;
  isPremium: boolean; // Only available on paid plans
  hasImplementation: boolean; // Whether this tool has a functional UI in the demo

  // Analytics
  totalUsageCount: number;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

const AIToolSchema = new Schema<IAITool>(
  {
    toolId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    shortDescription: {
      type: String,
      required: true,
      maxlength: 100,
    },
    icon: {
      type: String,
      required: true,
      default: "Sparkles",
    },

    // Categorization
    category: {
      type: String,
      required: true,
      enum: ["test-prep", "writing", "math", "language", "study-aids", "college-prep", "tutoring", "content-creation", "analytics", "assessment", "accessibility", "research", "training"],
    },
    // Link to React component name in /components/demos/
    demoComponent: {
      type: String,
    },
    tags: [{
      type: String,
      lowercase: true,
    }],

    // Display
    color: {
      type: String,
      default: "#10B981",
    },
    previewImage: String,

    // Configuration
    status: {
      type: String,
      enum: ["active", "beta", "coming-soon", "deprecated"],
      default: "active",
    },
    demoAvailability: {
      type: String,
      enum: ["live-demo", "interactive-preview", "request-demo"],
      default: "request-demo",
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    sortOrder: {
      type: Number,
      default: 100,
    },

    // Limits
    defaultDailyLimit: {
      type: Number,
      default: 10,
    },
    defaultMonthlyLimit: {
      type: Number,
      default: 100,
    },
    tokensPerUse: {
      type: Number,
      default: 500,
    },

    // API Configuration
    apiEndpoint: String,
    apiModel: {
      type: String,
      default: "gpt-4o-mini",
    },
    systemPrompt: String,
    maxInputTokens: {
      type: Number,
      default: 2000,
    },
    maxOutputTokens: {
      type: Number,
      default: 1000,
    },
    temperature: {
      type: Number,
      default: 0.7,
    },

    // Compatibility
    compatibleBusinessTypes: [{
      type: String,
    }],

    // Feature flags
    requiresAuth: {
      type: Boolean,
      default: false,
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
    hasImplementation: {
      type: Boolean,
      default: false,
    },

    // Analytics
    totalUsageCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
AIToolSchema.index({ category: 1, status: 1 });
AIToolSchema.index({ isDefault: 1 });
AIToolSchema.index({ sortOrder: 1 });

export const AITool =
  mongoose.models.AITool ||
  mongoose.model<IAITool>("AITool", AIToolSchema);

// Seed default tools - aligned with /components/demos/ components
export const DEFAULT_AI_TOOLS = [
  // ============ TEST PREP & ASSESSMENT ============
  {
    toolId: "test-generator",
    name: "AI Practice Test Generator",
    description: "Generate unlimited unique practice tests and quizzes for SAT, ACT, AP exams and more. Original questions every time to prevent memorization.",
    shortDescription: "Generate practice tests and quizzes",
    icon: "FileQuestion",
    category: "test-prep",
    tags: ["quiz", "test", "assessment", "practice", "SAT", "ACT", "AP"],
    color: "#10B981",
    status: "active",
    isDefault: true,
    sortOrder: 1,
    defaultDailyLimit: 10,
    defaultMonthlyLimit: 100,
    tokensPerUse: 1000,
    apiModel: "gpt-4o-mini",
    demoComponent: "PracticeTestGenerator",
    compatibleBusinessTypes: ["test-prep", "tutoring", "college-consulting"],
    hasImplementation: true,
    demoAvailability: "live-demo",
  },
  {
    toolId: "essay-scorer",
    name: "AI Essay Scoring & Feedback",
    description: "Get detailed feedback on essays including structure, grammar, argument strength, and suggestions for improvement. Perfect for SAT/ACT essay prep.",
    shortDescription: "Score and improve essays",
    icon: "FileText",
    category: "writing",
    tags: ["essay", "writing", "feedback", "scoring", "grading"],
    color: "#8B5CF6",
    status: "active",
    isDefault: true,
    sortOrder: 2,
    defaultDailyLimit: 5,
    defaultMonthlyLimit: 50,
    tokensPerUse: 1500,
    apiModel: "gpt-4o-mini",
    demoComponent: "EssayScoringDemo",
    compatibleBusinessTypes: ["test-prep", "college-consulting", "tutoring"],
    hasImplementation: true,
    demoAvailability: "live-demo",
  },
  {
    toolId: "plagiarism-detection",
    name: "Plagiarism Detection",
    description: "Detect plagiarism and AI-generated content with advanced analysis. Ensure academic integrity across assignments and submissions.",
    shortDescription: "Detect plagiarism & AI content",
    icon: "Search",
    category: "assessment",
    tags: ["plagiarism", "integrity", "AI detection", "originality"],
    color: "#EF4444",
    status: "active",
    isDefault: false,
    sortOrder: 3,
    defaultDailyLimit: 10,
    defaultMonthlyLimit: 100,
    tokensPerUse: 800,
    apiModel: "gpt-4o-mini",
    demoComponent: "PlagiarismDetectionDemo",
    compatibleBusinessTypes: [],
    hasImplementation: true,
    demoAvailability: "live-demo",
  },
  {
    toolId: "proctoring-suite",
    name: "AI Proctoring Suite",
    description: "Secure remote exam proctoring with AI-powered monitoring, identity verification, and anomaly detection for academic integrity.",
    shortDescription: "Secure remote exam proctoring",
    icon: "Eye",
    category: "assessment",
    tags: ["proctoring", "exams", "security", "monitoring"],
    color: "#1E40AF",
    status: "active",
    isDefault: false,
    sortOrder: 4,
    defaultDailyLimit: 5,
    defaultMonthlyLimit: 50,
    tokensPerUse: 500,
    apiModel: "gpt-4o-mini",
    demoComponent: "ProctoringSuiteDemo",
    compatibleBusinessTypes: [],
    hasImplementation: true,
    demoAvailability: "live-demo",
  },
  // ============ TUTORING & HOMEWORK ============
  {
    toolId: "homework-helper",
    name: "Homework Help Bot",
    description: "Get step-by-step explanations and guidance for homework problems across all subjects. Learn how to solve problems, not just get answers.",
    shortDescription: "Step-by-step homework assistance",
    icon: "BookOpen",
    category: "tutoring",
    tags: ["homework", "help", "explanations", "learning"],
    color: "#F59E0B",
    status: "active",
    isDefault: true,
    sortOrder: 5,
    defaultDailyLimit: 20,
    defaultMonthlyLimit: 400,
    tokensPerUse: 800,
    apiModel: "gpt-4o-mini",
    demoComponent: "HomeworkHelpBot",
    compatibleBusinessTypes: [],
    hasImplementation: true,
    demoAvailability: "live-demo",
  },
  {
    toolId: "math-solver",
    name: "AI Math Solver",
    description: "Get step-by-step solutions for math problems from basic arithmetic to calculus. Understand the 'why' behind each step with visual explanations.",
    shortDescription: "Solve math problems step-by-step",
    icon: "Calculator",
    category: "math",
    tags: ["math", "algebra", "calculus", "geometry", "solver"],
    color: "#3B82F6",
    status: "active",
    isDefault: false,
    sortOrder: 6,
    defaultDailyLimit: 15,
    defaultMonthlyLimit: 300,
    tokensPerUse: 600,
    apiModel: "gpt-4o-mini",
    demoComponent: "MathSolverDemo",
    compatibleBusinessTypes: ["tutoring", "test-prep"],
    hasImplementation: true,
    demoAvailability: "live-demo",
  },
  {
    toolId: "tutor-copilot",
    name: "Tutoring Co-Pilot",
    description: "AI assistant for tutors - generate lesson plans, practice problems, and personalized explanations. Enhance your tutoring sessions with AI support.",
    shortDescription: "AI assistant for tutors",
    icon: "Users",
    category: "tutoring",
    tags: ["tutor", "teaching", "lessons", "copilot"],
    color: "#6366F1",
    status: "active",
    isDefault: false,
    sortOrder: 7,
    defaultDailyLimit: 10,
    defaultMonthlyLimit: 200,
    tokensPerUse: 1000,
    apiModel: "gpt-4o-mini",
    demoComponent: "TutoringCoPilot",
    compatibleBusinessTypes: ["tutoring"],
    hasImplementation: true,
    demoAvailability: "live-demo",
  },
  {
    toolId: "reading-comprehension",
    name: "Reading Comprehension Coach",
    description: "Improve reading comprehension skills with AI-guided passage analysis, question strategies, and vocabulary support. Perfect for standardized tests.",
    shortDescription: "Master reading comprehension",
    icon: "BookOpenCheck",
    category: "test-prep",
    tags: ["reading", "comprehension", "SAT", "ACT", "passages"],
    color: "#EC4899",
    status: "active",
    isDefault: false,
    sortOrder: 8,
    defaultDailyLimit: 10,
    defaultMonthlyLimit: 100,
    tokensPerUse: 1000,
    apiModel: "gpt-4o-mini",
    demoComponent: "ReadingComprehensionDemo",
    compatibleBusinessTypes: ["test-prep", "tutoring"],
    hasImplementation: true,
    demoAvailability: "live-demo",
  },
  // ============ LEARNING & CONTENT ============
  {
    toolId: "adaptive-learning",
    name: "Adaptive Learning Engine",
    description: "Personalized learning paths that adapt to each student's pace, strengths, and weaknesses. AI-powered recommendations for optimal learning.",
    shortDescription: "Personalized learning paths",
    icon: "TrendingUp",
    category: "tutoring",
    tags: ["adaptive", "personalized", "learning", "AI"],
    color: "#14B8A6",
    status: "active",
    isDefault: false,
    sortOrder: 9,
    defaultDailyLimit: 10,
    defaultMonthlyLimit: 200,
    tokensPerUse: 500,
    apiModel: "gpt-4o-mini",
    demoComponent: "AdaptiveLearningDemo",
    compatibleBusinessTypes: [],
    hasImplementation: true,
    demoAvailability: "live-demo",
  },
  {
    toolId: "language-learning",
    name: "AI Language Learning",
    description: "Interactive language learning with AI conversation practice, pronunciation feedback, and personalized vocabulary building.",
    shortDescription: "Interactive language practice",
    icon: "Globe",
    category: "language",
    tags: ["language", "ESL", "conversation", "vocabulary"],
    color: "#06B6D4",
    status: "active",
    isDefault: false,
    sortOrder: 10,
    defaultDailyLimit: 15,
    defaultMonthlyLimit: 300,
    tokensPerUse: 600,
    apiModel: "gpt-4o-mini",
    demoComponent: "LanguageLearningDemo",
    compatibleBusinessTypes: [],
    hasImplementation: true,
    demoAvailability: "live-demo",
  },
  {
    toolId: "virtual-labs",
    name: "Virtual Labs",
    description: "Interactive virtual science labs with AI-guided experiments. Safe, scalable, and accessible lab experiences for any classroom.",
    shortDescription: "Interactive virtual experiments",
    icon: "FlaskConical",
    category: "study-aids",
    tags: ["labs", "science", "experiments", "virtual"],
    color: "#22C55E",
    status: "active",
    isDefault: false,
    sortOrder: 11,
    defaultDailyLimit: 5,
    defaultMonthlyLimit: 50,
    tokensPerUse: 1200,
    apiModel: "gpt-4o-mini",
    demoComponent: "VirtualLabDemo",
    compatibleBusinessTypes: [],
    hasImplementation: true,
    demoAvailability: "live-demo",
  },
  // ============ CONTENT CREATION ============
  {
    toolId: "content-authoring",
    name: "Content Authoring Studio",
    description: "AI-powered content creation for educators. Generate lesson plans, worksheets, assessments, and learning materials in minutes.",
    shortDescription: "Create educational content",
    icon: "PenTool",
    category: "content-creation",
    tags: ["content", "authoring", "lessons", "materials"],
    color: "#A855F7",
    status: "active",
    isDefault: false,
    sortOrder: 12,
    defaultDailyLimit: 10,
    defaultMonthlyLimit: 100,
    tokensPerUse: 1000,
    apiModel: "gpt-4o-mini",
    demoComponent: "ContentAuthoringDemo",
    compatibleBusinessTypes: [],
    hasImplementation: true,
    demoAvailability: "live-demo",
  },
  {
    toolId: "curriculum-designer",
    name: "Curriculum Designer",
    description: "AI-assisted curriculum design and mapping. Align learning objectives, standards, and assessments across courses and programs.",
    shortDescription: "Design aligned curricula",
    icon: "LayoutGrid",
    category: "content-creation",
    tags: ["curriculum", "standards", "mapping", "design"],
    color: "#0EA5E9",
    status: "active",
    isDefault: false,
    sortOrder: 13,
    defaultDailyLimit: 5,
    defaultMonthlyLimit: 50,
    tokensPerUse: 1500,
    apiModel: "gpt-4o-mini",
    demoComponent: "CurriculumDesignerDemo",
    compatibleBusinessTypes: [],
    hasImplementation: true,
    demoAvailability: "live-demo",
  },
  {
    toolId: "course-creator",
    name: "Course Creator Studio",
    description: "Build complete online courses with AI-generated content, assessments, and learning activities. From outline to published course in hours.",
    shortDescription: "Build complete courses",
    icon: "Video",
    category: "content-creation",
    tags: ["courses", "e-learning", "LMS", "creator"],
    color: "#F97316",
    status: "active",
    isDefault: false,
    sortOrder: 14,
    defaultDailyLimit: 3,
    defaultMonthlyLimit: 30,
    tokensPerUse: 2000,
    apiModel: "gpt-4o-mini",
    demoComponent: "CourseCreatorStudioDemo",
    compatibleBusinessTypes: [],
    hasImplementation: true,
    demoAvailability: "live-demo",
  },
  {
    toolId: "textbook-digitizer",
    name: "Textbook Digitizer",
    description: "Convert physical textbooks and documents into interactive digital content with AI-enhanced features, search, and accessibility.",
    shortDescription: "Digitize learning materials",
    icon: "ScanLine",
    category: "content-creation",
    tags: ["digitize", "textbooks", "OCR", "conversion"],
    color: "#78716C",
    status: "active",
    isDefault: false,
    sortOrder: 15,
    defaultDailyLimit: 5,
    defaultMonthlyLimit: 50,
    tokensPerUse: 1000,
    apiModel: "gpt-4o-mini",
    demoComponent: "TextbookDigitizerDemo",
    compatibleBusinessTypes: [],
    hasImplementation: true,
    demoAvailability: "live-demo",
  },
  // ============ ANALYTICS & INSIGHTS ============
  {
    toolId: "analytics-dashboard",
    name: "Learning Analytics Dashboard",
    description: "Comprehensive analytics for student performance, engagement, and learning outcomes. AI-powered insights to drive educational decisions.",
    shortDescription: "Track learning outcomes",
    icon: "BarChart3",
    category: "analytics",
    tags: ["analytics", "dashboard", "insights", "performance"],
    color: "#0891B2",
    status: "active",
    isDefault: false,
    sortOrder: 16,
    defaultDailyLimit: 10,
    defaultMonthlyLimit: 200,
    tokensPerUse: 400,
    apiModel: "gpt-4o-mini",
    demoComponent: "AnalyticsDashboardDemo",
    compatibleBusinessTypes: [],
    hasImplementation: true,
    demoAvailability: "live-demo",
  },
  {
    toolId: "student-success-predictor",
    name: "Student Success Predictor",
    description: "AI-powered early warning system to identify at-risk students and recommend interventions before they fall behind.",
    shortDescription: "Predict & prevent dropouts",
    icon: "TrendingUp",
    category: "analytics",
    tags: ["prediction", "intervention", "success", "early-warning"],
    color: "#DC2626",
    status: "active",
    isDefault: false,
    sortOrder: 17,
    defaultDailyLimit: 5,
    defaultMonthlyLimit: 50,
    tokensPerUse: 600,
    apiModel: "gpt-4o-mini",
    demoComponent: "StudentSuccessPredictorDemo",
    compatibleBusinessTypes: [],
    hasImplementation: true,
    demoAvailability: "live-demo",
  },
  // ============ COLLEGE & ADMISSIONS ============
  {
    toolId: "admissions-assistant",
    name: "Admissions Assistant",
    description: "AI-powered college admissions guidance. Essay coaching, school matching, application tracking, and deadline management.",
    shortDescription: "College admissions guidance",
    icon: "GraduationCap",
    category: "college-prep",
    tags: ["college", "admissions", "applications", "guidance"],
    color: "#7C3AED",
    status: "active",
    isDefault: false,
    sortOrder: 18,
    defaultDailyLimit: 5,
    defaultMonthlyLimit: 50,
    tokensPerUse: 1200,
    apiModel: "gpt-4o-mini",
    demoComponent: "AdmissionsAssistantDemo",
    compatibleBusinessTypes: ["college-consulting"],
    hasImplementation: true,
    demoAvailability: "live-demo",
  },
  {
    toolId: "career-pathways",
    name: "Career Pathways",
    description: "AI-guided career exploration and planning. Match skills to careers, explore pathways, and plan educational requirements.",
    shortDescription: "Explore career options",
    icon: "Navigation",
    category: "college-prep",
    tags: ["career", "planning", "guidance", "pathways"],
    color: "#059669",
    status: "active",
    isDefault: false,
    sortOrder: 19,
    defaultDailyLimit: 5,
    defaultMonthlyLimit: 50,
    tokensPerUse: 800,
    apiModel: "gpt-4o-mini",
    demoComponent: "CareerPathwaysDemo",
    compatibleBusinessTypes: ["college-consulting"],
    hasImplementation: true,
    demoAvailability: "live-demo",
  },
  // ============ RESEARCH & WRITING ============
  {
    toolId: "research-assistant",
    name: "Research Assistant",
    description: "AI-powered research assistance for academic work. Find sources, summarize papers, organize citations, and synthesize information.",
    shortDescription: "AI research assistance",
    icon: "Search",
    category: "research",
    tags: ["research", "citations", "sources", "academic"],
    color: "#4338CA",
    status: "active",
    isDefault: false,
    sortOrder: 20,
    defaultDailyLimit: 10,
    defaultMonthlyLimit: 100,
    tokensPerUse: 1000,
    apiModel: "gpt-4o-mini",
    demoComponent: "ResearchAssistantDemo",
    compatibleBusinessTypes: [],
    hasImplementation: true,
    demoAvailability: "live-demo",
  },
  // ============ ACCESSIBILITY ============
  {
    toolId: "accessibility-ai",
    name: "Accessibility AI",
    description: "Make learning content accessible to all. AI-powered captioning, audio descriptions, text-to-speech, and accommodation recommendations.",
    shortDescription: "Accessible learning for all",
    icon: "PersonStanding",
    category: "accessibility",
    tags: ["accessibility", "ADA", "accommodations", "inclusive"],
    color: "#0284C7",
    status: "active",
    isDefault: false,
    sortOrder: 21,
    defaultDailyLimit: 10,
    defaultMonthlyLimit: 100,
    tokensPerUse: 600,
    apiModel: "gpt-4o-mini",
    demoComponent: "AccessibilityAIDemo",
    compatibleBusinessTypes: [],
    hasImplementation: true,
    demoAvailability: "live-demo",
  },
  // ============ CORPORATE & TRAINING ============
  {
    toolId: "corporate-training",
    name: "Corporate Training AI",
    description: "AI-powered corporate learning and development. Skills gap analysis, personalized training paths, and compliance tracking.",
    shortDescription: "Corporate L&D solutions",
    icon: "Briefcase",
    category: "training",
    tags: ["corporate", "training", "L&D", "compliance"],
    color: "#1D4ED8",
    status: "active",
    isDefault: false,
    sortOrder: 22,
    defaultDailyLimit: 5,
    defaultMonthlyLimit: 50,
    tokensPerUse: 1000,
    apiModel: "gpt-4o-mini",
    demoComponent: "CorporateTrainingDemo",
    compatibleBusinessTypes: [],
    hasImplementation: true,
    demoAvailability: "live-demo",
  },
  // ============ ENGAGEMENT ============
  {
    toolId: "parent-engagement",
    name: "Parent Engagement Portal",
    description: "Keep parents informed and engaged with AI-powered progress reports, communication tools, and learning insights.",
    shortDescription: "Connect parents to learning",
    icon: "Users",
    category: "analytics",
    tags: ["parents", "engagement", "communication", "reports"],
    color: "#EA580C",
    status: "active",
    isDefault: false,
    sortOrder: 23,
    defaultDailyLimit: 10,
    defaultMonthlyLimit: 100,
    tokensPerUse: 400,
    apiModel: "gpt-4o-mini",
    demoComponent: "ParentEngagementDemo",
    compatibleBusinessTypes: [],
    hasImplementation: true,
    demoAvailability: "live-demo",
  },
];
