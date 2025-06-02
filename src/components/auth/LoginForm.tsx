
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Shield, Eye, EyeOff } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface LoginFormProps {
  onSuccess?: () => void;
  onSwitchToSignup?: () => void;
  onSwitchToReset?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ 
  onSuccess, 
  onSwitchToSignup, 
  onSwitchToReset 
}) => {
  const { login, isLoading } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  console.log('LoginForm render - isLoading:', isLoading);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    console.log('Form submitted with data:', { 
      email: formData.email, 
      hasPassword: !!formData.password
    });

    if (!formData.email || !formData.password) {
      const errorMsg = 'Please fill in all required fields';
      setError(errorMsg);
      console.log('Validation error:', errorMsg);
      return;
    }

    console.log('Calling login function...');
    const result = await login(formData.email, formData.password);

    console.log('Login result:', result);

    if (result.success) {
      toast({
        title: "Login Successful",
        description: "Welcome back to LegalAI Pro",
      });
      console.log('Login successful, calling onSuccess');
      onSuccess?.();
    } else {
      const errorMsg = result.error || 'Login failed';
      console.log('Login failed:', errorMsg);
      setError(errorMsg);
      toast({
        title: "Login Failed",
        description: errorMsg,
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    console.log(`Input changed - ${field}:`, value);
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) {
      console.log('Clearing error due to input change');
      setError(null);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
          <Shield className="w-6 h-6 text-white" />
        </div>
        <CardTitle className="text-2xl">Welcome Back</CardTitle>
        <CardDescription>
          Sign in to your LegalAI Pro account
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="sarah.mitchell@lawfirm.com"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                disabled={isLoading}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </Button>

          <div className="text-sm text-center text-muted-foreground bg-muted p-3 rounded-md">
            <strong>Demo Credentials:</strong><br />
            Email: sarah.mitchell@lawfirm.com<br />
            Password: password123
          </div>

          <div className="flex flex-col space-y-2 text-sm text-center">
            <Button
              type="button"
              variant="link"
              onClick={onSwitchToReset}
              className="text-sm"
              disabled={isLoading}
            >
              Forgot your password?
            </Button>
            
            <div className="text-muted-foreground">
              Don't have an account?{' '}
              <Button
                type="button"
                variant="link"
                onClick={onSwitchToSignup}
                className="text-sm p-0 h-auto"
                disabled={isLoading}
              >
                Sign up
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
