# Evelyn Learning AI Voice Tutor
## Technical Integration Specification — White-Label Partners

**Version**: 3.7
**Date**: March 2026
**Classification**: Partner Confidential

---

## 1. Integration Architecture

### Recommended Model: Hosted Embed

The Voice Tutor is delivered as a **hosted, embeddable web application** that partners integrate into their platform via iframe or redirect. Evelyn hosts and maintains the tutoring engine; the partner controls the surrounding experience (authentication, payments, dashboard, curriculum selection).

```
┌─────────────────────────────────────────────────────┐
│                  PARTNER PLATFORM                    │
│                                                      │
│   ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │
│   │   Auth   │  │ Payments │  │ Student Dashboard │  │
│   └────┬─────┘  └──────────┘  └────────┬─────────┘  │
│        │                               │             │
│        ▼                               │             │
│   ┌────────────────────────────────────┐│             │
│   │    Evelyn Voice Tutor (iframe)     ││             │
│   │                                    ││             │
│   │  ┌──────────┐  ┌───────────────┐  ││             │
│   │  │  Voice   │  │  Whiteboard   │  ││             │
│   │  │  Engine  │  │  (19 types)   │  ││             │
│   │  └──────────┘  └───────────────┘  ││             │
│   │                                    ││             │
│   └──────────────┬─────────────────────┘│             │
│                  │                      │             │
│                  ▼                      ▼             │
│            ┌──────────────────────────────┐           │
│            │   Webhooks / Session Data    │           │
│            └──────────────────────────────┘           │
└─────────────────────────────────────────────────────┘
```

### Why Hosted Embed Over Headless API?

The whiteboard rendering engine is the most complex component (19 visual types, interactive graph plotting, LaTeX rendering, geometry engine, 3D molecular viewer). Rebuilding it as a separate frontend would take 3-6 months and produce an inferior result. The embed model gives partners full tutoring functionality with minimal integration effort.

---

## 2. Embed Integration

### 2.1 Basic Embed

```html
<iframe
  src="https://tutor.evelynlearning.com/embed"
  width="100%"
  height="700"
  allow="microphone; camera"
  frameborder="0"
></iframe>
```

### 2.2 Authenticated Embed

Partners generate a signed session token server-side and pass it to the embed URL:

```
https://tutor.evelynlearning.com/embed?token={SESSION_TOKEN}
```

