#!/usr/bin/env bun
/**
 * Complete Database Export Script
 * Exports the entire MariaDB database including schema and data
 */

import { spawn } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';

interface ExportOptions {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  outputDir: string;
  includeData: boolean;
  compress: boolean;
}

async function exportDatabase() {
  console.log('🚀 Starting complete database export...\n');

  // Check if mysqldump is available
  const hasMyqlDump = await checkMysqldumpAvailable();
  if (!hasMyqlDump) {
    console.log('⚠️  mysqldump not found. Using native backup instead...\n');
    await runNativeBackup();
    return;
  }

  // Get configuration from environment
  const options: ExportOptions = {
    host: process.env.MARIADB_HOST || 'localhost',
    port: parseInt(process.env.MARIADB_PORT || '3306'),
    user: process.env.MARIADB_USER || 'root',
    password: process.env.MARIADB_PASSWORD || 'bakonykuti_root_password',
    database: process.env.MARIADB_DATABASE || 'bakonykuti-mariadb',
    outputDir: './database-backups',
    includeData: true,
    compress: true,
  };

  console.log('📋 Export Configuration:');
  console.log(`Host: ${options.host}:${options.port}`);
  console.log(`Database: ${options.database}`);
  console.log(`User: ${options.user}`);
  console.log(`Output Directory: ${options.outputDir}`);
  console.log(`Include Data: ${options.includeData}`);
  console.log(`Compress: ${options.compress}\n`);

  try {
    // Create output directory
    await fs.mkdir(options.outputDir, { recursive: true });
    console.log('✅ Created output directory');

    // Generate timestamp for backup files
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const backupPrefix = `${options.database}-backup-${timestamp}`;

    // Export schema only
    console.log('📦 Exporting database schema...');
    const schemaFile = path.join(options.outputDir, `${backupPrefix}-schema.sql`);
    await exportSchema(options, schemaFile);
    console.log(`✅ Schema exported to: ${schemaFile}`);

    // Export data only
    if (options.includeData) {
      console.log('📊 Exporting database data...');
      const dataFile = path.join(options.outputDir, `${backupPrefix}-data.sql`);
      await exportData(options, dataFile);
      console.log(`✅ Data exported to: ${dataFile}`);
    }

    // Export complete database (schema + data)
    console.log('🔄 Exporting complete database...');
    const completeFile = path.join(options.outputDir, `${backupPrefix}-complete.sql`);
    await exportComplete(options, completeFile);
    console.log(`✅ Complete database exported to: ${completeFile}`);

    // Create environment configuration
    console.log('⚙️  Creating environment configuration...');
    const envFile = path.join(options.outputDir, `${backupPrefix}-env.example`);
    await createEnvConfig(options, envFile);
    console.log(`✅ Environment config created: ${envFile}`);

    // Create restore script
    console.log('📝 Creating restore script...');
    const restoreScript = path.join(options.outputDir, `${backupPrefix}-restore.sh`);
    await createRestoreScript(options, restoreScript, backupPrefix);
    console.log(`✅ Restore script created: ${restoreScript}`);

    // Create backup info file
    const infoFile = path.join(options.outputDir, `${backupPrefix}-info.json`);
    await createBackupInfo(options, infoFile, backupPrefix);
    console.log(`✅ Backup info created: ${infoFile}`);

    // Compress if requested
    if (options.compress) {
      console.log('🗜️  Compressing backup files...');
      const archiveFile = path.join(options.outputDir, `${backupPrefix}.tar.gz`);
      await compressBackup(options.outputDir, backupPrefix, archiveFile);
      console.log(`✅ Backup compressed to: ${archiveFile}`);
    }

    console.log('\n🎉 Database export completed successfully!');
    console.log('\n📋 Generated Files:');
    console.log(`- Schema: ${backupPrefix}-schema.sql`);
    if (options.includeData) {
      console.log(`- Data: ${backupPrefix}-data.sql`);
    }
    console.log(`- Complete: ${backupPrefix}-complete.sql`);
    console.log(`- Environment: ${backupPrefix}-env.example`);
    console.log(`- Restore Script: ${backupPrefix}-restore.sh`);
    console.log(`- Info: ${backupPrefix}-info.json`);
    if (options.compress) {
      console.log(`- Archive: ${backupPrefix}.tar.gz`);
    }

    console.log('\n🚀 To restore this backup on another server:');
    console.log(`1. Copy the backup files to the target server`);
    console.log(`2. Configure environment variables using ${backupPrefix}-env.example`);
    console.log(`3. Run: bash ${backupPrefix}-restore.sh`);

  } catch (error) {
    console.error('❌ Export failed:', error);
    process.exit(1);
  }
}

