FROM oven/bun:1.2.22 AS base
WORKDIR /app

FROM base AS pruner
RUN bun add -g turbo@2.8.9
COPY . .
RUN turbo prune ion-request-service --docker

FROM base AS installer
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/bun.lock ./bun.lock
RUN bun install

FROM base AS builder
COPY --from=installer /app/ .
COPY --from=pruner /app/out/full/ .

FROM base AS runner
COPY --from=builder /app/ .
EXPOSE 3003

CMD ["bun", "run", "apps/ion-request-service/src/index.ts"]
