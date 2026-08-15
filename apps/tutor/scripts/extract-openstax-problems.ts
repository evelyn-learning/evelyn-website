/**
 * Extract and Convert OpenStax Problems to Knowledge Base Format
 *
 * This script fetches problems from OpenStax University Physics textbook
 * and uses Claude to convert them into structured Problem objects.
 *
 * OpenStax content is CC-BY 4.0 licensed.
 *
 * Usage:
 *   npx tsx scripts/extract-openstax-problems.ts --chapter fluids
 *   npx tsx scripts/extract-openstax-problems.ts --chapter kinematics
 *   npx tsx scripts/extract-openstax-problems.ts --chapter projectile
 *   npx tsx scripts/extract-openstax-problems.ts --all
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

// ============================================================================
// CONFIGURATION
// ============================================================================

interface ChapterConfig {
  name: string;
  urls: {
    problems: string;
    additional?: string;
    challenge?: string;
  };
  concepts: string[];
  outputFile: string;
  bookChapter: number;
}

const CHAPTERS: Record<string, ChapterConfig> = {
  kinematics: {
    name: 'Motion Along a Straight Line',
    urls: {
      problems: 'https://openstax.org/books/university-physics-volume-1/pages/3-problems',
      additional: 'https://openstax.org/books/university-physics-volume-1/pages/3-additional-problems',
      challenge: 'https://openstax.org/books/university-physics-volume-1/pages/3-challenge-problems',
    },
    concepts: ['velocity', 'displacement', 'acceleration', 'free-fall', 'position'],
    outputFile: 'openstax-kinematics-problems.json',
    bookChapter: 3,
  },
  projectile: {
    name: 'Motion in Two and Three Dimensions',
    urls: {
      problems: 'https://openstax.org/books/university-physics-volume-1/pages/4-problems',
      additional: 'https://openstax.org/books/university-physics-volume-1/pages/4-additional-problems',
      challenge: 'https://openstax.org/books/university-physics-volume-1/pages/4-challenge-problems',
    },
    concepts: ['projectile-motion', 'velocity', 'displacement', 'vectors'],
    outputFile: 'openstax-projectile-problems.json',
    bookChapter: 4,
  },
  fluids: {
    name: 'Fluid Mechanics',
    urls: {
      problems: 'https://openstax.org/books/university-physics-volume-1/pages/14-problems',
      additional: 'https://openstax.org/books/university-physics-volume-1/pages/14-additional-problems',
      challenge: 'https://openstax.org/books/university-physics-volume-1/pages/14-challenge-problems',
    },
    concepts: ['density', 'pressure', 'pressure-depth', 'pascals-principle', 'buoyancy', 'continuity', 'bernoullis-equation'],
    outputFile: 'openstax-fluids-problems.json',
    bookChapter: 14,
  },
  forces: {
    name: 'Newton\'s Laws of Motion',
    urls: {
      problems: 'https://openstax.org/books/university-physics-volume-1/pages/5-problems',
      additional: 'https://openstax.org/books/university-physics-volume-1/pages/5-additional-problems',
      challenge: 'https://openstax.org/books/university-physics-volume-1/pages/5-challenge-problems',
    },
    concepts: ['newtons-laws', 'force', 'mass', 'acceleration', 'friction', 'tension'],
    outputFile: 'openstax-forces-problems.json',
    bookChapter: 5,
  },
  energy: {
    name: 'Work and Kinetic Energy',
    urls: {
      problems: 'https://openstax.org/books/university-physics-volume-1/pages/7-problems',
      additional: 'https://openstax.org/books/university-physics-volume-1/pages/7-additional-problems',
      challenge: 'https://openstax.org/books/university-physics-volume-1/pages/7-challenge-problems',
    },
    concepts: ['work', 'kinetic-energy', 'potential-energy', 'conservation-of-energy', 'power'],
    outputFile: 'openstax-energy-problems.json',
    bookChapter: 7,
  },
};

const OUTPUT_DIR = path.join(__dirname, '..', '..', '..', 'packages', 'core', 'src', 'knowledge', 'extracted');

// ============================================================================
// ANTHROPIC CLIENT
// ============================================================================

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// ============================================================================
// PROBLEM EXTRACTION PROMPT
// ============================================================================

const EXTRACTION_SYSTEM_PROMPT = `You are an expert physics teacher and curriculum developer. Your task is to convert raw physics problems from OpenStax textbooks into a structured JSON format for an AI tutoring system.

For each problem, you must generate:
1. A unique ID based on chapter and problem number
2. Identify which physics concepts the problem tests
3. Rate difficulty (1-5 scale: 1=basic application, 3=typical exam, 5=challenging)
4. Classify the problem type
5. Estimate time to solve in minutes
6. Extract given values with proper units
7. Identify the unknowns to find
8. Create a step-by-step solution
9. Generate progressive hints (3 levels)
10. Identify common errors students make

IMPORTANT:
- Use LaTeX for all equations (\\frac{}{}, \\sqrt{}, etc.)
- Be precise with units
- Solutions should be educational, showing the reasoning
- Hints should progress from gentle nudge to nearly giving it away`;

const EXTRACTION_USER_PROMPT = (chapter: ChapterConfig, problemsText: string) => `
Convert the following physics problems from OpenStax University Physics Volume 1, Chapter ${chapter.bookChapter} (${chapter.name}) into structured JSON format.

Available concepts for this chapter: ${chapter.concepts.join(', ')}

Raw problems text:
---
${problemsText}
---

For EACH problem, output a JSON object in this exact format:
{
  "id": "openstax-ch${chapter.bookChapter}-p{number}",
  "source": "curated",
  "sourceReference": "OpenStax University Physics Vol. 1, Chapter ${chapter.bookChapter}, Problem {number}",
  "concepts": ["concept1", "concept2"],
  "difficulty": 1-5,
  "type": "calculation" | "conceptual" | "multi-step" | "graphical" | "estimation",
  "estimatedMinutes": number,
  "title": "Short descriptive title",
  "statement": "The full problem statement",
  "givenValues": [
    { "symbol": "v_0", "value": 10, "unit": "m/s", "description": "Initial velocity" }
  ],
  "unknowns": [
    { "symbol": "t", "description": "Time", "unit": "s" }
  ],
  "solution": {
    "approach": "Brief description of solution strategy",
    "steps": [
      {
        "stepNumber": 1,
        "description": "What we're doing",
        "explanation": "Why we're doing it (optional)",
        "equation": "LaTeX equation (optional)",
        "substitution": "LaTeX with numbers (optional)",
        "result": "LaTeX result"
      }
    ],
    "finalAnswer": { "value": number, "unit": "string" } OR { "text": "string" }
  },
  "hints": [
    { "level": 1, "hint": "Gentle nudge - what to think about" },
    { "level": 2, "hint": "More specific - what equation or concept" },
    { "level": 3, "hint": "Almost gives it away - specific next step" }
  ],
  "problemSpecificErrors": [
    {
      "error": "Common mistake description",
      "howToDetect": "How to identify this error",
      "feedback": "What to tell the student"
    }
  ],
  "tags": ["tag1", "tag2"]
}

Output ONLY a JSON array of problem objects. No markdown, no explanation, just valid JSON.
Process up to 20 problems. If there are more, indicate which problems you processed.
`;

// ============================================================================
// FETCH OPENSTAX PAGE
// ============================================================================

async function fetchOpenStaxPage(url: string): Promise<string> {
  console.log(`📥 Fetching ${url}...`);

  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (educational content extraction)',
      'Accept': 'text/html',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
  }

  const html = await response.text();
  console.log(`   Received ${(html.length / 1024).toFixed(1)} KB`);

  return html;
}

// ============================================================================
// EXTRACT PROBLEMS TEXT FROM HTML
// ============================================================================

function extractProblemsFromHTML(html: string): string {
  // OpenStax pages have problems in specific HTML structure
  // We'll extract text content and clean it up
  // Note: This processes trusted educational content from openstax.org only

  let text = html;

  // Remove script and style tags (use non-greedy matching with explicit end tags)
  // Apply each removal in a loop until no more matches to handle nested cases
  let prevLength: number;
  do {
    prevLength = text.length;
    text = text
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      .replace(/<nav\b[^<]*(?:(?!<\/nav>)<[^<]*)*<\/nav>/gi, '')
      .replace(/<header\b[^<]*(?:(?!<\/header>)<[^<]*)*<\/header>/gi, '')
      .replace(/<footer\b[^<]*(?:(?!<\/footer>)<[^<]*)*<\/footer>/gi, '');
  } while (text.length !== prevLength);

  // Find the problems section - look for problem markers
  const problemsMatch = text.match(/(?:Problems|Exercises|Problem Set)[\s\S]+/i);
  if (problemsMatch) {
    text = problemsMatch[0];
  }

  // Convert HTML to plain text while preserving structure
  text = text
    // Preserve paragraph breaks
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<\/li>/gi, '\n')
    // Handle problem numbers
    .replace(/<[^>]*class="[^"]*problem[^"]*"[^>]*>/gi, '\n\nPROBLEM: ')
    // Handle MathML/LaTeX - try to preserve
    .replace(/<math\b[^>]*>([\s\S]*?)<\/math>/gi, ' $1 ')
    .replace(/<annotation\b[^>]*>([\s\S]*?)<\/annotation>/gi, ' $1 ')
    // Remove remaining HTML tags
    .replace(/<[^>]+>/g, ' ')
    // Decode HTML entities (decode once, not recursively to avoid double-decode issues)
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    // Clean up whitespace
    .replace(/\s+/g, ' ')
    .replace(/\n\s+/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  return text;
}

// ============================================================================
// MANUALLY INPUT PROBLEMS (Fallback for when scraping doesn't work well)
// ============================================================================

const SAMPLE_PROBLEMS: Record<string, string> = {
  fluids: `
=== PROBLEMS ===

PROBLEM 1: A straightforward calculation of density.
A rock with a mass of 540 g in air is found to have an apparent mass of 342 g when submerged in water. (a) What mass of water is displaced? (b) What is the volume of the rock? (c) What is its average density?

PROBLEM 2: Pressure at depth calculation.
What depth of mercury creates a pressure of 1.00 atm?

PROBLEM 3: Pascal's principle application.
A hydraulic system is used to lift a 2000-kg car. If the slave cylinder (output) has a diameter of 25.0 cm and the master cylinder (input) has a diameter of 2.0 cm, (a) what force must be exerted on the master cylinder to lift the car? (b) What is the mechanical advantage of this system? (c) If the master cylinder is depressed 1.0 cm, how far is the car lifted?

PROBLEM 4: Buoyancy and floating.
A spherical balloon has a radius of 7.35 m and is filled with helium. How large a cargo can it lift, assuming that the skin and structure of the balloon have a mass of 930 kg? The density of helium is 0.179 kg/m³ and the density of air is 1.29 kg/m³.

PROBLEM 5: Continuity equation.
Water is flowing in a fire hose with a velocity of 1.0 m/s and a pressure of 200000 Pa. At the nozzle, the pressure decreases to atmospheric pressure (101300 Pa), there is no change in height. Use the Bernoulli equation to calculate the velocity of the water exiting the nozzle.

PROBLEM 6: Bernoulli's equation.
The left ventricle of the heart pumps blood at a velocity of 60 cm/s into the aorta, which has a radius of 1.1 cm. The aorta branches into several major arteries. If the total cross-sectional area of the arteries is 2.0 cm², what is the average velocity of blood in the arteries?

PROBLEM 7: Torricelli's theorem.
A cylindrical tank 1.0 m in diameter is filled with water to a depth of 2.0 m. A hole 2.0 cm in diameter at the bottom allows water to drain out. (a) At what rate does water flow from the tank initially? (b) At what rate does the water level drop initially?

PROBLEM 8: Pressure measurement.
A U-tube manometer contains oil (density = 850 kg/m³). The left arm is connected to a gas tank and the right arm is open to atmosphere. If the oil in the right arm is 20 cm higher than in the left arm, what is the gauge pressure of the gas in the tank?

=== ADDITIONAL PROBLEMS ===

PROBLEM 16: A 75-kg man floats in freshwater with 3.0% of his volume above water when his lungs are empty, and 5.0% of his volume above water when his lungs are full. Calculate (a) the volume of the man, and (b) the volume of air he inhales.

PROBLEM 17: A fish maintains its depth in water by adjusting the air content of its swim bladder. At a depth of 40.0 m, the density of seawater is 1030 kg/m³. If the fish has a body volume of 2.3 × 10⁻³ m³ (excluding the swim bladder) and body mass of 2.4 kg, (a) what volume of gas must be in the swim bladder for the fish to be neutrally buoyant? (b) What is the gas volume if the fish ascends to 20.0 m depth?

PROBLEM 18: Water towers store water above the level of consumers for times of heavy use, eliminating the need for high-speed pumps. A water tower is 25.0 m above a user's faucet. What is the velocity of water exiting the faucet? (Ignore friction.)

PROBLEM 19: A submarine has a total volume of 2500 m³ and total mass of 2.40 × 10⁶ kg when floating on the surface. (a) How much water must be pumped into ballast tanks to allow the submarine to submerge? (b) At a depth of 200 m, what is the water pressure on the hull?

PROBLEM 20: Blood plasma flows through the human circulatory system. Estimate the pressure drop due to the viscosity of blood as it flows from the heart through the aorta (radius 1.0 cm, length 40 cm) at 40 cm/s. The viscosity of blood is 2.7 × 10⁻³ Pa·s.

=== CHALLENGE PROBLEMS ===

PROBLEM 21: Derive an expression for the time required to drain a cylindrical tank of radius R filled to depth h through a circular hole of radius r at the bottom.

PROBLEM 22: A pipe of varying cross-section carries water. At point 1, the cross-sectional area is A₁ = 8.0 cm² and the pressure is P₁ = 300 kPa. At point 2, which is 5.0 m higher, the area is A₂ = 4.0 cm². If water flows at 6.0 L/s, find the pressure at point 2.

PROBLEM 23: A U-tube of uniform cross-section contains mercury. Water is poured into one arm to a depth of 13.6 cm. Calculate the rise in the mercury level in the other arm and the difference in levels in the two arms.

PROBLEM 24: A spherical tank of radius R is half-filled with liquid of density ρ. Find the total force exerted by the liquid on the curved surface of the tank.

PROBLEM 25: An airplane has a total wing area of 40 m². At cruising speed, the air flows over the upper surface at 250 m/s and over the lower surface at 220 m/s. Calculate the lift force on the airplane. (Air density = 1.2 kg/m³)
`,

  kinematics: `
=== PROBLEMS ===

PROBLEM 1: Average velocity calculation.
A particle moves along the x-axis. Its position varies with time according to the expression x = -4t + 2t², where x is in meters and t is in seconds. (a) Determine the displacement of the particle in the time intervals t = 0 to t = 1 s and t = 1 s to t = 3 s. (b) Calculate the average velocity during each of these intervals.

PROBLEM 2: Instantaneous velocity.
The position of a particle moving along the x-axis is given by x = 3t² - 2t³, where x is in meters and t is in seconds. (a) Find the velocity of the particle at t = 2.0 s. (b) Find the acceleration of the particle at t = 2.0 s.

PROBLEM 3: Constant acceleration.
A car starts from rest and accelerates uniformly at 3.0 m/s² for 5.0 s. (a) What is the car's velocity after 5.0 s? (b) How far does it travel during this time?

PROBLEM 4: Braking distance.
A car traveling at 30 m/s (about 67 mph) brakes to a stop with uniform deceleration over a distance of 90 m. (a) What is the car's acceleration? (b) How long does it take to stop?

PROBLEM 5: Free fall from height.
A ball is dropped from a tower 70.0 m high. (a) How long does it take to reach the ground? (b) What is its velocity just before it hits the ground?

PROBLEM 6: Ball thrown upward.
A ball is thrown vertically upward with a speed of 25 m/s. (a) How high does it rise? (b) How long does it take to reach its highest point? (c) How long is it in the air before returning to its original height?

PROBLEM 7: Kinematics equation selection.
A truck covers 40 m in 8.50 s while smoothly slowing down to a final speed of 2.80 m/s. (a) Find the truck's original speed. (b) Find its acceleration.

PROBLEM 8: Two-part motion.
A car traveling at 25 m/s accelerates at 2.0 m/s² for 6.0 s. It then travels at constant velocity for 10 s. Finally, it decelerates at 4.0 m/s² until it stops. Find (a) the maximum velocity, (b) the total distance traveled, and (c) the total time of travel.

=== ADDITIONAL PROBLEMS ===

PROBLEM 16: A cyclist rides 8.0 km east for 20 minutes, then 6.0 km south for 15 minutes. Calculate (a) the total distance traveled, (b) the magnitude of the displacement, (c) the average speed, and (d) the magnitude of the average velocity.

PROBLEM 17: An object starts from rest at x = 0 and accelerates uniformly at 2.0 m/s² for 3.0 s. It then accelerates at -1.0 m/s² for 4.0 s. Find (a) the velocity at t = 7.0 s, (b) the position at t = 7.0 s, and (c) when the object returns to x = 0.

PROBLEM 18: A ball is thrown vertically upward from a rooftop 30 m above the ground with an initial velocity of 15 m/s. (a) What maximum height above the ground does the ball reach? (b) How long does it take to hit the ground? (c) What is its velocity when it hits the ground?

PROBLEM 19: Two cars start from rest at the same location. Car A accelerates at 4.0 m/s² for 5.0 s, then travels at constant velocity. Car B accelerates at 2.0 m/s² for 10 s, then travels at constant velocity. (a) Which car is ahead after 8.0 s? By how much? (b) When do they have the same velocity?

PROBLEM 20: A particle's position is given by x(t) = 12t - 3t² + t³, where x is in meters and t is in seconds. Find (a) the time(s) when velocity is zero, (b) the acceleration at these times, and (c) the maximum displacement from the origin during the first 4 seconds.

PROBLEM 21: A helicopter is ascending vertically with a speed of 5.5 m/s. At a height of 105 m above the ground, a package is dropped. (a) How long does it take for the package to reach the ground? (b) What is its velocity just before impact?

=== CHALLENGE PROBLEMS ===

PROBLEM 22: A rocket accelerates vertically from rest with an acceleration of 25 m/s² for 30 s. The fuel is then exhausted and the rocket continues as a free-falling body. (a) What is the maximum altitude reached? (b) What is the total time of flight? (c) What is its velocity just before hitting the ground?

PROBLEM 23: Two balls are thrown simultaneously from the same point, one upward with velocity v₀ and one downward with velocity v₀. Find the distance between them after time t and show that this distance increases linearly with time.

PROBLEM 24: A particle moves along the x-axis with acceleration a = -kv², where k is a positive constant and v is the velocity. If the particle starts at x = 0 with velocity v₀, find (a) v as a function of x, and (b) x as a function of t.

PROBLEM 25: An elevator accelerates upward at 2.0 m/s² for 3.0 s, travels at constant speed for 5.0 s, then decelerates at 2.0 m/s² until it stops. Starting from rest, (a) what is the maximum speed? (b) What is the total height traveled? (c) What would a scale read for a 70-kg person during each phase?

PROBLEM 26: A stone is dropped from a balloon ascending at 4.0 m/s at a height of 300 m. Another stone is thrown vertically upward from the ground at the same instant with velocity v₀. If the two stones meet at a height of 200 m, find v₀.
`,
};

// ============================================================================
// CONVERT PROBLEMS USING CLAUDE
// ============================================================================

async function convertProblemsWithClaude(
  chapter: ChapterConfig,
  problemsText: string
): Promise<any[]> {
  console.log(`\n🤖 Using Claude to convert problems...`);
  console.log(`   Input text length: ${problemsText.length} characters`);

  // Split problems into smaller batches to avoid token limits
  const problemChunks = splitProblemsIntoBatches(problemsText, 5);
  console.log(`   Split into ${problemChunks.length} batches`);

  const allProblems: any[] = [];

  for (let i = 0; i < problemChunks.length; i++) {
    console.log(`\n   Processing batch ${i + 1}/${problemChunks.length}...`);

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-5',
      max_tokens: 16000,
      system: EXTRACTION_SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: EXTRACTION_USER_PROMPT(chapter, problemChunks[i]),
        },
      ],
    });

    const textContent = response.content.find(block => block.type === 'text');
    if (!textContent || textContent.type !== 'text') {
      console.log(`   ⚠️  No text content in response for batch ${i + 1}`);
      continue;
    }

    console.log(`   Response tokens: ${response.usage.output_tokens}`);

    // Parse JSON from response
    let jsonText = textContent.text.trim();

    // Remove markdown code blocks if present
    if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    }

    // Try to fix truncated JSON by finding the last complete object
    const problems = parsePartialJSON(jsonText);

    if (problems && problems.length > 0) {
      console.log(`   ✅ Parsed ${problems.length} problems from batch ${i + 1}`);
      allProblems.push(...problems);
    } else {
      console.log(`   ⚠️  Could not parse batch ${i + 1}`);
    }

    // Add a small delay between batches to be nice to the API
    if (i < problemChunks.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  console.log(`\n   📊 Total problems extracted: ${allProblems.length}`);
  return allProblems;
}

function splitProblemsIntoBatches(text: string, problemsPerBatch: number): string[] {
  // Split by various problem markers found in OpenStax content
  // Looking for patterns like "41.", "Problem 41", or numbered items
  const problemPattern = /(?:^|\n)(\d{1,3})\.\s+(?=[A-Z])|PROBLEM\s*(\d+)|Problem\s*(\d+)/gm;

  const matches: { index: number; number: string }[] = [];
  let match;
  while ((match = problemPattern.exec(text)) !== null) {
    const num = match[1] || match[2] || match[3];
    matches.push({ index: match.index, number: num });
  }

  if (matches.length < 3) {
    // If we can't find problem markers, split by character count
    const chunkSize = 8000;
    const chunks: string[] = [];
    for (let i = 0; i < text.length; i += chunkSize) {
      chunks.push(text.substring(i, Math.min(i + chunkSize, text.length)));
    }
    return chunks;
  }

  // Extract individual problems
  const problems: string[] = [];
  for (let i = 0; i < matches.length; i++) {
    const start = matches[i].index;
    const end = i + 1 < matches.length ? matches[i + 1].index : text.length;
    const problemText = text.substring(start, end).trim();
    if (problemText.length > 100) {
      problems.push(`PROBLEM ${matches[i].number}: ${problemText}`);
    }
  }

  // Group into batches
  const batches: string[] = [];
  for (let i = 0; i < problems.length; i += problemsPerBatch) {
    const batch = problems.slice(i, i + problemsPerBatch);
    batches.push(batch.join('\n\n---\n\n'));
  }

  console.log(`   Found ${problems.length} problems, creating ${batches.length} batches`);
  return batches.length > 0 ? batches : [text];
}

function parsePartialJSON(jsonText: string): any[] | null {
  // First try direct parse
  try {
    const result = JSON.parse(jsonText);
    return Array.isArray(result) ? result : [result];
  } catch {
    // Continue to recovery attempts
  }

  // Try to find complete objects within the JSON
  const objects: any[] = [];
  let depth = 0;
  let start = -1;
  let inString = false;
  let escaped = false;

  for (let i = 0; i < jsonText.length; i++) {
    const char = jsonText[i];

    if (escaped) {
      escaped = false;
      continue;
    }

    if (char === '\\') {
      escaped = true;
      continue;
    }

    if (char === '"' && !escaped) {
      inString = !inString;
      continue;
    }

    if (inString) continue;

    if (char === '{') {
      if (depth === 0) start = i;
      depth++;
    } else if (char === '}') {
      depth--;
      if (depth === 0 && start !== -1) {
        const objStr = jsonText.substring(start, i + 1);
        try {
          const obj = JSON.parse(objStr);
          if (obj.id && obj.statement) { // Validate it's a problem
            objects.push(obj);
          }
        } catch {
          // Skip malformed objects
        }
        start = -1;
      }
    }
  }

  return objects.length > 0 ? objects : null;
}

// ============================================================================
// VALIDATE AND CLEAN PROBLEMS
// ============================================================================

interface Problem {
  id: string;
  source: string;
  sourceReference?: string;
  concepts: string[];
  difficulty: number;
  type: string;
  estimatedMinutes: number;
  title?: string;
  statement: string;
  givenValues?: any[];
  unknowns?: any[];
  solution: any;
  hints: any[];
  problemSpecificErrors?: any[];
  tags: string[];
}

function validateAndCleanProblems(problems: any[], chapter: ChapterConfig): Problem[] {
  const validProblems: Problem[] = [];

  for (const p of problems) {
    // Ensure required fields
    if (!p.id || !p.statement || !p.solution) {
      console.log(`   ⚠️  Skipping problem: missing required fields`);
      continue;
    }

    // Clean and validate
    const cleaned: Problem = {
      id: p.id,
      source: 'curated',
      sourceReference: p.sourceReference || `OpenStax University Physics Vol. 1, Chapter ${chapter.bookChapter}`,
      concepts: Array.isArray(p.concepts) ? p.concepts : [chapter.concepts[0]],
      difficulty: Math.min(5, Math.max(1, Number(p.difficulty) || 3)),
      type: p.type || 'calculation',
      estimatedMinutes: Number(p.estimatedMinutes) || 5,
      title: p.title || `Problem ${p.id}`,
      statement: p.statement,
      givenValues: p.givenValues || [],
      unknowns: p.unknowns || [],
      solution: p.solution,
      hints: p.hints || [
        { level: 1, hint: 'Think about what the problem is asking.' },
        { level: 2, hint: 'Identify the relevant equations.' },
        { level: 3, hint: 'Substitute the given values.' },
      ],
      problemSpecificErrors: p.problemSpecificErrors || [],
      tags: p.tags || [],
    };

    validProblems.push(cleaned);
  }

  return validProblems;
}

// ============================================================================
// GENERATE TYPESCRIPT CODE
// ============================================================================

function generateTypeScriptCode(problems: Problem[], chapter: ChapterConfig): string {
  const header = `/**
 * OpenStax University Physics Vol. 1, Chapter ${chapter.bookChapter}: ${chapter.name}
 * Auto-extracted problems - Review before use
 *
 * License: CC-BY 4.0 (OpenStax)
 * Generated: ${new Date().toISOString()}
 */

