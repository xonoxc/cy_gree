# Use an official Bun runtime as a parent image
FROM oven/bun:latest AS base

# Set working directory
WORKDIR /app

# Copy the package.json and bun.lockb files
COPY package.json bun.lockb ./

# Install app dependencies
RUN bun install

# Copy local files including .env file
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Disable telemetry during the build
ENV NEXT_TELEMETRY_DISABLED 1

# Build the Next.js application
RUN bun run build

# Expose the port Next.js listens on
EXPOSE 3000

# Start the server using bun
CMD ["bun", "start"]
