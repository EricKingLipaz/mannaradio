const http = require('http');

async function testChat() {
    const postData = JSON.stringify({
        username: 'TestBot',
        message: 'Hello form test script (native http)',
        message_type: 'text'
    });

    const postOptions = {
        hostname: 'localhost',
        port: 8000,
        path: '/api/chat/messages',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': postData.length
        }
    };

    console.log('Testing Chat API (native)...');

    // 1. Post a message
    const postReq = http.request(postOptions, (res) => {
        console.log(`POST Status: ${res.statusCode}`);
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
            console.log(`POST Body: ${chunk}`);
        });
        res.on('end', () => {
            // 2. Get messages
            getMessages();
        });
    });

    postReq.on('error', (e) => {
        console.error(`problem with POST request: ${e.message}`);
    });

    postReq.write(postData);
    postReq.end();
}

function getMessages() {
    const getOptions = {
        hostname: 'localhost',
        port: 8000,
        path: '/api/chat/messages?limit=5',
        method: 'GET'
    };

    const getReq = http.request(getOptions, (res) => {
        console.log(`GET Status: ${res.statusCode}`);
        res.setEncoding('utf8');
        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });
        res.on('end', () => {
            console.log(`GET Body: ${data}`);
        });
    });

    getReq.on('error', (e) => {
        console.error(`problem with GET request: ${e.message}`);
    });

    getReq.end();
}

testChat();
