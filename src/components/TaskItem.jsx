// ============================================
// TaskItem Component
// ============================================
// WHY THIS COMPONENT EXISTS:
// We need to display each task in a reusable way.
// This component shows one task with:
// - The task text
// - A checkbox to mark as complete
// - A delete button

// We use PROPS to pass data from parent (App) to this component
// Props allow us to reuse the same component for many tasks

export default function TaskItem({ task, onToggle, onDelete }) {
  // PROPS EXPLANATION:
  // - task: Object containing { id, text, completed, createdAt }
  // - onToggle: Function to mark task as completed/pending
  // - onDelete: Function to delete the task

  return (
    <li className="task-item">
      {/* Checkbox - clicking it calls onToggle and passes the task id */}
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task.id)}
        className="task-checkbox"
      />

      {/* Task text - changes style if completed (strikethrough) */}
      <span className={`task-text ${task.completed ? 'completed' : ''}`}>
        {task.text}
      </span>

      {/* Delete button - clicking it calls onDelete and passes the task id */}
      <button
        className="delete-btn"
        onClick={() => onDelete(task.id)}
        title="Delete this task"
      >
        ✕
      </button>
    </li>
  );
}

// LEARNING POINT:
// This is a FUNCTIONAL COMPONENT - just a JavaScript function that returns JSX
// Every time the parent App component updates this task, React re-renders it
// The component receives props, but CANNOT modify them
// To change data, the component calls the functions passed in props
