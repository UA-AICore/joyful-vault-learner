
import { useState } from 'react';
import ChipBadge from '@/components/ui/ChipBadge';
import { Activity } from '@/components/activities/ActivityCard';
import { FadeIn, ScaleIn } from '@/components/ui/animations';

interface ActivityDetailProps {
  activity: Activity;
}

interface TargetWordMapping {
  word: string;
  sentence: string;
}

// For demo purposes, we'll add example sentences
const exampleMappings: TargetWordMapping[] = [
  { word: "Connect", sentence: "Students will connect the dots to form a picture." },
  { word: "Match", sentence: "Match the word with its corresponding image." },
  { word: "Associate", sentence: "Associate the animal with its habitat." },
  { word: "Arrange", sentence: "Arrange the story cards in chronological order." },
  { word: "Build", sentence: "Build complete sentences using word blocks." },
  { word: "Structure", sentence: "Understand the structure of a paragraph." },
  { word: "Rhyme", sentence: "Find words that rhyme with 'cat'." },
  { word: "Sound", sentence: "Identify the beginning sound in each word." },
  { word: "Pattern", sentence: "Recognize patterns in word families." },
  { word: "Similar", sentence: "Find words with similar meanings." },
  { word: "Meaning", sentence: "Discuss the meaning of new vocabulary." },
  { word: "Alternative", sentence: "Suggest alternative words for 'big'." },
  { word: "Order", sentence: "Put the events in the correct order." },
  { word: "Sequence", sentence: "Sequence the steps in a process." },
];

const ActivityDetail: React.FC<ActivityDetailProps> = ({ activity }) => {
  // Find matching sentences for the activity's target words
  const wordMappings = activity.targetWords.map(word => {
    const mapping = exampleMappings.find(m => m.word === word);
    return mapping || { word, sentence: `Example sentence for "${word}".` };
  });

  const [selectedWord, setSelectedWord] = useState<string | null>(wordMappings[0]?.word || null);
  
  const selectedMapping = wordMappings.find(m => m.word === selectedWord);
  
  return (
    <div className="bg-white rounded-2xl shadow-medium p-6 md:p-8">
      <FadeIn>
        <div className="flex flex-wrap gap-2 mb-6">
          {activity.categories.map((category, i) => (
            <ChipBadge key={i} text={category} variant={activity.color} />
          ))}
          
          {activity.status && (
            <ChipBadge 
              text={activity.status} 
              variant={activity.status === 'active' ? 'green' : 'yellow'}
              className="ml-auto"
            />
          )}
        </div>
      </FadeIn>
      
      <ScaleIn delay={0.1}>
        <h1 className="text-2xl md:text-3xl font-bold mb-4">{activity.title}</h1>
      </ScaleIn>
      
      <FadeIn delay={0.2}>
        <div className="mb-8">
          <p className="text-lg text-muted-foreground">{activity.description}</p>
        </div>
      </FadeIn>
      
      <div className="mb-8">
        <FadeIn delay={0.3}>
          <h3 className="text-lg font-semibold mb-3">Target Words</h3>
        </FadeIn>
        
        <div className="flex flex-wrap gap-3 mb-6">
          {wordMappings.map((mapping, i) => (
            <button
              key={i}
              className={`target-word ${activity.color} ${
                selectedWord === mapping.word
                  ? `bg-vault-${activity.color} text-white shadow-${activity.color}-glow` 
                  : ''
              }`}
              onClick={() => setSelectedWord(mapping.word)}
            >
              {mapping.word}
            </button>
          ))}
        </div>
        
        <FadeIn delay={0.4} className="bg-vault-light-blue/30 rounded-xl p-4 md:p-6">
          <h4 className="font-medium mb-2">Example Sentence:</h4>
          <p className="text-lg">
            {selectedMapping ? selectedMapping.sentence : "Select a target word to see its example sentence."}
          </p>
        </FadeIn>
      </div>
      
      {/* Video Section */}
      {activity.videoUrl && (
        <div className="mb-8">
          <FadeIn delay={0.5}>
            <h3 className="text-lg font-semibold mb-3">Instructional Video</h3>
          </FadeIn>
          
          <div className="aspect-video bg-vault-light-purple rounded-xl overflow-hidden">
            <iframe
              src={activity.videoUrl}
              title={`Video for ${activity.title}`}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
      
      {/* Materials Section */}
      <div className="mb-4">
        <FadeIn delay={0.6}>
          <h3 className="text-lg font-semibold mb-3">Materials Needed</h3>
        </FadeIn>
        
        <div className="flex flex-wrap gap-2">
          {activity.materials.map((material, i) => (
            <ChipBadge key={i} text={material} variant="orange" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActivityDetail;
