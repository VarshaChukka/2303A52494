# Campus Notification System

A full-stack notification platform built as part of a campus evaluation assignment.

## Project Structure

```
Campus-Evaluation-FS/
├── logging-middleware/
├── notification-app-be/
├── notification-app-fe/
└── notification-system-design.md
```

## Features

### Frontend
- React + TypeScript
- Material UI
- Notification Dashboard
- Priority Inbox
- Notification Type Filters
  - Placement
  - Result
  - Event
- Responsive Mobile/Desktop Layout
- Error Handling
- Real-time Refresh Support

### Backend
- Node.js
- Express
- REST APIs
- Notification Proxy Service
- Logging Middleware Integration
- Bulk Notification Endpoint
- Health Check Endpoint

### Logging Middleware
- Reusable logging package
- API request logging
- Error logging
- State transition logging
- Action tracking

## API Endpoints

### Health Check

```
GET /health
```

### Get Notifications

```
GET /api/notifications
```

### Bulk Notification

```
POST /api/notifications/notify-all
```

Request:

```json
{
  "studentIds": [101, 102, 103],
  "message": "Placement drive notification"
}
```

## Run Frontend

```bash
cd notification-app-fe
npm install
npm run dev
```

Runs on:

```
http://localhost:3000
```

## Run Backend

```bash
cd notification-app-be
npm install
npm run dev
```

Runs on:

```
http://localhost:4000
```

## Design Documentation

See:

```
notification-system-design.md
```

for Stage 1 – Stage 6 solutions.

## Tech Stack

- React
- TypeScript
- Material UI
- Node.js
- Express
- REST APIs
