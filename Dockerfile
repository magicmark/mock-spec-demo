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

RUN npm install -g serve

WORKDIR /app
COPY --from=build /app/dist ./dist

EXPOSE 8080

CMD ["serve", "-s", "dist", "-l", "8080"]
