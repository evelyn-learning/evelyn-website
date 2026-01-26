// =============================================================================
// AI EDUCATION SERVICES - EXPRESS BACKEND
// =============================================================================
// Stack: Express + MongoDB + Claude API
// 
// This file contains all the API routes for the four AI services:
// 1. Homework Help Bot
// 2. Essay Scoring
// 3. Practice Test Generator
// 4. Tutoring Co-Pilot
// =============================================================================

const express = require('express');
const router = express.Router();
const Anthropic = require('@anthropic-ai/sdk');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');

// =============================================================================
// CONFIGURATION
// =============================================================================

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Rate limiting for API protection
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { error: 'Too many requests, please try again later.' }
});

// =============================================================================
// MONGOOSE SCHEMAS
// =============================================================================

// Conversation Schema (for Homework Bot)
const conversationSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },
  subject: { type: String },
  messages: [{
    role: { type: String, enum: ['user', 'assistant'], required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Essay Submission Schema
const essaySubmissionSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },
  essayType: { type: String, enum: ['sat', 'act', 'college', 'ap', 'custom'], required: true },
  essayText: { type: String, required: true },
  wordCount: { type: Number },
  feedback: {
    overallScore: Number,
    overallAssessment: String,
    categories: [{
      name: String,
      score: Number,
      observations: [String],
      suggestions: [String]
    }],
    priorityImprovements: [String],
    rewriteExample: {
      original: String,
      improved: String,
      explanation: String
    }
  },
  createdAt: { type: Date, default: Date.now }
});

// Generated Test Schema
const generatedTestSchema = new mongoose.Schema({
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },
  testType: { type: String, required: true },
  subject: { type: String, required: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true },
  questions: [{
    questionText: String,
    options: {
      A: String,
      B: String,
      C: String,
      D: String
    },
    correctAnswer: String,
    explanation: String,
    concept: String
  }],
  createdAt: { type: Date, default: Date.now }
});

// Tutoring Session Schema
const tutoringSessionSchema = new mongoose.Schema({
  tutorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tutor', required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },
  subject: String,
  topic: String,
  transcript: [{
    role: { type: String, enum: ['tutor', 'student'] },
    message: String,
    timestamp: Date,
    aiSuggestions: [{
      type: String,
      title: String,
      suggestion: String,
      example: String
    }]
  }],
  aiGeneratedSummary: String,
  startTime: Date,
  endTime: Date,
  createdAt: { type: Date, default: Date.now }
});

const Conversation = mongoose.model('Conversation', conversationSchema);
const EssaySubmission = mongoose.model('EssaySubmission', essaySubmissionSchema);
const GeneratedTest = mongoose.model('GeneratedTest', generatedTestSchema);
const TutoringSession = mongoose.model('TutoringSession', tutoringSessionSchema);

// =============================================================================
// SYSTEM PROMPTS
// =============================================================================

const SYSTEM_PROMPTS = {
  homeworkBot: `You are an expert, friendly homework tutor for middle school and high school students. Your goal is to help students UNDERSTAND concepts, not just give them answers.

TUTORING APPROACH:
1. Never just give the answer - guide students to discover it
2. Break complex problems into smaller, manageable steps
3. Use analogies and real-world examples
4. Ask guiding questions to check understanding
5. Celebrate progress and encourage persistence
6. If a student is frustrated, acknowledge it and try a different approach

FORMATTING:
- Use markdown for clarity (bold for key terms, bullet points for steps)
- For math, use clear notation and show each step
- Keep explanations concise but thorough
- End responses with a guiding question or next step when appropriate

TONE:
- Warm, encouraging, and patient
- Age-appropriate language
- Enthusiastic about learning
- Never condescending

Remember: Your goal is to build understanding and confidence, not dependency.`,

  essayScorer: `You are an expert essay evaluator for standardized tests and college admissions. 
You provide detailed, constructive feedback that helps students improve their writing.
Always be encouraging while being honest about areas for improvement.
Your feedback should be specific and actionable.`,

  testGenerator: `You are an expert test question writer for standardized tests. Create high-quality, original practice questions that accurately reflect the style, difficulty, and format of real exams.

REQUIREMENTS:
- Questions should be unique and not copied from existing materials
- Include realistic answer choices with plausible distractors
- Provide detailed explanations for each answer
- Match the specified difficulty level
- Use proper mathematical notation where needed`,

  tutoringCoPilot: `You are an AI tutoring assistant helping a human tutor during a live session. 
Provide specific, actionable suggestions for how the tutor should respond to the student.

Your suggestions should:
1. Be specific to the student's question and learning style
2. Include at least one visual/concrete approach
3. Address any underlying misconceptions
4. Build on what the student already knows

Be concise - the tutor needs quick, actionable advice.`
};

