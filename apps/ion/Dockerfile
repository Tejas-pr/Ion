FROM oven/bun:1.2.22 AS base
WORKDIR /app

FROM base AS pruner
RUN bun add -g turbo@2.8.9
COPY . .
RUN cat package.json
RUN cat package.json
RUN turbo prune ion --docker

FROM base AS deps
WORKDIR /app
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/bun.lock ./bun.lock
RUN bun install

FROM base AS builder
WORKDIR /app
COPY --from=pruner /app/out/full/ .
COPY --from=pruner /app/out/bun.lock ./bun.lock
COPY --from=deps /app/node_modules ./node_modules

ARG NEXT_PUBLIC_REPO_BACKEND_URL
ENV NEXT_PUBLIC_REPO_BACKEND_URL=$NEXT_PUBLIC_REPO_BACKEND_URL

ARG NEXT_PUBLIC_REQUEST_BACKEND_URL
ENV NEXT_PUBLIC_REQUEST_BACKEND_URL=$NEXT_PUBLIC_REQUEST_BACKEND_URL

RUN bun run build

FROM oven/bun:1.2.22-slim AS runner
WORKDIR /app

COPY --from=builder /app/apps/ion/.next/standalone ./
COPY --from=builder /app/apps/ion/.next/static ./apps/ion/.next/static
COPY --from=builder /app/apps/ion/public ./apps/ion/public

EXPOSE 3000

CMD ["bun", "apps/ion/server.js"]