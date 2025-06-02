
import React, { useState } from 'react';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';
import { PasswordResetForm } from './PasswordResetForm';

type AuthView = 'login' | 'signup' | 'reset';

interface AuthLayoutProps {
  onAuthSuccess: () => void;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ onAuthSuccess }) => {
  const [currentView, setCurrentView] = useState<AuthView>('login');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {currentView === 'login' && (
          <LoginForm
            onSuccess={onAuthSuccess}
            onSwitchToSignup={() => setCurrentView('signup')}
            onSwitchToReset={() => setCurrentView('reset')}
          />
        )}
        
        {currentView === 'signup' && (
          <SignupForm
            onSuccess={onAuthSuccess}
            onSwitchToLogin={() => setCurrentView('login')}
          />
        )}
        
        {currentView === 'reset' && (
          <PasswordResetForm
            onSuccess={() => setCurrentView('login')}
            onSwitchToLogin={() => setCurrentView('login')}
          />
        )}
      </div>
    </div>
  );
};
