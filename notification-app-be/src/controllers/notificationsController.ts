import type { Request, Response } from 'express';

import { getNotifications, notifyAll } from '../services/notificationsService.js';

function parsePage(value: unknown) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : 1;
}

function parseLimit(value: unknown) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : 10;
}

export async function listNotifications(request: Request, response: Response) {
  try {
    const data = await getNotifications({
      page: parsePage(request.query.page),
      limit: parseLimit(request.query.limit),
      notificationType: typeof request.query.notification_type === 'string' ? request.query.notification_type : undefined,
    });

    response.json(data);
  } catch (error) {
    response.status(502).json({
      message: 'Failed to fetch notifications',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

export async function sendToAll(request: Request, response: Response) {
  try {
    const { studentIds, message } = request.body as { studentIds?: Array<string | number>; message?: string };

    if (!Array.isArray(studentIds) || studentIds.length === 0 || typeof message !== 'string' || !message.trim()) {
      response.status(400).json({ message: 'studentIds and message are required' });
      return;
    }

    response.status(202).json(await notifyAll({ studentIds, message: message.trim() }));
  } catch (error) {
    response.status(500).json({
      message: 'Failed to dispatch notifications',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}