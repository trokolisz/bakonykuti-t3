# Docker Deployment Guide for Bakonykuti T3 App

This guide explains how to deploy the Bakonykuti T3 application using Docker.

## Prerequisites

- Docker and Docker Compose installed on your system
- Basic understanding of Docker concepts
- A copy of the application codebase
- **MariaDB database** running on your host machine (localhost:3306)

## Environment Setup

1. Create a `.env` file in the root directory of the project with the following variables:

```env
# MariaDB (must match your local MariaDB password)
MARIADB_PASSWORD=your_secure_password

# NextAuth.js
AUTH_SECRET=your_auth_secret  # Generate with: openssl rand -base64 32
NEXTAUTH_URL=http://your-domain.com  # Or http://localhost:3000 for local deployment
```

## Database Requirements

This Docker setup assumes:

- You have MariaDB running on your host machine (localhost)
- The database name is `bakonykuti-mariadb`
- The root user password matches the `MARIADB_PASSWORD` in your `.env` file

## Deployment Options

### Development Deployment

For development with hot-reloading:

```bash
# Using npm script
npm run docker:dev

# Or using the shell script
./scripts/docker-deploy.sh dev
```

This will:

- Mount your local codebase into the container
- Enable hot-reloading
- Connect to your local MariaDB database
- Make the app available at `http://localhost:3000`

### Production Deployment

For production deployment:

```bash
# Using npm script
npm run docker:prod

# Or using the shell script
./scripts/docker-deploy.sh prod
```

This will:

- Build an optimized production image
- Start the application in production mode
- Connect to your local MariaDB database
- Make the app available at `http://localhost:3000`

## Network Configuration

The Docker container uses the host network mode, which means:

- It connects directly to services on your host machine
- It can access your local MariaDB database at localhost:3306
- The container shares the host's network stack

## Common Commands

```bash
# Build the Docker images
npm run docker:build

# Start the containers
npm run docker:start

# Stop the containers
npm run docker:stop

# View container logs
npm run docker:logs
```

## Running in Standalone Mode

The application is configured to use Next.js standalone output mode, which creates a self-contained application that doesn't require the `node_modules` directory.

If you want to run the standalone version locally (outside of Docker):

```bash
# First build the application
npm run build

# Then run the standalone server
npm run start:standalone
```

Note: When using `output: standalone` in Next.js, you should not use `next start` to run the application. Instead, use `node .next/standalone/server.js`.

## Customization

### Changing the Database Connection

If your MariaDB is running on a different host or port, you'll need to modify:

- `src/server/db/index.ts` - Update the host and port
- `drizzle.config.ts` - Update the host and port

### Changing the Application Port

To change the port the application runs on, modify the `ports` section in `docker-compose.yml`:

```yaml
ports:
  - "8080:3000"  # Change 8080 to your desired port
```

## Troubleshooting

### Database Connection Issues

If the app can't connect to the database:

1. Verify that MariaDB is running on your host machine
2. Check that the database credentials in your `.env` file match your local setup
3. Ensure the database `bakonykuti-mariadb` exists
4. Check the container logs: `npm run docker:logs`

### Container Won't Start

If a container fails to start:

1. Check the logs: `docker-compose logs app`
2. Verify that port 3000 is not already in use
3. Ensure your `.env` file contains all required variables

## Security Considerations

- Never commit your `.env` file to version control
- Use strong, unique passwords for your database
- Regularly update your Docker images to get security patches
