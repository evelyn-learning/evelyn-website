// ============================================================================
// Assignment Context
// ============================================================================
export interface AssignmentContext {
  gradeLevel: 9 | 10 | 11 | 12;
  subject: 'english' | 'history' | 'science' | 'other';
  assignmentType: 'essay' | 'research-paper' | 'short-answer' | 'other';
}

// ============================================================================
// Analysis Results
// ============================================================================
export interface TextAnnotation {
  startIndex: number;
  endIndex: number;
  type: 'ai-generated' | 'suspicious' | 'plagiarism';
  reason: string;
  confidence: number;
  matchedText: string;
}

export interface SourceMatch {
  url?: string;
  title: string;
  matchPercent: number;
  verified?: boolean;       // true = confirmed by Copyscape web search
  snippetText?: string;     // matched text snippet from the source
  wordsMatched?: number;    // number of words matched
}

export interface Concern {
  type: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
  suggestion: string;
}

export interface EnhancedAnalysisResult {
  aiDetection: {
    score: number;
    verdict: string;
    modelAttribution: string | null;
    indicators: string[];
  };
  plagiarism: {
    score: number;
    verdict: string;
    sourceMatches: SourceMatch[];
    copyscapePercent?: number; // overall % matched by Copyscape
  };
  overallScore: number;
  overallVerdict: string;
  annotations: TextAnnotation[];
  concerns: Concern[];
  recommendations: string[];
}

// ============================================================================
// Batch Processing
// ============================================================================
export interface BatchSubmission {
  id: string;
  fileName: string;
  text: string;
  status: 'pending' | 'analyzing' | 'complete' | 'error';
  result?: EnhancedAnalysisResult;
  error?: string;
}

// ============================================================================
// Resubmission Comparison
// ============================================================================
export interface ComparisonResult {
  originalAnalysis: EnhancedAnalysisResult;
  revisedAnalysis: EnhancedAnalysisResult;
  changes: {
    addedText: string[];
    removedText: string[];
    flaggedSectionsRemoved: number;
    flaggedSectionsRewritten: number;
    rewriteAppearsAIGenerated: boolean;
    summary: string;
  };
}

// ============================================================================
// Report Metadata
// ============================================================================
export interface ReportMetadata {
  studentName: string;
  assignmentName: string;
  teacherNotes: string;
  analysisDate: string;
}

// ============================================================================
// Feature Flags
// ============================================================================
export interface FeatureFlags {
  inlineHighlighting: boolean;
  splitScoring: boolean;
  contextInputs: boolean;
  reportExport: boolean;
  batchMode: boolean;
  resubmissionComparison: boolean;
}

export const DEFAULT_FEATURES: FeatureFlags = {
  inlineHighlighting: true,
  splitScoring: true,
  contextInputs: true,
  reportExport: true,
  batchMode: true,
  resubmissionComparison: true,
};

// ============================================================================
// View State
// ============================================================================
export type ViewMode = 'single' | 'batch' | 'comparison';
