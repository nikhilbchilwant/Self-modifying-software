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

### 2. Configure AI Credentials
Copy the backend environment template and set your OpenRouter key:

```bash
cd backend
cp .env.example .env
# Edit .env and set OPENROUTER_API_KEY=your_openrouter_api_key_here
```

The demo defaults to `PI_AI_PROVIDER=openrouter` and `PI_AI_MODEL=tencent/hy3:free`.

### 3. Running the Servers
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

## 🧠 Pi AI Integration

The backend connects to `@earendil-works/pi-ai` and defaults to OpenRouter using `tencent/hy3:free`. Provider, model, and API key are configured through `backend/.env` (copy `backend/.env.example` first).

### Live AI Connection Required
All sandbox modifications depend on a live LLM call. Configure `OPENROUTER_API_KEY` in `backend/.env` before running the sandbox. You can override `PI_AI_PROVIDER` and `PI_AI_MODEL` for another provider/model if needed; keep real keys out of git.

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
│   │   │   └── ai.ts             # LLM SDK integration (requires live provider)
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
