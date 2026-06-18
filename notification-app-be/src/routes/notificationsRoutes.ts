import { Router } from 'express';

import { listNotifications, sendToAll } from '../controllers/notificationsController.js';

export const notificationsRouter = Router();

notificationsRouter.get('/', listNotifications);
notificationsRouter.post('/notify-all', sendToAll);