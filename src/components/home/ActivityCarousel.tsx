
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FadeIn } from '@/components/ui/animations';
import { activities } from '@/data/mockActivities';
import HomeActivityCard from './HomeActivityCard';
import CarouselPagination from './CarouselPagination';
import CarouselNavButtons from './CarouselNavButtons';
import SectionHeader from './SectionHeader';

const ActivityCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const maxIndex = activities.length - 1;
  const carouselRef = useRef<HTMLDivElement>(null);
  
  const goToNext = () => {
    setCurrentIndex(current => (current < maxIndex ? current + 1 : 0));
  };
  
  const goToPrev = () => {
    setCurrentIndex(current => (current > 0 ? current - 1 : maxIndex));
  };
  
  useEffect(() => {
    if (carouselRef.current) {
      const scrollAmount = currentIndex * (carouselRef.current.offsetWidth / 3);
      carouselRef.current.scrollTo({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  }, [currentIndex]);
  
  return (
    <section className="py-16 bg-vault-light-blue/30">
      <div className="container px-4 mx-auto">
        <SectionHeader 
          title={<>Explore <span className="text-vault-blue">Learning Activities</span></>}
          description="Browse our collection of interactive activities designed to engage children with learning disabilities and make education enjoyable."
        />
        
        <div className="relative">
          <div 
            ref={carouselRef}
            className="flex overflow-hidden"
          >
            <div className="flex gap-6 transition-transform duration-500 px-4 md:px-0 py-6 md:py-10">
              {activities.map((activity, index) => (
                <HomeActivityCard 
                  key={activity.id}
                  activity={activity}
                  isActive={index === currentIndex}
                />
              ))}
            </div>
          </div>
          
          <CarouselNavButtons onPrev={goToPrev} onNext={goToNext} />
        </div>
        
        <CarouselPagination 
          total={activities.length}
          currentIndex={currentIndex}
          onChange={setCurrentIndex}
        />
        
        <div className="text-center mt-10">
          <Link 
            to="/activities" 
            className="btn-primary inline-flex items-center gap-2"
          >
            View All Activities
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ActivityCarousel;
