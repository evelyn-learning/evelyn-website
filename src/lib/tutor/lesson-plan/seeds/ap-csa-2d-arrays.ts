/**
 * AP CSA — 2D Arrays.
 *
 * Declaration, traversal (row-major / column-major), nested loops, common patterns.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_CSA_2D_ARRAYS: LessonPlan = {
  id: 'evelyn.ap.csa.2d-arrays.v1',
  title: '2D Arrays in Java',
  curriculum: 'CollegeBoard',
  grade: '11',
  subject: 'cs',
  topic: 'computer science',
  locale: 'en',
  los: [
    {
      id: 'apcsa.2d-arrays',
      description: 'Declare, initialize, and traverse 2D arrays using nested loops in row-major and column-major order.',
      standard: 'AP-CSA-8',
    },
  ],
  prerequisites: ['apcsa.arrays', 'apcsa.control-flow'],
  followUps: ['apcsa.recursion'],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame 2D arrays as a grid.',
      script: 'A 2D array is just a grid: rows and columns. Tic-tac-toe is a 3×3 grid. A spreadsheet is a giant 2D array. Once you can iterate the rows and the columns, you can sum them, find max, transpose them, search them — all with one nested loop.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-mechanics',
      kind: 'concept',
      goal: 'Declaration, indexing, nested-loop traversal.',
      keyIdeas: [
        'DECLARATION: int[][] grid = new int[3][4]; — 3 rows, 4 columns. All zeros initially.',
        'LITERAL: int[][] grid = {{1,2,3}, {4,5,6}}; — 2 rows, 3 columns.',
        'INDEXING: grid[row][col]. ALWAYS row first, then column.',
        'DIMENSIONS: grid.length = number of ROWS. grid[0].length = number of COLUMNS in row 0.',
        'ROW-MAJOR TRAVERSAL: for (int r = 0; r < grid.length; r++) { for (int c = 0; c < grid[0].length; c++) { ... } } — visits left-to-right within each row, row-by-row top to bottom.',
        'COLUMN-MAJOR TRAVERSAL: swap the loop order. for c outer, for r inner. Visits top-to-bottom within each column.',
        'JAGGED ARRAYS: rows can have different lengths. grid[r].length may differ per row. AP CSA allows but rarely tests.',
        'COMMON PATTERNS: sum all (single accumulator). Max element (track max + position). Sum each row (1D result). Search for value (early-return when found).',
      ],
      vocabulary: [
        { term: 'row-major order', definition: 'iteration that completes each row before moving to the next.' },
        { term: 'column-major order', definition: 'iteration that completes each column before moving to the next.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-row-sum',
      kind: 'worked_example',
      problem: 'Write a method that returns the sum of row r in a 2D int array, then trace it for grid = {{1,2,3}, {4,5,6}, {7,8,9}}, r = 1.',
      steps: [
        'public static int rowSum(int[][] grid, int r) { int sum = 0; for (int c = 0; c < grid[r].length; c++) { sum += grid[r][c]; } return sum; }',
        'Trace rowSum(grid, 1):',
        'r = 1. grid[1] is {4, 5, 6}. grid[1].length = 3.',
        'c=0: sum += grid[1][0] = 4. sum = 4.',
        'c=1: sum += grid[1][1] = 5. sum = 9.',
        'c=2: sum += grid[1][2] = 6. sum = 15.',
        'Return 15.',
      ],
      answer: '15',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'For grid = {{1,2}, {3,4}, {5,6}}, what does grid.length + grid[0].length equal?',
      expectedAnswer: '5',
      responseFormat: 'numeric',
      hints: [
        'grid.length = number of rows = 3.',
        'grid[0].length = columns in row 0 = 2. 3+2 = ?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-rows-cols',
      kind: 'misconception_check',
      question: 'For int[][] grid = new int[5][3]; how many rows and columns are there?',
      commonErrors: [
        {
          answer: '3 rows and 5 columns',
          misconception: 'Reversing the dimension order.',
          correctsTo: '5 rows and 3 columns. The first bracket is rows; the second is columns. grid.length = 5, grid[0].length = 3. The mnemonic: grid[row][col] — first index is row, so the first dimension in `new int[A][B]` is the row count A.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'grid[row][col]. grid.length = rows. grid[0].length = cols.',
        'Row-major: for r outer, for c inner. Column-major: swap.',
        'new int[A][B]: A rows, B columns.',
        'Most AP CSA 2D problems are sum / max / search — pattern is one nested loop.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Write the loop structure to compute the sum of each COLUMN of an n × m grid as a 1D array of length m.',
      hint: 'Outer loop: c from 0 to grid[0].length. Inner loop: r from 0 to grid.length. Accumulate into colSum[c]. The inner sum walks DOWN the column, so r is the inner variable.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
