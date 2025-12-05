const express = require('express');
const pool = require('../config/database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get all donations (protected)
router.get('/', authMiddleware, async (req, res) => {
    try {
        const { type, startDate, endDate, limit } = req.query;

        let query = `
            SELECT d.*, m.full_name as member_name 
            FROM donations d 
            LEFT JOIN members m ON d.member_id = m.id 
            WHERE 1=1
        `;
        const params = [];

        if (type && type !== 'all') {
            query += ' AND d.type = ?';
            params.push(type);
        }

        if (startDate) {
            query += ' AND d.date >= ?';
            params.push(startDate);
        }

        if (endDate) {
            query += ' AND d.date <= ?';
            params.push(endDate);
        }

        query += ' ORDER BY d.date DESC, d.created_at DESC';

        if (limit) {
            query += ' LIMIT ?';
            params.push(parseInt(limit));
        }

        const [donations] = await pool.query(query, params);
        res.json({ donations });
    } catch (error) {
        console.error('Get donations error:', error);
        res.status(500).json({ error: 'Failed to get donations' });
    }
});

// Get donation stats (protected)
router.get('/stats', authMiddleware, async (req, res) => {
    try {
        const [stats] = await pool.query(`
            SELECT 
                type, 
                SUM(amount) as total, 
                COUNT(*) as count 
            FROM donations 
            GROUP BY type
        `);

        // Format stats into an object
        const formattedStats = {
            totalTithe: 0,
            totalOffering: 0,
            totalDonation: 0,
            recentTotal: 0
        };

        stats.forEach(stat => {
            if (stat.type === 'Tithe') formattedStats.totalTithe = parseFloat(stat.total) || 0;
            if (stat.type === 'Offering') formattedStats.totalOffering = parseFloat(stat.total) || 0;
            if (stat.type === 'Donation') formattedStats.totalDonation = parseFloat(stat.total) || 0;
        });

        // Get total for current month
        const [monthStats] = await pool.query(`
            SELECT SUM(amount) as total 
            FROM donations 
            WHERE MONTH(date) = MONTH(CURRENT_DATE()) 
            AND YEAR(date) = YEAR(CURRENT_DATE())
        `);

        formattedStats.recentTotal = parseFloat(monthStats[0].total) || 0;

        res.json({ stats: formattedStats });
    } catch (error) {
        console.error('Get donation stats error:', error);
        res.status(500).json({ error: 'Failed to get donation stats' });
    }
});

// Create new donation (protected)
router.post('/', authMiddleware, async (req, res) => {
    try {
        const {
            member_id,
            donor_name,
            amount,
            type,
            payment_method,
            notes,
            date
        } = req.body;

        if (!amount || !type || !date) {
            return res.status(400).json({ error: 'Amount, type, and date are required' });
        }

        // If member_id is provided, verify member exists
        if (member_id) {
            const [members] = await pool.query('SELECT id FROM members WHERE id = ?', [member_id]);
            if (members.length === 0) {
                return res.status(400).json({ error: 'Invalid member ID' });
            }
        }

        const [result] = await pool.query(
            `INSERT INTO donations (member_id, donor_name, amount, type, payment_method, notes, date)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [member_id || null, donor_name || null, amount, type, payment_method || 'Cash', notes || null, date]
        );

        res.status(201).json({
            message: 'Donation recorded successfully',
            donation: { id: result.insertId, amount, type, date }
        });
    } catch (error) {
        console.error('Create donation error:', error);
        res.status(500).json({ error: 'Failed to record donation' });
    }
});

// Create new donation (public)
router.post('/public', async (req, res) => {
    try {
        const {
            donor_name,
            amount,
            type,
            payment_method,
            notes
        } = req.body;

        if (!amount || !type) {
            return res.status(400).json({ error: 'Amount and type are required' });
        }

        const date = new Date().toISOString().split('T')[0];

        const [result] = await pool.query(
            `INSERT INTO donations (donor_name, amount, type, payment_method, notes, date)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [donor_name || 'Anonymous', amount, type, payment_method || 'Cash', notes || null, date]
        );

        res.status(201).json({
            message: 'Donation recorded successfully',
            donation: { id: result.insertId, amount, type, date }
        });
    } catch (error) {
        console.error('Create public donation error:', error);
        res.status(500).json({ error: 'Failed to record donation' });
    }
});

module.exports = router;
