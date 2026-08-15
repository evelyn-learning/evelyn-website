// Curated YouTube video library for adaptive lessons.
// Every ID here has been verified; the AI must pick from this list only.

export interface CuratedVideo {
  youtubeId: string;
  title: string;
  channel: string;
  /** beginner | intermediate | review */
  level: 'beginner' | 'intermediate' | 'review';
  /** topic keys the video is relevant to */
  topics: string[];
  /** approximate duration in minutes */
  durationMin: number;
}

export const CURATED_VIDEOS: Record<string, CuratedVideo[]> = {
  'g3-fractions': [
    {
      youtubeId: 'n0FZhQ_GkKw',
      title: 'Introduction to Fractions',
      channel: 'Math Antics',
      level: 'beginner',
      topics: ['fractions', 'what-is-a-fraction', 'parts-of-a-whole'],
      durationMin: 9,
    },
    {
      youtubeId: '5juto2ze8Lg',
      title: 'Fractions on a Number Line',
      channel: 'Khan Academy',
      level: 'intermediate',
      topics: ['fractions', 'number-line', 'comparing-fractions'],
      durationMin: 5,
    },
    {
      youtubeId: '52ZlXsFJULI',
      title: 'Comparing Fractions',
      channel: 'Math Antics',
      level: 'intermediate',
      topics: ['fractions', 'comparing-fractions', 'equivalent-fractions'],
      durationMin: 10,
    },
    {
      youtubeId: 'DnFrOetuUKg',
      title: 'Fractions Review',
      channel: 'Khan Academy',
      level: 'review',
      topics: ['fractions', 'review', 'parts-of-a-whole'],
      durationMin: 6,
    },
  ],

  'g3-addition': [
    {
      youtubeId: 'AuX7nPBqDts',
      title: 'Addition Basics',
      channel: 'Khan Academy',
      level: 'beginner',
      topics: ['addition', 'basic-addition', 'number-sense'],
      durationMin: 4,
    },
    {
      youtubeId: 'mAvuom42NyY',
      title: 'Multi-Digit Addition',
      channel: 'Math Antics',
      level: 'intermediate',
      topics: ['addition', 'regrouping', 'multi-digit'],
      durationMin: 10,
    },
    {
      youtubeId: 'Y6M89-6106I',
      title: 'Multi-Digit Subtraction',
      channel: 'Math Antics',
      level: 'intermediate',
      topics: ['addition', 'subtraction', 'regrouping'],
      durationMin: 11,
    },
    {
      youtubeId: 'mvOkMYCygps',
      title: 'Introduction to Multiplication',
      channel: 'Math Antics',
      level: 'beginner',
      topics: ['addition', 'multiplication', 'repeated-addition'],
      durationMin: 8,
    },
    {
      youtubeId: 'xO_1bYgoQvA',
      title: 'Times Table Tricks',
      channel: 'Math Antics',
      level: 'review',
      topics: ['addition', 'multiplication', 'mental-math'],
      durationMin: 10,
    },
  ],

  'g3-plants': [
    {
      youtubeId: 'JSe_VUMymjo',
      title: 'What Is Seed Germination?',
      channel: 'Dr. Binocs',
      level: 'beginner',
      topics: ['plants', 'germination', 'seeds'],
      durationMin: 4,
    },
    {
      youtubeId: 'p3St51F4kE8',
      title: 'Parts of a Plant',
      channel: 'Dr. Binocs',
      level: 'beginner',
      topics: ['plants', 'plant-parts', 'roots', 'leaves'],
      durationMin: 4,
    },
    {
      youtubeId: 'W-daJxfe4As',
      title: 'What Is Pollination?',
      channel: 'Dr. Binocs',
      level: 'intermediate',
      topics: ['plants', 'pollination', 'life-cycle'],
      durationMin: 4,
    },
  ],

  'g6-ratios': [
    {
      youtubeId: 'RQ2nYUBVvqI',
      title: 'Ratios and Rates',
      channel: 'Math Antics',
      level: 'beginner',
      topics: ['ratios', 'rates', 'proportions'],
      durationMin: 11,
    },
    {
      youtubeId: 'USmit5zUGas',
      title: 'Proportions',
      channel: 'Math Antics',
      level: 'intermediate',
      topics: ['ratios', 'proportions', 'equivalent-ratios'],
      durationMin: 8,
    },
  ],

  'g6-expressions': [
    {
      youtubeId: 'NybHckSEQBI',
      title: 'What Is Algebra?',
      channel: 'Math Antics',
      level: 'beginner',
      topics: ['expressions', 'algebra', 'variables'],
      durationMin: 11,
    },
    {
      youtubeId: 'dAgfnK528RA',
      title: 'Order of Operations (PEMDAS)',
      channel: 'Math Antics',
      level: 'intermediate',
      topics: ['expressions', 'order-of-operations', 'PEMDAS'],
      durationMin: 9,
    },
    {
      youtubeId: 'l3XzepN03KQ',
      title: 'Solving Basic Equations',
      channel: 'Math Antics',
      level: 'intermediate',
      topics: ['expressions', 'equations', 'solving'],
      durationMin: 10,
    },
    {
      youtubeId: '9Ek61w1LxSc',
      title: 'Variables & Expressions Practice',
      channel: 'Khan Academy',
      level: 'intermediate',
      topics: ['expressions', 'variables', 'evaluation'],
      durationMin: 6,
    },
  ],

  'g6-cells': [
    {
      youtubeId: '8IlzKri08kk',
      title: 'Introduction to Cells: The Grand Cell Tour',
      channel: 'Amoeba Sisters',
      level: 'beginner',
      topics: ['cells', 'organelles', 'cell-structure'],
      durationMin: 7,
    },
    {
      youtubeId: 'Tfy1mOT-gEQ',
      title: 'Plant vs. Animal Cells',
      channel: 'Amoeba Sisters',
      level: 'beginner',
      topics: ['cells', 'plant-cells', 'animal-cells'],
      durationMin: 5,
    },
    {
      youtubeId: 'URUJD5NEXC8',
      title: 'Cell Organelles and Their Functions',
      channel: 'Amoeba Sisters',
      level: 'intermediate',
      topics: ['cells', 'organelles', 'mitochondria', 'nucleus'],
      durationMin: 7,
    },
    {
      youtubeId: '4OpBylwH9DU',
      title: 'Cell Review',
      channel: 'Amoeba Sisters',
      level: 'review',
      topics: ['cells', 'review', 'cell-structure'],
      durationMin: 8,
    },
    {
      youtubeId: 'JQByjprj_mA',
      title: 'Cell Membrane Transport',
      channel: 'Amoeba Sisters',
      level: 'intermediate',
      topics: ['cells', 'cell-membrane', 'transport'],
      durationMin: 6,
    },
  ],
};

export function getVideosForTopic(topicKey: string): CuratedVideo[] {
  return CURATED_VIDEOS[topicKey] || [];
}
