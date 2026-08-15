import { GRADE_8_UTAH_STANDARDS } from './standards';

export interface Student {
  id: string;
  name: string;
}

export interface CellData {
  mastery: number;
  misconception?: string;
  lastActivity?: string;
}

export const ROSTER: Student[] = [
  { id: 's01', name: 'Addison Clark' },
  { id: 's02', name: 'Brantley Miller' },
  { id: 's03', name: 'Brooklyn Jensen' },
  { id: 's04', name: 'Cache Williams' },
  { id: 's05', name: 'Carlos Ramirez' },
  { id: 's06', name: 'Dax Johnson' },
  { id: 's07', name: 'Easton Brown' },
  { id: 's08', name: 'Emma Taylor' },
  { id: 's09', name: 'Haylee Peterson' },
  { id: 's10', name: 'Hunter Davis' },
  { id: 's11', name: 'Jaxon Wilson' },
  { id: 's12', name: 'Kaylee Anderson' },
  { id: 's13', name: 'Kennedy Smith' },
  { id: 's14', name: 'Kyle Hansen' },
  { id: 's15', name: 'Madison Olsen' },
  { id: 's16', name: 'Maria Garcia' },
  { id: 's17', name: 'Olivia Martinez' },
  { id: 's18', name: 'Savannah Nielson' },
  { id: 's19', name: 'Tyler Roberts' },
  { id: 's20', name: 'Wyatt Jorgensen' },
];

// Rows = students (ROSTER order); columns = standards (GRADE_8_UTAH_STANDARDS order):
// [8.EE.A.1, 8.EE.B.6, 8.EE.C.7, 8.EE.C.8, 8.F.A.1, 8.F.B.4, 8.G.B.7, 8.NS.A.1]
const MASTERY_GRID: number[][] = [
  /* Addison Clark    */ [88, 91, 93, 78, 90, 58, 92, 89],
  /* Brantley Miller  */ [48, 42, 52, 30, 46, 40, 44, 50],
  /* Brooklyn Jensen  */ [70, 65, 72, 40, 68, 62, 70, 72],
  /* Cache Williams   */ [45, 38, 48, 22, 42, 38, 40, 46],
  /* Carlos Ramirez   */ [68, 62, 70, 38, 66, 60, 68, 70],
  /* Dax Johnson      */ [58, 55, 62, 32, 58, 52, 60, 62],
  /* Easton Brown     */ [72, 70, 74, 48, 72, 68, 74, 75],
  /* Emma Taylor      */ [92, 94, 96, 90, 93, 91, 95, 92],
  /* Haylee Peterson  */ [72, 68, 75, 40, 70, 60, 72, 74],
  /* Hunter Davis     */ [46, 40, 50, 26, 44, 38, 42, 48],
  /* Jaxon Wilson     */ [70, 66, 72, 42, 68, 62, 70, 72],
  /* Kaylee Anderson  */ [65, 60, 68, 45, 64, 58, 66, 68],
  /* Kennedy Smith    */ [93, 95, 94, 92, 94, 93, 96, 94],
  /* Kyle Hansen      */ [42, 38, 46, 22, 40, 36, 38, 44],
  /* Madison Olsen    */ [62, 58, 66, 38, 60, 55, 64, 66],
  /* Maria Garcia     */ [75, 70, 76, 50, 74, 68, 76, 78],
  /* Olivia Martinez  */ [90, 92, 95, 90, 92, 90, 94, 93],
  /* Savannah Nielson */ [68, 64, 72, 42, 66, 62, 70, 70],
  /* Tyler Roberts    */ [74, 68, 76, 48, 72, 66, 74, 76],
  /* Wyatt Jorgensen  */ [70, 66, 72, 48, 68, 64, 70, 72],
];

