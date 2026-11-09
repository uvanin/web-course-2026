// src/components/Filters.jsx
/**
 * @param {Object} props
 * @param {boolean} props.showActive
 * @param {boolean} props.showCompleted
 * @param {(v: boolean) => void} props.onToggleActive
 * @param {(v: boolean) => void} props.onToggleCompleted
 */

export default function Filters({ showActive, showCompleted, onToggleActive, onToggleCompleted }) {
    return (
      <div className="filters">
        <label>
          <input
            type="checkbox"
            checked={showActive}
            onChange={(e) => onToggleActive(e.target.checked)}
          />
          Активные
        </label>
        <label>
          <input
            type="checkbox"
            checked={showCompleted}
            onChange={(e) => onToggleCompleted(e.target.checked)}
          />
          Выполненные
        </label>
      </div>
    );
  }