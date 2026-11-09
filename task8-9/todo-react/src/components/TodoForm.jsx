import { useState } from 'react';

/**
 * @param {Object} props
 * @param {(text: string, completed: boolean) => void} props.onAdd
 */

export default function TodoForm({ onAdd }) {
  const [text, setText] = useState('');
  const [completed, setCompleted] = useState(false);
  const [warning, setWarning] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) {
      setWarning(true);
      return;
    }
    onAdd(trimmed, completed);
    setText('');
    setCompleted(false);
    setWarning(false);
  };

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <input
        className="todo-form__input"
        type="text"
        placeholder="Новая задача…"
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          if (warning) setWarning(false);
        }}
      />
      <label className="todo-form__completed">
        <input
          type="checkbox"
          checked={completed}
          onChange={(e) => setCompleted(e.target.checked)}
        />
      </label>
      <button type="submit">Добавить</button>
      {warning && <p className="todo-form__warning">Введите текст задачи</p>}
    </form>
  );
}