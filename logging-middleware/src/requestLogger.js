import { createLogger } from './loggingClient.js';
const log = createLogger({
    authToken: process.env.EVALUATION_AUTH_TOKEN ?? process.env.LOGGING_API_AUTH_TOKEN ?? process.env.NOTIFICATION_API_AUTH_TOKEN,
});
export function requestLogger(request, response, next) {
    const startedAt = Date.now();
    response.on('finish', () => {
        const elapsedMs = Date.now() - startedAt;
        void log({
            stack: 'backend',
            level: response.statusCode >= 500 ? 'error' : response.statusCode >= 400 ? 'warn' : 'info',
            package: 'middleware',
            message: `${request.method} ${request.originalUrl} ${response.statusCode} ${elapsedMs}ms`,
        });
    });
    next();
}
