
import { useState } from 'react';
import ChipBadge from '@/components/ui/ChipBadge';
import { FadeIn } from '@/components/ui/animations';

// Define filter types
type FilterCategory = 'category' | 'material' | 'targetWord';

interface FilterOption {
  id: string;
  label: string;
  type: FilterCategory;
  color: 'blue' | 'orange' | 'green' | 'purple' | 'yellow';
}

interface SearchFiltersProps {
  onFilterChange: (filters: Record<FilterCategory, string[]>) => void;
}

// Sample filter options
const filterOptions: FilterOption[] = [
  // Categories
  { id: 'vocabulary', label: 'Vocabulary', type: 'category', color: 'blue' },
  { id: 'grammar', label: 'Grammar', type: 'category', color: 'blue' },
  { id: 'phonics', label: 'Phonics', type: 'category', color: 'blue' },
  { id: 'comprehension', label: 'Comprehension', type: 'category', color: 'blue' },
  { id: 'association', label: 'Association', type: 'category', color: 'blue' },
  { id: 'syntax', label: 'Syntax', type: 'category', color: 'blue' },
  { id: 'rhyming', label: 'Rhyming', type: 'category', color: 'blue' },
  { id: 'synonyms', label: 'Synonyms', type: 'category', color: 'blue' },
  { id: 'sequencing', label: 'Sequencing', type: 'category', color: 'blue' },
  
  // Materials
  { id: 'visual-cards', label: 'Visual Cards', type: 'material', color: 'orange' },
  { id: 'word-cards', label: 'Word Cards', type: 'material', color: 'orange' },
  { id: 'audio-clips', label: 'Audio Clips', type: 'material', color: 'orange' },
  { id: 'picture-cards', label: 'Picture Cards', type: 'material', color: 'orange' },
  { id: 'story-cards', label: 'Story Cards', type: 'material', color: 'orange' },
  
  // Target Words
  { id: 'connect', label: 'Connect', type: 'targetWord', color: 'green' },
  { id: 'match', label: 'Match', type: 'targetWord', color: 'green' },
  { id: 'associate', label: 'Associate', type: 'targetWord', color: 'green' },
  { id: 'arrange', label: 'Arrange', type: 'targetWord', color: 'green' },
  { id: 'build', label: 'Build', type: 'targetWord', color: 'green' },
  { id: 'structure', label: 'Structure', type: 'targetWord', color: 'green' },
  { id: 'rhyme', label: 'Rhyme', type: 'targetWord', color: 'green' },
  { id: 'sound', label: 'Sound', type: 'targetWord', color: 'green' },
  { id: 'pattern', label: 'Pattern', type: 'targetWord', color: 'green' },
  { id: 'similar', label: 'Similar', type: 'targetWord', color: 'green' },
  { id: 'meaning', label: 'Meaning', type: 'targetWord', color: 'green' },
  { id: 'alternative', label: 'Alternative', type: 'targetWord', color: 'green' },
  { id: 'order', label: 'Order', type: 'targetWord', color: 'green' },
  { id: 'sequence', label: 'Sequence', type: 'targetWord', color: 'green' },
];

const SearchFilters: React.FC<SearchFiltersProps> = ({ onFilterChange }) => {
  const [activeFilters, setActiveFilters] = useState<Record<FilterCategory, string[]>>({
    category: [],
    material: [],
    targetWord: [],
  });
  
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  const toggleFilter = (filter: FilterOption) => {
    const currentFilters = [...activeFilters[filter.type]];
    const filterIndex = currentFilters.indexOf(filter.id);
    
    if (filterIndex >= 0) {
      currentFilters.splice(filterIndex, 1);
    } else {
      currentFilters.push(filter.id);
    }
    
    const newFilters = {
      ...activeFilters,
      [filter.type]: currentFilters,
    };
    
    setActiveFilters(newFilters);
    onFilterChange(newFilters);
  };
  
  const clearFilters = () => {
    const emptyFilters = {
      category: [],
      material: [],
      targetWord: [],
    };
    setActiveFilters(emptyFilters);
    onFilterChange(emptyFilters);
    setSearchTerm('');
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you'd implement search functionality here
    console.log("Searching for:", searchTerm);
  };
  
  // Group filter options by type
  const categories = filterOptions.filter(f => f.type === 'category');
  const materials = filterOptions.filter(f => f.type === 'material');
  const targetWords = filterOptions.filter(f => f.type === 'targetWord');
  
  return (
    <div className="bg-white rounded-2xl shadow-medium p-6">
      <FadeIn>
        <form onSubmit={handleSearch} className="mb-6">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for activities..."
              className="w-full pl-10 pr-4 py-3 rounded-full border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
            <button
              type="submit"
              className="absolute right-1 top-1/2 -translate-y-1/2 px-4 py-2 bg-primary text-primary-foreground rounded-full text-sm font-medium"
            >
              Search
            </button>
          </div>
        </form>
      </FadeIn>
      
      <div className="space-y-6">
        {/* Active Filters */}
        {(activeFilters.category.length > 0 || 
          activeFilters.material.length > 0 || 
          activeFilters.targetWord.length > 0) && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">Active Filters</h3>
              <button
                onClick={clearFilters}
                className="text-sm text-primary hover:underline"
              >
                Clear All
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(activeFilters).flatMap(([type, ids]) => 
                ids.map(id => {
                  const filter = filterOptions.find(f => f.id === id);
                  if (!filter) return null;
                  return (
                    <ChipBadge
                      key={filter.id}
                      text={filter.label}
                      variant={filter.color}
                      onClick={() => toggleFilter(filter)}
                      className="cursor-pointer pl-3 pr-7 relative"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </ChipBadge>
                  );
                })
              )}
            </div>
          </div>
        )}
        
        {/* Categories */}
        <div>
          <h3 className="font-medium mb-2">Categories</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map((filter) => (
              <ChipBadge
                key={filter.id}
                text={filter.label}
                variant={filter.color}
                onClick={() => toggleFilter(filter)}
                className={`cursor-pointer ${
                  activeFilters.category.includes(filter.id)
                    ? 'ring-2 ring-primary/70'
                    : ''
                }`}
              />
            ))}
          </div>
        </div>
        
        {/* Materials */}
        <div>
          <h3 className="font-medium mb-2">Materials</h3>
          <div className="flex flex-wrap gap-2">
            {materials.map((filter) => (
              <ChipBadge
                key={filter.id}
                text={filter.label}
                variant={filter.color}
                onClick={() => toggleFilter(filter)}
                className={`cursor-pointer ${
                  activeFilters.material.includes(filter.id)
                    ? 'ring-2 ring-primary/70'
                    : ''
                }`}
              />
            ))}
          </div>
        </div>
        
        {/* Target Words */}
        <div>
          <h3 className="font-medium mb-2">Target Words</h3>
          <div className="flex flex-wrap gap-2">
            {targetWords.map((filter) => (
              <ChipBadge
                key={filter.id}
                text={filter.label}
                variant={filter.color}
                onClick={() => toggleFilter(filter)}
                className={`cursor-pointer ${
                  activeFilters.targetWord.includes(filter.id)
                    ? 'ring-2 ring-primary/70'
                    : ''
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;
