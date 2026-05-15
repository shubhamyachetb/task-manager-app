// ============================================
// PROTECTED ROUTE COMPONENT
// ============================================
// WHY THIS COMPONENT EXISTS:
// We want to prevent users from accessing the TodoPage if they're not logged in
// This component checks if user is authenticated before showing the page
//
// If user is logged in → show the page
// If user is NOT logged in → redirect to login page

import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

// ============================================
// PROTECTED ROUTE COMPONENT
// ============================================
// This component wraps pages that need authentication
export default function ProtectedRoute({ children }) {
  // Get authentication state from context
  const { user, isLoading } = useContext(AuthContext);

  // While checking if user is logged in, show loading
  if (isLoading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>
      <p>🔄 Loading...</p>
    </div>;
  }

  // If user is NOT logged in, redirect to login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If user IS logged in, show the page
  return children;
}

// ============================================
// HOW THIS WORKS
// ============================================
// In App.jsx routing:
//
// <Routes>
//   <Route path="/login" element={<LoginPage />} />
//   <Route 
//     path="/todos" 
//     element={
//       <ProtectedRoute>
//         <TodoPage />
//       </ProtectedRoute>
//     } 
//   />
// </Routes>
//
// User tries to visit /todos
//   ↓
// ProtectedRoute checks: Is user logged in?
//   ↓
// If NO: Redirect to /login
// If YES: Show TodoPage
