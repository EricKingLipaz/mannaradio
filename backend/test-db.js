const pool = require('./config/database');

async function testConnection() {
    try {
        const [rows] = await pool.query('SELECT 1');
        console.log('✅ MySQL connection successful!');
        process.exit(0);
    } catch (error) {
        console.error('❌ MySQL connection failed:', error.message);
        process.exit(1);
    }
}

testConnection();