async function exportSchema(options: ExportOptions, outputFile: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const args = [
      `--host=${options.host}`,
      `--port=${options.port}`,
      `--user=${options.user}`,
      `--password=${options.password}`,
      '--no-data',
      '--routines',
      '--triggers',
      '--single-transaction',
      '--lock-tables=false',
      '--add-drop-table',
      '--add-drop-database',
      '--create-options',
      options.database
    ];

    const mysqldump = spawn('mysqldump', args);
    const writeStream = require('fs').createWriteStream(outputFile);

    mysqldump.stdout.pipe(writeStream);
    
    mysqldump.stderr.on('data', (data) => {
      console.error('mysqldump stderr:', data.toString());
    });

    mysqldump.on('close', (code) => {
      writeStream.end();
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`mysqldump exited with code ${code}`));
      }
    });
  });
}

async function exportData(options: ExportOptions, outputFile: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const args = [
      `--host=${options.host}`,
      `--port=${options.port}`,
      `--user=${options.user}`,
      `--password=${options.password}`,
      '--no-create-info',
      '--single-transaction',
      '--lock-tables=false',
      '--complete-insert',
      '--extended-insert',
      options.database
    ];

    const mysqldump = spawn('mysqldump', args);
    const writeStream = require('fs').createWriteStream(outputFile);

    mysqldump.stdout.pipe(writeStream);
    
    mysqldump.stderr.on('data', (data) => {
      console.error('mysqldump stderr:', data.toString());
    });

    mysqldump.on('close', (code) => {
      writeStream.end();
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`mysqldump exited with code ${code}`));
      }
    });
  });
}

async function exportComplete(options: ExportOptions, outputFile: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const args = [
      `--host=${options.host}`,
      `--port=${options.port}`,
      `--user=${options.user}`,
      `--password=${options.password}`,
      '--routines',
      '--triggers',
      '--single-transaction',
      '--lock-tables=false',
      '--add-drop-table',
      '--add-drop-database',
      '--create-options',
      '--complete-insert',
      '--extended-insert',
      options.database
    ];

    const mysqldump = spawn('mysqldump', args);
    const writeStream = require('fs').createWriteStream(outputFile);

    mysqldump.stdout.pipe(writeStream);
    
    mysqldump.stderr.on('data', (data) => {
      console.error('mysqldump stderr:', data.toString());
    });

    mysqldump.on('close', (code) => {
      writeStream.end();
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`mysqldump exited with code ${code}`));
      }
    });
  });
}

async function createEnvConfig(options: ExportOptions, outputFile: string): Promise<void> {
  const envContent = `# Database Configuration for Backup Restore
# Copy this to .env and update the values as needed

MARIADB_HOST=${options.host}
MARIADB_PORT=${options.port}
MARIADB_USER=${options.user}
MARIADB_PASSWORD=${options.password}
MARIADB_DATABASE=${options.database}

# NextAuth Configuration
AUTH_SECRET="your-auth-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# Optional: Skip environment validation during restore
SKIP_ENV_VALIDATION=1
`;

  await fs.writeFile(outputFile, envContent);
}

