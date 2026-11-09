import { memo } from 'react';

/**
 * @param {Object} props
 * @param {{id:number, text:string, completed:boolean, createdAt:number}} props.task
 * @param {(id:number) => void} props.onToggle
 * @param {(id:number) => void} props.onDelete
 */

function TodoItem({ task, onToggle, onDelete }) {
  return (
    <li className={'task' + (task.completed ? ' completed' : '')}>
      <input type="checkbox" className="task__checkbox" checked={task.completed} onChange={() => onToggle(task.id)}/>
      <span className="task__text">{task.text}</span>
      <button type="button" className="task__delete" onClick={() => onDelete(task.id)}>Удалить</button>
    </li>
  );
}

export default memo(TodoItem);