
import { Link } from 'react-router-dom';
import ChipBadge from '@/components/ui/ChipBadge';

// Define the types
export interface Activity {
  id: number;
  title: string;
  description: string;
  targetWords: string[];
  categories: string[];
  materials: string[];
  color: 'blue' | 'orange' | 'green' | 'purple' | 'yellow';
  imageUrl?: string;
  videoUrl?: string;
  status?: 'active' | 'draft';
}

interface ActivityCardProps {
  activity: Activity;
  className?: string;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ activity, className }) => {
  // Default image if none is provided
  const defaultImage = `https://api.dicebear.com/7.x/shapes/svg?seed=${activity.id}&backgroundColor=b6e3f4`;
  
  return (
    <Link to={`/activities/${activity.id}`}>
      <div className={`h-full rounded-2xl bg-white p-6 shadow-soft card-hover overflow-hidden ${className}`}>
        {/* Image */}
        <div className="aspect-video rounded-lg overflow-hidden mb-4 bg-vault-light-blue">
          <img 
            src={activity.imageUrl || defaultImage} 
            alt={activity.title} 
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          />
        </div>
        
        {/* Category Badge */}
        <div className="mb-4 flex flex-wrap gap-2">
          {activity.categories.map((category, i) => (
            <ChipBadge key={i} text={category} variant={activity.color} />
          ))}
        </div>
        
        {/* Status Badge (if present) */}
        {activity.status && (
          <div className="absolute top-4 right-4">
            <ChipBadge 
              text={activity.status} 
              variant={activity.status === 'active' ? 'green' : 'yellow'}
            />
          </div>
        )}
        
        {/* Title and Description */}
        <h3 className="text-xl font-semibold mb-2">{activity.title}</h3>
        <p className="text-muted-foreground text-sm mb-3">{activity.description}</p>
        
        {/* Target Words */}
        <div className="flex flex-wrap gap-2 mb-4">
          {activity.targetWords.map((word, i) => (
            <span key={i} className={`target-word ${activity.color}`}>
              {word}
            </span>
          ))}
        </div>
        
        {/* Footer */}
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
  );
};

export default ActivityCard;
