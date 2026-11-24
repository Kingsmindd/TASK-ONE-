# TaskDuty

A responsive task manager for organising priorities, planning deadlines, and tracking progress. Built as a full-stack portfolio project with React, TypeScript, Tailwind CSS, Express, and MongoDB.

## Demo login

| Field | Value |
| --- | --- |
| Email | `umehjnr0041@gmail.com` |
| Password | `demoaccount` |

This public demo account has 12 sample tasks in the local `taskone_local` database, including completed, pending, urgent, and overdue work. It has not been provisioned in the production database. Use sample information only; a shared demo account is intended for public testing.

## Features

- Register, sign in, and manage tasks belonging to your account.
- Create, edit, delete, and mark tasks as completed, with confirmation before deletion.
- Choose Important or Urgent priorities using accessible selection cards.
- Set deadlines using a compact, scrollable calendar or Today, Tomorrow, and Next week shortcuts.
- Track total, completed, and pending tasks in the workspace.
- Search titles and descriptions, and combine status, priority, and date filters.
- Responsive navigation, mobile dropdowns, password visibility controls, and confirmation-password validation.
- Form validation, request cancellation, timeouts, and actionable error messages.

## Project structure

The frontend and backend are separate repositories:

- Frontend: [TASK-ONE-](https://github.com/Kingsmindd/TASK-ONE-)
- Backend: [TaskDuty-backend-](https://github.com/Kingsmindd/TaskDuty-backend-)

Frontend code lives in `src/Pages`, `src/componets` (existing folder spelling), and `src/api`. Backend code is organised into routes, controllers, services, models, middleware, and configuration.

## Run locally

Use Node.js 22.12 or later and a MongoDB database. If both repositories are checked out as sibling `client` and `server` folders, run each in its own terminal.

### Backend

In `server`, run `npm ci`. Copy `.env.example` to `.env` and configure:

```dotenv
MONGODB_URI=mongodb://127.0.0.1:27017/taskone_local
JWT_SECRET=replace-with-a-long-random-local-secret
CLIENT_URL=http://localhost:5173
PORT=5000
```

The local MongoDB example requires a running MongoDB installation. An Atlas connection can also be used with a separate `taskone_local` database name. Start the API with `npm run dev`.

### Frontend

In `client`, run `npm ci`. Create `.env.local`:

```dotenv
VITE_API_URL=/api
```

Run `npm run dev`, then open [localhost:5173](http://localhost:5173). Vite forwards `/api` requests to `http://localhost:5000`. Port 5173 must be free.

Local environment files are ignored by Git. Configure a separate development database to keep sample tasks separate from production data. Editing local environment files does not change Render or Vercel environment variables.

## Search examples

| Search | Result |
| --- | --- |
| `website is:pending tag:urgent` | Pending urgent tasks containing website |
| `title:"website update"` | A phrase in the title |
| `description:report -meeting` | Report in the description, excluding meeting |
| `after:2026-12-01 before:2027-01-01` | Tasks due strictly between those dates |
| `-is:completed` | Tasks that are not completed |

Terms combine with AND. Search is case-insensitive and treats punctuation literally. Date filters exclude tasks without due dates. Supported operators are `is`, `tag`, `title`, `description`, `before`, and `after`.

## Authentication and validation

Passwords are hashed with bcrypt. The API verifies signed JWTs, validates request data, and scopes task queries to the authenticated owner. Access tokens expire after three hours and are stored in session storage, persisting across refreshes in the same browser tab. There is no refresh-token flow. Signing out clears the browser session.

## Checks

Frontend:

```powershell
npm run build
npm run lint
```

Backend:

```powershell
npm run build
npm test
```

The existing backend tests cover task-search parsing and query construction; they do not replace end-to-end authentication and database testing.

## Deployment

Set `VITE_API_URL` in Vercel to the deployed API URL including `/api`, then rebuild. Configure `MONGODB_URI`, `JWT_SECRET`, and `CLIENT_URL` in Render; `CLIENT_URL` must match the deployed frontend origin. Vercel's SPA rewrite is provided in `vercel.json`.

The current frontend work is on `feature/task-search`. Merge it into the configured production branch when ready for a production deployment.
