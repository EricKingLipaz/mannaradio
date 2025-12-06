// Wrapper to catch any errors from server.js
console.log('=== Starting Server Wrapper ===');
console.log('Node version:', process.version);
console.log('Working directory:', process.cwd());

// Catch all uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('\n❌ UNCAUGHT EXCEPTION:');
    console.error('Message:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
});

// Catch all unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('\n❌ UNHANDLED PROMISE REJECTION:');
    console.error('Reason:', reason);
    process.exit(1);
});

console.log('\nLoading server.js...');
try {
    require('./server.js');
    console.log('Server.js loaded successfully!');
} catch (error) {
    console.error('\n❌ ERROR REQUIRING SERVER.JS:');
    console.error('Message:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
}

console.log('Wrapper completed!');
