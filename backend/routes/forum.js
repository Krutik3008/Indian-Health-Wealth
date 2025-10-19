const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const router = express.Router();

// Create database connection with proper path
const dbPath = path.join(__dirname, '..', 'users.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to forum database');
  }
});

// Initialize forum table
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS forum_posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT DEFAULT 'general',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
  )`, (err) => {
    if (err) {
      console.error('Error creating forum_posts table:', err.message);
    } else {
      console.log('Forum posts table ready');
    }
  });
});

// Get all posts
router.get('/', (req, res) => {
  const query = `
    SELECT p.*, COALESCE(u.name, 'Anonymous') as author_name 
    FROM forum_posts p 
    LEFT JOIN users u ON p.user_id = u.id 
    ORDER BY p.created_at DESC
  `;
  
  db.all(query, (err, rows) => {
    if (err) {
      console.error('Get posts error:', err.message);
      res.status(500).json({ error: err.message });
    } else {
      console.log('Retrieved posts:', rows.length);
      res.json(rows);
    }
  });
});

// Create new post
router.post('/', (req, res) => {
  console.log('Forum POST request:', req.body);
  console.log('Session userId:', req.session.userId);
  
  // For now, use a default user ID if no session (for testing)
  const userId = req.session.userId || 1;
  
  const { title, content, category } = req.body;
  
  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required' });
  }
  
  // First ensure we have a user in the database
  db.get('SELECT id FROM users WHERE id = ?', [userId], (err, user) => {
    if (err) {
      console.error('User lookup error:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (!user) {
      // Create a default user for testing
      db.run(
        'INSERT OR IGNORE INTO users (id, email, password, name) VALUES (?, ?, ?, ?)',
        [1, 'test@example.com', 'hashed_password', 'Test User'],
        function(insertErr) {
          if (insertErr) {
            console.error('User creation error:', insertErr.message);
            return res.status(500).json({ error: 'User creation failed' });
          }
          createPost();
        }
      );
    } else {
      createPost();
    }
  });
  
  function createPost() {
    db.run(
      'INSERT INTO forum_posts (user_id, title, content, category, created_at) VALUES (?, ?, ?, ?, ?)',
      [userId, title, content, category || 'general', new Date().toISOString()],
      function(err) {
        if (err) {
          console.error('Database error:', err.message);
          res.status(500).json({ error: err.message });
        } else {
          console.log('Post created with ID:', this.lastID);
          res.json({ 
            id: this.lastID, 
            message: 'Post created successfully' 
          });
        }
      }
    );
  }
});

// Delete post
router.delete('/:id', (req, res) => {
  const postId = req.params.id;
  console.log('DELETE route hit for post ID:', postId);
  
  db.run('DELETE FROM forum_posts WHERE id = ?', [postId], function(err) {
    if (err) {
      console.error('Delete error:', err.message);
      return res.status(500).json({ error: err.message });
    }
    
    console.log('Delete changes:', this.changes);
    if (this.changes === 0) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    res.json({ message: 'Post deleted successfully' });
  });
});

module.exports = router;