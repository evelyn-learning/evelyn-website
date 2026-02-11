'use client';

import React, { useState, useCallback, useRef } from 'react';

// ── Types ──────────────────────────────────────────────────────────────────

interface ChapterState {
  title: string;
  pages: string;
  status: 'pending' | 'processing' | 'complete';
  elements: { paragraphs: number; images: number; equations: number; tables: number };
}

interface Quiz {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

interface Flashcard {
  term: string;
  definition: string;
}

type SubjectId = 'economics' | 'biology' | 'physics' | 'history';
type TabId = 'upload' | 'preview' | 'enhance' | 'export';

// ── Subject Data ───────────────────────────────────────────────────────────

const SUBJECTS: { id: SubjectId; label: string; icon: string; title: string }[] = [
  { id: 'economics', label: 'Economics', icon: '💰', title: 'Principles of Economics (12th Ed.)' },
  { id: 'biology', label: 'Biology', icon: '🧬', title: 'Campbell Biology (14th Ed.)' },
  { id: 'physics', label: 'Physics', icon: '⚛️', title: 'University Physics (16th Ed.)' },
  { id: 'history', label: 'History', icon: '📜', title: 'A History of Western Society (14th Ed.)' },
];

// [paragraphs, images, equations, tables]
const CHAPTERS: Record<SubjectId, { title: string; pages: string; elems: [number, number, number, number] }[]> = {
  economics: [
    { title: 'Introduction to Economics', pages: '1-28', elems: [42, 6, 8, 4] },
    { title: 'Supply and Demand', pages: '29-56', elems: [58, 14, 12, 6] },
    { title: 'Market Equilibrium', pages: '57-82', elems: [36, 10, 6, 3] },
    { title: 'Elasticity', pages: '83-108', elems: [44, 8, 15, 5] },
    { title: 'Consumer & Producer Surplus', pages: '109-134', elems: [50, 12, 10, 4] },
  ],
  biology: [
    { title: 'The Cell: Structure & Function', pages: '1-32', elems: [55, 18, 4, 3] },
    { title: 'DNA and Genetics', pages: '33-64', elems: [48, 12, 6, 5] },
    { title: 'Evolution and Natural Selection', pages: '65-94', elems: [40, 10, 2, 4] },
    { title: 'Ecology and Ecosystems', pages: '95-126', elems: [52, 16, 3, 6] },
    { title: 'Human Anatomy Systems', pages: '127-160', elems: [60, 22, 5, 8] },
  ],
  physics: [
    { title: 'Kinematics: Motion in 1D', pages: '1-26', elems: [38, 8, 18, 3] },
    { title: "Newton's Laws of Motion", pages: '27-54', elems: [45, 10, 22, 4] },
    { title: 'Energy and Work', pages: '55-80', elems: [42, 6, 16, 5] },
    { title: 'Waves and Sound', pages: '81-108', elems: [50, 14, 12, 3] },
    { title: 'Electricity and Magnetism', pages: '109-138', elems: [55, 12, 20, 6] },
  ],
  history: [
    { title: 'Ancient Civilizations', pages: '1-30', elems: [52, 16, 0, 6] },
    { title: 'The Classical World', pages: '31-62', elems: [48, 12, 0, 8] },
    { title: 'Medieval Period', pages: '63-94', elems: [44, 10, 0, 5] },
    { title: 'Renaissance & Reformation', pages: '95-128', elems: [56, 18, 0, 7] },
    { title: 'Modern Era', pages: '129-160', elems: [62, 20, 2, 9] },
  ],
};

const QUIZZES: Record<SubjectId, Quiz[]> = {
  economics: [
    { question: 'According to the law of demand, when price increases, quantity demanded:', options: ['Increases', 'Decreases', 'Stays the same', 'Depends on supply'], correct: 1, explanation: 'The law of demand states an inverse relationship between price and quantity demanded.' },
    { question: 'What shifts the supply curve to the right?', options: ['Higher input costs', 'Fewer sellers', 'New regulations', 'Lower input costs'], correct: 3, explanation: 'Lower input costs make production cheaper, increasing supply at every price level.' },
    { question: 'At market equilibrium:', options: ['There is a surplus', 'There is a shortage', 'Qs equals Qd', 'Price is maximized'], correct: 2, explanation: 'Equilibrium is where quantity supplied equals quantity demanded.' },
    { question: 'If demand is inelastic, a 10% price increase causes Qd to:', options: ['Fall more than 10%', 'Fall less than 10%', 'Rise 10%', 'Not change'], correct: 1, explanation: 'Inelastic demand means % change in Qd is less than % change in price.' },
    { question: 'Consumer surplus is the area:', options: ['Below supply, above price', 'Above demand, below price', 'Below demand, above price', 'Between S and D'], correct: 2, explanation: 'Consumer surplus is the area below the demand curve and above the equilibrium price.' },
  ],
  biology: [
    { question: 'Which organelle produces ATP?', options: ['Nucleus', 'Ribosome', 'Mitochondria', 'Golgi apparatus'], correct: 2, explanation: 'Mitochondria convert glucose into ATP through cellular respiration.' },
    { question: 'DNA strands are held together by:', options: ['Covalent bonds', 'Ionic bonds', 'Hydrogen bonds', 'Peptide bonds'], correct: 2, explanation: 'Hydrogen bonds form between complementary base pairs (A-T and G-C).' },
    { question: 'Natural selection was proposed by:', options: ['Mendel', 'Darwin', 'Pasteur', 'Watson'], correct: 1, explanation: 'Charles Darwin proposed natural selection in "On the Origin of Species" (1859).' },
    { question: 'Decomposers in an ecosystem:', options: ['Produce oxygen', 'Break down dead matter', 'Photosynthesize', 'Fix nitrogen'], correct: 1, explanation: 'Decomposers recycle nutrients by breaking down dead organic material.' },
    { question: 'Meiosis produces:', options: ['2 identical cells', '4 unique haploid cells', '4 identical cells', '2 haploid cells'], correct: 1, explanation: 'Meiosis produces 4 genetically unique haploid cells through two rounds of division.' },
  ],
  physics: [
    { question: 'At the highest point of a thrown ball, acceleration is:', options: ['Zero', '9.8 m/s\u00B2 up', '9.8 m/s\u00B2 down', 'Undefined'], correct: 2, explanation: 'Gravitational acceleration is always 9.8 m/s\u00B2 downward near Earth\'s surface.' },
    { question: 'Newton\'s Third Law: when you push a wall, the wall:', options: ['Does nothing', 'Pushes back equally', 'Pushes back harder', 'Absorbs the force'], correct: 1, explanation: 'Every action has an equal and opposite reaction.' },
    { question: 'A ball rolling down a frictionless ramp gains:', options: ['Potential energy', 'Kinetic energy', 'Thermal energy', 'Chemical energy'], correct: 1, explanation: 'Potential energy converts to kinetic energy as the ball descends.' },
    { question: 'Sound travels fastest in:', options: ['Air', 'Water', 'Steel', 'Vacuum'], correct: 2, explanation: 'Sound is fastest in solids \u2014 molecules are closer, transmitting vibrations efficiently.' },
    { question: 'Doubling the current through a resistor:', options: ['Halves power', 'Doubles power', 'Quadruples power', 'No effect'], correct: 2, explanation: 'P = I\u00B2R, so doubling current quadruples power dissipation.' },
  ],
  history: [
    { question: 'The first known writing system (cuneiform) was developed by:', options: ['Egyptians', 'Sumerians', 'Chinese', 'Indus Valley'], correct: 1, explanation: 'Sumerians developed cuneiform around 3400 BCE in Mesopotamia.' },
    { question: 'Athens in the Classical period practiced:', options: ['Monarchy', 'Oligarchy', 'Direct democracy', 'Republic'], correct: 2, explanation: 'Athens practiced direct democracy where eligible citizens voted on legislation.' },
    { question: 'The feudal system was based on:', options: ['Trade', 'Land and loyalty', 'Religion', 'Conquest'], correct: 1, explanation: 'Feudalism exchanged land grants for military service and loyalty.' },
    { question: 'The European printing press was invented by:', options: ['Da Vinci', 'Luther', 'Gutenberg', 'Copernicus'], correct: 2, explanation: 'Gutenberg\'s movable-type press (c. 1440) revolutionized information spread.' },
    { question: 'The Industrial Revolution began in:', options: ['France', 'Germany', 'United States', 'England'], correct: 3, explanation: 'England\'s textile industry and coal resources sparked industrialization in the 18th century.' },
  ],
};

const FLASHCARDS: Record<SubjectId, Flashcard[]> = {
  economics: [
    { term: 'Opportunity Cost', definition: 'The value of the next best alternative foregone when making a choice.' },
    { term: 'Equilibrium Price', definition: 'The price at which quantity supplied equals quantity demanded.' },
    { term: 'Price Elasticity', definition: 'A measure of how much Qd responds to a change in price.' },
    { term: 'Consumer Surplus', definition: 'The difference between willingness to pay and actual price paid.' },
    { term: 'Marginal Cost', definition: 'The additional cost of producing one more unit of a good.' },
    { term: 'Deadweight Loss', definition: 'Loss of economic efficiency when equilibrium is not achieved.' },
  ],
  biology: [
    { term: 'Mitosis', definition: 'Cell division producing two identical daughter cells.' },
    { term: 'Genotype', definition: 'The genetic makeup of an organism (allele combinations).' },
    { term: 'Phenotype', definition: 'The observable physical characteristics of an organism.' },
    { term: 'Natural Selection', definition: 'Better-adapted organisms tend to survive and reproduce more.' },
    { term: 'Homeostasis', definition: 'Maintaining a stable internal environment in living organisms.' },
    { term: 'Photosynthesis', definition: 'Process by which plants convert sunlight into chemical energy.' },
  ],
  physics: [
    { term: 'Velocity', definition: 'Rate of change of displacement (speed with direction).' },
    { term: 'Inertia', definition: 'Tendency of an object to resist changes in its motion.' },
    { term: 'Kinetic Energy', definition: 'Energy of motion: KE = \u00BDmv\u00B2.' },
    { term: 'Wavelength', definition: 'Distance between successive wave crests or troughs.' },
    { term: 'Ohm\'s Law', definition: 'V = IR \u2014 voltage equals current times resistance.' },
    { term: 'Momentum', definition: 'Product of mass and velocity: p = mv.' },
  ],
  history: [
    { term: 'Mesopotamia', definition: 'Region between Tigris and Euphrates; "cradle of civilization."' },
    { term: 'Pax Romana', definition: 'A roughly 200-year period of peace and stability in the Roman Empire.' },
    { term: 'Feudalism', definition: 'Medieval system exchanging land for military service.' },
    { term: 'Renaissance', definition: '14th\u201317th century cultural movement emphasizing classical learning.' },
    { term: 'Magna Carta', definition: '1215 charter limiting English monarch\'s power.' },
    { term: 'Industrial Revolution', definition: 'Transition from agrarian to industrial manufacturing (18th\u201319th c.).' },
  ],
};

const SUMMARIES: Record<SubjectId, string[]> = {
  economics: [
    'Introduces fundamental economic concepts including scarcity, opportunity cost, and the basic economic problem. Students learn how individuals, businesses, and governments make choices with limited resources.',
    'Explores how buyers and sellers interact in markets. Covers the determinants of demand and supply, graphing curves, and understanding market dynamics through shifts and movements.',
    'Examines how markets reach equilibrium through supply and demand interaction. Discusses price controls (ceilings and floors) and how markets adjust to surpluses and shortages.',
    'Introduces elasticity as a measure of responsiveness. Covers price elasticity of demand and supply, income elasticity, and cross-price elasticity with real-world applications.',
    'Analyzes welfare economics through consumer and producer surplus. Demonstrates how markets maximize total surplus at equilibrium and introduces deadweight loss from market interventions.',
  ],
  biology: [
    'Examines the fundamental unit of life. Covers prokaryotic and eukaryotic cell structures, organelle functions, and the cell membrane\'s role in transport and signaling.',
    'Explores DNA, RNA, and protein synthesis. Covers Mendelian genetics, inheritance patterns, and modern applications of genetic technology.',
    'Presents Darwin\'s theory of evolution through natural selection. Discusses evidence for evolution, speciation, and the mechanisms driving genetic variation.',
    'Studies interactions between organisms and their environments. Covers food webs, nutrient cycling, biomes, and the impact of human activity on ecosystems.',
    'Surveys major human body systems including circulatory, nervous, respiratory, and digestive. Emphasizes how systems work together to maintain homeostasis.',
  ],
  physics: [
    'Introduces the study of motion in one dimension. Covers displacement, velocity, acceleration, and the kinematic equations used to describe and predict linear motion.',
    'Presents Newton\'s three laws of motion and their applications. Students learn to draw free-body diagrams, analyze forces, and solve problems involving friction and tension.',
    'Explores the concepts of work, energy, and power. Covers kinetic and potential energy, the work-energy theorem, and the principle of conservation of energy.',
    'Studies the properties and behavior of mechanical waves and sound. Covers wavelength, frequency, amplitude, standing waves, resonance, and the Doppler effect.',
    'Introduces electric charges, electric fields, circuits, and magnetic fields. Covers Coulomb\'s law, Ohm\'s law, series/parallel circuits, and electromagnetic induction.',
  ],
  history: [
    'Surveys the earliest civilizations in Mesopotamia, Egypt, the Indus Valley, and China. Examines the development of writing, agriculture, religion, and early forms of government.',
    'Explores Greek and Roman civilizations including their political systems, philosophy, art, and lasting influence on Western culture.',
    'Examines the medieval period including feudalism, the Catholic Church\'s influence, the Crusades, and social and economic changes leading to the end of the era.',
    'Covers the cultural rebirth of the Renaissance and the religious upheaval of the Reformation. Discusses key figures, artistic achievements, and the impact on European society.',
    'Explores the modern era from the Enlightenment through industrialization, world wars, and contemporary globalization.',
  ],
};

// ── Component ──────────────────────────────────────────────────────────────

export default function TextbookDigitizerDemo() {
  const [activeTab, setActiveTab] = useState<TabId>('upload');
  const [subject, setSubject] = useState<SubjectId | null>(null);
  const [bookTitle, setBookTitle] = useState('');
  const [chapters, setChapters] = useState<ChapterState[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processed, setProcessed] = useState(false);

  const [expandedChapter, setExpandedChapter] = useState<number | null>(null);
  const [previewChapter, setPreviewChapter] = useState<number | null>(null);

  const [quizIdx, setQuizIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [flashcardIdx, setFlashcardIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [generatedItems, setGeneratedItems] = useState<Set<string>>(new Set());
  const [generating, setGenerating] = useState<string | null>(null);

  const [selectedFormat, setSelectedFormat] = useState<string | null>(null);
  const [exportOptions, setExportOptions] = useState({ quizzes: true, flashcards: true, summaries: true, audio: false });
  const [exporting, setExporting] = useState(false);
  const [exportDone, setExportDone] = useState(false);

  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>();

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3000);
  }, []);

