---
name: modify-pi
description: Guide and instructions for modifying the pi coding agent codebase itself. Use when tasked with adding features, fixing bugs, editing files, or running build/test checks in the pi monorepo.
---

# Modifying the Pi Coding Agent

This skill outlines the core development rules, commands, code style, testing workflows, and git boundaries to follow when modifying the `pi` codebase.

## 1. Conversational Style & Quality
- **Direct & Technical**: Keep answers short, technical, and concise. Do not use emojis in commits, issues, PR comments, or code. No cheerful filler text.
- **Answer First**: When asked a question, answer it first before executing edits or running implementation commands.
- **Broad Changes**: Read files in full before making wide-ranging changes, editing files not fully inspected, or conducting audits. Do not rely solely on search snippets.
- **TypeScript Syntax**: Use only erasable TypeScript syntax (Node strip-only mode) in packages (`packages/*/src`, `packages/*/test`, `packages/coding-agent/examples`). Avoid parameter properties, `enum`, `namespace`, `module`, `import =`, or `export =`.
- **Top-Level Imports Only**: Do not use inline dynamic imports (`await import()`, dynamic type imports, etc.).
- **Models**: Do not modify `packages/ai/src/models.generated.ts` directly. Update `packages/ai/scripts/generate-models.ts` instead, and then regenerate.

## 2. Command Reference
- **Run from Source**: Run the interactive agent from source using:
  ```bash
  ./pi-test.sh
  ```
- **Type Checking & Linting**: Run code check after modifying code (not docs):
  ```bash
  npm run check
  ```
  Fix all errors, warnings, and infos before proposing commits.
- **Testing**:
  - Run all non-e2e tests from the repository root using:
    ```bash
    ./test.sh
    ```
  - Run a specific package test (do not run the full vitest suite unless requested):
    ```bash
    node ../../node_modules/vitest/dist/cli.js --run test/specific.test.ts
    ```
  - Never run `npm run build` or `npm test` unless explicitly requested.

## 3. Git Safe Practices
Since multiple agent sessions may run concurrently, adhere strictly to these isolation rules:
- **Explicit Staging**: Stage explicit paths only (e.g., `git add path/to/file.ts`). **Never** run `git add .` or `git add -A`.
- **Verify Staging**: Always run `git status` to verify you are only staging files you changed in this session.
- **Forbidden Commands**: Never run commands that affect other sessions' files:
  - `git reset --hard`
  - `git checkout .`
  - `git clean -fd`
  - `git stash`
  - `git commit --no-verify`
- **Rebase Conflicts**: Resolve conflicts only in files you modified. If a conflict arises in a file you didn't change, abort and notify the user.

## 4. Changelogs & Releases
- Update `packages/*/CHANGELOG.md` under the `## [Unreleased]` section. Add entries under appropriate subheadings (`### Added`, `### Changed`, `### Fixed`, etc.).
- Never modify released/historical version sections in changelogs.
