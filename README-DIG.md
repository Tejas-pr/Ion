# Ion — Developer Architecture Guide

> A deep-dive, code-first reference for contributors and maintainers.
> Assumes you have read [README.md](./README.md) first.

---

## Table of Contents

- [Project Map](#project-map)
- [Architecture Diagram](#architecture-diagram)
- [Service Catalog](#service-catalog)
- [Shared Packages](#shared-packages)
- [Infrastructure](#infrastructure)
- [Data Flow](#data-flow)
- [Environment Variables](#environment-variables)
- [Port Map](#port-map)
- [Folder Structure](#folder-structure)

---

## Project Map

```
Ion (Bun + Turborepo Monorepo)
│
├── apps/
│   ├── ion/                      ← Next.js Dashboard (port 3000)
│   ├── ion-repo-service/         ← Git clone ingestion (port 3002)
│   ├── ion-deployment-service/   ← Docker build worker (port 3005)
│   ├── ion-request-service/      ← Subdomain proxy / file server (port 3003)
│   └── ion-websocket/             ← Real-time log streamer (port 8081)
│
├── packages/
│   ├── ion-db/                    ← Prisma schema + generated client
│   ├── ion-aws/                   ← Cloudflare R2 / S3 wrapper
│   ├── ion-auth/                  ← Better Auth (GitHub OAuth) logic
│   ├── ion-common/                ← Redis, middleware, shared utilities
│   ├── ion-monitoring/            ← Prometheus metrics middleware
│   ├── ion-config-eslint/         ← Shared ESLint config
│   └── ion-config-typescript/      ← Shared TSConfig base / Next.js preset
│
└── infrastructure/
    ├── jenkins/                   ← Jenkins CI/CD Dockerfile
    ├── prometheus/                ← prometheus.yml scrape config
    └── grafana/                   ← Grafana provisioning + dashboard JSON
```

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              User Browser                                    │
└──────────┬──────────────────────────────────────────────────────────────────┘
           │
           │ HTTPS
           ▼
┌──────────────────┐          ┌──────────────────────────────────────────────┐
│   DNS / Domain    │          │          Docker Network (ion-network)         │
│  *.ion.dev ←──────┼──────────┤                                              │
└──────┬───────────┘          │  ┌─────────────────┐    ┌─────────────────┐  │
       │                       │  │ ion-request-svc │    │  PostgreSQL DB   │  │
       │ Subdomain lookup     │  │   (port 3003)   │◄──►│   (port 5432)    │  │
       │ (project-id.ion.dev)  │  └────────┬────────┘    └─────────────────┘  │
       ▼                       │           │                                  │
┌──────────────────┐          │           │ serve static files               │
│  ion-frontend/    │          │           ▼                                  │
│  Next.js (3000)  │◄─────────┤    ┌──────────────┐                         │
└────────┬─────────┘    WS     │    │ Cloudflare   │                         │
         │                    │    │    R2 / S3    │                         │
         │ HTTP / REST        │    │  (Object     │                         │
         ▼                    │    │   Storage)    │                         │
┌──────────────────┐          │    └──────────────┘                         │
│ ion-repo-service │          │                                              │
│   (port 3002)    │          │  ┌─────────────────┐    ┌─────────────────┐  │
│                  │◄── REST ──┤  │ion-deployment- │    │     Redis       │  │
│ - clone via      │          │  │   service      │◄──►│ (Queue + PubSub)│  │
│   simple-git     │          │  │  (port 3005)   │    │   (port 6379)   │  │
│ - push to S3     │          │  │                │    └───────┬─────────┘  │
│ - enqueue build  │          │  │  Docker SDK    │            │            │
└────────┬─────────┘          │  │  spawns worker │            │ Pub/Sub    │
         │                    │  │  containers     │            │ broadcast │
         │ clone → S3         │  └────────┬────────┘            │ logs      │
         ▼                    │           │                    │           │
┌──────────────────┐          │           │ build in Docker    │           │
│  Cloudflare R2   │◄─────────┤           ▼                    │           │
│   (Git source)   │          │  ┌─────────────────┐           │           │
└──────────────────┘          │  │ Docker Container │           │           │
                              │  │ (isolated build  │           │           │
                              │  │  environment)    │           │           │
                              │  └────────┬────────┘           │           │
                              │           │ npm install          │           │
                              │           │ npm run build       │           │
                              │           │ upload /dist to S3  │           │
                              │           ▼                    │           │
                              │  ┌─────────────────┐            │           │
                              │  │ion-websocket/   │◄───────────┘           │
                              │  │ (port 8081)      │                         │
                              │  │ Bun + ws server  │                         │
                              │  └────────┬────────┘                         │
                              └───────────┼───────────────────────────────────┘
                                          │
                              ┌───────────┴───────────────────────────────────┐
                              │           Jenkins CI/CD                        │
                              │  (port 8080) — multi-stage build pipelines     │
                              └────────────────────────────────────────────────┘
```

### Data Flow (Numbered)

```
 ① User POSTs Git URL → ion-repo-service
 ② repo-service clones repo → uploads source tarball → S3
 ③ repo-service pushes { projectId } → Redis LIST (build queue)
 ④ deployment-service pops from queue
 ⑤ deployment-service downloads source from S3
 ⑥ deployment-service spawns Docker container, runs build script
 ⑦ Build logs stream → Redis PubSub channel "ion-broadcast"
 ⑧ ion-websocket subscribes to "ion-broadcast", broadcasts via WebSocket
 ⑨ Frontend receives log chunks, renders in real-time terminal
 ⑩ Build completes → /dist uploaded back to S3
 ⑪ request-service serves files from S3 keyed by subdomain (project-id)
```

---

## Service Catalog

### `apps/ion` — Next.js Dashboard

| Property | Value |
|---|---|
| Framework | Next.js 16 (App Router) |
| Runtime | Bun |
| Port | `3000` |
| Language | TypeScript + TSX |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Auth | Better Auth (GitHub OAuth via `@ion/auth`) |
| State | React Context / SWR or similar |
| Purpose | User dashboard, project manager, real-time build terminal |

**Key responsibilities:**
- GitHub OAuth login flow
- Project CRUD (list, create, delete)
- Build log terminal (WebSocket client)
- Health monitoring sidebar (Prometheus metrics display)
- Retro 8-bit sound effect on build success

**Key routes (approximate):**
- `/` — Landing / login
- `/dashboard` — Project list
- `/dashboard/[projectId]` — Build log terminal
- `/dashboard/settings` — Workspace settings

---

### `apps/ion-repo-service` — Git Ingestion Service

| Property | Value |
|---|---|
| Framework | Express.js |
| Runtime | Bun |
| Port | `3002` |
| Language | TypeScript |
| Dependencies | `simple-git`, `ion-aws`, `ion-common`, `@ion/auth` |
| Purpose | Clone Git repos, push source to S3, enqueue builds |

**Key responsibilities:**
- `POST /deploy` — Validate Git URL, create DB record, initiate async clone
- `GET /github/list` — (Planned) Proxy GitHub API to list user's repos
- Clone repo via `simple-git` into a temp directory
- Tarball the source and upload to R2/S3 bucket under `repos/{projectId}/`
- Push project ID onto Redis LIST `ion:build:queue`
- Publish a "CLONING → CLONED" state update to Redis PubSub

**Data model (via Prisma):**
- `Project` — id, name, gitUrl, ownerId, status, deployedUrl, createdAt
- `Account` — userId, provider (github), accessToken (encrypted)
- `Session` — userId, expiresAt

---

### `apps/ion-deployment-service` — Build Worker

| Property | Value |
|---|---|
| Framework | Plain Bun HTTP (no Express) |
| Runtime | Bun |
| Port | `3005` |
| Language | TypeScript |
| Dependencies | `ion-aws`, `ion-common`, `@ion/database`, `ion-websocket` |
| Purpose | Dequeue builds, run Docker containers, publish logs |

**Key responsibilities:**
- Polls Redis LIST `ion:build:queue` (BLPOP)
- Downloads source tarball from R2/S3
- Spins up an isolated Docker container (ephemeral)
- Streams `stdout`/`stderr` of `npm install && npm run build` to Redis PubSub channel `ion-broadcast`
- On success: uploads `/dist` folder to R2/S3 under `dist/{projectId}/`
- Updates project status: `BUILDING → SUCCESS | FAILED`
- Cleans up container and temp files

**Project state machine:**
```
PENDING → CLONING → CLONED → QUEUED → BUILDING → DEPLOYING → SUCCESS | FAILED
```

---

### `apps/ion-request-service` — Subdomain Proxy / File Server

| Property | Value |
|---|---|
| Framework | Express.js |
| Runtime | Bun |
| Port | `3003` |
| Language | TypeScript |
| Dependencies | `ion-aws`, `ion-common`, `@ion/auth` |
| Purpose | Serve deployed projects by subdomain, route API calls |

**Key responsibilities:**
- Listen on port `3003` for all incoming HTTP traffic
- Extract subdomain from `Host` header (e.g. `abc123.localhost` → project `abc123`)
- Look up project in DB, find S3 path `dist/{projectId}/`
- Stream files from R2/S3 with correct MIME types
- Fallback to Next.js for dashboard routes (`/dashboard/*`, `/api/*`)
- Serve health/status endpoints

---

### `apps/ion-websocket` — Log Streamer

| Property | Value |
|---|---|
| Framework | Bun native HTTP + `ws` |
| Runtime | Bun |
| Port | `8081` |
| Language | TypeScript |
| Dependencies | `ion-common`, `@ion/monitoring` |
| Purpose | Bridge Redis PubSub → WebSocket for real-time build logs |

**Key responsibilities:**
- Subscribe to Redis PubSub channel `ion-broadcast`
- Maintain a map of `projectId → Set<WebSocketClient>`
- On Redis message: parse and broadcast to all clients watching that project
- Expose `/metrics` for Prometheus scraping
- Handle client connect/disconnect with projectId in URL (`ws://host/logs/{projectId}`)

---

## Shared Packages

### `packages/ion-db` — Database Layer

| Property | Value |
|---|---|
| ORM | Prisma 7 |
| Database | PostgreSQL 15 |
| Schema file | `packages/ion-db/prisma/schema.prisma` |

**Exports:**
- `prisma` — singleton PrismaClient instance
- `schema.prisma` — defines `User`, `Account`, `Session`, `Project` models

**Scripts (via `turbo`):**
```bash
bun run db:push      # prisma db push
bun run db:seed      # seed data via tsx
bun run generate     # prisma generate
```

---

### `packages/ion-aws` — Storage Layer

| Property | Value |
|---|---|
| SDK | AWS SDK v2 (`aws-sdk`) |
| Storage | Cloudflare R2 (S3-compatible API) |
| Bucket layout | `repos/{projectId}/` (source), `dist/{projectId}/` (built assets) |

**Key functions:**
- `uploadFile(bucket, key, body)` — upload to R2
- `downloadFile(bucket, key)` — download from R2
- `listObjects(bucket, prefix)` — list under prefix
- `getSignedUrl(bucket, key)` — generate temporary download URL

---

### `packages/ion-common` — Shared Utilities

**Exports:**
- `createRedisClient()` — ioredis/redis client singleton
- `publish(channel, message)` — Redis PubSub publisher
- `subscribe(channel, callback)` — Redis PubSub subscriber
- `redisQueuePush(queueKey, value)` — RPUSH to a Redis LIST
- `redisQueuePop(queueKey)` — BLPOP from a Redis LIST
- `createServiceMiddleware()` — standard CORS, rate-limit, logging, error-handler middleware
- `getUserGitHubAccessToken(userId)` — fetch GitHub token from DB

---

### `packages/ion-monitoring` — Observability

**Exports:**
- `metricsMiddleware` — Prometheus HTTP metrics middleware (requests/sec, latency histograms)
- `collectDefaultMetrics()` — Node.js process metrics (RSS, CPU, event loop lag)
- Pre-wired on all services at their `/metrics` endpoint

**Metrics tracked:**
| Metric | Type | Labels |
|---|---|---|
| `http_request_duration_seconds` | Histogram | `method`, `route`, `status_code` |
| `http_requests_total` | Counter | `method`, `route`, `status_code` |
| `process_memory_bytes` | Gauge | `type` (rss/heapUsed/heapTotal) |
| `process_cpu_seconds_total` | Counter | — |
| `process_event_loop_lag_seconds` | Gauge | — |
| `nodejs_active_handles` | Gauge | — |
| `service_up` | Gauge | `service` |

---

### `packages/ion-auth` — Authentication

| Property | Value |
|---|---|
| Framework | Better Auth |
| Provider | GitHub OAuth |
| Storage | Prisma Account/Session tables |

**Key responsibilities:**
- `auth` instance (Better Auth server-side)
- `getBetterAuthClient()` — client-side session fetch
- GitHub OAuth callback handler
- Session middleware for protected routes

---

## Infrastructure

### Docker Compose Services (`docker-compose.yml`)

All services run inside a user-defined bridge network named `ion-network`.

| Service | Image | Port | Depends on |
|---|---|---|---|
| `postgres` | `postgres:15` | `5432` | — |
| `redis` | `redis:alpine` | `6379` (internal) | — |
| `jenkins` | Custom Dockerfile | `8080` | docker.sock |
| `ion-repo-service` | Custom Dockerfile | `3002` | postgres, redis |
| `ion-request-service` | Custom Dockerfile | `3003` | postgres, redis |
| `ion-websocket` | Custom Dockerfile | `8081` | redis |
| `ion-deployment-service` | Custom Dockerfile | `3005` | postgres, redis |
| `prometheus` | `prom/prometheus` | `9090` | all ion services |
| `grafana` | `grafana/grafana` | `3001` | prometheus |

### Jenkins

- Built from `infrastructure/jenkins/Dockerfile`
- Mounts the host Docker socket (`/var/run/docker.sock`) so it can build and push images as part of CI/CD pipelines
- Pipeline defined at `Jenkinsfile` in root

### Prometheus

- Config: `infrastructure/prometheus/prometheus.yml`
- Scrape interval: **5 seconds**
- Targets:
  - `ion-request-service:3003/metrics`
  - `ion-repo-service:3002/metrics`
  - `ion-deployment-service:3005/metrics`
  - `ion-websocket:8081/metrics`

### Grafana

- Auto-provisioned via `infrastructure/grafana/provisioning/`
- Datasource: Prometheus (via internal Docker DNS name `prometheus:9090`)
- Dashboard: `infrastructure/grafana/provisioning/dashboard/ion-dashboard.json`
  - Real-time HTTP success/failure rates
  - Latency heatmaps (P50/P95)
  - Memory & CPU consumption
  - Service up/down status

---

## Data Flow

### Full Deployment Flow

```
1.  User → Dashboard → POST /api/deploy
         (ion: Next.js route handler)
                  │
2.                ↓
         ion-repo-service
         - Prisma: create Project (status=PENDING)
         - simple-git.clone() → temp dir
         - tar czf → ion-aws.upload('repos/{id}/source.tar.gz')
         - Redis: RPUSH 'ion:build:queue' projectId
         - Response: { projectId, status: 'QUEUED' }

3.                ↓
         Redis LIST 'ion:build:queue'
         (BLPOP in deployment-service loop)

4.                ↓
         ion-deployment-service
         - Redis: SET project status = BUILDING
         - ion-aws.download('repos/{id}/source.tar.gz') → /tmp/builds/{id}/
         - Docker SDK: pull node image, create container
         - Docker: start({ Cmd: ['sh', '-c', 'npm install && npm run build'] })
         - Stream stdout → Redis PubSub 'ion-broadcast'

5.                ↓
         ion-websocket (Bun + ws)
         - Redis subscribe 'ion-broadcast'
         - For each message: find projectId, broadcast to ws clients watching it

6.                ↓
         ion (Dashboard)
         - WebSocket on /logs/{projectId}
         - Render log chunks in terminal UI
         - Play 8-bit sound on 'BUILD_COMPLETE'

7.                ↓
         ion-deployment-service (continued)
         - On container exit(0): ion-aws.upload('dist/{id}/', /tmp/builds/{id}/dist/)
         - Redis: SET project status = SUCCESS
         - Cleanup container + temp files

8.                ↓
         request-service
         - User visits https://{projectId}.ion.dev
         - Looks up S3 key 'dist/{projectId}/index.html'
         - Streams file with Content-Type: text/html
```

### State Transitions

```
Project.status lifecycle:

  null → PENDING  → CLONING  → CLONED  → QUEUED
                                           ↓
                                    BUILDING → DEPLOYING
                                                       ↓
                                              SUCCESS | FAILED
```

---

## Environment Variables

### Root `.env`

| Variable | Description | Example |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://ion:ion@localhost:5432/ion` |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account ID | `abc123def` |
| `CLOUDFLARE_ACCESS_KEY_ID` | R2 access key ID | `abc` |
| `CLOUDFLARE_SECRET_ACCESS_KEY` | R2 secret key | `xyz...` |
| `S3_API` | R2/S3 endpoint URL | `https://abc.r2.cloudflarestorage.com` |
| `S3_BUCKET_NAME` | R2 bucket name | `ion-assets` |
| `GITHUB_CLIENT_ID` | GitHub OAuth App client ID | `Iv1.abc123` |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth App secret | `secret...` |
| `BETTER_AUTH_SECRET` | Session encryption key | `min 32 bytes` |
| `REDIS_URL` | Redis connection URL | `redis://localhost:6379` |
| `NEXT_PUBLIC_WEBSOCKET_URL` | WebSocket endpoint for frontend | `ws://localhost:8081` |
| `NEXT_PUBLIC_API_URL` | API base URL | `http://localhost:3002` |
| `JENKINS_URL` | Jenkins base URL (for CI/CD) | `http://localhost:8080` |

### Per-service `.env` (apps/*/.env)

Each service also has its own `.env` that mirrors the root values it needs:

- `ion-repo-service/.env` — `DATABASE_URL`, `REDIS_URL`, `S3_*`, `GITHUB_*`
- `ion-deployment-service/.env` — `DATABASE_URL`, `REDIS_URL`, `S3_*`
- `ion-request-service/.env` — `DATABASE_URL`, `REDIS_URL`, `S3_*`, `BETTER_AUTH_SECRET`
- `ion-websocket/.env` — `REDIS_URL`

### `packages/ion-aws/.env`

| Variable | Description |
|---|---|
| `AWS_ACCESS_KEY_ID` | R2 access key |
| `AWS_SECRET_ACCESS_KEY` | R2 secret |
| `AWS_REGION` | e.g. `auto` (R2 uses `auto`) |
| `S3_ENDPOINT` | R2 API endpoint URL |
| `S3_BUCKET_NAME` | Target bucket |

---

## Port Map

| Port | Service | Public? | Purpose |
|---|---|---|---|
| `3000` | `ion` (Next.js) | Yes | Dashboard UI |
| `3001` | `grafana` | Yes | Monitoring dashboards |
| `3002` | `ion-repo-service` | Internal | Repo ingestion API |
| `3003` | `ion-request-service` | Yes* | Subdomain proxy + project serving |
| `3005` | `ion-deployment-service` | Internal | Build worker API |
| `5432` | `postgres` | Internal | Database |
| `6379` | `redis` | Internal | Queue + PubSub |
| `8080` | `jenkins` | Yes | CI/CD automation |
| `8081` | `ion-websocket` | Internal | WebSocket server |
| `9090` | `prometheus` | Yes | Metrics scrape endpoint |

*`ion-request-service` on port `3003` is the public entrypoint — it handles both the dashboard API routes and subdomain project serving.

---

## Folder Structure

```
.
├── apps/
│   ├── ion/                          # Next.js Dashboard
│   │   ├── components/               # shadcn/ui + custom components
│   │   │   ├── github/              # GitHub repo browser UI
│   │   │   └── ui/                   # shadcn primitives
│   │   ├── app/                     # Next.js App Router pages
│   │   │   ├── api/                 # API routes
│   │   │   ├── dashboard/            # Dashboard pages
│   │   │   └── layout.tsx
│   │   ├── lib/                      # Utilities, auth helpers
│   │   ├── Dockerfile
│   │   └── package.json
│   │
│   ├── ion-repo-service/             # Git Ingestion Service
│   │   ├── src/
│   │   │   ├── index.ts             # Express entrypoint
│   │   │   ├── routes/              # Route handlers
│   │   │   ├── services/           # simple-git logic
│   │   │   └── middleware/          # Auth, CORS
│   │   ├── Dockerfile
│   │   └── package.json
│   │
│   ├── ion-deployment-service/       # Build Worker
│   │   ├── src/
│   │   │   ├── index.ts             # Bun HTTP entrypoint
│   │   │   ├── queue.ts            # Redis queue consumer (BLPOP loop)
│   │   │   ├── docker.ts           # Docker SDK wrapper
│   │   │   └── builder.ts          # Build orchestration logic
│   │   ├── Dockerfile
│   │   └── package.json
│   │
│   ├── ion-request-service/          # Subdomain Proxy
│   │   ├── src/
│   │   │   ├── index.ts             # Express entrypoint
│   │   │   ├── proxy.ts            # Subdomain → S3 lookup + streaming
│   │   │   └── routes/             # Health, status routes
│   │   ├── Dockerfile
│   │   └── package.json
│   │
│   └── ion-websocket/                # Log Streamer
│       ├── index.ts                  # Bun HTTP + ws entrypoint
│       └── package.json
│
├── packages/
│   ├── ion-db/                       # Prisma ORM Layer
│   │   ├── prisma/
│   │   │   └── schema.prisma        # Data models
│   │   ├── generated/               # Prisma client output
│   │   └── package.json
│   │
│   ├── ion-aws/                      # S3/R2 Wrapper
│   │   ├── src/
│   │   │   ├── s3.ts               # Upload/download/delete
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── ion-auth/                     # Better Auth
│   │   ├── src/
│   │   │   └── index.ts            # auth instance + helpers
│   │   └── package.json
│   │
│   ├── ion-common/                   # Shared Redis + Middleware
│   │   ├── src/
│   │   │   ├── redis.ts            # Redis client, pub/sub, queues
│   │   │   ├── middleware.ts       # CORS, logging, error handling
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── ion-monitoring/               # Prometheus Metrics
│   │   ├── src/
│   │   │   └── index.ts            # metrics middleware + collectors
│   │   └── package.json
│   │
│   ├── ion-config-eslint/            # Shared ESLint config
│   │   ├── library.js
│   │   ├── next.js
│   │   └── package.json
│   │
│   └── ion-config-typescript/        # Shared TSConfig
│       ├── base.json
│       ├── nextjs.json
│       └── package.json
│
├── infrastructure/
│   ├── jenkins/
│   │   └── Dockerfile
│   ├── prometheus/
│   │   └── prometheus.yml           # Scrape targets + intervals
│   └── grafana/
│       └── provisioning/
│           ├── datasource.yml       # Auto-connect Prometheus
│           └── dashboard/
│               ├── dashboard.yml     # Provisioning manifest
│               └── ion-dashboard.json  # Pre-built dashboard JSON
│
├── jenkins_data/                     # Persisted Jenkins home directory
├── docker-compose.yml               # Full stack orchestration
├── Jenkinsfile                     # CI/CD pipeline definition
├── turbo.json                      # Turborepo config
├── package.json                    # Root workspace manifest
├── .env.example                    # Template for all required env vars
├── README.md                        # Project overview + getting started
├── README-TODO.md                   # Roadmap (AI agent, voice, GitOps)
└── IMPLEMENTATION_PLAN.md           # Phased plan for GitHub + AI features
```

---

## Redis Key Schema

| Key | Type | Purpose |
|---|---|---|
| `ion:build:queue` | LIST | Projects awaiting build (BLPOP consumer) |
| `ion:broadcast` | PubSub channel | Real-time build log distribution |
| `ion:project:{id}:status` | STRING | Current build state (BUILDING, SUCCESS, etc.) |
| `ion:github:repos:{userId}` | STRING | Cached repo list (TTL: 5 min) |
| `ion:session:{sessionId}` | STRING | User session data |

---

## Adding a New Service

1. Create `apps/my-service/` or `packages/my-package/`
2. Add to `package.json` `workspaces` via Turborepo glob (`"apps/*"` / `"packages/*"`)
3. Add a `dev` script in its `package.json`
4. Add to `turbo.json` `pipeline` if you need build ordering
5. For Docker: copy a `Dockerfile` from an existing service, update `docker-compose.yml`
6. For Prometheus: add target to `infrastructure/prometheus/prometheus.yml`
7. For Grafana: the datasource auto-provisions; update the dashboard JSON if needed
8. For Redis: use `ion-common` helpers — do not create raw Redis clients

---

Built with ⚡ by Tejas P R
