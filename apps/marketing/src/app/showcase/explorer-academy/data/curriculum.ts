export interface CurriculumTopic {
  id: string;
  name: string;
  subject: 'Math' | 'Science';
}

export const CURRICULUM: Record<3 | 6, CurriculumTopic[]> = {
  3: [
    { id: 'add-sub-3', name: 'Addition & Subtraction Strategies', subject: 'Math' },
    { id: 'mult-3', name: 'Multiplication Basics', subject: 'Math' },
    { id: 'fractions-3', name: 'Fractions Introduction', subject: 'Math' },
    { id: 'patterns-3', name: 'Patterns & Sorting', subject: 'Math' },
    { id: 'geometry-3', name: 'Geometry Basics', subject: 'Math' },
    { id: 'measurement-3', name: 'Measurement', subject: 'Math' },
    { id: 'life-cycles-3', name: 'Life Cycles of Plants', subject: 'Science' },
    { id: 'forces-3', name: 'Forces & Motion', subject: 'Science' },
    { id: 'weather-3', name: 'Weather & Water Cycle', subject: 'Science' },
    { id: 'habitats-3', name: 'Habitats & Ecosystems', subject: 'Science' },
  ],
  6: [
    { id: 'ratios-6', name: 'Ratios & Proportional Relationships', subject: 'Math' },
    { id: 'integers-6', name: 'Integers', subject: 'Math' },
    { id: 'expressions-6', name: 'Expressions & Equations', subject: 'Math' },
    { id: 'geometry-6', name: 'Geometry & Measurement', subject: 'Math' },
    { id: 'fractions-6', name: 'Fractions & Decimals', subject: 'Math' },
    { id: 'data-6', name: 'Data Analysis', subject: 'Math' },
    { id: 'cells-6', name: 'Cells: Building Blocks of Life', subject: 'Science' },
    { id: 'electricity-6', name: 'Electricity & Circuits', subject: 'Science' },
    { id: 'space-6', name: 'Space & Astronomy', subject: 'Science' },
    { id: 'earth-6', name: 'Earth Science', subject: 'Science' },
  ],
};

/** Topics filtered for Practice Test use (subject + grade label) */
export const PRACTICE_TEST_TOPICS: Record<3 | 6, Record<string, string[]>> = {
  3: {
    Math: ['Addition & Subtraction', 'Multiplication Basics', 'Fractions Introduction', 'Patterns & Sorting'],
    Science: ['Plant & Animal Life Cycles', 'Forces & Motion', 'Weather & Water'],
  },
  6: {
    Math: ['Ratios', 'Integers', 'Expressions & Equations', 'Geometry & Measurement'],
    Science: ['Cells & Organisms', 'Electricity', 'Space & Astronomy'],
  },
};
