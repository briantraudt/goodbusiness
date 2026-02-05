import React from 'react';
import ScrollReveal from '@/components/common/ScrollReveal';

const SolutionSection = () => {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container-custom">
        <ScrollReveal direction="up">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gb-dark mb-6 leading-tight">
              Most companies don't need more software.
              <span className="text-gb-green"> They need better outcomes.</span>
            </h2>
            <p className="text-lg md:text-xl text-gb-dark/70 leading-relaxed">
              We start with the result you need to achieve, then determine the simplest strategy, systems, and technology required to make it real.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default SolutionSection;
