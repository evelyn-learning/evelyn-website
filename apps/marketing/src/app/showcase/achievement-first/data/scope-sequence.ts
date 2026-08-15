export interface ScopeUnit {
  name: string;
  weeks: string;
  status: 'completed' | 'current' | 'upcoming';
  lessons: string[];
}

export interface ScopeCycle {
  cycle: number;
  name: string;
  dateRange: string;
  units: ScopeUnit[];
}

export const SCOPE_SEQUENCE: Record<3 | 6, ScopeCycle[]> = {
  3: [
    // ─── Cycle 1: Operations & Algebraic Thinking ──────────────
    {
      cycle: 1,
      name: 'Operations & Algebraic Thinking',
      dateRange: 'Sep 4 – Oct 25',
      units: [
        {
          name: 'Addition & Subtraction Strategies',
          weeks: 'Weeks 1–3',
          status: 'completed',
          lessons: [
            'Lesson 1.1: Regrouping with Addition',
            'Lesson 1.2: Subtraction with Borrowing',
            'Lesson 1.3: Word Problems — Addition & Subtraction',
            'Lesson 1.4: Mental Math Strategies',
          ],
        },
        {
          name: 'Multiplication Concepts',
          weeks: 'Weeks 4–6',
          status: 'completed',
          lessons: [
            'Lesson 1.5: Equal Groups & Repeated Addition',
            'Lesson 1.6: Arrays and Area Models',
            'Lesson 1.7: Commutative & Associative Properties',
            'Lesson 1.8: Multiplication Facts (2s, 5s, 10s)',
          ],
        },
        {
          name: 'Division Introduction',
          weeks: 'Weeks 7–8',
          status: 'completed',
          lessons: [
            'Lesson 1.9: Division as Equal Sharing',
            'Lesson 1.10: Relationship Between Multiplication & Division',
            'Lesson 1.11: Division Facts & Strategies',
          ],
        },
      ],
    },

    // ─── Cycle 2: Number & Fractions ────────────────────────────
    {
      cycle: 2,
      name: 'Number & Fractions',
      dateRange: 'Oct 28 – Dec 20',
      units: [
        {
          name: 'Understanding Fractions',
          weeks: 'Weeks 9–11',
          status: 'completed',
          lessons: [
            'Lesson 2.1: What Is a Fraction?',
            'Lesson 2.2: Fractions on a Number Line',
            'Lesson 2.3: Equivalent Fractions',
            'Lesson 2.4: Comparing Fractions',
          ],
        },
        {
          name: 'Adding Fractions with Like Denominators',
          weeks: 'Weeks 12–14',
          status: 'current',
          lessons: [
            'Lesson 3.1: Parts of a Whole Review',
            'Lesson 3.2: Adding Fractions — Visual Models',
            'Lesson 3.3: Adding Fractions — Number Lines',
            'Lesson 3.4: Adding Fractions with Like Denominators',
            'Lesson 3.5: Word Problems with Fraction Addition',
          ],
        },
        {
          name: 'Fractions & Measurement',
          weeks: 'Weeks 15–16',
          status: 'upcoming',
          lessons: [
            'Lesson 3.6: Fractions of a Set',
            'Lesson 3.7: Measuring to the Nearest Quarter Inch',
            'Lesson 3.8: Fraction Review & Assessment',
          ],
        },
      ],
    },

    // ─── Cycle 3: Measurement & Data ────────────────────────────
    {
      cycle: 3,
      name: 'Measurement & Data',
      dateRange: 'Jan 6 – Feb 21',
      units: [
        {
          name: 'Time & Measurement',
          weeks: 'Weeks 17–19',
          status: 'upcoming',
          lessons: [
            'Lesson 4.1: Telling Time to the Minute',
            'Lesson 4.2: Elapsed Time',
            'Lesson 4.3: Measuring Length (Customary & Metric)',
            'Lesson 4.4: Liquid Volume & Mass',
          ],
        },
        {
          name: 'Area & Perimeter',
          weeks: 'Weeks 20–22',
          status: 'upcoming',
          lessons: [
            'Lesson 4.5: Understanding Perimeter',
            'Lesson 4.6: Calculating Area with Unit Squares',
            'Lesson 4.7: Area & Perimeter Word Problems',
          ],
        },
      ],
    },

    // ─── Cycle 4: Geometry & Patterns ───────────────────────────
    {
      cycle: 4,
      name: 'Geometry & Patterns',
      dateRange: 'Feb 24 – Apr 11',
      units: [
        {
          name: 'Shapes & Attributes',
          weeks: 'Weeks 23–25',
          status: 'upcoming',
          lessons: [
            'Lesson 5.1: Classifying Quadrilaterals',
            'Lesson 5.2: Polygons & Their Properties',
            'Lesson 5.3: Partitioning Shapes into Equal Parts',
          ],
        },
        {
          name: 'Patterns & Problem Solving',
          weeks: 'Weeks 26–28',
          status: 'upcoming',
          lessons: [
            'Lesson 5.4: Number Patterns & Rules',
            'Lesson 5.5: Input-Output Tables',
            'Lesson 5.6: Multi-Step Word Problems',
          ],
        },
      ],
    },

    // ─── Cycle 5: Science Integration ───────────────────────────
    {
      cycle: 5,
      name: 'Science Integration',
      dateRange: 'Apr 14 – Jun 6',
      units: [
        {
          name: 'Life Cycles',
          weeks: 'Weeks 29–31',
          status: 'upcoming',
          lessons: [
            'Lesson 6.1: Life Cycles of Plants',
            'Lesson 6.2: Life Cycles of Animals',
            'Lesson 6.3: Comparing Plant & Animal Life Cycles',
          ],
        },
        {
          name: 'Forces, Motion & Weather',
          weeks: 'Weeks 32–34',
          status: 'upcoming',
          lessons: [
            'Lesson 6.4: Pushes & Pulls — Forces & Motion',
            'Lesson 6.5: The Water Cycle',
            'Lesson 6.6: Weather Patterns & Prediction',
          ],
        },
        {
          name: 'End-of-Year Review',
          weeks: 'Weeks 35–36',
          status: 'upcoming',
          lessons: [
            'Lesson 6.7: Math & Science Review',
            'Lesson 6.8: End-of-Year Assessment',
          ],
        },
      ],
    },
  ],

  6: [
    // ─── Cycle 1: Ratios & Proportional Reasoning ───────────────
    {
      cycle: 1,
      name: 'Ratios & Proportional Reasoning',
      dateRange: 'Sep 4 – Oct 25',
      units: [
        {
          name: 'Understanding Ratios',
          weeks: 'Weeks 1–3',
          status: 'completed',
          lessons: [
            'Lesson 6.1: Introduction to Ratios',
            'Lesson 6.2: Writing Ratios in Three Forms',
            'Lesson 6.3: Equivalent Ratios',
            'Lesson 6.4: Ratio Tables',
          ],
        },
        {
          name: 'Rates & Proportions',
          weeks: 'Weeks 4–6',
          status: 'completed',
          lessons: [
            'Lesson 6.5: Unit Rates',
            'Lesson 6.6: Comparing Rates',
            'Lesson 6.7: Ratios & Proportional Relationships',
            'Lesson 6.8: Solving Proportions with Cross-Multiplication',
          ],
        },
        {
          name: 'Percent & Ratio Applications',
          weeks: 'Weeks 7–8',
          status: 'completed',
          lessons: [
            'Lesson 6.9: Percent as a Ratio',
            'Lesson 6.10: Real-World Proportion Problems',
            'Lesson 6.11: Ratio & Proportion Assessment',
          ],
        },
      ],
    },

    // ─── Cycle 2: Expressions & Equations ────────────────────────
    {
      cycle: 2,
      name: 'Expressions & Equations',
      dateRange: 'Oct 28 – Dec 20',
      units: [
        {
          name: 'Algebraic Expressions',
          weeks: 'Weeks 9–11',
          status: 'completed',
          lessons: [
            'Lesson 7.1: Variables & Expressions',
            'Lesson 7.2: Evaluating Expressions',
            'Lesson 7.3: Writing Expressions from Words',
            'Lesson 7.4: Order of Operations (PEMDAS)',
          ],
        },
        {
          name: 'One-Step Equations',
          weeks: 'Weeks 12–14',
          status: 'current',
          lessons: [
            'Lesson 7.5: What Is an Equation?',
            'Lesson 7.6: Solving Addition & Subtraction Equations',
            'Lesson 7.7: Solving Multiplication & Division Equations',
            'Lesson 7.8: Equation Word Problems',
          ],
        },
        {
          name: 'Inequalities',
          weeks: 'Weeks 15–16',
          status: 'upcoming',
          lessons: [
            'Lesson 7.9: Writing Inequalities',
            'Lesson 7.10: Graphing Inequalities on a Number Line',
            'Lesson 7.11: Expressions & Equations Assessment',
          ],
        },
      ],
    },

    // ─── Cycle 3: Geometry ──────────────────────────────────────
    {
      cycle: 3,
      name: 'Geometry',
      dateRange: 'Jan 6 – Feb 21',
      units: [
        {
          name: 'Area of Polygons',
          weeks: 'Weeks 17–19',
          status: 'upcoming',
          lessons: [
            'Lesson 8.1: Area of Parallelograms',
            'Lesson 8.2: Area of Triangles',
            'Lesson 8.3: Area of Trapezoids & Composite Shapes',
            'Lesson 8.4: Area Word Problems',
          ],
        },
        {
          name: 'Surface Area & Volume',
          weeks: 'Weeks 20–22',
          status: 'upcoming',
          lessons: [
            'Lesson 8.5: Nets & Surface Area',
            'Lesson 8.6: Volume of Rectangular Prisms',
            'Lesson 8.7: Geometry Assessment',
          ],
        },
      ],
    },

    // ─── Cycle 4: Statistics & Probability ──────────────────────
    {
      cycle: 4,
      name: 'Statistics & Probability',
      dateRange: 'Feb 24 – Apr 11',
      units: [
        {
          name: 'Data Analysis',
          weeks: 'Weeks 23–25',
          status: 'upcoming',
          lessons: [
            'Lesson 9.1: Statistical Questions',
            'Lesson 9.2: Mean, Median, Mode & Range',
            'Lesson 9.3: Dot Plots & Histograms',
          ],
        },
        {
          name: 'Data Distribution',
          weeks: 'Weeks 26–28',
          status: 'upcoming',
          lessons: [
            'Lesson 9.4: Box Plots',
            'Lesson 9.5: Interpreting Data Displays',
            'Lesson 9.6: Statistics Assessment',
          ],
        },
      ],
    },

    // ─── Cycle 5: Science Integration ───────────────────────────
    {
      cycle: 5,
      name: 'Science Integration',
      dateRange: 'Apr 14 – Jun 6',
      units: [
        {
          name: 'Cells & Organisms',
          weeks: 'Weeks 29–31',
          status: 'upcoming',
          lessons: [
            'Lesson 10.1: Cell Structure & Function',
            'Lesson 10.2: Plant vs. Animal Cells',
            'Lesson 10.3: Body Systems Overview',
          ],
        },
        {
          name: 'Electricity & Space',
          weeks: 'Weeks 32–34',
          status: 'upcoming',
          lessons: [
            'Lesson 10.4: Electricity & Circuits',
            'Lesson 10.5: Conductors & Insulators',
            'Lesson 10.6: Space & Astronomy',
          ],
        },
        {
          name: 'End-of-Year Review',
          weeks: 'Weeks 35–36',
          status: 'upcoming',
          lessons: [
            'Lesson 10.7: Math & Science Review',
            'Lesson 10.8: End-of-Year Assessment',
          ],
        },
      ],
    },
  ],
};
