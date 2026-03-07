FROM node:22-slim AS build

ENV CI=true
RUN corepack enable pnpm && corepack install -g pnpm@latest

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --no-frozen-lockfile

COPY . .
RUN pnpm run build

# ---

FROM node:22-slim AS runtime

RUN corepack enable pnpm && corepack install -g pnpm@latest

WORKDIR /app

COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./
COPY --from=build /app/vite.config.ts ./
COPY --from=build /app/node_modules ./node_modules

EXPOSE 8080

CMD ["pnpm", "preview", "--host", "--port", "8080"]
