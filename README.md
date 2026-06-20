# Reverie - AI Decision Intelligence System

**Don't ask AI what to do. Ask AI to help you think.**

Reverie is an AI-powered Decision Intelligence System built for the **USAII Global AI Hackathon 2026** (Challenge: *Build the "Second Brain" for Real Life*). It helps final-year students navigate high-stakes career decisions by surfacing assumptions, detecting contradictions, simulating futures, and clarifying tradeoffs — without ever making a decision for them.

---

## The Problem (Just an example scenario)

A final-year engineering student receives a 6 LPA placement offer. Their dream company arrives later. Family depends on their income. An education loan exists. They are paralysed between accepting certainty and pursuing possibility.

Traditional AI would recommend a path. Reverie helps them **think clearly** so they can choose for themselves.

---

## Core Philosophy

| ❌ Don't Build | ✅ Build |
|---|---|
| Career recommendation engine | Decision Intelligence System |
| AI mentor / advisor | Reasoning amplifier |
| AI chatbot | Structured thinking tool |
| AI decision maker | Human-in-the-loop system |

The AI never says *"You should choose X."* Instead, it helps users understand their **assumptions, tradeoffs, risks, contradictions, and future possibilities** — and then the user decides.

---

## System Architecture — 9 Layers

| # | Layer | What it does |
|---|-------|-------------|
| 1 | **Semantic Extraction** | Extracts goals, fears, constraints, and priorities from natural language |
| 2 | **Belief Graph** | Visualises reasoning as an interactive node-edge graph (React Flow) |
| 3 | **Assumption Stress Test** | Identifies hidden assumptions, rates evidence strength and risk level |
| 4 | **Contradiction Detection** | Highlights inconsistencies in reasoning without judgement |
| 5 | **Counterfactual Scenarios** | Simulates multiple possible futures — labelled as *exploratory scenarios, not predictions* |
| 6 | **Tradeoff Analysis** | Compares futures across multiple dimensions via radar chart — never ranks |
| 7 | **Decision Reflection** | Generates adaptive questions; user submits answers for AI evaluation with clarity score and blind spot analysis |
| 8 | **Decision Report** | Exports the complete 7-layer analysis as a beautifully formatted PDF for offline review |
| 9 | **90-Day Action Plan** | User states their chosen path; AI generates a concrete 30/60/90-day execution plan with risk mitigation; downloadable as PDF |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, TypeScript, Tailwind CSS 4, shadcn/ui |
| Visualisation | React Flow (belief graph), Recharts (radar chart) |
| Backend | Python 3.11+, FastAPI, Uvicorn |
| AI | Google Gemini 2.5 Flash via Vertex AI (structured JSON outputs via `response_mime_type`) |
| Auth (future) | Clerk / Supabase |
| Database (future) | PostgreSQL |
| Package Manager | Poetry (backend), npm (frontend) |

---

## Getting Started

### Prerequisites

- Python 3.11+
- Node.js 18+
- Poetry (`pip install poetry`)
- Google Cloud service account with Vertex AI access

### Backend Setup

```bash
cd backend
poetry install

# Configure environment
cp .env.example .env
# Edit .env and set your Google Cloud project details
# Place your Vertex AI service account key as key.json in the backend directory

# Run
poetry run python main.py
# Starts on http://localhost:8000
```

### Frontend Setup

```bash
cd frontend
npm install

# Configure API URL (defaults to http://localhost:8000)
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local

# Run
npm run dev
# Opens on http://localhost:3000
```

---

## How It Works (Demo Flow)

1. **User inputs** their situation (e.g., *"I have a 6 LPA offer, dream company later, family pressure..."*)
2. **Layer 1** extracts structured goals, constraints, priorities, fears
3. **Layer 2** renders a belief graph visualising their reasoning
4. **Layer 3** reveals hidden assumptions with risk ratings
5. **Layer 4** detects contradictions in their logic
6. **Layer 5** generates three future scenarios with upsides, downsides, and confidence
7. **Layer 6** displays a radar chart comparing tradeoffs across dimensions
8. **Layer 7** asks reflection questions to deepen thinking
9. **Layer 8** exports the full analysis as a beautifully formatted PDF for review
10. **User reviews** the PDF and states their chosen path in Layer 9
11. **Layer 9** generates a 90-day action plan with risk mitigation and validation checkpoints — also downloadable as PDF

---

## Responsible AI

Reverie is designed with **Responsible AI** at its core:

- **No recommendations** — the AI never suggests a choice
- **Scenarios ≠ predictions** — every future simulation carries a disclaimer
- **Human-in-the-loop** — the user always makes the final decision
- **Transparency** — reasoning, assumptions, and tradeoffs are fully visible
- **No judgement** — contradictions are highlighted neutrally

The system succeeds when it transforms: **Confusion → Clarity → Action** — while keeping humans fully in control.

---

## Project Structure

```
USAII/
├── backend/
│   ├── main.py                 # FastAPI app entry point
│   ├── pyproject.toml          # Poetry dependency management
│   ├── .env / .env.example     # Environment configuration
│   ├── key.json                # Google Vertex AI service account
│   ├── routers/
│   │   └── decision.py         # API routes (/api/analyze, /api/contract, /api/action-plan, /api/evaluate-reflection)
│   ├── schemas/
│   │   └── models.py           # Pydantic models for all layers
│   └── services/
│       └── ai_service.py       # Gemini 2.5 Flash integration via Vertex AI
├── frontend/
│   ├── src/
│   │   ├── app/                # Next.js App Router pages
│   │   ├── components/         # React components per layer
│   │   └── lib/                # Types, API client, PDF export utilities
│   └── package.json
└── README.md
```