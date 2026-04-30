FROM node:24-slim AS base

COPY . /app
WORKDIR /app

FROM base AS build
RUN npm ci
RUN npm run build

FROM node:24-slim
RUN npm install -g serve
COPY --from=build /app/dist /app/dist

EXPOSE 8080
CMD ["serve", "-s", "/app/dist", "-l", "8080"]
