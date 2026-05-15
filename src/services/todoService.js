// ============================================
// TODO SERVICE
// ============================================
// WHY THIS FILE EXISTS:
// We separate todo logic from components (same reason as authService)
// This keeps TaskList component clean and focused on UI
//
// Benefits:
// - All todo logic in ONE place
// - Easy to test separately
// - Easy to migrate from localStorage to backend API
// - Can be reused across multiple components
// - User-specific data isolation
//
// PROBLEM WE'RE SOLVING:
// Before: All users shared the same 'tasks' in localStorage
// Now: Each user has their own 'tasks-email@domain.com' key
//
// This is a CRITICAL concept in multi-user apps!

// ============================================
// LOCALSTORAGE STRUCTURE
// ============================================
// We'll store tasks with a user-specific key:
//
// localStorage.getItem('tasks-user1@gmail.com')
// Returns:
// [
//   { id: 1, text: 'Learn React', completed: false, createdAt: '...' },
//   { id: 2, text: 'Build Todo App', completed: true, createdAt: '...' }
// ]
//
// This way:
// - User 1 only sees tasks for 'user1@gmail.com'
// - User 2 only sees tasks for 'user2@gmail.com'
// - Tasks are completely isolated per user

const todoService = {
  // ============================================
  // HELPER: Get storage key for a user
  // ============================================
  // We use email as unique identifier
  // In real backend, we'd use userID
  getStorageKey: (userEmail) => {
    if (!userEmail) {
      throw new Error('User email is required');
    }
    return `tasks-${userEmail}`;
  },

  // ============================================
  // 1. GET ALL TASKS FOR A USER
  // ============================================
  getTodosByUser: (userEmail) => {
    const key = todoService.getStorageKey(userEmail);
    const tasksJson = localStorage.getItem(key);

    if (!tasksJson) {
      return []; // No tasks for this user yet
    }

    try {
      return JSON.parse(tasksJson);
    } catch (error) {
      console.error('Error parsing tasks:', error);
      return [];
    }
  },

  // ============================================
  // 2. SAVE ALL TASKS FOR A USER
  // ============================================
  // Internal method - called by add/delete/update methods
  saveTodosForUser: (userEmail, tasks) => {
    const key = todoService.getStorageKey(userEmail);
    localStorage.setItem(key, JSON.stringify(tasks));
    console.log(`💾 Tasks saved for ${userEmail}:`, tasks);
  },

  // ============================================
  // 3. ADD A NEW TASK FOR A USER
  // ============================================
  addTodoForUser: (userEmail, taskText) => {
    // Validation
    if (!taskText || taskText.trim() === '') {
      return {
        success: false,
        message: '❌ Task text cannot be empty',
      };
    }

    // Get current tasks for this user
    const currentTasks = todoService.getTodosByUser(userEmail);

    // Create new task
    const newTask = {
      id: Date.now(),
      text: taskText.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
    };

    // Add to tasks array
    const updatedTasks = [...currentTasks, newTask];

    // Save back to localStorage (user-specific)
    todoService.saveTodosForUser(userEmail, updatedTasks);

    return {
      success: true,
      message: '✅ Task added',
      task: newTask,
    };
  },

  // ============================================
  // 4. DELETE A TASK FOR A USER
  // ============================================
  deleteTodoForUser: (userEmail, taskId) => {
    // Get current tasks for this user
    const currentTasks = todoService.getTodosByUser(userEmail);

    // Remove the task with matching ID
    const updatedTasks = currentTasks.filter((task) => task.id !== taskId);

    // Save back to localStorage (user-specific)
    todoService.saveTodosForUser(userEmail, updatedTasks);

    console.log(`🗑️ Task ${taskId} deleted for ${userEmail}`);

    return {
      success: true,
      message: '✅ Task deleted',
    };
  },

  // ============================================
  // 5. TOGGLE TASK COMPLETION FOR A USER
  // ============================================
  toggleTodoForUser: (userEmail, taskId) => {
    // Get current tasks for this user
    const currentTasks = todoService.getTodosByUser(userEmail);

    // Toggle the completed status of the task with matching ID
    const updatedTasks = currentTasks.map((task) =>
      task.id === taskId
        ? { ...task, completed: !task.completed }
        : task
    );

    // Save back to localStorage (user-specific)
    todoService.saveTodosForUser(userEmail, updatedTasks);

    console.log(`✓ Task ${taskId} toggled for ${userEmail}`);

    return {
      success: true,
      message: '✅ Task updated',
    };
  },

  // ============================================
  // 6. UPDATE A TASK FOR A USER
  // ============================================
  updateTodoForUser: (userEmail, taskId, updates) => {
    // Get current tasks for this user
    const currentTasks = todoService.getTodosByUser(userEmail);

    // Update the task with matching ID
    const updatedTasks = currentTasks.map((task) =>
      task.id === taskId ? { ...task, ...updates } : task
    );

    // Save back to localStorage (user-specific)
    todoService.saveTodosForUser(userEmail, updatedTasks);

    return {
      success: true,
      message: '✅ Task updated',
    };
  },

  // ============================================
  // 7. CLEAR ALL COMPLETED TASKS FOR A USER
  // ============================================
  clearCompletedForUser: (userEmail) => {
    // Get current tasks for this user
    const currentTasks = todoService.getTodosByUser(userEmail);

    // Count how many we're deleting
    const completedCount = currentTasks.filter((t) => t.completed).length;

    if (completedCount === 0) {
      return {
        success: false,
        message: '❌ No completed tasks to clear',
      };
    }

    // Keep only uncompleted tasks
    const updatedTasks = currentTasks.filter((task) => !task.completed);

    // Save back to localStorage (user-specific)
    todoService.saveTodosForUser(userEmail, updatedTasks);

    console.log(`🧹 Cleared ${completedCount} completed tasks for ${userEmail}`);

    return {
      success: true,
      message: `✅ Cleared ${completedCount} completed task(s)`,
      deletedCount: completedCount,
    };
  },

  // ============================================
  // 8. GET TASKS STATS FOR A USER
  // ============================================
  getTodoStats: (userEmail) => {
    const tasks = todoService.getTodosByUser(userEmail);
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const pending = total - completed;

    return {
      total,
      completed,
      pending,
    };
  },

  // ============================================
  // 9. DELETE ALL TASKS FOR A USER
  // ============================================
  // This is useful when a user deletes their account
  deleteAllTodosForUser: (userEmail) => {
    const key = todoService.getStorageKey(userEmail);
    localStorage.removeItem(key);

    console.log(`🗑️ All tasks deleted for ${userEmail}`);

    return {
      success: true,
      message: '✅ All tasks deleted',
    };
  },
};

export default todoService;

// ============================================
// HOW TO USE THIS SERVICE IN COMPONENTS
// ============================================
// In TaskList.jsx or any component:
//
// import todoService from '../../services/todoService';
// import { AuthContext } from '../../context/AuthContext';
// import { useContext } from 'react';
//
// export default function TaskList() {
//   const { user } = useContext(AuthContext);
//
//   // Get tasks for THIS logged-in user
//   const tasks = todoService.getTodosByUser(user.email);
//
//   // Add a task for THIS user
//   const handleAddTask = (taskText) => {
//     const result = todoService.addTodoForUser(user.email, taskText);
//     if (result.success) {
//       setTasks(todoService.getTodosByUser(user.email));
//     }
//   };
//
//   // Delete a task for THIS user
//   const handleDeleteTask = (taskId) => {
//     todoService.deleteTodoForUser(user.email, taskId);
//     setTasks(todoService.getTodosByUser(user.email));
//   };
// }
