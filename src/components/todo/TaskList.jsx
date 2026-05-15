// ============================================
// TASK LIST COMPONENT
// ============================================
// WHY THIS COMPONENT IS REFACTORED:
// Before: Tasks were global (all users saw same tasks)
// Now: Tasks are user-specific (each user sees only their tasks)
//
// Key changes:
// - Gets logged-in user email from AuthContext
// - Uses todoService for ALL task operations
// - All tasks are isolated per user
//
// IMPORTANT: This component now properly handles multi-user scenarios!

import { useState, useEffect } from 'react';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import todoService from '../../services/todoService';
import TaskItem from './TaskItem';
import FilterButtons from './FilterButtons';
import '../../styles/todo.css';

export default function TaskList() {
  // ============================================
  // GET LOGGED-IN USER FROM CONTEXT
  // ============================================
  // This is CRITICAL: We get the current user's email
  // We use this email to access ONLY that user's tasks
  const { user } = useContext(AuthContext);

  // ============================================
  // STATE MANAGEMENT
  // ============================================

  // Tasks for ONLY the logged-in user
  // When user A logs out and user B logs in, this updates automatically
  const [tasks, setTasks] = useState(() => {
    if (!user) return [];
    // Load tasks for THIS user from todoService
    return todoService.getTodosByUser(user.email);
  });

  // What user is typing in input box
  const [inputValue, setInputValue] = useState('');

  // Which filter is active ('all', 'completed', or 'pending')
  const [filter, setFilter] = useState('all');

  // ============================================
  // EFFECT: LOAD TASKS WHEN USER CHANGES
  // ============================================
  // When logged-in user changes (login/logout), reload their tasks
  useEffect(() => {
    if (user) {
      // Load tasks for this user from todoService
      const userTasks = todoService.getTodosByUser(user.email);
      setTasks(userTasks);
      console.log(`📝 Loaded ${userTasks.length} tasks for ${user.email}`);
    }
  }, [user?.email]); // Re-run when user email changes (different user logged in)

  // ============================================
  // EFFECT: SAVE TASKS TO LOCALSTORAGE
  // ============================================
  // When tasks change, automatically save them to localStorage
  // The tasks will be saved under 'tasks-user@email.com' key
  useEffect(() => {
    if (user && tasks.length >= 0) {
      // Save tasks for THIS user using todoService
      todoService.saveTodosForUser(user.email, tasks);
    }
  }, [tasks, user?.email]); // Re-run when tasks OR user email changes

  // ============================================
  // FILTER LOGIC
  // ============================================
  const getFilteredTasks = () => {
    switch (filter) {
      case 'completed':
        return tasks.filter((task) => task.completed);
      case 'pending':
        return tasks.filter((task) => !task.completed);
      default:
        return tasks; // 'all'
    }
  };

  const filteredTasks = getFilteredTasks();

  // Calculate stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;

  // ============================================
  // FUNCTIONS
  // ============================================

  // Add new task
  const handleAddTask = () => {
    if (inputValue.trim() === '') {
      alert('Please enter a task');
      return;
    }

    // Use todoService to add task for THIS user
    const result = todoService.addTodoForUser(user.email, inputValue);

    if (result.success) {
      // Reload tasks from todoService
      setTasks(todoService.getTodosByUser(user.email));
      setInputValue('');
    }
  };

  // Mark task as completed/pending
  const handleToggleTask = (taskId) => {
    // Use todoService to toggle task for THIS user
    todoService.toggleTodoForUser(user.email, taskId);

    // Reload tasks from todoService
    setTasks(todoService.getTodosByUser(user.email));
  };

  // Delete a task
  const handleDeleteTask = (taskId) => {
    // Use todoService to delete task for THIS user
    todoService.deleteTodoForUser(user.email, taskId);

    // Reload tasks from todoService
    setTasks(todoService.getTodosByUser(user.email));
  };

  // Clear all completed tasks
  const handleClearCompleted = () => {
    // Use todoService to clear completed tasks for THIS user
    const result = todoService.clearCompletedForUser(user.email);

    if (result.success) {
      // Reload tasks from todoService
      setTasks(todoService.getTodosByUser(user.email));
      console.log(result.message);
    }
  };

  // Handle Enter key to add task
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddTask();
    }
  };

  // ============================================
  // JSX - What gets displayed
  // ============================================

  return (
    <main className="tasks-main">
      {/* Input section for adding tasks */}
      <div className="input-section">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Add a new task... (Press Enter)"
          className="task-input"
        />
        <button onClick={handleAddTask} className="add-btn">
          Add Task
        </button>
      </div>

      {/* Filter buttons */}
      <FilterButtons currentFilter={filter} onFilterChange={setFilter} />

      {/* Stats section */}
      <div className="stats">
        <span>Total: {totalTasks}</span>
        <span>✅ Completed: {completedTasks}</span>
        <span>⏳ Pending: {pendingTasks}</span>
      </div>

      {/* Tasks list */}
      <div className="tasks-container">
        {filteredTasks.length === 0 ? (
          <p className="no-tasks">
            {totalTasks === 0
              ? 'No tasks yet. Add one to get started!'
              : 'No tasks match the current filter.'}
          </p>
        ) : (
          <ul className="tasks-list">
            {filteredTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={handleToggleTask}
                onDelete={handleDeleteTask}
              />
            ))}
          </ul>
        )}
      </div>

      {/* Clear completed button */}
      {completedTasks > 0 && (
        <button onClick={handleClearCompleted} className="clear-btn">
          Clear {completedTasks} Completed Task{completedTasks !== 1 ? 's' : ''}
        </button>
      )}
    </main>
  );
}
