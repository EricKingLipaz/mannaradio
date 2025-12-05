const express = require('express');
const pool = require('../config/database');

const router = express.Router();

// Get recent chat messages (public)
router.get('/messages', async (req, res) => {
    try {
        const limit = req.query.limit || 50;

        const [messages] = await pool.query(
            'SELECT * FROM chat_messages ORDER BY created_at DESC LIMIT ?',
            [parseInt(limit)]
        );

        res.json({ messages: messages.reverse() });
    } catch (error) {
        console.error('Get chat messages error:', error);
        res.status(500).json({ error: 'Failed to get chat messages' });
    }
});

// Post new chat message (public)
router.post('/messages', async (req, res) => {
    try {
        const { username, message, message_type } = req.body;

        if (!username || !message) {
            return res.status(400).json({ error: 'Username and message are required' });
        }

        const [result] = await pool.query(
            'INSERT INTO chat_messages (username, message, message_type) VALUES (?, ?, ?)',
            [username, message, message_type || 'text']
        );

        res.status(201).json({
            message: 'Message posted successfully',
            chat_message: { id: result.insertId, username, message }
        });
    } catch (error) {
        console.error('Post chat message error:', error);
        res.status(500).json({ error: 'Failed to post message' });
    }
});

module.exports = router;
