require('dotenv').config();
const mysql = require('mysql2/promise');

async function createTable() {
    console.log('Creating pastors table...');

    let connection;
    try {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'manna_radio'
        });

        const createTableSQL = `
      CREATE TABLE IF NOT EXISTS pastors (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;

        await connection.query(createTableSQL);
        console.log('✅ "pastors" table created successfully!');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        if (connection) await connection.end();
    }
}

createTable();