// =============================================================================
// API ROUTES
// =============================================================================

// -----------------------------------------------------------------------------
// 1. HOMEWORK HELP BOT
// -----------------------------------------------------------------------------

/**
 * POST /api/homework/chat
 * Send a message to the homework help bot
 */
router.post('/homework/chat', apiLimiter, async (req, res) => {
  try {
    const { studentId, organizationId, message, conversationId, subject } = req.body;

    if (!studentId || !organizationId || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Get or create conversation
    let conversation;
    if (conversationId) {
      conversation = await Conversation.findById(conversationId);
      if (!conversation) {
        return res.status(404).json({ error: 'Conversation not found' });
      }
    } else {
      conversation = new Conversation({
        studentId,
        organizationId,
        subject,
        messages: []
      });
    }

    // Add user message
    conversation.messages.push({
      role: 'user',
      content: message
    });

    // Build conversation history for Claude
    const conversationHistory = conversation.messages.slice(-20).map(m => ({
      role: m.role === 'user' ? 'user' : 'assistant',
      content: m.content
    }));

    // Call Claude API
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1500,
      system: SYSTEM_PROMPTS.homeworkBot,
      messages: conversationHistory
    });

    const assistantMessage = response.content[0].text;

    // Add assistant response
    conversation.messages.push({
      role: 'assistant',
      content: assistantMessage
    });

    conversation.updatedAt = new Date();
    await conversation.save();

    res.json({
      conversationId: conversation._id,
      message: assistantMessage,
      messageCount: conversation.messages.length
    });

  } catch (error) {
    console.error('Homework chat error:', error);
    res.status(500).json({ error: 'Failed to process message' });
  }
});

/**
 * GET /api/homework/conversations/:studentId
 * Get conversation history for a student
 */
router.get('/homework/conversations/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;
    const { limit = 10 } = req.query;

    const conversations = await Conversation.find({ studentId })
      .sort({ updatedAt: -1 })
      .limit(parseInt(limit))
      .select('subject updatedAt messages');

    res.json(conversations);
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
});

// -----------------------------------------------------------------------------
// 2. ESSAY SCORING
// -----------------------------------------------------------------------------

/**
 * POST /api/essay/score
 * Submit an essay for scoring and feedback
 */
router.post('/essay/score', apiLimiter, async (req, res) => {
  try {
    const { studentId, organizationId, essayText, essayType = 'sat' } = req.body;

    if (!studentId || !organizationId || !essayText) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const rubrics = {
      sat: { maxScore: 8, categories: ['Reading', 'Analysis', 'Writing'] },
      act: { maxScore: 6, categories: ['Ideas & Analysis', 'Development & Support', 'Organization', 'Language Use'] },
      college: { maxScore: 10, categories: ['Authenticity', 'Insight & Reflection', 'Writing Quality', 'Engagement'] },
      ap: { maxScore: 6, categories: ['Thesis', 'Evidence & Commentary', 'Sophistication'] }
    };

    const rubric = rubrics[essayType] || rubrics.sat;

    const userPrompt = `Please evaluate this ${essayType.toUpperCase()} essay using the following criteria: ${rubric.categories.join(', ')}.

For each category, provide:
1. A score from 1-${rubric.maxScore}
2. 2-3 specific observations (what works well)
3. 2-3 specific suggestions for improvement

Also provide:
- An overall score (average of categories)
- A brief overall assessment (2-3 sentences)
- The top 3 priority improvements
- One specific sentence from the essay that could be rewritten, with your improved version

Format your response as JSON with this structure:
{
  "categories": [
    {
      "name": "Category Name",
      "score": number,
      "observations": ["observation 1", "observation 2"],
      "suggestions": ["suggestion 1", "suggestion 2"]
    }
  ],
  "overallScore": number,
  "overallAssessment": "string",
  "priorityImprovements": ["improvement 1", "improvement 2", "improvement 3"],
  "rewriteExample": {
    "original": "original sentence",
    "improved": "improved sentence",
    "explanation": "why this is better"
  }
}

ESSAY TO EVALUATE:
"""
${essayText}
"""`;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      system: SYSTEM_PROMPTS.essayScorer,
      messages: [{ role: 'user', content: userPrompt }]
    });

    const responseText = response.content[0].text;
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error('Could not parse feedback JSON');
    }

    const feedback = JSON.parse(jsonMatch[0]);

    // Save to database
    const submission = new EssaySubmission({
      studentId,
      organizationId,
      essayType,
      essayText,
      wordCount: essayText.split(/\s+/).filter(w => w).length,
      feedback
    });

    await submission.save();

    res.json({
      submissionId: submission._id,
      feedback,
      wordCount: submission.wordCount
    });

  } catch (error) {
    console.error('Essay scoring error:', error);
    res.status(500).json({ error: 'Failed to score essay' });
  }
});

