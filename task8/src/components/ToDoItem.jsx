/**
 * @param {{
*   todo: {id: number, text: string, completed: boolean},
*   onToggle: (id: number) => void,
*   onDelete: (id: number) => void
* }} props
*/
export default function TodoItem({ todo, onToggle, onDelete }) {
 const { id, text, completed } = todo;

 return (
   <li className={completed ? 'todo-item completed' : 'todo-item'}>
     <label>
       <input type="checkbox" checked={completed}onChange={() => onToggle(id)}/>
       <span className="todo-text">{text}</span>
     </label>

     <button type="button" className="delete-btn" onClick={() => onDelete(id)}>Удалить</button>
   </li>
 );
}