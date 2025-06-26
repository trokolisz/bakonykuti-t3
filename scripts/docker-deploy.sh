#!/bin/bash

# This script helps with Docker deployment operations

# Function to display help message
show_help() {
  echo "Docker Deployment Script for Bakonykuti T3 App"
  echo ""
  echo "Usage: ./scripts/docker-deploy.sh [COMMAND]"
  echo ""
  echo "Commands:"
  echo "  build       Build the Docker images"
  echo "  start       Start the Docker containers"
  echo "  stop        Stop the Docker containers"
  echo "  restart     Restart the Docker containers"
  echo "  logs        Show logs from the containers"
  echo "  prod        Start production containers (no override file)"
  echo "  dev         Start development containers (with override file)"
  echo "  help        Show this help message"
  echo ""
}

# Check if Docker is installed
if ! [ -x "$(command -v docker)" ]; then
  echo "Error: Docker is not installed." >&2
  exit 1
fi

# Check if Docker Compose is installed
if ! [ -x "$(command -v docker-compose)" ]; then
  echo "Error: Docker Compose is not installed." >&2
  exit 1
fi

# Process commands
case "$1" in
  build)
    echo "Building Docker images..."
    docker-compose build
    ;;
  start)
    echo "Starting Docker containers..."
    docker-compose up -d
    ;;
  stop)
    echo "Stopping Docker containers..."
    docker-compose down
    ;;
  restart)
    echo "Restarting Docker containers..."
    docker-compose down
    docker-compose up -d
    ;;
  logs)
    echo "Showing logs from containers..."
    docker-compose logs -f
    ;;
  prod)
    echo "Starting production containers..."
    docker-compose -f docker-compose.yml up -d
    ;;
  dev)
    echo "Starting development containers..."
    docker-compose up -d
    ;;
  help|*)
    show_help
    ;;
esac
