#!/usr/bin/env bun
/**
 * Fix Image Database Inconsistencies
 * Identifies and fixes mismatches between database entries and actual files
 */

import { db } from "../src/server/db";
import { images } from "../src/server/db/schema";
import { eq } from "drizzle-orm";
import { existsSync, readdirSync, statSync } from "fs";
import path from "path";

interface ImageIssue {
  type: 'missing_file' | 'orphaned_file' | 'duplicate_entry';
  imageId?: number;
  url: string;
  filePath?: string;
  title?: string;
  description: string;
}

async function analyzeImageInconsistencies() {
  console.log('🔍 Analyzing image database inconsistencies...\n');
  
  const issues: ImageIssue[] = [];
  
  try {
    // Get all images from database
    const allImages = await db.select().from(images);
    console.log(`📊 Found ${allImages.length} images in database`);
    
    // Check local images (non-external URLs)
    const localImages = allImages.filter(img => !img.url.startsWith('http'));
    console.log(`📁 Found ${localImages.length} local images in database`);
    
    // Check each local image for file existence
    console.log('\n🔍 Checking database entries against file system...');
    for (const image of localImages) {
      const filePath = path.join(process.cwd(), 'public', image.url);
      
      if (!existsSync(filePath)) {
        issues.push({
          type: 'missing_file',
          imageId: image.id,
          url: image.url,
          filePath,
          title: image.title || 'Untitled',
          description: `Database entry exists but file is missing: ${image.url}`
        });
        console.log(`❌ Missing file: ${image.url} (ID: ${image.id})`);
      } else {
        console.log(`✅ File exists: ${image.url}`);
      }
    }
    
    // Check for orphaned files (files that exist but aren't in database)
    console.log('\n🔍 Checking file system for orphaned files...');
    const uploadDirs = ['public/uploads/gallery', 'public/uploads/news', 'public/uploads/events', 'public/uploads/documents'];
    
    for (const uploadDir of uploadDirs) {
      if (existsSync(uploadDir)) {
        const files = readdirSync(uploadDir).filter(file => 
          file !== '.gitkeep' && 
          (file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.webp') || file.endsWith('.pdf'))
        );
        
        for (const file of files) {
          const relativePath = `/${uploadDir.replace('public/', '')}/${file}`;
          const dbEntry = allImages.find(img => img.url === relativePath);
          
          if (!dbEntry) {
            const fullPath = path.join(uploadDir, file);
            const stats = statSync(fullPath);
            
            issues.push({
              type: 'orphaned_file',
              url: relativePath,
              filePath: fullPath,
              description: `File exists but no database entry: ${relativePath} (${Math.round(stats.size / 1024)}KB)`
            });
            console.log(`🔄 Orphaned file: ${relativePath}`);
          }
        }
      }
    }
    
    // Check for duplicate URLs
    console.log('\n🔍 Checking for duplicate database entries...');
    const urlCounts = new Map<string, number>();
    const duplicateUrls = new Set<string>();
    
    for (const image of allImages) {
      const count = urlCounts.get(image.url) || 0;
      urlCounts.set(image.url, count + 1);
      if (count > 0) {
        duplicateUrls.add(image.url);
      }
    }
    
    for (const url of duplicateUrls) {
      const duplicates = allImages.filter(img => img.url === url);
      issues.push({
        type: 'duplicate_entry',
        url,
        description: `Duplicate database entries for URL: ${url} (${duplicates.length} entries)`
      });
      console.log(`⚠️  Duplicate entries for: ${url} (${duplicates.length} entries)`);
    }
    
    // Summary
    console.log('\n📋 ANALYSIS SUMMARY:');
    console.log(`Total issues found: ${issues.length}`);
    console.log(`Missing files: ${issues.filter(i => i.type === 'missing_file').length}`);
    console.log(`Orphaned files: ${issues.filter(i => i.type === 'orphaned_file').length}`);
    console.log(`Duplicate entries: ${issues.filter(i => i.type === 'duplicate_entry').length}`);
    
    return issues;
    
  } catch (error) {
    console.error('❌ Error analyzing inconsistencies:', error);
    throw error;
  }
}

async function fixImageInconsistencies(issues: ImageIssue[], autoFix: boolean = false) {
  console.log('\n🔧 Fixing image inconsistencies...');
  
  if (!autoFix) {
    console.log('ℹ️  Run with --fix flag to automatically fix issues');
    return;
  }
  
  let fixed = 0;
  
  for (const issue of issues) {
    try {
      switch (issue.type) {
        case 'missing_file':
          if (issue.imageId) {
            console.log(`🗑️  Removing database entry for missing file: ${issue.url}`);
            await db.delete(images).where(eq(images.id, issue.imageId));
            fixed++;
          }
          break;
          
        case 'duplicate_entry':
          // Keep the most recent entry, remove others
          const duplicates = await db.select().from(images).where(eq(images.url, issue.url));
          if (duplicates.length > 1) {
            // Sort by creation date, keep the newest
            duplicates.sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
            const toKeep = duplicates[0];
            const toRemove = duplicates.slice(1);
            
            console.log(`🔄 Keeping newest entry for ${issue.url}, removing ${toRemove.length} duplicates`);
            for (const duplicate of toRemove) {
              await db.delete(images).where(eq(images.id, duplicate.id));
              fixed++;
            }
          }
          break;
          
        case 'orphaned_file':
          console.log(`ℹ️  Orphaned file found: ${issue.url} - manual review recommended`);
          // Don't auto-fix orphaned files as they might be intentional
          break;
      }
    } catch (error) {
      console.error(`❌ Error fixing issue for ${issue.url}:`, error);
    }
  }
  
  console.log(`\n✅ Fixed ${fixed} issues`);
}

async function main() {
  const autoFix = process.argv.includes('--fix');
  
  try {
    const issues = await analyzeImageInconsistencies();
    
    if (issues.length > 0) {
      await fixImageInconsistencies(issues, autoFix);
      
      if (!autoFix) {
        console.log('\n💡 To automatically fix these issues, run:');
        console.log('bun scripts/fix-image-database-inconsistencies.ts --fix');
      }
    } else {
      console.log('\n🎉 No inconsistencies found! Database and file system are in sync.');
    }
    
  } catch (error) {
    console.error('❌ Script failed:', error);
    process.exit(1);
  }
}

if (import.meta.main) {
  main();
}
