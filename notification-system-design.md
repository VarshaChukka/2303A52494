# Notification System Design

## Overview

This repository implements a campus notification experience with a TypeScript backend proxy, a Material UI frontend, and a reusable request logging middleware. The upstream evaluation service remains the source of notification data, while the local backend provides a stable app-facing contract, request tracing, and a place to expand behavior if the scope grows.

## Requirements Mapping

- Frontend: React + TypeScript + Material UI.
- Backend: TypeScript Express server with notification endpoints.
- Logging: reusable request logging middleware applied to notification traffic.
- Storage: no durable notification database is required for the current evaluation scope.

## Stage 1

### API contract

The frontend consumes a paginated notification feed. The normalized notification model is:

```json
{
  "ID": "string",
  "Type": "Event | Result | Placement",
  "Message": "string",
  "Timestamp": "ISO-8601 string"
}
```

### Notification endpoints

- `GET /api/notifications`
- `POST /api/notifications/notify-all`

### Controller responsibilities

- Validate and normalize request query/body data.
- Fetch notifications from the evaluation service.
- Return a stable JSON response.
- Emit request logs for traceability.

### Logging middleware

The logging middleware records:

- HTTP method.
- Request path.
- Response status code.
- Elapsed time in milliseconds.

This is enough for request-level observability without introducing a logging database or external dependency.

## Stage 2

### Storage choice

No database is required for the current task because the notification feed comes from the evaluation API and the user-facing app only needs to read, filter, and page data.

### Why this choice works

- It avoids duplicating upstream state.
- It keeps the system simpler and faster to deliver.
- It aligns with the brief’s instruction not to store notifications manually.

### If storage is added later

If future requirements include persistent read-state, audit history, or notifications authored inside the app, PostgreSQL would be the best default. The likely table design would include notification ID, type, message, timestamp, recipient metadata, and read status.

## Stage 3

### Query analysis

For a query like:

```sql
SELECT * FROM notifications
WHERE studentID = 1042 AND isRead = false
ORDER BY createdAt ASC;
```

the main cost is scanning many rows and sorting them after filtering.

### Index recommendation

The most useful index is a composite index on the equality filters followed by the sort column:

```sql
CREATE INDEX idx_notifications_student_read_created
ON notifications (studentID, isRead, createdAt);
```

This reduces lookup cost and avoids a large sort step for the common unread-notification access pattern.

### Why not index every column

Indexing every column is usually wasteful because it increases write overhead and storage usage without helping the actual query shape as much as a targeted composite index.

## Stage 4

### Page-load bottleneck

The main problem on page load is repeated fetch work for the same notification data across the app.

### Strategy

- Proxy the upstream API through the backend.
- Keep filtering and paging state in the client.
- Reuse the same response contract across the frontend.

### Outcome

This reduces direct dependency on the remote service, simplifies CORS and endpoint handling, and makes the frontend easier to maintain.

## Stage 5

### Bulk notification delivery

The proposed `notify_all(student_ids, message)` flow should fan out to both email and in-app channels.

### Operational concerns

- Email sending should be asynchronous.
- DB writes and external delivery should not block the request thread.
- The API should return acceptance, not guarantee final delivery success.

### Logging requirement

The notification dispatch path should log request receipt, fan-out initiation, and any downstream failure so delivery issues can be traced quickly.

## Stage 6

### Priority inbox

Priority should combine type, recency, and unread status.

### Suggested weighting

```text
priority_score = type_weight + recency_weight + unread_bonus
```

### UI ordering

- Unread placement notifications first.
- Then unread event notifications.
- Then unread result notifications.
- Then older or already-viewed items.

### Why this fits the app

The ranking is computed in the frontend after the API payload arrives, which keeps the backend contract simple and the user experience responsive. The implementation now actually sorts the feed so the inbox shows the most important unread Placement items first, then unread Result items, then unread Event items, with recency breaking ties.

## Stage 7

### Frontend architecture

The frontend is structured into a page container, a filter control, a notification card, and a data-loading hook. The hook owns fetch state, unread counts, and local viewed-state persistence.

### Implemented UX

- Responsive Material UI layout.
- Unread badge count.
- Type filter chips.
- Pagination.
- Empty, loading, and error states.

### Backend integration

The frontend talks to the local backend, and the backend proxies the remote notification service. That keeps all request logging in one place and gives the UI a stable origin to target.

## Deliverables

### Files completed

- Backend TypeScript app and routes.
- Reusable logging middleware.
- Material UI frontend in TypeScript.
- Completed design document.

### Submission notes

The code is organized so the backend and frontend can be started independently, while the design document captures the reasoning expected by the evaluation brief.
