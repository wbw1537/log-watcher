const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 8081;
const LOGS_DIR = path.join(__dirname, 'logs');

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Helper function to get log files from the logs directory
function getLogFiles() {
    try {
        return fs.readdirSync(LOGS_DIR).filter(file => fs.statSync(path.join(LOGS_DIR, file)).isFile());
    } catch (err) {
        console.error('Error reading logs directory:', err.message);
        return [];
    }
}

// API route to get the list of log files
app.get('/api/logs', (req, res) => {
    res.json({ files: getLogFiles() });
});

// Route to view file contents
app.get('/api/view', (req, res) => {
    const fileName = req.query.file;

    if (!fileName) {
        return res.status(400).send('No file specified.');
    }

    const filePath = path.join(LOGS_DIR, fileName);

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send(`Error reading file: ${err.message}`);
        }

        res.json({ content: data });
    });
});

// Serve the index.html file for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
