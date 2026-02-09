import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

const Hero = () => {
  const isMobile = useIsMobile();

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-[80vh] md:min-h-[92vh] flex items-center">
      {/* Content */}
      <div className="container-custom pt-28 md:pt-32 pb-12 md:pb-16 flex flex-col items-center md:items-end justify-center h-full relative z-10">
        <div className="text-center md:text-right md:max-w-4xl">
          <h1 className="text-[3.25rem] sm:text-[3.5rem] md:text-[6rem] lg:text-[8rem] font-extrabold text-white leading-[1.08] tracking-tight">
            Build What the Future<br />
            <span style={{ color: 'hsl(210, 55%, 55%)' }}>Will Use.</span>
          </h1>
          <p className="md:hidden mt-6 text-base text-white/60 max-w-xs mx-auto leading-relaxed font-light">
            We partner with founders to build real products designed to endure.
          </p>
          <p className="hidden md:block mt-8 text-lg text-white/75 max-w-xl md:ml-auto leading-relaxed font-light">
            Good Business works alongside founders to clarify ideas, pressure-test assumptions, and build real products designed to endure — not experiments that fade.
          </p>
        </div>

        {/* Buttons */}
        <div className="mt-10 md:mt-12 flex flex-col sm:flex-row gap-4 justify-center md:justify-end w-full sm:w-auto">
          <Button
            onClick={() => scrollTo('contact')}
            className="w-full sm:w-auto text-white font-semibold py-5 px-8 rounded-md text-lg flex items-center justify-center group"
            style={{ backgroundColor: 'hsl(210, 55%, 55%)' }}
          >
            Talk Through Your Idea
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
          {!isMobile && (
            <Button
              onClick={() => scrollTo('how-we-help')}
              variant="outline"
              className="border-white/20 bg-transparent text-white/80 hover:bg-white hover:text-gb-dark hover:border-white font-medium py-5 px-8 rounded-md text-lg"
            >
              How We Help
            </Button>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;
