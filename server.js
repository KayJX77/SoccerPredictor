const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 5000;

// Serve static files from public directory
app.use(express.static('public'));

// API endpoints for data
app.get('/api/matches', (req, res) => {
    try {
        const matches = JSON.parse(fs.readFileSync('./data/matches.json', 'utf8'));
        res.json(matches);
    } catch (error) {
        res.status(500).json({ error: 'Failed to load matches data' });
    }
});

app.get('/api/leagues', (req, res) => {
    try {
        const leagues = JSON.parse(fs.readFileSync('./data/leagues.json', 'utf8'));
        res.json(leagues);
    } catch (error) {
        res.status(500).json({ error: 'Failed to load leagues data' });
    }
});

app.get('/api/standings', (req, res) => {
    try {
        const standings = JSON.parse(fs.readFileSync('./data/standings.json', 'utf8'));
        res.json(standings);
    } catch (error) {
        res.status(500).json({ error: 'Failed to load standings data' });
    }
});

app.get('/api/players', (req, res) => {
    try {
        const players = JSON.parse(fs.readFileSync('./data/players.json', 'utf8'));
        res.json(players);
    } catch (error) {
        res.status(500).json({ error: 'Failed to load players data' });
    }
});

// Serve main application - using exact route instead of wildcard to avoid path parsing issues
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Synapse Soccer Prophet server running on http://0.0.0.0:${PORT}`);
});
