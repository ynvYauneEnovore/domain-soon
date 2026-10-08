# Use the official Bun image
FROM oven/bun:1 AS builder
WORKDIR /app

# Install dependencies
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Copy source and build
COPY . .
RUN bun run build

# Serve with Nginx
FROM nginx:alpine
# Copy built static files to Nginx public folder
COPY --from=builder /app/dist /usr/share/nginx/html
# Expose port 80
EXPOSE 80
# Run Nginx
CMD ["nginx", "-g", "daemon off;"]