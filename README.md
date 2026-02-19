**AI-Based Student Dropout Prediction & Counseling Platform**

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Python](https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white)](https://python.org/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com/)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white)](https://vercel.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

</div>

---

## 🎯 What is CareSphere?

CareSphere is a **centralized digital platform** that tackles the silent crisis of student attrition in educational institutions. Instead of reactive damage control, CareSphere enables **proactive intervention** — identifying at-risk students *before* they disengage.

It replaces fragmented spreadsheets and siloed department data with a **unified AI-driven ecosystem** that delivers real-time risk alerts, counseling access, and intervention tracking — all in one place.

---

## 🧠 How It Works

```
📤 Data Upload  →  🔄 ETL Pipeline  →  🤖 ML Inference  →  📊 Risk Dashboard  →  🔔 Intervention
```

1. Teachers/admins upload semester data via the frontend
2. An automated **ETL job** cleans, normalizes, and engineers features
3. The **Hybrid AI model** predicts dropout risk per student
4. Results are stored and visualized as color-coded risk alerts
5. High-risk flags trigger **instant mentor-to-parent notifications**

---

## 🤖 The Hybrid AI Engine

CareSphere doesn't use a black-box model. It combines two complementary approaches:

| Component | Role |
|-----------|------|
| 🌲 **Random Forest (ML)** | Detects subtle, non-linear patterns in academic & behavioral data |
| 📏 **Rule-Based Logic** | Enforces institution-defined thresholds (e.g., attendance < 75% = risk) |

**Output — Color-Coded Risk Alerts:**

🔴 **Red** → High Risk · Immediate intervention needed  
🟡 **Yellow** → Moderate Risk · Close monitoring required  
🟢 **Green** → Low Risk · Baseline performance

> Each prediction comes with **Explainable AI (XAI)** — counselors see *why* a student is flagged, not just that they are.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js, React, Tailwind CSS, Radix UI |
| **Backend** | Next.js Server Routes, Supabase (BaaS) |
| **Database** | PostgreSQL (via Supabase) with Row-Level Security |
| **ML/AI** | Python, Random Forest, Custom ETL Pipeline |
| **Auth** | Supabase Auth + Role-Based Access Control (RBAC) |
| **Deployment** | Vercel |
| **Version Control** | GitHub |

---

## 👥 Role-Based Access

CareSphere enforces strict **Row Level Security (RLS)** — each user only sees what they're meant to:

- 🎓 **Student** — Views their own risk profile and counseling resources
- 🧑‍🏫 **Teacher** — Uploads data, monitors assigned students
- 🩺 **Counselor** — Views flagged students, logs interventions
- 🔐 **Admin** — System-wide oversight and configuration

---

## 📊 Data Model

The system consolidates fragmented institutional data into structured, validated tables:

- **Student Demographics** — Identification and background
- **Academic Performance** — Grades, scores, historical trends
- **Engagement Metrics** — Attendance and participation records
- **Risk Profiles** — ML predictions with categories: `Low | Optimistic | Pessimistic | Mitigation`

---

## ⚡ Key Features

- 🔄 **Automated ETL Pipeline** — Runs on every data update, no manual processing
- 📉 **Trend-Based Feature Engineering** — Tracks grade trajectory, not just static scores
- 🔔 **Notification System** — Closes the loop from insight → intervention automatically
- 🔒 **Encrypted Data** — At rest and in transit, built for government-grade data sovereignty
- ☁️ **Serverless & Scalable** — From single institute to state-level deployment, no special hardware needed

---

## 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/deepro0204/caresphere.git
cd caresphere

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your Supabase URL, anon key, and other secrets

# Run development server
npm run dev
```

> 📌 Requires a Supabase project with the schema set up. See `/docs/schema.sql` for the database structure.

---

## 🔗 Links

| Resource | Link |
|----------|------|
| 🖥️ Live Demo | [Portal](v0-studentdropoutsystem.vercel.app/) |
| 📁 Repository | [GitHub](https://github.com/deepro0204) |

---
