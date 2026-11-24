/**
 * Одна задача.
 * @param {{
*   todo: {id: number, text: string, completed: boolean, createdAt: number},
*   onToggle: (id: number) => void,
*   onDelete: (id: number) => void
* }} props
*/
export default function TodoItem({ todo, onToggle, onDelete }) {
 const { id, text, completed, createdAt } = todo;

 const createdLabel = new Date(createdAt).toLocaleString('ru-RU', {
   day: '2-digit',
   month: '2-digit',
   year: 'numeric',
   hour: '2-digit',
   minute: '2-digit',
 });

 return (
   <li className={completed ? 'todo-item completed' : 'todo-item'}>
     <label>
       <input
         type="checkbox"
         checked={completed}
         onChange={() => onToggle(id)}
       />
       <span className="todo-text">{text}</span>
       <span className="todo-date">{createdLabel}</span>
     </label>

     <button
       type="button"
       className="delete-btn"
       onClick={() => onDelete(id)}
     >
       Удалить
     </button>
   </li>
 );
}