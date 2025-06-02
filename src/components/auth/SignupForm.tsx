
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Loader2, Shield, Eye, EyeOff, Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SignupFormProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

interface PasswordStrength {
  score: number;
  feedback: string[];
  isValid: boolean;
}

export const SignupForm: React.FC<SignupFormProps> = ({ 
  onSuccess, 
  onSwitchToLogin 
}) => {
  const { signup, isLoading } = useAuth();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculatePasswordStrength = (password: string): PasswordStrength => {
    const checks = [
      { test: password.length >= 8, message: 'At least 8 characters' },
      { test: /[A-Z]/.test(password), message: 'Uppercase letter' },
      { test: /[a-z]/.test(password), message: 'Lowercase letter' },
      { test: /\d/.test(password), message: 'Number' },
      { test: /[!@#$%^&*(),.?":{}|<>]/.test(password), message: 'Special character' }
    ];

    const passed = checks.filter(check => check.test).length;
    const feedback = checks.map(check => check.message);

    return {
      score: (passed / checks.length) * 100,
      feedback,
      isValid: passed >= 4
    };
  };

  const passwordStrength = calculatePasswordStrength(formData.password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (!passwordStrength.isValid) {
      setError('Password does not meet security requirements');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const result = await signup(formData.email, formData.password, formData.name);

    if (result.success) {
      toast({
        title: "Account created successfully",
        description: "Welcome to LegalAI Pro! Please set up MFA for enhanced security.",
      });
      onSuccess?.();
    } else {
      setError(result.error || 'Signup failed');
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
          <Shield className="w-6 h-6 text-white" />
        </div>
        <CardTitle className="text-2xl">Create Account</CardTitle>
        <CardDescription>
          Join LegalAI Pro for secure legal research
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
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@lawfirm.com"
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
                placeholder="Create a strong password"
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
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            
            {formData.password && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Progress value={passwordStrength.score} className="flex-1" />
                  <span className="text-xs text-muted-foreground">
                    {passwordStrength.score < 40 ? 'Weak' : 
                     passwordStrength.score < 80 ? 'Good' : 'Strong'}
                  </span>
                </div>
                <div className="text-xs space-y-1">
                  {passwordStrength.feedback.map((requirement, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      {index < Math.floor(passwordStrength.score / 20) ? (
                        <Check className="w-3 h-3 text-green-500" />
                      ) : (
                        <X className="w-3 h-3 text-red-500" />
                      )}
                      <span className={index < Math.floor(passwordStrength.score / 20) ? 'text-green-600' : 'text-muted-foreground'}>
                        {requirement}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                disabled={isLoading}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
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
            disabled={isLoading || !passwordStrength.isValid}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              'Create Account'
            )}
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Button
              type="button"
              variant="link"
              onClick={onSwitchToLogin}
              className="text-sm p-0 h-auto"
            >
              Sign in
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
