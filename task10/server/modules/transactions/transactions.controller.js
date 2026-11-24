const repo = require('./transactions.repository');
const {
  validateTransactionPayload,
  validateTransactionFilters,
  validateId,
} = require('./transactions.validation');

function list(req, res) {
  try {
    const { errors, filters } = validateTransactionFilters(req.query);
    if (errors.length) return res.status(400).json({ error: errors.join('; ') });

    const rows = repo.findAll(filters);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

function create(req, res) {
  try {
    const { errors, data } = validateTransactionPayload(
      req.body || {},
      {},
      repo.categoryExists
    );
    if (errors.length) return res.status(400).json({ error: errors.join('; ') });

    const created = repo.insert(data);
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

function update(req, res) {
  try {
    const idCheck = validateId(req.params.id);
    if (idCheck.error) return res.status(400).json({ error: idCheck.error });

    const existing = repo.findById(idCheck.id);
    if (!existing) {
      return res.status(404).json({ error: `Операция с id=${idCheck.id} не найдена` });
    }

    const { errors, data } = validateTransactionPayload(
      req.body || {},
      { partial: true },
      repo.categoryExists
    );
    if (errors.length) return res.status(400).json({ error: errors.join('; ') });

    const merged = {
      amount: data.amount !== undefined ? data.amount : existing.amount,
      category_id:
        data.category_id !== undefined ? data.category_id : existing.category_id,
      date: data.date !== undefined ? data.date : existing.date,
      comment: data.comment !== undefined ? data.comment : existing.comment,
    };

    const updated = repo.update(idCheck.id, merged);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

function remove(req, res) {
  try {
    const idCheck = validateId(req.params.id);
    if (idCheck.error) return res.status(400).json({ error: idCheck.error });

    const deleted = repo.remove(idCheck.id);
    if (!deleted) {
      return res.status(404).json({ error: `Операция с id=${idCheck.id} не найдена` });
    }

    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { list, create, update, remove };