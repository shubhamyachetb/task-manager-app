// ============================================
// TODO PAGE
// ============================================
// WHY THIS PAGE EXISTS:
// Full-screen page for managing todos
// Only accessible to logged-in users (protected by ProtectedRoute)
// Contains navbar and TaskList component

import Navbar from '../components/common/Navbar';
import TaskList from '../components/todo/TaskList';
import '../styles/todo.css';

export default function TodoPage() {
  return (
    <div className="todo-page">
      {/* Navbar at the top */}
      <Navbar />

      {/* Main page header */}
      <header className="page-header">
        <h1>📝 Task Manager</h1>
        <p className="subtitle">Stay organized and productive</p>
      </header>

      {/* Task list component */}
      <TaskList />
    </div>
  );
}
