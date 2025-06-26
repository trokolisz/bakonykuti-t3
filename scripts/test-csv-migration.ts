import * as fs from 'fs';
import * as path from 'path';
import mysql from "mysql2/promise";
import { env } from "../src/env";
import {
  DEFAULT_CSV_CONFIG,
  convertValueForCsv,
  convertValueFromCsv,
  validateCsvData,
  sanitizeSqlValue,
  logMigrationStep
} from "../src/lib/csv-migration-utils";

/**
 * Test CSV utility functions
 */
function testCsvUtilities(): boolean {
  console.log("Testing CSV utility functions...");
  let allTestsPassed = true;

  // Test data type conversions
  const testCases = [
    { input: null, expected: '' },
    { input: undefined, expected: '' },
    { input: true, expected: '1' },
    { input: false, expected: '0' },
    { input: new Date('2023-01-01T12:00:00Z'), expected: '2023-01-01T12:00:00.000Z' },
    { input: { key: 'value' }, expected: '{"key":"value"}' },
    { input: 'test string', expected: 'test string' },
    { input: 123, expected: '123' }
  ];

  for (const testCase of testCases) {
    const result = convertValueForCsv(testCase.input);
    if (result !== testCase.expected) {
      console.error(`❌ convertValueForCsv failed: ${testCase.input} -> ${result} (expected: ${testCase.expected})`);
      allTestsPassed = false;
    } else {
      console.log(`✅ convertValueForCsv: ${testCase.input} -> ${result}`);
    }
  }

  // Test reverse conversions
  const reverseCases = [
    { input: '', expected: null },
    { input: '1', expected: true },
    { input: '0', expected: false },
    { input: '2023-01-01T12:00:00.000Z', expected: new Date('2023-01-01T12:00:00.000Z') },
    { input: '{"key":"value"}', expected: { key: 'value' } },
    { input: 'test string', expected: 'test string' },
    { input: '123', expected: 123 }
  ];

  for (const testCase of reverseCases) {
    const result = convertValueFromCsv(testCase.input);
    const isEqual = JSON.stringify(result) === JSON.stringify(testCase.expected);
    if (!isEqual) {
      console.error(`❌ convertValueFromCsv failed: ${testCase.input} -> ${JSON.stringify(result)} (expected: ${JSON.stringify(testCase.expected)})`);
      allTestsPassed = false;
    } else {
      console.log(`✅ convertValueFromCsv: ${testCase.input} -> ${JSON.stringify(result)}`);
    }
  }

  return allTestsPassed;
}

/**
 * Test CSV validation
 */
function testCsvValidation(): boolean {
  console.log("\nTesting CSV validation...");
  let allTestsPassed = true;

  // Test valid user data
  const validUserData = [
    { id: '1', email: 'test@example.com', name: 'Test User' },
    { id: '2', email: 'admin@example.com', name: 'Admin User' }
  ];

  const validResult = validateCsvData('user', validUserData);
  if (!validResult.isValid) {
    console.error(`❌ Valid user data failed validation: ${validResult.errors.join(', ')}`);
    allTestsPassed = false;
  } else {
    console.log(`✅ Valid user data passed validation`);
  }

  // Test invalid user data (missing email)
  const invalidUserData = [
    { id: '1', name: 'Test User' }
  ];

  const invalidResult = validateCsvData('user', invalidUserData);
  if (invalidResult.isValid) {
    console.error(`❌ Invalid user data should have failed validation`);
    allTestsPassed = false;
  } else {
    console.log(`✅ Invalid user data correctly failed validation: ${invalidResult.errors[0]}`);
  }

  return allTestsPassed;
}

/**
 * Test SQL sanitization
 */
function testSqlSanitization(): boolean {
  console.log("\nTesting SQL sanitization...");
  let allTestsPassed = true;

  const testCases = [
    { input: null, expected: 'NULL' },
    { input: "test'string", expected: "'test''string'" },
    { input: true, expected: '1' },
    { input: false, expected: '0' },
    { input: new Date('2023-01-01T12:00:00Z'), expected: "'2023-01-01 12:00:00'" },
    { input: { key: 'value' }, expected: `'{"key":"value"}'` }
  ];

  for (const testCase of testCases) {
    const result = sanitizeSqlValue(testCase.input);
    if (result !== testCase.expected) {
      console.error(`❌ sanitizeSqlValue failed: ${JSON.stringify(testCase.input)} -> ${result} (expected: ${testCase.expected})`);
      allTestsPassed = false;
    } else {
      console.log(`✅ sanitizeSqlValue: ${JSON.stringify(testCase.input)} -> ${result}`);
    }
  }

  return allTestsPassed;
}

