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
  objectiveId?: string;
}

export interface PracticeSegment {
  type: 'practice';
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  objectiveId?: string;
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

  // ─── Grade 3 Math: Addition Strategies ──────────────────────
  {
    id: 'g3-math-addition',
    grade: 3,
    subject: 'Math',
    title: 'Addition Strategies',
    description: 'Learn clever strategies for adding numbers, including regrouping and making 10s.',
    icon: '🧮',
    defaultAssigned: true,
    segments: [
      {
        type: 'narration',
        title: 'Welcome to Addition Strategies!',
        text: "Hi there, explorer! Today we're going to learn some really cool tricks for adding numbers together. Have you ever tried to add big numbers in your head and felt stuck? Well, after this lesson, you'll have some awesome strategies to make it easier! Let's start with a strategy called regrouping.",
      },
      {
        type: 'video',
        title: 'Multi-Digit Addition',
        youtubeId: 'mAvuom42NyY',
        caption: 'Math Antics explains how to add multi-digit numbers using regrouping.',
      },
      {
        type: 'comprehension',
        question: 'When we regroup in addition, what do we do with 10 ones?',
        options: [
          'We throw them away',
          'We trade them for 1 ten',
          'We count them again',
          'We split them into two groups of 5',
        ],
        correctIndex: 1,
        explanation: 'When we have 10 or more ones, we trade 10 ones for 1 ten. This is called regrouping!',
      },
      {
        type: 'comprehension',
        question: 'What is 38 + 45?',
        options: ['73', '83', '82', '93'],
        correctIndex: 1,
        explanation: '38 + 45: 8 + 5 = 13, write 3 carry 1. 3 + 4 + 1 = 8. The answer is 83!',
      },
      {
        type: 'narration',
        title: 'Making a 10',
        text: "Great job! Now let's learn another strategy called \"Making a 10.\" The idea is simple: when you're adding two numbers, you can break one number apart to make a 10 with the other. For example, to add 8 + 6, you can take 2 from the 6 and give it to the 8 to make 10. Then 10 + 4 = 14! It's like a math shortcut!",
      },
      {
        type: 'video',
        title: 'Multi-Digit Subtraction',
        youtubeId: 'Y6M89-6106I',
        caption: 'Math Antics shows how subtraction is the opposite of addition — and uses the same regrouping skills.',
      },
      {
        type: 'comprehension',
        question: 'When using "Make a 10" to solve 8 + 5, what do we do first?',
        options: [
          'Add 8 + 5 directly',
          'Take 2 from 5 and add to 8 to make 10',
          'Subtract 5 from 10',
          'Count on our fingers',
        ],
        correctIndex: 1,
        explanation: 'We take 2 from the 5 (leaving 3) and give it to 8 to make 10. Then 10 + 3 = 13!',
      },
      {
        type: 'narration',
        title: 'Try It: Make a 10!',
        text: "Now it's your turn to practice! Remember the steps: look at your two numbers, figure out how much you need to add to one of them to reach 10, then take that amount from the other number. For example: 8 + 5. You need 2 more to get from 8 to 10. Take 2 from the 5 (leaving 3). Now you have 10 + 3 = 13! Easy, right?",
      },
      {
        type: 'practice',
        question: 'Use "Make a 10" to solve: 7 + 5 = ?',
        options: ['11', '12', '13', '10'],
        correctIndex: 1,
        explanation: 'Take 3 from 5 and give it to 7 to make 10. Then 10 + 2 = 12!',
      },
      {
        type: 'practice',
        question: 'What is 9 + 6 using the "Make a 10" strategy?',
        options: ['14', '16', '15', '13'],
        correctIndex: 2,
        explanation: 'Take 1 from 6 and give it to 9 to make 10. Then 10 + 5 = 15!',
      },
      {
        type: 'narration',
        title: 'Word Problems with Addition',
        text: "Now let's use our addition strategies in real-world word problems! When you see a word problem, look for clue words like \"total,\" \"in all,\" \"altogether,\" and \"combined\" — these tell you to add. Always read the problem carefully, figure out what numbers to add, and then pick your favorite strategy!",
      },
      {
        type: 'video',
        title: 'Addition Basics',
        youtubeId: 'AuX7nPBqDts',
        caption: 'Khan Academy reviews the fundamentals of addition with clear visual examples.',
      },
      {
        type: 'practice',
        question: 'What is 27 + 36?',
        options: ['53', '63', '62', '73'],
        correctIndex: 1,
        explanation: '27 + 36: 7 + 6 = 13, write 3 carry 1. 2 + 3 + 1 = 6. The answer is 63!',
      },
      {
        type: 'practice',
        question: 'Sara has 48 stickers. Her friend gives her 35 more. How many stickers does Sara have now?',
        options: ['73', '83', '93', '78'],
        correctIndex: 1,
        explanation: '48 + 35: 8 + 5 = 13, write 3 carry 1. 4 + 3 + 1 = 8. Sara has 83 stickers!',
      },
      {
        type: 'comprehension',
        question: 'Which clue word in a word problem tells you to ADD?',
        options: ['"left over"', '"in all"', '"difference"', '"fewer"'],
        correctIndex: 1,
        explanation: '"In all" tells you to combine amounts — that means addition! Words like "left over" and "fewer" usually mean subtraction.',
      },
      {
        type: 'summary',
        title: 'Addition Strategies Complete!',
        keyPoints: [
          'Regrouping means trading 10 ones for 1 ten',
          '"Make a 10" is a mental math shortcut — break apart a number to make 10',
          'Number lines help visualize addition strategies',
          'Look for clue words like "in all" and "altogether" in word problems',
          'Both strategies help you add larger numbers quickly and accurately',
        ],
      },
    ],
  },

