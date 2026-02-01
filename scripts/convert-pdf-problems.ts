/**
 * Convert PDF-extracted problems to Knowledge Base Format
 *
 * This script reads the problems extracted from the College Physics PDF
 * and uses Claude to convert them into structured Problem objects.
 *
 * Usage:
 *   npx tsx scripts/convert-pdf-problems.ts --chapter fluids
 *   npx tsx scripts/convert-pdf-problems.ts --chapter kinematics
 */

import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';
import { fileURLToPath } from 'url';
import Anthropic from '@anthropic-ai/sdk';

// ES Module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const EXTRACTED_DIR = path.join(__dirname, '..', 'src', 'lib', 'knowledge', 'extracted');

interface ChapterConfig {
  name: string;
  inputFile: string;
  outputFile: string;
  concepts: string[];
  bookChapter: number;
}

const CHAPTERS: Record<string, ChapterConfig> = {
  fluids: {
    name: 'Fluid Statics',
    inputFile: 'pdf-fluids-problems.txt',
    outputFile: 'pdf-fluids-converted.json',
    concepts: ['density', 'pressure', 'pressure-depth', 'pascals-principle', 'buoyancy', 'continuity', 'bernoullis-equation'],
    bookChapter: 11,
  },
  kinematics: {
    name: 'Kinematics',
    inputFile: 'pdf-kinematics-problems.txt',
    outputFile: 'pdf-kinematics-converted.json',
    concepts: ['velocity', 'displacement', 'acceleration', 'free-fall', 'position', 'projectile-motion'],
    bookChapter: 2,
  },
};

const SYSTEM_PROMPT = `You are an expert physics teacher converting textbook problems into structured JSON format for an AI tutoring system.

For each problem, generate a complete JSON object with:
- id: "pdf-ch{chapter}-p{number}"
- source: "curated"
- sourceReference: "College Physics for AP Courses 2e, Chapter {chapter}, Problem {number}"
- concepts: array of relevant concept IDs
- difficulty: 1-5 (1=basic, 3=typical, 5=challenging)
- type: "calculation" | "conceptual" | "multi-step"
- estimatedMinutes: number
- title: short descriptive title
- statement: clean problem statement (fix any OCR errors like "v olume" -> "volume")
- givenValues: array of {symbol, value, unit, description}
- unknowns: array of {symbol, description, unit}
- solution: {approach, steps[], finalAnswer}
- hints: array of {level: 1-3, hint}
- tags: array of relevant tags

Use LaTeX for equations (\\frac{}{}, \\sqrt{}, etc.).
Fix OCR errors in the text (spaces in words, missing characters).
Be thorough with solutions - show all steps clearly.`;

async function convertProblems(chapter: ChapterConfig, problemsText: string): Promise<any[]> {
  // Split into batches of ~5 problems each for better processing
  const problemPattern = /(\d{1,2})\.\s*(?=[A-Z(])/g;
  const matches = [...problemsText.matchAll(problemPattern)];

  console.log(`Found ${matches.length} problem markers`);

  const allProblems: any[] = [];
  const batchSize = 8;

  for (let i = 0; i < matches.length; i += batchSize) {
    const batchStart = matches[i].index!;
    const batchEnd = i + batchSize < matches.length
      ? matches[i + batchSize].index!
      : problemsText.length;

    const batchText = problemsText.substring(batchStart, batchEnd);
    const problemNumbers = matches.slice(i, Math.min(i + batchSize, matches.length)).map(m => m[1]);

    console.log(`\nProcessing problems ${problemNumbers.join(', ')}...`);

    const userPrompt = `Convert these physics problems from College Physics for AP Courses 2e, Chapter ${chapter.bookChapter} (${chapter.name}).

Available concepts: ${chapter.concepts.join(', ')}

Problems text (fix any OCR errors):
---
${batchText}
---

Output a JSON array of problem objects. Only output valid JSON, no markdown.`;

    try {
      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 16000,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: userPrompt }],
      });

      const textContent = response.content.find(block => block.type === 'text');
      if (!textContent || textContent.type !== 'text') continue;

      let jsonText = textContent.text.trim();
      if (jsonText.startsWith('```')) {
        jsonText = jsonText.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
      }

      // Try to parse, with fallback to extracting individual objects
      try {
        const problems = JSON.parse(jsonText);
        if (Array.isArray(problems)) {
          allProblems.push(...problems);
          console.log(`  ✅ Parsed ${problems.length} problems`);
        }
      } catch {
        // Try to extract individual problem objects
        const objects = extractProblemObjects(jsonText);
        if (objects.length > 0) {
          allProblems.push(...objects);
          console.log(`  ✅ Extracted ${objects.length} problems`);
        } else {
          console.log(`  ⚠️  Could not parse batch`);
        }
      }
    } catch (err) {
      console.log(`  ❌ API error: ${err}`);
    }

    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  return allProblems;
}

function extractProblemObjects(jsonText: string): any[] {
  const objects: any[] = [];
  let depth = 0;
  let start = -1;

  for (let i = 0; i < jsonText.length; i++) {
    if (jsonText[i] === '{') {
      if (depth === 0) start = i;
      depth++;
    } else if (jsonText[i] === '}') {
      depth--;
      if (depth === 0 && start !== -1) {
        try {
          const obj = JSON.parse(jsonText.substring(start, i + 1));
          if (obj.id && obj.statement) {
            objects.push(obj);
          }
        } catch {}
        start = -1;
      }
    }
  }

  return objects;
}

async function main() {
  const args = process.argv.slice(2);
  const chapterIndex = args.indexOf('--chapter');

  if (chapterIndex === -1 || !args[chapterIndex + 1]) {
    console.log('Usage: npx tsx scripts/convert-pdf-problems.ts --chapter <fluids|kinematics>');
    return;
  }

  const chapterKey = args[chapterIndex + 1];
  const chapter = CHAPTERS[chapterKey];

  if (!chapter) {
    console.log(`Unknown chapter: ${chapterKey}`);
    console.log('Available: ' + Object.keys(CHAPTERS).join(', '));
    return;
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log(`Converting: ${chapter.name} (Chapter ${chapter.bookChapter})`);
  console.log(`${'='.repeat(60)}`);

  // Read input file
  const inputPath = path.join(EXTRACTED_DIR, chapter.inputFile);
  if (!fs.existsSync(inputPath)) {
    console.log(`Input file not found: ${inputPath}`);
    console.log('Run extract-pdf-problems.py first');
    return;
  }

  const problemsText = fs.readFileSync(inputPath, 'utf-8');
  console.log(`Read ${problemsText.length} characters from ${chapter.inputFile}`);

  // Convert
  const problems = await convertProblems(chapter, problemsText);

  // Save output
  const outputPath = path.join(EXTRACTED_DIR, chapter.outputFile);
  fs.writeFileSync(outputPath, JSON.stringify(problems, null, 2));
  console.log(`\n💾 Saved ${problems.length} problems to ${outputPath}`);

  // Summary
  console.log(`\n📊 Summary:`);
  console.log(`   Total problems: ${problems.length}`);
  const byDifficulty = problems.reduce((acc, p) => {
    acc[p.difficulty] = (acc[p.difficulty] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);
  console.log(`   By difficulty: ${JSON.stringify(byDifficulty)}`);
}

main().catch(console.error);
