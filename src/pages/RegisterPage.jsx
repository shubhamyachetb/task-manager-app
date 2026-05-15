// ============================================
// REGISTER PAGE
// ============================================
// WHY THIS PAGE EXISTS:
// Full-screen page for user registration
// Uses RegisterForm component for the form
// After successful registration, user can login

import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import RegisterForm from '../components/auth/RegisterForm';
import '../styles/auth.css';

export default function RegisterPage() {
  // Get register function from auth context
  const { register } = useContext(AuthContext);

  // For navigation after successful registration
  const navigate = useNavigate();

  // Show loading while processing
  const [isLoading, setIsLoading] = useState(false);

  // Handle form submission
  const handleRegisterSubmit = async (email, password, confirmPassword) => {
    setIsLoading(true);

    // Call register function from context
    const result = register(email, password, confirmPassword);

    // If successful, navigate to login page
    if (result.success) {
      setTimeout(() => {
        navigate('/login');
      }, 1000); // Show success message for 1 second, then navigate
    }

    setIsLoading(false);
    return result;
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <RegisterForm
          onSubmit={handleRegisterSubmit}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