  const quizzes = subject ? QUIZZES[subject] : [];
  const flashcards = subject ? FLASHCARDS[subject] : [];
  const summaries = subject ? SUMMARIES[subject] : [];
  const subjectInfo = SUBJECTS.find(s => s.id === subject);
  const displayTitle = bookTitle || subjectInfo?.title || '';

  const totalElements = chapters.reduce(
    (acc, ch) => ({
      paragraphs: acc.paragraphs + ch.elements.paragraphs,
      images: acc.images + ch.elements.images,
      equations: acc.equations + ch.elements.equations,
      tables: acc.tables + ch.elements.tables,
    }),
    { paragraphs: 0, images: 0, equations: 0, tables: 0 },
  );

  const totalPages = subject
    ? CHAPTERS[subject].reduce((acc, ch) => {
        const [s, e] = ch.pages.split('-').map(Number);
        return acc + (e - s + 1);
      }, 0)
    : 0;

  const processedPages = chapters
    .filter(c => c.status === 'complete')
    .reduce((acc, ch) => {
      const [s, e] = ch.pages.split('-').map(Number);
      return acc + (e - s + 1);
    }, 0);

  // ── Process textbook ───────────────────────────────────────────────────

  const processTextbook = useCallback(() => {
    if (!subject) return;
    const chapData = CHAPTERS[subject];

    setChapters(
      chapData.map(ch => ({
        title: ch.title,
        pages: ch.pages,
        status: 'pending' as const,
        elements: { paragraphs: 0, images: 0, equations: 0, tables: 0 },
      })),
    );
    setIsProcessing(true);

    chapData.forEach((ch, idx) => {
      setTimeout(() => {
        setChapters(prev => prev.map((c, i) => (i === idx ? { ...c, status: 'processing' as const } : c)));
      }, idx * 1200);

      setTimeout(() => {
        setChapters(prev =>
          prev.map((c, i) =>
            i === idx
              ? {
                  ...c,
                  status: 'complete' as const,
                  elements: { paragraphs: ch.elems[0], images: ch.elems[1], equations: ch.elems[2], tables: ch.elems[3] },
                }
              : c,
          ),
        );
        if (idx === chapData.length - 1) {
          setTimeout(() => {
            setIsProcessing(false);
            setProcessed(true);
            setActiveTab('preview');
            showToast('Textbook processed successfully!');
          }, 400);
        }
      }, idx * 1200 + 800);
    });
  }, [subject, showToast]);

