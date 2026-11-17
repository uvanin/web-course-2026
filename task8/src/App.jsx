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
 */

/** @type {Array<{value: string, label: string}>} */

const FILTERS = [
  { value: 'all', label: 'Все' },
  { value: 'active', label: 'Невыполненные' },
  { value: 'completed', label: 'Выполненные' },
];

export default function App() {
  /** @type {[Todo[], Function]} */
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all');

  const addTodo = (text, completed = false) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setTodos((prev) => [
      ...prev,
      { id: Date.now(), text: trimmed, completed },
    ]);
  };

  const toggleTodo = (id) => {
    setTodos((prev) =>
      prev.map((todo) => todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );};

  const deleteTodo = (id) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const visibleTodos = useMemo(() => {
    switch (filter) {
      case 'active': return todos.filter((t) => !t.completed);
      case 'completed': return todos.filter((t) => t.completed);
      case 'all':
      default: return todos;
    }
  }, [todos, filter]);

  return (
    <div className="app">
      <h1>Список задач</h1>

      <TodoForm onAdd={addTodo} />

      <Filters
        filters={FILTERS}
        current={filter}
        onChange={setFilter}
      />

      <Stats todos={todos} />

      <TodoList
        todos={visibleTodos}
        onToggle={toggleTodo}
        onDelete={deleteTodo}
      />
    </div>
  );
}