// ============================================
// LOGIN PAGE
// ============================================
// WHY THIS PAGE EXISTS:
// Full-screen page for user login
// Uses LoginForm component for the form
// Handles navigation after successful login

import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import LoginForm from '../components/auth/LoginForm';
import '../styles/auth.css';

export default function LoginPage() {
  // Get login function from auth context
  const { login } = useContext(AuthContext);

  // For navigation after successful login
  const navigate = useNavigate();

  // Show loading while processing
  const [isLoading, setIsLoading] = useState(false);

  // Handle form submission
  const handleLoginSubmit = async (email, password) => {
    setIsLoading(true);

    // Call login function from context
    const result = login(email, password);

    // If successful, navigate to todos page
    if (result.success) {
      setTimeout(() => {
        navigate('/todos');
      }, 1000); // Show success message for 1 second, then navigate
    }

    setIsLoading(false);
    return result;
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <LoginForm onSubmit={handleLoginSubmit} isLoading={isLoading} />
      </div>
    </div>
  );
}
