
import React from 'react';

interface CarouselNavButtonsProps {
  onPrev: () => void;
  onNext: () => void;
}

const CarouselNavButtons: React.FC<CarouselNavButtonsProps> = ({ onPrev, onNext }) => {
  return (
    <>
      <button 
        onClick={onPrev}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 bg-white rounded-full p-3 shadow-medium hover:shadow-blue-glow transition-all duration-300 hidden md:block"
        aria-label="Previous activity"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-vault-blue">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>
      
      <button 
        onClick={onNext}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 bg-white rounded-full p-3 shadow-medium hover:shadow-blue-glow transition-all duration-300 hidden md:block"
        aria-label="Next activity"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-vault-blue">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>
    </>
  );
};

export default CarouselNavButtons;
