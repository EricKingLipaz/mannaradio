const pool = require('./config/database');
require('dotenv').config();

async function addRoleColumn() {
    try {
        console.log('Adding role column to pastors table...\n');

        // Add role column if it doesn't exist
        await pool.query(`
            ALTER TABLE pastors 
            ADD COLUMN role ENUM('admin', 'moderator') DEFAULT 'moderator'
        `).catch(err => {
            if (err.code === 'ER_DUP_FIELDNAME') {
                console.log('✓ Role column already exists');
            } else {
                throw err;
            }
        });

        console.log('✓ Role column added/verified\n');

        // Update user@eric.com to admin
        console.log('Setting user@eric.com as admin...');
        const [result] = await pool.query(
            'UPDATE pastors SET role = ? WHERE email = ?',
            ['admin', 'user@eric.com']
        );

        if (result.affectedRows > 0) {
            console.log('✓ Successfully set user@eric.com as admin!\n');
        } else {
            console.log('⚠ user@eric.com not found in database\n');
        }

        // Show all users
        console.log('Current users:');
        const [users] = await pool.query('SELECT id, name, email, role, created_at FROM pastors');
        console.table(users);

        await pool.end();
        console.log('\n✓ Migration completed successfully!');
    } catch (error) {
        console.error('Error:', error.message);
        console.error('Code:', error.code);
        await pool.end();
        process.exit(1);
    }
}

addRoleColumn();
