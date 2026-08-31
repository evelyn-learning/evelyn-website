/**
 * Tutor Engine
 *
 * The main orchestrator for AI tutoring sessions.
 * Coordinates voice, AI, whiteboard, and session state.
 */

import { v4 as uuidv4 } from 'uuid';
import Anthropic from '@anthropic-ai/sdk';
import { getModelClient } from '../ai/model-registry';
import {
  TutoringSession,
  TutoringSessionConfig,
  TranscriptEntry,
  SessionState,
  SessionSummary,
  PedagogicalIntent,
  VoicePreference,
  SessionMetrics,
} from '../types';
import type { WhiteboardCommand, Problem, KnowledgeModule } from '@core/knowledge/types';
import { loadModuleByParams, getModuleId } from '@core/knowledge/registry';
import { buildSystemPrompt } from '../ai/system-prompt-builder';
import { parseWhiteboardCommands } from '../ai/response-parser';

export interface TutorEngineCallbacks {
  sessionConfig: TutoringSessionConfig;
  onTranscriptPartial: (text: string) => void;
  onTranscriptFinal: (text: string, confidence: number) => void;
  onTutorMessage: (
    text: string,
    whiteboardCommands?: WhiteboardCommand[],
    pedagogicalIntent?: PedagogicalIntent
  ) => void;
  onAudioChunk: (chunk: ArrayBuffer) => void;
  onAudioStart: () => void;
  onAudioEnd: () => void;
  onWhiteboardCommand: (command: WhiteboardCommand) => void;
  onError: (error: Error, recoverable: boolean) => void;
  onStateChange: (state: SessionState) => void;
}

export class TutorEngine {
  private sessionId: string;
  private session: TutoringSession;
  private callbacks: TutorEngineCallbacks;
  private knowledgeModule: KnowledgeModule | null = null;
  private anthropic: Anthropic;
  private state: SessionState = 'idle';
  private conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = [];
  private startTime: Date | null = null;
  private isProcessing = false;

  constructor(callbacks: TutorEngineCallbacks) {
    this.callbacks = callbacks;
    this.sessionId = uuidv4();
    this.anthropic = getModelClient('classic-engine').client;

    // Initialize session
    this.session = {
      id: this.sessionId,
      config: callbacks.sessionConfig,
      status: 'initializing',
      startedAt: new Date(),
      durationSeconds: 0,
      transcript: [],
      problemsAttempted: [],
      conceptsTouched: [],
      misconceptionsDetected: [],
      misconceptionsAddressed: [],
      metrics: this.createEmptyMetrics(),
    };
  }

  /**
   * Initialize the tutor engine
   */
  async initialize(): Promise<void> {
    const { subject, topic, level } = this.callbacks.sessionConfig;

    try {
      // Load knowledge module
      this.knowledgeModule = await loadModuleByParams(subject, topic, level);
      console.log(`[TutorEngine] Loaded module: ${this.knowledgeModule.displayName}`);
    } catch (error) {
      console.warn(`[TutorEngine] Module not found, using base prompts only:`, error);
      // Continue without module - will use base prompts
    }

    this.setState('idle');
    this.session.status = 'active';
  }

  /**
   * Start the tutoring session
   */
  async start(): Promise<string> {
    this.startTime = new Date();
    this.setState('greeting');

    // Generate greeting
    const greeting = await this.generateTutorResponse(
      'START_SESSION',
      'greeting'
    );

    return greeting;
  }

  /**
   * End the tutoring session
   */
  async end(): Promise<SessionSummary> {
    this.setState('ended');
    this.session.status = 'completed';
    this.session.endedAt = new Date();

    if (this.startTime) {
      this.session.durationSeconds = Math.floor(
        (this.session.endedAt.getTime() - this.startTime.getTime()) / 1000
      );
    }

    // Generate summary
    const summary = await this.generateSessionSummary();
    return summary;
  }

  /**
   * Handle incoming audio chunk from student
   */
  handleAudioChunk(chunk: ArrayBuffer, isFinal: boolean): void {
    // Forward to voice controller (in real implementation)
    // For now, this is a placeholder - audio processing happens client-side
    // and we receive text transcripts
  }

