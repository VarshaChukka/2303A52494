import { DEFAULT_PAGE_SIZE, REMOTE_NOTIFICATION_API, REMOTE_NOTIFICATION_AUTH_HEADER } from '../config/notificationConfig.js';
import type { NotificationApiResponse, NotificationItem, NotifyAllRequest } from '../types/notification.js';

function normalizeNotification(notification: Record<string, unknown>): NotificationItem {
  return {
    ID: String(notification.ID ?? notification.id ?? ''),
    Type: String(notification.Type ?? notification.type ?? 'Event'),
    Message: String(notification.Message ?? notification.message ?? ''),
    Timestamp: String(notification.Timestamp ?? notification.timestamp ?? new Date().toISOString()),
  };
}

function paginate(notifications: NotificationItem[], page: number, limit: number): NotificationApiResponse {
  const startIndex = (page - 1) * limit;
  const pageItems = notifications.slice(startIndex, startIndex + limit);

  return {
    notifications: pageItems,
    page,
    limit,
    total: notifications.length,
    totalPages: Math.max(1, Math.ceil(notifications.length / limit)),
  };
}

export async function getNotifications(options: {
  page?: number;
  limit?: number;
  notificationType?: string;
} = {}): Promise<NotificationApiResponse> {
  const page = Math.max(1, options.page ?? 1);
  const limit = Math.max(1, options.limit ?? DEFAULT_PAGE_SIZE);
  const requestHeaders: Record<string, string> = {};

  if (REMOTE_NOTIFICATION_AUTH_HEADER) {
    requestHeaders.Authorization = REMOTE_NOTIFICATION_AUTH_HEADER;
  }

  const response = await fetch(REMOTE_NOTIFICATION_API, {
    headers: requestHeaders,
  });

  if (!response.ok) {
    throw new Error(`Remote notification API responded with ${response.status}`);
  }

  const payload = (await response.json()) as { notifications?: Record<string, unknown>[] };
  const normalizedNotifications = (payload.notifications ?? []).map(normalizeNotification);

  const filteredNotifications =
    options.notificationType && options.notificationType !== 'All'
      ? normalizedNotifications.filter((notification) => notification.Type === options.notificationType)
      : normalizedNotifications;

  return paginate(filteredNotifications, page, limit);
}

export async function notifyAll(request: NotifyAllRequest) {
  const recipientCount = request.studentIds.length;

  return {
    message: request.message,
    studentIds: request.studentIds,
    emailDispatchCount: recipientCount,
    inAppDispatchCount: recipientCount,
    delivered: true,
    timestamp: new Date().toISOString(),
  };
}