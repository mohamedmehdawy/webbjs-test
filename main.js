const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express'); // Import express
const bodyParser = require('body-parser'); // For parsing JSON data

const app = express(); // Initialize express
const port = 8000; // Define the port

// Middleware to parse JSON data
app.use(bodyParser.json());

// Initialize WhatsApp client with local storage to save session
const client = new Client({
    authStrategy: new LocalAuth() // Automatically saves session data locally
});

// Generate QR code if no session exists
client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

// When the client is ready
client.on('ready', () => {
    console.log('WhatsApp Client is ready!');
});

// Endpoint to send a message
app.post('/send', (req, res) => {
    const { number, message, otb } = req.body;

    // Check if number and message are provided
    if (!number || !message) {
        return res.status(400).json({ error: 'Number and message are required.' });
    }

    // Send the message to the specified number
    client.sendMessage(`${number}@c.us`, `${message}, والكود بتاعك: ${otb}`)
        .then(response => {
            res.status(200).json({ success: true, response });
        })
        .catch(err => {
            res.status(500).json({ error: 'Error sending message', details: err });
        });
});

// Listening to all incoming messages
client.on('message_create', message => {
    console.log(message.body);
});

client.on('message_create', message => {
    if (message.body === '!ping') {
        // send back "pong" to the chat the message was sent in
        client.sendMessage(message.from, 'ازيك يا معلم');
    }
});

// Initialize the client
client.initialize();

// Start the express server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
