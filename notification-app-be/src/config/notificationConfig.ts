export const REMOTE_NOTIFICATION_API = 'http://4.224.186.213/evaluation-service/notifications';
export const DEFAULT_PAGE_SIZE = 10;
export const REMOTE_NOTIFICATION_AUTH_HEADER = process.env.EVALUATION_AUTH_TOKEN ?? process.env.NOTIFICATION_API_AUTH_TOKEN ?? '';