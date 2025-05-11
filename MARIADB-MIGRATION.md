# Migration from Vercel Postgres to MariaDB

This document outlines the steps to migrate the database from Vercel Postgres to a local MariaDB database.

## Prerequisites

- Bun installed
- MariaDB server running on localhost:3306
- A database named `bakonykuti-mariadb` created in MariaDB

## Setup Environment Variables

1. Update your `.env` file to include the following variables:

```env
# MariaDB
MARIADB_PASSWORD="your-mariadb-password"
```

## Install Dependencies

Install the required dependencies:

```bash
bun install
```

## Migration Steps

You can run the complete migration process with a single command:

```bash
bun db:complete-migration
```

Or you can run each step individually:

### 1. Create the MariaDB Database

First, create the MariaDB database:

```bash
bun db:create-mariadb-database
```

### 2. Create Tables in MariaDB

Run the direct table creation script to create the necessary tables in MariaDB:

```bash
bun db:create-mariadb-tables
```

### 3. Test the Direct Connection

Test the direct connection to MariaDB to ensure tables were created correctly:

```bash
bun db:test-direct-connection
```

### 4. Migrate Data from Postgres to MariaDB

Run the data migration script to export data from Postgres and import it to MariaDB:

```bash
bun db:migrate-data
```

### 5. Test the Drizzle ORM Connection

Test the connection to MariaDB using Drizzle ORM:

```bash
bun db:test-connection
```

## Troubleshooting

- If you encounter issues with the connection, check that your MariaDB server is running and accessible.
- Ensure that the database `bakonykuti-mariadb` exists in MariaDB.
- Check that your environment variables are set correctly.
- If you encounter issues with the data migration, you can manually import the exported JSON files from the `export` directory.

## Additional Resources

- [MariaDB Documentation](https://mariadb.org/documentation/)
- [Drizzle ORM Documentation](https://orm.drizzle.team/docs/overview)
- [mysql2 Documentation](https://github.com/sidorares/node-mysql2#readme)
