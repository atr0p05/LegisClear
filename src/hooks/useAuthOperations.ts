
import { useState } from 'react';
import { User, LoginResult, SignupResult, ResetPasswordResult, MfaResult } from '@/types/auth';
import { createMockUser, createSignupUser, setStoredToken, removeStoredToken } from '@/utils/authHelpers';

export const useAuthOperations = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string, mfaCode?: string): Promise<LoginResult> => {
    console.log('AuthOperations login called with:', { email, hasPassword: !!password, hasMfaCode: !!mfaCode });
    
    try {
      setIsLoading(true);
      console.log('AuthOperations: Setting loading to true');
      
      // Simulate API call
      console.log('AuthOperations: Starting mock API delay...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('AuthOperations: Mock API delay completed');
      
      // Mock validation
      console.log('AuthOperations: Validating credentials...');
      if (email === 'sarah.mitchell@lawfirm.com' && password === 'password123') {
        console.log('AuthOperations: Credentials are correct');
        
        if (!mfaCode) {
          console.log('AuthOperations: No MFA code provided, requiring MFA');
          return { success: false, requiresMfa: true };
        }
        
        console.log('AuthOperations: Validating MFA code:', mfaCode);
        if (mfaCode !== '123456') {
          console.log('AuthOperations: Invalid MFA code');
          return { success: false, error: 'Invalid MFA code' };
        }

        console.log('AuthOperations: MFA code is correct, logging in user');
        const mockUser = createMockUser(email);
        setStoredToken('mock_token_123');
        setUser(mockUser);
        console.log('AuthOperations: Login successful');
        return { success: true };
      }
      
      console.log('AuthOperations: Invalid credentials provided');
      return { success: false, error: 'Invalid credentials' };
    } catch (error) {
      console.error('AuthOperations: Login error:', error);
      return { success: false, error: 'Login failed' };
    } finally {
      setIsLoading(false);
      console.log('AuthOperations: Setting loading to false');
    }
  };

  const logout = (): void => {
    console.log('AuthOperations: Logging out user');
    removeStoredToken();
    setUser(null);
  };

  const signup = async (email: string, password: string, name: string): Promise<SignupResult> => {
    console.log('AuthOperations: Signup called for:', email);
    try {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser = createSignupUser(email, name);
      setStoredToken('mock_token_' + Date.now());
      setUser(mockUser);
      console.log('AuthOperations: Signup successful');
      return { success: true };
    } catch (error) {
      console.error('AuthOperations: Signup error:', error);
      return { success: false, error: 'Signup failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string): Promise<ResetPasswordResult> => {
    console.log('AuthOperations: Password reset requested for:', email);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true };
    } catch (error) {
      console.error('AuthOperations: Password reset error:', error);
      return { success: false, error: 'Password reset failed' };
    }
  };

  const enableMfa = async (): Promise<MfaResult> => {
    console.log('AuthOperations: Enabling MFA');
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { 
        success: true, 
        qrCode: 'data:image/png;base64,mock_qr_code' 
      };
    } catch (error) {
      console.error('AuthOperations: MFA enable error:', error);
      return { success: false, error: 'MFA setup failed' };
    }
  };

  const verifyMfa = async (code: string): Promise<MfaResult> => {
    console.log('AuthOperations: Verifying MFA code:', code);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      if (code === '123456') {
        if (user) {
          setUser({ ...user, mfaEnabled: true });
        }
        console.log('AuthOperations: MFA verification successful');
        return { success: true };
      }
      console.log('AuthOperations: Invalid MFA code');
      return { success: false, error: 'Invalid MFA code' };
    } catch (error) {
      console.error('AuthOperations: MFA verification error:', error);
      return { success: false, error: 'MFA verification failed' };
    }
  };

  return {
    user,
    setUser,
    isLoading,
    setIsLoading,
    login,
    logout,
    signup,
    resetPassword,
    enableMfa,
    verifyMfa
  };
};
