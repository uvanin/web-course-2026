const db = require('../../db');

const SELECT_WITH_CATEGORY = `
  SELECT t.id, t.amount, t.category_id, t.date, t.comment,
         c.name AS category_name, c.type AS category_type
  FROM transactions t
  JOIN categories c ON c.id = t.category_id
`;

function categoryExists(id) {
  const row = db.prepare('SELECT id FROM categories WHERE id = ?').get(id);
  return Boolean(row);
}

function findAll(filters = {}) {
  const where = [];
  const params = [];

  if (filters.category_id !== undefined) {
    where.push('t.category_id = ?');
    params.push(filters.category_id);
  }
  if (filters.type !== undefined) {
    where.push('c.type = ?');
    params.push(filters.type);
  }
  if (filters.from !== undefined) {
    where.push('t.date >= ?');
    params.push(filters.from);
  }
  if (filters.to !== undefined) {
    where.push('t.date <= ?');
    params.push(filters.to);
  }

  const sql = `
    ${SELECT_WITH_CATEGORY}
    ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
    ORDER BY t.date DESC, t.id DESC
  `;
  return db.prepare(sql).all(...params);
}

function findById(id) {
  return db.prepare(`${SELECT_WITH_CATEGORY} WHERE t.id = ?`).get(id);
}

function insert({ amount, category_id, date, comment }) {
  const info = db
    .prepare(
      'INSERT INTO transactions (amount, category_id, date, comment) VALUES (?, ?, ?, ?)'
    )
    .run(amount, category_id, date, comment ?? null);
  return findById(info.lastInsertRowid);
}

function update(id, { amount, category_id, date, comment }) {
  db.prepare(
    'UPDATE transactions SET amount = ?, category_id = ?, date = ?, comment = ? WHERE id = ?'
  ).run(amount, category_id, date, comment ?? null, id);
  return findById(id);
}

function remove(id) {
  const info = db.prepare('DELETE FROM transactions WHERE id = ?').run(id);
  return info.changes > 0;
}

module.exports = {
  categoryExists,
  findAll,
  findById,
  insert,
  update,
  remove,
};