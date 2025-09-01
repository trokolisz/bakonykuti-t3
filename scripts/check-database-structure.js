#!/usr/bin/env node

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('🔍 Checking database structure...');
console.log('Database:', process.env.MARIADB_DATABASE);
console.log('Host:', process.env.MARIADB_HOST);
console.log('User:', process.env.MARIADB_USER);
console.log('');

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
  
  // List all tables
  const [tables] = await connection.execute('SHOW TABLES');
  console.log(`📊 Found ${tables.length} tables:`);
  
  tables.forEach((table, index) => {
    const tableName = Object.values(table)[0];
    console.log(`${index + 1}. ${tableName}`);
  });
  
  // Check if we have an images table (or similar)
  const imagesTables = tables.filter(table => {
    const tableName = Object.values(table)[0].toLowerCase();
    return tableName.includes('image') || tableName.includes('gallery') || tableName.includes('photo');
  });
  
  if (imagesTables.length > 0) {
    console.log('\n🖼️  Found image-related tables:');
    for (const table of imagesTables) {
      const tableName = Object.values(table)[0];
      console.log(`\n📋 Table: ${tableName}`);
      
      // Show table structure (escape table name with backticks)
      const [columns] = await connection.execute(`DESCRIBE \`${tableName}\``);
      console.log('   Columns:');
      columns.forEach(col => {
        console.log(`   - ${col.Field} (${col.Type})`);
      });

      // Count records
      const [count] = await connection.execute(`SELECT COUNT(*) as count FROM \`${tableName}\``);
      console.log(`   Records: ${count[0].count}`);

      // Show sample data if exists
      if (count[0].count > 0) {
        const [sample] = await connection.execute(`SELECT * FROM \`${tableName}\` LIMIT 3`);
        console.log('   Sample data:');
        sample.forEach((row, idx) => {
          console.log(`   ${idx + 1}.`, JSON.stringify(row, null, 2).substring(0, 200) + '...');
        });
      }
    }
  } else {
    console.log('\n❌ No image-related tables found');
    console.log('💡 Available tables:', tables.map(t => Object.values(t)[0]).join(', '));
  }
  
  await connection.end();
  
} catch (error) {
  console.error('❌ Database error:', error.message);
  if (error.code === 'ER_BAD_DB_ERROR') {
    console.log(`💡 Database '${process.env.MARIADB_DATABASE}' does not exist`);
  } else if (error.code === 'ECONNREFUSED') {
    console.log('💡 Cannot connect to database server');
  }
}
