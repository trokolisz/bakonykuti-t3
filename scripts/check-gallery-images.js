#!/usr/bin/env node

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('🔍 Checking gallery images...');

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

  // Check if images table exists (with the correct name)
  const [tables] = await connection.execute("SHOW TABLES LIKE 'bakonykuti-t3_image'");
  if (tables.length === 0) {
    console.log('❌ Images table (bakonykuti-t3_image) does not exist');
    console.log('💡 Run: bun run db:push to create tables');
    await connection.end();
    process.exit(1);
  }

  // Check all images
  const [allImages] = await connection.execute('SELECT * FROM `bakonykuti-t3_image`');
  console.log(`📊 Total images in database: ${allImages.length}`);

  if (allImages.length > 0) {
    console.log('\n📋 All images:');
    allImages.forEach((img, index) => {
      console.log(`${index + 1}. ${img.title || 'Untitled'}`);
      console.log(`   URL: ${img.url}`);
      console.log(`   Gallery: ${img.gallery ? '✅' : '❌'}`);
      console.log(`   Visible: ${img.visible ? '✅' : '❌'}`);
      console.log(`   Carousel: ${img.carousel ? '✅' : '❌'}`);
      console.log('');
    });
  }

  // Check gallery images specifically
  const [galleryImages] = await connection.execute(
    'SELECT * FROM `bakonykuti-t3_image` WHERE gallery = 1 AND visible = 1'
  );

  console.log(`🖼️  Gallery images (visible): ${galleryImages.length}`);

  if (galleryImages.length === 0) {
    console.log('\n💡 Your gallery is empty because:');
    console.log('   - No images have gallery=true AND visible=true');
    console.log('   - You need to add some test images or mark existing images for gallery');

    if (allImages.length > 0) {
      console.log('\n🔧 To fix this, you can:');
      console.log('   1. Mark existing images for gallery: UPDATE images SET gallery=1, visible=1 WHERE id=?');
      console.log('   2. Or add new images through the admin panel');
    }
  }

  await connection.end();

} catch (error) {
  console.error('❌ Database error:', error.message);
  console.log('\n💡 This might be because:');
  console.log('   - Database is not running');
  console.log('   - Connection settings are incorrect');
  console.log('   - Tables haven\'t been created yet');
}
