import mysql from 'mysql2/promise';
import { config } from 'dotenv';

config();

async function main() {
  const connection = await mysql.createConnection({
    host: process.env.MARIADB_HOST,
    port: Number(process.env.MARIADB_PORT || 3306),
    user: process.env.MARIADB_USER,
    password: process.env.MARIADB_PASSWORD,
    database: process.env.MARIADB_DATABASE,
  });

  try {
    await connection.execute(`
      ALTER TABLE \`bakonykuti-t3_page\`
      ADD COLUMN IF NOT EXISTS \`thumbnail\` varchar(2056) NOT NULL DEFAULT ''
    `);
    console.log('Added pages.thumbnail column (or it already existed).');
  } finally {
    await connection.end();
  }
}

main().catch((error) => {
  console.error('Failed to add pages.thumbnail column:', error);
  process.exit(1);
});
