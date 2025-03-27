
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import ActivityDetail from '@/components/activities/ActivityDetail';
import { Activity } from '@/components/activities/ActivityCard';
import { FadeIn } from '@/components/ui/animations';

// Sample data - in a real app, this would be fetched from an API
const sampleActivities: Activity[] = [
  {
    id: 1,
    title: "Word Association Game",
    description: "This activity helps students build semantic connections by associating related words. Through visual cues and interactive prompts, children learn to recognize relationships between concepts, strengthening their vocabulary and cognitive mapping skills. It's especially effective for children with learning disabilities as it provides multiple pathways to understanding word relationships.",
    targetWords: ["Connect", "Match", "Associate"],
    categories: ["Vocabulary", "Association"],
    materials: ["Visual Cards"],
    color: "blue",
    status: "active",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Example URL
  },
  {
    id: 2,
    title: "Sentence Building Blocks",
    description: "Students construct grammatically correct sentences by arranging word blocks in the proper sequence. This hands-on activity reinforces syntax rules while making the abstract concept of sentence structure concrete and visual. It's particularly beneficial for children with dyslexia or language processing difficulties.",
    targetWords: ["Arrange", "Build", "Structure"],
    categories: ["Grammar", "Syntax"],
    materials: ["Word Cards"],
    color: "orange",
    status: "active",
  },
  {
    id: 3,
    title: "Rhyme Time Challenge",
    description: "This multi-sensory activity helps children recognize rhyming patterns through both visual and auditory cues. By identifying words that share the same ending sounds, students develop phonological awareness, a critical skill for reading development. The game format makes learning engaging while building essential pre-reading skills.",
    targetWords: ["Rhyme", "Sound", "Pattern"],
    categories: ["Phonics", "Rhyming"],
    materials: ["Audio Clips"],
    color: "green",
    status: "active",
  },
  {
    id: 4,
    title: "Synonym Explorer",
    description: "Students discover the richness of language by exploring words with similar meanings. This activity expands vocabulary depth and provides children with alternatives for expressing themselves. The visual mapping component helps students with language processing challenges to visualize relationships between similar concepts.",
    targetWords: ["Similar", "Meaning", "Alternative"],
    categories: ["Vocabulary", "Synonyms"],
    materials: ["Picture Cards"],
    color: "purple",
    status: "draft",
  },
  {
    id: 5,
    title: "Story Sequence Cards",
    description: "Children arrange picture cards to create a logical narrative sequence, developing comprehension and temporal organization skills. This activity helps students understand story structure, cause and effect relationships, and the flow of events—all crucial for reading comprehension and written expression.",
    targetWords: ["Order", "Sequence", "Arrange"],
    categories: ["Comprehension", "Sequencing"],
    materials: ["Story Cards"],
    color: "yellow",
    status: "active",
  },
];

const ActivityView = () => {
  const { id } = useParams<{ id: string }>();
  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Simulate API fetch
    const fetchActivity = () => {
      setLoading(true);
      try {
        const foundActivity = sampleActivities.find(
          (a) => a.id === parseInt(id || "0")
        );
        
        if (foundActivity) {
          setActivity(foundActivity);
          setError(false);
        } else {
          setError(true);
        }
      } catch (err) {
        setError(true);
        console.error("Error fetching activity:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, [id]);

  // Get next and previous activities
  const currentIndex = sampleActivities.findIndex((a) => a.id === parseInt(id || "0"));
  const prevActivity = currentIndex > 0 ? sampleActivities[currentIndex - 1] : null;
  const nextActivity = currentIndex < sampleActivities.length - 1 ? sampleActivities[currentIndex + 1] : null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-32 pb-20">
        <div className="container px-4 mx-auto">
          <FadeIn>
            <div className="flex items-center mb-8">
              <Link 
                to="/activities" 
                className="text-muted-foreground hover:text-foreground flex items-center gap-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
                Back to Activities
              </Link>
            </div>
          </FadeIn>
          
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-pulse-gentle">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-12 h-12 text-primary mx-auto mb-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                  />
                </svg>
                <p className="text-lg font-medium">Loading activity...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-16 text-center">
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-16 h-16 mx-auto text-destructive mb-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                  />
                </svg>
                <h2 className="text-2xl font-bold mb-2">Activity Not Found</h2>
                <p className="text-muted-foreground mb-6">
                  We couldn't find the activity you're looking for.
                </p>
                <Link to="/activities" className="btn-primary">
                  Browse All Activities
                </Link>
              </div>
            </div>
          ) : activity ? (
            <div className="max-w-4xl mx-auto">
              <ActivityDetail activity={activity} />
              
              {/* Navigation Between Activities */}
              <div className="mt-12 flex justify-between items-center">
                <div>
                  {prevActivity && (
                    <Link
                      to={`/activities/${prevActivity.id}`}
                      className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75" />
                      </svg>
                      <span>Previous: {prevActivity.title}</span>
                    </Link>
                  )}
                </div>
                
                <div>
                  {nextActivity && (
                    <Link
                      to={`/activities/${nextActivity.id}`}
                      className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <span>Next: {nextActivity.title}</span>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
                      </svg>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
};

export default ActivityView;
