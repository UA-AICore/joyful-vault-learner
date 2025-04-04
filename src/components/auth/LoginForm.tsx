
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from './AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LoginFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginForm = ({ isOpen, onClose }: LoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'student' | 'educator'>('student');
  const [isLoading, setIsLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const { login, register } = useAuth();
  const { toast } = useToast();

  const validateEmail = (email: string): boolean => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    
    // Basic validation
    if (!validateEmail(email.trim())) {
      setErrorMessage("Please enter a valid email address");
      return;
    }
    
    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters");
      return;
    }
    
    if (isRegister && !name.trim()) {
      setErrorMessage("Name is required");
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (isRegister) {
        await register(name.trim(), email.trim(), password, role);
        toast({
          title: "Account created",
          description: `Welcome to Vault Learning, ${name}!`,
        });
        
        // For development without email verification
        toast({
          title: "Check your email",
          description: "Please check your email to verify your account",
        });
      } else {
        await login(email.trim(), password, role);
        toast({
          title: "Welcome back!",
          description: "You've successfully logged in.",
        });
      }
      onClose();
    } catch (error: any) {
      console.error("Auth error:", error);
      
      // Format error message for display
      let message = "Something went wrong";
      
      if (error.message) {
        if (error.message.includes("Invalid login credentials")) {
          message = "Invalid email or password";
        } else if (error.message.includes("Email not confirmed")) {
          message = "Please confirm your email address before logging in";
        } else if (error.message.includes("Invalid role")) {
          message = error.message;
        } else if (error.message.includes("User already registered")) {
          message = "This email is already registered";
        } else {
          message = error.message;
        }
      }
      
      setErrorMessage(message);
      
      toast({
        title: "Authentication error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegister(!isRegister);
    // Reset form state
    setPassword('');
    setErrorMessage(null);
  };

  // Demo credentials
  const fillDemoCredentials = () => {
    if (role === 'educator') {
      setEmail('educator@example.com');
      setPassword('password123');
    } else {
      setEmail('student@example.com');
      setPassword('password123');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open && !isLoading) onClose();
    }}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isRegister ? 'Create Account' : 'Login to Vault Learning'}</DialogTitle>
          <DialogDescription>
            {isRegister 
              ? 'Sign up for an account to access learning activities.'
              : 'Enter your credentials to access your account.'}
          </DialogDescription>
        </DialogHeader>

        {errorMessage && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
            <p className="text-red-700 text-sm">{errorMessage}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="flex flex-col space-y-2">
            <div className="flex space-x-2">
              <Button
                type="button"
                onClick={() => setRole('student')}
                variant={role === 'student' ? 'default' : 'outline'}
                className="flex-1"
                disabled={isLoading}
              >
                Student
              </Button>
              <Button
                type="button"
                onClick={() => setRole('educator')}
                variant={role === 'educator' ? 'default' : 'outline'}
                className="flex-1"
                disabled={isLoading}
              >
                Educator
              </Button>
            </div>
          </div>

          {isRegister && (
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Enter your name"
                disabled={isLoading}
                autoComplete="name"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
              disabled={isLoading}
              autoComplete={isRegister ? "email" : "username"}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              disabled={isLoading}
              autoComplete={isRegister ? "new-password" : "current-password"}
            />
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full text-sm text-muted-foreground"
            onClick={fillDemoCredentials}
            disabled={isLoading}
          >
            Use demo credentials for {role}
          </Button>

          <div className="pt-2">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : isRegister ? "Create Account" : "Login"}
            </Button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={toggleMode}
              className="text-sm text-blue-600 hover:underline"
              disabled={isLoading}
            >
              {isRegister 
                ? "Already have an account? Login" 
                : "Don't have an account? Sign up"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LoginForm;
