const bcrypt = require('bcryptjs');
const pool = require('./config/database');
require('dotenv').config();

async function updateAdminCredentials() {
    try {
        console.log('Updating admin credentials...');

        const email = 'user@eric.com';
        const password = '123321';
        const name = 'Master Admin';

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Check if user exists
        const [existingUsers] = await pool.query(
            'SELECT id FROM pastors WHERE email = ?',
            [email]
        );

        if (existingUsers.length > 0) {
            // Update existing user
            await pool.query(
                'UPDATE pastors SET password = ?, name = ? WHERE email = ?',
                [hashedPassword, name, email]
            );
            console.log('✅ Updated existing admin credentials');
        } else {
            // Create new admin user
            await pool.query(
                'INSERT INTO pastors (name, email, password, role) VALUES (?, ?, ?, ?)',
                [name, email, hashedPassword, 'admin']
            );
            console.log('✅ Created new admin user');
        }

        console.log('\n=== Admin Credentials ===');
        console.log('Email:', email);
        console.log('Password:', password);
        console.log('========================\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error updating admin credentials:', error);
        process.exit(1);
    }
}

updateAdminCredentials();
