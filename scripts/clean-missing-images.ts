#!/usr/bin/env bun
/**
 * Clean Missing Images from Database
 * Removes database entries for images that don't exist on disk
 */

import { db } from "../src/server/db";
import { images } from "../src/server/db/schema";
import { eq } from "drizzle-orm";
import { existsSync } from "fs";
import path from "path";

async function cleanMissingImages() {
  console.log('🧹 Cleaning missing images from database...\n');
  
  try {
    // Get all local images from database
    const allImages = await db.select().from(images);
    const localImages = allImages.filter(img => !img.url.startsWith('http'));
    
    console.log(`📊 Found ${localImages.length} local images in database`);
    
    const missingImages = [];
    
    // Check each local image for file existence
    for (const image of localImages) {
      const filePath = path.join(process.cwd(), 'public', image.url);
      
      if (!existsSync(filePath)) {
        missingImages.push(image);
        console.log(`❌ Missing file: ${image.url} (ID: ${image.id}) - "${image.title}"`);
      }
    }
    
    if (missingImages.length === 0) {
      console.log('✅ No missing images found! Database is clean.');
      return;
    }
    
    console.log(`\n🗑️  Found ${missingImages.length} missing images. Removing from database...`);
    
    // Remove missing images from database
    let removed = 0;
    for (const image of missingImages) {
      try {
        await db.delete(images).where(eq(images.id, image.id));
        console.log(`✅ Removed: ${image.url} (ID: ${image.id})`);
        removed++;
      } catch (error) {
        console.error(`❌ Failed to remove ${image.url}:`, error);
      }
    }
    
    console.log(`\n🎉 Successfully removed ${removed} missing image entries from database`);
    
  } catch (error) {
    console.error('❌ Error cleaning missing images:', error);
    throw error;
  }
}

if (import.meta.main) {
  cleanMissingImages().catch(console.error);
}
