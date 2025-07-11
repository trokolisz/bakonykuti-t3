# Migration from Vercel Postgres to MariaDB

This document outlines the steps to migrate the database from Vercel Postgres to a local MariaDB database.

## Prerequisites

- Bun installed
- MariaDB server running (default: localhost:3306)
- A database created in MariaDB (default: `bakonykuti-mariadb`)

## Setup Environment Variables

1. Update your `.env` file to include the following variables:

```env
# MariaDB Connection Settings
MARIADB_HOST=localhost
MARIADB_PORT=3306
MARIADB_USER=root
MARIADB_PASSWORD="your-mariadb-password"
MARIADB_DATABASE=bakonykuti-mariadb
```

**Note**: All MariaDB connection settings are now configurable via environment variables. If not specified, the system will use the default values shown above.

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

You have two options for data migration:

#### Option A: Direct Migration (Original Method)

Run the direct data migration script:

```bash
bun db:migrate-data
```

#### Option B: CSV-Based Migration (Recommended)

Use the two-step CSV migration process for better portability and error handling:

**Step 1 - Export data to CSV files:**

```bash
bun db:export-to-csv
```

**Step 2 - Import data from CSV files:**

```bash
bun db:import-from-csv
```

For detailed instructions on the CSV migration process, see [CSV-MIGRATION-GUIDE.md](./CSV-MIGRATION-GUIDE.md).

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
