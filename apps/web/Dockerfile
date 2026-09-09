# Stage 1: Build static assets with Node & pnpm
FROM node:22-slim AS builder

WORKDIR /app

ARG VITE_API_URL=http://localhost:8080
ENV VITE_API_URL=$VITE_API_URL

ARG VITE_SENTRY_DSN=""
ENV VITE_SENTRY_DSN=$VITE_SENTRY_DSN

RUN corepack enable && corepack prepare pnpm@10.33.0 --activate

COPY package.json ./
RUN pnpm install

COPY . .
RUN pnpm build

# Stage 2: Serve with lightweight Nginx
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
