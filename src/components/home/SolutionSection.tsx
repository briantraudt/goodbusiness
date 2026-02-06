import React from 'react';
import ScrollReveal from '@/components/common/ScrollReveal';

const SolutionSection = () => {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container-custom">
        <ScrollReveal direction="up">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gb-dark mb-6 leading-tight">
              AI is changing everything.
              <span className="text-gb-green"> Most businesses aren't ready.</span>
            </h2>
            <p className="text-lg md:text-xl text-gb-dark/70 leading-relaxed">
              The companies that win won't be the ones with the most tools — they'll be the ones that use AI strategically. 
              We help you cut through the noise, find the highest-impact opportunities, and build AI into the way your business actually operates.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default SolutionSection;
