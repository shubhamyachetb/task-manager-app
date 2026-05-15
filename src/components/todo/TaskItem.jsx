// ============================================
// TASK ITEM COMPONENT
// ============================================
// WHY THIS COMPONENT EXISTS:
// Displays a single task
// Reusable - used once for each task in the list

export default function TaskItem({ task, onToggle, onDelete }) {
  return (
    <li className="task-item">
      {/* Checkbox - clicking it toggles task completion */}
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task.id)}
        className="task-checkbox"
      />

      {/* Task text - strikethrough if completed */}
      <span className={`task-text ${task.completed ? 'completed' : ''}`}>
        {task.text}
      </span>

      {/* Delete button */}
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
