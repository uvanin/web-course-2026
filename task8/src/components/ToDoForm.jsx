import { useState } from 'react';

/**
 * Форма добавления задачи.
 * @param {{ onAdd: (text: string, completed: boolean) => void }} props
 */
export default function TodoForm({ onAdd }) {
  const [text, setText] = useState('');
  const [completed, setCompleted] = useState(false);
  const [lastTime,setSort] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(text, completed,lastTime);
    setText('');
    setCompleted(false);
    setSort(false)
  };

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Новая задача..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <select
        value={completed ? 'completed' : 'active'}
        onChange={(e) => setCompleted(e.target.value === 'completed')}
      >
        <option value="active">Невыполненная</option>
        <option value="completed">Выполненная</option>
      </select>

      <button type="submit">Добавить</button>
    </form>
  );
}