**Token payload** (JWT, signed with partner's API secret):
```json
{
  "partner_id": "algerian-bac",
  "student_id": "stu_abc123",
  "student_name": "Ahmed",
  "subject": "math",
  "topic": "algebra-2",
  "level": "11-12",
  "session_goal": "test-prep",
  "engine": "standard",
  "locale": "ar-DZ",
  "branding": {
    "primary_color": "#1E40AF",
    "logo_url": "https://partner.com/logo.png",
    "product_name": "BAC Tutor"
  },
  "curriculum_module": "algerian-bac-math-2026",
  "exp": 1735689600
}
```

### 2.3 Configuration Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `partner_id` | string | Yes | Your partner identifier |
| `student_id` | string | Yes | Your internal student ID (for analytics and data retrieval) |
| `student_name` | string | No | Student's first name (used in conversation) |
| `subject` | string | Yes | Subject code (math, science, ela, cs, etc.) |
| `topic` | string | No | Topic ID from taxonomy or custom curriculum module |
| `level` | string | Yes | Grade level (K-2, 3-5, 6-8, 9-10, 11-12, AP, college) |
| `session_goal` | string | No | practice, homework-help, concept-review, test-prep, catch-up, challenge |
| `locale` | string | No | BCP 47 locale code for voice language (default: en-US) |
| `engine` | string | No | Voice engine tier: "standard" or "premium" (default: "standard") |
| `input_mode` | string | No | "voice" (default) or "text" |
| `voice` | string | No | Voice selection (coral, shimmer, alloy, ash, ballad, echo, sage, verse) |
| `curriculum_module` | string | No | ID of custom knowledge module to load |
| `branding` | object | No | Visual customization (colors, logo, product name) |
| `max_duration_minutes` | number | No | Session time limit for cost control (default: unlimited) |
| `features` | object | No | Enable/disable: homework_upload, text_mode, voice_mode |
| `metadata` | object | No | Arbitrary key-value pairs passed through to webhooks |

---

## 3. Webhooks

Evelyn sends event data to your configured webhook endpoint in real-time.

### 3.1 Webhook Events

| Event | Trigger | Key Payload Fields |
|-------|---------|-------------------|
| `session.started` | Student begins tutoring | session_id, student_id, subject, topic, level, input_mode, timestamp |
| `session.active` | First student message sent | session_id, student_id, timestamp |
| `session.paused` | Student pauses session | session_id, pause_reason, elapsed_seconds |
| `session.resumed` | Student resumes session | session_id, pause_duration_seconds |
| `session.ended` | Session completes or times out | session_id, duration, message_count, whiteboard_items, token_usage, end_reason |
| `session.abandoned` | Student leaves without ending | session_id, last_activity_timestamp, duration |
| `session.transcript` | Full transcript available (post-session) | session_id, transcript[], whiteboard_commands[] |
| `usage.summary` | End-of-session cost breakdown | session_id, input_tokens, output_tokens, audio_tokens, estimated_cost |
| `usage.daily` | Daily aggregate for partner | date, total_sessions, total_minutes, total_cost, unique_students |
| `whiteboard.generated` | Whiteboard visual created | session_id, command_type, page_number, timestamp |
| `homework.uploaded` | Student uploads homework photo | session_id, student_id, extraction_status, problem_count |
| `homework.extracted` | Problems extracted from photo | session_id, problems[], confidence_score |
| `student.milestone` | Student demonstrates mastery of a concept | session_id, student_id, concept_id, milestone_type |
| `error.session` | Session-level error | session_id, error_code, error_message, recoverable |
| `error.voice` | Voice engine error (connection, transcription) | session_id, error_type, fallback_action |

### 3.2 Webhook Format

```json
{
  "event": "session.ended",
  "timestamp": "2026-10-15T14:30:00Z",
  "partner_id": "algerian-bac",
  "data": {
    "session_id": "sess_abc123",
    "student_id": "stu_xyz789",
    "subject": "math",
    "topic": "quadratic-functions",
    "level": "11-12",
    "duration_seconds": 1847,
    "message_count": 24,
    "whiteboard_items": 8,
    "end_reason": "student_ended",
    "token_usage": {
      "input_audio_tokens": 14200,
      "output_audio_tokens": 21800,
      "input_text_tokens": 48500,
      "output_text_tokens": 18200
    },
    "estimated_cost_usd": 1.85,
    "metadata": {
      "class_id": "math-11b",
      "teacher_id": "tch_456"
    }
  }
}
```

### 3.3 Webhook Security

All webhooks are signed with HMAC-SHA256 using your webhook secret. Verify the `X-Evelyn-Signature` header before processing.

### 3.4 Retry Policy

Failed webhook deliveries (non-2xx response) are retried with exponential backoff: 1 minute, 5 minutes, 30 minutes, 2 hours, 24 hours. After 5 failed attempts, the event is logged and available via the Events API.

---

## 4. Custom Curriculum Modules

Partners upload custom knowledge modules to align the tutor with their national curriculum. Modules are ingested by our RAG pipeline and used to ground the tutor's instruction in official syllabus content.

### 4.1 Module Structure

```json
{
  "id": "algerian-bac-math-2026",
  "subject": "math",
  "level": "11-12",
  "version": "1.0",
  "locale": "ar-DZ",

  "concepts": [
    {
      "id": "complex-numbers",
      "title": "Complex Numbers",
      "title_localized": "الأعداد المركبة",
      "explanation": "...",
      "misconceptions": [
        {
          "description": "Students confuse i^2 = -1 with i = -1",
          "detection_pattern": "i equals negative one",
          "correction_strategy": "..."
        }
      ]
    }
  ],

  "problems": [...],
  "worked_examples": [...],
  "system_prompt_additions": "You are tutoring for the Algerian BAC exam. Use formal Arabic mathematical terminology on the whiteboard. When the student speaks in Darja, respond verbally in Darja but write all notation in standard form..."
}
```

### 4.2 Module Upload Methods

| Method | Description |
|--------|-------------|
| **JSON upload** | `POST /api/partner/modules` with structured JSON (see schema above) |
| **PDF ingestion** | `POST /api/partner/modules/ingest` with curriculum PDFs — our system extracts and structures the content automatically |
| **Bulk upload** | `POST /api/partner/modules/bulk` with a ZIP archive containing multiple module JSON files |

Uploaded modules are processed, indexed, and available for use within 15 minutes of submission. PDF ingestion may take up to 2 hours depending on document size.

---

## 5. Voice Engine

The Voice Tutor offers two voice engine tiers. Both support the full whiteboard (all 19 visual types), 50+ languages, and session analytics. Partners select the engine via the `engine` embed parameter.

### Standard Engine

| Attribute | Specification |
|-----------|--------------|
| **Response latency** | ~1.5 seconds between student speech and tutor response |
| **Architecture** | Turn-by-turn pipeline: speech recognition, AI reasoning (Claude Sonnet 4), speech synthesis |
| **Speech quality** | Natural speech synthesis with 4 voice options |
| **Languages supported** | 50+ languages including Arabic, French, English, Spanish, Hindi, Urdu, Turkish, Mandarin, Portuguese, German, and many more |
| **Code-switching** | Supports different languages for speech vs. whiteboard notation |
| **Audio format** | High-fidelity PCM audio at 24kHz sample rate |
| **Best for** | Cost-sensitive deployments, large student populations, structured tutoring |
| **Price** | $0.06/minute |

### Premium Engine

| Attribute | Specification |
|-----------|--------------|
| **Response latency** | Sub-400ms from end of student speech to start of tutor audio |
| **Architecture** | Single streaming connection handling speech recognition, reasoning, and synthesis simultaneously |
| **Speech quality** | Natural prosody, emotional expressiveness, 8 voice options |
| **Turn-taking** | Intelligent voice activity detection; handles mid-sentence interruptions gracefully |
| **Languages supported** | 50+ languages including Arabic, French, English, Spanish, Hindi, Urdu, Turkish, Mandarin, Portuguese, German, Japanese, Korean, and many more |
| **Code-switching** | Seamless mid-sentence switching between languages (e.g., Darja speech with French mathematical terms) |
| **Audio format** | High-fidelity PCM audio at 24kHz sample rate |
| **Best for** | Premium tutoring experiences, competitive exam prep, conversational fluency |
| **Price** | $0.25/minute |

### Shared Characteristics

- **Concurrent sessions**: Horizontally scalable — no per-partner concurrency limits
- **Uptime SLA**: 99.9% availability
- **Automatic reconnection** on network interruptions
- **Graceful degradation** to text mode if voice connection is lost
- **Noise filtering** and echo cancellation
- **Duplicate response prevention**
- **Multi-stage content validation** for whiteboard accuracy
- **Text-only mode**: Available at $0.02/minute with full whiteboard support (no voice)

---

## 6. Branding & Customization

### Visual Customization
- Primary and secondary brand colors
- Partner logo (displayed in tutor header)
- Custom product name (replaces "Evelyn Voice Tutor")
- Optional: custom CSS overrides for advanced styling

### Behavioral Customization
- Tutor personality adjustments via system prompt additions in curriculum modules
- Session goal options (can restrict or extend the default set)
- Subject/topic restrictions (only show partner's curriculum)
- Session duration limits
- Feature toggles (homework upload, text mode, voice selection)

---

## 7. Data & Privacy

### Data Flow
- **Audio**: Processed in real-time for transcription and response generation. Raw audio is not stored after processing.
- **Transcripts**: Stored in Evelyn's database, delivered to the partner via webhook and accessible via API.
- **Session data**: Retained for 90 days by default (configurable per partner).
- **Student PII**: Only the `student_id` and optional `student_name` are stored. Partners control what identifiers are passed.

### Compliance
- Data processing agreement (DPA) available
- GDPR-compatible data handling
- Student data deletion on request via API
- No student data used for model training
- SOC 2 Type II compliance (in progress)

---

## 8. Authentication & Security

### Partner Credentials
- **API Key**: For server-to-server calls (module upload, session queries, webhook configuration)
- **API Secret**: For signing session tokens (JWT)
- **Webhook Secret**: For verifying incoming webhook signatures

### Session Token Flow
```
1. Student clicks "Start Tutoring" on partner platform
2. Partner backend generates signed JWT with session config
3. Partner frontend loads iframe with token
4. Evelyn validates token, initializes session
5. Session events sent to partner webhook
6. Partner dashboard displays session history and analytics
```

---

## 9. API Reference

All endpoints require the `X-API-Key` header with your partner API key.

**Base URL**: `https://api.evelynlearning.com/v1`

### Sessions

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/sessions` | List sessions with filtering (date range, student, subject, status) |
| `GET` | `/sessions/:id` | Get session details including metadata |
| `GET` | `/sessions/:id/transcript` | Get full transcript with timestamps |
| `GET` | `/sessions/:id/whiteboard` | Get whiteboard command history |
| `GET` | `/sessions/:id/replay` | Get session replay data (transcript + whiteboard + timing) |
| `DELETE` | `/sessions/:id` | Delete a session and all associated data |

### Students

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/students/:id/sessions` | List all sessions for a student |
| `GET` | `/students/:id/progress` | Get student progress summary (topics covered, time spent, milestones) |
| `GET` | `/students/:id/usage` | Get usage and cost breakdown for a student |
| `DELETE` | `/students/:id/data` | Delete all data for a student (GDPR) |

### Curriculum Modules

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/modules` | List all uploaded curriculum modules |
| `GET` | `/modules/:id` | Get module details and status |
| `POST` | `/modules` | Upload a new curriculum module (JSON) |
| `POST` | `/modules/ingest` | Upload curriculum PDFs for automatic ingestion |
| `POST` | `/modules/bulk` | Bulk upload modules (ZIP archive) |
| `PUT` | `/modules/:id` | Update an existing module |
| `DELETE` | `/modules/:id` | Delete a module |
| `GET` | `/modules/:id/status` | Check ingestion/processing status |
| `GET` | `/modules/:id/coverage` | Get topic coverage report for a module |

### Usage & Billing

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/usage` | Aggregate usage summary (date range, grouping by day/week/month) |
| `GET` | `/usage/breakdown` | Detailed cost breakdown by subject, level, student cohort |
| `GET` | `/usage/forecast` | Projected usage and cost based on current trends |
| `GET` | `/invoices` | List invoices |
| `GET` | `/invoices/:id` | Get invoice details |

### Webhooks

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/webhooks` | List configured webhook endpoints |
| `POST` | `/webhooks` | Register a new webhook endpoint |
| `PUT` | `/webhooks/:id` | Update webhook configuration |
| `DELETE` | `/webhooks/:id` | Remove a webhook endpoint |
| `GET` | `/webhooks/:id/events` | List recent events for a webhook (including failed deliveries) |
| `POST` | `/webhooks/:id/test` | Send a test event to verify endpoint connectivity |

### Configuration

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/config` | Get current partner configuration |
| `PUT` | `/config` | Update partner configuration (branding, defaults, feature toggles) |
| `GET` | `/config/taxonomy` | Get available subjects, topics, and levels |
| `GET` | `/voices` | List available voice options with audio samples |

---

## 10. Sandbox Access

Partners receive a sandbox environment for development and testing:

- **Sandbox URL**: `https://tutor-sandbox.evelynlearning.com/embed`
- **Sandbox API**: `https://api-sandbox.evelynlearning.com/v1`
- **Voice engine**: Standard engine (Premium available in production)
- **Rate limits**: 100 sessions/month, 30 minutes/session, 10 concurrent sessions
- **API keys**: Separate sandbox keys provided on approval
- **Webhook testing**: Sandbox events sent to your configured endpoint
- **Module testing**: Upload and test up to 5 curriculum modules
- **No cost**: Sandbox usage is free during the development phase

---

## 11. Onboarding

Integration is self-service. We provide sandbox API keys, documentation, and support — your team drives the timeline.

| Phase | Typical Duration | Activities (Partner-Led) |
|-------|-----------------|--------------------------|
| **Provisioning** | 1-2 days | Sandbox API keys issued, webhook endpoint configured |
| **Integration** | 1-3 weeks | Embed iframe in your platform, implement JWT token generation, set up webhook handlers |
| **Curriculum Upload** | 1-4 weeks | Prepare and upload knowledge modules via API or PDF ingestion (parallel with integration) |
| **Testing** | 1-2 weeks | End-to-end testing, voice quality validation in target languages, load testing |
| **Go Live** | 1 day | Production API keys issued, DNS and monitoring confirmed |

**Total**: 3-8 weeks depending on curriculum scope

We provide technical support via email throughout the process. Dedicated integration support is available as an add-on for partners requiring hands-on assistance.

---

## 12. Technical Requirements (Partner Side)

- HTTPS-enabled web application (for iframe embedding)
- Server-side JWT generation capability (any language — Node.js, Python, PHP, Go, etc.)
- Webhook endpoint (HTTPS) for receiving session events
- Microphone permission handling in your PWA/app

---

*For questions or to request sandbox access, contact: info@evelynlearning.com*
