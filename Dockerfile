ARG NODE_VERSION=19
ARG ALPINE_VERSION=3.16

FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION} AS deps
RUN apk add --no-cache rsync

RUN npm install -g pnpm

WORKDIR /workspace-install

COPY pnpm-lock.yaml pnpm-workspace.yaml ./

RUN --mount=type=bind,target=/docker-context \
  rsync -amv --delete \
  --exclude="node_modules" \
  --exclude="*/node_modules" \
  --include="package.json" \
  --include="schema.prisma" \
  --include="*/" --exclude="*" \
  /docker-context/ /workspace-install/;

ENV PRISMA_CLI_BINARY_TARGETS=linux-musl

RUN --mount=type=cache,target=/root/.pnpm-store,id=pnpm-store \
  pnpm install --frozen-lockfile



FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION} AS builder
ENV NODE_ENV=production

WORKDIR /app

COPY ./ ./
COPY --from=deps /workspace-install ./

RUN pnpm --filter api build

RUN --mount=type=cache,target=/root/.pnpm-store,id=pnpm-store \
  SKIP_POSTINSTALL=1 \
  pnpm install --filter api --frozen-lockfile --prod



FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION} AS runner

WORKDIR /app

ENV NODE_ENV production

COPY --from=builder /app/apps/api/webpack.config.ts \
  /app/apps/api/package.json \
  ./apps/api/
COPY --from=builder /app/apps/api/dist/ ./apps/api/dist/
COPY --from=builder /app/node_modules/ ./node_modules/
COPY --from=builder /app/package.json ./package.json

EXPOSE 6000

CMD ["node", "dist/bundle.js"]



FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION} AS develop
ENV NODE_ENV=development
ENV NODE_OPTIONS=--max-old-space-size=8192

RUN npm install -g pnpm

WORKDIR /app

COPY --from=deps /workspace-install ./

EXPOSE 6000

WORKDIR /app/apps/api

RUN npx prisma generate --schema=./prisma/schema.prisma

CMD ["pnpm", "start:dev"]
