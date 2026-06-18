import type { NotificationItem } from '../types/notification';

const TYPE_WEIGHT: Record<string, number> = {
  Placement: 300,
  Result: 200,
  Event: 100,
};

function getRecencyWeight(timestamp: string, oldestTimestamp: number, newestTimestamp: number) {
  const parsedTimestamp = new Date(timestamp).getTime();

  if (Number.isNaN(parsedTimestamp) || newestTimestamp === oldestTimestamp) {
    return 0;
  }

  const normalized = (parsedTimestamp - oldestTimestamp) / (newestTimestamp - oldestTimestamp);
  return Math.round(normalized * 50);
}

export function rankNotifications(
  notifications: NotificationItem[],
  viewedIds: Set<string>,
): NotificationItem[] {
  if (notifications.length === 0) {
    return [];
  }

  const timestamps = notifications
    .map((notification) => new Date(notification.Timestamp).getTime())
    .filter((value) => !Number.isNaN(value));

  const oldestTimestamp = timestamps.length > 0 ? Math.min(...timestamps) : Date.now();
  const newestTimestamp = timestamps.length > 0 ? Math.max(...timestamps) : Date.now();

  return [...notifications].sort((left, right) => {
    const leftUnreadBonus = viewedIds.has(left.ID) ? 0 : 1000;
    const rightUnreadBonus = viewedIds.has(right.ID) ? 0 : 1000;

    const leftScore =
      (TYPE_WEIGHT[left.Type] ?? 0) +
      getRecencyWeight(left.Timestamp, oldestTimestamp, newestTimestamp) +
      leftUnreadBonus;
    const rightScore =
      (TYPE_WEIGHT[right.Type] ?? 0) +
      getRecencyWeight(right.Timestamp, oldestTimestamp, newestTimestamp) +
      rightUnreadBonus;

    if (rightScore !== leftScore) {
      return rightScore - leftScore;
    }

    const timestampDifference = new Date(right.Timestamp).getTime() - new Date(left.Timestamp).getTime();
    if (timestampDifference !== 0) {
      return timestampDifference;
    }

    return left.ID.localeCompare(right.ID);
  });
}