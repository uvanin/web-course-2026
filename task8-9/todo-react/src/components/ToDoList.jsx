import { memo } from 'react';
import TodoItem from './ToDoItem';

/**
 * @param {Object} props
 * @param {Array<{id:number,
 *                text:string,
 *                completed:boolean,
 *                createdAt:number}>} props.tasks
 * @param {(id:number) => void} props.onToggle
 * @param {(id:number) => void} props.onDelete
 */

function TodoList({tasks, onToggle, onDelete}) {
  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TodoItem key={task.id} task={task} onToggle={onToggle} onDelete={onDelete}/>
      ))}
    </ul>
  );
}

export default memo(TodoList);