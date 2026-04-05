# Ion ⚡

Ion is a high-performance, self-hosted deployment platform designed for modern web applications. Inspired by the architecture of Vercel, Ion automates the process of cloning, building, and serving static React/Vite applications at scale using a distributed, microservices-based approach.

# Demo Video

https://github.com/user-attachments/assets/11751ab2-3c4f-41f4-bf56-e0374eb6a1b6

# Grafana dashboard
<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/3e351630-4d10-4894-9fdb-fa8dc5c1f5c3" />

## 🏗️ Architecture Overview

Ion is built as a monorepo utilizing **Turborepo** and **Bun**, orchestrating several specialized services that communicate through **Redis** and shared storage (**Cloudflare R2/S3**).

### High-Level System Design

```ascii
[ User ] <───> [ ion: Next.js Dashboard ] <───> [ ion-websocket ]
                   │                                  ▲
                   ▼                                  │ (Redis Pub/Sub)
           [ ion-repo-service ]                       │
                   │                                  │
         (1) Clone │ (2) Push ID              [ ion-deployment-service ]
             to S3 │     to Redis                     ▲
                   ▼        │                         │ (3) Pull & Build
             [ S3/R2 ] <────┘                         │     in Docker
                   ▲                                  │
                   │ (4) Upload /dist                 │
                   └──────────────────────────────────┘
                            ▲
                            │ (5) Serve Request
                   [ ion-request-service ]
                            │
              (Subdomain: project-id.ion.dev)
```

### The Flow

1.  **Request Entry**: A user adds a Git repository via the **Dashboard**.
2.  **Ingestion**: The `repo-service` validates the request, creates a database entry, and asynchronously clones the repository to S3 while returning an immediate response to the UI.
3.  **Queuing**: Once cloned, the project ID is pushed onto a **Redis Queue**.
4.  **Processing**: The `deployment-service` (Worker) pulls the ID, downloads the source from S3, and spins up a isolated **Docker container** to run the build script (`npm install && npm run build`).
5.  **Logging**: Build logs are streamed in real-time to **Redis Pub/Sub**, which the `websocket` service picks up and broadcasts to the user's dashboard.
6.  **Deployment**: The resulting `/dist` folder is uploaded back to S3.
7.  **Serving**: The `request-service` acts as a dynamic proxy, extracting the project ID from the incoming hostname (e.g., `abc.localhost`) and streaming the corresponding files directly from S3.

## 🚀 Tech Stack

- **Frontend**: Next.js (App Router), Tailwind CSS, shadcn/ui, Lucide Icons.
- **Backend Logic**: Express.js, Bun.
- **Database**: PostgreSQL with Prisma ORM.
- **Async Processing**: Redis (List-based Queue & Pub/Sub).
- **Storage**: Cloudflare R2 (S3-compatible API).
- **Containerization**: Docker (Isolated build environments).
- **Authentication**: Better Auth (GitHub OAuth).
- **Monorepo Management**: Turborepo, pnpm/bun workspaces.

## ✨ Features

- **Instant Deployments**: Clone and deploy any Vite/React project via Git URL.
- **Isolated Build Engine**: Uses Docker to ensure clean and consistent builds every time.
- **Real-time Logs**: Stream build/deploy logs directly to your browser using WebSockets.
- **Wildcard Subdomains**: Every project gets its own unique, accessible URL immediately.
- **Async Pipeline**: Non-blocking architecture ensures the UI remains snappy while heavy lifting happens in the background.
- **Interactive Dashboard**: Premium dark-mode UI for managing projects and monitoring health.
- **Retro Sound Effects**: Audible 8-bit notifications for successful build completions.

## 📂 Services Breakdown

### `apps/ion` (Frontend)

The Next.js command center. It handles user authentication, workspace management, and provides the "Terminal" interface for real-time build logs.

### `apps/ion-repo-service` (Git Manager)

Responsible for repo ingestion. It interacts with `simple-git` to fetch source code and handles the initial hand-off to storage and the build queue.

### `apps/ion-deployment-service` (The Builder)

