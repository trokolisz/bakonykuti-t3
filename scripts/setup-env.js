#!/usr/bin/env node

import fs from 'fs';
import crypto from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔧 Setting up environment variables...');

// Generate a secure AUTH_SECRET
const authSecret = crypto.randomBytes(32).toString('base64');

// Read the .env.example file
const envExamplePath = path.join(process.cwd(), '.env.example');
const envPath = path.join(process.cwd(), '.env');

if (!fs.existsSync(envExamplePath)) {
  console.error('❌ .env.example file not found!');
  process.exit(1);
}

// Check if .env already exists
let envContent;
if (fs.existsSync(envPath)) {
  console.log('📄 .env file already exists, updating only missing values...');
  envContent = fs.readFileSync(envPath, 'utf8');

  // Only update AUTH_SECRET if it's still the placeholder
  if (envContent.includes('AUTH_SECRET="your-auth-secret"')) {
    envContent = envContent.replace(
      'AUTH_SECRET="your-auth-secret"',
      `AUTH_SECRET="${authSecret}"`
    );
    console.log('🔑 Updated AUTH_SECRET');
  } else {
    console.log('🔑 AUTH_SECRET already configured');
  }
} else {
  console.log('📄 Creating new .env file from template...');
  envContent = fs.readFileSync(envExamplePath, 'utf8');

  // Replace placeholder values with actual values
  envContent = envContent.replace(
    'AUTH_SECRET="your-auth-secret"',
    `AUTH_SECRET="${authSecret}"`
  );
}

// Write the .env file
fs.writeFileSync(envPath, envContent);

console.log('✅ .env file updated successfully!');
console.log('');

// Check what still needs to be configured
const needsConfiguration = [];
if (envContent.includes('MARIADB_PASSWORD="your-mariadb-password"')) {
  needsConfiguration.push('MARIADB_PASSWORD: Set your MariaDB password');
}
if (envContent.includes('NEXTAUTH_URL="http://localhost:3000"') && !envContent.includes('localhost:3000')) {
  needsConfiguration.push('NEXTAUTH_URL: Update if not running on localhost:3000');
}
if (envContent.includes('OPENWEATHERMAP_API_KEY="your-openweathermap-api-key"')) {
  needsConfiguration.push('OPENWEATHERMAP_API_KEY: Get your API key from https://openweathermap.org/api');
}

if (needsConfiguration.length > 0) {
  console.log('⚠️  IMPORTANT: Please update the following values in your .env file:');
  needsConfiguration.forEach(item => console.log(`   - ${item}`));
  console.log('');
} else {
  console.log('✅ All environment variables appear to be configured!');
  console.log('');
}

console.log('📝 Your .env file is at:', envPath);