  // ── Generate enhancement items ─────────────────────────────────────────

  const generateItem = useCallback(
    (type: string) => {
      if (generatedItems.has(type) || generating) return;
      setGenerating(type);
      setTimeout(() => {
        setGeneratedItems(prev => new Set([...prev, type]));
        setGenerating(null);
        const labels: Record<string, string> = {
          quizzes: 'Quiz questions generated',
          flashcards: 'Flashcard deck created',
          summaries: 'Chapter summaries generated',
          glossary: 'Key term glossary compiled',
        };
        showToast(labels[type] || `${type} generated`);
      }, 1500);
    },
    [generatedItems, generating, showToast],
  );

  const generateAll = useCallback(() => {
    const types = ['quizzes', 'flashcards', 'summaries', 'glossary'];
    const remaining = types.filter(t => !generatedItems.has(t));
    if (remaining.length === 0) {
      showToast('All elements already generated!');
      return;
    }
    remaining.forEach((type, idx) => {
      setTimeout(() => {
        setGenerating(type);
        setTimeout(() => {
          setGeneratedItems(prev => new Set([...prev, type]));
          setGenerating(null);
          if (idx === remaining.length - 1) showToast('All learning elements generated!');
        }, 800);
      }, idx * 1000);
    });
  }, [generatedItems, showToast]);