// Misconception library — keyed by "<studentId>:<standardCode>" for specific cells.
// Cells not in this map fall back to a standard-level default if they're at-risk.
const MISCONCEPTION_OVERRIDES: Record<string, string> = {
  // Systems of Equations (8.EE.C.8) — Jace's #1 pain point, 4 distinct misconceptions
  's02:8.EE.C.8': 'Sets up equations correctly but cannot translate word problems into equations.',
  's03:8.EE.C.8': 'Confuses substitution with elimination and mixes steps from both methods.',
  's04:8.EE.C.8': 'Treats each equation separately rather than as a connected system.',
  's05:8.EE.C.8': 'Sets up equations correctly but cannot translate word problems into equations.',
  's06:8.EE.C.8': 'Graphs both lines correctly but cannot interpret the intersection as the solution.',
  's09:8.EE.C.8': 'Sets up equations correctly but cannot translate word problems into equations.',
  's10:8.EE.C.8': 'Confuses substitution with elimination and mixes steps from both methods.',
  's11:8.EE.C.8': 'Graphs both lines correctly but cannot interpret the intersection as the solution.',
  's14:8.EE.C.8': 'Sets up equations correctly but cannot translate word problems into equations.',
  's15:8.EE.C.8': 'Treats each equation separately rather than as a connected system.',
  's18:8.EE.C.8': 'Confuses substitution with elimination and mixes steps from both methods.',

  // Construct linear functions (8.F.B.4)
  's01:8.F.B.4': 'Finds slope correctly from a table but inconsistent with y-intercept.',
  's09:8.F.B.4': 'Reads rate of change from tables but cannot build the equation.',
  's11:8.F.B.4': 'Finds slope correctly from a table but inconsistent with y-intercept.',

  // Integer exponents (8.EE.A.1)
  's02:8.EE.A.1': 'Applies exponent rules to bases but misses the sign for negative values.',
  's04:8.EE.A.1': 'Confuses the product rule with the power rule.',
  's10:8.EE.A.1': 'Confuses the product rule with the power rule.',
  's14:8.EE.A.1': 'Applies exponent rules to bases but misses the sign for negative values.',

  // Slope-intercept (8.EE.B.6)
  's02:8.EE.B.6': 'Finds slope from two points but miscalculates y-intercept.',
  's04:8.EE.B.6': 'Finds slope from two points but miscalculates y-intercept.',
  's10:8.EE.B.6': 'Finds slope from two points but miscalculates y-intercept.',
  's14:8.EE.B.6': 'Finds slope from two points but miscalculates y-intercept.',

  // Linear equations (8.EE.C.7)
  's02:8.EE.C.7': 'Drops a negative when distributing across parentheses.',
  's04:8.EE.C.7': 'Forgets to apply operations to both sides of the equation.',
  's10:8.EE.C.7': 'Drops a negative when distributing across parentheses.',

  // Pythagorean (8.G.B.7)
  's02:8.G.B.7': 'Knows the formula but drops the square root at the end.',
  's04:8.G.B.7': 'Knows the formula but drops the square root at the end.',
  's14:8.G.B.7': 'Applies the theorem to triangles that are not right triangles.',
  's10:8.G.B.7': 'Applies the theorem to triangles that are not right triangles.',

  // Functions (8.F.A.1)
  's02:8.F.A.1': 'Confuses input and output when reading function notation.',
  's04:8.F.A.1': 'Confuses input and output when reading function notation.',
  's10:8.F.A.1': 'Confuses input and output when reading function notation.',
  's14:8.F.A.1': 'Cannot decide whether a relation is a function from a table.',

  // Rational vs. irrational (8.NS.A.1)
  's02:8.NS.A.1': 'Classifies terminating decimals as irrational.',
  's14:8.NS.A.1': 'Classifies terminating decimals as irrational.',
};

export function getCell(studentIdx: number, standardIdx: number): CellData {
  const student = ROSTER[studentIdx];
  const standard = GRADE_8_UTAH_STANDARDS[standardIdx];
  const mastery = MASTERY_GRID[studentIdx][standardIdx];
  const key = `${student.id}:${standard.code}`;
  return {
    mastery,
    misconception: MISCONCEPTION_OVERRIDES[key],
  };
}

export function getMasteryGrid(): number[][] {
  return MASTERY_GRID.map((row) => [...row]);
}

export function getClassAverage(): number {
  const all = MASTERY_GRID.flat();
  return Math.round(all.reduce((a, b) => a + b, 0) / all.length);
}

export function getStandardAverage(standardIdx: number): number {
  const col = MASTERY_GRID.map((row) => row[standardIdx]);
  return Math.round(col.reduce((a, b) => a + b, 0) / col.length);
}

export function getWeakestStandardIdx(): number {
  const avgs = GRADE_8_UTAH_STANDARDS.map((_, i) => getStandardAverage(i));
  let minIdx = 0;
  avgs.forEach((avg, i) => {
    if (avg < avgs[minIdx]) minIdx = i;
  });
  return minIdx;
}

export function getAtRiskCount(threshold = 60, minStandards = 3): number {
  return MASTERY_GRID.reduce((count, row) => {
    const belowCount = row.filter((v) => v < threshold).length;
    return count + (belowCount >= minStandards ? 1 : 0);
  }, 0);
}
