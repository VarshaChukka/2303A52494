import { ALLOWED_LOG_PACKAGES } from './loggingTypes.js';
const DEFAULT_LOGGING_API = 'http://4.224.186.213/evaluation-service/logs';
function isValidStack(stack) {
    return stack === 'backend' || stack === 'frontend';
}
function isValidLevel(level) {
    return level === 'debug' || level === 'info' || level === 'warn' || level === 'error' || level === 'fatal';
}
function isValidPackage(packageName) {
    return ALLOWED_LOG_PACKAGES.includes(packageName);
}
function normalizeMessage(message) {
    return message.trim();
}
export function createLogger(options = {}) {
    const endpoint = options.endpoint ?? DEFAULT_LOGGING_API;
    return async function log(entry) {
        if (!isValidStack(entry.stack) || !isValidLevel(entry.level) || !isValidPackage(entry.package)) {
            return false;
        }
        const message = normalizeMessage(entry.message);
        if (!message) {
            return false;
        }
        const headers = {
            'Content-Type': 'application/json',
        };
        if (options.authToken) {
            headers.Authorization = options.authToken;
        }
        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    stack: entry.stack,
                    level: entry.level,
                    package: entry.package,
                    message,
                }),
            });
            return response.ok;
        }
        catch {
            return false;
        }
    };
}
