const pool = require('./config/database');

async function checkAndFixAdmin() {
    try {
        console.log('Checking users in database...\n');

        // Get all users
        const [users] = await pool.query('SELECT id, name, email, role FROM pastors');

        console.log('Current users:');
        console.table(users);

        // Check if user@eric.com exists
        const [ericUsers] = await pool.query('SELECT id, role FROM pastors WHERE email = ?', ['user@eric.com']);

        if (ericUsers.length > 0) {
            const user = ericUsers[0];
            if (user.role !== 'admin') {
                console.log('\nUpdating user@eric.com to admin role...');
                await pool.query('UPDATE pastors SET role = ? WHERE email = ?', ['admin', 'user@eric.com']);
                console.log('✓ Successfully updated to admin!');
            } else {
                console.log('\n✓ user@eric.com already has admin role');
            }
        } else {
            console.log('\n⚠ user@eric.com not found in database');
        }

        // Show updated users
        console.log('\nUpdated users:');
        const [updatedUsers] = await pool.query('SELECT id, name, email, role FROM pastors');
        console.table(updatedUsers);

        await pool.end();
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

checkAndFixAdmin();