  // ── Export ──────────────────────────────────────────────────────────────

  const handleExport = useCallback(() => {
    if (!selectedFormat) {
      showToast('Please select an export format');
      return;
    }
    setExporting(true);
    setTimeout(() => {
      setExporting(false);
      setExportDone(true);
      showToast(`Exported as ${selectedFormat} successfully!`);
    }, 2500);
  }, [selectedFormat, showToast]);

  const resetAll = useCallback(() => {
    setProcessed(false);
    setSubject(null);
    setBookTitle('');
    setChapters([]);
    setGeneratedItems(new Set());
    setExportDone(false);
    setSelectedFormat(null);
    setExpandedChapter(null);
    setPreviewChapter(null);
    setQuizIdx(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setFlashcardIdx(0);
    setFlipped(false);
    setActiveTab('upload');
  }, []);

  // ── Not-processed placeholder ──────────────────────────────────────────

  const notProcessedPlaceholder = (
    <div className="text-center py-16 text-gray-400">
      <span className="text-5xl block mb-4">📤</span>
      <p className="text-lg">Process a textbook first</p>
      <button onClick={() => setActiveTab('upload')} className="mt-4 text-amber-600 hover:text-amber-700 font-medium">
        Go to Upload
      </button>
    </div>
  );

  // ── Render ─────────────────────────────────────────────────────────────

  return (
    <div className="bg-gradient-to-br from-slate-50 to-amber-50 p-6 rounded-2xl">
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-gray-900 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium">
          {toast}
        </div>
      )}

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-1 rounded-full text-sm font-medium mb-4">
            <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
            Interactive Demo
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Textbook Digitizer</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Convert print textbooks to interactive digital formats with auto-generated quizzes, flashcards, and study tools.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {([
            { id: 'upload' as TabId, label: 'Upload & Process', icon: '📤' },
            { id: 'preview' as TabId, label: 'Content Preview', icon: '👁️' },
            { id: 'enhance' as TabId, label: 'AI Enhancement', icon: '✨' },
            { id: 'export' as TabId, label: 'Export Options', icon: '📦' },
          ]).map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                activeTab === tab.id ? 'bg-amber-600 text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          {/* ────────────────── UPLOAD TAB ────────────────── */}
          {activeTab === 'upload' && (
            <div className="space-y-6">
              {!processed && !isProcessing && (
                <>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Select a Subject</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {SUBJECTS.map(s => (
                        <button
                          key={s.id}
                          onClick={() => { setSubject(s.id); setBookTitle(''); }}
                          className={`p-4 rounded-xl border-2 text-center transition ${
                            subject === s.id ? 'border-amber-500 bg-amber-50' : 'border-gray-200 hover:border-amber-300'
                          }`}
                        >
                          <span className="text-3xl block mb-2">{s.icon}</span>
                          <span className="font-medium text-gray-900">{s.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {subject && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Book Title (optional)</label>
                      <input
                        type="text"
                        value={bookTitle}
                        onChange={e => setBookTitle(e.target.value)}
                        placeholder={subjectInfo?.title}
                        className="w-full p-3 border border-gray-200 rounded-xl text-sm"
                      />
                    </div>
                  )}
                </>
              )}

              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition ${
                  isProcessing ? 'border-amber-300 bg-amber-50' : subject ? 'border-amber-400 bg-amber-50/30' : 'border-gray-300'
                }`}
              >
                {isProcessing ? (
                  <div>
                    <div className="w-16 h-16 mx-auto mb-4 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Processing Textbook...</h3>
                    <p className="text-gray-600 mb-4">AI is analyzing content structure and extracting elements</p>
                    <div className="max-w-md mx-auto space-y-2 text-left">
                      {chapters.map((ch, idx) => (
                        <div key={idx} className="flex items-center gap-3 text-sm">
                          <span
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${
                              ch.status === 'complete'
                                ? 'bg-green-100 text-green-600'
                                : ch.status === 'processing'
                                  ? 'bg-amber-100 text-amber-600'
                                  : 'bg-gray-100 text-gray-400'
                            }`}
                          >
                            {ch.status === 'complete' ? '✓' : ch.status === 'processing' ? '···' : idx + 1}
                          </span>
                          <span
                            className={
                              ch.status === 'complete'
                                ? 'text-green-700'
                                : ch.status === 'processing'
                                  ? 'text-amber-700 font-medium'
                                  : 'text-gray-400'
                            }
                          >
                            {ch.title}
                          </span>
                          {ch.status === 'processing' && (
                            <span className="ml-auto text-amber-500 animate-pulse text-xs">Processing...</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : processed ? (
                  <div>
                    <span className="text-5xl">📚</span>
                    <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-2">{displayTitle}</h3>
                    <p className="text-gray-600">
                      {totalPages} pages &middot; {chapters.length} chapters &middot; Processed successfully
                    </p>
                    <button onClick={resetAll} className="mt-4 text-amber-600 hover:text-amber-700 font-medium">
                      Process Different Textbook
                    </button>
                  </div>
                ) : (
                  <div>
                    <span className="text-5xl">📄</span>
                    <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-2">
                      {subject ? 'Ready to Process' : 'Upload Your Textbook'}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {subject
                        ? `${subjectInfo?.title} \u2014 ${CHAPTERS[subject].length} chapters detected`
                        : 'Select a subject above to simulate textbook processing'}
                    </p>
                    <button
                      onClick={processTextbook}
                      disabled={!subject}
                      className={`px-6 py-3 font-medium rounded-xl transition ${
                        subject ? 'bg-amber-600 text-white hover:bg-amber-700' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      Process Textbook
                    </button>
                    <p className="text-sm text-gray-500 mt-4">Supports PDF, EPUB, DOCX &middot; Max 500MB</p>
                  </div>
                )}
              </div>

              {processed && (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="bg-gray-50 p-4 rounded-xl text-center">
                    <div className="text-2xl font-bold text-gray-900">{totalPages}</div>
                    <div className="text-sm text-gray-500">Total Pages</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-xl text-center">
                    <div className="text-2xl font-bold text-green-600">{processedPages}</div>
                    <div className="text-sm text-gray-500">Processed</div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-xl text-center">
                    <div className="text-2xl font-bold text-blue-600">{totalElements.paragraphs}</div>
                    <div className="text-sm text-gray-500">Paragraphs</div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-xl text-center">
                    <div className="text-2xl font-bold text-purple-600">{totalElements.images}</div>
                    <div className="text-sm text-gray-500">Images</div>
                  </div>
                  <div className="bg-amber-50 p-4 rounded-xl text-center">
                    <div className="text-2xl font-bold text-amber-600">{totalElements.equations + totalElements.tables}</div>
                    <div className="text-sm text-gray-500">Equations & Tables</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ────────────────── PREVIEW TAB ────────────────── */}
          {activeTab === 'preview' &&
            (!processed
              ? notProcessedPlaceholder
              : (
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Chapter Structure</h3>
                    <span className="text-sm text-gray-500">{displayTitle}</span>
                  </div>

                  <div className="space-y-3">
                    {chapters.map((chapter, idx) => (
                      <div
                        key={idx}
                        className={`rounded-xl border transition ${
                          expandedChapter === idx ? 'border-amber-500 bg-amber-50' : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div onClick={() => setExpandedChapter(expandedChapter === idx ? null : idx)} className="p-4 cursor-pointer">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-green-100 text-green-600 text-sm font-medium">
                                ✓
                              </span>
                              <div>
                                <h4 className="font-medium text-gray-900">{chapter.title}</h4>
                                <p className="text-sm text-gray-500">Pages {chapter.pages}</p>
                              </div>
                            </div>
                            <span className="text-gray-400">{expandedChapter === idx ? '▲' : '▼'}</span>
                          </div>
                        </div>

                        {expandedChapter === idx && (
                          <div className="px-4 pb-4 border-t border-gray-200 pt-4">
                            <div className="grid grid-cols-4 gap-4 mb-4">
                              <div className="text-center">
                                <div className="text-xl font-bold text-gray-900">{chapter.elements.paragraphs}</div>
                                <div className="text-xs text-gray-500">Paragraphs</div>
                              </div>
                              <div className="text-center">
                                <div className="text-xl font-bold text-gray-900">{chapter.elements.images}</div>
                                <div className="text-xs text-gray-500">Images</div>
                              </div>
                              <div className="text-center">
                                <div className="text-xl font-bold text-blue-600">{chapter.elements.equations}</div>
                                <div className="text-xs text-gray-500">Equations</div>
                              </div>
                              <div className="text-center">
                                <div className="text-xl font-bold text-amber-600">{chapter.elements.tables}</div>
                                <div className="text-xs text-gray-500">Tables</div>
                              </div>
                            </div>

                            <button
                              onClick={() => setPreviewChapter(previewChapter === idx ? null : idx)}
                              className="w-full py-2 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-700"
                            >
                              {previewChapter === idx ? 'Hide Summary' : 'Preview Chapter'}
                            </button>

                            {previewChapter === idx && summaries[idx] && (
                              <div className="mt-4 p-4 bg-white rounded-lg border border-amber-200">
                                <h5 className="text-sm font-semibold text-gray-900 mb-2">AI-Generated Summary</h5>
                                <p className="text-sm text-gray-600 leading-relaxed">{summaries[idx]}</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}

          {/* ────────────────── ENHANCE TAB ────────────────── */}
          {activeTab === 'enhance' &&
            (!processed
              ? notProcessedPlaceholder
              : (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">AI-Generated Learning Elements</h3>

                  {/* Generate grid */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">Generate Learning Elements</h4>
                      <button
                        onClick={generateAll}
                        disabled={generating !== null}
                        className="px-4 py-1.5 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-700 disabled:opacity-50"
                      >
                        Generate All
                      </button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {([
                        { id: 'quizzes', label: 'Quiz Questions', count: `${quizzes.length} questions`, icon: '❓' },
                        { id: 'flashcards', label: 'Flashcards', count: `${flashcards.length} cards`, icon: '🎴' },
                        { id: 'summaries', label: 'Summaries', count: `${chapters.length} chapters`, icon: '📝' },
                        { id: 'glossary', label: 'Glossary', count: `${flashcards.length + 4} terms`, icon: '📖' },
                      ]).map(item => (
                        <button
                          key={item.id}
                          onClick={() => generateItem(item.id)}
                          disabled={generatedItems.has(item.id) || generating !== null}
                          className={`p-3 rounded-xl text-center transition ${
                            generatedItems.has(item.id)
                              ? 'bg-green-50 border-2 border-green-200'
                              : generating === item.id
                                ? 'bg-amber-50 border-2 border-amber-300 animate-pulse'
                                : 'bg-white border-2 border-gray-200 hover:border-amber-300'
                          }`}
                        >
                          <span className="text-2xl block mb-1">{item.icon}</span>
                          <span className="text-sm font-medium block">{item.label}</span>
                          <span className="text-xs text-gray-500 block">
                            {generatedItems.has(item.id) ? '✓ Generated' : generating === item.id ? 'Generating...' : item.count}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quiz section */}
                  {generatedItems.has('quizzes') && quizzes.length > 0 && (
                    <div className="bg-blue-50 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">❓</span>
                          <h4 className="font-medium text-gray-900">Auto-Generated Quiz</h4>
                        </div>
                        <span className="text-sm text-gray-500">
                          Question {quizIdx + 1} of {quizzes.length}
                        </span>
                      </div>

                      <p className="text-gray-800 mb-4 font-medium">{quizzes[quizIdx].question}</p>

                      <div className="space-y-2 mb-4">
                        {quizzes[quizIdx].options.map((option, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              setSelectedAnswer(idx);
                              setShowExplanation(true);
                            }}
                            className={`w-full p-3 text-left rounded-lg border transition text-sm ${
                              selectedAnswer === idx
                                ? idx === quizzes[quizIdx].correct
                                  ? 'border-green-500 bg-green-50 text-green-800'
                                  : 'border-red-500 bg-red-50 text-red-800'
                                : selectedAnswer !== null && idx === quizzes[quizIdx].correct
                                  ? 'border-green-500 bg-green-50 text-green-800'
                                  : 'border-gray-200 bg-white hover:border-blue-300'
                            }`}
                          >
                            <span className="font-medium mr-2">{String.fromCharCode(65 + idx)}.</span>
                            {option}
                            {selectedAnswer !== null && idx === quizzes[quizIdx].correct && (
                              <span className="float-right text-green-600">✓</span>
                            )}
                            {selectedAnswer === idx && idx !== quizzes[quizIdx].correct && (
                              <span className="float-right text-red-600">✗</span>
                            )}
                          </button>
                        ))}
                      </div>

                      {showExplanation && (
                        <div className="p-4 bg-white rounded-lg border border-blue-200 mb-4">
                          <h5 className="font-medium text-gray-900 mb-1 text-sm">Explanation</h5>
                          <p className="text-sm text-gray-600">{quizzes[quizIdx].explanation}</p>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setQuizIdx(Math.max(0, quizIdx - 1));
                            setSelectedAnswer(null);
                            setShowExplanation(false);
                          }}
                          disabled={quizIdx === 0}
                          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm disabled:opacity-30"
                        >
                          Previous
                        </button>
                        <button
                          onClick={() => {
                            setQuizIdx(Math.min(quizzes.length - 1, quizIdx + 1));
                            setSelectedAnswer(null);
                            setShowExplanation(false);
                          }}
                          disabled={quizIdx === quizzes.length - 1}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-30"
                        >
                          Next Question
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Flashcard section */}
                  {generatedItems.has('flashcards') && flashcards.length > 0 && (
                    <div className="bg-purple-50 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">🎴</span>
                          <h4 className="font-medium text-gray-900">Flashcard Deck</h4>
                        </div>
                        <span className="text-sm text-gray-500">
                          Card {flashcardIdx + 1} of {flashcards.length}
                        </span>
                      </div>

                      <button
                        onClick={() => setFlipped(!flipped)}
                        className="w-full min-h-[140px] p-6 rounded-xl bg-white border-2 border-purple-200 hover:border-purple-400 transition-all cursor-pointer text-center"
                      >
                        {!flipped ? (
                          <div>
                            <div className="text-xs text-gray-400 mb-2 uppercase tracking-wider">Term</div>
                            <div className="text-xl font-bold text-gray-900">{flashcards[flashcardIdx].term}</div>
                            <div className="text-xs text-purple-500 mt-4">Click to flip</div>
                          </div>
                        ) : (
                          <div>
                            <div className="text-xs text-gray-400 mb-2 uppercase tracking-wider">Definition</div>
                            <div className="text-gray-700 leading-relaxed">{flashcards[flashcardIdx].definition}</div>
                            <div className="text-xs text-purple-500 mt-4">Click to flip back</div>
                          </div>
                        )}
                      </button>

                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() => {
                            setFlashcardIdx(Math.max(0, flashcardIdx - 1));
                            setFlipped(false);
                          }}
                          disabled={flashcardIdx === 0}
                          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm disabled:opacity-30"
                        >
                          Previous
                        </button>
                        <button
                          onClick={() => {
                            setFlashcardIdx(Math.min(flashcards.length - 1, flashcardIdx + 1));
                            setFlipped(false);
                          }}
                          disabled={flashcardIdx === flashcards.length - 1}
                          className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 disabled:opacity-30"
                        >
                          Next Card
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Summaries section */}
                  {generatedItems.has('summaries') && (
                    <div className="bg-green-50 rounded-xl p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-xl">📝</span>
                        <h4 className="font-medium text-gray-900">Chapter Summaries</h4>
                      </div>
                      <div className="space-y-3">
                        {chapters.map((ch, idx) => (
                          <div key={idx} className="p-3 bg-white rounded-lg border border-green-200">
                            <h5 className="text-sm font-semibold text-gray-900 mb-1">{ch.title}</h5>
                            <p className="text-sm text-gray-600">{summaries[idx]}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}

          {/* ────────────────── EXPORT TAB ────────────────── */}
          {activeTab === 'export' &&
            (!processed
              ? notProcessedPlaceholder
              : (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">Export Your Digital Textbook</h3>

                  <div className="grid md:grid-cols-3 gap-4">
                    {([
                      { id: 'EPUB 3', desc: 'Interactive e-reader format', icon: '📱', popular: true },
                      { id: 'Web (HTML5)', desc: 'Browser-based reading', icon: '🌐', popular: false },
                      { id: 'PDF (Enhanced)', desc: 'Print-ready with links', icon: '📄', popular: false },
                      { id: 'LMS Package', desc: 'SCORM/LTI compatible', icon: '🎓', popular: true },
                      { id: 'Kindle (KF8)', desc: 'Amazon ecosystem', icon: '📚', popular: false },
                      { id: 'API/JSON', desc: 'Raw content access', icon: '⚙️', popular: false },
                    ]).map(format => (
                      <button
                        key={format.id}
                        onClick={() => {
                          setSelectedFormat(format.id);
                          setExportDone(false);
                        }}
                        className={`relative p-4 rounded-xl border-2 text-left transition ${
                          selectedFormat === format.id ? 'border-amber-500 bg-amber-50' : 'border-gray-200 hover:border-amber-300'
                        }`}
                      >
                        {format.popular && (
                          <span className="absolute -top-2 -right-2 px-2 py-0.5 bg-amber-500 text-white text-xs font-medium rounded-full">
                            Popular
                          </span>
                        )}
                        {selectedFormat === format.id && (
                          <span className="absolute top-2 right-2 w-5 h-5 bg-amber-500 text-white rounded-full flex items-center justify-center text-xs">
                            ✓
                          </span>
                        )}
                        <span className="text-3xl block mb-1">{format.icon}</span>
                        <h4 className="font-medium text-gray-900">{format.id}</h4>
                        <p className="text-sm text-gray-500">{format.desc}</p>
                      </button>
                    ))}
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Include in Export</h4>
                    <div className="grid md:grid-cols-2 gap-x-8 gap-y-2">
                      {([
                        { key: 'quizzes' as const, label: 'Quiz questions & answers' },
                        { key: 'flashcards' as const, label: 'Flashcard deck' },
                        { key: 'summaries' as const, label: 'Chapter summaries' },
                        { key: 'audio' as const, label: 'Audio narration' },
                      ]).map(opt => (
                        <label key={opt.key} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={exportOptions[opt.key]}
                            onChange={e => setExportOptions(prev => ({ ...prev, [opt.key]: e.target.checked }))}
                            className="rounded text-amber-600"
                          />
                          <span className="text-sm text-gray-700">{opt.label}</span>
                          {opt.key !== 'audio' && !generatedItems.has(opt.key) && (
                            <span className="text-xs text-amber-600">(not yet generated)</span>
                          )}
                        </label>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleExport}
                    disabled={!selectedFormat || exporting}
                    className={`w-full py-3 font-semibold rounded-xl transition ${
                      !selectedFormat || exporting
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : exportDone
                          ? 'bg-green-600 text-white hover:bg-green-700'
                          : 'bg-amber-600 text-white hover:bg-amber-700'
                    }`}
                  >
                    {exporting ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Exporting...
                      </span>
                    ) : exportDone ? (
                      '✓ Download Ready \u2014 Export Again?'
                    ) : (
                      'Export Digital Textbook'
                    )}
                  </button>
                </div>
              ))}
        </div>

        {/* Feature cards */}
        <div className="mt-8 grid md:grid-cols-4 gap-4">
          {([
            { icon: '📄', title: 'PDF to Digital', desc: 'Intelligent extraction' },
            { icon: '❓', title: 'Auto Quizzes', desc: 'AI-generated tests' },
            { icon: '🎴', title: 'Flashcards', desc: 'Study tool creation' },
            { icon: '♿', title: 'Accessible', desc: 'WCAG compliant' },
          ]).map((feature, idx) => (
            <div key={idx} className="bg-white rounded-xl p-4 text-center shadow">
              <span className="text-2xl">{feature.icon}</span>
              <h4 className="font-medium text-gray-900 mt-2">{feature.title}</h4>
              <p className="text-sm text-gray-500">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
