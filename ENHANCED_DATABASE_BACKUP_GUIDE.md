# 🗄️ Enhanced Database Backup & Restore System

A comprehensive, environment-aware database backup and restore system for MariaDB with support for multiple environments, CSV exports, and robust error handling.

## 🌟 Features

- **Multi-Environment Support**: Different configurations for development, staging, and production
- **Multiple Backup Types**: Schema-only, data-only, and complete backups
- **CSV Export/Import**: Alternative backup format for data migration
- **Environment Configuration**: File-based or environment variable configuration
- **Validation & Error Handling**: Comprehensive backup validation and error recovery
- **Backup Management**: List, validate, and cleanup old backups
- **Compression Support**: Optional gzip compression for backups
- **Cross-Database Restore**: Restore backups to different database names

## 📋 Quick Start

### 1. Setup Environment Configuration

Create environment-specific configuration files:

```bash
# Create example configuration files
bun scripts/database-config.ts create-examples

# Copy and customize for your environments
cp config/database.development.json.example config/database.development.json
cp config/database.production.json.example config/database.production.json
```

Edit the configuration files with your actual database credentials:

```json
{
  "host": "localhost",
  "port": 3306,
  "user": "root",
  "password": "your_password",
  "database": "your_database_name"
}
```

### 2. Test Configuration

```bash
# Test development environment
bun scripts/database-config.ts test development

# Test production environment
bun scripts/database-config.ts test production
```

### 3. Create Your First Backup

```bash
# Complete backup (schema + data)
bun scripts/enhanced-backup.ts complete

# Schema-only backup
bun scripts/enhanced-backup.ts schema --env production

# Data-only backup with compression
bun scripts/enhanced-backup.ts data --compress
```

### 4. Restore a Backup

```bash
# Dry run to see what would happen
bun scripts/enhanced-restore.ts backup-file.sql --dry-run --validate

# Actual restore with validation
bun scripts/enhanced-restore.ts backup-file.sql --validate --backup-first
```

## 🔧 Detailed Usage

### Enhanced Backup Script

The enhanced backup script supports multiple backup types and environments:

```bash
# Basic usage
bun scripts/enhanced-backup.ts <type> [options]

# Backup types
complete    # Schema + data (recommended for full backups)
schema      # Database structure only
data        # Data only (for data migration)

# Options
--env <environment>     # Target environment (development, staging, production)
--output <directory>    # Output directory (default: ./database-backups)
--compress              # Compress backup with gzip
--no-drop               # Don't include DROP statements
--include <tables>      # Include only specific tables (comma-separated)
--exclude <tables>      # Exclude specific tables (comma-separated)
```

**Examples:**

```bash
# Production backup with compression
bun scripts/enhanced-backup.ts complete --env production --compress

# Schema backup excluding migration tables
bun scripts/enhanced-backup.ts schema --exclude "__drizzle_migrations"

# Data backup for specific tables
bun scripts/enhanced-backup.ts data --include "users,orders,products"
```

### Enhanced Restore Script

The restore script provides comprehensive error handling and validation:

```bash
# Basic usage
bun scripts/enhanced-restore.ts <backup-file> [options]

# Options
--env <environment>     # Target environment
--database <name>       # Override target database name
--create-db             # Create database if it doesn't exist
--drop-existing         # Drop existing database before restore
--validate              # Validate backup content before restore
--backup-first          # Create backup of existing data before restore
--dry-run               # Show what would be done without making changes
```

**Examples:**

```bash
# Safe restore with validation and pre-restore backup
bun scripts/enhanced-restore.ts backup.sql --validate --backup-first

# Restore to different database
bun scripts/enhanced-restore.ts backup.sql --database new-db --create-db

# Production restore with full safety checks
bun scripts/enhanced-restore.ts prod-backup.sql --env production --validate --backup-first --drop-existing
```

### CSV Export/Import System

Export and import data in CSV format for easy data migration:

```bash
# Export all tables to CSV
bun scripts/csv-export-import.ts export

# Export specific tables
bun scripts/csv-export-import.ts export --tables "users,orders"

# Export with custom delimiter
bun scripts/csv-export-import.ts export --delimiter ";" --output ./csv-data

# Import from CSV files
bun scripts/csv-export-import.ts import ./csv-data

# Import with table truncation
bun scripts/csv-export-import.ts import ./csv-data --truncate --env staging
```

### Backup Management

Manage your backups with the backup manager utility:

```bash
# List all backups
bun scripts/backup-manager.ts list

# List backups for specific environment
bun scripts/backup-manager.ts list --env production

# Get detailed backup information
bun scripts/backup-manager.ts info backup-name

# Validate a backup
bun scripts/backup-manager.ts validate backup-name

# Cleanup old backups (keep only 5 newest)
bun scripts/backup-manager.ts cleanup --keep-count 5

# Cleanup backups older than 30 days (dry run)
bun scripts/backup-manager.ts cleanup --keep-days 30 --dry-run
```

## 🌍 Environment Configuration

### Configuration Priority

The system uses the following priority order for configuration:

