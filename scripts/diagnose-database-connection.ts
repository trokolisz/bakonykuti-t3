#!/usr/bin/env bun
/**
 * Database Connection Diagnostic Tool
 * Helps diagnose database connection issues
 */

import mysql from 'mysql2/promise';
import { spawn } from 'child_process';

async function diagnoseDatabaseConnection() {
  console.log('🔍 Diagnosing database connection issues...\n');

  // Get configuration
  const config = {
    host: process.env.MARIADB_HOST || 'localhost',
    port: parseInt(process.env.MARIADB_PORT || '3306'),
    user: process.env.MARIADB_USER || 'root',
    password: process.env.MARIADB_PASSWORD || '',
    database: process.env.MARIADB_DATABASE || 'bakonykuti-mariadb',
  };

  console.log('📋 Current Configuration:');
  console.log(`  Host: ${config.host}`);
  console.log(`  Port: ${config.port}`);
  console.log(`  User: ${config.user}`);
  console.log(`  Database: ${config.database}`);
  console.log(`  Password: ${config.password ? '***set***' : '***NOT SET***'}\n`);

  // Check 1: Environment variables
  console.log('🔧 Checking environment variables...');
  const envVars = ['MARIADB_HOST', 'MARIADB_PORT', 'MARIADB_USER', 'MARIADB_PASSWORD', 'MARIADB_DATABASE'];
  envVars.forEach(envVar => {
    const value = process.env[envVar];
    console.log(`  ${envVar}: ${value ? '✅ Set' : '❌ Not set'}`);
  });
  console.log('');

  // Check 2: Network connectivity
  console.log('🌐 Checking network connectivity...');
  try {
    await checkPort(config.host, config.port);
    console.log(`  ✅ Port ${config.port} is reachable on ${config.host}`);
  } catch (error) {
    console.log(`  ❌ Port ${config.port} is NOT reachable on ${config.host}`);
    console.log(`     Error: ${error.message}`);
  }
  console.log('');

  // Check 3: MariaDB/MySQL service status
  console.log('🔧 Checking MariaDB/MySQL service status...');
  await checkServiceStatus();
  console.log('');

  // Check 4: Docker containers (if applicable)
  console.log('🐳 Checking Docker containers...');
  await checkDockerContainers();
  console.log('');

  // Check 5: Database connection attempt
  console.log('🔌 Attempting database connection...');
  try {
    const connection = await mysql.createConnection({
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password,
    });
    
    console.log('  ✅ Successfully connected to database server');
    
    // Check if database exists
    try {
      const [databases] = await connection.execute('SHOW DATABASES');
      const dbList = (databases as any[]).map(db => db.Database);
      
      if (dbList.includes(config.database)) {
        console.log(`  ✅ Database '${config.database}' exists`);
      } else {
        console.log(`  ❌ Database '${config.database}' does NOT exist`);
        console.log(`  📋 Available databases: ${dbList.join(', ')}`);
      }
    } catch (error) {
      console.log(`  ⚠️  Could not list databases: ${error.message}`);
    }
    
    await connection.end();
    
  } catch (error: any) {
    console.log('  ❌ Failed to connect to database server');
    console.log(`     Error: ${error.message}`);
    console.log(`     Code: ${error.code}`);
    console.log(`     Errno: ${error.errno}`);
  }

  // Provide recommendations
  console.log('\n💡 Troubleshooting Recommendations:\n');
  
  if (!process.env.MARIADB_PASSWORD) {
    console.log('1. ❌ Set MARIADB_PASSWORD environment variable:');
    console.log('   export MARIADB_PASSWORD="your-password"');
    console.log('   # or add to .env file\n');
  }
  
  console.log('2. 🔧 Check if MariaDB/MySQL is running:');
  console.log('   sudo systemctl status mariadb');
  console.log('   sudo systemctl start mariadb\n');
  
  console.log('3. 🐳 If using Docker, check containers:');
  console.log('   docker ps');
  console.log('   docker-compose up -d\n');
  
  console.log('4. 🌐 Test network connectivity:');
  console.log(`   telnet ${config.host} ${config.port}`);
  console.log(`   nc -zv ${config.host} ${config.port}\n`);
  
  console.log('5. 🔒 Check firewall settings:');
  console.log('   sudo ufw status');
  console.log(`   sudo ufw allow ${config.port}\n`);
  
  console.log('6. 📁 Check MariaDB configuration:');
  console.log('   sudo nano /etc/mysql/mariadb.conf.d/50-server.cnf');
  console.log('   # Ensure bind-address = 0.0.0.0 (not 127.0.0.1)\n');
}

async function checkPort(host: string, port: number): Promise<void> {
  return new Promise((resolve, reject) => {
    const net = require('net');
    const socket = new net.Socket();
    
    const timeout = setTimeout(() => {
      socket.destroy();
      reject(new Error('Connection timeout'));
    }, 5000);
    
    socket.connect(port, host, () => {
      clearTimeout(timeout);
      socket.destroy();
      resolve();
    });
    
    socket.on('error', (error) => {
      clearTimeout(timeout);
      reject(error);
    });
  });
}

async function checkServiceStatus(): Promise<void> {
  const services = ['mariadb', 'mysql', 'mysqld'];
  
  for (const service of services) {
    try {
      await runCommand(`systemctl is-active ${service}`);
      console.log(`  ✅ ${service} service is active`);
      return;
    } catch (error) {
      console.log(`  ❌ ${service} service is not active`);
    }
  }
  
  console.log('  ⚠️  No MariaDB/MySQL service found running');
}

async function checkDockerContainers(): Promise<void> {
  try {
    const output = await runCommand('docker ps --format "table {{.Names}}\\t{{.Status}}\\t{{.Ports}}"');
    const lines = output.split('\n').filter(line => line.trim());
    
    if (lines.length > 1) {
      console.log('  📋 Running Docker containers:');
      lines.forEach(line => {
        if (line.includes('mariadb') || line.includes('mysql') || line.includes('3306')) {
          console.log(`  ✅ ${line}`);
        } else if (!line.startsWith('NAMES')) {
          console.log(`     ${line}`);
        }
      });
    } else {
      console.log('  ❌ No Docker containers running');
    }
  } catch (error) {
    console.log('  ⚠️  Docker not available or no containers running');
  }
}

async function runCommand(command: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const [cmd, ...args] = command.split(' ');
    const process = spawn(cmd, args);
    
    let output = '';
    let error = '';
    
    process.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    process.stderr.on('data', (data) => {
      error += data.toString();
    });
    
    process.on('close', (code) => {
      if (code === 0) {
        resolve(output.trim());
      } else {
        reject(new Error(error.trim() || `Command failed with code ${code}`));
      }
    });
  });
}

// Run the diagnostic
diagnoseDatabaseConnection();
