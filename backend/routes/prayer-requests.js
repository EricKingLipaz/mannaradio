const express = require('express');
const pool = require('../config/database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get all prayer requests (protected)
router.get('/', authMiddleware, async (req, res) => {
    try {
        const { status, urgent, count } = req.query;

        // If just counting
        if (count === 'true') {
            let query = 'SELECT COUNT(*) as total FROM prayer_requests WHERE 1=1';
            const params = [];

            if (urgent === 'true') {
                query += ' AND is_urgent = 1';
            }

            const [result] = await pool.query(query, params);
            return res.json({ count: result[0].total });
        }

        let query = 'SELECT * FROM prayer_requests WHERE 1=1';
        const params = [];

        // Status filter
        if (status) {
            query += ' AND status = ?';
            params.push(status);
        }

        // Urgent filter
        if (urgent === 'true') {
            query += ' AND is_urgent = 1';
        }

        query += ' ORDER BY created_at DESC';

        const [requests] = await pool.query(query, params);
        res.json({ prayer_requests: requests });
    } catch (error) {
        console.error('Get prayer requests error:', error);
        res.status(500).json({ error: 'Failed to get prayer requests' });
    }
});

// Get single prayer request (protected)
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const [requests] = await pool.query(
            'SELECT * FROM prayer_requests WHERE id = ?',
            [req.params.id]
        );

        if (requests.length === 0) {
            return res.status(404).json({ error: 'Prayer request not found' });
        }

        res.json({ prayer_request: requests[0] });
    } catch (error) {
        console.error('Get prayer request error:', error);
        res.status(500).json({ error: 'Failed to get prayer request' });
    }
});

// Create new prayer request (public)
router.post('/', async (req, res) => {
    try {
        const {
            full_name,
            email,
            phone,
            prayer_request,
            is_urgent
        } = req.body;

        // Validate required fields
        if (!full_name || !email || !phone || !prayer_request) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Insert prayer request
        const [result] = await pool.query(
            `INSERT INTO prayer_requests (full_name, email, phone, prayer_request, is_urgent)
       VALUES (?, ?, ?, ?, ?)`,
            [full_name, email, phone, prayer_request, is_urgent || false]
        );

        res.status(201).json({
            message: 'Prayer request submitted successfully',
            prayer_request: { id: result.insertId, full_name, email }
        });
    } catch (error) {
        console.error('Create prayer request error:', error);
        res.status(500).json({ error: 'Failed to submit prayer request' });
    }
});

// Update prayer request status (protected)
router.put('/:id/status', authMiddleware, async (req, res) => {
    try {
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ error: 'Status is required' });
        }

        await pool.query(
            'UPDATE prayer_requests SET status = ? WHERE id = ?',
            [status, req.params.id]
        );

        res.json({ message: 'Status updated successfully' });
    } catch (error) {
        console.error('Update status error:', error);
        res.status(500).json({ error: 'Failed to update status' });
    }
});

// Reply to prayer request (protected)
router.put('/:id/reply', authMiddleware, async (req, res) => {
    try {
        const { reply_text, send_email } = req.body;

        if (!reply_text) {
            return res.status(400).json({ error: 'Reply text is required' });
        }

        // Update prayer request
        await pool.query(
            `UPDATE prayer_requests 
       SET pastor_reply = ?, replied_at = NOW(), replied_by_pastor_id = ?
       WHERE id = ?`,
            [reply_text, req.pastor.id, req.params.id]
        );

        // Insert into replies table
        await pool.query(
            `INSERT INTO prayer_request_replies (prayer_request_id, pastor_id, reply_text, email_sent)
       VALUES (?, ?, ?, ?)`,
            [req.params.id, req.pastor.id, reply_text, send_email || false]
        );

        // TODO: Implement email sending if send_email is true
        if (send_email) {
            // Email sending logic would go here
            console.log('Email sending not yet implemented');
        }

        res.json({ message: 'Reply saved successfully' });
    } catch (error) {
        console.error('Reply error:', error);
        res.status(500).json({ error: 'Failed to save reply' });
    }
});

module.exports = router;
