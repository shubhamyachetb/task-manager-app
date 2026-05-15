// ============================================
// NAVBAR COMPONENT
// ============================================
// WHY THIS COMPONENT EXISTS:
// Shows user info and logout button after login
// Appears on top of all pages when user is logged in

import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import '../../styles/common.css';

export default function Navbar() {
  // Get user info and logout function from context
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirect to login page after logout
  };

  // If no user logged in, don't show navbar
  if (!user) {
    return null;
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-left">
          <h2 className="navbar-title">📝 Task Manager</h2>
        </div>
        <div className="navbar-right">
          <span className="navbar-user">👤 {user.email}</span>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
