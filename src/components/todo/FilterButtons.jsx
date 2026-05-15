// ============================================
// FILTER BUTTONS COMPONENT
// ============================================
// WHY THIS COMPONENT EXISTS:
// Displays filter buttons to filter tasks
// Reusable - can be used in any component that needs filtering

export default function FilterButtons({ currentFilter, onFilterChange }) {
  const filters = [
    { label: 'All Tasks', value: 'all' },
    { label: 'Completed', value: 'completed' },
    { label: 'Pending', value: 'pending' },
  ];

  return (
    <div className="filter-buttons">
      {filters.map((filter) => (
        <button
          key={filter.value}
          className={`filter-btn ${
            currentFilter === filter.value ? 'active' : ''
          }`}
          onClick={() => onFilterChange(filter.value)}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}
