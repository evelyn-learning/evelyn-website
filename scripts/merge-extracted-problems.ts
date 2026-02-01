/**
 * Merge Extracted OpenStax Problems into Existing Knowledge Base
 *
 * This script takes the extracted problems from extract-openstax-problems.ts
 * and merges them into the existing problem files.
 *
 * Usage:
 *   npx tsx scripts/merge-extracted-problems.ts --chapter fluids
 *   npx tsx scripts/merge-extracted-problems.ts --chapter kinematics
 *   npx tsx scripts/merge-extracted-problems.ts --preview  # Preview without writing
 */

import * as path from 'path';
import * as fs from 'fs';
import { fileURLToPath } from 'url';

// ES Module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================================================
// CONFIGURATION
// ============================================================================

interface ChapterMapping {
  extractedFile: string;
  targetFile: string;
  topicFolder: string;
}

const CHAPTER_MAPPINGS: Record<string, ChapterMapping> = {
  fluids: {
    extractedFile: 'openstax-fluids-problems.json',
    targetFile: 'problems.ts',
    topicFolder: 'physics/fluids',
  },
  kinematics: {
    extractedFile: 'openstax-kinematics-problems.json',
    targetFile: 'problems.ts',
    topicFolder: 'physics/kinematics',
  },
  projectile: {
    extractedFile: 'openstax-projectile-problems.json',
    targetFile: 'problems.ts',
    topicFolder: 'physics/kinematics', // Projectile problems go into kinematics
  },
  forces: {
    extractedFile: 'openstax-forces-problems.json',
    targetFile: 'problems.ts',
    topicFolder: 'physics/forces',
  },
  energy: {
    extractedFile: 'openstax-energy-problems.json',
    targetFile: 'problems.ts',
    topicFolder: 'physics/energy',
  },
  // PDF-extracted versions
  'fluids-pdf': {
    extractedFile: 'pdf-fluids-converted.json',
    targetFile: 'problems.ts',
    topicFolder: 'physics/fluids',
  },
  'kinematics-pdf': {
    extractedFile: 'pdf-kinematics-converted.json',
    targetFile: 'problems.ts',
    topicFolder: 'physics/kinematics',
  },
};

const EXTRACTED_DIR = path.join(__dirname, '..', 'src', 'lib', 'knowledge', 'extracted');
const KNOWLEDGE_DIR = path.join(__dirname, '..', 'src', 'lib', 'knowledge');

// ============================================================================
// LOAD EXTRACTED PROBLEMS
// ============================================================================

