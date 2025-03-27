
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from './AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

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
  
  const { login, register } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (isRegister) {
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
    } catch (error) {
      toast({
        title: "Authentication error",
        description: error instanceof Error ? error.message : "Something went wrong",
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
            />
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full text-sm text-muted-foreground"
            onClick={fillDemoCredentials}
          >
            Use demo credentials for {role}
          </Button>

          <div className="pt-2">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Processing..." : isRegister ? "Create Account" : "Login"}
            </Button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={toggleMode}
              className="text-sm text-blue-600 hover:underline"
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
