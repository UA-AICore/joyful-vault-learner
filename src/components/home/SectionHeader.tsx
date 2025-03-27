
import React from 'react';
import { ScaleIn, FadeIn } from '@/components/ui/animations';

interface SectionHeaderProps {
  title: React.ReactNode;
  description: React.ReactNode;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, description }) => {
  return (
    <div className="text-center mb-12">
      <ScaleIn>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          {title}
        </h2>
      </ScaleIn>
      <FadeIn delay={0.2}>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          {description}
        </p>
      </FadeIn>
    </div>
  );
};

export default SectionHeader;
