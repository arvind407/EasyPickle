import { Navigate } from 'react-router-dom';
import { useRole } from '../context/AuthContext';

export default function AdminRoute({ children }) {
  const { isAdmin } = useRole();

  if (!isAdmin) {
    // Redirect to home if not admin
    return <Navigate to="/" replace />;
  }

  return children;
}