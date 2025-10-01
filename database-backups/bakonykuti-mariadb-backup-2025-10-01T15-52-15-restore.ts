#!/usr/bin/env bun
/**
 * Database Restore Script
 * Generated on 2025-10-01T15:52:15.310Z
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
    const sqlContent = await fs.readFile('bakonykuti-mariadb-backup-2025-10-01T15-52-15-complete.sql', 'utf-8');
    const connection = await mysql.createConnection({
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password,
    });
    
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`📊 Executing ${statements.length} SQL statements...`);
    
    for (const statement of statements) {
      if (statement.trim()) {
        await connection.execute(statement);
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
