// ============================================
// AUTH SERVICE
// ============================================
// WHY THIS FILE EXISTS:
// We separate all authentication logic into a service.
// This keeps components clean and makes logic reusable.
//
// Benefits:
// - Easy to test (can test logic without React)
// - Easy to migrate (replace localStorage with API call later)
// - Used by multiple components/pages
// - One place to manage all auth rules

// ============================================
// STORING DATA IN LOCALSTORAGE
// ============================================
// localStorage is browser storage that persists after page refresh
// Structure:
// localStorage.users: Array of registered users
// localStorage.currentUser: Currently logged-in user
//
// ⚠️  SECURITY WARNING (why localStorage auth is only for learning):
// 1. localStorage is readable by any JavaScript (vulnerable to XSS attacks)
// 2. No encryption - passwords are stored as plain text
// 3. No expiration - tokens never expire
// 4. No HTTP-only flag - can be stolen by JavaScript
//
// REAL APPS USE: JWT tokens + secure HTTP-only cookies + backend validation

// ============================================
// AUTH SERVICE OBJECT
// ============================================

const authService = {
  // ============================================
  // 1. REGISTER USER
  // ============================================
  register: (email, password, confirmPassword) => {
    // VALIDATION
    // Check if email is empty
    if (!email || email.trim() === '') {
      return {
        success: false,
        message: '❌ Email is required',
      };
    }

    // Check if email format is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        success: false,
        message: '❌ Please enter a valid email address',
      };
    }

    // Check if password is empty
    if (!password || password.trim() === '') {
      return {
        success: false,
        message: '❌ Password is required',
      };
    }

    // Check if password is at least 6 characters
    if (password.length < 6) {
      return {
        success: false,
        message: '❌ Password must be at least 6 characters long',
      };
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return {
        success: false,
        message: '❌ Passwords do not match',
      };
    }

    // Get existing users from localStorage
    const existingUsers = JSON.parse(
      localStorage.getItem('users') || '[]'
    );

    // Check if email already registered
    const userExists = existingUsers.some(
      (user) => user.email === email
    );
    if (userExists) {
      return {
        success: false,
        message: '❌ Email already registered. Please login or use a different email.',
      };
    }

    // CREATE NEW USER
    const newUser = {
      id: Date.now(), // Unique ID
      email,
      password, // ⚠️  In real apps, hash this with bcrypt!
      createdAt: new Date().toISOString(),
    };

    // SAVE TO LOCALSTORAGE
    existingUsers.push(newUser);
    localStorage.setItem('users', JSON.stringify(existingUsers));

    return {
      success: true,
      message: '✅ Registration successful! You can now login.',
    };
  },

  // ============================================
  // 2. LOGIN USER
  // ============================================
  login: (email, password) => {
    // VALIDATION
    if (!email || !password) {
      return {
        success: false,
        message: '❌ Email and password are required',
      };
    }

    // Get all registered users from localStorage
    const users = JSON.parse(
      localStorage.getItem('users') || '[]'
    );

    // Find user with matching email and password
    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    // USER NOT FOUND
    if (!user) {
      return {
        success: false,
        message: '❌ Invalid email or password',
      };
    }

    // SAVE LOGIN SESSION
    const sessionUser = {
      id: user.id,
      email: user.email,
      loginTime: new Date().toISOString(),
    };

    localStorage.setItem('currentUser', JSON.stringify(sessionUser));

    return {
      success: true,
      message: '✅ Login successful!',
      user: sessionUser,
    };
  },

  // ============================================
  // 3. LOGOUT USER
  // ============================================
  logout: () => {
    // Remove current user from localStorage
    localStorage.removeItem('currentUser');

    return {
      success: true,
      message: '✅ Logged out successfully',
    };
  },

  // ============================================
  // 4. GET CURRENT USER
  // ============================================
  // Returns the currently logged-in user or null
  getCurrentUser: () => {
    const userString = localStorage.getItem('currentUser');
    return userString ? JSON.parse(userString) : null;
  },

  // ============================================
  // 5. CHECK IF USER IS LOGGED IN
  // ============================================
  // Returns true/false
  isAuthenticated: () => {
    return authService.getCurrentUser() !== null;
  },
};

export default authService;
