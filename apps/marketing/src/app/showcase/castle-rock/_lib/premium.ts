import type { Subject } from "./types";

/**
 * Premium (enhanced) AI solutions. Each one is a self-contained page under
 * public/showcase/castle-rock/premium/<itemId>/ (solution.html + audio/),
 * the same folder that would be zipped for SOLARO and shown there in an
 * iframe. The showcase embeds it the same way.
 */
export type PremiumSolution = {
  itemId: string;
  subject: Subject;
  course: string;
  itemType: string;
  topic: string;
  title: string;
  /** What the board does while the voice explains. */
  blurb: string;
  /** The practice task that opens after the explanation. */
  practice: string;
  voice: string;
  /** True when the item came without an answer key and was solved from the question alone. */
  independent?: boolean;
  /** Height of the embedded frame in px; the page lays itself out inside it. */
  frameHeight: number;
};

export const PREMIUM: PremiumSolution[] = [
  {
    itemId: "301823",
    subject: "Mathematics",
    course: "Mathematics 30-1",
    itemType: "Multiple choice",
    topic: "Permutations with repeated letters",
    title: "Arrangements of RED DEER that begin with R",
    blurb: "Seven letter tiles. One R slides into the first place, the rest are sorted into identical groups, and swapping two identical tiles shows why 3! and 2! are divided out.",
    practice: "Drag the numbers into the formula.",
    voice: "Mr. Joseph",
    frameHeight: 620,
  },
  {
    itemId: "234035",
    subject: "Physics",
    course: "Physics 30",
    itemType: "Multiple choice",
    topic: "Momentum in two dimensions",
    title: "Two cars collide at an intersection",
    blurb: "The cars collide on the board, each momentum becomes an arrow, the arrows join tip to tail and the resultant is measured. The same item is in the regular samples, so the two grades can be compared.",
    practice: "Drag the arrows tip to tail yourself.",
    voice: "Mr. Joseph",
    frameHeight: 620,
  },
  {
    itemId: "239622",
    subject: "Chemistry",
    course: "Chemistry 30",
    itemType: "Numerical response",
    topic: "Potential energy diagrams",
    title: "Which descriptions fit the energy diagram",
    blurb: "A marker runs the reaction over the hill. The two energy levels, the ΔH arrow and the activation-energy arrow are drawn as they are spoken and compared.",
    practice: "Drag the ΔH and Ea labels onto the arrows.",
    voice: "Ms. Michelle",
    independent: true,
    frameHeight: 620,
  },
  {
    itemId: "146440",
    subject: "Biology",
    course: "Biology 30",
    itemType: "Numerical response",
    topic: "Population growth curves",
    title: "Order the phases of the sigmoid growth curve",
    blurb: "The curve is shown as the item gives it, then named one region at a time as the voice reaches it, with the carrying capacity drawn in.",
    practice: "Drag the four phase names into order.",
    voice: "Ms. Michelle",
    independent: true,
    frameHeight: 620,
  },
];

export const findPremium = (itemId: string) => PREMIUM.find((p) => p.itemId === itemId);

export const premiumSrc = (itemId: string) => `/showcase/castle-rock/premium/${itemId}/solution.html`;
