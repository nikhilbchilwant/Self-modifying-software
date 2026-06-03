# Creator Sandbox & Feature Request Demo

This repository contains a full-stack implementation of the **Creator Sandbox** and feature request flow. It allows developers and creators to toggle into a sandbox environment, preview and interact with compiler-checked AI modifications to the UI, capture baseline and modified visual diffs along with screenshots, and submit developer feedback directly to the codebase.

---

## 🛠️ Technology Stack

- **Frontend**: React (v18), Vite, Recharts, Lucide Icons, and `html2canvas` (for client-side screenshot generation).
- **Backend**: Node.js, Express, ESM (`"type": "module"`), TypeScript (compiles with `tsx`), and `@earendil-works/pi-ai` (Unified LLM SDK).
- **Testing**: Vitest + JSDOM.

---

## 🚀 Getting Started

### 1. Installation
Run npm installs in both the backend and frontend directories:

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Running the Servers
Start both servers in development mode:

```bash
# Start backend watcher server (Port 5000)
cd backend
npm run dev

# Start frontend development server (Port 5174 / 5173)
cd ../frontend
npm run dev
```

The frontend uses Vite's reverse proxy to route `/api` calls directly to the Express backend at `http://localhost:5000`.

---

## 🧪 Testing and QA

The project includes unit, integration, and E2E validation scripts.

### Running Backend Tests
Runs 10/10 Vitest tests checking sandbox state, smoke paths, compiler validation, and feedback collection:
```bash
cd backend
npm run test
```

### Running Frontend Tests
Runs 8/8 Vitest tests checking React layout, sandbox triggers, error boundaries, and dynamic variable-based lazy loading:
```bash
cd frontend
npm run test
```

### Running E2E Verification Script
Runs a dedicated programmatic manual QA E2E lifecycle (spins up a separate mock server, acts as the client, writes and compiles the files, and checks files on disk):
```bash
cd backend
npx tsx C:\Users\Nikhil\.gemini\antigravity-cli\brain\6efa737d-b5de-4176-8637-53bed4cf3dfe\scratch\qa_verify.mts
```

---

## 🧠 Pi AI Integration and Fallback System

The backend connects to `@earendil-works/pi-ai` and targets Google Gemini (`gemini-flash-latest`). 

### Handling Missing API Credentials
If the local environment lacks `GEMINI_API_KEY`, the application fails gracefully using **robust visual fallback rules** in `backend/src/services/ai.ts`. This allows full QA testing of user requests without requiring active API keys:
- **Language changes** (e.g., *Change language to Spanish*): Translates the entire SaaS Dashboard headings, goals, and metrics into Spanish or French.
- **Title changes** (e.g., *Change title to SaaS Dashboard*): Replaces the primary header text with the requested string.
- **Theme/Color changes** (e.g., *Dark mode*): Switches background colors dynamically to dark-mode.
- **Target Goals** (e.g., *Set target to 5000*): Alters the progress calculation metric value dynamically.

---

## 📂 Project Architecture

```
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   ├── sandbox.ts        # Enter, exit, modify routes
│   │   │   └── feedback.ts       # Feedback ingestion route
│   │   ├── services/
│   │   │   ├── sandbox.ts        # Creation and deletion files
│   │   │   └── ai.ts             # LLM SDK + visual fallback rules
│   │   └── utils/
│   │       ├── compiler.ts       # Live ts.createProgram compiler validation
│   │       └── fileStore.ts      # Writes diffs and png screenshots to disk
│   └── tests/                    # Vitest server tests
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.tsx     # Apple Keynote Light theme SaaS dashboard
│   │   │   └── SandboxControls.ts# Sidebar instructions and feedback submitter
│   │   ├── utils/
│   │   │   └── snapshot.ts       # html2canvas and visual diff calculations
│   │   ├── App.tsx               # Main container with error bounds & lazy imports
│   │   └── index.css             # Root styles and global tokens
│   └── src/test/                 # Vitest component and render tests
│
└── .specify/feedback/            # Location of submitted screenshots and diffs
```
