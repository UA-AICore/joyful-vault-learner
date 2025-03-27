
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from './AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    
    try {
      if (isRegister) {
        if (!name.trim()) {
          throw new Error("Name is required");
        }
        
        await register(name, email, password, role);
        toast({
          title: "Account created",
          description: `Welcome to Vault Learning, ${name}!`,
        });
      } else {
        await login(email, password, role);
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
    setEmail('');
    setName('');
    setErrorMessage(null);
  };

  // Demo credentials
  const fillDemoCredentials = () => {
    if (role === 'educator') {
      setEmail('educator@example.com');
      setPassword('password');
    } else {
      setEmail('student@example.com');
      setPassword('password');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
              >
                Student
              </Button>
              <Button
                type="button"
                onClick={() => setRole('educator')}
                variant={role === 'educator' ? 'default' : 'outline'}
                className="flex-1"
              >
                Educator
              </Button>
            </div>
          </div>

          {isRegister && (
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your name"
                disabled={isLoading}
              />
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              disabled={isLoading}
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
