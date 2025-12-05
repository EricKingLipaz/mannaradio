const express = require('express');
const pool = require('../config/database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get all members (protected)
router.get('/', authMiddleware, async (req, res) => {
    try {
        const { search, rank, count } = req.query;

        // If just counting
        if (count === 'true') {
            const [result] = await pool.query('SELECT COUNT(*) as total FROM members');
            return res.json({ count: result[0].total });
        }

        let query = 'SELECT * FROM members WHERE 1=1';
        const params = [];

        // Search filter
        if (search) {
            query += ' AND (full_name LIKE ? OR email LIKE ? OR phone LIKE ?)';
            params.push(`%${search}%`, `%${search}%`, `%${search}%`);
        }

        // Rank filter
        if (rank) {
            query += ' AND rank = ?';
            params.push(rank);
        }

        query += ' ORDER BY created_at DESC';

        const [members] = await pool.query(query, params);
        res.json({ members });
    } catch (error) {
        console.error('Get members error:', error);
        res.status(500).json({ error: 'Failed to get members' });
    }
});

// Get single member (protected)
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const [members] = await pool.query(
            'SELECT * FROM members WHERE id = ?',
            [req.params.id]
        );

        if (members.length === 0) {
            return res.status(404).json({ error: 'Member not found' });
        }

        res.json({ member: members[0] });
    } catch (error) {
        console.error('Get member error:', error);
        res.status(500).json({ error: 'Failed to get member' });
    }
});

// Create new member (public)
router.post('/', async (req, res) => {
    try {
        const {
            full_name,
            email,
            phone,
            address,
            date_of_birth,
            baptism_date,
            rank
        } = req.body;

        // Validate required fields
        if (!full_name || !email || !phone || !address) {
            return res.status(400).json({ error: 'All required fields must be filled' });
        }

        // Insert member
        const [result] = await pool.query(
            `INSERT INTO members (full_name, email, phone, address, date_of_birth, baptism_date, rank)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [full_name, email, phone, address, date_of_birth || null, baptism_date || null, rank || 'Member']
        );

        res.status(201).json({
            message: 'Member registered successfully',
            member: { id: result.insertId, full_name, email, phone }
        });
    } catch (error) {
        console.error('Create member error:', error);
        res.status(500).json({ error: 'Failed to create member' });
    }
});

// Update member (protected)
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const {
            full_name,
            email,
            phone,
            address,
            date_of_birth,
            baptism_date,
            rank
        } = req.body;

        await pool.query(
            `UPDATE members 
       SET full_name = ?, email = ?, phone = ?, address = ?, 
           date_of_birth = ?, baptism_date = ?, rank = ?
       WHERE id = ?`,
            [full_name, email, phone, address, date_of_birth, baptism_date, rank, req.params.id]
        );

        res.json({ message: 'Member updated successfully' });
    } catch (error) {
        console.error('Update member error:', error);
        res.status(500).json({ error: 'Failed to update member' });
    }
});

// Delete member (protected)
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        await pool.query('DELETE FROM members WHERE id = ?', [req.params.id]);
        res.json({ message: 'Member deleted successfully' });
    } catch (error) {
        console.error('Delete member error:', error);
        res.status(500).json({ error: 'Failed to delete member' });
    }
});

module.exports = router;
