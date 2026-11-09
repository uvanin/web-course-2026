/**
 * @typedef {Object} Task
 * @property {number} id
 * @property {string} text
 * @property {boolean} completed
 * @property {number} createdAt  
 */

/** @type {Record<string, {label: string, compare: (a: Task, b: Task) => number}>} */

export const SORTERS = {
    'date-desc': {
      label: 'Сначала новые',
      compare: (a, b) => b.createdAt - a.createdAt,
    },
    'date-asc': {
      label: 'Сначала старые',
      compare: (a, b) => a.createdAt - b.createdAt,
    },
    'alpha-asc': {
      label: 'А → Я',
      compare: (a, b) => a.text.localeCompare(b.text, 'ru'),
    },
    'alpha-desc': {
      label: 'Я → А',
      compare: (a, b) => b.text.localeCompare(a.text, 'ru'),
    },
  };
  
  /**
   * @param {Task[]} items
   * @param {string} sortKey
   * @returns {Task[]}
   */

  export function sortTasks(items, sortKey) {
    const sorter = SORTERS[sortKey];
    if (!sorter) return items;
    return [...items].sort(sorter.compare); 
  }