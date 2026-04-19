# 🛠️ Ion AI Agent & GitHub Integration: Implementation Plan

This document outlines the detailed technical steps to implement the **GitHub Repository Browser**, **AI Agent (Chatbot)**, and **Voice Commands** for the Ion platform.

---

## 🏗️ Phase 1: GitHub Repository Integration
*Status: In Progress 🟡*

To allow users to browse and deploy their repositories directly from the dashboard.

### 1.1 Secure GitHub Token Retrieval
- **Goal**: Access the user's GitHub OAuth token from the database.
- **Action**: Complete the `getUserGitHubAccessToken` function in `packages/ion-common`.
- **Implementation**:
  ```typescript
  import { prisma } from "@ion/database";
  
  export const getUserGitHubAccessToken = async (userId: string) => {
      const account = await prisma.account.findFirst({
          where: { userId, providerId: 'github' },
          select: { accessToken: true }
      });
      return account?.accessToken;
  }
  ```

### 1.2 GitHub API Proxy (Repo Service)
- **Goal**: Create a secure endpoint to fetch repositories without exposing tokens to the client.
- **Action**: Add a new route in `apps/ion-repo-service`.
- **Endpoint**: `GET /github/list`
- **Logic**:
  1. Authenticate user from session.
  2. Get `accessToken`.
  3. Fetch repos from `https://api.github.com/user/repos?type=all&sort=updated`.
  4. Cache the results in Redis (optional) for 5 minutes.

### 1.3 Dashboard UI (Frontend)
- **Goal**: A clean interface to search and import repos.
- **Action**: Connect the `MainContent` component in `apps/ion/components/github` to the new API.
- **Features**:
  - Pagination/Infinite scroll for 100+ repos.
  - Search filter (local).
  - "Import" button that triggers the `repo-service`'s `POST /deploy` endpoint.

---

## 🤖 Phase 2: The "Ion Bot" AI Agent
*Status: In Progress 🟡*

A conversational interface that manages deployments.

### 2.1 Backend: Vercel AI SDK Integration
- **Goal**: A provider-agnostic AI endpoint.
- **Action**: Create `apps/ion/app/api/chat/route.ts`.
- **Config**: 
  - Use `streamText` from `ai` package.
  - Support `groq` or `ollama` for free/local usage.
  - use free online models from google gemini.
- **Tools (Function Calling)**:
  - `list_repos`: Returns the user's GitHub repos.
  - `get_deployment_status`: Queries Redis/DB for a project's state.
  - `start_deployment`: Triggers a build for a specific repo/branch.

### 2.2 Frontend: Chat UI
- **Goal**: An interactive terminal-like chat experience.
- **Action**: Build `apps/ion/components/chat-bot.tsx`.
- **Features**:
  - Visual feedback for "AI is thinking" or "AI is deploying".
  - One-click actions within chat (e.g., "Confirm Deploy").

---

## 🎙️ Phase 3: Voice Commands & Natural Language
*Status: Planned ⚪*

### 3.1 Speech-to-Text (STT)
- **Goal**: Convert user voice to text prompts.
- **Implementation**: 
  - Use **Web Speech API** (`window.SpeechRecognition`).
  - Add a "Pulsing Microphone" button in the search/chat bar.
- **Action**: 
  - Capture audio -> Convert to string -> Pass to AI Agent API.

### 3.2 Advanced Intent Recognition
- **Goal**: AI should correctly map "deploy my vite app" to `user/vite-starter`.
- **Prompt Engineering**:
  - System Prompt: *"You are Ion Commander. You have access to user repos: [REPO_LIST]. Map user nicknames to real repo names."*

---

## 🔐 Phase 4: AI Security Scanning (Idea 4)
*Status: Planned ⚪*

### 4.1 Pre-Build Check Agent
- **Goal**: Prevent leaks before they happen.
- **Implementation**:
  - When `repo-service` finishes cloning, trigger the `ScanningAgent`.
  - Agent uses regex + LLM logic to look for patterns in `.env` and `config` files.
- **Action**: AI provides a summary of risks to the dashboard before the `deployment-service` starts.

---

## 🛠️ Dev Notes & Troubleshooting
- **Shadcn Badge Fix**: Use `npx shadcn@latest add badge` in `apps/ion`.
- **Redis Sync**: Ensure `ion-websocket` is subbed to `ion-broadcast` for AI status updates.
- **Config**: Make sure `GITHUB_CLIENT_SECRET` is set in the root `.env`.

Built with ⚡ by Tejas P R
