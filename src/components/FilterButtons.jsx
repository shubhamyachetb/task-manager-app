// ============================================
// FilterButtons Component
// ============================================
// WHY THIS COMPONENT EXISTS:
// We need buttons to filter tasks between:
// 1. All tasks
// 2. Only completed tasks
// 3. Only pending (not completed) tasks

// This is a simple display component that receives:
// - Current filter status (which button is active)
// - A callback function to handle filter changes

export default function FilterButtons({ currentFilter, onFilterChange }) {
  // PROPS EXPLANATION:
  // - currentFilter: String - 'all', 'completed', or 'pending'
  // - onFilterChange: Function - called when user clicks a filter button

  // Array of filter options
  const filters = [
    { label: 'All Tasks', value: 'all' },
    { label: 'Completed', value: 'completed' },
    { label: 'Pending', value: 'pending' },
  ];

  return (
    <div className="filter-buttons">
      {/* Loop through filters and create a button for each */}
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

// LEARNING POINT:
// We use .map() to loop through the filters array
// For each filter, we create a button
// The 'key' prop helps React identify which button is which
// The 'active' class is added only to the currently selected filter
// Clicking a button calls onFilterChange with the filter value
