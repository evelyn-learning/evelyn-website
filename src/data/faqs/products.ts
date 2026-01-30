import type { FAQItem } from '@/components/ui/FAQ';

/**
 * Product FAQs for GEO optimization
 * Each product has 5-7 FAQs covering key topics
 */

export const productFAQs: Record<string, FAQItem[]> = {
  'essay-ai': [
    {
      question: 'What is AI Essay Scoring and how does it work?',
      answer: 'AI Essay Scoring uses advanced natural language processing to evaluate student essays against established rubrics like SAT, ACT, and AP standards. The system analyzes writing structure, argumentation, grammar, and style to provide instant, detailed feedback in under 10 seconds.',
    },
    {
      question: 'How accurate is the AI compared to human graders?',
      answer: 'Our AI Essay Scoring system achieves 95% correlation with expert human graders. The system is trained on millions of scored essays and continuously refined by our team of 300+ educators to ensure pedagogically sound feedback.',
    },
    {
      question: 'Can I customize the scoring rubric for my organization?',
      answer: 'Yes, we support custom rubrics in addition to pre-configured SAT, ACT, AP, and college application rubrics. Our team can work with you to configure scoring criteria that match your specific curriculum and assessment goals.',
    },
    {
      question: 'Does the AI provide actionable feedback or just scores?',
      answer: 'Beyond numeric scores, our AI provides detailed category breakdowns, specific improvement suggestions, and before/after rewrite examples. Students receive actionable guidance they can immediately apply to strengthen their writing.',
    },
    {
      question: 'Is AI Essay Scoring available as a white-label solution?',
      answer: 'Absolutely. Our white-label deployment means students see your branding only. We provide full API access, customizable UI components, and dedicated integration support for seamless platform incorporation.',
    },
    {
      question: 'What types of essays can the AI score?',
      answer: 'Our system handles argumentative essays, persuasive writing, literary analysis, research papers, personal statements, and college application essays. It adapts to different grade levels from middle school through graduate programs.',
    },
  ],

  'homework-bot': [
    {
      question: 'What is the 24/7 AI Homework Helper?',
      answer: 'The 24/7 AI Homework Helper is an intelligent tutoring system that provides instant, step-by-step assistance for student questions anytime, anywhere. It covers math, science, English, history, and more—helping students learn without just giving away answers.',
    },
    {
      question: 'How does the AI ensure students actually learn?',
      answer: 'Our pedagogical approach uses the Socratic method, guiding students through problems with hints and scaffolded support rather than direct answers. This builds genuine understanding and problem-solving skills while maintaining academic integrity.',
    },
    {
      question: 'What subjects does the Homework Helper cover?',
      answer: 'The AI covers mathematics (algebra through calculus), sciences (physics, chemistry, biology), English language arts, history, social studies, and more. It\'s particularly strong in STEM subjects with step-by-step solution explanations.',
    },
    {
      question: 'Can the AI integrate with our existing tutoring platform?',
      answer: 'Yes, we offer full API integration, white-label deployment, and LMS connectors for Canvas, Blackboard, and Moodle. Students can access help directly within your branded platform.',
    },
    {
      question: 'How do you handle academic integrity concerns?',
      answer: 'Our AI is designed to teach, not cheat. It provides explanations and guidance rather than complete solutions, encourages multiple attempts, and includes configurable guardrails to prevent misuse.',
    },
    {
      question: 'What analytics do tutoring businesses receive?',
      answer: 'Access detailed analytics on student engagement, topic difficulty areas, question patterns, and session duration. This data helps identify struggling students and optimize your tutoring curriculum.',
    },
  ],

  'test-generator': [
    {
      question: 'How does the AI Practice Test Generator create unique tests?',
      answer: 'Our AI analyzes learning objectives and generates unlimited unique practice questions using advanced language models trained on educational content. Each test is different, preventing memorization while ensuring consistent difficulty and standards alignment.',
    },
    {
      question: 'What question types can the AI generate?',
      answer: 'The system creates multiple choice, fill-in-the-blank, short answer, matching, sequencing, and extended response questions. Each includes correct answers, detailed explanations, and difficulty ratings.',
    },
    {
      question: 'Can I align generated tests to specific standards?',
      answer: 'Yes, tests can be aligned to Common Core, NGSS, state standards, AP curricula, or your custom learning objectives. The AI ensures each question maps to specified competencies and skills.',
    },
    {
      question: 'How do students get feedback on their practice tests?',
      answer: 'Immediate scoring with detailed explanations for each question. Students see why answers are correct or incorrect, plus targeted recommendations for concepts they need to review.',
    },
    {
      question: 'Is this suitable for high-stakes test preparation?',
      answer: 'Our test generator is used by leading SAT, ACT, GRE, and GMAT prep companies. Questions are calibrated to match actual test difficulty and format, with item analysis to ensure quality.',
    },
    {
      question: 'What content areas are supported?',
      answer: 'We support K-12 subjects including math, ELA, science, and social studies, plus test prep for standardized exams, professional certifications, and higher education courses.',
    },
  ],

  'tutor-copilot': [
    {
      question: 'What is the AI Tutoring Co-Pilot?',
      answer: 'The AI Tutoring Co-Pilot augments human tutors with real-time AI assistance. It suggests explanations, generates practice problems, provides student insights, and handles routine queries—making every tutor as effective as your best tutor.',
    },
    {
      question: 'How does it improve tutoring session quality?',
      answer: 'The co-pilot offers real-time suggestions for teaching strategies, surfaces relevant practice problems, and provides background on student history and learning gaps. Tutors spend less time on prep and more time on personalized instruction.',
    },
    {
      question: 'Does it work with our existing tutoring software?',
      answer: 'Yes, we integrate with major tutoring platforms, video conferencing tools, and scheduling systems. Available as a browser extension or embedded widget for seamless tutor workflow integration.',
    },
    {
      question: 'What training do tutors need?',
      answer: 'Minimal training required—the interface is intuitive and suggestions are optional. We provide onboarding materials and ongoing support to help tutors maximize the AI\'s capabilities.',
    },
    {
      question: 'Can the AI take over basic tutoring tasks?',
      answer: 'The co-pilot handles routine questions and practice problem generation, freeing tutors for high-value interactions. For after-hours support, pair it with our 24/7 Homework Helper for complete coverage.',
    },
  ],

  'math-solver': [
    {
      question: 'What types of math problems can the AI solve?',
      answer: 'Our AI Math Solver handles arithmetic through calculus, including algebra, geometry, trigonometry, statistics, and pre-calculus. It shows complete step-by-step solutions with explanations for each step.',
    },
    {
      question: 'Does it just give answers or actually teach?',
      answer: 'The solver focuses on teaching through worked examples. Each solution includes the mathematical reasoning, relevant formulas, alternative approaches, and links to prerequisite concepts students may need to review.',
    },
    {
      question: 'Can students input problems by taking a photo?',
      answer: 'Yes, our image recognition system lets students photograph handwritten or printed math problems. The AI accurately transcribes and solves equations, graphs, and word problems from images.',
    },
    {
      question: 'How does it adapt to different skill levels?',
      answer: 'The AI adjusts explanation complexity based on the student\'s grade level and demonstrated understanding. It can provide simpler explanations for struggling students or more advanced techniques for advanced learners.',
    },
    {
      question: 'Is it suitable for standardized test prep?',
      answer: 'Absolutely. The solver includes SAT, ACT, and GRE math problem formats with test-taking strategies. Students can practice with realistic problems while learning efficient solution methods.',
    },
  ],

  'plagiarism-detection': [
    {
      question: 'How does the AI detect plagiarism and AI-generated content?',
      answer: 'Our system combines traditional database matching with advanced AI detection algorithms. It identifies copied text, paraphrased content, AI-generated writing, and contract cheating patterns with industry-leading accuracy.',
    },
    {
      question: 'What sources does it check against?',
      answer: 'We search billions of web pages, academic databases, previous student submissions, and published works. Our database includes journals, books, and institutional repositories for comprehensive coverage.',
    },
    {
      question: 'How accurate is the AI content detection?',
      answer: 'Our AI detection achieves high accuracy in identifying ChatGPT, Claude, and other AI-generated text. We continuously update our models as AI writing tools evolve, and provide confidence scores for transparent assessment.',
    },
    {
      question: 'Does it integrate with our LMS?',
      answer: 'Yes, we offer native integrations with Canvas, Blackboard, Moodle, and other major learning management systems. Submissions can be automatically checked without leaving your existing workflow.',
    },
    {
      question: 'How do you handle false positives?',
      answer: 'Our system provides highlighted text, source links, and confidence scores so educators can make informed decisions. We prioritize precision to minimize false accusations while catching genuine misconduct.',
    },
    {
      question: 'Is student data kept private?',
      answer: 'Absolutely. We\'re FERPA compliant and never share student submissions. Data is encrypted, submissions are not added to public databases, and you control data retention policies.',
    },
  ],

  'proctoring-suite': [
    {
      question: 'What is the AI Proctoring Suite?',
      answer: 'Our AI Proctoring Suite provides real-time exam monitoring using facial recognition, browser lockdown, and behavior analysis. It detects suspicious activity without requiring human proctors, scaling remote assessment cost-effectively.',
    },
    {
      question: 'How does the AI detect cheating?',
      answer: 'The system monitors for face detection anomalies (multiple faces, absence), tab switching, unauthorized browser activity, audio anomalies, and suspicious eye movements. Flagged events are timestamped for instructor review.',
    },
    {
      question: 'Is the technology accessible and inclusive?',
      answer: 'Yes, we\'ve designed the system with accessibility in mind. It works across lighting conditions, accommodates assistive technologies, and provides alternative verification methods when needed. WCAG 2.1 AA compliant.',
    },
    {
      question: 'What happens if the AI flags an incident?',
      answer: 'Instructors receive flagged incident reports with video clips and confidence scores. They make final decisions on academic integrity—the AI assists but doesn\'t replace human judgment.',
    },
    {
      question: 'How do students experience the proctored exam?',
      answer: 'Students complete a brief setup check, then take their exam normally. The system works silently in the background. Clear instructions and practice sessions reduce test anxiety.',
    },
    {
      question: 'Can it handle high-volume testing?',
      answer: 'Our infrastructure scales automatically for high-stakes testing events. We\'ve supported simultaneous proctoring of 100,000+ students for certification exams and university finals.',
    },
  ],

  'content-authoring': [
    {
      question: 'What is Content Authoring AI?',
      answer: 'Content Authoring AI transforms existing text into interactive, engaging learning experiences. It automatically generates questions, creates multimedia suggestions, and structures content for optimal learning outcomes.',
    },
    {
      question: 'What types of content can it create?',
      answer: 'The AI generates interactive lessons, quizzes, flashcards, summaries, study guides, and multimedia scripts. It can transform textbooks, articles, lectures, or any educational text into active learning materials.',
    },
    {
      question: 'How does it ensure content quality?',
      answer: 'Our AI is trained by 300+ educators and follows pedagogical best practices. Content is aligned to learning objectives, uses proven instructional design principles, and includes formative assessment checkpoints.',
    },
    {
      question: 'Can it maintain our institution\'s voice and style?',
      answer: 'Yes, the system can be trained on your existing content to match tone, terminology, and formatting preferences. Style guides can be configured to ensure consistency across all generated materials.',
    },
    {
      question: 'What output formats are supported?',
      answer: 'Export to SCORM, xAPI, H5P, PDF, Word, or integrate directly via API. Content works with all major LMS platforms and e-learning authoring tools.',
    },
  ],

  'reading-comprehension': [
    {
      question: 'How does Reading Comprehension AI work?',
      answer: 'The system performs deep passage analysis, identifying key themes, vocabulary, structure, and complexity. It auto-generates comprehension questions at multiple cognitive levels based on Bloom\'s taxonomy.',
    },
    {
      question: 'What reading levels does it support?',
      answer: 'From emerging readers through graduate-level texts. The AI accurately assesses text complexity using Lexile scores and adapts question difficulty accordingly.',
    },
    {
      question: 'Can it analyze any text I provide?',
      answer: 'Yes, upload fiction, non-fiction, articles, poems, or any text. The AI generates appropriate questions, vocabulary exercises, and discussion prompts for your specific content.',
    },
    {
      question: 'How does it support struggling readers?',
      answer: 'The system identifies vocabulary challenges, provides context clues, and generates scaffolded questions that build comprehension skills progressively.',
    },
    {
      question: 'Does it integrate with our curriculum?',
      answer: 'Yes, questions can be aligned to your reading standards and learning objectives. Export to your LMS or use our API for seamless integration.',
    },
  ],

  'curriculum-designer': [
    {
      question: 'What is the AI Curriculum Designer?',
      answer: 'The AI Curriculum Designer creates standards-aligned curriculum maps, lesson plans, and scope & sequence documents in minutes. It ensures coverage of required competencies while suggesting engaging activities and assessments.',
    },
    {
      question: 'Which standards does it support?',
      answer: 'Common Core, Next Generation Science Standards, state-specific standards, AP curricula, IB frameworks, and custom institutional standards. Our database includes thousands of standards across subjects and grade levels.',
    },
    {
      question: 'Can it adapt existing curricula?',
      answer: 'Yes, import your current curriculum for AI-powered gap analysis, alignment verification, and enhancement suggestions. Identify missing standards coverage or redundancies instantly.',
    },
    {
      question: 'How does it suggest instructional activities?',
      answer: 'The AI recommends evidence-based teaching strategies, hands-on activities, discussion prompts, and assessments matched to each learning objective and student population.',
    },
    {
      question: 'What output formats are available?',
      answer: 'Export curriculum maps, lesson plans, and pacing guides to PDF, Word, Google Docs, or popular curriculum management platforms.',
    },
  ],

  'adaptive-learning': [
    {
      question: 'What is the Adaptive Learning Engine?',
      answer: 'Our Adaptive Learning Engine uses AI to personalize learning paths for each student. It continuously assesses mastery, adjusts content difficulty, and recommends activities optimized for individual learning goals.',
    },
    {
      question: 'How does it personalize the learning experience?',
      answer: 'The engine analyzes student responses, time-on-task, and learning patterns to build a knowledge profile. It then serves content that addresses specific gaps while maintaining engagement and appropriate challenge.',
    },
    {
      question: 'Can it work with our existing content?',
      answer: 'Yes, import your courses, assessments, and learning objects. The AI maps content to skills and competencies, then delivers it adaptively based on individual student needs.',
    },
    {
      question: 'What data insights do educators receive?',
      answer: 'Instructors see real-time dashboards showing class mastery levels, struggling students, common misconceptions, and content effectiveness. Actionable recommendations help inform instruction.',
    },
    {
      question: 'Is it suitable for self-paced and instructor-led courses?',
      answer: 'Both. The engine supports fully self-paced learning, instructor-guided courses with adaptive practice, and blended models. Configure the degree of adaptation to match your pedagogical approach.',
    },
  ],

  'language-learning': [
    {
      question: 'What makes Language Learning AI different?',
      answer: 'Our AI provides immersive conversational practice in realistic scenarios—ordering at a restaurant, job interviews, travel situations. Unlike flashcard apps, students practice authentic communication with immediate feedback.',
    },
    {
      question: 'Which languages are supported?',
      answer: 'We currently support Spanish, French, German, Mandarin, Japanese, and English as a Second Language. Additional languages available for enterprise deployments.',
    },
    {
      question: 'How does speech recognition work?',
      answer: 'Advanced speech recognition evaluates pronunciation, fluency, and grammar in real-time. Students receive immediate feedback and can replay their responses to improve.',
    },
    {
      question: 'Can it adapt to different proficiency levels?',
      answer: 'Yes, the AI assesses proficiency and adjusts vocabulary, grammar complexity, and conversation speed. It follows CEFR standards (A1-C2) for consistent leveling.',
    },
    {
      question: 'Does it include grammar instruction?',
      answer: 'Grammar is taught contextually through conversation. The AI provides just-in-time explanations when errors occur and suggests focused grammar practice when patterns emerge.',
    },
  ],

  'analytics-dashboard': [
    {
      question: 'What insights does the Student Analytics Dashboard provide?',
      answer: 'Real-time visualization of student progress, engagement metrics, assessment performance, learning path completion, and predictive analytics. Identify at-risk students early and track intervention effectiveness.',
    },
    {
      question: 'What data sources can it integrate?',
      answer: 'Connect your LMS, SIS, assessment platforms, and attendance systems. The dashboard aggregates data for unified insights across all student touchpoints.',
    },
    {
      question: 'How does it identify struggling students?',
      answer: 'Our predictive analytics flag students showing early warning signs—declining grades, reduced engagement, incomplete assignments—before they reach crisis points.',
    },
    {
      question: 'Can I create custom reports?',
      answer: 'Yes, build custom dashboards with drag-and-drop visualization. Schedule automated reports for stakeholders including administrators, advisors, and parents.',
    },
    {
      question: 'Is student data privacy protected?',
      answer: 'Absolutely. We\'re FERPA, COPPA, and GDPR compliant with role-based access controls. Administrators define who sees what data with granular permissions.',
    },
  ],

  'accessibility-ai': [
    {
      question: 'What is Content Accessibility AI?',
      answer: 'Our AI scans educational content for WCAG 2.1 AA compliance issues and automatically suggests or applies fixes. It ensures all learners can access your digital materials regardless of ability.',
    },
    {
      question: 'What accessibility issues does it detect?',
      answer: 'The system checks for missing alt text, color contrast problems, heading structure, keyboard navigation, form labels, captioning, and reading order—plus over 50 other WCAG criteria.',
    },
    {
      question: 'Can it automatically fix issues?',
      answer: 'Yes, the AI can auto-generate alt text for images, suggest color adjustments, restructure headings, and create accessible table markup. Human review is recommended for complex fixes.',
    },
    {
      question: 'Does it work with our existing content management system?',
      answer: 'We integrate with popular CMS platforms, LMS systems, and can process PDF, Word, HTML, and EPUB documents. API access available for custom integrations.',
    },
    {
      question: 'How does it help with Universal Design for Learning?',
      answer: 'Beyond compliance, our AI suggests multiple means of representation, engagement, and expression—helping you create genuinely inclusive learning experiences.',
    },
  ],

  'virtual-labs': [
    {
      question: 'What are Virtual Lab Simulations?',
      answer: 'Interactive science experiments students can perform safely online. Our simulations cover biology, chemistry, and physics labs with realistic equipment, procedures, and data collection.',
    },
    {
      question: 'How realistic are the simulations?',
      answer: 'Simulations include accurate physics engines, realistic chemical reactions, and biological processes. Students collect data, make observations, and draw conclusions just like physical labs.',
    },
    {
      question: 'Can students make mistakes safely?',
      answer: 'Yes, that\'s a key benefit. Students can explore, make errors, and repeat experiments without safety risks, equipment costs, or material waste.',
    },
    {
      question: 'What subjects and grade levels are supported?',
      answer: 'We offer labs for middle school through undergraduate STEM courses. Topics include biology dissections, chemistry titrations, physics mechanics, and more.',
    },
    {
      question: 'How do instructors assess lab work?',
      answer: 'Built-in assessment captures student procedures, data, analysis, and conclusions. Instructors can review lab notebooks, grade reports, and provide feedback within the platform.',
    },
  ],

  'student-success-predictor': [
    {
      question: 'How does the Student Success Predictor work?',
      answer: 'Our AI analyzes student data patterns—grades, engagement, attendance, LMS activity—to identify students at risk of failing or dropping out. Early warnings enable timely intervention before problems escalate.',
    },
    {
      question: 'What data does it need?',
      answer: 'The system integrates with your SIS, LMS, and assessment platforms. More data sources improve prediction accuracy, but it can start with basic grade and attendance data.',
    },
    {
      question: 'How early can it predict student struggles?',
      answer: 'Depending on available data, the system can flag at-risk students within the first few weeks of a course—early enough for meaningful intervention.',
    },
    {
      question: 'What intervention recommendations does it provide?',
      answer: 'The AI suggests evidence-based interventions matched to each student\'s risk factors: tutoring, study skills workshops, advisor meetings, or academic coaching.',
    },
    {
      question: 'Is the AI\'s reasoning explainable?',
      answer: 'Yes, advisors see which factors contributed to risk scores. This transparency helps them have informed conversations with students and choose appropriate support strategies.',
    },
  ],

  'admissions-assistant': [
    {
      question: 'What is the AI Admissions Assistant?',
      answer: 'A 24/7 chatbot that answers prospective student questions, guides application completion, and provides personalized information about programs, financial aid, and campus life.',
    },
    {
      question: 'How does it improve enrollment?',
      answer: 'Immediate responses reduce inquiry abandonment. The AI handles 80% of common questions, letting admissions staff focus on high-value conversations with serious applicants.',
    },
    {
      question: 'Can it help with application review?',
      answer: 'Yes, our AI can pre-screen applications for completeness, flag missing materials, and even provide preliminary fit assessments based on your criteria.',
    },
    {
      question: 'Does it integrate with our CRM?',
      answer: 'We integrate with Slate, Salesforce, and other popular higher ed CRMs. All conversations sync automatically for complete prospect tracking.',
    },
    {
      question: 'How do we train it on our programs?',
      answer: 'Upload your website content, program brochures, and FAQs. The AI learns your specific offerings, deadlines, requirements, and institutional voice.',
    },
  ],

  'parent-engagement': [
    {
      question: 'What is the Parent Engagement Portal?',
      answer: 'An AI-powered communication platform that keeps families informed about student progress, school events, and educational resources—in their preferred language.',
    },
    {
      question: 'What languages does it support?',
      answer: 'Real-time translation for 100+ languages. Parents receive communications in their native language, and the AI translates their responses for teachers.',
    },
    {
      question: 'What information can parents access?',
      answer: 'Grades, attendance, assignments, teacher messages, behavior reports, and upcoming events. Configure access levels based on your school\'s preferences.',
    },
    {
      question: 'How does it improve family engagement?',
      answer: 'By removing language barriers and providing mobile-friendly access, more families stay connected. Automated nudges keep parents informed without adding to teacher workload.',
    },
    {
      question: 'Can teachers send personalized updates?',
      answer: 'Yes, teachers can send individual or class-wide updates. The AI suggests communication based on student activity and can auto-generate progress summaries.',
    },
  ],

  'career-pathways': [
    {
      question: 'What is Career Pathways AI?',
      answer: 'An AI-powered career guidance system that matches student skills and interests to careers, identifies skill gaps, and recommends learning pathways to reach career goals.',
    },
    {
      question: 'How does it assess skills?',
      answer: 'Through self-assessments, transcript analysis, work samples, and behavioral data. The AI builds a comprehensive skills profile mapped to industry competency frameworks.',
    },
    {
      question: 'Where does the career data come from?',
      answer: 'We aggregate real-time job market data, industry requirements, salary information, and growth projections from multiple authoritative sources.',
    },
    {
      question: 'Can it recommend specific courses?',
      answer: 'Yes, the AI maps skill gaps to available courses, credentials, and training programs—including your institution\'s offerings.',
    },
    {
      question: 'Is it suitable for workforce development programs?',
      answer: 'Absolutely. We work with workforce boards, community colleges, and corporate L&D teams to guide career transitions and upskilling initiatives.',
    },
  ],

  'corporate-training': [
    {
      question: 'What is Corporate Training AI?',
      answer: 'An enterprise learning platform that generates microlearning content, tracks compliance, analyzes skill gaps, and delivers personalized professional development at scale.',
    },
    {
      question: 'How does it create training content?',
      answer: 'The AI transforms existing materials—policies, procedures, documentation—into engaging microlearning modules, quizzes, and scenarios. Human SMEs review for accuracy.',
    },
    {
      question: 'What compliance features are included?',
      answer: 'Automated tracking, certification management, deadline reminders, and audit-ready reporting. Ensure your workforce maintains required credentials.',
    },
    {
      question: 'Does it integrate with our HRIS?',
      answer: 'Yes, we integrate with Workday, SAP SuccessFactors, Oracle HCM, and other HR systems for seamless user provisioning and training assignment.',
    },
    {
      question: 'What reporting do L&D leaders receive?',
      answer: 'Dashboards showing completion rates, skill development, compliance status, and training ROI. Identify high performers and those needing additional support.',
    },
    {
      question: 'Is content SCORM/xAPI compatible?',
      answer: 'Yes, all content exports to SCORM 1.2, SCORM 2004, and xAPI formats for use in any learning management system.',
    },
  ],

  'research-assistant': [
    {
      question: 'What is Research Assistant AI?',
      answer: 'An AI-powered tool that helps researchers with literature search, citation management, methodology design, and academic writing—accelerating the research process while maintaining scholarly rigor.',
    },
    {
      question: 'How does it help with literature review?',
      answer: 'The AI searches academic databases, summarizes papers, identifies key findings, and highlights gaps in existing research. It builds annotated bibliographies automatically.',
    },
    {
      question: 'Can it help with research methodology?',
      answer: 'Yes, the AI suggests appropriate research designs, statistical methods, and data collection approaches based on your research questions and constraints.',
    },
    {
      question: 'What citation styles are supported?',
      answer: 'APA, MLA, Chicago, Harvard, IEEE, and 6,000+ other citation styles. The AI formats references correctly and flags missing information.',
    },
    {
      question: 'How does it assist with academic writing?',
      answer: 'Beyond citation help, the AI provides feedback on argument structure, suggests improvements, and helps maintain academic tone and style.',
    },
  ],

  'course-creator-studio': [
    {
      question: 'What is AI Course Creator Studio?',
      answer: 'A platform that transforms any content—videos, documents, presentations—into structured online courses with learning objectives, assessments, and interactive elements.',
    },
    {
      question: 'What content formats can it process?',
      answer: 'Upload videos, PDFs, Word documents, PowerPoints, or existing course materials. The AI extracts content and restructures it into engaging learning experiences.',
    },
    {
      question: 'Does it create assessments automatically?',
      answer: 'Yes, the AI generates quizzes, knowledge checks, and discussion prompts aligned to learning objectives. Questions are varied and validated for quality.',
    },
    {
      question: 'Can I customize the course structure?',
      answer: 'Absolutely. Adjust module sequences, add or remove content, modify assessments, and apply your branding. The AI provides a starting point you refine.',
    },
    {
      question: 'What LMS platforms are supported?',
      answer: 'Export to SCORM, xAPI, or integrate directly with Canvas, Blackboard, Moodle, and other major learning management systems.',
    },
  ],

  'textbook-digitizer': [
    {
      question: 'What is the Textbook Digitizer?',
      answer: 'An AI platform that converts print textbooks into interactive digital formats—complete with auto-generated quizzes, study tools, accessibility features, and multimedia enhancements.',
    },
    {
      question: 'How does the digitization process work?',
      answer: 'Scan or upload PDFs of print textbooks. Our AI extracts text, figures, and structure, then enhances content with interactive elements, self-assessments, and study aids.',
    },
    {
      question: 'What interactive features are added?',
      answer: 'Auto-generated chapter quizzes, vocabulary flashcards, text-to-speech, highlighting, note-taking, search, and embedded videos where relevant.',
    },
    {
      question: 'Is the digital version accessible?',
      answer: 'Yes, all digitized content meets WCAG 2.1 AA standards with screen reader compatibility, keyboard navigation, and adjustable display options.',
    },
    {
      question: 'How fast is the conversion process?',
      answer: 'Our AI processes textbooks 10x faster than manual digitization. A typical 500-page textbook can be converted in days rather than weeks.',
    },
  ],
};
