#!/usr/bin/env bun
/**
 * Add Files Table Only
 * Creates just the missing files table without affecting existing tables
 */

import mysql from 'mysql2/promise';

async function addFilesTable() {
  console.log('🚀 Adding files table to existing database...');

  try {
    // Connect to the existing database
    const connection = await mysql.createConnection({
      host: process.env.MARIADB_HOST || 'localhost',
      port: parseInt(process.env.MARIADB_PORT || '3306'),
      user: process.env.MARIADB_USER || 'root',
      password: process.env.MARIADB_PASSWORD || 'bakonykuti_root_password',
      database: process.env.MARIADB_DATABASE || 'bakonykuti-mariadb',
    });

    console.log('✅ Connected to database');

    // Check if files table already exists
    const [existingTables] = await connection.execute(`
      SELECT TABLE_NAME 
      FROM information_schema.TABLES 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'bakonykuti-t3_file'
    `, [process.env.MARIADB_DATABASE || 'bakonykuti-mariadb']);

    if (Array.isArray(existingTables) && existingTables.length > 0) {
      console.log('ℹ️  Files table already exists');
      
      // Show current structure
      const [columns] = await connection.execute(`DESCRIBE \`bakonykuti-t3_file\``);
      console.log('📊 Current files table structure:');
      console.table(columns);
      
    } else {
      console.log('📦 Creating files table...');
      
      // Create the files table
      await connection.execute(`
        CREATE TABLE \`bakonykuti-t3_file\` (
          \`id\` int AUTO_INCREMENT NOT NULL,
          \`original_name\` varchar(255) NOT NULL,
          \`filename\` varchar(255) NOT NULL,
          \`file_path\` varchar(500) NOT NULL,
          \`public_url\` varchar(500) NOT NULL,
          \`mime_type\` varchar(100) NOT NULL,
          \`file_size\` int NOT NULL,
          \`upload_type\` varchar(50) NOT NULL,
          \`uploaded_by\` varchar(255),
          \`associated_entity\` varchar(100),
          \`associated_entity_id\` int,
          \`is_orphaned\` boolean NOT NULL DEFAULT false,
          \`last_accessed_at\` timestamp,
          \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
          \`updated_at\` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          CONSTRAINT \`bakonykuti-t3_file_id\` PRIMARY KEY(\`id\`)
        );
      `);
      
      console.log('✅ Files table created successfully');
    }

    // Show all tables in the database
    const [allTables] = await connection.execute(`
      SELECT TABLE_NAME, TABLE_ROWS 
      FROM information_schema.TABLES 
      WHERE TABLE_SCHEMA = ?
      ORDER BY TABLE_NAME
    `, [process.env.MARIADB_DATABASE || 'bakonykuti-mariadb']);

    console.log('\n📋 All tables in database:');
    console.table(allTables);

    await connection.end();
    console.log('\n🎉 Files table setup completed!');
    console.log('\n🚀 You can now restart your application and file uploads should work.');

  } catch (error) {
    console.error('❌ Error adding files table:', error);
    process.exit(1);
  }
}

// Run the setup
addFilesTable();
