FROM node:22-slim AS build

ENV CI=true
RUN corepack enable pnpm && corepack install -g pnpm@latest

# Copy the plugin (needed for the link: dependency)
COPY apollo-client-mock-directive-plugin /app/apollo-client-mock-directive-plugin

# Build the plugin first
WORKDIR /app/apollo-client-mock-directive-plugin
RUN npm ci && npx tsup

# Remove the plugin's own copies of peer deps so the consumer's
# copies are used (avoids duplicate type issues with tsc)
RUN rm -rf node_modules/@apollo node_modules/graphql

# Copy the demo app
COPY mock-spec-demo /app/mock-spec-demo

# Install and build the demo
WORKDIR /app/mock-spec-demo
RUN pnpm install --no-frozen-lockfile && pnpm run build

# ---

FROM node:22-slim AS runtime

RUN corepack enable pnpm && corepack install -g pnpm@latest

WORKDIR /app

COPY --from=build /app/mock-spec-demo/dist ./dist
COPY --from=build /app/mock-spec-demo/package.json ./
COPY --from=build /app/mock-spec-demo/vite.config.ts ./
COPY --from=build /app/mock-spec-demo/node_modules ./node_modules

EXPOSE 8080

CMD ["pnpm", "preview", "--host", "--port", "8080"]
