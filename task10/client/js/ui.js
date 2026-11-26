export function createUI(root = document) {
    const $ = (sel) => root.querySelector(sel);
    const byId = (id) => root.getElementById?.(id) ?? root.querySelector(`#${id}`);
  
    const fmtMoney = (v) =>
      new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        maximumFractionDigits: 2,
      }).format(v);
  
    function escapeHtml(str = '') {
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }
  
    function renderSummary({ income, expense, balance }) {
      byId('sum-income').textContent = fmtMoney(income);
      byId('sum-expense').textContent = fmtMoney(expense);
      byId('sum-balance').textContent = fmtMoney(balance);
    }
  
    function renderTransactions(transactions) {
      const list = byId('tx-list');
      const empty = byId('empty-state');
      list.innerHTML = '';
  
      if (!transactions.length) {
        empty.classList.remove('hidden');
        return;
      }
      empty.classList.add('hidden');
  
      for (const t of transactions) {
        const li = document.createElement('li');
        li.className = `tx-item ${t.category_type}`;
        li.dataset.id = t.id;
        const sign = t.category_type === 'income' ? '+' : '−';
        li.innerHTML = `
          <div class="tx-main">
            <span class="tx-title">${escapeHtml(t.category_name)}</span>
            <span class="tx-meta">${t.date}${t.comment ? ' · ' + escapeHtml(t.comment) : ''}</span>
          </div>
          <span class="tx-amount">${sign} ${fmtMoney(t.amount)}</span>
          <div class="tx-actions">
            <button class="btn" data-action="edit">Изменить</button>
            <button class="btn danger" data-action="delete">Удалить</button>
          </div>`;
        list.appendChild(li);
      }
    }
  
    function fillSelect(selectEl, categories, { withAll = false, type = null } = {}) {
      const prev = selectEl.value;
      const filtered = type ? categories.filter((c) => c.type === type) : categories;
      selectEl.innerHTML =
        (withAll ? '<option value="">Все</option>' : '') +
        filtered.map((c) => `<option value="${c.id}">${escapeHtml(c.name)}</option>`).join('');
      if ([...selectEl.options].some((o) => o.value === prev)) selectEl.value = prev;
    }
  
    function syncCategorySelects(categories, filters, formType) {
      fillSelect(byId('tx-category'), categories, { type: formType });
      fillSelect(byId('filter-category'), categories, { withAll: true });
      fillSelect(byId('edit-category'), categories);
      byId('filter-category').value = filters.category_id || '';
      byId('filter-type').value = filters.type || '';
      byId('filter-from').value = filters.from || '';
      byId('filter-to').value = filters.to || '';
    }
  
    function applyTheme(theme) {
      root.documentElement.dataset.theme = theme;
    }
  
    function showError(id, message) {
      const el = byId(id);
      if (!el) return;
      el.textContent = message;
      el.classList.remove('hidden');
    }
  
    function hideError(id) {
      const el = byId(id);
      if (!el) return;
      el.textContent = '';
      el.classList.add('hidden');
    }
  
    function openEditDialog(tx) {
      const form = byId('edit-form');
      form.amount.value = tx.amount;
      form.category_id.value = String(tx.category_id);
      form.date.value = tx.date;
      form.comment.value = tx.comment || '';
      hideError('edit-error');
      byId('edit-dialog').showModal();
    }
  
    function closeEditDialog() {
      byId('edit-dialog').close();
    }
  
    function resetTxForm() {
      const form = byId('tx-form');
      form.reset();
      form.date.value = new Date().toISOString().slice(0, 10);
    }
  
    function formDataToTx(fd) {
      return {
        amount: Number(fd.get('amount')),
        category_id: Number(fd.get('category_id')),
        date: fd.get('date'),
        comment: (fd.get('comment') || '').trim() || null,
      };
    }
  
    function bind(handlers) {
      const {
        onSubmitTransaction,
        onSubmitCategory,
        onTypeChange,
        onFilterChange,
        onResetFilters,
        onToggleTheme,
        onEditClick,
        onDeleteClick,
        onSubmitEdit,
        onCancelEdit,
      } = handlers;
  
      byId('tx-form').addEventListener('submit', (e) => {
        e.preventDefault();
        onSubmitTransaction(formDataToTx(new FormData(e.currentTarget)));
      });
      byId('tx-type').addEventListener('change', (e) => onTypeChange(e.target.value));
  
      byId('cat-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        onSubmitCategory({
          name: (fd.get('name') || '').trim(),
          type: fd.get('type'),
        });
      });
  
      ['filter-category', 'filter-type', 'filter-from', 'filter-to'].forEach((id) => {
        byId(id).addEventListener('change', () => {
          onFilterChange({
            category_id: byId('filter-category').value,
            type: byId('filter-type').value,
            from: byId('filter-from').value,
            to: byId('filter-to').value,
          });
        });
      });
      byId('filters-reset').addEventListener('click', onResetFilters);
      byId('theme-toggle').addEventListener('click', onToggleTheme);
  
      byId('tx-list').addEventListener('click', (e) => {
        const btn = e.target.closest('button[data-action]');
        if (!btn) return;
        const id = Number(btn.closest('.tx-item').dataset.id);
        if (btn.dataset.action === 'edit') onEditClick(id);
        else if (btn.dataset.action === 'delete') onDeleteClick(id);
      });
  
      byId('edit-form').addEventListener('submit', (e) => {
        e.preventDefault();
        onSubmitEdit(formDataToTx(new FormData(e.currentTarget)));
      });
      byId('edit-cancel').addEventListener('click', onCancelEdit);
    }
  
    return {
      renderSummary,renderTransactions,syncCategorySelects,applyTheme,
      showError,hideError,openEditDialog,closeEditDialog,resetTxForm, bind,
    };
  }