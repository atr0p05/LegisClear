
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'senior_attorney' | 'attorney' | 'paralegal' | 'legal_researcher' | 'read_only';
  organization?: string;
  mfaEnabled: boolean;
  lastLogin: Date;
  permissions: string[];
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, mfaCode?: string) => Promise<{ success: boolean; requiresMfa?: boolean; error?: string }>;
  logout: () => void;
  signup: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  enableMfa: () => Promise<{ success: boolean; qrCode?: string; error?: string }>;
  verifyMfa: (code: string) => Promise<{ success: boolean; error?: string }>;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (token) {
          // Simulate API call to verify token and get user data
          const mockUser: User = {
            id: '1',
            email: 'sarah.mitchell@lawfirm.com',
            name: 'Sarah Mitchell',
            role: 'senior_attorney',
            organization: 'Mitchell & Associates',
            mfaEnabled: true,
            lastLogin: new Date(),
            permissions: ['read_documents', 'write_documents', 'ai_research', 'manage_team']
          };
          setUser(mockUser);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('auth_token');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string, mfaCode?: string) => {
    try {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock validation
      if (email === 'sarah.mitchell@lawfirm.com' && password === 'password123') {
        if (!mfaCode) {
          return { success: false, requiresMfa: true };
        }
        
        if (mfaCode !== '123456') {
          return { success: false, error: 'Invalid MFA code' };
        }

        const mockUser: User = {
          id: '1',
          email,
          name: 'Sarah Mitchell',
          role: 'senior_attorney',
          organization: 'Mitchell & Associates',
          mfaEnabled: true,
          lastLogin: new Date(),
          permissions: ['read_documents', 'write_documents', 'ai_research', 'manage_team']
        };

        localStorage.setItem('auth_token', 'mock_token_123');
        setUser(mockUser);
        return { success: true };
      }
      
      return { success: false, error: 'Invalid credentials' };
    } catch (error) {
      return { success: false, error: 'Login failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
  };

  const signup = async (email: string, password: string, name: string) => {
    try {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock signup
      const mockUser: User = {
        id: Date.now().toString(),
        email,
        name,
        role: 'attorney',
        mfaEnabled: false,
        lastLogin: new Date(),
        permissions: ['read_documents', 'ai_research']
      };

      localStorage.setItem('auth_token', 'mock_token_' + Date.now());
      setUser(mockUser);
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Signup failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Password reset failed' };
    }
  };

  const enableMfa = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { 
        success: true, 
        qrCode: 'data:image/png;base64,mock_qr_code' 
      };
    } catch (error) {
      return { success: false, error: 'MFA setup failed' };
    }
  };

  const verifyMfa = async (code: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      if (code === '123456') {
        if (user) {
          setUser({ ...user, mfaEnabled: true });
        }
        return { success: true };
      }
      return { success: false, error: 'Invalid MFA code' };
    } catch (error) {
      return { success: false, error: 'MFA verification failed' };
    }
  };

  const hasPermission = (permission: string) => {
    return user?.permissions.includes(permission) || false;
  };

  const hasRole = (role: string) => {
    return user?.role === role || false;
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    signup,
    resetPassword,
    enableMfa,
    verifyMfa,
    hasPermission,
    hasRole
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
