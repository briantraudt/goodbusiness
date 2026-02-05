import React from 'react';
import ScrollReveal from '@/components/common/ScrollReveal';

const Benefits = () => {
  return (
    <section className="bg-gb-dark py-16 md:py-24">
      <div className="container-custom">
        <ScrollReveal direction="up">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block text-gb-green font-semibold text-sm uppercase tracking-wider mb-4">
              What Sets Us Apart
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
              Why Good Business Is Different
            </h2>
            <p className="text-xl md:text-2xl text-white/90 font-medium mb-8">
              Most firms sell solutions. <span className="text-gb-green">We deliver results.</span>
            </p>
            <div className="space-y-4 text-lg text-white/70">
              <p>We don't start with a tech stack.</p>
              <p>We don't push pre-packaged platforms.</p>
              <p className="text-white font-medium">We measure success by what changes for your business.</p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default Benefits;