function loadExtractedProblems(chapterKey: string): any[] {
  const mapping = CHAPTER_MAPPINGS[chapterKey];
  if (!mapping) {
    throw new Error(`Unknown chapter: ${chapterKey}`);
  }

  const filePath = path.join(EXTRACTED_DIR, mapping.extractedFile);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Extracted file not found: ${filePath}\nRun extract-openstax-problems.ts first.`);
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(content);
}

// ============================================================================
// LOAD EXISTING PROBLEMS
// ============================================================================

function loadExistingProblems(targetPath: string): { problems: any[]; fileContent: string } {
  if (!fs.existsSync(targetPath)) {
    return {
      problems: [],
      fileContent: `/**
 * Practice Problems
 */

import type { Problem } from '../../types';

export const problems: Problem[] = [];
`,
    };
  }

  const content = fs.readFileSync(targetPath, 'utf-8');

  // Extract the problems array from the TypeScript file
  // This is a simple extraction - for complex files, consider using a proper parser
  const match = content.match(/export const problems:\s*Problem\[\]\s*=\s*\[([\s\S]*)\];/);

  if (!match) {
    console.warn('Could not parse existing problems array');
    return { problems: [], fileContent: content };
  }

  // Try to extract individual problem IDs
  const idMatches = content.matchAll(/id:\s*['"]([^'"]+)['"]/g);
  const existingIds = new Set([...idMatches].map(m => m[1]));

  return {
    problems: [], // We don't need to parse the full objects
    fileContent: content,
  };
}

// ============================================================================
// CHECK FOR DUPLICATES
// ============================================================================

function findExistingIds(fileContent: string): Set<string> {
  const idMatches = fileContent.matchAll(/id:\s*['"]([^'"]+)['"]/g);
  return new Set([...idMatches].map(m => m[1]));
}

// ============================================================================
// CONVERT PROBLEM TO TYPESCRIPT STRING
// ============================================================================

function problemToTypeScript(problem: any, indent: string = '  '): string {
  const lines: string[] = [];

  lines.push(`${indent}{`);
  lines.push(`${indent}  id: '${problem.id}',`);
  lines.push(`${indent}  source: 'curated',`);

  if (problem.sourceReference) {
    lines.push(`${indent}  sourceReference: '${problem.sourceReference}',`);
  }

  lines.push(`${indent}  concepts: ${JSON.stringify(problem.concepts)},`);
  lines.push(`${indent}  difficulty: ${problem.difficulty},`);
  lines.push(`${indent}  type: '${problem.type}',`);
  lines.push(`${indent}  estimatedMinutes: ${problem.estimatedMinutes},`);

  if (problem.title) {
    lines.push(`${indent}  title: '${escapeString(problem.title)}',`);
  }

  lines.push(`${indent}  statement: '${escapeString(problem.statement)}',`);

  if (problem.givenValues && problem.givenValues.length > 0) {
    lines.push(`${indent}  givenValues: [`);
    for (const gv of problem.givenValues) {
      lines.push(`${indent}    { symbol: '${gv.symbol}', value: ${gv.value}, unit: '${gv.unit}'${gv.description ? `, description: '${escapeString(gv.description)}'` : ''} },`);
    }
    lines.push(`${indent}  ],`);
  }

  if (problem.unknowns && problem.unknowns.length > 0) {
    lines.push(`${indent}  unknowns: [`);
    for (const u of problem.unknowns) {
      lines.push(`${indent}    { symbol: '${u.symbol}', description: '${escapeString(u.description)}', unit: '${u.unit}' },`);
    }
    lines.push(`${indent}  ],`);
  }

  // Solution
  lines.push(`${indent}  solution: {`);
  lines.push(`${indent}    approach: '${escapeString(problem.solution.approach)}',`);
  lines.push(`${indent}    steps: [`);
  for (const step of problem.solution.steps || []) {
    lines.push(`${indent}      {`);
    lines.push(`${indent}        stepNumber: ${step.stepNumber},`);
    lines.push(`${indent}        description: '${escapeString(step.description)}',`);
    if (step.explanation) {
      lines.push(`${indent}        explanation: '${escapeString(step.explanation)}',`);
    }
    if (step.equation) {
      lines.push(`${indent}        equation: '${escapeString(step.equation)}',`);
    }
    if (step.substitution) {
      lines.push(`${indent}        substitution: '${escapeString(step.substitution)}',`);
    }
    if (step.result) {
      lines.push(`${indent}        result: '${escapeString(step.result)}',`);
    }
    lines.push(`${indent}      },`);
  }
  lines.push(`${indent}    ],`);

  // Final answer
  if (problem.solution.finalAnswer) {
    const fa = problem.solution.finalAnswer;
    if (fa.value !== undefined) {
      lines.push(`${indent}    finalAnswer: { value: ${fa.value}, unit: '${fa.unit}' },`);
    } else if (fa.text) {
      lines.push(`${indent}    finalAnswer: { text: '${escapeString(fa.text)}' },`);
    }
  }

  if (problem.solution.conceptualAnswer) {
    lines.push(`${indent}    conceptualAnswer: '${escapeString(problem.solution.conceptualAnswer)}',`);
  }

  lines.push(`${indent}  },`);

  // Hints
  lines.push(`${indent}  hints: [`);
  for (const hint of problem.hints || []) {
    lines.push(`${indent}    { level: ${hint.level}, hint: '${escapeString(hint.hint)}' },`);
  }
  lines.push(`${indent}  ],`);

  // Problem-specific errors
  if (problem.problemSpecificErrors && problem.problemSpecificErrors.length > 0) {
    lines.push(`${indent}  problemSpecificErrors: [`);
    for (const err of problem.problemSpecificErrors) {
      lines.push(`${indent}    {`);
      lines.push(`${indent}      error: '${escapeString(err.error)}',`);
      lines.push(`${indent}      howToDetect: '${escapeString(err.howToDetect)}',`);
      lines.push(`${indent}      feedback: '${escapeString(err.feedback)}',`);
      lines.push(`${indent}    },`);
    }
    lines.push(`${indent}  ],`);
  }

  // Tags
  lines.push(`${indent}  tags: ${JSON.stringify(problem.tags || [])},`);

  lines.push(`${indent}},`);

  return lines.join('\n');
}

function escapeString(str: string): string {
  if (!str) return '';
  return str
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '');
}

// ============================================================================
// MERGE PROBLEMS INTO FILE
// ============================================================================

function mergeProblemsIntoFile(
  targetPath: string,
  newProblems: any[],
  preview: boolean = false
): { added: number; skipped: number; errors: string[] } {
  const result = { added: 0, skipped: 0, errors: [] as string[] };

  // Load existing content
  const { fileContent } = loadExistingProblems(targetPath);
  const existingIds = findExistingIds(fileContent);

  // Filter out duplicates
  const problemsToAdd = newProblems.filter(p => {
    if (existingIds.has(p.id)) {
      result.skipped++;
      return false;
    }
    return true;
  });

  if (problemsToAdd.length === 0) {
    console.log('No new problems to add (all already exist)');
    return result;
  }

  // Generate TypeScript for new problems
  const newProblemsTS = problemsToAdd.map(p => {
    try {
      return problemToTypeScript(p);
    } catch (err) {
      result.errors.push(`Error converting problem ${p.id}: ${err}`);
      return null;
    }
  }).filter(Boolean);

  result.added = newProblemsTS.length;

  // Find the closing bracket of the problems array
  const insertionPoint = fileContent.lastIndexOf('];');

  if (insertionPoint === -1) {
    result.errors.push('Could not find problems array closing bracket');
    return result;
  }

  // Create comment header for new problems
  const sectionHeader = `
  // ============================================================================
  // OPENSTAX EXTRACTED PROBLEMS (Added ${new Date().toISOString().split('T')[0]})
  // ============================================================================
`;

  // Create new content
  const newContent =
    fileContent.slice(0, insertionPoint) +
    sectionHeader +
    newProblemsTS.join('\n\n') +
    '\n' +
    fileContent.slice(insertionPoint);

  if (preview) {
    console.log('\n📄 PREVIEW - Would write the following:\n');
    console.log('=' .repeat(60));
    // Show just the new problems section
    console.log(sectionHeader);
    console.log(newProblemsTS.slice(0, 2).join('\n\n'));
    if (newProblemsTS.length > 2) {
      console.log(`\n... and ${newProblemsTS.length - 2} more problems`);
    }
    console.log('=' .repeat(60));
  } else {
    fs.writeFileSync(targetPath, newContent);
    console.log(`\n✅ Updated ${targetPath}`);
  }

  return result;
}

// ============================================================================
// MAIN
// ============================================================================

async function main() {
  console.log('🔀 Merge Extracted Problems\n');

  const args = process.argv.slice(2);
  const preview = args.includes('--preview');

  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Usage:
  npx ts-node scripts/merge-extracted-problems.ts --chapter <name>
  npx ts-node scripts/merge-extracted-problems.ts --chapter <name> --preview

Options:
  --chapter <name>  Merge problems from a specific chapter
  --preview         Show what would be changed without writing
  --help, -h        Show this help message

Available chapters:
${Object.keys(CHAPTER_MAPPINGS).map(k => `  ${k}`).join('\n')}
`);
    return;
  }

  const chapterIndex = args.indexOf('--chapter');
  if (chapterIndex === -1 || !args[chapterIndex + 1]) {
    console.error('Please specify a chapter with --chapter <name>');
    console.log('Available chapters:', Object.keys(CHAPTER_MAPPINGS).join(', '));
    return;
  }

  const chapterKey = args[chapterIndex + 1];
  const mapping = CHAPTER_MAPPINGS[chapterKey];

  if (!mapping) {
    console.error(`Unknown chapter: ${chapterKey}`);
    console.log('Available chapters:', Object.keys(CHAPTER_MAPPINGS).join(', '));
    return;
  }

  console.log(`📚 Chapter: ${chapterKey}`);
  console.log(`   Source: ${mapping.extractedFile}`);
  console.log(`   Target: ${mapping.topicFolder}/${mapping.targetFile}`);

  if (preview) {
    console.log('   Mode: PREVIEW (no changes will be written)\n');
  }

  // Load extracted problems
  let problems: any[];
  try {
    problems = loadExtractedProblems(chapterKey);
    console.log(`📥 Loaded ${problems.length} extracted problems`);
  } catch (err) {
    console.error(`❌ ${err}`);
    return;
  }

  // Ensure target directory exists
  const targetDir = path.join(KNOWLEDGE_DIR, mapping.topicFolder);
  if (!fs.existsSync(targetDir)) {
    if (preview) {
      console.log(`⚠️  Target directory does not exist: ${targetDir}`);
      console.log('   Would create directory in non-preview mode');
    } else {
      fs.mkdirSync(targetDir, { recursive: true });
      console.log(`📁 Created directory: ${targetDir}`);
    }
  }

  const targetPath = path.join(targetDir, mapping.targetFile);

  // Merge problems
  const result = mergeProblemsIntoFile(targetPath, problems, preview);

  // Summary
  console.log('\n📊 Summary:');
  console.log(`   Added: ${result.added}`);
  console.log(`   Skipped (duplicates): ${result.skipped}`);

  if (result.errors.length > 0) {
    console.log(`   Errors: ${result.errors.length}`);
    result.errors.forEach(e => console.log(`     - ${e}`));
  }

  if (preview) {
    console.log('\n💡 Run without --preview to apply changes');
  }
}

main().catch(console.error);
