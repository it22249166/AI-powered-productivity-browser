# Intentra Browser MVP

Intentra is a productivity browser MVP built with Electron, React, and TypeScript.

## Final MVP Goal

Build a browser that is useful for real work, not just browsing:

- Browse normally with tabs, address bar, back/forward/reload, and a full-page webview
- Organize work into workspaces
- Save notes, tasks, and important sources per workspace
- Use prompt-driven assistant actions that generate workspace output from the active page context
- Export a workspace as Markdown

## What Is Actually Implemented

- Electron desktop shell with embedded `webview`
- Multi-tab browsing per workspace
- Workspace switching, creation, and deletion
- Notes saved per workspace
- Saved sources board per workspace
- Task list per workspace
- Intent modes: `study`, `research`, `write`, `compare`, `apply`, `debug`
- Prompt actions that generate deterministic assistant outputs from current page context
- Workspace export to Markdown
- Browse-first layout where workspace tools and assistant panel can be toggled open

## What Is Not Fully Implemented Yet

- Real LLM integration
- Real DOM/page text extraction from the live page
- True page summarization from actual page content
- Real compare engine between multiple pages
- Scam detection / privacy engine
- PDF chat / page chat backed by page embeddings or retrieval

## Product Definition For This Version

This version should be judged as a **functional MVP productivity browser**, not a finished AI browser platform.

The core requirement for this version is:

1. The browser must be easy to browse with.
2. Workspace tools must help the user save and organize work.
3. Every visible action should do something real in the app.
4. The app must avoid claiming advanced AI behavior that is not actually implemented.

## Current Success Criteria

- `npm run build` passes
- User can open and navigate tabs
- User can switch workspaces
- User can save a page into a workspace
- User can write notes and tasks
- User can run assistant actions and see generated output
- User can export the workspace as a Markdown file
