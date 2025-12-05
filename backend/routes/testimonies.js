const express = require('express');
const pool = require('../config/database');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Middleware to verify token (simplified version of auth middleware)
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Access denied' });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).json({ error: 'Invalid token' });
    }
};

// GET /api/testimonies (Public) - Get approved testimonies
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query(
            "SELECT * FROM testimonies WHERE status = 'approved' ORDER BY created_at DESC"
        );
        res.json(rows);
    } catch (error) {
        console.error('Error fetching public testimonies:', error);
        res.status(500).json({ error: 'Failed to fetch testimonies' });
    }
});

// POST /api/testimonies (Public) - Submit testimony
router.post('/', async (req, res) => {
    try {
        const { full_name, location, content } = req.body;
        if (!full_name || !content) {
            return res.status(400).json({ error: 'Name and content are required' });
        }

        const [result] = await pool.query(
            "INSERT INTO testimonies (full_name, location, content, status) VALUES (?, ?, ?, 'pending')",
            [full_name, location, content]
        );

        res.status(201).json({
            message: 'Testimony submitted successfully and is pending approval',
            id: result.insertId
        });
    } catch (error) {
        console.error('Error submitting testimony:', error);
        res.status(500).json({ error: 'Failed to submit testimony' });
    }
});

// GET /api/testimonies/admin (Protected) - Get all testimonies
router.get('/admin', verifyToken, async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM testimonies ORDER BY created_at DESC");
        res.json(rows);
    } catch (error) {
        console.error('Error fetching admin testimonies:', error);
        res.status(500).json({ error: 'Failed to fetch testimonies' });
    }
});

// PUT /api/testimonies/:id/status (Protected) - Update status
router.put('/:id/status', verifyToken, async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['pending', 'approved', 'declined'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        await pool.query(
            "UPDATE testimonies SET status = ? WHERE id = ?",
            [status, req.params.id]
        );
        res.json({ message: 'Status updated successfully' });
    } catch (error) {
        console.error('Error updating testimony status:', error);
        res.status(500).json({ error: 'Failed to update status' });
    }
});

// DELETE /api/testimonies/:id (Protected) - Delete testimony
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        await pool.query("DELETE FROM testimonies WHERE id = ?", [req.params.id]);
        res.json({ message: 'Testimony deleted successfully' });
    } catch (error) {
        console.error('Error deleting testimony:', error);
        res.status(500).json({ error: 'Failed to delete testimony' });
    }
});

module.exports = router;
