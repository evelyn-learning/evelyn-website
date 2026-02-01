/**
 * Socket.io Server Setup
 *
 * Handles WebSocket connections for real-time voice tutoring.
 * This module provides the server-side socket handling.
 */

import { Server as SocketIOServer, Socket } from 'socket.io';
import type { Server as HTTPServer } from 'http';
import type {
  ClientToServerEvents,
  ServerToClientEvents,
  TutoringSessionConfig,
  SessionSummary,
} from '../types';
import { TutorEngine } from '../engine/tutor-engine';

// Store active sessions
const activeSessions = new Map<string, TutorEngine>();

export interface SocketServerConfig {
  httpServer: HTTPServer;
  corsOrigin?: string | string[];
}

/**
 * Initialize Socket.io server with tutor event handlers
 */
export function initializeSocketServer(config: SocketServerConfig): SocketIOServer {
  const io = new SocketIOServer<ClientToServerEvents, ServerToClientEvents>(
    config.httpServer,
    {
      cors: {
        origin: config.corsOrigin || '*',
        methods: ['GET', 'POST'],
      },
      transports: ['websocket', 'polling'],
    }
  );

  io.on('connection', (socket: Socket<ClientToServerEvents, ServerToClientEvents>) => {
    console.log(`[Socket] Client connected: ${socket.id}`);

    let tutorEngine: TutorEngine | null = null;

    // Session management
    socket.on('session:start', async (sessionConfig: TutoringSessionConfig) => {
      try {
        console.log(`[Socket] Starting session for ${socket.id}`, sessionConfig);

        // Create tutor engine for this session
        tutorEngine = new TutorEngine({
          sessionConfig,
          onTranscriptPartial: (text) => {
            socket.emit('transcript:partial', { text });
          },
          onTranscriptFinal: (text, confidence) => {
            socket.emit('transcript:final', { text, confidence });
          },
          onTutorMessage: (text, whiteboardCommands, pedagogicalIntent) => {
            socket.emit('tutor:message', { text, whiteboardCommands, pedagogicalIntent });
          },
          onAudioChunk: (chunk) => {
            socket.emit('audio:chunk', { chunk });
          },
          onAudioStart: () => {
            socket.emit('audio:start');
          },
          onAudioEnd: () => {
            socket.emit('audio:end');
          },
          onWhiteboardCommand: (command) => {
            socket.emit('whiteboard:command', { command });
          },
          onError: (error, recoverable) => {
            socket.emit('session:error', { error: error.message, recoverable });
          },
          onStateChange: (state) => {
            socket.emit('session:stateChange', { state });
          },
        });

        await tutorEngine.initialize();
        activeSessions.set(socket.id, tutorEngine);

        const greeting = await tutorEngine.start();
        socket.emit('session:started', {
          sessionId: tutorEngine.getSessionId(),
          greeting,
        });
      } catch (error) {
        console.error(`[Socket] Failed to start session:`, error);
        socket.emit('session:error', {
          error: error instanceof Error ? error.message : 'Failed to start session',
          recoverable: false,
        });
      }
    });

    socket.on('session:end', async () => {
      if (tutorEngine) {
        try {
          const summary = await tutorEngine.end();
          socket.emit('session:ended', { summary });
        } catch (error) {
          console.error(`[Socket] Error ending session:`, error);
        } finally {
          activeSessions.delete(socket.id);
          tutorEngine = null;
        }
      }
    });

    // Voice events
    socket.on('audio:chunk', ({ chunk, isFinal }) => {
      if (tutorEngine) {
        tutorEngine.handleAudioChunk(chunk, isFinal);
      }
    });

    socket.on('audio:cancel', () => {
      if (tutorEngine) {
        tutorEngine.interrupt();
      }
    });

    // Text fallback
    socket.on('text:message', async ({ text }) => {
      if (tutorEngine) {
        socket.emit('tutor:thinking');
        await tutorEngine.handleTextMessage(text);
      }
    });

    // Whiteboard events
    socket.on('whiteboard:studentDraw', ({ strokes }) => {
      if (tutorEngine) {
        tutorEngine.handleStudentDraw(strokes);
      }
    });

    // Problem events
    socket.on('problem:submit', async ({ problemId, answer }) => {
      if (tutorEngine) {
        await tutorEngine.handleProblemSubmission(problemId, answer);
      }
    });

    socket.on('problem:requestHint', async ({ problemId }) => {
      if (tutorEngine) {
        await tutorEngine.handleHintRequest(problemId);
      }
    });

    socket.on('problem:skip', async ({ problemId }) => {
      if (tutorEngine) {
        await tutorEngine.handleProblemSkip(problemId);
      }
    });

    // Homework upload
    socket.on('homework:upload', async ({ imageData, mimeType }) => {
      if (tutorEngine) {
        try {
          const problems = await tutorEngine.extractProblemsFromImage(imageData, mimeType);
          socket.emit('homework:extracted', { problems });
        } catch (error) {
          socket.emit('homework:error', {
            error: error instanceof Error ? error.message : 'Failed to extract problems',
          });
        }
      }
    });

    // Disconnect handling
    socket.on('disconnect', async (reason) => {
      console.log(`[Socket] Client disconnected: ${socket.id}, reason: ${reason}`);

      if (tutorEngine) {
        try {
          await tutorEngine.end();
        } catch (error) {
          console.error(`[Socket] Error cleaning up session:`, error);
        }
        activeSessions.delete(socket.id);
      }
    });
  });

  return io;
}

/**
 * Get count of active sessions
 */
export function getActiveSessionCount(): number {
  return activeSessions.size;
}

/**
 * Cleanup all active sessions (for graceful shutdown)
 */
export async function cleanupAllSessions(): Promise<void> {
  const promises = Array.from(activeSessions.values()).map((engine) =>
    engine.end().catch((error) => console.error('Error ending session:', error))
  );
  await Promise.all(promises);
  activeSessions.clear();
}
