# Data Model: Creator Sandbox & Feature Request Demo

This document defines the key entities, their attributes, and relationships used to manage Sandbox sessions and Feature requests.

## Entities

### 1. SandboxSession (Memory Only)
Represents a user's active sandbox session. It is transient and only exists in the server memory/Vite configuration during the session.

| Attribute | Type | Description |
| :--- | :--- | :--- |
| `sessionId` | String | Unique identifier (UUID) generated when entering Sandbox Mode. |
| `startTime` | DateTime | Timestamp when the sandbox was initiated. |
| `originalFilePath` | String | Path to the original component file. |
| `sandboxFilePath` | String | Path to the temporary sandbox copy. |
| `baselineSnapshot` | String | Captured content of the production component at session entry (FR-006a/FR-008), used for diff generation and restore-on-exit. |
| `lastKnownWorkingVersion` | String | Last successfully verified sandbox code; used to revert on verification failure (FR-012). |
| `verificationStatus` | Enum | `pending` / `verified` / `failed` — result of the most recent AI modification verification loop. |
| `status` | Enum | `active` or `terminated`. |

### 2. FeatureRequest (Local Persistence)
Represents a saved feature request containing the user's screenshot, prompt, and generated code diff.

| Attribute | Type | Description |
| :--- | :--- | :--- |
| `requestId` | String | Unique identifier (UUID) for the feedback ticket. |
| `timestamp` | DateTime | Timestamp when the user clicked "Submit Feedback". |
| `userId` | String \| null | Anonymous, session-scoped identifier derived from `sessionId`, or `null` when no identity context exists (Sandbox Mode is unrestricted). |
| `userPrompt` | String | The prompt describing the change request. |
| `screenshotPath` | String | Relative file path to the saved PNG screenshot in the project local directory. |
| `diffContent` | String | Unified diff (file paths + line numbers) comparing the modified sandbox file to the captured baseline snapshot (FR-006). |

## Relationships
- A `SandboxSession` can generate zero or more `FeatureRequest` submissions during its active lifetime.
- Each `FeatureRequest` is independent and references the session context under which it was generated.
