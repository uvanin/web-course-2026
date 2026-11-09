/**
 * @param {Object} props
 * @param {number} props.active
 * @param {number} props.completed
 */

export default function Stats({ active, completed }) {
    return (
      <p className="stats"> Осталось: {active}, Выполнено: {completed} </p>
    );
  }