# SelfEvolvingSoftware

### Note: This project was completely vibe coded

## Why this project exists

This project demonstrates a simple but important idea: **AI can now enable software to modify part of itself safely, as long as the loop is sandboxed, verifiable, and easy to inspect**.

The demo is intentionally narrow. It does not let AI rewrite the whole system. Instead, it lets a user modify a single React dashboard component in a controlled sandbox, see the result live, capture the outcome as a screenshot and code diff, and then discard the change.

In this repo, the production dashboard lives at `frontend/src/components/Dashboard.tsx`. Sandbox mode creates a temporary copy at `frontend/src/components/Dashboard.sandbox.tsx`. Prompts are sent to an Express/TypeScript backend, which uses Pi AI (`@earendil-works/pi-ai`) to generate updated TSX. If the generated component passes verification, the sandbox file is updated and the browser reflects the change immediately. If it does not, the change is rejected or reverted. Feedback is stored locally under `.specify/feedback/` as PNG and JSON artifacts.

## Demo video

<video controls width="100%" src="demo/demo_sandbox_demo.mp4">
  Your browser does not support the video tag.
</video>

## Architecture at a glance

- **Frontend** — React + Vite (`frontend/src/App.tsx`)
  - switches between the production dashboard and the sandbox dashboard
  - preserves surrounding application state while Vite hot-swaps the module
- **Sandbox API** — Express routes (`backend/src/routes/sandbox.ts`)
  - enters sandbox mode
  - applies prompt-driven modifications
  - exits and cleans up the sandbox file
- **AI integration** — Pi AI service (`backend/src/services/ai.ts`)
  - sends the current TSX plus the user prompt to the configured model
  - extracts code from the model response
- **Verification** — TypeScript compiler check (`backend/src/utils/compiler.ts`)
  - validates generated code before the sandbox change is kept
- **Feedback capture** — screenshot + diff
  - screenshot from `frontend/src/utils/snapshot.ts` via `html2canvas`
  - unified diff generated in `backend/src/services/diff.ts`
  - artifacts persisted by `backend/src/utils/fileStore.ts`

## Quickstart

For setup and local execution, see [specs/001-creator-sandbox/quickstart.md](specs/001-creator-sandbox/quickstart.md).
