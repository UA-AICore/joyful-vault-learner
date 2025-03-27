
import { Link } from 'react-router-dom';
import ChipBadge from '@/components/ui/ChipBadge';
import { Activity } from '@/components/activities/ActivityCard';

interface HomeActivityCardProps {
  activity: Activity;
  isActive: boolean;
}

const HomeActivityCard: React.FC<HomeActivityCardProps> = ({ activity, isActive }) => {
  return (
    <div 
      className={`flex-shrink-0 w-full sm:w-[calc(50%-12px)] md:w-[calc(33.333%-16px)] transition-all duration-500 ${
        isActive 
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
  );
};

export default HomeActivityCard;
