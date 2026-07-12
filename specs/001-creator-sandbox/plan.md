# Implementation Plan: Creator Sandbox & Feature Request Demo

**Branch**: `001-creator-sandbox` | **Date**: 2026-05-28 | **Spec**: [spec.md](file:///C:/Users/Nikhil/workspace/SelfEvolvingSoftware/specs/001-creator-sandbox/spec.md)

**Input**: Feature specification from [spec.md](file:///C:/Users/Nikhil/workspace/SelfEvolvingSoftware/specs/001-creator-sandbox/spec.md)

## Summary

Build a local demo application that shows a mock SaaS Analytics Dashboard with a "Sandbox Mode". When in Sandbox Mode, users type natural language requests (e.g., "Add a target line to the chart"). The backend uses the Pi SDK/API (configured via existing Codex subscription or multi-provider setup) to modify a temporary sandbox copy of the Dashboard React component. Vite's HMR dynamically reloads the component in the browser. Users can capture a screenshot using `html2canvas` and save the request and diff locally before exiting sandbox mode, which restores the original dashboard.

## Technical Context

**Language/Version**: Node.js (TypeScript v5.x), React (TypeScript v18.x)

**Primary Dependencies**: `express`, `vite`, `react`, `react-dom`, `@earendil-works/pi-ai`, `@earendil-works/pi-agent-core`, `html2canvas`, `diff` (for generating visual diffs), `recharts` (charts), `lucide-react` (icons)

**Storage**: Local file system (feedback stored in `.specify/feedback/` as JSON and PNG screenshots)

**Testing**: Vitest for both frontend components and backend endpoints

**Target Platform**: Modern Web Browsers, Local Node.js environment

**Project Type**: Web application (Frontend + Backend)

**Performance Goals**:
- UI Hot reload under 1.5 seconds after AI compilation
- Snapshot capture and storage under 2 seconds

**Constraints**:
- Absolute sandbox isolation: AI-generated **code** writes are strictly restricted to `*.sandbox.tsx` files. This does NOT forbid writing feedback artifacts; generated **feedback artifacts** (PNG screenshots and JSON diff/metadata) are explicitly permitted to be written under `.specify/feedback/`.
- Zero downtime: State-preserving reloading (HMR).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Code Quality**: Adhere to strict TypeScript types. Keep component modification functions side-effect free.
- **Testing Standards**: Establish Vitest unit tests for HMR file-swap mechanics and Express endpoints. Additionally, every user story MUST have integration tests and smoke tests per the constitution: US2 MUST add feedback integration/smoke tests; US3 MUST add theme/accessibility/visual-consistency tests; the verification loop (FR-009/FR-012) MUST have backend unit tests covering compile-failure retry, revert-on-failure, and warning signaling. Performance baselines (SC-001, SC-002, SC-004) MUST be validated by a timed test/measurement task (see tasks T-Perf-*).
- **User Experience Consistency**: Use CSS variables for dashboard theme consistency; when modifying the dashboard, the Sandbox Mode frame keeps consistent control UI.
- **Performance Requirements**: Fast response for AI modifications; keep file swaps efficient.

## Project Structure

### Documentation (this feature)

```text
specs/001-creator-sandbox/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── checklists/
    └── requirements.md  # Specification Quality Checklist
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── index.ts          # Main Express server
│   ├── services/
│   │   ├── ai.ts         # Pi SDK integration
│   │   └── sandbox.ts    # File swap and diff generation service
│   └── routes/
│       └── feedback.ts   # Route to save screenshots and diffs
└── package.json

frontend/
├── src/
│   ├── main.tsx
│   ├── App.tsx           # Entry application hosting Sandbox / Dashboard wrapper
│   ├── components/
│   │   ├── Dashboard.tsx # Production dashboard component
│   │   └── SandboxControls.tsx # Sidebar for sandbox interaction
│   └── index.css         # Styling with CSS variables
├── package.json
└── vite.config.ts
```

**Structure Decision**: Option 2 (Web application with separate backend/ and frontend/ folders).

## Verification Loop & Failure Handling

To satisfy FR-009 and FR-012, the backend `ai.ts` service implements a bounded verification loop:

1. Generate candidate component code from the prompt.
2. Compile/type-check the sandbox component (e.g., `tsc --noEmit` / Vite build check) and run lint.
3. If errors: feed error logs back to Pi SDK and retry (max 3 attempts).
4. If still failing after retries: revert `Dashboard.sandbox.tsx` to the last known working version, do NOT notify HMR, and return a `verificationFailed` result so the frontend shows a warning overlay.
5. Only on success: write verified code; Vite HMR pushes the update (state preserved).

At session entry (`POST /api/sandbox/enter`), the system captures a baseline snapshot of the production component file (FR-006a/FR-008) used for all diffs and for restore-on-exit.

## Complexity Tracking

No violations of Constitution principles detected.