1. **Environment Variables** (highest priority)
2. **Configuration Files** (`config/database.{environment}.json`)
3. **Default Values** (lowest priority)

### Environment Variables

```bash
MARIADB_HOST=localhost
MARIADB_PORT=3306
MARIADB_USER=root
MARIADB_PASSWORD=your_password
MARIADB_DATABASE=your_database
NODE_ENV=development
```

### Configuration Files

Create environment-specific files in the `config/` directory:

- `config/database.development.json`
- `config/database.staging.json`
- `config/database.production.json`

### Security Best Practices

⚠️ **Important Security Notes:**

1. **Never commit passwords to version control**
2. **Add `config/database.*.json` to `.gitignore`**
3. **Use environment variables in production**
4. **Keep example files for reference only**
5. **Use strong, unique passwords for each environment**

## 🚀 Deployment Scenarios

### Development to Staging Migration

```bash
# 1. Create backup from development
bun scripts/enhanced-backup.ts complete --env development

# 2. Restore to staging with validation
bun scripts/enhanced-restore.ts dev-backup.sql --env staging --validate --backup-first
```

### Production Backup Strategy

```bash
# Daily automated backup (add to cron)
bun scripts/enhanced-backup.ts complete --env production --compress

# Weekly cleanup (keep 4 weeks of backups)
bun scripts/backup-manager.ts cleanup --keep-days 28 --env production
```

### Cross-Database Migration

```bash
# Export data to CSV for migration
bun scripts/csv-export-import.ts export --env source-db --output ./migration-data

# Import to new database
bun scripts/csv-export-import.ts import ./migration-data --env target-db --truncate
```

## 🔍 Troubleshooting

### Common Issues

**1. "Database password is required"**
```bash
# Solution: Set password in environment or config file
export MARIADB_PASSWORD="your_password"
# OR edit config/database.development.json
```

**2. "Backup file not found"**
```bash
# Solution: Check file path and permissions
ls -la database-backups/
# Use absolute path if needed
bun scripts/enhanced-restore.ts /full/path/to/backup.sql
```

**3. "Connection refused"**
```bash
# Solution: Check database server status
# For Docker:
docker ps | grep mariadb
# For local service:
systemctl status mariadb
```

**4. "Table already exists" during restore**
```bash
# Solution: Use --drop-existing flag
bun scripts/enhanced-restore.ts backup.sql --drop-existing --backup-first
```

### Validation and Recovery

Always validate backups before relying on them:

```bash
# Validate backup integrity
bun scripts/backup-manager.ts validate backup-name

# Test restore with dry run
bun scripts/enhanced-restore.ts backup.sql --dry-run --validate
```

### Performance Optimization

For large databases:

```bash
# Use compression to reduce file size
bun scripts/enhanced-backup.ts complete --compress

# Exclude large log tables
bun scripts/enhanced-backup.ts complete --exclude "logs,audit_trail"

# Use CSV export for data-only migration
bun scripts/csv-export-import.ts export --tables "large_table"
```

## 📅 Automation Examples

### Cron Job for Daily Backups

```bash
# Add to crontab (crontab -e)
0 2 * * * cd /path/to/project && bun scripts/enhanced-backup.ts complete --env production --compress
0 3 * * 0 cd /path/to/project && bun scripts/backup-manager.ts cleanup --keep-days 30 --env production
```

### Backup Script for CI/CD

```bash
#!/bin/bash
# backup-before-deploy.sh

echo "Creating pre-deployment backup..."
bun scripts/enhanced-backup.ts complete --env production --compress

if [ $? -eq 0 ]; then
    echo "✅ Backup created successfully"
    # Continue with deployment
else
    echo "❌ Backup failed - aborting deployment"
    exit 1
fi
```

## 🆘 Emergency Recovery

### Quick Recovery Steps

1. **Stop the application** to prevent data corruption
2. **Identify the latest valid backup**:
   ```bash
   bun scripts/backup-manager.ts list --env production
   ```
3. **Validate the backup**:
   ```bash
   bun scripts/backup-manager.ts validate backup-name
   ```
4. **Restore with safety checks**:
   ```bash
   bun scripts/enhanced-restore.ts backup.sql --env production --validate --backup-first
   ```
5. **Verify the restoration**:
   ```bash
   # Check table counts, recent data, etc.
   mysql -u root -p -e "SELECT COUNT(*) FROM important_table;"
   ```
6. **Restart the application**

### Rollback Procedure

If a restore goes wrong, you can rollback using the pre-restore backup:

```bash
# The restore script automatically creates a backup before restoring
# Look for files like: database-pre-restore-TIMESTAMP.sql
bun scripts/enhanced-restore.ts database-pre-restore-*.sql --validate
```

---

## 📞 Support

For issues or questions:

1. Check the troubleshooting section above
2. Validate your configuration: `bun scripts/database-config.ts test`
3. Test with dry run: `--dry-run` flag
4. Check backup integrity: `bun scripts/backup-manager.ts validate`

Remember: Always test your backup and restore procedures in a non-production environment first!
