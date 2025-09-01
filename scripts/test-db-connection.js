#!/usr/bin/env node

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('🔍 Testing database connection...');
console.log('Host:', process.env.MARIADB_HOST);
console.log('Port:', process.env.MARIADB_PORT);
console.log('User:', process.env.MARIADB_USER);
console.log('Database:', process.env.MARIADB_DATABASE);
console.log('');

const config = {
  host: process.env.MARIADB_HOST,
  port: parseInt(process.env.MARIADB_PORT || '3306'),
  user: process.env.MARIADB_USER,
  password: process.env.MARIADB_PASSWORD,
  database: process.env.MARIADB_DATABASE,
  connectTimeout: 10000, // 10 seconds
  acquireTimeout: 10000,
  timeout: 10000,
};

try {
  console.log('⏳ Attempting to connect...');
  const connection = await mysql.createConnection(config);
  
  console.log('✅ Connected successfully!');
  
  // Test a simple query
  const [rows] = await connection.execute('SELECT 1 as test');
  console.log('✅ Query test successful:', rows);
  
  await connection.end();
  console.log('✅ Connection closed properly');
  
} catch (error) {
  console.error('❌ Connection failed:');
  console.error('Error code:', error.code);
  console.error('Error message:', error.message);
  
  if (error.code === 'ETIMEDOUT') {
    console.log('');
    console.log('💡 Suggestions:');
    console.log('1. Check if the database server is running');
    console.log('2. Verify the host IP address is correct');
    console.log('3. Check if firewall allows connections on port', process.env.MARIADB_PORT);
    console.log('4. Try connecting from the same network as the database');
  } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
    console.log('');
    console.log('💡 Suggestions:');
    console.log('1. Check username and password');
    console.log('2. Verify user has permission to connect from this host');
  } else if (error.code === 'ER_BAD_DB_ERROR') {
    console.log('');
    console.log('💡 Suggestions:');
    console.log('1. Check if database name is correct');
    console.log('2. Verify the database exists');
  }
  
  process.exit(1);
}
