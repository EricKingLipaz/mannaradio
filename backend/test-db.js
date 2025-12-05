console.log('Starting test-db.js...');
try {
    const pool = require('./config/database');
    console.log('Pool created, testing connection...');

    async function testConnection() {
        try {
            console.log('Querying...');
            const [rows] = await pool.query('SELECT 1');
            console.log('✅ MySQL connection successful!');
            process.exit(0);
        } catch (error) {
            console.error('❌ MySQL connection failed:', error);
            process.exit(1);
        }
    }

    testConnection();
} catch (err) {
    console.error('CRITICAL ERROR:', err);
    process.exit(1);
}
