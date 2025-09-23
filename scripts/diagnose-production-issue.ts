#!/usr/bin/env bun
/**
 * Diagnose Production Database Issue
 * Checks environment variables and database connection
 */

import mysql from 'mysql2/promise';

async function diagnoseIssue() {
  console.log('🔍 Diagnosing production database issue...\n');

  // 1. Check environment variables
  console.log('📋 Environment Variables:');
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('MARIADB_HOST:', process.env.MARIADB_HOST || 'NOT SET');
  console.log('MARIADB_PORT:', process.env.MARIADB_PORT || 'NOT SET');
  console.log('MARIADB_USER:', process.env.MARIADB_USER || 'NOT SET');
  console.log('MARIADB_PASSWORD:', process.env.MARIADB_PASSWORD ? '***SET***' : 'NOT SET');
  console.log('MARIADB_DATABASE:', process.env.MARIADB_DATABASE || 'NOT SET');
  console.log('AUTH_SECRET:', process.env.AUTH_SECRET ? '***SET***' : 'NOT SET');
  console.log('SKIP_ENV_VALIDATION:', process.env.SKIP_ENV_VALIDATION || 'NOT SET');

  // 2. Test database connection
  console.log('\n🔌 Testing Database Connection:');
  try {
    const connection = await mysql.createConnection({
      host: process.env.MARIADB_HOST || 'localhost',
      port: parseInt(process.env.MARIADB_PORT || '3306'),
      user: process.env.MARIADB_USER || 'root',
      password: process.env.MARIADB_PASSWORD || 'bakonykuti_root_password',
      database: process.env.MARIADB_DATABASE || 'bakonykuti-mariadb',
    });

    console.log('✅ Database connection successful');

    // 3. Check if files table exists
    const [tables] = await connection.execute(`
      SELECT TABLE_NAME 
      FROM information_schema.TABLES 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'bakonykuti-t3_file'
    `, [process.env.MARIADB_DATABASE || 'bakonykuti-mariadb']);

    if (Array.isArray(tables) && tables.length > 0) {
      console.log('✅ Files table exists');
      
      // Check table structure
      const [columns] = await connection.execute(`DESCRIBE \`bakonykuti-t3_file\``);
      console.log('📊 Files table has', columns.length, 'columns');
      
      // Check record count
      const [count] = await connection.execute(`SELECT COUNT(*) as count FROM \`bakonykuti-t3_file\``);
      console.log('📈 Files table has', count[0].count, 'records');
      
    } else {
      console.log('❌ Files table does NOT exist');
    }

    // 4. Test a simple insert (and rollback)
    console.log('\n🧪 Testing file record creation...');
    await connection.beginTransaction();
    
    try {
      await connection.execute(`
        INSERT INTO \`bakonykuti-t3_file\` 
        (original_name, filename, file_path, public_url, mime_type, file_size, upload_type, is_orphaned, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `, [
        'test.png',
        'test_123.png', 
        'public/uploads/test/test_123.png',
        '/uploads/test/test_123.png',
        'image/png',
        1024,
        'test',
        false
      ]);
      
      console.log('✅ Test insert successful');
      
      // Rollback the test insert
      await connection.rollback();
      console.log('✅ Test insert rolled back');
      
    } catch (insertError) {
      console.log('❌ Test insert failed:', insertError.message);
      await connection.rollback();
    }

    await connection.end();

  } catch (error) {
    console.log('❌ Database connection failed:', error.message);
    console.log('Error code:', error.code);
    console.log('Error errno:', error.errno);
  }

  // 5. Check file system permissions
  console.log('\n📁 Checking file system...');
  try {
    const fs = await import('fs/promises');
    const path = await import('path');
    
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    const galleryDir = path.join(uploadsDir, 'gallery');
    
    try {
      await fs.access(uploadsDir);
      console.log('✅ uploads directory exists');
    } catch {
      console.log('❌ uploads directory does NOT exist');
    }
    
    try {
      await fs.access(galleryDir);
      console.log('✅ gallery directory exists');
    } catch {
      console.log('❌ gallery directory does NOT exist');
    }
    
  } catch (error) {
    console.log('❌ File system check failed:', error.message);
  }

  console.log('\n🎯 Diagnosis complete!');
}

// Run the diagnosis
diagnoseIssue();
