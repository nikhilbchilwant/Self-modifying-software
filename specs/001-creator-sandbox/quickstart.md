# Quickstart: Creator Sandbox & Feature Request Demo

This quickstart guides you through setting up and running the Creator Sandbox web application locally.

## Prerequisites
- Node.js (version 18 or higher recommended)
- `npm` or `yarn` package manager
- OpenRouter API key for the Pi SDK provider framework

## Installation & Setup

1. **Install Dependencies**:
   Navigate to the root directory and install dependencies for both the frontend and backend. The frontend additionally requires `recharts` (charts) and `lucide-react` (icons) per the feature spec.
   ```bash
   # Install root and backend dependencies
   npm install

   # Install frontend dependencies
   cd frontend
   npm install
   cd ..
   ```

2. **Configure Environment**:
   Copy the backend example env file and add your OpenRouter key.
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env and set:
   # PI_AI_PROVIDER=openrouter
   # PI_AI_MODEL=tencent/hy3:free
   # OPENROUTER_API_KEY=your_openrouter_api_key_here
   cd ..
   ```

## Running the Application

1. **Start the Backend Service**:
   Run the Express server in development mode.
   ```bash
   cd backend
   npm run dev
   ```
   The backend server runs at `http://localhost:5000`.

2. **Start the Frontend Application**:
   Run the Vite development server.
   ```bash
   cd frontend
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

## How to Test the Demo Flow

1. Access the web interface.
2. Click the **"Enter Sandbox Mode"** button. This creates a temporary sandbox component backend-side.
3. Submit a prompt in the sidebar (e.g., `"Make the background theme dark grey and change the title to 'Custom Analytics Dashboard'"`).
4. Watch the component hot-reload instantly.
5. Click **"Submit Feature Request"** to capture a snapshot of the interface and export the generated code diff. The feedback details will be saved to the local folder at `.specify/feedback/`.
6. Click **"Exit Sandbox Mode"** to return the app back to the stable production layout.

## Verification Commands

Run these to satisfy the testing and performance quality gates (constitution + SC-001/SC-002/SC-004):

```bash
# Lint + format (all packages)
npm run lint

# Unit + integration + smoke tests
npm test

# Focused verification-loop tests (FR-009 / FR-012)
npm test -- sandbox.ai

# Performance checks (timed): HMR < 1.5s, snapshot < 2s, exit-restore < 1s
npm run verify:perf
```

A failing verification loop MUST revert to the last known working sandbox code and surface a frontend warning overlay; it MUST NOT inject unverified code via HMR.
