# Team Task Manager (Full-Stack)

A MERN app for managing projects, teams, and tasks with role-based access.

## Features
- Auth (signup/login) with JWT access + refresh
- Project and team management
- Task creation, assignment, status tracking
- Dashboard summary and overdue tasks

## Local Setup

### Server
1. Go to the server folder.
2. Create a `.env` from `server/.env.example` and fill values.
3. Install and run:
   - `npm install`
   - `npm run dev`

### Client
1. Go to the client folder.
2. Create a `.env` from `client/.env.example` and set `VITE_API_URL`.
3. Install and run:
   - `npm install`
   - `npm run dev`

## Deployment

### Backend (Render)
- Create a new Web Service from the `server` folder.
- Set build command to `npm install` and start command to `npm start`.
- Add environment variables from `server/.env.example`.

### Frontend (Vercel)
- Import the `client` folder as a Vercel project.
- Set `VITE_API_URL` to your Render backend URL.
- Build command: `npm run build`, output: `dist`.

## Notes
- The API uses HTTP-only cookies for refresh tokens and `Authorization: Bearer` for access tokens.
- Set `CLIENT_ORIGIN` to the frontend URL in production.
# Team-Task-Manager-Full-Stack-
