const fs = require('fs');
const path = require('path');
require('dotenv').config();
const mysql = require('mysql2/promise');

async function setupDatabase() {
    console.log('1. Reading schema file...');
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // Split schema into individual statements
    const statements = schema
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0);

    console.log(`   Found ${statements.length} SQL statements.`);

    let connection;
    try {
        console.log('\n2. Connecting to MySQL...');
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            multipleStatements: true
        });
        console.log('   ✅ Connected successfully!');

        console.log('\n3. Executing schema statements...');
        for (let i = 0; i < statements.length; i++) {
            const statement = statements[i];
            // Skip comments
            if (statement.startsWith('--')) continue;

            try {
                await connection.query(statement);
                console.log(`   ✅ Executed statement ${i + 1}/${statements.length}`);
            } catch (err) {
                console.error(`   ❌ Error executing statement ${i + 1}:`, err.message);
                // Continue even if error (e.g. table already exists)
            }
        }

        console.log('\n✅ Schema setup complete!');

    } catch (error) {
        console.error('\n❌ ERROR:', error.message);
    } finally {
        if (connection) await connection.end();
    }
}

setupDatabase();
