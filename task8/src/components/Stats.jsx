/**
 * Счётчики задач.
 * @param {{ todos: Array<{completed: boolean}> }} props
 */
export default function Stats({ todos }) {
    const total = todos.length;
    const completed = todos.filter((t) => t.completed).length;
    const active = total - completed;
  
    return (
      <div className="stats">
        <span>Всего: {total}</span>
        <span>Невыполненных: {active}</span>
        <span>Выполненных: {completed}</span>
      </div>
    );
  }