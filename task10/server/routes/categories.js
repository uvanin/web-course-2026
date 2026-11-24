const express = require('express');
const db = require('../db');
const router = express.Router();

const ALLOWED_TYPES = ['income', 'expense'];

router.get('/', (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM categories ORDER BY id').all();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /categories
router.post('/', (req, res) => {
  try {
    const { name, type } = req.body || {};

    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'Поле name обязательно и должно быть непустой строкой' });
    }
    if (!ALLOWED_TYPES.includes(type)) {
      return res.status(400).json({ error: "Поле type должно быть 'income' или 'expense'" });
    }

    const info = db
      .prepare('INSERT INTO categories (name, type) VALUES (?, ?)')
      .run(name.trim(), type);

    const created = db
      .prepare('SELECT * FROM categories WHERE id = ?')
      .get(info.lastInsertRowid);

    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;