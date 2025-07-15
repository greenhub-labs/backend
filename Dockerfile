# Stage 1: Build
FROM node:24-alpine AS builder

WORKDIR /usr/src/app

# Install pnpm globally
RUN npm install -g pnpm

# Copy dependencies files
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./

# Install dependencies (all, for build)
RUN pnpm install --frozen-lockfile

# Copy prisma files
COPY prisma ./prisma

# Copy the rest of the code
COPY . .

# Build the app
RUN pnpm prisma:generate
RUN pnpm build

# Stage 2: Runtime
FROM node:24-alpine

WORKDIR /usr/src/app

# Install pnpm globally
RUN npm install -g pnpm

# Copy only production node_modules, dist and package.json
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/package.json ./
COPY --from=builder /usr/src/app/pnpm-lock.yaml ./
COPY --from=builder /usr/src/app/prisma ./prisma


# Expose the app port
EXPOSE 3000

# Default command
CMD ["pnpm", "prod"] 