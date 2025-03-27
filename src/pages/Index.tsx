
import Hero from '@/components/home/Hero';
import ActivityCarousel from '@/components/home/ActivityCarousel';
import FeatureSection from '@/components/home/FeatureSection';
import Navbar from '@/components/layout/Navbar';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <ActivityCarousel />
        <FeatureSection />
      </main>
    </div>
  );
};

export default Index;
