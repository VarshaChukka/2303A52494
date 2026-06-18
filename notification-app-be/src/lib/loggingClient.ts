import { LOGGING_API_URL, getBackendLoggingAuthToken } from '../config/loggingConfig.js';

interface LogEntry {
  stack: 'backend' | 'frontend';
  level: 'debug' | 'info' | 'warn' | 'error' | 'fatal';
  package:
    | 'api'
    | 'backend'
    | 'component'
    | 'config'
    | 'controller'
    | 'frontend'
    | 'hook'
    | 'logger'
    | 'middleware'
    | 'page'
    | 'route'
    | 'service'
    | 'state'
    | 'util';
  message: string;
}

export async function logBackendEvent(entry: LogEntry): Promise<void> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const authToken = getBackendLoggingAuthToken();
  if (authToken) {
    headers.Authorization = authToken;
  }

  try {
    await fetch(LOGGING_API_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify(entry),
    });
  } catch {
    // Logging should never break the app flow.
  }
}
