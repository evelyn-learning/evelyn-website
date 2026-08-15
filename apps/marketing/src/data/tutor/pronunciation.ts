/**
 * Pronunciation Guide
 *
 * Per-subject pronunciation hints for the AI voice tutor.
 * These are injected into the system prompt based on the selected subject
 * so the TTS engine pronounces technical terms correctly.
 *
 * Format: term → phonetic guidance for the TTS model.
 * Keep entries concise — these go into the system prompt.
 */

export interface PronunciationEntry {
  term: string;
  say: string; // How the TTS should pronounce it
}

const pronunciationBySubject: Record<string, PronunciationEntry[]> = {
  // Computer Science / Programming
  'computer-science': [
    { term: 'char', say: 'car (not charred)' },
    { term: 'int', say: 'int (short for integer)' },
    { term: 'bool', say: 'bool (rhymes with pool)' },
    { term: 'IEEE', say: 'eye-triple-E' },
    { term: 'SQL', say: 'S-Q-L or sequel' },
    { term: 'GUI', say: 'gooey' },
    { term: 'CLI', say: 'C-L-I' },
    { term: 'API', say: 'A-P-I' },
    { term: 'regex', say: 'rej-ex' },
    { term: 'sudo', say: 'soo-doo' },
    { term: 'null', say: 'null (rhymes with hull)' },
    { term: 'enum', say: 'ee-num' },
    { term: 'args', say: 'args (like arguments)' },
    { term: 'params', say: 'pa-rams' },
    { term: 'async', say: 'ay-sink' },
    { term: 'stdin', say: 'standard-in' },
    { term: 'stdout', say: 'standard-out' },
    { term: 'FIFO', say: 'fye-foe' },
    { term: 'LIFO', say: 'lye-foe' },
    { term: 'deque', say: 'deck' },
    { term: 'tuple', say: 'tuh-pull or too-pull' },
    { term: 'byte', say: 'bite' },
    { term: 'cache', say: 'cash' },
    { term: 'daemon', say: 'dee-mon' },
    { term: 'GIF', say: 'GIF (hard G)' },
    { term: 'LaTeX', say: 'lah-tek' },
    { term: 'Linux', say: 'lin-ux' },
    { term: 'Dijkstra', say: 'dike-stra' },
    { term: 'Haskell', say: 'has-kell' },
    { term: 'Kotlin', say: 'kot-lin' },
    { term: 'kubectl', say: 'kube-control' },
    { term: 'chmod', say: 'ch-mod' },
    { term: 'println', say: 'print-line' },
    { term: 'charAt', say: 'car-at' },
    { term: 'indexOf', say: 'index-of' },
    { term: 'toString', say: 'to-string' },
    { term: 'parseInt', say: 'parse-int' },
    { term: 'ArrayList', say: 'array-list' },
    { term: 'HashMap', say: 'hash-map' },
    { term: 'instanceof', say: 'instance-of' },
    { term: 'sizeof', say: 'size-of' },
    { term: 'typedef', say: 'type-def' },
    { term: 'malloc', say: 'mal-ock' },
    { term: 'strcmp', say: 'string-compare' },
    { term: 'scanf', say: 'scan-eff' },
    { term: 'printf', say: 'print-eff' },
    { term: 'argc', say: 'arg-see' },
    { term: 'argv', say: 'arg-vee' },
  ],

  // Chemistry
  'chemistry': [
    { term: 'mole', say: 'mole (not mol-ay)' },
    { term: 'amine', say: 'a-meen' },
    { term: 'alkyl', say: 'al-kil' },
    { term: 'pH', say: 'P-H' },
    { term: 'NaCl', say: 'N-A-C-L or sodium chloride' },
    { term: 'HCl', say: 'H-C-L or hydrochloric acid' },
    { term: 'SiO2', say: 'S-I-O-2 or silicon dioxide' },
    { term: 'stoichiometry', say: 'stoy-kee-om-eh-tree' },
    { term: 'isomer', say: 'eye-so-mer' },
    { term: 'reagent', say: 'ree-ay-jent' },
    { term: 'titration', say: 'tie-tray-shun' },
    { term: 'molarity', say: 'moh-lair-ih-tee' },
    { term: 'enthalpy', say: 'en-thal-pee' },
    { term: 'aliquot', say: 'al-ih-kwot' },
  ],

  // Physics
  'physics': [
    { term: 'joule', say: 'jool' },
    { term: 'Euler', say: 'oy-ler' },
    { term: 'Bernoulli', say: 'ber-noo-lee' },
    { term: 'Coulomb', say: 'koo-lom' },
    { term: 'Planck', say: 'plonk' },
    { term: 'Bohr', say: 'bore' },
    { term: 'Gauss', say: 'gowss' },
    { term: 'Hertz', say: 'hurts' },
    { term: 'quark', say: 'kwark' },
    { term: 'Schrödinger', say: 'shroh-ding-er' },
    { term: 'Lagrangian', say: 'lah-gran-jee-en' },
    { term: 'eigenvalue', say: 'eye-gen-value' },
  ],

  // Mathematics
  'mathematics': [
    { term: 'Euler', say: 'oy-ler' },
    { term: 'Gauss', say: 'gowss' },
    { term: 'Fourier', say: 'foo-ree-ay' },
    { term: 'Laplace', say: 'lah-plass' },
    { term: 'Cauchy', say: 'koh-shee' },
    { term: 'eigenvalue', say: 'eye-gen-value' },
    { term: 'isosceles', say: 'eye-sos-uh-leez' },
    { term: 'hypotenuse', say: 'hy-pot-en-oos' },
    { term: 'asymptote', say: 'as-im-toht' },
    { term: 'logarithm', say: 'log-uh-rith-um' },
    { term: 'coefficients', say: 'koh-eh-fish-ents' },
  ],

  // Biology
  'biology': [
    { term: 'mitosis', say: 'my-toh-sis' },
    { term: 'meiosis', say: 'my-oh-sis' },
    { term: 'nucleotide', say: 'noo-klee-oh-tide' },
    { term: 'eukaryote', say: 'yoo-carry-oat' },
    { term: 'prokaryote', say: 'pro-carry-oat' },
    { term: 'nucleoid', say: 'noo-klee-oyd' },
    { term: 'organelle', say: 'or-guh-nell' },
    { term: 'ribosome', say: 'rye-boh-soam' },
    { term: 'enzyme', say: 'en-zyme' },
    { term: 'lysosome', say: 'lye-soh-soam' },
    { term: 'genome', say: 'jee-noam' },
    { term: 'phenotype', say: 'fee-no-type' },
    { term: 'genotype', say: 'jee-no-type' },
    { term: 'allele', say: 'uh-leel' },
  ],
};

