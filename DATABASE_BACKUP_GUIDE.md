# 🗄️ Database Backup & Restore Guide

Complete guide for backing up and restoring your MariaDB database with schema, data, and configurations.

## 📋 Overview

This backup system provides three different approaches:

1. **Simple Utility** - Easy command-line tool for common operations
2. **Advanced Export** - Full-featured backup with compression and metadata
3. **Manual Import** - Flexible restore with various options

## 🚀 Quick Start

### Create a Backup

```bash
# Native backup (recommended - works on all platforms)
bun run scripts/database-backup-native.ts backup
# OR use npm script
bun run db:backup

# Advanced backup with all features (requires mysqldump)
bun run scripts/export-database.ts
```

### Restore a Backup

```bash
# Restore latest backup
bun run scripts/database-backup-native.ts restore latest
# OR use npm script
bun run db:restore latest

# Restore specific backup
bun run db:restore bakonykuti-mariadb-backup-2025-01-15T10-30-00

# Use generated restore script (recommended for production)
bun run database-backups/bakonykuti-mariadb-backup-2025-01-15T10-30-00-restore.ts
```

## 🛠️ Backup Utility Commands

### NPM Scripts (Recommended)

```bash
# Create backup
bun run db:backup

# List all backups
bun run db:backup-list

# Show backup information
bun run db:backup-info latest

# Restore backup
bun run db:restore latest
bun run db:restore backup-name
```

### Direct Script Commands

```bash
# Create backup
bun run scripts/database-backup-native.ts backup

# List all backups
bun run scripts/database-backup-native.ts list

# Show backup information
bun run scripts/database-backup-native.ts info latest
bun run scripts/database-backup-native.ts info backup-name

# Restore backup
bun run scripts/database-backup-native.ts restore latest
bun run scripts/database-backup-native.ts restore backup-name

# Show help
bun run scripts/database-backup-native.ts help
```

### Example Output

```
📋 Available backups:

→ bakonykuti-mariadb-backup-2025-01-15T14-30-00
   Created: 2025-01-15 14:30:00
   Size: 2.45 MB
   (latest)

  bakonykuti-mariadb-backup-2025-01-15T10-15-00
   Created: 2025-01-15 10:15:00
   Size: 2.41 MB
```

## 📦 Advanced Export Features

The advanced export script (`export-database.ts`) provides additional features:

### Features

- **Schema-only export** - Structure without data
- **Data-only export** - Data without structure  
- **Complete export** - Schema + data combined
- **Compression** - Automatic tar.gz compression
- **Environment config** - Generated .env template
- **Restore scripts** - Auto-generated bash scripts
- **Metadata** - JSON info files with backup details

### Usage

```bash
# Full export with all features
bun run scripts/export-database.ts

# Generated files:
# - bakonykuti-mariadb-backup-2025-01-15T14-30-00-schema.sql
# - bakonykuti-mariadb-backup-2025-01-15T14-30-00-data.sql  
# - bakonykuti-mariadb-backup-2025-01-15T14-30-00-complete.sql
# - bakonykuti-mariadb-backup-2025-01-15T14-30-00-env.example
# - bakonykuti-mariadb-backup-2025-01-15T14-30-00-restore.sh
# - bakonykuti-mariadb-backup-2025-01-15T14-30-00-info.json
# - bakonykuti-mariadb-backup-2025-01-15T14-30-00.tar.gz
```

## 🔄 Import/Restore Options

### Manual Import Script

```bash
# Basic import
bun run scripts/import-database.ts ./database-backups

# Import specific backup
bun run scripts/import-database.ts ./database-backups backup-prefix

# Drop existing database first
bun run scripts/import-database.ts ./database-backups --drop-existing

# Show usage
bun run scripts/import-database.ts
```

### Generated Restore Scripts

Each backup creates a standalone restore script:

```bash
# Make executable (Linux/Mac)
chmod +x bakonykuti-mariadb-backup-2025-01-15T14-30-00-restore.sh

# Run restore
./bakonykuti-mariadb-backup-2025-01-15T14-30-00-restore.sh
```

## ⚙️ Configuration

### Environment Variables

Set these in your `.env` file:

```env
# Database Configuration
MARIADB_HOST=localhost
MARIADB_PORT=3306
MARIADB_USER=root
MARIADB_PASSWORD=your-password
MARIADB_DATABASE=bakonykuti-mariadb

# Optional: Skip validation during restore
SKIP_ENV_VALIDATION=1
```

### Backup Directory Structure

```
database-backups/
├── bakonykuti-mariadb-backup-2025-01-15T14-30-00-complete.sql
├── bakonykuti-mariadb-backup-2025-01-15T14-30-00-restore.sh
├── bakonykuti-mariadb-backup-2025-01-15T14-30-00-info.json
├── bakonykuti-mariadb-backup-2025-01-15T10-15-00-complete.sql
└── ...
```

## 🚀 Production Deployment

### 1. Create Backup on Source Server

