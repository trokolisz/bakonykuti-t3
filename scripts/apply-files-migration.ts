#!/usr/bin/env bun
/**
 * Apply Files Table Migration
 * Manually applies the files table migration without affecting existing tables
 */

import mysql from 'mysql2/promise';

async function applyFilesMigration() {
  console.log('🚀 Applying files table migration...');

  try {
    // Connect to the database
    const connection = await mysql.createConnection({
      host: process.env.MARIADB_HOST || 'localhost',
      port: parseInt(process.env.MARIADB_PORT || '3306'),
      user: process.env.MARIADB_USER || 'root',
      password: process.env.MARIADB_PASSWORD || 'bakonykuti_root_password',
      database: process.env.MARIADB_DATABASE || 'bakonykuti-mariadb',
    });

    console.log('✅ Connected to database');

    // Check if __drizzle_migrations table exists
    const [migrationTables] = await connection.execute(`
      SELECT TABLE_NAME 
      FROM information_schema.TABLES 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = '__drizzle_migrations'
    `, [process.env.MARIADB_DATABASE || 'bakonykuti-mariadb']);

    if (!Array.isArray(migrationTables) || migrationTables.length === 0) {
      console.log('📦 Creating __drizzle_migrations table...');
      await connection.execute(`
        CREATE TABLE \`__drizzle_migrations\` (
          \`id\` SERIAL PRIMARY KEY,
          \`hash\` text NOT NULL,
          \`created_at\` bigint
        );
      `);
      console.log('✅ Migration tracking table created');
    }

    // Check if the first migration is recorded
    const [firstMigration] = await connection.execute(`
      SELECT * FROM \`__drizzle_migrations\` WHERE \`hash\` = ?
    `, ['0000_clear_slipstream']);

    if (!Array.isArray(firstMigration) || firstMigration.length === 0) {
      console.log('📝 Recording first migration as completed...');
      await connection.execute(`
        INSERT INTO \`__drizzle_migrations\` (\`hash\`, \`created_at\`) 
        VALUES (?, ?)
      `, ['0000_clear_slipstream', Date.now()]);
      console.log('✅ First migration recorded');
    }

    // Check if files table already exists
    const [filesTables] = await connection.execute(`
      SELECT TABLE_NAME 
      FROM information_schema.TABLES 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'bakonykuti-t3_file'
    `, [process.env.MARIADB_DATABASE || 'bakonykuti-mariadb']);

    if (Array.isArray(filesTables) && filesTables.length > 0) {
      console.log('ℹ️  Files table already exists, checking if migration is recorded...');
      
      // Check if the files migration is recorded
      const [filesMigration] = await connection.execute(`
        SELECT * FROM \`__drizzle_migrations\` WHERE \`hash\` = ?
      `, ['0001_gigantic_korath']);

      if (!Array.isArray(filesMigration) || filesMigration.length === 0) {
        console.log('📝 Recording files migration as completed...');
        await connection.execute(`
          INSERT INTO \`__drizzle_migrations\` (\`hash\`, \`created_at\`) 
          VALUES (?, ?)
        `, ['0001_gigantic_korath', Date.now()]);
        console.log('✅ Files migration recorded');
      } else {
        console.log('✅ Files migration already recorded');
      }
    } else {
      console.log('📦 Creating files table...');
      
      // Apply the files table migration
      await connection.execute(`
        CREATE TABLE \`bakonykuti-t3_file\` (
          \`id\` serial AUTO_INCREMENT NOT NULL,
          \`original_name\` varchar(512) NOT NULL,
          \`filename\` varchar(512) NOT NULL,
          \`file_path\` varchar(1024) NOT NULL,
          \`public_url\` varchar(1024) NOT NULL,
          \`mime_type\` varchar(128) NOT NULL,
          \`file_size\` int NOT NULL,
          \`upload_type\` varchar(64) NOT NULL,
          \`uploaded_by\` varchar(255),
          \`associated_entity\` varchar(64),
          \`associated_entity_id\` int,
          \`is_orphaned\` boolean NOT NULL DEFAULT false,
          \`last_accessed_at\` timestamp,
          \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
          \`updated_at\` timestamp DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT \`bakonykuti-t3_file_id\` PRIMARY KEY(\`id\`)
        );
      `);
      
      // Create indexes
      await connection.execute(`CREATE INDEX \`file_path_idx\` ON \`bakonykuti-t3_file\` (\`file_path\`);`);
      await connection.execute(`CREATE INDEX \`upload_type_idx\` ON \`bakonykuti-t3_file\` (\`upload_type\`);`);
      await connection.execute(`CREATE INDEX \`uploaded_by_idx\` ON \`bakonykuti-t3_file\` (\`uploaded_by\`);`);
      await connection.execute(`CREATE INDEX \`associated_entity_idx\` ON \`bakonykuti-t3_file\` (\`associated_entity\`,\`associated_entity_id\`);`);
      await connection.execute(`CREATE INDEX \`orphaned_idx\` ON \`bakonykuti-t3_file\` (\`is_orphaned\`);`);
      
      console.log('✅ Files table created with indexes');
      
      // Record the migration
      await connection.execute(`
        INSERT INTO \`__drizzle_migrations\` (\`hash\`, \`created_at\`) 
        VALUES (?, ?)
      `, ['0001_gigantic_korath', Date.now()]);
      
      console.log('✅ Files migration recorded');
    }

    // Show migration status
    const [migrations] = await connection.execute(`SELECT * FROM \`__drizzle_migrations\` ORDER BY \`created_at\``);
    console.log('\n📋 Migration Status:');
    console.table(migrations);

    await connection.end();
    console.log('\n🎉 Files table migration completed successfully!');
    console.log('\n🚀 The database is now ready for file management operations.');

  } catch (error) {
    console.error('❌ Error applying files migration:', error);
    process.exit(1);
  }
}

// Run the migration
applyFilesMigration();
