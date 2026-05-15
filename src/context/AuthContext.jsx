// ============================================
// AUTH CONTEXT
// ============================================
// WHY THIS FILE EXISTS:
// React Context lets us avoid "prop drilling" - passing props through
// many levels of components just to get data down to where it's needed.
//
// With Context:
// Any component can access user data and auth functions directly
// without passing through parent props!
//
// EXAMPLE:
// Without Context:
//   App → Page → Component → SubComponent → NeedUserData ❌ prop drilling!
//
// With Context:
//   App (provides context)
//   Any component can: useContext(AuthContext) → get user data directly ✅

import { createContext, useState, useEffect } from 'react';
import authService from '../services/authService';

// ============================================
// CREATE THE CONTEXT
// ============================================
// This is the object that holds our shared data
export const AuthContext = createContext();

// ============================================
// CREATE CONTEXT PROVIDER
// ============================================
// This is a component that wraps your app and provides the context
export function AuthProvider({ children }) {
  // State to store current user
  const [user, setUser] = useState(null);

  // State to show if app is still loading auth info
  const [isLoading, setIsLoading] = useState(true);

  // ============================================
  // EFFECT: CHECK IF USER IS ALREADY LOGGED IN
  // ============================================
  // When app first loads, check if user was previously logged in
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setIsLoading(false); // Done checking
  }, []); // Run only once on mount

  // ============================================
  // HANDLE LOGIN
  // ============================================
  const handleLogin = (email, password) => {
    const result = authService.login(email, password);

    if (result.success) {
      setUser(result.user); // Update context with logged-in user
    }

    return result; // Return success/message for displaying to user
  };

  // ============================================
  // HANDLE REGISTER
  // ============================================
  const handleRegister = (email, password, confirmPassword) => {
    return authService.register(email, password, confirmPassword);
  };

  // ============================================
  // HANDLE LOGOUT
  // ============================================
  const handleLogout = () => {
    authService.logout();
    setUser(null); // Clear user from context
    return { success: true, message: '✅ Logged out successfully' };
  };

  // ============================================
  // CONTEXT VALUE
  // ============================================
  // This object is what components will access via useContext
  const contextValue = {
    user,
    isLoading,
    isAuthenticated: user !== null,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// ============================================
// HOW TO USE THIS CONTEXT IN COMPONENTS
// ============================================
// In any component:
//
// import { useContext } from 'react';
// import { AuthContext } from '../context/AuthContext';
//
// export default function MyComponent() {
//   const { user, isAuthenticated, logout } = useContext(AuthContext);
//
//   if (isAuthenticated) {
//     return <h1>Hello {user.email}</h1>;
//   }
// }
