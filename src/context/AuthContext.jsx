import { createContext, useContext, useState, useEffect } from 'react';
import { getUserFromToken } from '../utils/jwtUtils';

const AuthContext = createContext();

const API_URL = import.meta.env.VITE_API_URL || "https://c45bjd0f8i.execute-api.us-west-2.amazonaws.com/prod";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Start as true
  const [token, setToken] = useState(null);

  // Check for existing token on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        const userFromToken = getUserFromToken(storedToken);
        
        // Use token data if available, fallback to stored user
        const finalUser = userFromToken || parsedUser;
        
        setToken(storedToken);
        setUser(finalUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        logout();
      }
    }
    
    setIsLoading(false); // Always set loading to false after check
  };

  const login = async (username, password) => {
    setIsLoading(true);
    
    try {
      const requestBody = { username, password };
      console.log('Sending login request to:', `${API_URL}/auth/login`);

      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok && data.success) {
        // Store token and user (including role)
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        setToken(data.token);
        const userFromToken = getUserFromToken(data.token);
        setUser(userFromToken);
        setIsAuthenticated(true);
        setIsLoading(false);
        
        return { success: true };
      } else {
        setIsLoading(false);
        return { 
          success: false, 
          message: data.message || 'Login failed' 
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      return { 
        success: false, 
        message: 'Network error. Please check your connection and try again.' 
      };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  // Helper function to check if user is admin
  const isAdmin = () => {
    return user?.role === 'admin';
  };

  // Helper function to check if user is player
  const isPlayer = () => {
    return user?.role === 'player';
  };

  // Helper function to get authorization headers for API calls
  const getAuthHeaders = () => {
    if (token) {
      return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };
    }
    return {
      'Content-Type': 'application/json'
    };
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isLoading, 
      token,
      login, 
      logout, 
      checkAuth,
      getAuthHeaders,
      isAdmin,
      isPlayer
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Custom hook for role-based access control
export function useRole() {
  const { user, isAdmin, isPlayer, isAuthenticated } = useAuth();

  // For unauthenticated users, return view-only permissions
  if (!isAuthenticated) {
    return {
      role: null,
      isAdmin: false,
      isPlayer: false,
      canEdit: false,
      canDelete: false,
      canCreate: false,
      canView: true
    };
  }

  return {
    role: user?.role || null,
    isAdmin: isAdmin(),
    isPlayer: isPlayer(),
    canEdit: isAdmin(),
    canDelete: isAdmin(),
    canCreate: isAdmin(),
    canView: true // Everyone can view
  };
}