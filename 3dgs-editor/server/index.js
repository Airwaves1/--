const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
app.use(express.json());
app.use(cors());

// 连接 SQLite 数据库
const db = new sqlite3.Database('./database.db', (err) => {
  if (err) console.error(err.message);
  console.log('Connected to SQLite database');
});

// 初始化表结构
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS models (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      config TEXT,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )
  `);
});

// 注册接口
app.post('/api/register', (req, res) => {
  const { username, password } = req.body;
  
  db.get(
    'SELECT * FROM users WHERE username = ?', 
    [username],
    (err, row) => {
      if (row) return res.status(400).json({ error: 'Username exists' });
      
      db.run(
        'INSERT INTO users (username, password) VALUES (?, ?)',
        [username, password],
        function(err) {
          err ? res.status(500).send() : res.json({ userId: this.lastID })
        }
      );
    }
  );
});

// 登录接口
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  
  db.get(
    'SELECT * FROM users WHERE username = ? AND password = ?',
    [username, password],
    (err, row) => {
      if (!row) return res.status(401).json({ error: 'Invalid login' });
      res.json({ userId: row.id });
    }
  );
});

// 获取用户模型数据
app.get('/api/models', (req, res) => {
  const userId = req.headers['x-user-id'];
  
  db.all(
    'SELECT * FROM models WHERE user_id = ?',
    [userId],
    (err, rows) => {
      err ? res.status(500).send() : res.json(rows)
    }
  );
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`SQLite database file: ./database.db`);
});