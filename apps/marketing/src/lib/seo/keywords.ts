/**
 * GEO (Generative Engine Optimization) Keywords Configuration
 *
 * These keywords are optimized for AI-powered search engines like ChatGPT,
 * Perplexity, Claude, and others to improve discoverability and visibility.
 */

// Primary GEO keywords for the entire site
export const PRIMARY_KEYWORDS = [
  // Core AI/Learning Terms
  'AI-Powered Learning',
  'Adaptive Learning Platform',
  'Personalized Learning',
  'Intelligent Tutoring Systems',

  // Analytics & Data
  'Learning Analytics',
  'Predictive Analytics in Education',
  'Data-Driven Learning',
  'Student Success Analytics',

  // Assessment & Feedback
  'Automated Grading',
  'AI Feedback Systems',
  'Automated Essay Scoring',
  'Formative Assessment AI',

  // Skills & Workforce
  'Skills-Based Learning',
  'Workforce-Aligned Learning',
  'Competency-Based Education',
  'Career Pathways AI',

  // Technology & Integration
  'EdTech Platform',
  'LMS Integration',
  'Interoperability',
  'Platform Consolidation',

  // Accessibility & Inclusion
  'Inclusive Learning',
  'Accessible EdTech',
  'WCAG Compliant Learning',
  'Universal Design for Learning',

  // Engagement & Experience
  'Immersive Learning',
  'Interactive Learning',
  'Student Engagement Platform',
  'Student Success Platform',
];

// Category-specific keywords
export const CATEGORY_KEYWORDS = {
  assessment: [
    'AI Essay Scoring',
    'Automated Grading System',
    'Rubric-Aligned Feedback',
    'AI-Powered Assessment',
    'Real-Time Student Feedback',
    'Plagiarism Detection AI',
    'AI Proctoring',
    'Remote Exam Monitoring',
    'AI Essay Feedback',
    'AI Essay Feedback Generator',
    'Essay Grading Software',
    'Analytic Rubric Essay Grading',
    'AP Lang Essay Grader AI',
    'Automated Essay Scoring Software',
    'Custom Rubric Essay Grader',
  ],

  tutoring: [
    'AI Tutoring Platform',
    '24/7 Homework Help',
    'Virtual Tutoring Assistant',
    'Intelligent Tutoring System',
    'AI Math Solver',
    'Language Learning AI',
    'Personalized Tutoring',
    'AI Voice Tutor',
    'Voice Tutor AI',
    '24/7 Student Support AI',
  ],

  content: [
    'AI Content Creation',
    'Curriculum Design AI',
    'Interactive Course Builder',
    'Textbook Digitization',
    'Content Accessibility AI',
    'Educational Content AI',
    'Course Creator AI',
  ],

  analytics: [
    'Learning Analytics Platform',
    'Student Success Prediction',
    'Early Warning System',
    'Educational Data Analytics',
    'Adaptive Learning Engine',
    'Learning Path Optimization',
    'Student Performance Analytics',
  ],

  institutional: [
    'AI Admissions Assistant',
    'Student Enrollment AI',
    'Parent Engagement Platform',
    'School Communication AI',
    'Higher Education AI',
    'K-12 AI Solutions',
  ],

  enterprise: [
    'Corporate Training AI',
    'Enterprise Learning Platform',
    'Microlearning Generator',
    'Compliance Training AI',
    'Skill Gap Analysis',
    'Professional Development AI',
    'Career Exploration Software',
    'Career Guidance Platform',
    'AI Career Exploration Platform',
    'AI Skill Gap Analysis',
    'Career Path Platform',
  ],

  research: [
    'Research Assistant AI',
    'Academic Writing Assistant',
    'Citation Management AI',
    'Literature Review AI',
    'Research Methodology AI',
  ],
};

// Service-specific keywords
export const SERVICE_KEYWORDS = {
  aiReadiness: [
    'AI Readiness Assessment',
    'EdTech Implementation',
    'AI Strategy Consulting',
    'Digital Transformation Education',
    'AI ROI Analysis',
  ],

  customAI: [
    'Custom AI Development',
    'Bespoke AI Solutions',
    'White-Label AI',
    'AI Model Fine-Tuning',
    'Educational AI Development',
  ],

  implementation: [
    'AI Implementation Services',
    'LMS Integration Services',
    'EdTech Integration',
    'API Development Education',
    'SSO Implementation',
  ],

  ethics: [
    'AI Ethics Education',
    'AI Governance Framework',
    'Responsible AI Education',
    'AI Bias Auditing',
    'Educational AI Compliance',
  ],

  training: [
    'Faculty AI Training',
    'Educator Professional Development',
    'AI Literacy Training',
    'Prompt Engineering Training',
    'EdTech Training Programs',
  ],

  managed: [
    'Managed AI Services',
    'EdTech Support Services',
    'AI Maintenance Services',
    '24/7 AI Support',
    'SLA-Backed AI Services',
  ],

  content: [
    'Content Transformation Services',
    'Digital Content Migration',
    'Legacy Content Conversion',
    'Accessibility Remediation',
    'Content Modernization',
  ],
};

// Helper function to get keywords for metadata
export function getKeywordsForProduct(productId: string): string[] {
  const baseKeywords = [...PRIMARY_KEYWORDS.slice(0, 8)];

  const categoryMap: Record<string, keyof typeof CATEGORY_KEYWORDS> = {
    'essay-ai': 'assessment',
    'test-generator': 'assessment',
    'plagiarism-detection': 'assessment',
    'proctoring-suite': 'assessment',
    'homework-bot': 'tutoring',
    'tutor-copilot': 'tutoring',
    'math-solver': 'tutoring',
    'language-learning': 'tutoring',
    'voice-tutor': 'tutoring',
    'content-authoring': 'content',
    'reading-comprehension': 'content',
    'curriculum-designer': 'content',
    'accessibility-ai': 'content',
    'course-creator-studio': 'content',
    'textbook-digitizer': 'content',
    'adaptive-learning': 'analytics',
    'analytics-dashboard': 'analytics',
    'student-success-predictor': 'analytics',
    'career-pathways': 'enterprise',
    'admissions-assistant': 'institutional',
    'parent-engagement': 'institutional',
    'corporate-training': 'enterprise',
    'research-assistant': 'research',
    'virtual-labs': 'content',
  };

  const category = categoryMap[productId];
  if (category && CATEGORY_KEYWORDS[category]) {
    return [...baseKeywords, ...CATEGORY_KEYWORDS[category]];
  }

  return baseKeywords;
}

// Helper function to get keywords for services
export function getKeywordsForService(serviceId: string): string[] {
  const baseKeywords = [...PRIMARY_KEYWORDS.slice(0, 8)];

  const serviceMap: Record<string, keyof typeof SERVICE_KEYWORDS> = {
    'ai-readiness': 'aiReadiness',
    'custom-ai': 'customAI',
    'implementation': 'implementation',
    'ethics-governance': 'ethics',
    'training': 'training',
    'managed-services': 'managed',
    'content': 'content',
  };

  const service = serviceMap[serviceId];
  if (service && SERVICE_KEYWORDS[service]) {
    return [...baseKeywords, ...SERVICE_KEYWORDS[service]];
  }

  return baseKeywords;
}
