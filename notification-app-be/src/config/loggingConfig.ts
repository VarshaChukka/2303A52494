export const LOGGING_API_URL = 'http://4.224.186.213/evaluation-service/logs';

export function getBackendLoggingAuthToken() {
  return process.env.EVALUATION_AUTH_TOKEN ?? process.env.LOGGING_API_AUTH_TOKEN ?? process.env.NOTIFICATION_API_AUTH_TOKEN ?? '';
}
