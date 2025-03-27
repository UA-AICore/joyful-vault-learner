
import React from 'react';
import { cn } from "@/lib/utils";

type ColorVariant = 'blue' | 'orange' | 'green' | 'purple' | 'yellow';

interface ChipBadgeProps {
  text: string;
  variant?: ColorVariant;
  className?: string;
  onClick?: () => void;
  children?: React.ReactNode; // Added this line to allow children
}

const colorMap: Record<ColorVariant, string> = {
  blue: 'bg-vault-light-blue text-vault-blue',
  orange: 'bg-vault-light-orange text-vault-orange',
  green: 'bg-vault-light-green text-vault-green',
  purple: 'bg-vault-light-purple text-vault-purple',
  yellow: 'bg-vault-light-yellow text-vault-yellow',
};

const ChipBadge: React.FC<ChipBadgeProps> = ({ 
  text, 
  variant = 'blue', 
  className,
  onClick,
  children
}) => {
  return (
    <span 
      className={cn(
        "inline-block px-3 py-1 rounded-full text-sm font-medium transition-all duration-300",
        colorMap[variant],
        onClick && "cursor-pointer hover:scale-105",
        className
      )}
      onClick={onClick}
    >
      {children || text}
    </span>
  );
};

export default ChipBadge;
