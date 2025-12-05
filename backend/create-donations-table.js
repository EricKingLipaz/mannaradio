require('dotenv').config();
const mysql = require('mysql2/promise');

async function createDonationsTable() {
    console.log('Creating donations table...');

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
      CREATE TABLE IF NOT EXISTS donations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        member_id INT,
        donor_name VARCHAR(255),
        amount DECIMAL(10, 2) NOT NULL,
        type ENUM('Tithe', 'Offering', 'Donation') NOT NULL,
        payment_method VARCHAR(50) DEFAULT 'Cash',
        notes TEXT,
        date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE SET NULL
      );
      
      -- Create index for faster queries
      CREATE INDEX idx_donations_date ON donations(date);
      CREATE INDEX idx_donations_type ON donations(type);
    `;

        await connection.query(sql);
        console.log('✅ "donations" table created successfully!');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        if (connection) await connection.end();
    }
}

createDonationsTable();
