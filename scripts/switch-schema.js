// scripts/switch-schema.js
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const DB_ENGINE = process.env.DB_ENGINE || 'mysql';
const prismaDir = path.join(__dirname, '..', 'prisma');
const targetSchema = path.join(prismaDir, 'schema.prisma');

// Map DB_ENGINE to schema file
const schemaMap = {
  'mysql': 'schema.mysql.prisma',
  'postgresql': 'schema.postgresql.prisma',
  'postgres': 'schema.postgresql.prisma', // alias
};

const sourceSchemaFile = schemaMap[DB_ENGINE.toLowerCase()];

if (!sourceSchemaFile) {
  console.error(`❌ Unsupported DB_ENGINE: ${DB_ENGINE}`);
  console.error(`   Supported values: mysql, postgresql`);
  process.exit(1);
}

const sourceSchema = path.join(prismaDir, sourceSchemaFile);

// Check if source schema exists
if (!fs.existsSync(sourceSchema)) {
  console.error(`❌ Schema file not found: ${sourceSchema}`);
  process.exit(1);
}

// Copy the appropriate schema file
try {
  fs.copyFileSync(sourceSchema, targetSchema);
  console.log(`✅ Switched to ${DB_ENGINE} schema`);
  console.log(`   Copied: ${sourceSchemaFile} → schema.prisma`);
} catch (error) {
  console.error(`❌ Error copying schema file:`, error.message);
  process.exit(1);
}
