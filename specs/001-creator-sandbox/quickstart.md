# Quickstart: Creator Sandbox & Feature Request Demo

This quickstart guides you through setting up and running the Creator Sandbox web application locally.

## Prerequisites
- Node.js (version 18 or higher recommended)
- `npm` or `yarn` package manager
- Configured Codex subscription or API keys in the environment for the Pi SDK provider framework

## Installation & Setup

1. **Install Dependencies**:
   Navigate to the root directory and install dependencies for both the frontend and backend.
   ```bash
   # Install root and backend dependencies
   npm install

   # Install frontend dependencies
   cd frontend
   npm install
   cd ..
   ```

2. **Configure Environment**:
   Ensure that the Pi SDK credentials (such as Codex tokens or API configurations) are set as environment variables.
   ```bash
   # Example setup for Codex/Pi SDK
   export PI_AI_PROVIDER="codex"
   export CODEX_API_KEY="your_api_key_here"
   ```

## Running the Application

1. **Start the Backend Service**:
   Run the Express server in development mode.
   ```bash
   npm run dev:backend
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
