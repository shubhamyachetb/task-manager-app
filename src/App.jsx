// ============================================
// APP COMPONENT - Main Entry Point
// ============================================
// WHY THIS FILE IS CLEAN NOW:
// Before refactoring: Had ALL logic, state, and UI
// After refactoring: ONLY handles routing
//
// Benefits:
// - Easy to understand the app structure at a glance
// - Routes are all in one place
// - Logic is separated into components/services/context

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TodoPage from './pages/TodoPage';

// Styles
import './App.css';

// ============================================
// APP COMPONENT
// ============================================
export default function App() {
  return (
    // AuthProvider wraps the entire app
    // This makes authentication state available everywhere via useContext
    <AuthProvider>
      <Router>
        {/* Define all routes */}
        <Routes>
          {/* Public Routes - anyone can access */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Route - only logged-in users can access */}
          <Route
            path="/todos"
            element={
              <ProtectedRoute>
                <TodoPage />
              </ProtectedRoute>
            }
          />

          {/* Default route - redirect to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Catch-all - if user goes to unknown route, redirect to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

// ============================================
// ROUTING FLOW
// ============================================
// User visits app:
//   ↓
// App.jsx runs
//   ↓
// AuthProvider wraps everything (provides global auth context)
//   ↓
// Router sets up routing (listens to URL changes)
//   ↓
// Routes component matches current URL to a route
//   ↓
// If /login → show LoginPage
// If /register → show RegisterPage
// If /todos → check ProtectedRoute → if logged in show TodoPage, else redirect to /login
// If / → redirect to /login
// ============================================