```bash
# On your development/current server
bun run scripts/database-backup-utility.ts backup
```

### 2. Transfer to Target Server

```bash
# Copy backup files to target server
scp database-backups/bakonykuti-mariadb-backup-* user@target-server:/path/to/project/database-backups/
```

### 3. Restore on Target Server

```bash
# On target server
cd /path/to/project

# Option 1: Use restore script (recommended)
bash database-backups/bakonykuti-mariadb-backup-2025-01-15T14-30-00-restore.sh

# Option 2: Use import script
bun run scripts/import-database.ts ./database-backups latest
```

### 4. Verify Restoration

```bash
# Check tables and data
bun run scripts/diagnose-production-issue.ts
```

## 🔧 Troubleshooting

### Common Issues

**1. "mysqldump: command not found"**
```bash
# Install MySQL client tools
# Ubuntu/Debian:
sudo apt-get install mysql-client

# CentOS/RHEL:
sudo yum install mysql

# macOS:
brew install mysql-client
```

**2. "Access denied for user"**
```bash
# Check credentials in .env file
# Ensure MARIADB_PASSWORD is set correctly
```

**3. "Database doesn't exist"**
```bash
# The restore scripts automatically create the database
# Or manually create it:
mysql -u root -p -e "CREATE DATABASE \`bakonykuti-mariadb\`;"
```

**4. "Table already exists" during restore**
```bash
# Use --drop-existing flag to replace existing data
bun run scripts/import-database.ts ./database-backups --drop-existing
```

### Verification Commands

```bash
# Test database connection
mysql -h localhost -u root -p bakonykuti-mariadb -e "SELECT COUNT(*) FROM \`bakonykuti-t3_user\`;"

# Check all tables
mysql -h localhost -u root -p bakonykuti-mariadb -e "SHOW TABLES;"

# Verify file records
mysql -h localhost -u root -p bakonykuti-mariadb -e "SELECT COUNT(*) FROM \`bakonykuti-t3_file\`;"
```

## 📅 Automated Backups

### Cron Job Example

```bash
# Add to crontab for daily backups at 2 AM
0 2 * * * cd /path/to/project && bun run scripts/database-backup-utility.ts backup

# Weekly cleanup (keep last 7 backups)
0 3 * * 0 cd /path/to/project && find database-backups/ -name "*.sql" -mtime +7 -delete
```

### Backup Rotation Script

```bash
#!/bin/bash
# Keep only the last 10 backups
cd /path/to/project/database-backups
ls -t *-complete.sql | tail -n +11 | xargs -r rm
```

## 🔒 Security Considerations

1. **Password Security**: Never commit `.env` files with passwords
2. **Backup Storage**: Store backups in secure locations
3. **File Permissions**: Restrict access to backup files
4. **Network Security**: Use secure connections for transfers
5. **Encryption**: Consider encrypting sensitive backups

## 📊 Backup File Sizes

Typical backup sizes for reference:

- **Schema only**: ~50-100 KB
- **Small dataset** (< 1000 records): ~1-5 MB  
- **Medium dataset** (1000-10000 records): ~5-50 MB
- **Large dataset** (> 10000 records): ~50+ MB

## 🎯 Best Practices

1. **Regular Backups**: Schedule daily automated backups
2. **Test Restores**: Regularly test backup restoration
3. **Multiple Locations**: Store backups in multiple locations
4. **Version Control**: Keep backup scripts in version control
5. **Documentation**: Document your backup procedures
6. **Monitoring**: Monitor backup success/failure
7. **Retention Policy**: Define how long to keep backups

## 🆘 Emergency Recovery

If you need to quickly restore from a backup:

```bash
# 1. Stop your application
# 2. Quick restore (replaces all data)
bash database-backups/latest-backup-restore.sh

# 3. Restart your application
bun start
```

## 🆕 **Database Name Adaptation Feature**

### **Automatic Database Name Adaptation**

The backup system now automatically adapts to different database names between environments:

- **Development**: `bakonykuti-mariadb`
- **Production**: `bakonykuti_DB1`
- **Staging**: `any-database-name`

### **How It Works**

1. **During Backup**: Creates backup with original database name
2. **During Restore**: Automatically replaces database names in SQL with target environment's name
3. **Environment Aware**: Uses `MARIADB_DATABASE` environment variable from target system

### **Example**

```bash
# Development backup contains:
# CREATE DATABASE `bakonykuti-mariadb`;
# USE `bakonykuti-mariadb`;

# Production restore automatically converts to:
# CREATE DATABASE `bakonykuti_DB1`;
# USE `bakonykuti_DB1`;
```

### **Benefits**

✅ **No Manual Editing** - No need to modify backup files
✅ **Environment Agnostic** - Same backup works everywhere
✅ **Automatic Adaptation** - Uses target environment's database name
✅ **Error Prevention** - Eliminates "No database selected" errors

This backup system ensures your data is safe and can be easily restored on any server or environment!
