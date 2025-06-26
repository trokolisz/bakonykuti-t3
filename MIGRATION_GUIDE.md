# MariaDB Migration Guide

This guide covers the complete migration process from Vercel Postgres to MariaDB, including the new local file storage schema changes.

## Overview

The migration process is designed to handle two scenarios:
1. **Fresh Installation**: Setting up a new MariaDB database with the latest schema
2. **Existing Database Update**: Adding new schema changes to an existing MariaDB database

## Prerequisites

- MariaDB server running (Docker or local installation)
- Environment variables configured:
  - `MARIADB_PASSWORD`: Password for MariaDB root user
- Bun package manager installed

## Migration Process

### Phase 1: Database Setup and Data Migration

This phase sets up the MariaDB database and migrates existing data from Vercel Postgres (if available).

#### Step 1: Create Database
```bash
bun scripts/create-mariadb-database.ts
```
Creates the `bakonykuti-mariadb` database if it doesn't exist.

#### Step 2: Create Tables
```bash
bun scripts/migrate-to-mariadb.ts
```
Creates all required tables with the latest schema including:
- `bakonykuti-t3_image` (with `visible` and `local_path` columns)
- `bakonykuti-t3_news`
- `bakonykuti-t3_event`
- `bakonykuti-t3_document`
- `bakonykuti-t3_page`
- `bakonykuti-t3_user`
- `bakonykuti-t3_account`
- `bakonykuti-t3_session`
- `bakonykuti-t3_verificationToken`

#### Step 3: Migrate Data (Optional)
```bash
bun scripts/migrate-data-to-mariadb.ts
```
Migrates existing data from Vercel Postgres to MariaDB. This step is skipped if the source database is not available.

### Phase 2: Schema Updates

This phase applies the new schema changes required for local file storage.

#### New Columns Added to `images` Table:
- `visible` (BOOLEAN NOT NULL DEFAULT TRUE): Controls visibility in public gallery
- `local_path` (VARCHAR(1024) NULL): Tracks local file paths for cleanup

#### Automatic Updates:
- All existing images are marked as `visible = TRUE`
- New columns are added with proper defaults
- Data integrity is preserved

## Enhanced Migration Script

For a complete automated migration, use the enhanced script:

```bash
bun scripts/enhanced-mariadb-migration.ts
```

This script:
1. Detects if database exists
2. Runs appropriate migration steps
3. Applies schema updates
4. Verifies migration success
5. Provides detailed logging and error handling

## Manual Migration Steps

If you prefer manual control, follow these steps:

### For Fresh Installation:
```bash
# 1. Create database
bun scripts/create-mariadb-database.ts

# 2. Create tables with latest schema
bun scripts/migrate-to-mariadb.ts

# 3. Test connection
bun scripts/test-mariadb-connection.ts

# 4. Migrate data (if source available)
bun scripts/migrate-data-to-mariadb.ts
```

### For Existing Database Update:
```bash
# 1. Apply schema updates
bun scripts/ensure-image-columns.ts

# 2. Verify changes
bun scripts/verify-database-state.ts
```

## Verification

After migration, verify the database state:

```bash
bun scripts/verify-database-state.ts
```

This script checks:
- All tables exist
- New columns are present
- Data integrity is maintained
- Drizzle schema compatibility

## Rollback Procedures

### If Migration Fails:

1. **Check Database Connection**:
   ```bash
   bun scripts/test-mariadb-connection.ts
   ```

2. **Verify MariaDB is Running**:
   - Check Docker containers: `docker ps`
   - Check local MariaDB service

3. **Check Environment Variables**:
   - Ensure `MARIADB_PASSWORD` is set correctly
   - Verify database connection parameters

4. **Manual Schema Rollback** (if needed):
   ```sql
   -- Remove new columns if needed
   ALTER TABLE `bakonykuti-t3_image` DROP COLUMN `visible`;
   ALTER TABLE `bakonykuti-t3_image` DROP COLUMN `local_path`;
   ```

## Schema Changes Summary

### Before Migration:
```sql
CREATE TABLE `bakonykuti-t3_image` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `url` VARCHAR(1024) NOT NULL,
  `title` VARCHAR(256) NOT NULL DEFAULT '',
  `carousel` BOOLEAN NOT NULL DEFAULT false,
  `gallery` BOOLEAN NOT NULL DEFAULT true,
  `image_size` INT NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### After Migration:
```sql
CREATE TABLE `bakonykuti-t3_image` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `url` VARCHAR(1024) NOT NULL,
  `title` VARCHAR(256) NOT NULL DEFAULT '',
  `carousel` BOOLEAN NOT NULL DEFAULT false,
  `gallery` BOOLEAN NOT NULL DEFAULT true,
  `visible` BOOLEAN NOT NULL DEFAULT true,      -- NEW
  `local_path` VARCHAR(1024) NULL,              -- NEW
  `image_size` INT NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Troubleshooting

### Common Issues:

1. **Connection Refused**: Ensure MariaDB is running and accessible
2. **Permission Denied**: Check database user permissions
3. **Table Already Exists**: Use `IF NOT EXISTS` clauses or drop existing tables
4. **Column Already Exists**: Migration scripts handle this automatically

### Debug Commands:
```bash
# Test basic connection
bun scripts/test-mariadb-connection.ts

# Check table structure
bun scripts/check-image-table-structure.ts

# Verify new columns
bun scripts/test-new-columns.ts
```

## Next Steps

After successful migration:
1. Update application configuration to use MariaDB
2. Test local file upload functionality
3. Implement admin gallery management features
4. Remove UploadThing dependencies

## Support

For issues or questions:
1. Check the error logs from migration scripts
2. Verify database connection and permissions
3. Ensure all prerequisites are met
4. Review this guide for troubleshooting steps
