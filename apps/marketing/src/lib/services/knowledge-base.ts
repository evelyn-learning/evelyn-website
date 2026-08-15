// Company Knowledge Base for AI Blog Generation
// This provides structured context about Evelyn Learning for AI-generated content

import {
  KnowledgeBaseContent,
  ProductInfo,
  TargetMarket,
} from "@/types/blog-generator";

export const KNOWLEDGE_BASE: KnowledgeBaseContent = {
  company: {
    name: "Evelyn Learning",
    description:
      "A team of educators and engineers building AI-powered tools that transform how people teach and learn. Founded in 2013, we combine deep pedagogical expertise with cutting-edge AI technology.",
    mission:
      "To empower educational institutions, publishers, and organizations with innovative AI solutions and content that enhance learning outcomes and make quality education accessible to all.",
    values: ["Excellence", "Innovation", "Integrity", "Collaboration"],
    expertise: [
      "AI-powered education tools",
      "Curriculum development",
      "Assessment creation",
      "Content development at scale",
      "EdTech product development",
      "Learning science application",
    ],
  },
  products: [
    {
      name: "AI Essay Scoring & Feedback",
      description:
        "Instant, rubric-aligned feedback on student writing. Calibrated to SAT, ACT, AP, and college application standards.",
      features: [
        "Multiple rubric support (SAT, ACT, AP, College App, Custom)",
        "Detailed scoring across all categories",
        "Specific, actionable improvement suggestions",
        "Sentence-level rewrite examples",
      ],
      targetMarket: ["k12", "higher-ed", "corporate"],
      benefits: [
        "80% grading time saved",
        "10-second average feedback time",
        "95% human grader correlation",
      ],
    },
    {
      name: "24/7 AI Homework Helper",
      description:
        "On-demand tutoring support that guides students to discover answers through Socratic questioning, not direct answers.",
      features: [
        "Step-by-step problem breakdown",
        "Socratic questioning approach",
        "Multi-subject coverage (Math, Science, English, History)",
        "White-label branding",
      ],
      targetMarket: ["k12", "higher-ed"],
      benefits: [
        "24/7 availability",
        "40% reduction in student churn",
        "Under 3-second response time",
      ],
    },
    {
      name: "AI Practice Test Generator",
      description:
        "Generate original, test-aligned practice questions on demand. Creates novel problems matching real standardized tests.",
      features: [
        "SAT, ACT, PSAT, AP exam alignment",
        "Difficulty calibration (Easy/Medium/Hard)",
        "Topic-specific targeting",
        "Detailed explanations for every answer",
      ],
      targetMarket: ["k12", "publishers"],
      benefits: [
        "Unlimited unique questions",
        "$50K+ test bank savings",
        "100% fresh content every time",
      ],
    },
    {
      name: "AI Tutoring Co-Pilot",
      description:
        "Real-time AI assistance for tutors providing teaching suggestions, student insights, and strategies during live sessions.",
      features: [
        "Real-time teaching suggestions",
        "Student learning profile integration",
        "Misconception detection alerts",
        "Session summary auto-generation",
      ],
      targetMarket: ["k12", "corporate"],
      benefits: [
        "2-3x tutor capacity",
        "50% faster onboarding",
        "100% consistent quality",
      ],
    },
  ],
  targetMarkets: {
    k12: {
      name: "K-12 Education",
      description:
        "Elementary through high school educational institutions and service providers",
      challenges: [
        "Teacher shortages and burnout",
        "Personalized learning at scale",
        "Assessment creation and grading burden",
        "After-hours student support",
        "Budget constraints",
      ],
      solutions: [
        "AI-powered grading reduces teacher workload by 80%",
        "24/7 homework help extends learning beyond classroom hours",
        "Adaptive learning paths personalize education for each student",
        "Automated practice test generation saves content licensing costs",
      ],
    },
    "higher-ed": {
      name: "Higher Education",
      description:
        "Universities, colleges, and post-secondary institutions",
      challenges: [
        "Large class sizes with limited TA support",
        "Academic integrity concerns",
        "Student success and retention",
        "Research and teaching balance",
        "Career readiness preparation",
      ],
      solutions: [
        "Essay scoring handles large course writing assignments",
        "AI tutoring provides scalable student support",
        "Learning analytics identify at-risk students early",
        "Automated feedback enables more writing practice",
      ],
    },
    corporate: {
      name: "Corporate Training",
      description: "Enterprise learning and development departments",
      challenges: [
        "Consistent training delivery across locations",
        "Measuring training effectiveness",
        "Keeping content current",
        "Onboarding at scale",
        "Skills gap identification",
      ],
      solutions: [
        "AI co-pilot ensures consistent training quality",
        "Automated assessments measure competency",
        "Content generation keeps materials fresh",
        "Personalized learning paths address individual gaps",
      ],
    },
    publishers: {
      name: "Educational Publishers",
      description: "Textbook and educational content publishers",
      challenges: [
        "Content production costs",
        "Digital transformation pressure",
        "Competition from free resources",
        "Keeping content current",
        "Interactive content demands",
      ],
      solutions: [
        "AI-assisted content creation reduces production costs",
        "Transform static content into interactive experiences",
        "Automated question generation expands practice materials",
        "Content enhancement adds adaptive learning features",
      ],
    },
    general: {
      name: "Education Industry",
      description: "Broad education technology and services market",
      challenges: [
        "Technology adoption barriers",
        "Demonstrating ROI",
        "Integration with existing systems",
        "User adoption and training",
      ],
      solutions: [
        "White-label solutions integrate seamlessly",
        "API-first architecture enables easy integration",
        "Full-service delivery minimizes adoption friction",
        "Technology transfer options for complete ownership",
      ],
    },
  },
};

// Helper function to get product context for a specific market
export function getProductsForMarket(market: TargetMarket): ProductInfo[] {
  return KNOWLEDGE_BASE.products.filter((p) =>
    p.targetMarket.includes(market)
  );
}

// Helper function to get market-specific context
export function getMarketContext(market: TargetMarket) {
  return KNOWLEDGE_BASE.targetMarkets[market];
}

// Generate AI context string for blog generation
export function getAIContext(targetMarket?: TargetMarket): string {
  const company = KNOWLEDGE_BASE.company;
  const products = targetMarket
    ? getProductsForMarket(targetMarket)
    : KNOWLEDGE_BASE.products;
  const market = targetMarket
    ? KNOWLEDGE_BASE.targetMarkets[targetMarket]
    : null;

  let context = `
## Company Background
${company.name} is ${company.description}

Our mission: ${company.mission}

Core values: ${company.values.join(", ")}

Areas of expertise: ${company.expertise.join(", ")}

## Our Products
${products
  .map(
    (p) => `
### ${p.name}
${p.description}
Key features: ${p.features.join(", ")}
Benefits: ${p.benefits.join(", ")}
`
  )
  .join("\n")}
`;

  if (market) {
    context += `
## Target Market: ${market.name}
${market.description}

Common challenges:
${market.challenges.map((c) => `- ${c}`).join("\n")}

How we help:
${market.solutions.map((s) => `- ${s}`).join("\n")}
`;
  }

  return context;
}

// Client list for credibility mentions
export const NOTABLE_CLIENTS = [
  "Coursera",
  "McGraw Hill",
  "Barnes & Noble",
  "Chegg",
  "Course Hero",
  "Amazon",
  "Study.com",
  "GoGuardian",
];

// Company statistics for content
export const COMPANY_STATS = {
  yearsExperience: "10+",
  clientsWorldwide: "500+",
  contentItems: "1M+",
  countriesServed: "50+",
  educatorExperts: "300+",
};