/**
 * GET /api/essay/history/:studentId
 * Get essay submission history for a student
 */
router.get('/essay/history/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;
    const { limit = 10 } = req.query;

    const submissions = await EssaySubmission.find({ studentId })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .select('essayType feedback.overallScore wordCount createdAt');

    res.json(submissions);
  } catch (error) {
    console.error('Get essay history error:', error);
    res.status(500).json({ error: 'Failed to fetch essay history' });
  }
});

// -----------------------------------------------------------------------------
// 3. PRACTICE TEST GENERATOR
// -----------------------------------------------------------------------------

/**
 * POST /api/tests/generate
 * Generate a new practice test
 */
router.post('/tests/generate', apiLimiter, async (req, res) => {
  try {
    const { 
      organizationId, 
      testType, 
      subject, 
      difficulty = 'medium', 
      questionCount = 5 
    } = req.body;

    if (!organizationId || !testType || !subject) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const userPrompt = `Generate ${questionCount} ${difficulty} difficulty multiple-choice questions for ${testType}, specifically covering ${subject}.

Format your response as JSON with this exact structure:
{
  "questions": [
    {
      "id": 1,
      "question": "The question text",
      "options": {
        "A": "First option",
        "B": "Second option",
        "C": "Third option",
        "D": "Fourth option"
      },
      "correctAnswer": "A",
      "explanation": "Detailed explanation of why this answer is correct",
      "concept": "The specific concept being tested"
    }
  ]
}

Make the questions authentic to ${testType} style and ${difficulty} difficulty.`;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      system: SYSTEM_PROMPTS.testGenerator,
      messages: [{ role: 'user', content: userPrompt }]
    });

    const responseText = response.content[0].text;
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error('Could not parse questions JSON');
    }

    const parsed = JSON.parse(jsonMatch[0]);

    // Save to database
    const generatedTest = new GeneratedTest({
      organizationId,
      testType,
      subject,
      difficulty,
      questions: parsed.questions.map(q => ({
        questionText: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        concept: q.concept
      }))
    });

    await generatedTest.save();

    res.json({
      testId: generatedTest._id,
      testType,
      subject,
      difficulty,
      questionCount: parsed.questions.length,
      questions: parsed.questions
    });

  } catch (error) {
    console.error('Test generation error:', error);
    res.status(500).json({ error: 'Failed to generate test' });
  }
});

/**
 * POST /api/tests/check
 * Check answers for a generated test
 */
router.post('/tests/check', async (req, res) => {
  try {
    const { testId, answers } = req.body;

    const test = await GeneratedTest.findById(testId);
    if (!test) {
      return res.status(404).json({ error: 'Test not found' });
    }

    const results = test.questions.map((q, idx) => {
      const userAnswer = answers[idx] || answers[q._id];
      const isCorrect = userAnswer === q.correctAnswer;
      return {
        questionId: q._id,
        userAnswer,
        correctAnswer: q.correctAnswer,
        isCorrect,
        explanation: q.explanation
      };
    });

    const score = results.filter(r => r.isCorrect).length;

    res.json({
      score,
      total: test.questions.length,
      percentage: Math.round((score / test.questions.length) * 100),
      results
    });

  } catch (error) {
    console.error('Check answers error:', error);
    res.status(500).json({ error: 'Failed to check answers' });
  }
});

// -----------------------------------------------------------------------------
// 4. TUTORING CO-PILOT
// -----------------------------------------------------------------------------

/**
 * POST /api/copilot/suggest
 * Get AI suggestions for a tutoring session
 */