  /**
   * Handle text message from student (text mode or after STT)
   */
  async handleTextMessage(text: string): Promise<void> {
    if (this.isProcessing) {
      console.log('[TutorEngine] Already processing, queuing message');
      return;
    }

    this.isProcessing = true;

    try {
      // Add to transcript
      this.addTranscriptEntry('student', text);

      // Update state based on content
      const newState = this.determineState(text);
      this.setState(newState);

      // Generate response
      const response = await this.generateTutorResponse(text);

      // Parse whiteboard commands from response
      const { cleanText, commands } = parseWhiteboardCommands(response);

      // Add tutor response to transcript
      this.addTranscriptEntry('tutor', cleanText, commands);

      // Send response
      this.callbacks.onTutorMessage(cleanText, commands);

      // Send whiteboard commands individually
      for (const command of commands) {
        this.callbacks.onWhiteboardCommand(command);
      }
    } catch (error) {
      console.error('[TutorEngine] Error processing message:', error);
      this.callbacks.onError(
        error instanceof Error ? error : new Error('Failed to process message'),
        true
      );
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Interrupt current speech
   */
  interrupt(): void {
    // Signal to stop TTS
    this.callbacks.onAudioEnd();
  }

  /**
   * Handle student drawing on whiteboard
   */
  handleStudentDraw(strokes: unknown[]): void {
    // Store student work for context
    // Could be used for recognizing equations or diagrams
  }

  /**
   * Handle problem submission
   */
  async handleProblemSubmission(problemId: string, answer: string): Promise<void> {
    const text = `My answer to problem ${problemId} is: ${answer}`;
    await this.handleTextMessage(text);
  }

  /**
   * Handle hint request
   */
  async handleHintRequest(problemId: string): Promise<void> {
    const text = `I need a hint for this problem.`;
    await this.handleTextMessage(text);
  }

  /**
   * Handle problem skip
   */
  async handleProblemSkip(problemId: string): Promise<void> {
    const text = `I want to skip this problem and try a different one.`;
    await this.handleTextMessage(text);
  }

  /**
   * Extract problems from homework image
   */
  async extractProblemsFromImage(imageData: string, mimeType: string): Promise<Problem[]> {
    try {
      const response = await this.anthropic.messages.create({
        model: getModelClient('classic-engine').model,
        max_tokens: 2000,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: mimeType as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp',
                  data: imageData,
                },
              },
              {
                type: 'text',
                text: `Extract all physics problems from this image. For each problem, provide:
1. The problem statement
2. Any given values (with units)
3. What is being asked for

Return as JSON array with this structure:
[{
  "statement": "problem text",
  "givenValues": [{"symbol": "v0", "value": 10, "unit": "m/s"}],
  "unknowns": [{"symbol": "x", "description": "displacement", "unit": "m"}]
}]

Only return valid JSON, no other text.`,
              },
            ],
          },
        ],
      });

      const content = response.content[0];
      if (content.type === 'text') {
        const problems = JSON.parse(content.text);
        return problems.map((p: Record<string, unknown>, i: number) => ({
          id: `extracted-${Date.now()}-${i}`,
          source: 'student-provided' as const,
          concepts: [],
          difficulty: 3 as const,
          type: 'calculation' as const,
          estimatedMinutes: 5,
          statement: p.statement as string,
          givenValues: p.givenValues as { symbol: string; value: number; unit: string }[],
          unknowns: p.unknowns as { symbol: string; description: string; unit: string }[],
          solution: {
            approach: '',
            steps: [],
            finalAnswer: {},
          },
          hints: [],
          tags: [],
        }));
      }

      return [];
    } catch (error) {
      console.error('[TutorEngine] Error extracting problems:', error);
      throw new Error('Failed to extract problems from image');
    }
  }

  /**
   * Get session ID
   */
  getSessionId(): string {
    return this.sessionId;
  }

  /**
   * Get current session state
   */
  getState(): SessionState {
    return this.state;
  }

  /**
   * Get session data
   */
  getSession(): TutoringSession {
    return this.session;
  }

  // Private methods

  private setState(state: SessionState): void {
    if (this.state !== state) {
      this.state = state;
      this.callbacks.onStateChange(state);
    }
  }

  private async generateTutorResponse(
    studentMessage: string,
    intent?: PedagogicalIntent
  ): Promise<string> {
    // Build system prompt
    const systemPrompt = buildSystemPrompt({
      module: this.knowledgeModule,
      studentName: this.callbacks.sessionConfig.studentName,
      sessionGoal: this.callbacks.sessionConfig.goal,
      timeRemainingMinutes: this.getRemainingMinutes(),
      currentState: this.state,
    });

    // Add message to conversation history
    if (studentMessage !== 'START_SESSION') {
      this.conversationHistory.push({
        role: 'user',
        content: studentMessage,
      });
    }

    // Create messages for Claude
    const messages = studentMessage === 'START_SESSION'
      ? [{ role: 'user' as const, content: 'Session starting. Please greet the student and ask how you can help them today.' }]
      : this.conversationHistory;

    try {
      const response = await this.anthropic.messages.create({
        model: getModelClient('classic-engine').model,
        max_tokens: 1000,
        system: systemPrompt,
        messages,
      });

      const content = response.content[0];
      if (content.type === 'text') {
        const assistantMessage = content.text;

        // Add to conversation history
        this.conversationHistory.push({
          role: 'assistant',
          content: assistantMessage,
        });

        return assistantMessage;
      }

      return "I'm sorry, I couldn't generate a response. Let me try again.";
    } catch (error) {
      console.error('[TutorEngine] Error calling Claude:', error);
      throw error;
    }
  }

  private async generateSessionSummary(): Promise<SessionSummary> {
    // For now, return a basic summary
    // Could use Claude to generate a more detailed summary
    return {
      sessionId: this.sessionId,
      duration: this.session.durationSeconds,
      conceptsCovered: this.session.conceptsTouched,
      problemsAttempted: this.session.problemsAttempted.length,
      problemsCorrect: this.session.problemsAttempted.filter((p) => p.correct).length,
      misconceptionsAddressed: this.session.misconceptionsAddressed,
      strengths: [],
      areasForImprovement: [],
      suggestedNextSteps: [],
    };
  }

  private addTranscriptEntry(
    role: 'student' | 'tutor' | 'system',
    text: string,
    whiteboardCommands?: WhiteboardCommand[]
  ): void {
    const entry: TranscriptEntry = {
      id: uuidv4(),
      timestamp: new Date(),
      role,
      text,
      whiteboardCommands,
    };
    this.session.transcript.push(entry);
  }

  private determineState(text: string): SessionState {
    const lower = text.toLowerCase();

    if (lower.includes('help') || lower.includes('stuck') || lower.includes("don't understand")) {
      return 'explaining';
    }
    if (lower.includes('practice') || lower.includes('problem') || lower.includes('try')) {
      return 'problem-solving';
    }
    if (lower.includes('what is') || lower.includes('explain') || lower.includes('how does')) {
      return 'teaching';
    }

    return this.state === 'greeting' ? 'assessing' : this.state;
  }

  private getRemainingMinutes(): number {
    if (!this.startTime) return 30;

    const maxMinutes = this.callbacks.sessionConfig.maxDurationMinutes || 30;
    const elapsedMs = Date.now() - this.startTime.getTime();
    const elapsedMinutes = elapsedMs / (1000 * 60);

    return Math.max(0, Math.round(maxMinutes - elapsedMinutes));
  }

  private createEmptyMetrics(): SessionMetrics {
    return {
      studentSpeakingTime: 0,
      tutorSpeakingTime: 0,
      questionsAskedByTutor: 0,
      hintsGiven: 0,
      diagramsShown: 0,
      problemsCompleted: 0,
      problemsCorrect: 0,
      averageResponseLatency: 0,
    };
  }
}
