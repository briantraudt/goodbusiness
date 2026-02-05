
import React from 'react';
import ScrollReveal from '@/components/common/ScrollReveal';

const ProblemSection = () => {
  const problems = [
    "Too many tools",
    "Per-seat pricing that scales faster than revenue",
    "Workflows split across apps, spreadsheets, and Slack",
    "Software that does most of what you need, but never quite fits"
  ];

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container-custom">
        <ScrollReveal direction="up">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              The SaaS Stack Is Breaking Down
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              Most teams didn't plan their software stack — it just accumulated.
            </p>
            <p className="text-lg text-muted-foreground mb-4">
              Now you're paying for:
            </p>
            <ul className="space-y-3 mb-8">
              {problems.map((problem, index) => (
                <ScrollReveal key={index} direction="left" delay={index * 100}>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-gb-orange rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span className="text-muted-foreground">{problem}</span>
                  </li>
                </ScrollReveal>
              ))}
            </ul>
            <p className="text-lg text-foreground font-medium">
              At some point, the question changes from "What tool should we buy?" to{' '}
              <span className="text-gb-green">"Why don't we own this?"</span>
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default ProblemSection;
