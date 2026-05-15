// ============================================
// MESSAGE BOX COMPONENT
// ============================================
// WHY THIS COMPONENT EXISTS:
// Displays error or success messages to user
// Reusable across Login and Register pages

export default function MessageBox({ message, type }) {
  // type can be 'success' or 'error'
  if (!message) {
    return null; // Don't show if no message
  }

  const className = `message-box message-${type}`;

  return <div className={className}>{message}</div>;
}
