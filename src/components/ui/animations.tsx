
import React from 'react';
import { cn } from "@/lib/utils";

// Fade In Animation
interface FadeInProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
}

export const FadeIn: React.FC<FadeInProps> = ({ 
  children, 
  className,
  delay = 0,
  duration = 0.4
}) => {
  return (
    <div 
      className={cn("animate-fade-in", className)}
      style={{
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`
      }}
    >
      {children}
    </div>
  );
};

// Scale In Animation
interface ScaleInProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
}

export const ScaleIn: React.FC<ScaleInProps> = ({ 
  children, 
  className,
  delay = 0,
  duration = 0.3
}) => {
  return (
    <div 
      className={cn("animate-scale-in", className)}
      style={{
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`
      }}
    >
      {children}
    </div>
  );
};

// Floating Animation
interface FloatProps {
  children: React.ReactNode;
  className?: string;
}

export const Float: React.FC<FloatProps> = ({ 
  children, 
  className
}) => {
  return (
    <div className={cn("animate-float", className)}>
      {children}
    </div>
  );
};

// Slide Up Animation
interface SlideUpProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
}

export const SlideUp: React.FC<SlideUpProps> = ({ 
  children, 
  className,
  delay = 0,
  duration = 0.7
}) => {
  return (
    <div 
      className={cn("animate-slide-up", className)}
      style={{
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`
      }}
    >
      {children}
    </div>
  );
};

// Slide Down Animation
interface SlideDownProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
}

export const SlideDown: React.FC<SlideDownProps> = ({ 
  children, 
  className,
  delay = 0,
  duration = 0.7
}) => {
  return (
    <div 
      className={cn("animate-slide-down", className)}
      style={{
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`
      }}
    >
      {children}
    </div>
  );
};

// Staggered Children Animation
interface StaggeredChildrenProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
  baseDelay?: number;
  animation?: 'fade' | 'scale' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight';
}

export const StaggeredChildren: React.FC<StaggeredChildrenProps> = ({ 
  children, 
  className,
  staggerDelay = 0.1,
  baseDelay = 0,
  animation = 'fade'
}) => {
  const animationClass = {
    fade: 'animate-fade-in',
    scale: 'animate-scale-in',
    slideUp: 'animate-slide-up',
    slideDown: 'animate-slide-down',
    slideLeft: 'animate-slide-left',
    slideRight: 'animate-slide-right',
  };

  return (
    <div className={cn(className)}>
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return child;
        
        return React.cloneElement(child as React.ReactElement, {
          className: cn(
            (child as React.ReactElement).props.className,
            animationClass[animation]
          ),
          style: {
            ...((child as React.ReactElement).props.style || {}),
            animationDelay: `${baseDelay + (index * staggerDelay)}s`
          }
        });
      })}
    </div>
  );
};
