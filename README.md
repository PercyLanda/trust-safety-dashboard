# 🛡️ Trust & Safety Case Management Dashboard

A full-stack simulation of real-world **Trust & Safety operations systems**, designed to demonstrate how platforms triage, investigate, and resolve high-risk content at scale.

> ⚠️ **Disclaimer:** All cases, users, and content in this application are fictional and created for portfolio demonstration purposes only.

---

## 🎯 Why This Project Exists

Most CRUD apps show technical ability.
This project demonstrates **domain understanding of Trust & Safety workflows**, including:

* Case triage and prioritization
* Risk-based decision making
* Analyst assignment and ownership
* Escalation pipelines
* Operational metrics and reporting

This mirrors how real moderation and integrity teams operate at companies like Meta, TikTok, and Google.

---

## 🧠 What This Simulates

* 📥 **Incoming case queues** (spam, fraud, abuse, misinformation, etc.)
* 🔍 **Analyst workflows** (review, investigate, annotate)
* 🚨 **Escalation paths** for high-risk content
* 📊 **Operational dashboards** (SLA-style metrics)
* 👥 **Ownership models** ("assigned to me" filtering)

---

## ✨ Key Features

### 🚦 Case Management

* Track cases through lifecycle:
  `pending → in-review → escalated → resolved`
* Add analyst notes for investigation context

### 🔴 Risk-Based Prioritization

* Low / Medium / High risk classification
* High-risk cases surfaced in dashboard metrics

### ⚡ Escalation Workflow

* One-click escalation
* Automatically updates status and priority

### 📊 Operational Metrics (T&S-focused)

* Total cases
* High-risk cases
* Pending / Resolved
* **Cases created today**
* **Cases resolved today**

### 👤 Analyst Workflow Simulation

* “Assigned to me” filter (ownership model)
* Uneven workload distribution across analysts

### 🎯 Advanced Filtering

* Filter by:

  * Status
  * Risk level
  * Category
  * Assigned analyst

---

## 🛠️ Tech Stack

**Backend**

* Node.js
* Express
* MongoDB (Mongoose)

**Frontend**

* React 19
* Vite
* Tailwind CSS v4

**Architecture**

* REST API (`/api/cases`)
* Proxy-based local development (no CORS issues)
* Monorepo structure (backend + frontend)

---

## ⚡ Quick Start (1 Command)

```bash
git clone https://github.com/PercyLanda/trust-safety-dashboard.git
cd trust-safety-dashboard
npm install
npm install --prefix backend
npm install --prefix frontend
npm run demo
```

### What this does:

* Seeds realistic Trust & Safety cases (75+)
* Starts backend on **http://localhost:3000**
* Starts frontend on **http://localhost:5173**

---

## 🧪 API Example

```bash
GET /api/cases
```

Example response:

```json
{
  "success": true,
  "data": [...]
}
```

---

## 🌍 Live Demo

* **Frontend:** *coming soon*
* **Backend API:** *coming soon*

---

## 🚀 Deployment

### Backend → Render

* Root Directory: `backend`
* Build Command: `npm install`
* Start Command: `npm start`

Environment variables:

* `MONGO_URI`
* `CLIENT_URL`

---

### Frontend → Vercel

* Root Directory: `frontend`

Environment variables:

* `VITE_API_URL`

---

## 📌 What Makes This Different

This is not just a CRUD app.

It demonstrates:

* Trust & Safety domain knowledge
* Operational thinking (SLA, triage, escalation)
* Data-driven workflows
* Realistic system design for moderation platforms

---

## 📣 Status

🚧 Actively improving:

* Live deployment (Render + Vercel)
* Authentication (analyst roles)
* Audit logs & case history
* Advanced reporting dashboards

---

## 👤 Author

**Percy Landa**
📍 San Francisco Bay Area

* GitHub: https://github.com/PercyLanda
* LinkedIn: https://www.linkedin.com/in/percylanda/
