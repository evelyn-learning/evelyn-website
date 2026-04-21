/**
 * Periodic table element data, compact form.
 *
 * Each element: [symbol, name, atomic number, atomic mass, row, col, category].
 * Row/col refer to display positions in the standard 18-column layout, with
 * lanthanides (row 9) and actinides (row 10) shown below the main table.
 */

export type ElementCategory =
  | 'alkali'
  | 'alkaline-earth'
  | 'transition'
  | 'post-transition'
  | 'metalloid'
  | 'reactive-nonmetal'
  | 'halogen'
  | 'noble-gas'
  | 'lanthanide'
  | 'actinide';

export interface Element {
  symbol: string;
  name: string;
  z: number;
  mass: number;
  row: number; // 1–10
  col: number; // 1–18 (3–17 for lanthanides/actinides)
  category: ElementCategory;
}

// Compact tuple form: [symbol, name, z, mass, row, col, category]
// Using rounded atomic masses (4 sig figs) — sufficient for visual display.
const RAW: Array<[string, string, number, number, number, number, ElementCategory]> = [
  ['H',  'Hydrogen',      1,   1.008, 1, 1,  'reactive-nonmetal'],
  ['He', 'Helium',        2,   4.003, 1, 18, 'noble-gas'],
  ['Li', 'Lithium',       3,   6.941, 2, 1,  'alkali'],
  ['Be', 'Beryllium',     4,   9.012, 2, 2,  'alkaline-earth'],
  ['B',  'Boron',         5,   10.81, 2, 13, 'metalloid'],
  ['C',  'Carbon',        6,   12.01, 2, 14, 'reactive-nonmetal'],
  ['N',  'Nitrogen',      7,   14.01, 2, 15, 'reactive-nonmetal'],
  ['O',  'Oxygen',        8,   16.00, 2, 16, 'reactive-nonmetal'],
  ['F',  'Fluorine',      9,   19.00, 2, 17, 'halogen'],
  ['Ne', 'Neon',         10,   20.18, 2, 18, 'noble-gas'],
  ['Na', 'Sodium',       11,   22.99, 3, 1,  'alkali'],
  ['Mg', 'Magnesium',    12,   24.31, 3, 2,  'alkaline-earth'],
  ['Al', 'Aluminum',     13,   26.98, 3, 13, 'post-transition'],
  ['Si', 'Silicon',      14,   28.09, 3, 14, 'metalloid'],
  ['P',  'Phosphorus',   15,   30.97, 3, 15, 'reactive-nonmetal'],
  ['S',  'Sulfur',       16,   32.07, 3, 16, 'reactive-nonmetal'],
  ['Cl', 'Chlorine',     17,   35.45, 3, 17, 'halogen'],
  ['Ar', 'Argon',        18,   39.95, 3, 18, 'noble-gas'],
  ['K',  'Potassium',    19,   39.10, 4, 1,  'alkali'],
  ['Ca', 'Calcium',      20,   40.08, 4, 2,  'alkaline-earth'],
  ['Sc', 'Scandium',     21,   44.96, 4, 3,  'transition'],
  ['Ti', 'Titanium',     22,   47.87, 4, 4,  'transition'],
  ['V',  'Vanadium',     23,   50.94, 4, 5,  'transition'],
  ['Cr', 'Chromium',     24,   52.00, 4, 6,  'transition'],
  ['Mn', 'Manganese',    25,   54.94, 4, 7,  'transition'],
  ['Fe', 'Iron',         26,   55.85, 4, 8,  'transition'],
  ['Co', 'Cobalt',       27,   58.93, 4, 9,  'transition'],
  ['Ni', 'Nickel',       28,   58.69, 4, 10, 'transition'],
  ['Cu', 'Copper',       29,   63.55, 4, 11, 'transition'],
  ['Zn', 'Zinc',         30,   65.38, 4, 12, 'transition'],
  ['Ga', 'Gallium',      31,   69.72, 4, 13, 'post-transition'],
  ['Ge', 'Germanium',    32,   72.64, 4, 14, 'metalloid'],
  ['As', 'Arsenic',      33,   74.92, 4, 15, 'metalloid'],
  ['Se', 'Selenium',     34,   78.96, 4, 16, 'reactive-nonmetal'],
  ['Br', 'Bromine',      35,   79.90, 4, 17, 'halogen'],
  ['Kr', 'Krypton',      36,   83.80, 4, 18, 'noble-gas'],
  ['Rb', 'Rubidium',     37,   85.47, 5, 1,  'alkali'],
  ['Sr', 'Strontium',    38,   87.62, 5, 2,  'alkaline-earth'],
  ['Y',  'Yttrium',      39,   88.91, 5, 3,  'transition'],
  ['Zr', 'Zirconium',    40,   91.22, 5, 4,  'transition'],
  ['Nb', 'Niobium',      41,   92.91, 5, 5,  'transition'],
  ['Mo', 'Molybdenum',   42,   95.96, 5, 6,  'transition'],
  ['Tc', 'Technetium',   43,   98.00, 5, 7,  'transition'],
  ['Ru', 'Ruthenium',    44,  101.07, 5, 8,  'transition'],
  ['Rh', 'Rhodium',      45,  102.91, 5, 9,  'transition'],
  ['Pd', 'Palladium',    46,  106.42, 5, 10, 'transition'],
  ['Ag', 'Silver',       47,  107.87, 5, 11, 'transition'],
  ['Cd', 'Cadmium',      48,  112.41, 5, 12, 'transition'],
  ['In', 'Indium',       49,  114.82, 5, 13, 'post-transition'],
  ['Sn', 'Tin',          50,  118.71, 5, 14, 'post-transition'],
  ['Sb', 'Antimony',     51,  121.76, 5, 15, 'metalloid'],
  ['Te', 'Tellurium',    52,  127.60, 5, 16, 'metalloid'],
  ['I',  'Iodine',       53,  126.90, 5, 17, 'halogen'],
  ['Xe', 'Xenon',        54,  131.29, 5, 18, 'noble-gas'],
  ['Cs', 'Cesium',       55,  132.91, 6, 1,  'alkali'],
  ['Ba', 'Barium',       56,  137.33, 6, 2,  'alkaline-earth'],
  ['La', 'Lanthanum',    57,  138.91, 9, 3,  'lanthanide'],
  ['Ce', 'Cerium',       58,  140.12, 9, 4,  'lanthanide'],
  ['Pr', 'Praseodymium', 59,  140.91, 9, 5,  'lanthanide'],
  ['Nd', 'Neodymium',    60,  144.24, 9, 6,  'lanthanide'],
  ['Pm', 'Promethium',   61,  145.00, 9, 7,  'lanthanide'],
  ['Sm', 'Samarium',     62,  150.36, 9, 8,  'lanthanide'],
  ['Eu', 'Europium',     63,  151.96, 9, 9,  'lanthanide'],
  ['Gd', 'Gadolinium',   64,  157.25, 9, 10, 'lanthanide'],
  ['Tb', 'Terbium',      65,  158.93, 9, 11, 'lanthanide'],
  ['Dy', 'Dysprosium',   66,  162.50, 9, 12, 'lanthanide'],
  ['Ho', 'Holmium',      67,  164.93, 9, 13, 'lanthanide'],
  ['Er', 'Erbium',       68,  167.26, 9, 14, 'lanthanide'],
  ['Tm', 'Thulium',      69,  168.93, 9, 15, 'lanthanide'],
  ['Yb', 'Ytterbium',    70,  173.05, 9, 16, 'lanthanide'],
  ['Lu', 'Lutetium',     71,  174.97, 9, 17, 'lanthanide'],
  ['Hf', 'Hafnium',      72,  178.49, 6, 4,  'transition'],
  ['Ta', 'Tantalum',     73,  180.95, 6, 5,  'transition'],
  ['W',  'Tungsten',     74,  183.84, 6, 6,  'transition'],
  ['Re', 'Rhenium',      75,  186.21, 6, 7,  'transition'],
  ['Os', 'Osmium',       76,  190.23, 6, 8,  'transition'],
  ['Ir', 'Iridium',      77,  192.22, 6, 9,  'transition'],
  ['Pt', 'Platinum',     78,  195.08, 6, 10, 'transition'],
  ['Au', 'Gold',         79,  196.97, 6, 11, 'transition'],
  ['Hg', 'Mercury',      80,  200.59, 6, 12, 'transition'],
  ['Tl', 'Thallium',     81,  204.38, 6, 13, 'post-transition'],
  ['Pb', 'Lead',         82,  207.20, 6, 14, 'post-transition'],
  ['Bi', 'Bismuth',      83,  208.98, 6, 15, 'post-transition'],
  ['Po', 'Polonium',     84,  209.00, 6, 16, 'post-transition'],
  ['At', 'Astatine',     85,  210.00, 6, 17, 'halogen'],
  ['Rn', 'Radon',        86,  222.00, 6, 18, 'noble-gas'],
  ['Fr', 'Francium',     87,  223.00, 7, 1,  'alkali'],
  ['Ra', 'Radium',       88,  226.00, 7, 2,  'alkaline-earth'],
  ['Ac', 'Actinium',     89,  227.00, 10, 3, 'actinide'],
  ['Th', 'Thorium',      90,  232.04, 10, 4, 'actinide'],
  ['Pa', 'Protactinium', 91,  231.04, 10, 5, 'actinide'],
  ['U',  'Uranium',      92,  238.03, 10, 6, 'actinide'],
  ['Np', 'Neptunium',    93,  237.00, 10, 7, 'actinide'],
  ['Pu', 'Plutonium',    94,  244.00, 10, 8, 'actinide'],
  ['Am', 'Americium',    95,  243.00, 10, 9, 'actinide'],
  ['Cm', 'Curium',       96,  247.00, 10, 10, 'actinide'],
  ['Bk', 'Berkelium',    97,  247.00, 10, 11, 'actinide'],
  ['Cf', 'Californium',  98,  251.00, 10, 12, 'actinide'],
  ['Es', 'Einsteinium',  99,  252.00, 10, 13, 'actinide'],
  ['Fm', 'Fermium',     100,  257.00, 10, 14, 'actinide'],
  ['Md', 'Mendelevium', 101,  258.00, 10, 15, 'actinide'],
  ['No', 'Nobelium',    102,  259.00, 10, 16, 'actinide'],
  ['Lr', 'Lawrencium',  103,  262.00, 10, 17, 'actinide'],
  ['Rf', 'Rutherfordium',104, 267.00, 7, 4,  'transition'],
  ['Db', 'Dubnium',     105,  268.00, 7, 5,  'transition'],
  ['Sg', 'Seaborgium',  106,  271.00, 7, 6,  'transition'],
  ['Bh', 'Bohrium',     107,  272.00, 7, 7,  'transition'],
  ['Hs', 'Hassium',     108,  270.00, 7, 8,  'transition'],
  ['Mt', 'Meitnerium',  109,  276.00, 7, 9,  'transition'],
  ['Ds', 'Darmstadtium',110, 281.00, 7, 10, 'transition'],
  ['Rg', 'Roentgenium', 111,  280.00, 7, 11, 'transition'],
  ['Cn', 'Copernicium', 112,  285.00, 7, 12, 'transition'],
  ['Nh', 'Nihonium',    113,  284.00, 7, 13, 'post-transition'],
  ['Fl', 'Flerovium',   114,  289.00, 7, 14, 'post-transition'],
  ['Mc', 'Moscovium',   115,  288.00, 7, 15, 'post-transition'],
  ['Lv', 'Livermorium', 116,  293.00, 7, 16, 'post-transition'],
  ['Ts', 'Tennessine',  117,  294.00, 7, 17, 'halogen'],
  ['Og', 'Oganesson',   118,  294.00, 7, 18, 'noble-gas'],
];

