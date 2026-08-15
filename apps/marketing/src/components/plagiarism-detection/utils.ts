import type { EnhancedAnalysisResult, TextAnnotation } from './types';

/**
 * Sort annotations by startIndex and merge overlapping ranges.
 */
export function mergeAnnotations(annotations: TextAnnotation[]): TextAnnotation[] {
  if (annotations.length === 0) return [];

  const sorted = [...annotations].sort((a, b) => a.startIndex - b.startIndex);

  // Split overlapping annotations of different types into non-overlapping segments
  // so each type gets its own visual highlight.
  const segments: TextAnnotation[] = [];

  for (const ann of sorted) {
    if (segments.length === 0) {
      segments.push({ ...ann });
      continue;
    }

    const last = segments[segments.length - 1];

    if (ann.startIndex >= last.endIndex) {
      // No overlap — just add it
      segments.push({ ...ann });
      continue;
    }

    // Overlapping — split into up to 3 pieces:
    // [last.start..ann.start] = last type only
    // [ann.start..min(last.end, ann.end)] = higher priority type
    // [min(last.end, ann.end)..max(last.end, ann.end)] = whichever extends further

    // Priority: plagiarism > ai-generated > suspicious
    // (plagiarism is verified evidence, so it should always show through)
    const priority: Record<string, number> = { plagiarism: 3, 'ai-generated': 2, suspicious: 1 };
    const lastPri = priority[last.type] || 0;
    const annPri = priority[ann.type] || 0;

    if (last.type === ann.type) {
      // Same type — just extend
      last.endIndex = Math.max(last.endIndex, ann.endIndex);
      last.matchedText = '';
    } else {
      const overlapStart = ann.startIndex;
      const overlapEnd = Math.min(last.endIndex, ann.endIndex);
      const winner = annPri >= lastPri ? ann : last;
      const loser = annPri >= lastPri ? last : ann;

      // Trim last to end before the overlap
      if (last.startIndex < overlapStart) {
        last.endIndex = overlapStart;
        last.matchedText = '';
      } else {
        // Last starts at the same place — replace it
        segments.pop();
      }

      // Add overlapping region with winner's type
      segments.push({
        ...winner,
        startIndex: overlapStart,
        endIndex: overlapEnd,
        matchedText: '',
      });

      // If the loser extends beyond the overlap, add the tail
      if (loser.endIndex > overlapEnd) {
        segments.push({
          ...loser,
          startIndex: overlapEnd,
          endIndex: loser.endIndex,
          matchedText: '',
        });
      }

      // If the winner extends beyond the overlap, add its tail
      if (winner.endIndex > overlapEnd) {
        segments.push({
          ...winner,
          startIndex: overlapEnd,
          endIndex: winner.endIndex,
          matchedText: '',
        });
      }
    }
  }

  // Merge adjacent segments of the same type
  const merged: TextAnnotation[] = [segments[0]];
  for (let i = 1; i < segments.length; i++) {
    const current = segments[i];
    const last = merged[merged.length - 1];
    if (current.type === last.type && current.startIndex <= last.endIndex) {
      last.endIndex = Math.max(last.endIndex, current.endIndex);
      last.matchedText = '';
    } else {
      merged.push({ ...current });
    }
  }

  return merged;
}

/**
 * Split text into annotated and plain segments for rendering.
 */
export interface TextSegment {
  text: string;
  annotation?: TextAnnotation;
}

export function splitTextIntoSegments(
  text: string,
  annotations: TextAnnotation[]
): TextSegment[] {
  if (annotations.length === 0) {
    return [{ text }];
  }

  const merged = mergeAnnotations(annotations);
  const segments: TextSegment[] = [];
  let cursor = 0;

  for (const ann of merged) {
    const start = Math.max(0, Math.min(ann.startIndex, text.length));
    const end = Math.max(start, Math.min(ann.endIndex, text.length));

    // Plain text before this annotation
    if (cursor < start) {
      segments.push({ text: text.slice(cursor, start) });
    }

    // Annotated text
    if (start < end) {
      segments.push({
        text: text.slice(start, end),
        annotation: { ...ann, matchedText: text.slice(start, end) },
      });
    }

    cursor = end;
  }

  // Remaining plain text
  if (cursor < text.length) {
    segments.push({ text: text.slice(cursor) });
  }

  return segments;
}

/**
 * Generate a unique ID for batch submissions.
 */
export function generateId(): string {
  return `sub_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Format a date for reports.
 */
export function formatReportDate(date: Date = new Date()): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Compute summary stats from an analysis result.
 */
export function getResultSummary(result: EnhancedAnalysisResult) {
  const totalAnnotations = result.annotations.length;
  const aiAnnotations = result.annotations.filter(a => a.type === 'ai-generated').length;
  const plagiarismAnnotations = result.annotations.filter(a => a.type === 'plagiarism').length;
  const suspiciousAnnotations = result.annotations.filter(a => a.type === 'suspicious').length;

  return {
    totalAnnotations,
    aiAnnotations,
    plagiarismAnnotations,
    suspiciousAnnotations,
    highSeverityConcerns: result.concerns.filter(c => c.severity === 'high').length,
  };
}

/**
 * Extract file extension from filename.
 */
export function getFileExtension(fileName: string): string {
  return fileName.slice(fileName.lastIndexOf('.')).toLowerCase();
}

/**
 * Validate file for upload constraints.
 */
export function validateFile(
  file: File,
  maxSize: number,
  acceptedTypes: string[]
): { valid: boolean; error?: string } {
  const ext = getFileExtension(file.name);
  if (!acceptedTypes.includes(ext)) {
    return { valid: false, error: `Unsupported file type: ${ext}. Accepted: ${acceptedTypes.join(', ')}` };
  }
  if (file.size > maxSize) {
    return { valid: false, error: `File too large: ${(file.size / 1024 / 1024).toFixed(1)}MB. Maximum: ${(maxSize / 1024 / 1024).toFixed(0)}MB` };
  }
  return { valid: true };
}
