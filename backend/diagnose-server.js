const { exec } = require('child_process');
const path = require('path');

console.log('=== Testing Backend Server Startup ===');
console.log('Current directory:', process.cwd());
console.log('Node version:', process.version);

// Try to require the server file
try {
    console.log('\nAttempting to load server.js...');
    require('./server.js');
} catch (error) {
    console.error('\n❌ ERROR LOADING SERVER:');
    console.error('Message:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
}
