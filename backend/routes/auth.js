const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Register pastor
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validate input
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }

        // Check if email already exists
        const [existingPastors] = await pool.query(
            'SELECT id FROM pastors WHERE email = ?',
            [email]
        );

        if (existingPastors.length > 0) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert pastor
        const [result] = await pool.query(
            'INSERT INTO pastors (name, email, password) VALUES (?, ?, ?)',
            [name, email, hashedPassword]
        );

        // Generate JWT token
        const token = jwt.sign(
            { id: result.insertId, email, name, role: 'moderator' }, // Default role for new registration (if we keep it public?) actually let's set it
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.status(201).json({
            message: 'Pastor registered successfully',
            token,
            pastor: { id: result.insertId, name, email, role: 'moderator' }
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ error: 'Failed to register pastor' });
    }
});

// Login pastor
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Find pastor
        const [pastors] = await pool.query(
            'SELECT * FROM pastors WHERE email = ?',
            [email]
        );

        if (pastors.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const pastor = pastors[0];

        // Verify password
        const isValidPassword = await bcrypt.compare(password, pastor.password);

        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: pastor.id, email: pastor.email, name: pastor.name, role: pastor.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.json({
            message: 'Login successful',
            token,
            pastor: { id: pastor.id, name: pastor.name, email: pastor.email, role: pastor.role }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Failed to login' });
    }
});

// Get current pastor (protected)
router.get('/me', authMiddleware, async (req, res) => {
    try {
        const [pastors] = await pool.query(
            'SELECT id, name, email, role, created_at FROM pastors WHERE id = ?',
            [req.pastor.id]
        );

        if (pastors.length === 0) {
            return res.status(404).json({ error: 'Pastor not found' });
        }

        res.json({ pastor: pastors[0] });
    } catch (error) {
        console.error('Get pastor error:', error);
        res.status(500).json({ error: 'Failed to get pastor info' });
    }
});

// Change password (protected)
router.put('/change-password', authMiddleware, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: 'Current and new passwords are required' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ error: 'New password must be at least 6 characters' });
        }

        // Get current pastor
        const [pastors] = await pool.query(
            'SELECT password FROM pastors WHERE id = ?',
            [req.pastor.id]
        );

        if (pastors.length === 0) {
            return res.status(404).json({ error: 'Pastor not found' });
        }

        // Verify current password
        const isValidPassword = await bcrypt.compare(currentPassword, pastors[0].password);

        if (!isValidPassword) {
            return res.status(401).json({ error: 'Current password is incorrect' });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password
        await pool.query(
            'UPDATE pastors SET password = ? WHERE id = ?',
            [hashedPassword, req.pastor.id]
        );

        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ error: 'Failed to change password' });
    }
});

// Create new user (Admin only)
router.post('/users', authMiddleware, async (req, res) => {
    try {
        // Check if requester is admin
        if (req.pastor.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied. Admin role required.' });
        }

        const { name, email, password, role } = req.body;

        // Validate input
        if (!name || !email || !password || !role) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }

        if (!['admin', 'moderator'].includes(role)) {
            return res.status(400).json({ error: 'Invalid role' });
        }

        // Check if email already exists
        const [existingPastors] = await pool.query(
            'SELECT id FROM pastors WHERE email = ?',
            [email]
        );

        if (existingPastors.length > 0) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert pastor
        const [result] = await pool.query(
            'INSERT INTO pastors (name, email, password, role) VALUES (?, ?, ?, ?)',
            [name, email, hashedPassword, role]
        );

        res.status(201).json({
            message: 'User created successfully',
            user: { id: result.insertId, name, email, role }
        });
    } catch (error) {
        console.error('Create user error:', error);
        res.status(500).json({ error: 'Failed to create user' });
    }
});

// Get all users (Admin only)
router.get('/users', authMiddleware, async (req, res) => {
    try {
        if (req.pastor.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied' });
        }
        const [users] = await pool.query('SELECT id, name, email, role, created_at FROM pastors');
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

module.exports = router;
