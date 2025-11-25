# 🤖 SmartReq – Intelligent Candidate Evaluation System

SmartReq is an AI-powered platform that transforms the recruiting process by combining automated CV analysis, multi-source evaluation, and natural WhatsApp conversations to build a complete and transparent candidate profile.

---

## 📋 Project Overview

SmartReq improves traditional recruiting through:

* **5 Specialized AI Agents**, each evaluating a specific competency dimension
* **Multi-Source Analysis**: CV, LinkedIn, GitHub, portfolio, certifications
* **Smart WhatsApp Conversations**: A chatbot that fills missing data naturally
* **Advanced Analytics Dashboard**: KPIs, comparison views, radar charts
* **Full Automation**: From CV upload to final evaluation

---

## 🏗️ Project Structure

```
📁 The Big Hack 2025/
├── 📁 Data Structures/       
│   ├── evaluation.sql
│   ├── evaluation.ts
│   ├── job_offer.sql
│   └── job_offer.ts
├── 📁 Integration/
│   ├── api documentation.md
│   └── supabase.txt
├── 📁 Models/
│   ├── Smartreq - Chatbot.json
│   └── Smartreq - Evaluation.json
├── 📁 Presentation/
│   ├── Presentation.key
│   └── script.txt
├── 📁 Prompts/
├── 📁 Resources/
│   ├── detailed_model.txt
│   ├── userflow.txt
│   └── whatsapp.txt
└── 📁 Webapp/
    ├── public/
    ├── src/
    │   ├── components/
    │   ├── contexts/
    │   ├── types/
    │   └── utils/
    └── build/
```

---

## 🎯 Core Features

### 🤖 The Five AI Agents

1. **Pro** – Professional Experience Analyst
   Evaluates relevance, impact, and career progression.

2. **Tech** – Technical Engineer
   Measures technical depth, code quality, and GitHub project strength.

3. **Moty** – Motivation & Drive Analyst
   Detects passion, consistency, side projects, and long-term commitment.

4. **Edu** – Education & Learning Mentor
   Assesses academic background, certifications, and continuous learning.

5. **Softy** – Soft Skills & Culture Fit Evaluator
   Analyzes communication, collaboration, values, and cultural alignment.

---

### 💬 WhatsApp Conversational Agent

**Mia**, the AI assistant, automatically contacts candidates to:

* Request missing information
* Conduct natural, human-like conversations
* Update evaluations in real time
* Maintain a human-centered digital process

---

### 📊 Analytics Dashboard

* **Candidate Overview**
* **Role Management**
* **KPI Metrics and Charts**
* **Side-by-Side Candidate Comparison**
* **Radar Chart for Evaluation Dimensions**

---

## 🚀 Installation & Setup

### Requirements

* Node.js 18+
* npm or yarn
* Supabase project
* SmartReq API access

### 1. Clone the Repository

```bash
git clone [repository-url]
cd "The Big Hack 2025"
```

### 2. Install Dependencies

```bash
cd Webapp
npm install
```

### 3. Environment Variables

Create a `.env` file inside `Webapp/`:

```env
# Supabase
VITE_SUPABASE_URL=https://evsymppxmhfvfgmkviij.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# SmartReq API
VITE_SMARTREQ_API_URL=https://primary-production-6beb.up.railway.app

# WhatsApp Integration (optional)
VITE_WHATSAPP_WEBHOOK_URL=your_webhook_url

# App Config
VITE_APP_NAME=SmartReq
VITE_COMPANY_ID=your_company_id
```

### 4. Database Setup

Execute the SQL files in `Data Structures/` inside Supabase:

* `evaluation.sql`
* `job_offer.sql`

### 5. Run the App

```bash
npm run dev
# or
npm run build
```

App available at:
`http://localhost:5173`

---

## 🔧 Advanced Configuration

### n8n Integration

Workflows are located in `Models/`:

* **Smartreq - Chatbot.json** → WhatsApp automation
* **Smartreq - Evaluation.json** → AI evaluation pipeline

Import them into your n8n instance to enable full automation.

### SmartReq API Docs

See `Integration/api documentation.md` for:

* Endpoints
* Request/response schemas
* Examples
* Error handling

---

## 📱 How the System Works

### For Companies

1. Create a new job role
2. Define skills, weights, and requirements
3. Generate a secure candidate link
4. Track applications in real time
5. Compare, evaluate, decide

### For Candidates

1. Access the secure link
2. Upload CV and links (LinkedIn, GitHub, portfolio)
3. Complete missing info via WhatsApp
4. Receive a transparent evaluation summary

---

## 🔄 User Flow

```
Company Dashboard → Create Role
       ↓
Define Skills & Weights
       ↓
Generate Secure Link
       ↓
Candidate Submits CV & Links
       ↓
AI Extracts Data → Detects Missing Info
       ↓
WhatsApp Agent Fills the Gaps
       ↓
Complete AI Evaluation
       ↓
Dashboard Analytics & Comparison
```

---

## 🛠️ Technologies

**Frontend:**
React 18 · TypeScript · Vite · Tailwind · Radix UI · Recharts · React Hook Form

**Backend & Infra:**
Supabase · n8n · Railway · WhatsApp Business API

**AI:**
Multi-agent evaluation system · NLP for CV and conversations

---

## 📚 Additional Documentation

* `Resources/detailed_model.txt` – System architecture
* `Resources/userflow.txt` – User journey
* `Resources/whatsapp.txt` – WhatsApp setup
* `Presentation/script.txt` – Pitch script

---

## 🤝 Contributing

1. Fork
2. Create a new branch
3. Commit with clear messages
4. Open a Pull Request

---

## 📞 Support

For support:

* Check `/Webapp/src/docs/`
* Review integration files
* Validate environment configuration
