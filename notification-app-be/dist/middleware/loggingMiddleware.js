import { logBackendEvent } from '../lib/loggingClient.js';
export function requestLogger(request, response, next) {
    const startedAt = Date.now();
    response.on('finish', () => {
        const elapsedMs = Date.now() - startedAt;
        void logBackendEvent({
            stack: 'backend',
            level: response.statusCode >= 500 ? 'error' : response.statusCode >= 400 ? 'warn' : 'info',
            package: 'middleware',
            message: `${request.method} ${request.originalUrl} ${response.statusCode} ${elapsedMs}ms`,
        });
    });
    next();
}
