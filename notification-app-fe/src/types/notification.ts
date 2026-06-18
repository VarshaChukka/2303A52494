export type NotificationType = 'Event' | 'Result' | 'Placement';

export interface NotificationItem {
  ID: string;
  Type: NotificationType | string;
  Message: string;
  Timestamp: string;
}

export interface NotificationApiResponse {
  notifications: NotificationItem[];
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
}

export type NotificationFilterValue = 'All' | NotificationType;