
---

# 🛡️ Trust & Safety Case Management Dashboard

A full-stack simulation of real-world **Trust & Safety operations systems**, designed to demonstrate how online platforms detect, triage, investigate, and resolve harmful content at scale.

> ⚠️ **Disclaimer:** All cases, users, and content in this application are fictional and created strictly for portfolio demonstration purposes.

---

# 🎯 Why This Project Exists

Most CRUD applications demonstrate basic technical execution.

This project goes further by showcasing **domain understanding of Trust & Safety and Integrity operations**, including:

* Case triage and prioritization workflows
* Risk-based decision making (low / medium / high severity)
* Analyst assignment and ownership models
* Escalation pipelines for high-risk content
* Operational metrics and dashboarding

It reflects how real **Trust & Safety, Integrity, and Risk Operations teams** function at companies such as Meta, TikTok, and Google.

---

# 🧠 What This Simulates

* 📥 Incoming case queues (spam, fraud, abuse, misinformation, etc.)
* 🔍 Analyst review workflows (investigate, annotate, update status)
* 🚨 Escalation systems for high-risk content
* 📊 Operational dashboards with real-time metrics
* 👥 Ownership model (“assigned to me” filtering)

---

# 🏗️ System Architecture

## 🔄 High-Level Flow

```
Frontend (Vercel)
    ↓
REST API (Render - Express)
    ↓
MongoDB (Case Storage)
```

---

## ⚙️ Component Breakdown

### 🖥️ Frontend (Vercel)

* React + Vite
* Tailwind CSS UI
* Fetches data from backend via `VITE_API_URL`
* Handles filtering, escalation, and dashboard rendering

---

### 🧠 Backend (Render)

* Node.js + Express REST API
* Routes: `/api/cases`
* CRUD operations:

  * Create case
  * Update case
  * Delete case
  * Fetch cases (with filters)

---

### 🗄️ Database (MongoDB)

Stores all Trust & Safety cases with metadata such as:

* status
* risk level
* category
* assignment
* timestamps
* notes

---

# 🧩 Data Model (MongoDB Schema)

## 📦 Case Schema

```
Case
│
├── _id
├── title
├── status (pending | in-review | escalated | resolved)
├── priority (low | medium | high)
├── riskLevel (low | medium | high)
├── category (spam | abuse | fraud | phishing | hate_speech | ...)
├── assignedTo
├── notes
├── createdAt
└── updatedAt
```

---

## 🧠 Why this matters

This schema mirrors real Trust & Safety systems because it supports:

* lifecycle tracking
* risk-based prioritization
* ownership assignment
* auditability via timestamps
* operational filtering

---

# 📸 Screenshots

## 🧭 Dashboard Overview

![Dashboard Overview](./screenshots/dashboard.png)

High-level view of case volume, risk distribution, and operational KPIs.

---

## 🚦 Case Management & Filtering

![Case Management](./screenshots/cases.png)

Filter cases by status, risk level, category, and analyst assignment.

---

## 🔴 Escalation Workflow

![Escalation](./screenshots/escalation.png)

One-click escalation updates case priority and status.

---

## 📝 Case Details & Notes

![Case Notes](./screenshots/notes.png)

Analysts document investigation findings and decision context.

---

# ✨ Key Features

## 🚦 Case Lifecycle Management

Track cases through structured states:

```
pending → in-review → escalated → resolved
```

---

## 🔴 Risk-Based Prioritization

* Low / Medium / High classification
* High-risk cases surfaced in dashboard metrics

---

## ⚡ Escalation System

* One-click escalation
* Auto-updates status + priority

---

## 📊 Operational Metrics

* Total cases
* High-risk cases
* Pending vs resolved
* Cases created today
* Cases resolved today

---

## 👤 Analyst Workflow Simulation

* “Assigned to me” filtering
* Workload ownership model

---

## 🎯 Advanced Filtering

Filter by:

* Status
* Risk level
* Category
* Assigned analyst

---

# 🛠️ Tech Stack

## Backend

* Node.js
* Express
* MongoDB (Mongoose)

## Frontend

* React 19
* Vite
* Tailwind CSS v4

## Architecture

* REST API (`/api/cases`)
* Separate frontend/backend services
* Render + Vercel deployment

---

# ⚡ Quick Start

```bash
git clone https://github.com/PercyLanda/trust-safety-dashboard.git
cd trust-safety-dashboard
npm install
npm install --prefix backend
npm install --prefix frontend
npm run demo
```

### What this does:

* Seeds 70+ realistic cases
* Starts backend: `http://localhost:3000`
* Starts frontend: `http://localhost:5173`

---

# 🧪 API Example

```
GET /api/cases
```

Response:

```json
{
  "success": true,
  "data": []
}
```

---

# 🌍 Live Demo

* Frontend: [https://trust-safety-dashboard-2mcpnw9zp-percylandas-projects.vercel.app](https://trust-safety-dashboard-2mcpnw9zp-percylandas-projects.vercel.app)
* Backend: [https://trust-safety-dashboard.onrender.com/api/cases](https://trust-safety-dashboard.onrender.com/api/cases)

---

# 🚀 Deployment

## Backend (Render)

* Root: `backend`
* Start: `npm start`

Env:

* `MONGO_URI`
* `CLIENT_URL`

---

## Frontend (Vercel)

* Root: `frontend`

Env:

* `VITE_API_URL`

---

# 📌 What Makes This Different

This is not just a CRUD app.

It demonstrates:

* Trust & Safety systems thinking
* Real moderation workflows
* Risk operations modeling
* Production-grade deployment
* Full-stack architecture design

---

# 📣 Roadmap

* Authentication (analyst roles)
* Audit logs
* Real-time updates (WebSockets)
* Advanced analytics dashboard
* Role-based access control

---

# 👤 Author

**Percy Landa**
📍 San Francisco Bay Area

* GitHub: [https://github.com/PercyLanda](https://github.com/PercyLanda)
* LinkedIn: [https://www.linkedin.com/in/percylanda/](https://www.linkedin.com/in/percylanda/)

---

