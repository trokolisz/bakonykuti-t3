#!/usr/bin/env bun
/**
 * Database Configuration System
 * Supports multiple environments with different credentials and database names
 */

import { promises as fs } from 'fs';
import path from 'path';

export interface DatabaseConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  environment: string;
}

export interface EnvironmentConfig {
  [key: string]: Omit<DatabaseConfig, 'environment'>;
}

/**
 * Load database configuration for a specific environment
 */
export async function loadDatabaseConfig(environment?: string): Promise<DatabaseConfig> {
  const env = environment || process.env.NODE_ENV || 'development';
  
  // Try to load from environment-specific config file first
  const configPath = path.join(process.cwd(), 'config', `database.${env}.json`);
  let config: Partial<DatabaseConfig> = {};
  
  try {
    const configFile = await fs.readFile(configPath, 'utf-8');
    config = JSON.parse(configFile);
    console.log(`📋 Loaded database config from: ${configPath}`);
  } catch (error) {
    console.log(`ℹ️  No config file found at ${configPath}, using environment variables`);
  }
  
  // Merge with environment variables (environment variables take precedence)
  const finalConfig: DatabaseConfig = {
    host: process.env.MARIADB_HOST || config.host || 'localhost',
    port: parseInt(process.env.MARIADB_PORT || config.port?.toString() || '3306'),
    user: process.env.MARIADB_USER || config.user || 'root',
    password: process.env.MARIADB_PASSWORD || config.password || '',
    database: process.env.MARIADB_DATABASE || config.database || 'bakonykuti-mariadb',
    environment: env,
  };
  
  // Validate required fields
  if (!finalConfig.password) {
    throw new Error(`❌ Database password is required for environment: ${env}`);
  }
  
  return finalConfig;
}

/**
 * Create example configuration files for different environments
 */
export async function createExampleConfigs(): Promise<void> {
  const configDir = path.join(process.cwd(), 'config');
  
  // Ensure config directory exists
  try {
    await fs.mkdir(configDir, { recursive: true });
  } catch (error) {
    // Directory might already exist
  }
  
  const environments = {
    development: {
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: 'your_dev_password',
      database: 'bakonykuti-mariadb-dev',
    },
    staging: {
      host: 'staging-db.example.com',
      port: 3306,
      user: 'staging_user',
      password: 'your_staging_password',
      database: 'bakonykuti-mariadb-staging',
    },
    production: {
      host: 'prod-db.example.com',
      port: 3306,
      user: 'prod_user',
      password: 'your_production_password',
      database: 'bakonykuti-mariadb-prod',
    },
  };
  
  for (const [env, config] of Object.entries(environments)) {
    const configPath = path.join(configDir, `database.${env}.json.example`);
    await fs.writeFile(configPath, JSON.stringify(config, null, 2));
    console.log(`📝 Created example config: ${configPath}`);
  }
  
  // Create a README for the config directory
  const readmePath = path.join(configDir, 'README.md');
  const readmeContent = `# Database Configuration

This directory contains environment-specific database configurations.

## Usage

1. Copy the example files and remove the \`.example\` extension:
   \`\`\`bash
   cp database.development.json.example database.development.json
   cp database.staging.json.example database.staging.json
   cp database.production.json.example database.production.json
   \`\`\`

2. Update the configuration files with your actual database credentials.

3. The backup and restore scripts will automatically use these configurations based on the \`NODE_ENV\` environment variable or the \`--env\` parameter.

## Environment Variables

Environment variables always take precedence over config files:
- \`MARIADB_HOST\`
- \`MARIADB_PORT\`
- \`MARIADB_USER\`
- \`MARIADB_PASSWORD\`
- \`MARIADB_DATABASE\`

## Security

⚠️ **Important**: Never commit actual database passwords to version control!
- Add \`config/database.*.json\` to your \`.gitignore\` file
- Use environment variables in production
- Keep example files for reference only
`;
  
  await fs.writeFile(readmePath, readmeContent);
  console.log(`📖 Created config README: ${readmePath}`);
}

/**
 * Validate database connection
 */
export async function validateDatabaseConnection(config: DatabaseConfig): Promise<boolean> {
  try {
    const mysql = await import('mysql2/promise');
    const connection = await mysql.createConnection({
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password,
    });
    
    await connection.execute('SELECT 1');
    await connection.end();
    
    console.log(`✅ Database connection validated for ${config.environment} environment`);
    return true;
  } catch (error) {
    console.error(`❌ Database connection failed for ${config.environment} environment:`, error);
    return false;
  }
}

/**
 * Get backup filename prefix for the environment
 */
export function getBackupPrefix(config: DatabaseConfig, timestamp?: string): string {
  const ts = timestamp || new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  return `${config.database}-${config.environment}-backup-${ts}`;
}

// CLI interface
if (import.meta.main) {
  const command = process.argv[2];

  switch (command) {
    case 'create-examples':
      await createExampleConfigs();
      break;

    case 'test':
      const env = process.argv[3] || 'development';
      try {
        const config = await loadDatabaseConfig(env);
        console.log(`🔧 Configuration for ${env}:`, {
          ...config,
          password: '***hidden***'
        });
        await validateDatabaseConnection(config);
      } catch (error) {
        console.error('❌ Configuration test failed:', error);
        process.exit(1);
      }
      break;

    default:
      console.log('Database Configuration Utility');
      console.log('');
      console.log('Commands:');
      console.log('  create-examples  Create example configuration files');
      console.log('  test [env]       Test configuration for environment');
      console.log('');
      console.log('Examples:');
      console.log('  bun scripts/database-config.ts create-examples');
      console.log('  bun scripts/database-config.ts test development');
      console.log('  bun scripts/database-config.ts test production');
  }
}
