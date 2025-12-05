require('dotenv').config();
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function debugDatabase() {
    console.log('1. Starting Database Debug...');
    console.log('   DB_HOST:', process.env.DB_HOST);
    console.log('   DB_USER:', process.env.DB_USER);
    console.log('   DB_NAME:', process.env.DB_NAME);

    let connection;
    try {
        // 1. Test Connection
        console.log('\n2. Connecting to MySQL...');
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'manna_radio'
        });
        console.log('   ✅ Connected successfully!');

        // 2. Check Tables
        console.log('\n3. Checking tables...');
        const [tables] = await connection.query('SHOW TABLES');
        console.log('   Found tables:', tables.map(t => Object.values(t)[0]).join(', '));

        const hasPastors = tables.some(t => Object.values(t)[0] === 'pastors');
        if (!hasPastors) {
            console.error('   ❌ CRITICAL: "pastors" table is MISSING!');
            return;
        }
        console.log('   ✅ "pastors" table exists.');

        // 3. Check Pastors Table Structure
        console.log('\n4. Checking "pastors" table structure...');
        const [columns] = await connection.query('DESCRIBE pastors');
        console.log('   Columns:', columns.map(c => c.Field).join(', '));

        // 4. Try to Insert Test Pastor
        console.log('\n5. Attempting to insert test pastor (Eric)...');
        const email = 'eric@eric.com';

        // Check if exists first
        const [existing] = await connection.query('SELECT * FROM pastors WHERE email = ?', [email]);
        if (existing.length > 0) {
            console.log('   ⚠️ Pastor already exists. Updating password...');
            const hashedPassword = await bcrypt.hash('password123', 10);
            await connection.query('UPDATE pastors SET password = ? WHERE email = ?', [hashedPassword, email]);
            console.log('   ✅ Password updated to "password123"');
        } else {
            const hashedPassword = await bcrypt.hash('password123', 10);
            // Generate a random UUID-like ID if the table expects a string ID, or let auto_increment handle it if it's an int
            // Based on previous schema, it might be UUID or INT. Let's check the ID column type.
            const idCol = columns.find(c => c.Field === 'id');

            if (idCol.Type.includes('int')) {
                await connection.query(
                    'INSERT INTO pastors (name, email, password) VALUES (?, ?, ?)',
                    ['Eric', email, hashedPassword]
                );
            } else {
                // Assuming UUID string
                const crypto = require('crypto');
                const id = crypto.randomUUID();
                await connection.query(
                    'INSERT INTO pastors (id, name, email, password) VALUES (?, ?, ?, ?)',
                    [id, 'Eric', email, hashedPassword]
                );
            }
            console.log('   ✅ Test pastor inserted successfully!');
        }

        console.log('\n✅ DEBUG COMPLETE. You should be able to login with eric@eric.com / password123');

    } catch (error) {
        console.error('\n❌ ERROR:', error.message);
        if (error.code) console.error('   Error Code:', error.code);
    } finally {
        if (connection) await connection.end();
    }
}

debugDatabase();
