const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const router = express.Router();

const db = new sqlite3.Database('./users.db');

// Get all users
router.get('/users', (req, res) => {
  db.all('SELECT id, email, name, created_at FROM users', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// Get all assessments with user info
router.get('/assessments', (req, res) => {
  const query = `
    SELECT a.*, u.name, u.email 
    FROM assessments a 
    JOIN users u ON a.user_id = u.id 
    ORDER BY a.created_at DESC
  `;
  
  db.all(query, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows.map(row => ({
        ...row,
        responses: JSON.parse(row.responses)
      })));
    }
  });
});

module.exports = router;