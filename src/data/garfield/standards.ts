export interface UtahStandard {
  code: string;
  shortLabel: string;
  fullLabel: string;
  cluster: string;
}

export const GRADE_8_UTAH_STANDARDS: UtahStandard[] = [
  {
    code: '8.EE.A.1',
    shortLabel: 'Integer exponents',
    fullLabel: 'Know and apply the properties of integer exponents.',
    cluster: 'Expressions & Equations',
  },
  {
    code: '8.EE.B.6',
    shortLabel: 'Slope-intercept form',
    fullLabel: 'Derive the equation y = mx and y = mx + b for a line.',
    cluster: 'Expressions & Equations',
  },
  {
    code: '8.EE.C.7',
    shortLabel: 'Linear equations',
    fullLabel: 'Solve linear equations in one variable.',
    cluster: 'Expressions & Equations',
  },
  {
    code: '8.EE.C.8',
    shortLabel: 'Systems of equations',
    fullLabel: 'Analyze and solve pairs of simultaneous linear equations.',
    cluster: 'Expressions & Equations',
  },
  {
    code: '8.F.A.1',
    shortLabel: 'Understand functions',
    fullLabel: 'Understand that a function assigns exactly one output to each input.',
    cluster: 'Functions',
  },
  {
    code: '8.F.B.4',
    shortLabel: 'Construct linear functions',
    fullLabel: 'Construct a function to model a linear relationship between two quantities.',
    cluster: 'Functions',
  },
  {
    code: '8.G.B.7',
    shortLabel: 'Pythagorean theorem',
    fullLabel: 'Apply the Pythagorean theorem to determine unknown side lengths.',
    cluster: 'Geometry',
  },
  {
    code: '8.NS.A.1',
    shortLabel: 'Rational vs. irrational',
    fullLabel: 'Know that numbers that are not rational are called irrational.',
    cluster: 'Number System',
  },
];
