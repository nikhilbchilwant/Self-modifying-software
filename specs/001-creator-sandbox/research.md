# Research and Decisions: Creator Sandbox

This document details the architectural decisions and technology research for the Creator Sandbox & Feature Request Demo.

## Technical Decisions & Rationale

### 1. Frontend Hot Reloading Mechanism
*   **Decision**: **React + Vite with Sandbox Branching**
*   **Rationale**: Vite is extremely fast and provides native Hot Module Replacement (HMR) out-of-the-box via its dev server. By using "Sandbox Branching," the application can swap the import path of the dashboard component to a temporary file (e.g. `Dashboard.sandbox.tsx`) during sandbox mode. When the AI changes this file, Vite naturally pushes the HMR update to the browser instantly, preserving the current state of the application outside of that component.
*   **Alternatives Considered**: Client-side `eval` inside an iframe. Rejected because it limits the ability to use standard React DevTools, breaks component hot reloading context, and makes debugging CSS or component lifecycles much harder.

### 2. AI Backend and Integration
*   **Decision**: **Node/Express with Pi SDK / Codex integration**
*   **Rationale**: The Pi SDK (specifically `@earendil-works/pi-ai` and `@earendil-works/pi-agent-core`) supports flexible, multi-provider model integration and works natively with the user's existing Codex subscription configuration. The backend will invoke the Pi SDK agent core to apply target edits directly to the sandbox component files.
*   **Alternatives Considered**: Mock responses. Rejected because a live agentic code editing flow is required to properly demonstrate "self-modifying software without downtime."

### 3. Visual Snapshotting
*   **Decision**: **`html2canvas` in the browser**
*   **Rationale**: `html2canvas` allows high-fidelity, client-side screenshots of the DOM representation. It creates a canvas element and converts it to a PNG image that is sent as a base64 string to the backend to be stored locally.
*   **Alternatives Considered**: Puppeteer/Playwright server-side screenshotting. Rejected because it is heavy, slow, and requires spinning up a headless browser which would not capture live client-side state/unsaved user inputs.

### 4. Sandbox Isolation and Feedback Storage
*   **Decision**: **Local File System Storage & Session Clean-up**
*   **Rationale**: Storing screenshots and JSON-formatted diffs locally under `.specify/feedback/` makes it incredibly easy for a developer to inspect changes without needing to set up databases or cloud storage. Files are cleaned up (i.e. temporary `Dashboard.sandbox.tsx` is deleted) when the session terminates or when the user exits Sandbox Mode.
