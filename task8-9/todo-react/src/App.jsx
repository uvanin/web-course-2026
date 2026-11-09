// src/App.jsx
import { useCallback, useEffect, useMemo, useState } from 'react';
import TodoForm from './components/TodoForm';
import Filters from './components/Filters';
import SortControls from './components/SortControls';
import Stats from './components/Stats';
import TodoList from './components/ToDoList';
import { sortTasks } from './utils/sorters';
import './App.css';

const STORAGE_KEY = 'todo-react-tasks';

/** @returns {Array<{id:number,text:string,completed:boolean,createdAt:number}>} */

function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function App() {
  const [tasks, setTasks] = useState(loadTasks);
  const [showActive, setShowActive] = useState(true);
  const [showCompleted, setShowCompleted] = useState(true);
  const [sortKey, setSortKey] = useState('date-desc');

  const nextId = useMemo(
    () => tasks.reduce((m, t) => Math.max(m, t.id), 0) + 1,
    [tasks]
  );

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const handleAdd = useCallback(
    (text, completed) => {
      setTasks((prev) => {
        const maxId = prev.reduce((m, t) => Math.max(m, t.id), 0);
        return [...prev,{id: maxId + 1,text,completed,createdAt: Date.now(),},];
      });
    },
    []
  );

  const handleToggle = useCallback((id) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  }, []);

  const handleDelete = useCallback((id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const handleToggleActive = useCallback((v) => setShowActive(v), []);
  const handleToggleCompleted = useCallback((v) => setShowCompleted(v), []);
  const handleSortChange = useCallback((k) => setSortKey(k), []);

  const visibleTasks = useMemo(() => {
    const filtered = tasks.filter((task) =>
      task.completed ? showCompleted : showActive
    );
    return sortTasks(filtered, sortKey);
  }, [tasks, showActive, showCompleted, sortKey]);

  const completedCount = useMemo(
    () => tasks.filter((t) => t.completed).length,
    [tasks]
  );
  const activeCount = tasks.length - completedCount;

  return (
    <div className="app">
      <h1>Todo-list</h1>
      <TodoForm onAdd={handleAdd} />
      <Filters
        showActive={showActive}
        showCompleted={showCompleted}
        onToggleActive={handleToggleActive}
        onToggleCompleted={handleToggleCompleted}
      />
      <SortControls sortKey={sortKey} onChange={handleSortChange} />
      <Stats active={activeCount} completed={completedCount} />
      {visibleTasks.length === 0 ? (
        <p className="empty">Задач нет</p>
      ) : (
        <TodoList
          tasks={visibleTasks}
          onToggle={handleToggle}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}