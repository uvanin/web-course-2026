import TodoItem from './ToDoItem';
/**
 * @param {{
 *   todos: Array<{id: number, text: string, completed: boolean}>,
 *   onToggle: (id: number) => void,
 *   onDelete: (id: number) => void
 * }} props
 */

export default function TodoList({ todos, onToggle, onDelete }) {
  if (todos.length === 0) {
    return <p className="empty">Задач нет</p>;
  }

  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} onToggle={onToggle} onDelete={onDelete}/>
      ))}
    </ul>
  );
}