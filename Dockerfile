# Stage 1: build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json?* ./
RUN npm install
COPY public ./public
COPY src ./src
RUN npx vite build

# Stage 2: serve static assets
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
