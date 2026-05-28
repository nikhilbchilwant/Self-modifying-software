# Architecture Diagrams: Creator Sandbox & Feature Request Demo

This document captures the software engineering diagrams and flowcharts describing the system architecture, component relationships, data models, and sequences.

## 1. System Component Architecture
The application follows a decoupled client-server pattern. During Sandbox Mode, file imports dynamically swap to direct reads/writes on a sandbox component file.

```mermaid
graph TD
  subgraph Frontend [Vite Frontend]
    App[App.tsx] --> Dashboard[Dashboard.tsx]
    App --> SandboxControls[SandboxControls.tsx]
    SandboxControls --> H2C[html2canvas Capture]
  end

  subgraph Backend [Express Backend]
    Server[index.ts] --> SandboxService[sandbox.ts]
    Server --> AIService[ai.ts]
    Server --> FeedbackRoute[feedback.ts]
    AIService --> PiSDK[Pi SDK / Codex]
  end

  subgraph Filesystem [Local Disk]
    ProdDashboard[src/components/Dashboard.tsx]
    SandboxDashboard[src/components/Dashboard.sandbox.tsx]
    FeedbackDir[.specify/feedback/]
  end

  SandboxService -->|Duplicate/Clean| SandboxDashboard
  AIService -->|Edit sandbox component| SandboxDashboard
  FeedbackRoute -->|Write PNG/JSON| FeedbackDir
```

---

## 2. Logical Data Model & Service Layer (Class Diagram)
This diagram illustrates the service boundaries, data classes, and their public interfaces.

```mermaid
classDiagram
  class SandboxSession {
    +string sessionId
    +DateTime startTime
    +string originalFilePath
    +string sandboxFilePath
    +string status
  }

  class FeatureRequest {
    +string requestId
    +DateTime timestamp
    +string userPrompt
    +string screenshotPath
    +string diffContent
  }

  class SandboxService {
    +createSession() SandboxSession
    +applyModifications(sessionId, prompt) string
    +generateDiff(sessionId) string
    +terminateSession(sessionId) bool
  }

  class AIService {
    -PiAgentCore agent
    +generateCodeEdits(prompt, fileContent) string
    +runVerificationLoop(tempCode) bool
  }

  class FeedbackService {
    +saveFeedback(request FeatureRequest) bool
  }

  SandboxService --> AIService : Uses
  SandboxService --> SandboxSession : Manages
  FeedbackService --> FeatureRequest : Persists
```

---

## 3. Sequence Flow: Live Sandbox Code Evolution
This diagram represents the step-by-step lifecycle of submitting a modification prompt, executing the backend compilation/verification loop with error correction, and Vite HMR injecting changes without losing page state.

```mermaid
sequenceDiagram
  autonumber
  actor User as End User
  participant FE as Frontend Dashboard
  participant SC as Sandbox Controls (UI)
  participant BE as Express Backend
  participant AI as Pi AI Service
  participant FS as File System (Disk)
  participant Vite as Vite Dev Server

  User->>SC: Click "Enter Sandbox"
  SC->>BE: POST /api/sandbox/enter
  BE->>FS: Copy Dashboard.tsx to Dashboard.sandbox.tsx
  BE-->>SC: success (Session ID)
  SC->>FE: Re-route / swap imports to Dashboard.sandbox.tsx

  User->>SC: Submit Prompt ("Add Dial")
  SC->>BE: POST /api/sandbox/modify (Prompt, Session ID)
  BE->>AI: generateCodeEdits(Prompt, FileContent)
  
  loop Verification Loop
    AI->>AI: Write draft component
    AI->>AI: Run Vite compiler test/lint checks
    alt Compilation Errors found
      AI->>AI: Feed error logs back to Pi SDK
      AI->>AI: Re-generate and fix component
    else Compilation Success
      Note over AI: Exit verification loop
    end
  end

  AI->>FS: Write verified code to Dashboard.sandbox.tsx
  FS->>Vite: HMR triggers automatically (File change)
  Vite-->>FE: Push compiled module (WebSocket HMR)
  FE->>FE: Hot-Reload UI (State Preserved)
  BE-->>SC: success (with Code Diff)
```

---

## 4. Sequence Flow: Feedback Visual Submission
This sequence covers visual snapshotting, diff generation, and saving feedback files.

```mermaid
sequenceDiagram
  autonumber
  actor User as End User
  participant FE as Frontend Dashboard
  participant SC as Sandbox Controls (UI)
  participant BE as Express Backend
  participant FS as File System (Disk)

  User->>SC: Click "Submit Feature Request"
  SC->>FE: Run html2canvas on viewport
  FE-->>SC: PNG Base64 Data
  SC->>BE: POST /api/feedback/submit (Screenshot, Prompt, Diff)
  BE->>FS: Save screenshot as PNG file
  BE->>FS: Save request details & diff as JSON file
  BE-->>SC: success (Ticket ID)
  SC-->>User: Display confirmation message
```
