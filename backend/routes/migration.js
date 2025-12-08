const express = require('express');
const pool = require('../config/database');

const router = express.Router();

// Migration endpoint - adds role column and sets admin
router.post('/add-role-column', async (req, res) => {
    try {
        console.log('Running migration: Adding role column...');

        // Try to add role column
        try {
            await pool.query(`
                ALTER TABLE pastors 
                ADD COLUMN role ENUM('admin', 'moderator') DEFAULT 'moderator'
            `);
            console.log('✓ Role column added');
        } catch (err) {
            if (err.code === 'ER_DUP_FIELDNAME') {
                console.log('✓ Role column already exists');
            } else {
                throw err;
            }
        }

        // Update user@eric.com to admin
        const [updateResult] = await pool.query(
            'UPDATE pastors SET role = ? WHERE email = ?',
            ['admin', 'user@eric.com']
        );

        // Get all users to show current state
        const [users] = await pool.query(
            'SELECT id, name, email, role, created_at FROM pastors'
        );

        res.json({
            success: true,
            message: 'Migration completed successfully',
            updated: updateResult.affectedRows,
            users: users
        });

    } catch (error) {
        console.error('Migration error:', error);
        res.status(500).json({
            success: false,
            error: error.message,
            code: error.code
        });
    }
});

// Check current users and their roles
router.get('/check-roles', async (req, res) => {
    try {
        const [users] = await pool.query(
            'SELECT id, name, email, role, created_at FROM pastors'
        );
        res.json({ users });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
