import { useState, useMemo } from 'react';
import TodoForm from './components/ToDoForm';
import Filters from './components/Filters';
import Stats from './components/Stats';
import TodoList from './components/ToDoList';
import './App.css';

/**
 * @typedef {Object} Todo
 * @property {number} id
 * @property {string} text
 * @property {boolean} completed
 * @property {number} createdAt 
 */

/** @type {Array<{value: string, label: string}>} */
const FILTERS = [
  { value: 'all', label: 'Все' },
  { value: 'active', label: 'Невыполненные' },
  { value: 'completed', label: 'Выполненные' },
];

/** @type {Array<{value: string, label: string}>} */
const SORTS = [
  { value: 'date-desc', label: 'Сначала новые' },
  { value: 'date-asc', label: 'Сначала старые' },
  { value: 'list-asc', label: 'По списку (А→Я)' },
  { value: 'list-desc', label: 'По списку (Я→А)' },
];

export default function App() {
  /** @type {[Todo[], Function]} */
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('date-desc');

  const addTodo = (text, completed = false) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setTodos((prev) => [
      ...prev,
      {
        id: Date.now(),
        text: trimmed,
        completed,
        createdAt: Date.now(),
      },
    ]);
  };

  const toggleTodo = (id) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const visibleTodos = useMemo(() => {
    let result;
    switch (filter) {
      case 'active':
        result = todos.filter((t) => !t.completed);
        break;
      case 'completed':
        result = todos.filter((t) => t.completed);
        break;
      case 'all':
      default:
        result = todos;
    }
    const sorted = [...result];
    switch (sort) {
      case 'date-asc':
        sorted.sort((a, b) => a.createdAt - b.createdAt);
        break;
      case 'list-asc':
        sorted.sort((a, b) => a.text.localeCompare(b.text, 'ru'));
        break;
      case 'list-desc':
        sorted.sort((a, b) => b.text.localeCompare(a.text, 'ru'));
        break;
      case 'date-desc':
      default:
        sorted.sort((a, b) => b.createdAt - a.createdAt);
    }

    return sorted;
  }, [todos, filter, sort]);

  return (
    <div className="app">
      <h1>Список задач</h1>

      <TodoForm onAdd={addTodo} />

      <div className="toolbar">
        <Filters
          filters={FILTERS}
          current={filter}
          onChange={setFilter}
        />

        <label className="sort">
          Сортировка:{' '}
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            {SORTS.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <Stats todos={todos} />

      <TodoList
        todos={visibleTodos}
        onToggle={toggleTodo}
        onDelete={deleteTodo}
      />
    </div>
  );
}