/**
 * Test MariaDB connection
 */
async function testMariaDbConnection(): Promise<boolean> {
  console.log("\nTesting MariaDB connection...");

  try {
    const connection = await mysql.createConnection({
      host: env.MARIADB_HOST,
      port: env.MARIADB_PORT,
      user: env.MARIADB_USER,
      password: env.MARIADB_PASSWORD,
      database: env.MARIADB_DATABASE,
    });

    await connection.execute('SELECT 1 as test');
    await connection.end();

    console.log("✅ MariaDB connection successful");
    return true;
  } catch (error) {
    console.error("❌ MariaDB connection failed:", error);
    return false;
  }
}

/**
 * Test export directory setup
 */
function testExportDirectory(): boolean {
  console.log("\nTesting export directory...");
  
  try {
    // Check if export directory exists or can be created
    if (!fs.existsSync(DEFAULT_CSV_CONFIG.exportDir)) {
      fs.mkdirSync(DEFAULT_CSV_CONFIG.exportDir, { recursive: true });
      console.log(`✅ Created export directory: ${DEFAULT_CSV_CONFIG.exportDir}`);
    } else {
      console.log(`✅ Export directory exists: ${DEFAULT_CSV_CONFIG.exportDir}`);
    }

    // Test write permissions
    const testFile = path.join(DEFAULT_CSV_CONFIG.exportDir, 'test-write.txt');
    fs.writeFileSync(testFile, 'test');
    fs.unlinkSync(testFile);
    
    console.log("✅ Export directory is writable");
    return true;
  } catch (error) {
    console.error("❌ Export directory test failed:", error);
    return false;
  }
}

/**
 * Check if CSV files exist (for import testing)
 */
function checkCsvFiles(): void {
  console.log("\nChecking for existing CSV files...");
  
  if (!fs.existsSync(DEFAULT_CSV_CONFIG.exportDir)) {
    console.log("ℹ️  No export directory found - run export first");
    return;
  }

  const csvFiles = fs.readdirSync(DEFAULT_CSV_CONFIG.exportDir)
    .filter(file => file.endsWith('.csv'));

  if (csvFiles.length === 0) {
    console.log("ℹ️  No CSV files found - run export first");
  } else {
    console.log(`✅ Found ${csvFiles.length} CSV files:`);
    for (const file of csvFiles) {
      const filePath = path.join(DEFAULT_CSV_CONFIG.exportDir, file);
      const stats = fs.statSync(filePath);
      console.log(`  - ${file} (${(stats.size / 1024).toFixed(2)} KB)`);
    }
  }
}

/**
 * Main test function
 */
async function runTests(): Promise<void> {
  console.log("🧪 Starting CSV Migration Tests\n");
  
  const results = {
    utilities: testCsvUtilities(),
    validation: testCsvValidation(),
    sanitization: testSqlSanitization(),
    mariadb: await testMariaDbConnection(),
    exportDir: testExportDirectory()
  };

  checkCsvFiles();

  // Summary
  console.log("\n=== Test Results ===");
  const passedTests = Object.values(results).filter(Boolean).length;
  const totalTests = Object.keys(results).length;

  for (const [testName, passed] of Object.entries(results)) {
    console.log(`${passed ? '✅' : '❌'} ${testName}: ${passed ? 'PASSED' : 'FAILED'}`);
  }

  console.log(`\nOverall: ${passedTests}/${totalTests} tests passed`);

  if (passedTests === totalTests) {
    console.log("🎉 All tests passed! CSV migration system is ready to use.");
    console.log("\nNext steps:");
    console.log("1. Run 'bun db:export-to-csv' to export data from Vercel Postgres");
    console.log("2. Run 'bun db:import-from-csv' to import data into MariaDB");
  } else {
    console.log("⚠️  Some tests failed. Please fix the issues before running migration.");
    process.exit(1);
  }
}

// Run tests
runTests().catch((error) => {
  console.error("Fatal error during testing:", error);
  process.exit(1);
});
