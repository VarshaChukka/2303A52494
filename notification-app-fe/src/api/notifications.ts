import type { NotificationApiResponse, NotificationFilterValue } from '../types/notification';
import { logFrontendEvent } from '../utils/logging';

const DEFAULT_API_BASE = 'http://localhost:4000/api';

function buildBaseUrl() {
  return import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE;
}

export async function fetchNotifications(options: {
  page?: number;
  limit?: number;
  notificationType?: NotificationFilterValue;
} = {}): Promise<NotificationApiResponse> {
  const searchParams = new URLSearchParams();

  if (options.page) {
    searchParams.set('page', String(options.page));
  }

  if (options.limit) {
    searchParams.set('limit', String(options.limit));
  }

  if (options.notificationType && options.notificationType !== 'All') {
    searchParams.set('notification_type', options.notificationType);
  }

  const requestUrl = `${buildBaseUrl()}/notifications?${searchParams.toString()}`;

  void logFrontendEvent({
    stack: 'frontend',
    level: 'info',
    package: 'api',
    message: `Fetching notifications from ${requestUrl}`,
  });

  const response = await fetch(requestUrl);

  if (!response.ok) {
    void logFrontendEvent({
      stack: 'frontend',
      level: 'error',
      package: 'api',
      message: `Notifications API failed with status ${response.status}`,
    });

    throw new Error(`Request failed with status ${response.status}`);
  }

  void logFrontendEvent({
    stack: 'frontend',
    level: 'info',
    package: 'api',
    message: 'Notifications API request succeeded',
  });

  return response.json();
}