
const express = require('express');

const app = express();

const PORT = 3000;

// Home route
app.get('/', (req, res) => {
    res.status(200).send('Welcome to Sneha Goud Node.js Lab 1!');
});

// About route
app.get('/about', (req, res) => {
    res.status(200).json({
        name: 'Sneha Goud',
        section: 'AIDE-2A'
    });
});

// Time route
app.get('/time', (req, res) => {
    res.status(200).json({
        currentDateTime: new Date()
    });
});

// 404 route
app.use((req, res) => {
    res.status(404).send('404 - Page Not Found');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
