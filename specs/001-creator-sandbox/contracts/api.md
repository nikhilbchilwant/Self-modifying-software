# API Contracts: Creator Sandbox

The backend exposes the following REST API endpoints to manage the sandbox lifecycle and save user feedback.

## 1. Enter Sandbox Mode
*   **Endpoint**: `POST /api/sandbox/enter`
*   **Request Body**: None
*   **Response**:
    ```json
    {
      "success": true,
      "sessionId": "550e8400-e29b-41d4-a716-446655440000",
      "sandboxComponentPath": "src/components/Dashboard.sandbox.tsx"
    }
    ```

## 2. Apply AI Modification
*   **Endpoint**: `POST /api/sandbox/modify`
*   **Request Body**:
    ```json
    {
      "sessionId": "550e8400-e29b-41d4-a716-446655440000",
      "prompt": "Add a target line at 80% to the analytics chart"
    }
    ```
*   **Response** (success):
    ```json
    {
      "success": true,
      "diff": "--- src/components/Dashboard.sandbox.tsx\n+++ src/components/Dashboard.sandbox.tsx\n..."
    }
    ```
*   **Response** (verification failed after bounded retries, FR-012):
    ```json
    {
      "success": false,
      "verificationStatus": "failed",
      "message": "Code could not be verified after 3 attempts; reverted to last known working version.",
      "revertedToLastKnownWorking": true
    }
    ```
    On failure the backend MUST NOT write the failed code and MUST NOT trigger HMR; the frontend shows a warning overlay.

## 3. Submit Feedback & Screenshot
*   **Endpoint**: `POST /api/feedback/submit`
*   **Request Body**:
    ```json
    {
      "sessionId": "550e8400-e29b-41d4-a716-446655440000",
      "prompt": "Add a target line at 80% to the analytics chart",
      "screenshotBase64": "data:image/png;base64,iVBORw0KGgo...",
      "diff": "--- src/components/Dashboard.sandbox.tsx\n..."
    }
    ```
    > `userId` is NOT required: Sandbox Mode is unrestricted, so the backend generates an anonymous, session-scoped identifier or stores `null` (see data-model `FeatureRequest.userId`).
*   **Response**:
    ```json
    {
      "success": true,
      "requestId": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
      "savedPath": ".specify/feedback/9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d.png"
    }
    ```

## 4. Exit Sandbox Mode
*   **Endpoint**: `POST /api/sandbox/exit`
*   **Request Body**:
    ```json
    {
      "sessionId": "550e8400-e29b-41d4-a716-446655440000"
    }
    ```
*   **Response**:
    ```json
    {
      "success": true
    }
    ```
