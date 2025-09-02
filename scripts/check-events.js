#!/usr/bin/env node

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('🔍 Checking events...');

const config = {
  host: process.env.MARIADB_HOST,
  port: parseInt(process.env.MARIADB_PORT || '3306'),
  user: process.env.MARIADB_USER,
  password: process.env.MARIADB_PASSWORD,
  database: process.env.MARIADB_DATABASE,
};

try {
  const connection = await mysql.createConnection(config);
  console.log('✅ Connected to database');
  
  // Check events
  const [events] = await connection.execute('SELECT * FROM `bakonykuti-t3_event` LIMIT 5');
  console.log(`📅 Found ${events.length} events (showing first 5):`);
  
  events.forEach((item, index) => {
    console.log(`${index + 1}. ID: ${item.id} - ${item.title}`);
    console.log(`   Date: ${item.date}`);
    console.log(`   Type: ${item.type}`);
    console.log(`   Content: ${item.content?.substring(0, 100)}...`);
    console.log('');
  });
  
  await connection.end();
  
} catch (error) {
  console.error('❌ Database error:', error.message);
}
