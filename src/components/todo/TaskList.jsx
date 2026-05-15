// ============================================
// TASK LIST COMPONENT
// ============================================
// WHY THIS COMPONENT EXISTS:
// This is where ALL todo logic lives now
// Before: Logic was scattered in App.jsx
// Now: Logic is here in TaskList component
//
// Benefits:
// - TodoPage is clean and simple
// - TaskList is reusable
// - Easy to test separately
// - Manages only task-related state

import { useState, useEffect } from 'react';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import TaskItem from './TaskItem';
import FilterButtons from './FilterButtons';
import '../../styles/todo.css';

export default function TaskList() {
  // Get user from context (so we can show user-specific message)
  const { user } = useContext(AuthContext);

  // ============================================
  // STATE MANAGEMENT
  // ============================================

  // All tasks for this user
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  // What user is typing in input box
  const [inputValue, setInputValue] = useState('');

  // Which filter is active ('all', 'completed', or 'pending')
  const [filter, setFilter] = useState('all');

  // ============================================
  // SIDE EFFECTS
  // ============================================
  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    console.log('📦 Tasks saved to localStorage:', tasks);
  }, [tasks]);

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

    const newTask = {
      id: Date.now(),
      text: inputValue,
      completed: false,
      createdAt: new Date().toLocaleString(),
    };

    setTasks([...tasks, newTask]);
    setInputValue('');
    console.log('✅ Task added:', newTask);
  };

  // Mark task as completed/pending
  const handleToggleTask = (taskId) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  };

  // Delete a task
  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
    console.log('🗑️ Task deleted:', taskId);
  };

  // Clear all completed tasks
  const handleClearCompleted = () => {
    const tasksToDelete = tasks.filter((task) => task.completed).length;
    setTasks(tasks.filter((task) => !task.completed));
    console.log(`🧹 Cleared ${tasksToDelete} completed tasks`);
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
