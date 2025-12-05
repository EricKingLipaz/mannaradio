const fs = require('fs');
const path = require('path');
require('dotenv').config();
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

const logFile = path.join(__dirname, 'debug_log.txt');

function log(message) {
    console.log(message);
    fs.appendFileSync(logFile, message + '\n');
}

async function debugDatabase() {
    fs.writeFileSync(logFile, 'Starting Debug...\n');

    log('1. Starting Database Debug...');
    log(`   DB_HOST: ${process.env.DB_HOST}`);
    log(`   DB_USER: ${process.env.DB_USER}`);
    log(`   DB_NAME: ${process.env.DB_NAME}`);

    let connection;
    try {
        // 1. Test Connection
        log('\n2. Connecting to MySQL...');
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'manna_radio'
        });
        log('   ✅ Connected successfully!');

        // 2. Check Tables
        log('\n3. Checking tables...');
        const [tables] = await connection.query('SHOW TABLES');
        log(`   Found tables: ${tables.map(t => Object.values(t)[0]).join(', ')}`);

        const hasPastors = tables.some(t => Object.values(t)[0] === 'pastors');
        if (!hasPastors) {
            log('   ❌ CRITICAL: "pastors" table is MISSING!');
            return;
        }
        log('   ✅ "pastors" table exists.');

        // 3. Check Pastors Table Structure
        log('\n4. Checking "pastors" table structure...');
        const [columns] = await connection.query('DESCRIBE pastors');
        log(`   Columns: ${columns.map(c => c.Field).join(', ')}`);

        // 4. Try to Insert Test Pastor
        log('\n5. Attempting to insert test pastor (Eric)...');
        const email = 'eric@eric.com';

        // Check if exists first
        const [existing] = await connection.query('SELECT * FROM pastors WHERE email = ?', [email]);
        if (existing.length > 0) {
            log('   ⚠️ Pastor already exists. Updating password...');
            const hashedPassword = await bcrypt.hash('password123', 10);
            await connection.query('UPDATE pastors SET password = ? WHERE email = ?', [hashedPassword, email]);
            log('   ✅ Password updated to "password123"');
        } else {
            const hashedPassword = await bcrypt.hash('password123', 10);
            await connection.query(
                'INSERT INTO pastors (name, email, password) VALUES (?, ?, ?)',
                ['Eric', email, hashedPassword]
            );
            log('   ✅ Test pastor inserted successfully!');
        }

        log('\n✅ DEBUG COMPLETE. You should be able to login with eric@eric.com / password123');

    } catch (error) {
        log(`\n❌ ERROR: ${error.message}`);
        if (error.code) log(`   Error Code: ${error.code}`);
    } finally {
        if (connection) await connection.end();
    }
}

debugDatabase();
