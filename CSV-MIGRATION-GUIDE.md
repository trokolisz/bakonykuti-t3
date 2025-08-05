# CSV-Based Database Migration Guide

This guide covers the two-step CSV-based migration process from Vercel Postgres to MariaDB. This approach allows you to export data once and share CSV files for easy setup across different environments.

## Overview

The CSV migration process consists of two main steps:

1. **Step 1 - Data Export**: Export all existing data from Vercel Postgres to CSV files
2. **Step 2 - Data Import**: Import data from CSV files into MariaDB

## Benefits of CSV Migration

- **Portability**: CSV files can be easily shared without database credentials
- **Flexibility**: Others can set up the system using only CSV files and their local MariaDB
- **Transparency**: Data is in human-readable format for review and validation
- **Reliability**: Handles data type conversion and validation automatically
- **Recovery**: Failed imports can be easily retried without re-exporting

## Prerequisites

### For Data Export (Step 1)
- Access to the source Vercel Postgres database
- Vercel Postgres environment variables configured
- Bun package manager installed

### For Data Import (Step 2)
- MariaDB server running (configurable via environment variables)
- Database created in MariaDB (configurable via environment variables)
- MariaDB connection environment variables configured
- Required tables created in MariaDB

## Step 1: Data Export

### 1.1 Setup Environment Variables

Ensure your `.env` file contains the Vercel Postgres connection details:

```env
# Vercel Postgres (for export only)
POSTGRES_URL="your-vercel-postgres-url"
POSTGRES_PRISMA_URL="your-vercel-postgres-prisma-url"
POSTGRES_URL_NON_POOLING="your-vercel-postgres-non-pooling-url"
POSTGRES_USER="your-postgres-user"
POSTGRES_HOST="your-postgres-host"
POSTGRES_PASSWORD="your-postgres-password"
POSTGRES_DATABASE="your-postgres-database"
```

### 1.2 Run the Export Script

Execute the CSV export script:

```bash
bun db:export-to-csv
```

This script will:
- Connect to your Vercel Postgres database
- Export all tables to CSV files in the `migration-data/` directory
- Handle data type conversion (dates, booleans, JSON, etc.)
- Create export metadata and summary files
- Provide detailed logging and error handling

### 1.3 Export Output

The export process creates:
- `migration-data/[table-name].csv` - Data files for each table
- `migration-data/export-metadata.json` - Export information and metadata
- `migration-data/export-summary.txt` - Detailed export summary and statistics

### 1.4 Verify Export

Review the export summary to ensure all data was exported successfully:

```bash
cat migration-data/export-summary.txt
```

## Step 2: Data Import

### 2.1 Setup MariaDB Environment

Ensure your `.env` file contains the MariaDB configuration:

```env
# MariaDB Connection Settings
MARIADB_HOST=localhost
MARIADB_PORT=3306
MARIADB_USER=root
MARIADB_PASSWORD="your-mariadb-password"
MARIADB_DATABASE=bakonykuti-mariadb
```

### 2.2 Prepare MariaDB Database

Before importing, ensure the MariaDB database and tables are ready:

```bash
# Create the database
bun db:create-mariadb-database

# Create all required tables
bun db:migrate-to-mariadb

# Test the connection
bun db:test-connection
```

### 2.3 Transfer CSV Files

If you're setting up on a different machine:
1. Copy the entire `migration-data/` folder to your target environment
2. Place it in the root directory of your project

### 2.4 Run the Import Script

Execute the CSV import script:

```bash
# Import data from CSV files
bun db:import-from-csv
```

This script will:
- Validate CSV data before import
- Import data with proper type conversion
- Handle duplicate records gracefully
- Provide detailed progress logging
- Generate import summary and statistics

### 2.5 Import Output

The import process creates:
- `migration-data/import-summary.txt` - Detailed import summary and statistics
- Console output with real-time progress and error reporting

### 2.6 Verify Import

After import, verify the database state:

```bash
bun db:verify-state
```

## Data Type Handling

The CSV migration system automatically handles various data types:

### Supported Data Types
- **Strings**: Preserved as-is with proper escaping
- **Numbers**: Automatically detected and converted
- **Booleans**: Converted to 1/0 for CSV, restored as boolean
- **Dates**: Converted to ISO string format, restored as Date objects
- **JSON Objects**: Serialized to JSON strings, parsed back to objects
- **NULL Values**: Handled as empty strings in CSV, restored as NULL

### Special Handling
- **SQL Injection Prevention**: All values are properly sanitized
- **Character Escaping**: Single quotes and backslashes are escaped
- **Duplicate Handling**: Uses `INSERT IGNORE` to skip duplicate records

## Error Handling and Recovery

### Export Errors
- **Connection Issues**: Detailed error messages with troubleshooting steps
- **Missing Tables**: Gracefully skips non-existent tables
- **Data Corruption**: Validates data before writing to CSV

### Import Errors
- **Validation Failures**: Pre-import validation with detailed error reporting
- **Row-Level Errors**: Continues import even if individual rows fail
- **Connection Issues**: Clear error messages with resolution steps

### Recovery Procedures

If export fails:
1. Check database connection and credentials
2. Verify table existence in source database
3. Review export summary for specific errors
4. Re-run export after fixing issues

If import fails:
1. Review import summary for specific errors
2. Check MariaDB connection and table structure
3. Validate CSV file integrity
4. Re-run import (duplicates will be skipped)

## File Structure

```
migration-data/
├── export-metadata.json     # Export information
├── export-summary.txt       # Export statistics
├── import-summary.txt       # Import statistics (after import)
├── user.csv                 # User data
├── account.csv              # Account data
├── session.csv              # Session data
├── verificationToken.csv    # Verification tokens
├── image.csv                # Image data
├── page.csv                 # Page data
├── news.csv                 # News data
├── event.csv                # Event data
└── document.csv             # Document data
```

## Troubleshooting

### Common Export Issues

1. **Connection Refused**
   - Verify Vercel Postgres credentials
   - Check network connectivity
   - Ensure database is accessible

2. **Table Not Found**
   - Normal if table doesn't exist in source
   - Check table names in source database

3. **Permission Denied**
   - Verify database user has read permissions
   - Check connection string format

### Common Import Issues

1. **MariaDB Connection Failed**
   - Ensure MariaDB is running
   - Verify `MARIADB_PASSWORD` is correct
   - Check if database `bakonykuti-mariadb` exists

2. **Table Not Found**
   - Run table creation script first
   - Verify table names match schema

3. **Data Validation Errors**
   - Review validation errors in summary
   - Check CSV file integrity
   - Verify data format consistency

## Best Practices

1. **Always backup** your target database before importing
2. **Review summaries** after both export and import
3. **Test thoroughly** after migration
4. **Keep CSV files** as backup until migration is verified
5. **Document any custom changes** made to the data

## Next Steps

After successful migration:
1. Update application configuration to use MariaDB
2. Test all application functionality
3. Remove Vercel Postgres dependencies (if no longer needed)
4. Archive CSV files for future reference
5. Update deployment configurations
