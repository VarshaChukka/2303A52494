import { LOGGING_API_URL, getFrontendLoggingAuthToken } from '../config/loggingConfig';

import type { LogEntry } from '../../../logging-middleware/src/loggingTypes';

const ALLOWED_PACKAGES = new Set([
  'api',
  'component',
  'frontend',
  'hook',
  'page',
  'state',
  'util',
]);

function isValidPackage(packageName: string): packageName is LogEntry['package'] {
  return ALLOWED_PACKAGES.has(packageName);
}

export async function logFrontendEvent(entry: LogEntry): Promise<void> {
  if (!isValidPackage(entry.package)) {
    return;
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const authToken = getFrontendLoggingAuthToken();
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
    // Logging is best-effort only.
  }
}