The core engine. It manages the lifecycle of build workers, handles Docker orchestration, and manages the transition of project states (CLONING → BUILDING → DEPLOYING → SUCCESS).

### `apps/ion-request-service` (The Proxy/Server)

A high-throughput service that handles incoming web traffic. It maps subdomains to S3 paths and serves assets with correct MIME types.

### `apps/ion-websocket` (Log Streamer)

A lightweight Bun-based WebSocket server that bridges Redis Pub/Sub events to the frontend, ensuring millisecond-latency log updates.

### `packages/ion-common`

Shared utilities used across all internal services, including Redis connection pooling, Pub/Sub wrappers, and standard middleware.

## 📂 Folder Structure

```bash
.
├── apps/
│   ├── ion/                    # Next.js Dashboard
│   ├── ion-repo-service/       # Git/Clone Ingestion
│   ├── ion-deployment-service/ # Build/Docker Worker
│   ├── ion-request-service/    # Subdomain Proxy/API
│   └── ion-websocket/          # Log Streamer
├── packages/
│   ├── ion-db/                 # Prisma Schema & Client
│   ├── ion-aws/                # S3/R2 Wrapper
│   ├── ion-auth/               # Better Auth Logic
│   └── ion-common/             # Shared Utilities
└── docker/
    └── .                       # Build-time Dockerfiles (Internal)
```

## 🛠️ Environment Variables

The project requires a `.env` file in the root. Refer to `.env.example` for details:

| Variable                    | Description                          |
| :-------------------------- | :----------------------------------- |
| `DATABASE_URL`              | PostgreSQL connection string.        |
| `CLOUDFLARE_SECRET_KEY`     | R2/S3 Secret Key for storage access. |
| `S3_API`                    | Cloudflare R2 Endpoint URL.          |
| `GITHUB_CLIENT_ID`          | GitHub OAuth ID for authentication.  |
| `BETTER_AUTH_SECRET`        | Secret key for session encryption.   |
| `NEXT_PUBLIC_WEBSOCKET_URL` | WebSocket endpoint for the frontend. |

## 🏁 Setup & Installation

### 1. Clone & Install

```bash
git clone https://github.com/yourusername/ion.git
cd ion
bun install
```

### 2. Environment Setup

Copy the example environment file and fill in your credentials:

```bash
cp .env.example .env
```

_Note: You will need a PostgreSQL instance, a Redis server, and a Cloudflare R2 bucket._

### 3. Database Initialization

```bash
cd packages/ion-db
bun run generate
bun run push
```

### 4. Running the Project

Ion uses Turborepo to manage all services. You can start the entire stack with one command:

```bash
# Start all services in development mode
bun run dev
```

The services will start on the following ports:

- **Dashboard**: `http://localhost:3000`
- **Repo API**: `http://localhost:3002`
- **Request API**: `http://localhost:3003` (and project subdomains)
- **Websocket**: `http://localhost:8081`

## 🕹️ Example Flow: Deploying a Project

1.  **Login**: Authenticate via GitHub on the homepage.
2.  **Add Project**: Click "Add New Project", enter a repository name and a Git URL (e.g., `https://github.com/vitejs/vite-starter`).
3.  **Real-time Monitoring**: You are immediately redirected to the build page.
4.  **The Build**: Watch as `npm install` and `npm run build` logs stream into the console.
5.  **Listen**: Hear the retro "Achievement Unlock" sound when the build finishes.
6.  **Visit**: Click "View Deployed" to see your app live on its own unique subdomain.

## 🔮 Future Improvements – TODO

- [ ] Directly connect to the gihub to fetch all the repos from the github users.

## ✅ CI/CD Integration (Jenkins)

- [✅] Set up Jenkins using Docker for local development
- [✅] Create Jenkinsfile with pipeline stages (install, test, build, dockerize, deploy)
- [✅] Configure GitHub webhook to trigger builds automatically
- [✅] Store build metadata (status, duration, logs) in database

---

## 🐳 Dockerization

