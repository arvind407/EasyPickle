import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <svg
              className="w-16 h-16 animate-spin"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Pickleball Paddle */}
              <g className="origin-center">
                {/* Paddle Handle */}
                <rect
                  x="44"
                  y="65"
                  width="12"
                  height="28"
                  rx="3"
                  fill="#4F46E5"
                  className="opacity-90"
                />
                
                {/* Paddle Face */}
                <ellipse
                  cx="50"
                  cy="40"
                  rx="22"
                  ry="28"
                  fill="#6366F1"
                />
                
                {/* Paddle Holes */}
                <circle cx="50" cy="30" r="3" fill="#E0E7FF" />
                <circle cx="42" cy="38" r="3" fill="#E0E7FF" />
                <circle cx="58" cy="38" r="3" fill="#E0E7FF" />
                <circle cx="50" cy="45" r="3" fill="#E0E7FF" />
                <circle cx="42" cy="52" r="3" fill="#E0E7FF" />
                <circle cx="58" cy="52" r="3" fill="#E0E7FF" />
              </g>
            </svg>
          </div>
          <p className="text-slate-600 font-medium">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}