require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors()); 
app.use(express.json());

const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'task4_db',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const SECRET = process.env.JWT_SECRET || 'my_super_secret_key';

const checkStatus = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token' });

  try {
    const decoded = jwt.verify(token, SECRET);
    const [users] = await db.query('SELECT * FROM users WHERE id = ?', [decoded.id]);
    
    if (users.length === 0 || users[0].status === 'blocked') {
      return res.status(403).json({ message: 'Blocked or Deleted' });
    }
    req.user = users[0];
    next();
  } catch (e) { 
    res.status(401).json({ message: 'Invalid token' }); 
  }
};

app.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    await db.query('INSERT INTO users (name, email, password_hash, status) VALUES (?, ?, ?, "active")', [name, email, hash]);
    res.json({ message: 'Success' });
  } catch (e) {
    if (e.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'Email already exists' });
    }
    console.error(e);
    res.status(500).json({ message: 'Registration failed' });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    
    if (users.length === 0 || users[0].status === 'blocked') {
      return res.status(401).json({ message: 'Access denied or user blocked' });
    }

    const valid = await bcrypt.compare(password, users[0].password_hash);
    if (!valid) return res.status(401).json({ message: 'Wrong password' });

    await db.query('UPDATE users SET last_login = NOW() WHERE id = ?', [users[0].id]);
    const token = jwt.sign({ id: users[0].id }, SECRET);
    res.json({ token, user: users[0] });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Login error' });
  }
});

app.get('/users', checkStatus, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, name, email, last_login, status FROM users ORDER BY last_login DESC');
    res.json(rows);
  } catch (e) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

app.post('/users/action', checkStatus, async (req, res) => {
  try {
    const { ids, action } = req.body;
    if (!ids || ids.length === 0) return res.status(400).json({ message: 'No users selected' });

    if (action === 'delete') {
      await db.query('DELETE FROM users WHERE id IN (?)', [ids]);
    } else {
      await db.query('UPDATE users SET status = ? WHERE id IN (?)', [action, ids]);
    }
    res.json({ message: 'Success' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Action failed' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));