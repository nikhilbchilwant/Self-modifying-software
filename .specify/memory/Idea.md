# Idea: Creator Sandbox & Feature Request Demo

## The Concept
A "Sandbox Mode" environment integrated into a SaaS product (e.g., an analytics dashboard) that uses a Pi SDK-based AI backend. 

In this sandbox environment, users can:
1. **Experiment Live**: Ask the AI to change the app's UI or logic on a whim (e.g., "Add a conversion rate dial", "Change theme to neon green", "Make table rows expandable").
2. **Zero Downtime Evolution**: See these modifications hot-reload instantly in the browser without losing their current application state (e.g., typed text, selections).
3. **Submit Actionable Feedback**: If they like the modifications, they can click a button to take a screenshot of the modified state and send it directly to the developer as a feature request.
4. **Developer Control**: Having a screenshot and a generated code diff makes communication seamless. When the user exits the sandbox, all changes are discarded, and the user sees the normal app without any modifications. This ensures the developer stays in control of the production app's quality while users can actively experiment.

## Key Mechanisms
*   **State-Preserving Hot Reloading**: Changes to UI components and styles are injected into the DOM dynamically.
*   **Visual Snapshotting**: Capture high-fidelity PNG screenshots of the modified workspace.
*   **Sandbox Isolation**: A strict boundary where "Sandbox Mode" changes are tracked in a temporary registry that flushes completely upon exit.
