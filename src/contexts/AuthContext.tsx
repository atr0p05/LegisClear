
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
      console.log('AuthProvider: Checking existing authentication...');
      try {
        const token = localStorage.getItem('auth_token');
        if (token) {
          console.log('AuthProvider: Found existing token, setting mock user');
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
        } else {
          console.log('AuthProvider: No existing token found');
        }
      } catch (error) {
        console.error('AuthProvider: Auth check failed:', error);
        localStorage.removeItem('auth_token');
      } finally {
        setIsLoading(false);
        console.log('AuthProvider: Auth check completed');
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string, mfaCode?: string) => {
    console.log('AuthContext login called with:', { email, hasPassword: !!password, hasMfaCode: !!mfaCode });
    
    try {
      setIsLoading(true);
      console.log('AuthContext: Setting loading to true');
      
      // Simulate API call
      console.log('AuthContext: Starting mock API delay...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('AuthContext: Mock API delay completed');
      
      // Mock validation
      console.log('AuthContext: Validating credentials...');
      if (email === 'sarah.mitchell@lawfirm.com' && password === 'password123') {
        console.log('AuthContext: Credentials are correct');
        
        if (!mfaCode) {
          console.log('AuthContext: No MFA code provided, requiring MFA');
          return { success: false, requiresMfa: true };
        }
        
        console.log('AuthContext: Validating MFA code:', mfaCode);
        if (mfaCode !== '123456') {
          console.log('AuthContext: Invalid MFA code');
          return { success: false, error: 'Invalid MFA code' };
        }

        console.log('AuthContext: MFA code is correct, logging in user');
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
        console.log('AuthContext: Login successful');
        return { success: true };
      }
      
      console.log('AuthContext: Invalid credentials provided');
      return { success: false, error: 'Invalid credentials' };
    } catch (error) {
      console.error('AuthContext: Login error:', error);
      return { success: false, error: 'Login failed' };
    } finally {
      setIsLoading(false);
      console.log('AuthContext: Setting loading to false');
    }
  };

  const logout = () => {
    console.log('AuthContext: Logging out user');
    localStorage.removeItem('auth_token');
    setUser(null);
  };

  const signup = async (email: string, password: string, name: string) => {
    console.log('AuthContext: Signup called for:', email);
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
      console.log('AuthContext: Signup successful');
      return { success: true };
    } catch (error) {
      console.error('AuthContext: Signup error:', error);
      return { success: false, error: 'Signup failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    console.log('AuthContext: Password reset requested for:', email);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true };
    } catch (error) {
      console.error('AuthContext: Password reset error:', error);
      return { success: false, error: 'Password reset failed' };
    }
  };

  const enableMfa = async () => {
    console.log('AuthContext: Enabling MFA');
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { 
        success: true, 
        qrCode: 'data:image/png;base64,mock_qr_code' 
      };
    } catch (error) {
      console.error('AuthContext: MFA enable error:', error);
      return { success: false, error: 'MFA setup failed' };
    }
  };

  const verifyMfa = async (code: string) => {
    console.log('AuthContext: Verifying MFA code:', code);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      if (code === '123456') {
        if (user) {
          setUser({ ...user, mfaEnabled: true });
        }
        console.log('AuthContext: MFA verification successful');
        return { success: true };
      }
      console.log('AuthContext: Invalid MFA code');
      return { success: false, error: 'Invalid MFA code' };
    } catch (error) {
      console.error('AuthContext: MFA verification error:', error);
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

  console.log('AuthProvider render - isAuthenticated:', !!user, 'isLoading:', isLoading);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
