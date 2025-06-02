
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
        {/* Logo Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4">
            <img 
              src="/lovable-uploads/d14716a1-25e5-4687-9ec2-56dbe060a748.png" 
              alt="LegisClear Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">LegisClear</h1>
          <p className="text-slate-600">AI Legal Intelligence Platform</p>
        </div>

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
