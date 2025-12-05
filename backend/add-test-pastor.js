const bcrypt = require('bcryptjs');
const pool = require('./config/database');

async function addTestPastor() {
    try {
        const hashedPassword = await bcrypt.hash('password123', 10);

        await pool.query(
            'INSERT INTO pastors (name, email, password) VALUES (?, ?, ?)',
            ['Eric', 'eric@eric.com', hashedPassword]
        );

        console.log('✅ Test pastor added successfully!');
        console.log('📧 Email: eric@eric.com');
        console.log('🔑 Password: password123');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

addTestPastor();
