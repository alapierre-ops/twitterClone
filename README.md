# YNot — Twitter/X clone

Full-stack Twitter/X clone (school sprint, one week) built with **React 19 + TypeScript**, **Redux Toolkit**, **Express**, **MongoDB**, **Socket.io**, and **Cloudinary**.

**Live:** https://ynot.axel-lapierre.dev

## Features

- JWT authentication (register, login, session verify)
- Posts, likes, comments, reposts
- Follow / unfollow with notifications
- Real-time notifications via WebSocket
- User and post search
- Avatar upload (Cloudinary)
- Responsive layout with mobile bottom navigation
- Dark theme UI

## Architecture

```
Frontend (ynot.axel-lapierre.dev)  →  REST API + WebSocket
                                            ↓
                                      MongoDB Atlas
                                            ↓
                                      Cloudinary (avatars)
```

## Local development

### Prerequisites

- Node.js 20+
- MongoDB (local or Atlas)

### Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

Backend runs at `http://localhost:5000`.

**Environment variables** (`backend/.env`):

| Variable | Description |
|----------|-------------|
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Strong random secret |
| `PORT` | API port (default 5000) |
| `FRONTEND_URL` | Frontend origin for CORS |
| `CLOUDINARY_*` | Optional, for avatar upload |

Seed demo data:

```bash
npm run seed        # insert
npm run seed:destroy  # remove
```

### Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`.

**Environment variables** (`frontend/.env`):

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | API base URL (e.g. `http://localhost:5000/api`) |

## Tests

```bash
cd backend && npm test
cd frontend && npm test
```

## Deployment

### 1. MongoDB Atlas

1. Create a free M0 cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Add a database user and allow network access (`0.0.0.0/0` for Render)
3. Copy the connection string into `MONGO_URI`

### 2. Backend (Render)

1. Push this repo to GitHub
2. Create a new **Web Service** on [render.com](https://render.com)
3. Use `render.yaml` or configure manually:
   - Root directory: `backend`
   - Build: `npm install`
   - Start: `npm start`
4. Set environment variables (see backend `.env.example`)
5. Set `FRONTEND_URL` to `https://ynot.axel-lapierre.dev` once the frontend is live

Alternatively use **Railway** with the same env vars.

### 3. Cloudinary (avatars)

1. Create a free account at [cloudinary.com](https://cloudinary.com)
2. Add `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` to backend env

### 4. Frontend

1. Deploy the Vite app (Netlify or any static host; `netlify.toml` is in the repo)
2. Set `VITE_API_URL` to your API base (e.g. `https://your-api.onrender.com/api`)
3. Point `ynot.axel-lapierre.dev` at that deploy

### Post-deploy checklist

- [ ] Run `npm run seed` against Atlas (from local machine with Atlas URI)
- [ ] Verify login, posts, search, notifications, avatar upload
- [ ] Confirm WebSocket connects (check browser DevTools → Network → WS)
- [ ] Keep `FRONTEND_URL` on the backend in sync with the live frontend origin

## Project structure

```
backend/src/
  controllers/   # Route handlers
  middlewares/   # Auth, validation, errors
  models/        # Mongoose schemas
  routes/        # Express routers
  utils/         # Socket helpers

frontend/src/
  domains/       # Feature slices (auth, posts, users, etc.)
  pages/         # Route pages
  components/    # Shared UI
```

## Security notes

- All mutations derive the acting user from JWT (no IDOR)
- Rate limiting on auth routes
- Input validation with Zod
- CORS restricted to `FRONTEND_URL`
- Helmet security headers

## License

MIT
