export function createApp({ api, ui }) {
    const LS_KEYS = { filters: 'zen:filters', theme: 'zen:theme' };
  
    const state = {
      categories: [],
      transactions: [],
      filters: { category_id: '', type: '', from: '', to: '' },
      theme: 'light',
      formType: 'expense',
      editingId: null,
    };
  
    function restoreFromStorage() {
      try {
        const raw = localStorage.getItem(LS_KEYS.filters);
        if (raw) state.filters = { ...state.filters, ...JSON.parse(raw) };
      } catch {
        /* ignore */
      }
      state.theme = localStorage.getItem(LS_KEYS.theme) === 'dark' ? 'dark' : 'light';
    }
  
    function persistFilters() {
      localStorage.setItem(LS_KEYS.filters, JSON.stringify(state.filters));
    }
  
    function persistTheme() {
      localStorage.setItem(LS_KEYS.theme, state.theme);
    }

    function getSummary() {
      let income = 0;
      let expense = 0;
      for (const t of state.transactions) {
        if (t.category_type === 'income') income += t.amount;
        else expense += t.amount;
      }
      return { income, expense, balance: income - expense };
    }
  
    function render() {
      ui.syncCategorySelects(state.categories, state.filters, state.formType);
      ui.renderTransactions(state.transactions);
      ui.renderSummary(getSummary());
      ui.applyTheme(state.theme);
    }
  
    async function loadCategories() {
      try {
        state.categories = await api.getCategories();
        render();
      } catch (err) {
        ui.showError('list-error', `Не удалось загрузить категории: ${err.message}`);
      }
    }
  
    async function loadTransactions() {
      ui.hideError('list-error');
      try {
        state.transactions = await api.getTransactions(state.filters);
        render();
      } catch (err) {
        ui.showError('list-error', `Не удалось загрузить операции: ${err.message}`);
        state.transactions = [];
        render();
      }
    }
  
  
    function validateTransaction({ amount, category_id, date }) {
      if (!Number.isFinite(amount) || amount <= 0) {
        throw new Error('Сумма должна быть больше 0');
      }
      if (!category_id) throw new Error('Выберите категорию');
      if (!date) throw new Error('Укажите дату');
    }
  
    async function onSubmitTransaction(payload) {
      ui.hideError('form-error');
      try {
        validateTransaction(payload);
        await api.createTransaction(payload);
        ui.resetTxForm();
        await loadTransactions();
      } catch (err) {
        ui.showError('form-error', err.message);
      }
    }
  
    async function onSubmitCategory(payload) {
      ui.hideError('cat-error');
      if (!payload.name) {
        ui.showError('cat-error', 'Введите название');
        return;
      }
      try {
        await api.createCategory(payload);
        document.getElementById('cat-form').reset();
        await loadCategories();
      } catch (err) {
        ui.showError('cat-error', err.message);
      }
    }
  
    function onTypeChange(type) {
      state.formType = type;
      render();
    }
  
    async function onFilterChange(patch) {
      state.filters = { ...state.filters, ...patch };
      persistFilters();
      await loadTransactions();
    }
  
    async function onResetFilters() {
      state.filters = { category_id: '', type: '', from: '', to: '' };
      persistFilters();
      render();
      await loadTransactions();
    }
  
    function onToggleTheme() {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
      persistTheme();
      render();
    }
  
    function onEditClick(id) {
      const tx = state.transactions.find((t) => t.id === id);
      if (!tx) return;
      state.editingId = id;
      ui.openEditDialog(tx);
    }
  
    async function onDeleteClick(id) {
      if (!confirm('Удалить операцию?')) return;
      ui.hideError('list-error');
      try {
        await api.deleteTransaction(id);
        await loadTransactions();
      } catch (err) {
        ui.showError('list-error', err.message);
      }
    }
  
    async function onSubmitEdit(payload) {
      ui.hideError('edit-error');
      try {
        validateTransaction(payload);
        await api.updateTransaction(state.editingId, payload);
        ui.closeEditDialog();
        await loadTransactions();
      } catch (err) {
        ui.showError('edit-error', err.message);
      }
    }
  
    function onCancelEdit() {
      ui.closeEditDialog();
    }
  
    async function start() {
      restoreFromStorage();
  
      ui.bind({
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
      });
  
      document.querySelector('#tx-form [name="date"]').value =
        new Date().toISOString().slice(0, 10);
  
      render();
      await loadCategories();
      await loadTransactions();
    }
  
    return { start };
  }