require('dotenv').config();
const mysql = require('mysql2/promise');

async function createTestimoniesTable() {
    console.log('Creating testimonies table...');
    let connection;
    try {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'manna_radio'
        });

        const sql = `
            CREATE TABLE IF NOT EXISTS testimonies (
                id INT AUTO_INCREMENT PRIMARY KEY,
                full_name VARCHAR(255) NOT NULL,
                location VARCHAR(255),
                content TEXT NOT NULL,
                status ENUM('pending', 'approved', 'declined') DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_status (status)
            );
        `;

        await connection.query(sql);
        console.log('✅ Testimonies table created successfully!');
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        if (connection) await connection.end();
    }
}

createTestimoniesTable();
