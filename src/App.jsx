// ============================================
// App Component (Main Application)
// ============================================
// This is the MAIN component that manages:
// 1. Task state (all tasks)
// 2. Filter state (which tasks to show)
// 3. Input state (what user is typing)
// 4. All functions to add/delete/complete tasks

import { useState, useEffect } from 'react';
import TaskItem from './components/TaskItem';
import FilterButtons from './components/FilterButtons';
import './App.css';

export default function App() {
  // ============================================
  // STATE MANAGEMENT with useState Hook
  // ============================================
  // useState is a React Hook that lets functional components have state
  // It returns [currentValue, functionToUpdateValue]

  // Store all tasks
  const [tasks, setTasks] = useState(() => {
    // Load tasks from localStorage when component first mounts
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  // Store what user is typing in the input box
  const [inputValue, setInputValue] = useState('');

  // Store which filter is active ('all', 'completed', or 'pending')
  const [filter, setFilter] = useState('all');

  // ============================================
  // SIDE EFFECTS with useEffect Hook
  // ============================================
  // useEffect runs code AFTER component renders
  // When tasks change, we save them to localStorage

  useEffect(() => {
    // Every time tasks array changes, save to localStorage
    localStorage.setItem('tasks', JSON.stringify(tasks));
    console.log('📦 Tasks saved to localStorage:', tasks);
  }, [tasks]); // Dependency array: only run when 'tasks' changes

  // ============================================
  // FILTER LOGIC
  // ============================================
  // Calculate which tasks to show based on current filter

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

  // Get tasks to display
  const filteredTasks = getFilteredTasks();

  // Calculate stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;

  // ============================================
  // FUNCTIONS
  // ============================================

  // Function: ADD a new task
  const handleAddTask = () => {
    // Don't add empty tasks
    if (inputValue.trim() === '') {
      alert('Please enter a task');
      return;
    }

    // Create new task object
    const newTask = {
      id: Date.now(), // Use current timestamp as unique ID
      text: inputValue,
      completed: false,
      createdAt: new Date().toLocaleString(),
    };

    // Add to tasks array
    setTasks([...tasks, newTask]);

    // Clear input field
    setInputValue('');

    console.log('✅ Task added:', newTask);
  };

  // Function: MARK TASK as completed or pending
  const handleToggleTask = (taskId) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? { ...task, completed: !task.completed } // Toggle completed status
          : task
      )
    );
  };

  // Function: DELETE a task
  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
    console.log('🗑️ Task deleted:', taskId);
  };

  // Function: CLEAR all completed tasks
  const handleClearCompleted = () => {
    const tasksToDelete = tasks.filter((task) => task.completed).length;
    setTasks(tasks.filter((task) => !task.completed));
    console.log(`🧹 Cleared ${tasksToDelete} completed tasks`);
  };

  // Function: Handle Enter key to add task
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddTask();
    }
  };

  // ============================================
  // JSX - What gets displayed
  // ============================================

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <h1>📝 Task Manager</h1>
        <p className="subtitle">Stay organized and productive</p>
      </header>

      {/* Main content */}
      <main className="app-main">
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
              {/* Loop through filtered tasks and display each one */}
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

      {/* Footer */}
      <footer className="app-footer">
        <p>💡 Tip: Your tasks are automatically saved to your browser</p>
      </footer>
    </div>
  );
}

// ============================================
// LEARNING SUMMARY
// ============================================
// 1. useState: Manages data that can change (state)
// 2. useEffect: Runs code after component renders (side effects)
// 3. Props: Passes data to child components (TaskItem, FilterButtons)
// 4. Controlled inputs: Input value comes from state
// 5. Conditional rendering: Show/hide elements based on conditions
// 6. Array methods: map(), filter() to manipulate task lists
// 7. localStorage: Persist data in browser even after refresh
// 8. Event handlers: Handle clicks, Enter key, input changes
// ============================================
