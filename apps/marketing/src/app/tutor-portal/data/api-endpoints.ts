export interface ApiEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  description: string;
  category: string;
}

export const apiEndpoints: ApiEndpoint[] = [
  // Sessions
  { method: 'GET', path: '/sessions', description: 'List sessions with filtering (date range, student, subject, status)', category: 'Sessions' },
  { method: 'GET', path: '/sessions/:id', description: 'Get session details including metadata', category: 'Sessions' },
  { method: 'GET', path: '/sessions/:id/transcript', description: 'Get full transcript with timestamps', category: 'Sessions' },
  { method: 'GET', path: '/sessions/:id/whiteboard', description: 'Get whiteboard command history', category: 'Sessions' },
  { method: 'GET', path: '/sessions/:id/replay', description: 'Get session replay data (transcript + whiteboard + timing)', category: 'Sessions' },
  { method: 'DELETE', path: '/sessions/:id', description: 'Delete a session and all associated data', category: 'Sessions' },

  // Students
  { method: 'GET', path: '/students/:id/sessions', description: 'List all sessions for a student', category: 'Students' },
  { method: 'GET', path: '/students/:id/progress', description: 'Get student progress summary (topics covered, time spent, milestones)', category: 'Students' },
  { method: 'GET', path: '/students/:id/usage', description: 'Get usage and cost breakdown for a student', category: 'Students' },
  { method: 'DELETE', path: '/students/:id/data', description: 'Delete all data for a student (GDPR)', category: 'Students' },

  // Curriculum Modules
  { method: 'GET', path: '/modules', description: 'List all uploaded curriculum modules', category: 'Curriculum Modules' },
  { method: 'GET', path: '/modules/:id', description: 'Get module details and status', category: 'Curriculum Modules' },
  { method: 'POST', path: '/modules', description: 'Upload a new curriculum module (JSON)', category: 'Curriculum Modules' },
  { method: 'POST', path: '/modules/ingest', description: 'Upload curriculum PDFs for automatic ingestion', category: 'Curriculum Modules' },
  { method: 'POST', path: '/modules/bulk', description: 'Bulk upload modules (ZIP archive)', category: 'Curriculum Modules' },
  { method: 'PUT', path: '/modules/:id', description: 'Update an existing module', category: 'Curriculum Modules' },
  { method: 'DELETE', path: '/modules/:id', description: 'Delete a module', category: 'Curriculum Modules' },
  { method: 'GET', path: '/modules/:id/status', description: 'Check ingestion/processing status', category: 'Curriculum Modules' },
  { method: 'GET', path: '/modules/:id/coverage', description: 'Get topic coverage report for a module', category: 'Curriculum Modules' },

  // Usage & Billing
  { method: 'GET', path: '/usage', description: 'Aggregate usage summary (date range, grouping by day/week/month)', category: 'Usage & Billing' },
  { method: 'GET', path: '/usage/breakdown', description: 'Detailed cost breakdown by subject, level, student cohort', category: 'Usage & Billing' },
  { method: 'GET', path: '/usage/forecast', description: 'Projected usage and cost based on current trends', category: 'Usage & Billing' },
  { method: 'GET', path: '/invoices', description: 'List invoices', category: 'Usage & Billing' },
  { method: 'GET', path: '/invoices/:id', description: 'Get invoice details', category: 'Usage & Billing' },

  // Webhooks
  { method: 'GET', path: '/webhooks', description: 'List configured webhook endpoints', category: 'Webhooks' },
  { method: 'POST', path: '/webhooks', description: 'Register a new webhook endpoint', category: 'Webhooks' },
  { method: 'PUT', path: '/webhooks/:id', description: 'Update webhook configuration', category: 'Webhooks' },
  { method: 'DELETE', path: '/webhooks/:id', description: 'Remove a webhook endpoint', category: 'Webhooks' },
  { method: 'GET', path: '/webhooks/:id/events', description: 'List recent events for a webhook (including failed deliveries)', category: 'Webhooks' },
  { method: 'POST', path: '/webhooks/:id/test', description: 'Send a test event to verify endpoint connectivity', category: 'Webhooks' },

  // Configuration
  { method: 'GET', path: '/config', description: 'Get current partner configuration', category: 'Configuration' },
  { method: 'PUT', path: '/config', description: 'Update partner configuration (branding, defaults, feature toggles)', category: 'Configuration' },
  { method: 'GET', path: '/config/taxonomy', description: 'Get available subjects, topics, and levels', category: 'Configuration' },
  { method: 'GET', path: '/voices', description: 'List available voice options with audio samples', category: 'Configuration' },
];

export const apiCategories = [...new Set(apiEndpoints.map((e) => e.category))];
