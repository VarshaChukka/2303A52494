export const LOGGING_API_URL = 'http://4.224.186.213/evaluation-service/logs';

export function getFrontendLoggingAuthToken() {
  return import.meta.env.VITE_EVALUATION_AUTH_TOKEN || import.meta.env.VITE_LOGGING_API_AUTH_TOKEN || '';
}
