// ============================================
// LOGIN FORM COMPONENT
// ============================================
// WHY THIS COMPONENT EXISTS:
// Handles the UI for the login form
// Gets email and password from user
// Calls parent's onSubmit function with credentials

import { useState } from 'react';
import MessageBox from '../common/MessageBox';
import '../../styles/auth.css';

export default function LoginForm({ onSubmit, isLoading }) {
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Call parent's onSubmit function
    const result = await onSubmit(email, password);

    // Show message to user
    if (result.success) {
      setMessageType('success');
      setMessage(result.message);
      // Clear form
      setEmail('');
      setPassword('');
    } else {
      setMessageType('error');
      setMessage(result.message);
    }

    // Clear message after 3 seconds
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h2 className="form-title">🔐 Login</h2>

      <MessageBox message={message} type={messageType} />

      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
          className="form-input"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="form-button"
      >
        {isLoading ? 'Logging in...' : 'Login'}
      </button>

      <p className="auth-link">
        Don't have an account?{' '}
        <a href="/register">Register here</a>
      </p>
    </form>
  );
}
