# 🚀 Database Backup Quick Reference

## Setup (One-time)

```bash
# 1. Create configuration examples
bun run db:config create-examples

# 2. Copy and edit configuration files
cp config/database.development.json.example config/database.development.json
cp config/database.production.json.example config/database.production.json

# 3. Test configuration
bun run db:config-test development
bun run db:config-test production
```

## Daily Operations

### Create Backups

```bash
# Complete backup (recommended)
bun run db:backup-enhanced complete

# Production backup with compression
bun run db:backup-enhanced complete --env production --compress

# Schema only (for structure changes)
bun run db:backup-enhanced schema --env production
```

### Restore Backups

```bash
# Safe restore with validation
bun run db:restore-enhanced backup.sql --validate --backup-first

# Restore to different database
bun run db:restore-enhanced backup.sql --database new-db --create-db

# Dry run (test without changes)
bun run db:restore-enhanced backup.sql --dry-run --validate
```

### CSV Export/Import

```bash
# Export all tables to CSV
bun run db:csv-export

# Export specific tables
bun run db:csv-export --tables "users,orders"

# Import from CSV directory
bun run db:csv-import ./csv-exports

# Import with table truncation
bun run db:csv-import ./csv-data --truncate
```

### Backup Management

```bash
# List all backups
bun run db:backup-manager list

# Get backup details
bun run db:backup-manager info backup-name

# Validate backup
bun run db:backup-manager validate backup-name

# Cleanup old backups (keep 5 newest)
bun run db:backup-manager cleanup --keep-count 5
```

## Environment-Specific Commands

### Development
```bash
bun run db:backup-enhanced complete --env development
bun run db:restore-enhanced backup.sql --env development
```

### Production
```bash
bun run db:backup-enhanced complete --env production --compress
bun run db:restore-enhanced backup.sql --env production --validate --backup-first
```

## Emergency Recovery

```bash
# 1. List available backups
bun run db:backup-manager list --env production

# 2. Validate backup
bun run db:backup-manager validate backup-name

# 3. Restore with safety checks
bun run db:restore-enhanced backup.sql --env production --validate --backup-first --drop-existing
```

## Common Options

### Backup Options
- `--env <environment>` - Target environment
- `--compress` - Compress with gzip
- `--output <dir>` - Output directory
- `--include <tables>` - Include specific tables
- `--exclude <tables>` - Exclude specific tables

### Restore Options
- `--env <environment>` - Target environment
- `--database <name>` - Override database name
- `--validate` - Validate before restore
- `--backup-first` - Create backup before restore
- `--dry-run` - Test without changes
- `--drop-existing` - Drop existing database

### CSV Options
- `--tables <tables>` - Specific tables only
- `--output <dir>` - Output directory (export)
- `--truncate` - Truncate before import
- `--delimiter <char>` - CSV delimiter
- `--no-headers` - No column headers

## File Locations

- **Backups**: `./database-backups/`
- **CSV Exports**: `./csv-exports/`
- **Configuration**: `./config/database.{env}.json`
- **Scripts**: `./scripts/`

## Configuration Priority

1. Environment Variables (highest)
2. Configuration Files
3. Default Values (lowest)

## Required Environment Variables

```bash
MARIADB_HOST=localhost
MARIADB_PORT=3306
MARIADB_USER=root
MARIADB_PASSWORD=your_password
MARIADB_DATABASE=your_database
NODE_ENV=development
```

## Troubleshooting

### Connection Issues
```bash
# Test configuration
bun run db:config-test development

# Check database status
docker ps | grep mariadb
```

### Backup Issues
```bash
# Validate backup
bun run db:backup-manager validate backup-name

# List backups
bun run db:backup-manager list
```

### Restore Issues
```bash
# Dry run first
bun run db:restore-enhanced backup.sql --dry-run

# Use validation
bun run db:restore-enhanced backup.sql --validate
```

## Automation Examples

### Daily Backup (Cron)
```bash
# Add to crontab
0 2 * * * cd /path/to/project && bun run db:backup-enhanced complete --env production --compress
```

### Weekly Cleanup (Cron)
```bash
# Keep 4 weeks of backups
0 3 * * 0 cd /path/to/project && bun run db:backup-manager cleanup --keep-days 28
```

### Pre-deployment Backup
```bash
#!/bin/bash
echo "Creating pre-deployment backup..."
bun run db:backup-enhanced complete --env production --compress
if [ $? -ne 0 ]; then
    echo "Backup failed - aborting deployment"
    exit 1
fi
```

---

💡 **Tip**: Always test backup and restore procedures in development first!

📖 **Full Documentation**: See `ENHANCED_DATABASE_BACKUP_GUIDE.md` for detailed information.
