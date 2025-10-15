#!/usr/bin/env bun
/**
 * Database Restore Script
 * Generated on 2025-10-15T17:44:05.398Z
 *
 * This script automatically adapts the backup to use the target environment's database name
 */

import mysql from 'mysql2/promise';
import { promises as fs } from 'fs';

async function restore() {
  console.log('🚀 Restoring database backup...');

  const config = {
    host: process.env.MARIADB_HOST || 'localhost',
    port: parseInt(process.env.MARIADB_PORT || '3306'),
    user: process.env.MARIADB_USER || 'root',
    password: process.env.MARIADB_PASSWORD || '',
    database: process.env.MARIADB_DATABASE || 'bakonykuti-mariadb',
  };

  if (!config.password) {
    console.error('❌ MARIADB_PASSWORD environment variable is required');
    process.exit(1);
  }

  try {
    const sqlContent = await fs.readFile('bakonykuti-mariadb-backup-2025-10-15T17-44-05-complete.sql', 'utf-8');

    // Adapt backup to target database name
    console.log('🔄 Adapting backup for target database...');
    let adaptedContent = sqlContent;

    adaptedContent = adaptedContent.replace(
      /DROP DATABASE IF EXISTS `[^`]+`;/g,
      `DROP DATABASE IF EXISTS \`${config.database}\`;`
    );

    adaptedContent = adaptedContent.replace(
      /CREATE DATABASE `[^`]+`;/g,
      `CREATE DATABASE \`${config.database}\`;`
    );

    adaptedContent = adaptedContent.replace(
      /USE `[^`]+`;/g,
      `USE \`${config.database}\`;`
    );

    console.log(`✅ Adapted backup to use database: ${config.database}`);

    const connection = await mysql.createConnection({
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password,
    });

    const statements = adaptedContent
      .split(';\n')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--') && !stmt.match(/^--.*/));

    console.log(`📊 Executing ${statements.length} SQL statements...`);

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement && statement.trim()) {
        try {
          await connection.execute(statement);
          if (i % 10 === 0) {
            console.log(`  Progress: ${i + 1}/${statements.length} statements`);
          }
        } catch (error) {
          console.warn(`  Warning on statement ${i + 1}: ${error?.message || error}`);
        }
      }
    }

    await connection.end();
    console.log('✅ Database restored successfully!');

  } catch (error) {
    console.error('❌ Restore failed:', error);
    process.exit(1);
  }
}

restore();
