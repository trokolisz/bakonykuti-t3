#!/usr/bin/env bun
/**
 * Simple Database Connection Test
 */

import mysql from 'mysql2/promise';

async function testConnection() {
  console.log('🔍 Testing database connection...');
  
  // Show environment variables
  console.log('Environment variables:');
  console.log('MARIADB_HOST:', process.env.MARIADB_HOST);
  console.log('MARIADB_PORT:', process.env.MARIADB_PORT);
  console.log('MARIADB_USER:', process.env.MARIADB_USER);
  console.log('MARIADB_PASSWORD:', process.env.MARIADB_PASSWORD ? '***' : 'NOT SET');
  console.log('MARIADB_DATABASE:', process.env.MARIADB_DATABASE);

  try {
    // First, try to connect without database
    console.log('\n🔌 Connecting to MySQL/MariaDB server...');
    const connection = await mysql.createConnection({
      host: process.env.MARIADB_HOST || 'localhost',
      port: parseInt(process.env.MARIADB_PORT || '3306'),
      user: process.env.MARIADB_USER || 'root',
      password: process.env.MARIADB_PASSWORD || 'bakonykuti_root_password',
    });

    console.log('✅ Connected to MySQL/MariaDB server');

    // List existing databases
    const [databases] = await connection.execute('SHOW DATABASES');
    console.log('\n📋 Available databases:');
    console.table(databases);

    await connection.end();
    console.log('\n✅ Connection test successful');

  } catch (error) {
    console.error('❌ Connection failed:', error);
  }
}

testConnection();
