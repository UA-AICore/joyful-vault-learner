
import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import { Activity } from '@/components/activities/ActivityCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FadeIn } from '@/components/ui/animations';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

// Mock activities data (same as in Activities.tsx)
const initialActivities: Activity[] = [
  {
    id: 1,
    title: "Word Association Game",
    description: "Help students connect related words through visual cues and interactive prompts.",
    targetWords: ["Connect", "Match", "Associate"],
    categories: ["Vocabulary", "Association"],
    materials: ["Visual Cards"],
    color: "blue",
    status: "active",
    imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
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
    imageUrl: "https://images.unsplash.com/photo-1555431189-0fabf2667795?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  },
  // ... more activities
];

// Available categories and materials for new activities
const availableCategories = ["Vocabulary", "Grammar", "Phonics", "Comprehension", "Association", "Syntax", "Rhyming", "Sequencing", "Synonyms"];
const availableMaterials = ["Visual Cards", "Word Cards", "Audio Clips", "Picture Cards", "Story Cards"];
const availableColors: Activity['color'][] = ["blue", "orange", "green", "purple", "yellow"];

const ManageActivities = () => {
  const [activities, setActivities] = useState<Activity[]>(initialActivities);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentActivity, setCurrentActivity] = useState<Activity | null>(null);
  const { toast } = useToast();
  
  // Form state for new/edit activity
  const [formData, setFormData] = useState<Partial<Activity>>({
    title: '',
    description: '',
    targetWords: [],
    categories: [],
    materials: [],
    color: 'blue',
    status: 'draft',
    imageUrl: '',
    videoUrl: '',
  });
  
  // Handle input changes for text fields
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  // Handle multi-select inputs (categories, materials, target words)
  const handleMultiSelectChange = (e: React.ChangeEvent<HTMLSelectElement>, field: 'categories' | 'materials' | 'targetWords') => {
    const options = Array.from(e.target.selectedOptions).map(option => option.value);
    setFormData({
      ...formData,
      [field]: options,
    });
  };

  // Add a new target word to the form
  const addTargetWord = () => {
    const newWord = prompt('Enter a new target word:');
    if (newWord && newWord.trim() !== '') {
      setFormData({
        ...formData,
        targetWords: [...(formData.targetWords || []), newWord.trim()],
      });
    }
  };
  
  // Remove a target word from the form
  const removeTargetWord = (word: string) => {
    setFormData({
      ...formData,
      targetWords: (formData.targetWords || []).filter(w => w !== word),
    });
  };
  
  // Handle toggling activity status
  const toggleActivityStatus = (id: number) => {
    setActivities(prev => 
      prev.map(activity => 
        activity.id === id 
          ? { ...activity, status: activity.status === 'active' ? 'draft' : 'active' } 
          : activity
      )
    );
    
    toast({
      title: "Status Updated",
      description: "Activity status has been updated successfully.",
    });
  };
  
  // Handle opening the edit dialog
  const handleEditClick = (activity: Activity) => {
    setCurrentActivity(activity);
    setFormData(activity);
    setIsEditDialogOpen(true);
  };
  
  // Handle deleting an activity
  const handleDeleteActivity = (id: number) => {
    if (confirm('Are you sure you want to delete this activity? This action cannot be undone.')) {
      setActivities(prev => prev.filter(activity => activity.id !== id));
      toast({
        title: "Activity Deleted",
        description: "The activity has been permanently removed.",
      });
    }
  };
  
  // Handle form submission for adding/editing an activity
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || formData.targetWords?.length === 0 || formData.categories?.length === 0) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    if (currentActivity) {
      // Editing existing activity
      setActivities(prev => 
        prev.map(activity => 
          activity.id === currentActivity.id 
            ? { ...activity, ...formData as Activity } 
            : activity
        )
      );
      
      toast({
        title: "Activity Updated",
        description: "The activity has been updated successfully.",
      });
      
      setIsEditDialogOpen(false);
    } else {
      // Adding new activity
      const newActivity: Activity = {
        id: activities.length > 0 ? Math.max(...activities.map(a => a.id)) + 1 : 1,
        ...formData as Activity,
      };
      
      setActivities(prev => [...prev, newActivity]);
      
      toast({
        title: "Activity Created",
        description: "New activity has been created successfully.",
      });
      
      setIsAddDialogOpen(false);
    }
    
    // Reset form data
    setFormData({
      title: '',
      description: '',
      targetWords: [],
      categories: [],
      materials: [],
      color: 'blue',
      status: 'draft',
      imageUrl: '',
      videoUrl: '',
    });
    
    setCurrentActivity(null);
  };
  
  // Get active and draft activities
  const activeActivities = activities.filter(activity => activity.status === 'active');
  const draftActivities = activities.filter(activity => activity.status === 'draft');
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-32 pb-20">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <FadeIn>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Manage Activities</h1>
              <p className="text-muted-foreground mb-4 md:mb-0">
                Create, edit and manage learning activities for students.
              </p>
            </FadeIn>
            
            <FadeIn delay={0.2}>
              <Button 
                onClick={() => setIsAddDialogOpen(true)}
                className="bg-vault-blue hover:bg-vault-blue/90"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Create New Activity
              </Button>
            </FadeIn>
          </div>
          
          <Tabs defaultValue="active" className="mt-8">
            <TabsList className="mb-8 bg-muted">
              <TabsTrigger value="active" className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                Active Activities ({activeActivities.length})
              </TabsTrigger>
              <TabsTrigger value="draft" className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                </svg>
                Drafts ({draftActivities.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="active" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeActivities.map(activity => (
                  <ActivityManageCard 
                    key={activity.id} 
                    activity={activity} 
                    onEdit={() => handleEditClick(activity)}
                    onDelete={() => handleDeleteActivity(activity.id)}
                    onToggleStatus={() => toggleActivityStatus(activity.id)}
                  />
                ))}
                
                {activeActivities.length === 0 && (
                  <div className="col-span-full py-12 text-center">
                    <p className="text-muted-foreground">No active activities found.</p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="draft" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {draftActivities.map(activity => (
                  <ActivityManageCard 
                    key={activity.id} 
                    activity={activity} 
                    onEdit={() => handleEditClick(activity)}
                    onDelete={() => handleDeleteActivity(activity.id)}
                    onToggleStatus={() => toggleActivityStatus(activity.id)}
                  />
                ))}
                
                {draftActivities.length === 0 && (
                  <div className="col-span-full py-12 text-center">
                    <p className="text-muted-foreground">No draft activities found.</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      {/* Add Activity Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Activity</DialogTitle>
            <DialogDescription>
              Fill in the details to create a new learning activity.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6 mt-4">
            <ActivityForm 
              formData={formData} 
              handleInputChange={handleInputChange}
              handleMultiSelectChange={handleMultiSelectChange}
              addTargetWord={addTargetWord}
              removeTargetWord={removeTargetWord}
              availableCategories={availableCategories}
              availableMaterials={availableMaterials}
              availableColors={availableColors}
            />
            
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                Create Activity
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Edit Activity Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Activity</DialogTitle>
            <DialogDescription>
              Update the details of this learning activity.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6 mt-4">
            <ActivityForm 
              formData={formData} 
              handleInputChange={handleInputChange}
              handleMultiSelectChange={handleMultiSelectChange}
              addTargetWord={addTargetWord}
              removeTargetWord={removeTargetWord}
              availableCategories={availableCategories}
              availableMaterials={availableMaterials}
              availableColors={availableColors}
            />
            
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                Update Activity
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Activity Card for the management view
const ActivityManageCard = ({ 
  activity, 
  onEdit, 
  onDelete, 
  onToggleStatus 
}: { 
  activity: Activity; 
  onEdit: () => void; 
  onDelete: () => void; 
  onToggleStatus: () => void;
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-soft overflow-hidden border border-border h-full">
      <div className="relative aspect-video">
        <img 
          src={activity.imageUrl || `https://api.dicebear.com/7.x/shapes/svg?seed=${activity.id}`} 
          alt={activity.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3">
          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
            activity.status === 'active' ? 'bg-vault-light-green text-vault-green' : 'bg-vault-light-yellow text-vault-yellow'
          }`}>
            {activity.status}
          </span>
        </div>
      </div>
      
      <div className="p-5">
        <h3 className="text-xl font-semibold mb-2 line-clamp-1">{activity.title}</h3>
        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{activity.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {activity.categories.slice(0, 2).map((category, i) => (
            <span key={i} className="text-xs px-2 py-1 bg-muted rounded-full">
              {category}
            </span>
          ))}
          {activity.categories.length > 2 && (
            <span className="text-xs px-2 py-1 bg-muted rounded-full">
              +{activity.categories.length - 2}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2 pt-4 border-t border-border mt-auto">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 text-xs"
            onClick={onToggleStatus}
          >
            {activity.status === 'active' ? 'Set to Draft' : 'Publish'}
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="flex-1 text-xs"
            onClick={onEdit}
          >
            Edit
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="flex-1 text-xs text-red-500 hover:text-red-700"
            onClick={onDelete}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

// Form component for creating/editing activities
interface ActivityFormProps {
  formData: Partial<Activity>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleMultiSelectChange: (e: React.ChangeEvent<HTMLSelectElement>, field: 'categories' | 'materials' | 'targetWords') => void;
  addTargetWord: () => void;
  removeTargetWord: (word: string) => void;
  availableCategories: string[];
  availableMaterials: string[];
  availableColors: Activity['color'][];
}

const ActivityForm = ({
  formData,
  handleInputChange,
  handleMultiSelectChange,
  addTargetWord,
  removeTargetWord,
  availableCategories,
  availableMaterials,
  availableColors
}: ActivityFormProps) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium">
            Title *
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title || ''}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Activity Title"
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="color" className="text-sm font-medium">
            Color Theme
          </label>
          <select
            id="color"
            name="color"
            value={formData.color || 'blue'}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {availableColors.map(color => (
              <option key={color} value={color}>
                {color.charAt(0).toUpperCase() + color.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium">
          Description *
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description || ''}
          onChange={handleInputChange}
          required
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Description of the activity"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="categories" className="text-sm font-medium">
            Categories *
          </label>
          <select
            id="categories"
            name="categories"
            multiple
            value={formData.categories || []}
            onChange={(e) => handleMultiSelectChange(e, 'categories')}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
          >
            {availableCategories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <p className="text-xs text-muted-foreground">Hold Ctrl/Cmd to select multiple categories</p>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="materials" className="text-sm font-medium">
            Materials
          </label>
          <select
            id="materials"
            name="materials"
            multiple
            value={formData.materials || []}
            onChange={(e) => handleMultiSelectChange(e, 'materials')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
          >
            {availableMaterials.map(material => (
              <option key={material} value={material}>
                {material}
              </option>
            ))}
          </select>
          <p className="text-xs text-muted-foreground">Hold Ctrl/Cmd to select multiple materials</p>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">
            Target Words *
          </label>
          <Button type="button" variant="outline" size="sm" onClick={addTargetWord}>
            Add Word
          </Button>
        </div>
        
        {formData.targetWords && formData.targetWords.length > 0 ? (
          <div className="flex flex-wrap gap-2 p-3 border border-gray-300 rounded-md">
            {formData.targetWords.map((word, index) => (
              <div 
                key={index}
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-vault-light-${formData.color || 'blue'} text-vault-${formData.color || 'blue'}`}
              >
                {word}
                <button 
                  type="button"
                  onClick={() => removeTargetWord(word)}
                  className="text-vault-blue hover:text-red-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-3 border border-gray-300 rounded-md text-muted-foreground text-sm">
            No target words added yet. Click "Add Word" to add some.
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="imageUrl" className="text-sm font-medium">
            Image URL
          </label>
          <input
            id="imageUrl"
            name="imageUrl"
            type="url"
            value={formData.imageUrl || ''}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://example.com/image.jpg"
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="videoUrl" className="text-sm font-medium">
            Video URL (YouTube)
          </label>
          <input
            id="videoUrl"
            name="videoUrl"
            type="url"
            value={formData.videoUrl || ''}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://youtube.com/watch?v=..."
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="status" className="text-sm font-medium">
          Status
        </label>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="status"
              value="draft"
              checked={formData.status === 'draft'}
              onChange={handleInputChange}
              className="w-4 h-4"
            />
            <span>Draft</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="status"
              value="active"
              checked={formData.status === 'active'}
              onChange={handleInputChange}
              className="w-4 h-4"
            />
            <span>Active</span>
          </label>
        </div>
      </div>
    </>
  );
};

export default ManageActivities;
