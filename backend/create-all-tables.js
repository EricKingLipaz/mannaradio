require('dotenv').config();
const mysql = require('mysql2/promise');

async function createTables() {
    console.log('Creating remaining tables...');

    let connection;
    try {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'manna_radio',
            multipleStatements: true
        });

        const sql = `
      -- Create members table
      CREATE TABLE IF NOT EXISTS members (
        id INT AUTO_INCREMENT PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        address TEXT NOT NULL,
        date_of_birth DATE,
        baptism_date DATE,
        rank VARCHAR(50) DEFAULT 'Member',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );

      -- Create prayer_requests table
      CREATE TABLE IF NOT EXISTS prayer_requests (
        id INT AUTO_INCREMENT PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        prayer_request TEXT NOT NULL,
        is_urgent BOOLEAN DEFAULT FALSE,
        status VARCHAR(50) DEFAULT 'pending',
        pastor_reply TEXT,
        replied_at TIMESTAMP NULL,
        replied_by_pastor_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (replied_by_pastor_id) REFERENCES pastors(id) ON DELETE SET NULL
      );

      -- Create prayer_request_replies table
      CREATE TABLE IF NOT EXISTS prayer_request_replies (
        id INT AUTO_INCREMENT PRIMARY KEY,
        prayer_request_id INT NOT NULL,
        pastor_id INT NOT NULL,
        reply_text TEXT NOT NULL,
        email_sent BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (prayer_request_id) REFERENCES prayer_requests(id) ON DELETE CASCADE,
        FOREIGN KEY (pastor_id) REFERENCES pastors(id) ON DELETE CASCADE
      );

      -- Create chat_messages table
      CREATE TABLE IF NOT EXISTS chat_messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        message_type VARCHAR(50) DEFAULT 'text',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

        await connection.query(sql);
        console.log('✅ All tables created successfully!');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        if (connection) await connection.end();
    }
}

createTables();