export const ELEMENTS: Element[] = RAW.map(
  ([symbol, name, z, mass, row, col, category]) => ({
    symbol,
    name,
    z,
    mass,
    row,
    col,
    category,
  })
);

export const ELEMENT_BY_SYMBOL = new Map(ELEMENTS.map((e) => [e.symbol, e]));

export const CATEGORY_COLORS: Record<ElementCategory, { bg: string; border: string }> = {
  'alkali':             { bg: '#fee2e2', border: '#fca5a5' },
  'alkaline-earth':     { bg: '#ffedd5', border: '#fdba74' },
  'transition':         { bg: '#fef3c7', border: '#fcd34d' },
  'post-transition':    { bg: '#d1fae5', border: '#6ee7b7' },
  'metalloid':          { bg: '#ccfbf1', border: '#5eead4' },
  'reactive-nonmetal':  { bg: '#dbeafe', border: '#93c5fd' },
  'halogen':            { bg: '#e0e7ff', border: '#a5b4fc' },
  'noble-gas':          { bg: '#f3e8ff', border: '#c4b5fd' },
  'lanthanide':         { bg: '#fce7f3', border: '#f9a8d4' },
  'actinide':           { bg: '#ffe4e6', border: '#fda4af' },
};

export const CATEGORY_LABELS: Record<ElementCategory, string> = {
  'alkali': 'Alkali metals',
  'alkaline-earth': 'Alkaline earth metals',
  'transition': 'Transition metals',
  'post-transition': 'Post-transition metals',
  'metalloid': 'Metalloids',
  'reactive-nonmetal': 'Reactive nonmetals',
  'halogen': 'Halogens',
  'noble-gas': 'Noble gases',
  'lanthanide': 'Lanthanides',
  'actinide': 'Actinides',
};
