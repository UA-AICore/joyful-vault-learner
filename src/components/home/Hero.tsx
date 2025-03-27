
import { FadeIn, SlideUp, SlideDown } from '@/components/ui/animations';

const Hero = () => {
  return (
    <section className="min-h-screen pt-32 pb-20 flex items-center">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
          <div className="space-y-8">
            <SlideDown delay={0.1}>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="text-vault-blue">Engaging</span> Learning for <span className="text-vault-orange">Special Needs</span>
              </h1>
            </SlideDown>
            
            <FadeIn delay={0.4}>
              <p className="text-lg text-muted-foreground">
                Create interactive learning activities tailored to children with learning disabilities. 
                Vault Learning combines multisensory engagement with evidence-based methods.
              </p>
            </FadeIn>
            
            <FadeIn delay={0.6}>
              <div className="flex flex-wrap gap-4">
                <button className="btn-primary">
                  Explore Activities
                </button>
                <button className="btn-secondary">
                  Learn More
                </button>
              </div>
            </FadeIn>
            
            <FadeIn delay={0.8}>
              <div className="flex items-center space-x-6">
                <div className="flex -space-x-2">
                  {[1,2,3,4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-vault-light-blue border-2 border-white" />
                  ))}
                </div>
                <p className="text-sm">
                  <span className="font-bold">500+</span> educators trust Vault Learning
                </p>
              </div>
            </FadeIn>
          </div>
          
          <div className="relative rounded-2xl overflow-hidden shadow-medium">
            <SlideUp delay={0.5}>
              <div className="relative aspect-[4/3] bg-vault-light-purple rounded-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-vault-purple/20 to-transparent" />
                
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-4/5 h-4/5 bg-white rounded-xl shadow-soft p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="w-1/3 h-6 bg-vault-light-blue rounded-md" />
                        <div className="w-1/4 h-6 bg-vault-light-orange rounded-md" />
                      </div>
                      
                      <div className="w-full h-40 bg-vault-light-green rounded-lg" />
                      
                      <div className="flex space-x-2">
                        <div className="w-20 h-8 bg-vault-light-blue rounded-full" />
                        <div className="w-20 h-8 bg-vault-light-yellow rounded-full" />
                        <div className="w-20 h-8 bg-vault-light-purple rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="absolute top-[-20px] right-[-20px] w-40 h-40 bg-vault-light-orange rounded-full opacity-60" />
                <div className="absolute bottom-[-30px] left-[-30px] w-60 h-60 bg-vault-light-green rounded-full opacity-60" />
              </div>
            </SlideUp>
            
            {/* Floating elements */}
            <div className="absolute top-10 right-10 p-3 glass rounded-xl shadow-soft animate-float">
              <div className="w-10 h-10 bg-vault-blue rounded-lg" />
            </div>
            
            <div className="absolute bottom-10 left-10 p-3 glass rounded-xl shadow-soft animate-float" style={{ animationDelay: '1s' }}>
              <div className="w-10 h-10 bg-vault-orange rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
