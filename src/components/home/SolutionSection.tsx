
import React from 'react';
import ScrollReveal from '@/components/common/ScrollReveal';

const SolutionSection = () => {
  return (
    <section className="py-16 md:py-24 bg-slate-50">
      <div className="container-custom">
        <ScrollReveal direction="up">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gb-dark mb-6">
              Build What Actually Runs Your Business
            </h2>
            <p className="text-lg text-gb-dark/70 mb-6">
              AI has changed the economics of software.
            </p>
            <p className="text-lg text-gb-dark/70 mb-6">
              What used to require large teams and long timelines can now be built quickly, 
              affordably, and precisely — tailored to your workflows, your data, and your goals.
            </p>
            <p className="text-lg text-gb-dark/70 mb-8">
              Good Business designs and builds custom, AI-native software that replaces generic 
              tools and gives you control over the systems that matter most.
            </p>
            <div className="border-l-4 border-gb-green pl-6 py-2">
              <p className="text-xl text-gb-dark font-medium">
                This isn't anti-SaaS.<br />
                <span className="text-gb-green">It's post-SaaS.</span>
              </p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default SolutionSection;
