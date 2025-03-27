
import { useState } from 'react';
import { useAuth } from './AuthContext';
import { Button } from "@/components/ui/button";
import LoginForm from './LoginForm';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Link } from 'react-router-dom';
import { FadeIn } from '@/components/ui/animations';

const UserMenu = () => {
  const { user, logout, isEducator } = useAuth();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  
  const handleLoginClick = () => {
    setIsLoginOpen(true);
  };
  
  const handleLogout = () => {
    logout();
  };
  
  return (
    <div>
      {!user ? (
        <FadeIn>
          <Button onClick={handleLoginClick} className="btn-primary">
            Login
          </Button>
        </FadeIn>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-full overflow-hidden border-2 border-primary/20 hover:border-primary/50 transition-all duration-300 pl-2 pr-3 py-1">
              {user.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-vault-light-blue flex items-center justify-center">
                  <span className="text-vault-blue font-semibold">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <span className="text-sm font-medium">{user.name}</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            <DropdownMenuItem asChild>
              <Link to="/profile" className="cursor-pointer">Profile</Link>
            </DropdownMenuItem>
            
            {isEducator() && (
              <DropdownMenuItem asChild>
                <Link to="/manage-activities" className="cursor-pointer">Manage Activities</Link>
              </DropdownMenuItem>
            )}
            
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-500">
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      
      <LoginForm 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)} 
      />
    </div>
  );
};

export default UserMenu;
