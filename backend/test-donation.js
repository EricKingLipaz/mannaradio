const http = require('http');

const data = JSON.stringify({
    donor_name: 'Test Donor',
    amount: 100,
    type: 'Offering',
    payment_method: 'EFT',
    notes: 'Test donation'
});

const options = {
    hostname: 'localhost',
    port: 8000,
    path: '/api/donations/public',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = http.request(options, (res) => {
    console.log(`StatusCode: ${res.statusCode}`);

    res.on('data', (d) => {
        process.stdout.write(d);
    });
});

req.on('error', (error) => {
    console.error('Error:', error);
});

req.write(data);
req.end();
