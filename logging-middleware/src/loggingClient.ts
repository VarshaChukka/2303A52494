import { ALLOWED_LOG_PACKAGES, type LogEntry, type LogLevel, type LogPackage, type LogStack, type LoggerOptions } from './loggingTypes.js';

const DEFAULT_LOGGING_API = 'http://4.224.186.213/evaluation-service/logs';

function isValidStack(stack: string): stack is LogStack {
  return stack === 'backend' || stack === 'frontend';
}

function isValidLevel(level: string): level is LogLevel {
  return level === 'debug' || level === 'info' || level === 'warn' || level === 'error' || level === 'fatal';
}

function isValidPackage(packageName: string): packageName is LogPackage {
  return (ALLOWED_LOG_PACKAGES as readonly string[]).includes(packageName);
}

function normalizeMessage(message: string) {
  return message.trim();
}

export function createLogger(options: LoggerOptions = {}) {
  const endpoint = options.endpoint ?? DEFAULT_LOGGING_API;

  return async function log(entry: LogEntry): Promise<boolean> {
    if (!isValidStack(entry.stack) || !isValidLevel(entry.level) || !isValidPackage(entry.package)) {
      return false;
    }

    const message = normalizeMessage(entry.message);
    if (!message) {
      return false;
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (options.authToken) {
      headers.Authorization = options.authToken;
    }

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          stack: entry.stack,
          level: entry.level,
          package: entry.package,
          message,
        }),
      });

      return response.ok;
    } catch {
      return false;
    }
  };
}