  // ─── Grade 3 Science: Life Cycles of Plants ─────────────────
  {
    id: 'g3-sci-plants',
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

  // ─── Grade 3 Math: Multiplication Basics ────────────────────
  {
    id: 'g3-math-multiplication',
    grade: 3,
    subject: 'Math',
    title: 'Multiplication Basics',
    description: 'Discover what multiplication means and learn strategies for mastering times tables.',
    icon: '✖️',
    defaultAssigned: false,
    segments: [
      {
        type: 'narration',
        title: 'What Is Multiplication?',
        text: "Hey explorer! Have you ever had to add the same number over and over? Like 3 + 3 + 3 + 3? That gets tiring, right? Well, multiplication is a shortcut for repeated addition! Instead of adding 3 four times, we can say 4 × 3 = 12. The \"×\" symbol means \"groups of.\" So 4 × 3 means \"4 groups of 3.\" Let's learn more!",
      },
      {
        type: 'video',
        title: 'Introduction to Multiplication',
        youtubeId: 'mvOkMYCygps',
        caption: 'Math Antics introduces multiplication as a faster way to add equal groups.',
      },
      {
        type: 'comprehension',
        question: 'What does 5 × 3 mean?',
        options: [
          '5 plus 3',
          '5 groups of 3',
          '5 minus 3',
          '5 divided by 3',
        ],
        correctIndex: 1,
        explanation: '5 × 3 means 5 groups of 3: 3 + 3 + 3 + 3 + 3 = 15. Multiplication is repeated addition!',
      },
      {
        type: 'comprehension',
        question: 'Which addition problem is the same as 4 × 6?',
        options: [
          '4 + 6',
          '6 + 6 + 6 + 6',
          '4 + 4 + 4',
          '6 + 4 + 6 + 4',
        ],
        correctIndex: 1,
        explanation: '4 × 6 means 4 groups of 6: 6 + 6 + 6 + 6 = 24!',
      },
      {
        type: 'narration',
        title: 'Arrays: Seeing Multiplication',
        text: "One of the best ways to understand multiplication is with arrays! An array is an arrangement of objects in equal rows and columns. If you have 3 rows of 4 apples, that's an array! You can write it as 3 × 4 = 12. Arrays help us see that 3 × 4 and 4 × 3 give the same answer — this is called the commutative property!",
      },
      {
        type: 'narration',
        title: 'Visualizing Arrays',
        text: "Let's try making arrays! Picture 3 rows of 4 cookies on a baking sheet. That's a 3 × 4 array with 12 cookies total. Now picture 4 rows of 3 cookies — that's a 4 × 3 array, and guess what? It's still 12 cookies! This shows us that 3 × 4 = 4 × 3. Arrays make multiplication easy to see and understand.",
      },
      {
        type: 'comprehension',
        question: 'If you arrange 5 rows of 2 stars, how many stars are there in total?',
        options: ['7', '10', '12', '8'],
        correctIndex: 1,
        explanation: '5 rows of 2 = 5 × 2 = 10 stars! You can also count: 2 + 2 + 2 + 2 + 2 = 10.',
      },
      {
        type: 'practice',
        question: 'What is 3 × 7?',
        options: ['10', '18', '21', '24'],
        correctIndex: 2,
        explanation: '3 × 7 = 7 + 7 + 7 = 21. You can also think: 3 × 7 means 3 groups of 7.',
      },
      {
        type: 'narration',
        title: 'Times Table Tricks',
        text: "Ready for some cool tricks? For the 2s table, just double the number! For the 5s table, the answers always end in 0 or 5. For the 9s table, here's a magic trick: the digits of the answer always add up to 9! Like 9 × 3 = 27, and 2 + 7 = 9. Also, your fingers can help — hold up 10 fingers, fold down the 3rd finger, and you see 2 fingers on the left and 7 on the right: 27!",
      },
      {
        type: 'video',
        title: 'Times Table Tricks',
        youtubeId: 'xO_1bYgoQvA',
        caption: 'Discover fun tricks and patterns that make memorizing times tables easier.',
      },
      {
        type: 'practice',
        question: 'What is 9 × 4?',
        options: ['32', '34', '36', '38'],
        correctIndex: 2,
        explanation: '9 × 4 = 36. Check: 3 + 6 = 9. The 9s trick works!',
      },
      {
        type: 'practice',
        question: 'There are 6 bags with 5 marbles in each bag. How many marbles are there in total?',
        options: ['11', '25', '30', '35'],
        correctIndex: 2,
        explanation: '6 bags × 5 marbles = 6 × 5 = 30 marbles. The 5s always end in 0 or 5!',
      },
      {
        type: 'comprehension',
        question: 'The commutative property says that 3 × 4 = 4 × 3. What does this mean?',
        options: [
          'You can only multiply in one direction',
          'The order of the numbers does not change the answer',
          'Multiplication is the same as division',
          'You must always start with the smaller number',
        ],
        correctIndex: 1,
        explanation: 'The commutative property means you can swap the numbers and still get the same product: 3 × 4 = 12 and 4 × 3 = 12!',
      },
      {
        type: 'practice',
        question: 'What is 8 × 7?',
        options: ['54', '56', '48', '63'],
        correctIndex: 1,
        explanation: '8 × 7 = 56. One way to remember: 5, 6, 7, 8 — "56 = 7 × 8"!',
      },
      {
        type: 'practice',
        question: 'A classroom has 4 rows of desks with 8 desks in each row. How many desks are there?',
        options: ['12', '24', '32', '36'],
        correctIndex: 2,
        explanation: '4 rows × 8 desks = 4 × 8 = 32 desks!',
      },
      {
        type: 'summary',
        title: 'Multiplication Basics Complete!',
        keyPoints: [
          'Multiplication is repeated addition: 4 × 3 means 3 + 3 + 3 + 3',
          'Arrays help us see multiplication as rows and columns',
          'The commutative property: a × b = b × a (order doesn\'t matter)',
          'Times table tricks: 2s (double), 5s (end in 0/5), 9s (digits add to 9)',
          'Multiplication solves "equal groups" word problems',
        ],
      },
    ],
  },

  // ─── Grade 3 Science: Weather & Water Cycle ─────────────────
  {
    id: 'g3-sci-weather',
    grade: 3,
    subject: 'Science',
    title: 'Weather & Water Cycle',
    description: 'Learn about different types of weather and how water moves through the water cycle.',
    icon: '🌦️',
    defaultAssigned: false,
    segments: [
      {
        type: 'narration',
        title: 'What Is Weather?',
        text: "Look outside your window — what's the weather like today? Is it sunny, cloudy, rainy, or snowy? Weather is what the air and sky are doing at a certain time and place. It can change from hour to hour! Scientists who study weather are called meteorologists, and they use special tools to measure temperature, wind, and precipitation. Let's explore!",
      },
      {
        type: 'video',
        title: 'The Water Cycle',
        youtubeId: 'al-do-HGuIk',
        caption: 'Dr. Binocs explains how water moves through the water cycle — evaporation, condensation, and precipitation.',
      },
      {
        type: 'comprehension',
        question: 'What are the three main stages of the water cycle?',
        options: [
          'Freezing, melting, boiling',
          'Evaporation, condensation, precipitation',
          'Sunrise, noon, sunset',
          'Rain, snow, hail',
        ],
        correctIndex: 1,
        explanation: 'The water cycle has three main stages: evaporation (water turns to gas), condensation (gas turns to tiny droplets forming clouds), and precipitation (water falls as rain, snow, or hail)!',
      },
      {
        type: 'comprehension',
        question: 'What happens during evaporation?',
        options: [
          'Water freezes into ice',
          'Water falls from clouds as rain',
          'Liquid water turns into water vapor (gas)',
          'Clouds form in the sky',
        ],
        correctIndex: 2,
        explanation: 'During evaporation, the sun heats up water in oceans, lakes, and rivers, turning it into water vapor (an invisible gas) that rises into the air!',
      },
      {
        type: 'narration',
        title: 'Clouds and Condensation',
        text: "What are clouds made of? Tiny water droplets! When water vapor rises high into the sky where it's cold, it condenses — that means it turns back into tiny liquid droplets. Billions of these droplets clump together to form clouds. Different types of clouds bring different weather: fluffy cumulus clouds mean fair weather, thin cirrus clouds are high up, and dark nimbus clouds bring rain!",
      },
      {
        type: 'video',
        title: 'Types of Clouds',
        youtubeId: 'yod3wMbFHUY',
        caption: 'Dr. Binocs teaches you about different types of clouds and what they tell us about the weather.',
      },
      {
        type: 'comprehension',
        question: 'What happens during condensation?',
        options: [
          'Water heats up and becomes gas',
          'Water vapor cools and turns back into tiny liquid droplets',
          'Rain falls from clouds',
          'Ice melts into water',
        ],
        correctIndex: 1,
        explanation: 'Condensation is when water vapor cools down and turns back into tiny liquid droplets. This is how clouds form!',
      },
      {
        type: 'practice',
        question: 'Which type of cloud is usually dark and brings rain?',
        options: ['Cirrus', 'Cumulus', 'Nimbus', 'Stratus'],
        correctIndex: 2,
        explanation: 'Nimbus clouds (like cumulonimbus or nimbostratus) are dark, heavy rain clouds. The word "nimbus" means rain!',
      },
      {
        type: 'narration',
        title: 'Precipitation and Weather Patterns',
        text: "When cloud droplets get heavy enough, they fall back to Earth as precipitation. If it's warm, we get rain. If it's cold, we get snow, sleet, or hail! This water flows into rivers, lakes, and oceans, and the whole cycle starts again. The water cycle has been recycling the same water for billions of years — the water you drink might have been in a dinosaur's lake!",
      },
      {
        type: 'video',
        title: 'Be a Weather Watcher',
        youtubeId: 'Uo8lbeVVb4M',
        caption: 'SciShow Kids explores the tools meteorologists use to measure and predict weather.',
      },
      {
        type: 'comprehension',
        question: 'What tool measures temperature?',
        options: ['Rain gauge', 'Thermometer', 'Wind vane', 'Barometer'],
        correctIndex: 1,
        explanation: 'A thermometer measures temperature! A rain gauge measures rainfall, a wind vane shows wind direction, and a barometer measures air pressure.',
      },
      {
        type: 'practice',
        question: 'What is precipitation?',
        options: [
          'Water turning into gas',
          'Gas turning into liquid droplets',
          'Water falling from clouds as rain, snow, sleet, or hail',
          'Clouds forming in the sky',
        ],
        correctIndex: 2,
        explanation: 'Precipitation is any water that falls from clouds to the ground — rain, snow, sleet, and hail are all forms of precipitation!',
      },
      {
        type: 'practice',
        question: 'Where does the water go after it rains?',
        options: [
          'It disappears forever',
          'It flows into rivers, lakes, oceans, and soaks into the ground',
          'It stays on the surface and never moves',
          'It goes up to space',
        ],
        correctIndex: 1,
        explanation: 'After rain, water flows into rivers, lakes, and oceans, or soaks into the ground. Then evaporation starts the water cycle again!',
      },
      {
        type: 'practice',
        question: 'Why is the water cycle important?',
        options: [
          'It creates new water for Earth',
          'It recycles Earth\'s water so all living things have fresh water',
          'It makes the sun brighter',
          'It only matters for fish',
        ],
        correctIndex: 1,
        explanation: 'The water cycle recycles the same water over and over, providing fresh water for plants, animals, and people all around the world!',
      },
      {
        type: 'practice',
        question: 'On a hot sunny day, puddles disappear. What happened to the water?',
        options: [
          'It soaked into the concrete',
          'Animals drank it',
          'It evaporated — turned into invisible water vapor',
          'It froze overnight',
        ],
        correctIndex: 2,
        explanation: 'The sun\'s heat caused the puddle water to evaporate — it turned into invisible water vapor and rose into the air. The water cycle in action!',
      },
      {
        type: 'summary',
        title: 'Weather & Water Cycle Complete!',
        keyPoints: [
          'The water cycle: evaporation → condensation → precipitation → collection',
          'Evaporation: sun heats water, turning it into invisible water vapor',
          'Condensation: water vapor cools and forms clouds',
          'Precipitation: water falls as rain, snow, sleet, or hail',
          'Different cloud types indicate different weather patterns',
          'Meteorologists use thermometers, rain gauges, and barometers to measure weather',
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // GRADE 6 — DEFAULT LESSONS
  // ═══════════════════════════════════════════════════════════════

  // ─── Grade 6 Math: Ratios and Proportional Relationships ────
  {
    id: 'g6-math-ratios',
    grade: 6,
    subject: 'Math',
    title: 'Ratios and Proportional Relationships',
    description: 'Understand ratios, write them in different forms, and solve proportion problems.',
    icon: '📐',
    defaultAssigned: true,
    segments: [
      {
        type: 'narration',
        title: 'What is a Ratio?',
        text: "Welcome, explorer! Today we're diving into the world of ratios. A ratio is a way to compare two quantities. For example, if there are 3 cats and 5 dogs at a pet store, the ratio of cats to dogs is 3 to 5. We write this as 3:5 or as a fraction 3/5. Ratios are everywhere — in recipes, maps, sports stats, and more!",
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
        explanation: 'Divide both numbers by their GCF (6): 12÷6 = 2 and 18÷6 = 3. The simplest form is 2:3.',
      },
      {
        type: 'comprehension',
        question: 'A recipe calls for 2 cups of flour for every 3 cups of sugar. If you use 6 cups of flour, how much sugar do you need?',
        options: ['6 cups', '7 cups', '8 cups', '9 cups'],
        correctIndex: 3,
        explanation: '2:3 = 6:? — Since 2 × 3 = 6, we also multiply 3 × 3 = 9 cups of sugar.',
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
        caption: 'Math Antics teaches proportions — setting equivalent ratios equal to solve problems.',
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
        explanation: 'Divide both by 2: 4÷2 = 2 and 6÷2 = 3. So 4:6 = 2:3.',
      },
      {
        type: 'narration',
        title: 'Unit Rates',
        text: "A special type of ratio is called a unit rate. A unit rate tells you the amount per ONE unit. For example, if you drive 120 miles in 2 hours, the unit rate is 120 ÷ 2 = 60 miles per hour. Unit rates help us compare — which is a better deal: $6 for 3 apples or $10 for 5 apples? Find the unit rate: $2 per apple vs. $2 per apple. They're the same!",
      },
      {
        type: 'narration',
        title: 'Calculating Unit Rates',
        text: "To find a unit rate, divide both quantities so one of them equals 1. For example: if 3 pizzas cost $24, the unit rate is $24 ÷ 3 = $8 per pizza. Or if you bike 12 miles in 2 hours, the unit rate is 12 ÷ 2 = 6 miles per hour. Unit rates make it easy to compare — is Store A's price of $4.50 for 3 apples better than Store B's $7 for 5 apples? Find the unit rates: $1.50 vs. $1.40 per apple. Store B wins!",
      },
      {
        type: 'practice',
        question: 'If 5 pencils cost $2, how much do 15 pencils cost?',
        options: ['$4', '$5', '$6', '$7'],
        correctIndex: 2,
        explanation: '5 pencils : $2 = 15 pencils : $?  Since 5 × 3 = 15, we multiply $2 × 3 = $6.',
      },
      {
        type: 'practice',
        question: 'A map has a scale of 1 cm : 5 km. If two cities are 8 cm apart on the map, what is the real distance?',
        options: ['13 km', '40 km', '30 km', '45 km'],
        correctIndex: 1,
        explanation: '1 cm = 5 km, so 8 cm = 8 × 5 = 40 km.',
      },
      {
        type: 'comprehension',
        question: 'A car travels 240 miles using 8 gallons of gas. What is the unit rate (miles per gallon)?',
        options: ['20 mpg', '30 mpg', '32 mpg', '35 mpg'],
        correctIndex: 1,
        explanation: 'Divide distance by gallons: 240 ÷ 8 = 30 miles per gallon.',
      },
      {
        type: 'practice',
        question: 'The ratio of red to blue marbles is 3:7. If there are 21 blue marbles, how many red marbles are there?',
        options: ['7', '9', '12', '14'],
        correctIndex: 1,
        explanation: '3:7 = ?:21 — Since 7 × 3 = 21, we multiply 3 × 3 = 9 red marbles.',
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
        explanation: '4 for $6 = $1.50 each. 6 for $8 ≈ $1.33 each. The second option is cheaper per notebook!',
      },
      {
        type: 'summary',
        title: 'Ratios Complete!',
        keyPoints: [
          'A ratio compares two quantities (written as a:b or a/b)',
          'Simplify ratios by dividing both parts by the GCF',
          'Equivalent ratios are made by multiplying/dividing both parts by the same number',
          'Proportions set two equivalent ratios equal to solve for unknowns',
          'Unit rates tell you the amount per one unit — useful for comparing deals',
        ],
      },
    ],
  },

  // ─── Grade 6 Science: Cells ─────────────────────────────────
  {
    id: 'g6-sci-cells',
    grade: 6,
    subject: 'Science',
    title: 'Cells: The Building Blocks of Life',
    description: 'Discover what cells are, their parts, and how plant and animal cells differ.',
    icon: '🔬',
    defaultAssigned: true,
    segments: [
      {
        type: 'narration',
        title: 'What Are Cells?',
        text: "Every living thing on Earth — from the tallest tree to the tiniest ant — is made of cells. Cells are the basic building blocks of all life! Some organisms, like bacteria, are just one cell. Others, like humans, are made of trillions of cells. Each cell is like a tiny factory, performing specific jobs to keep the organism alive. Let's learn more!",
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
        explanation: "The cell membrane is like a gatekeeper — it controls what goes in and out of the cell, protecting it and keeping it healthy.",
      },
      {
        type: 'narration',
        title: 'Inside the Cell: Organelles',
        text: "A cell has many tiny parts called organelles, each with a special job. The nucleus is the control center — it holds the DNA and tells the cell what to do. Mitochondria are the powerhouses — they convert food into energy. The endoplasmic reticulum and ribosomes work together to make proteins. Think of organelles as workers in a factory, each doing their part!",
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
        caption: 'A clear comparison of plant and animal cells — what they share and how they differ.',
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
        explanation: "Plant cells have a rigid cell wall outside their cell membrane. Animal cells don't have a cell wall — that's why animal bodies are flexible!",
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
        explanation: 'The nucleus contains DNA and controls all cell activities — it tells the cell what to do and when. It\'s the command center!',
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
          'Mitochondria are the "powerhouse" — they make energy for the cell',
          'Plant cells have extras: cell wall, chloroplasts, and large vacuole',
          'Chloroplasts enable photosynthesis — converting sunlight to food',
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
    id: 'g6-math-expressions',
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
        text: "Welcome to the world of algebra! Don't worry — it's not as scary as it sounds. An algebraic expression uses numbers, variables (letters like x or n), and operations (+, −, ×, ÷). For example, \"2x + 5\" means \"take a number, multiply it by 2, then add 5.\" The letter x is a variable — it stands for a number we don't know yet. Let's explore!",
      },
      {
        type: 'video',
        title: 'What Is Algebra?',
        youtubeId: 'NybHckSEQBI',
        caption: 'Math Antics introduces algebra — variables, expressions, and what they mean.',
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
        text: "In math, we often need to translate words into expressions. \"Five more than a number\" becomes \"n + 5.\" \"Three times a number\" becomes \"3n.\" \"A number decreased by 8\" becomes \"n − 8.\" Look for key words: \"more than\" and \"sum\" mean addition; \"less than\" and \"difference\" mean subtraction; \"times\" and \"product\" mean multiplication; \"divided by\" and \"quotient\" mean division.",
      },
      {
        type: 'video',
        title: 'Order of Operations (PEMDAS)',
        youtubeId: 'dAgfnK528RA',
        caption: 'Math Antics explains the order of operations — the rules for evaluating expressions.',
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
        question: 'What is the value of 3 + 4 × 2?',
        options: ['14', '11', '10', '9'],
        correctIndex: 1,
        explanation: 'Order of operations: multiply first! 4 × 2 = 8, then 3 + 8 = 11. (Not 3 + 4 = 7 × 2 = 14!)',
      },
      {
        type: 'narration',
        title: 'Solving One-Step Equations',
        text: "An equation uses an equals sign (=) to show that two things are equal. For example, x + 5 = 12. To solve it, we need to find what x equals. The trick is to do the OPPOSITE operation to both sides. Since 5 is being added, we subtract 5 from both sides: x + 5 − 5 = 12 − 5, so x = 7! Always check: 7 + 5 = 12. Correct!",
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
        explanation: 'Subtract 9 from both sides: x = 15 − 9 = 6. Check: 6 + 9 = 15. Correct!',
      },
      {
        type: 'practice',
        question: 'Solve: 3n = 18',
        options: ['n = 3', 'n = 5', 'n = 6', 'n = 15'],
        correctIndex: 2,
        explanation: 'Divide both sides by 3: n = 18 ÷ 3 = 6. Check: 3 × 6 = 18. Correct!',
      },
      {
        type: 'comprehension',
        question: 'Which phrase translates to the expression "n − 4"?',
        options: [
          'Four more than a number',
          'A number decreased by four',
          'Four times a number',
          'A number divided by four',
        ],
        correctIndex: 1,
        explanation: '"A number decreased by four" means starting with a number (n) and subtracting 4: n − 4!',
      },
      {
        type: 'practice',
        question: 'Solve: y ÷ 5 = 8',
        options: ['y = 3', 'y = 13', 'y = 35', 'y = 40'],
        correctIndex: 3,
        explanation: 'Multiply both sides by 5: y = 8 × 5 = 40. Check: 40 ÷ 5 = 8. Correct!',
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

  // ─── Grade 6 Science: Electricity & Circuits ────────────────
  {
    id: 'g6-sci-electricity',
    grade: 6,
    subject: 'Science',
    title: 'Electricity & Circuits',
    description: 'Explore how electricity works, build circuits, and learn about conductors and insulators.',
    icon: '⚡',
    defaultAssigned: false,
    segments: [
      {
        type: 'narration',
        title: 'What Is Electricity?',
        text: "Flip a light switch, charge your phone, or play a video game — electricity powers so much of our world! But what exactly IS electricity? It's the flow of tiny particles called electrons through a material. Think of it like water flowing through a pipe. The \"push\" that makes electrons flow is called voltage, the flow itself is called current, and anything that slows the flow is called resistance. Let's explore!",
      },
      {
        type: 'video',
        title: 'How Electricity Works',
        youtubeId: 'mc979OhitAg',
        caption: 'An engaging introduction to electricity — what it is, how it flows, and why it matters.',
      },
      {
        type: 'comprehension',
        question: 'What are the tiny particles that flow to create electricity?',
        options: ['Protons', 'Neutrons', 'Electrons', 'Atoms'],
        correctIndex: 2,
        explanation: 'Electricity is the flow of electrons — tiny, negatively charged particles that orbit atoms. When they move through a wire, we get electric current!',
      },
      {
        type: 'comprehension',
        question: 'What is voltage?',
        options: [
          'The speed of electrons',
          'The "push" that makes electrons flow',
          'The number of electrons in a wire',
          'The heat created by electricity',
        ],
        correctIndex: 1,
        explanation: 'Voltage is the electrical "push" or force that drives electrons through a circuit. A battery provides voltage. Higher voltage = stronger push!',
      },
      {
        type: 'narration',
        title: 'Electric Circuits',
        text: "For electricity to work, it needs a complete path to travel — this is called a circuit. Every circuit needs: a power source (like a battery), a conductor (like a wire to carry the current), and a load (like a light bulb that uses the energy). If there's a break anywhere in the path, the circuit is \"open\" and electricity stops flowing. A switch opens and closes the circuit!",
      },
      {
        type: 'video',
        title: 'Series and Parallel Circuits',
        youtubeId: 'XSukRnxGy5c',
        caption: 'Learn the difference between series circuits (one path) and parallel circuits (multiple paths).',
      },
      {
        type: 'comprehension',
        question: 'What three things does every circuit need?',
        options: [
          'A switch, a motor, and a fuse',
          'A power source, a conductor, and a load',
          'A battery, a computer, and a screen',
          'Voltage, amperage, and wattage',
        ],
        correctIndex: 1,
        explanation: 'Every circuit needs: a power source (battery), a conductor (wire), and a load (light bulb, motor, etc.) to use the energy!',
      },
      {
        type: 'practice',
        question: 'In a series circuit, what happens if one light bulb burns out?',
        options: [
          'Only that bulb goes out',
          'All the bulbs go out because the circuit is broken',
          'The other bulbs get brighter',
          'Nothing changes',
        ],
        correctIndex: 1,
        explanation: 'In a series circuit, there is only one path for electricity. If one bulb burns out, it breaks the circuit and ALL bulbs go out!',
      },
      {
        type: 'narration',
        title: 'Conductors and Insulators',
        text: "Not all materials let electricity pass through them equally. Conductors are materials that let electricity flow easily — metals like copper, aluminum, and gold are great conductors. That's why wires are made of copper! Insulators are materials that block or slow down electricity — rubber, plastic, glass, and wood are insulators. That's why wires are coated in plastic — to keep us safe!",
      },
      {
        type: 'video',
        title: 'Conductors and Insulators',
        youtubeId: 'a6ugPfzc70Q',
        caption: 'Discover which materials conduct electricity and which ones block it.',
      },
      {
        type: 'comprehension',
        question: 'Why are electrical wires made of copper but coated in plastic?',
        options: [
          'Copper is cheap and plastic is colorful',
          'Copper conducts electricity well, and plastic insulates to keep us safe',
          'Both materials conduct electricity equally',
          'Plastic makes the wire stronger',
        ],
        correctIndex: 1,
        explanation: 'Copper is an excellent conductor (lets electricity flow), while plastic is an insulator (blocks electricity), protecting us from shocks!',
      },
      {
        type: 'practice',
        question: 'Which of these is a conductor?',
        options: ['Rubber band', 'Glass cup', 'Aluminum foil', 'Wooden stick'],
        correctIndex: 2,
        explanation: 'Aluminum foil is a metal and an excellent conductor of electricity. Rubber, glass, and wood are all insulators!',
      },
      {
        type: 'practice',
        question: 'In a parallel circuit with 3 bulbs, one burns out. What happens?',
        options: [
          'All bulbs go out',
          'The other 2 bulbs keep working',
          'The circuit explodes',
          'The battery dies instantly',
        ],
        correctIndex: 1,
        explanation: 'In a parallel circuit, each bulb has its own path. If one burns out, the others stay lit because electricity can still flow through the other paths!',
      },
      {
        type: 'practice',
        question: 'A switch in a circuit does what?',
        options: [
          'Increases the voltage',
          'Opens and closes the circuit to control the flow of electricity',
          'Creates more electrons',
          'Changes the direction of current',
        ],
        correctIndex: 1,
        explanation: 'A switch opens the circuit (breaking the path, stopping electricity) or closes it (completing the path, letting electricity flow). It\'s like a gate!',
      },
      {
        type: 'practice',
        question: 'Which type of circuit is used in most homes?',
        options: [
          'Series circuit',
          'Parallel circuit',
          'Both equally',
          'Neither — homes don\'t use circuits',
        ],
        correctIndex: 1,
        explanation: 'Homes use parallel circuits so that each device has its own path. That way, if one light goes out, the rest of the house still has power!',
      },
      {
        type: 'summary',
        title: 'Electricity & Circuits Complete!',
        keyPoints: [
          'Electricity is the flow of electrons through a conductor',
          'Circuits need: power source + conductor + load',
          'Series circuits: one path — if one part breaks, everything stops',
          'Parallel circuits: multiple paths — each device works independently',
          'Conductors (metals) let electricity flow; insulators (rubber, plastic) block it',
          'Switches open/close circuits to control electricity flow',
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
