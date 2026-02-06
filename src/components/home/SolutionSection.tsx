import React from 'react';
import ScrollReveal from '@/components/common/ScrollReveal';

const SolutionSection = () => {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container-custom">
        <ScrollReveal direction="up">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gb-dark mb-6 leading-tight">
              Most founders don't fail because they can't build.
              <span className="text-gb-blue"> They build the wrong thing for too long.</span>
            </h2>
            <p className="text-lg md:text-xl text-gb-dark/70 leading-relaxed">
              We help you cut through the noise so you don't have to figure it out alone.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default SolutionSection;
