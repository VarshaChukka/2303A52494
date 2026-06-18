import { useEffect, useMemo, useState } from 'react';

import { fetchNotifications } from '../api/notifications';
import { logFrontendEvent } from '../utils/logging';
import { rankNotifications } from '../utils/notificationRanking';
import type { NotificationFilterValue, NotificationItem } from '../types/notification';

const DEFAULT_PAGE_SIZE = 10;
const RANKING_FETCH_LIMIT = 1000;
const VIEWED_STORAGE_KEY = 'affordmed-viewed-notifications';

function readViewedIds(): Set<string> {
  try {
    const rawValue = window.localStorage.getItem(VIEWED_STORAGE_KEY);
    const parsed = rawValue ? (JSON.parse(rawValue) as string[]) : [];
    return new Set(parsed);
  } catch {
    return new Set();
  }
}

function persistViewedIds(ids: Set<string>) {
  window.localStorage.setItem(VIEWED_STORAGE_KEY, JSON.stringify(Array.from(ids)));
}

export function useNotifications(filter: NotificationFilterValue, page: number) {
  const [allNotifications, setAllNotifications] = useState<NotificationItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewedIds, setViewedIds] = useState<Set<string>>(() => readViewedIds());

  useEffect(() => {
    let active = true;

    async function loadNotifications() {
      setLoading(true);
      setError(null);

      void logFrontendEvent({
        stack: 'frontend',
        level: 'debug',
        package: 'hook',
        message: `Entering loading state for filter=${filter}, page=${page}`,
      });

      try {
        const data = await fetchNotifications({
          page: 1,
          limit: RANKING_FETCH_LIMIT,
          notificationType: filter,
        });

        if (!active) {
          return;
        }

        setAllNotifications(data.notifications ?? []);
        setTotal(data.total ?? data.notifications?.length ?? 0);

        void logFrontendEvent({
          stack: 'frontend',
          level: 'info',
          package: 'hook',
          message: `Loaded ${data.notifications?.length ?? 0} notifications`,
        });
      } catch (loadError) {
        if (!active) {
          return;
        }

        setError(loadError instanceof Error ? loadError.message : 'Unable to load notifications');
        setAllNotifications([]);
        setTotal(0);

        void logFrontendEvent({
          stack: 'frontend',
          level: 'error',
          package: 'hook',
          message: loadError instanceof Error ? loadError.message : 'Unable to load notifications',
        });
      } finally {
        if (active) {
          setLoading(false);

          void logFrontendEvent({
            stack: 'frontend',
            level: 'debug',
            package: 'state',
            message: `Exiting loading state for filter=${filter}, page=${page}`,
          });
        }
      }
    }

    loadNotifications();

    return () => {
      active = false;
    };
  }, [filter, page]);

  const rankedNotifications = useMemo(
    () => rankNotifications(allNotifications, viewedIds),
    [allNotifications, viewedIds],
  );

  const notifications = useMemo(() => {
    const startIndex = (page - 1) * DEFAULT_PAGE_SIZE;
    return rankedNotifications.slice(startIndex, startIndex + DEFAULT_PAGE_SIZE);
  }, [page, rankedNotifications]);

  const unreadCount = useMemo(
    () => allNotifications.filter((notification) => !viewedIds.has(notification.ID)).length,
    [allNotifications, viewedIds],
  );

  const totalPages = Math.max(1, Math.ceil(total / DEFAULT_PAGE_SIZE));

  function markAsViewed(notificationId: string) {
    setViewedIds((currentIds) => {
      if (currentIds.has(notificationId)) {
        return currentIds;
      }

      const nextIds = new Set(currentIds);
      nextIds.add(notificationId);
      persistViewedIds(nextIds);

      void logFrontendEvent({
        stack: 'frontend',
        level: 'info',
        package: 'state',
        message: `Marked notification ${notificationId} as viewed`,
      });

      return nextIds;
    });
  }

  return {
    notifications,
    unreadCount,
    totalPages,
    loading,
    error,
    markAsViewed,
  };
}