import type { Problem } from '../../types';

export const openstaxProblems: Problem[] = `;

  const jsonStr = JSON.stringify(problems, null, 2);

  // Convert JSON to TypeScript format
  const tsCode = jsonStr
    .replace(/"([^"]+)":/g, '$1:')  // Remove quotes from keys
    .replace(/: "([^"]+)"/g, ': \'$1\'')  // Use single quotes for string values
    .replace(/\\"/g, '"');  // Unescape internal quotes

  return header + tsCode + ';\n';
}

// ============================================================================
// MAIN EXTRACTION FUNCTION
// ============================================================================

async function fetchAllSections(chapter: ChapterConfig): Promise<string> {
  const sections = [
    { name: 'Problems', url: chapter.urls.problems },
    { name: 'Additional Problems', url: chapter.urls.additional },
    { name: 'Challenge Problems', url: chapter.urls.challenge },
  ];

  let combinedText = '';

  for (const section of sections) {
    if (!section.url) continue;

    try {
      console.log(`\n📥 Fetching ${section.name}...`);
      const html = await fetchOpenStaxPage(section.url);
      const text = extractProblemsFromHTML(html);

      if (text.length > 200) {
        combinedText += `\n\n=== ${section.name.toUpperCase()} ===\n\n${text}`;
        console.log(`   ✅ Extracted ${text.length} characters`);
      } else {
        console.log(`   ⚠️  Section too short, skipping`);
      }
    } catch (err) {
      console.log(`   ⚠️  Could not fetch ${section.name}: ${err}`);
    }

    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  return combinedText;
}

async function extractChapter(chapterKey: string): Promise<void> {
  const chapter = CHAPTERS[chapterKey];
  if (!chapter) {
    console.error(`❌ Unknown chapter: ${chapterKey}`);
    console.log(`   Available chapters: ${Object.keys(CHAPTERS).join(', ')}`);
    return;
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log(`📚 Extracting: ${chapter.name} (Chapter ${chapter.bookChapter})`);
  console.log(`${'='.repeat(60)}`);

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  let problemsText: string;

  // Try to fetch from all OpenStax sections
  problemsText = await fetchAllSections(chapter);

  // If extracted text is too short, use sample problems
  if (problemsText.length < 500) {
    console.log('\n   ⚠️  Extracted text too short, using sample problems');
    problemsText = SAMPLE_PROBLEMS[chapterKey] || '';
  }

  if (!problemsText) {
    console.error(`   ❌ No problems text available for ${chapterKey}`);
    return;
  }

  console.log(`\n📊 Total extracted text: ${problemsText.length} characters`);

  // Convert using Claude
  const rawProblems = await convertProblemsWithClaude(chapter, problemsText);

  // Validate and clean
  const problems = validateAndCleanProblems(rawProblems, chapter);

  // Save JSON output
  const jsonPath = path.join(OUTPUT_DIR, chapter.outputFile);
  fs.writeFileSync(jsonPath, JSON.stringify(problems, null, 2));
  console.log(`\n💾 Saved ${problems.length} problems to ${jsonPath}`);

  // Save TypeScript output
  const tsPath = path.join(OUTPUT_DIR, chapter.outputFile.replace('.json', '.ts'));
  fs.writeFileSync(tsPath, generateTypeScriptCode(problems, chapter));
  console.log(`💾 Saved TypeScript to ${tsPath}`);

  // Summary
  console.log(`\n📊 Summary:`);
  console.log(`   Total problems: ${problems.length}`);
  const byDifficulty = problems.reduce((acc, p) => {
    acc[p.difficulty] = (acc[p.difficulty] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);
  console.log(`   By difficulty: ${JSON.stringify(byDifficulty)}`);
}

// ============================================================================
// CLI INTERFACE
// ============================================================================

async function main() {
  console.log('📖 OpenStax Problem Extraction Tool\n');

  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('❌ ANTHROPIC_API_KEY not found in environment');
    console.log('   Please set it in .env.local');
    process.exit(1);
  }

  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Usage:
  npx ts-node scripts/extract-openstax-problems.ts --chapter <name>
  npx ts-node scripts/extract-openstax-problems.ts --all

Available chapters:
${Object.entries(CHAPTERS).map(([key, ch]) => `  ${key.padEnd(15)} - Chapter ${ch.bookChapter}: ${ch.name}`).join('\n')}

Options:
  --chapter <name>  Extract problems from a specific chapter
  --all             Extract problems from all chapters
  --list            List available chapters
  --help, -h        Show this help message
`);
    return;
  }

  if (args.includes('--list')) {
    console.log('Available chapters:');
    Object.entries(CHAPTERS).forEach(([key, ch]) => {
      console.log(`  ${key.padEnd(15)} - Chapter ${ch.bookChapter}: ${ch.name}`);
    });
    return;
  }

  if (args.includes('--all')) {
    for (const chapterKey of Object.keys(CHAPTERS)) {
      await extractChapter(chapterKey);
    }
    console.log('\n✅ All chapters processed!');
    return;
  }

  const chapterIndex = args.indexOf('--chapter');
  if (chapterIndex !== -1 && args[chapterIndex + 1]) {
    await extractChapter(args[chapterIndex + 1]);
    return;
  }

  // Default: show available chapters and prompt
  console.log('No chapter specified. Available chapters:');
  Object.entries(CHAPTERS).forEach(([key, ch]) => {
    console.log(`  ${key.padEnd(15)} - Chapter ${ch.bookChapter}: ${ch.name}`);
  });
  console.log('\nUsage: npx ts-node scripts/extract-openstax-problems.ts --chapter fluids');
}

main().catch(console.error);