async function createRestoreScript(options: ExportOptions, outputFile: string, backupPrefix: string): Promise<void> {
  const scriptContent = `#!/bin/bash
# Database Restore Script
# Generated on ${new Date().toISOString()}

set -e

echo "🚀 Starting database restore..."

# Check if mysql client is available
if ! command -v mysql &> /dev/null; then
    echo "❌ mysql client is not installed or not in PATH"
    exit 1
fi

# Load environment variables if .env file exists
if [ -f .env ]; then
    echo "📋 Loading environment variables from .env"
    export $(cat .env | grep -v '^#' | xargs)
fi

# Set default values
MARIADB_HOST=\${MARIADB_HOST:-localhost}
MARIADB_PORT=\${MARIADB_PORT:-3306}
MARIADB_USER=\${MARIADB_USER:-root}
MARIADB_DATABASE=\${MARIADB_DATABASE:-${options.database}}

# Prompt for password if not set
if [ -z "\$MARIADB_PASSWORD" ]; then
    echo -n "Enter MariaDB password for user \$MARIADB_USER: "
    read -s MARIADB_PASSWORD
    echo
fi

echo "📋 Restore Configuration:"
echo "Host: \$MARIADB_HOST:\$MARIADB_PORT"
echo "Database: \$MARIADB_DATABASE"
echo "User: \$MARIADB_USER"
echo

# Test connection
echo "🔌 Testing database connection..."
mysql -h"\$MARIADB_HOST" -P"\$MARIADB_PORT" -u"\$MARIADB_USER" -p"\$MARIADB_PASSWORD" -e "SELECT 1;" > /dev/null 2>&1
if [ \$? -ne 0 ]; then
    echo "❌ Failed to connect to database"
    exit 1
fi
echo "✅ Database connection successful"

# Create database if it doesn't exist
echo "📦 Creating database if it doesn't exist..."
mysql -h"\$MARIADB_HOST" -P"\$MARIADB_PORT" -u"\$MARIADB_USER" -p"\$MARIADB_PASSWORD" -e "CREATE DATABASE IF NOT EXISTS \\\`\$MARIADB_DATABASE\\\`;"
echo "✅ Database ready"

# Restore complete database
echo "🔄 Restoring complete database..."
mysql -h"\$MARIADB_HOST" -P"\$MARIADB_PORT" -u"\$MARIADB_USER" -p"\$MARIADB_PASSWORD" "\$MARIADB_DATABASE" < "${backupPrefix}-complete.sql"
echo "✅ Database restored successfully"

echo "🎉 Database restore completed!"
echo
echo "📋 Next steps:"
echo "1. Update your .env file with the correct database credentials"
echo "2. Start your application"
echo "3. Verify that all data has been restored correctly"
`;

  await fs.writeFile(outputFile, scriptContent);
  
  // Make script executable (Unix-like systems)
  try {
    await fs.chmod(outputFile, 0o755);
  } catch (error) {
    // Ignore chmod errors on Windows
  }
}

async function createBackupInfo(options: ExportOptions, outputFile: string, backupPrefix: string): Promise<void> {
  const backupInfo = {
    timestamp: new Date().toISOString(),
    database: options.database,
    host: options.host,
    port: options.port,
    user: options.user,
    includeData: options.includeData,
    compressed: options.compress,
    files: {
      schema: `${backupPrefix}-schema.sql`,
      data: options.includeData ? `${backupPrefix}-data.sql` : null,
      complete: `${backupPrefix}-complete.sql`,
      environment: `${backupPrefix}-env.example`,
      restoreScript: `${backupPrefix}-restore.sh`,
      archive: options.compress ? `${backupPrefix}.tar.gz` : null,
    },
    instructions: {
      restore: [
        "1. Copy backup files to target server",
        "2. Configure environment using the .env.example file",
        "3. Run the restore script: bash " + backupPrefix + "-restore.sh",
        "4. Start your application and verify data"
      ]
    }
  };

  await fs.writeFile(outputFile, JSON.stringify(backupInfo, null, 2));
}

async function compressBackup(outputDir: string, backupPrefix: string, archiveFile: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const tar = spawn('tar', [
      '-czf',
      archiveFile,
      '-C',
      outputDir,
      `${backupPrefix}-schema.sql`,
      `${backupPrefix}-data.sql`,
      `${backupPrefix}-complete.sql`,
      `${backupPrefix}-env.example`,
      `${backupPrefix}-restore.sh`,
      `${backupPrefix}-info.json`
    ]);

    tar.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`tar exited with code ${code}`));
      }
    });

    tar.stderr.on('data', (data) => {
      console.error('tar stderr:', data.toString());
    });
  });
}

async function checkMysqldumpAvailable(): Promise<boolean> {
  return new Promise((resolve) => {
    const mysqldump = spawn('mysqldump', ['--version']);

    mysqldump.on('close', (code) => {
      resolve(code === 0);
    });

    mysqldump.on('error', () => {
      resolve(false);
    });
  });
}

async function runNativeBackup(): Promise<void> {
  try {
    // Import and run the native backup
    const { spawn } = await import('child_process');

    return new Promise((resolve, reject) => {
      const nativeBackup = spawn('bun', ['run', 'scripts/database-backup-native.ts', 'backup'], {
        stdio: 'inherit'
      });

      nativeBackup.on('close', (code) => {
        if (code === 0) {
          console.log('\n✅ Native backup completed successfully!');
          console.log('📋 The native backup provides the same functionality as the advanced export.');
          resolve();
        } else {
          reject(new Error(`Native backup failed with code ${code}`));
        }
      });

      nativeBackup.on('error', (error) => {
        reject(error);
      });
    });
  } catch (error) {
    console.error('❌ Failed to run native backup:', error);
    throw error;
  }
}

// Run the export
exportDatabase();
