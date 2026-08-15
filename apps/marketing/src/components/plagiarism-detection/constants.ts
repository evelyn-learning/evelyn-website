import type { AssignmentContext } from './types';

// ============================================================================
// Confidence → Plain-English Verdict Mapping
// ============================================================================
export const AI_VERDICTS = [
  { max: 25, label: 'Very likely original work', color: 'text-green-700', bg: 'bg-green-50', border: 'border-green-200' },
  { max: 50, label: 'Mostly original — minor concerns noted', color: 'text-yellow-700', bg: 'bg-yellow-50', border: 'border-yellow-200' },
  { max: 75, label: 'Significant concerns — recommend review', color: 'text-orange-700', bg: 'bg-orange-50', border: 'border-orange-200' },
  { max: 100, label: 'Strong indicators of AI generation — action recommended', color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200' },
] as const;

export const PLAGIARISM_VERDICTS = [
  { max: 15, label: 'No significant matches found', color: 'text-green-700', bg: 'bg-green-50', border: 'border-green-200' },
  { max: 35, label: 'Minor similarities detected', color: 'text-yellow-700', bg: 'bg-yellow-50', border: 'border-yellow-200' },
  { max: 60, label: 'Notable similarities — review recommended', color: 'text-orange-700', bg: 'bg-orange-50', border: 'border-orange-200' },
  { max: 100, label: 'High similarity to external sources — action recommended', color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200' },
] as const;

export function getVerdict(score: number, verdicts: typeof AI_VERDICTS | typeof PLAGIARISM_VERDICTS) {
  return verdicts.find(v => score <= v.max) || verdicts[verdicts.length - 1];
}

// ============================================================================
// Annotation Colors
// ============================================================================
export const ANNOTATION_STYLES = {
  'ai-generated': {
    bg: 'bg-red-200/60',
    hoverBg: 'hover:bg-red-300/70',
    border: 'border-red-400',
    label: 'AI-Generated',
    dotColor: 'bg-red-500',
  },
  suspicious: {
    bg: 'bg-yellow-200/60',
    hoverBg: 'hover:bg-yellow-300/70',
    border: 'border-yellow-400',
    label: 'Needs Review',
    dotColor: 'bg-yellow-500',
  },
  plagiarism: {
    bg: 'bg-orange-200/60',
    hoverBg: 'hover:bg-orange-300/70',
    border: 'border-orange-400',
    label: 'Potential Plagiarism',
    dotColor: 'bg-orange-500',
  },
} as const;

// ============================================================================
// Grade-Level Prompt Calibration
// ============================================================================
export function getCalibrationPrompt(context: AssignmentContext): string {
  const gradeDescriptions: Record<number, string> = {
    9: 'a 9th grader (freshman). Expect simpler vocabulary, shorter sentences, and developing argumentation skills. Some awkward phrasing is normal.',
    10: 'a 10th grader (sophomore). Expect moderate vocabulary, growing sophistication in argument structure. Some inconsistency in tone is normal.',
    11: 'an 11th grader (junior). Expect competent vocabulary and reasonable argument structure. More polished writing is expected but not perfection.',
    12: 'a 12th grader (senior). Expect strong vocabulary, well-structured arguments, and more mature writing style. AP-level work may be highly polished.',
  };

  const subjectNotes: Record<string, string> = {
    english: 'This is an English/Language Arts assignment. Focus on voice, creativity, and personal expression. Literary analysis may use sophisticated terms that are taught in class.',
    history: 'This is a History/Social Studies assignment. Expect factual claims, dates, and proper nouns. Some phrases may closely match source material due to the nature of historical writing — distinguish between proper paraphrasing and copying.',
    science: 'This is a Science assignment. Technical terminology is expected and should not be flagged as AI-generated. Lab reports and research papers follow formulaic structures by design.',
    other: 'Evaluate based on general academic writing standards for this grade level.',
  };

  const typeNotes: Record<string, string> = {
    essay: 'This is a personal/argumentative essay. Original voice and perspective are expected.',
    'research-paper': 'This is a research paper. Some similarity to sources is expected — focus on whether the student has properly paraphrased and cited rather than copied.',
    'short-answer': 'This is a short-answer response. Brevity is expected. Short answers may naturally overlap with common phrasings.',
    other: 'Evaluate based on general expectations for this type of assignment.',
  };

  return `
STUDENT CONTEXT: This submission is from ${gradeDescriptions[context.gradeLevel]}
SUBJECT: ${subjectNotes[context.subject]}
ASSIGNMENT TYPE: ${typeNotes[context.assignmentType]}

Calibrate your analysis accordingly. Do not flag writing as AI-generated simply because it is well-written for the grade level. Focus on patterns that are genuinely inconsistent with a student at this level.`;
}

// ============================================================================
// File Upload Constraints
// ============================================================================
export const UPLOAD_CONSTRAINTS = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  maxBatchSize: 35,
  acceptedTypes: ['.docx', '.pdf', '.txt'],
  acceptedMimeTypes: [
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/pdf',
    'text/plain',
  ],
} as const;

// ============================================================================
// Severity Colors
// ============================================================================
export const SEVERITY_STYLES = {
  high: 'bg-red-100 text-red-700 border-red-200',
  medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  low: 'bg-blue-100 text-blue-700 border-blue-200',
} as const;

// ============================================================================
// Sample Texts
// ============================================================================
export const SAMPLE_TEXTS = {
  original: `The impact of social media on mental health has become a growing concern among researchers and healthcare professionals. Studies conducted at major universities have shown correlations between excessive social media use and increased rates of anxiety and depression, particularly among teenagers and young adults. However, it's important to note that correlation doesn't imply causation, and many individuals use social media without experiencing negative mental health effects. The key seems to lie in how platforms are used - passive consumption tends to be more harmful than active engagement with communities.`,
  suspicious: `Social media has emerged as a transformative force in contemporary society, fundamentally reshaping the landscape of human interaction and communication. This digital revolution has engendered a paradigm shift in how individuals perceive and engage with the world around them. The ubiquitous nature of these platforms has facilitated unprecedented connectivity, enabling instantaneous communication across geographical boundaries while simultaneously raising pertinent questions regarding privacy, mental health, and the authenticity of human relationships in an increasingly digitized world.`,
};
