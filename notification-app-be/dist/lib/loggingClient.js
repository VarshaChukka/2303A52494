import { LOGGING_API_URL, getBackendLoggingAuthToken } from '../config/loggingConfig.js';
export async function logBackendEvent(entry) {
    const headers = {
        'Content-Type': 'application/json',
    };
    const authToken = getBackendLoggingAuthToken();
    if (authToken) {
        headers.Authorization = authToken;
    }
    try {
        await fetch(LOGGING_API_URL, {
            method: 'POST',
            headers,
            body: JSON.stringify(entry),
        });
    }
    catch {
        // Logging should never break the app flow.
    }
}
