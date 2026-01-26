# AI Education Services - Implementation Guide

## Overview

This package contains everything you need to add AI-powered education services to your website:

1. **Interactive Demos** (React components) - Ready to embed on your website
2. **Backend API** (Express + MongoDB) - Production-ready server code
3. **Marketing Collateral** - Website copy, features, and CTAs

---

## Files Included

```
├── essay-scorer-demo.jsx          # Essay Scoring & Feedback Demo
├── homework-bot-demo.jsx          # 24/7 Homework Help Bot Demo
├── practice-test-generator-demo.jsx    # Practice Test Generator Demo
├── tutoring-copilot-demo.jsx      # AI Tutoring Co-Pilot Demo
├── ai-services-express-routes.js  # Express backend API routes
├── marketing-collateral.md        # Website copy & content
└── README.md                      # This file
```

---

## Quick Start

### 1. Set Up Environment Variables

Create a `.env` file:

```env
# Claude API
ANTHROPIC_API_KEY=your_anthropic_api_key

# MongoDB
MONGODB_URI=mongodb://localhost:27017/education_ai

# Server
PORT=3000
NODE_ENV=development
```

### 2. Install Dependencies

```bash
# Backend
npm install express mongoose @anthropic-ai/sdk express-rate-limit cors dotenv

# Frontend (if using Next.js)
npm install @anthropic-ai/sdk
```

### 3. Add Routes to Your Express App

```javascript
// app.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const aiRoutes = require('./routes/ai-services-express-routes');

const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Larger limit for essays

// AI Service Routes
app.use('/api', aiRoutes);

app.listen(process.env.PORT || 3000);
```

---

## Demo Integration Options

### Option A: Embed React Components (Recommended for Demos)

The demo components call the Claude API directly for simplicity. For production, proxy through your backend.

1. Copy the `.jsx` files to your Next.js `components/` folder
2. Import and use:

```jsx
// pages/demo/essay-scorer.js
import EssayScoringDemo from '../../components/essay-scorer-demo';

export default function EssayScorerPage() {
  return <EssayScoringDemo />;
}
```

3. For the demos to work, you need to configure your API. Two options:

**Option A1: Direct API calls (Demo only, not recommended for production)**
Set up a proxy to add the API key server-side.

**Option A2: Backend Proxy (Recommended)**
Modify the components to call your Express backend instead of the Claude API directly:

```javascript
// Change this:
const response = await fetch('https://api.anthropic.com/v1/messages', {...})

// To this:
const response = await fetch('/api/essay/score', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ studentId, organizationId, essayText, essayType })
});
```

### Option B: Create a Next.js API Route Wrapper

```javascript
// pages/api/claude-proxy.js
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages, system, max_tokens = 1500 } = req.body;
    
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens,
      system,
      messages
    });

    res.json(response);
  } catch (error) {
    console.error('Claude API error:', error);
    res.status(500).json({ error: 'AI service error' });
  }
}
```

---

## API Endpoints Reference

### Homework Help Bot

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/homework/chat` | POST | Send message to homework bot |
| `/api/homework/conversations/:studentId` | GET | Get student's conversation history |

**Request Body (chat):**
```json
{
  "studentId": "ObjectId",
  "organizationId": "ObjectId",
  "message": "How do I factor x² + 5x + 6?",
  "conversationId": "ObjectId (optional)",
  "subject": "math"
}
```

### Essay Scoring

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/essay/score` | POST | Submit essay for scoring |
| `/api/essay/history/:studentId` | GET | Get student's essay history |

**Request Body (score):**
```json
{
  "studentId": "ObjectId",
  "organizationId": "ObjectId",
  "essayText": "The full essay text...",
  "essayType": "sat" // sat, act, college, ap
}
```

### Practice Test Generator

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/tests/generate` | POST | Generate new practice test |
| `/api/tests/check` | POST | Check answers |

**Request Body (generate):**
```json
{
  "organizationId": "ObjectId",
  "testType": "sat-math",
  "subject": "Algebra",
  "difficulty": "medium",
  "questionCount": 5
}
```

### Tutoring Co-Pilot

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/copilot/suggest` | POST | Get teaching suggestions |
| `/api/copilot/session/start` | POST | Start new session |
| `/api/copilot/session/end` | POST | End session & get summary |

**Request Body (suggest):**
```json
{
  "sessionId": "ObjectId",
  "studentMessage": "I still don't get it",
  "studentProfile": {
    "name": "Alex",
    "grade": "10th",
    "subject": "Algebra II",
    "topic": "Quadratics",
    "learningStyle": "Visual",
    "struggles": ["Factoring"],
    "recentScores": [72, 78, 80]
  },
  "recentTranscript": [
    { "role": "tutor", "message": "Let's try factoring..." },
    { "role": "student", "message": "I still don't get it" }
  ]
}
```

---

## Deployment Checklist

### Security
- [ ] API keys stored in environment variables (never in code)
- [ ] Rate limiting enabled
- [ ] CORS configured for your domains only
- [ ] Input validation on all endpoints
- [ ] Request size limits set

### Production Configuration
- [ ] MongoDB indexes created for frequent queries
- [ ] Error logging configured (e.g., Sentry)
- [ ] API monitoring enabled
- [ ] Response caching where appropriate

### Cost Management
- [ ] Usage tracking per organization
- [ ] Rate limits per customer tier
- [ ] Token usage monitoring

---

## Cost Estimates

Based on Claude Sonnet pricing (~$3/1M input tokens, ~$15/1M output tokens):

| Service | Avg Tokens/Request | Est. Cost/1000 Requests |
|---------|-------------------|------------------------|
| Homework Bot | ~500 in, ~800 out | ~$13.50 |
| Essay Scoring | ~1500 in, ~1000 out | ~$19.50 |
| Test Generator (5 Qs) | ~200 in, ~2000 out | ~$30.60 |
| Co-Pilot Suggestions | ~800 in, ~500 out | ~$9.90 |

---

## Customization Notes

### Adding Your Branding
1. Update color schemes in the demo components (Tailwind classes)
2. Add your logo to chat headers
3. Customize welcome messages and tone

### Integrating Textbook Content
For the Practice Test Generator, you can enhance questions by adding subject context:

```javascript
const subjectContext = `
Use these key concepts for question generation:
${textbookExcerptHere}

Create questions that test understanding of these concepts.
`;
```

**Important:** Paraphrase textbook content, don't copy directly.

### White-Label Options
- Remove "Powered by Claude AI" footers for production
- Replace example names with your brand
- Customize error messages

---

## Support

For technical questions about implementation:
- Claude API docs: https://docs.anthropic.com
- MongoDB Mongoose: https://mongoosejs.com/docs

---

## License

This code is provided for your internal use. Customize and deploy as needed.
