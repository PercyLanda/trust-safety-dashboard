# Trust & Safety Case Management Dashboard

A full-stack MERN application simulating real-world Trust & Safety workflows including case triage, escalation, analyst assignment, and risk prioritization.

> **Note:** All cases, users, and content are fictional and used for portfolio demonstration purposes only.

## Features

- **Case Triage** — Create, filter, and prioritize incoming cases by status, risk level, and category
- **Risk Analysis** — Tag cases with low/medium/high risk and surface high-risk items in the dashboard summary
- **Escalation Workflows** — One-click escalation promotes a case to `escalated` status with high priority
- **Real-time Stats** — Dashboard counters for total cases, high-risk, pending, resolved, and today's activity
- **Filtering** — Filter by status, risk level, category, or assigned analyst

## Tech Stack

- **Backend:** Node.js, Express, MongoDB (Mongoose)
- **Frontend:** React 19, Vite, Tailwind CSS v4
- **Deployment:** Render (backend) + Vercel (frontend)

## Local Setup

### Prerequisites

- Node.js 18+
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

### 1. Clone the repo

```bash
git clone <repo-url>
cd trust-safety-dashboard
```

### 2. Configure environment variables

```bash
# Backend
cp backend/.env.example backend/.env
# Edit backend/.env — set MONGO_URI to your connection string

# Frontend (optional for local dev — proxy handles it)
cp frontend/.env.example frontend/.env
```

### 3. Install dependencies

```bash
npm install
npm install --prefix backend
npm install --prefix frontend
```

### 4. Run locally (with seed data)

```bash
npm run demo
```

This seeds the database and starts both backend (port 3000) and frontend (port 5173) concurrently.

## Deployment

### Backend → Render

1. Create a new **Web Service** on [Render](https://render.com)
2. Connect your repo, set **Root Directory** to `backend`
3. Build command: `npm install`
4. Start command: `npm start`
5. Add environment variables:
   - `MONGO_URI` — your MongoDB Atlas connection string
   - `CLIENT_URL` — your Vercel frontend URL (e.g. `https://your-app.vercel.app`)

### Frontend → Vercel

1. Import your repo on [Vercel](https://vercel.com)
2. Set **Root Directory** to `frontend`
3. Add environment variable:
   - `VITE_API_URL` — your Render backend URL (e.g. `https://your-api.onrender.com`)
4. Deploy — Vercel auto-detects Vite via `vercel.json`

## Live Demo

- **Frontend:** _coming soon_
- **Backend API:** _coming soon_
