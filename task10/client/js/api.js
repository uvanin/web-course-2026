export function createApi(baseUrl = 'http://localhost:3001') {
    async function request(path, options = {}) {
      const res = await fetch(baseUrl + path, {
        headers: { 'Content-Type': 'application/json' },
        ...options,
      });
  
      if (res.status === 204) return null;
  
      let data = null;
      try {
        data = await res.json();
      } catch {}
  
      if (!res.ok) {
        const message = (data && data.error) || `Ошибка ${res.status}`;
        throw new Error(message);
      }
      return data;
    }
  
    return {
      getCategories: () => request('/categories'),
      createCategory: (payload) =>
        request('/categories', { method: 'POST', body: JSON.stringify(payload) }),
  
      getTransactions: (filters = {}) => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([k, v]) => {
          if (v !== undefined && v !== null && v !== '') params.append(k, v);
        });
        const qs = params.toString();
        return request('/transactions' + (qs ? `?${qs}` : ''));
      },
      createTransaction: (payload) =>
        request('/transactions', { method: 'POST', body: JSON.stringify(payload) }),
      updateTransaction: (id, payload) =>
        request(`/transactions/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
      deleteTransaction: (id) =>
        request(`/transactions/${id}`, { method: 'DELETE' }),
    };
  }