const bcrypt = require('bcryptjs');
const pool = require('./config/database');

async function resetAdmin() {
    try {
        const hashedPassword = await bcrypt.hash('password123', 10);
        const email = 'eric@eric.com';

        // Check if user exists
        const [rows] = await pool.query('SELECT * FROM pastors WHERE email = ?', [email]);

        if (rows.length > 0) {
            // Update existing user
            await pool.query(
                'UPDATE pastors SET password = ? WHERE email = ?',
                [hashedPassword, email]
            );
            console.log('✅ Password updated for eric@eric.com');
        } else {
            // Create new user
            await pool.query(
                'INSERT INTO pastors (name, email, password, role) VALUES (?, ?, ?, ?)',
                ['Eric', email, hashedPassword, 'admin']
            );
            console.log('✅ Created new admin user eric@eric.com');
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

resetAdmin();
