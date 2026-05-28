# Tasks: Creator Sandbox & Feature Request Demo

**Input**: Design documents from `specs/001-creator-sandbox/`

**Prerequisites**: [plan.md](file:///C:/Users/Nikhil/workspace/SelfEvolvingSoftware/specs/001-creator-sandbox/plan.md), [spec.md](file:///C:/Users/Nikhil/workspace/SelfEvolvingSoftware/specs/001-creator-sandbox/spec.md), [research.md](file:///C:/Users/Nikhil/workspace/SelfEvolvingSoftware/specs/001-creator-sandbox/research.md), [data-model.md](file:///C:/Users/Nikhil/workspace/SelfEvolvingSoftware/specs/001-creator-sandbox/data-model.md)

**Tests**: Test-driven development is enabled per the testing standards requirement.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions
- **Backend app**: `backend/src/`
- **Frontend app**: `frontend/src/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Initialize the backend project with TypeScript and Pi SDK dependencies in backend/package.json
- [X] T002 Initialize the frontend project with React and Vite in frontend/package.json
- [X] T003 [P] Configure Vitest testing environments in backend/package.json and frontend/package.json
- [X] T004 [P] Configure ESLint and Prettier for static analysis in backend/package.json and frontend/package.json

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T005 Setup Express routing middleware, environment config, and base server structure in backend/src/index.ts
- [X] T006 Setup proxy settings and root application mount points in frontend/vite.config.ts and frontend/src/main.tsx

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Live Experimentation in Sandbox Mode (Priority: P1) 🎯 MVP

**Goal**: Users can enter Sandbox Mode, submit prompts to modify the UI (hot-reloaded instantly), and preserve form state.

**Independent Test**: Verify that toggle state updates, text prompt modifies the UI, and input field values are preserved.

### Tests for User Story 1

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T007 [US1] Write unit tests for sandbox file-copy and cleanup utilities in backend/tests/sandbox.test.ts
- [ ] T008 [US1] Write integration tests for UI dynamic imports in frontend/tests/SandboxImport.test.tsx
- [ ] T008b [US1] Write frontend QA user interaction tests (button clicks, form inputs, theme changes) in frontend/tests/DashboardQA.test.tsx
- [ ] T008c [US1] Write end-to-end user journey tests (complete session entry, modification hot-reload, feedback visual capture, exit clean-up lifecycle) in frontend/tests/SandboxE2E.test.tsx
- [ ] T008d [US1] Write smoke tests verifying sandbox routes and endpoints accessibility and quick response in backend/tests/smoke.test.ts

### Implementation for User Story 1

- [ ] T009 [P] [US1] Implement sandbox file utilities to copy and delete Dashboard.sandbox.tsx in backend/src/services/sandbox.ts
- [ ] T010 [P] [US1] Implement AI modification module integrating Pi SDK for component editing in backend/src/services/ai.ts
- [ ] T011 [US1] Implement Sandbox session and modification API endpoints in backend/src/routes/sandbox.ts
- [ ] T012 [P] [US1] Implement core Dashboard component with Recharts widgets and input forms in frontend/src/components/Dashboard.tsx
- [ ] T013 [US1] Implement App wrapper with dynamic imports switching between production and sandbox files in frontend/src/App.tsx
- [ ] T014 [US1] Implement SandboxControls sidebar for prompt submission and session toggles in frontend/src/components/SandboxControls.tsx

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently.

---

## Phase 4: User Story 2 - Submitting Feature Requests with Visuals (Priority: P2)

**Goal**: Capture and save high-fidelity PNG screenshots and code diffs of the modified workspace locally.

**Independent Test**: Click "Submit Feedback" and check if PNG and JSON diff package are generated and saved under `.specify/feedback/`.

### Tests for User Story 2

- [ ] T015 [US2] Write unit tests for the feedback routing endpoint in backend/tests/feedback.test.ts

### Implementation for User Story 2

- [ ] T016 [P] [US2] Implement local storage file utilities to store feedback files in backend/src/utils/fileStore.ts
- [ ] T017 [US2] Implement POST endpoint for feedback submission in backend/src/routes/feedback.ts
- [ ] T018 [P] [US2] Implement html2canvas capture logic in frontend/src/utils/snapshot.ts
- [ ] T019 [US2] Implement line-by-line diff generation service in backend/src/services/diff.ts
- [ ] T020 [US2] Integrate snapshot capture and diff payload into feedback submission in frontend/src/components/SandboxControls.tsx

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently.

---

## Phase 5: User Story 3 - Sandbox Mode Access (Priority: P3)

**Goal**: Sandbox is accessible to all users without restrictions, featuring Apple Mac Keynote light theme styling.

**Independent Test**: Verify dashboard layout style matches Keynote Light and the entry controls are visible and usable.

### Implementation for User Story 3

- [ ] T021 [US3] Define global styles and Keynote Theme variables in frontend/src/index.css
- [ ] T022 [US3] Refactor components to conform to Apple Mac Keynote Light styling in frontend/src/components/Dashboard.tsx

**Checkpoint**: All user stories should now be independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T023 Document verify commands in specs/001-creator-sandbox/quickstart.md
- [ ] T024 Perform final linting and code formatting checks across all project directories
- [ ] T025 Execute entire test suite to ensure all unit and integration tests pass successfully

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but should be independently testable

### Within Each User Story

- Tests (if included) MUST be written and FAIL before implementation
- Models before services
- Services before endpoints
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- Setup tasks T003 and T004 can run in parallel.
- Sandbox utilities T009 and AI module T010 can be developed in parallel with Dashboard UI T012.
- Local storage utilities T016 and client snapshot capture T018 can be developed in parallel.

---

## Parallel Example: User Story 1

```bash
# Launch both models and setup tasks for User Story 1 together:
Task: "Implement sandbox file utilities to copy and delete Dashboard.sandbox.tsx in backend/src/services/sandbox.ts"
Task: "Implement core Dashboard component with Recharts widgets and input forms in frontend/src/components/Dashboard.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories
