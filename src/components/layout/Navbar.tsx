
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FadeIn } from '@/components/ui/animations';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Activities', path: '/activities' },
    { name: 'About', path: '/about' },
  ];
  
  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'py-3 glass shadow-soft' 
          : 'py-5 bg-transparent'
      }`}
    >
      <div className="container px-4 mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-primary font-bold text-2xl transition-all duration-300 hover:text-vault-blue hover:scale-105">
            Vault<span className="text-vault-orange">Learning</span>
          </span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-base font-medium transition-all duration-300 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:origin-bottom-right after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 hover:text-primary hover:after:origin-bottom-left hover:after:scale-x-100 ${
                location.pathname === link.path 
                  ? 'text-primary after:origin-bottom-left after:scale-x-100' 
                  : 'text-foreground'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>
        
        <div className="flex items-center gap-3">
          <FadeIn>
            <button className="btn-primary hidden sm:block">
              Try for Free
            </button>
          </FadeIn>
          
          <button className="block md:hidden text-foreground p-2 rounded-full hover:bg-muted transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
