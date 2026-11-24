const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const ALLOWED_TYPES = ['income', 'expense'];

const has = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);

/**
 * @param {object} body
 * @param {{partial?: boolean}} opts  
 * @param {(id:number)=>boolean} categoryExists 
 * @returns {{errors: string[], data: object}}
 */

function validateTransactionPayload(body, { partial = false } = {}, categoryExists = () => true) {
  const errors = [];
  const data = {};

  if (!partial || has(body, 'amount')) {
    const amount = Number(body.amount);
    if (!Number.isFinite(amount) || amount <= 0) {
      errors.push('amount должен быть числом больше 0');
    } else {
      data.amount = amount;
    }
  }

  if (!partial || has(body, 'category_id')) {
    const categoryId = Number(body.category_id);
    if (!Number.isInteger(categoryId) || categoryId <= 0) {
      errors.push('category_id должен быть целым положительным числом');
    } else if (!categoryExists(categoryId)) {
      errors.push(`Категория с id=${categoryId} не существует`);
    } else {
      data.category_id = categoryId;
    }
  }

  if (!partial || has(body, 'date')) {
    const date = body.date;
    if (typeof date !== 'string' || !DATE_RE.test(date)) {
      errors.push('date должен быть строкой в формате YYYY-MM-DD');
    } else {
      data.date = date;
    }
  }

  if (has(body, 'comment')) {
    if (body.comment !== null && typeof body.comment !== 'string') {
      errors.push('comment должен быть строкой или null');
    } else {
      data.comment = body.comment;
    }
  }

  return { errors, data };
}

/**
 * @param {object} query
 * @returns {{errors: string[], filters: object}}
 */
function validateTransactionFilters(query = {}) {
  const errors = [];
  const filters = {};
  const { category_id, type, from, to } = query;

  if (category_id !== undefined) {
    const cid = Number(category_id);
    if (!Number.isInteger(cid) || cid <= 0) {
      errors.push('category_id должен быть положительным целым');
    } else {filters.category_id = cid;}
  }

  if (type !== undefined) {
    if (!ALLOWED_TYPES.includes(type)) {
      errors.push("type должен быть 'income' или 'expense'");
    } else {filters.type = type;}
  }

  if (from !== undefined) {
    if (!DATE_RE.test(from)) {
      errors.push('from должен быть в формате YYYY-MM-DD');
    } else {filters.from = from;}
  }

  if (to !== undefined) {
    if (!DATE_RE.test(to)) {
      errors.push('to должен быть в формате YYYY-MM-DD');
    } else {filters.to = to; }
  }
  return { errors, filters };
}

function validateId(rawId) {
  const id = Number(rawId);
  if (!Number.isInteger(id) || id <= 0) {
    return { error: 'id должен быть положительным целым' };
  }
  return { id };
}

module.exports = {
  validateTransactionPayload,
  validateTransactionFilters,
  validateId,
};