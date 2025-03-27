
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import ChipBadge from '@/components/ui/ChipBadge';
import { ScaleIn, FadeIn } from '@/components/ui/animations';

// Mock data for activities
const activities = [
  {
    id: 1,
    title: "Word Association Game",
    description: "Help students connect related words through visual cues and interactive prompts.",
    targetWords: ["Connect", "Match", "Associate"],
    categories: ["Vocabulary", "Association"],
    materials: ["Visual Cards"],
    color: "blue" as const,
    imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    title: "Sentence Building Blocks",
    description: "Students construct sentences by arranging words in the correct order.",
    targetWords: ["Arrange", "Build", "Structure"],
    categories: ["Grammar", "Syntax"],
    materials: ["Word Cards"],
    color: "orange" as const,
    imageUrl: "https://images.unsplash.com/photo-1555431189-0fabf2667795?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    title: "Rhyme Time Challenge",
    description: "Find and match words that rhyme through engaging audio and visual cues.",
    targetWords: ["Rhyme", "Sound", "Pattern"],
    categories: ["Phonics", "Rhyming"],
    materials: ["Audio Clips"],
    color: "green" as const,
    imageUrl: "https://images.unsplash.com/photo-1588075592446-265fd1e6e76f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 4,
    title: "Synonym Explorer",
    description: "Discover words with similar meanings through interactive exploration.",
    targetWords: ["Similar", "Meaning", "Alternative"],
    categories: ["Vocabulary", "Synonyms"],
    materials: ["Picture Cards"],
    color: "purple" as const,
    imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 5,
    title: "Story Sequence Cards",
    description: "Arrange pictures in order to create a logical sequence of events.",
    targetWords: ["Order", "Sequence", "Arrange"],
    categories: ["Comprehension", "Sequencing"],
    materials: ["Story Cards"],
    color: "yellow" as const,
    imageUrl: "https://images.unsplash.com/photo-1553729784-e91953dec042?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  },
];

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
        <div className="text-center mb-12">
          <ScaleIn>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Explore <span className="text-vault-blue">Learning Activities</span>
            </h2>
          </ScaleIn>
          <FadeIn delay={0.2}>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Browse our collection of interactive activities designed to engage children 
              with learning disabilities and make education enjoyable.
            </p>
          </FadeIn>
        </div>
        
        <div className="relative">
          <div 
            ref={carouselRef}
            className="flex overflow-hidden"
          >
            <div className="flex gap-6 transition-transform duration-500 px-4 md:px-0 py-6 md:py-10">
              {activities.map((activity, index) => (
                <div 
                  key={activity.id}
                  className={`flex-shrink-0 w-full sm:w-[calc(50%-12px)] md:w-[calc(33.333%-16px)] transition-all duration-500 ${
                    index === currentIndex 
                      ? 'scale-100 opacity-100' 
                      : 'scale-95 opacity-80'
                  }`}
                >
                  <Link to={`/activities/${activity.id}`}>
                    <div className={`h-full rounded-2xl bg-white p-6 shadow-soft card-hover overflow-hidden`}>
                      {/* Image */}
                      <div className="aspect-video rounded-lg overflow-hidden mb-4 bg-vault-light-blue">
                        <img 
                          src={activity.imageUrl || `https://api.dicebear.com/7.x/shapes/svg?seed=${activity.id}`} 
                          alt={activity.title} 
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                        />
                      </div>

                      <div className="mb-4">
                        <ChipBadge text={activity.categories[0]} variant={activity.color} />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{activity.title}</h3>
                      <p className="text-muted-foreground text-sm mb-3">{activity.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {activity.targetWords.map((word, i) => (
                          <span 
                            key={i} 
                            className={`target-word ${activity.color}`}
                          >
                            {word}
                          </span>
                        ))}
                      </div>
                      
                      <div className="pt-4 mt-auto border-t border-border">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            {activity.materials.join(', ')}
                          </span>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-vault-blue">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
          
          {/* Navigation Buttons */}
          <button 
            onClick={goToPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 bg-white rounded-full p-3 shadow-medium hover:shadow-blue-glow transition-all duration-300 hidden md:block"
            aria-label="Previous activity"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-vault-blue">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          
          <button 
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 bg-white rounded-full p-3 shadow-medium hover:shadow-blue-glow transition-all duration-300 hidden md:block"
            aria-label="Next activity"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-vault-blue">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
        
        {/* Pagination Indicators */}
        <div className="flex justify-center items-center gap-2 mt-8">
          {activities.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                i === currentIndex 
                  ? 'bg-vault-blue w-6' 
                  : 'bg-vault-blue/30'
              }`}
              aria-label={`Go to activity ${i + 1}`}
            />
          ))}
        </div>
        
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
