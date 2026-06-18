## Notification App Backend

TypeScript Express server for the campus notification evaluation.

### Run

```bash
npm install
npm run dev
```

### Build

```bash
npm run build
```

### Endpoints

- `GET /health`
- `GET /api/notifications`
- `POST /api/notifications/notify-all`

The notification routes use the request logging middleware for request tracing.

### Upstream API auth

Set one of these environment variables before running the backend so it can reach the protected evaluation API:

- `EVALUATION_AUTH_TOKEN`
- `NOTIFICATION_API_AUTH_TOKEN`

The backend forwards the value as the `Authorization` header to the upstream notifications service.
