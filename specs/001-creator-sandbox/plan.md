# Implementation Plan: Creator Sandbox & Feature Request Demo

**Branch**: `001-creator-sandbox` | **Date**: 2026-05-28 | **Spec**: [spec.md](file:///C:/Users/Nikhil/workspace/SelfEvolvingSoftware/specs/001-creator-sandbox/spec.md)

**Input**: Feature specification from [spec.md](file:///C:/Users/Nikhil/workspace/SelfEvolvingSoftware/specs/001-creator-sandbox/spec.md)

## Summary

Build a local demo application that shows a mock SaaS Analytics Dashboard with a "Sandbox Mode". When in Sandbox Mode, users type natural language requests (e.g., "Add a target line to the chart"). The backend uses the Pi SDK/API (configured via existing Codex subscription or multi-provider setup) to modify a temporary sandbox copy of the Dashboard React component. Vite's HMR dynamically reloads the component in the browser. Users can capture a screenshot using `html2canvas` and save the request and diff locally before exiting sandbox mode, which restores the original dashboard.

## Technical Context

**Language/Version**: Node.js (TypeScript v5.x), React (TypeScript v18.x)

**Primary Dependencies**: `express`, `vite`, `react`, `react-dom`, `@earendil-works/pi-ai`, `@earendil-works/pi-agent-core`, `html2canvas`, `diff` (for generating visual diffs)

**Storage**: Local file system (feedback stored in `.specify/feedback/` as JSON and PNG screenshots)

**Testing**: Vitest for both frontend components and backend endpoints

**Target Platform**: Modern Web Browsers, Local Node.js environment

**Project Type**: Web application (Frontend + Backend)

**Performance Goals**:
- UI Hot reload under 1.5 seconds after AI compilation
- Snapshot capture and storage under 2 seconds

**Constraints**:
- Absolute sandbox isolation: writes are strictly restricted to `*.sandbox.tsx` files.
- Zero downtime: State-preserving reloading (HMR).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Code Quality**: Adhere to strict TypeScript types. Keep component modification functions side-effect free.
- **Testing Standards**: Establish Vitest unit tests for HMR file-swap mechanics and Express endpoints.
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

## Complexity Tracking

No violations of Constitution principles detected.
