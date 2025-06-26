// This script builds the Next.js application in standalone mode
// and handles the environment variables correctly

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// Set environment variables for the build
process.env.SKIP_ENV_VALIDATION = '1';
process.env.NEXT_PHASE = 'phase-production-build';

console.log('Building Next.js application in standalone mode...');

try {
  // Run the Next.js build
  execSync('next build', { stdio: 'inherit' });
  
  console.log('Build completed successfully!');
  
  // Check if the standalone directory exists
  const standalonePath = path.join(process.cwd(), '.next', 'standalone');
  if (fs.existsSync(standalonePath)) {
    console.log('Standalone directory created successfully at:', standalonePath);
    
    // Check if server.js exists
    const serverJsPath = path.join(standalonePath, 'server.js');
    if (fs.existsSync(serverJsPath)) {
      console.log('server.js file found at:', serverJsPath);
    } else {
      console.error('server.js file not found in the standalone directory!');
    }
  } else {
    console.error('Standalone directory was not created!');
  }
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}
