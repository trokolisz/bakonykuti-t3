#!/bin/bash

# Build the application
echo "Building Next.js application..."
bun run build

# Start the application
echo "Starting Next.js application on port 3000..."
NODE_ENV=production bun run start
