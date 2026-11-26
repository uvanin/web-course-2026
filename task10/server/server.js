const express = require('express');
const cors = require('cors');

const categoriesRouter = require('./routes/categories');
const transactionsRouter = require('./routes/transactions');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

// Роуты
app.use('/categories', categoriesRouter);
app.use('/transactions', transactionsRouter);

app.use((req, res) => {
  res.status(404).json({ error: `Роут ${req.method} ${req.originalUrl} не найден` });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

app.listen(PORT, () => {
  console.log(`Zen-Money server is running on http://localhost:${PORT}`);
});

app.use((err, req, res, next) => {
  console.error(err);
  
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Невалидный JSON в теле запроса' });
  }

  res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});