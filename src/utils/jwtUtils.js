/**
 * Decode JWT token without verification (client-side only)
 * Note: This is for reading data only, not for security validation
 * Security validation should always happen on the backend
 */
export function decodeJWT(token) {
  try {
    // JWT has 3 parts separated by dots: header.payload.signature
    const parts = token.split('.');
    
    if (parts.length !== 3) {
      throw new Error('Invalid token format');
    }
    
    // Decode the payload (second part)
    const payload = parts[1];
    
    // Replace URL-safe characters and decode base64
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const decoded = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    return JSON.parse(decoded);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
}

/**
 * Extract user information from JWT token
 * @param {string} token - JWT token
 * @returns {object|null} User object with role
 */
export function getUserFromToken(token) {
  if (!token) return null;
  
  const decoded = decodeJWT(token);
  if (!decoded) return null;
  
  // Extract user information from token payload
  // Adjust these field names based on your JWT structure
  return {
    username: decoded.username || decoded.sub,
    email: decoded.email,
    firstName: decoded.firstName || decoded.first_name,
    lastName: decoded.lastName || decoded.last_name,
    role: decoded.role || decoded.userRole || 'player', // Default to 'player' if not found
    userId: decoded.userId || decoded.user_id || decoded.sub
  };
}

/**
 * Check if token is expired
 * @param {string} token - JWT token
 * @returns {boolean} True if expired
 */
export function isTokenExpired(token) {
  if (!token) return true;
  
  const decoded = decodeJWT(token);
  if (!decoded || !decoded.exp) return true;
  
  // exp is in seconds, Date.now() is in milliseconds
  const expirationTime = decoded.exp * 1000;
  return Date.now() >= expirationTime;
}

/**
 * Get role from JWT token
 * @param {string} token - JWT token
 * @returns {string|null} User role
 */
export function getRoleFromToken(token) {
  const user = getUserFromToken(token);
  return user?.role || null;
}