router.post('/copilot/suggest', apiLimiter, async (req, res) => {
  try {
    const { 
      sessionId,
      tutorId,
      studentId,
      organizationId,
      studentMessage,
      studentProfile,
      recentTranscript 
    } = req.body;

    if (!studentMessage || !studentProfile) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const profileContext = `
STUDENT PROFILE:
- Name: ${studentProfile.name}
- Grade: ${studentProfile.grade}
- Subject: ${studentProfile.subject}
- Topic: ${studentProfile.topic}
- Learning Style: ${studentProfile.learningStyle}
- Known Struggles: ${(studentProfile.struggles || []).join(', ')}
- Recent Scores: ${(studentProfile.recentScores || []).join(', ')}
`;

    const transcriptContext = recentTranscript 
      ? recentTranscript.map(m => `${m.role.toUpperCase()}: ${m.message}`).join('\n')
      : '';

    const userPrompt = `${profileContext}

Recent conversation:
${transcriptContext}

The student just said: "${studentMessage}"

Provide 3-4 specific suggestions for how the tutor should respond. Format as JSON:
{
  "suggestions": [
    {
      "type": "primary" or "secondary",
      "title": "Brief title",
      "suggestion": "Specific suggestion text",
      "example": "An example of what to say"
    }
  ],
  "conceptCheck": "A question the tutor could ask to check understanding",
  "warningSign": "Any misconception or struggle pattern detected (or null if none)"
}`;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system: SYSTEM_PROMPTS.tutoringCoPilot,
      messages: [{ role: 'user', content: userPrompt }]
    });

    const responseText = response.content[0].text;
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error('Could not parse suggestions JSON');
    }

    const suggestions = JSON.parse(jsonMatch[0]);

    // Optionally save to session if sessionId provided
    if (sessionId) {
      await TutoringSession.findByIdAndUpdate(sessionId, {
        $push: {
          transcript: {
            role: 'student',
            message: studentMessage,
            timestamp: new Date(),
            aiSuggestions: suggestions.suggestions
          }
        }
      });
    }

    res.json(suggestions);

  } catch (error) {
    console.error('Co-pilot suggestion error:', error);
    res.status(500).json({ error: 'Failed to generate suggestions' });
  }
});

/**
 * POST /api/copilot/session/start
 * Start a new tutoring session
 */
router.post('/copilot/session/start', async (req, res) => {
  try {
    const { tutorId, studentId, organizationId, subject, topic } = req.body;

    const session = new TutoringSession({
      tutorId,
      studentId,
      organizationId,
      subject,
      topic,
      transcript: [],
      startTime: new Date()
    });

    await session.save();

    res.json({
      sessionId: session._id,
      startTime: session.startTime
    });

  } catch (error) {
    console.error('Start session error:', error);
    res.status(500).json({ error: 'Failed to start session' });
  }
});

/**
 * POST /api/copilot/session/end
 * End a tutoring session and generate summary
 */
router.post('/copilot/session/end', async (req, res) => {
  try {
    const { sessionId } = req.body;

    const session = await TutoringSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Generate session summary
    const transcriptText = session.transcript
      .map(t => `${t.role.toUpperCase()}: ${t.message}`)
      .join('\n');

    const summaryPrompt = `Summarize this tutoring session for the tutor's records. Include:
1. Main topics covered
2. Key concepts the student struggled with
3. Progress made
4. Recommended next steps

Transcript:
${transcriptText}`;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 500,
      messages: [{ role: 'user', content: summaryPrompt }]
    });

    session.aiGeneratedSummary = response.content[0].text;
    session.endTime = new Date();
    await session.save();

    res.json({
      sessionId: session._id,
      duration: Math.round((session.endTime - session.startTime) / 60000), // minutes
      summary: session.aiGeneratedSummary
    });

  } catch (error) {
    console.error('End session error:', error);
    res.status(500).json({ error: 'Failed to end session' });
  }
});

// =============================================================================
// EXPORT
// =============================================================================

module.exports = router;

// =============================================================================
// USAGE EXAMPLE (in your main app.js)
// =============================================================================
/*
const express = require('express');
const mongoose = require('mongoose');
const aiRoutes = require('./routes/ai-services');

const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);

// Middleware
app.use(express.json());

// Routes
app.use('/api', aiRoutes);

// Start server
app.listen(3000, () => {
  console.log('AI Education Services API running on port 3000');
});
*/
