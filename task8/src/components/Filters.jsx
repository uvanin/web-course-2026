/**
 * @param {{
*   filters: Array<{value: string, label: string}>,
*   current: string,
*   onChange: (value: string) => void
* }} props
*/
export default function Filters({ filters, current, onChange }) {
 return (
   <div className="filters">
     {filters.map(({ value, label }) => (
       <button key={value} type="button" className={value === current ? 'active' : ''} onClick={() => onChange(value)}>
         {label}
       </button>
     ))}
   </div>
 );
}