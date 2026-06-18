## Logging Middleware

Reusable request logger for Express apps.

It sends logs to the evaluation logging API at `POST http://4.224.186.213/evaluation-service/logs`.

### What it logs

- HTTP method
- Request URL
- Response status
- Request duration

### Payload format

```json
{
  "stack": "backend | frontend",
  "level": "debug | info | warn | error | fatal",
  "package": "validated assignment package name",
  "message": "string"
}
```

### Authorization

The logging API is protected. Provide the token through one of these environment variables:

- `EVALUATION_AUTH_TOKEN`
- `LOGGING_API_AUTH_TOKEN`
- `NOTIFICATION_API_AUTH_TOKEN`

### Run/type-check

```bash
npm install
npx tsc -p tsconfig.json --noEmit
```

Import `requestLogger` from `src/index.ts` and register it with `app.use(...)`.