// Subject aliases — map various subject strings to canonical keys
const subjectAliases: Record<string, string> = {
  'ap-computer-science-a': 'computer-science',
  'ap-cs-a': 'computer-science',
  'java': 'computer-science',
  'python': 'computer-science',
  'data-structures': 'computer-science',
  'algorithms': 'computer-science',
  'programming': 'computer-science',
  'web-development': 'computer-science',
  'ap-physics': 'physics',
  'ap-physics-1': 'physics',
  'ap-physics-2': 'physics',
  'mechanics': 'physics',
  'kinematics': 'physics',
  'ap-chemistry': 'chemistry',
  'organic-chemistry': 'chemistry',
  'ap-biology': 'biology',
  'cell-biology': 'biology',
  'genetics': 'biology',
  'algebra': 'mathematics',
  'geometry': 'mathematics',
  'calculus': 'mathematics',
  'trigonometry': 'mathematics',
  'statistics': 'mathematics',
  'precalculus': 'mathematics',
  'ap-calculus': 'mathematics',
  'ratios-proportions': 'mathematics',
  'integers-rational-numbers': 'mathematics',
  'angles': 'mathematics',
};

/**
 * Get pronunciation entries for a given subject/topic.
 * Returns an empty array if no entries exist.
 */
export function getPronunciationGuide(subject: string, topic?: string): PronunciationEntry[] {
  // Try exact match first
  const lower = subject.toLowerCase();
  if (pronunciationBySubject[lower]) {
    return pronunciationBySubject[lower];
  }

  // Try alias
  const alias = subjectAliases[lower];
  if (alias && pronunciationBySubject[alias]) {
    return pronunciationBySubject[alias];
  }

  // Try topic as fallback
  if (topic) {
    const topicLower = topic.toLowerCase();
    const topicAlias = subjectAliases[topicLower];
    if (topicAlias && pronunciationBySubject[topicAlias]) {
      return pronunciationBySubject[topicAlias];
    }
  }

  return [];
}

/**
 * Format pronunciation entries as a prompt section.
 * Returns empty string if no entries apply.
 */
export function formatPronunciationPrompt(subject: string, topic?: string): string {
  const entries = getPronunciationGuide(subject, topic);
  if (entries.length === 0) return '';

  const lines = entries.map(e => `- ${e.term}: say "${e.say}"`).join('\n');
  return `\n\n## Pronunciation Guide\nPronounce these technical terms correctly:\n${lines}\n`;
}
