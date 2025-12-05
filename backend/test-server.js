console.log('Starting server...');

try {
    const express = require('express');
    console.log('Express loaded');

    const app = express();
    console.log('App created');

    app.get('/', (req, res) => {
        res.json({ message: 'Hello' });
    });

    app.listen(5000, () => {
        console.log('Server running on port 5000');
    });
} catch (error) {
    console.error('Error:', error);
}
