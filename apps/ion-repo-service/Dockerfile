FROM oven/bun:1.2.22 AS base
WORKDIR /app

FROM base AS pruner
RUN bun add -g turbo
COPY . .
RUN turbo prune ion-repo-service --docker

FROM base AS installer
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/bun.lock ./bun.lock
RUN bun install

FROM base AS builder
COPY --from=installer /app/ .
COPY --from=pruner /app/out/full/ .

FROM base AS runner
COPY --from=builder /app/ .
EXPOSE 3002

CMD ["bun", "run", "apps/ion-repo-service/src/index.ts"]
