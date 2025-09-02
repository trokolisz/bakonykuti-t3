#!/usr/bin/env node

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('🔍 Checking news items...');

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
  
  // Check news
  const [news] = await connection.execute('SELECT * FROM `bakonykuti-t3_news` LIMIT 5');
  console.log(`📰 Found ${news.length} news items (showing first 5):`);
  
  news.forEach((item, index) => {
    console.log(`${index + 1}. ID: ${item.id} - ${item.title}`);
    console.log(`   Created: ${item.created_at}`);
    console.log(`   Content: ${item.content?.substring(0, 100)}...`);
    console.log('');
  });
  
  await connection.end();
  
} catch (error) {
  console.error('❌ Database error:', error.message);
}
