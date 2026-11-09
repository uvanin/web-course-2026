import { SORTERS } from '../utils/sorters';

/**
 * @param {Object} props
 * @param {string} props.sortKey
 * @param {(key: string) => void} props.onChange
 */

export default function SortControls({ sortKey, onChange }) {
  return (
    <div className="sort-controls">
      <label>
        Сортировка:{' '}
        <select value={sortKey} onChange={(e) => onChange(e.target.value)}>
          {Object.entries(SORTERS).map(([key, { label }]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </label>
    </div>
  );
}