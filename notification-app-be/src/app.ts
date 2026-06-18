import cors from 'cors';
import express from 'express';

import { requestLogger } from './middleware/loggingMiddleware.js';
import { notificationsRouter } from './routes/notificationsRoutes.js';

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(requestLogger);

  app.get('/health', (_, response) => {
    response.json({ status: 'ok' });
  });

  app.use('/api/notifications', notificationsRouter);

  app.use((_, response) => {
    response.status(404).json({ message: 'Route not found' });
  });

  return app;
}