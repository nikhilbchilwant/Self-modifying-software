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
| `status` | Enum | `active` or `terminated`. |

### 2. FeatureRequest (Local Persistence)
Represents a saved feature request containing the user's screenshot, prompt, and generated code diff.

| Attribute | Type | Description |
| :--- | :--- | :--- |
| `requestId` | String | Unique identifier (UUID) for the feedback ticket. |
| `timestamp` | DateTime | Timestamp when the user clicked "Submit Feedback". |
| `userPrompt` | String | The prompt describing the change request. |
| `screenshotPath` | String | Relative file path to the saved PNG screenshot in the project local directory. |
| `diffContent` | String | Text containing the git diff comparing the modified sandbox file to the baseline file. |

## Relationships
- A `SandboxSession` can generate zero or more `FeatureRequest` submissions during its active lifetime.
- Each `FeatureRequest` is independent and references the session context under which it was generated.
