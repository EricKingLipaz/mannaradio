const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'manna_radio'
};

async function addRoleColumn() {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log('Connected to database.');

        // Check if column exists
        const [columns] = await connection.query(`
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'pastors' AND COLUMN_NAME = 'role'
        `, [dbConfig.database]);

        if (columns.length > 0) {
            console.log('Column "role" already exists.');
        } else {
            console.log('Adding "role" column...');
            // Add role column with default 'moderator'
            await connection.query(`
                ALTER TABLE pastors 
                ADD COLUMN role ENUM('admin', 'moderator') NOT NULL DEFAULT 'moderator'
            `);
            console.log('"role" column added successfully.');

            // Update all existing users to 'admin' (assuming current users are admins)
            console.log('Updating existing users to "admin" role...');
            await connection.query(`
                UPDATE pastors SET role = 'admin'
            `);
            console.log('Existing users updated to "admin".');
        }

    } catch (error) {
        console.error('Error adding role column:', error);
    } finally {
        if (connection) await connection.end();
    }
}

addRoleColumn();
