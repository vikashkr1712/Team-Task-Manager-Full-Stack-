# Team Task Manager (Full-Stack)

Team Task Manager is a MERN application for managing projects, team members, and tasks with role-based access (Admin and Member).

## Highlights
- JWT authentication with access and refresh tokens
- Role-based access control (Admin/Member)
- Project and team management
- Task creation, assignment, status tracking, and due dates
- Dashboard summary and overdue tasks

## Tech Stack
- Client: React + Vite
- Server: Node.js + Express
- Database: MongoDB (Mongoose)

## Project Structure
```
client/      # React UI
server/      # Express API
```

## Getting Started (Local)

### Prerequisites
- Node.js 18+ (LTS recommended)
- MongoDB (Atlas or local)

### 1) Server Setup
1. Open the server folder.
2. Create a `.env` file using `server/.env.example` as a template.
3. Install dependencies and run:
   - `npm install`
   - `npm run dev`

### 2) Client Setup
1. Open the client folder.
2. Create a `.env` file using `client/.env.example` as a template.
3. Set `VITE_API_URL` to the server URL (local: `http://localhost:5001`).
4. Install dependencies and run:
   - `npm install`
   - `npm run dev`

## Environment Variables

### Server (.env)
- `PORT` - API port (default 5001)
- `MONGODB_URI` - MongoDB connection string
- `MONGODB_DB` - Optional database name
- `JWT_ACCESS_SECRET` - Access token secret
- `JWT_REFRESH_SECRET` - Refresh token secret
- `ADMIN_SIGNUP_SECRET` - Secret required to create the first admin
- `CLIENT_ORIGIN` - Frontend URL for CORS
- `NODE_ENV` - `development` or `production`

### Client (.env)
- `VITE_API_URL` - API base URL

## Authentication and Roles
- Signup creates a member by default.
- Creating the first admin requires `ADMIN_SIGNUP_SECRET`.
- After an admin exists, only admins can promote members via the promote endpoint.

## API Overview

### Auth
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `POST /api/auth/promote` (admin-only)

### Projects
- `GET /api/projects`
- `POST /api/projects`
- `GET /api/projects/:projectId`
- `PUT /api/projects/:projectId`
- `DELETE /api/projects/:projectId`
- `POST /api/projects/:projectId/members`
- `DELETE /api/projects/:projectId/members`

### Tasks
- `GET /api/projects/:projectId/tasks`
- `POST /api/projects/:projectId/tasks`
- `GET /api/tasks/:taskId`
- `PUT /api/tasks/:taskId`
- `DELETE /api/tasks/:taskId`

### Dashboard
- `GET /api/dashboard/summary`

## Deployment

### Backend (Render)
1. Create a new Web Service from the repo.
2. Set the root directory to `server`.
3. Build command: `npm install`
4. Start command: `npm start`
5. Add environment variables from the Server section above.
6. Deploy and copy the service URL.

### Frontend (Vercel)
1. Import the same repo.
2. Set the root directory to `client`.
3. Build command: `npm run build`
4. Output directory: `dist`
5. Add `VITE_API_URL` pointing to the Render URL.
6. Deploy and use the Vercel URL for `CLIENT_ORIGIN` on Render.

## Notes
- Refresh tokens are stored in HTTP-only cookies; access tokens are used in the `Authorization: Bearer` header.
- Keep all secrets private and do not commit `.env` files.
