
import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import SearchFilters from '@/components/activities/SearchFilters';
import ActivityCard, { Activity } from '@/components/activities/ActivityCard';
import { FadeIn, StaggeredChildren } from '@/components/ui/animations';

// Sample data
const sampleActivities: Activity[] = [
  {
    id: 1,
    title: "Word Association Game",
    description: "Help students connect related words through visual cues and interactive prompts.",
    targetWords: ["Connect", "Match", "Associate"],
    categories: ["Vocabulary", "Association"],
    materials: ["Visual Cards"],
    color: "blue",
    status: "active",
  },
  {
    id: 2,
    title: "Sentence Building Blocks",
    description: "Students construct sentences by arranging words in the correct order.",
    targetWords: ["Arrange", "Build", "Structure"],
    categories: ["Grammar", "Syntax"],
    materials: ["Word Cards"],
    color: "orange",
    status: "active",
  },
  {
    id: 3,
    title: "Rhyme Time Challenge",
    description: "Find and match words that rhyme through engaging audio and visual cues.",
    targetWords: ["Rhyme", "Sound", "Pattern"],
    categories: ["Phonics", "Rhyming"],
    materials: ["Audio Clips"],
    color: "green",
    status: "active",
  },
  {
    id: 4,
    title: "Synonym Explorer",
    description: "Discover words with similar meanings through interactive exploration.",
    targetWords: ["Similar", "Meaning", "Alternative"],
    categories: ["Vocabulary", "Synonyms"],
    materials: ["Picture Cards"],
    color: "purple",
    status: "draft",
  },
  {
    id: 5,
    title: "Story Sequence Cards",
    description: "Arrange pictures in order to create a logical sequence of events.",
    targetWords: ["Order", "Sequence", "Arrange"],
    categories: ["Comprehension", "Sequencing"],
    materials: ["Story Cards"],
    color: "yellow",
    status: "active",
  },
  {
    id: 6,
    title: "Beginning Sounds Identification",
    description: "Identify and match words that start with the same sound.",
    targetWords: ["Sound", "Match", "Pattern"],
    categories: ["Phonics", "Association"],
    materials: ["Picture Cards", "Audio Clips"],
    color: "blue",
    status: "active",
  },
];

type FilterCategory = 'category' | 'material' | 'targetWord';

const Activities = () => {
  const [activeFilters, setActiveFilters] = useState<Record<FilterCategory, string[]>>({
    category: [],
    material: [],
    targetWord: [],
  });
  
  // Filter activities based on selected filters
  const filteredActivities = sampleActivities.filter(activity => {
    // If no filters are selected, show all activities
    if (
      activeFilters.category.length === 0 &&
      activeFilters.material.length === 0 &&
      activeFilters.targetWord.length === 0
    ) {
      return true;
    }
    
    // Check categories
    const categoryMatch = activeFilters.category.length === 0 || 
      activeFilters.category.some(category => 
        activity.categories.map(c => c.toLowerCase().replace(/\s+/g, '-')).includes(category)
      );
    
    // Check materials
    const materialMatch = activeFilters.material.length === 0 || 
      activeFilters.material.some(material => 
        activity.materials.map(m => m.toLowerCase().replace(/\s+/g, '-')).includes(material)
      );
    
    // Check target words
    const targetWordMatch = activeFilters.targetWord.length === 0 || 
      activeFilters.targetWord.some(word => 
        activity.targetWords.map(w => w.toLowerCase()).includes(word)
      );
    
    // Apply AND logic when multiple filter types are used
    return categoryMatch && materialMatch && targetWordMatch;
  });
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-32 pb-20">
        <div className="container px-4 mx-auto">
          <FadeIn>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Learning Activities</h1>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="text-muted-foreground mb-8 max-w-2xl">
              Browse our collection of engaging activities designed to support children with learning disabilities. 
              Use the filters to find activities that match your specific needs.
            </p>
          </FadeIn>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <FadeIn delay={0.2}>
                <SearchFilters onFilterChange={setActiveFilters} />
              </FadeIn>
            </div>
            
            <div className="lg:col-span-2">
              <StaggeredChildren
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                animation="fadeIn"
                staggerDelay={0.1}
                baseDelay={0.3}
              >
                {filteredActivities.length > 0 ? (
                  filteredActivities.map((activity) => (
                    <ActivityCard key={activity.id} activity={activity} />
                  ))
                ) : (
                  <div className="col-span-full flex items-center justify-center py-16 text-center">
                    <div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.182 16.318A4.486 4.486 0 0012.016 15a4.486 4.486 0 00-3.198 1.318M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z"
                        />
                      </svg>
                      <h3 className="text-xl font-medium mb-2">No activities found</h3>
                      <p className="text-muted-foreground">
                        Try adjusting your filters to find what you're looking for.
                      </p>
                    </div>
                  </div>
                )}
              </StaggeredChildren>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Activities;
