
import React, { createContext, useContext, useEffect } from 'react';
import { AuthContextType, User } from '@/types/auth';
import { useAuthOperations } from '@/hooks/useAuthOperations';
import { hasPermission, hasRole, getStoredToken, createMockUser } from '@/utils/authHelpers';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const authOperations = useAuthOperations();

  useEffect(() => {
    // Check for existing session on mount
    const checkAuth = async () => {
      console.log('AuthProvider: Checking existing authentication...');
      try {
        const token = getStoredToken();
        if (token) {
          console.log('AuthProvider: Found existing token, setting mock user');
          const mockUser = createMockUser('sarah.mitchell@lawfirm.com');
          authOperations.setUser(mockUser);
        } else {
          console.log('AuthProvider: No existing token found');
        }
      } catch (error) {
        console.error('AuthProvider: Auth check failed:', error);
        localStorage.removeItem('auth_token');
      } finally {
        authOperations.setIsLoading(false);
        console.log('AuthProvider: Auth check completed');
      }
    };

    checkAuth();
  }, []);

  const value: AuthContextType = {
    user: authOperations.user,
    isAuthenticated: !!authOperations.user,
    isLoading: authOperations.isLoading,
    login: authOperations.login,
    logout: authOperations.logout,
    signup: authOperations.signup,
    resetPassword: authOperations.resetPassword,
    enableMfa: authOperations.enableMfa,
    verifyMfa: authOperations.verifyMfa,
    hasPermission: (permission: string) => hasPermission(authOperations.user, permission),
    hasRole: (role: string) => hasRole(authOperations.user, role)
  };

  console.log('AuthProvider render - isAuthenticated:', !!authOperations.user, 'isLoading:', authOperations.isLoading);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
