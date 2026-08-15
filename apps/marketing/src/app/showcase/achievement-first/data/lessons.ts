import { Grade } from '../store';

export type SegmentType = 'narration' | 'video' | 'comprehension' | 'practice' | 'summary';

export interface NarrationSegment {
  type: 'narration';
  title: string;
  text: string;
}

export interface VideoSegment {
  type: 'video';
  title: string;
  youtubeId: string;
  caption: string;
}

export interface ComprehensionSegment {
  type: 'comprehension';
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface PracticeSegment {
  type: 'practice';
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface SummarySegment {
  type: 'summary';
  title: string;
  keyPoints: string[];
}

export type LessonSegment =
  | NarrationSegment
  | VideoSegment
  | ComprehensionSegment
  | PracticeSegment
  | SummarySegment;

export interface Lesson {
  id: string;
  grade: Grade;
  subject: 'Math' | 'Science';
  title: string;
  description: string;
  icon: string;
  defaultAssigned: boolean;
  segments: LessonSegment[];
}

export const LESSONS: Lesson[] = [
  // ═══════════════════════════════════════════════════════════════
  // GRADE 3 — DEFAULT LESSONS
  // ═══════════════════════════════════════════════════════════════

  // ─── Grade 3 Math: Adding Fractions with Like Denominators ────
  {
    id: 'af-g3-fractions',
    grade: 3,
    subject: 'Math',
    title: 'Adding Fractions with Like Denominators',
    description: 'Learn how to add fractions that have the same bottom number using models and number lines.',
    icon: '🔢',
    defaultAssigned: true,
    segments: [
      {
        type: 'narration',
        title: 'Welcome to Fractions!',
        text: "Hi there! Today we're going to learn something really exciting — how to add fractions that have the same bottom number! You already know that a fraction is a part of a whole. When we cut a pizza into 4 equal slices, each slice is 1/4 of the pizza. What happens when you eat 1 slice and your friend eats 2 slices? Let's find out!",
      },
      {
        type: 'video',
        title: 'Adding Fractions with Like Denominators',
        youtubeId: '5juto2ze8Lg',
        caption: 'Learn the basics of adding fractions when the denominators are the same.',
      },
      {
        type: 'comprehension',
        question: 'When two fractions have the same denominator (bottom number), what do we call them?',
        options: [
          'Equivalent fractions',
          'Like fractions (fractions with like denominators)',
          'Mixed numbers',
          'Improper fractions',
        ],
        correctIndex: 1,
        explanation: 'Fractions with the same denominator are called "like fractions" or fractions with like denominators. The bottom number tells us the size of each piece!',
      },
      {
        type: 'comprehension',
        question: 'When adding fractions with like denominators, what do you do with the denominators?',
        options: [
          'Add them together',
          'Multiply them',
          'Keep the same denominator',
          'Subtract them',
        ],
        correctIndex: 2,
        explanation: 'When adding fractions with the same denominator, you keep the denominator the same! You only add the numerators (top numbers). The denominator tells you the size of the pieces — and that doesn\'t change!',
      },
      {
        type: 'narration',
        title: 'Using Models to Add Fractions',
        text: "Let's use a model to understand this better! Imagine a chocolate bar split into 4 equal pieces. You eat 1 piece — that's 1/4. Your friend eats 2 pieces — that's 2/4. Together, you ate 1/4 + 2/4. Since the pieces are all the same size (fourths), we just count how many pieces: 1 + 2 = 3 pieces. So 1/4 + 2/4 = 3/4. You ate 3 out of 4 pieces! The bottom number stays the same because the size of each piece didn't change.",
      },
      {
        type: 'video',
        title: 'Fraction Models and Number Lines',
        youtubeId: 'DnFrOetuUKg',
        caption: 'See how fraction models and number lines help us visualize adding fractions.',
      },
      {
        type: 'comprehension',
        question: 'What is 1/4 + 2/4?',
        options: ['3/8', '3/4', '2/4', '1/4'],
        correctIndex: 1,
        explanation: 'Add the numerators: 1 + 2 = 3. Keep the denominator: 4. So 1/4 + 2/4 = 3/4!',
      },
      {
        type: 'practice',
        question: 'What is 2/6 + 3/6?',
        options: ['5/12', '5/6', '6/6', '1/6'],
        correctIndex: 1,
        explanation: 'Add the numerators: 2 + 3 = 5. Keep the denominator: 6. So 2/6 + 3/6 = 5/6!',
      },
      {
        type: 'practice',
        question: 'What is 3/8 + 2/8?',
        options: ['5/16', '5/8', '1/8', '6/8'],
        correctIndex: 1,
        explanation: 'Add the numerators: 3 + 2 = 5. Keep the denominator: 8. So 3/8 + 2/8 = 5/8!',
      },
      {
        type: 'practice',
        question: 'Maria ate 2/5 of a pie. Her brother ate 1/5 of the same pie. How much pie did they eat together?',
        options: ['3/10', '3/5', '2/5', '1/5'],
        correctIndex: 1,
        explanation: '2/5 + 1/5 = 3/5 of the pie! We add the numerators (2 + 1 = 3) and keep the denominator (5).',
      },
      {
        type: 'practice',
        question: 'What is 4/10 + 3/10?',
        options: ['7/20', '7/10', '1/10', '12/10'],
        correctIndex: 1,
        explanation: 'Add the numerators: 4 + 3 = 7. Keep the denominator: 10. So 4/10 + 3/10 = 7/10!',
      },
      {
        type: 'summary',
        title: 'Adding Fractions Complete!',
        keyPoints: [
          'Like denominators means the bottom numbers are the same',
          'To add fractions with like denominators: add the numerators, keep the denominator',
          'The denominator tells you the size of each piece — it stays the same!',
          'Use fraction models (bars, circles) and number lines to visualize',
          'Example: 1/4 + 2/4 = 3/4 (1 piece + 2 pieces = 3 pieces, all fourths)',
        ],
      },
    ],
  },

  // ─── Grade 3 Science: Life Cycles of Plants ─────────────────
  {
    id: 'af-g3-plants',
    grade: 3,
    subject: 'Science',
    title: 'Life Cycles of Plants',
    description: 'Explore how plants grow from tiny seeds into full-grown plants that make new seeds.',
    icon: '🌱',
    defaultAssigned: true,
    segments: [
      {
        type: 'narration',
        title: 'The Amazing Life of a Plant',
        text: "Have you ever planted a seed and watched it grow? Plants have an amazing life cycle — they start as tiny seeds, sprout into seedlings, grow into mature plants, and then produce new seeds to start the cycle all over again! Let's explore each stage together.",
      },
      {
        type: 'video',
        title: 'What Is Seed Germination?',
        youtubeId: 'JSe_VUMymjo',
        caption: 'Dr. Binocs explains how seeds germinate and start growing into plants.',
      },
      {
        type: 'comprehension',
        question: 'What is the first stage in a plant life cycle?',
        options: ['Flowering', 'Seed', 'Seedling', 'Mature plant'],
        correctIndex: 1,
        explanation: 'Every plant life cycle begins with a seed! The seed contains everything the baby plant needs to start growing.',
      },
      {
        type: 'comprehension',
        question: 'What does a seed need to germinate (start growing)?',
        options: [
          'Only sunlight',
          'Only soil',
          'Water, warmth, and air',
          'Fertilizer and darkness',
        ],
        correctIndex: 2,
        explanation: 'Seeds need water, warmth, and air to germinate. Once they have these, the seed coat breaks open and a tiny root pushes out!',
      },
      {
        type: 'narration',
        title: 'Parts of a Plant',
        text: "Now that we know how seeds sprout, let's learn about the different parts of a plant! Every plant has roots that absorb water from the soil, a stem that carries water and nutrients up to the leaves, and leaves that use sunlight to make food through photosynthesis. Some plants also develop flowers, which help the plant reproduce.",
      },
      {
        type: 'video',
        title: 'Parts of a Plant',
        youtubeId: 'p3St51F4kE8',
        caption: 'Learn about the different parts of a plant and what each part does.',
      },
      {
        type: 'comprehension',
        question: 'What is the job of roots?',
        options: [
          'To make food from sunlight',
          'To absorb water and nutrients from the soil',
          'To attract insects',
          'To hold the flower up',
        ],
        correctIndex: 1,
        explanation: 'Roots anchor the plant in the soil and absorb water and minerals that the plant needs to grow!',
      },
      {
        type: 'narration',
        title: 'Growing Sunflowers',
        text: "Let's look at sunflowers as an example! A sunflower seed is planted in soil. With water and warmth, it sprouts in about 7-10 days. The seedling grows taller and taller, developing leaves that catch sunlight. After about 8-10 weeks, a beautiful flower head forms. This flower head can contain up to 2,000 seeds! Those seeds fall to the ground or are carried by animals and wind, and the cycle starts again.",
      },
      {
        type: 'practice',
        question: 'Put these stages in the correct order: Which comes SECOND?',
        options: ['Flower', 'Seed', 'Seedling', 'Mature plant'],
        correctIndex: 2,
        explanation: 'The correct order is: Seed → Seedling → Mature plant → Flower → New seeds. The seedling stage comes second!',
      },
      {
        type: 'narration',
        title: 'Pollination: How Plants Make Seeds',
        text: "But wait — how do flowers become seeds? Through a process called pollination! Bees, butterflies, and other insects visit flowers to drink nectar. While they're there, tiny grains of pollen stick to their bodies. When they fly to another flower, the pollen rubs off. This is pollination! Once a flower is pollinated, it starts making seeds inside a fruit.",
      },
      {
        type: 'video',
        title: 'What Is Pollination?',
        youtubeId: 'W-daJxfe4As',
        caption: 'Dr. Binocs explains how bees and other pollinators help flowers make seeds!',
      },
      {
        type: 'comprehension',
        question: 'What is pollination?',
        options: [
          'When a plant absorbs water',
          'When pollen is transferred from one flower to another',
          'When a seed germinates',
          'When leaves change color',
        ],
        correctIndex: 1,
        explanation: 'Pollination happens when pollen moves from one flower to another, usually carried by bees or wind. This is how plants make seeds!',
      },
      {
        type: 'practice',
        question: 'Why do plants produce flowers?',
        options: [
          'To look pretty for humans',
          'To produce seeds for new plants',
          'To get more sunlight',
          'To absorb water',
        ],
        correctIndex: 1,
        explanation: 'Flowers help plants reproduce by producing seeds that will grow into new plants. This continues the life cycle!',
      },
      {
        type: 'practice',
        question: 'How do many seeds travel to new places?',
        options: [
          'They walk on tiny legs',
          'They are carried by wind, water, or animals',
          'They roll downhill only',
          'They stay exactly where they fall',
        ],
        correctIndex: 1,
        explanation: 'Seeds travel in amazing ways! Dandelion seeds float on the wind, coconuts float on water, and burr seeds hitch rides on animal fur!',
      },
      {
        type: 'practice',
        question: 'Which part of the plant uses sunlight to make food?',
        options: ['Roots', 'Stem', 'Leaves', 'Seeds'],
        correctIndex: 2,
        explanation: 'Leaves contain chlorophyll, which captures sunlight and uses it to make food for the plant through photosynthesis!',
      },
      {
        type: 'summary',
        title: 'Plant Life Cycles Complete!',
        keyPoints: [
          'Plant life cycle: Seed → Seedling → Mature plant → Flower → New seeds',
          'Seeds need water, warmth, and air to germinate',
          'Plants have roots, stems, leaves, and flowers — each with a special job',
          'Pollination (by bees, wind, etc.) helps flowers make new seeds',
          'Seeds spread by wind, water, and animals to start the cycle again',
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // GRADE 3 — ASSIGNABLE LESSONS
  // ═══════════════════════════════════════════════════════════════

  // ─── Grade 3 Math: Properties of Multiplication ────────────────
  {
    id: 'af-g3-multiplication',
    grade: 3,
    subject: 'Math',
    title: 'Properties of Multiplication',
    description: 'Discover what multiplication means and learn strategies for mastering times tables.',
    icon: '✖️',
    defaultAssigned: false,
    segments: [
      {
        type: 'narration',
        title: 'What Is Multiplication?',
        text: "Hey there! Have you ever had to add the same number over and over? Like 3 + 3 + 3 + 3? That gets tiring, right? Well, multiplication is a shortcut for repeated addition! Instead of adding 3 four times, we can say 4 \u00d7 3 = 12. The \"\u00d7\" symbol means \"groups of.\" So 4 \u00d7 3 means \"4 groups of 3.\" Let's learn more!",
      },
      {
        type: 'video',
        title: 'Introduction to Multiplication',
        youtubeId: 'mvOkMYCygps',
        caption: 'Math Antics introduces multiplication as a faster way to add equal groups.',
      },
      {
        type: 'comprehension',
        question: 'What does 5 \u00d7 3 mean?',
        options: [
          '5 plus 3',
          '5 groups of 3',
          '5 minus 3',
          '5 divided by 3',
        ],
        correctIndex: 1,
        explanation: '5 \u00d7 3 means 5 groups of 3: 3 + 3 + 3 + 3 + 3 = 15. Multiplication is repeated addition!',
      },
      {
        type: 'comprehension',
        question: 'Which addition problem is the same as 4 \u00d7 6?',
        options: [
          '4 + 6',
          '6 + 6 + 6 + 6',
          '4 + 4 + 4',
          '6 + 4 + 6 + 4',
        ],
        correctIndex: 1,
        explanation: '4 \u00d7 6 means 4 groups of 6: 6 + 6 + 6 + 6 = 24!',
      },
      {
        type: 'narration',
        title: 'Arrays: Seeing Multiplication',
        text: "One of the best ways to understand multiplication is with arrays! An array is an arrangement of objects in equal rows and columns. If you have 3 rows of 4 apples, that's an array! You can write it as 3 \u00d7 4 = 12. Arrays help us see that 3 \u00d7 4 and 4 \u00d7 3 give the same answer \u2014 this is called the commutative property!",
      },
      {
        type: 'narration',
        title: 'Visualizing Arrays',
        text: "Let's try making arrays! Picture 3 rows of 4 cookies on a baking sheet. That's a 3 \u00d7 4 array with 12 cookies total. Now picture 4 rows of 3 cookies \u2014 that's a 4 \u00d7 3 array, and guess what? It's still 12 cookies! This shows us that 3 \u00d7 4 = 4 \u00d7 3. Arrays make multiplication easy to see and understand.",
      },
      {
        type: 'comprehension',
        question: 'If you arrange 5 rows of 2 stars, how many stars are there in total?',
        options: ['7', '10', '12', '8'],
        correctIndex: 1,
        explanation: '5 rows of 2 = 5 \u00d7 2 = 10 stars! You can also count: 2 + 2 + 2 + 2 + 2 = 10.',
      },
      {
        type: 'practice',
        question: 'What is 3 \u00d7 7?',
        options: ['10', '18', '21', '24'],
        correctIndex: 2,
        explanation: '3 \u00d7 7 = 7 + 7 + 7 = 21. You can also think: 3 \u00d7 7 means 3 groups of 7.',
      },
      {
        type: 'narration',
        title: 'Times Table Tricks',
        text: "Ready for some cool tricks? For the 2s table, just double the number! For the 5s table, the answers always end in 0 or 5. For the 9s table, here's a magic trick: the digits of the answer always add up to 9! Like 9 \u00d7 3 = 27, and 2 + 7 = 9. Also, your fingers can help \u2014 hold up 10 fingers, fold down the 3rd finger, and you see 2 fingers on the left and 7 on the right: 27!",
      },
      {
        type: 'video',
        title: 'Times Table Tricks',
        youtubeId: 'xO_1bYgoQvA',
        caption: 'Discover fun tricks and patterns that make memorizing times tables easier.',
      },
      {
        type: 'practice',
        question: 'What is 9 \u00d7 4?',
        options: ['32', '34', '36', '38'],
        correctIndex: 2,
        explanation: '9 \u00d7 4 = 36. Check: 3 + 6 = 9. The 9s trick works!',
      },
      {
        type: 'practice',
        question: 'There are 6 bags with 5 marbles in each bag. How many marbles are there in total?',
        options: ['11', '25', '30', '35'],
        correctIndex: 2,
        explanation: '6 bags \u00d7 5 marbles = 6 \u00d7 5 = 30 marbles. The 5s always end in 0 or 5!',
      },
      {
        type: 'comprehension',
        question: 'The commutative property says that 3 \u00d7 4 = 4 \u00d7 3. What does this mean?',
        options: [
          'You can only multiply in one direction',
          'The order of the numbers does not change the answer',
          'Multiplication is the same as division',
          'You must always start with the smaller number',
        ],
        correctIndex: 1,
        explanation: 'The commutative property means you can swap the numbers and still get the same product: 3 \u00d7 4 = 12 and 4 \u00d7 3 = 12!',
      },
      {
        type: 'practice',
        question: 'What is 8 \u00d7 7?',
        options: ['54', '56', '48', '63'],
        correctIndex: 1,
        explanation: '8 \u00d7 7 = 56. One way to remember: 5, 6, 7, 8 \u2014 "56 = 7 \u00d7 8"!',
      },
      {
        type: 'practice',
        question: 'A classroom has 4 rows of desks with 8 desks in each row. How many desks are there?',
        options: ['12', '24', '32', '36'],
        correctIndex: 2,
        explanation: '4 rows \u00d7 8 desks = 4 \u00d7 8 = 32 desks!',
      },
      {
        type: 'summary',
        title: 'Properties of Multiplication Complete!',
        keyPoints: [
          'Multiplication is repeated addition: 4 \u00d7 3 means 3 + 3 + 3 + 3',
          'Arrays help us see multiplication as rows and columns',
          'The commutative property: a \u00d7 b = b \u00d7 a (order doesn\'t matter)',
          'Times table tricks: 2s (double), 5s (end in 0/5), 9s (digits add to 9)',
          'Multiplication solves "equal groups" word problems',
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // GRADE 6 — DEFAULT LESSONS
  // ═══════════════════════════════════════════════════════════════

  // ─── Grade 6 Math: Ratios and Proportional Relationships ────
  {
    id: 'af-g6-ratios',
    grade: 6,
    subject: 'Math',
    title: 'Ratios & Proportional Relationships',
    description: 'Understand ratios, write them in different forms, and solve proportion problems.',
    icon: '📐',
    defaultAssigned: true,
    segments: [
      {
        type: 'narration',
        title: 'What is a Ratio?',
        text: "Welcome! Today we're diving into the world of ratios. A ratio is a way to compare two quantities. For example, if there are 3 cats and 5 dogs at a pet store, the ratio of cats to dogs is 3 to 5. We write this as 3:5 or as a fraction 3/5. Ratios are everywhere \u2014 in recipes, maps, sports stats, and more!",
      },
      {
        type: 'video',
        title: 'Ratios and Rates',
        youtubeId: 'RQ2nYUBVvqI',
        caption: 'Math Antics explains what ratios and rates are and how to use them.',
      },
      {
        type: 'comprehension',
        question: 'In a classroom, there are 12 boys and 18 girls. What is the ratio of boys to girls in simplest form?',
        options: ['12:18', '2:3', '3:2', '6:9'],
        correctIndex: 1,
        explanation: 'Divide both numbers by their GCF (6): 12\u00f76 = 2 and 18\u00f76 = 3. The simplest form is 2:3.',
      },
      {
        type: 'comprehension',
        question: 'A recipe calls for 2 cups of flour for every 3 cups of sugar. If you use 6 cups of flour, how much sugar do you need?',
        options: ['6 cups', '7 cups', '8 cups', '9 cups'],
        correctIndex: 3,
        explanation: '2:3 = 6:? \u2014 Since 2 \u00d7 3 = 6, we also multiply 3 \u00d7 3 = 9 cups of sugar.',
      },
      {
        type: 'narration',
        title: 'Equivalent Ratios',
        text: "Just like equivalent fractions, we can make equivalent ratios by multiplying or dividing both parts by the same number. The ratio 1:2 is the same as 2:4, 3:6, or 10:20. This is super useful when solving real-world problems! When we set two equivalent ratios equal, that's called a proportion. For example: 1/2 = 3/6 is a proportion.",
      },
      {
        type: 'video',
        title: 'Proportions',
        youtubeId: 'USmit5zUGas',
        caption: 'Math Antics teaches proportions \u2014 setting equivalent ratios equal to solve problems.',
      },
      {
        type: 'comprehension',
        question: 'What is a proportion?',
        options: [
          'A way to divide numbers',
          'Two equivalent ratios set equal to each other',
          'A type of fraction',
          'A way to subtract ratios',
        ],
        correctIndex: 1,
        explanation: 'A proportion is an equation that shows two ratios are equivalent. For example, 2/3 = 4/6 is a proportion!',
      },
      {
        type: 'practice',
        question: 'Which ratio is equivalent to 4:6?',
        options: ['2:4', '8:10', '2:3', '6:4'],
        correctIndex: 2,
        explanation: 'Divide both by 2: 4\u00f72 = 2 and 6\u00f72 = 3. So 4:6 = 2:3.',
      },
      {
        type: 'narration',
        title: 'Unit Rates',
        text: "A special type of ratio is called a unit rate. A unit rate tells you the amount per ONE unit. For example, if you drive 120 miles in 2 hours, the unit rate is 120 \u00f7 2 = 60 miles per hour. Unit rates help us compare \u2014 which is a better deal: $6 for 3 apples or $10 for 5 apples? Find the unit rate: $2 per apple vs. $2 per apple. They're the same!",
      },
      {
        type: 'narration',
        title: 'Calculating Unit Rates',
        text: "To find a unit rate, divide both quantities so one of them equals 1. For example: if 3 pizzas cost $24, the unit rate is $24 \u00f7 3 = $8 per pizza. Or if you bike 12 miles in 2 hours, the unit rate is 12 \u00f7 2 = 6 miles per hour. Unit rates make it easy to compare \u2014 is Store A's price of $4.50 for 3 apples better than Store B's $7 for 5 apples? Find the unit rates: $1.50 vs. $1.40 per apple. Store B wins!",
      },
      {
        type: 'practice',
        question: 'If 5 pencils cost $2, how much do 15 pencils cost?',
        options: ['$4', '$5', '$6', '$7'],
        correctIndex: 2,
        explanation: '5 pencils : $2 = 15 pencils : $?  Since 5 \u00d7 3 = 15, we multiply $2 \u00d7 3 = $6.',
      },
      {
        type: 'practice',
        question: 'A map has a scale of 1 cm : 5 km. If two cities are 8 cm apart on the map, what is the real distance?',
        options: ['13 km', '40 km', '30 km', '45 km'],
        correctIndex: 1,
        explanation: '1 cm = 5 km, so 8 cm = 8 \u00d7 5 = 40 km.',
      },
      {
        type: 'comprehension',
        question: 'A car travels 240 miles using 8 gallons of gas. What is the unit rate (miles per gallon)?',
        options: ['20 mpg', '30 mpg', '32 mpg', '35 mpg'],
        correctIndex: 1,
        explanation: 'Divide distance by gallons: 240 \u00f7 8 = 30 miles per gallon.',
      },
      {
        type: 'practice',
        question: 'The ratio of red to blue marbles is 3:7. If there are 21 blue marbles, how many red marbles are there?',
        options: ['7', '9', '12', '14'],
        correctIndex: 1,
        explanation: '3:7 = ?:21 \u2014 Since 7 \u00d7 3 = 21, we multiply 3 \u00d7 3 = 9 red marbles.',
      },
      {
        type: 'practice',
        question: 'Which is the better deal: 4 notebooks for $6 or 6 notebooks for $8?',
        options: [
          '4 for $6 ($1.50 each)',
          '6 for $8 ($1.33 each)',
          'They cost the same per notebook',
          'Cannot be determined',
        ],
        correctIndex: 1,
        explanation: '4 for $6 = $1.50 each. 6 for $8 \u2248 $1.33 each. The second option is cheaper per notebook!',
      },
      {
        type: 'summary',
        title: 'Ratios Complete!',
        keyPoints: [
          'A ratio compares two quantities (written as a:b or a/b)',
          'Simplify ratios by dividing both parts by the GCF',
          'Equivalent ratios are made by multiplying/dividing both parts by the same number',
          'Proportions set two equivalent ratios equal to solve for unknowns',
          'Unit rates tell you the amount per one unit \u2014 useful for comparing deals',
        ],
      },
    ],
  },

  // ─── Grade 6 Science: Cells: Structure & Function ─────────────
  {
    id: 'af-g6-cells',
    grade: 6,
    subject: 'Science',
    title: 'Cells: Structure & Function',
    description: 'Discover what cells are, their parts, and how plant and animal cells differ.',
    icon: '🔬',
    defaultAssigned: true,
    segments: [
      {
        type: 'narration',
        title: 'What Are Cells?',
        text: "Every living thing on Earth \u2014 from the tallest tree to the tiniest ant \u2014 is made of cells. Cells are the basic building blocks of all life! Some organisms, like bacteria, are just one cell. Others, like humans, are made of trillions of cells. Each cell is like a tiny factory, performing specific jobs to keep the organism alive. Let's learn more!",
      },
      {
        type: 'video',
        title: 'Introduction to Cells: The Grand Cell Tour',
        youtubeId: '8IlzKri08kk',
        caption: 'The Amoeba Sisters take you on a grand tour of cells and their organelles.',
      },
      {
        type: 'comprehension',
        question: 'What is the smallest unit of life?',
        options: ['Atom', 'Cell', 'Molecule', 'Organ'],
        correctIndex: 1,
        explanation: 'The cell is the smallest unit of life. While atoms and molecules exist in living things, they are not alive on their own.',
      },
      {
        type: 'comprehension',
        question: 'Which cell part controls what enters and leaves the cell?',
        options: ['Nucleus', 'Cell membrane', 'Cytoplasm', 'Cell wall'],
        correctIndex: 1,
        explanation: "The cell membrane is like a gatekeeper \u2014 it controls what goes in and out of the cell, protecting it and keeping it healthy.",
      },
      {
        type: 'narration',
        title: 'Inside the Cell: Organelles',
        text: "A cell has many tiny parts called organelles, each with a special job. The nucleus is the control center \u2014 it holds the DNA and tells the cell what to do. Mitochondria are the powerhouses \u2014 they convert food into energy. The endoplasmic reticulum and ribosomes work together to make proteins. Think of organelles as workers in a factory, each doing their part!",
      },
      {
        type: 'video',
        title: 'Cell Organelles and Their Functions',
        youtubeId: 'URUJD5NEXC8',
        caption: 'The Amoeba Sisters explain the key organelles and what they do inside cells.',
      },
      {
        type: 'comprehension',
        question: 'What is the "powerhouse" of the cell?',
        options: ['Nucleus', 'Cell membrane', 'Mitochondria', 'Ribosome'],
        correctIndex: 2,
        explanation: 'Mitochondria are called the powerhouse of the cell because they convert food (glucose) into energy (ATP) that the cell can use!',
      },
      {
        type: 'narration',
        title: 'Plant Cells vs. Animal Cells',
        text: "Now here's something cool: plant cells and animal cells are similar but have some key differences! Both have a nucleus (the \"brain\"), cell membrane, and cytoplasm. But plant cells have three extra structures that animal cells don't: a rigid cell wall for support, chloroplasts for photosynthesis (turning sunlight into food!), and a large central vacuole for storing water. That's why plants can stand upright without a skeleton!",
      },
      {
        type: 'video',
        title: 'Plant vs. Animal Cells',
        youtubeId: 'Tfy1mOT-gEQ',
        caption: 'A clear comparison of plant and animal cells \u2014 what they share and how they differ.',
      },
      {
        type: 'comprehension',
        question: 'Which THREE structures are found in plant cells but NOT in animal cells?',
        options: [
          'Nucleus, mitochondria, ribosomes',
          'Cell wall, chloroplasts, large central vacuole',
          'Cell membrane, cytoplasm, DNA',
          'Mitochondria, cell wall, nucleus',
        ],
        correctIndex: 1,
        explanation: 'Plant cells have a cell wall (for rigid support), chloroplasts (for photosynthesis), and a large central vacuole (for water storage) that animal cells lack!',
      },
      {
        type: 'practice',
        question: 'Which structure is found in plant cells but NOT in animal cells?',
        options: ['Nucleus', 'Cell membrane', 'Cell wall', 'Cytoplasm'],
        correctIndex: 2,
        explanation: "Plant cells have a rigid cell wall outside their cell membrane. Animal cells don't have a cell wall \u2014 that's why animal bodies are flexible!",
      },
      {
        type: 'practice',
        question: 'What do chloroplasts do?',
        options: [
          'Store water',
          'Convert sunlight into food (photosynthesis)',
          'Control what enters the cell',
          'Hold the cell together',
        ],
        correctIndex: 1,
        explanation: 'Chloroplasts contain chlorophyll (the green pigment) and convert sunlight into glucose through photosynthesis. This is why plants are green!',
      },
      {
        type: 'practice',
        question: "Which organelle is called the \"brain\" or control center of the cell?",
        options: ['Mitochondria', 'Chloroplast', 'Cell membrane', 'Nucleus'],
        correctIndex: 3,
        explanation: 'The nucleus contains DNA and controls all cell activities \u2014 it tells the cell what to do and when. It\'s the command center!',
      },
      {
        type: 'practice',
        question: 'A single-celled organism like bacteria has ONE cell that does everything. What is an organism with many cells called?',
        options: ['Unicellular', 'Multicellular', 'Photocellular', 'Subcellular'],
        correctIndex: 1,
        explanation: 'Organisms with many cells are called multicellular (multi = many). Humans have about 37 trillion cells!',
      },
      {
        type: 'summary',
        title: 'Cells Complete!',
        keyPoints: [
          'Cells are the basic building blocks of all living things',
          'All cells have a nucleus, cell membrane, and cytoplasm',
          'Mitochondria are the "powerhouse" \u2014 they make energy for the cell',
          'Plant cells have extras: cell wall, chloroplasts, and large vacuole',
          'Chloroplasts enable photosynthesis \u2014 converting sunlight to food',
          'Organisms can be unicellular (one cell) or multicellular (many cells)',
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // GRADE 6 — ASSIGNABLE LESSONS
  // ═══════════════════════════════════════════════════════════════

  // ─── Grade 6 Math: Expressions & Equations ──────────────────
  {
    id: 'af-g6-expressions',
    grade: 6,
    subject: 'Math',
    title: 'Expressions & Equations',
    description: 'Learn to write, evaluate, and solve algebraic expressions and one-step equations.',
    icon: '🔢',
    defaultAssigned: false,
    segments: [
      {
        type: 'narration',
        title: 'What Are Algebraic Expressions?',
        text: "Welcome to the world of algebra! Don't worry \u2014 it's not as scary as it sounds. An algebraic expression uses numbers, variables (letters like x or n), and operations (+, \u2212, \u00d7, \u00f7). For example, \"2x + 5\" means \"take a number, multiply it by 2, then add 5.\" The letter x is a variable \u2014 it stands for a number we don't know yet. Let's explore!",
      },
      {
        type: 'video',
        title: 'What Is Algebra?',
        youtubeId: 'NybHckSEQBI',
        caption: 'Math Antics introduces algebra \u2014 variables, expressions, and what they mean.',
      },
      {
        type: 'comprehension',
        question: 'In the expression 3x + 7, what does the variable "x" represent?',
        options: [
          'The number 3',
          'An unknown number we need to find',
          'The operation "times"',
          'The number 7',
        ],
        correctIndex: 1,
        explanation: 'A variable is a letter that represents an unknown number. In 3x + 7, x stands for a number we might need to figure out!',
      },
      {
        type: 'comprehension',
        question: 'If x = 4, what is the value of 2x + 3?',
        options: ['9', '10', '11', '14'],
        correctIndex: 2,
        explanation: 'Substitute 4 for x: 2(4) + 3 = 8 + 3 = 11!',
      },
      {
        type: 'narration',
        title: 'Writing Expressions from Words',
        text: "In math, we often need to translate words into expressions. \"Five more than a number\" becomes \"n + 5.\" \"Three times a number\" becomes \"3n.\" \"A number decreased by 8\" becomes \"n \u2212 8.\" Look for key words: \"more than\" and \"sum\" mean addition; \"less than\" and \"difference\" mean subtraction; \"times\" and \"product\" mean multiplication; \"divided by\" and \"quotient\" mean division.",
      },
      {
        type: 'video',
        title: 'Order of Operations (PEMDAS)',
        youtubeId: 'dAgfnK528RA',
        caption: 'Math Antics explains the order of operations \u2014 the rules for evaluating expressions.',
      },
      {
        type: 'comprehension',
        question: 'What is the correct order of operations?',
        options: [
          'Add, Subtract, Multiply, Divide',
          'Left to right, always',
          'Parentheses, Exponents, Multiplication/Division, Addition/Subtraction',
          'Multiply first, then everything else',
        ],
        correctIndex: 2,
        explanation: 'PEMDAS: Parentheses first, then Exponents, then Multiplication/Division (left to right), then Addition/Subtraction (left to right)!',
      },
      {
        type: 'practice',
        question: 'What is the value of 3 + 4 \u00d7 2?',
        options: ['14', '11', '10', '9'],
        correctIndex: 1,
        explanation: 'Order of operations: multiply first! 4 \u00d7 2 = 8, then 3 + 8 = 11. (Not 3 + 4 = 7 \u00d7 2 = 14!)',
      },
      {
        type: 'narration',
        title: 'Solving One-Step Equations',
        text: "An equation uses an equals sign (=) to show that two things are equal. For example, x + 5 = 12. To solve it, we need to find what x equals. The trick is to do the OPPOSITE operation to both sides. Since 5 is being added, we subtract 5 from both sides: x + 5 \u2212 5 = 12 \u2212 5, so x = 7! Always check: 7 + 5 = 12. Correct!",
      },
      {
        type: 'video',
        title: 'Solving Basic Equations',
        youtubeId: 'l3XzepN03KQ',
        caption: 'Learn how to solve one-step equations using inverse operations.',
      },
      {
        type: 'practice',
        question: 'Solve: x + 9 = 15',
        options: ['x = 4', 'x = 5', 'x = 6', 'x = 24'],
        correctIndex: 2,
        explanation: 'Subtract 9 from both sides: x = 15 \u2212 9 = 6. Check: 6 + 9 = 15. Correct!',
      },
      {
        type: 'practice',
        question: 'Solve: 3n = 18',
        options: ['n = 3', 'n = 5', 'n = 6', 'n = 15'],
        correctIndex: 2,
        explanation: 'Divide both sides by 3: n = 18 \u00f7 3 = 6. Check: 3 \u00d7 6 = 18. Correct!',
      },
      {
        type: 'comprehension',
        question: 'Which phrase translates to the expression "n \u2212 4"?',
        options: [
          'Four more than a number',
          'A number decreased by four',
          'Four times a number',
          'A number divided by four',
        ],
        correctIndex: 1,
        explanation: '"A number decreased by four" means starting with a number (n) and subtracting 4: n \u2212 4!',
      },
      {
        type: 'practice',
        question: 'Solve: y \u00f7 5 = 8',
        options: ['y = 3', 'y = 13', 'y = 35', 'y = 40'],
        correctIndex: 3,
        explanation: 'Multiply both sides by 5: y = 8 \u00d7 5 = 40. Check: 40 \u00f7 5 = 8. Correct!',
      },
      {
        type: 'practice',
        question: 'Evaluate 2(x + 3) when x = 5.',
        options: ['13', '16', '11', '10'],
        correctIndex: 1,
        explanation: 'Substitute x = 5: 2(5 + 3) = 2(8) = 16!',
      },
      {
        type: 'summary',
        title: 'Expressions & Equations Complete!',
        keyPoints: [
          'A variable is a letter that represents an unknown number',
          'Evaluate expressions by substituting values for variables',
          'PEMDAS: Parentheses, Exponents, Multiplication/Division, Addition/Subtraction',
          'Solve equations by doing the opposite operation to both sides',
          'Always check your answer by substituting it back into the equation',
        ],
      },
    ],
  },
];

export function getLessonsForGrade(grade: Grade): Lesson[] {
  return LESSONS.filter((l) => l.grade === grade);
}

export function getDefaultLessonsForGrade(grade: Grade): Lesson[] {
  return LESSONS.filter((l) => l.grade === grade && l.defaultAssigned);
}

export function getAssignableLessonsForGrade(grade: Grade): Lesson[] {
  return LESSONS.filter((l) => l.grade === grade && !l.defaultAssigned);
}

export function getLessonById(id: string): Lesson | undefined {
  return LESSONS.find((l) => l.id === id);
}
