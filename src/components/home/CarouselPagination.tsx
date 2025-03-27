
import React from 'react';

interface CarouselPaginationProps {
  total: number;
  currentIndex: number;
  onChange: (index: number) => void;
}

const CarouselPagination: React.FC<CarouselPaginationProps> = ({ 
  total, 
  currentIndex, 
  onChange 
}) => {
  return (
    <div className="flex justify-center items-center gap-2 mt-8">
      {Array.from({ length: total }, (_, i) => (
        <button
          key={i}
          onClick={() => onChange(i)}
          className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
            i === currentIndex 
              ? 'bg-vault-blue w-6' 
              : 'bg-vault-blue/30'
          }`}
          aria-label={`Go to activity ${i + 1}`}
        />
      ))}
    </div>
  );
};

export default CarouselPagination;