- [✅] Write Dockerfile for backend service
- [✅] Write Dockerfile for frontend service
- [✅] Create docker-compose.yml for all services (app, Jenkins, Prometheus, Grafana)
- [✅] Use multi-stage builds to optimize image size

---

## 📊 Metrics Collection (Prometheus)

- [ ] Set up Prometheus for metrics scraping
- [ ] Add /metrics endpoint in backend (Express/Node)
- [ ] Track API latency, request count, error rate
- [ ] Monitor system metrics (CPU, memory)
- [ ] Configure Prometheus scrape targets

---

## 📈 Visualization (Grafana)

- [ ] Set up Grafana and connect Prometheus as data source
- [ ] Create dashboards for:
  - [ ] CI/CD pipeline status
  - [ ] Build success vs failure trends
  - [ ] Deployment frequency
  - [ ] System performance metrics
- [ ] Configure alerts (Slack or Email)

---

## 🤖 AI Failure Analysis (LLM)

- [ ] Capture Jenkins logs for failed builds
- [ ] Send logs to LLM API for analysis
- [ ] Generate failure summary, root cause, and suggested fixes
- [ ] Store AI insights in database
- [ ] Display AI insights in dashboard

---

## 🗄️ Backend Enhancements

- [ ] Design database schema (builds, deployments, logs, metrics)
- [ ] Implement APIs to fetch pipeline data and logs
- [ ] Implement APIs to fetch metrics and AI insights

---

## 🖥️ Frontend Dashboard

- [ ] Display pipeline runs and build statuses
- [ ] Show logs with filtering/search
- [ ] Add charts for:
  - [ ] Success/failure trends
  - [ ] Build duration
- [ ] Show AI-generated summaries for failures

---

## 🔔 Alerts & Notifications

- [ ] Trigger alerts on build failures
- [ ] Trigger alerts on high error rates
- [ ] Integrate Slack or Email notifications

---

## 🌐 Deployment & Infrastructure

- [ ] Deploy services using Docker (EC2 or VPS)
- [ ] Set up NGINX as reverse proxy
- [ ] Configure environment variables and secrets
- [ ] Secure services and endpoints

---

## 🧪 Bonus Features (Optional)

- [ ] Auto-retry failed builds
- [ ] Canary deployments
- [ ] Role-based access control (RBAC)
- [ ] Multi-project support
- [ ] Uptime monitoring

---

# NEXT IN FUTURE.

## 🔄 GitOps (Modern Deployment Strategy)

- [ ] Set up GitOps workflow for deployments (separate infra repo)
- [ ] Store Kubernetes manifests (YAML) in Git
- [ ] Auto-sync deployments on Git changes
- [ ] Implement environment-based configs (dev/staging/prod)
- [ ] Maintain version-controlled infrastructure

---

## ☸️ Kubernetes (Container Orchestration)

- [ ] Set up local Kubernetes cluster (Minikube / k3s)
- [ ] Write Kubernetes manifests:
  - [ ] Deployment (app pods)
  - [ ] Service (expose app)
  - [ ] Ingress (routing)
- [ ] Deploy application to Kubernetes cluster
- [ ] Configure auto-scaling (Horizontal Pod Autoscaler)
- [ ] Manage configs using ConfigMaps and Secrets
- [ ] Compare Docker vs Kubernetes deployment in docs

---

## 🚀 Argo CD (GitOps Deployment Tool)

- [ ] Install Argo CD in Kubernetes cluster
- [ ] Connect Argo CD to Git repository
- [ ] Enable automatic sync of manifests to cluster
- [ ] Visualize application state via Argo CD dashboard
- [ ] Implement rollback using Git history
- [ ] Manage multiple environments (dev/staging/prod)
- [ ] Secure Argo CD access (authentication)

---

## 🔐 Kubernetes Security & Best Practices

- [ ] Use Secrets for sensitive data (avoid hardcoding)
- [ ] Implement RBAC for cluster access control
- [ ] Set resource limits (CPU/memory) for pods
- [ ] Enable liveness and readiness probes
- [ ] Restrict container privileges (securityContext)

---

Built with ⚡ by Tejas P R
