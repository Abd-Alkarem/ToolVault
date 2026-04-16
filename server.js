const express = require('express');
const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.static(__dirname, {
    index: 'index.html',
    extensions: ['html']
}));

// Ensure data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

// Database setup
const db = new Database(path.join(dataDir, 'toolvault.db'));
db.pragma('journal_mode = WAL');
db.exec('CREATE TABLE IF NOT EXISTS kv_store (key TEXT PRIMARY KEY, value TEXT NOT NULL)');

// Prepared statements
const getAll = db.prepare('SELECT key, value FROM kv_store');
const getOne = db.prepare('SELECT value FROM kv_store WHERE key = ?');
const upsert = db.prepare('INSERT OR REPLACE INTO kv_store (key, value) VALUES (?, ?)');
const deleteOne = db.prepare('DELETE FROM kv_store WHERE key = ?');

// API Routes

// Get all stored data
app.get('/api/store', (req, res) => {
    try {
        const rows = getAll.all();
        const data = {};
        rows.forEach(r => {
            try { data[r.key] = JSON.parse(r.value); }
            catch (e) { data[r.key] = r.value; }
        });
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get a specific key
app.get('/api/store/:key', (req, res) => {
    try {
        const row = getOne.get(req.params.key);
        if (!row) return res.status(404).json({ error: 'Not found' });
        try { res.json(JSON.parse(row.value)); }
        catch (e) { res.json(row.value); }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Set a specific key
app.put('/api/store/:key', (req, res) => {
    try {
        upsert.run(req.params.key, JSON.stringify(req.body.value));
        res.json({ ok: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Bulk set multiple keys
app.post('/api/store/bulk', (req, res) => {
    try {
        const transaction = db.transaction((items) => {
            for (const [key, value] of Object.entries(items)) {
                upsert.run(key, JSON.stringify(value));
            }
        });
        transaction(req.body);
        res.json({ ok: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a key
app.delete('/api/store/:key', (req, res) => {
    try {
        deleteOne.run(req.params.key);
        res.json({ ok: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// SPA fallback
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`ToolVault server running on http://localhost:${PORT}`);
});
